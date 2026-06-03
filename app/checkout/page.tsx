'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { ordersApi } from '@/api/orders.api';
import { usersApi } from '@/api/users.api';
import { formatPrice } from '@/utils/formatters';
import { PayButton } from '@/components/payments/PayButton';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import type { Address } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, count } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [notes, setNotes] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const items = cart?.items ?? [];
  const shipping = 0; // free shipping for now
  const grandTotal = total + shipping;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/auth/login?redirect=/checkout');
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      usersApi.getAddresses().then(({ data }) => {
        setAddresses(data.data);
        const def = data.data.find((a) => a.is_default);
        if (def) setSelectedAddress(def.id);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleCreateOrder = async () => {
    if (!items.length) return;
    setCreatingOrder(true);
    try {
      const orderItems = items
        .filter((i) => i.products)
        .map((i) => ({
          productId: i.products!.id,
          variantId: i.variant_id,
          quantity: i.quantity,
        }));

      const { data } = await ordersApi.create({
        addressId: selectedAddress ?? undefined,
        discountCode: discountCode || undefined,
        shippingAmount: shipping,
        notes: notes || undefined,
        idempotencyKey: crypto.randomUUID(),
        items: orderItems,
      });

      setCreatedOrderId(data.data.id);
      toast.success('Order created! Complete payment below.');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Order creation failed';
      toast.error(msg);
    } finally {
      setCreatingOrder(false);
    }
  };

  if (authLoading || !user) return <PageSpinner />;
  if (!items.length) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-neutral-900">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left — details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Delivery address */}
          {addresses.length > 0 && (
            <section className="rounded-2xl border border-neutral-200 p-5 space-y-3">
              <h2 className="font-semibold text-neutral-900 text-sm">Delivery Address</h2>
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                    selectedAddress === addr.id
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                    className="mt-0.5 accent-black"
                  />
                  <div className="text-sm">
                    {addr.label && <p className="font-medium text-neutral-900">{addr.label}</p>}
                    <p className="text-neutral-600">{addr.street}, {addr.city}</p>
                    {addr.county && <p className="text-neutral-400 text-xs">{addr.county}</p>}
                  </div>
                </label>
              ))}
            </section>
          )}

          {/* Discount code */}
          <section className="rounded-2xl border border-neutral-200 p-5 space-y-3">
            <h2 className="font-semibold text-neutral-900 text-sm">Discount Code</h2>
            <Input
              placeholder="Enter code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
            />
          </section>

          {/* Notes */}
          <section className="rounded-2xl border border-neutral-200 p-5 space-y-3">
            <h2 className="font-semibold text-neutral-900 text-sm">Order Notes (Optional)</h2>
            <textarea
              placeholder="Any special instructions…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm placeholder:text-neutral-300 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 resize-none transition-colors"
            />
          </section>
        </div>

        {/* Right — summary + pay */}
        <div className="lg:col-span-2 space-y-4">
          {/* Items */}
          <div className="rounded-2xl border border-neutral-200 p-5 space-y-4">
            <h2 className="font-semibold text-neutral-900 text-sm">Order Summary ({count})</h2>
            <ul className="space-y-3">
              {items.map((item) => {
                const name = item.products?.name ?? item.services?.name ?? 'Item';
                const image = item.products?.images?.[0]?.url ?? null;
                return (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {image && (
                        <Image src={image} alt={name} width={40} height={48} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{name}</p>
                      <p className="text-xs text-neutral-400">×{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 flex-shrink-0">
                      {formatPrice(item.unit_price * item.quantity)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-neutral-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span><span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 text-base pt-1 border-t border-neutral-100">
                <span>Total</span><span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Pay */}
          <div className="rounded-2xl border border-neutral-200 p-5 space-y-3">
            {!createdOrderId ? (
              <Button
                fullWidth
                size="lg"
                loading={creatingOrder}
                onClick={handleCreateOrder}
              >
                Continue to Payment
              </Button>
            ) : (
              <PayButton
                orderId={createdOrderId}
                amount={grandTotal}
                amountFormatted={formatPrice(grandTotal)}
                description="Tiuri Nails & Wigs Parlour"
                onSuccess={() => {
                  router.push(`/payment/success`);
                }}
              />
            )}
            <p className="text-xs text-center text-neutral-400">
              Your payment is secured by Paystack with 256-bit SSL encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
