'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { OrdersTable } from '@/components/dashboard/OrdersTable';
import { adminApi } from '@/api/admin.api';
import { PageSpinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import type { Order, OrderStatus } from '@/types';

const STATUS_FILTERS: { label: string; value: OrderStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
];

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const limit = 15;

  const fetch = (p = page) => {
    setLoading(true);
    adminApi.listOrders({
      page: p, limit,
      search: search || undefined,
      status: statusFilter || undefined,
    })
      .then(({ data }) => { setOrders(data.data); setTotal(data.meta.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1); setPage(1); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { fetch(page); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(1);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
        <p className="mt-1 text-sm text-neutral-400">
          You can update order status. Payment changes require admin access.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        <form onSubmit={handleSearch} className="flex gap-2 sm:w-64">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #…"
              className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">Go</Button>
        </form>
      </div>

      {loading ? <PageSpinner /> : (
        <>
          {/* canManagePayments=false → payment column is read-only badge */}
          <OrdersTable
            orders={orders}
            basePath="/staff/orders"
            canManagePayments={false}
            onOrderUpdated={(updated) =>
              setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
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
