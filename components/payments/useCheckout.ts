'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { paymentsApi, type ChargeResult, type CardDetails } from '@/api/payments.api';
import toast from 'react-hot-toast';

export type CheckoutStep = 'card' | 'pin' | 'otp' | 'success' | 'failed';

interface CheckoutState {
  step: CheckoutStep;
  reference: string | null;
  loading: boolean;
  error: string | null;
  displayText: string | null;
}

export function useCheckout(
  orderId?: string,
  bookingId?: string,
  onSuccess?: (reference: string) => void
) {
  const router = useRouter();
  const [state, setState] = useState<CheckoutState>({
    step: 'card',
    reference: null,
    loading: false,
    error: null,
    displayText: null,
  });

  function handleChargeResult(result: ChargeResult) {
    setState((s) => ({ ...s, reference: result.reference, loading: false, error: null }));

    switch (result.status) {
      case 'success':
        setState((s) => ({ ...s, step: 'success' }));
        onSuccess?.(result.reference);
        break;
      case 'send_pin':
        setState((s) => ({ ...s, step: 'pin', displayText: result.displayText ?? null }));
        break;
      case 'send_otp':
        setState((s) => ({ ...s, step: 'otp', displayText: result.displayText ?? null }));
        break;
      case 'open_url':
        // 3DS redirect
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        }
        break;
      case 'failed':
        setState((s) => ({ ...s, step: 'failed', error: result.message ?? 'Payment failed' }));
        break;
    }
  }

  async function submitCard(card: CardDetails, pin?: string) {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data } = await paymentsApi.charge({ card, orderId, bookingId, pin });
      handleChargeResult(data.data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Payment failed. Please check your card details.';
      setState((s) => ({ ...s, loading: false, error: msg }));
    }
  }

  async function submitPin(pin: string) {
    if (!state.reference) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data } = await paymentsApi.submitPin(state.reference, pin);
      handleChargeResult(data.data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Incorrect PIN. Please try again.';
      setState((s) => ({ ...s, loading: false, error: msg }));
    }
  }

  async function submitOtp(otp: string) {
    if (!state.reference) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data } = await paymentsApi.submitOtp(state.reference, otp);
      handleChargeResult(data.data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Incorrect OTP. Please try again.';
      setState((s) => ({ ...s, loading: false, error: msg }));
    }
  }

  function retry() {
    setState({ step: 'card', reference: null, loading: false, error: null, displayText: null });
  }

  function goToOrders() {
    router.push('/account/orders');
  }

  return { ...state, submitCard, submitPin, submitOtp, retry, goToOrders };
}
