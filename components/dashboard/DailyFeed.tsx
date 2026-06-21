'use client';

import { Trash2, Car, Utensils, Zap, ShoppingBag } from 'lucide-react';
import { ActivityEntry } from '@/types/activity';
import { CategoryType } from '@/types/user';

const CATEGORY_ICONS: Record<CategoryType, React.ComponentType<{ size: number; style?: React.CSSProperties }>> = {
  transport: Car,
  diet: Utensils,
  utilities: Zap,
  shopping: ShoppingBag,
};

const CATEGORY_COLORS: Record<CategoryType, string> = {
  transport: 'var(--color-teal-400)',
  diet: 'var(--color-sage-400)',
  utilities: 'var(--color-amber-400)',
  shopping: 'var(--color-mauve-400)',
};

interface DailyFeedProps {
  activities: ActivityEntry[];
  onDelete?: (id: string) => void;
}

export function DailyFeed({ activities, onDelete }: DailyFeedProps) {
  if (activities.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 rounded-xl"
        style={{ background: 'var(--color-slate-800)', border: '1px dashed rgba(107,143,113,0.15)' }}
      >
        <div className="text-3xl mb-2">🌿</div>
        <p style={{ color: 'var(--color-cream-400)', fontSize: '0.9rem' }}>
          No activities logged today yet
        </p>
        <p style={{ color: 'var(--color-cream-500)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
          Tap "Log Activity" to start tracking
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {activities.map((activity, idx) => {
        const Icon = CATEGORY_ICONS[activity.category];
        const color = CATEGORY_COLORS[activity.category];

        return (
          <div
            key={activity.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl group transition-all"
            style={{
              background: 'var(--color-slate-800)',
              border: '1px solid rgba(107,143,113,0.08)',
              animationDelay: `${idx * 0.05}s`,
            }}
          >
            {/* Category icon */}
            <div
              className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ background: `${color}15` }}
            >
              <Icon size={14} style={{ color }} />
            </div>

            {/* Label + meta */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-cream-200)' }}>
                {activity.label}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-cream-500)' }}>
                {activity.quantity} {activity.unit}
                {' · '}
                <span className="capitalize">{activity.category}</span>
              </p>
            </div>

            {/* CO2 value */}
            <span
              className="tabular text-sm font-semibold flex-shrink-0"
              style={{ color: 'var(--color-cream-300)' }}
            >
              +{activity.co2eKg.toFixed(2)} kg
            </span>

            {/* Delete */}
            {onDelete && (
              <button
                onClick={() => onDelete(activity.id)}
                className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                style={{ width: '1.75rem', height: '1.75rem', color: 'var(--color-cream-500)' }}
                aria-label="Delete activity"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
