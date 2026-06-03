import client from './client';
import type { ApiResponse, Service, ServiceSlot } from '@/types';

export const servicesApi = {
  list: () => client.get<ApiResponse<Service[]>>('/services'),

  getBySlug: (slug: string) =>
    client.get<ApiResponse<Service>>(`/services/${slug}`),

  getSlots: (serviceId: string, date?: string) =>
    client.get<ApiResponse<ServiceSlot[]>>(`/services/${serviceId}/slots`, {
      params: date ? { date } : undefined,
    }),
};
