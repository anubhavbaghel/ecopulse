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
  strokeWidth = 10,
}: PulseGaugeProps) {
  const radius = (size / 2) - strokeWidth - 4;
  const circumference = 2 * Math.PI * radius;
  const progress = target > 0 ? Math.min(current / target, 1) : 0;
  const dashOffset = circumference * (1 - progress);

  // Color transitions: sage → amber (never red)
  const strokeColor =
    progress >= 0.9
      ? 'var(--color-amber-400)'
      : progress >= 0.7
      ? 'var(--color-amber-300)'
      : 'var(--color-sage-500)';

  const percentage = Math.round(progress * 100);
  const remaining = Math.max(0, target - current);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible' }}
      >
        {/* Outer subtle ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth / 2 + 8}
          fill="none"
          stroke="rgba(107, 143, 113, 0.05)"
          strokeWidth="1"
        />

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-slate-700)"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition:
              'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease',
            filter: `drop-shadow(0 0 8px ${strokeColor}55)`,
          }}
        />

        {/* Tick marks every 30° */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const cos = Math.cos(angle - Math.PI / 2);
          const sin = Math.sin(angle - Math.PI / 2);
          const outerR = radius + strokeWidth / 2 + 4;
          const innerR = radius + strokeWidth / 2 + 1;
          return (
            <line
              key={i}
              x1={size / 2 + innerR * cos}
              y1={size / 2 + innerR * sin}
              x2={size / 2 + outerR * cos}
              y2={size / 2 + outerR * sin}
              stroke="rgba(107, 143, 113, 0.2)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2 - 20}
          textAnchor="middle"
          fill="var(--color-cream-100)"
          fontSize="38"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {current.toFixed(1)}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 6}
          textAnchor="middle"
          fill="var(--color-cream-400)"
          fontSize="13"
          fontFamily="Inter, sans-serif"
        >
          kg CO₂e today
        </text>
        <text
          x={size / 2}
          y={size / 2 + 26}
          textAnchor="middle"
          fill={strokeColor}
          fontSize="11.5"
          fontFamily="Inter, sans-serif"
          fontWeight="500"
        >
          {remaining > 0 ? `${remaining.toFixed(1)} kg to limit` : '⚠ At daily target'}
        </text>
      </svg>

      {/* Percentage badge */}
      <div
        className="absolute"
        style={{
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <span
          className="badge"
          style={{
            background: `${strokeColor}18`,
            color: strokeColor,
            border: `1px solid ${strokeColor}30`,
            fontSize: '0.75rem',
            padding: '0.2rem 0.75rem',
          }}
        >
          {percentage}% of daily target
        </span>
      </div>
    </div>
  );
}
