import client from './client';
import type { ApiResponse, Session, AuthUser } from '@/types';

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    client.post<ApiResponse<{ message: string }>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    client.post<ApiResponse<{ session: Session }>>('/auth/login', data),

  logout: () => client.post('/auth/logout'),

  refresh: (refreshToken: string) =>
    client.post<ApiResponse<{ session: Session }>>('/auth/refresh', { refreshToken }),

  forgotPassword: (email: string) =>
    client.post('/auth/forgot-password', { email }),

  resetPassword: (email: string, token: string, password: string) =>
    client.post('/auth/reset-password', { email, token, password }),

  verifyOtp: (email: string, otp: string) =>
    client.post<ApiResponse<{ message: string }>>('/auth/verify-otp', { email, otp }),

  resendVerification: (email: string) =>
    client.post<ApiResponse<{ message: string }>>('/auth/resend-verification', { email }),

  me: () => client.get<ApiResponse<AuthUser>>('/auth/me'),
};
