import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nome, categoria, valor, moeda, cotacao, observacao, data } = body;

    const existing = await prisma.custo.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Custo não encontrado' }, { status: 404 });
    }

    const numericValor = parseFloat(valor) || 0;
    const numericCotacao = cotacao ? parseFloat(cotacao) : null;

    let valorConvertido = numericValor;
    if (moeda === 'USD' && numericCotacao) {
      valorConvertido = numericValor * numericCotacao;
    }

    const updated = await prisma.custo.update({
      where: { id },
      data: {
        nome,
        categoria,
        valor: numericValor,
        moeda: moeda || 'BRL',
        cotacao: numericCotacao,
        valorConvertido,
        observacao: observacao || null,
        data: data ? new Date(data) : existing.data,
      },
    });

    await prisma.historico.create({
      data: {
        tabela: 'custos',
        registroId: id,
        campo: 'Edição',
        valorAnterior: `Valor anterior: ${existing.nome} (R$ ${existing.valorConvertido.toFixed(2)})`,
        novoValor: `Novo valor: ${updated.nome} (R$ ${updated.valorConvertido.toFixed(2)})`,
        usuario: 'Usuário',
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating custo:', error);
    return NextResponse.json({ error: 'Erro ao atualizar custo' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.custo.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Custo não encontrado' }, { status: 404 });
    }

    await prisma.custo.delete({ where: { id } });

    await prisma.historico.create({
      data: {
        tabela: 'custos',
        registroId: id,
        campo: 'Exclusão',
        valorAnterior: `${existing.nome} (R$ ${existing.valorConvertido.toFixed(2)})`,
        novoValor: 'Excluído',
        usuario: 'Usuário',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting custo:', error);
    return NextResponse.json({ error: 'Erro ao excluir custo' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.custo.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Custo não encontrado' }, { status: 404 });
    }

    const duplicated = await prisma.custo.create({
      data: {
        nome: `${existing.nome} (Cópia)`,
        categoria: existing.categoria,
        valor: existing.valor,
        moeda: existing.moeda,
        cotacao: existing.cotacao,
        valorConvertido: existing.valorConvertido,
        observacao: existing.observacao,
        data: new Date(),
      },
    });

    await prisma.historico.create({
      data: {
        tabela: 'custos',
        registroId: duplicated.id,
        campo: 'Duplicação',
        valorAnterior: `Original: ${existing.id}`,
        novoValor: `Duplicado: ${duplicated.nome}`,
        usuario: 'Usuário',
      },
    });

    return NextResponse.json(duplicated, { status: 201 });
  } catch (error) {
    console.error('Error duplicating custo:', error);
    return NextResponse.json({ error: 'Erro ao duplicar custo' }, { status: 500 });
  }
}
