'use client';

interface PulseGaugeProps {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
}

export function PulseGauge({
  current,
  target,
  size = 240,
  strokeWidth = 14,
}: PulseGaugeProps) {
  const radius = (size / 2) - strokeWidth - 10;
  const circumference = 2 * Math.PI * radius;
  const progress = target > 0 ? Math.min(current / target, 1) : 0;
  const dashOffset = circumference * (1 - progress);

  const isOverTarget = current >= target && target > 0;
  
  // New "Living Earth" Colors
  const strokeColor =
    isOverTarget
      ? '#ef4444' // Rose/Red
      : progress >= 0.8
      ? '#f59e0b' // Amber
      : '#10b981'; // Emerald

  const percentage = Math.round((target > 0 ? current / target : 0) * 100);

  return (
    <div className="relative inline-flex items-center justify-center group">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Shadow Glow Filter */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={strokeColor} />
          </linearGradient>
        </defs>

        {/* Outer subtle ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 8}
          fill="none"
          stroke="#f4f4f5"
          strokeWidth="1"
        />

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f4f4f5"
          strokeWidth={strokeWidth}
          className="transition-all duration-300"
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          filter={progress > 0.5 ? 'url(#glow)' : 'none'}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Information */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter">
          {current.toFixed(1)}
          <span className="text-sm font-bold text-zinc-400 ml-1 tracking-normal italic">kg</span>
        </span>
        <div className="flex flex-col items-center mt-1">
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${
            isOverTarget ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {percentage}% of daily
          </span>
        </div>
      </div>

      {/* Pulse Animation for Warning */}
      {isOverTarget && (
        <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 animate-ping" />
      )}
    </div>
  );
}

