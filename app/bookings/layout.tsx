'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PageSpinner } from '@/components/ui/Spinner';

// The booking steps end in a WhatsApp message, so nobody needs an account to
// get through them. Only the dashboard (/bookings) and confirmation pages read
// the customer's own bookings, and those stay behind sign-in.
const GUEST_STEPS = ['/bookings/services', '/bookings/schedule', '/bookings/summary'];

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isGuestStep = GUEST_STEPS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isGuestStep || loading || isAuthenticated) return;
    // Every "Book" button on the site points at /bookings; a guest goes
    // straight to picking a service instead of hitting a login wall.
    router.replace(
      pathname === '/bookings' ? '/bookings/services' : `/auth/login?redirect=${pathname}`
    );
  }, [isGuestStep, isAuthenticated, loading, pathname, router]);

  if (isGuestStep) {
    return <>{children}</>;
  }

  if (loading) {
    return <PageSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
