'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Section, SectionHeading } from '@/components/builder';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, couponCode, discount, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const couponDiscount = couponCode ? discount : 0;
  const total = subtotal - couponDiscount + shipping;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError('');

    // Mock coupon validation
    const mockCoupons: Record<string, { type: string; value: number; minOrder: number }> = {
      'WELCOME10': { type: 'percentage', value: 10, minOrder: 200000 },
      'SALE50K': { type: 'fixed', value: 50000, minOrder: 500000 },
    };

    const coupon = mockCoupons[couponInput.toUpperCase()];
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }
    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order: ${formatPrice(coupon.minOrder)}`);
      return;
    }

    const discountAmount = coupon.type === 'percentage'
      ? Math.round(subtotal * coupon.value / 100)
      : coupon.value;

    applyCoupon(couponInput.toUpperCase(), discountAmount);
    setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <Section className="py-20">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-200 mb-6" />
          <h1 className="text-2xl font-bold font-display mb-2">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/collections" className="btn-primary">
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-8 md:py-12">
      <SectionHeading title="Shopping Cart" subtitle={`${items.length} item${items.length > 1 ? 's' : ''} in your cart`} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={`${item.productId}-${item.variantId}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="card flex gap-4"
              >
                {/* Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-200">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                  {item.attributes && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                    </p>
                  )}
                  <p className="text-sm font-bold text-brand-600 mt-1">{formatPrice(item.price)}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-full border border-gray-200">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="p-2 text-gray-400 hover:text-gray-900"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="p-2 text-gray-400 hover:text-gray-900"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="btn-icon text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-between items-center pt-4">
            <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500">
              Clear Cart
            </button>
            <Link href="/collections" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
              Continue Shopping <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 space-y-4">
            <h2 className="text-lg font-bold font-display">Order Summary</h2>

            {/* Coupon */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">{couponCode}</span>
                    <span className="text-xs text-green-600">-{formatPrice(couponDiscount)}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-green-600 hover:text-green-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="input-field flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button onClick={handleApplyCoupon} className="btn-secondary text-sm px-4">
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Coupon Discount</span>
                  <span className="text-green-600">-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">Free shipping on orders over {formatPrice(500000)}</p>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total</span>
                <span className="text-brand-600">{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full text-center text-base py-4">
              Proceed to Checkout
            </Link>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <span className="text-xs text-gray-400">🔒 Secure checkout</span>
              <span className="text-xs text-gray-400">🚚 Fast delivery</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
