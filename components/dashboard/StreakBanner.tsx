'use client';

import { Flame } from 'lucide-react';

interface StreakBannerProps {
  streak: number;
  habitCount: number;
}

const STREAK_MESSAGES: Record<number, string> = {
  0: 'Set your habits to build a streak',
  1: "You've started! Complete habits daily to keep it active",
  3: 'Three days strong! Keep building momentum',
  7: 'One full week of progress! Excellent consistency',
  14: 'Two weeks of momentum! Sustainable change active',
  30: 'A whole month! Remarkable environmental focus',
};

const getStreakMessage = (streak: number): string => {
  const milestones = Object.keys(STREAK_MESSAGES)
    .map(Number)
    .sort((a, b) => b - a);
  const matched = milestones.find((m) => streak >= m);
  return matched !== undefined ? STREAK_MESSAGES[matched] : `${streak} days of continuous progress`;
};

export function StreakBanner({ streak, habitCount }: StreakBannerProps) {
  const isActive = streak > 0;

  return (
    <div
      className="flex items-center gap-3.5 px-4 py-3 rounded border"
      style={{
        background: '#e8f0fe',
        borderColor: '#d2e3fc',
      }}
    >
      {/* Flame icon */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: '#ffffff',
          border: '1px solid #d2e3fc',
        }}
      >
        <Flame
          size={16}
          style={{ color: isActive ? '#f9ab00' : '#5f6368' }}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold" style={{ color: '#202124' }}>
          {streak > 0 ? `${streak}-day habit streak` : 'Streak inactive'}
        </p>
        <p className="text-[10px] leading-tight" style={{ color: '#5f6368' }}>
          {getStreakMessage(streak)}
        </p>
      </div>

      {/* Habit count */}
      {habitCount > 0 && (
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold tabular" style={{ color: '#137333' }}>
            {habitCount}
          </p>
          <p className="text-[9px] font-semibold" style={{ color: '#5f6368' }}>
            completed today
          </p>
        </div>
      )}
    </div>
  );
}
