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
  size = 220,
  strokeWidth = 8,
}: PulseGaugeProps) {
  const radius = (size / 2) - strokeWidth - 4;
  const circumference = 2 * Math.PI * radius;
  const progress = target > 0 ? Math.min(current / target, 1) : 0;
  const dashOffset = circumference * (1 - progress);

  // GCP Status-based gauge colors (Green -> Yellow -> Red)
  const isOverTarget = current >= target && target > 0;
  
  const strokeColor =
    isOverTarget
      ? '#d93025' // Red
      : progress >= 0.8
      ? '#f4b400' // Yellow / Orange
      : progress >= 0.5
      ? '#f9ab00' // Amber / Alert warning
      : '#0f9d58'; // Green / Low emission

  const percentage = Math.round((target > 0 ? current / target : 0) * 100);
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
          r={radius + strokeWidth / 2 + 6}
          fill="none"
          stroke="rgba(60, 64, 67, 0.04)"
          strokeWidth="1"
        />

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e8eaed"
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
              'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease',
          }}
        />

        {/* Tick marks every 30° */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const cos = Math.cos(angle - Math.PI / 2);
          const sin = Math.sin(angle - Math.PI / 2);
          const outerR = radius + strokeWidth / 2 + 3;
          const innerR = radius + strokeWidth / 2 + 1;
          return (
            <line
              key={i}
              x1={size / 2 + innerR * cos}
              y1={size / 2 + innerR * sin}
              x2={size / 2 + outerR * cos}
              y2={size / 2 + outerR * sin}
              stroke="rgba(60, 64, 67, 0.15)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          );
        })}

        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2 - 16}
          textAnchor="middle"
          fill="#202124"
          fontSize="34"
          fontFamily="Inter, sans-serif"
          fontWeight="700"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {current.toFixed(1)}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 8}
          textAnchor="middle"
          fill="#5f6368"
          fontSize="12"
          fontFamily="Inter, sans-serif"
          fontWeight="500"
        >
          kg CO₂e today
        </text>
        <text
          x={size / 2}
          y={size / 2 + 26}
          textAnchor="middle"
          fill={strokeColor}
          fontSize="11"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
        >
          {isOverTarget ? '⚠ Daily limit exceeded' : `${remaining.toFixed(1)} kg remaining`}
        </text>
      </svg>

      {/* Percentage badge */}
      <div
        className="absolute"
        style={{
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <span
          className="badge"
          style={{
            background: isOverTarget ? '#fce8e6' : percentage >= 80 ? '#fef7e0' : '#e6f4ea',
            color: strokeColor,
            border: `1px solid ${strokeColor}25`,
            fontSize: '0.7rem',
            padding: '0.15rem 0.5rem',
          }}
        >
          {percentage}% of daily limit
        </span>
      </div>
    </div>
  );
}
