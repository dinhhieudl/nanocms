'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { cn, formatPrice, getDiscountPercent } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'wide';
  index?: number;
}

export function ProductCard({ product, variant = 'default', index = 0 }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const discount = getDiscountPercent(product.price, product.sale_price);
  const effectivePrice = product.sale_price || product.price;
  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: effectivePrice,
      image: product.images?.[0],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image container */}
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl bg-gray-50',
            variant === 'wide' ? 'aspect-[4/3]' : 'aspect-[3/4]'
          )}
        >
          {/* Main image */}
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <ShoppingBag className="h-12 w-12" />
            </div>
          )}

          {/* Hover image (2nd image) */}
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} - alternate`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="inline-flex items-center rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                -{discount}%
              </span>
            )}
            {product.is_featured && (
              <span className="inline-flex items-center rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                Hot
              </span>
            )}
            {isOutOfStock && (
              <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-1 text-xs font-bold text-white">
                Sold Out
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <button
              className="btn-icon bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:text-brand-600"
              aria-label="Add to wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>
            {!isOutOfStock && (
              <button
                onClick={handleQuickAdd}
                className="btn-icon bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:text-brand-600"
                aria-label="Quick add to cart"
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick add bar at bottom */}
          {!isOutOfStock && (
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleQuickAdd}
                className="w-full rounded-full bg-brand-600/95 backdrop-blur-sm py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-brand-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 space-y-1.5 px-1">
          {/* Category */}
          {product.category_name && (
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {product.category_name}
            </p>
          )}

          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.avg_rating !== undefined && product.avg_rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-3.5 w-3.5',
                      star <= Math.round(product.avg_rating!)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">({product.review_count})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900">
              {formatPrice(effectivePrice)}
            </span>
            {product.sale_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Color swatches preview */}
          {product.attributes?.some((a) => a.name === 'Color') && (
            <div className="flex gap-1 pt-1">
              {product.attributes
                .find((a) => a.name === 'Color')
                ?.values.slice(0, 5)
                .map((color) => (
                  <span
                    key={color}
                    className="h-4 w-4 rounded-full border border-gray-200 shadow-sm"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Skeleton loader ── */
export function ProductCardSkeleton() {
  return (
    <div className="animate-fade-in">
      <div className="aspect-[3/4] rounded-2xl skeleton" />
      <div className="mt-4 space-y-2 px-1">
        <div className="h-3 w-16 skeleton" />
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-4 w-1/2 skeleton" />
        <div className="h-5 w-20 skeleton" />
      </div>
    </div>
  );
}
