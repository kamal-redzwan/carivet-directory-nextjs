'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';
import { HeroPageLayout } from '@/components/layout/PageLayout';
import { SimpleHero } from '@/components/layout/HeroSection';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    agreeToPrivacy: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <HeroPageLayout
      title='Contact Us - CariVet'
      description='Get in touch with CariVet for questions, suggestions, or feedback about our veterinary directory service.'
      noPadding
    >
      {/* Hero Section */}
      <SimpleHero
        title='Contact Us'
        subtitle="Have questions, suggestions, or feedback? We'd love to hear from you!"
        size='md'
      />

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Form */}
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* First Name */}
              <div>
                <label
                  htmlFor='firstName'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  First Name
                </label>
                <input
                  type='text'
                  id='firstName'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor='lastName'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Last Name
                </label>
                <input
                  type='text'
                  id='lastName'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Phone
                </label>
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor='subject'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Subject
                </label>
                <select
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                  required
                >
                  <option value=''>Select a subject</option>
                  <option value='general'>General Inquiry</option>
                  <option value='clinic-listing'>Clinic Listing</option>
                  <option value='technical-support'>Technical Support</option>
                  <option value='partnership'>Partnership</option>
                  <option value='feedback'>Feedback</option>
                  <option value='other'>Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor='message'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Message
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-vertical'
                  required
                />
              </div>

              {/* Privacy Agreement */}
              <div className='flex items-start gap-3'>
                <input
                  type='checkbox'
                  id='agreeToPrivacy'
                  name='agreeToPrivacy'
                  checked={formData.agreeToPrivacy}
                  onChange={handleInputChange}
                  className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-1'
                  required
                />
                <label
                  htmlFor='agreeToPrivacy'
                  className='text-sm text-gray-600'
                >
                  I have read and agree to the{' '}
                  <Link
                    href='/privacy'
                    className='text-emerald-600 hover:text-emerald-700 underline'
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                className='w-full bg-emerald-600 text-white py-3 px-6 rounded-md hover:bg-emerald-700 transition-colors font-medium'
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className='space-y-8'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Contact Information
              </h2>

              <div className='space-y-6'>
                {/* Our Office */}
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <MapPin className='h-6 w-6 text-emerald-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1'>
                      Our Office
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      123 Jalan Bukit Bintang
                      <br />
                      Kuala Lumpur, 50200
                      <br />
                      Malaysia
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <Phone className='h-6 w-6 text-emerald-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1'>Phone</h3>
                    <p className='text-gray-600 text-sm'>+603 1234 5678</p>
                  </div>
                </div>

                {/* Email */}
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <Mail className='h-6 w-6 text-emerald-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1'>Email</h3>
                    <p className='text-gray-600 text-sm'>contact@carivet.my</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <Clock className='h-6 w-6 text-emerald-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1'>
                      Business Hours
                    </h3>
                    <div className='text-gray-600 text-sm space-y-1'>
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </HeroPageLayout>
  );
}
