import client from './client';
import type { ApiResponse, PaginatedResponse, Booking } from '@/types';

export const bookingsApi = {
  list: (params?: { page?: number; limit?: number; status?: string }) =>
    client.get<PaginatedResponse<Booking>>('/bookings', { params }),

  get: (id: string) => client.get<ApiResponse<Booking>>(`/bookings/${id}`),

  create: (data: {
    serviceId: string;
    slotId?: string;
    scheduledDate: string;
    scheduledTime: string;
    notes?: string;
  }) => client.post<ApiResponse<{
    id: string;
    booking_number: string;
    deposit_amount: number;
    balance_amount: number;
  }>>('/bookings', data),

  cancel: (id: string, reason?: string) =>
    client.post(`/bookings/${id}/cancel`, { reason }),
};
