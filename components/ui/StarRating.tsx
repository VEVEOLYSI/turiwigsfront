'use client';

import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StarRatingProps {
  value: number;
  max?: number;
  onChange?: (v: number) => void;
  size?: 'sm' | 'md';
}

export function StarRating({ value, max = 5, onChange, size = 'md' }: StarRatingProps) {
  const sz = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i + 1)}
          disabled={!onChange}
          className={cn('disabled:cursor-default', onChange && 'hover:scale-110 transition-transform')}
        >
          <Star
            className={cn(
              sz,
              i < value ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'
            )}
          />
        </button>
      ))}
    </div>
  );
}
