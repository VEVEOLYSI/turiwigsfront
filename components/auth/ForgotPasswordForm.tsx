'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/api/auth.api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-7 w-7 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-neutral-900">Check your email</p>
          <p className="mt-1 text-sm text-neutral-500">
            We sent a reset link to <strong>{email}</strong>
          </p>
        </div>
        <Link href="/auth/login" className="text-sm font-medium text-neutral-900 hover:underline">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        hint="We'll send you a password reset link."
      />
      <Button type="submit" fullWidth size="lg" loading={loading}>
        Send Reset Link
      </Button>
      <p className="text-center text-sm text-neutral-500">
        <Link href="/auth/login" className="font-medium text-neutral-900 hover:underline">
          Back to Sign In
        </Link>
      </p>
    </form>
  );
}
