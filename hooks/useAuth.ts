'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { fetchMeThunk, logoutThunk } from '@/store/slices/auth.slice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, loading, error } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMeThunk());
    }
  }, [token, user, dispatch]);

  // Automatically log out when the JWT expires.
  // The layout's !isAuthenticated check then redirects to /auth/login.
  useEffect(() => {
    if (!token) return;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const { exp } = JSON.parse(atob(base64)) as { exp?: number };
      if (!exp) return;
      const msUntilExpiry = exp * 1000 - Date.now();
      if (msUntilExpiry <= 0) {
        dispatch(logoutThunk());
        return;
      }
      const timer = setTimeout(() => dispatch(logoutThunk()), msUntilExpiry);
      return () => clearTimeout(timer);
    } catch {
      // malformed token — the 401 interceptor in client.ts handles it
    }
  }, [token, dispatch]);

  const logout = () => dispatch(logoutThunk());

  return { user, token, loading, error, isAuthenticated: !!token, logout };
}
