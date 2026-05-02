import { createClient } from '@/lib/supabase/server';
import { Section } from '@/components/builder';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: productCount }, { count: orderCount }, { data: recentOrders }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: 'Products', value: productCount || 0, icon: Package, color: 'bg-blue-500' },
    { label: 'Orders', value: orderCount || 0, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Revenue', value: '₫0', icon: DollarSign, color: 'bg-amber-500' },
    { label: 'Customers', value: 0, icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div className="ml-64 p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border bg-white p-6 flex items-center gap-4">
            <div className={`${color} p-3 rounded-xl text-white`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3">Order</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {(recentOrders || []).map((order: any) => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="py-3 font-medium">{order.order_number}</td>
                <td className="py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                    {order.status}
                  </span>
                </td>
                <td className="py-3">{order.total?.toLocaleString()}₫</td>
                <td className="py-3 text-gray-400">
                  {new Date(order.created_at).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
            {(!recentOrders || recentOrders.length === 0) && (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
