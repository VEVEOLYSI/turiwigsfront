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

  // No account needed. Holds the time while the customer finishes on WhatsApp.
  createGuest: (data: {
    serviceId: string;
    scheduledDate: string;
    scheduledTime: string;
    name: string;
    phone?: string;
    notes?: string;
  }) => client.post<ApiResponse<{ id: string; booking_number: string }>>('/bookings/guest', data),

  cancel: (id: string, reason?: string) =>
    client.post(`/bookings/${id}/cancel`, { reason }),
};
