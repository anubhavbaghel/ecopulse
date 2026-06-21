'use client';

import { useState, useMemo } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCarbonStore } from '@/lib/stores/carbonStore';
import { addActivity as addActivityFirestore } from '@/lib/firestore/activities';
import { EMISSION_FACTORS, getFactorsByCategory, calculateCo2 } from '@/lib/emission-factors';
import { CategoryType } from '@/types/user';
import { Car, Utensils, Zap, ShoppingBag, CheckCircle2, Plus, ChevronRight } from 'lucide-react';

const TABS: { id: CategoryType; label: string; icon: React.ComponentType<{ size: number; style?: React.CSSProperties }> }[] = [
  { id: 'transport', label: 'Transport', icon: Car },
  { id: 'diet', label: 'Diet', icon: Utensils },
  { id: 'utilities', label: 'Utilities', icon: Zap },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
];

const CATEGORY_COLORS: Record<CategoryType, string> = {
  transport: '#1a73e8', // GCP Blue
  diet: '#137333', // GCP Green
  utilities: '#b06000', // GCP Yellow/Orange
  shopping: '#d93025', // GCP Red
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
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-[11px] text-[#5f6368] font-medium mb-3 animate-fade-in">
            <span>EcoPulse</span>
            <ChevronRight size={10} className="mt-0.5" />
            <span className="text-[#202124]">Log Activity</span>
          </div>

          {/* Header */}
          <div className="mb-6 animate-fade-in">
            <p className="text-subheading">Tracking Console</p>
            <h1 className="font-bold text-[#202124]" style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
              Log an Activity
            </h1>
            <p className="text-xs mt-1" style={{ color: '#5f6368' }}>
              Register your carbon impact using standardized emission factors
            </p>
          </div>

          {/* Category tabs (GCP style underlined) */}
          <div className="flex overflow-x-auto scrollbar-none flex-nowrap border-b border-[#dadce0] mb-6 animate-fade-in-up stagger-1 bg-white px-2">
            {TABS.map(({ id, label, icon: Icon }) => {
              const isActive = id === activeTab;
              const tabColor = CATEGORY_COLORS[id];
              return (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className="flex items-center justify-center gap-2 py-3 px-4 sm:px-5 border-b-2 font-semibold text-xs transition-all cursor-pointer flex-shrink-0 flex-1 sm:flex-none"
                  style={{
                    borderBottomColor: isActive ? tabColor : 'transparent',
                    color: isActive ? tabColor : '#5f6368',
                  }}
                >
                  <Icon size={14} style={{ color: isActive ? tabColor : '#5f6368' }} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Activity selector form */}
          <div className="flex flex-col gap-5 bg-white border border-[#dadce0] rounded-lg p-6 shadow-sm animate-fade-in-up stagger-2">
            <div>
              <label className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider block mb-2">
                Select Activity Type
              </label>
              <select
                className="input select cursor-pointer"
                value={selectedFactorId}
                onChange={(e) => { setSelectedFactorId(e.target.value); setQuantity(''); }}
              >
                <option value="">Choose an activity option…</option>
                {factors.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label} ({f.co2eKgPerUnit} kg CO₂e / {f.unit})
                  </option>
                ))}
              </select>
            </div>

            {selectedFactor && (
              <div className="animate-fade-in">
                <label className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider block mb-2">
                  Quantity ({selectedFactor.unit})
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder={`Enter value in ${selectedFactor.unit}`}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0"
                  step="any"
                />
              </div>
            )}

            {/* CO2 preview (Alert style) */}
            {previewCo2 !== null && previewCo2 > 0 && (
              <div
                className="flex items-center justify-between px-4 py-3 rounded border animate-fade-in"
                style={{ background: '#fce8e6', borderColor: '#fad2cf' }}
              >
                <span className="text-xs font-semibold text-[#5f6368]">Estimated carbon increase</span>
                <span
                  className="font-bold tabular text-sm"
                  style={{ color: '#d93025' }}
                >
                  +{previewCo2.toFixed(3)} kg CO₂e
                </span>
              </div>
            )}

            {/* Source info */}
            {selectedFactor && (
              <div
                className="text-[10px] px-3 py-2 rounded bg-[#f8f9fa] border border-[#dadce0] text-[#5f6368]"
              >
                Factor Source: <span className="font-semibold">BEIS 2024 / IPCC AR6 Reference</span> · Coefficient: {selectedFactor.co2eKgPerUnit} kg CO₂e per {selectedFactor.unit}
              </div>
            )}

            {error && (
              <p className="text-xs font-semibold text-center" style={{ color: '#d93025' }}>{error}</p>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedFactor || !quantity || saving}
              className="btn-primary justify-center cursor-pointer mt-2"
              style={{
                padding: '0.65rem',
                fontSize: '0.875rem',
                opacity: !selectedFactor || !quantity || saving ? 0.5 : 1,
              }}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                  Saving entry…
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={16} />
                  Logged in console
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Log to today's records
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
