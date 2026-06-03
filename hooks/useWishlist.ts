'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { wishlistApi } from '@/api/wishlist.api';

export function useWishlist(initialIds: string[] = []) {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set(initialIds));
  const [loading, setLoading] = useState(false);

  const toggle = async (productId: string) => {
    setLoading(true);
    try {
      if (wishlist.has(productId)) {
        await wishlistApi.remove(productId);
        setWishlist((prev) => { const n = new Set(prev); n.delete(productId); return n; });
        toast.success('Removed from wishlist');
      } else {
        await wishlistApi.add(productId);
        setWishlist((prev) => new Set([...prev, productId]));
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Please sign in to save items');
    } finally {
      setLoading(false);
    }
  };

  return { wishlist, loading, toggle, isWishlisted: (id: string) => wishlist.has(id) };
}
