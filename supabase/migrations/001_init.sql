-- ============================================================
-- NanoCommerce — PostgreSQL/Supabase Schema
-- Replaces: WordPress + WooCommerce + Flatsome Customizer
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- fuzzy search

-- ============================================================
-- 1. AUTH & USERS (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. CATALOG
-- ============================================================
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  parent_id   UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_parent ON public.categories(parent_id);

CREATE TABLE public.products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  short_desc    TEXT,
  price         NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  sale_price    NUMERIC(12,2) CHECK (sale_price >= 0 AND sale_price < price),
  cost_price    NUMERIC(12,2),
  sku           TEXT UNIQUE,
  stock         INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  weight        NUMERIC(8,2),
  dimensions    JSONB, -- { length, width, height }
  attributes    JSONB NOT NULL DEFAULT '[]',
  -- e.g. [{ "name": "Size", "values": ["S","M","L"] }, { "name": "Color", "values": ["Red","Blue"] }]
  images        TEXT[] NOT NULL DEFAULT '{}',
  category_id   UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  seo_title     TEXT,
  seo_desc      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_search ON public.products USING gin (name gin_trgm_ops);

-- Product variants (size/color combos)
CREATE TABLE public.product_variants (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku         TEXT UNIQUE,
  attributes  JSONB NOT NULL DEFAULT '{}', -- { "Size": "M", "Color": "Red" }
  price       NUMERIC(12,2),              -- override parent price if set
  stock       INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_variants_product ON public.product_variants(product_id);

-- ============================================================
-- 3. SHOPPING
-- ============================================================
CREATE TABLE public.carts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id  TEXT,                          -- guest carts
  items       JSONB NOT NULL DEFAULT '[]',
  -- [{ product_id, variant_id?, qty, price_at_add }]
  coupon_code TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '7 days'
);

CREATE INDEX idx_carts_user ON public.carts(user_id);
CREATE INDEX idx_carts_session ON public.carts(session_id);
CREATE INDEX idx_carts_expires ON public.carts(expires_at);

CREATE TABLE public.orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number    TEXT NOT NULL UNIQUE,      -- human-readable: #NC-00001
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  subtotal        NUMERIC(12,2) NOT NULL,
  discount_total  NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_total  NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_total       NUMERIC(12,2) NOT NULL DEFAULT 0,
  total           NUMERIC(12,2) NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'VND',
  line_items      JSONB NOT NULL,
  -- [{ product_id, variant_id?, name, sku, qty, unit_price, total }]
  shipping_address JSONB,
  billing_address  JSONB,
  coupon_code     TEXT,
  notes           TEXT,
  payment_method  TEXT,
  payment_status  TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid','paid','partially_refunded','refunded')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_number ON public.orders(order_number);

-- ============================================================
-- 4. DISCOUNTS & SHIPPING
-- ============================================================
CREATE TABLE public.coupons (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          TEXT NOT NULL UNIQUE,
  type          TEXT NOT NULL CHECK (type IN ('percentage','fixed')),
  value         NUMERIC(12,2) NOT NULL CHECK (value > 0),
  min_order     NUMERIC(12,2) DEFAULT 0,
  max_uses      INT,
  used_count    INT NOT NULL DEFAULT 0,
  starts_at     TIMESTAMPTZ,
  expires_at    TIMESTAMPTZ,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_coupons_code ON public.coupons(code);

CREATE TABLE public.shipping_zones (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  regions     TEXT[] NOT NULL DEFAULT '{}',  -- ['VN', 'US', ...]
  methods     JSONB NOT NULL DEFAULT '[]',
  -- [{ name, rate, free_above? }]
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. CMS / SITE CONFIG (replaces WP Customizer)
-- ============================================================
CREATE TABLE public.site_options (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pre-seed header/footer/layout options
INSERT INTO public.site_options (key, value) VALUES
  ('header', '{
    "logo_url": "/images/logo.svg",
    "sticky": true,
    "transparent": false,
    "nav_items": [
      { "label": "Home", "href": "/" },
      { "label": "Shop", "href": "/collections" },
      { "label": "About", "href": "/about" },
      { "label": "Contact", "href": "/contact" }
    ],
    "cta": { "label": "Cart", "href": "/cart", "icon": "shopping-bag" }
  }'),
  ('footer', '{
    "columns": [
      {
        "title": "Shop",
        "links": [
          { "label": "All Products", "href": "/collections" },
          { "label": "New Arrivals", "href": "/collections/new" },
          { "label": "Sale", "href": "/collections/sale" }
        ]
      },
      {
        "title": "Company",
        "links": [
          { "label": "About Us", "href": "/about" },
          { "label": "Contact", "href": "/contact" }
        ]
      }
    ],
    "copyright": "© 2026 NanoCommerce. All rights reserved.",
    "social": {}
  }'),
  ('homepage', '{
    "sections": [
      {
        "type": "hero",
        "data": {
          "heading": "Welcome to NanoCommerce",
          "subheading": "Fast. Beautiful. Yours.",
          "cta_label": "Shop Now",
          "cta_href": "/collections",
          "image_url": "/images/hero.jpg"
        }
      },
      {
        "type": "featured_products",
        "data": { "title": "Featured Products", "limit": 8 }
      },
      {
        "type": "banner_grid",
        "data": {
          "banners": [
            { "image": "/images/banners/1.jpg", "href": "/collections/new", "label": "New Arrivals" },
            { "image": "/images/banners/2.jpg", "href": "/collections/sale", "label": "Sale" }
          ]
        }
      }
    ]
  }');

-- ============================================================
-- 6. PAGE BUILDER (Flatsome UX Builder replacement)
-- ============================================================
CREATE TABLE public.pages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  content     JSONB NOT NULL DEFAULT '[]',
  -- Builder blocks: [{ type, props, children: [...] }]
  seo_title   TEXT,
  seo_desc    TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pages_slug ON public.pages(slug);

-- ============================================================
-- 7. REVIEWS
-- ============================================================
CREATE TABLE public.reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX idx_reviews_product ON public.reviews(product_id);

-- ============================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: users see own, admins see all
CREATE POLICY "profiles_own" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "profiles_admin" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Carts: users see own, guests see by session
CREATE POLICY "carts_own" ON public.carts
  FOR ALL USING (
    auth.uid() = user_id
    OR (user_id IS NULL AND session_id = current_setting('request.headers', true)::json->>'x-session-id')
  );

-- Orders: users see own only, staff/admin see all
CREATE POLICY "orders_own" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_insert" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "orders_admin" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','staff'))
  );

-- Reviews: anyone reads approved, users manage own
CREATE POLICY "reviews_read" ON public.reviews
  FOR SELECT USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "reviews_own" ON public.reviews
  FOR ALL USING (auth.uid() = user_id);

-- Public read for catalog
CREATE POLICY "products_read" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "categories_read" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "pages_read" ON public.pages
  FOR SELECT USING (is_published = true);

CREATE POLICY "site_options_read" ON public.site_options
  FOR SELECT USING (true);

-- ============================================================
-- 9. FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_carts_updated BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Generate sequential order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := '#NC-' || LPAD(
    (SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS INT)), 0) + 1
     FROM public.orders)::TEXT, 5, '0'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_number BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Decrement stock on order (race-condition safe)
CREATE OR REPLACE FUNCTION decrement_stock()
RETURNS TRIGGER AS $$
DECLARE
  item JSONB;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.line_items)
  LOOP
    IF item->>'variant_id' IS NOT NULL AND item->>'variant_id' != 'null' THEN
      UPDATE public.product_variants
      SET stock = stock - (item->>'qty')::INT
      WHERE id = (item->>'variant_id')::UUID
        AND stock >= (item->>'qty')::INT;
      IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient stock for variant %', item->>'variant_id';
      END IF;
    ELSE
      UPDATE public.products
      SET stock = stock - (item->>'qty')::INT
      WHERE id = (item->>'product_id')::UUID
        AND stock >= (item->>'qty')::INT;
      IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient stock for product %', item->>'product_id';
      END IF;
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_decrement_stock AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION decrement_stock();

-- Cleanup expired carts (run via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_carts()
RETURNS void AS $$
BEGIN
  DELETE FROM public.carts WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 10. VIEWS
-- ============================================================
CREATE OR REPLACE VIEW public.product_catalog AS
SELECT
  p.*,
  c.name AS category_name,
  c.slug AS category_slug,
  COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) AS avg_rating,
  COUNT(r.id) AS review_count,
  COALESCE(p.sale_price, p.price) AS effective_price
FROM public.products p
LEFT JOIN public.categories c ON c.id = p.category_id
LEFT JOIN public.reviews r ON r.product_id = p.id AND r.is_approved = true
WHERE p.is_active = true
GROUP BY p.id, c.name, c.slug;
