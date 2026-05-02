'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Section, SectionHeading } from '@/components/builder';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, discount, couponCode, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '', phone: '', email: '',
    address: '', ward: '', district: '', city: '', country: 'VN',
    payment_method: 'cod',
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal - discount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.productId,
            variant_id: i.variantId || null,
            name: i.name,
            qty: i.quantity,
            unit_price: i.price,
            total: i.price * i.quantity,
          })),
          shipping_address: form,
          payment_method: form.payment_method,
          coupon_code: couponCode,
          subtotal,
          discount_total: discount,
          shipping_total: 0,
          tax_total: 0,
          total,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Order failed');
      }

      const order = await res.json();
      clearCart();
      toast.success('Order placed!', { description: `Order ${order.order_number}` });
      router.push(`/checkout/success?order=${order.order_number}`);
    } catch (err: any) {
      toast.error('Checkout failed', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Section className="text-center py-24">
        <h2 className="text-2xl font-bold mb-2">Nothing to checkout</h2>
        <p className="text-gray-500">Add items to your cart first.</p>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeading title="Checkout" subtitle="Complete your order" />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Shipping info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border p-6 space-y-4">
            <h3 className="font-semibold">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'full_name', label: 'Full Name', required: true },
                { name: 'phone', label: 'Phone', required: true, type: 'tel' },
                { name: 'email', label: 'Email', required: true, type: 'email' },
                { name: 'address', label: 'Address', required: true, span: 2 },
                { name: 'ward', label: 'Ward', required: true },
                { name: 'district', label: 'District', required: true },
                { name: 'city', label: 'City', required: true },
              ].map((field) => (
                <div key={field.name} className={field.span === 2 ? 'md:col-span-2' : ''}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type || 'text'}
                    required={field.required}
                    value={(form as any)[field.name]}
                    onChange={handleChange}
                    className="w-full rounded-xl border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border p-6">
            <h3 className="font-semibold mb-4">Payment Method</h3>
            <div className="space-y-3">
              {[
                { value: 'cod', label: 'Cash on Delivery' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
              ].map((method) => (
                <label key={method.value} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.value}
                    checked={form.payment_method === method.value}
                    onChange={handleChange}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-gray-50 p-6 sticky top-24 space-y-4">
            <h3 className="font-semibold">Your Order</h3>
            <div className="space-y-3 max-h-60 overflow-auto">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-green-600">Free</span></div>
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full text-base py-4"
            >
              {loading ? 'Processing…' : `Place Order — ${formatPrice(total)}`}
            </motion.button>
          </div>
        </div>
      </form>
    </Section>
  );
}
