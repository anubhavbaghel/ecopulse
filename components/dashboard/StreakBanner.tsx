'use client';

import { Flame, Sparkles } from 'lucide-react';

interface StreakBannerProps {
  streak: number;
  habitCount: number;
}

const STREAK_MESSAGES: Record<number, string> = {
  0: 'Start your first habit to ignite your streak.',
  1: "First spark! Keep it alive tomorrow.",
  3: 'Momentum building! Three days strong.',
  7: 'Weekly Warrior! One full week of focus.',
  14: 'Impact Maker! Two weeks of change.',
  30: 'Eco-Champion! A month of dedication.',
};

const getStreakMessage = (streak: number): string => {
  const milestones = Object.keys(STREAK_MESSAGES)
    .map(Number)
    .sort((a, b) => b - a);
  const matched = milestones.find((m) => streak >= m);
  return matched !== undefined ? STREAK_MESSAGES[matched] : `${streak} days of progress.`;
};

export function StreakBanner({ streak, habitCount }: StreakBannerProps) {
  const isActive = streak > 0;

  return (
    <div
      className={`relative overflow-hidden group px-6 py-5 rounded-[2rem] border transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400 text-white shadow-lg shadow-amber-500/20' 
          : 'bg-white border-zinc-100 text-zinc-900 shadow-sm'
      }`}
    >
      {/* Background Decoration */}
      <div className={`absolute -right-4 -bottom-4 opacity-10 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12 ${isActive ? 'text-white' : 'text-zinc-200'}`}>
        <Flame size={120} strokeWidth={1} />
      </div>

      <div className="relative flex items-center gap-5">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
            isActive ? 'bg-white/20 backdrop-blur-md' : 'bg-zinc-100'
          }`}
        >
          {isActive ? (
            <Flame size={24} className="text-white fill-white" />
          ) : (
            <Sparkles size={24} className="text-zinc-300" />
          )}
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0">
          <h4 className={`text-lg font-black tracking-tight ${isActive ? 'text-white' : 'text-zinc-900'}`}>
            {streak > 0 ? `${streak} Day Streak` : 'Ignite Growth'}
          </h4>
          <p className={`text-xs font-medium leading-relaxed opacity-90 ${isActive ? 'text-amber-50' : 'text-zinc-400'}`}>
            {getStreakMessage(streak)}
          </p>
        </div>

        {/* Stats */}
        {habitCount > 0 && (
          <div className={`text-right ${isActive ? 'bg-amber-400/30' : 'bg-emerald-50'} px-3 py-1.5 rounded-xl backdrop-blur-sm border ${isActive ? 'border-white/20' : 'border-emerald-100'} transition-transform duration-300 group-hover:translate-x-1`}>
            <p className={`text-sm font-black tabular-nums ${isActive ? 'text-white' : 'text-emerald-600'}`}>
              {habitCount}
            </p>
            <p className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-amber-100' : 'text-emerald-400'}`}>
              Done
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

