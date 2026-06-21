'use client';

import { AuthGuard } from '@/components/layout/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { HabitCard } from '@/components/habits/HabitCard';
import { StreakBanner } from '@/components/dashboard/StreakBanner';
import { useHabits } from '@/hooks/useHabits';
import { useHabitStore } from '@/lib/stores/habitStore';
import { Flame, CheckSquare } from 'lucide-react';

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
        <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <p className="text-subheading">Daily Habits</p>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--color-cream-100)', marginTop: '0.25rem' }}>
            Habit Stacking Engine
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-cream-400)' }}>
            Small consistent actions compound into lasting change
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'var(--color-slate-600)', borderTopColor: 'var(--color-sage-500)' }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Streak + Stats */}
            <div className="animate-fade-in-up stagger-1">
              <StreakBanner streak={maxStreak} habitCount={completedCount} />
            </div>

            {/* Quick stats */}
            <div
              className="grid grid-cols-3 gap-3 animate-fade-in-up stagger-2"
            >
              {[
                { label: "Today's progress", value: `${completedCount}/${totalCount}`, icon: CheckSquare, color: 'var(--color-sage-400)' },
                { label: 'Completion', value: `${Math.round(completionRate)}%`, icon: Flame, color: 'var(--color-amber-400)' },
                { label: 'CO₂ potential', value: `-${totalSavingPotential.toFixed(1)} kg`, icon: Flame, color: 'var(--color-teal-400)' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="card p-3 text-center"
                >
                  <p className="text-lg font-semibold tabular" style={{ color }}>{value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-cream-500)' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="animate-fade-in-up stagger-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: 'var(--color-cream-400)' }}>Today's completion</span>
                <span className="text-xs tabular" style={{ color: 'var(--color-cream-400)' }}>{Math.round(completionRate)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${completionRate}%` }} />
              </div>
            </div>

            {/* Pending habits */}
            {pendingHabits.length > 0 && (
              <div className="animate-fade-in-up stagger-3">
                <p className="text-subheading mb-3">
                  To complete today · {pendingHabits.length} remaining
                </p>
                <div className="flex flex-col gap-2">
                  {pendingHabits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} onToggle={handleToggle} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed habits */}
            {completedHabits.length > 0 && (
              <div className="animate-fade-in-up stagger-4">
                <p className="text-subheading mb-3">
                  Completed today · {completedHabits.length} done
                </p>
                <div className="flex flex-col gap-2">
                  {completedHabits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} onToggle={handleToggle} />
                  ))}
                </div>
              </div>
            )}

            {habits.length === 0 && (
              <div
                className="text-center py-12 rounded-2xl"
                style={{ border: '1px dashed rgba(107,143,113,0.2)' }}
              >
                <p className="text-3xl mb-3">🌱</p>
                <p style={{ color: 'var(--color-cream-400)' }}>No habits found</p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-cream-500)' }}>
                  Complete onboarding to get your default habits
                </p>
              </div>
            )}
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
