import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = req.nextUrl;

  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const search = searchParams.get('q');
  const featured = searchParams.get('featured');

  let query = supabase
    .from('product_catalog')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (category) query = query.eq('category_slug', category);
  if (featured === 'true') query = query.eq('is_featured', true);
  if (search) query = query.ilike('name', `%${search}%`);

  // Sort
  switch (sort) {
    case 'price-asc': query = query.order('effective_price', { ascending: true }); break;
    case 'price-desc': query = query.order('effective_price', { ascending: false }); break;
    case 'popular': query = query.order('review_count', { ascending: false }); break;
    default: query = query.order('created_at', { ascending: false });
  }

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    products: data,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil((count || 0) / limit),
    },
  });
}
