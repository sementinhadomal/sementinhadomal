'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DashboardCharts } from '@/components/dashboard/Charts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Receipt,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard?period=${period}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const cards = data?.cards || {
    totalFaturamento: 42838.06,
    totalCustos: 41156.87,
    lucroLiquido: 1681.19,
    margemPorcentagem: 3.92,
    totalReceitasCount: 7,
    totalCustosCount: 8,
  };

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
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Visão Geral de Operações</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Controle em tempo real de faturamento, custos e lucratividade de marketing digital.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {/* 6 Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <MetricCard
            title="Card 1 • Faturamento Total"
            value={formatCurrency(cards.totalFaturamento)}
            subtitle="7 Operações ativas salvas"
            icon={TrendingUp}
            variant="info"
          />

          <MetricCard
            title="Card 2 • Custos Totais"
            value={formatCurrency(cards.totalCustos)}
            subtitle="8 Custos cadastrados (inclui créditos)"
            icon={TrendingDown}
            variant="negative"
          />

          <MetricCard
            title="Card 3 • Lucro Líquido"
            value={formatCurrency(cards.lucroLiquido)}
            subtitle={cards.lucroLiquido >= 0 ? 'Resultado Positivo (Lucro)' : 'Resultado Negativo (Prejuízo)'}
            icon={DollarSign}
            variant={cards.lucroLiquido >= 0 ? 'positive' : 'negative'}
          />

          <MetricCard
            title="Card 4 • Margem (%)"
            value={`${cards.margemPorcentagem.toFixed(2)}%`}
            subtitle="Calculada (Lucro / Faturamento)"
            icon={Percent}
            variant={cards.margemPorcentagem >= 0 ? 'positive' : 'negative'}
          />

          <MetricCard
            title="Card 5 • Quantidade de Receitas"
            value={String(cards.totalReceitasCount)}
            subtitle="Operações de entrada registradas"
            icon={Receipt}
            variant="neutral"
          />

          <MetricCard
            title="Card 6 • Quantidade de Custos"
            value={String(cards.totalCustosCount)}
            subtitle="Operações de saída registradas"
            icon={ShoppingBag}
            variant="neutral"
          />
        </div>

        {/* Charts Section */}
        <DashboardCharts
          monthlyBreakdown={data?.monthlyBreakdown || []}
          pieReceitas={data?.pieReceitas || []}
          pieCustos={data?.pieCustos || []}
        />
      </div>
    </div>
  );
}
