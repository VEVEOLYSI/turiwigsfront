'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Calendar, Clock } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { OrdersTable } from '@/components/dashboard/OrdersTable';
import { adminApi, type StaffStats } from '@/api/admin.api';
import { PageSpinner } from '@/components/ui/Spinner';
import type { Order } from '@/types';

export default function StaffOverviewPage() {
  const [stats, setStats] = useState<StaffStats | null>(null);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = adminApi.getStaffStats()
      .then((res) => setStats(res.data.data))
      .catch(() => { /* stats endpoint optional */ });

    const fetchOrders = adminApi.listOrders({ page: 1, limit: 8, status: 'pending' })
      .then((res) => setPendingOrders(res.data.data))
      .catch(() => {});

    Promise.all([fetchStats, fetchOrders]).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Overview</h1>
        <p className="mt-1 text-sm text-neutral-400">Your work queue for today.</p>
      </div>

      {/* Stats — no revenue for staff */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Orders Today"
          value={stats?.orders_today ?? '—'}
          icon={ShoppingBag}
        />
        <StatCard
          label="Active Bookings"
          value={stats?.active_bookings ?? '—'}
          icon={Calendar}
        />
        <StatCard
          label="Pending Orders"
          value={stats?.pending_orders ?? '—'}
          icon={Clock}
          sub="Need processing"
        />
      </div>

      {/* Pending orders */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-800">Pending Orders</h2>
          <Link href="/staff/orders" className="text-xs font-medium text-gold hover:underline">
            View all →
          </Link>
        </div>
        <OrdersTable
          orders={pendingOrders}
          basePath="/staff/orders"
          canManagePayments={false}
          onOrderUpdated={(updated) =>
            setPendingOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
          }
        />
      </section>
    </div>
  );
}
