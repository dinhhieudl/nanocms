// Generate 50 products + 10 blog posts for NanoCommerce
const categories = [
  { id: 'cat-1', name: 'T-Shirts', slug: 't-shirts', description: 'Premium cotton tees' },
  { id: 'cat-2', name: 'Hoodies', slug: 'hoodies', description: 'Warm heavyweight hoodies' },
  { id: 'cat-3', name: 'Jackets', slug: 'jackets', description: 'Outerwear for all seasons' },
  { id: 'cat-4', name: 'Pants', slug: 'pants', description: 'Comfort meets style' },
  { id: 'cat-5', name: 'Accessories', slug: 'accessories', description: 'Complete your look' },
  { id: 'cat-6', name: 'Sneakers', slug: 'sneakers', description: 'Step up your game' },
];

const tshirtNames = [
  'Classic Crew Tee', 'Vintage Wash Tee', 'Oversized Boxy Tee', 'Striped Breton Tee',
  'Pocket Detail Tee', 'Heavyweight Beefy Tee', 'Relaxed Linen Tee', 'Organic Essential Tee',
  'Tie-Dye Festival Tee', 'Minimal Logo Tee', 'Washed Denim Tee', 'Color Block Tee',
  'Abstract Print Tee', 'Gradient Fade Tee', 'Ringer Retro Tee', 'Camp Collar Tee',
  'Curved Hem Tee', 'Muscle Fit Tee', 'Terry Loopback Tee', 'Slub Texture Tee',
];

const hoodieNames = [
  'Urban Oversized Hoodie', 'Zip-Up Tech Hoodie', 'Cropped Boxy Hoodie', 'Heavyweight 400GSM Hoodie',
  'Tie-Dye Pullover', 'Minimal Embroidered Hoodie', 'Varsity Letter Hoodie', 'Color Block Hoodie',
  'Sherpa Lined Hoodie', 'Windbreaker Hoodie', 'Pocket Front Hoodie', 'Acid Wash Hoodie',
];

const jacketNames = [
  'Varsity Bomber Jacket', 'Canvas Work Jacket', 'Quilted Liner Jacket', 'Denim Trucker Jacket',
  'Windbreaker Anorak', 'Coach Jacket', 'Puffer Vest', 'Rain Shell Jacket',
];

const pantsNames = [
  'Relaxed Chino Pants', 'Cargo Utility Pants', 'Drawstring Joggers', 'Wide Leg Trousers',
  'Tapered Sweatpants', 'Linen Beach Pants', 'Tech Parachute Pants',
];

const accessoryNames = [
  'Canvas Tote Bag', 'Crew Socks 3-Pack', 'Baseball Cap', 'Beanie Knit Hat',
  'Leather Card Holder', 'Bandana Print Scarf',
];

const sneakerNames = [
  'Retro Low-Top Sneaker', 'Minimal White Trainer', 'Suede Classic Runner', 'Canvas High-Top',
];

