'use client';

import { useState, useEffect } from 'react';
import { Plus, Tag, Copy, RefreshCw, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      // The mock client doesn't have a separate coupons API, so we import directly
      const mockData = (await import('@/lib/supabase/mock-data')).default;
      setCoupons((mockData as any).coupons || []);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Coupons</h1>
          <p className="text-sm text-gray-500 mt-1">{coupons.length} coupons</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchCoupons} disabled={loading} className="btn-secondary gap-2 text-sm">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="btn-primary gap-2">
            <Plus className="h-4 w-4" />
            Create Coupon
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card">
              <div className="h-6 w-32 skeleton mb-3" />
              <div className="h-4 w-48 skeleton mb-2" />
              <div className="h-3 w-24 skeleton" />
            </div>
          ))}
        </div>
      ) : coupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon: any) => (
            <div key={coupon.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-lg">{coupon.code}</span>
                      <button
                        onClick={() => copyCode(coupon.code, coupon.id)}
                        className="text-gray-400 hover:text-brand-600 transition-colors"
                        title="Copy code"
                      >
                        {copiedId === coupon.id ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      {coupon.type === 'percentage'
                        ? `${coupon.value}% off`
                        : formatPrice(coupon.value) + ' off'}
                      {coupon.min_order > 0 && ` · Min: ${formatPrice(coupon.min_order)}`}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {coupon.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>Used: {coupon.used_count}/{coupon.max_uses || '∞'}</span>
                <span>Expires: {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}</span>
              </div>
              {coupon.max_uses && (
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (coupon.used_count / coupon.max_uses) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Tag className="h-12 w-12 mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500">No coupons yet. Create one to get started.</p>
        </div>
      )}
    </div>
  );
}
