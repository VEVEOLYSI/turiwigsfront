'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { loginThunk, fetchMeThunk } from '@/store/slices/auth.slice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginThunk(form));
    if (loginThunk.fulfilled.match(result)) {
      await dispatch(fetchMeThunk());
      toast.success('Welcome back!');
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <Link href="/auth/forgot-password" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" fullWidth size="lg" loading={loading}>
        Sign In
      </Button>

      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="font-medium text-neutral-900 hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
