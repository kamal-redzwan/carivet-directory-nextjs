'use client';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function PrivacyPolicyPage() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Header Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className='bg-emerald-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Privacy Policy</h1>
          <p className='text-emerald-100'>Last Updated: May 20, 2023</p>
        </div>
      </section>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='prose prose-gray max-w-none'>
          {/* Introduction */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Introduction
            </h2>
            <p className='text-gray-600 leading-relaxed mb-4'>
              CariVet (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when
              you visit our website carivet.my, including any other media form,
              media channel, mobile website, or mobile application related or
              connected thereto (collectively, the &quot;Site&quot;).
            </p>
            <p className='text-gray-600 leading-relaxed'>
              Please read this Privacy Policy carefully. If you do not agree
              with the terms of this Privacy Policy, please do not access the
              Site.
            </p>
          </section>

          {/* Information We Collect */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Information We Collect
            </h2>
            <p className='text-gray-600 leading-relaxed mb-6'>
              We may collect information about you in a variety of ways. The
              information we may collect on the Site includes:
            </p>

            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Personal Data
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  Personally identifiable information, such as your name, email
                  address, telephone number, and demographic information, such
                  as your age, gender, hometown, and interests, that you
                  voluntarily give to us when you register with the Site, make a
                  purchase, sign up for our newsletter, or when you choose to
                  participate in various activities related to the Site. You are
                  under no obligation to provide us with personal information of
                  any kind; however, your refusal to do so may prevent you from
                  using certain features of the Site.
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Derivative Data
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  Information our servers automatically collect when you access
                  the Site, such as your IP address, your browser type, your
                  operating system, your access times, and the pages you have
                  viewed directly before and after accessing the Site.
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Financial Data
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  Financial information, such as data related to your payment
                  method (e.g., valid credit card number, card brand, expiration
                  date) that we may collect when you purchase, order, return,
                  exchange, or request information about our services from the
                  Site.
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Mobile Device Data
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  Device information, such as your mobile device ID, model, and
                  manufacturer, and information about the location of your
                  device, if you access the Site from a mobile device.
                </p>
              </div>
            </div>
          </section>

          {/* Use of Your Information */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Use of Your Information
            </h2>
            <p className='text-gray-600 leading-relaxed mb-4'>
              Having accurate information about you permits us to provide you
              with a smooth, efficient, and customized experience. Specifically,
              we may use information collected about you via the Site to:
            </p>
            <ul className='space-y-2 text-gray-600'>
              <li>• Create and manage your account.</li>
              <li>• Email you regarding your account or order.</li>
              <li>
                • Fulfill and manage purchases, orders, payments, and other
                transactions related to the Site.
              </li>
              <li>
                • Generate a personal profile about you to make future visits to
                the Site more personalized.
              </li>
              <li>• Increase the efficiency and operation of the Site.</li>
              <li>
                • Monitor and analyze usage and trends to improve your
                experience with the Site.
              </li>
              <li>• Notify you of updates to the Site.</li>
              <li>
                • Offer new products, services, and/or recommendations to you.
              </li>
              <li>• Perform other business activities as needed.</li>
              <li>
                • Prevent fraudulent transactions, monitor against theft, and
                protect against criminal activity.
              </li>
              <li>• Process payments and refunds.</li>
              <li>
                • Request feedback and contact you about your use of the Site.
              </li>
              <li>• Resolve disputes and troubleshoot problems.</li>
              <li>• Respond to product and customer service requests.</li>
              <li>• Send you a newsletter.</li>
            </ul>
          </section>

          {/* Disclosure of Your Information */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Disclosure of Your Information
            </h2>
            <p className='text-gray-600 leading-relaxed mb-6'>
              We may share information we have collected about you in certain
              situations. Your information may be disclosed as follows:
            </p>

            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  By Law or to Protect Rights
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  If we believe the release of information about you is
                  necessary to respond to legal process, to investigate or
                  remedy potential violations of our policies, or to protect the
                  rights, property, and safety of others, we may share your
                  information as permitted or required by any applicable law,
                  rule, or regulation.
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Third-Party Service Providers
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  We may share your information with third parties that perform
                  services for us or on our behalf, including payment
                  processing, data analysis, email delivery, hosting services,
                  customer service, and marketing assistance.
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Marketing Communications
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  With your consent, or with an opportunity for you to withdraw
                  consent, we may share your information with third parties for
                  marketing purposes, as permitted by law.
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Interactions with Other Users
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  If you interact with other users of the Site, those users may
                  see your name, profile photo, and descriptions of your
                  activity.
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Online Postings
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  When you post comments, contributions or other content to the
                  Site, your posts may be viewed by all users and may be
                  publicly distributed outside the Site in perpetuity.
                </p>
              </div>
            </div>
          </section>

          {/* Security of Your Information */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Security of Your Information
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              We use administrative, technical, and physical security measures
              to help protect your personal information. While we have taken
              reasonable steps to secure the personal information you provide to
              us, please be aware that despite our efforts, no security measures
              are perfect or impenetrable, and no method of data transmission
              can be guaranteed against any interception or other type of
              misuse.
            </p>
          </section>

          {/* Policy for Children */}
          <section className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Policy for Children
            </h2>
            <p className='text-gray-600 leading-relaxed'>
              We do not knowingly solicit information from or market to children
              under the age of 13. If you become aware of any data we have
              collected from children under age 13, please contact us using the
              contact information provided below.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Contact Us
            </h2>
            <p className='text-gray-600 leading-relaxed mb-4'>
              If you have questions or comments about this Privacy Policy,
              please contact us at:
            </p>
            <div className='text-gray-600 space-y-1'>
              <p>
                <strong>CariVet</strong>
              </p>
              <p>123 Jalan Bukit Bintang</p>
              <p>Kuala Lumpur, 50200</p>
              <p>Malaysia</p>
              <p>Email: privacy@carivet.my</p>
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
