'use client';

import {
  PawPrint,
  Facebook,
  Twitter,
  Instagram,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BlogPost } from '@/lib/blog';
import { Navbar } from '@/components/layout/Navbar';

export default function VeterinaryBlogPage() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogPosts() {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();
        setFeaturedPosts(data.featuredPosts || []);
        setLatestPosts(data.latestPosts || []);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBlogPosts();
  }, []);

  // Fallback data for when MDX posts aren't loaded yet
  const fallbackFeaturedArticles = [
    {
      slug: 'understanding-vaccinations',
      title: 'Understanding Vaccinations: A Guide for Pet Owners',
      excerpt:
        'Learn about essential vaccinations for dogs and cats, when they should be administered, and why they&apos;re crucial for your pet&apos;s health.',
      category: 'Preventive Care',
      categoryColor: 'bg-emerald-100 text-emerald-800',
      date: 'May 15, 2023',
      author: 'CariVet Editorial Team',
      readTime: '5 min read',
    },
    {
      slug: 'dental-health-pets',
      title: 'Dental Health in Pets: More Important Than You Think',
      excerpt:
        'Discover why dental care is vital for your pet&apos;s overall health and learn practical tips for maintaining good oral hygiene at home.',
      category: 'Wellness',
      categoryColor: 'bg-blue-100 text-blue-800',
      date: 'April 28, 2023',
      author: 'CariVet Editorial Team',
      readTime: '4 min read',
    },
  ];

  const fallbackLatestArticles = [
    {
      slug: 'cat-pain-signs',
      title: 'Recognizing Signs of Pain in Cats: What to Look For',
      excerpt:
        'Cats are masters at hiding pain. Learn the subtle signs that might indicate your feline friend is suffering and when to seek veterinary care.',
      category: 'Feline Health',
      categoryColor: 'bg-purple-100 text-purple-800',
      date: 'April 10, 2023',
      author: 'CariVet Editorial Team',
      readTime: '6 min read',
    },
    {
      slug: 'senior-dog-nutrition',
      title: 'Nutrition for Senior Dogs: Adapting to Changing Needs',
      excerpt:
        'As dogs age, their nutritional requirements change. Find out how to adjust your senior dog&apos;s diet to support their health in their golden years.',
      category: 'Nutrition',
      categoryColor: 'bg-orange-100 text-orange-800',
      date: 'March 22, 2023',
      author: 'CariVet Editorial Team',
      readTime: '7 min read',
    },
    {
      slug: 'parasite-prevention',
      title: 'Parasite Prevention: Protecting Your Pet Year-Round',
      excerpt:
        'Learn about common parasites that can affect your pets, their potential health impacts, and effective prevention strategies for all seasons.',
      category: 'Preventive Care',
      categoryColor: 'bg-emerald-100 text-emerald-800',
      date: 'March 8, 2023',
      author: 'CariVet Editorial Team',
      readTime: '5 min read',
    },
    {
      slug: 'pet-anxiety-management',
      title: 'Managing Anxiety in Pets: From Thunderstorms to Separation',
      excerpt:
        'Discover effective strategies to help pets cope with various forms of anxiety, including natural remedies and when to consider professional help.',
      category: 'Behavior',
      categoryColor: 'bg-pink-100 text-pink-800',
      date: 'February 18, 2023',
      author: 'CariVet Editorial Team',
      readTime: '8 min read',
    },
  ];

  const categories = [
    'Preventive Care',
    'Wellness',
    'Feline Health',
    'Nutrition',
    'Behavior',
  ];

  // Use MDX posts if available, otherwise use fallback data
  const displayFeaturedPosts =
    featuredPosts.length > 0 ? featuredPosts : fallbackFeaturedArticles;
  const displayLatestPosts =
    latestPosts.length > 0 ? latestPosts : fallbackLatestArticles;

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Header Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className='bg-emerald-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Veterinary Blog</h1>
          <p className='text-xl text-emerald-100'>
            Expert insights and advice on pet health, wellness, and care
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='flex flex-col lg:flex-row gap-12'>
          {/* Main Content */}
          <div className='lg:w-2/3'>
            {/* Featured Articles */}
            <section className='mb-12'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Featured Articles
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {displayFeaturedPosts.map((article) => (
                  <article
                    key={article.slug}
                    className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow'
                  >
                    {/* Placeholder Image */}
                    <div className='h-48 bg-gray-200 flex items-center justify-center'>
                      <div className='text-center text-gray-400'>
                        <PawPrint size={32} className='mx-auto mb-1' />
                        <span className='text-xs'>Article Image</span>
                      </div>
                    </div>

                    <div className='p-6'>
                      <div className='flex items-center gap-2 mb-3'>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${article.categoryColor}`}
                        >
                          {article.category}
                        </span>
                        <span className='text-gray-500 text-sm'>
                          {article.date}
                        </span>
                      </div>

                      <h3 className='text-lg font-semibold text-gray-900 mb-2 leading-tight'>
                        {article.title}
                      </h3>

                      <p className='text-gray-600 text-sm mb-4 leading-relaxed'>
                        {article.excerpt}
                      </p>

                      <div className='flex justify-between items-center text-sm text-gray-500 mb-4'>
                        <span>By {article.author}</span>
                        <span>{article.readTime}</span>
                      </div>

                      <Link
                        href={`/blog/${article.slug}`}
                        className='inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium text-sm'
                      >
                        Read more
                        <ChevronRight size={14} className='ml-1' />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Latest Articles */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Latest Articles
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                {displayLatestPosts.map((article) => (
                  <article
                    key={article.slug}
                    className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow'
                  >
                    {/* Placeholder Image */}
                    <div className='h-40 bg-gray-200 flex items-center justify-center'>
                      <div className='text-center text-gray-400'>
                        <PawPrint size={28} className='mx-auto mb-1' />
                        <span className='text-xs'>Article Image</span>
                      </div>
                    </div>

                    <div className='p-5'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${article.categoryColor}`}
                        >
                          {article.category}
                        </span>
                        <span className='text-gray-500 text-xs'>
                          {article.date}
                        </span>
                      </div>

                      <h3 className='text-md font-semibold text-gray-900 mb-2 leading-tight'>
                        {article.title}
                      </h3>

                      <p className='text-gray-600 text-xs mb-3 leading-relaxed'>
                        {article.excerpt}
                      </p>

                      <div className='flex justify-between items-center text-xs text-gray-500 mb-3'>
                        <span>By {article.author}</span>
                        <span>{article.readTime}</span>
                      </div>

                      <Link
                        href={`/blog/${article.slug}`}
                        className='inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium text-sm'
                      >
                        Read more
                        <ChevronRight size={14} className='ml-1' />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination - Hidden for now, will add when there are more blog posts */}
              {/* <div className='flex justify-center items-center gap-2'>
                <button className='p-2 text-gray-400 hover:text-gray-600'>
                  <ChevronLeft size={16} />
                  <span className='sr-only'>Previous</span>
                </button>
                <span className='text-gray-500 text-sm'>Previous</span>

                <div className='flex gap-1 mx-4'>
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded text-sm ${
                        currentPage === page
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <span className='text-gray-500 text-sm'>Next</span>
                <button className='p-2 text-gray-600 hover:text-gray-800'>
                  <ChevronRight size={16} />
                  <span className='sr-only'>Next</span>
                </button>
              </div> */}
            </section>
          </div>

          {/* Sidebar */}
          <div className='lg:w-1/3 space-y-8'>
            {/* Categories */}
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Categories
              </h3>
              <ul className='space-y-2'>
                {categories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/blog/category/${category
                        .toLowerCase()
                        .replace(' ', '-')}`}
                      className='text-gray-600 hover:text-emerald-600 text-sm'
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
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
