'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FilterProps {
  categories: { id: string; name: string; slug: string }[];
  activeCategory?: string;
  activeSort?: string;
  searchQuery?: string;
}

export function CollectionsFilter({ categories, activeCategory, activeSort = 'newest', searchQuery }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchQuery || '');
  const [showFilters, setShowFilters] = useState(false);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/collections?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', search || null);
  };

  return (
    <div className="space-y-4">
      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-11 pr-10"
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); updateParam('search', null); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <div className="flex gap-2">
          <select
            value={activeSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="input-field w-auto pr-8"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="popular">Most Popular</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn('btn-secondary gap-2', showFilters && 'bg-gray-100')}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParam('category', null)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-all border',
            !activeCategory
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateParam('category', cat.slug)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all border',
              activeCategory === cat.slug
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Price filter (expandable) */}
      {showFilters && (
        <div className="card flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Min Price</label>
            <input
              type="number"
              placeholder="0"
              defaultValue={searchParams.get('minPrice') || ''}
              onBlur={(e) => updateParam('minPrice', e.target.value || null)}
              className="input-field w-32"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Max Price</label>
            <input
              type="number"
              placeholder="∞"
              defaultValue={searchParams.get('maxPrice') || ''}
              onBlur={(e) => updateParam('maxPrice', e.target.value || null)}
              className="input-field w-32"
            />
          </div>
          <button
            onClick={() => {
              router.push('/collections');
            }}
            className="text-sm text-brand-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
