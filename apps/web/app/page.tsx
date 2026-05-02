import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { HeroBanner, BannerGrid, Section, SectionHeading } from '@/components/builder';
import { ProductCard, ProductCardSkeleton } from '@/components/product/product-card';
import type { Product } from '@/lib/types';

export const revalidate = 60; // ISR: rebuild every 60s

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch site options
  const { data: options } = await supabase
    .from('site_options')
    .select('value')
    .eq('key', 'homepage')
    .single();

  const sections = (options?.value as any)?.sections || [];

  // Fetch featured products
  const { data: products } = await supabase
    .from('product_catalog')
    .select('*')
    .eq('is_featured', true)
    .limit(8)
    .order('created_at', { ascending: false });

  return (
    <div>
      {sections.map((section: any, i: number) => {
        switch (section.type) {
          case 'hero':
            return (
              <Section key={i} className="py-0 md:py-0">
                <HeroBanner {...section.data} />
              </Section>
            );
          case 'banner_grid':
            return (
              <Section key={i}>
                <BannerGrid banners={section.data.banners} />
              </Section>
            );
          case 'featured_products':
            return (
              <Section key={i}>
                <SectionHeading title={section.data.title || 'Featured Products'} subtitle="Our handpicked selection" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  <Suspense fallback={Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}>
                    {(products || []).map((product: Product, idx: number) => (
                      <ProductCard key={product.id} product={product} index={idx} />
                    ))}
                  </Suspense>
                </div>
              </Section>
            );
          default:
            return null;
        }
      })}

      {/* Fallback if no sections configured */}
      {sections.length === 0 && (
        <Section>
          <HeroBanner
            heading="Welcome to NanoCommerce"
            subheading="Fast. Beautiful. Yours."
            ctaLabel="Shop Now"
            ctaHref="/collections"
          />
        </Section>
      )}
    </div>
  );
}
