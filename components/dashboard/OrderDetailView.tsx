'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { adminApi } from '@/api/admin.api';
import { formatPrice, formatDate, formatDateTime } from '@/utils/formatters';
import type { Order, OrderStatus, PaymentStatus } from '@/types';

// ─── Status helpers ───────────────────────────────────────────────────────────

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'pending', 'processing', 'shipped', 'delivered', 'cancelled',
];
const PAYMENT_STATUS_OPTIONS: Exclude<PaymentStatus, 'failed'>[] = ['pending', 'paid', 'refunded'];

const orderVariant: Record<OrderStatus, 'default' | 'warning' | 'info' | 'success' | 'danger'> = {
  pending: 'warning', paid: 'info', processing: 'info',
  shipped: 'info', delivered: 'success', cancelled: 'danger', refunded: 'default',
};
const paymentVariant: Record<PaymentStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning', paid: 'success', failed: 'danger', refunded: 'default',
};

// ─── Component ────────────────────────────────────────────────────────────────

interface OrderDetailViewProps {
  orderId: string;
  /** Path for the back link — '/admin/orders' or '/staff/orders'. */
  backHref: string;
  /** When false, payment actions are hidden and payment status is a read-only badge. */
  canManagePayments: boolean;
}

export function OrderDetailView({ orderId, backHref, canManagePayments }: OrderDetailViewProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminApi.getOrder(orderId)
      .then(({ data }) => setOrder(data.data))
      .catch(() => toast.error('Could not load order'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleOrderStatus = async (status: OrderStatus) => {
    if (!order) return;
    setBusy(true);
    try {
      const { data } = await adminApi.updateOrderStatus(order.id, status);
      setOrder(data.data);
      toast.success('Order status updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setBusy(false);
    }
  };

  const handlePaymentStatus = async (payment_status: Exclude<PaymentStatus, 'failed'>) => {
    if (!order) return;
    setBusy(true);
    try {
      const { data } = await adminApi.updatePaymentStatus(order.id, payment_status);
      setOrder(data.data);
      toast.success('Payment status updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setBusy(false);
    }
  };

  const handleRefund = async () => {
    if (!order) return;
    if (!window.confirm(`Refund order ${order.order_number}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const { data } = await adminApi.refundOrder(order.id);
      setOrder(data.data);
      toast.success('Refund initiated');
    } catch {
      toast.error('Refund failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!order) return (
    <div className="text-center py-16">
      <p className="text-neutral-400">Order not found.</p>
      <Link href={backHref} className="mt-4 inline-block text-sm text-gold hover:underline">← Back</Link>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href={backHref}
            className="mb-3 inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">{order.order_number}</h1>
          <p className="text-sm text-neutral-400 mt-0.5">{formatDateTime(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={orderVariant[order.order_status]}>{order.order_status}</Badge>
          <Badge variant={paymentVariant[order.payment_status]}>{order.payment_status}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: items + totals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <section className="rounded-2xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-semibold text-neutral-800">Items</h2>
            </div>
            {order.order_items?.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50/60 border-b border-neutral-100">
                    <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-400">Product</th>
                    <th className="px-5 py-2.5 text-center text-xs font-medium text-neutral-400">Qty</th>
                    <th className="px-5 py-2.5 text-right text-xs font-medium text-neutral-400">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {order.order_items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-neutral-800">{item.product_snapshot.name}</p>
                        {item.product_snapshot.sku && (
                          <p className="text-xs text-neutral-400 font-mono">{item.product_snapshot.sku}</p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center text-neutral-500">{item.quantity}</td>
                      <td className="px-5 py-3 text-right font-semibold">{formatPrice(item.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-5 py-6 text-sm text-neutral-400">No items.</p>
            )}

            {/* Totals */}
            <div className="px-5 py-4 bg-neutral-50/60 border-t border-neutral-100 space-y-1.5">
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span><span>−{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              {order.shipping_amount > 0 && (
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Shipping</span><span>{formatPrice(order.shipping_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total</span><span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </section>

          {/* Shipping address */}
          {order.addresses && (
            <section className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-5">
              <h2 className="text-sm font-semibold text-neutral-800 mb-3">Shipping Address</h2>
              <address className="not-italic text-sm text-neutral-600 leading-relaxed">
                {order.addresses.street}<br />
                {order.addresses.city}
                {order.addresses.county && `, ${order.addresses.county}`}<br />
                {order.addresses.country}
              </address>
            </section>
          )}

          {order.notes && (
            <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
              <h2 className="text-sm font-semibold text-neutral-700 mb-1">Notes</h2>
              <p className="text-sm text-neutral-600">{order.notes}</p>
            </section>
          )}
        </div>

        {/* Right: actions panel */}
        <div className="space-y-4">
          {/* Order status */}
          <section className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-semibold text-neutral-800">Order Status</h2>
            <select
              value={order.order_status}
              onChange={(e) => handleOrderStatus(e.target.value as OrderStatus)}
              disabled={busy}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 bg-white"
            >
              {ORDER_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </section>

          {/* Payment section */}
          <section className="rounded-2xl border bg-white shadow-sm p-5 space-y-3"
            style={{ borderColor: canManagePayments ? 'rgba(201,162,39,0.25)' : undefined }}>
            <h2 className="text-sm font-semibold text-neutral-800">Payment</h2>

            {canManagePayments ? (
              <>
                <select
                  value={order.payment_status}
                  onChange={(e) => handlePaymentStatus(e.target.value as Exclude<PaymentStatus, 'failed'>)}
                  disabled={busy}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 bg-white"
                >
                  {PAYMENT_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {order.payment_status === 'paid' && (
                  <Button
                    variant="danger"
                    fullWidth
                    size="sm"
                    loading={busy}
                    onClick={handleRefund}
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Refund Order
                  </Button>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <Badge variant={paymentVariant[order.payment_status]}>
                  {order.payment_status}
                </Badge>
                <p className="text-xs text-neutral-400">Contact an admin to change payment status.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
