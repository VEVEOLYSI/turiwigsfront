'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatPrice, getDiscountPercent } from '@/utils/formatters';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const image = product.images[0]?.url ?? '/placeholder-wig.jpg';
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPct = hasDiscount
    ? getDiscountPercent(product.price, product.compare_at_price!)
    : 0;

  return (
    <div className="group relative flex flex-col">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-2xl bg-neutral-100">
        <div className="relative aspect-[3/4]">
          <Image
            src={image}
            alt={product.images[0]?.alt ?? product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.is_featured && (
              <Badge variant="default" className="bg-black text-white text-[10px]">
                Featured
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="danger" className="text-[10px]">
                -{discountPct}%
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="default" className="text-[10px]">
                Sold Out
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); onToggleWishlist?.(product.id); }}
            className={cn(
              'absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-all',
              'opacity-0 group-hover:opacity-100',
              isWishlisted
                ? 'bg-white text-red-500'
                : 'bg-white/80 text-neutral-500 hover:text-neutral-900'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
          </button>

          {/* Add to cart — always visible on mobile, hover-reveal on desktop */}
          {product.stock > 0 && (
            <div className="absolute inset-x-3 bottom-3 translate-y-0 opacity-100 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-200">
              <button
                onClick={(e) => { e.preventDefault(); onAddToCart?.(product); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black/90 py-2.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-black transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3 flex flex-col gap-1 px-0.5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-neutral-900 line-clamp-1 hover:underline underline-offset-2">
            {product.name}
          </h3>
        </Link>

        {product.avg_rating !== undefined && Number(product.avg_rating) > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating value={Math.round(Number(product.avg_rating))} size="sm" />
            <span className="text-xs text-neutral-400">({product.review_count})</span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
