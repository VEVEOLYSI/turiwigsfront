'use client';

interface Segment {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  thickness?: number;
  center?: React.ReactNode;
}

export function DonutChart({
  segments,
  size = 100,
  thickness = 12,
  center,
}: DonutChartProps) {
  const total = segments.reduce((a, b) => a + b.value, 0) || 1;
  const r = size / 2 - thickness / 2 - 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  let cumPct = 0;

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#f0f0f0"
          strokeWidth={thickness}
        />
        {/* Segments */}
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = pct * circ;
          const gap = circ - dash;
          const offset = circ - cumPct * circ;
          cumPct += pct;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash.toFixed(2)} ${gap.toFixed(2)}`}
              strokeDashoffset={offset.toFixed(2)}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      {center && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {center}
        </div>
      )}
    </div>
  );
}
