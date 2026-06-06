import client from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Order,
  Booking,
  OrderStatus,
  BookingStatus,
  PaymentStatus,
  UserRole,
  Product,
} from '@/types';

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface AdminStats {
  revenue_today: number;
  revenue_month: number;
  orders_today: number;
  active_bookings: number;
  total_customers: number;
  pending_orders: number;
}

export interface StaffStats {
  orders_today: number;
  active_bookings: number;
  pending_orders: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  order_count?: number;
}

// ─── Payload shapes (camelCase — must match backend Zod schemas) ──────────────

export interface CreateProductPayload {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  /** Backend expects an array of UUIDs. Pass [categoryId] for single category. */
  categoryIds?: string[];
  isFeatured?: boolean;
  images?: { url: string; alt?: string }[];
}

export interface CreateServicePayload {
  name: string;
  slug: string;
  description?: string;
  price: number;
  durationMinutes: number;
  capacity: number;
  /** Supported on update; backend defaults to true on create. */
  isActive?: boolean;
  isFeatured?: boolean;
  images?: { url: string; alt?: string }[];
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const adminApi = {
  // Stats (endpoint may not be implemented — failures are caught silently)
  getStats: () =>
    client.get<ApiResponse<AdminStats>>('/admin/stats'),
  getStaffStats: () =>
    client.get<ApiResponse<StaffStats>>('/admin/stats/staff'),

  // Orders (admin & staff can list; backend enforces role for mutations)
  listOrders: (params?: {
    page?: number; limit?: number;
    status?: OrderStatus; payment_status?: PaymentStatus; search?: string;
  }) => client.get<PaginatedResponse<Order>>('/admin/orders', { params }),

  getOrder: (id: string) =>
    client.get<ApiResponse<Order>>(`/admin/orders/${id}`),

  // Backend route: PUT /admin/orders/:id/status — handles both fulfillment and payment statuses
  updateOrderStatus: (id: string, status: OrderStatus) =>
    client.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status }),

  updatePaymentStatus: (id: string, payment_status: Exclude<PaymentStatus, 'failed'>) =>
    client.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status: payment_status }),

  refundOrder: (id: string) =>
    client.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status: 'refunded' }),

  // Bookings
  listBookings: (params?: {
    page?: number; limit?: number; status?: BookingStatus; date?: string;
  }) => client.get<PaginatedResponse<Booking>>('/admin/bookings', { params }),

  getBooking: (id: string) =>
    client.get<ApiResponse<Booking>>(`/admin/bookings/${id}`),

  // Backend route: PUT /admin/bookings/:id/status
  updateBookingStatus: (id: string, status: BookingStatus) =>
    client.put<ApiResponse<Booking>>(`/admin/bookings/${id}/status`, { status }),

  // Products — backend routes: POST /products, PUT /products/:id, DELETE /products/:id
  listProducts: (params?: { page?: number; limit?: number; search?: string }) =>
    client.get<PaginatedResponse<Product>>('/products', { params }),

  createProduct: (data: CreateProductPayload) =>
    client.post<ApiResponse<Product>>('/products', data),

  updateProduct: (id: string, data: Partial<CreateProductPayload>) =>
    client.put<ApiResponse<Product>>(`/products/${id}`, data),

  updateProductStock: (id: string, stock: number) =>
    client.put<ApiResponse<Product>>(`/products/${id}`, { stock }),

  deleteProduct: (id: string) =>
    client.delete(`/products/${id}`),

  // Services — backend routes: POST /services, PUT /services/:id, DELETE /services/:id
  listAdminServices: () =>
    client.get<ApiResponse<import('@/types').Service[]>>('/services'),

  createService: (data: CreateServicePayload) =>
    client.post<ApiResponse<import('@/types').Service>>('/services', data),

  updateService: (id: string, data: Partial<CreateServicePayload>) =>
    client.put<ApiResponse<import('@/types').Service>>(`/services/${id}`, data),

  deleteService: (id: string) =>
    client.delete(`/services/${id}`),

  // Users — admin only; backend route: PUT /admin/users/:id/role
  listUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    client.get<PaginatedResponse<AdminUser>>('/admin/users', { params }),

  updateUserRole: (id: string, role: Extract<UserRole, 'customer' | 'staff'>) =>
    client.put<ApiResponse<AdminUser>>(`/admin/users/${id}/role`, { role }),
};
