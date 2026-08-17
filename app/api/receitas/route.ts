import { NextResponse } from 'next/server';
import { store, uuid, addHistorico, type Receita } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase();
    const categoria = searchParams.get('categoria') || '';
    const filterPeriod = searchParams.get('period') || 'all';
    const projetoId = searchParams.get('projetoId') || 'all';

    const now = new Date();
    let fromDate: Date | null = null;
    if (filterPeriod === 'today') fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    else if (filterPeriod === 'week') { fromDate = new Date(now); fromDate.setDate(now.getDate() - now.getDay()); fromDate.setHours(0,0,0,0); }
    else if (filterPeriod === 'month') fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (filterPeriod === 'year') fromDate = new Date(now.getFullYear(), 0, 1);

    let receitas = projetoId === 'all' ? [...store.receitas] : store.receitas.filter((r) => r.projetoId === projetoId);

    if (fromDate) receitas = receitas.filter((r) => new Date(r.data) >= fromDate!);
    if (search) receitas = receitas.filter((r) => r.nome.toLowerCase().includes(search) || r.categoria.toLowerCase().includes(search) || (r.observacao || '').toLowerCase().includes(search));
    if (categoria) receitas = receitas.filter((r) => r.categoria === categoria);

    receitas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    // Junta o nome do projeto em cada receita
    const receitasComProjeto = receitas.map((r) => {
      const projeto = store.projetos.find((p) => p.id === r.projetoId);
      return { ...r, projetoNome: projeto?.nome || 'Sem projeto', projetoCor: projeto?.cor || '#6366f1' };
    });

    return NextResponse.json(receitasComProjeto);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar receitas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, categoria, valor, moeda, cotacao, observacao, data, projetoId } = body;

    // Usa o primeiro projeto se não informado
    const pidFinal = projetoId || store.projetos[0]?.id || 'projeto-1';

    const numericValor = parseFloat(valor) || 0;
    const numericCotacao = cotacao ? parseFloat(cotacao) : null;
    let valorConvertido = numericValor;
    if (moeda === 'USD' && numericCotacao) valorConvertido = numericValor * numericCotacao;

    const now = new Date().toISOString();
    const newReceita: Receita = {
      id: uuid(),
      projetoId: pidFinal,
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

    store.receitas.push(newReceita);
    addHistorico('receitas', newReceita.id, 'Criação', null, `Criado: ${newReceita.nome} - R$ ${newReceita.valorConvertido.toFixed(2)}`, pidFinal);

    return NextResponse.json(newReceita, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar receita' }, { status: 500 });
  }
}
