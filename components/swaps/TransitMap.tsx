'use client';

import { useState, useEffect } from 'react';
import { Car, TrainFront, Bike, Bus, Footprints, MapPin } from 'lucide-react';
import { MockRoute } from '@/lib/maps-mock';

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
        className="card p-5 flex items-center justify-center bg-white border border-[#dadce0]"
        style={{ minHeight: '160px' }}
      >
        <div
          className="w-6 h-6 rounded-full border-2 animate-spin"
          style={{ borderColor: '#dadce0', borderTopColor: '#1a73e8' }}
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
    <div className="card p-5 flex flex-col gap-4 bg-white border border-[#dadce0] shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MapPin size={15} style={{ color: '#1a73e8' }} />
        <div>
          <h3 className="text-xs font-bold" style={{ color: '#202124' }}>
            {route.purpose}: {route.origin} → {route.destination}
          </h3>
          <p className="text-[10px]" style={{ color: '#5f6368' }}>
            Mock Google Maps Routes API · Live Comparison
          </p>
        </div>
      </div>

      {/* Mode selector tabs (GCP flat styled) */}
      <div
        className="flex gap-1 p-1 rounded bg-[#f8f9fa] border border-[#dadce0]"
      >
        {route.options.map((option) => {
          const Icon = MODE_ICONS[option.icon] ?? Car;
          const isSelected = selectedMode === option.mode;
          return (
            <button
              key={option.mode}
              onClick={() => setSelectedMode(option.mode)}
              className="flex-1 flex flex-col items-center gap-1 py-1.5 px-0.5 rounded transition-all cursor-pointer"
              style={{
                background: isSelected ? '#ffffff' : 'transparent',
                border: isSelected ? '1px solid #dadce0' : '1px solid transparent',
                boxShadow: isSelected ? '0 1px 2px rgba(60,64,67,0.1)' : 'none',
              }}
            >
              <Icon
                size={14}
                style={{ color: isSelected ? '#1a73e8' : '#5f6368' }}
              />
              <span
                className="text-[9px] font-semibold hidden sm:block"
                style={{
                  color: isSelected ? '#202124' : '#5f6368',
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
        className="grid gap-2 rounded border border-[#dadce0] p-3 bg-[#f8f9fa]"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
        {[
          { label: 'Distance', value: `${selectedOption.distance_km} km` },
          { label: 'Duration', value: `${selectedOption.duration_min} min` },
          { label: 'CO₂ Footprint', value: `${selectedOption.co2_kg.toFixed(2)} kg`, highlight: true },
        ].map(({ label, value, highlight }) => (
          <div key={label} className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5f6368]">{label}</p>
            <p
              className="text-xs font-bold tabular-nums mt-0.5"
              style={{ color: highlight ? (selectedMode === 'driving' ? '#d93025' : '#137333') : '#202124' }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* CO2 savings vs driving (GCP Success green banner) */}
      {co2Saved > 0 && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded border"
          style={{ background: '#e6f4ea', borderColor: '#ceead6' }}
        >
          <span style={{ fontSize: '0.85rem' }}>🌿</span>
          <span className="text-[10px] font-semibold" style={{ color: '#137333' }}>
            Saving impact:{' '}
            <span className="font-bold tabular-nums" style={{ color: '#137333' }}>
              −{co2Saved.toFixed(2)} kg CO₂e
            </span>{' '}
            compared to drive alternative
          </span>
        </div>
      )}

      {selectedOption.cost_estimate && (
        <p className="text-[10px] text-center font-medium" style={{ color: '#5f6368' }}>
          Estimated cost: {selectedOption.cost_estimate}
          {selectedOption.route_name && ` · ${selectedOption.route_name}`}
        </p>
      )}
    </div>
  );
}