const allProductTemplates = [
  ...tshirtNames.map((name, i) => ({ name, category: categories[0], basePrice: 249000 + (i * 10000) })),
  ...hoodieNames.map((name, i) => ({ name, category: categories[1], basePrice: 599000 + (i * 20000) })),
  ...jacketNames.map((name, i) => ({ name, category: categories[2], basePrice: 799000 + (i * 30000) })),
  ...pantsNames.map((name, i) => ({ name, category: categories[3], basePrice: 399000 + (i * 15000) })),
  ...accessoryNames.map((name, i) => ({ name, category: categories[4], basePrice: 99000 + (i * 20000) })),
  ...sneakerNames.map((name, i) => ({ name, category: categories[5], basePrice: 1290000 + (i * 100000) })),
];

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const colors = ['White', 'Black', 'Navy', 'Gray', 'Olive', 'Cream', 'Burgundy', 'Forest Green'];
const images = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&h=800&fit=crop',
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const products = allProductTemplates.slice(0, 50).map((tpl, i) => {
  const hasSale = i % 4 === 0;
  const salePrice = hasSale ? Math.round(tpl.basePrice * 0.8) : null;
  const catSizes = tpl.category.slug === 'accessories' ? ['One Size'] : pickRandom(sizes, 3 + (i % 3));
  const catColors = tpl.category.slug === 'sneakers' ? pickRandom(colors, 2) : pickRandom(colors, 3 + (i % 4));
  const imgIndex = i % images.length;

  return {
    id: `prod-${i + 1}`,
    name: tpl.name,
    slug: slugify(tpl.name),
    description: `Premium quality ${tpl.name.toLowerCase()} crafted with attention to detail. Made from the finest materials for lasting comfort and style. Perfect for everyday wear.`,
    short_desc: `Premium ${tpl.name.toLowerCase()} with modern fit.`,
    price: tpl.basePrice,
    sale_price: salePrice,
    sku: `NC-${tpl.category.slug.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
    stock: 10 + (i * 3) % 90,
    weight: 0.3 + (i % 5) * 0.1,
    attributes: [
      ...(catSizes.length > 1 ? [{ name: 'Size', values: catSizes }] : []),
      { name: 'Color', values: catColors },
    ],
    images: [
      images[imgIndex],
      images[(imgIndex + 1) % images.length],
    ],
    category_id: tpl.category.id,
    category_name: tpl.category.name,
    category_slug: tpl.category.slug,
    is_active: true,
    is_featured: i < 8,
    seo_title: `${tpl.name} | NanoCommerce`,
    seo_desc: `Shop ${tpl.name} at NanoCommerce. Free shipping on orders over 500k₫.`,
    avg_rating: 3.5 + (i % 3) * 0.5,
    review_count: 5 + (i * 7) % 50,
    effective_price: salePrice || tpl.basePrice,
    created_at: new Date(Date.now() - (50 - i) * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  };
});

const posts = [
  {
    id: 'post-1', title: 'Top 10 Outfit Ideas for Summer 2026', slug: 'summer-outfit-ideas-2026',
    excerpt: 'Discover the hottest outfit combinations for this summer season.',
    content: 'Summer is here and it is time to refresh your wardrobe. From breezy linen shirts to lightweight cargo pants, we have compiled the best outfit ideas...',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop',
    category: 'Style Guide', author: 'Nano Team', created_at: '2026-04-28T10:00:00Z',
  },
  {
    id: 'post-2', title: 'How to Style Oversized Hoodies', slug: 'style-oversized-hoodies',
    excerpt: 'Master the oversized hoodie look with these simple tips.',
    content: 'Oversized hoodies are not just for lazy days. Pair them with slim-fit jeans and chunky sneakers for an effortless streetwear look...',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=500&fit=crop',
    category: 'Streetwear', author: 'Style Team', created_at: '2026-04-25T10:00:00Z',
  },
  {
    id: 'post-3', title: 'The Ultimate Sneaker Care Guide', slug: 'sneaker-care-guide',
    excerpt: 'Keep your kicks fresh with our comprehensive care guide.',
    content: 'Your sneakers deserve the best care. From cleaning suede to protecting white leather, here is everything you need to know...',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=500&fit=crop',
    category: 'Care Tips', author: 'Nano Team', created_at: '2026-04-20T10:00:00Z',
  },
  {
    id: 'post-4', title: 'Sustainable Fashion: Our Organic Cotton Journey', slug: 'sustainable-organic-cotton',
    excerpt: 'Why we switched to 100% organic cotton and what it means for you.',
    content: 'Sustainability is at the core of everything we do. Our organic cotton is sourced from certified farms that prioritize soil health...',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=500&fit=crop',
    category: 'Sustainability', author: 'Eco Team', created_at: '2026-04-15T10:00:00Z',
  },
  {
    id: 'post-5', title: '5 Ways to Layer Like a Pro', slug: 'layering-guide',
    excerpt: 'Master the art of layering for any season.',
    content: 'Layering is the key to versatile dressing. Start with a base tee, add a flannel shirt, top with a bomber jacket...',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=500&fit=crop',
    category: 'Style Guide', author: 'Style Team', created_at: '2026-04-10T10:00:00Z',
  },
  {
    id: 'post-6', title: 'Behind the Scenes: Our Factory Tour', slug: 'factory-tour',
    excerpt: 'Take a look behind the curtain at how our products are made.',
    content: 'We believe in transparency. Last month we visited our manufacturing partner in Ho Chi Minh City to ensure fair wages...',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=500&fit=crop',
    category: 'Behind the Brand', author: 'Nano Team', created_at: '2026-04-05T10:00:00Z',
  },
  {
    id: 'post-7', title: 'Streetwear Trends to Watch in 2026', slug: 'streetwear-trends-2026',
    excerpt: 'From tech-wear to gorpcore, here is what is trending.',
    content: 'The streetwear scene continues to evolve. This year we are seeing a blend of technical fabrics with classic silhouettes...',
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&h=500&fit=crop',
    category: 'Streetwear', author: 'Style Team', created_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'post-8', title: 'Color Theory: How to Match Your Outfit', slug: 'color-theory-matching',
    excerpt: 'Learn the basics of color theory to elevate your style.',
    content: 'Understanding color theory can transform your outfits. Complementary colors create bold looks, while analogous colors offer subtle harmony...',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=500&fit=crop',
    category: 'Style Guide', author: 'Style Team', created_at: '2026-03-25T10:00:00Z',
  },
  {
    id: 'post-9', title: 'NanoCommerce x Local Artists: Limited Edition Drop', slug: 'local-artists-collab',
    excerpt: 'Introducing our exclusive collaboration with Vietnamese artists.',
    content: 'We are proud to announce our collaboration with 5 local artists from Hanoi and Ho Chi Minh City. Each piece features unique artwork...',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop',
    category: 'Collaborations', author: 'Nano Team', created_at: '2026-03-20T10:00:00Z',
  },
  {
    id: 'post-10', title: 'Customer Spotlight: Real People, Real Style', slug: 'customer-spotlight',
    excerpt: 'See how our community styles their NanoCommerce pieces.',
    content: 'Our customers are our biggest inspiration. This month we feature 10 customers who shared their unique styling of our products...',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=500&fit=crop',
    category: 'Community', author: 'Community Team', created_at: '2026-03-15T10:00:00Z',
  },
];

const siteOptions = [
  {
    key: 'header',
    value: {
      logo_url: '/images/logo.svg',
      sticky: true,
      transparent: false,
      nav_items: [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/collections' },
        { label: 'Blog', href: '/blog' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
      cta: { label: 'Cart', href: '/cart', icon: 'shopping-bag' },
    },
  },
  {
    key: 'footer',
    value: {
      columns: [
        { title: 'Shop', links: [{ label: 'All Products', href: '/collections' }, { label: 'New Arrivals', href: '/collections/new' }, { label: 'Sale', href: '/collections/sale' }] },
        { title: 'Company', links: [{ label: 'About Us', href: '/about' }, { label: 'Blog', href: '/blog' }, { label: 'Contact', href: '/contact' }] },
        { title: 'Support', links: [{ label: 'FAQ', href: '/faq' }, { label: 'Shipping', href: '/shipping' }, { label: 'Returns', href: '/returns' }] },
      ],
      copyright: '© 2026 NanoCommerce. All rights reserved.',
      social: {},
    },
  },
  {
    key: 'homepage',
    value: {
      sections: [
        { type: 'hero', data: { heading: 'Summer Collection 2026', subheading: 'Breathable fabrics. Bold colors. Effortless style.', cta_label: 'Shop Now', cta_href: '/collections', image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=700&fit=crop' } },
        { type: 'featured_products', data: { title: 'Featured Products', limit: 8 } },
        { type: 'banner_grid', data: { banners: [
          { image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=450&fit=crop', href: '/collections/sneakers', label: 'New Sneakers' },
          { image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=450&fit=crop', href: '/collections/sale', label: 'Up to 20% Off' },
        ] } },
      ],
    },
  },
];

const mockData = {
  categories,
  products,
  product_variants: products.flatMap((p) => {
    const sizes = p.attributes.find((a: any) => a.name === 'Size')?.values || ['One Size'];
    const colors = p.attributes.find((a: any) => a.name === 'Color')?.values || ['Default'];
    return sizes.flatMap((size: string) =>
      colors.map((color: string) => ({
        id: `var-${p.id}-${size}-${color}`.toLowerCase(),
        product_id: p.id,
        sku: `${p.sku}-${size}-${color}`.toUpperCase().replace(/\s/g, ''),
        attributes: { Size: size, Color: color },
        price: null,
        stock: Math.floor(Math.random() * 20) + 5,
        image_url: null,
        is_active: true,
      }))
    );
  }),
  posts,
  site_options: siteOptions,
  orders: [],
  carts: [],
  coupons: [
    { id: 'coup-1', code: 'WELCOME10', type: 'percentage', value: 10, min_order: 200000, max_uses: 100, used_count: 12, starts_at: '2026-01-01', expires_at: '2026-12-31', is_active: true },
    { id: 'coup-2', code: 'SALE50K', type: 'fixed', value: 50000, min_order: 500000, max_uses: 50, used_count: 5, starts_at: '2026-01-01', expires_at: '2026-06-30', is_active: true },
  ],
  reviews: [],
  pages: [],
};

export default mockData;
