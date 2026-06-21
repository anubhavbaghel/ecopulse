'use client';

import { Trash2, Car, Utensils, Zap, ShoppingBag, Clock } from 'lucide-react';
import { ActivityEntry } from '@/types/activity';
import { CategoryType } from '@/types/user';

const CATEGORY_ICONS: Record<CategoryType, React.ComponentType<{ size: number; className?: string }>> = {
  transport: Car,
  diet: Utensils,
  utilities: Zap,
  shopping: ShoppingBag,
};

const CATEGORY_CONFIG: Record<CategoryType, { color: string; bg: string; border: string }> = {
  transport: { color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
  diet: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  utilities: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  shopping: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
};

interface DailyFeedProps {
  activities: ActivityEntry[];
  onDelete?: (id: string) => void;
}

export function DailyFeed({ activities, onDelete }: DailyFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center text-zinc-300 mb-4 animate-float border border-zinc-100">
          <Clock size={32} strokeWidth={1.5} />
        </div>
        <h4 className="text-zinc-900 font-black tracking-tight">Quiet day so far?</h4>
        <p className="text-zinc-500 text-sm mt-1 max-w-[200px]">Log your first choice to see your carbon pulse in action.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-100">
      {activities.map((activity) => {
        const Icon = CATEGORY_ICONS[activity.category];
        const config = CATEGORY_CONFIG[activity.category];

        return (
          <div
            key={activity.id}
            className="group flex items-center gap-4 p-4 transition-all duration-200 hover:bg-zinc-50/50"
          >
            {/* Visual Icon */}
            <div className={`w-12 h-12 rounded-2xl ${config.bg} ${config.border} border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
              <Icon size={20} className={config.color} />
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h5 className="text-sm font-bold text-zinc-900 truncate tracking-tight">{activity.label}</h5>
                <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${config.bg} ${config.color} border ${config.border}`}>
                  {activity.category}
                </span>
              </div>
              <p className="text-xs font-medium text-zinc-400">
                {activity.quantity} {activity.unit}
              </p>
            </div>

            {/* Impact & Action */}
            <div className="text-right flex items-center gap-4">
              <div>
                <p className="text-sm font-black text-zinc-900 tabular-nums">
                  +{activity.co2eKg.toFixed(2)}
                </p>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">kg CO₂e</p>
              </div>
              
              {onDelete && (
                <button
                  onClick={() => onDelete(activity.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 active:scale-90 border border-transparent hover:border-rose-100"
                  aria-label="Delete entry"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

