'use client';

import { Car, Utensils, Zap, ShoppingBag, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { CategoryType } from '@/types/user';
import Link from 'next/link';

const CATEGORY_CONFIG: Record<
  CategoryType,
  { icon: React.ComponentType<{ size: number; className?: string }>; colorClass: string; bgClass: string; borderClass: string }
> = {
  transport: { icon: Car, colorClass: 'text-sky-500', bgClass: 'bg-sky-50', borderClass: 'border-sky-100' },
  diet: { icon: Utensils, colorClass: 'text-emerald-500', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-100' },
  utilities: { icon: Zap, colorClass: 'text-amber-500', bgClass: 'bg-amber-50', borderClass: 'border-amber-100' },
  shopping: { icon: ShoppingBag, colorClass: 'text-rose-500', bgClass: 'bg-rose-50', borderClass: 'border-rose-100' },
};

interface CategoryCardProps {
  category: CategoryType;
  totalKg: number;
  percentOfTotal: number;
  trend?: number;
  className?: string;
}

export function CategoryCard({
  category,
  totalKg,
  percentOfTotal,
  trend,
  className = '',
}: CategoryCardProps) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;
  const hasTrend = trend !== undefined;
  const isPositiveTrend = (trend ?? 0) > 0;

  return (
    <div className={`bg-white border border-zinc-100 rounded-3xl p-5 flex flex-col gap-4 group transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1 ${className}`}>
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl ${config.bgClass} ${config.borderClass} border transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={20} className={config.colorClass} />
        </div>

        {hasTrend && (
          <div
            className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-bold ${
              isPositiveTrend ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {isPositiveTrend ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            <span>{Math.abs(trend!).toFixed(0)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="space-y-1">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{category}</h4>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-zinc-900 tracking-tight">
            {totalKg.toFixed(1)}
          </span>
          <span className="text-[10px] font-bold text-zinc-400 italic">kg CO₂e</span>
        </div>
      </div>

      {/* Progress & Footer */}
      <div className="space-y-3">
        <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${config.colorClass.replace('text', 'bg')}`}
            style={{ width: `${Math.min(percentOfTotal, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-400">
            {percentOfTotal.toFixed(0)}% SHARE
          </span>
          <Link 
            href="/log" 
            className="w-7 h-7 rounded-xl flex items-center justify-center bg-zinc-900 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <Plus size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

