/**
 * Store em memória com suporte a múltiplos projetos.
 * Os dados persistem enquanto a instância serverless estiver ativa.
 */

export type Projeto = {
  id: string;
  nome: string;
  descricao: string;
  cor: string; // cor hex ou tailwind class
  createdAt: string;
};

export type Receita = {
  id: string;
  projetoId: string;
  nome: string;
  categoria: string;
  valor: number;
  moeda: string;
  cotacao: number | null;
  valorConvertido: number;
  observacao: string | null;
  data: string;
  createdAt: string;
  updatedAt: string;
};

export type Custo = {
  id: string;
  projetoId: string;
  nome: string;
  categoria: string;
  valor: number;
  moeda: string;
  cotacao: number | null;
  valorConvertido: number;
  observacao: string | null;
  data: string;
  createdAt: string;
  updatedAt: string;
};

export type Historico = {
  id: string;
  projetoId?: string;
  tabela: string;
  registroId: string;
  campo: string;
  valorAnterior: string | null;
  novoValor: string | null;
  usuario: string;
  createdAt: string;
};

export type Configuracao = {
  id: string;
  chave: string;
  valor: string;
};

export function uuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function d(dateStr: string) {
  return new Date(dateStr).toISOString();
}

// ─── Projeto 1 (dados reais do usuário) ──────────────────────────────────────

const PROJETO1_ID = 'projeto-1';

const PROJETOS_INICIAIS: Projeto[] = [
  {
    id: PROJETO1_ID,
    nome: 'Projeto 1',
    descricao: 'Meu primeiro projeto de marketing digital',
    cor: '#6366f1',
    createdAt: d('2024-08-01'),
  },
];

const RECEITAS_INICIAIS: Receita[] = [
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'DoneBr', categoria: 'Vendas', valor: 23705.25, moeda: 'BRL', cotacao: null, valorConvertido: 23705.25, observacao: null, data: d('2024-08-01'), createdAt: d('2024-08-01'), updatedAt: d('2024-08-01') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Camiseta Europa', categoria: 'Vendas', valor: 742.15, moeda: 'BRL', cotacao: null, valorConvertido: 742.15, observacao: null, data: d('2024-08-02'), createdAt: d('2024-08-02'), updatedAt: d('2024-08-02') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Contas Vendidas', categoria: 'Perpétuo', valor: 3500.00, moeda: 'BRL', cotacao: null, valorConvertido: 3500.00, observacao: null, data: d('2024-08-03'), createdAt: d('2024-08-03'), updatedAt: d('2024-08-03') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'DoneEU', categoria: 'Vendas', valor: 8192.66, moeda: 'BRL', cotacao: null, valorConvertido: 8192.66, observacao: null, data: d('2024-08-04'), createdAt: d('2024-08-04'), updatedAt: d('2024-08-04') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Rosa Oriental', categoria: 'Vendas', valor: 700.00, moeda: 'BRL', cotacao: null, valorConvertido: 700.00, observacao: null, data: d('2024-08-05'), createdAt: d('2024-08-05'), updatedAt: d('2024-08-05') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Fotos Editor', categoria: 'Serviço', valor: 500.00, moeda: 'BRL', cotacao: null, valorConvertido: 500.00, observacao: null, data: d('2024-08-06'), createdAt: d('2024-08-06'), updatedAt: d('2024-08-06') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Pipoca', categoria: 'Vendas', valor: 1998.00, moeda: 'BRL', cotacao: null, valorConvertido: 1998.00, observacao: null, data: d('2024-08-07'), createdAt: d('2024-08-07'), updatedAt: d('2024-08-07') },
];

