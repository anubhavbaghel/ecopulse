'use client';

import { SwapSuggestion } from '@/types/gemini';
import { ArrowRight, Leaf } from 'lucide-react';

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy Win', color: '#137333', bg: '#e6f4ea', border: '#ceead6' },
  medium: { label: 'Medium Effort', color: '#b06000', bg: '#fef7e0', border: '#feefc3' },
  hard: { label: 'High Commitment', color: '#d93025', bg: '#fce8e6', border: '#fad2cf' },
};

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  transport: { color: '#1a73e8', bg: '#e8f0fe', border: '#d2e3fc' }, // GCP Blue
  diet: { color: '#137333', bg: '#e6f4ea', border: '#ceead6' }, // GCP Green
  utilities: { color: '#b06000', bg: '#fef7e0', border: '#feefc3' }, // GCP Yellow/Orange
  shopping: { color: '#d93025', bg: '#fce8e6', border: '#fad2cf' }, // GCP Red
};

interface SwapCardProps {
  swap: SwapSuggestion;
  index: number;
}

export function SwapCard({ swap, index }: SwapCardProps) {
  const diff = DIFFICULTY_CONFIG[swap.difficulty] ?? DIFFICULTY_CONFIG.easy;
  const config = CATEGORY_CONFIG[swap.category] ?? { color: '#1a73e8', bg: '#e8f0fe', border: '#d2e3fc' };

  return (
    <div
      className={`card p-5 flex flex-col gap-4 animate-fade-in-up stagger-${index + 1}`}
      style={{ background: '#ffffff', borderColor: '#dadce0' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xs font-bold" style={{ color: '#202124' }}>
          {swap.title}
        </h3>
        <div className="flex gap-1.5 flex-shrink-0">
          <span
            className="badge capitalize font-semibold"
            style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}
          >
            {swap.category}
          </span>
          <span
            className="badge font-semibold"
            style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}
          >
            {diff.label}
          </span>
        </div>
      </div>

      {/* From → To Actions */}
      <div
        className="rounded border border-[#dadce0] p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 bg-[#f8f9fa]"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#5f6368' }}>Current</p>
          <p className="text-xs font-semibold" style={{ color: '#5f6368' }}>{swap.from_action}</p>
        </div>
        <ArrowRight size={15} className="rotate-90 sm:rotate-0 self-center sm:self-auto" style={{ color: '#1a73e8', flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#137333' }}>Alternative</p>
          <p className="text-xs font-bold" style={{ color: '#137333' }}>{swap.to_action}</p>
        </div>
      </div>

      {/* Saving summary */}
      <div className="flex items-center gap-2 mt-0.5">
        <Leaf size={14} style={{ color: '#137333' }} />
        <span className="text-xs font-medium" style={{ color: '#3c4043' }}>
          Savings impact:{' '}
          <span className="font-bold tabular-nums" style={{ color: '#137333' }}>
            −{swap.co2_saving_kg_per_week.toFixed(1)} kg CO₂e
          </span>{' '}
          per week
        </span>
      </div>
    </div>
  );
}
