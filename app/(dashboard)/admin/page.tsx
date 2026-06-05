'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  TrendingUp, DollarSign, Calendar, Users, ShoppingBag,
  AlertTriangle, CheckCircle, Clock, Package, CreditCard,
  ArrowUpRight, ArrowDownRight, Activity, RefreshCw,
  Layers, BarChart2, FileText, ChevronRight,
} from 'lucide-react';
import { analyticsApi } from '@/api/analytics.api';
import { adminApi } from '@/api/admin.api';
import type { RevenueData, PLData, StaffPerformanceItem, BookingAnalytics, SalonInventoryAlerts, DashboardSummary } from '@/api/analytics.api';
import type { Order } from '@/types';
import { SparkLine } from '@/components/dashboard/charts/SparkLine';
import { MiniBarChart } from '@/components/dashboard/charts/MiniBarChart';
import { DonutChart } from '@/components/dashboard/charts/DonutChart';
import { ProgressRow } from '@/components/dashboard/charts/ProgressRow';
import { formatPrice, formatDate } from '@/utils/formatters';
import { cn } from '@/utils/cn';

// ─── Colours ──────────────────────────────────────────────────────────────────
const GOLD    = '#c9a227';
const DARK    = '#0a2e1f';
const GREEN   = '#10b981';
const RED     = '#ef4444';
const BLUE    = '#3b82f6';
const ORANGE  = '#f97316';
const PURPLE  = '#8b5cf6';

const STATUS_COLOR: Record<string, string> = {
  completed: GREEN, confirmed: BLUE, pending: ORANGE,
  in_progress: PURPLE, cancelled: RED, no_show: '#9ca3af',
};

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

