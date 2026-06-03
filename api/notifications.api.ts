import client from './client';
import type { PaginatedResponse, Notification } from '@/types';

export const notificationsApi = {
  list: (params?: { page?: number; limit?: number; unread?: boolean }) =>
    client.get<PaginatedResponse<Notification>>('/notifications', { params }),

  markRead: (id: string) => client.put(`/notifications/${id}/read`),

  markAllRead: () => client.put('/notifications/read-all'),
};
