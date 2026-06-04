'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { PageSpinner } from '@/components/ui/Spinner';
import { LayoutDashboard, ShoppingBag, BookOpen } from 'lucide-react';
import type { NavItem } from '@/components/dashboard/DashboardShell';

const NAV: NavItem[] = [
  { label: 'Overview', href: '/staff',          icon: LayoutDashboard, exact: true },
  { label: 'Orders',   href: '/staff/orders',   icon: ShoppingBag },
  { label: 'Bookings', href: '/staff/bookings', icon: BookOpen },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isDashboardUser, loading, isAuthenticated } = useRole();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) { router.replace('/auth/login'); return; }
    // Customers cannot access the staff panel
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
