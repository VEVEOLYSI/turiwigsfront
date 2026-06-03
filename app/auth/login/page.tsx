import { LoginForm } from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign In' };

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 text-3xl">✦</div>
          <h1 className="text-2xl font-bold text-neutral-900">Sign In</h1>
          <p className="mt-2 text-sm text-neutral-500">Welcome back to Tiuri</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
