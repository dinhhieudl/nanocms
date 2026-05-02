import { Section, SectionHeading } from '@/components/builder';
import { Truck, Clock, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Shipping Policy',
  description: 'NanoCommerce shipping information and delivery times.',
};

export default function ShippingPage() {
  return (
    <Section className="py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <SectionHeading title="Shipping Policy" subtitle="Everything you need to know about delivery" />

        <div className="mt-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over 500,000₫' },
              { icon: Clock, title: 'Fast Processing', desc: 'Orders ship within 24h' },
              { icon: MapPin, title: 'Nationwide', desc: 'Delivery across Vietnam' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card text-center">
                <Icon className="h-8 w-8 mx-auto text-brand-600 mb-3" />
                <h3 className="font-bold text-sm">{title}</h3>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-gray max-w-none">
            <h3>Shipping Rates</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Method</th>
                  <th className="text-left py-2">Time</th>
                  <th className="text-right py-2">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2">Standard</td><td>3-5 days</td><td className="text-right">30,000₫</td></tr>
                <tr className="border-b"><td className="py-2">Express</td><td>1-2 days</td><td className="text-right">50,000₫</td></tr>
                <tr><td className="py-2">Same Day (HCMC)</td><td>Same day</td><td className="text-right">80,000₫</td></tr>
              </tbody>
            </table>

            <h3>Order Tracking</h3>
            <p>Once your order ships, you&apos;ll receive an email with a tracking number. You can use this to track your package on our website or the carrier&apos;s site.</p>

            <h3>Delivery Issues</h3>
            <p>If your order hasn&apos;t arrived within the expected timeframe, please contact us at <a href="mailto:support@nanocms.example.com">support@nanocms.example.com</a> with your order number.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
