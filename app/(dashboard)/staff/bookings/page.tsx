'use client';

import { useEffect, useState } from 'react';
import { BookingsTable } from '@/components/dashboard/BookingsTable';
import { adminApi } from '@/api/admin.api';
import { PageSpinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import type { Booking, BookingStatus } from '@/types';

const STATUS_FILTERS: { label: string; value: BookingStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function StaffBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const limit = 15;

  const fetch = (p = page) => {
    setLoading(true);
    adminApi.listBookings({ page: p, limit, status: statusFilter || undefined })
      .then(({ data }) => { setBookings(data.data); setTotal(data.meta.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1); setPage(1); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { fetch(page); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Bookings</h1>
        <p className="mt-1 text-sm text-neutral-400">Manage booking statuses for your shift.</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              statusFilter === f.value
                ? 'text-white shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-400'
            }`}
            style={statusFilter === f.value ? { background: '#0a2e1f' } : undefined}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <PageSpinner /> : (
        <>
          <BookingsTable
            bookings={bookings}
            onBookingUpdated={(updated) =>
              setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
            }
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-sm text-neutral-400">Page {page} of {totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
