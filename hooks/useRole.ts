'use client';

import { useAuth } from './useAuth';
import type { UserRole } from '@/types';

export interface RoleFlags {
  role: UserRole | null;
  user: ReturnType<typeof useAuth>['user'];
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isDashboardUser: boolean;
  // Granular permission flags — used to gate UI elements
  canManagePayments: boolean;  // refund, change payment_status (admin only)
  canEditProducts: boolean;    // create, update, delete products (admin only)
  canManageUsers: boolean;     // change user roles (admin only)
  canViewRevenue: boolean;     // see revenue stats (admin only)
}

export function useRole(): RoleFlags {
  const { user, loading, isAuthenticated } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';

  return {
    role: user?.role ?? null,
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isStaff,
    isDashboardUser: isAdmin || isStaff,
    canManagePayments: isAdmin,
    canEditProducts: isAdmin,
    canManageUsers: isAdmin,
    canViewRevenue: isAdmin,
  };
}
