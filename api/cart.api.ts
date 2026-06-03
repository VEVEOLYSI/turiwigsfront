import client from './client';
import type { ApiResponse, Cart, CartItem } from '@/types';

export const cartApi = {
  get: () => client.get<ApiResponse<Cart>>('/cart'),

  addItem: (data: {
    productId?: string;
    serviceId?: string;
    variantId?: string;
    quantity?: number;
    notes?: string;
  }) => client.post<ApiResponse<CartItem>>('/cart/items', data),

  updateItem: (id: string, quantity: number) =>
    client.put<ApiResponse<CartItem>>(`/cart/items/${id}`, { quantity }),

  removeItem: (id: string) => client.delete(`/cart/items/${id}`),

  clear: () => client.delete('/cart'),
};
