'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DashboardCharts } from '@/components/dashboard/Charts';
import { useProject } from '@/lib/project-context';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Receipt,
  ShoppingBag,
  RefreshCw,
  FolderOpen,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const { projetoAtivo, projetoAtivoInfo, projetos } = useProject();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard?period=${period}&projetoId=${projetoAtivo}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [period, projetoAtivo]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const cards = data?.cards || {
    totalFaturamento: 0,
    totalCustos: 0,
    lucroLiquido: 0,
    margemPorcentagem: 0,
    totalReceitasCount: 0,
    totalCustosCount: 0,
  };

  const isAll = projetoAtivo === 'all';
  const corProjeto = isAll ? '#6366f1' : (projetoAtivoInfo?.cor || '#6366f1');
  const tituloProjeto = isAll ? 'Todos os Projetos' : projetoAtivoInfo?.nome || 'Dashboard';

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header
        title="Dashboard Financeiro"
        selectedPeriod={period}
        onPeriodChange={setPeriod}
      />

      <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Summary Banner */}
        <div className="glass-card rounded-xl p-6 border border-zinc-800/80 bg-gradient-to-r from-zinc-900 via-indigo-950/20 to-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isAll && (
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 shadow-lg"
                style={{ backgroundColor: corProjeto, boxShadow: `0 0 12px ${corProjeto}60` }}
              />
            )}
            <div>
              <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                {isAll ? 'Visão Consolidada — Todos os Projetos' : `Visão: ${tituloProjeto}`}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isAll
                  ? `Somatório de ${projetos.length} projeto(s) — faturamento, custos e lucratividade`
                  : 'Controle em tempo real de faturamento, custos e lucratividade'}
              </p>
            </div>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {/* 6 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <MetricCard
            title="Faturamento Total"
            value={formatCurrency(cards.totalFaturamento)}
            subtitle={`${cards.totalReceitasCount} receitas cadastradas`}
            icon={TrendingUp}
            variant="info"
          />
          <MetricCard
            title="Custos Totais"
            value={formatCurrency(cards.totalCustos)}
            subtitle={`${cards.totalCustosCount} custos cadastrados`}
            icon={TrendingDown}
            variant="negative"
          />
          <MetricCard
            title="Lucro Líquido"
            value={formatCurrency(cards.lucroLiquido)}
            subtitle={cards.lucroLiquido >= 0 ? 'Resultado Positivo ✓' : 'Resultado Negativo ✗'}
            icon={DollarSign}
            variant={cards.lucroLiquido >= 0 ? 'positive' : 'negative'}
          />
          <MetricCard
            title="Margem de Lucro"
            value={`${cards.margemPorcentagem.toFixed(2)}%`}
            subtitle="Lucro ÷ Faturamento"
            icon={Percent}
            variant={cards.margemPorcentagem >= 0 ? 'positive' : 'negative'}
          />
          <MetricCard
            title="Total de Receitas"
            value={String(cards.totalReceitasCount)}
            subtitle="Operações de entrada"
            icon={Receipt}
            variant="neutral"
          />
          <MetricCard
            title="Total de Custos"
            value={String(cards.totalCustosCount)}
            subtitle="Operações de saída"
            icon={ShoppingBag}
            variant="neutral"
          />
        </div>

        {/* Resumo por projeto (visão consolidada) */}
        {isAll && data?.resumoPorProjeto && data.resumoPorProjeto.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-zinc-400" />
              Resumo por Projeto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.resumoPorProjeto.map((p: any) => (
                <div
                  key={p.id}
                  className="glass-card rounded-xl p-4 border border-zinc-800/80 hover:border-zinc-700/80 transition-all"
                  style={{ borderLeftColor: p.cor, borderLeftWidth: 3 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: p.cor, boxShadow: `0 0 8px ${p.cor}50` }}
                      />
                      <span className="text-sm font-semibold text-zinc-100">{p.nome}</span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        p.lucroLiquido >= 0
                          ? 'text-emerald-400 bg-emerald-400/10'
                          : 'text-red-400 bg-red-400/10'
                      }`}
                    >
                      {p.lucroLiquido >= 0 ? (
                        <span className="flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" />Lucro</span>
                      ) : (
                        <span className="flex items-center gap-0.5"><ArrowDownRight className="w-3 h-3" />Prejuízo</span>
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-zinc-500 mb-0.5">Faturamento</p>
                      <p className="text-zinc-200 font-semibold">{formatCurrency(p.totalFaturamento)}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 mb-0.5">Custos</p>
                      <p className="text-red-400 font-semibold">{formatCurrency(p.totalCustos)}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 mb-0.5">Lucro</p>
                      <p className={`font-semibold ${p.lucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatCurrency(p.lucroLiquido)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-zinc-800/60 flex justify-between text-[11px] text-zinc-500">
                    <span>{p.totalReceitasCount} receitas</span>
                    <span>{p.margemPorcentagem.toFixed(1)}% margem</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        <DashboardCharts
          monthlyBreakdown={data?.monthlyBreakdown || []}
          pieReceitas={data?.pieReceitas || []}
          pieCustos={data?.pieCustos || []}
        />
      </div>
    </div>
  );
}
