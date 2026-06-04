'use client';

import { use } from 'react';
import { OrderDetailView } from '@/components/dashboard/OrderDetailView';

export default function StaffOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // canManagePayments=false — staff cannot refund or change payment_status
  return <OrderDetailView orderId={id} backHref="/staff/orders" canManagePayments={false} />;
}
