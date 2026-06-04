'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, ShoppingBag, BookOpen, Package, Users,
  LogOut, Menu, ChevronLeft, ChevronRight, ShieldCheck,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  /** Use exact match only (for top-level overview pages). */
  exact?: boolean;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  role: 'admin' | 'staff';
}

export { LayoutDashboard, ShoppingBag, BookOpen, Package, Users };

export function DashboardShell({ children, navItems, role }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: NavItem) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + '/');

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div
        className={cn('flex h-16 flex-shrink-0 items-center gap-3 px-4 border-b')}
        style={{ borderColor: 'rgba(201,162,39,0.15)' }}
      >
        <ShieldCheck className="h-5 w-5 flex-shrink-0" style={{ color: '#c9a227' }} />
        {!collapsed && (
          <div className="min-w-0 leading-none">
            <p className="text-sm font-bold text-white">Tiuri</p>
            <p className="text-[10px] uppercase tracking-widest mt-0.5"
              style={{ color: 'rgba(201,162,39,0.65)' }}>
              {role === 'admin' ? 'Admin Panel' : 'Staff Panel'}
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                active ? 'text-white' : 'hover:bg-white/6',
                collapsed && 'justify-center px-0'
              )}
              style={active
                ? { background: 'rgba(201,162,39,0.18)', color: '#f0d878' }
                : { color: 'rgba(255,255,255,0.55)' }}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="flex-shrink-0 p-3 space-y-1 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        {!collapsed && user && (
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {user.email}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
            'hover:bg-red-500/8 hover:text-red-400',
            collapsed && 'justify-center px-0'
          )}
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'relative hidden md:flex flex-col flex-shrink-0 transition-all duration-200',
          collapsed ? 'w-[60px]' : 'w-60'
        )}
        style={{ background: '#0a2e1f', borderRight: '1px solid rgba(201,162,39,0.12)' }}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-[72px] z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-md"
          style={{ background: '#c9a227', color: '#0a2e1f' }}
          aria-label="Toggle sidebar"
        >
          {collapsed
            ? <ChevronRight className="h-3 w-3" />
            : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/55" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col"
            style={{ background: '#0a2e1f' }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex flex-1 min-w-0 flex-col">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center gap-4 px-4 sm:px-6"
          style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="hidden md:block text-sm font-semibold text-neutral-700">
            {navItems.find((n) => isActive(n))?.label ?? 'Dashboard'}
          </span>
          <div className="ml-auto flex items-center gap-3">
            {user && (
              <>
                <div className="hidden sm:block text-right leading-none">
                  <p className="text-sm font-medium text-neutral-800">{user.name}</p>
                  <p className="text-xs capitalize text-neutral-400 mt-0.5">{user.role}</p>
                </div>
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'rgba(201,162,39,0.15)', color: '#0a2e1f' }}
                >
                  {user.name[0].toUpperCase()}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
