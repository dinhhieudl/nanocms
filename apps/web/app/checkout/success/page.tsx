import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { Section } from '@/components/builder';
import { SuccessAnimation } from '@/components/checkout/success-animation';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderNumber = typeof params.order === 'string' ? params.order : '#NC-00000';

  return (
    <Section className="py-20">
      <div className="text-center max-w-lg mx-auto">
        <SuccessAnimation />

        <h1 className="text-3xl font-bold font-display mb-3">Order Confirmed! 🎉</h1>
        <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
        <p className="text-lg font-bold text-brand-600 mb-8">{orderNumber}</p>

        <div className="card text-left mb-8">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <Package className="h-5 w-5 text-brand-600" />
            What happens next?
          </h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>We&apos;ll send you an order confirmation email shortly.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>Your order will be processed within 1-2 business days.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>You&apos;ll receive tracking info once your order ships.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/collections" className="btn-primary">
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </Section>
  );
}
