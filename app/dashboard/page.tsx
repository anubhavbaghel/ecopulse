'use client';

import { useEffect, useState } from 'react';
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
import { PenLine, Leaf } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES: CategoryType[] = ['transport', 'diet', 'utilities', 'shopping'];

function DashboardContent() {
  const { user, profile } = useAuthStore();
  const {
    activities, todayTotalKg, dailyTargetKg, categoryTotals, weeklyData,
    setActivities, setWeeklyData, setDailyTarget, removeActivity,
  } = useCarbonStore();
  const { habits, hasLoaded, setHabits } = useHabitStore();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [todayActs, weekly, loadedHabits] = await Promise.all([
          getTodayActivities(user.uid),
          getWeeklyDailyTotals(user.uid),
          hasLoaded ? Promise.resolve(null) : getHabits(user.uid),
        ]);

        setLoadError('');
        setActivities(todayActs);
        setWeeklyData(weekly);

        if (loadedHabits) {
          let habitsList = loadedHabits;
          if (habitsList.length === 0) {
            habitsList = await seedDefaultHabits(user.uid);
          }
          setHabits(habitsList);
        }

        if (profile?.dailyTargetKg) {
          setDailyTarget(profile.dailyTargetKg);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
        setLoadError('Failed to load dashboard data. Please try refreshing.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, profile, hasLoaded, setActivities, setDailyTarget, setHabits, setWeeklyData]);

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
        <div className="max-w-6xl mx-auto w-full">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                  Live Pulse
                </span>
                <span className="text-zinc-400 text-xs font-medium">{dateStr}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                {greeting}, <span className="text-emerald-600">{user?.displayName?.split(' ')[0] ?? 'Explorer'}</span>
              </h1>
              {profile?.archetype && (
                <p className="text-sm font-medium text-zinc-500">
                  Current Archetype: <span className="text-zinc-900">{profile.archetype}</span>
                </p>
              )}
            </div>
            
            <Link 
              href="/log" 
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white font-bold rounded-2xl transition-all duration-300 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-95 overflow-hidden"
            >
              <PenLine size={18} className="relative z-10" />
              <span className="relative z-10">Log Activity</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </header>

          {loadError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium flex items-center justify-between">
              <span>{loadError}</span>
              <button onClick={() => window.location.reload()} className="underline font-semibold">Reload</button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-zinc-100 border-t-emerald-500 animate-spin" />
              <p className="text-zinc-400 font-medium animate-pulse">Syncing your climate log...</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Left Side: Summary & Trends */}
              <div className="lg:col-span-5 space-y-8">
                {/* Main Gauge Card */}
                <section className="glass rounded-[2rem] p-8 flex flex-col items-center relative overflow-hidden animate-fade-in-up stagger-1">
                  <div className="absolute top-0 right-0 p-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Leaf size={24} />
                    </div>
                  </div>
                  <PulseGauge current={todayTotalKg} target={dailyTargetKg} />
                  <div className="mt-6 text-center">
                    <p className="text-zinc-500 text-sm font-medium">Daily Carbon Footprint</p>
                    <p className="text-zinc-400 text-xs mt-1 italic">Target: {dailyTargetKg}kg CO₂e</p>
                  </div>
                </section>

                {/* Streak Banner with New Look */}
                <div className="animate-fade-in-up stagger-2">
                   <StreakBanner streak={maxStreak} habitCount={completedHabitsToday} />
                </div>

                {/* Weekly Trends */}
                <section className="bg-white border border-zinc-100 rounded-[2rem] p-6 shadow-sm animate-fade-in-up stagger-3">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6 px-2">Weekly Performance</h3>
                  <WeeklySparkline data={weeklyData} />
                </section>
              </div>

              {/* Right Side: Details & Log */}
              <div className="lg:col-span-7 space-y-8">
                {/* Category Breakdown */}
                <section className="animate-fade-in-up stagger-2">
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">Breakdown by Source</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                </section>

                {/* Activity Feed Overhaul */}
                <section className="animate-fade-in-up stagger-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Recent Activity</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">
                        {activities.length} Entries
                      </span>
                    </div>
                  </div>
                  <div className="bg-white border border-zinc-100 rounded-[2rem] p-2 shadow-sm">
                    <DailyFeed activities={activities} onDelete={handleDeleteActivity} />
                  </div>
                </section>
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
