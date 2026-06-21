'use client';

import { AuthGuard } from '@/components/layout/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { HabitCard } from '@/components/habits/HabitCard';
import { StreakBanner } from '@/components/dashboard/StreakBanner';
import { useHabits } from '@/hooks/useHabits';
import { useHabitStore } from '@/lib/stores/habitStore';
import { CheckSquare } from 'lucide-react';

function HabitsContent() {
  const { habits, isLoading, handleToggle } = useHabits();
  const { totalStreakDays } = useHabitStore();

  const completedCount = habits.filter((h) => h.completedToday).length;
  const totalCount = habits.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const maxStreak = habits.reduce((m, h) => Math.max(m, h.currentStreak), 0);
  const totalSavingPotential = habits.reduce((s, h) => s + h.co2SavingKg, 0);

  const pendingHabits = habits.filter((h) => !h.completedToday);
  const completedHabits = habits.filter((h) => h.completedToday);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="max-w-3xl mx-auto w-full">
          {/* Header Section */}
          <header className="flex flex-col gap-2 mb-10 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                Micro-Impacts
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
              Stacking <span className="text-emerald-600">Habits</span>
            </h1>
            <p className="text-zinc-500 font-medium text-sm md:text-base max-w-lg">
              Compound your environmental focus into substantial climate progress, one small choice at a time.
            </p>
          </header>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-zinc-100 border-t-emerald-500 animate-spin" />
              <p className="text-zinc-400 font-medium animate-pulse">Growing your habit engine...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {/* Stats Overview */}
              <section className="grid md:grid-cols-2 gap-6 items-start">
                <div className="animate-fade-in-up stagger-1 h-full">
                  <StreakBanner streak={maxStreak} habitCount={completedCount} />
                </div>

                <div className="animate-fade-in-up stagger-2 bg-white border border-zinc-100 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between gap-6 h-full">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Focus Snapshot</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                        <p className="text-sm font-black text-zinc-900">{Math.round(completionRate)}%</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Focus Score</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <p className="text-sm font-black text-emerald-600">-{totalSavingPotential.toFixed(1)}kg</p>
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">CO₂ Goal</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Daily Progress</span>
                      <span className="text-xs font-black text-zinc-900">{completedCount}/{totalCount}</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Habit Lists */}
              <div className="grid gap-10">
                {/* To-Do Section */}
                {pendingHabits.length > 0 && (
                  <section className="animate-fade-in-up stagger-3">
                    <div className="flex items-center justify-between mb-4 px-2">
                      <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Focus Areas</h3>
                      <span className="text-[10px] font-bold text-zinc-400">{pendingHabits.length} PENDING</span>
                    </div>
                    <div className="space-y-3">
                      {pendingHabits.map((habit) => (
                        <HabitCard key={habit.id} habit={habit} onToggle={handleToggle} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Completed Section */}
                {completedHabits.length > 0 && (
                  <section className="animate-fade-in-up stagger-4 opacity-70">
                    <div className="flex items-center justify-between mb-4 px-2 text-emerald-600">
                      <h3 className="text-sm font-bold uppercase tracking-widest">Locked In</h3>
                      <CheckSquare size={16} />
                    </div>
                    <div className="space-y-3">
                      {completedHabits.map((habit) => (
                        <HabitCard key={habit.id} habit={habit} onToggle={handleToggle} />
                      ))}
                    </div>
                  </section>
                )}

                {habits.length === 0 && (
                  <div className="text-center py-12 rounded bg-white border border-[#dadce0] shadow-sm">
                    <p className="text-3xl mb-2">🌱</p>
                    <p className="font-semibold text-xs" style={{ color: '#202124' }}>No habits found</p>
                    <p className="text-xs mt-1" style={{ color: '#5f6368' }}>
                      Please complete your onboarding profile to initialize habits
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function HabitsPage() {
  return (
    <AuthGuard>
      <HabitsContent />
    </AuthGuard>
  );
}
