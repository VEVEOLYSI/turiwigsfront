'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import {
  fetchCartThunk,
  addToCartThunk,
  removeCartItemThunk,
  updateCartItemThunk,
  toggleCart,
  selectCartCount,
  selectCartTotal,
} from '@/store/slices/cart.slice';

export function useCart() {
  const dispatch = useAppDispatch();
  const { cart, open, loading } = useAppSelector((s) => s.cart);
  const token = useAppSelector((s) => s.auth.token);
  const count = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);

  useEffect(() => {
    if (token) dispatch(fetchCartThunk());
  }, [token, dispatch]);

  return {
    cart,
    open,
    loading,
    count,
    total,
    toggle: () => dispatch(toggleCart()),
    addItem: (payload: { productId?: string; serviceId?: string; variantId?: string; quantity?: number }) =>
      dispatch(addToCartThunk(payload)),
    removeItem: (id: string) => dispatch(removeCartItemThunk(id)),
    updateItem: (id: string, quantity: number) => dispatch(updateCartItemThunk({ id, quantity })),
  };
}
