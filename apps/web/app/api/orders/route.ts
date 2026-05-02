import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const {
    items,
    shipping_address,
    billing_address,
    payment_method,
    coupon_code,
    subtotal,
    discount_total,
    shipping_total,
    tax_total,
    total,
  } = body;

  // Validate items
  if (!items?.length) {
    return NextResponse.json({ error: 'No items' }, { status: 400 });
  }

  // Get current user (or null for guest)
  const { data: { user } } = await supabase.auth.getUser();

  // Create order — stock decrement is handled by DB trigger (race-condition safe)
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: user?.id || null,
      line_items: items,
      shipping_address,
      billing_address: billing_address || shipping_address,
      payment_method: payment_method || 'cod',
      coupon_code,
      subtotal,
      discount_total: discount_total || 0,
      shipping_total: shipping_total || 0,
      tax_total: tax_total || 0,
      total,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update coupon usage
  if (coupon_code) {
    await supabase.rpc('increment_coupon_usage', { coupon_code });
  }

  return NextResponse.json(order, { status: 201 });
}
