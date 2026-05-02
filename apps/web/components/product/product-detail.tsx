'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Truck, Shield, RotateCcw, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatPrice, getDiscountPercent } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import type { Product, ProductVariant, Attribute } from '@/lib/types';

interface ProductDetailProps {
  product: Product;
  variants?: ProductVariant[];
}

export function ProductDetail({ product, variants = [] }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);

  const discount = getDiscountPercent(product.price, product.sale_price);
  const effectivePrice = product.sale_price || product.price;
  const isOutOfStock = product.stock <= 0;

  // Find matching variant
  const matchedVariant = variants.find((v) =>
    Object.entries(selectedAttrs).every(([k, val]) => v.attributes[k] === val)
  );
  const currentPrice = matchedVariant?.price || effectivePrice;
  const currentStock = matchedVariant?.stock ?? product.stock;

  const handleAttrSelect = (attrName: string, value: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [attrName]: value }));
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: matchedVariant?.id,
      name: product.name,
      price: currentPrice,
      quantity,
      image: product.images?.[0],
      attributes: Object.keys(selectedAttrs).length > 0 ? selectedAttrs : undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* ── Gallery ── */}
      <div className="space-y-4">
        {/* Main image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-full"
            >
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={`${product.name} - Image ${selectedImage + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-200">
                  <span className="text-6xl">📷</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          {product.images?.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage((i) => (i === 0 ? product.images.length - 1 : i - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 btn-icon bg-white/80 backdrop-blur-sm shadow-md"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSelectedImage((i) => (i === product.images.length - 1 ? 0 : i + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 btn-icon bg-white/80 backdrop-blur-sm shadow-md"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-4 left-4 rounded-full bg-brand-600 px-3 py-1.5 text-sm font-bold text-white">
              -{discount}%
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {product.images?.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  'relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all',
                  selectedImage === i ? 'border-brand-600 ring-2 ring-brand-200' : 'border-transparent hover:border-gray-300'
                )}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col">
        {/* Breadcrumb */}
        {product.category_name && (
          <p className="text-sm text-gray-400 mb-2">
            <a href="/collections" className="hover:text-brand-600">Shop</a>
            {' / '}
            <a href={`/collections/${product.category_slug}`} className="hover:text-brand-600">
              {product.category_name}
            </a>
          </p>
        )}

        <h1 className="text-2xl md:text-3xl font-bold font-display">{product.name}</h1>

        {/* Rating */}
        {product.avg_rating !== undefined && product.avg_rating > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn('h-4 w-4', s <= Math.round(product.avg_rating!) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.avg_rating?.toFixed(1)} ({product.review_count} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3 mt-4">
          <span className="text-3xl font-bold text-gray-900">{formatPrice(currentPrice)}</span>
          {product.sale_price && (
            <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Short description */}
        {product.short_desc && (
          <p className="mt-4 text-gray-600 leading-relaxed">{product.short_desc}</p>
        )}

        {/* Attributes / Variants */}
        {product.attributes?.map((attr) => (
          <div key={attr.name} className="mt-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              {attr.name}: <span className="font-normal text-gray-500">{selectedAttrs[attr.name] || 'Select'}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {attr.values.map((value) => {
                const isSelected = selectedAttrs[attr.name] === value;
                const isColor = attr.name.toLowerCase() === 'color';
                const variantAvailable = !variants.length || variants.some(
                  (v) => v.attributes[attr.name] === value && v.stock > 0
                );

                return (
                  <button
                    key={value}
                    onClick={() => handleAttrSelect(attr.name, value)}
                    disabled={!variantAvailable}
                    className={cn(
                      'transition-all',
                      isColor
                        ? cn(
                            'h-10 w-10 rounded-full border-2',
                            isSelected ? 'border-brand-600 ring-2 ring-brand-200' : 'border-gray-200 hover:border-gray-400',
                            !variantAvailable && 'opacity-30'
                          )
                        : cn(
                            'rounded-full px-4 py-2 text-sm font-medium border',
                            isSelected
                              ? 'border-brand-600 bg-brand-50 text-brand-700'
                              : 'border-gray-200 text-gray-700 hover:border-gray-400',
                            !variantAvailable && 'opacity-30 line-through'
                          )
                    )}
                    style={isColor ? { backgroundColor: value.toLowerCase() } : undefined}
                    title={value}
                  >
                    {!isColor && value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quantity + Add to Cart */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center rounded-full border border-gray-200">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-3 text-gray-500 hover:text-gray-900"
              disabled={isOutOfStock}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
              className="p-3 text-gray-500 hover:text-gray-900"
              disabled={isOutOfStock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn-primary flex-1 text-base py-4"
          >
            {isOutOfStock ? 'Out of Stock' : `Add to Cart — ${formatPrice(currentPrice * quantity)}`}
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-8">
          {[
            { icon: Truck, label: 'Free Shipping', desc: 'Orders over 500k' },
            { icon: Shield, label: 'Secure Payment', desc: 'SSL encrypted' },
            { icon: RotateCcw, label: '30-Day Return', desc: 'Easy returns' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="text-center">
              <Icon className="h-6 w-6 mx-auto text-gray-400" />
              <p className="mt-1 text-xs font-semibold text-gray-700">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-8 border-t pt-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Description</h3>
            <div className="prose prose-sm prose-gray max-w-none">
              {product.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
