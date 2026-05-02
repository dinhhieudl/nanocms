import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ProductCard, ProductCardSkeleton } from '@/components/product/product-card';
import { Section, SectionHeading } from '@/components/builder';
import { CollectionsFilter } from '@/components/shop/collections-filter';
import type { Product } from '@/lib/types';

export const metadata = {
  title: 'All Products',
  description: 'Browse our complete collection of premium clothing and accessories.',
};

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CollectionsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  // Get categories for filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  // Build query
  let query = supabase
    .from('product_catalog')
    .select('*', { count: 'exact' });

  const category = typeof params.category === 'string' ? params.category : undefined;
  const sort = typeof params.sort === 'string' ? params.sort : 'newest';
  const search = typeof params.search === 'string' ? params.search : undefined;
  const minPrice = typeof params.minPrice === 'string' ? parseInt(params.minPrice) : undefined;
  const maxPrice = typeof params.maxPrice === 'string' ? parseInt(params.maxPrice) : undefined;

  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();
    if (cat) query = query.eq('category_id', cat.id);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (minPrice !== undefined) {
    query = query.gte('effective_price', minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte('effective_price', maxPrice);
  }

  switch (sort) {
    case 'price-asc':
      query = query.order('effective_price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('effective_price', { ascending: false });
      break;
    case 'popular':
      query = query.order('review_count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data: products, count } = await query;

  return (
    <Section className="py-8 md:py-12">
      <SectionHeading
        title={category ? `${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')}` : 'All Products'}
        subtitle={`${count || 0} products found`}
      />

      <CollectionsFilter
        categories={(categories || []) as any[]}
        activeCategory={category}
        activeSort={sort}
        searchQuery={search}
      />

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <Suspense fallback={Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}>
          {(products || []).map((product: Product, idx: number) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </Suspense>
      </div>

      {(!products || products.length === 0) && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No products found.</p>
          <a href="/collections" className="btn-primary mt-4 inline-block">View All Products</a>
        </div>
      )}
    </Section>
  );
}
