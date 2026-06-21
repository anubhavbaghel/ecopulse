'use client';

import { SwapSuggestion } from '@/types/gemini';
import { ArrowRight, Leaf, ShieldCheck, Zap, Info } from 'lucide-react';

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy Win', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: ShieldCheck },
  medium: { label: 'Mid Effort', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', icon: Zap },
  hard: { label: 'Commitment', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-100', icon: Info },
};

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  transport: { color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
  diet: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  utilities: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  shopping: { color: 'text-rose-600', bg: 'bg-rose-400/10', border: 'border-rose-100' },
};

interface SwapCardProps {
  swap: SwapSuggestion;
  index: number;
}

export function SwapCard({ swap, index }: SwapCardProps) {
  const diff = DIFFICULTY_CONFIG[swap.difficulty] ?? DIFFICULTY_CONFIG.easy;
  const config = CATEGORY_CONFIG[swap.category] ?? { color: 'text-zinc-600', bg: 'bg-zinc-50', border: 'border-zinc-100' };
  const DiffIcon = diff.icon;

  return (
    <div
      className={`relative group bg-white border border-zinc-100 rounded-[2.5rem] p-8 flex flex-col gap-6 transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-1 animate-fade-in-up stagger-${index + 1}`}
    >
      {/* Type & Difficulty Badges */}
      <div className="flex items-center justify-between">
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.bg} ${config.color} border ${config.border}`}>
          {swap.category}
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${diff.bg} ${diff.color} border ${diff.border}`}>
          <DiffIcon size={12} />
          {diff.label}
        </div>
      </div>

      {/* Main Title */}
      <h3 className="text-xl font-black text-zinc-900 tracking-tight leading-tight">
        {swap.title}
      </h3>

      {/* Comparative Action Box */}
      <div className="relative py-4">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-4 border-zinc-50 flex items-center justify-center z-10 shadow-sm transition-transform duration-500 group-hover:rotate-180">
          <ArrowRight size={18} className="text-zinc-400" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-3xl bg-zinc-50 border border-zinc-100/50 text-center">
             <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Instead of</p>
             <p className="text-xs font-bold text-zinc-500 leading-relaxed">{swap.from_action}</p>
          </div>
          <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100 text-center">
             <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-2">Try This</p>
             <p className="text-xs font-black text-emerald-700 leading-relaxed">{swap.to_action}</p>
          </div>
        </div>
      </div>

      {/* Savings Footer */}
      <div className="mt-auto px-6 py-4 bg-zinc-900 rounded-[1.5rem] flex items-center justify-between shadow-xl shadow-zinc-900/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
             <Leaf size={14} className="fill-emerald-400" />
          </div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Calculated Savings</span>
        </div>
        <span className="text-sm font-black text-white tabular-nums">
          -{swap.co2_saving_kg_per_week.toFixed(1)}kg
          <span className="text-[8px] text-zinc-500 ml-1">/WK</span>
        </span>
      </div>
    </div>
  );
}

