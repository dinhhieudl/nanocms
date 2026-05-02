import Link from 'next/link';
import Image from 'next/image';
import { Section, SectionHeading } from '@/components/builder';
import { Calendar, ArrowRight } from 'lucide-react';
import mockData from '@/lib/supabase/mock-data.json';

export const metadata = {
  title: 'Blog',
  description: 'Style guides, trends, and stories from NanoCommerce.',
};

export default function BlogPage() {
  const posts = (mockData as any).posts || [];

  return (
    <Section className="py-12 md:py-20">
      <SectionHeading title="Blog" subtitle="Style guides, trends, and stories" />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group card overflow-hidden p-0"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-600 font-medium">{post.category}</span>
                <Calendar className="h-3 w-3" />
                <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h3 className="font-bold group-hover:text-brand-600 transition-colors line-clamp-2">{post.title}</h3>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-600 font-medium">
                Read more <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
