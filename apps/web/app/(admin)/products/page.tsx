import Link from 'next/link';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import mockData from '@/lib/supabase/mock-data.json';

export const metadata = {
  title: 'Products — Admin',
};

export default function AdminProductsPage() {
  const products = (mockData as any).products || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <button className="btn-primary gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search products..." className="input-field pl-10" />
          </div>
          <select className="input-field w-auto">
            <option>All Categories</option>
            <option>T-Shirts</option>
            <option>Hoodies</option>
            <option>Accessories</option>
          </select>
          <select className="input-field w-auto">
            <option>All Status</option>
            <option>Active</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => (
                <tr key={product.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.sku}</td>
                  <td className="px-4 py-3 text-gray-500">{product.category_name}</td>
                  <td className="px-4 py-3">
                    {product.sale_price ? (
                      <div>
                        <span className="text-brand-600 font-medium">{product.sale_price.toLocaleString()}₫</span>
                        <span className="text-gray-400 line-through text-xs ml-1">{product.price.toLocaleString()}₫</span>
                      </div>
                    ) : (
                      <span>{product.price.toLocaleString()}₫</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.stock < 20 ? 'text-orange-500 font-medium' : 'text-gray-600'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {product.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/product/${product.slug}`} className="btn-icon" title="View">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button className="btn-icon" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="btn-icon text-red-400 hover:text-red-600" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">Showing 1-{products.length} of {products.length}</p>
        <div className="flex gap-1">
          <button className="btn-secondary text-xs px-3 py-1.5" disabled>Previous</button>
          <button className="btn-primary text-xs px-3 py-1.5">1</button>
          <button className="btn-secondary text-xs px-3 py-1.5" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
