'use client';

interface WeeklySparklineProps {
  data: number[]; // 7 values, oldest first
  height?: number;
  width?: number;
}

export function WeeklySparkline({ data, height = 76, width = 280 }: WeeklySparklineProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay(); // 0=Sun
  // Map to Mon-Sun index
  const todayIdx = today === 0 ? 6 : today - 1;

  const maxVal = Math.max(...data, 0.1);
  const padH = 10;
  const padV = 10;
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

  const areaD = `${pathD} L${points[points.length - 1].x},${height - padV} L${points[0].x},${height - padV} Z`;

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${width} ${height + 20}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a73e8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1a73e8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1.0].map((f) => (
          <line
            key={f}
            x1={padH}
            y1={padV + usableV * (1 - f)}
            x2={width - padH}
            y2={padV + usableV * (1 - f)}
            stroke="#f1f3f4"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path d={areaD} fill="url(#sparkGrad)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#1a73e8"
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
              r={3}
              fill={i === 6 ? '#1a73e8' : '#ffffff'}
              stroke="#1a73e8"
              strokeWidth="1.5"
            />
            {/* Day label */}
            <text
              x={p.x}
              y={height + 14}
              textAnchor="middle"
              fill={i === 6 ? '#1a73e8' : '#70757a'}
              fontSize="9"
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
