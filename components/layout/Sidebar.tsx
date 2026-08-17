'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Sprout,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectSwitcher } from './ProjectSwitcher';
import { useProject } from '@/lib/project-context';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Faturamentos', href: '/faturamentos', icon: TrendingUp },
  { name: 'Custos', href: '/custos', icon: TrendingDown },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { projetoAtivoInfo, projetoAtivo } = useProject();

  const corAtiva = projetoAtivo === 'all' ? '#6366f1' : (projetoAtivoInfo?.cor || '#6366f1');

  return (
    <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950/90 flex flex-col justify-between h-screen sticky top-0 z-40">
      <div>
        {/* Brand Logo */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-zinc-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-sm text-zinc-100 tracking-tight flex items-center gap-1.5">
              Sementinha do Mal
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h1>
            <p className="text-[11px] text-zinc-400 font-medium">Digital Marketing OS</p>
          </div>
        </div>

        {/* Project Switcher */}
        <ProjectSwitcher />

        {/* Menu Items */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Menu Principal
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                )}
                style={isActive ? { borderColor: `${corAtiva}50`, color: corAtiva, backgroundColor: `${corAtiva}15` } : {}}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-300'
                    )}
                    style={isActive ? { color: corAtiva } : {}}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" style={{ color: corAtiva }} />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-zinc-800/60 bg-zinc-950/40">
        <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60 text-xs">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span>Status</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Ao vivo
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 truncate">USD/BRL Cotação: R$ 5,39</p>
        </div>
      </div>
    </aside>
  );
}
