'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { toggleMobileMenu } from '@/store/slices/ui.slice';
import { cn } from '@/utils/cn';

const NAV = [
  { label: 'Shop Wigs', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Collections', href: '/products?featured=true' },
];

function IconBtn({ onClick, href, label, count, children }: {
  onClick?: () => void; href?: string; label: string;
  count?: number; children: React.ReactNode;
}) {
  const cls = cn(
    'relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150',
    'bg-white/10 border border-white/20 backdrop-blur-sm',
    'hover:bg-white/20 hover:border-gold/40',
    'active:bg-white/30'
  );
  if (href) return (
    <Link href={href} className={cls} aria-label={label}>
      {children}
      {count != null && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-salon-dark shadow-md">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
  return (
    <button onClick={onClick} className={cls} aria-label={label}>
      {children}
      {count != null && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-salon-dark shadow-md">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

export function Header() {
  const { count, toggle: toggleCart } = useCart();
  const { user } = useAuth();
  const { isAdmin, isStaff } = useRole();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 50); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isOnProducts = pathname.startsWith('/products');
  const dashboardHref = isAdmin ? '/admin' : isStaff ? '/staff' : null;
  const mobileOpen = useAppSelector((s) => s.ui.mobileMenuOpen);

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full transition-all duration-300"
        style={scrolled ? {
          background: 'linear-gradient(180deg, #000000 0%, #030705 100%)',
          borderBottom: '1px solid rgba(201,162,39,0.25)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
        } : {
          background: 'transparent',
          borderBottom: '1px solid transparent',
          boxShadow: 'none',
        }}
      >
        {/* Gold accent bar — only visible when scrolled */}
        <div
          className="h-0.5 w-full transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, transparent, #c9a227 30%, #f0d878 50%, #c9a227 70%, transparent)',
            opacity: scrolled ? 1 : 0,
          }}
        />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl"
              style={{ boxShadow: '0 2px 8px rgba(201,162,39,0.4), 0 1px 0 rgba(255,255,255,0.15) inset' }}>
              <Image src="/logo.jpeg" alt="Tiuri Logo" fill className="object-cover" priority />
            </div>
            <div className="hidden sm:block leading-none">
              <span className="block text-base font-bold tracking-tight text-white"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                Tiuri
              </span>
              <span className="block text-[10px] font-medium tracking-widest uppercase"
                style={{ color: '#c9a227' }}>
                Nails & Wigs Parlour
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 text-white/90 hover:text-gold"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = '#c9a227';
                  (e.target as HTMLElement).style.background = 'rgba(201,162,39,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
                  (e.target as HTMLElement).style.background = 'transparent';
                }}
              >
                {item.label}
              </Link>
            ))}
            {dashboardHref && (
              <Link href={dashboardHref}
                className="ml-1 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150"
                style={{
                  background: 'linear-gradient(180deg,#1e5038 0%,#0a2e1f 100%)',
                  color: '#f0d878',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.1) inset,0 2px 6px rgba(10,46,31,0.3)',
                }}
              >
                {isAdmin ? '⚙ Admin' : '⚙ Staff'}
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <div className="hidden sm:flex items-center gap-1.5">
              <IconBtn href="/products" label="Search">
                <Search className="h-4 w-4 text-white/80" />
              </IconBtn>
              <IconBtn href="/account/wishlist" label="Wishlist">
                <Heart className="h-4 w-4 text-white/80" />
              </IconBtn>
              <IconBtn href={user ? '/account/profile' : '/auth/login'} label="Account">
                <User className="h-4 w-4 text-white/80" />
              </IconBtn>
            </div>

            {/* Cart — only shown after user navigates to Shop Wigs */}
            {isOnProducts && (
              <IconBtn onClick={toggleCart} label="Cart" count={count}>
                <ShoppingCart className="h-4 w-4 text-white/80" />
              </IconBtn>
            )}

            <button onClick={() => dispatch(toggleMobileMenu())}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full transition-all"
              style={{
                background: scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)',
              }}>
              {mobileOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <div className={cn(
        'fixed inset-x-0 top-[66px] z-30 md:hidden transition-all duration-200',
        mobileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
      )}
        style={{ background: 'rgba(7,29,19,0.97)', borderBottom: '1px solid rgba(201,162,39,0.25)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}>
        <nav className="flex flex-col px-4 py-4 gap-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => dispatch(toggleMobileMenu())}
              className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:text-gold hover:bg-white/5 transition-colors">
              {item.label}
            </Link>
          ))}
          <div className="mt-2 border-t pt-2 space-y-0.5" style={{ borderColor: 'rgba(201,162,39,0.2)' }}>
            <Link href={user ? '/account/profile' : '/auth/login'} onClick={() => dispatch(toggleMobileMenu())}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:text-gold transition-colors">
              <User className="h-4 w-4" />
              {user ? user.name : 'Sign In'}
            </Link>
            {dashboardHref && (
              <Link href={dashboardHref} onClick={() => dispatch(toggleMobileMenu())}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
                style={{ color: '#f0d878', background: 'rgba(10,46,31,0.08)' }}>
                <span>⚙</span>
                {isAdmin ? 'Admin Dashboard' : 'Staff Dashboard'}
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
