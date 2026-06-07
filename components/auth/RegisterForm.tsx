'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { registerThunk } from '@/store/slices/auth.slice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setShowTermsError(true);
      toast.error('Please accept the Terms & Conditions to continue');
      return;
    }
    if (form.password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    const result = await dispatch(registerThunk(form));
    if (registerThunk.fulfilled.match(result)) {
      toast.success('Account created! Check your email for a 6-digit code.');
      router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="Jane Doe"
        autoComplete="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <Input
        label="Password"
        type={showPwd ? 'text' : 'password'}
        placeholder="Min. 8 characters"
        autoComplete="new-password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        hint="At least 8 characters"
        suffix={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? 'Hide password' : 'Show password'}
            className="flex items-center justify-center transition-colors"
            style={{ color: '#9a8060' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0a2e1f'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#9a8060'; }}
          >
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />
      <Input
        label="Confirm Password"
        type={showConfirm ? 'text' : 'password'}
        placeholder="••••••••"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        error={confirm && confirm !== form.password ? 'Passwords do not match' : undefined}
        suffix={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
            className="flex items-center justify-center transition-colors"
            style={{ color: '#9a8060' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0a2e1f'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#9a8060'; }}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />

      {/* Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked) setShowTermsError(false);
            }}
            className="sr-only"
          />
          <div
            className="h-5 w-5 rounded flex items-center justify-center transition-all"
            style={{
              background: agreed ? '#c9a227' : '#ffffff',
              border: agreed
                ? '1.5px solid #8b6914'
                : showTermsError
                  ? '1.5px solid rgb(220,38,38)'
                  : '1.5px solid #d1d5db',
              boxShadow: agreed ? '0 1px 4px rgba(201,162,39,0.4)' : 'inset 0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            {agreed && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 3.5L3.8 6.5L9 1" stroke="#1a0e00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
        <span className="text-sm leading-snug" style={{ color: '#374151' }}>
          I have read and agree to the{' '}
          <Link
            href="/terms"
            target="_blank"
            className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: '#0a2e1f' }}
          >
            Terms &amp; Conditions
          </Link>
          {' '}of Tiuri Nails &amp; Wigs Parlour
        </span>
      </label>
      {showTermsError && !agreed && (
        <p className="text-xs text-red-600 -mt-2">You must accept the Terms &amp; Conditions to create an account.</p>
      )}

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <Button type="submit" fullWidth size="lg" loading={loading} disabled={!agreed} variant="secondary"
        style={{
          background: agreed ? 'linear-gradient(180deg,#1e5038 0%,#0a2e1f 100%)' : undefined,
          border: '1px solid rgba(10,46,31,0.6)',
          color: agreed ? '#ffffff' : '#6b7280',
          boxShadow: agreed ? '0 1px 0 rgba(255,255,255,0.08) inset,0 4px 12px rgba(10,46,31,0.35)' : undefined,
        }}
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium text-neutral-900 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
