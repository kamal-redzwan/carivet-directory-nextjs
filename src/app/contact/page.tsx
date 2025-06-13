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
      // In production, send to API endpoint
      // For now, simulate API call
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
      />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Form */}
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Send us a Message
            </h2>

            <form className='space-y-6' onSubmit={form.handleSubmit}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  label='First Name'
                  type='text'
                  placeholder='John'
                  value={form.values.firstName}
                  onChange={(value) => form.handleChange('firstName', value)}
                  onBlur={() => form.handleBlur('firstName')}
                  error={form.errors.firstName}
                  required
                />

                <FormField
                  label='Last Name'
                  type='text'
                  placeholder='Doe'
                  value={form.values.lastName}
                  onChange={(value) => form.handleChange('lastName', value)}
                  onBlur={() => form.handleBlur('lastName')}
                  error={form.errors.lastName}
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  label='Email Address'
                  type='email'
                  placeholder='john@example.com'
                  value={form.values.email}
                  onChange={(value) => form.handleChange('email', value)}
                  onBlur={() => form.handleBlur('email')}
                  error={form.errors.email}
                  required
                />

                <FormField
                  label='Phone Number'
                  type='tel'
                  placeholder='01X-XXX XXXX'
                  value={form.values.phone}
                  onChange={(value) => form.handleChange('phone', value)}
                  onBlur={() => form.handleBlur('phone')}
                  error={form.errors.phone}
                  description='Optional'
                />
              </div>

              <SelectField
                label='Subject'
                options={subjectOptions}
                value={form.values.subject}
                onChange={(value) => form.handleChange('subject', value)}
                onBlur={() => form.handleBlur('subject')}
                error={form.errors.subject}
                placeholder='Select a subject'
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
                    <p className='text-gray-600 text-sm'>
                      <a
                        href='tel:+60312345678'
                        className='hover:text-emerald-600 transition-colors'
                      >
                        +60 3-1234 5678
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <Mail className='h-6 w-6 text-emerald-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1'>Email</h3>
                    <p className='text-gray-600 text-sm'>
                      <a
                        href='mailto:hello@carivet.my'
                        className='hover:text-emerald-600 transition-colors'
                      >
                        hello@carivet.my
                      </a>
                    </p>
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
                      <p>Saturday: 9:00 AM - 1:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Frequently Asked Questions
              </h2>

              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-gray-900 mb-2'>
                    How do I list my veterinary clinic?
                  </h4>
                  <p className='text-gray-600 text-sm'>
                    You can submit your clinic information through our contact
                    form by selecting "Clinic Listing" as the subject. We'll
                    review your submission and get back to you within 2-3
                    business days.
                  </p>
                </div>

                <div>
                  <h4 className='font-semibold text-gray-900 mb-2'>
                    Is CariVet free to use?
                  </h4>
                  <p className='text-gray-600 text-sm'>
                    Yes! CariVet is completely free for pet owners to search and
                    find veterinary clinics. We believe in making veterinary
                    care accessible to all pet owners in Malaysia.
                  </p>
                </div>

                <div>
                  <h4 className='font-semibold text-gray-900 mb-2'>
                    How often is the information updated?
                  </h4>
                  <p className='text-gray-600 text-sm'>
                    We continuously update our database with the latest
                    information from veterinary clinics. If you notice any
                    outdated information, please let us know through our contact
                    form.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroPageLayout>
  );
}
