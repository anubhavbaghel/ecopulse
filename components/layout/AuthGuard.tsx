'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export function AuthGuard({ children, requireOnboarding = true }: AuthGuardProps) {
  const { user, profile, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/');
      return;
    }
    if (requireOnboarding && profile && !profile.onboardingComplete) {
      router.replace('/onboarding');
    }
  }, [user, profile, loading, requireOnboarding, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-slate-900)' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--color-slate-600)', borderTopColor: 'var(--color-sage-500)' }}
          />
          <p style={{ color: 'var(--color-cream-400)', fontSize: '0.875rem' }}>Loading EcoPulse…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (requireOnboarding && profile && !profile.onboardingComplete) return null;

  return <>{children}</>;
}
