'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CheckoutModal } from './CheckoutModal';
import type { CheckoutData } from '@/api/payments.api';

interface PayButtonProps {
  // New: checkout-first (order created after payment succeeds)
  checkoutData?: CheckoutData;
  // Legacy: pay against existing order/booking
  orderId?: string;
  bookingId?: string;
  amount: number;
  amountFormatted: string;
  description?: string;
  label?: string;
  onSuccess?: (reference: string, orderId?: string) => void;
}

export function PayButton({
  checkoutData,
  orderId,
  bookingId,
  amountFormatted,
  description,
  label = 'Pay Now',
  onSuccess,
}: PayButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button fullWidth size="lg" onClick={() => setOpen(true)} className="gap-2">
        <Lock className="h-4 w-4" />
        {label} · {amountFormatted}
      </Button>

      <CheckoutModal
        open={open}
        onClose={() => setOpen(false)}
        checkoutData={checkoutData}
        orderId={orderId}
        bookingId={bookingId}
        amount={amountFormatted}
        description={description}
        onSuccess={(ref, oid) => {
          setOpen(false);
          onSuccess?.(ref, oid);
        }}
      />
    </>
  );
}
