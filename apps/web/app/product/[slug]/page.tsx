import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductDetail } from '@/components/product/product-detail';
import { ProductCard } from '@/components/product/product-card';
import { Section, SectionHeading } from '@/components/builder';
import { generateProductMetadata, generateProductJsonLd } from '@/lib/seo';
import type { Product, ProductVariant } from '@/lib/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('product_catalog')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!product) return { title: 'Product Not Found' };
  return generateProductMetadata(product as Product);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('product_catalog')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) notFound();

  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id)
    .eq('is_active', true);

  // Fetch related products from same category
  const { data: related } = await supabase
    .from('product_catalog')
    .select('*')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateProductJsonLd(product as Product)) }}
      />
      <Section className="py-8 md:py-12">
        <ProductDetail
          product={product as Product}
          variants={(variants || []) as ProductVariant[]}
        />
      </Section>

      {related && related.length > 0 && (
        <Section>
          <SectionHeading title="You May Also Like" subtitle="Similar products you might love" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p: Product, i: number) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
