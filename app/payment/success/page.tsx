'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Navigation } from 'lucide-react';

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Tiuri+Nails+%26+Wigs+Parlour,+Jewel+Complex,+Room+220,+2nd+Floor+TRM+Dr,+Nairobi';
const PARLOUR_ADDRESS = 'Jewel Complex, Room 220, 2nd Floor, TRM Drive, Nairobi';
import { Button } from '@/components/ui/Button';

function PaymentSuccessContent() {
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
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#f0d878,#c9a227)', color: '#0a2e1f' }}
          >
            <Navigation className="h-4 w-4" />
            Get Directions to Salon
          </a>
          <p className="text-xs text-neutral-400">{PARLOUR_ADDRESS}</p>
          <Link href="/products">
            <Button fullWidth variant="secondary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}
