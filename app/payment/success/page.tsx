'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-sm text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Payment Successful!</h1>
          <p className="mt-2 text-neutral-500">
            Your payment has been confirmed. We&apos;re processing your order.
          </p>
          {reference && (
            <p className="mt-2 text-xs font-mono text-neutral-400">Ref: {reference}</p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/account/orders">
            <Button fullWidth>View My Orders</Button>
          </Link>
          <Link href="/products">
            <Button fullWidth variant="secondary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
