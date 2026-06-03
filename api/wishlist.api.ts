import client from './client';
import type { ApiResponse } from '@/types';

export const wishlistApi = {
  get: () => client.get<ApiResponse<unknown[]>>('/wishlist'),

  add: (productId: string) =>
    client.post('/wishlist', { productId }),

  remove: (productId: string) =>
    client.delete(`/wishlist/${productId}`),
};
