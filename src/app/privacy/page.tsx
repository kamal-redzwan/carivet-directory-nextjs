'use client';

import { PageLayout } from '@/components/layout/PageLayout';

export default function PrivacyPolicyPage() {
  return (
    <PageLayout
      title='Privacy Policy - CariVet'
      description='Learn about how CariVet collects, uses, and protects your personal information.'
    >
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h1 className='text-4xl font-bold text-gray-900 mb-8'>
          Privacy Policy
        </h1>

        <div className='prose prose-emerald max-w-none'>
          <p className='text-lg text-gray-600 mb-8'>
            Last updated: March 15, 2024
          </p>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              1. Introduction
            </h2>
            <p className='text-gray-600 mb-4'>
              At CariVet, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our website and services.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              2. Information We Collect
            </h2>
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>
              2.1 Personal Information
            </h3>
            <p className='text-gray-600 mb-4'>
              We may collect personal information that you voluntarily provide
              to us when you:
            </p>
            <ul className='list-disc pl-6 text-gray-600 space-y-2'>
              <li>Create an account</li>
              <li>Search for veterinary clinics</li>
              <li>Contact us</li>
              <li>Subscribe to our newsletter</li>
              <li>Participate in surveys or promotions</li>
            </ul>

            <h3 className='text-xl font-semibold text-gray-900 mb-3 mt-6'>
              2.2 Automatically Collected Information
            </h3>
            <p className='text-gray-600 mb-4'>
              When you visit our website, we automatically collect certain
              information about your device, including:
            </p>
            <ul className='list-disc pl-6 text-gray-600 space-y-2'>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Pages visited</li>
              <li>Time and date of visits</li>
            </ul>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              3. How We Use Your Information
            </h2>
            <p className='text-gray-600 mb-4'>
              We use the information we collect to:
            </p>
            <ul className='list-disc pl-6 text-gray-600 space-y-2'>
              <li>Provide and maintain our services</li>
              <li>Improve user experience</li>
              <li>Send you updates and marketing communications</li>
              <li>Respond to your inquiries</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              4. Information Sharing
            </h2>
            <p className='text-gray-600 mb-4'>
              We may share your information with:
            </p>
            <ul className='list-disc pl-6 text-gray-600 space-y-2'>
              <li>Service providers who assist in our operations</li>
              <li>Veterinary clinics you choose to contact</li>
              <li>Law enforcement when required by law</li>
              <li>Third parties with your consent</li>
            </ul>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              5. Data Security
            </h2>
            <p className='text-gray-600 mb-4'>
              We implement appropriate security measures to protect your
              personal information. However, no method of transmission over the
              internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              6. Your Rights
            </h2>
            <p className='text-gray-600 mb-4'>You have the right to:</p>
            <ul className='list-disc pl-6 text-gray-600 space-y-2'>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to data processing</li>
            </ul>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              7. Cookies
            </h2>
            <p className='text-gray-600 mb-4'>
              We use cookies and similar tracking technologies to improve your
              browsing experience. You can control cookie settings through your
              browser preferences.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              8. Changes to This Policy
            </h2>
            <p className='text-gray-600 mb-4'>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              9. Contact Us
            </h2>
            <p className='text-gray-600 mb-4'>
              If you have any questions about this Privacy Policy, please
              contact us at{' '}
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
              understood this Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
