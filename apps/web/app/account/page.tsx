import { Section } from '@/components/builder';
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'My Account',
};

export default function AccountPage() {
  return (
    <Section className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-display mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <nav className="space-y-1">
            {[
              { icon: User, label: 'Profile', href: '/account', active: true },
              { icon: Package, label: 'Orders', href: '/account/orders' },
              { icon: Heart, label: 'Wishlist', href: '/account/wishlist' },
              { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
            ].map(({ icon: Icon, label, href, active }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full">
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </nav>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="card">
              <h2 className="font-bold mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                  <input type="text" defaultValue="" placeholder="Your name" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                  <input type="email" defaultValue="" placeholder="email@example.com" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                  <input type="tel" defaultValue="" placeholder="0901234567" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Avatar</label>
                  <input type="file" className="input-field" />
                </div>
              </div>
              <button className="btn-primary mt-6">Save Changes</button>
            </div>

            <div className="card mt-6">
              <h2 className="font-bold mb-4">Change Password</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Current Password</label>
                  <input type="password" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
                  <input type="password" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</label>
                  <input type="password" className="input-field" />
                </div>
                <button className="btn-secondary">Update Password</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
