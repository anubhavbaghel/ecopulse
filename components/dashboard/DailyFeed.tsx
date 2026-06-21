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

const CATEGORY_CONFIG: Record<CategoryType, { color: string; bg: string; border: string }> = {
  transport: { color: '#1a73e8', bg: '#e8f0fe', border: '#d2e3fc' }, // GCP Blue
  diet: { color: '#137333', bg: '#e6f4ea', border: '#ceead6' }, // GCP Green
  utilities: { color: '#b06000', bg: '#fef7e0', border: '#feefc3' }, // GCP Orange/Yellow
  shopping: { color: '#d93025', bg: '#fce8e6', border: '#fad2cf' }, // GCP Red
};

interface DailyFeedProps {
  activities: ActivityEntry[];
  onDelete?: (id: string) => void;
}

export function DailyFeed({ activities, onDelete }: DailyFeedProps) {
  if (activities.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 rounded bg-white border border-[#dadce0] shadow-sm"
      >
        <div className="text-2xl mb-2">🌿</div>
        <p style={{ color: '#202124', fontSize: '0.85rem', fontWeight: 600 }}>
          No activities logged today
        </p>
        <p style={{ color: '#5f6368', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          Click "Log Activity" to register your choices
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#dadce0] rounded-lg overflow-hidden bg-white shadow-sm animate-fade-in-up stagger-3">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f8f9fa] border-b border-[#dadce0] text-[#5f6368] font-bold uppercase tracking-wider text-[10px]">
              <th className="px-4 py-2.5">Activity</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5 text-right">Quantity</th>
              <th className="px-4 py-2.5 text-right">CO₂ Emission</th>
              {onDelete && <th className="px-4 py-2.5 w-10"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dadce0]">
            {activities.map((activity) => {
              const Icon = CATEGORY_ICONS[activity.category];
              const config = CATEGORY_CONFIG[activity.category];

              return (
                <tr
                  key={activity.id}
                  className="hover:bg-[#f8f9fa] transition-colors group"
                >
                  {/* Activity info */}
                  <td className="px-4 py-3 font-semibold text-[#202124]">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                        style={{ background: config.bg, border: `1px solid ${config.border}` }}
                      >
                        <Icon size={12} style={{ color: config.color }} />
                      </div>
                      <span className="truncate max-w-[200px]" title={activity.label}>
                        {activity.label}
                      </span>
                    </div>
                  </td>

                  {/* Category badge */}
                  <td className="px-4 py-3">
                    <span
                      className="badge capitalize font-semibold"
                      style={{
                        background: config.bg,
                        color: config.color,
                        border: `1px solid ${config.border}`,
                        fontSize: '0.65rem',
                        padding: '0.1rem 0.4rem',
                      }}
                    >
                      {activity.category}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3 text-right font-medium text-[#3c4043] tabular">
                    {activity.quantity} {activity.unit}
                  </td>

                  {/* CO2 Impact */}
                  <td className="px-4 py-3 text-right font-bold text-[#d93025] tabular">
                    +{activity.co2eKg.toFixed(2)} kg
                  </td>

                  {/* Delete action */}
                  {onDelete && (
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onDelete(activity.id)}
                        className="text-[#80868b] hover:text-[#d93025] opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 cursor-pointer"
                        aria-label="Delete entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
