import client from './client';
import type { ApiResponse, Address } from '@/types';

export const usersApi = {
  getProfile: () => client.get('/users/profile'),

  updateProfile: (data: { name?: string; phone?: string; avatarUrl?: string }) =>
    client.put('/users/profile', data),

  getAddresses: () => client.get<ApiResponse<Address[]>>('/users/addresses'),

  createAddress: (data: Omit<Address, 'id'>) =>
    client.post<ApiResponse<Address>>('/users/addresses', data),

  updateAddress: (id: string, data: Partial<Omit<Address, 'id'>>) =>
    client.put<ApiResponse<Address>>(`/users/addresses/${id}`, data),

  deleteAddress: (id: string) => client.delete(`/users/addresses/${id}`),
};
