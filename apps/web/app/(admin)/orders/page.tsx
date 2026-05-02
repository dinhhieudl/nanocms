import { Search, Eye, Package } from 'lucide-react';
import mockData from '@/lib/supabase/mock-data.json';

export const metadata = {
  title: 'Orders — Admin',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

const paymentColors: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function AdminOrdersPage() {
  const orders = (mockData as any).orders || [];

  // Generate sample orders for demo
  const sampleOrders = orders.length > 0 ? orders : [
    { id: '1', order_number: '#NC-00001', status: 'delivered', total: 948000, payment_status: 'paid', payment_method: 'COD', created_at: '2026-04-28T10:00:00Z', line_items: [{ name: 'Classic Cotton Tee', qty: 2 }], shipping_address: { full_name: 'Nguyễn Văn A', city: 'TP. HCM' } },
    { id: '2', order_number: '#NC-00002', status: 'shipped', total: 699000, payment_status: 'paid', payment_method: 'Bank Transfer', created_at: '2026-04-29T14:30:00Z', line_items: [{ name: 'Urban Oversized Hoodie', qty: 1 }], shipping_address: { full_name: 'Trần Thị B', city: 'Hà Nội' } },
    { id: '3', order_number: '#NC-00003', status: 'processing', total: 448000, payment_status: 'unpaid', payment_method: 'COD', created_at: '2026-04-30T09:15:00Z', line_items: [{ name: 'Minimal Canvas Tote', qty: 1 }, { name: 'Essential Crew Socks', qty: 1 }], shipping_address: { full_name: 'Lê Văn C', city: 'Đà Nẵng' } },
    { id: '4', order_number: '#NC-00004', status: 'pending', total: 1398000, payment_status: 'unpaid', payment_method: 'COD', created_at: '2026-05-01T16:45:00Z', line_items: [{ name: 'Urban Oversized Hoodie', qty: 2 }], shipping_address: { full_name: 'Phạm Thị D', city: 'TP. HCM' } },
    { id: '5', order_number: '#NC-00005', status: 'cancelled', total: 299000, payment_status: 'refunded', payment_method: 'Bank Transfer', created_at: '2026-04-25T11:20:00Z', line_items: [{ name: 'Classic Cotton Tee', qty: 1 }], shipping_address: { full_name: 'Hoàng Văn E', city: 'Cần Thơ' } },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{sampleOrders.length} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by order # or customer..." className="input-field pl-10" />
          </div>
          <select className="input-field w-auto">
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleOrders.map((order: any) => (
                <tr key={order.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-brand-600">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{order.shipping_address?.full_name || 'Guest'}</p>
                      <p className="text-xs text-gray-400">{order.shipping_address?.city || ''}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.line_items?.length || 0} item{(order.line_items?.length || 0) > 1 ? 's' : ''}
                  </td>
                  <td className="px-4 py-3 font-medium">{order.total?.toLocaleString()}₫</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentColors[order.payment_status] || 'bg-gray-100 text-gray-500'}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-500'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="btn-icon" title="View">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
