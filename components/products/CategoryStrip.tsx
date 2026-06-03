'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categoriesApi } from '@/api/categories.api';
import type { Category } from '@/types';

export function CategoryStrip() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesApi.list().then(({ data }) => setCategories(data.data)).catch(() => {});
  }, []);

  if (!categories.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h2 className="mb-6 text-lg font-semibold text-neutral-900">Shop by Category</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?categorySlug=${cat.slug}`}
            className="flex-shrink-0 group flex flex-col items-center gap-2"
          >
            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200 group-hover:border-neutral-400 transition-colors">
              {cat.image_url ? (
                <Image src={cat.image_url} alt={cat.name} width={64} height={64} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl">✦</div>
              )}
            </div>
            <span className="text-xs font-medium text-neutral-700 whitespace-nowrap">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
