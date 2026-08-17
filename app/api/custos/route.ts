import { NextResponse } from 'next/server';
import { store, uuid, addHistorico, type Custo } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase();
    const categoria = searchParams.get('categoria') || '';
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

    let custos = [...store.custos];

    if (fromDate) {
      custos = custos.filter((c) => new Date(c.data) >= fromDate!);
    }
    if (search) {
      custos = custos.filter(
        (c) =>
          c.nome.toLowerCase().includes(search) ||
          c.categoria.toLowerCase().includes(search) ||
          (c.observacao || '').toLowerCase().includes(search)
      );
    }
    if (categoria) {
      custos = custos.filter((c) => c.categoria === categoria);
    }

    custos.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    return NextResponse.json(custos);
  } catch (error) {
    console.error('Error fetching custos:', error);
    return NextResponse.json({ error: 'Erro ao buscar custos' }, { status: 500 });
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

    const now = new Date().toISOString();
    const newCusto: Custo = {
      id: uuid(),
      nome,
      categoria,
      valor: numericValor,
      moeda: moeda || 'BRL',
      cotacao: numericCotacao,
      valorConvertido,
      observacao: observacao || null,
      data: data ? new Date(data).toISOString() : now,
      createdAt: now,
      updatedAt: now,
    };

    store.custos.push(newCusto);

    addHistorico(
      'custos',
      newCusto.id,
      'Criação',
      null,
      `Criado: ${newCusto.nome} - R$ ${newCusto.valorConvertido.toFixed(2)}`
    );

    return NextResponse.json(newCusto, { status: 201 });
  } catch (error) {
    console.error('Error creating custo:', error);
    return NextResponse.json({ error: 'Erro ao criar custo' }, { status: 500 });
  }
}
