'use client';

import { Car, Utensils, Zap, ShoppingBag, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { CategoryType } from '@/types/user';
import Link from 'next/link';

const CATEGORY_CONFIG: Record<
  CategoryType,
  { icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>; color: string }
> = {
  transport: { icon: Car, color: '#1a73e8' }, // GCP Blue
  diet: { icon: Utensils, color: '#137333' }, // GCP Green
  utilities: { icon: Zap, color: '#b06000' }, // GCP Orange/Yellow
  shopping: { icon: ShoppingBag, color: '#d93025' }, // GCP Red
};

interface CategoryCardProps {
  category: CategoryType;
  totalKg: number;
  percentOfTotal: number;
  trend?: number; // % change vs yesterday
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
    <div className={`card p-5 flex flex-col gap-3 group ${className}`} style={{ cursor: 'default' }}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: `${config.color}10`, border: `1px solid ${config.color}20` }}
          >
            <Icon size={14} style={{ color: config.color }} />
          </div>
          <span className="text-xs font-semibold capitalize" style={{ color: '#3c4043' }}>
            {category}
          </span>
        </div>

        {hasTrend && (
          <div
            className="flex items-center gap-0.5 animate-fade-in"
            style={{
              color: isPositiveTrend ? '#b06000' : '#137333',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          >
            {isPositiveTrend ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            <span>{Math.abs(trend!).toFixed(0)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end justify-between">
        <div>
          <span
            className="tabular text-xl font-bold"
            style={{ color: '#202124', letterSpacing: '-0.01em' }}
          >
            {totalKg.toFixed(1)}
          </span>
          <span className="text-[11px] font-semibold ml-1" style={{ color: '#5f6368' }}>
            kg CO₂e
          </span>
        </div>
        <Link href="/log" className="w-5.5 h-5.5 rounded bg-white border border-[#dadce0] text-gray-500 hover:bg-[#e8f0fe] hover:text-[#1a73e8] hover:border-[#d2e3fc] transition-all flex items-center justify-center flex-shrink-0" title={`Log ${category}`}>
          <Plus size={11} />
        </Link>
      </div>

      {/* Progress bar */}
      <div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(percentOfTotal, 100)}%`,
              background: config.color,
            }}
          />
        </div>
        <span className="text-[10px] mt-1.5 block font-medium" style={{ color: '#70757a' }}>
          {percentOfTotal.toFixed(0)}% of today's footprint
        </span>
      </div>
    </div>
  );
}
