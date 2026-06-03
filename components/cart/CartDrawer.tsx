'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export function CartDrawer() {
  const { cart, open, toggle, removeItem, updateItem, total } = useCart();
  const items = cart?.items ?? [];

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggle}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                      <Dialog.Title className="text-base font-semibold text-neutral-900">
                        My Cart ({items.length})
                      </Dialog.Title>
                      <button
                        onClick={toggle}
                        className="rounded-xl p-2 hover:bg-neutral-100 transition-colors"
                      >
                        <X className="h-5 w-5 text-neutral-500" />
                      </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      {items.length === 0 ? (
                        <EmptyState
                          icon={ShoppingBag}
                          title="Your cart is empty"
                          description="Add some wigs to get started!"
                          action={
                            <Button variant="secondary" size="sm" onClick={toggle}>
                              Continue Shopping
                            </Button>
                          }
                        />
                      ) : (
                        <ul className="space-y-4">
                          {items.map((item) => {
                            const name = item.products?.name ?? item.services?.name ?? 'Item';
                            const image = item.products?.images?.[0]?.url ?? null;

                            return (
                              <li key={item.id} className="flex gap-4">
                                {/* Image */}
                                <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                                  {image && (
                                    <Image
                                      src={image}
                                      alt={name}
                                      width={64}
                                      height={80}
                                      className="h-full w-full object-cover"
                                    />
                                  )}
                                </div>

                                {/* Details */}
                                <div className="flex flex-1 flex-col justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-neutral-900 line-clamp-1">
                                      {name}
                                    </p>
                                    <p className="text-sm text-neutral-500">
                                      {formatPrice(item.unit_price)}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    {/* Quantity */}
                                    <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-2 py-1">
                                      <button
                                        onClick={() =>
                                          item.quantity > 1
                                            ? updateItem(item.id, item.quantity - 1)
                                            : removeItem(item.id)
                                        }
                                        className="flex h-5 w-5 items-center justify-center rounded-lg hover:bg-neutral-100"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </button>
                                      <span className="w-5 text-center text-sm font-medium">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateItem(item.id, item.quantity + 1)}
                                        className="flex h-5 w-5 items-center justify-center rounded-lg hover:bg-neutral-100"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => removeItem(item.id)}
                                      className="rounded-lg p-1 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t border-neutral-100 px-6 py-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-neutral-600">Subtotal</span>
                          <span className="text-base font-bold text-neutral-900">
                            {formatPrice(total)}
                          </span>
                        </div>
                        <Link href="/checkout" onClick={toggle}>
                          <Button fullWidth size="lg">
                            Checkout · {formatPrice(total)}
                          </Button>
                        </Link>
                        <button
                          onClick={toggle}
                          className="w-full text-sm text-neutral-500 hover:text-neutral-700 text-center transition-colors"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
