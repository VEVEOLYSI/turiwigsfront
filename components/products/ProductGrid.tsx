'use client';

import { ProductCard } from './ProductCard';
import { PageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  wishlistedIds?: string[];
}

export function ProductGrid({ products, loading = false, wishlistedIds = [] }: ProductGridProps) {
  const { addItem } = useCart();
  const { toggle: toggleWishlist, isWishlisted } = useWishlist(wishlistedIds);

  const handleAddToCart = (product: Product) => {
    addItem({ productId: product.id, quantity: 1 });
    toast.success(`${product.name} added to cart`);
  };

  if (loading) return <PageSpinner />;

  if (!products.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No products found"
        description="Try adjusting your filters or search term."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onAddToCart={handleAddToCart}
          onToggleWishlist={toggleWishlist}
          isWishlisted={isWishlisted(p.id)}
        />
      ))}
    </div>
  );
}
