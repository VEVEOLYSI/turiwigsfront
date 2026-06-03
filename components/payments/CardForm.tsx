'use client';

import { useState, useRef } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import type { CardDetails } from '@/api/payments.api';

interface CardFormProps {
  onSubmit: (card: CardDetails) => void;
  loading: boolean;
  error: string | null;
  amount: string;
}

function detectCardType(number: string): 'visa' | 'mastercard' | 'verve' | 'unknown' {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n)) return 'mastercard';
  if (/^6(50[5-9]|5[1-9]\d|[6-9]\d{2})/.test(n)) return 'verve';
  return 'unknown';
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

const CardIcon = ({ type }: { type: 'visa' | 'mastercard' | 'verve' | 'unknown' }) => {
  if (type === 'visa') return (
    <span className="font-black text-blue-700 text-sm tracking-widest">VISA</span>
  );
  if (type === 'mastercard') return (
    <span className="flex gap-0">
      <span className="h-5 w-5 rounded-full bg-red-500 opacity-90" />
      <span className="h-5 w-5 rounded-full bg-yellow-400 opacity-90 -ml-2" />
    </span>
  );
  if (type === 'verve') return (
    <span className="font-black text-green-700 text-xs tracking-widest">VERVE</span>
  );
  return <CreditCard className="h-5 w-5 text-neutral-400" />;
};

export function CardForm({ onSubmit, loading, error, amount }: CardFormProps) {
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [flipped, setFlipped] = useState(false);

  const cvvRef = useRef<HTMLInputElement>(null);
  const cardType = detectCardType(number);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [month, year] = expiry.split('/');
    onSubmit({
      number: number.replace(/\s/g, ''),
      cvv,
      expiryMonth: month?.padStart(2, '0') ?? '',
      expiryYear: year?.length === 2 ? `20${year}` : (year ?? ''),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Card preview */}
      <div
        className={cn(
          'relative h-44 w-full rounded-2xl p-5 text-white overflow-hidden transition-all duration-500',
          'bg-gradient-to-br from-neutral-800 via-neutral-900 to-black shadow-xl'
        )}
        style={{ perspective: '1000px' }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative flex flex-col h-full justify-between">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <div className="h-5 w-7 rounded-sm bg-yellow-400/80" />
              <div className="h-5 w-4 rounded-sm bg-yellow-400/50" />
            </div>
            <CardIcon type={cardType} />
          </div>

          <div>
            <p className="font-mono text-lg tracking-[0.2em] text-white/90">
              {number || '•••• •••• •••• ••••'}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/50">Card Holder</p>
              <p className="text-sm font-medium tracking-wide uppercase">
                {name || 'FULL NAME'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-white/50">Expires</p>
              <p className="text-sm font-medium">{expiry || 'MM/YY'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="rounded-xl bg-neutral-50 px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-neutral-500">Amount to pay</span>
        <span className="text-base font-bold text-neutral-900">{amount}</span>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        {/* Card number */}
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1.5">Card Number</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={number}
              onChange={(e) => setNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              required
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 pr-10 font-mono text-sm tracking-widest placeholder:text-neutral-300 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CardIcon type={cardType} />
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1.5">Name on Card</label>
          <input
            type="text"
            placeholder="JANE DOE"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            required
            className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm uppercase tracking-wide placeholder:text-neutral-300 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 transition-colors"
          />
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">Expiry Date</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              maxLength={5}
              required
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 font-mono text-sm tracking-widest placeholder:text-neutral-300 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1.5">CVV</label>
            <input
              ref={cvvRef}
              type={flipped ? 'text' : 'password'}
              inputMode="numeric"
              placeholder="•••"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onFocus={() => setFlipped(true)}
              onBlur={() => setFlipped(false)}
              maxLength={4}
              required
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 font-mono text-sm tracking-widest placeholder:text-neutral-300 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 transition-colors"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" fullWidth size="lg" loading={loading}>
        <Lock className="h-4 w-4" />
        Pay {amount} Securely
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
        <Lock className="h-3 w-3" />
        <span>256-bit SSL · Secured by Paystack</span>
      </div>
    </form>
  );
}
