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
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: '#dadce0', borderTopColor: '#1a73e8' }}
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
    <main className="relative min-h-screen flex flex-col items-center w-full" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl w-full border-b border-[#dadce0]" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: '#e8f0fe', border: '1px solid #d2e3fc' }}
          >
            <Leaf size={16} style={{ color: '#1a73e8' }} />
          </div>
          <span className="font-semibold" style={{ color: '#202124', fontSize: '1.05rem' }}>
            <span style={{ color: '#1a73e8' }}>Eco</span>Pulse
          </span>
        </div>
        <span
          className="badge badge-teal text-xs"
          style={{ padding: '0.25rem 0.75rem' }}
        >
          MVP · v1.0
        </span>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-3xl w-full" style={{ backgroundColor: '#f8f9fa' }}>
        {/* Eyebrow */}
        <div
          className="badge badge-teal mb-6 animate-fade-in text-center mx-auto"
          style={{ fontSize: '0.75rem', padding: '0.3rem 0.85rem' }}
        >
          🌿 Your personal climate companion
        </div>

        {/* Headline */}
        <h1
          className="text-display mb-5 text-center animate-fade-in-up font-bold w-full"
          style={{ animationDelay: '0.1s', letterSpacing: '-0.02em', color: '#202124' }}
        >
          Small actions.
          <br />
          <span style={{ color: '#1a73e8' }}>Real impact.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-in-up mb-8 text-center mx-auto w-full"
          style={{
            color: '#3c4043',
            fontSize: '1.05rem',
            maxWidth: '520px',
            lineHeight: 1.6,
            animationDelay: '0.2s',
          }}
        >
          EcoPulse turns your daily choices into a beautifully clear picture of your environmental footprint — then shows you exactly how to improve it.
        </p>

        {/* CTA */}
        <div
          className="flex flex-col items-center justify-center gap-3 animate-fade-in-up w-full mx-auto"
          style={{ animationDelay: '0.3s' }}
        >
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={signing}
            className="flex items-center justify-center gap-3 transition-all cursor-pointer mx-auto"
            style={{
              background: '#ffffff',
              color: '#3c4043',
              border: '1px solid #dadce0',
              borderRadius: '4px',
              padding: '0.75rem 1.75rem',
              fontSize: '0.95rem',
              fontWeight: 500,
              boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3)',
            }}
          >
            {signing ? (
              <>
                <div
                  className="w-4 h-4 rounded-full border-2 animate-spin"
                  style={{ borderColor: '#dadce0', borderTopColor: '#1a73e8' }}
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
                <ArrowRight size={16} style={{ color: '#1a73e8' }} />
              </>
            )}
          </button>

          {error && (
            <p className="text-sm text-center" style={{ color: '#d93025' }}>{error}</p>
          )}

          <p className="text-xs mt-1 text-center" style={{ color: '#5f6368' }}>
            Your data is stored securely in Firebase. No spam, ever.
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative z-10 px-6 pb-16 max-w-5xl w-full flex justify-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div
          className="grid gap-6 animate-fade-in-up w-full"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            animationDelay: '0.4s',
          }}
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 flex flex-col items-center text-center shadow-sm"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dadce0',
                borderRadius: '8px',
              }}
            >
              <div
                className="w-10 h-10 rounded-full mb-4 flex items-center justify-center"
                style={{ background: '#e8f0fe', border: '1px solid #d2e3fc' }}
              >
                <Icon size={18} style={{ color: '#1a73e8' }} />
              </div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#202124' }}>
                {title}
              </h3>
              <p className="text-xs" style={{ color: '#5f6368', lineHeight: 1.6 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 text-center py-6 border-t border-[#dadce0] w-full mt-auto"
        style={{ backgroundColor: '#ffffff' }}
      >
        <p className="text-xs text-center" style={{ color: '#5f6368' }}>
          Powered by Gemini AI · Firebase · Next.js 15
        </p>
      </footer>
    </main>
  );
}
