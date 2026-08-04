'use client';

import React from 'react';
import { Search, Calendar, Bell, DollarSign } from 'lucide-react';

interface HeaderProps {
  title?: string;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export function Header({
  title = 'Dashboard',
  selectedPeriod = 'all',
  onPeriodChange,
  searchValue = '',
  onSearchChange,
}: HeaderProps) {
  const periods = [
    { id: 'all', label: 'Tudo' },
    { id: 'today', label: 'Hoje' },
    { id: 'week', label: 'Esta Semana' },
    { id: 'month', label: 'Este Mês' },
    { id: 'year', label: 'Ano' },
  ];

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-bold text-zinc-100 tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Instant Search Bar */}
        {onSearchChange !== undefined && (
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Pesquisa instantânea..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        )}

        {/* Period Filter Pill Buttons */}
        {onPeriodChange && (
          <div className="flex items-center bg-zinc-900/90 p-1 rounded-lg border border-zinc-800/80 text-xs">
            <Calendar className="w-3.5 h-3.5 text-zinc-400 ml-2 mr-1" />
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => onPeriodChange(p.id)}
                className={`px-2.5 py-1 rounded-md transition-all text-[11px] font-medium ${
                  selectedPeriod === p.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
            <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 font-semibold text-xs flex items-center justify-center border border-indigo-500/40">
              SM
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
