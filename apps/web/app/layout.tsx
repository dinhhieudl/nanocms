import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { generateOrganizationJsonLd } from '@/lib/seo';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'NanoCommerce', template: '%s | NanoCommerce' },
  description: 'Fast, beautiful, customizable e-commerce.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nanocms.example.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationJsonLd()) }}
        />
      </head>
      <body className="min-h-screen bg-white">
        <Header />
        <main className="pt-[var(--header-height)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container-shop py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <span className="text-xl font-bold font-display">
              Nano<span className="text-brand-600">Commerce</span>
            </span>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Fast. Beautiful. Yours.<br />
              Built with Next.js & Supabase.
            </p>
          </div>
          {[
            {
              title: 'Shop',
              links: [
                { label: 'All Products', href: '/collections' },
                { label: 'New Arrivals', href: '/collections/new' },
                { label: 'Sale', href: '/collections/sale' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Blog', href: '/blog' },
              ],
            },
            {
              title: 'Support',
              links: [
                { label: 'FAQ', href: '/faq' },
                { label: 'Shipping', href: '/shipping' },
                { label: 'Returns', href: '/returns' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-gray-500 hover:text-brand-600 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} NanoCommerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
