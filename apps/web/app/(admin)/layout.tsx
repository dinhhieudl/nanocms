'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Package, ShoppingCart, Tag, Settings, Menu, X, ChevronLeft } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Coupons', href: '/coupons', icon: Tag },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 btn-icon bg-white shadow-md lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50 w-64 bg-gray-900 text-white p-4 transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between mb-8 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold">
              Nano<span className="text-brand-400">Admin</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
