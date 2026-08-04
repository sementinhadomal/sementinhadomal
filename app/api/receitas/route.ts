import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') || '';
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

    const where: any = {};
    if (search) {
      where.OR = [
        { nome: { contains: search } },
        { observacao: { contains: search } },
        { categoria: { contains: search } },
      ];
    }
    if (categoria) {
      where.categoria = categoria;
    }
    if (Object.keys(dateWhere).length > 0) {
      where.data = dateWhere;
    }

    const receitas = await prisma.receita.findMany({
      where,
      orderBy: { data: 'desc' },
    });

    return NextResponse.json(receitas);
  } catch (error) {
    console.error('Error fetching receitas:', error);
    return NextResponse.json({ error: 'Erro ao buscar receitas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, categoria, valor, moeda, cotacao, observacao, data } = body;

    const numericValor = parseFloat(valor) || 0;
    const numericCotacao = cotacao ? parseFloat(cotacao) : null;

    let valorConvertido = numericValor;
    if (moeda === 'USD' && numericCotacao) {
      valorConvertido = numericValor * numericCotacao;
    }

    const newReceita = await prisma.receita.create({
      data: {
        nome,
        categoria,
        valor: numericValor,
        moeda: moeda || 'BRL',
        cotacao: numericCotacao,
        valorConvertido,
        observacao: observacao || null,
        data: data ? new Date(data) : new Date(),
      },
    });

    // Registra histórico
    await prisma.historico.create({
      data: {
        tabela: 'receitas',
        registroId: newReceita.id,
        campo: 'Criação',
        valorAnterior: null,
        novoValor: `Criado: ${newReceita.nome} - R$ ${newReceita.valorConvertido.toFixed(2)}`,
        usuario: 'Usuário',
      },
    });

    return NextResponse.json(newReceita, { status: 201 });
  } catch (error) {
    console.error('Error creating receita:', error);
    return NextResponse.json({ error: 'Erro ao criar receita' }, { status: 500 });
  }
}
