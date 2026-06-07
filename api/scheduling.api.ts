import client from './client';
import type { ApiResponse, BusinessSettings, StaffSchedule } from '@/types';

interface StaffProfile {
  id: string;
  name: string;
  avatar_url?: string;
  is_active: boolean;
}

interface ScheduleDay {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export const schedulingApi = {
  getSettings: () =>
    client.get<ApiResponse<BusinessSettings>>('/scheduling/settings'),

  updateSettings: (data: Partial<{
    businessStartTime: string;
    businessEndTime: string;
    slotIntervalMinutes: number;
    workingDays: number[];
    staffOrdersEnabled: boolean;
  }>) => client.put<ApiResponse<BusinessSettings>>('/scheduling/settings', data),

  listStaff: () =>
    client.get<ApiResponse<StaffProfile[]>>('/scheduling/staff'),

  listSchedules: (staffId?: string) =>
    client.get<ApiResponse<StaffSchedule[]>>('/scheduling/staff-schedules', {
      params: staffId ? { staffId } : undefined,
    }),

  replaceWeeklySchedule: (staffId: string, days: ScheduleDay[]) =>
    client.put<ApiResponse<StaffSchedule[]>>(
      `/scheduling/staff-schedules/${staffId}`,
      { days }
    ),
};
