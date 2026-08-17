import { NextResponse } from 'next/server';
import { store, uuid, addHistorico, type Credencial } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase();
    const projetoId = searchParams.get('projetoId') || 'all';

    let credenciais = projetoId === 'all'
      ? [...(store.credenciais || [])]
      : (store.credenciais || []).filter((c) => c.projetoId === projetoId);

    if (search) {
      credenciais = credenciais.filter(
        (c) =>
          c.servico.toLowerCase().includes(search) ||
          c.login.toLowerCase().includes(search) ||
          (c.observacao || '').toLowerCase().includes(search) ||
          (c.url || '').toLowerCase().includes(search)
      );
    }

    credenciais.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const result = credenciais.map((c) => {
      const projeto = store.projetos.find((p) => p.id === c.projetoId);
      return {
        ...c,
        projetoNome: projeto?.nome || 'Sem projeto',
        projetoCor: projeto?.cor || '#6366f1',
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching credenciais:', error);
    return NextResponse.json({ error: 'Erro ao buscar credenciais' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { servico, login, senha, url, observacao, projetoId } = body;

    if (!servico || !login || !senha) {
      return NextResponse.json({ error: 'Serviço, Login e Senha são obrigatórios' }, { status: 400 });
    }

    const pidFinal = projetoId || store.projetos[0]?.id || 'projeto-1';
    const now = new Date().toISOString();

    const nova: Credencial = {
      id: uuid(),
      projetoId: pidFinal,
      servico: servico.trim(),
      login: login.trim(),
      senha: senha.trim(),
      url: url?.trim() || null,
      observacao: observacao?.trim() || null,
      createdAt: now,
      updatedAt: now,
    };

    if (!store.credenciais) store.credenciais = [];
    store.credenciais.push(nova);
    addHistorico('credenciais', nova.id, 'Criação', null, `Login criado para ${nova.servico}`, pidFinal);

    return NextResponse.json(nova, { status: 201 });
  } catch (error) {
    console.error('Error creating credencial:', error);
    return NextResponse.json({ error: 'Erro ao salvar credencial' }, { status: 500 });
  }
}
