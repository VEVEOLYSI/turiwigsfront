'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CartPage() {
  const { cart, removeItem, updateItem, total, count } = useCart();
  const items = cart?.items ?? [];

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some wigs to your cart to get started."
          action={<Link href="/products"><Button>Shop Now</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-neutral-900">
        My Cart <span className="text-neutral-400 font-normal text-lg">({count})</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const name = item.products?.name ?? item.services?.name ?? 'Item';
            const image = item.products?.images?.[0]?.url ?? null;

            return (
              <div key={item.id} className="flex gap-4 rounded-2xl border border-neutral-200 p-4">
                <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  {image && (
                    <Image src={image} alt={name} width={80} height={96} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-neutral-900">{name}</p>
                    <p className="text-sm font-bold text-neutral-900">
                      {formatPrice(item.unit_price * item.quantity)}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-400">{formatPrice(item.unit_price)} each</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-2 py-1">
                      <button onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)} className="flex h-5 w-5 items-center justify-center">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateItem(item.id, item.quantity + 1)} className="flex h-5 w-5 items-center justify-center">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="rounded-lg p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 h-fit space-y-4">
          <h2 className="font-semibold text-neutral-900">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal ({count} items)</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <div className="border-t border-neutral-200 pt-3 flex justify-between font-semibold text-neutral-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link href="/checkout">
            <Button fullWidth size="lg">Proceed to Checkout</Button>
          </Link>
          <Link href="/products" className="block text-center text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
