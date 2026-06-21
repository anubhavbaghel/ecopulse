'use client';

import { SwapSuggestion } from '@/types/gemini';
import { ArrowRight, Leaf } from 'lucide-react';

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy win', color: 'var(--color-sage-400)', bg: 'rgba(107,143,113,0.1)' },
  medium: { label: 'Some effort', color: 'var(--color-amber-400)', bg: 'rgba(212,168,83,0.1)' },
  hard: { label: 'Commitment', color: 'var(--color-mauve-400)', bg: 'rgba(164,143,196,0.1)' },
};

const CATEGORY_COLORS: Record<string, string> = {
  transport: 'var(--color-teal-400)',
  diet: 'var(--color-sage-400)',
  utilities: 'var(--color-amber-400)',
  shopping: 'var(--color-mauve-400)',
};

interface SwapCardProps {
  swap: SwapSuggestion;
  index: number;
}

export function SwapCard({ swap, index }: SwapCardProps) {
  const diff = DIFFICULTY_CONFIG[swap.difficulty];
  const categoryColor = CATEGORY_COLORS[swap.category] ?? 'var(--color-sage-400)';

  return (
    <div
      className={`card p-5 flex flex-col gap-4 animate-fade-in-up stagger-${index + 1}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-cream-100)' }}>
          {swap.title}
        </h3>
        <div className="flex gap-1.5 flex-shrink-0">
          <span
            className="badge capitalize"
            style={{ background: `${categoryColor}15`, color: categoryColor, border: `1px solid ${categoryColor}25` }}
          >
            {swap.category}
          </span>
          <span
            className="badge"
            style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.color}25` }}
          >
            {diff.label}
          </span>
        </div>
      </div>

      {/* From → To */}
      <div
        className="rounded-xl p-3 flex items-center gap-3"
        style={{ background: 'var(--color-slate-700)' }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs mb-0.5" style={{ color: 'var(--color-cream-500)' }}>FROM</p>
          <p className="text-sm" style={{ color: 'var(--color-cream-300)' }}>{swap.from_action}</p>
        </div>
        <ArrowRight size={16} style={{ color: 'var(--color-sage-500)', flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <p className="text-xs mb-0.5" style={{ color: 'var(--color-sage-400)' }}>TO</p>
          <p className="text-sm font-medium" style={{ color: 'var(--color-cream-200)' }}>{swap.to_action}</p>
        </div>
      </div>

      {/* Saving */}
      <div className="flex items-center gap-2">
        <Leaf size={14} style={{ color: 'var(--color-sage-400)' }} />
        <span className="text-sm" style={{ color: 'var(--color-cream-400)' }}>
          Saves{' '}
          <span className="font-semibold tabular" style={{ color: 'var(--color-sage-300)' }}>
            {swap.co2_saving_kg_per_week.toFixed(1)} kg CO₂e
          </span>{' '}
          per week
        </span>
      </div>
    </div>
  );
}
