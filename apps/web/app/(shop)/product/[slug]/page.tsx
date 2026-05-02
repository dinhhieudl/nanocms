import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductDetail } from '@/components/product/product-detail';
import { generateProductMetadata, generateProductJsonLd } from '@/lib/seo';
import { Section } from '@/components/builder';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!data) return {};
  return generateProductMetadata(data);
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

  // Fetch variants
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id)
    .eq('is_active', true);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateProductJsonLd(product)) }}
      />
      <Section>
        <ProductDetail product={product} variants={variants || []} />
      </Section>
    </>
  );
}
