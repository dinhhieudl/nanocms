import { Section, SectionHeading } from '@/components/builder';
import { Heart, Zap, Shield, Leaf } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: 'Learn about NanoCommerce - our story, mission, and values.',
};

export default function AboutPage() {
  return (
    <>
      <Section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Built for <span className="text-brand-600">Speed</span> & <span className="text-brand-600">Style</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            NanoCommerce was born from a simple idea: online shopping should be fast, beautiful, and effortless.
            We combine cutting-edge technology with curated fashion to deliver an experience that&apos;s 10x better than
            traditional e-commerce platforms.
          </p>
        </div>
      </Section>

      <Section bg="#f9fafb">
        <SectionHeading title="Our Values" subtitle="What drives everything we do" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Pages load in under 1 second. No waiting, no spinning wheels.' },
            { icon: Heart, title: 'Customer First', desc: 'Every decision starts with "how does this help our customers?"' },
            { icon: Shield, title: 'Quality Assured', desc: 'Premium materials, careful craftsmanship, rigorous testing.' },
            { icon: Leaf, title: 'Sustainable', desc: 'Organic materials, eco-friendly packaging, carbon-neutral shipping.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
                <Icon className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="font-bold mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <SectionHeading title="Our Story" />
          <div className="prose prose-gray max-w-none">
            <p>
              Founded in 2024 in Ho Chi Minh City, NanoCommerce started as a small passion project by a team of
              developers and fashion enthusiasts who were frustrated with slow, clunky e-commerce experiences.
            </p>
            <p>
              We built our platform from the ground up using Next.js and Supabase, focusing on performance,
              user experience, and modern design. The result? A shopping experience that loads instantly,
              looks beautiful on any device, and makes finding what you want effortless.
            </p>
            <p>
              Today, we serve thousands of customers across Vietnam, offering curated collections of
              premium basics, streetwear essentials, and accessories — all at honest prices.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
