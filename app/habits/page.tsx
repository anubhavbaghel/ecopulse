'use client';

import { AuthGuard } from '@/components/layout/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { HabitCard } from '@/components/habits/HabitCard';
import { StreakBanner } from '@/components/dashboard/StreakBanner';
import { useHabits } from '@/hooks/useHabits';
import { useHabitStore } from '@/lib/stores/habitStore';
import { Flame, CheckSquare, ChevronRight } from 'lucide-react';

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
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-[11px] text-[#5f6368] font-medium mb-3 animate-fade-in">
            <span>EcoPulse</span>
            <ChevronRight size={10} className="mt-0.5" />
            <span className="text-[#202124]">Habits</span>
          </div>

          {/* Header */}
          <div className="mb-6 animate-fade-in">
            <p className="text-subheading">Stacking Engine</p>
            <h1 className="font-bold text-[#202124]" style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
              Daily Habits
            </h1>
            <p className="text-xs mt-1" style={{ color: '#5f6368' }}>
              Form sustainable micro-habits that compound into substantial emission reductions
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div
                className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: '#dadce0', borderTopColor: '#1a73e8' }}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Streak + Stats */}
              <div className="animate-fade-in-up stagger-1">
                <StreakBanner streak={maxStreak} habitCount={completedCount} />
              </div>

              {/* Quick stats (GCP dashboard style metrics) */}
              <div
                className="grid grid-cols-3 gap-3 animate-fade-in-up stagger-2"
              >
                {[
                  { label: <><span className="hidden sm:inline">Today's </span>Progress</>, value: `${completedCount}/${totalCount}`, color: '#1a73e8' },
                  { label: <>Completion<span className="hidden sm:inline"> rate</span></>, value: `${Math.round(completionRate)}%`, color: '#b06000' },
                  { label: <><span className="hidden sm:inline">CO₂ potential saving</span><span className="inline sm:hidden">CO₂ savings</span></>, value: `-${totalSavingPotential.toFixed(1)} kg`, color: '#137333' },
                ].map(({ label, value, color }, idx) => (
                  <div
                    key={idx}
                    className="card p-3 text-center bg-white border border-[#dadce0] shadow-sm"
                  >
                    <p className="text-base font-bold tabular-nums" style={{ color }}>{value}</p>
                    <p className="text-[10px] mt-1 font-semibold" style={{ color: '#5f6368' }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="animate-fade-in-up stagger-2 bg-white border border-[#dadce0] rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#5f6368]">Daily Target Progress</span>
                  <span className="text-xs font-bold text-[#1a73e8] tabular-nums">{Math.round(completionRate)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${completionRate}%`, background: '#1a73e8' }} />
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
                  className="text-center py-12 rounded bg-white border border-[#dadce0] shadow-sm"
                >
                  <p className="text-3xl mb-2">🌱</p>
                  <p className="font-semibold text-xs" style={{ color: '#202124' }}>No habits found</p>
                  <p className="text-xs mt-1" style={{ color: '#5f6368' }}>
                    Please complete your onboarding profile to initialize habits
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
