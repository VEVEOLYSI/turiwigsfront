'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CheckoutModal } from './CheckoutModal';

interface PayButtonProps {
  orderId?: string;
  bookingId?: string;
  amount: number;
  amountFormatted: string;
  description?: string;
  label?: string;
  onSuccess?: (reference: string) => void;
}

export function PayButton({
  orderId,
  bookingId,
  amount,
  amountFormatted,
  description,
  label = 'Pay Now',
  onSuccess,
}: PayButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        fullWidth
        size="lg"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Lock className="h-4 w-4" />
        {label} · {amountFormatted}
      </Button>

      <CheckoutModal
        open={open}
        onClose={() => setOpen(false)}
        orderId={orderId}
        bookingId={bookingId}
        amount={amountFormatted}
        description={description}
        onSuccess={(ref) => {
          setOpen(false);
          onSuccess?.(ref);
        }}
      />
    </>
  );
}
