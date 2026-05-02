'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Section } from '@/components/builder';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <Section className="text-center py-24">
      <div className="max-w-md mx-auto">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold font-display mb-2">Thank You!</h1>
        <p className="text-gray-500 mb-4">Your order has been placed successfully.</p>
        {orderNumber && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-xl font-bold text-brand-600">{orderNumber}</p>
          </div>
        )}
        <p className="text-sm text-gray-400 mb-8">
          We'll send you an email with tracking information once your order ships.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/collections" className="btn-primary">
            Continue Shopping <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
