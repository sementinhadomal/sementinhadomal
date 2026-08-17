import { NextResponse } from 'next/server';
import { store, calcularTotais } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterPeriod = searchParams.get('period') || 'all';
    const projetoId = searchParams.get('projetoId') || 'all';

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

    // Filtra por projeto
    let receitas = projetoId === 'all'
      ? [...store.receitas]
      : store.receitas.filter((r) => r.projetoId === projetoId);

    let custos = projetoId === 'all'
      ? [...store.custos]
      : store.custos.filter((c) => c.projetoId === projetoId);

    // Filtra por período
    if (fromDate) {
      receitas = receitas.filter((r) => new Date(r.data) >= fromDate!);
      custos = custos.filter((c) => new Date(c.data) >= fromDate!);
    }

    const totais = calcularTotais(receitas, custos);

    // Pie charts
    const catFaturamentoMap: Record<string, number> = {};
    receitas.forEach((r) => {
      catFaturamentoMap[r.categoria] = (catFaturamentoMap[r.categoria] || 0) + r.valorConvertido;
    });
    const pieReceitas = Object.entries(catFaturamentoMap).map(([name, value]) => ({ name, value }));

    const catCustosMap: Record<string, number> = {};
    custos.forEach((c) => {
      catCustosMap[c.categoria] = (catCustosMap[c.categoria] || 0) + c.valorConvertido;
    });
    const pieCustos = Object.entries(catCustosMap).map(([name, value]) => ({ name, value }));

    // Gráfico mensal — últimos 6 meses
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const allReceitas = projetoId === 'all' ? [...store.receitas] : store.receitas.filter((r) => r.projetoId === projetoId);
    const allCustos = projetoId === 'all' ? [...store.custos] : store.custos.filter((c) => c.projetoId === projetoId);

    const monthlyBreakdown = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = monthNames[d.getMonth()];
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const mReceitas = allReceitas.filter((r) => { const rd = new Date(r.data); return rd >= monthStart && rd <= monthEnd; });
      const mCustos = allCustos.filter((c) => { const cd = new Date(c.data); return cd >= monthStart && cd <= monthEnd; });

      const fat = mReceitas.reduce((a, r) => a + r.valorConvertido, 0);
      const cst = mCustos.reduce((a, c) => a + c.valorConvertido, 0);
      monthlyBreakdown.push({ mes: label, faturamento: fat, custos: cst, lucro: fat - cst });
    }

    // Resumo por projeto (para visão "Todos")
    const resumoPorProjeto = projetoId === 'all'
      ? store.projetos.map((p) => {
          const pReceitas = store.receitas.filter((r) => r.projetoId === p.id);
          const pCustos = store.custos.filter((c) => c.projetoId === p.id);
          return {
            id: p.id,
            nome: p.nome,
            cor: p.cor,
            ...calcularTotais(pReceitas, pCustos),
            totalReceitasCount: pReceitas.length,
            totalCustosCount: pCustos.length,
          };
        })
      : null;

    return NextResponse.json({
      cards: {
        ...totais,
        totalReceitasCount: receitas.length,
        totalCustosCount: custos.length,
      },
      pieReceitas,
      pieCustos,
      monthlyBreakdown,
      resumoPorProjeto,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Erro ao carregar dados do dashboard' }, { status: 500 });
  }
}
