'use client';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { PawPrint, Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Header Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className='bg-emerald-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Cookie Policy</h1>
          <p className='text-emerald-100'>Last Updated: May 20, 2023</p>
        </div>
      </section>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='prose prose-gray max-w-none'>
          {/* What Are Cookies */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              What Are Cookies
            </h2>
            <p className='text-gray-600 leading-relaxed mb-4'>
              As is common practice with almost all professional websites,
              CariVet (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) uses
              cookies, which are tiny files that are downloaded to your device,
              to improve your experience.
            </p>
            <p className='text-gray-600 leading-relaxed'>
              This page describes what information they gather, how we use it,
              and why we sometimes need to store these cookies. We will also
              share how you can prevent these cookies from being stored;
              however, this may downgrade or &apos;break&apos; certain elements
              of the site&apos;s functionality.
            </p>
          </section>

          {/* How We Use Cookies */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              How We Use Cookies
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              We use cookies for a variety of reasons detailed below.
              Unfortunately, in most cases, there are no industry standard
              options for disabling cookies without completely disabling the
              functionality and features they add to this site. It is
              recommended that you leave on all cookies if you are not sure
              whether you need them or not in case they are used to provide a
              service that you use.
            </p>
          </section>

          {/* The Cookies We Set */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              The Cookies We Set
            </h2>

            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Account related cookies
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  If you create an account with us, we will use cookies for the
                  management of the signup process and general administration.
                  These cookies will usually be deleted when you log out;
                  however, in some cases, they may remain afterward to remember
                  your site preferences when logged out.
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Login related cookies
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  We use cookies when you are logged in so that we can remember
                  this fact. This prevents you from having to log in every
                  single time you visit a new page. These cookies are typically
                  removed or cleared when you log out to ensure that you can
                  only access restricted features and areas when logged in.
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Forms related cookies
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  When you submit data to us through a form such as those found
                  on contact pages or comment forms, cookies may be set to
                  remember your user details for future correspondence.
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Site preferences cookies
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  In order to provide you with a great experience on this site,
                  we provide the functionality to set your preferences for how
                  this site runs when you use it. In order to remember your
                  preferences, we need to set cookies so that this information
                  can be called whenever you interact with a page that is
                  affected by your preferences.
                </p>
              </div>
            </div>
          </section>

          {/* Third Party Cookies */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Third Party Cookies
            </h2>
            <p className='text-gray-600 leading-relaxed mb-6'>
              In some special cases, we also use cookies provided by trusted
              third parties. The following section details which third party
              cookies you might encounter through this site.
            </p>

            <div className='space-y-6'>
              <div>
                <p className='text-gray-600 leading-relaxed'>
                  • This site uses Google Analytics which is one of the most
                  widespread and trusted analytics solutions on the web for
                  helping us to understand how you use the site and ways that we
                  can improve your experience. These cookies may track things
                  such as how long you spend on the site and the pages that you
                  visit so we can continue to produce engaging content.
                </p>
              </div>

              <div>
                <p className='text-gray-600 leading-relaxed'>
                  • From time to time we test new features and make subtle
                  changes to the way that the site is delivered. When we are
                  still testing new features, these cookies may be used to
                  ensure that you receive a consistent experience whilst on the
                  site whilst ensuring we understand which optimizations our
                  users appreciate the most.
                </p>
              </div>

              <div>
                <p className='text-gray-600 leading-relaxed'>
                  • We also use social media buttons and/or plugins on this site
                  that allow you to connect with your social network in various
                  ways. For these to work, social media sites including
                  Facebook, Twitter, Instagram, and LinkedIn, will set cookies
                  through our site which may be used to enhance your profile on
                  their site or contribute to the data they hold for various
                  purposes outlined in their respective privacy policies.
                </p>
              </div>
            </div>
          </section>

          {/* More Information */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              More Information
            </h2>
            <p className='text-gray-600 leading-relaxed mb-4'>
              Hopefully, that has clarified things for you and as was previously
              mentioned if there is something that you aren&apos;t sure whether
              you need or not it&apos;s usually safer to leave cookies enabled
              in case it does interact with one of the features you use on our
              site.
            </p>
            <p className='text-gray-600 leading-relaxed mb-6'>
              However, if you are still looking for more information, you can
              contact us through one of our preferred contact methods:
            </p>
            <div className='text-gray-600 space-y-1'>
              <p>Email: cookies@carivet.my</p>
              <p>Phone: +60312345678</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
