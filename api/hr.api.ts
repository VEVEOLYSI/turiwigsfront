import client from './client';
import type { ApiResponse } from '@/types';

export interface AttendanceRecord {
  id: string;
  staff_id: string;
  record_date: string;
  clock_in: string | null;
  clock_out: string | null;
  notes: string | null;
}

export const hrApi = {
  clockIn: (branchId?: string) =>
    client.post<ApiResponse<AttendanceRecord>>('/hr/attendance/clock-in', { branchId }),

  clockOut: () =>
    client.post<ApiResponse<AttendanceRecord>>('/hr/attendance/clock-out'),

  getMyAttendance: (params?: { startDate?: string; endDate?: string; page?: number; limit?: number }) =>
    client.get<ApiResponse<AttendanceRecord[]>>('/hr/attendance/mine', { params }),

  getMyShifts: (params?: { startDate?: string; endDate?: string }) =>
    client.get<ApiResponse<unknown[]>>('/hr/shifts/mine', { params }),

  getMyLeaves: (params?: { status?: string }) =>
    client.get<ApiResponse<unknown[]>>('/hr/leaves/mine', { params }),

  requestLeave: (data: { leaveType: string; startDate: string; endDate: string; reason?: string }) =>
    client.post('/hr/leaves', data),
};
