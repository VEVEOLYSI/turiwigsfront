'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { servicesApi } from '@/api/services.api';
import { formatPrice, formatDate } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import { bookingsApi } from '@/api/bookings.api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import type { Service, ServiceSlot } from '@/types';

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);
  const [slots, setSlots] = useState<ServiceSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    servicesApi.getBySlug(slug)
      .then(({ data }) => {
        setService(data.data);
        return servicesApi.getSlots(data.data.id);
      })
      .then(({ data }) => setSlots(data.data))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleBook = async () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    if (!selectedSlot && !service) return;
    const slot = slots.find((s) => s.id === selectedSlot);
    if (!slot) { toast.error('Please select a time slot'); return; }

    setBooking(true);
    try {
      const { data } = await bookingsApi.create({
        serviceId: service!.id,
        slotId: slot.id,
        scheduledDate: slot.slot_date,
        scheduledTime: slot.start_time,
      });
      toast.success(`Booking ${data.data.booking_number} created!`);
      router.push(`/account/bookings/${data.data.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Booking failed';
      toast.error(msg);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!service) return <div className="p-10 text-center text-neutral-500">Service not found</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
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

        {/* Slot picker */}
        <div className="rounded-2xl border border-neutral-200 p-5 space-y-4">
          <h2 className="font-semibold text-neutral-900">Available Slots</h2>
          {!slots.length ? (
            <p className="text-sm text-neutral-500">No slots currently available. Please check back soon.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.map((slot) => (
                <button key={slot.id} onClick={() => setSelectedSlot(slot.id)}
                  className={`rounded-xl border p-3 text-left text-sm transition-all ${selectedSlot === slot.id ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 hover:border-neutral-400'}`}>
                  <p className="font-medium">{formatDate(slot.slot_date)}</p>
                  <p className="mt-0.5 opacity-70">{slot.start_time} – {slot.end_time}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button fullWidth size="lg" onClick={handleBook} loading={booking} disabled={!selectedSlot}>
          {isAuthenticated ? `Book · ${formatPrice(service.price)}` : 'Sign in to Book'}
        </Button>
      </div>
    </div>
  );
}
