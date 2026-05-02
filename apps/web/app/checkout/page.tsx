'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CreditCard, Truck, MapPin, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Section, SectionHeading } from '@/components/builder';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, couponCode, discount, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    notes: '',
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const couponDiscount = couponCode ? discount : 0;
  const total = subtotal - couponDiscount + shipping;

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = (): string | null => {
    if (!form.fullName.trim()) return 'Please enter your full name';
    if (!form.phone.trim()) return 'Please enter your phone number';
    if (!form.address.trim()) return 'Please enter your address';
    if (!form.ward.trim()) return 'Please enter your ward';
    if (!form.district.trim()) return 'Please enter your district';
    if (!form.city.trim()) return 'Please enter your city';
    if (items.length === 0) return 'Your cart is empty';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const shippingAddress = {
        full_name: form.fullName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        ward: form.ward,
        district: form.district,
        city: form.city,
        country: 'Vietnam',
      };

      const orderItems = items.map((item) => ({
        product_id: item.productId,
        variant_id: item.variantId || null,
        name: item.name,
        sku: item.attributes
          ? Object.values(item.attributes).join('-')
          : undefined,
        qty: item.quantity,
        unit_price: item.price,
        total: item.price * item.quantity,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          shipping_address: shippingAddress,
          billing_address: shippingAddress,
          payment_method: paymentMethod,
          coupon_code: couponCode || null,
          subtotal,
          discount_total: couponDiscount,
          shipping_total: shipping,
          tax_total: 0,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      router.push(`/checkout/success?order=${data.order_number || ''}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Section className="py-20">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-200 mb-6" />
          <h1 className="text-2xl font-bold font-display mb-2">Nothing to Checkout</h1>
          <p className="text-gray-500 mb-8">Add some items to your cart first.</p>
          <a href="/collections" className="btn-primary">Browse Products</a>
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-8 md:py-12">
      <SectionHeading title="Checkout" subtitle="Complete your order" />

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Contact */}
          <div className="card">
            <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
              <MapPin className="h-5 w-5 text-brand-600" />
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => updateForm('fullName', e.target.value)}
                  className="input-field"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  className="input-field"
                  placeholder="0901234567"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  className="input-field"
                  placeholder="email@example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Address *</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  className="input-field"
                  placeholder="123 Nguyễn Huệ"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ward *</label>
                <input
                  type="text"
                  required
                  value={form.ward}
                  onChange={(e) => updateForm('ward', e.target.value)}
                  className="input-field"
                  placeholder="Phường Bến Nghé"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">District *</label>
                <input
                  type="text"
                  required
                  value={form.district}
                  onChange={(e) => updateForm('district', e.target.value)}
                  className="input-field"
                  placeholder="Quận 1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">City *</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => updateForm('city', e.target.value)}
                  className="input-field"
                  placeholder="TP. Hồ Chí Minh"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Notes</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                  className="input-field"
                  placeholder="Ghi chú cho đơn hàng..."
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
              <CreditCard className="h-5 w-5 text-brand-600" />
              Payment Method
            </h2>
            <div className="space-y-3">
              {[
                { id: 'cod', label: 'Cash on Delivery (COD)', desc: 'Pay when you receive your order', icon: Truck },
                { id: 'bank', label: 'Bank Transfer', desc: 'Transfer to our bank account', icon: CreditCard },
              ].map(({ id, label, desc, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === id
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={id}
                    checked={paymentMethod === id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-lg ${paymentMethod === id ? 'bg-brand-100' : 'bg-gray-100'}`}>
                    <Icon className={`h-5 w-5 ${paymentMethod === id ? 'text-brand-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === id ? 'border-brand-600' : 'border-gray-300'
                  }`}>
                    {paymentMethod === id && <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 space-y-4">
            <h2 className="text-lg font-bold font-display">Your Order</h2>

            <div className="space-y-3 max-h-64 overflow-auto">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-200">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                    )}
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    {item.attributes && (
                      <p className="text-xs text-gray-400">
                        {Object.entries(item.attributes).map(([k, v]) => v).join(' / ')}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Coupon ({couponCode})</span>
                  <span className="text-green-600">-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total</span>
                <span className="text-brand-600">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full text-base py-4"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Place Order — {formatPrice(total)}
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              By placing this order, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </form>
    </Section>
  );
}
