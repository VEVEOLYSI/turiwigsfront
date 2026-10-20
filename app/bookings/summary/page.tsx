'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useAuth } from '@/hooks/useAuth';
import {
  setNotes,
  setCreatedBooking,
  selectWizard,
} from '@/store/slices/booking-wizard.slice';
import { bookingsApi } from '@/api/bookings.api';
import { formatPrice } from '@/utils/formatters';
import { whatsappLink } from '@/config/contact';
import { BookingStepBar } from '@/components/bookings/BookingStepBar';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

export default function SummaryPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const wizard = useAppSelector(selectWizard);
  const { user, isAuthenticated } = useAuth();

  // null until the customer types, so a signed-in customer's name shows
  // pre-filled (and arrives late without clobbering anything they typed).
  const [typedName, setName] = useState<string | null>(null);
  const name = typedName ?? user?.name ?? '';
  const [phone, setPhone] = useState('');
  const [localNotes, setLocalNotes] = useState(wizard.notes);
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  // Set once the request is saved, so a customer who comes back from
  // WhatsApp sees their booking number and can reopen the chat.
  const [sent, setSent] = useState<{ bookingNumber: string | null; link: string } | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const depositAmount = wizard.service
    ? Math.round(wizard.service.price * 0.3)
    : 0;

  // date is a plain YYYY-MM-DD; parseISO reads it as local time, where
  // `new Date()` would read it as UTC and could land on the previous day.
  const prettyDate = wizard.date ? format(parseISO(wizard.date), 'EEE d MMM yyyy') : '';

  function buildMessage(bookingNumber: string | null): string {
    if (!wizard.service) return '';
    return [
      "Hi Tiuri, I'd like to book an appointment.",
      '',
      bookingNumber ? `Booking: ${bookingNumber}` : null,
      `Service: ${wizard.service.name} (${formatPrice(wizard.service.price)})`,
      `Date: ${prettyDate}`,
      `Time: ${wizard.time ?? ''}`,
      `Name: ${name.trim()}`,
      phone.trim() ? `Phone: ${phone.trim()}` : null,
      localNotes.trim() ? `Notes: ${localNotes.trim()}` : null,
      '',
      'Please confirm if this slot works for you. Thank you!',
    ]
      .filter((line) => line !== null)
      .join('\n');
  }

  async function handleWhatsApp() {
    if (!wizard.service || !wizard.date || !wizard.time) return;
    // Already saved: a second tap reopens the chat rather than holding a
    // second time for the same customer.
    if (sent) {
      window.location.href = sent.link;
      return;
    }
    if (!name.trim()) {
      setNameError(true);
      nameRef.current?.focus();
      return;
    }

    dispatch(setNotes(localNotes));
    setSending(true);

    // Save the request first: that is what holds the time for this customer.
    let bookingNumber: string | null = null;
    try {
      const { data } = await bookingsApi.createGuest({
        serviceId: wizard.service.id,
        scheduledDate: wizard.date,
        scheduledTime: wizard.time,
        name: name.trim(),
        phone: phone.trim() || undefined,
        notes: localNotes.trim() || undefined,
      });
      bookingNumber = data.data.booking_number;
    } catch (err: unknown) {
      const res = (err as { response?: { status?: number; data?: { error?: string } } })?.response;
      if (res?.status === 409) {
        toast.error(res.data?.error ?? 'That time was just taken. Please pick another time.');
        setSending(false);
        router.push('/bookings/schedule');
        return;
      }
      if (res?.status && res.status < 500 && res.status !== 429) {
        toast.error(res.data?.error ?? 'Please check your details and try again.');
        setSending(false);
        return;
      }
      // Server down or busy: don't lose the customer. Send the WhatsApp
      // message anyway; staff will slot it in by hand.
    }

    const link = whatsappLink(buildMessage(bookingNumber));
    setSent({ bookingNumber, link });
    setSending(false);
    // Same-tab navigation: unlike a new window opened after an await, no
    // browser blocks it. Phones hand it straight to the WhatsApp app.
    window.location.href = link;
  }

  async function handlePayOnline() {
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

  if (!wizard.service || !wizard.date || !wizard.time) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f4f4f2' }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: '#8b8881' }}>
            {wizard.service ? 'Pick a date and time first.' : 'No service selected.'}
          </p>
          <Link
            href={wizard.service ? '/bookings/schedule' : '/bookings/services'}
            className="btn-ink rounded-xl px-5 inline-flex items-center h-11 font-semibold text-sm"
          >
            {wizard.service ? 'Choose a time' : 'Start Over'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#f4f4f2' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/bookings/schedule"
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: '#fff', border: '1px solid #dedcd7' }}
          >
            <ArrowLeft className="h-4 w-4" style={{ color: '#55534e' }} />
          </Link>
          <h1 className="text-xl font-bold" style={{ color: '#171614' }}>
            Your Details
          </h1>
        </div>

        <div className="mb-5 mt-3">
          <BookingStepBar currentStep={3} />
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
              <h3 className="font-semibold text-base" style={{ color: '#171614' }}>
                {wizard.service.name}
              </h3>
              <p className="text-sm" style={{ color: '#8b8881' }}>
                {wizard.service.duration_minutes} min · {formatPrice(wizard.service.price)}
              </p>
            </div>
          </div>

          <div className="rule my-3" />

          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#55534e' }}>
                <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: '#8b8881' }} />
                <span>{prettyDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#55534e' }}>
                <Clock className="h-4 w-4 flex-shrink-0" style={{ color: '#8b8881' }} />
                <span>{wizard.time}</span>
              </div>
            </div>
            <Link
              href="/bookings/schedule"
              className="text-sm font-semibold underline underline-offset-4"
              style={{ color: '#171614' }}
            >
              Change
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="card-sku p-4 mb-4 space-y-4">
          <div>
            <label htmlFor="name" className="block font-semibold text-sm mb-1.5" style={{ color: '#171614' }}>
              Your name
            </label>
            <input
              ref={nameRef}
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(false);
              }}
              aria-invalid={nameError}
              aria-describedby={nameError ? 'name-error' : undefined}
              className="input-sku w-full rounded-xl text-sm px-3 h-11 focus:outline-none"
              style={{ color: '#171614', ...(nameError ? { borderColor: '#b42318' } : {}) }}
            />
            {nameError && (
              <p id="name-error" className="mt-1.5 text-xs" style={{ color: '#b42318' }}>
                Add your name so we know who the booking is for.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block font-semibold text-sm mb-1.5" style={{ color: '#171614' }}>
              Phone number <span className="font-normal" style={{ color: '#8b8881' }}>(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Only if it's different from your WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-sku w-full rounded-xl text-sm px-3 h-11 focus:outline-none"
              style={{ color: '#171614' }}
            />
          </div>

          <div>
            <label htmlFor="notes" className="block font-semibold text-sm mb-1.5" style={{ color: '#171614' }}>
              Notes <span className="font-normal" style={{ color: '#8b8881' }}>(optional)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Nail shape, colour, inspiration, anything we should know…"
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              className="input-sku w-full rounded-xl text-sm p-3 resize-none focus:outline-none"
              style={{ color: '#171614' }}
            />
          </div>
        </div>

        <p className="text-xs mb-4 px-1" style={{ color: '#55534e' }}>
          We&apos;ll hold this time for you and open WhatsApp with your booking written
          out. Edit it if you like, then send — we&apos;ll reply to confirm.
        </p>

        {/* CTA */}
        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={sending}
          className="flex w-full items-center justify-center gap-2 rounded-xl font-semibold text-base text-white transition-opacity disabled:opacity-60"
          style={{ height: '52px', background: '#167a45' }}
        >
          <WhatsAppIcon className="h-5 w-5" />
          {sending ? 'Holding your time…' : 'Book via WhatsApp'}
        </button>

        {sent && (
          <div
            className="mt-4 rounded-xl px-4 py-3 text-sm"
            style={{ background: '#e8f3ec', border: '1px solid #b9dcc6', color: '#173b26' }}
            role="status"
          >
            {sent.bookingNumber ? (
              <p>
                Your time is held under <strong>{sent.bookingNumber}</strong>. Send the
                WhatsApp message and we&apos;ll confirm it.
              </p>
            ) : (
              <p>Send the WhatsApp message and we&apos;ll confirm your time.</p>
            )}
            <a
              href={sent.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block font-semibold underline underline-offset-4"
            >
              Didn&apos;t open? Open WhatsApp again
            </a>
          </div>
        )}

        {isAuthenticated && !sent && (
          <button
            onClick={handlePayOnline}
            disabled={loading}
            className="mt-3 w-full rounded-xl text-sm font-semibold underline underline-offset-4 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ height: '44px', color: '#55534e' }}
          >
            {loading ? 'Confirming…' : `Or book here and pay the deposit online · ${formatPrice(depositAmount)}`}
          </button>
        )}
      </div>
    </div>
  );
}
