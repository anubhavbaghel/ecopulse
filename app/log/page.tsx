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

const TABS: { id: CategoryType; label: string; icon: React.ComponentType<{ size: number; style?: React.CSSProperties; strokeWidth?: number }> }[] = [
  { id: 'transport', label: 'Transport', icon: Car },
  { id: 'diet', label: 'Diet', icon: Utensils },
  { id: 'utilities', label: 'Utilities', icon: Zap },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
];

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

  const ActiveIcon = TABS.find((t) => t.id === activeTab)?.icon || Car;

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
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header Section */}
          <header className="flex flex-col gap-2 mb-10 animate-fade-in text-balance text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                Daily Tracker
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
              Log an <span className="text-emerald-600">Activity</span>
            </h1>
            <p className="text-zinc-500 font-medium text-sm md:text-base max-w-lg mx-auto md:mx-0">
              Every choice contributes to your personal footprint. Log accurately for the best insights.
            </p>
          </header>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Input Form Column */}
            <div className="lg:col-span-12 space-y-8">
              {/* Category Selector Overhaul */}
              <section className="animate-fade-in-up stagger-1">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 ml-2">Select Activity Source</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-zinc-100/50 rounded-[2.5rem] border border-zinc-100">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`group relative flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-[2rem] transition-all duration-300 ${
                          isActive 
                            ? 'bg-white text-zinc-900 shadow-xl shadow-zinc-200/50 -translate-y-1' 
                            : 'text-zinc-400 hover:text-zinc-600'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isActive ? 'bg-emerald-500 text-white' : 'bg-transparent border-2 border-zinc-200'
                        }`}>
                          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                        {isActive && (
                          <div className="absolute -bottom-1 w-8 h-1 bg-emerald-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Main Entry Form */}
              <div className="grid lg:grid-cols-2 gap-8 items-start animate-fade-in-up stagger-2">
                <section className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                  {/* Activity Type */}
                  <div className="space-y-4">
                    <label htmlFor="activity-type" className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Type of Activity</label>
                    <div className="relative">
                      <select
                        id="activity-type"
                        value={selectedFactorId}
                        onChange={(e) => { setSelectedFactorId(e.target.value); setSuccess(false); }}
                        className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-5 py-4 text-sm font-bold text-zinc-900 focus:border-emerald-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Choose specific activity...</option>
                        {factors.map((f) => (
                          <option key={f.id} value={f.id}>{f.label}</option>
                        ) )}
                      </select>
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-1">
                      <label htmlFor="activity-quantity" className="text-xs font-black text-zinc-400 uppercase tracking-widest">Amount Used</label>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase">{selectedFactor?.unit || 'Units'}</span>
                    </div>
                    <div className="relative">
                      <input
                        id="activity-quantity"
                        type="number"
                        placeholder="0.00"
                        value={quantity}
                        onChange={(e) => { setQuantity(e.target.value); setSuccess(false); }}
                        className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-5 py-4 text-3xl font-black text-zinc-900 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-zinc-200"
                      />
                    </div>
                  </div>

                  {/* Errors / Success Alerts */}
                  {error && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-2">
                       {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold flex items-center gap-2">
                      <CheckCircle2 size={18} />
                      Activity logged successfully!
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={saving || !selectedFactorId || !quantity}
                    className="w-full bg-zinc-900 text-white font-black py-5 rounded-[2.5rem] hover:bg-emerald-600 transition-all duration-300 disabled:opacity-30 disabled:hover:bg-zinc-900 shadow-xl shadow-zinc-900/10 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    ) : (
                      <>
                        <Plus size={20} strokeWidth={3} />
                        LOG IMPACT
                      </>
                    )}
                  </button>
                </section>

                {/* Impact Preview Widget */}
                <aside className="space-y-6">
                   <div className="glass rounded-[2.5rem] p-8 text-center relative overflow-hidden bg-white shadow-xl shadow-zinc-200/40 border border-zinc-100 min-h-[300px] flex flex-col justify-center">
                      <div className="absolute top-0 right-0 p-6 opacity-10">
                        <ActiveIcon size={120} strokeWidth={1} />
                      </div>
                      
                      <p className="text-xs font-black text-zinc-300 uppercase tracking-widest mb-6">Climate Impact Forecast</p>
                      
                      {previewCo2 !== null ? (
                        <div className="space-y-2 animate-fade-in">
                          <p className="text-6xl font-black text-zinc-900 tracking-tighter">
                            {previewCo2.toFixed(3)}
                          </p>
                          <p className="text-sm font-bold text-emerald-500 italic tracking-tight">kg of CO₂e emitted</p>
                        </div>
                      ) : (
                        <div className="space-y-4 opacity-40 grayscale flex flex-col items-center">
                           <div className="w-12 h-12 rounded-full border-4 border-zinc-100 mb-2" />
                           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Awaiting inputs...</p>
                        </div>
                      )}
                   </div>
                   
                   <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100">
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         Impact Tip
                      </h4>
                      <p className="text-xs font-medium text-emerald-800 leading-relaxed">
                        {activeTab === 'transport' && "Choosing public transport or cycling can reduce transit-related emissions by up to 90% per person."}
                        {activeTab === 'diet' && "Transitioning to plant-based meals once a day can significantly lower your personal emission pulse."}
                        {activeTab === 'utilities' && "Lowering your thermostat by just 1 degree can save up to 10% on heating-related carbon output."}
                        {activeTab === 'shopping' && "Repairing items instead of buying new ones significantly reduces the lifecycle carbon footprint of your shopping."}
                      </p>
                   </div>
                </aside>
              </div>
            </div>
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

