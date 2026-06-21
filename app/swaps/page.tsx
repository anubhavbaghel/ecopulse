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
        body: JSON.stringify({
          endpoint: 'swaps',
          payload: {
            archetype: profile.archetype ?? 'lifestyle',
            topCategory: profile.topCategory ?? 'transport',
            weeklyAvgCo2,
          },
        }),
      });
      const data = await res.json();
      setSwaps(data.data.swaps as SwapSuggestion[]);
      setHasFetched(true);
    } catch (err) {
      setError('Could not load swaps. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [profile, weeklyAvgCo2]);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 animate-fade-in">
          <div>
            <p className="text-subheading">AI Recommendations</p>
            <h1 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--color-cream-100)', marginTop: '0.25rem' }}>
              Your Swaps
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-cream-400)' }}>
              Personalised by Gemini AI based on your lifestyle
            </p>
          </div>
          <button
            onClick={fetchSwaps}
            disabled={isLoading}
            className="btn-ghost flex items-center gap-2"
            style={{ flexShrink: 0 }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading…' : swaps.length > 0 ? 'Refresh' : 'Generate'}
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* AI swaps section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={15} style={{ color: 'var(--color-sage-400)' }} />
              <h2 className="text-heading" style={{ fontSize: '1rem' }}>Gemini-Powered Swaps</h2>
            </div>

            {!hasFetched && swaps.length === 0 && !isLoading && (
              <div
                className="flex flex-col items-center justify-center py-12 rounded-2xl text-center animate-fade-in"
                style={{ border: '1px dashed rgba(107,143,113,0.2)', background: 'var(--color-slate-800)' }}
              >
                <div className="text-4xl mb-3">✨</div>
                <p className="font-medium mb-1.5" style={{ color: 'var(--color-cream-300)' }}>
                  Ready to generate your swaps
                </p>
                <p className="text-sm mb-5" style={{ color: 'var(--color-cream-500)' }}>
                  Gemini AI will analyse your profile and suggest personalised alternatives
                  {profile?.archetype && (
                    <> for <span style={{ color: 'var(--color-sage-400)' }}>{profile.archetype}</span></>
                  )}
                </p>
                <button onClick={fetchSwaps} className="btn-primary">
                  <Sparkles size={15} />
                  Generate my Swaps
                </button>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center py-12 gap-4">
                <div
                  className="w-10 h-10 rounded-full border-2 animate-spin"
                  style={{ borderColor: 'var(--color-slate-600)', borderTopColor: 'var(--color-sage-500)' }}
                />
                <p style={{ color: 'var(--color-cream-400)', fontSize: '0.875rem' }}>
                  Gemini is crafting your personalised swaps…
                </p>
              </div>
            )}

            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.2)', color: 'var(--color-amber-400)' }}
              >
                {error}
              </div>
            )}

            {!isLoading && swaps.length > 0 && (
              <div className="flex flex-col gap-4">
                {swaps.map((swap, i) => (
                  <SwapCard key={i} swap={swap} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Mock Maps section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={15} style={{ color: 'var(--color-teal-400)' }} />
              <h2 className="text-heading" style={{ fontSize: '1rem' }}>
                Commute Comparison
              </h2>
            </div>
            <TransitMap routeId="commute-main" />
          </div>

          {/* Second route */}
          <TransitMap routeId="grocery-run" />
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
