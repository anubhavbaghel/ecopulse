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
import { PenLine, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES: CategoryType[] = ['transport', 'diet', 'utilities', 'shopping'];

function DashboardContent() {
  const { user, profile } = useAuthStore();
  const {
    activities, todayTotalKg, dailyTargetKg, categoryTotals, weeklyData,
    setActivities, setWeeklyData, setDailyTarget, removeActivity,
  } = useCarbonStore();
  const { habits, setHabits } = useHabitStore();
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
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-[11px] text-[#5f6368] font-medium mb-3 animate-fade-in">
            <span>EcoPulse</span>
            <ChevronRight size={10} className="mt-0.5" />
            <span className="text-[#202124]">Dashboard</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 animate-fade-in">
            <div>
              <p className="text-subheading">{dateStr}</p>
              <h1 className="font-bold text-[#202124]" style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', marginTop: '0.25rem' }}>
                {greeting}, {user?.displayName?.split(' ')[0] ?? 'there'} 🌿
              </h1>
              {profile?.archetype && (
                <p className="text-xs mt-0.5" style={{ color: '#5f6368', fontWeight: 500 }}>
                  Archetype: <span className="text-[#1a73e8]">{profile.archetype}</span>
                </p>
              )}
            </div>
            <div className="self-start sm:self-auto">
              <Link href="/log" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.82rem', gap: '0.375rem' }}>
                <PenLine size={13} />
                Log Activity
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div
                className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: '#dadce0', borderTopColor: '#1a73e8' }}
              />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-12">
              {/* Left column (8 grid sizes on large screen) */}
              <div className="md:col-span-5 flex flex-col gap-6">
                {/* Pulse Gauge */}
                <div className="card flex flex-col items-center p-6 pb-8 animate-fade-in-up stagger-1">
                  <div className="w-full flex items-center justify-between border-b border-[#dadce0] pb-2.5 mb-4 px-1">
                    <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider">Carbon Telemetry</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      todayTotalKg > dailyTargetKg ? 'bg-[#fce8e6] text-[#d93025] border-[#fad2cf]' : 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'
                    }`}>
                      {todayTotalKg > dailyTargetKg ? 'LIMIT_EXCEEDED' : 'STATUS_OK'}
                    </span>
                  </div>
                  <PulseGauge current={todayTotalKg} target={dailyTargetKg} />
                </div>

                {/* Streak */}
                <div className="animate-fade-in-up stagger-2">
                  <StreakBanner streak={maxStreak} habitCount={completedHabitsToday} />
                </div>

                {/* Weekly sparkline */}
                <div className="card p-6 animate-fade-in-up stagger-3">
                  <p className="text-subheading mb-4">7-Day Trend</p>
                  <WeeklySparkline data={weeklyData} />
                </div>
              </div>

              {/* Right column (7 grid sizes on large screen) */}
              <div className="md:col-span-7 flex flex-col gap-6">
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
                    <span className="text-xs font-semibold" style={{ color: '#5f6368' }}>
                      {activities.length} entries
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
