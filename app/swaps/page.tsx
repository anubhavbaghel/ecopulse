'use client';

import { useState, useCallback } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { SwapCard } from '@/components/swaps/SwapCard';
import { TransitMap } from '@/components/swaps/TransitMap';
import { useAuthStore } from '@/lib/stores/authStore';
import { useSwapStore } from '@/lib/stores/swapStore';
import { useCarbonStore } from '@/lib/stores/carbonStore';
import { SwapSuggestion } from '@/types/gemini';
import { RefreshCw, Sparkles, MapPin } from 'lucide-react';

function SwapsContent() {
  const { profile } = useAuthStore();
  const { weeklyData } = useCarbonStore();
  const { swaps, isLoading, setSwaps, setLoading } = useSwapStore();
  const [error, setError] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  const weeklyAvgCo2 = weeklyData.reduce((s, v) => s + v, 0) / 7;

  const fetchSwaps = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: 'swaps', payload: { archetype: profile.archetype ?? 'lifestyle', topCategory: profile.topCategory ?? 'transport', weeklyAvgCo2 } }),
      });
      const data = await res.json();
      setSwaps(data.data.swaps as SwapSuggestion[]);
      setHasFetched(true);
    } catch {
      setError('Could not load swaps. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [profile, setLoading, setSwaps, weeklyAvgCo2]);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="max-w-4xl mx-auto w-full">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in text-balance">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                  <Sparkles size={14} />
                </div>
                <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">Artificial Intelligence</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">Lifestyle <span className="text-violet-600">Swaps</span></h1>
              <p className="text-zinc-500 font-medium text-sm md:text-base max-w-lg">Gemini AI analysis of your habits and log data to find high-impact, achievable alternatives.</p>
            </div>

            <button onClick={fetchSwaps} disabled={isLoading} className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white font-bold rounded-2xl transition-all duration-300 hover:bg-violet-700 active:scale-95 disabled:opacity-50">
              <RefreshCw size={18} className={`relative z-10 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="relative z-10">{isLoading ? 'Analyzing...' : swaps.length > 0 ? 'Regenerate' : 'Generate Insights'}</span>
            </button>
          </header>

          <div className="grid lg:grid-cols-1 gap-12">
            <section>
              {error && <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold mb-6">{error}</div>}

              {!hasFetched && swaps.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-[3rem] border-dashed border-2 border-zinc-200 bg-zinc-50/30">
                  <div className="w-20 h-20 rounded-3xl bg-violet-50 text-violet-600 flex items-center justify-center mb-6 shadow-xl">
                    <Sparkles size={40} />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mb-2 tracking-tight">Ready for analysis?</h3>
                  <p className="text-zinc-500 text-sm max-w-xs mb-8">Click generate to receive personalized swaps tailored to your daily activities.</p>
                  <button onClick={fetchSwaps} className="px-8 py-3 bg-zinc-900 text-white font-bold rounded-2xl">Get Started</button>
                </div>
              ) : isLoading ? (
                <div className="grid md:grid-cols-2 gap-6">{[1,2,3,4].map(i => (<div key={i} className="h-64 rounded-[2.5rem] bg-zinc-100 animate-pulse" />))}</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">{swaps.map((swap, idx) => (<SwapCard key={idx} swap={swap} index={idx} />))}</div>
              )}
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><MapPin size={14} /></div>
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Smart Mobility Companion</h3>
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">LIVE PREVIEW</span>
              </div>
              <div className="glass rounded-[2rem] overflow-hidden p-2 bg-white shadow-xl">
                <TransitMap />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SwapsPage() {
  return (
    <AuthGuard>
      <SwapsContent />
    </AuthGuard>
  );
}


