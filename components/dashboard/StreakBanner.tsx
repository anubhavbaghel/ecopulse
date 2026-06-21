'use client';

import { Flame } from 'lucide-react';

interface StreakBannerProps {
  streak: number;
  habitCount: number;
}

const STREAK_MESSAGES: Record<number, string> = {
  0: 'Start your first habit today',
  1: "You've begun — keep going",
  3: 'Three days strong',
  7: 'One full week of progress',
  14: 'Two weeks of momentum',
  30: 'A whole month — remarkable',
};

const getStreakMessage = (streak: number): string => {
  const milestones = Object.keys(STREAK_MESSAGES)
    .map(Number)
    .sort((a, b) => b - a);
  const matched = milestones.find((m) => streak >= m);
  return matched !== undefined ? STREAK_MESSAGES[matched] : `${streak} days of progress`;
};

export function StreakBanner({ streak, habitCount }: StreakBannerProps) {
  const isActive = streak > 0;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: isActive
          ? 'linear-gradient(135deg, rgba(107,143,113,0.12), rgba(107,143,113,0.06))'
          : 'var(--color-slate-800)',
        border: `1px solid ${isActive ? 'rgba(107,143,113,0.25)' : 'rgba(107,143,113,0.1)'}`,
      }}
    >
      {/* Flame icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: isActive ? 'rgba(212,168,83,0.15)' : 'rgba(107,143,113,0.08)',
          border: `1px solid ${isActive ? 'rgba(212,168,83,0.25)' : 'rgba(107,143,113,0.15)'}`,
        }}
      >
        <Flame
          size={18}
          style={{ color: isActive ? 'var(--color-amber-400)' : 'var(--color-cream-500)' }}
        />
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-cream-200)' }}>
          {streak > 0 ? `${streak}-day streak` : 'No active streak'}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-cream-400)' }}>
          {getStreakMessage(streak)}
        </p>
      </div>

      {/* Habit count */}
      {habitCount > 0 && (
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-semibold tabular" style={{ color: 'var(--color-sage-400)' }}>
            {habitCount}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-cream-500)' }}>
            habit{habitCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
