'use client';

import { useState } from 'react';
import { Store, Globe, Palette, Bell, Save, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'NanoCommerce',
    storeEmail: 'hello@nanocms.example.com',
    phone: '+84 901 234 567',
    currency: 'VND',
    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    siteUrl: 'https://nanocms.example.com',
    metaTitle: 'NanoCommerce — Fast, Beautiful, Yours',
    metaDesc: 'Premium clothing and accessories. 10x faster than WordPress.',
    brandColor: '#de5f52',
    notifOrders: true,
    notifLowStock: true,
    notifReviews: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (key: string, value: any) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-display">Settings</h1>
        <button onClick={handleSave} className={`btn-primary gap-2 ${saved ? 'bg-green-600 hover:bg-green-600' : ''}`}>
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

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
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => update('storeName', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Store Email</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => update('storeEmail', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => update('currency', e.target.value)}
                className="input-field"
              >
                <option value="VND">VND (₫)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => update('address', e.target.value)}
                className="input-field"
              />
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
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => update('siteUrl', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Meta Title</label>
              <input
                type="text"
                value={settings.metaTitle}
                onChange={(e) => update('metaTitle', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Meta Description</label>
              <textarea
                value={settings.metaDesc}
                onChange={(e) => update('metaDesc', e.target.value)}
                className="input-field min-h-[80px]"
              />
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
                <input
                  type="color"
                  value={settings.brandColor}
                  onChange={(e) => update('brandColor', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border"
                />
                <input
                  type="text"
                  value={settings.brandColor}
                  onChange={(e) => update('brandColor', e.target.value)}
                  className="input-field flex-1 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Logo</label>
              <input type="file" accept="image/*" className="input-field" />
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
              { key: 'notifOrders', label: 'New order notifications', desc: 'Get notified when a new order is placed' },
              { key: 'notifLowStock', label: 'Low stock alerts', desc: 'Alert when product stock falls below 10' },
              { key: 'notifReviews', label: 'Customer reviews', desc: 'Notify when a new review is submitted' },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={(settings as any)[key]}
                  onChange={(e) => update(key, e.target.checked)}
                  className="w-5 h-5 rounded text-brand-600"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
