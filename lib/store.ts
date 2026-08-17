/**
 * Store em memória - substitui SQLite para funcionar na Vercel.
 * Os dados persistem enquanto a instância serverless estiver ativa.
 * Para persistência real, conecte a um banco como Turso ou PlanetScale.
 */

export type Receita = {
  id: string;
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

function uuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function d(dateStr: string) {
  return new Date(dateStr).toISOString();
}

// ─── Dados iniciais ───────────────────────────────────────────────────────────

const RECEITAS_INICIAIS: Receita[] = [
  { id: uuid(), nome: 'Oferta 1', categoria: 'Lançamento', valor: 12000, moeda: 'BRL', cotacao: null, valorConvertido: 12000, observacao: null, data: d('2024-08-01'), createdAt: d('2024-08-01'), updatedAt: d('2024-08-01') },
  { id: uuid(), nome: 'Oferta 2', categoria: 'Lançamento', valor: 9800, moeda: 'BRL', cotacao: null, valorConvertido: 9800, observacao: null, data: d('2024-08-05'), createdAt: d('2024-08-05'), updatedAt: d('2024-08-05') },
  { id: uuid(), nome: 'Contas Vendidas', categoria: 'Perpétuo', valor: 450, moeda: 'BRL', cotacao: null, valorConvertido: 450, observacao: 'Sem taxas', data: d('2024-08-10'), createdAt: d('2024-08-10'), updatedAt: d('2024-08-10') },
  { id: uuid(), nome: 'Mentoria VIP', categoria: 'Serviço', valor: 5000, moeda: 'BRL', cotacao: null, valorConvertido: 5000, observacao: null, data: d('2024-08-12'), createdAt: d('2024-08-12'), updatedAt: d('2024-08-12') },
  { id: uuid(), nome: 'Afiliado Meta Ads', categoria: 'Afiliado', valor: 2100, moeda: 'USD', cotacao: 5.39, valorConvertido: 11319, observacao: 'Comissão de julho', data: d('2024-08-14'), createdAt: d('2024-08-14'), updatedAt: d('2024-08-14') },
  { id: uuid(), nome: 'Assinaturas Recorrentes', categoria: 'Recorrente', valor: 3269.06, moeda: 'BRL', cotacao: null, valorConvertido: 3269.06, observacao: null, data: d('2024-08-20'), createdAt: d('2024-08-20'), updatedAt: d('2024-08-20') },
];

const CUSTOS_INICIAIS: Custo[] = [
  { id: uuid(), nome: 'Meta Ads - Campanha Agosto', categoria: 'Tráfego Pago', valor: 8500, moeda: 'BRL', cotacao: null, valorConvertido: 8500, observacao: null, data: d('2024-08-01'), createdAt: d('2024-08-01'), updatedAt: d('2024-08-01') },
  { id: uuid(), nome: 'Google Ads', categoria: 'Tráfego Pago', valor: 3200, moeda: 'BRL', cotacao: null, valorConvertido: 3200, observacao: null, data: d('2024-08-03'), createdAt: d('2024-08-03'), updatedAt: d('2024-08-03') },
  { id: uuid(), nome: 'Copywriter Freelancer', categoria: 'Equipe', valor: 2500, moeda: 'BRL', cotacao: null, valorConvertido: 2500, observacao: null, data: d('2024-08-05'), createdAt: d('2024-08-05'), updatedAt: d('2024-08-05') },
  { id: uuid(), nome: 'ActiveCampaign', categoria: 'Ferramentas', valor: 180, moeda: 'USD', cotacao: 5.39, valorConvertido: 970.2, observacao: 'Plano Plus', data: d('2024-08-07'), createdAt: d('2024-08-07'), updatedAt: d('2024-08-07') },
  { id: uuid(), nome: 'Hotmart Taxas', categoria: 'Taxas', valor: 1450, moeda: 'BRL', cotacao: null, valorConvertido: 1450, observacao: 'Taxa de 9.9%', data: d('2024-08-10'), createdAt: d('2024-08-10'), updatedAt: d('2024-08-10') },
  { id: uuid(), nome: 'Designer Gráfico', categoria: 'Equipe', valor: 1800, moeda: 'BRL', cotacao: null, valorConvertido: 1800, observacao: null, data: d('2024-08-12'), createdAt: d('2024-08-12'), updatedAt: d('2024-08-12') },
  { id: uuid(), nome: 'ClickFunnels', categoria: 'Ferramentas', valor: 297, moeda: 'USD', cotacao: 5.39, valorConvertido: 1600.83, observacao: null, data: d('2024-08-15'), createdAt: d('2024-08-15'), updatedAt: d('2024-08-15') },
  { id: uuid(), nome: 'Servidor VPS', categoria: 'Ferramentas', valor: 120, moeda: 'BRL', cotacao: null, valorConvertido: 120, observacao: null, data: d('2024-08-18'), createdAt: d('2024-08-18'), updatedAt: d('2024-08-18') },
  { id: uuid(), nome: 'Contador', categoria: 'Administrativo', valor: 800, moeda: 'BRL', cotacao: null, valorConvertido: 800, observacao: null, data: d('2024-08-20'), createdAt: d('2024-08-20'), updatedAt: d('2024-08-20') },
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
    receitas: Receita[];
    custos: Custo[];
    historico: Historico[];
    configuracoes: Configuracao[];
  } | undefined;
}

if (!global.__store) {
  global.__store = {
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
  novoValor: string | null
) {
  store.historico.unshift({
    id: uuid(),
    tabela,
    registroId,
    campo,
    valorAnterior,
    novoValor,
    usuario: 'Usuário',
    createdAt: new Date().toISOString(),
  });
  // Limita histórico a 500 entradas
  if (store.historico.length > 500) store.historico.length = 500;
}

export { uuid };