function SectionCard({ title, action, actionHref, children, className }: {
  title: string; action?: string; actionHref?: string;
  children: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn('bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden', className)}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-50">
        <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
        {action && actionHref && (
          <Link href={actionHref}
            className="text-xs font-medium flex items-center gap-0.5"
            style={{ color: GOLD }}>
            {action} <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function KpiCard({ label, value, sub, icon: Icon, spark, trend, highlight, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; spark?: number[]; trend?: number;
  highlight?: boolean; color?: string;
}) {
  const trendUp = (trend ?? 0) >= 0;
  return (
    <div
      className="rounded-2xl border p-4 shadow-sm flex flex-col gap-3"
      style={highlight
        ? { background: `linear-gradient(135deg, ${DARK} 0%, #143d2a 100%)`, borderColor: `${GOLD}22` }
        : { background: '#fff', borderColor: '#f0f0f0' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: highlight ? `${GOLD}99` : '#9ca3af' }}>
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold truncate"
            style={{ color: highlight ? '#fff' : '#111827' }}>
            {value}
          </p>
          {sub && (
            <p className="mt-0.5 text-[11px]" style={{ color: highlight ? '#ffffff55' : '#9ca3af' }}>
              {sub}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 rounded-xl p-2.5"
          style={{ background: highlight ? `${GOLD}28` : `${color ?? GOLD}18` }}>
          <Icon className="h-5 w-5" style={{ color: color ?? GOLD }} />
        </div>
      </div>

      {spark && spark.length > 1 && (
        <div className="h-8 -mx-1">
          <SparkLine data={spark} color={highlight ? GOLD : (color ?? GOLD)} id={label} />
        </div>
      )}

      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {trendUp
            ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
            : <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />}
          <span className="text-[11px] font-medium" style={{ color: trendUp ? GREEN : RED }}>
            {Math.abs(trend).toFixed(1)}% vs last period
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Status dot ───────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize px-2 py-0.5 rounded-full"
      style={{
        background: `${STATUS_COLOR[status] ?? '#9ca3af'}18`,
        color: STATUS_COLOR[status] ?? '#9ca3af',
      }}>
      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0"
        style={{ background: STATUS_COLOR[status] ?? '#9ca3af' }} />
      {status.replace('_', ' ')}
    </span>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function AdminOverviewPage() {
  const [revenue, setRevenue]     = useState<RevenueData | null>(null);
  const [pl, setPL]               = useState<PLData | null>(null);
  const [staff, setStaff]         = useState<StaffPerformanceItem[]>([]);
  const [bookings, setBookings]   = useState<BookingAnalytics | null>(null);
  const [inventory, setInventory] = useState<SalonInventoryAlerts | null>(null);
  const [summary, setSummary]     = useState<DashboardSummary | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow]             = useState(new Date());

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    const results = await Promise.allSettled([
      analyticsApi.getRevenue('7d'),
      analyticsApi.getPL('3m'),
      analyticsApi.getStaffPerformance(),
      analyticsApi.getBookings('7d'),
      analyticsApi.getSalonInventory(),
      analyticsApi.getDashboard(),
      adminApi.listOrders({ page: 1, limit: 6 }),
    ]);
    if (results[0].status === 'fulfilled') setRevenue(results[0].value.data.data);
    if (results[1].status === 'fulfilled') setPL(results[1].value.data.data);
    if (results[2].status === 'fulfilled') setStaff(results[2].value.data.data as StaffPerformanceItem[]);
    if (results[3].status === 'fulfilled') setBookings(results[3].value.data.data);
    if (results[4].status === 'fulfilled') setInventory(results[4].value.data.data as SalonInventoryAlerts);
    if (results[5].status === 'fulfilled') setSummary(results[5].value.data.data);
    if (results[6].status === 'fulfilled') setRecentOrders(results[6].value.data.data);
    setLoading(false); setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const dayName = now.toLocaleDateString('en-KE', { weekday: 'long' });
  const dateStr = now.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

  const sparkRevenue = revenue?.daily?.map((d) => d.revenue) ?? [];
  const totalAlerts = (summary?.alerts.pendingLeaves ?? 0) +
    (summary?.alerts.lowStockItems ?? 0) +
    (summary?.alerts.assetsNeedingService ?? 0);

  const bookingsByStatus = bookings?.byStatus ?? {};
  const totalBookingsPeriod = bookings?.total ?? 0;
  const donutSegments = [
    { label: 'Completed',  value: bookingsByStatus.completed  ?? 0, color: GREEN  },
    { label: 'Confirmed',  value: bookingsByStatus.confirmed  ?? 0, color: BLUE   },
    { label: 'Pending',    value: bookingsByStatus.pending    ?? 0, color: ORANGE },
    { label: 'Cancelled',  value: bookingsByStatus.cancelled  ?? 0, color: RED    },
    { label: 'No-show',    value: bookingsByStatus.no_show    ?? 0, color: '#d1d5db' },
  ].filter((s) => s.value > 0);

  const latestPL = pl?.monthly?.[0];
  const revenueDayBars = (revenue?.daily ?? []).slice(-7).map((d) => ({
    label: new Date(d.day).toLocaleDateString('en', { weekday: 'short' }),
    value: d.revenue,
    color: GOLD,
  }));

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Activity className="h-8 w-8 animate-pulse" style={{ color: GOLD }} />
          <p className="text-sm text-neutral-400">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">IT Admin Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            {dayName}, {dateStr} · {timeStr}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {totalAlerts > 0 && (
            <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: `${ORANGE}18`, color: ORANGE }}>
              <AlertTriangle className="h-3 w-3" /> {totalAlerts} alert{totalAlerts > 1 ? 's' : ''}
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: `${GREEN}15`, color: GREEN }}>
            <CheckCircle className="h-3 w-3" /> System Running
          </span>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-all"
          >
            <RefreshCw className={cn('h-3 w-3', refreshing && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── KPI row ───────────────────────────────────────────────── */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          label="Revenue Today"
          value={revenue?.daily?.at(-1)?.revenue != null
            ? formatPrice(revenue.daily.at(-1)!.revenue)
            : '—'}
          sub={`${revenue?.daily?.at(-1)?.order_count ?? 0} orders`}
          icon={DollarSign}
          spark={sparkRevenue}
          highlight
        />
        <KpiCard
          label="Revenue 7 Days"
          value={revenue ? formatPrice(revenue.total) : '—'}
          sub={`${revenue?.orderCount ?? 0} orders`}
          icon={TrendingUp}
          spark={sparkRevenue}
          highlight
        />
        <KpiCard
          label="Bookings Today"
          value={summary?.today.bookings ?? '—'}
          sub="Active appointments"
          icon={Calendar}
          color={BLUE}
        />
        <KpiCard
          label="Active Staff"
          value={staff.length || '—'}
          sub={`${staff.filter((s) => s.completed > 0).length} productive`}
          icon={Users}
          color={PURPLE}
        />
        <KpiCard
          label="System Alerts"
          value={totalAlerts || '0'}
          sub={totalAlerts ? 'Need attention' : 'All clear'}
          icon={AlertTriangle}
          color={totalAlerts > 0 ? ORANGE : GREEN}
        />
      </div>

      {/* ── Revenue chart + Booking donut + Quick actions ─────────── */}
      <div className="grid gap-4 lg:grid-cols-12">

        {/* Revenue bars */}
        <SectionCard title="Revenue — Last 7 Days" className="lg:col-span-5">
          <div className="p-5 space-y-3">
            {revenueDayBars.length > 0 ? (
              <>
                <MiniBarChart bars={revenueDayBars} height={72} showValues />
                <div className="flex justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-50">
                  <span>Total: <strong className="text-neutral-800">{formatPrice(revenue?.total ?? 0)}</strong></span>
                  <span>Avg/day: <strong className="text-neutral-800">
                    {formatPrice((revenue?.total ?? 0) / Math.max(revenueDayBars.length, 1))}
                  </strong></span>
                </div>
              </>
            ) : (
              <p className="text-sm text-neutral-400 text-center py-6">No revenue data</p>
            )}
          </div>
        </SectionCard>

        {/* Booking donut */}
        <SectionCard title="Booking Status — 7 Days" className="lg:col-span-4">
          <div className="p-5 flex flex-col items-center gap-4">
            {donutSegments.length > 0 ? (
              <>
                <DonutChart
                  segments={donutSegments}
                  size={110}
                  thickness={13}
                  center={
                    <div className="text-center">
                      <p className="text-xl font-bold text-neutral-900">{totalBookingsPeriod}</p>
                      <p className="text-[10px] text-neutral-400">total</p>
                    </div>
                  }
                />
                <div className="w-full space-y-1.5">
                  {donutSegments.map((seg) => (
                    <div key={seg.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                        <span className="text-neutral-600">{seg.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-800">{seg.value}</span>
                        <span className="text-neutral-400">{((seg.value / totalBookingsPeriod) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-neutral-400 text-center py-6">No booking data</p>
            )}
          </div>
        </SectionCard>

        {/* Quick Actions */}
        <SectionCard title="Quick Actions" className="lg:col-span-3">
          <div className="p-4 grid grid-cols-2 gap-2">
            {[
              { label: 'New Booking', href: '/admin/bookings', icon: Calendar, color: BLUE },
              { label: 'Add Product', href: '/admin/products', icon: Package, color: GOLD },
              { label: 'All Orders', href: '/admin/orders', icon: ShoppingBag, color: PURPLE },
              { label: 'Payroll',    href: '/admin/payroll', icon: CreditCard, color: GREEN },
              { label: 'Inventory', href: '/admin/inventory', icon: Layers, color: ORANGE },
              { label: 'Reports',   href: '/admin/analytics', icon: BarChart2, color: DARK },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex flex-col items-center gap-1.5 rounded-xl p-3 border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all text-center"
              >
                <div className="rounded-lg p-2" style={{ background: `${a.color}15` }}>
                  <a.icon className="h-4 w-4" style={{ color: a.color }} />
                </div>
                <span className="text-[10px] font-medium text-neutral-700 leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ── P&L + Inventory alerts ─────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-12">

        {/* P&L */}
        <SectionCard title="P&L — Last 3 Months" className="lg:col-span-5">
          <div className="p-5 space-y-4">
            {pl?.monthly?.length ? (
              <>
                {/* Summary row */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Revenue', value: pl.totalRevenue, color: GREEN },
                    { label: 'Expenses', value: pl.totalExpenses, color: RED },
                    { label: 'Net Profit', value: pl.netProfit, color: pl.netProfit >= 0 ? BLUE : RED },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl p-3" style={{ background: `${m.color}0d` }}>
                      <p className="text-[10px] text-neutral-500 font-medium">{m.label}</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: m.color }}>
                        {formatPrice(m.value)}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Monthly breakdown */}
                <div className="space-y-2.5">
                  {pl.monthly.slice(0, 3).map((m) => (
                    <div key={m.month} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-neutral-500">
                        <span>{new Date(m.month).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span>
                        <span className={cn('font-medium', Number(m.net_profit) >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                          {formatPrice(Number(m.net_profit))}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((Number(m.total_revenue) / Math.max(pl.totalRevenue, 1)) * 100, 100)}%`,
                            background: GREEN,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-neutral-400 text-center py-4">No P&L data yet. Add expenses to see breakdown.</p>
            )}
          </div>
        </SectionCard>

        {/* Low stock */}
        <SectionCard title="Inventory Alerts" action="View all" actionHref="/admin/inventory" className="lg:col-span-4">
          <div className="p-4 space-y-2">
            {(inventory?.outOfStock?.length ?? 0) > 0 && (
              <div className="rounded-xl p-3" style={{ background: `${RED}0d` }}>
                <p className="text-xs font-semibold" style={{ color: RED }}>
                  Out of Stock ({inventory!.outOfStock.length})
                </p>
                <ul className="mt-1.5 space-y-0.5">
                  {inventory!.outOfStock.slice(0, 3).map((i) => (
                    <li key={i.id} className="text-[11px] text-neutral-600 truncate">• {i.name}</li>
                  ))}
                </ul>
              </div>
            )}
            {(inventory?.lowStock?.length ?? 0) > 0 ? (
              <div className="space-y-2">
                {inventory!.lowStock.slice(0, 5).map((i) => (
                  <ProgressRow
                    key={i.id}
                    label={i.name}
                    value={Number(i.stock_quantity)}
                    max={Number(i.low_stock_threshold) * 2}
                    displayValue={`${i.stock_quantity} ${i.unit}`}
                    color={ORANGE}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-5 gap-2">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
                <p className="text-xs text-neutral-400">All stock levels healthy</p>
              </div>
            )}
          </div>
        </SectionCard>

        {/* System alerts */}
        <SectionCard title="Operational Alerts" className="lg:col-span-3">
          <div className="p-4 space-y-3">
            {[
              {
                label: 'Leave Requests',
                value: summary?.alerts.pendingLeaves ?? 0,
                href: '/admin/hr',
                icon: Clock,
                color: ORANGE,
                unit: 'pending',
              },
              {
                label: 'Low Stock Items',
                value: summary?.alerts.lowStockItems ?? 0,
                href: '/admin/inventory',
                icon: Package,
                color: RED,
                unit: 'items',
              },
              {
                label: 'Asset Maintenance',
                value: summary?.alerts.assetsNeedingService ?? 0,
                href: '/admin/assets',
                icon: AlertTriangle,
                color: BLUE,
                unit: 'due soon',
              },
            ].map((a) => (
              <Link key={a.href} href={a.href}
                className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-all group">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg p-1.5" style={{ background: `${a.color}15` }}>
                    <a.icon className="h-3.5 w-3.5" style={{ color: a.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-700">{a.label}</p>
                    <p className="text-[10px] text-neutral-400">{a.unit}</p>
                  </div>
                </div>
                <span className="text-lg font-bold" style={{ color: a.value > 0 ? a.color : GREEN }}>
                  {a.value}
                </span>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ── Staff Performance ──────────────────────────────────────── */}
      {staff.length > 0 && (
        <SectionCard title="Staff Performance" action="HR module" actionHref="/admin/hr">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                  {['Staff Member', 'Completed', 'No-shows', 'Revenue', 'Commission (Pending)', 'Commission (Paid)', 'Performance'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.slice(0, 8).map((s, idx) => {
                  const total = (s.completed + s.no_shows + s.cancellations) || 1;
                  const rate = Math.round((s.completed / total) * 100);
                  return (
                    <tr key={s.staff_id}
                      className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
                      style={idx % 2 === 0 ? {} : { background: '#fafafa' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: `${GOLD}20`, color: DARK }}>
                            {s.staff_name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <span className="font-medium text-neutral-800">{s.staff_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ background: `${GREEN}18`, color: GREEN }}>
                          {s.completed}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-500">{s.no_shows}</td>
                      <td className="px-4 py-3 font-semibold text-neutral-800">
                        {formatPrice(s.revenue_generated || 0)}
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ color: ORANGE }}>{formatPrice(s.pending_commission || 0)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ color: GREEN }}>{formatPrice(s.paid_commission || 0)}</span>
                      </td>
                      <td className="px-4 py-3 w-32">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                            <div className="h-full rounded-full"
                              style={{ width: `${rate}%`, background: rate >= 80 ? GREEN : rate >= 60 ? ORANGE : RED }} />
                          </div>
                          <span className="text-[10px] font-medium text-neutral-500">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* ── Recent orders ──────────────────────────────────────────── */}
      <SectionCard title="Recent Orders" action="View all" actionHref="/admin/orders">
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                  {['Order', 'Customer', 'Amount', 'Payment', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-neutral-700 text-[11px]">
                      {o.order_number}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 max-w-[120px] truncate">
                      {(o as { customer_name?: string }).customer_name ?? '—'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-neutral-900">
                      {formatPrice(o.total_amount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusDot status={o.payment_status} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusDot status={o.order_status} />
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {formatDate(o.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.id}`}
                        className="text-[10px] font-medium hover:underline"
                        style={{ color: GOLD }}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-8 text-center">
            <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-neutral-200" />
            <p className="text-sm text-neutral-400">No orders yet</p>
          </div>
        )}
      </SectionCard>

      {/* ── Commission summary bar ─────────────────────────────────── */}
      {staff.length > 0 && (
        <SectionCard title="Commission Distribution — This Month" action="Manage payroll" actionHref="/admin/payroll">
          <div className="p-5 space-y-3">
            {staff
              .filter((s) => (s.pending_commission || 0) + (s.paid_commission || 0) > 0)
              .slice(0, 6)
              .map((s) => {
                const total = Math.max(staff.reduce((a, b) => a + (b.pending_commission || 0), 0), 1);
                return (
                  <ProgressRow
                    key={s.staff_id}
                    label={s.staff_name}
                    value={s.pending_commission || 0}
                    max={total}
                    displayValue={`${formatPrice(s.pending_commission || 0)} pending`}
                    color={GOLD}
                  />
                );
              })}
            {staff.every((s) => !s.pending_commission) && (
              <p className="text-sm text-neutral-400 text-center py-2">All commissions paid out</p>
            )}
          </div>
        </SectionCard>
      )}

    </div>
  );
}
