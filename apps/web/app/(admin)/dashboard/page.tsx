'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentProducts: any[];
  recentOrders: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentProducts: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products?limit=5'),
        fetch('/api/orders?limit=5'),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      const products = productsData.products || [];
      const orders = ordersData.orders || [];

      setStats({
        totalProducts: productsData.pagination?.total || products.length,
        totalOrders: ordersData.pagination?.total || orders.length,
        totalRevenue: orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
        recentProducts: products.slice(0, 5),
        recentOrders: orders.slice(0, 5),
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, change: '+12%', up: true },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, change: '+8%', up: true },
    {
      label: 'Revenue',
      value: stats.totalRevenue > 0 ? formatPrice(stats.totalRevenue) : '0₫',
      icon: DollarSign,
      change: '+23%',
      up: true,
    },
    { label: 'Conversion', value: '3.2%', icon: TrendingUp, change: '-0.5%', up: false },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s your store overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="btn-secondary gap-2 text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <select className="input-field w-auto text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This month</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, change, up }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                <Icon className="h-5 w-5 text-brand-600" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-green-600' : 'text-red-500'}`}>
                {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold">{loading ? '—' : value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Recent Products</h2>
          <Link href="/products" className="text-sm text-brand-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3"><div className="h-4 w-32 skeleton" /></td>
                    <td className="py-3"><div className="h-4 w-20 skeleton" /></td>
                    <td className="py-3"><div className="h-4 w-16 skeleton" /></td>
                    <td className="py-3"><div className="h-4 w-10 skeleton" /></td>
                    <td className="py-3"><div className="h-4 w-14 skeleton" /></td>
                  </tr>
                ))
              ) : stats.recentProducts.length > 0 ? (
                stats.recentProducts.map((product: any) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{product.name}</td>
                    <td className="py-3 text-gray-500">{product.category_name || '—'}</td>
                    <td className="py-3">
                      {product.sale_price ? (
                        <span>
                          <span className="text-brand-600 font-medium">{formatPrice(product.sale_price)}</span>
                          <span className="text-gray-400 line-through ml-2">{formatPrice(product.price)}</span>
                        </span>
                      ) : (
                        <span>{formatPrice(product.price)}</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={product.stock < 20 ? 'text-orange-500' : 'text-gray-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-6 text-center text-gray-400">No products yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders */}
      {stats.recentOrders.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Recent Orders</h2>
            <Link href="/orders" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 font-mono text-brand-600">{order.order_number}</td>
                    <td className="py-3">{order.shipping_address?.full_name || 'Guest'}</td>
                    <td className="py-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
