import type { ElementType } from 'react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ElementType;
  sub?: string;
  /** Renders with a dark green background to highlight key metrics (e.g. revenue). */
  highlight?: boolean;
}

export function StatCard({ label, value, icon: Icon, sub, highlight }: StatCardProps) {
  return (
    <div
      className={cn('rounded-2xl border p-5 shadow-sm', highlight ? 'border-gold/20' : 'border-neutral-100 bg-white')}
      style={highlight ? { background: 'linear-gradient(135deg, #0a2e1f 0%, #143d2a 100%)' } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn('text-xs font-semibold uppercase tracking-wider', highlight ? 'text-gold/60' : 'text-neutral-400')}>
            {label}
          </p>
          <p className={cn('mt-1.5 text-2xl font-bold truncate', highlight ? 'text-white' : 'text-neutral-900')}>
            {value}
          </p>
          {sub && (
            <p className={cn('mt-1 text-xs', highlight ? 'text-white/45' : 'text-neutral-400')}>
              {sub}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 rounded-xl p-2.5"
          style={{ background: highlight ? 'rgba(201,162,39,0.18)' : 'rgba(201,162,39,0.1)' }}>
          <Icon className="h-5 w-5" style={{ color: '#c9a227' }} />
        </div>
      </div>
    </div>
  );
}
