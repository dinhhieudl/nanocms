'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, Tag, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Section, SectionHeading } from '@/components/builder';

export default function CartPage() {
  const { items, removeItem, updateQuantity, couponCode, discount, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal - discount;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        applyCoupon(couponInput, data.discount);
      }
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Section className="text-center py-24">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link href="/collections" className="btn-primary">
          Continue Shopping
        </Link>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeading title="Shopping Cart" subtitle={`${items.length} item(s)`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div
              key={`${item.productId}-${item.variantId}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex gap-4 p-4 rounded-2xl border bg-white"
            >
              <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-gray-50">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                {item.attributes && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                  </p>
                )}
                <p className="text-sm font-bold mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full border">
                  <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="p-2">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="p-2">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button onClick={() => removeItem(item.productId, item.variantId)} className="btn-icon text-gray-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-gray-50 p-6 sticky top-24 space-y-4">
            <h3 className="font-semibold text-lg">Order Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponCode})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-400">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            {/* Coupon */}
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 rounded-full border px-4 py-2 text-sm"
              />
              <button onClick={handleApplyCoupon} disabled={couponLoading} className="btn-secondary text-sm px-4">
                <Tag className="h-4 w-4" />
              </button>
            </div>
            {couponCode && (
              <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline">
                Remove coupon
              </button>
            )}

            <Link href="/checkout" className="btn-primary w-full text-center">
              Checkout <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
