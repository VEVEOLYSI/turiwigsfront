'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { PageSpinner } from '@/components/ui/Spinner';
import {
  LayoutDashboard, ShoppingBag, BookOpen, Package, Users, Scissors,
  Layers, DollarSign, BarChart2, ClipboardList, Truck, Briefcase,
  Cpu, Calendar,
} from 'lucide-react';
import type { NavItem } from '@/components/dashboard/DashboardShell';

const NAV: NavItem[] = [
  // ─ Overview
  { label: 'Overview',    href: '/admin',            icon: LayoutDashboard, exact: true },
  { label: 'Analytics',   href: '/admin/analytics',  icon: BarChart2 },

  // ─ Operations
  { label: 'Orders',      href: '/admin/orders',     icon: ShoppingBag },
  { label: 'Bookings',    href: '/admin/bookings',   icon: Calendar },
  { label: 'Products',    href: '/admin/products',   icon: Package },
  { label: 'Services',    href: '/admin/services',   icon: Scissors },

  // ─ ERP
  { label: 'Inventory',   href: '/admin/inventory',  icon: Layers },
  { label: 'Suppliers',   href: '/admin/suppliers',  icon: Truck },
  { label: 'Expenses',    href: '/admin/expenses',   icon: DollarSign },
  { label: 'Assets',      href: '/admin/assets',     icon: Cpu },

  // ─ People
  { label: 'HR / Staff',  href: '/admin/hr',         icon: Briefcase },
  { label: 'Payroll',     href: '/admin/payroll',    icon: ClipboardList },
  { label: 'Users',       href: '/admin/users',      icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAdmin, loading, isAuthenticated } = useRole();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) { router.replace('/auth/login'); return; }
    if (!isAdmin) { router.replace('/'); }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <PageSpinner />
      </div>
    );
  }

  return <DashboardShell navItems={NAV} role="admin">{children}</DashboardShell>;
}
