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
  { id: 'vegan', label: 'Vegan / plant-based', icon: Sprout, desc: 'No animal products' },
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
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: '#e8f0fe', border: '1.5px solid #d2e3fc' }}
      >
        <Leaf size={28} style={{ color: '#1a73e8' }} />
      </div>

      <div>
        <p className="text-subheading mb-1.5">Your lifestyle archetype</p>
        <h2
          className="mb-2 font-bold"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', color: '#202124', lineHeight: 1.25 }}
        >
          {result.archetype_name}
        </h2>
        <p style={{ color: '#5f6368', maxWidth: '440px', lineHeight: 1.6, fontSize: '0.875rem' }}>
          {result.archetype_description}
        </p>
      </div>

      {/* Baseline metric */}
      <div
        className="card px-8 py-5 text-center"
        style={{ background: '#ffffff', borderColor: '#dadce0', width: '100%' }}
      >
        <p className="text-subheading mb-1">Estimated daily footprint</p>
        <div className="flex items-baseline justify-center gap-1">
          <span
            className="tabular font-bold"
            style={{ fontSize: '2.25rem', color: '#202124', letterSpacing: '-0.02em' }}
          >
            {result.daily_co2_kg.toFixed(1)}
          </span>
          <span style={{ color: '#5f6368', fontSize: '0.875rem', marginLeft: '0.25rem' }}>kg CO₂e / day</span>
        </div>
        <p className="text-xs mt-1" style={{ color: '#70757a' }}>
          We'll help you lower this, one step at a time
        </p>
      </div>

      {/* Initial swaps preview */}
      <div className="w-full flex flex-col gap-2">
        <p className="text-subheading text-left mb-1">Your first 3 swaps</p>
        {result.initial_swaps.slice(0, 3).map((swap, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 rounded border border-[#dadce0] bg-white text-left"
          >
            <CheckCircle2 size={16} style={{ color: '#137333', flexShrink: 0 }} />
            <span className="text-xs font-medium" style={{ color: '#202124' }}>{swap.title}</span>
            <span
              className="ml-auto text-xs font-semibold tabular flex-shrink-0"
              style={{ color: '#137333' }}
            >
              −{swap.co2_saving_kg_per_week.toFixed(1)} kg/wk
            </span>
          </div>
        ))}
      </div>

      <button onClick={onEnter} className="btn-primary w-full justify-center mt-2" style={{ fontSize: '0.9rem', padding: '0.75rem' }}>
        Enter EcoPulse
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

/* ── Main Onboarding Page ─────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, setProfile } = useAuthStore();

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
    if (profile && result) {
      setProfile({
        ...profile,
        onboardingComplete: true,
        archetype: result.archetype_name,
        topCategory: result.top_category,
        dailyTargetKg: result.daily_co2_kg,
        baselineCo2Kg: result.daily_co2_kg,
      });
    }
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
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[#f8f9fa]"
    >
      <div className="w-full max-w-md bg-white border border-[#dadce0] rounded-lg p-6 md:p-8 shadow-sm">
        {/* Logo + progress */}
        {!result && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Leaf size={15} style={{ color: '#1a73e8' }} />
                <span className="font-semibold text-xs" style={{ color: '#202124' }}>
                  <span style={{ color: '#1a73e8' }}>Eco</span>Pulse
                </span>
              </div>
              <span className="text-xs font-semibold" style={{ color: '#5f6368' }}>
                Step {step + 1} of {steps.length}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPct}%`, background: '#1a73e8' }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((s, i) => (
                <span
                  key={s}
                  style={{
                    fontSize: '0.68rem',
                    color: i <= step ? '#1a73e8' : '#70757a',
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
            <h2 className="text-heading mb-1" style={{ fontSize: '1.25rem', color: '#202124' }}>
              How do you mainly get around?
            </h2>
            <p className="text-xs mb-5" style={{ color: '#5f6368' }}>
              This is typically the biggest lever in your footprint
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {MOBILITY_OPTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`quiz-option flex flex-col items-center justify-center ${answers.mobility === id ? 'selected' : ''}`}
                  onClick={() => setAnswers((p) => ({ ...p, mobility: id }))}
                >
                  <Icon size={24} style={{ color: answers.mobility === id ? '#1a73e8' : '#5f6368' }} />
                  <p className="text-xs font-semibold mt-2" style={{ color: '#202124' }}>{label}</p>
                </button>
              ))}
            </div>
            <button
              className="btn-primary w-full justify-center cursor-pointer"
              disabled={!answers.mobility}
              onClick={() => setStep(1)}
              style={{ opacity: answers.mobility ? 1 : 0.4 }}
            >
              Next <ArrowRight size={15} />
            </button>
          </div>
        ) : step === 1 ? (
          /* ── Diet Step ── */
          <div className="animate-fade-in-up">
            <h2 className="text-heading mb-1" style={{ fontSize: '1.25rem', color: '#202124' }}>
              How would you describe your diet?
            </h2>
            <p className="text-xs mb-5" style={{ color: '#5f6368' }}>
              Food choices are a major source of personal emissions
            </p>
            <div className="flex flex-col gap-3.5 mb-6">
              {DIET_OPTIONS.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  className={`quiz-option flex items-center gap-3.5 text-left py-3 px-4 ${answers.diet === id ? 'selected' : ''}`}
                  onClick={() => setAnswers((p) => ({ ...p, diet: id }))}
                >
                  <Icon size={20} style={{ color: answers.diet === id ? '#1a73e8' : '#5f6368', flexShrink: 0 }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#202124' }}>{label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#5f6368' }}>{desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost flex-1 justify-center cursor-pointer" onClick={() => setStep(0)}>Back</button>
              <button
                className="btn-primary flex-1 justify-center cursor-pointer"
                disabled={!answers.diet}
                onClick={() => setStep(2)}
                style={{ opacity: answers.diet ? 1 : 0.4 }}
              >
                Next <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ) : (
          /* ── Home Step ── */
          <div className="animate-fade-in-up">
            <h2 className="text-heading mb-1" style={{ fontSize: '1.25rem', color: '#202124' }}>
              Tell us about your home
            </h2>
            <p className="text-xs mb-5" style={{ color: '#5f6368' }}>
              Home energy is often overlooked but very impactful
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {HOME_OPTIONS.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  className={`quiz-option flex flex-col items-center justify-center p-3.5 ${answers.homeSize === id ? 'selected' : ''}`}
                  onClick={() => setAnswers((p) => ({ ...p, homeSize: id }))}
                >
                  <Icon size={20} style={{ color: answers.homeSize === id ? '#1a73e8' : '#5f6368' }} />
                  <p className="text-xs font-semibold mt-1.5" style={{ color: '#202124' }}>{label}</p>
                  <p className="text-[9px] mt-0.5 leading-tight" style={{ color: '#70757a' }}>{desc}</p>
                </button>
              ))}
            </div>

            {/* Renewable toggle */}
            <div
              className="flex items-center justify-between px-3.5 py-2.5 rounded border border-[#dadce0] mb-5 bg-[#f8f9fa]"
            >
              <div className="flex items-center gap-2.5">
                <Zap size={15} style={{ color: '#b06000' }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#202124' }}>Renewable energy?</p>
                  <p className="text-[10px]" style={{ color: '#5f6368' }}>Solar, wind, green tariff</p>
                </div>
              </div>
              <button
                onClick={() => setRenewable((r) => !r)}
                className="relative"
                style={{
                  width: '36px',
                  height: '20px',
                  background: renewable ? '#1a73e8' : '#dadce0',
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
                    top: '2px',
                    left: renewable ? '18px' : '2px',
                    width: '16px',
                    height: '16px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>

            {error && (
              <p className="text-xs text-center mb-3" style={{ color: '#d93025' }}>{error}</p>
            )}

            <div className="flex gap-3">
              <button className="btn-ghost flex-1 justify-center cursor-pointer" onClick={() => setStep(1)}>Back</button>
              <button
                className="btn-primary flex-1 justify-center cursor-pointer"
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
                  <>Submit <ArrowRight size={15} /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
