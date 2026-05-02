import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ProductCard, ProductCardSkeleton } from '@/components/product/product-card';
import { Section, SectionHeading } from '@/components/builder';
import type { Product } from '@/lib/types';

export const revalidate = 30;

interface Props {
  params: Promise<{ slug?: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export default async function CollectionsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort = 'newest', page = '1' } = await searchParams;
  const supabase = await createClient();
  const pageSize = 12;
  const pageNum = parseInt(page, 10) || 1;
  const offset = (pageNum - 1) * pageSize;

  let query = supabase
    .from('product_catalog')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .range(offset, offset + pageSize - 1);

  // Category filter
  if (slug && slug !== 'all') {
    if (slug === 'new') {
      query = query.order('created_at', { ascending: false });
    } else if (slug === 'sale') {
      query = query.not('sale_price', 'is', null);
    } else if (slug === 'best-sellers') {
      query = query.order('review_count', { ascending: false });
    } else {
      query = query.eq('category_slug', slug);
    }
  }

  // Sort
  switch (sort) {
    case 'price-asc': query = query.order('effective_price', { ascending: true }); break;
    case 'price-desc': query = query.order('effective_price', { ascending: false }); break;
    case 'popular': query = query.order('review_count', { ascending: false }); break;
    default: query = query.order('created_at', { ascending: false });
  }

  const { data: products, count } = await query;

  const title = slug
    ? slug === 'new' ? 'New Arrivals' : slug === 'sale' ? 'On Sale' : slug === 'best-sellers' ? 'Best Sellers' : slug.charAt(0).toUpperCase() + slug.slice(1)
    : 'All Products';

  return (
    <Section>
      <SectionHeading title={title} subtitle={`${count || 0} products`} />

      {/* Sort bar */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-gray-500">{count} products</p>
        <div className="flex gap-2">
          {[
            { label: 'Newest', value: 'newest' },
            { label: 'Price ↑', value: 'price-asc' },
            { label: 'Price ↓', value: 'price-desc' },
          ].map((s) => (
            <a
              key={s.value}
              href={`?sort=${s.value}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                sort === s.value ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <Suspense fallback={Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}>
          {(products || []).map((product: Product, i: number) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </Suspense>
      </div>

      {/* Pagination */}
      {count && count > pageSize && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: Math.ceil(count / pageSize) }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?sort=${sort}&page=${p}`}
              className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                p === pageNum ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </Section>
  );
}
