'use client';

import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const sizes = {
  sm: 'h-8 px-4 text-xs rounded-lg',
  md: 'h-11 px-6 text-sm rounded-xl',
  lg: 'h-13 px-8 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  style,
  ...props
}: ButtonProps) {
  const base = cn(
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizes[size],
    fullWidth && 'w-full',
    className
  );

  if (variant === 'primary') {
    return (
      <button {...props} disabled={disabled || loading} className={base}
        style={{
          background: 'linear-gradient(180deg, #f0d878 0%, #c9a227 35%, #a07818 65%, #c9a227 100%)',
          border: '1px solid #8b6914',
          boxShadow: '0 1px 0 rgba(255,255,255,0.45) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 4px 12px rgba(139,105,20,0.45), 0 1px 3px rgba(0,0,0,0.2)',
          color: '#1a0e00',
          textShadow: '0 1px 2px rgba(255,255,255,0.3)',
          ...style,
        }}
        onMouseEnter={(e) => !disabled && !loading && ((e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.filter = '')}
        onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 6px rgba(139,105,20,0.3),inset 0 1px 3px rgba(0,0,0,0.2)'; props.onMouseDown?.(e); }}
        onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; props.onMouseUp?.(e); }}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }

  if (variant === 'secondary') {
    return (
      <button {...props} disabled={disabled || loading} className={base}
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f0e8 100%)',
          border: '1px solid rgba(201,162,39,0.35)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 6px rgba(0,0,0,0.08)',
          color: '#143d2a',
          ...style,
        }}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }

  if (variant === 'ghost') {
    return (
      <button {...props} disabled={disabled || loading} className={cn(base, 'bg-transparent hover:bg-gold/8 text-salon-mid hover:text-gold border border-transparent hover:border-gold/20')} style={style}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }

  // danger
  return (
    <button {...props} disabled={disabled || loading} className={base}
      style={{
        background: 'linear-gradient(180deg, #ef5350 0%, #c62828 100%)',
        border: '1px solid #b71c1c',
        boxShadow: '0 1px 0 rgba(255,255,255,0.3) inset, 0 3px 8px rgba(198,40,40,0.35)',
        color: '#fff',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        ...style,
      }}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
