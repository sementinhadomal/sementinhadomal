import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterPeriod = searchParams.get('period') || 'all';

    let dateWhere: any = {};
    const now = new Date();

    if (filterPeriod === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateWhere = { gte: startOfDay };
    } else if (filterPeriod === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      dateWhere = { gte: startOfWeek };
    } else if (filterPeriod === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateWhere = { gte: startOfMonth };
    } else if (filterPeriod === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateWhere = { gte: startOfYear };
    }

    const where = Object.keys(dateWhere).length > 0 ? { data: dateWhere } : {};

    const receitas = await prisma.receita.findMany({ where });
    const custos = await prisma.custo.findMany({ where });

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

    // Dados atuais como ponto de partida
    const currentMonthLabel = monthNames[now.getMonth()];
    monthlyDataMap[currentMonthLabel] = {
      faturamento: totalFaturamento,
      custos: totalCustos,
      lucro: lucroLiquido,
    };

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
