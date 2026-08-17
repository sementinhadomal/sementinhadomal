import { NextResponse } from 'next/server';
import { store, uuid, calcularTotais } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Retorna projetos com totais calculados
    const projetos = store.projetos.map((projeto) => {
      const receitas = store.receitas.filter((r) => r.projetoId === projeto.id);
      const custos = store.custos.filter((c) => c.projetoId === projeto.id);
      const totais = calcularTotais(receitas, custos);
      return {
        ...projeto,
        totalFaturamento: totais.totalFaturamento,
        totalCustos: totais.totalCustos,
        lucroLiquido: totais.lucroLiquido,
        margemPorcentagem: totais.margemPorcentagem,
        totalReceitas: receitas.length,
        totalCustos2: custos.length,
      };
    });

    return NextResponse.json(projetos);
  } catch (error) {
    console.error('Error fetching projetos:', error);
    return NextResponse.json({ error: 'Erro ao buscar projetos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, descricao, cor } = body;

    if (!nome || nome.trim() === '') {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const CORES = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
    const corPadrao = cor || CORES[store.projetos.length % CORES.length];

    const novoProjeto = {
      id: uuid(),
      nome: nome.trim(),
      descricao: descricao?.trim() || '',
      cor: corPadrao,
      createdAt: new Date().toISOString(),
    };

    store.projetos.push(novoProjeto);

    return NextResponse.json(novoProjeto, { status: 201 });
  } catch (error) {
    console.error('Error creating projeto:', error);
    return NextResponse.json({ error: 'Erro ao criar projeto' }, { status: 500 });
  }
}
