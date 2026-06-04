'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, DollarSign, ShoppingBag, Calendar,
  Users, Clock,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { OrdersTable } from '@/components/dashboard/OrdersTable';
import { adminApi, type AdminStats } from '@/api/admin.api';
import { formatPrice } from '@/utils/formatters';
import { PageSpinner } from '@/components/ui/Spinner';
import type { Order } from '@/types';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = adminApi.getStats()
      .then((res) => setStats(res.data.data))
      .catch(() => { /* stats endpoint optional — show '--' when not available */ });

    const fetchOrders = adminApi.listOrders({ page: 1, limit: 8 })
      .then((res) => setRecentOrders(res.data.data))
      .catch(() => {});

    Promise.all([fetchStats, fetchOrders]).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Overview</h1>
        <p className="mt-1 text-sm text-neutral-400">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Revenue Today"
          value={stats ? formatPrice(stats.revenue_today) : '—'}
          icon={DollarSign}
          highlight
        />
        <StatCard
          label="Revenue This Month"
          value={stats ? formatPrice(stats.revenue_month) : '—'}
          icon={TrendingUp}
          highlight
        />
        <StatCard
          label="Orders Today"
          value={stats?.orders_today ?? '—'}
          icon={ShoppingBag}
          sub={`${stats?.pending_orders ?? 0} pending`}
        />
        <StatCard
          label="Active Bookings"
          value={stats?.active_bookings ?? '—'}
          icon={Calendar}
        />
        <StatCard
          label="Total Customers"
          value={stats?.total_customers ?? '—'}
          icon={Users}
        />
        <StatCard
          label="Pending Orders"
          value={stats?.pending_orders ?? '—'}
          icon={Clock}
          sub="Need attention"
        />
      </div>

      {/* Recent orders */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-800">Recent Orders</h2>
          <Link href="/admin/orders"
            className="text-xs font-medium text-gold hover:underline">
            View all →
          </Link>
        </div>
        <OrdersTable
          orders={recentOrders}
          basePath="/admin/orders"
          canManagePayments
          onOrderUpdated={(updated) =>
            setRecentOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
          }
        />
      </section>
    </div>
  );
}
