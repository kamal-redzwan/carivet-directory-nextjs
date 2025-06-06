'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import {
  PawPrint,
  Facebook,
  Twitter,
  Instagram,
  ArrowLeft,
  Calendar,
  User,
  Clock,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';
import { MDXComponents } from '@/components/MDXComponents';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
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
    }

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

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>
            Error: {error || 'Post not found'}
          </p>
          <Link
            href='/blog'
            className='px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700'
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Header Navigation */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center'>
              <PawPrint className='h-8 w-8 text-emerald-600 mr-2' />
              <span className='text-xl font-bold text-gray-900'>CariVet</span>
            </div>
            <nav className='hidden md:flex space-x-8'>
              <Link href='/' className='text-gray-600 hover:text-emerald-600'>
                Home
              </Link>
              <Link
                href='/clinics'
                className='text-gray-600 hover:text-emerald-600'
              >
                Find Clinics
              </Link>
              <Link
                href='/tips'
                className='text-gray-600 hover:text-emerald-600'
              >
                Pet Care Tips
              </Link>
              <Link
                href='/blog'
                className='text-gray-900 hover:text-emerald-600'
              >
                Blog
              </Link>
              <Link
                href='/about'
                className='text-gray-600 hover:text-emerald-600'
              >
                About
              </Link>
              <Link
                href='/contact'
                className='text-gray-600 hover:text-emerald-600'
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
              <span className='text-sm font-medium text-gray-700'>Share:</span>
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

      {/* Footer */}
      <footer className='bg-emerald-600 text-white py-12 mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {/* CariVet Info */}
            <div>
              <div className='flex items-center mb-4'>
                <PawPrint className='h-6 w-6 mr-2' />
                <span className='text-lg font-bold'>CariVet</span>
              </div>
              <p className='text-emerald-100 text-sm'>
                Helping pet owners in Malaysia find the right veterinary care
                for their beloved animals.
              </p>
              <div className='flex space-x-4 mt-4'>
                <Facebook className='h-5 w-5 text-emerald-200 hover:text-white cursor-pointer' />
                <Twitter className='h-5 w-5 text-emerald-200 hover:text-white cursor-pointer' />
                <Instagram className='h-5 w-5 text-emerald-200 hover:text-white cursor-pointer' />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
              <ul className='space-y-2 text-emerald-100'>
                <li>
                  <Link href='/' className='hover:text-white'>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href='/clinics' className='hover:text-white'>
                    Find Clinics
                  </Link>
                </li>
                <li>
                  <Link href='/tips' className='hover:text-white'>
                    Pet Care Tips
                  </Link>
                </li>
                <li>
                  <Link href='/blog' className='hover:text-white'>
                    Veterinary Blog
                  </Link>
                </li>
                <li>
                  <Link href='/about' className='hover:text-white'>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href='/contact' className='hover:text-white'>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Resources</h4>
              <ul className='space-y-2 text-emerald-100'>
                <li>
                  <Link href='/tips' className='hover:text-white'>
                    Pet Care Tips
                  </Link>
                </li>
                <li>
                  <Link href='/blog' className='hover:text-white'>
                    Veterinary Blog
                  </Link>
                </li>
                <li>
                  <Link href='/emergency' className='hover:text-white'>
                    Emergency Services
                  </Link>
                </li>
                <li>
                  <Link href='/add-clinic' className='hover:text-white'>
                    Add Your Clinic
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Legal</h4>
              <ul className='space-y-2 text-emerald-100'>
                <li>
                  <Link href='/privacy' className='hover:text-white'>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href='/terms' className='hover:text-white'>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href='/cookies' className='hover:text-white'>
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-emerald-500 mt-8 pt-8 text-center text-emerald-100'>
            <p>&copy; 2025 CariVet Malaysia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
