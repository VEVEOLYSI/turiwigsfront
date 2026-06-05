import client from './client';
import type { ApiResponse } from '@/types';

export interface ScheduleEntry {
  id: string;
  booking_number: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  price: number;
  deposit_amount: number;
  balance_amount: number;
  is_walkin: boolean;
  service_name: string;
  duration_minutes: number;
  customer_name: string;
  staff_name: string | null;
}

export interface CommissionSummaryOwn {
  pending: number;
  paid: number;
  total: number;
}

export interface OwnPerformance {
  staff_id: string;
  staff_name: string;
  completed: number;
  no_shows: number;
  cancellations: number;
  revenue_generated: number;
  pending_commission: number;
  paid_commission: number;
}

export interface OwnStaffProfile {
  id: string;
  name: string;
  phone: string | null;
  bio: string | null;
  branch_id: string | null;
  branches: { name: string } | null;
  staffProfile: {
    salary_type: string;
    base_salary: number | null;
    commission_pct: number;
    hire_date: string | null;
    mpesa_number: string | null;
    bank_name: string | null;
    bank_account: string | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
  } | null;
}

export const staffDashboardApi = {
  getSchedule: (params?: { date?: string; startDate?: string; endDate?: string; status?: string }) =>
    client.get<ApiResponse<ScheduleEntry[]>>('/staff-dashboard/schedule', { params }),

  updateBookingStatus: (id: string, status: 'in_progress' | 'completed' | 'no_show') =>
    client.patch<ApiResponse<{ id: string; status: string }>>(`/staff-dashboard/bookings/${id}/status`, { status }),

  getOwnCommissions: (params?: { page?: number; limit?: number; status?: string }) =>
    client.get<ApiResponse<unknown[]>>('/staff-dashboard/commissions', { params }),

  getCommissionSummary: () =>
    client.get<ApiResponse<CommissionSummaryOwn>>('/staff-dashboard/commissions/summary'),

  getOwnProfile: () =>
    client.get<ApiResponse<OwnStaffProfile>>('/staff-dashboard/profile'),

  getOwnPerformance: () =>
    client.get<ApiResponse<OwnPerformance>>('/staff-dashboard/performance'),

  upsertStaffProfile: (data: {
    mpesaNumber?: string; bankName?: string; bankAccount?: string;
    emergencyContactName?: string; emergencyContactPhone?: string;
    name?: string; phone?: string; bio?: string;
  }) =>
    client.put<ApiResponse<OwnStaffProfile>>('/staff-dashboard/profile', data),
};
