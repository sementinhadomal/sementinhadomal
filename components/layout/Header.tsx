'use client';

import React, { useState } from 'react';
import { Search, Calendar, Bell, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

const periods = [
  { id: 'all', label: 'Tudo' },
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
  { id: 'year', label: 'Ano' },
];

export function Header({
  title = 'Dashboard',
  selectedPeriod = 'all',
  onPeriodChange,
  searchValue = '',
  onSearchChange,
}: HeaderProps) {
  const [periodOpen, setPeriodOpen] = useState(false);
  const selectedLabel = periods.find((p) => p.id === selectedPeriod)?.label || 'Tudo';

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Linha principal */}
      <div className="h-14 lg:h-16 px-4 lg:px-6 pl-14 lg:pl-6 flex items-center justify-between gap-3">
        <h2 className="text-base lg:text-lg font-bold text-zinc-100 tracking-tight truncate">{title}</h2>

        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          {/* Search — oculta no mobile, aparece no desktop */}
          {onSearchChange !== undefined && (
            <div className="relative hidden sm:block w-40 lg:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-8 pr-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          {/* Period Filter — dropdown no mobile, pills no desktop */}
          {onPeriodChange && (
            <>
              {/* Desktop: pills */}
              <div className="hidden md:flex items-center bg-zinc-900/90 p-1 rounded-lg border border-zinc-800/80 text-xs">
                <Calendar className="w-3.5 h-3.5 text-zinc-400 ml-2 mr-1" />
                {periods.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onPeriodChange(p.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-md transition-all text-[11px] font-medium',
                      selectedPeriod === p.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Mobile: dropdown compacto */}
              <div className="relative md:hidden">
                <button
                  onClick={() => setPeriodOpen(!periodOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 font-medium"
                >
                  <Calendar className="w-3 h-3 text-zinc-400" />
                  {selectedLabel}
                  <ChevronDown className={cn('w-3 h-3 text-zinc-400 transition-transform', periodOpen && 'rotate-180')} />
                </button>
                {periodOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50 min-w-[120px]">
                    {periods.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { onPeriodChange(p.id); setPeriodOpen(false); }}
                        className={cn(
                          'w-full text-left px-4 py-2.5 text-xs transition-colors',
                          selectedPeriod === p.id
                            ? 'text-indigo-400 bg-indigo-600/10 font-semibold'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
            <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 font-semibold text-xs flex items-center justify-center border border-indigo-500/40 flex-shrink-0">
              SM
            </div>
          </div>
        </div>
      </div>

      {/* Barra de busca mobile (linha separada) */}
      {onSearchChange !== undefined && (
        <div className="sm:hidden px-4 pb-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-8 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      )}
    </header>
  );
}
