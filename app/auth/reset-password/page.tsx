'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth.api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (password.length < 8) { toast.error('Minimum 8 characters'); return; }
    setLoading(true);
    try {
      await authApi.resetPassword(password);
      toast.success('Password updated!');
      router.push('/auth/login');
    } catch {
      toast.error('Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Reset Password</h1>
          <p className="mt-2 text-sm text-neutral-500">Choose a new password for your account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="New Password" type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label="Confirm Password" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required error={confirm && confirm !== password ? 'Passwords do not match' : undefined} />
          <Button type="submit" fullWidth size="lg" loading={loading}>Update Password</Button>
        </form>
      </div>
    </div>
  );
}
