import client from './client';
import type { ApiResponse, PaginatedResponse, Review } from '@/types';

export const reviewsApi = {
  list: (type: 'product' | 'service', id: string, params?: { page?: number; limit?: number }) =>
    client.get<PaginatedResponse<Review>>(`/reviews/${type}/${id}`, { params }),

  create: (data: {
    targetType: 'product' | 'service';
    productId?: string;
    serviceId?: string;
    orderItemId?: string;
    bookingId?: string;
    rating: number;
    title?: string;
    comment?: string;
  }) => client.post<ApiResponse<Review>>('/reviews', data),
};
