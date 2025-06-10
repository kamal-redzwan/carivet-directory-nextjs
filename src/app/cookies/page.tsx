'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { SimpleHero } from '@/components/layout/HeroSection';

export default function CookiePolicyPage() {
  return (
    <PageLayout
      title='Cookie Policy - CariVet'
      description='Learn about how CariVet uses cookies and similar technologies to improve your browsing experience.'
      noPadding
    >
      {/* Hero Section */}
      <SimpleHero
        title='Cookie Policy'
        subtitle='Understanding how we use cookies to improve your experience'
        size='sm'
        bgColor='bg-gray-800'
      />

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='prose prose-emerald max-w-none'>
          <p className='text-lg text-gray-600 mb-8'>
            Last updated: March 15, 2024
          </p>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              1. Introduction
            </h2>
            <p className='text-gray-600 mb-4'>
              This Cookie Policy explains how CariVet uses cookies and similar
              technologies to recognize you when you visit our website. It
              explains what these technologies are and why we use them, as well
              as your rights to control our use of them.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              2. What are Cookies?
            </h2>
            <p className='text-gray-600 mb-4'>
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. Cookies are widely used by
              website owners to make their websites work, or to work more
              efficiently, as well as to provide reporting information.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              3. Types of Cookies We Use
            </h2>
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>
              3.1 Essential Cookies
            </h3>
            <p className='text-gray-600 mb-4'>
              These cookies are necessary for the website to function properly.
              They enable basic functions like page navigation and access to
              secure areas of the website.
            </p>

            <h3 className='text-xl font-semibold text-gray-900 mb-3 mt-6'>
              3.2 Performance Cookies
            </h3>
            <p className='text-gray-600 mb-4'>
              These cookies help us understand how visitors interact with our
              website by collecting and reporting information anonymously.
            </p>

            <h3 className='text-xl font-semibold text-gray-900 mb-3 mt-6'>
              3.3 Functionality Cookies
            </h3>
            <p className='text-gray-600 mb-4'>
              These cookies allow the website to remember choices you make and
              provide enhanced, more personal features.
            </p>

            <h3 className='text-xl font-semibold text-gray-900 mb-3 mt-6'>
              3.4 Targeting Cookies
            </h3>
            <p className='text-gray-600 mb-4'>
              These cookies are used to track visitors across websites. The
              intention is to display ads that are relevant and engaging for the
              individual user.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              4. How to Control Cookies
            </h2>
            <p className='text-gray-600 mb-4'>
              You can control and/or delete cookies as you wish. You can delete
              all cookies that are already on your computer and you can set most
              browsers to prevent them from being placed. If you do this,
              however, you may have to manually adjust some preferences every
              time you visit a site and some services and functionalities may
              not work.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              5. Changes to This Policy
            </h2>
            <p className='text-gray-600 mb-4'>
              We may update this Cookie Policy from time to time. We will notify
              you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              6. Contact Us
            </h2>
            <p className='text-gray-600 mb-4'>
              If you have any questions about this Cookie Policy, please contact
              us at{' '}
              <a
                href='mailto:privacy@carivet.my'
                className='text-emerald-600 hover:text-emerald-700'
              >
                privacy@carivet.my
              </a>
              .
            </p>
          </section>

          <div className='border-t border-gray-200 pt-8 mt-8'>
            <p className='text-sm text-gray-500'>
              By using CariVet, you acknowledge that you have read and
              understood this Cookie Policy and agree to its terms.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
