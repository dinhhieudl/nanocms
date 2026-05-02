import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/builder';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import mockData from '@/lib/supabase/mock-data.json';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const posts = (mockData as any).posts || [];
  const post = posts.find((p: any) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const posts = (mockData as any).posts || [];
  const post = posts.find((p: any) => p.slug === slug);

  if (!post) notFound();

  return (
    <Section className="py-8 md:py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-600 font-medium text-xs">{post.category}</span>
          <Calendar className="h-3.5 w-3.5" />
          <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <User className="h-3.5 w-3.5" />
          <span>{post.author}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold font-display mb-6">{post.title}</h1>

        <div className="relative aspect-[2/1] rounded-2xl overflow-hidden mb-8">
          <Image src={post.image} alt={post.title} fill className="object-cover" />
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed">{post.content}</p>
        </div>
      </div>
    </Section>
  );
}
