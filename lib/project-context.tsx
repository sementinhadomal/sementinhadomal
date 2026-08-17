'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ProjetoResumo = {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  totalFaturamento: number;
  totalCustos: number;
  lucroLiquido: number;
  margemPorcentagem: number;
  totalReceitas: number;
  createdAt: string;
};

type ProjectContextType = {
  projetoAtivo: string; // id do projeto ou 'all'
  setProjetoAtivo: (id: string) => void;
  projetos: ProjetoResumo[];
  recarregarProjetos: () => void;
  projetoAtivoInfo: ProjetoResumo | null;
};

const ProjectContext = createContext<ProjectContextType>({
  projetoAtivo: 'all',
  setProjetoAtivo: () => {},
  projetos: [],
  recarregarProjetos: () => {},
  projetoAtivoInfo: null,
});

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projetoAtivo, setProjetoAtivoState] = useState<string>('all');
  const [projetos, setProjetos] = useState<ProjetoResumo[]>([]);

  const recarregarProjetos = useCallback(async () => {
    try {
      const res = await fetch('/api/projetos');
      if (res.ok) {
        const data = await res.json();
        setProjetos(data);
      }
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
    }
  }, []);

  useEffect(() => {
    recarregarProjetos();
  }, [recarregarProjetos]);

  const setProjetoAtivo = (id: string) => {
    setProjetoAtivoState(id);
  };

  const projetoAtivoInfo = projetos.find((p) => p.id === projetoAtivo) || null;

  return (
    <ProjectContext.Provider value={{ projetoAtivo, setProjetoAtivo, projetos, recarregarProjetos, projetoAtivoInfo }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
