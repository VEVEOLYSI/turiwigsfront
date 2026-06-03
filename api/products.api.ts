import client from './client';
import type { ApiResponse, PaginatedResponse, Product } from '@/types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price' | 'created_at' | 'name';
  order?: 'asc' | 'desc';
  featured?: boolean;
}

export const productsApi = {
  list: (filters: ProductFilters = {}) =>
    client.get<PaginatedResponse<Product>>('/products', { params: filters }),

  getBySlug: (slug: string) =>
    client.get<ApiResponse<Product & { categories: unknown[] }>>(`/products/${slug}`),
};
