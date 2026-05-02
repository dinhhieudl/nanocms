import { Section, SectionHeading } from '@/components/builder';
import { RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

export const metadata = {
  title: 'Returns & Exchanges',
  description: 'NanoCommerce return and exchange policy.',
};

export default function ReturnsPage() {
  return (
    <Section className="py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <SectionHeading title="Returns & Exchanges" subtitle="30-day hassle-free returns" />

        <div className="mt-12 space-y-8">
          <div className="card bg-brand-50 border-brand-200">
            <div className="flex items-start gap-4">
              <RotateCcw className="h-8 w-8 text-brand-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg">30-Day Return Policy</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Not satisfied? Return any unworn item within 30 days for a full refund or exchange.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="flex items-center gap-2 font-bold mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Eligible for Return
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Unworn and unwashed items</li>
                <li>• Original tags attached</li>
                <li>• Original packaging included</li>
                <li>• Within 30 days of delivery</li>
                <li>• Defective or damaged items</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="flex items-center gap-2 font-bold mb-3">
                <XCircle className="h-5 w-5 text-red-600" />
                Not Eligible
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Worn or washed items</li>
                <li>• Items without original tags</li>
                <li>• Underwear and swimwear</li>
                <li>• Sale items marked "Final Sale"</li>
                <li>• Items past 30-day window</li>
              </ul>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h3>How to Return</h3>
            <ol>
              <li>Email <a href="mailto:returns@nanocms.example.com">returns@nanocms.example.com</a> with your order number.</li>
              <li>Receive a return authorization and shipping label.</li>
              <li>Pack items securely and ship within 7 days.</li>
              <li>Refund processed within 3-5 business days of receiving the return.</li>
            </ol>

            <h3>Exchanges</h3>
            <p>Want a different size or color? Mention this in your return email and we&apos;ll ship the new item as soon as we receive your return.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
