'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Projeto = {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
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

export type Credencial = {
  id: string;
  projetoId: string;
  servico: string;
  login: string;
  senha: string;
  url?: string | null;
  observacao?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjetoResumo = Projeto & {
  totalFaturamento: number;
  totalCustos: number;
  lucroLiquido: number;
  margemPorcentagem: number;
  totalReceitas: number;
  totalCustos2: number;
};

function uuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function d(dateStr: string) {
  return new Date(dateStr).toISOString();
}

function curDate(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

const STORAGE_KEY = 'sementinhadomal_store_v3';
const PROJETO1_ID = 'projeto-1';

const INITIAL_PROJETOS: Projeto[] = [
  {
    id: PROJETO1_ID,
    nome: 'Projeto 1',
    descricao: 'Meu primeiro projeto de marketing digital',
    cor: '#6366f1',
    createdAt: curDate(15),
  },
];

const INITIAL_RECEITAS: Receita[] = [
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'DoneBr', categoria: 'Vendas', valor: 23705.25, moeda: 'BRL', cotacao: null, valorConvertido: 23705.25, observacao: null, data: curDate(1), createdAt: curDate(1), updatedAt: curDate(1) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Camiseta Europa', categoria: 'Vendas', valor: 742.15, moeda: 'BRL', cotacao: null, valorConvertido: 742.15, observacao: null, data: curDate(2), createdAt: curDate(2), updatedAt: curDate(2) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Contas Vendidas', categoria: 'Perpétuo', valor: 3500.00, moeda: 'BRL', cotacao: null, valorConvertido: 3500.00, observacao: null, data: curDate(3), createdAt: curDate(3), updatedAt: curDate(3) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'DoneEU', categoria: 'Vendas', valor: 8192.66, moeda: 'BRL', cotacao: null, valorConvertido: 8192.66, observacao: null, data: curDate(4), createdAt: curDate(4), updatedAt: curDate(4) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Rosa Oriental', categoria: 'Vendas', valor: 700.00, moeda: 'BRL', cotacao: null, valorConvertido: 700.00, observacao: null, data: curDate(5), createdAt: curDate(5), updatedAt: curDate(5) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Fotos Editor', categoria: 'Serviço', valor: 500.00, moeda: 'BRL', cotacao: null, valorConvertido: 500.00, observacao: null, data: curDate(6), createdAt: curDate(6), updatedAt: curDate(6) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Pipoca', categoria: 'Vendas', valor: 1998.00, moeda: 'BRL', cotacao: null, valorConvertido: 1998.00, observacao: null, data: curDate(7), createdAt: curDate(7), updatedAt: curDate(7) },
];

const INITIAL_CUSTOS: Custo[] = [
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Contas Shopify', categoria: 'Ferramentas', valor: 5500.00, moeda: 'BRL', cotacao: null, valorConvertido: 5500.00, observacao: null, data: curDate(1), createdAt: curDate(1), updatedAt: curDate(1) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Anúncios', categoria: 'Tráfego Pago', valor: 6616.54, moeda: 'USD', cotacao: 5.39, valorConvertido: 35664.14, observacao: 'US$ 6.616,54 × R$ 5,39', data: curDate(2), createdAt: curDate(2), updatedAt: curDate(2) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Passagem', categoria: 'Viagem', valor: 538.46, moeda: 'BRL', cotacao: null, valorConvertido: 538.46, observacao: null, data: curDate(3), createdAt: curDate(3), updatedAt: curDate(3) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Blablabla', categoria: 'Outros', valor: 50.00, moeda: 'BRL', cotacao: null, valorConvertido: 50.00, observacao: null, data: curDate(4), createdAt: curDate(4), updatedAt: curDate(4) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Passagem', categoria: 'Viagem', valor: 89.27, moeda: 'BRL', cotacao: null, valorConvertido: 89.27, observacao: null, data: curDate(5), createdAt: curDate(5), updatedAt: curDate(5) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Mercado e Alimentação', categoria: 'Pessoal', valor: 850.00, moeda: 'BRL', cotacao: null, valorConvertido: 850.00, observacao: null, data: curDate(6), createdAt: curDate(6), updatedAt: curDate(6) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'IOF', categoria: 'Taxas', valor: 1160.00, moeda: 'BRL', cotacao: null, valorConvertido: 1160.00, observacao: null, data: curDate(7), createdAt: curDate(7), updatedAt: curDate(7) },
  { id: uuid(), projetoId: PROJETO1_ID, nome: 'Crédito Facebook', categoria: 'Crédito', valor: -500, moeda: 'USD', cotacao: 5.39, valorConvertido: -2695.00, observacao: 'Crédito — US$ 500 × R$ 5,39', data: curDate(8), createdAt: curDate(8), updatedAt: curDate(8) },
];

const INITIAL_CREDENCIAIS: Credencial[] = [
  { id: uuid(), projetoId: PROJETO1_ID, servico: 'Shopify Admin', login: 'admin@lojaprojeto1.com', senha: 'ExemploSenha123!', url: 'https://myshopify.com', observacao: 'Conta principal da loja', createdAt: curDate(10), updatedAt: curDate(10) },
  { id: uuid(), projetoId: PROJETO1_ID, servico: 'Meta Business Manager', login: 'ads@projeto1.com', senha: 'MetaPassword2024#', url: 'https://business.facebook.com', observacao: 'BM Principal com Pixel ativo', createdAt: curDate(10), updatedAt: curDate(10) },
  { id: uuid(), projetoId: PROJETO1_ID, servico: 'nouzzhub', login: 'caiquedossantospires17@gmail.com', senha: 'Password123!', url: '', observacao: '', createdAt: curDate(1), updatedAt: curDate(1) },
];

type DataContextType = {
  projetos: Projeto[];
  receitas: Receita[];
  custos: Custo[];
  credenciais: Credencial[];
  projetoAtivo: string;
  setProjetoAtivo: (id: string) => void;
  projetosComResumo: ProjetoResumo[];
  projetoAtivoInfo: ProjetoResumo | null;

  // Projetos
  addProjeto: (data: { nome: string; descricao?: string; cor?: string }) => Promise<Projeto>;
  updateProjeto: (id: string, data: { nome: string; descricao?: string; cor?: string }) => Promise<void>;
  deleteProjeto: (id: string) => Promise<void>;

  // Receitas
  addReceita: (data: any) => Promise<void>;
  updateReceita: (id: string, data: any) => Promise<void>;
  deleteReceita: (id: string) => Promise<void>;
  duplicateReceita: (id: string) => Promise<void>;

  // Custos
  addCusto: (data: any) => Promise<void>;
  updateCusto: (id: string, data: any) => Promise<void>;
  deleteCusto: (id: string) => Promise<void>;
  duplicateCusto: (id: string) => Promise<void>;

  // Credenciais
  addCredencial: (data: any) => Promise<void>;
  updateCredencial: (id: string, data: any) => Promise<void>;
  deleteCredencial: (id: string) => Promise<void>;

  // Dashboard & Utils
  getDashboardData: (period: string, projetoId: string) => any;
  exportBackupJSON: () => string;
  importBackupJSON: (jsonStr: string) => boolean;
  resetToDefaults: () => void;
  recarregarProjetos: () => void;
};

const DataContext = createContext<DataContextType>({} as DataContextType);

export function calcularTotais(receitas: Receita[], custos: Custo[]) {
  const totalFaturamento = receitas.reduce((a, r) => a + r.valorConvertido, 0);
  const totalCustos = custos.reduce((a, c) => a + c.valorConvertido, 0);
  const lucroLiquido = totalFaturamento - totalCustos;
  const margemPorcentagem = totalFaturamento > 0 ? (lucroLiquido / totalFaturamento) * 100 : 0;
  return { totalFaturamento, totalCustos, lucroLiquido, margemPorcentagem };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projetos, setProjetos] = useState<Projeto[]>(INITIAL_PROJETOS);
  const [receitas, setReceitas] = useState<Receita[]>(INITIAL_RECEITAS);
  const [custos, setCustos] = useState<Custo[]>(INITIAL_CUSTOS);
  const [credenciais, setCredenciais] = useState<Credencial[]>(INITIAL_CREDENCIAIS);
  const [projetoAtivo, setProjetoAtivo] = useState<string>('all');
  const [loaded, setLoaded] = useState(false);

  // Carrega do localStorage no browser no mount inicial
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.projetos && Array.isArray(parsed.projetos)) setProjetos(parsed.projetos);
        if (parsed.receitas && Array.isArray(parsed.receitas)) setReceitas(parsed.receitas);
        if (parsed.custos && Array.isArray(parsed.custos)) setCustos(parsed.custos);
        if (parsed.credenciais && Array.isArray(parsed.credenciais)) setCredenciais(parsed.credenciais);
      } else {
        // Inicializa localStorage com estado inicial
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            projetos: INITIAL_PROJETOS,
            receitas: INITIAL_RECEITAS,
            custos: INITIAL_CUSTOS,
            credenciais: INITIAL_CREDENCIAIS,
          })
        );
      }
    } catch (e) {
      console.error('Erro ao carregar localStorage:', e);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Salva no localStorage sempre que qualquer estado for alterado (após inicialização)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ projetos, receitas, custos, credenciais })
      );
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }, [projetos, receitas, custos, credenciais, loaded]);

  // Recarregar projetos stub
  const recarregarProjetos = useCallback(() => {}, []);

  // PROJETOS
  const addProjeto = async (data: { nome: string; descricao?: string; cor?: string }) => {
    const CORES = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
    const novo: Projeto = {
      id: uuid(),
      nome: data.nome.trim(),
      descricao: data.descricao?.trim() || '',
      cor: data.cor || CORES[projetos.length % CORES.length],
      createdAt: new Date().toISOString(),
    };
    setProjetos((prev) => [...prev, novo]);

    // Tenta avisar o backend também
    fetch('/api/projetos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {});

    return novo;
  };

  const updateProjeto = async (id: string, data: { nome: string; descricao?: string; cor?: string }) => {
    setProjetos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, nome: data.nome.trim(), descricao: data.descricao?.trim() ?? p.descricao, cor: data.cor ?? p.cor } : p))
    );
    fetch(`/api/projetos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {});
  };

  const deleteProjeto = async (id: string) => {
    if (projetos.length <= 1) throw new Error('Não é possível excluir o único projeto');
    setProjetos((prev) => prev.filter((p) => p.id !== id));
    setReceitas((prev) => prev.filter((r) => r.projetoId !== id));
    setCustos((prev) => prev.filter((c) => c.projetoId !== id));
    setCredenciais((prev) => prev.filter((c) => c.projetoId !== id));
    if (projetoAtivo === id) setProjetoAtivo('all');
    fetch(`/api/projetos/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // RECEITAS
  const addReceita = async (body: any) => {
    const numericValor = parseFloat(body.valor) || 0;
    const numericCotacao = body.cotacao ? parseFloat(body.cotacao) : null;
    let valorConvertido = numericValor;
    if (body.moeda === 'USD' && numericCotacao) valorConvertido = numericValor * numericCotacao;

    const now = new Date().toISOString();
    const nova: Receita = {
      id: uuid(),
      projetoId: body.projetoId || projetos[0]?.id || PROJETO1_ID,
      nome: body.nome.trim(),
      categoria: body.categoria.trim(),
      valor: numericValor,
      moeda: body.moeda || 'BRL',
      cotacao: numericCotacao,
      valorConvertido,
      observacao: body.observacao?.trim() || null,
      data: body.data ? new Date(body.data).toISOString() : now,
      createdAt: now,
      updatedAt: now,
    };
    setReceitas((prev) => [nova, ...prev]);
    fetch('/api/receitas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {});
  };

  const updateReceita = async (id: string, body: any) => {
    const numericValor = parseFloat(body.valor) || 0;
    const numericCotacao = body.cotacao ? parseFloat(body.cotacao) : null;
    let valorConvertido = numericValor;
    if (body.moeda === 'USD' && numericCotacao) valorConvertido = numericValor * numericCotacao;

    setReceitas((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              projetoId: body.projetoId || r.projetoId,
              nome: body.nome.trim(),
              categoria: body.categoria.trim(),
              valor: numericValor,
              moeda: body.moeda || 'BRL',
              cotacao: numericCotacao,
              valorConvertido,
              observacao: body.observacao?.trim() || null,
              data: body.data ? new Date(body.data).toISOString() : r.data,
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
    fetch(`/api/receitas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {});
  };

  const deleteReceita = async (id: string) => {
    setReceitas((prev) => prev.filter((r) => r.id !== id));
    fetch(`/api/receitas/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const duplicateReceita = async (id: string) => {
    const existing = receitas.find((r) => r.id === id);
    if (!existing) return;
    const now = new Date().toISOString();
    const duplicated: Receita = {
      ...existing,
      id: uuid(),
      nome: `${existing.nome} (Cópia)`,
      data: now,
      createdAt: now,
      updatedAt: now,
    };
    setReceitas((prev) => [duplicated, ...prev]);
  };

  // CUSTOS
  const addCusto = async (body: any) => {
    const numericValor = parseFloat(body.valor) || 0;
    const numericCotacao = body.cotacao ? parseFloat(body.cotacao) : null;
    let valorConvertido = numericValor;
    if (body.moeda === 'USD' && numericCotacao) valorConvertido = numericValor * numericCotacao;

    const now = new Date().toISOString();
    const novo: Custo = {
      id: uuid(),
      projetoId: body.projetoId || projetos[0]?.id || PROJETO1_ID,
      nome: body.nome.trim(),
      categoria: body.categoria.trim(),
      valor: numericValor,
      moeda: body.moeda || 'BRL',
      cotacao: numericCotacao,
      valorConvertido,
      observacao: body.observacao?.trim() || null,
      data: body.data ? new Date(body.data).toISOString() : now,
      createdAt: now,
      updatedAt: now,
    };
    setCustos((prev) => [novo, ...prev]);
    fetch('/api/custos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {});
  };

  const updateCusto = async (id: string, body: any) => {
    const numericValor = parseFloat(body.valor) || 0;
    const numericCotacao = body.cotacao ? parseFloat(body.cotacao) : null;
    let valorConvertido = numericValor;
    if (body.moeda === 'USD' && numericCotacao) valorConvertido = numericValor * numericCotacao;

    setCustos((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              projetoId: body.projetoId || c.projetoId,
              nome: body.nome.trim(),
              categoria: body.categoria.trim(),
              valor: numericValor,
              moeda: body.moeda || 'BRL',
              cotacao: numericCotacao,
              valorConvertido,
              observacao: body.observacao?.trim() || null,
              data: body.data ? new Date(body.data).toISOString() : c.data,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    fetch(`/api/custos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {});
  };

  const deleteCusto = async (id: string) => {
    setCustos((prev) => prev.filter((c) => c.id !== id));
    fetch(`/api/custos/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const duplicateCusto = async (id: string) => {
    const existing = custos.find((c) => c.id === id);
    if (!existing) return;
    const now = new Date().toISOString();
    const duplicated: Custo = {
      ...existing,
      id: uuid(),
      nome: `${existing.nome} (Cópia)`,
      data: now,
      createdAt: now,
      updatedAt: now,
    };
    setCustos((prev) => [duplicated, ...prev]);
  };

  // CREDENCIAIS
  const addCredencial = async (body: any) => {
    const now = new Date().toISOString();
    const nova: Credencial = {
      id: uuid(),
      projetoId: body.projetoId || projetos[0]?.id || PROJETO1_ID,
      servico: body.servico.trim(),
      login: body.login.trim(),
      senha: body.senha.trim(),
      url: body.url?.trim() || null,
      observacao: body.observacao?.trim() || null,
      createdAt: now,
      updatedAt: now,
    };
    setCredenciais((prev) => [nova, ...prev]);
    fetch('/api/credenciais', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {});
  };

  const updateCredencial = async (id: string, body: any) => {
    setCredenciais((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              projetoId: body.projetoId || c.projetoId,
              servico: body.servico ? body.servico.trim() : c.servico,
              login: body.login ? body.login.trim() : c.login,
              senha: body.senha ? body.senha.trim() : c.senha,
              url: body.url !== undefined ? (body.url ? body.url.trim() : null) : c.url,
              observacao: body.observacao !== undefined ? (body.observacao ? body.observacao.trim() : null) : c.observacao,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    fetch(`/api/credenciais/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {});
  };

  const deleteCredencial = async (id: string) => {
    setCredenciais((prev) => prev.filter((c) => c.id !== id));
    fetch(`/api/credenciais/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // DASHBOARD & CÁLCULOS
  const getDashboardData = (filterPeriod: string, pid: string) => {
    const now = new Date();
    let fromDate: Date | null = null;
    if (filterPeriod === 'today') fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    else if (filterPeriod === 'week') { fromDate = new Date(now); fromDate.setDate(now.getDate() - now.getDay()); fromDate.setHours(0,0,0,0); }
    else if (filterPeriod === 'month') fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (filterPeriod === 'year') fromDate = new Date(now.getFullYear(), 0, 1);

    let filteredRec = pid === 'all' ? [...receitas] : receitas.filter((r) => r.projetoId === pid);
    let filteredCus = pid === 'all' ? [...custos] : custos.filter((c) => c.projetoId === pid);

    if (fromDate) {
      filteredRec = filteredRec.filter((r) => new Date(r.data) >= fromDate!);
      filteredCus = filteredCus.filter((c) => new Date(c.data) >= fromDate!);
    }

    const totais = calcularTotais(filteredRec, filteredCus);

    // Pie charts
    const catFaturamentoMap: Record<string, number> = {};
    filteredRec.forEach((r) => { catFaturamentoMap[r.categoria] = (catFaturamentoMap[r.categoria] || 0) + r.valorConvertido; });
    const pieReceitas = Object.entries(catFaturamentoMap).map(([name, value]) => ({ name, value }));

    const catCustosMap: Record<string, number> = {};
    filteredCus.forEach((c) => { catCustosMap[c.categoria] = (catCustosMap[c.categoria] || 0) + c.valorConvertido; });
    const pieCustos = Object.entries(catCustosMap).map(([name, value]) => ({ name, value }));

    // Monthly breakdown
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const allRec = pid === 'all' ? [...receitas] : receitas.filter((r) => r.projetoId === pid);
    const allCus = pid === 'all' ? [...custos] : custos.filter((c) => c.projetoId === pid);

    const allTimes = [...allRec, ...allCus].map((x) => new Date(x.data).getTime()).filter((t) => !isNaN(t));
    const refTime = allTimes.length > 0 ? Math.max(...allTimes, now.getTime()) : now.getTime();
    const refDate = new Date(refTime);

    const monthlyBreakdown = [];
    for (let i = 5; i >= 0; i--) {
      const dMonth = new Date(refDate.getFullYear(), refDate.getMonth() - i, 1);
      const label = monthNames[dMonth.getMonth()];
      const monthStart = new Date(dMonth.getFullYear(), dMonth.getMonth(), 1);
      const monthEnd = new Date(dMonth.getFullYear(), dMonth.getMonth() + 1, 0, 23, 59, 59);

      const mReceitas = allRec.filter((r) => { const rd = new Date(r.data); return rd >= monthStart && rd <= monthEnd; });
      const mCustos = allCus.filter((c) => { const cd = new Date(c.data); return cd >= monthStart && cd <= monthEnd; });

      const fat = mReceitas.reduce((a, r) => a + r.valorConvertido, 0);
      const cst = mCustos.reduce((a, c) => a + c.valorConvertido, 0);
      monthlyBreakdown.push({ mes: label, faturamento: fat, custos: cst, lucro: fat - cst });
    }

    const resumoPorProjeto = pid === 'all'
      ? projetos.map((p) => {
          const pReceitas = receitas.filter((r) => r.projetoId === p.id);
          const pCustos = custos.filter((c) => c.projetoId === p.id);
          return {
            id: p.id,
            nome: p.nome,
            cor: p.cor,
            ...calcularTotais(pReceitas, pCustos),
            totalReceitasCount: pReceitas.length,
            totalCustosCount: pCustos.length,
          };
        })
      : null;

    return {
      cards: {
        ...totais,
        totalReceitasCount: filteredRec.length,
        totalCustosCount: filteredCus.length,
      },
      pieReceitas,
      pieCustos,
      monthlyBreakdown,
      resumoPorProjeto,
    };
  };

  const projetosComResumo: ProjetoResumo[] = projetos.map((p) => {
    const pReceitas = receitas.filter((r) => r.projetoId === p.id);
    const pCustos = custos.filter((c) => c.projetoId === p.id);
    const totais = calcularTotais(pReceitas, pCustos);
    return {
      ...p,
      ...totais,
      totalReceitas: pReceitas.length,
      totalCustos2: pCustos.length,
    };
  });

  const projetoAtivoInfo = projetosComResumo.find((p) => p.id === projetoAtivo) || null;

  // EXPORT / IMPORT BACKUP
  const exportBackupJSON = () => {
    return JSON.stringify({ projetos, receitas, custos, credenciais }, null, 2);
  };

  const importBackupJSON = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.projetos) setProjetos(parsed.projetos);
      if (parsed.receitas) setReceitas(parsed.receitas);
      if (parsed.custos) setCustos(parsed.custos);
      if (parsed.credenciais) setCredenciais(parsed.credenciais);
      return true;
    } catch {
      return false;
    }
  };

  const resetToDefaults = () => {
    setProjetos(INITIAL_PROJETOS);
    setReceitas(INITIAL_RECEITAS);
    setCustos(INITIAL_CUSTOS);
    setCredenciais(INITIAL_CREDENCIAIS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <DataContext.Provider
      value={{
        projetos,
        receitas,
        custos,
        credenciais,
        projetoAtivo,
        setProjetoAtivo,
        projetosComResumo,
        projetoAtivoInfo,
        addProjeto,
        updateProjeto,
        deleteProjeto,
        addReceita,
        updateReceita,
        deleteReceita,
        duplicateReceita,
        addCusto,
        updateCusto,
        deleteCusto,
        duplicateCusto,
        addCredencial,
        updateCredencial,
        deleteCredencial,
        getDashboardData,
        exportBackupJSON,
        importBackupJSON,
        resetToDefaults,
        recarregarProjetos,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
