import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ProductCard, ProductCardSkeleton } from '@/components/product/product-card';
import { Section, SectionHeading } from '@/components/builder';
import type { Product } from '@/lib/types';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CollectionSlugPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  let title = 'Collection';
  let products: Product[] = [];

  if (slug === 'new') {
    title = 'New Arrivals';
    const { data } = await supabase
      .from('product_catalog')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    products = (data || []) as Product[];
  } else if (slug === 'sale') {
    title = 'On Sale';
    const { data } = await supabase
      .from('product_catalog')
      .select('*')
      .not('sale_price', 'is', null)
      .limit(20);
    products = (data || []) as Product[];
  } else if (slug === 'best-sellers') {
    title = 'Best Sellers';
    const { data } = await supabase
      .from('product_catalog')
      .select('*')
      .order('review_count', { ascending: false })
      .limit(20);
    products = (data || []) as Product[];
  } else {
    // Category slug
    const { data: cat } = await supabase
      .from('categories')
      .select('id, name')
      .eq('slug', slug)
      .single();

    if (cat) {
      title = cat.name;
      const { data } = await supabase
        .from('product_catalog')
        .select('*')
        .eq('category_id', cat.id)
        .order('created_at', { ascending: false });
      products = (data || []) as Product[];
    }
  }

  return (
    <Section className="py-8 md:py-12">
      <SectionHeading title={title} subtitle={`${products.length} products`} />
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <Suspense fallback={Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}>
          {products.map((product: Product, idx: number) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </Suspense>
      </div>
      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No products in this collection yet.</p>
          <a href="/collections" className="btn-primary mt-4 inline-block">Browse All Products</a>
        </div>
      )}
    </Section>
  );
}
