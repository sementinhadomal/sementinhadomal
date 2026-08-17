import { NextResponse } from 'next/server';
import { store, uuid, addHistorico } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nome, categoria, valor, moeda, cotacao, observacao, data, projetoId } = body;

    const idx = store.custos.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Custo não encontrado' }, { status: 404 });

    const existing = store.custos[idx];
    const numericValor = parseFloat(valor) || 0;
    const numericCotacao = cotacao ? parseFloat(cotacao) : null;
    let valorConvertido = numericValor;
    if (moeda === 'USD' && numericCotacao) valorConvertido = numericValor * numericCotacao;

    const updated = {
      ...existing,
      projetoId: projetoId || existing.projetoId,
      nome, categoria,
      valor: numericValor,
      moeda: moeda || 'BRL',
      cotacao: numericCotacao,
      valorConvertido,
      observacao: observacao || null,
      data: data ? new Date(data).toISOString() : existing.data,
      updatedAt: new Date().toISOString(),
    };

    store.custos[idx] = updated;
    addHistorico('custos', id, 'Edição', `${existing.nome} (R$ ${existing.valorConvertido.toFixed(2)})`, `${updated.nome} (R$ ${updated.valorConvertido.toFixed(2)})`, updated.projetoId);

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar custo' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idx = store.custos.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Custo não encontrado' }, { status: 404 });

    const existing = store.custos[idx];
    store.custos.splice(idx, 1);
    addHistorico('custos', id, 'Exclusão', `${existing.nome} (R$ ${existing.valorConvertido.toFixed(2)})`, 'Excluído', existing.projetoId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir custo' }, { status: 500 });
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = store.custos.find((c) => c.id === id);
    if (!existing) return NextResponse.json({ error: 'Custo não encontrado' }, { status: 404 });

    const now = new Date().toISOString();
    const duplicated = { ...existing, id: uuid(), nome: `${existing.nome} (Cópia)`, data: now, createdAt: now, updatedAt: now };
    store.custos.push(duplicated);
    addHistorico('custos', duplicated.id, 'Duplicação', `Original: ${existing.id}`, `Duplicado: ${duplicated.nome}`, duplicated.projetoId);

    return NextResponse.json(duplicated, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao duplicar custo' }, { status: 500 });
  }
}
