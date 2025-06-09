'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import {
  PawPrint,
  Facebook,
  Twitter,
  ArrowLeft,
  Calendar,
  User,
  Clock,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';
import { MDXComponents } from '@/components/MDXComponents';
import { AsyncPageLayout } from '@/components/layout/PageLayout';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPost = async () => {
    try {
      setLoading(true);
      console.log('Loading post with slug:', params.slug);

      const response = await fetch(`/api/blog/posts/${params.slug}`);
      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || 'Post not found');
      }

      const postData = await response.json();
      console.log('Post data received:', postData.title);
      setPost(postData);

      // Serialize MDX content
      console.log('Serializing MDX content...');
      const mdxSource = await serialize(postData.content);
      console.log('MDX serialization complete');
      setMdxSource(mdxSource);
    } catch (err) {
      console.error('Error loading post:', err);
      setError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.slug) {
      loadPost();
    }
  }, [params.slug]);

  const handleShare = (platform: string) => {
    if (!post) return;

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <AsyncPageLayout
      title='Blog Post - CariVet'
      description='Read the latest pet care tips and veterinary advice'
      maxWidth='7xl'
      loadingVariant='skeleton'
      noPadding={true}
      loading={loading}
      error={error}
      onRetry={() => {
        if (params.slug) {
          loadPost();
        }
      }}
    >
      {post && (
        <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Back to Blog Link */}
          <div className='mb-6'>
            <Link
              href='/blog'
              className='inline-flex items-center text-emerald-600 hover:text-emerald-700'
            >
              <ArrowLeft size={16} className='mr-1' />
              Back to Blog
            </Link>
          </div>

          <article className='prose prose-gray max-w-none'>
            <header className='mb-8'>
              <div className='mb-4'>
                <span
                  className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${post.categoryColor}`}
                >
                  {post.category}
                </span>
              </div>

              <h1 className='text-4xl font-bold text-gray-900 mb-4 leading-tight'>
                {post.title}
              </h1>

              <div className='flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6'>
                <div className='flex items-center gap-2'>
                  <Calendar size={16} />
                  <span>{post.date}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <User size={16} />
                  <span>{post.author}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Clock size={16} />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className='flex items-center gap-3 mb-8 pb-8 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-700'>
                  Share:
                </span>
                <button
                  onClick={() => handleShare('facebook')}
                  className='flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors'
                >
                  <Facebook size={14} />
                  Facebook
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className='flex items-center gap-2 px-3 py-2 bg-sky-500 text-white text-sm rounded hover:bg-sky-600 transition-colors'
                >
                  <Twitter size={14} />
                  Twitter
                </button>
              </div>
            </header>

            {/* Featured Image Placeholder */}
            <div className='w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-8'>
              <div className='text-center text-gray-400'>
                <PawPrint size={48} className='mx-auto mb-2' />
                <span className='text-sm'>Article Featured Image</span>
              </div>
            </div>

            {/* MDX Content */}
            <div className='prose prose-gray max-w-none'>
              {mdxSource && (
                <MDXRemote {...mdxSource} components={MDXComponents} />
              )}
            </div>

            {/* Call to Action */}
            <div className='bg-emerald-50 p-6 rounded-lg mb-8 text-center'>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Need veterinary care for your pet?
              </h3>
              <p className='text-gray-600 mb-4'>
                Find trusted veterinary clinics across Malaysia
              </p>
              <Link
                href='/clinics'
                className='inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors'
              >
                Find Veterinary Clinics
                <ChevronRight size={16} />
              </Link>
            </div>
          </article>
        </main>
      )}
    </AsyncPageLayout>
  );
}
