import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const configMap: Record<string, string> = {};
    store.configuracoes.forEach((c) => {
      configMap[c.chave] = c.valor;
    });

    return NextResponse.json({
      nomeSistema: configMap.nomeEmpresa || 'Sementinha do Mal',
      moedaPadrao: configMap.moedaPadrao || 'BRL',
      cotacaoDolar: configMap.cotacaoUSD || '5.39',
      tema: configMap.tema || 'dark',
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, configs, backupData } = body;

    // Backup Export
    if (action === 'backup') {
      return NextResponse.json({
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: {
          receitas: store.receitas,
          custos: store.custos,
          historico: store.historico,
          configuracoes: store.configuracoes,
        },
      });
    }

    // Backup Restore
    if (action === 'restore') {
      if (!backupData || !backupData.data) {
        return NextResponse.json({ error: 'Dados de backup inválidos' }, { status: 400 });
      }

      if (backupData.data.receitas) {
        store.receitas.length = 0;
        store.receitas.push(...backupData.data.receitas);
      }
      if (backupData.data.custos) {
        store.custos.length = 0;
        store.custos.push(...backupData.data.custos);
      }
      if (backupData.data.configuracoes) {
        store.configuracoes.length = 0;
        store.configuracoes.push(...backupData.data.configuracoes);
      }

      return NextResponse.json({ success: true, message: 'Backup restaurado com sucesso!' });
    }

    // Save Configurations
    if (configs) {
      for (const [chave, valor] of Object.entries(configs)) {
        const idx = store.configuracoes.findIndex((c) => c.chave === chave);
        if (idx !== -1) {
          store.configuracoes[idx].valor = String(valor);
        } else {
          store.configuracoes.push({
            id: Math.random().toString(36).substring(2),
            chave,
            valor: String(valor),
          });
        }
      }
      return NextResponse.json({ success: true, message: 'Configurações salvas!' });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Erro ao processar configurações' }, { status: 500 });
  }
}
