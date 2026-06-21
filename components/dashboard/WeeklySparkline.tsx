'use client';

interface WeeklySparklineProps {
  data: number[]; // 7 values, oldest first
  height?: number;
  width?: number;
}

export function WeeklySparkline({ data, height = 72, width = 280 }: WeeklySparklineProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay(); // 0=Sun
  // Map to Mon-Sun index
  const todayIdx = today === 0 ? 6 : today - 1;

  const maxVal = Math.max(...data, 0.1);
  const padH = 8;
  const padV = 8;
  const usableH = width - padH * 2;
  const usableV = height - padV * 2;

  const points = data.map((v, i) => ({
    x: padH + (i / (data.length - 1)) * usableH,
    y: padV + usableV - (v / maxVal) * usableV,
    value: v,
    day: days[(todayIdx - 6 + i + 7) % 7],
  }));

  const pathD = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(' ');

  const areaD = `${pathD} L${points[points.length - 1].x},${height - padV + 2} L${points[0].x},${height - padV + 2} Z`;

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${width} ${height + 24}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-sage-500)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-sage-500)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={padH}
            y1={padV + usableV * (1 - f)}
            x2={width - padH}
            y2={padV + usableV * (1 - f)}
            stroke="rgba(107, 143, 113, 0.07)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Area fill */}
        <path d={areaD} fill="url(#sparkGrad)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--color-sage-500)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill={i === 6 ? 'var(--color-sage-400)' : 'var(--color-slate-800)'}
              stroke="var(--color-sage-500)"
              strokeWidth="1.5"
            />
            {/* Day label */}
            <text
              x={p.x}
              y={height + 18}
              textAnchor="middle"
              fill={i === 6 ? 'var(--color-cream-300)' : 'var(--color-cream-500)'}
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight={i === 6 ? '600' : '400'}
            >
              {p.day}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
