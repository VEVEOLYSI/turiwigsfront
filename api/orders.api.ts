import client from './client';
import type { ApiResponse, PaginatedResponse, Order } from '@/types';

export const ordersApi = {
  list: (params?: { page?: number; limit?: number; status?: string }) =>
    client.get<PaginatedResponse<Order>>('/orders', { params }),

  get: (id: string) => client.get<ApiResponse<Order>>(`/orders/${id}`),

  create: (data: {
    addressId?: string;
    discountCode?: string;
    shippingAmount?: number;
    notes?: string;
    idempotencyKey?: string;
    items: { productId: string; variantId?: string; quantity: number }[];
  }) => client.post<ApiResponse<{ id: string; order_number: string }>>('/orders', data),

  cancel: (id: string, reason?: string) =>
    client.post(`/orders/${id}/cancel`, { reason }),
};
