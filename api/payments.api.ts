import client from './client';
import type { ApiResponse } from '@/types';

export type ChargeStatus = 'success' | 'send_pin' | 'send_otp' | 'send_birthday' | 'open_url' | 'failed';

export interface ChargeResult {
  status: ChargeStatus;
  reference: string;
  message?: string;
  displayText?: string;
  redirectUrl?: string;
}

export interface CardDetails {
  number: string;   // raw digits only
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
}

export const paymentsApi = {
  // Redirect flow (fallback)
  initialize: (data: { orderId?: string; bookingId?: string }) =>
    client.post<ApiResponse<{
      authorizationUrl: string;
      accessCode: string;
      reference: string;
      reused: boolean;
    }>>('/payments/paystack/initialize', data),

  verify: (reference: string) =>
    client.get<ApiResponse<{ verified: boolean; status: string; reference: string }>>(
      `/payments/paystack/verify/${reference}`
    ),

  // Custom UI flow
  charge: (data: { card: CardDetails; orderId?: string; bookingId?: string; pin?: string }) =>
    client.post<ApiResponse<ChargeResult>>('/payments/paystack/charge', data),

  submitPin: (reference: string, pin: string) =>
    client.post<ApiResponse<ChargeResult>>('/payments/paystack/submit-pin', { reference, pin }),

  submitOtp: (reference: string, otp: string) =>
    client.post<ApiResponse<ChargeResult>>('/payments/paystack/submit-otp', { reference, otp }),
};
