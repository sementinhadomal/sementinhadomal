'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface ChartProps {
  monthlyBreakdown: Array<{
    mes: string;
    faturamento: number;
    custos: number;
    lucro: number;
  }>;
  pieReceitas: Array<{ name: string; value: number }>;
  pieCustos: Array<{ name: string; value: number }>;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
const CUSTO_COLORS = ['#f43f5e', '#fb7185', '#e11d48', '#be123c', '#fda4af'];

export function DashboardCharts({ monthlyBreakdown, pieReceitas, pieCustos }: ChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Evolution Area Chart (2 cols) */}
      <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-zinc-800/80">
        <h4 className="text-sm font-bold text-zinc-200 mb-4 flex items-center justify-between">
          <span>Evolução Financeira (Faturamento vs Custos vs Lucro)</span>
          <span className="text-[11px] text-zinc-500 font-normal">Valores em BRL</span>
        </h4>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyBreakdown} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLuc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="mes" stroke="#71717a" fontSize={12} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '8px',
                  color: '#f4f4f5',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
              />
              <Area
                type="monotone"
                dataKey="faturamento"
                name="Faturamento"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorFat)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="custos"
                name="Custos"
                stroke="#f43f5e"
                fillOpacity={1}
                fill="url(#colorCus)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="lucro"
                name="Lucro Líquido"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorLuc)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Categorias Faturamento & Custos */}
      <div className="glass-card rounded-xl p-5 border border-zinc-800/80 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-zinc-200 mb-2">Distribuição de Receitas</h4>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieReceitas}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieReceitas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '8px',
                    color: '#f4f4f5',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`R$ ${Number(val).toFixed(2)}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border-t border-zinc-800/80 pt-4 mt-2">
          <h4 className="text-sm font-bold text-zinc-200 mb-2">Distribuição de Custos</h4>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieCustos}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieCustos.map((entry, index) => (
                    <Cell key={`cell-custo-${index}`} fill={CUSTO_COLORS[index % CUSTO_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '8px',
                    color: '#f4f4f5',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`R$ ${Number(val).toFixed(2)}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
