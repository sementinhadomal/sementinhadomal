import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const configs = await prisma.configuracao.findMany();
    const configMap: Record<string, string> = {};
    configs.forEach((c) => {
      configMap[c.chave] = c.valor;
    });

    return NextResponse.json({
      nomeSistema: configMap.nomeSistema || 'Sementinha do Mal',
      moedaPadrao: configMap.moedaPadrao || 'BRL',
      cotacaoDolar: configMap.cotacaoDolar || '5.39',
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
      const receitas = await prisma.receita.findMany();
      const custos = await prisma.custo.findMany();
      const historico = await prisma.historico.findMany();
      const configuracoes = await prisma.configuracao.findMany();

      return NextResponse.json({
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: { receitas, custos, historico, configuracoes },
      });
    }

    // Backup Restore
    if (action === 'restore') {
      if (!backupData || !backupData.data) {
        return NextResponse.json({ error: 'Dados de backup inválidos' }, { status: 400 });
      }

      await prisma.receita.deleteMany();
      await prisma.custo.deleteMany();
      await prisma.historico.deleteMany();
      await prisma.configuracao.deleteMany();

      if (backupData.data.receitas) {
        for (const r of backupData.data.receitas) {
          const { id, ...rData } = r;
          await prisma.receita.create({ data: { ...rData, data: new Date(rData.data) } });
        }
      }
      if (backupData.data.custos) {
        for (const c of backupData.data.custos) {
          const { id, ...cData } = c;
          await prisma.custo.create({ data: { ...cData, data: new Date(cData.data) } });
        }
      }
      if (backupData.data.configuracoes) {
        for (const cfg of backupData.data.configuracoes) {
          const { id, ...cfgData } = cfg;
          await prisma.configuracao.create({ data: cfgData });
        }
      }

      return NextResponse.json({ success: true, message: 'Backup restaurado com sucesso!' });
    }

    // Save Configurations
    if (configs) {
      for (const [chave, valor] of Object.entries(configs)) {
        await prisma.configuracao.upsert({
          where: { chave },
          update: { valor: String(valor) },
          create: { chave, valor: String(valor) },
        });
      }
      return NextResponse.json({ success: true, message: 'Configurações salvas!' });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Erro ao processar configurações' }, { status: 500 });
  }
}
