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

  const logout = () => dispatch(logoutThunk());

  return { user, token, loading, error, isAuthenticated: !!token, logout };
}
