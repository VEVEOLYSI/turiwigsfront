'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, User, FileText, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import {
  setNotes,
  setCreatedBooking,
  selectWizard,
} from '@/store/slices/booking-wizard.slice';
import { bookingsApi } from '@/api/bookings.api';
import { formatPrice, formatDate } from '@/utils/formatters';
import { BookingStepBar } from '@/components/bookings/BookingStepBar';

export default function SummaryPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const wizard = useAppSelector(selectWizard);
  const [localNotes, setLocalNotes] = useState(wizard.notes);
  const [loading, setLoading] = useState(false);

  const depositAmount = wizard.service
    ? Math.round(wizard.service.price * 0.3)
    : 0;
  const remaining = wizard.service
    ? wizard.service.price - depositAmount
    : 0;

  async function handleConfirm() {
    if (!wizard.service || !wizard.date || !wizard.time) {
      toast.error('Missing booking details. Please start over.');
      return;
    }

    dispatch(setNotes(localNotes));
    setLoading(true);

    try {
      const { data } = await bookingsApi.create({
        serviceId: wizard.service.id,
        slotId: wizard.slotId ?? undefined,
        scheduledDate: wizard.date,
        scheduledTime: wizard.time,
        notes: localNotes || undefined,
      });

      dispatch(
        setCreatedBooking({
          id: data.data.id,
          booking_number: data.data.booking_number,
        })
      );

      toast.success('Booking confirmed!');
      router.push(`/bookings/confirmation/${data.data.id}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Failed to create booking. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!wizard.service) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#faf6ed' }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: '#7a8694' }}>
            No service selected.
          </p>
          <Link href="/bookings/services" className="btn-gold rounded-xl px-5 inline-flex items-center h-11 font-semibold text-sm">
            Start Over
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#faf6ed' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/bookings/schedule"
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: '#fff', border: '1px solid #e0d8c8' }}
          >
            <ArrowLeft className="h-4 w-4" style={{ color: '#143d2a' }} />
          </Link>
          <h1 className="text-xl font-bold" style={{ color: '#0a2e1f' }}>
            Booking Summary
          </h1>
        </div>

        <div className="mb-5 mt-3">
          <BookingStepBar currentStep={4} />
        </div>

        {/* Service card */}
        <div className="card-sku p-4 mb-4">
          <div className="flex gap-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={wizard.service.imageUrl}
                alt={wizard.service.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base" style={{ color: '#0a2e1f' }}>
                {wizard.service.name}
              </h3>
              <p className="text-sm" style={{ color: '#7a8694' }}>
                {wizard.service.duration_minutes} min session
              </p>
            </div>
          </div>

          <div className="gold-divider my-3" />

          {/* Details */}
          <div className="space-y-2">
            {wizard.technician && (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#5a6872' }}>
                <User className="h-4 w-4 flex-shrink-0" style={{ color: '#c9a227' }} />
                <span>{wizard.technician.name} · {wizard.technician.title}</span>
              </div>
            )}
            {!wizard.technician && (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#5a6872' }}>
                <User className="h-4 w-4 flex-shrink-0" style={{ color: '#c9a227' }} />
                <span>Any Available Technician</span>
              </div>
            )}

            {wizard.date && (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#5a6872' }}>
                <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: '#c9a227' }} />
                <span>{formatDate(wizard.date)}</span>
              </div>
            )}

            {wizard.time && (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#5a6872' }}>
                <Clock className="h-4 w-4 flex-shrink-0" style={{ color: '#c9a227' }} />
                <span>{wizard.time}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="card-sku p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4" style={{ color: '#c9a227' }} />
            <label
              htmlFor="notes"
              className="font-semibold text-sm"
              style={{ color: '#0a2e1f' }}
            >
              Special Requests / Notes
            </label>
          </div>
          <textarea
            id="notes"
            rows={3}
            placeholder="Any special requests or notes for your technician..."
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            className="input-sku w-full rounded-xl text-sm p-3 resize-none focus:outline-none"
            style={{ color: '#0a2e1f' }}
          />
        </div>

        {/* Price breakdown */}
        <div className="card-sku p-4 mb-4">
          <h3 className="font-semibold text-sm mb-3" style={{ color: '#0a2e1f' }}>
            Price Breakdown
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: '#7a8694' }}>Service Price</span>
              <span className="font-medium" style={{ color: '#0a2e1f' }}>
                {formatPrice(wizard.service.price)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#7a8694' }}>Deposit (30%)</span>
              <span className="font-semibold" style={{ color: '#c9a227' }}>
                {formatPrice(depositAmount)}
              </span>
            </div>
            <div className="gold-divider my-1" />
            <div className="flex justify-between text-sm">
              <span style={{ color: '#7a8694' }}>Remaining Balance</span>
              <span className="font-medium" style={{ color: '#0a2e1f' }}>
                {formatPrice(remaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Cancellation policy */}
        <div
          className="flex items-start gap-2 rounded-xl px-4 py-3 mb-5"
          style={{
            background: 'rgba(10,46,31,0.06)',
            border: '1px solid rgba(10,46,31,0.12)',
          }}
        >
          <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#143d2a' }} />
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: '#143d2a' }}>
              Free Cancellation
            </p>
            <p className="text-xs" style={{ color: '#5a6872' }}>
              Cancel at least 24 hours before your appointment for a full refund.{' '}
              <Link href="/terms" className="underline" style={{ color: '#c9a227' }}>
                View terms
              </Link>
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={loading || !wizard.date || !wizard.time}
          className="btn-gold w-full rounded-xl font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ height: '52px' }}
        >
          {loading ? 'Confirming...' : `Confirm & Pay Deposit · ${formatPrice(depositAmount)}`}
        </button>
      </div>
    </div>
  );
}
