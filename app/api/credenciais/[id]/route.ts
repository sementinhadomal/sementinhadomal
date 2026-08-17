import { NextResponse } from 'next/server';
import { store, addHistorico } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { servico, login, senha, url, observacao, projetoId } = body;

    if (!store.credenciais) store.credenciais = [];
    const idx = store.credenciais.findIndex((c) => c.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Credencial não encontrada' }, { status: 404 });
    }

    const existing = store.credenciais[idx];
    const updated = {
      ...existing,
      projetoId: projetoId || existing.projetoId,
      servico: servico ? servico.trim() : existing.servico,
      login: login ? login.trim() : existing.login,
      senha: senha ? senha.trim() : existing.senha,
      url: url !== undefined ? (url ? url.trim() : null) : existing.url,
      observacao: observacao !== undefined ? (observacao ? observacao.trim() : null) : existing.observacao,
      updatedAt: new Date().toISOString(),
    };

    store.credenciais[idx] = updated;
    addHistorico('credenciais', id, 'Edição', existing.servico, updated.servico, updated.projetoId);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating credencial:', error);
    return NextResponse.json({ error: 'Erro ao atualizar credencial' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!store.credenciais) store.credenciais = [];
    const idx = store.credenciais.findIndex((c) => c.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Credencial não encontrada' }, { status: 404 });
    }

    const existing = store.credenciais[idx];
    store.credenciais.splice(idx, 1);
    addHistorico('credenciais', id, 'Exclusão', existing.servico, 'Excluído', existing.projetoId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting credencial:', error);
    return NextResponse.json({ error: 'Erro ao excluir credencial' }, { status: 500 });
  }
}
