'use client';

import { use } from 'react';
import { OrderDetailView } from '@/components/dashboard/OrderDetailView';

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <OrderDetailView orderId={id} backHref="/admin/orders" canManagePayments />;
}
