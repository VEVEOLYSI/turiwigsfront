import client from './client';
import type { ApiResponse, Promotion } from '@/types';

export const promotionsApi = {
  list: () => client.get<ApiResponse<Promotion[]>>('/promotions'),

  flashSales: () => client.get<ApiResponse<unknown[]>>('/promotions/flash-sales'),
};
