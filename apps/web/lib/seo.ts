import type { Metadata } from 'next';
import type { Product } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nanocms.example.com';
const SITE_NAME = 'NanoCommerce';

export function generateProductMetadata(product: Product): Metadata {
  const title = product.seo_title || `${product.name} | ${SITE_NAME}`;
  const description =
    product.seo_desc ||
    product.short_desc ||
    product.description?.slice(0, 155) ||
    `Buy ${product.name} at ${SITE_NAME}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/product/${product.slug}`,
      siteName: SITE_NAME,
      images: product.images?.length
        ? [{ url: product.images[0], width: 1200, height: 630, alt: product.name }]
        : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/product/${product.slug}`,
    },
  };
}

export function generateProductJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.short_desc,
    image: product.images,
    sku: product.sku,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: 'VND',
      price: product.sale_price || product.price,
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    ...(product as any).avg_rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (product as any).avg_rating,
        reviewCount: (product as any).review_count || 0,
      },
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
  };
}
