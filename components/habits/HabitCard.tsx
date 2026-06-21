'use client';

import { Habit } from '@/types/habit';
import { Leaf, Wind, Bike, Power, Sprout, Package, Flame } from 'lucide-react';

const HABIT_ICONS: Record<string, React.ComponentType<{ size: number; style?: React.CSSProperties }>> = {
  Leaf, Wind, Bike, Power, Sprout, Package, Flame,
};

const CATEGORY_COLORS: Record<string, string> = {
  transport: 'var(--color-teal-400)',
  diet: 'var(--color-sage-400)',
  utilities: 'var(--color-amber-400)',
  shopping: 'var(--color-mauve-400)',
};

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string, currentlyCompleted: boolean) => void;
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const Icon = HABIT_ICONS[habit.icon] ?? Leaf;
  const color = CATEGORY_COLORS[habit.category] ?? 'var(--color-sage-400)';

  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
      style={{
        background: habit.completedToday
          ? 'rgba(107,143,113,0.07)'
          : 'var(--color-slate-800)',
        border: `1px solid ${habit.completedToday ? 'rgba(107,143,113,0.2)' : 'rgba(107,143,113,0.08)'}`,
        opacity: habit.completedToday ? 0.75 : 1,
      }}
    >
      {/* Custom Checkbox */}
      <button
        onClick={() => onToggle(habit.id, habit.completedToday)}
        className={`habit-check flex-shrink-0 ${habit.completedToday ? 'completed' : ''}`}
        aria-label={habit.completedToday ? 'Mark incomplete' : 'Mark complete'}
      >
        {habit.completedToday && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <polyline
              points="20 6 9 17 4 12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="check-icon"
            />
          </svg>
        )}
      </button>

      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
        style={{ background: `${color}15` }}
      >
        <Icon size={15} style={{ color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium"
          style={{
            color: habit.completedToday ? 'var(--color-cream-400)' : 'var(--color-cream-200)',
            textDecoration: habit.completedToday ? 'line-through' : 'none',
          }}
        >
          {habit.title}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-cream-500)' }}>
          {habit.description}
        </p>
      </div>

      {/* CO2 saving + streak */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span
          className="text-xs font-semibold tabular"
          style={{ color: 'var(--color-sage-400)' }}
        >
          −{habit.co2SavingKg} kg
        </span>
        {habit.currentStreak > 0 && (
          <div
            className="flex items-center gap-0.5 badge badge-amber"
            style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}
          >
            <Flame size={9} />
            {habit.currentStreak}d
          </div>
        )}
      </div>
    </div>
  );
}
