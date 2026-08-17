import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterPeriod = searchParams.get('period') || 'all';

    const now = new Date();
    let fromDate: Date | null = null;

    if (filterPeriod === 'today') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (filterPeriod === 'week') {
      fromDate = new Date(now);
      fromDate.setDate(now.getDate() - now.getDay());
      fromDate.setHours(0, 0, 0, 0);
    } else if (filterPeriod === 'month') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (filterPeriod === 'year') {
      fromDate = new Date(now.getFullYear(), 0, 1);
    }

    let receitas = [...store.receitas];
    let custos = [...store.custos];

    if (fromDate) {
      receitas = receitas.filter((r) => new Date(r.data) >= fromDate!);
      custos = custos.filter((c) => new Date(c.data) >= fromDate!);
    }

    const totalFaturamento = receitas.reduce((acc, r) => acc + r.valorConvertido, 0);
    const totalCustos = custos.reduce((acc, c) => acc + c.valorConvertido, 0);
    const lucroLiquido = totalFaturamento - totalCustos;
    const margemPorcentagem = totalFaturamento > 0 ? (lucroLiquido / totalFaturamento) * 100 : 0;

    // Categorias Faturamento
    const catFaturamentoMap: Record<string, number> = {};
    receitas.forEach((r) => {
      catFaturamentoMap[r.categoria] = (catFaturamentoMap[r.categoria] || 0) + r.valorConvertido;
    });
    const pieReceitas = Object.entries(catFaturamentoMap).map(([name, value]) => ({ name, value }));

    // Categorias Custos
    const catCustosMap: Record<string, number> = {};
    custos.forEach((c) => {
      catCustosMap[c.categoria] = (catCustosMap[c.categoria] || 0) + c.valorConvertido;
    });
    const pieCustos = Object.entries(catCustosMap).map(([name, value]) => ({ name, value }));

    // Mensal (últimos 6 meses)
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthlyDataMap: Record<string, { faturamento: number; custos: number; lucro: number }> = {};

    const allReceitas = [...store.receitas];
    const allCustos = [...store.custos];

    // Últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = monthNames[d.getMonth()];
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const monthReceitas = allReceitas.filter((r) => {
        const rd = new Date(r.data);
        return rd >= monthStart && rd <= monthEnd;
      });
      const monthCustos = allCustos.filter((c) => {
        const cd = new Date(c.data);
        return cd >= monthStart && cd <= monthEnd;
      });

      const fat = monthReceitas.reduce((a, r) => a + r.valorConvertido, 0);
      const cst = monthCustos.reduce((a, c) => a + c.valorConvertido, 0);

      monthlyDataMap[label] = { faturamento: fat, custos: cst, lucro: fat - cst };
    }

    const monthlyBreakdown = Object.entries(monthlyDataMap).map(([mes, vals]) => ({
      mes,
      ...vals,
    }));

    return NextResponse.json({
      cards: {
        totalFaturamento,
        totalCustos,
        lucroLiquido,
        margemPorcentagem,
        totalReceitasCount: receitas.length,
        totalCustosCount: custos.length,
      },
      pieReceitas,
      pieCustos,
      monthlyBreakdown,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Erro ao carregar dados do dashboard' }, { status: 500 });
  }
}
