'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'neutral' | 'positive' | 'negative' | 'info';
  trend?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'neutral',
  trend,
}: MetricCardProps) {
  const getBadgeColor = () => {
    switch (variant) {
      case 'positive':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'negative':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'info':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      default:
        return 'text-zinc-400 bg-zinc-800/50 border-zinc-700/50';
    }
  };

  const getValueColor = () => {
    if (variant === 'positive') return 'text-emerald-400';
    if (variant === 'negative') return 'text-rose-400';
    return 'text-zinc-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card glass-card-hover rounded-xl p-5 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {title}
        </span>
        <div className={cn('p-2 rounded-lg border', getBadgeColor())}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className={cn('text-2xl font-bold tracking-tight', getValueColor())}>
          {value}
        </h3>
      </div>

      {subtitle && (
        <p className="mt-2 text-[11px] text-zinc-500 font-medium">{subtitle}</p>
      )}

      {trend && (
        <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded font-medium bg-zinc-900 border border-zinc-800 text-zinc-400">
          {trend}
        </span>
      )}
    </motion.div>
  );
}
