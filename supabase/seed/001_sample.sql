-- ============================================================
-- Seed Data — Sample products for NanoCommerce
-- ============================================================

-- Categories
INSERT INTO public.categories (id, name, slug, description) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'T-Shirts', 't-shirts', 'Comfortable everyday tees'),
  ('a0000000-0000-0000-0000-000000000002', 'Hoodies', 'hoodies', 'Warm and stylish hoodies'),
  ('a0000000-0000-0000-0000-000000000003', 'Accessories', 'accessories', 'Complete your look');

-- Products
INSERT INTO public.products (id, name, slug, description, short_desc, price, sale_price, sku, stock, attributes, images, category_id, is_active, is_featured, seo_title, seo_desc) VALUES
  (
    'b0000000-0000-0000-0000-000000000001',
    'Classic Cotton Tee',
    'classic-cotton-tee',
    'Our signature classic tee made from 100% organic cotton. Features a relaxed fit with reinforced seams for lasting comfort. Perfect for everyday wear.',
    'Soft organic cotton, relaxed fit.',
    299000,
    249000,
    'NC-TSHIRT-001',
    100,
    '[{"name": "Size", "values": ["S", "M", "L", "XL"]}, {"name": "Color", "values": ["White", "Black", "Navy"]}]',
    ARRAY['/images/products/tee-1.jpg', '/images/products/tee-2.jpg'],
    'a0000000-0000-0000-0000-000000000001',
    true,
    true,
    'Classic Cotton Tee | NanoCommerce',
    'Shop our Classic Cotton Tee. 100% organic cotton, relaxed fit. Available in White, Black, Navy.'
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'Urban Oversized Hoodie',
    'urban-oversized-hoodie',
    'Heavyweight 380GSM French terry hoodie with an oversized silhouette. Kangaroo pocket, ribbed cuffs, and brushed interior for maximum warmth.',
    '380GSM heavyweight, oversized fit.',
    699000,
    NULL,
    'NC-HOODIE-001',
    50,
    '[{"name": "Size", "values": ["M", "L", "XL", "XXL"]}, {"name": "Color", "values": ["Gray", "Black", "Forest Green"]}]',
    ARRAY['/images/products/hoodie-1.jpg', '/images/products/hoodie-2.jpg'],
    'a0000000-0000-0000-0000-000000000002',
    true,
    true,
    'Urban Oversized Hoodie | NanoCommerce',
    'Heavyweight 380GSM French terry hoodie. Oversized fit, brushed interior.'
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'Minimal Canvas Tote',
    'minimal-canvas-tote',
    'Durable 16oz canvas tote with internal pocket and reinforced handles. Simple, clean design for daily use.',
    '16oz canvas, reinforced handles.',
    199000,
    NULL,
    'NC-TOTE-001',
    200,
    '[{"name": "Color", "values": ["Natural", "Black"]}]',
    ARRAY['/images/products/tote-1.jpg'],
    'a0000000-0000-0000-0000-000000000003',
    true,
    false,
    'Minimal Canvas Tote | NanoCommerce',
    'Durable 16oz canvas tote bag. Clean minimal design.'
  ),
  (
    'b0000000-0000-0000-0000-000000000004',
    'Essential Crew Socks (3-Pack)',
    'essential-crew-socks',
    'Premium combed cotton crew socks with reinforced heel and toe. Comes in a pack of 3 pairs.',
    'Combed cotton, 3-pack.',
    149000,
    99000,
    'NC-SOCK-001',
    300,
    '[{"name": "Size", "values": ["S (36-39)", "M (40-43)", "L (44-47)"]}]',
    ARRAY['/images/products/socks-1.jpg'],
    'a0000000-0000-0000-0000-000000000003',
    true,
    false,
    'Essential Crew Socks 3-Pack | NanoCommerce',
    'Premium combed cotton crew socks. Reinforced heel and toe.'
  );

-- Product variants
INSERT INTO public.product_variants (product_id, sku, attributes, stock) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'NC-TSHIRT-001-S-WH', '{"Size": "S", "Color": "White"}', 20),
  ('b0000000-0000-0000-0000-000000000001', 'NC-TSHIRT-001-M-WH', '{"Size": "M", "Color": "White"}', 25),
  ('b0000000-0000-0000-0000-000000000001', 'NC-TSHIRT-001-L-WH', '{"Size": "L", "Color": "White"}', 15),
  ('b0000000-0000-0000-0000-000000000001', 'NC-TSHIRT-001-S-BK', '{"Size": "S", "Color": "Black"}', 20),
  ('b0000000-0000-0000-0000-000000000001', 'NC-TSHIRT-001-M-BK', '{"Size": "M", "Color": "Black"}', 10),
  ('b0000000-0000-0000-0000-000000000002', 'NC-HOODIE-001-M-GR', '{"Size": "M", "Color": "Gray"}', 15),
  ('b0000000-0000-0000-0000-000000000002', 'NC-HOODIE-001-L-GR', '{"Size": "L", "Color": "Gray"}', 20),
  ('b0000000-0000-0000-0000-000000000002', 'NC-HOODIE-001-XL-BK', '{"Size": "XL", "Color": "Black"}', 15);

-- Coupons
INSERT INTO public.coupons (code, type, value, min_order, max_uses, starts_at, expires_at) VALUES
  ('WELCOME10', 'percentage', 10, 200000, 100, now(), now() + INTERVAL '30 days'),
  ('SALE50K', 'fixed', 50000, 500000, 50, now(), now() + INTERVAL '7 days');

-- Sample admin user profile (create via Supabase Auth first, then update role)
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<user-uuid>';
