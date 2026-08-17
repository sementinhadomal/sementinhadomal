import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logs = store.historico.slice(0, 100);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching historico:', error);
    return NextResponse.json({ error: 'Erro ao buscar histórico' }, { status: 500 });
  }
}
