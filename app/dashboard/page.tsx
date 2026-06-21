'use client';

import { useEffect, useState, useCallback } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { PulseGauge } from '@/components/dashboard/PulseGauge';
import { CategoryCard } from '@/components/dashboard/CategoryCard';
import { DailyFeed } from '@/components/dashboard/DailyFeed';
import { WeeklySparkline } from '@/components/dashboard/WeeklySparkline';
import { StreakBanner } from '@/components/dashboard/StreakBanner';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCarbonStore } from '@/lib/stores/carbonStore';
import { useHabitStore } from '@/lib/stores/habitStore';
import { getTodayActivities, getWeeklyDailyTotals, deleteActivity } from '@/lib/firestore/activities';
import { getHabits, seedDefaultHabits } from '@/lib/firestore/habits';
import { CategoryType } from '@/types/user';
import { PenLine } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES: CategoryType[] = ['transport', 'diet', 'utilities', 'shopping'];

function DashboardContent() {
  const { user, profile } = useAuthStore();
  const {
    activities, todayTotalKg, dailyTargetKg, categoryTotals, weeklyData,
    setActivities, setWeeklyData, setDailyTarget, removeActivity,
  } = useCarbonStore();
  const { habits, totalStreakDays, setHabits } = useHabitStore();
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [todayActs, weekly, loadedHabits] = await Promise.all([
        getTodayActivities(user.uid),
        getWeeklyDailyTotals(user.uid),
        getHabits(user.uid),
      ]);

      setActivities(todayActs);
      setWeeklyData(weekly);

      let habits = loadedHabits;
      if (habits.length === 0) {
        habits = await seedDefaultHabits(user.uid);
      }
      setHabits(habits);

      if (profile?.dailyTargetKg) {
        setDailyTarget(profile.dailyTargetKg);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, profile]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDeleteActivity = async (id: string) => {
    if (!user) return;
    removeActivity(id);
    await deleteActivity(user.uid, id);
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const completedHabitsToday = habits.filter((h) => h.completedToday).length;
  const maxStreak = habits.reduce((m, h) => Math.max(m, h.currentStreak), 0);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 animate-fade-in">
          <div>
            <p className="text-subheading">{dateStr}</p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--color-cream-100)', marginTop: '0.25rem' }}>
              {greeting}, {user?.displayName?.split(' ')[0] ?? 'there'} 🌿
            </h1>
            {profile?.archetype && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-cream-400)' }}>
                {profile.archetype}
              </p>
            )}
          </div>
          <Link href="/log" className="btn-primary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}>
            <PenLine size={15} />
            Log Activity
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'var(--color-slate-600)', borderTopColor: 'var(--color-sage-500)' }}
            />
          </div>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {/* Left column */}
            <div className="flex flex-col gap-6">
              {/* Pulse Gauge */}
              <div
                className="card flex flex-col items-center py-8 px-4 animate-fade-in-up stagger-1"
              >
                <PulseGauge current={todayTotalKg} target={dailyTargetKg} />
              </div>

              {/* Streak */}
              <div className="animate-fade-in-up stagger-2">
                <StreakBanner streak={maxStreak} habitCount={completedHabitsToday} />
              </div>

              {/* Weekly sparkline */}
              <div className="card p-5 animate-fade-in-up stagger-3">
                <p className="text-subheading mb-4">7-Day Trend</p>
                <WeeklySparkline data={weeklyData} />
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              {/* Category cards */}
              <div className="animate-fade-in-up stagger-2">
                <p className="text-subheading mb-3">Today by Category</p>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => {
                    const catTotal = categoryTotals[cat] ?? 0;
                    const pct = todayTotalKg > 0 ? (catTotal / todayTotalKg) * 100 : 0;
                    return (
                      <CategoryCard
                        key={cat}
                        category={cat}
                        totalKg={catTotal}
                        percentOfTotal={pct}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Activity feed */}
              <div className="animate-fade-in-up stagger-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-subheading">Today's Activity Log</p>
                  <span className="text-xs tabular" style={{ color: 'var(--color-cream-500)' }}>
                    {activities.length} entr{activities.length !== 1 ? 'ies' : 'y'}
                  </span>
                </div>
                <DailyFeed activities={activities} onDelete={handleDeleteActivity} />
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
