'use client';

import { Car, Utensils, Zap, ShoppingBag, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { CategoryType } from '@/types/user';
import Link from 'next/link';

const CATEGORY_CONFIG: Record<
  CategoryType,
  { icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>; color: string; dotClass: string }
> = {
  transport: { icon: Car, color: 'var(--color-teal-400)', dotClass: 'dot-transport' },
  diet: { icon: Utensils, color: 'var(--color-sage-400)', dotClass: 'dot-diet' },
  utilities: { icon: Zap, color: 'var(--color-amber-400)', dotClass: 'dot-utilities' },
  shopping: { icon: ShoppingBag, color: 'var(--color-mauve-400)', dotClass: 'dot-shopping' },
};

interface CategoryCardProps {
  category: CategoryType;
  totalKg: number;
  percentOfTotal: number;
  trend?: number; // % change vs yesterday (-20 means -20%)
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
    <div className={`card p-4 flex flex-col gap-3 group ${className}`} style={{ cursor: 'default' }}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${config.color}15`, border: `1px solid ${config.color}25` }}
          >
            <Icon size={15} style={{ color: config.color }} />
          </div>
          <span className="text-sm font-medium capitalize" style={{ color: 'var(--color-cream-300)' }}>
            {category}
          </span>
        </div>

        {hasTrend && (
          <div
            className="flex items-center gap-0.5"
            style={{
              color: isPositiveTrend ? 'var(--color-amber-400)' : 'var(--color-sage-400)',
              fontSize: '0.75rem',
            }}
          >
            {isPositiveTrend ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(trend!).toFixed(0)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end justify-between">
        <div>
          <span
            className="tabular text-2xl font-semibold"
            style={{ color: 'var(--color-cream-100)', letterSpacing: '-0.02em' }}
          >
            {totalKg.toFixed(2)}
          </span>
          <span className="text-sm ml-1" style={{ color: 'var(--color-cream-500)' }}>
            kg
          </span>
        </div>
        <Link href="/log" className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity">
          <Plus size={14} />
        </Link>
      </div>

      {/* Progress bar */}
      <div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(percentOfTotal, 100)}%`,
              background: `linear-gradient(90deg, ${config.color}aa, ${config.color})`,
            }}
          />
        </div>
        <span className="text-xs mt-1 block" style={{ color: 'var(--color-cream-500)' }}>
          {percentOfTotal.toFixed(0)}% of today's total
        </span>
      </div>
    </div>
  );
}
