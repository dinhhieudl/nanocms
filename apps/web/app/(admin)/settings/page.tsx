import { Store, Globe, Palette, Bell } from 'lucide-react';

export const metadata = {
  title: 'Settings — Admin',
};

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-display mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Store info */}
        <div className="card">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <Store className="h-5 w-5 text-brand-600" />
            Store Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Store Name</label>
              <input type="text" defaultValue="NanoCommerce" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Store Email</label>
              <input type="email" defaultValue="hello@nanocms.example.com" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
              <input type="tel" defaultValue="+84 901 234 567" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Currency</label>
              <select className="input-field">
                <option>VND (₫)</option>
                <option>USD ($)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
              <input type="text" defaultValue="123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" className="input-field" />
            </div>
          </div>
        </div>

        {/* Domain */}
        <div className="card">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <Globe className="h-5 w-5 text-brand-600" />
            Domain & SEO
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Site URL</label>
              <input type="url" defaultValue="https://nanocms.example.com" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Meta Title</label>
              <input type="text" defaultValue="NanoCommerce — Fast, Beautiful, Yours" className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Meta Description</label>
              <textarea defaultValue="Premium clothing and accessories. 10x faster than WordPress." className="input-field min-h-[80px]" />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="card">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <Palette className="h-5 w-5 text-brand-600" />
            Appearance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Brand Color</label>
              <div className="flex items-center gap-3">
                <input type="color" defaultValue="#de5f52" className="w-10 h-10 rounded-lg cursor-pointer" />
                <input type="text" defaultValue="#de5f52" className="input-field flex-1" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Logo</label>
              <input type="file" className="input-field" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h2 className="flex items-center gap-2 font-bold mb-4">
            <Bell className="h-5 w-5 text-brand-600" />
            Notifications
          </h2>
          <div className="space-y-3">
            {[
              { label: 'New order notifications', desc: 'Get notified when a new order is placed', checked: true },
              { label: 'Low stock alerts', desc: 'Alert when product stock falls below 10', checked: true },
              { label: 'Customer reviews', desc: 'Notify when a new review is submitted', checked: false },
            ].map(({ label, desc, checked }) => (
              <label key={label} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <input type="checkbox" defaultChecked={checked} className="w-5 h-5 rounded text-brand-600" />
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="btn-secondary">Cancel</button>
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
