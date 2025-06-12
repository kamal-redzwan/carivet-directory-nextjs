'use client';

import { HeroPageLayout } from '@/components/layout/PageLayout';
import { SimpleHero } from '@/components/layout/HeroSection';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import {
  FormField,
  SelectField,
  TextareaField,
  CheckboxField,
} from '@/components/common/FormField';
import { SubmitButton } from '@/components/ui/button';
import { FormLoading } from '@/components/ui/LoadingComponents';
import { useForm } from '@/hooks/useForm';
import { contactFormSchema } from '@/utils/validators';
import Link from 'next/link';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  agreeToPrivacy: boolean;
}

const initialValues: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  agreeToPrivacy: false,
};

const subjectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'clinic-listing', label: 'Clinic Listing' },
  { value: 'technical-support', label: 'Technical Support' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' },
];

export default function ContactUsPage() {
  const form = useForm({
    initialValues,
    validationSchema: contactFormSchema,
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form on success
      form.resetForm();
    },
  });

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

            <form onSubmit={form.handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  label='First Name'
                  type='text'
                  placeholder='Enter your first name'
                  value={form.values.firstName}
                  onChange={(value) => form.handleChange('firstName', value)}
                  onBlur={() => form.handleBlur('firstName')}
                  error={form.errors.firstName}
                  required
                />

                <FormField
                  label='Last Name'
                  type='text'
                  placeholder='Enter your last name'
                  value={form.values.lastName}
                  onChange={(value) => form.handleChange('lastName', value)}
                  onBlur={() => form.handleBlur('lastName')}
                  error={form.errors.lastName}
                  required
                />
              </div>

              <FormField
                label='Email Address'
                type='email'
                placeholder='your.email@example.com'
                value={form.values.email}
                onChange={(value) => form.handleChange('email', value)}
                onBlur={() => form.handleBlur('email')}
                error={form.errors.email}
                required
              />

              <FormField
                label='Phone Number'
                type='tel'
                placeholder='+60 3-1234 5678'
                value={form.values.phone}
                onChange={(value) => form.handleChange('phone', value)}
                onBlur={() => form.handleBlur('phone')}
                error={form.errors.phone}
                description='Optional - we may call you for follow-up'
              />

              <SelectField
                label='Subject'
                placeholder='Select a subject'
                value={form.values.subject}
                onChange={(value) => form.handleChange('subject', value)}
                options={subjectOptions}
                error={form.errors.subject}
                required
              />

              <TextareaField
                label='Message'
                placeholder='Tell us how we can help you...'
                value={form.values.message}
                onChange={(value) => form.handleChange('message', value)}
                onBlur={() => form.handleBlur('message')}
                error={form.errors.message}
                rows={6}
                required
                description='Please provide as much detail as possible'
              />

              <CheckboxField
                checked={form.values.agreeToPrivacy}
                onChange={(checked) =>
                  form.handleChange('agreeToPrivacy', checked)
                }
                error={form.errors.agreeToPrivacy}
                required
              >
                I have read and agree to the{' '}
                <Link
                  href='/privacy'
                  className='text-emerald-600 hover:text-emerald-700 underline'
                >
                  Privacy Policy
                </Link>
              </CheckboxField>

              <SubmitButton
                fullWidth
                size='lg'
                loading={form.loading}
                disabled={!form.isValid}
              >
                {form.loading ? 'Sending...' : 'Send Message'}
              </SubmitButton>

              {/* Form Status */}
              <FormLoading
                loading={form.loading}
                success={
                  !form.loading &&
                  Object.keys(form.errors).length === 0 &&
                  form.touched.firstName
                }
                error={null}
                successMessage="Message sent successfully! We'll get back to you soon."
              />
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
