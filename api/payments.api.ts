import client from './client';
import type { ApiResponse } from '@/types';

export type ChargeStatus =
  | 'success'
  | 'send_pin'
  | 'send_otp'
  | 'send_birthday'
  | 'open_url'
  | 'pay_offline'
  | 'pending'
  | 'failed';

export interface ChargeResult {
  status: ChargeStatus;
  reference: string;
  message?: string;
  displayText?: string;
  redirectUrl?: string;
  orderId?: string;
}

export interface CardDetails {
  number: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface CheckoutData {
  items: Array<{ productId: string; variantId?: string; quantity: number }>;
  addressId?: string;
  discountCode?: string;
  shippingAmount?: number;
  notes?: string;
  idempotencyKey?: string;
}

export const paymentsApi = {
  // Redirect / hosted page flow — works for both card and M-Pesa
  initialize: (data: { orderId?: string; bookingId?: string; checkout?: CheckoutData }) =>
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

  // Card charge — accepts either existing orderId/bookingId or checkout cart data
  charge: (data: {
    card: CardDetails;
    orderId?: string;
    bookingId?: string;
    checkout?: CheckoutData;
    pin?: string;
  }) => client.post<ApiResponse<ChargeResult>>('/payments/paystack/charge', data),

  submitPin: (reference: string, pin: string) =>
    client.post<ApiResponse<ChargeResult>>('/payments/paystack/submit-pin', { reference, pin }),

  submitOtp: (reference: string, otp: string) =>
    client.post<ApiResponse<ChargeResult>>('/payments/paystack/submit-otp', { reference, otp }),

  // M-Pesa STK push — accepts existing orderId/bookingId or checkout cart data
  chargeMpesa: (data: {
    phone: string;
    orderId?: string;
    bookingId?: string;
    checkout?: CheckoutData;
  }) => client.post<ApiResponse<ChargeResult>>('/payments/paystack/mpesa', data),

  // Poll M-Pesa payment status
  checkMpesaStatus: (reference: string) =>
    client.get<ApiResponse<{ status: 'pending' | 'success' | 'failed'; orderId?: string }>>(
      `/payments/paystack/mpesa/status/${reference}`
    ),
};
