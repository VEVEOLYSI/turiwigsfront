'use client';

import { useEffect, useState } from 'react';
import { Search, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi, type AdminUser } from '@/api/admin.api';
import { formatDate } from '@/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import type { UserRole } from '@/types';

const roleVariant: Record<UserRole, 'default' | 'success' | 'info' | 'warning' | 'danger'> = {
  customer: 'default',
  staff: 'info',
  admin: 'warning',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const limit = 20;

  const fetch = (p = page) => {
    setLoading(true);
    adminApi.listUsers({ page: p, limit, search: search || undefined })
      .then(({ data }) => { setUsers(data.data); setTotal(data.meta.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1); setPage(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { fetch(page); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(1);
    setPage(1);
  };

  const handleRoleChange = async (id: string, role: Extract<UserRole, 'customer' | 'staff'>) => {
    setUpdating(id);
    try {
      const { data } = await adminApi.updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: data.data.role } : u)));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-neutral-900">Users</h1>
        <span className="text-sm text-neutral-400">{total} total</span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <Button type="submit" variant="secondary" size="sm">Search</Button>
      </form>

      {loading ? <PageSpinner /> : (
        <>
          {!users.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-3">
              <UserCircle className="h-10 w-10" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-neutral-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/80">
                    {['User', 'Role', 'Joined', 'Orders', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-neutral-50/60 transition-colors ${updating === user.id ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: 'rgba(201,162,39,0.12)', color: '#0a2e1f' }}
                          >
                            {user.name[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-neutral-800 truncate">{user.name}</p>
                            <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        {user.order_count ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        {/* Admin-to-admin changes excluded from UI */}
                        {user.role !== 'admin' && (
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value as Extract<UserRole, 'customer' | 'staff'>)
                            }
                            className="rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gold/30 cursor-pointer"
                          >
                            <option value="customer">customer</option>
                            <option value="staff">staff</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="text-sm text-neutral-400">Page {page} of {totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
