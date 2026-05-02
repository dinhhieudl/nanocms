import Link from 'next/link';
import { Section } from '@/components/builder';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <Section className="py-20">
      <div className="text-center max-w-md mx-auto">
        <p className="text-8xl font-bold text-brand-600 mb-4">404</p>
        <h1 className="text-2xl font-bold font-display mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link href="/collections" className="btn-secondary gap-2">
            <Search className="h-4 w-4" />
            Browse Products
          </Link>
        </div>
      </div>
    </Section>
  );
}
