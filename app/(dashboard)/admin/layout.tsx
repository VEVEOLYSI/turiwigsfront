'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { PageSpinner } from '@/components/ui/Spinner';
import {
  LayoutDashboard, ShoppingBag, BookOpen, Package, Users, Scissors,
} from 'lucide-react';
import type { NavItem } from '@/components/dashboard/DashboardShell';

const NAV: NavItem[] = [
  { label: 'Overview',  href: '/admin',            icon: LayoutDashboard, exact: true },
  { label: 'Orders',    href: '/admin/orders',      icon: ShoppingBag },
  { label: 'Bookings',  href: '/admin/bookings',    icon: BookOpen },
  { label: 'Products',  href: '/admin/products',    icon: Package },
  { label: 'Services',  href: '/admin/services',    icon: Scissors },
  { label: 'Users',     href: '/admin/users',       icon: Users },
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