const CUSTOS_INICIAIS: Custo[] = [
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Contas Shopify', categoria: 'Ferramentas', valor: 5500.00, moeda: 'BRL', cotacao: null, valorConvertido: 5500.00, observacao: null, data: d('2024-08-01'), createdAt: d('2024-08-01'), updatedAt: d('2024-08-01') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Anúncios', categoria: 'Tráfego Pago', valor: 6616.54, moeda: 'USD', cotacao: 5.39, valorConvertido: 35664.14, observacao: 'US$ 6.616,54 × R$ 5,39', data: d('2024-08-02'), createdAt: d('2024-08-02'), updatedAt: d('2024-08-02') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Passagem', categoria: 'Viagem', valor: 538.46, moeda: 'BRL', cotacao: null, valorConvertido: 538.46, observacao: null, data: d('2024-08-03'), createdAt: d('2024-08-03'), updatedAt: d('2024-08-03') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Blablabla', categoria: 'Outros', valor: 50.00, moeda: 'BRL', cotacao: null, valorConvertido: 50.00, observacao: null, data: d('2024-08-04'), createdAt: d('2024-08-04'), updatedAt: d('2024-08-04') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Passagem', categoria: 'Viagem', valor: 89.27, moeda: 'BRL', cotacao: null, valorConvertido: 89.27, observacao: null, data: d('2024-08-05'), createdAt: d('2024-08-05'), updatedAt: d('2024-08-05') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Mercado e Alimentação', categoria: 'Pessoal', valor: 850.00, moeda: 'BRL', cotacao: null, valorConvertido: 850.00, observacao: null, data: d('2024-08-06'), createdAt: d('2024-08-06'), updatedAt: d('2024-08-06') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'IOF', categoria: 'Taxas', valor: 1160.00, moeda: 'BRL', cotacao: null, valorConvertido: 1160.00, observacao: null, data: d('2024-08-07'), createdAt: d('2024-08-07'), updatedAt: d('2024-08-07') },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Crédito Facebook', categoria: 'Crédito', valor: -500, moeda: 'USD', cotacao: 5.39, valorConvertido: -2695.00, observacao: 'Crédito — US$ 500 × R$ 5,39', data: d('2024-08-08'), createdAt: d('2024-08-08'), updatedAt: d('2024-08-08') },
];


const CONFIGS_INICIAIS: Configuracao[] = [
  { id: uuid(), chave: 'cotacaoUSD', valor: '5.39' },
  { id: uuid(), chave: 'nomeEmpresa', valor: 'Sementinha do Mal' },
  { id: uuid(), chave: 'moedaPadrao', valor: 'BRL' },
];

// ─── Singleton Global ─────────────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __store: {
    projetos: Projeto[];
    receitas: Receita[];
    custos: Custo[];
    historico: Historico[];
    configuracoes: Configuracao[];
  } | undefined;
}

if (!global.__store) {
  global.__store = {
    projetos: [...PROJETOS_INICIAIS],
    receitas: [...RECEITAS_INICIAIS],
    custos: [...CUSTOS_INICIAIS],
    historico: [],
    configuracoes: [...CONFIGS_INICIAIS],
  };
}

export const store = global.__store;

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function addHistorico(
  tabela: string,
  registroId: string,
  campo: string,
  valorAnterior: string | null,
  novoValor: string | null,
  projetoId?: string
) {
  store.historico.unshift({
    id: uuid(),
    projetoId,
    tabela,
    registroId,
    campo,
    valorAnterior,
    novoValor,
    usuario: 'Usuário',
    createdAt: new Date().toISOString(),
  });
  if (store.historico.length > 500) store.historico.length = 500;
}

/** Calcula totais de um conjunto de receitas e custos */
export function calcularTotais(receitas: Receita[], custos: Custo[]) {
  const totalFaturamento = receitas.reduce((a, r) => a + r.valorConvertido, 0);
  const totalCustos = custos.reduce((a, c) => a + c.valorConvertido, 0);
  const lucroLiquido = totalFaturamento - totalCustos;
  const margemPorcentagem = totalFaturamento > 0 ? (lucroLiquido / totalFaturamento) * 100 : 0;
  return { totalFaturamento, totalCustos, lucroLiquido, margemPorcentagem };
}
