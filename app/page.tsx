'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/lib/stores/authStore';
import { Leaf, ArrowRight, Zap, BarChart3, CheckSquare } from 'lucide-react';

export default function LandingPage() {
  const { user, profile, loading } = useAuthStore();
  const router = useRouter();
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      if (profile && !profile.onboardingComplete) {
        router.replace('/onboarding');
      } else if (profile?.onboardingComplete) {
        router.replace('/dashboard');
      }
    }
  }, [user, profile, loading, router]);

  const handleGoogleSignIn = async () => {
    setSigning(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Redirect handled by useEffect above
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed';
      setError(msg.includes('popup-closed') ? 'Sign-in cancelled.' : 'Something went wrong. Please try again.');
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-slate-900)' }}>
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--color-slate-600)', borderTopColor: 'var(--color-sage-500)' }}
        />
      </div>
    );
  }

  const features = [
    { icon: BarChart3, title: 'Visual Carbon Pulse', desc: 'Track your daily impact across transport, diet, utilities, and shopping in real time.' },
    { icon: CheckSquare, title: 'Habit Stacking Engine', desc: 'Build sustainable micro-habits with streak tracking and gentle daily reminders.' },
    { icon: Zap, title: 'AI-Powered Swaps', desc: 'Gemini AI generates personalised alternatives tailored to your lifestyle archetype.' },
  ];

  return (
    <main className="relative min-h-screen flex flex-col" style={{ background: 'var(--color-slate-900)' }}>
      {/* Gradient mesh background */}
      <div className="mesh-bg" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(107,143,113,0.15)', border: '1px solid rgba(107,143,113,0.3)' }}
          >
            <Leaf size={16} style={{ color: 'var(--color-sage-400)' }} />
          </div>
          <span className="font-semibold" style={{ color: 'var(--color-cream-100)', fontSize: '1.05rem' }}>
            <span style={{ color: 'var(--color-sage-400)' }}>Eco</span>Pulse
          </span>
        </div>
        <span
          className="badge badge-sage text-xs"
          style={{ padding: '0.3rem 0.875rem' }}
        >
          MVP · v1.0
        </span>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-3xl mx-auto w-full">
        {/* Eyebrow */}
        <div
          className="badge badge-sage mb-6 animate-fade-in"
          style={{ fontSize: '0.75rem', padding: '0.35rem 1rem' }}
        >
          🌿 Your personal climate companion
        </div>

        {/* Headline */}
        <h1
          className="text-display mb-5 animate-fade-in-up"
          style={{ animationDelay: '0.1s', letterSpacing: '-0.02em' }}
        >
          Small actions.
          <br />
          <span style={{ color: 'var(--color-sage-400)' }}>Real impact.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-in-up mb-10"
          style={{
            color: 'var(--color-cream-300)',
            fontSize: '1.05rem',
            maxWidth: '480px',
            lineHeight: 1.7,
            animationDelay: '0.2s',
            opacity: 0,
          }}
        >
          EcoPulse turns your daily choices into a beautifully clear picture of your environmental footprint — then shows you exactly how to improve it.
        </p>

        {/* CTA */}
        <div
          className="flex flex-col items-center gap-3 animate-fade-in-up"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={signing}
            className="btn-primary"
            style={{ fontSize: '0.95rem', padding: '0.875rem 2rem', gap: '0.625rem' }}
          >
            {signing ? (
              <>
                <div
                  className="w-4 h-4 rounded-full border-2 animate-spin"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                />
                Signing in…
              </>
            ) : (
              <>
                {/* Google G icon */}
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2a10.3 10.3 0 0 0-.16-1.74H9v3.29h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91A8.78 8.78 0 0 0 17.64 9.2z" />
                  <path fill="#34A853" d="M9 18a8.6 8.6 0 0 0 5.96-2.18l-2.91-2.26a5.43 5.43 0 0 1-8.07-2.85H.96v2.33A9 9 0 0 0 9 18z" />
                  <path fill="#FBBC05" d="M3.98 10.71A5.4 5.4 0 0 1 3.7 9a5.4 5.4 0 0 1 .28-1.71V4.96H.96A9 9 0 0 0 0 9a9 9 0 0 0 .96 4.04l3.02-2.33z" />
                  <path fill="#EA4335" d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.58-2.58A8.65 8.65 0 0 0 9 0 9 9 0 0 0 .96 4.96l3.02 2.33A5.36 5.36 0 0 1 9 3.58z" />
                </svg>
                Continue with Google
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {error && (
            <p className="text-sm" style={{ color: 'var(--color-amber-400)' }}>{error}</p>
          )}

          <p className="text-xs" style={{ color: 'var(--color-cream-500)' }}>
            Your data is stored securely in Firebase. No spam, ever.
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative z-10 px-6 pb-16 max-w-4xl mx-auto w-full">
        <div
          className="grid gap-4 animate-fade-in-up"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            animationDelay: '0.5s',
            opacity: 0,
          }}
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5">
              <div
                className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center"
                style={{ background: 'rgba(107,143,113,0.12)', border: '1px solid rgba(107,143,113,0.2)' }}
              >
                <Icon size={17} style={{ color: 'var(--color-sage-400)' }} />
              </div>
              <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--color-cream-200)' }}>
                {title}
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-cream-400)', lineHeight: 1.65 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 text-center py-5 border-t"
        style={{ borderColor: 'rgba(107,143,113,0.1)' }}
      >
        <p className="text-xs" style={{ color: 'var(--color-cream-500)' }}>
          Powered by Gemini AI · Firebase · Next.js 15
        </p>
      </footer>
    </main>
  );
}
