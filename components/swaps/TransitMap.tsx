'use client';

import { useState, useEffect } from 'react';
import { Car, TrainFront, Bike, Bus, Footprints, MapPin } from 'lucide-react';
import { MockRoute, RouteOption } from '@/lib/maps-mock';

const MODE_ICONS: Record<string, React.ComponentType<{ size: number; style?: React.CSSProperties }>> = {
  Car,
  TrainFront,
  Bike,
  Bus,
  Footprints,
};

interface TransitMapProps {
  routeId?: string;
}

export function TransitMap({ routeId = 'commute-main' }: TransitMapProps) {
  const [route, setRoute] = useState<MockRoute | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>('driving');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch(`/api/maps?routeId=${routeId}`);
        const data = await res.json();
        setRoute(data.data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [routeId]);

  if (loading) {
    return (
      <div
        className="card p-5 flex items-center justify-center"
        style={{ minHeight: '160px' }}
      >
        <div
          className="w-6 h-6 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--color-slate-600)', borderTopColor: 'var(--color-sage-500)' }}
        />
      </div>
    );
  }

  if (!route) return null;

  const selectedOption = route.options.find((o) => o.mode === selectedMode) ?? route.options[0];
  const drivingOption = route.options.find((o) => o.mode === 'driving');
  const co2Saved = drivingOption
    ? Math.max(0, drivingOption.co2_kg - selectedOption.co2_kg)
    : 0;

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MapPin size={15} style={{ color: 'var(--color-sage-400)' }} />
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-cream-200)' }}>
            {route.purpose}: {route.origin} → {route.destination}
          </h3>
          <p className="text-xs" style={{ color: 'var(--color-cream-500)' }}>
            Mock Google Maps Routes API · Live simulation
          </p>
        </div>
      </div>

      {/* Mode selector tabs */}
      <div
        className="flex gap-1.5 p-1 rounded-xl"
        style={{ background: 'var(--color-slate-700)' }}
      >
        {route.options.map((option) => {
          const Icon = MODE_ICONS[option.icon] ?? Car;
          const isSelected = selectedMode === option.mode;
          return (
            <button
              key={option.mode}
              onClick={() => setSelectedMode(option.mode)}
              className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all"
              style={{
                background: isSelected ? 'var(--color-slate-800)' : 'transparent',
                border: isSelected ? '1px solid rgba(107,143,113,0.2)' : '1px solid transparent',
              }}
            >
              <Icon
                size={16}
                style={{ color: isSelected ? 'var(--color-sage-400)' : 'var(--color-cream-500)' }}
              />
              <span
                style={{
                  fontSize: '0.65rem',
                  color: isSelected ? 'var(--color-cream-200)' : 'var(--color-cream-500)',
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected route details */}
      <div
        className="grid gap-2 rounded-xl p-3"
        style={{ background: 'var(--color-slate-700)', gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
        {[
          { label: 'Distance', value: `${selectedOption.distance_km} km` },
          { label: 'Duration', value: `${selectedOption.duration_min} min` },
          { label: 'CO₂', value: `${selectedOption.co2_kg.toFixed(2)} kg`, highlight: true },
        ].map(({ label, value, highlight }) => (
          <div key={label} className="text-center">
            <p className="text-xs" style={{ color: 'var(--color-cream-500)' }}>{label}</p>
            <p
              className="text-sm font-semibold tabular mt-0.5"
              style={{ color: highlight ? 'var(--color-sage-300)' : 'var(--color-cream-200)' }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* CO2 savings vs driving */}
      {co2Saved > 0 && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(107,143,113,0.08)', border: '1px solid rgba(107,143,113,0.15)' }}
        >
          <span style={{ fontSize: '1rem' }}>🌿</span>
          <span className="text-xs" style={{ color: 'var(--color-cream-300)' }}>
            You'd save{' '}
            <span className="font-semibold tabular" style={{ color: 'var(--color-sage-300)' }}>
              {co2Saved.toFixed(2)} kg CO₂e
            </span>{' '}
            compared to driving
          </span>
        </div>
      )}

      {selectedOption.cost_estimate && (
        <p className="text-xs text-center" style={{ color: 'var(--color-cream-500)' }}>
          Estimated cost: {selectedOption.cost_estimate}
          {selectedOption.route_name && ` · ${selectedOption.route_name}`}
        </p>
      )}
    </div>
  );
}
