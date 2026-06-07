'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Calendar, CheckCircle, Clock, DollarSign,
  AlertCircle, ChevronRight, Loader2,
  UserCheck, Coffee, Zap, Star,
} from 'lucide-react';
import { staffDashboardApi } from '@/api/staff-dashboard.api';
import type { ScheduleEntry, CommissionSummaryOwn, OwnPerformance, OwnStaffProfile } from '@/api/staff-dashboard.api';
import { hrApi } from '@/api/hr.api';
import type { AttendanceRecord } from '@/api/hr.api';
import { ProgressRow } from '@/components/dashboard/charts/ProgressRow';
import { formatPrice } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import { useRealtimeRefresh } from '@/hooks/useRealtimeRefresh';

const GOLD   = '#c9a227';
const DARK   = '#0a2e1f';
const GREEN  = '#10b981';
const RED    = '#ef4444';
const BLUE   = '#3b82f6';
const ORANGE = '#f97316';
const PURPLE = '#8b5cf6';

const STATUS_CONFIG: Record<string, { color: string; label: string; bg: string }> = {
  pending:    { color: ORANGE,  label: 'Pending',     bg: `${ORANGE}18` },
  confirmed:  { color: BLUE,    label: 'Confirmed',   bg: `${BLUE}18` },
  in_progress:{ color: PURPLE,  label: 'In Progress', bg: `${PURPLE}18` },
  completed:  { color: GREEN,   label: 'Completed',   bg: `${GREEN}18` },
  cancelled:  { color: RED,     label: 'Cancelled',   bg: `${RED}18` },
  no_show:    { color: '#9ca3af', label: 'No-show',   bg: '#f3f4f6' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize"
      style={{ color: cfg.color, background: cfg.bg }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

// Quick action to update booking status
function StatusButton({ status, onClick, disabled }: {
  status: 'in_progress' | 'completed' | 'no_show';
  onClick: () => void;
  disabled: boolean;
}) {
  const labels: Record<string, { label: string; color: string }> = {
    in_progress: { label: 'Start',    color: PURPLE },
    completed:   { label: 'Complete', color: GREEN  },
    no_show:     { label: 'No-show',  color: RED    },
  };
  const cfg = labels[status];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg px-2.5 py-1 text-[10px] font-semibold border transition-all disabled:opacity-40"
      style={{ borderColor: `${cfg.color}40`, color: cfg.color, background: `${cfg.color}0d` }}
    >
      {cfg.label}
    </button>
  );
}

export default function StaffOverviewPage() {
  const [schedule, setSchedule]       = useState<ScheduleEntry[]>([]);
  const [commissions, setCommissions] = useState<CommissionSummaryOwn | null>(null);
  const [performance, setPerformance] = useState<OwnPerformance | null>(null);
  const [profile, setProfile]         = useState<OwnStaffProfile | null>(null);
  const [attendance, setAttendance]   = useState<AttendanceRecord | null>(null);
  const [loading, setLoading]         = useState(true);
  const [clockLoading, setClockLoading] = useState(false);
  const [showClockOutModal, setShowClockOutModal] = useState(false);
  const [clockOutNote, setClockOutNote] = useState('');
  const [updatingId, setUpdatingId]   = useState<string | null>(null);
  const [now, setNow]                 = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const load = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled([
      staffDashboardApi.getSchedule({ date: today }),
      staffDashboardApi.getCommissionSummary(),
      staffDashboardApi.getOwnPerformance(),
      staffDashboardApi.getOwnProfile(),
      hrApi.getMyAttendance({ startDate: today, endDate: today, limit: 1 }),
    ]);
    if (results[0].status === 'fulfilled') setSchedule(results[0].value.data.data as ScheduleEntry[]);
    if (results[1].status === 'fulfilled') setCommissions(results[1].value.data.data);
    if (results[2].status === 'fulfilled') setPerformance(results[2].value.data.data);
    if (results[3].status === 'fulfilled') setProfile(results[3].value.data.data);
    if (results[4].status === 'fulfilled') {
      const records = results[4].value.data.data as AttendanceRecord[];
      setAttendance(records[0] ?? null);
    }
    setLoading(false);
  }, [today]);

  useEffect(() => { load(); }, [load]);

  useRealtimeRefresh(['service_bookings', 'attendance_records', 'commission_earnings'], load);

  const handleClockIn = async () => {
    setClockLoading(true);
    try {
      const res = await hrApi.clockIn();
      setAttendance(res.data.data);
      toast.success('Clocked in successfully!');
    } catch {
      toast.error('Clock-in failed');
    } finally {
      setClockLoading(false);
    }
  };

  const handleClockOut = () => {
    setClockOutNote('');
    setShowClockOutModal(true);
  };

  const submitClockOut = async (note?: string) => {
    setClockLoading(true);
    setShowClockOutModal(false);
    try {
      const res = await hrApi.clockOut(note);
      setAttendance(res.data.data);
      toast.success('Clocked out. Have a great day!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Clock-out failed';
      toast.error(msg);
      // Re-show modal if backend says note is required
      if (msg.includes('reason')) setShowClockOutModal(true);
    } finally {
      setClockLoading(false);
    }
  };

  const handleStatusUpdate = async (
    bookingId: string,
    status: 'in_progress' | 'completed' | 'no_show'
  ) => {
    setUpdatingId(bookingId);
    try {
      await staffDashboardApi.updateBookingStatus(bookingId, status);
      setSchedule((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      toast.success(`Booking marked as ${status.replace('_', ' ')}`);
    } catch {
      toast.error('Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const todayBookings  = schedule.filter((b) => !['cancelled'].includes(b.status));
  const completed      = schedule.filter((b) => b.status === 'completed').length;
  const inProgress     = schedule.find((b) => b.status === 'in_progress');
  const upcoming       = schedule.filter((b) => ['pending', 'confirmed'].includes(b.status));
  const completionRate = todayBookings.length
    ? Math.round((completed / todayBookings.length) * 100)
    : 0;

  const isClockedIn  = !!attendance?.clock_in && !attendance?.clock_out;
  const isClockedOut = !!attendance?.clock_in && !!attendance?.clock_out;

  const clockInTime  = attendance?.clock_in
    ? new Date(attendance.clock_in).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
    : null;

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const dayName = now.toLocaleDateString('en-KE', { weekday: 'long' });
  const dateStr = now.toLocaleDateString('en-KE', { day: 'numeric', month: 'long' });
  const timeStr = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: GOLD }} />
          <p className="text-sm text-neutral-400">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">

      {/* ── Clock-out modal ───────────────────────────────────────── */}
      {showClockOutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${ORANGE}18` }}>
                <Coffee className="h-5 w-5" style={{ color: ORANGE }} />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900">Clock Out</p>
                <p className="text-xs text-neutral-500 mt-0.5">Leaving before closing time? A note is required.</p>
              </div>
            </div>
            <textarea
              rows={3}
              value={clockOutNote}
              onChange={(e) => setClockOutNote(e.target.value)}
              placeholder="Reason for early departure (required if before closing time)…"
              className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-neutral-400"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowClockOutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
                Cancel
              </button>
              <button
                onClick={() => submitClockOut(clockOutNote || undefined)}
                disabled={clockLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: RED }}>
                {clockLoading ? 'Clocking out…' : 'Confirm Clock Out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header + clock ────────────────────────────────────────── */}
      <div className="rounded-2xl p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ background: `linear-gradient(135deg, ${DARK} 0%, #143d2a 100%)` }}>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: `${GOLD}88` }}>
            {dayName} · {dateStr}
          </p>
          <h1 className="mt-1 text-xl font-bold text-white">
            {greeting()}, {profile?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {timeStr} · {todayBookings.length} appointment{todayBookings.length !== 1 ? 's' : ''} today
          </p>
        </div>
        {/* Clock in/out */}
        <div className="flex flex-col items-start sm:items-end gap-2">
          {isClockedIn && (
            <p className="text-xs" style={{ color: `${GREEN}cc` }}>
              <CheckCircle className="inline h-3 w-3 mr-1" />
              Clocked in at {clockInTime}
            </p>
          )}
          {isClockedOut && (
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Shift complete · in at {clockInTime}
            </p>
          )}
          {!attendance && (
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Not clocked in yet</p>
          )}
          <button
            onClick={isClockedIn ? handleClockOut : handleClockIn}
            disabled={clockLoading || isClockedOut}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50"
            style={isClockedIn
              ? { background: `${RED}cc`, color: '#fff' }
              : { background: GOLD, color: DARK }}
          >
            {clockLoading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : isClockedIn
                ? <><Coffee className="h-4 w-4" /> Clock Out</>
                : <><UserCheck className="h-4 w-4" /> Clock In</>}
          </button>
        </div>
      </div>

      {/* ── KPI cards ─────────────────────────────────────────────── */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[
          {
            label: 'Today\'s Bookings',
            value: todayBookings.length,
            icon: Calendar,
            color: BLUE,
            sub: `${upcoming.length} upcoming`,
          },
          {
            label: 'Completed',
            value: completed,
            icon: CheckCircle,
            color: GREEN,
            sub: `${completionRate}% rate`,
          },
          {
            label: 'Pending Commission',
            value: commissions ? formatPrice(commissions.pending) : '—',
            icon: DollarSign,
            color: GOLD,
            sub: 'Unpaid earnings',
          },
          {
            label: 'Total Earned',
            value: commissions ? formatPrice(commissions.total) : '—',
            icon: Zap,
            color: PURPLE,
            sub: 'All time',
          },
        ].map((k) => (
          <div key={k.label}
            className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">{k.label}</p>
                <p className="mt-1 text-xl font-bold text-neutral-900 truncate">{k.value}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{k.sub}</p>
              </div>
              <div className="rounded-xl p-2.5 flex-shrink-0" style={{ background: `${k.color}15` }}>
                <k.icon className="h-4 w-4" style={{ color: k.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Currently in-progress banner ──────────────────────────── */}
      {inProgress && (
        <div className="rounded-2xl border p-4 flex items-center justify-between gap-4"
          style={{ background: `${PURPLE}0d`, borderColor: `${PURPLE}30` }}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: `${PURPLE}25` }}>
              <Clock className="h-4 w-4" style={{ color: PURPLE }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: PURPLE }}>In Progress Now</p>
              <p className="text-sm font-bold text-neutral-800">{inProgress.service_name}</p>
              <p className="text-[11px] text-neutral-500">{inProgress.customer_name} · {inProgress.scheduled_time}</p>
            </div>
          </div>
          <button
            onClick={() => handleStatusUpdate(inProgress.id, 'completed')}
            disabled={updatingId === inProgress.id}
            className="flex-shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
            style={{ background: GREEN, color: '#fff' }}
          >
            {updatingId === inProgress.id
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : 'Mark Complete'}
          </button>
        </div>
      )}

      {/* ── Schedule + Commission side by side ────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-12">

        {/* Today's schedule */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden lg:col-span-7">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-50">
            <h3 className="text-sm font-semibold text-neutral-800">
              Today's Schedule
              {todayBookings.length > 0 && (
                <span className="ml-2 text-xs font-normal text-neutral-400">
                  {todayBookings.length} appointment{todayBookings.length !== 1 ? 's' : ''}
                </span>
              )}
            </h3>
            <span className="text-xs text-neutral-400">{dateStr}</span>
          </div>
          <div className="divide-y divide-neutral-50">
            {todayBookings.length > 0 ? todayBookings.map((b) => {
              const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
              const canStart   = b.status === 'confirmed' || b.status === 'pending';
              const canComplete = b.status === 'in_progress';
              const canNoShow  = b.status === 'confirmed' || b.status === 'pending';
              return (
                <div key={b.id}
                  className="px-5 py-4 flex items-start gap-4 hover:bg-neutral-50 transition-colors">
                  {/* Time + dot */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                    <span className="text-xs font-bold text-neutral-800">{b.scheduled_time}</span>
                    <div className="w-px h-6 bg-neutral-100" />
                    <div className="h-2 w-2 rounded-full"
                      style={{ background: cfg.color }} />
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-neutral-800">{b.service_name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {b.customer_name}
                          {b.is_walkin && (
                            <span className="ml-1.5 text-[9px] rounded px-1 py-0.5 font-semibold"
                              style={{ background: `${ORANGE}18`, color: ORANGE }}>walk-in</span>
                          )}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-neutral-400">
                          <span>{b.duration_minutes} min</span>
                          <span>{formatPrice(b.price)}</span>
                          {b.deposit_amount > 0 && (
                            <span>Deposit: {formatPrice(b.deposit_amount)}</span>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                    {/* Action buttons */}
                    {!['completed', 'cancelled', 'no_show'].includes(b.status) && (
                      <div className="mt-2.5 flex items-center gap-1.5">
                        {canStart && (
                          <StatusButton
                            status="in_progress"
                            onClick={() => handleStatusUpdate(b.id, 'in_progress')}
                            disabled={updatingId === b.id}
                          />
                        )}
                        {canComplete && (
                          <StatusButton
                            status="completed"
                            onClick={() => handleStatusUpdate(b.id, 'completed')}
                            disabled={updatingId === b.id}
                          />
                        )}
                        {canNoShow && (
                          <StatusButton
                            status="no_show"
                            onClick={() => handleStatusUpdate(b.id, 'no_show')}
                            disabled={updatingId === b.id}
                          />
                        )}
                        {updatingId === b.id && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="px-5 py-12 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-neutral-200" />
                <p className="text-sm font-medium text-neutral-400">No appointments today</p>
                <p className="text-xs text-neutral-300 mt-1">Enjoy your free time or check for walk-ins</p>
              </div>
            )}
          </div>
        </div>

        {/* Right panel: commission + performance */}
        <div className="lg:col-span-5 space-y-4">

          {/* Commission panel */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-neutral-50">
              <h3 className="text-sm font-semibold text-neutral-800">My Commission</h3>
            </div>
            <div className="p-5 space-y-4">
              {commissions ? (
                <>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Pending', value: commissions.pending, color: ORANGE },
                      { label: 'Paid',    value: commissions.paid,    color: GREEN  },
                      { label: 'Total',   value: commissions.total,   color: GOLD   },
                    ].map((m) => (
                      <div key={m.label} className="rounded-xl p-3"
                        style={{ background: `${m.color}10` }}>
                        <p className="text-[10px] text-neutral-400 font-medium">{m.label}</p>
                        <p className="text-sm font-bold mt-0.5" style={{ color: m.color }}>
                          {formatPrice(m.value)}
                        </p>
                      </div>
                    ))}
                  </div>
                  {commissions.total > 0 && (
                    <ProgressRow
                      label="Paid out"
                      value={commissions.paid}
                      max={commissions.total}
                      displayValue={`${Math.round((commissions.paid / commissions.total) * 100)}%`}
                      color={GREEN}
                    />
                  )}
                </>
              ) : (
                <p className="text-sm text-neutral-400 text-center py-3">No commission data</p>
              )}
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-neutral-50">
              <h3 className="text-sm font-semibold text-neutral-800">My Performance</h3>
            </div>
            <div className="p-5 space-y-3">
              {performance ? (
                <>
                  <div className="grid grid-cols-3 gap-2 text-center mb-1">
                    {[
                      { label: 'Completed', value: performance.completed, color: GREEN },
                      { label: 'No-shows',  value: performance.no_shows,  color: RED   },
                      { label: 'Cancelled', value: performance.cancellations, color: '#9ca3af' },
                    ].map((m) => (
                      <div key={m.label} className="rounded-xl py-2.5 px-1"
                        style={{ background: `${m.color}10` }}>
                        <p className="text-[10px] text-neutral-400">{m.label}</p>
                        <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                  {(performance.completed + performance.no_shows + performance.cancellations) > 0 && (
                    <ProgressRow
                      label="Completion rate"
                      value={performance.completed}
                      max={performance.completed + performance.no_shows + performance.cancellations}
                      displayValue={`${Math.round((performance.completed / (performance.completed + performance.no_shows + performance.cancellations)) * 100)}%`}
                      color={GREEN}
                    />
                  )}
                  <div className="pt-1 border-t border-neutral-50">
                    <p className="text-[10px] text-neutral-400">Revenue Generated</p>
                    <p className="text-base font-bold mt-0.5" style={{ color: GOLD }}>
                      {formatPrice(performance.revenue_generated || 0)}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-neutral-400 text-center py-3">No performance data yet</p>
              )}
            </div>
          </div>

          {/* Attendance today */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
              Today's Attendance
            </p>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-400 text-xs w-16">Clock In</span>
                  <span className="font-semibold text-neutral-800">
                    {attendance?.clock_in
                      ? new Date(attendance.clock_in).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-400 text-xs w-16">Clock Out</span>
                  <span className="font-semibold text-neutral-800">
                    {attendance?.clock_out
                      ? new Date(attendance.clock_out).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </span>
                </div>
              </div>
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: isClockedIn ? `${GREEN}18` : isClockedOut ? `${BLUE}18` : '#f5f5f5',
                }}
              >
                {isClockedIn  && <CheckCircle className="h-6 w-6" style={{ color: GREEN }} />}
                {isClockedOut && <Star className="h-6 w-6" style={{ color: BLUE }} />}
                {!attendance  && <AlertCircle className="h-6 w-6 text-neutral-300" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
