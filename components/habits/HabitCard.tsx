'use client';

import { Habit } from '@/types/habit';
import { Leaf, Wind, Bike, Power, Sprout, Package, Flame } from 'lucide-react';

const HABIT_ICONS: Record<string, React.ComponentType<{ size: number; style?: React.CSSProperties }>> = {
  Leaf, Wind, Bike, Power, Sprout, Package, Flame,
};

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  transport: { color: '#1a73e8', bg: '#e8f0fe', border: '#d2e3fc' }, // GCP Blue
  diet: { color: '#137333', bg: '#e6f4ea', border: '#ceead6' }, // GCP Green
  utilities: { color: '#b06000', bg: '#fef7e0', border: '#feefc3' }, // GCP Yellow/Orange
  shopping: { color: '#d93025', bg: '#fce8e6', border: '#fad2cf' }, // GCP Red
};

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string, currentlyCompleted: boolean) => void;
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const Icon = HABIT_ICONS[habit.icon] ?? Leaf;
  const config = CATEGORY_CONFIG[habit.category] ?? { color: '#1a73e8', bg: '#e8f0fe', border: '#d2e3fc' };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all shadow-sm"
      style={{
        background: habit.completedToday
          ? '#e6f4ea' // Clean GCP Green background
          : '#ffffff',
        border: `1px solid ${habit.completedToday ? '#ceead6' : '#dadce0'}`,
        opacity: habit.completedToday ? 0.85 : 1,
      }}
    >
      {/* Custom Checkbox (Outlined GCP Style) */}
      <button
        onClick={() => onToggle(habit.id, habit.completedToday)}
        className={`habit-check flex-shrink-0 cursor-pointer ${habit.completedToday ? 'completed' : ''}`}
        style={{
          borderColor: habit.completedToday ? '#1a73e8' : '#80868b',
          borderRadius: '2px',
        }}
        aria-label={habit.completedToday ? 'Mark incomplete' : 'Mark complete'}
      >
        {habit.completedToday && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <polyline
              points="20 6 9 17 4 12"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="check-icon"
            />
          </svg>
        )}
      </button>

      {/* Category Icon */}
      <div
        className="w-7 h-7 rounded flex-shrink-0 flex items-center justify-center"
        style={{ background: config.bg, border: `1px solid ${config.border}` }}
      >
        <Icon size={13} style={{ color: config.color }} />
      </div>

      {/* Info details */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold"
          style={{
            color: habit.completedToday ? '#5f6368' : '#202124',
            textDecoration: habit.completedToday ? 'line-through' : 'none',
          }}
        >
          {habit.title}
        </p>
        <p className="text-[10px]" style={{ color: '#5f6368' }}>
          {habit.description}
        </p>
      </div>

      {/* CO2 saving potential + streak */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span
          className="text-xs font-bold tabular"
          style={{ color: '#137333' }}
        >
          −{habit.co2SavingKg} kg
        </span>
        {habit.currentStreak > 0 && (
          <div
            className="flex items-center gap-0.5 badge badge-amber"
            style={{
              fontSize: '0.62rem',
              padding: '0.08rem 0.35rem',
              background: '#fef7e0',
              color: '#b06000',
              borderColor: '#feefc3',
            }}
          >
            <Flame size={8} />
            <span>{habit.currentStreak}d</span>
          </div>
        )}
      </div>
    </div>
  );
}
