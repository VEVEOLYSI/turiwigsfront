'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ordersApi } from '@/api/orders.api';
import { formatPrice, formatDate } from '@/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { PageSpinner } from '@/components/ui/Spinner';
import { PayButton } from '@/components/payments/PayButton';
import toast from 'react-hot-toast';
import type { Order } from '@/types';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning', paid: 'info', processing: 'info',
  shipped: 'info', delivered: 'success', cancelled: 'danger', refunded: 'danger',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    ordersApi.get(id).then(({ data }) => setOrder(data.data)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      await ordersApi.cancel(id, 'Cancelled by customer');
      toast.success('Order cancelled');
      router.push('/account/orders');
    } catch { toast.error('Could not cancel order'); }
    finally { setCancelling(false); }
  };

  if (loading) return <PageSpinner />;
  if (!order) return <div className="p-10 text-center text-neutral-500">Order not found</div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/account/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">{order.order_number}</h1>
            <p className="text-sm text-neutral-400 mt-0.5">{formatDate(order.created_at)}</p>
          </div>
          <Badge variant={statusVariant[order.order_status] ?? 'default'} className="text-sm px-3 py-1">
            {order.order_status}
          </Badge>
        </div>

        {/* Items */}
        <div className="rounded-2xl border border-neutral-200 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-neutral-900">Items</h2>
          {(order.order_items ?? []).map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-neutral-800">{item.product_snapshot.name}</p>
                {item.product_snapshot.sku && <p className="text-xs text-neutral-400">SKU: {item.product_snapshot.sku}</p>}
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.total_price)}</p>
                <p className="text-xs text-neutral-400">×{item.quantity} @ {formatPrice(item.unit_price)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="rounded-2xl border border-neutral-200 p-5 space-y-2 text-sm">
          <div className="flex justify-between text-neutral-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          {order.discount_amount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount_amount)}</span></div>}
          <div className="flex justify-between text-neutral-600"><span>Shipping</span><span>{formatPrice(order.shipping_amount)}</span></div>
          <div className="flex justify-between font-bold text-neutral-900 text-base pt-2 border-t border-neutral-100"><span>Total</span><span>{formatPrice(order.total_amount)}</span></div>
        </div>

        {/* Pay now if pending */}
        {order.payment_status === 'pending' && order.order_status !== 'cancelled' && (
          <PayButton orderId={order.id} amount={order.total_amount} amountFormatted={formatPrice(order.total_amount)} label="Complete Payment" onSuccess={() => { toast.success('Payment received!'); router.push('/payment/success'); }} />
        )}

        {/* Cancel */}
        {['pending'].includes(order.order_status) && (
          <button onClick={handleCancel} disabled={cancelling}
            className="w-full text-sm text-red-500 hover:text-red-700 text-center py-2 transition-colors disabled:opacity-50">
            {cancelling ? 'Cancelling…' : 'Cancel Order'}
          </button>
        )}
      </div>
    </div>
  );
}
