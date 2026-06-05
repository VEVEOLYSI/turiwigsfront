import client from './client';
import type { ApiResponse } from '@/types';

export interface RevenueData {
  period: string;
  total: number;
  orderCount: number;
  avgOrderValue: number;
  daily: { day: string; revenue: number; order_count: number; avg_order_value: number }[];
}

export interface PLData {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  monthly: { month: string; total_revenue: number; total_expenses: number; net_profit: number }[];
}

export interface StaffPerformanceItem {
  staff_id: string;
  staff_name: string;
  completed: number;
  no_shows: number;
  cancellations: number;
  revenue_generated: number;
  pending_commission: number;
  paid_commission: number;
}

export interface BookingAnalytics {
  period: string;
  total: number;
  byStatus: Record<string, number>;
}

export interface SalonInventoryAlerts {
  lowStock: { id: string; name: string; unit: string; stock_quantity: number; low_stock_threshold: number }[];
  outOfStock: { id: string; name: string; unit: string; stock_quantity: number; low_stock_threshold: number }[];
}

export interface DashboardSummary {
  today: { bookings: number };
  alerts: { pendingLeaves: number; lowStockItems: number; assetsNeedingService: number };
  upcomingMaintenance: { id: string; name: string; next_service_date: string }[];
}

export interface CommissionSummary {
  period: string;
  staff: { staffId: string; name: string; pending: number; paid: number }[];
}

export const analyticsApi = {
  getDashboard: () =>
    client.get<ApiResponse<DashboardSummary>>('/analytics/dashboard'),

  getRevenue: (period: '7d' | '30d' | '90d' | '1y' = '7d') =>
    client.get<ApiResponse<RevenueData>>('/analytics/revenue', { params: { period } }),

  getPL: (period: '1m' | '3m' | '6m' | '1y' = '3m') =>
    client.get<ApiResponse<PLData>>('/analytics/pl', { params: { period } }),

  getStaffPerformance: (staffId?: string) =>
    client.get<ApiResponse<StaffPerformanceItem[]>>('/analytics/staff-performance', {
      params: staffId ? { staffId } : {},
    }),

  getBookings: (period: '7d' | '30d' | '90d' = '7d') =>
    client.get<ApiResponse<BookingAnalytics>>('/analytics/bookings', { params: { period } }),

  getSalonInventory: () =>
    client.get<ApiResponse<SalonInventoryAlerts>>('/analytics/salon-inventory'),

  getCommissions: (period: '7d' | '30d' | '90d' = '30d') =>
    client.get<ApiResponse<CommissionSummary>>('/analytics/commissions', { params: { period } }),
};
