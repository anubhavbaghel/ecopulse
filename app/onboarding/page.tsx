'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { completeOnboarding } from '@/lib/firestore/users';
import { ARCHETYPE_FALLBACKS } from '@/lib/constants';
import { AuthGuard } from '@/components/layout/AuthGuard';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: '#dadce0', borderTopColor: '#1a73e8' }}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <AuthGuard requireOnboarding={false}>
        <div />
      </AuthGuard>
    );
  }

  const handleQuickComplete = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const fb = ARCHETYPE_FALLBACKS.default;
      await completeOnboarding(
        user.uid,
        { mobility: 'mix', diet: 'balanced', homeSize: 'medium', renewable: false },
        fb.name,
        fb.description,
        fb.daily_co2_kg,
        'transport'
      );
      router.replace('/dashboard');
    } catch (err) {
      console.error('Onboarding quick complete failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full p-8">
        <h1 className="text-2xl font-bold mb-4">Onboarding</h1>
        <p className="mb-6 text-sm text-zinc-600">Complete a quick profile to get started.</p>
        <button onClick={handleQuickComplete} disabled={submitting} className="btn-primary">
          {submitting ? 'Completing…' : 'Complete Onboarding'}
        </button>
      </div>
    </main>
  );
}
