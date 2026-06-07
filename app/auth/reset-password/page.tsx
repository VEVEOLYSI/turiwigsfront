'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/api/auth.api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') ?? '';
  const token = params.get('token') ?? '';

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [invalid, setInvalid]     = useState(false);

  useEffect(() => {
    if (!email || !token) setInvalid(true);
  }, [email, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (password.length < 8)  { toast.error('Minimum 8 characters'); return; }
    setLoading(true);
    try {
      await authApi.resetPassword(email, token, password);
      toast.success('Password updated! You can now sign in.');
      router.push('/auth/login');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? '';
      if (msg.toLowerCase().includes('expired')) {
        toast.error('This reset link has expired. Please request a new one.');
      } else if (msg.toLowerCase().includes('invalid')) {
        toast.error('Invalid reset link. Please request a new one.');
      } else {
        toast.error('Reset failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (invalid) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-red-500">
          This reset link is invalid or incomplete.
        </p>
        <Button variant="secondary" onClick={() => router.push('/auth/forgot-password')}>
          Request a new link
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="New Password"
        type="password"
        placeholder="Min. 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        error={confirm && confirm !== password ? 'Passwords do not match' : undefined}
      />
      <Button type="submit" fullWidth size="lg" loading={loading}>
        Update Password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Reset Password</h1>
          <p className="mt-2 text-sm text-neutral-500">Choose a new password for your account.</p>
        </div>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
