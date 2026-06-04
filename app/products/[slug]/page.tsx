'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, ShoppingBag, Star } from 'lucide-react';
import { productsApi } from '@/api/products.api';
import { cartApi } from '@/api/cart.api';
import { wishlistApi } from '@/api/wishlist.api';
import { reviewsApi } from '@/api/reviews.api';
import { formatPrice, getDiscountPercent, timeAgo } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { PageSpinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import type { Product, ProductVariant, Review } from '@/types';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    productsApi.getBySlug(slug)
      .then(({ data }) => {
        setProduct(data.data);
        if (data.data.variants?.length) setSelectedVariant(data.data.variants[0]);
        return reviewsApi.list('product', data.data.id, { limit: 5 });
      })
      .then(({ data }) => setReviews(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    if (isAuthenticated) {
      wishlistApi.get().then(({ data }) => {
        const ids = (data.data as Array<{ product_id?: string; id?: string }>)
          .map((w) => w.product_id ?? w.id);
        // will update once product loads — handled below
        void ids;
      }).catch(() => {});
    }
  }, [slug, isAuthenticated]);

  // update wishlist state once product is set
  useEffect(() => {
    if (!product || !isAuthenticated) return;
    wishlistApi.get().then(({ data }) => {
      const ids = (data.data as Array<{ product_id?: string }>).map((w) => w.product_id);
      setWishlisted(ids.includes(product.id));
    }).catch(() => {});
  }, [product, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    if (!product) return;
    setAddingToCart(true);
    try {
      await cartApi.addItem({
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity,
      });
      toast.success('Added to cart');
    } catch {
      toast.error('Could not add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    if (!product) return;
    try {
      if (wishlisted) {
        await wishlistApi.remove(product.id);
        setWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistApi.add(product.id);
        setWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  if (loading) return <PageSpinner />;
  if (!product) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-lg font-medium text-neutral-700">Product not found</p>
      <Link href="/products" className="mt-4 text-sm text-neutral-500 underline underline-offset-2">
        Back to products
      </Link>
    </div>
  );

  const images = product.images.length ? product.images : [{ url: '/placeholder-wig.jpg', alt: product.name }];
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPct = hasDiscount ? getDiscountPercent(product.price, product.compare_at_price!) : 0;
  const effectivePrice = selectedVariant?.price_modifier
    ? product.price + selectedVariant.price_modifier
    : product.price;
  const variantStock = selectedVariant?.stock ?? product.stock;

  const variantGroups = groupVariantOptions(product.variants ?? []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Back */}
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> All Products
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* ── Image gallery ── */}
        <div className="flex gap-3">
          {images.length > 1 && (
            <div className="flex flex-col gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                    selectedImage === i ? 'border-neutral-900' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <Image src={img.url} alt={img.alt ?? product.name} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
          <div className="relative flex-1 overflow-hidden rounded-2xl bg-neutral-100 aspect-[3/4]">
            <Image
              src={images[selectedImage]?.url ?? images[0].url}
              alt={images[selectedImage]?.alt ?? product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.is_featured && (
                <Badge variant="default" className="bg-black text-white text-[10px]">Featured</Badge>
              )}
              {hasDiscount && (
                <Badge variant="danger" className="text-[10px]">-{discountPct}%</Badge>
              )}
              {variantStock === 0 && (
                <Badge variant="default" className="text-[10px]">Sold Out</Badge>
              )}
            </div>
          </div>
        </div>

        {/* ── Details ── */}
        <div className="flex flex-col gap-6 items-center text-center lg:items-start lg:text-left">
          <div className="w-full">
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{product.name}</h1>

            {product.avg_rating !== undefined && Number(product.avg_rating) > 0 && (
              <div className="mt-2 flex items-center justify-center lg:justify-start gap-2">
                <StarRating value={Math.round(Number(product.avg_rating))} size="sm" />
                <span className="text-sm text-neutral-500">
                  {Number(product.avg_rating).toFixed(1)} ({product.review_count} review{product.review_count !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            <div className="mt-4 flex items-baseline justify-center lg:justify-start gap-3">
              <span className="text-2xl font-bold text-neutral-900">{formatPrice(effectivePrice)}</span>
              {hasDiscount && (
                <span className="text-base text-neutral-400 line-through">{formatPrice(product.compare_at_price!)}</span>
              )}
            </div>
          </div>

          {/* Variants */}
          {Object.entries(variantGroups).map(([field, options]) => (
            <div key={field} className="w-full">
              <p className="mb-2 text-sm font-medium text-neutral-700 capitalize">{field.replace('_', ' ')}</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {options.map((opt) => {
                  const variant = product.variants.find((v) => (v as unknown as Record<string, unknown>)[field] === opt);
                  const active = selectedVariant?.id === variant?.id;
                  return (
                    <button
                      key={opt}
                      onClick={() => variant && setSelectedVariant(variant)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                        active
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="w-full">
            <p className="mb-2 text-sm font-medium text-neutral-700">Quantity</p>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-lg font-medium hover:border-neutral-400 transition-colors"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(variantStock || 99, q + 1))}
                disabled={variantStock === 0}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-lg font-medium hover:border-neutral-400 transition-colors disabled:opacity-40"
              >
                +
              </button>
              <span className="text-xs text-neutral-400">
                {variantStock > 0 ? `${variantStock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              fullWidth
              size="lg"
              onClick={handleAddToCart}
              loading={addingToCart}
              disabled={variantStock === 0}
            >
              <ShoppingBag className="h-4 w-4" />
              {variantStock === 0 ? 'Sold Out' : isAuthenticated ? `Add to Cart · ${formatPrice(effectivePrice * quantity)}` : 'Sign in to Buy'}
            </Button>
            <button
              onClick={handleToggleWishlist}
              className={cn(
                'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 transition-all',
                wishlisted
                  ? 'border-red-200 bg-red-50 text-red-500'
                  : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'
              )}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('h-5 w-5', wishlisted && 'fill-current')} />
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t border-neutral-100 pt-6">
              <h2 className="mb-2 text-sm font-semibold text-neutral-900">Description</h2>
              <p className="text-sm leading-relaxed text-neutral-600">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="mt-16 border-t border-neutral-100 pt-10">
        <h2 className="mb-6 text-xl font-bold text-neutral-900">
          Customer Reviews
          {product.review_count ? (
            <span className="ml-2 text-base font-normal text-neutral-400">({product.review_count})</span>
          ) : null}
        </h2>

        {reviews.length === 0 ? (
          <p className="text-sm text-neutral-500">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-neutral-100 pb-6 last:border-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {review.profiles?.name ?? 'Anonymous'}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn('h-3.5 w-3.5', i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200')}
                          />
                        ))}
                      </div>
                      {review.is_verified_purchase && (
                        <span className="text-xs text-green-600 font-medium">Verified Purchase</span>
                      )}
                    </div>
                  </div>
                  <span className="flex-shrink-0 text-xs text-neutral-400">{timeAgo(review.created_at)}</span>
                </div>
                {review.title && <p className="mt-2 text-sm font-medium text-neutral-800">{review.title}</p>}
                {review.comment && <p className="mt-1 text-sm text-neutral-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function groupVariantOptions(variants: ProductVariant[]): Record<string, string[]> {
  const fields: (keyof ProductVariant)[] = ['color', 'length', 'density', 'lace_type'];
  const groups: Record<string, string[]> = {};
  for (const field of fields) {
    const values = [...new Set(variants.map((v) => v[field]).filter(Boolean))] as string[];
    if (values.length > 0) groups[field] = values;
  }
  return groups;
}
