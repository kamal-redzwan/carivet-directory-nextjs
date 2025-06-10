'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { SimpleHero } from '@/components/layout/HeroSection';

export default function TermsOfServicePage() {
  return (
    <PageLayout
      title='Terms of Service - CariVet'
      description='Read our terms of service to understand the rules and guidelines for using CariVet.'
      noPadding
    >
      {/* Hero Section */}
      <SimpleHero
        title='Terms of Service'
        subtitle='Please read these terms carefully before using our services'
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
              Welcome to CariVet. These Terms of Service (&quot;Terms&quot;)
              govern your use of our website and services. By accessing or using
              CariVet, you agree to be bound by these Terms.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              2. Definitions
            </h2>
            <ul className='list-disc pl-6 text-gray-600 space-y-2'>
              <li>
                &quot;Service&quot; refers to the CariVet website and all
                related services.
              </li>
              <li>
                &quot;User&quot; refers to any individual or entity that uses
                our Service.
              </li>
              <li>
                &quot;Content&quot; refers to any information, text, graphics,
                or other materials uploaded, downloaded, or appearing on the
                Service.
              </li>
            </ul>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              3. User Accounts
            </h2>
            <p className='text-gray-600 mb-4'>
              To access certain features of the Service, you may be required to
              create an account. You are responsible for maintaining the
              confidentiality of your account information and for all activities
              that occur under your account.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              4. User Conduct
            </h2>
            <p className='text-gray-600 mb-4'>You agree not to:</p>
            <ul className='list-disc pl-6 text-gray-600 space-y-2'>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Post false or misleading information</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Interfere with or disrupt the Service</li>
            </ul>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              5. Intellectual Property
            </h2>
            <p className='text-gray-600 mb-4'>
              The Service and its original content, features, and functionality
              are owned by CariVet and are protected by international copyright,
              trademark, and other intellectual property laws.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              6. Limitation of Liability
            </h2>
            <p className='text-gray-600 mb-4'>
              CariVet shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of or
              inability to use the Service.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              7. Changes to Terms
            </h2>
            <p className='text-gray-600 mb-4'>
              We reserve the right to modify these Terms at any time. We will
              notify users of any material changes by posting the new Terms on
              this page.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              8. Contact Information
            </h2>
            <p className='text-gray-600 mb-4'>
              If you have any questions about these Terms, please contact us at{' '}
              <a
                href='mailto:contact@carivet.my'
                className='text-emerald-600 hover:text-emerald-700'
              >
                contact@carivet.my
              </a>
              .
            </p>
          </section>

          <div className='border-t border-gray-200 pt-8 mt-8'>
            <p className='text-sm text-gray-500'>
              By using CariVet, you acknowledge that you have read and
              understood these Terms of Service and agree to be bound by them.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
