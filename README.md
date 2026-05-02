# 🚀 NanoCommerce — The Flatsome Killer

> A modern, headless e-commerce CMS built with Next.js 15, Supabase, and Tailwind CSS.
> Replaces WordPress + WooCommerce + Flatsome with a stack that's **10x faster**.

## Architecture

```
nanocms/
├── apps/
│   └── web/                    # Next.js 15 App Router
│       ├── app/
│       │   ├── (shop)/         # Storefront routes
│       │   │   ├── product/[slug]/   # Product detail (SEO optimized)
│       │   │   ├── collections/[slug]/ # Category/filter pages
│       │   │   ├── cart/              # Cart with real-time updates
│       │   │   └── checkout/          # One-page checkout
│       │   ├── (admin)/        # Admin dashboard
│       │   │   ├── dashboard/
│       │   │   ├── products/
│       │   │   └── orders/
│       │   ├── api/            # API routes
│       │   └── layout.tsx      # Root layout + Header/Footer
│       ├── components/
│       │   ├── builder/        # UX Builder components
│       │   ├── product/        # ProductCard, ProductDetail
│       │   ├── cart/
│       │   ├── checkout/
│       │   └── layout/         # Header, Footer
│       ├── hooks/              # useCart (Zustand)
│       ├── lib/                # Utils, SEO, types, Supabase
│       └── styles/             # Tailwind + custom CSS
├── packages/
│   └── ui/                     # Shared UI components
├── supabase/
│   ├── migrations/             # Database schema
│   └── seed/                   # Sample data
└── turbo.json                  # Turborepo config
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Database** | PostgreSQL via Supabase |
| **Auth** | Supabase Auth |
| **Styling** | Tailwind CSS 3.4 |
| **Animation** | Framer Motion 11 |
| **Icons** | Lucide React |
| **State** | Zustand (client cart) |
| **UI Kit** | Custom + Shadcn/UI compatible |
| **Monorepo** | Turborepo |

## Quick Start

```bash
# 1. Clone
git clone <your-repo> nanocms && cd nanocms

# 2. Install
pnpm install

# 3. Setup Supabase
supabase init
supabase start
supabase db push        # Run migrations
supabase db seed        # Load sample data

# 4. Environment
cp apps/web/.env.example apps/web/.env.local
# Fill in your Supabase URL + keys

# 5. Dev
pnpm dev
```

## Database Schema

See `supabase/migrations/001_init.sql` for the complete schema.

**Key tables:**
- `products` — with JSONB attributes for size/color variants
- `product_variants` — individual SKU variants
- `orders` — with JSONB line_items (race-condition safe stock decrement via trigger)
- `carts` — supports both authenticated and guest sessions
- `site_options` — replaces WordPress Customizer (header, footer, homepage config)
- `pages` — JSONB-based page builder content
- `coupons` — percentage or fixed discounts
- `reviews` — with approval workflow

**Security:** Row Level Security (RLS) on all sensitive tables. Customers can only see their own orders.

## UX Builder — Drag & Drop

The Builder system uses a JSON-based block structure stored in `pages.content`:

```json
[
  {
    "type": "hero",
    "props": { "heading": "Summer Sale", "image": "/hero.jpg" }
  },
  {
    "type": "product_grid",
    "props": { "category": "sale", "limit": 8 }
  }
]
```

**Available blocks:**
- `Section`, `Row`, `Column` — layout primitives
- `HeroBanner` — full-width hero with CTA
- `BannerGrid` — multi-column image banners
- `ProductGrid` — auto-fetches products
- `Text`, `Image`, `Button`, `Spacer`

**Why faster than WordPress:**
1. No PHP rendering — React Server Components
2. No database queries per block — JSONB fetched once
3. ISR (Incremental Static Regeneration) — pages cached at edge
4. No plugin overhead — everything is code

## SEO

Every product page automatically generates:
- ✅ Canonical URL
- ✅ OpenGraph tags
- ✅ Twitter Card meta
- ✅ JSON-LD Product Schema
- ✅ Organization Schema
- ✅ Dynamic `<title>` and `<meta description>`

## Performance Targets

| Metric | Target | How |
|--------|--------|-----|
| **LCP** | < 1.2s | next/image with AVIF/WebP, priority loading |
| **CLS** | 0 | Fixed aspect ratios, font-display: swap |
| **FID** | < 100ms | Minimal client JS, React Server Components |
| **TTFB** | < 200ms | ISR + edge caching |

## Deployment

```bash
# Vercel (recommended)
vercel deploy

# Docker
docker build -t nanocms .
docker run -p 3000:3000 nanocms
```

## License

MIT
