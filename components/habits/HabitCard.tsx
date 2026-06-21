'use client';

import { Habit } from '@/types/habit';
import { Leaf, Wind, Bike, Power, Sprout, Package, Flame, Check } from 'lucide-react';

const HABIT_ICONS: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  Leaf, Wind, Bike, Power, Sprout, Package, Flame,
};

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  transport: { color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
  diet: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  utilities: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  shopping: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
};

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string, currentlyCompleted: boolean) => void;
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const Icon = HABIT_ICONS[habit.icon] ?? Leaf;
  const config = CATEGORY_CONFIG[habit.category] ?? { color: 'text-zinc-600', bg: 'bg-zinc-50', border: 'border-zinc-100' };

  return (
    <div
      className={`group flex items-center gap-4 px-5 py-4 rounded-[1.5rem] border transition-all duration-300 ${
        habit.completedToday 
          ? 'bg-emerald-50 border-emerald-100 shadow-sm' 
          : 'bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-0.5'
      }`}
    >
      {/* Visual Icon */}
      <div className={`w-12 h-12 rounded-2xl ${habit.completedToday ? 'bg-white text-emerald-500' : `${config.bg} ${config.color}`} ${config.border} border flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
        <Icon size={20} />
      </div>

      {/* Info Area */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm md:text-base font-black tracking-tight transition-all duration-300 ${
          habit.completedToday ? 'text-zinc-400 line-through' : 'text-zinc-900'
        }`}>
          {habit.title}
        </h4>
        <p className={`text-[10px] md:text-xs font-medium transition-all duration-300 ${
          habit.completedToday ? 'text-zinc-300' : 'text-zinc-400'
        }`}>
          {habit.description}
        </p>
      </div>

      {/* Action & Stats */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
           <p className={`text-sm font-black tabular-nums ${habit.completedToday ? 'text-emerald-600' : config.color}`}>
             -{habit.co2SavingKg}kg
           </p>
           {habit.currentStreak > 0 && (
             <div className="flex items-center justify-end gap-0.5 text-[9px] font-black text-amber-500 uppercase tracking-widest">
               <Flame size={10} className="fill-amber-500" />
               {habit.currentStreak} DAY
             </div>
           )}
        </div>

        <button
          onClick={() => onToggle(habit.id, habit.completedToday)}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 ${
            habit.completedToday 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'bg-white border-2 border-zinc-100 text-zinc-300 hover:border-emerald-500 hover:text-emerald-500'
          }`}
        >
          {habit.completedToday ? <Check size={20} strokeWidth={3} /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
        </button>
      </div>
    </div>
  );
}

