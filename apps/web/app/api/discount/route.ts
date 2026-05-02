import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { code, subtotal } = await req.json();

  if (!code) {
    return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 });
  }

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !coupon) {
    return NextResponse.json({ valid: false, error: 'Invalid coupon' });
  }

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: 'Coupon expired' });
  }

  if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
    return NextResponse.json({ valid: false, error: 'Coupon not yet active' });
  }

  // Check usage limit
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return NextResponse.json({ valid: false, error: 'Coupon fully used' });
  }

  // Check minimum order
  if (coupon.min_order && subtotal < coupon.min_order) {
    return NextResponse.json({
      valid: false,
      error: `Minimum order ${coupon.min_order}`,
    });
  }

  // Calculate discount
  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = Math.round((subtotal * coupon.value) / 100);
  } else {
    discount = Math.min(coupon.value, subtotal);
  }

  return NextResponse.json({ valid: true, discount, type: coupon.type, value: coupon.value });
}
