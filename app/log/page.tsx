'use client';

import { useState, useMemo } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCarbonStore } from '@/lib/stores/carbonStore';
import { addActivity as addActivityFirestore } from '@/lib/firestore/activities';
import { EMISSION_FACTORS, getFactorsByCategory, calculateCo2 } from '@/lib/emission-factors';
import { CategoryType } from '@/types/user';
import { Car, Utensils, Zap, ShoppingBag, CheckCircle2, Plus } from 'lucide-react';

const TABS: { id: CategoryType; label: string; icon: React.ComponentType<{ size: number; style?: React.CSSProperties }> }[] = [
  { id: 'transport', label: 'Transport', icon: Car },
  { id: 'diet', label: 'Diet', icon: Utensils },
  { id: 'utilities', label: 'Utilities', icon: Zap },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
];

const CATEGORY_COLORS: Record<CategoryType, string> = {
  transport: 'var(--color-teal-400)',
  diet: 'var(--color-sage-400)',
  utilities: 'var(--color-amber-400)',
  shopping: 'var(--color-mauve-400)',
};

function LogContent() {
  const { user } = useAuthStore();
  const { addActivity } = useCarbonStore();

  const [activeTab, setActiveTab] = useState<CategoryType>('transport');
  const [selectedFactorId, setSelectedFactorId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const factors = useMemo(() => getFactorsByCategory(activeTab), [activeTab]);
  const selectedFactor = EMISSION_FACTORS.find((f) => f.id === selectedFactorId);
  const previewCo2 = selectedFactor && quantity
    ? calculateCo2(selectedFactorId, parseFloat(quantity) || 0)
    : null;

  const color = CATEGORY_COLORS[activeTab];

  const handleTabChange = (tab: CategoryType) => {
    setActiveTab(tab);
    setSelectedFactorId('');
    setQuantity('');
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async () => {
    if (!user || !selectedFactor || !quantity) return;
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid quantity');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const entry = await addActivityFirestore(user.uid, {
        category: activeTab,
        activityType: selectedFactorId,
        label: selectedFactor.label,
        quantity: qty,
        unit: selectedFactor.unit,
      });
      addActivity(entry);
      setQuantity('');
      setSelectedFactorId('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <p className="text-subheading">Tracking</p>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', color: 'var(--color-cream-100)', marginTop: '0.25rem' }}>
            Log an Activity
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-cream-400)' }}>
            Every entry helps build a clearer picture of your footprint
          </p>
        </div>

        {/* Category tabs */}
        <div
          className="flex gap-1.5 p-1 rounded-2xl mb-6 animate-fade-in-up stagger-1"
          style={{ background: 'var(--color-slate-750)' }}
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = id === activeTab;
            const tabColor = CATEGORY_COLORS[id];
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className="flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all"
                style={{
                  background: isActive ? 'var(--color-slate-800)' : 'transparent',
                  border: isActive ? `1px solid ${tabColor}25` : '1px solid transparent',
                }}
              >
                <Icon size={17} style={{ color: isActive ? tabColor : 'var(--color-cream-500)' }} />
                <span style={{ fontSize: '0.72rem', color: isActive ? 'var(--color-cream-200)' : 'var(--color-cream-500)', fontWeight: isActive ? 600 : 400 }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Activity selector */}
        <div className="flex flex-col gap-4 animate-fade-in-up stagger-2">
          <div>
            <label className="text-subheading block mb-2">Select Activity</label>
            <select
              className="input select"
              value={selectedFactorId}
              onChange={(e) => { setSelectedFactorId(e.target.value); setQuantity(''); }}
            >
              <option value="">Choose an activity…</option>
              {factors.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label} · {f.co2eKgPerUnit} kg CO₂e / {f.unit}
                </option>
              ))}
            </select>
          </div>

          {selectedFactor && (
            <div>
              <label className="text-subheading block mb-2">
                Quantity ({selectedFactor.unit})
              </label>
              <input
                type="number"
                className="input"
                placeholder={`e.g. 10 ${selectedFactor.unit}`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="any"
              />
            </div>
          )}

          {/* CO2 preview */}
          {previewCo2 !== null && previewCo2 > 0 && (
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl animate-fade-in"
              style={{ background: `${color}0d`, border: `1px solid ${color}25` }}
            >
              <span className="text-sm" style={{ color: 'var(--color-cream-300)' }}>Estimated impact</span>
              <span
                className="font-semibold tabular"
                style={{ color, fontSize: '1.1rem', letterSpacing: '-0.02em' }}
              >
                +{previewCo2.toFixed(3)} kg CO₂e
              </span>
            </div>
          )}

          {/* Emission factor info */}
          {selectedFactor && (
            <div
              className="text-xs px-3 py-2 rounded-lg"
              style={{ background: 'var(--color-slate-750)', color: 'var(--color-cream-500)' }}
            >
              Factor: {selectedFactor.co2eKgPerUnit} kg CO₂e per {selectedFactor.unit} · Source: BEIS 2024 / IPCC AR6
            </div>
          )}

          {error && (
            <p className="text-sm" style={{ color: 'var(--color-amber-400)' }}>{error}</p>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedFactor || !quantity || saving}
            className="btn-primary justify-center"
            style={{
              padding: '0.875rem',
              fontSize: '0.95rem',
              opacity: !selectedFactor || !quantity || saving ? 0.4 : 1,
            }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                Saving…
              </>
            ) : success ? (
              <>
                <CheckCircle2 size={18} />
                Logged successfully
              </>
            ) : (
              <>
                <Plus size={18} />
                Add to today's log
              </>
            )}
          </button>
        </div>
        </div>
      </main>
    </div>
  );
}

export default function LogPage() {
  return (
    <AuthGuard>
      <LogContent />
    </AuthGuard>
  );
}
