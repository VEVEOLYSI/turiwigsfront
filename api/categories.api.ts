import client from './client';
import type { ApiResponse, Category, Product } from '@/types';

export const categoriesApi = {
  list: () => client.get<ApiResponse<Category[]>>('/categories'),

  getBySlug: (slug: string) =>
    client.get<ApiResponse<Category & { products: Product[] }>>(`/categories/${slug}`),
};
