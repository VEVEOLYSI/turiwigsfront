'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '@/api/products.api';
import { addToCartThunk } from '@/store/slices/cart.slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { formatPrice } from '@/utils/formatters';
import type { Product } from '@/types';

const TAGS = ['BESTSELLER', 'NEW IN', 'POPULAR'] as const;
const FALLBACK_IMAGES = [
  '/images/salon-4.jpeg',
  '/images/salon-5.jpeg',
  '/images/salon-7.png',
];

function getHref(p: Product) {
  return `/products/${p.slug}`;
}
function getImg(p: Product, fallback: string) {
  return p.images?.[0]?.url ?? fallback;
}

// ─── Shared button styles ────────────────────────────────────────────────────

const btnDark: React.CSSProperties = {
  background: 'linear-gradient(180deg, #1e5038 0%, #0a2e1f 100%)',
  border: '1px solid #c9a227',
  color: '#c9a227',
  boxShadow: '0 0 0 2px rgba(201,162,39,0.18), inset 0 1px 0 rgba(255,255,255,0.07)',
};

const btnDarkWhite: React.CSSProperties = {
  background: 'linear-gradient(180deg, #1e5038 0%, #0a2e1f 100%)',
  border: '1px solid #c9a227',
  color: '#ffffff',
  boxShadow: '0 0 0 2px rgba(201,162,39,0.18), inset 0 1px 0 rgba(255,255,255,0.07)',
};

// ─── Skeletons ───────────────────────────────────────────────────────────────

function SkeletonLg() {
  return <div className="animate-pulse rounded-[18px] bg-neutral-200" style={{ minHeight: 480 }} />;
}
function SkeletonSm() {
  return <div className="animate-pulse rounded-[18px] bg-neutral-200 flex-1" style={{ minHeight: 220 }} />;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PremiumWigs() {
  const dispatch = useAppDispatch();
  const [wigs, setWigs] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    productsApi
      .list({ featured: true, limit: 3 })
      .then(({ data }) => setWigs(data.data.slice(0, 3)))
      .catch(() => setWigs([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleAddToCart(e: React.MouseEvent, product: Product) {
    e.preventDefault();
    e.stopPropagation();
    if (addingId) return;
    setAddingId(product.id);
    try {
      await dispatch(addToCartThunk({ productId: product.id, quantity: 1 })).unwrap();
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Could not add to cart');
    } finally {
      setAddingId(null);
    }
  }

  return (
    <section className="py-20 sm:py-28" style={{ background: '#ffffff' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] mb-3"
              style={{ color: '#c9a227' }}>
              Shop Our Collection
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: '#0a2e1f' }}>
              Premium Wigs
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest transition-colors"
            style={{ color: 'rgba(10,46,31,0.5)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0a2e1f'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(10,46,31,0.5)'; }}
          >
            Shop All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ── Asymmetric grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Large card */}
          {loading ? <SkeletonLg /> : wigs[0] && (
            <Link href={getHref(wigs[0])} className="group relative overflow-hidden"
              style={{ borderRadius: 18, minHeight: 480 }}>
              <Image
                src={getImg(wigs[0], FALLBACK_IMAGES[0])}
                alt={wigs[0].name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Overlay */}
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)' }} />

              {/* Tag */}
              <div className="absolute top-4 left-4 rounded-full px-3 py-1.5"
                style={{ background: '#c9a227' }}>
                <span className="text-[9px] font-black text-white tracking-[0.2em]">{TAGS[0]}</span>
              </div>

              {/* Info + buttons */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-white font-bold text-xl sm:text-2xl">{wigs[0].name}</h3>
                <p className="mt-1 text-white/50 text-sm">From {formatPrice(wigs[0].price)}</p>

                <div className="mt-5 flex items-center gap-3 flex-wrap">
                  {/* Add to Cart */}
                  <button
                    onClick={(e) => handleAddToCart(e, wigs[0])}
                    disabled={addingId === wigs[0].id}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-60"
                    style={btnDark}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {addingId === wigs[0].id ? 'Adding…' : 'Add to Cart'}
                  </button>

                  {/* Shop Now */}
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all group-hover:opacity-90"
                    style={btnDarkWhite}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Shop Now
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Two stacked smaller cards */}
          <div className="flex flex-col gap-5">
            {loading ? (
              <><SkeletonSm /><SkeletonSm /></>
            ) : (
              wigs.slice(1).map((wig, i) => (
                <Link
                  key={wig.id}
                  href={getHref(wig)}
                  className="group relative overflow-hidden flex-1"
                  style={{ borderRadius: 18, minHeight: 220 }}
                >
                  <Image
                    src={getImg(wig, FALLBACK_IMAGES[i + 1])}
                    alt={wig.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)' }} />

                  {/* Tag */}
                  <div className="absolute top-3 left-3 rounded-full px-2.5 py-1"
                    style={{ background: '#c9a227' }}>
                    <span className="text-[9px] font-black text-white tracking-[0.2em]">{TAGS[i + 1]}</span>
                  </div>

                  {/* Info + buttons */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h3 className="text-white font-bold text-base sm:text-lg">{wig.name}</h3>
                    <p className="mt-0.5 mb-3 text-white/50 text-xs">From {formatPrice(wig.price)}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Add to Cart */}
                      <button
                        onClick={(e) => handleAddToCart(e, wig)}
                        disabled={addingId === wig.id}
                        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-60"
                        style={btnDark}
                      >
                        <ShoppingCart className="h-3 w-3" />
                        {addingId === wig.id ? 'Adding…' : 'Add to Cart'}
                      </button>

                      {/* Shop Now */}
                      <div
                        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest group-hover:opacity-90"
                        style={btnDarkWhite}
                      >
                        <ShoppingBag className="h-3 w-3" /> Shop Now
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
