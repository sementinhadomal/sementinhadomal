import { NextResponse } from 'next/server';
import { store, calcularTotais } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projeto = store.projetos.find((p) => p.id === id);
    if (!projeto) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 });
    }
    const receitas = store.receitas.filter((r) => r.projetoId === id);
    const custos = store.custos.filter((c) => c.projetoId === id);
    return NextResponse.json({ ...projeto, ...calcularTotais(receitas, custos) });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar projeto' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nome, descricao, cor } = body;

    const idx = store.projetos.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 });
    }

    if (!nome || nome.trim() === '') {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    store.projetos[idx] = {
      ...store.projetos[idx],
      nome: nome.trim(),
      descricao: descricao?.trim() ?? store.projetos[idx].descricao,
      cor: cor ?? store.projetos[idx].cor,
    };

    return NextResponse.json(store.projetos[idx]);
  } catch (error) {
    console.error('Error updating projeto:', error);
    return NextResponse.json({ error: 'Erro ao atualizar projeto' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Não permite excluir se for o único projeto
    if (store.projetos.length <= 1) {
      return NextResponse.json(
        { error: 'Não é possível excluir o único projeto existente' },
        { status: 400 }
      );
    }

    const idx = store.projetos.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 });
    }

    // Remove o projeto e todos os dados vinculados
    store.projetos.splice(idx, 1);
    store.receitas = store.receitas.filter((r) => r.projetoId !== id);
    store.custos = store.custos.filter((c) => c.projetoId !== id);
    store.historico = store.historico.filter((h) => h.projetoId !== id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting projeto:', error);
    return NextResponse.json({ error: 'Erro ao excluir projeto' }, { status: 500 });
  }
}
