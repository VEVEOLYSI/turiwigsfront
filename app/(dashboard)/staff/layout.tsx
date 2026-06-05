'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { PageSpinner } from '@/components/ui/Spinner';
import {
  LayoutDashboard, ShoppingBag, BookOpen, DollarSign,
  Calendar, UserCircle, MessageSquare,
} from 'lucide-react';
import type { NavItem } from '@/components/dashboard/DashboardShell';

const NAV: NavItem[] = [
  { label: 'My Dashboard',  href: '/staff',              icon: LayoutDashboard, exact: true },
  { label: 'My Schedule',   href: '/staff/bookings',     icon: Calendar },
  { label: 'Orders',        href: '/staff/orders',       icon: ShoppingBag },
  { label: 'Commissions',   href: '/staff/commissions',  icon: DollarSign },
  { label: 'Client Notes',  href: '/staff/client-notes', icon: MessageSquare },
  { label: 'My Profile',    href: '/staff/profile',      icon: UserCircle },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isDashboardUser, loading, isAuthenticated } = useRole();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) { router.replace('/auth/login'); return; }
    if (!isDashboardUser) { router.replace('/'); }
  }, [loading, isAuthenticated, isDashboardUser, router]);

  if (loading || !isDashboardUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <PageSpinner />
      </div>
    );
  }

  return <DashboardShell navItems={NAV} role="staff">{children}</DashboardShell>;
}
