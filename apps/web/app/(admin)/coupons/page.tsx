import { Plus, Tag, Copy } from 'lucide-react';
import mockData from '@/lib/supabase/mock-data.json';

export const metadata = {
  title: 'Coupons — Admin',
};

export default function AdminCouponsPage() {
  const coupons = (mockData as any).coupons || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Coupons</h1>
          <p className="text-sm text-gray-500 mt-1">{coupons.length} coupons</p>
        </div>
        <button className="btn-primary gap-2">
          <Plus className="h-4 w-4" />
          Create Coupon
        </button>
      </div>

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
                    <button className="text-gray-400 hover:text-brand-600" title="Copy">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {coupon.type === 'percentage' ? `${coupon.value}% off` : `${coupon.value.toLocaleString()}₫ off`}
                    {coupon.min_order > 0 && ` · Min: ${coupon.min_order.toLocaleString()}₫`}
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
    </div>
  );
}
