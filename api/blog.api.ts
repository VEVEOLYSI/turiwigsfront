import client from './client';
import type { ApiResponse } from '@/types';
import type { BlogPost } from '@/types';

export const blogApi = {
  list: () =>
    client.get<ApiResponse<BlogPost[]>>('/blog'),

  adminList: () =>
    client.get<ApiResponse<BlogPost[]>>('/blog/admin/all'),

  getBySlug: (slug: string) =>
    client.get<ApiResponse<BlogPost>>(`/blog/${slug}`),

  create: (payload: {
    title: string; slug: string; content: string;
    excerpt?: string; coverImage?: string; isPublished?: boolean;
  }) => client.post<ApiResponse<BlogPost>>('/blog', payload),

  update: (id: string, payload: Partial<{
    title: string; slug: string; content: string;
    excerpt: string; coverImage: string; isPublished: boolean;
  }>) => client.put<ApiResponse<BlogPost>>(`/blog/${id}`, payload),

  delete: (id: string) =>
    client.delete(`/blog/${id}`),
};
