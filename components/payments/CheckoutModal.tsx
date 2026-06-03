'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CardForm } from './CardForm';
import { PinStep } from './PinStep';
import { OtpStep } from './OtpStep';
import { useCheckout } from './useCheckout';
import { Button } from '@/components/ui/Button';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  orderId?: string;
  bookingId?: string;
  amount: string;           // formatted string e.g. "KES 1,200"
  description?: string;
  onSuccess?: (reference: string) => void;
}

const STEP_LABELS: Record<string, string> = {
  card: 'Payment Details',
  pin: 'Card PIN',
  otp: 'Verify OTP',
  success: 'Payment Successful',
  failed: 'Payment Failed',
};

export function CheckoutModal({
  open,
  onClose,
  orderId,
  bookingId,
  amount,
  description,
  onSuccess,
}: CheckoutModalProps) {
  const {
    step,
    loading,
    error,
    displayText,
    submitCard,
    submitPin,
    submitOtp,
    retry,
    goToOrders,
  } = useCheckout(orderId, bookingId, onSuccess);

  const canGoBack = step === 'pin' || step === 'otp';

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={step === 'success' ? onClose : () => {}}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full sm:translate-y-4 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-full sm:translate-y-4 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    {canGoBack && (
                      <button onClick={retry} className="rounded-xl p-1.5 hover:bg-neutral-100 transition-colors">
                        <ArrowLeft className="h-4 w-4 text-neutral-500" />
                      </button>
                    )}
                    <div>
                      <Dialog.Title className="text-sm font-semibold text-neutral-900">
                        {STEP_LABELS[step]}
                      </Dialog.Title>
                      {description && step === 'card' && (
                        <p className="text-xs text-neutral-400">{description}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="rounded-xl p-1.5 hover:bg-neutral-100 transition-colors disabled:opacity-40"
                  >
                    <X className="h-4 w-4 text-neutral-500" />
                  </button>
                </div>

                {/* Step indicator */}
                {(step === 'card' || step === 'pin' || step === 'otp') && (
                  <div className="flex gap-1.5 px-6 pt-4">
                    {['card', 'pin/otp', 'success'].map((_, i) => {
                      const currentIdx = step === 'card' ? 0 : step === 'pin' || step === 'otp' ? 1 : 2;
                      return (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= currentIdx ? 'bg-neutral-900' : 'bg-neutral-200'
                          }`}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Content */}
                <div className="px-6 py-6">
                  {step === 'card' && (
                    <CardForm
                      onSubmit={submitCard}
                      loading={loading}
                      error={error}
                      amount={amount}
                    />
                  )}

                  {step === 'pin' && (
                    <PinStep
                      onSubmit={submitPin}
                      loading={loading}
                      error={error}
                      displayText={displayText}
                    />
                  )}

                  {step === 'otp' && (
                    <OtpStep
                      onSubmit={submitOtp}
                      loading={loading}
                      error={error}
                      displayText={displayText}
                    />
                  )}

                  {step === 'success' && (
                    <div className="flex flex-col items-center gap-5 py-4 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900">Payment Successful!</h3>
                        <p className="mt-1.5 text-sm text-neutral-500">
                          Your payment of <strong>{amount}</strong> has been confirmed.
                        </p>
                      </div>
                      <div className="flex w-full flex-col gap-2.5">
                        <Button fullWidth onClick={goToOrders}>
                          View My Orders
                        </Button>
                        <Button fullWidth variant="ghost" onClick={onClose}>
                          Continue Shopping
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 'failed' && (
                    <div className="flex flex-col items-center gap-5 py-4 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <XCircle className="h-10 w-10 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900">Payment Failed</h3>
                        <p className="mt-1.5 text-sm text-neutral-500">
                          {error ?? 'Something went wrong. No money was charged.'}
                        </p>
                      </div>
                      <div className="flex w-full flex-col gap-2.5">
                        <Button fullWidth onClick={retry}>
                          Try Again
                        </Button>
                        <Button fullWidth variant="ghost" onClick={onClose}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
