const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with exact requested records...');

  // Limpar tabelas
  await prisma.receita.deleteMany({});
  await prisma.custo.deleteMany({});
  await prisma.historico.deleteMany({});
  await prisma.configuracao.deleteMany({});

  // Seed Receitas (7 registros)
  const receitas = [
    {
      nome: 'Oferta 1',
      categoria: 'Oferta',
      valor: 23705.25,
      moeda: 'BRL',
      cotacao: null,
      valorConvertido: 23705.25,
      observacao: 'Sem taxas',
      data: new Date(),
    },
    {
      nome: 'Oferta 2',
      categoria: 'Oferta',
      valor: 742.15,
      moeda: 'BRL',
      cotacao: null,
      valorConvertido: 742.15,
      observacao: null,
      data: new Date(),
    },
    {
      nome: 'Contas Vendidas',
      categoria: 'Venda',
      valor: 7000.00,
      moeda: 'BRL',
      cotacao: null,
      valorConvertido: 7000.00,
      observacao: null,
      data: new Date(),
    },
    {
      nome: 'Recebimentos em USD',
      categoria: 'Internacional',
      valor: 1605.02,
      moeda: 'USD',
      cotacao: 5.1044,
      valorConvertido: 8192.66,
      observacao: null,
      data: new Date(),
    },
    {
      nome: 'Nova Receita',
      categoria: 'Receita',
      valor: 700.00,
      moeda: 'BRL',
      cotacao: null,
      valorConvertido: 700.00,
      observacao: null,
      data: new Date(),
    },
    {
      nome: 'Outra Receita',
      categoria: 'Receita',
      valor: 500.00,
      moeda: 'BRL',
      cotacao: null,
      valorConvertido: 500.00,
      observacao: null,
      data: new Date(),
    },
    {
      nome: 'Pipoca',
      categoria: 'Venda',
      valor: 1998.00,
      moeda: 'BRL',
      cotacao: null,
      valorConvertido: 1998.00,
      observacao: null,
      data: new Date(),
    },
  ];

  for (const r of receitas) {
    await prisma.receita.create({ data: r });
  }

  // Seed Custos (8 registros)
  const custos = [
    {
      nome: 'Contas Shopify',
      categoria: 'Infraestrutura',
      valor: 5500.00,
      moeda: 'BRL',
      cotacao: null,
      valorConvertido: 5500.00,
      observacao: null,
      data: new Date(),
    },
    {
      nome: 'Anúncios',
      categoria: 'Marketing',
      valor: 6616.54,
      moeda: 'USD',
      cotacao: 5.39,
      valorConvertido: 35664.14,
      observacao: null,
      data: new Date(),
    },
    {
      nome: 'Passagem',
      categoria: 'Viagem',
      valor: 538.46,
      moeda: 'BRL',
      cotacao: null,
      valorConvertido: 538.46,
      observacao: null,
      data: new Date(),
    },
    {
      nome: 'Blablabla',
      categoria: 'Diversos',
      valor: 50.00,
      moeda: 'BRL',
      cotacao: null,
      valorConvertido: 50.00,
      observacao: null,
      data: new Date(),
    },
    {
      nome: 'Passagem',
      categoria: 'Viagem',
      valor: 89.27,
      moeda: 'BRL',
      cotacao: null,
      valorConvertido: 89.27,
      observacao: null,
      data: new Date(),
    },
    {
      nome: 'Mercado e Alimentação',
      categoria: 'Pessoal',
      valor: 850.00,
      moeda: 'BRL',
      cotacao: null,
      valorConvertido: 850.00,
      observacao: null,
      data: new Date(),
    },
    {
      nome: 'IOF',
      categoria: 'Impostos',
      valor: 1160.00,
      moeda: 'BRL',
      cotacao: null,
      valorConvertido: 1160.00,
      observacao: null,
      data: new Date(),
    },
    {
      nome: 'Crédito Facebook',
      categoria: 'Crédito',
      valor: -500.00,
      moeda: 'USD',
      cotacao: 5.39,
      valorConvertido: -2695.00,
      observacao: 'Crédito recebido.',
      data: new Date(),
    },
  ];

  for (const c of custos) {
    await prisma.custo.create({ data: c });
  }

  // Seed Configuracoes
  const configs = [
    { chave: 'nomeSistema', valor: 'Sementinha do Mal' },
    { chave: 'moedaPadrao', valor: 'BRL' },
    { chave: 'cotacaoDolar', valor: '5.39' },
    { chave: 'tema', valor: 'dark' },
  ];

  for (const cfg of configs) {
    await prisma.configuracao.create({ data: cfg });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
