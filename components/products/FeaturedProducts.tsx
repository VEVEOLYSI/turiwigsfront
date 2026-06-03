'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { productsApi } from '@/api/products.api';
import { ProductGrid } from './ProductGrid';
import type { Product } from '@/types';

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.list({ featured: true, limit: 8 })
      .then(({ data }) => setProducts(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Handpicked</p>
          <h2 className="mt-1 text-2xl font-bold text-neutral-900 sm:text-3xl">Featured Wigs</h2>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm font-medium text-neutral-900 hover:opacity-70 transition-opacity"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <ProductGrid products={products} loading={loading} />
    </section>
  );
}
