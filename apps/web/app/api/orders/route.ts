import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
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
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    // Validate required shipping fields
    if (!shipping_address?.full_name || !shipping_address?.phone || !shipping_address?.address) {
      return NextResponse.json({ error: 'Missing required shipping information' }, { status: 400 });
    }

    // Get current user (or null for guest)
    const { data: { user } } = await supabase.auth.getUser();

    // Generate order number
    const orderNum = Math.floor(Math.random() * 99999) + 1;
    const order_number = `#NC-${String(orderNum).padStart(5, '0')}`;

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number,
        user_id: user?.id || null,
        status: 'pending',
        line_items: items,
        shipping_address,
        billing_address: billing_address || shipping_address,
        payment_method: payment_method || 'cod',
        payment_status: 'unpaid',
        coupon_code,
        subtotal,
        discount_total: discount_total || 0,
        shipping_total: shipping_total || 0,
        tax_total: tax_total || 0,
        total,
        currency: 'VND',
      })
      .select()
      .single();

    if (error) {
      console.error('Order creation error:', error);
      return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    console.error('Order API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = req.nextUrl;

    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      orders: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
