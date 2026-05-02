'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/* ── Section Wrapper ── */
export function Section({
  children,
  className,
  bg,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  bg?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn('relative py-16 md:py-24', className)}
      style={bg ? { backgroundColor: bg } : undefined}
    >
      <div className="container-shop">{children}</div>
    </section>
  );
}

/* ── Row (flexbox grid) ── */
export function Row({
  children,
  className,
  cols = 1,
  gap = 6,
}: {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 6;
  gap?: number;
}) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className={cn('grid', colClasses[cols], `gap-${gap}`, className)}>
      {children}
    </div>
  );
}

/* ── Column ── */
export function Column({
  children,
  className,
  span = 1,
}: {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4;
}) {
  return <div className={cn(span > 1 && `col-span-${span}`, className)}>{children}</div>;
}

/* ── Hero Banner ── */
export function HeroBanner({
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  imageUrl,
  align = 'center',
}: {
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  align?: 'left' | 'center' | 'right';
}) {
  const alignClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gray-900 min-h-[500px] md:min-h-[600px] flex">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={heading}
          fill
          priority
          className="object-cover opacity-60"
        />
      )}
      <div className={cn('relative z-10 flex flex-col justify-center p-8 md:p-16 w-full', alignClass[align])}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-white font-display max-w-2xl"
        >
          {heading}
        </motion.h1>
        {subheading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg text-white/80 max-w-xl"
          >
            {subheading}
          </motion.p>
        )}
        {ctaLabel && ctaHref && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <Link href={ctaHref} className="btn-primary text-base px-8 py-4">
              {ctaLabel}
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ── Banner Grid ── */
export function BannerGrid({
  banners,
}: {
  banners: { image: string; href: string; label: string }[];
}) {
  return (
    <div className={cn('grid gap-4', banners.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')}>
      {banners.map((banner, i) => (
        <motion.div
          key={banner.href}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <Link href={banner.href} className="group relative block overflow-hidden rounded-2xl aspect-[4/3]">
            <Image
              src={banner.image}
              alt={banner.label}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-xl font-bold text-white">{banner.label}</h3>
              <span className="mt-2 inline-block text-sm text-white/80 group-hover:text-white transition-colors">
                Shop Now →
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Section Heading ── */
export function SectionHeading({
  title,
  subtitle,
  align = 'center',
}: {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={cn('mb-10', align === 'center' && 'text-center')}>
      <h2 className="text-2xl md:text-3xl font-bold font-display">{title}</h2>
      {subtitle && <p className="mt-2 text-gray-500 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

/* ── Spacer ── */
export function Spacer({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = { sm: 'h-8', md: 'h-16', lg: 'h-24', xl: 'h-32' };
  return <div className={sizes[size]} />;
}
