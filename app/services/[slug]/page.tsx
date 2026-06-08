'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Users, ArrowLeft, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { servicesApi } from '@/api/services.api';
import { formatPrice } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import { bookingsApi } from '@/api/bookings.api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { BookingPaymentModal } from '@/components/booking/BookingPaymentModal';
import type { Service, ServiceSlot } from '@/types';

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatSlotTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(todayIso());
  const [slots, setSlots] = useState<ServiceSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{
    bookingId: string;
    bookingNumber: string;
    depositAmount: number;
    balanceAmount: number;
  } | null>(null);

  // Load service once
  useEffect(() => {
    servicesApi.getBySlug(slug)
      .then(({ data }) => setService(data.data))
      .finally(() => setLoading(false));
  }, [slug]);

  // Reload slots whenever service or date changes
  useEffect(() => {
    if (!service) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    servicesApi.getSlots(service.id, selectedDate)
      .then(({ data }) => setSlots(data.data))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [service, selectedDate]);

  const handleBook = async () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    if (!selectedSlot || !service) return;
    const slot = slots.find((s) => (s.id ?? s.start_time) === selectedSlot);
    if (!slot) { toast.error('Please select a time slot'); return; }

    setBooking(true);
    try {
      const { data } = await bookingsApi.create({
        serviceId: service.id,
        ...(slot.id ? { slotId: slot.id } : {}),
        scheduledDate: slot.slot_date ?? selectedDate,
        scheduledTime: slot.start_time,
      });
      const b = data.data;
      setPaymentModal({
        bookingId: b.id,
        bookingNumber: b.booking_number,
        depositAmount: b.deposit_amount,
        balanceAmount: b.balance_amount,
      });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Could not create booking';
      toast.error(msg);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!service) return <div className="p-10 text-center text-neutral-500">Service not found</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {paymentModal && (
        <BookingPaymentModal
          bookingId={paymentModal.bookingId}
          bookingNumber={paymentModal.bookingNumber}
          serviceName={service.name}
          scheduledDate={selectedDate}
          scheduledTime={slots.find((s) => (s.id ?? s.start_time) === selectedSlot)?.start_time ?? ''}
          totalPrice={service.price}
          depositAmount={paymentModal.depositAmount}
          balanceAmount={paymentModal.balanceAmount}
          onClose={() => setPaymentModal(null)}
        />
      )}
      <Link href="/services" className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
        <ArrowLeft className="h-4 w-4" /> All Services
      </Link>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{service.name}</h1>
          {service.description && <p className="mt-3 text-neutral-600 leading-relaxed">{service.description}</p>}
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Clock className="h-4 w-4 text-neutral-400" />
              {service.duration_minutes} minutes
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Users className="h-4 w-4 text-neutral-400" />
              Capacity: {service.capacity}
            </div>
            <span className="text-xl font-bold text-neutral-900">{formatPrice(service.price)}</span>
          </div>
        </div>

        {/* Date + Slot picker */}
        <div className="rounded-2xl border border-neutral-200 p-5 space-y-4">
          {/* Date selector */}
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 text-neutral-400 shrink-0" />
            <label className="text-sm font-semibold text-neutral-700 shrink-0">Select date</label>
            <input
              type="date"
              value={selectedDate}
              min={todayIso()}
              onChange={(e) => { if (e.target.value) setSelectedDate(e.target.value); }}
              className="ml-auto rounded-xl border border-neutral-200 px-3 py-1.5 text-sm text-neutral-800 outline-none focus:border-neutral-400"
            />
          </div>

          <hr className="border-neutral-100" />

          <h2 className="font-semibold text-neutral-900">Available times</h2>

          {slotsLoading ? (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#c9a227', borderTopColor: 'transparent' }} />
            </div>
          ) : !slots.length ? (
            <p className="text-sm text-neutral-500">No slots available on this day. Try a different date.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const key = slot.id ?? slot.start_time;
                const isSelected = selectedSlot === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedSlot(isSelected ? null : key)}
                    className="rounded-xl border p-3 text-center text-sm transition-all"
                    style={{
                      background: isSelected ? '#0a2e1f' : '#fff',
                      borderColor: isSelected ? '#0a2e1f' : '#e5e7eb',
                      color: isSelected ? '#fff' : '#374151',
                    }}
                  >
                    <p className="font-semibold">{formatSlotTime(slot.start_time)}</p>
                    <p className="text-xs mt-0.5 opacity-70">{formatSlotTime(slot.end_time)}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Button fullWidth size="lg" onClick={handleBook} loading={booking} disabled={!selectedSlot || slotsLoading}>
          {isAuthenticated ? `Book · ${formatPrice(service.price)}` : 'Sign in to Book'}
        </Button>
      </div>
    </div>
  );
}
