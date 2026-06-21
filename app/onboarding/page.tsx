'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { completeOnboarding } from '@/lib/firestore/users';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { MobilityType, DietType, HomeSizeType, OnboardingAnswers } from '@/types/user';
import { ArchetypeResult } from '@/types/gemini';
import { Car, TrainFront, Bike, Wind, Beef, Salad, Leaf, Sprout, Home, Building2, Castle, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

/* ── Step definitions ────────────────────────────────────────────────────── */

const MOBILITY_OPTIONS: { id: MobilityType; label: string; icon: React.ComponentType<{ size: number; style?: React.CSSProperties }> }[] = [
  { id: 'car', label: 'Drive a Car', icon: Car },
  { id: 'transit', label: 'Public Transit', icon: TrainFront },
  { id: 'bike', label: 'Bike / Walk', icon: Bike },
  { id: 'mix', label: 'Mixed modes', icon: Wind },
];

const DIET_OPTIONS: { id: DietType; label: string; icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>; desc: string }[] = [
  { id: 'meat-heavy', label: 'Meat every day', icon: Beef, desc: 'Red & white meat at most meals' },
  { id: 'balanced', label: 'Balanced diet', icon: Salad, desc: 'Meat a few times a week' },
  { id: 'plant-based', label: 'Mostly plants', icon: Leaf, desc: 'Occasional meat or fish' },
  { id: 'vegan', label: 'Vegan / fully plant-based', icon: Sprout, desc: 'No animal products' },
];

const HOME_OPTIONS: { id: HomeSizeType; label: string; icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>; desc: string }[] = [
  { id: 'studio', label: 'Studio / Flat', icon: Building2, desc: 'Small apartment, shared utilities' },
  { id: 'small', label: 'Small House', icon: Home, desc: '2–3 rooms, moderate energy use' },
  { id: 'medium', label: 'Family Home', icon: Home, desc: '3–4 bedrooms, average energy use' },
  { id: 'large', label: 'Large Home', icon: Castle, desc: '5+ rooms, high energy use' },
];

/* ── Archetype Reveal ─────────────────────────────────────────────────────── */
function ArchetypeReveal({
  result,
  onEnter,
}: {
  result: ArchetypeResult;
  onEnter: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-6 animate-fade-in-scale">
      {/* Icon circle */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center animate-float"
        style={{ background: 'rgba(107,143,113,0.12)', border: '2px solid rgba(107,143,113,0.3)' }}
      >
        <Leaf size={36} style={{ color: 'var(--color-sage-400)' }} />
      </div>

      <div>
        <p className="text-subheading mb-2">Your lifestyle archetype</p>
        <h2
          className="font-serif mb-3"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--color-cream-100)', lineHeight: 1.2 }}
        >
          {result.archetype_name}
        </h2>
        <p style={{ color: 'var(--color-cream-300)', maxWidth: '420px', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {result.archetype_description}
        </p>
      </div>

      {/* Baseline metric */}
      <div
        className="card px-8 py-4 text-center"
        style={{ background: 'var(--color-slate-750)' }}
      >
        <p className="text-subheading mb-1">Estimated daily footprint</p>
        <div className="flex items-baseline justify-center gap-1.5">
          <span
            className="tabular font-semibold"
            style={{ fontSize: '2.5rem', color: 'var(--color-cream-100)', letterSpacing: '-0.03em' }}
          >
            {result.daily_co2_kg.toFixed(1)}
          </span>
          <span style={{ color: 'var(--color-cream-400)', fontSize: '1rem' }}>kg CO₂e / day</span>
        </div>
        <p className="text-xs mt-1.5" style={{ color: 'var(--color-cream-500)' }}>
          We'll help you lower this, one step at a time
        </p>
      </div>

      {/* Initial swaps preview */}
      <div className="w-full max-w-md flex flex-col gap-2">
        <p className="text-subheading text-left">Your first 3 swaps</p>
        {result.initial_swaps.slice(0, 3).map((swap, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'var(--color-slate-800)', border: '1px solid rgba(107,143,113,0.1)' }}
          >
            <CheckCircle2 size={15} style={{ color: 'var(--color-sage-400)', flexShrink: 0 }} />
            <span className="text-sm" style={{ color: 'var(--color-cream-300)' }}>{swap.title}</span>
            <span
              className="ml-auto text-xs font-semibold tabular flex-shrink-0"
              style={{ color: 'var(--color-sage-400)' }}
            >
              −{swap.co2_saving_kg_per_week.toFixed(1)} kg/wk
            </span>
          </div>
        ))}
      </div>

      <button onClick={onEnter} className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2.5rem', gap: '0.75rem' }}>
        Enter EcoPulse
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

/* ── Main Onboarding Page ─────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const { user, setProfile } = useAuthStore();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});
  const [renewable, setRenewable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchetypeResult | null>(null);
  const [error, setError] = useState('');

  const steps = ['Mobility', 'Diet', 'Home'];

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    setError('');

    const fullAnswers: OnboardingAnswers = {
      mobility: answers.mobility ?? 'mix',
      diet: answers.diet ?? 'balanced',
      homeSize: answers.homeSize ?? 'medium',
      renewable,
    };

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: 'archetype', payload: fullAnswers }),
      });
      const data = await res.json();
      const archResult: ArchetypeResult = data.data;
      setResult(archResult);

      // Save to Firestore
      await completeOnboarding(
        user.uid,
        fullAnswers,
        archResult.archetype_name,
        archResult.archetype_description,
        archResult.daily_co2_kg,
        archResult.top_category
      );
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleEnterApp = () => {
    // Profile will be reloaded by AuthProvider
    router.replace('/dashboard');
  };

  const progressPct = ((step + (result ? 1 : 0)) / (steps.length + 1)) * 100;

  if (!user) {
    return (
      <AuthGuard requireOnboarding={false}>
        <div />
      </AuthGuard>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative"
      style={{ background: 'var(--color-slate-900)' }}
    >
      <div className="mesh-bg" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo + progress */}
        {!result && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Leaf size={16} style={{ color: 'var(--color-sage-400)' }} />
                <span className="font-semibold" style={{ color: 'var(--color-cream-300)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-sage-400)' }}>Eco</span>Pulse
                </span>
              </div>
              <span className="text-sm" style={{ color: 'var(--color-cream-500)' }}>
                {step + 1} / {steps.length}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((s, i) => (
                <span
                  key={s}
                  style={{
                    fontSize: '0.7rem',
                    color: i <= step ? 'var(--color-sage-400)' : 'var(--color-cream-500)',
                    fontWeight: i === step ? 600 : 400,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Step content */}
        {result ? (
          <ArchetypeReveal result={result} onEnter={handleEnterApp} />
        ) : step === 0 ? (
          /* ── Mobility Step ── */
          <div className="animate-fade-in-up">
            <h2 className="text-heading mb-1" style={{ fontSize: '1.5rem' }}>
              How do you mainly get around?
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-cream-400)' }}>
              This is typically the biggest lever in your footprint
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {MOBILITY_OPTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`quiz-option ${answers.mobility === id ? 'selected' : ''}`}
                  onClick={() => setAnswers((p) => ({ ...p, mobility: id }))}
                >
                  <Icon size={28} />
                  <p className="text-sm font-medium mt-2" style={{ color: 'var(--color-cream-200)' }}>{label}</p>
                </button>
              ))}
            </div>
            <button
              className="btn-primary w-full justify-center"
              disabled={!answers.mobility}
              onClick={() => setStep(1)}
              style={{ opacity: answers.mobility ? 1 : 0.4 }}
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
        ) : step === 1 ? (
          /* ── Diet Step ── */
          <div className="animate-fade-in-up">
            <h2 className="text-heading mb-1" style={{ fontSize: '1.5rem' }}>
              How would you describe your diet?
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-cream-400)' }}>
              Food choices are a major source of personal emissions
            </p>
            <div className="flex flex-col gap-3 mb-6">
              {DIET_OPTIONS.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  className={`quiz-option flex items-center gap-3 text-left ${answers.diet === id ? 'selected' : ''}`}
                  onClick={() => setAnswers((p) => ({ ...p, diet: id }))}
                >
                  <Icon size={22} style={{ flexShrink: 0 }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-cream-200)' }}>{label}</p>
                    <p className="text-xs" style={{ color: 'var(--color-cream-500)' }}>{desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost flex-1 justify-center" onClick={() => setStep(0)}>Back</button>
              <button
                className="btn-primary flex-1 justify-center"
                disabled={!answers.diet}
                onClick={() => setStep(2)}
                style={{ opacity: answers.diet ? 1 : 0.4 }}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* ── Home Step ── */
          <div className="animate-fade-in-up">
            <h2 className="text-heading mb-1" style={{ fontSize: '1.5rem' }}>
              Tell us about your home
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-cream-400)' }}>
              Home energy is often overlooked but very impactful
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {HOME_OPTIONS.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  className={`quiz-option ${answers.homeSize === id ? 'selected' : ''}`}
                  onClick={() => setAnswers((p) => ({ ...p, homeSize: id }))}
                >
                  <Icon size={24} />
                  <p className="text-sm font-medium mt-2" style={{ color: 'var(--color-cream-200)' }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-cream-500)' }}>{desc}</p>
                </button>
              ))}
            </div>

            {/* Renewable toggle */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl mb-6"
              style={{ background: 'var(--color-slate-750)', border: '1px solid rgba(107,143,113,0.12)' }}
            >
              <div className="flex items-center gap-2.5">
                <Zap size={16} style={{ color: 'var(--color-amber-400)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-cream-200)' }}>Renewable energy?</p>
                  <p className="text-xs" style={{ color: 'var(--color-cream-500)' }}>Solar, wind, green tariff</p>
                </div>
              </div>
              <button
                onClick={() => setRenewable((r) => !r)}
                className="relative"
                style={{
                  width: '44px',
                  height: '24px',
                  background: renewable ? 'var(--color-sage-600)' : 'var(--color-slate-600)',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '3px',
                    left: renewable ? '23px' : '3px',
                    width: '18px',
                    height: '18px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'left 0.2s ease',
                  }}
                />
              </button>
            </div>

            {error && (
              <p className="text-sm text-center mb-3" style={{ color: 'var(--color-amber-400)' }}>{error}</p>
            )}

            <div className="flex gap-3">
              <button className="btn-ghost flex-1 justify-center" onClick={() => setStep(1)}>Back</button>
              <button
                className="btn-primary flex-1 justify-center"
                disabled={!answers.homeSize || loading}
                onClick={handleSubmit}
                style={{ opacity: answers.homeSize && !loading ? 1 : 0.5 }}
              >
                {loading ? (
                  <>
                    <div
                      className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                    />
                    Analysing…
                  </>
                ) : (
                  <>Generate my profile <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
