'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Phone,
  Globe,
  MapPin,
  Mail,
  Check,
  PawPrint,
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface Clinic {
  id: string;
  name: string;
  street?: string;
  city?: string;
  state?: string;
  phone?: string;
  website?: string;
  email?: string;
  facebook_url?: string;
  instagram_url?: string;
  emergency: boolean;
  specializations?: string[];
  [key: string]: unknown;
}

export default function ClinicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      loadClinic(params.id as string);
    }
  }, [params?.id]);

  async function loadClinic(id: string) {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!data) {
        throw new Error('No clinic data found');
      }

      setClinic(data as Clinic);
    } catch (err) {
      console.error('Error in loadClinic:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  const safeGet = <T,>(
    obj: Record<string, unknown>,
    path: string,
    defaultValue: T
  ): T => {
    try {
      return (obj && (obj[path] as T)) || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const formatAddress = () => {
    if (!clinic) return 'Address not available';

    const parts = [
      safeGet<string>(clinic, 'street', ''),
      safeGet<string>(clinic, 'city', ''),
      safeGet<string>(clinic, 'state', ''),
    ].filter((part) => part && part.trim());

    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading clinic details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>Error: {error}</p>
          <button
            onClick={() => router.push('/clinics')}
            className='px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700'
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600 mb-4'>Clinic not found</p>
          <button
            onClick={() => router.push('/clinics')}
            className='px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700'
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Navigation */}
      <Navbar />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Back to Clinics Link */}
        <div className='mb-6'>
          <Link
            href='/clinics'
            className='inline-flex items-center text-emerald-600 hover:text-emerald-700'
          >
            <ArrowLeft size={16} className='mr-1' />
            Back to Clinics
          </Link>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Hero Image */}
            <div className='relative h-64 bg-gray-200 rounded-lg overflow-hidden'>
              <div className='absolute top-4 right-4'>
                {clinic.emergency && (
                  <span className='bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
                    Emergency Services Available
                  </span>
                )}
              </div>
              <div className='h-full flex items-center justify-center'>
                <div className='text-center text-gray-400'>
                  <PawPrint size={64} className='mx-auto mb-2' />
                  <span className='text-lg'>Clinic Image</span>
                </div>
              </div>
            </div>

            {/* Clinic Name and Address */}
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                {safeGet<string>(clinic, 'name', 'Clinic Name')}
              </h1>
              <p className='text-gray-600'>{formatAddress()}</p>
            </div>

            {/* Quick Actions */}
            <div className='flex gap-4'>
              {safeGet<string>(clinic, 'phone', '') && (
                <a
                  href={`tel:${clinic.phone}`}
                  className='inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors'
                >
                  <Phone size={16} />
                  Call Clinic
                </a>
              )}
              {safeGet<string>(clinic, 'website', '') && (
                <a
                  href={clinic.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors'
                >
                  <Globe size={16} />
                  Visit Website
                </a>
              )}
            </div>

            {/* About Section */}
            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                About {safeGet<string>(clinic, 'name', 'This Clinic')}
              </h2>
              <p className='text-gray-600 leading-relaxed'>
                {safeGet<string>(clinic, 'name', 'This clinic')} is a veterinary
                clinic located in{' '}
                {safeGet<string>(clinic, 'city', 'Kuala Lumpur')},{' '}
                {safeGet<string>(clinic, 'state', 'Malaysia')}. They provide
                professional veterinary services for various animals and offer
                specialized care to ensure the health and wellbeing of your
                pets.
              </p>
            </div>

            {/* Services Offered */}
            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Services Offered
              </h2>
              <div className='grid grid-cols-2 gap-4'>
                {/* Default services */}
                <div className='flex items-center gap-2'>
                  <Check size={16} className='text-emerald-600' />
                  <span className='text-gray-700'>Vaccination</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Check size={16} className='text-emerald-600' />
                  <span className='text-gray-700'>Surgery</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Check size={16} className='text-emerald-600' />
                  <span className='text-gray-700'>Dental Care</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Check size={16} className='text-emerald-600' />
                  <span className='text-gray-700'>Grooming</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Check size={16} className='text-emerald-600' />
                  <span className='text-gray-700'>Boarding</span>
                </div>
                {clinic.emergency && (
                  <div className='flex items-center gap-2'>
                    <Check size={16} className='text-emerald-600' />
                    <span className='text-gray-700'>Emergency Care</span>
                  </div>
                )}
              </div>
            </div>

            {/* Specializations */}
            {Array.isArray(clinic.specializations) &&
              clinic.specializations.length > 0 && (
                <div className='bg-white rounded-lg p-6 shadow-sm'>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                    Specializations
                  </h2>
                  <div className='flex flex-wrap gap-2'>
                    {clinic.specializations.map(
                      (spec: string, index: number) => (
                        <span
                          key={index}
                          className='bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm'
                        >
                          {spec}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Animals Treated */}
            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Animals Treated
              </h2>
              <div className='flex flex-wrap gap-2'>
                <span className='bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm'>
                  Dogs
                </span>
                <span className='bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm'>
                  Cats
                </span>
                <span className='bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm'>
                  Birds
                </span>
                <span className='bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm'>
                  Small Mammals
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Operating Hours */}
            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Operating Hours
              </h3>
              <div className='space-y-2'>
                {clinic.hours && typeof clinic.hours === 'object' ? (
                  Object.entries(clinic.hours).map(([day, hours]) => (
                    <div
                      key={day}
                      className='flex justify-between items-center'
                    >
                      <span className='font-medium capitalize text-gray-700'>
                        {day}
                      </span>
                      <span className='text-gray-600 text-sm'>
                        {hours || 'Closed'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-gray-700'>Monday</span>
                      <span className='text-gray-600 text-sm'>
                        9:00 AM - 7:00 PM
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-gray-700'>Tuesday</span>
                      <span className='text-gray-600 text-sm'>
                        9:00 AM - 7:00 PM
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-gray-700'>
                        Wednesday
                      </span>
                      <span className='text-gray-600 text-sm'>
                        9:00 AM - 7:00 PM
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-gray-700'>
                        Thursday
                      </span>
                      <span className='text-gray-600 text-sm'>
                        9:00 AM - 7:00 PM
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-gray-700'>Friday</span>
                      <span className='text-gray-600 text-sm'>
                        9:00 AM - 7:00 PM
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-gray-700'>
                        Saturday
                      </span>
                      <span className='text-gray-600 text-sm'>
                        9:00 AM - 5:00 PM
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-gray-700'>Sunday</span>
                      <span className='text-gray-600 text-sm'>
                        10:00 AM - 2:00 PM
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {clinic.emergency && (
                <div className='mt-4 pt-4 border-t border-gray-200'>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    Special Hours
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Emergency services available 24/7
                  </p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className='bg-white rounded-lg p-6 shadow-sm'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Contact Information
              </h3>
              <div className='space-y-4'>
                {safeGet<string>(clinic, 'phone', '') && (
                  <div className='flex items-start gap-3'>
                    <Phone size={16} className='text-emerald-600 mt-1' />
                    <div>
                      <p className='font-medium text-gray-900'>Phone</p>
                      <a
                        href={`tel:${clinic.phone}`}
                        className='text-emerald-600 hover:text-emerald-700'
                      >
                        {clinic.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className='flex items-start gap-3'>
                  <MapPin size={16} className='text-emerald-600 mt-1' />
                  <div>
                    <p className='font-medium text-gray-900'>Address</p>
                    <p className='text-gray-600 text-sm'>{formatAddress()}</p>
                  </div>
                </div>

                {safeGet<string>(clinic, 'email', '') && (
                  <div className='flex items-start gap-3'>
                    <Mail size={16} className='text-emerald-600 mt-1' />
                    <div>
                      <p className='font-medium text-gray-900'>Email</p>
                      <a
                        href={`mailto:${clinic.email}`}
                        className='text-emerald-600 hover:text-emerald-700 text-sm'
                      >
                        {clinic.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media */}
              {(safeGet<string>(clinic, 'facebook_url', '') ||
                safeGet<string>(clinic, 'instagram_url', '')) && (
                <div className='mt-6 pt-4 border-t border-gray-200'>
                  <h4 className='font-medium text-gray-900 mb-3'>
                    Follow on Social Media
                  </h4>
                  <div className='flex gap-3'>
                    {safeGet<string>(clinic, 'facebook_url', '') && (
                      <a
                        href={safeGet<string>(clinic, 'facebook_url', '')}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors'
                        aria-label='Facebook'
                      >
                        <Facebook size={20} />
                      </a>
                    )}
                    {safeGet<string>(clinic, 'instagram_url', '') && (
                      <a
                        href={safeGet<string>(clinic, 'instagram_url', '')}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors'
                        aria-label='Instagram'
                      >
                        <Instagram size={20} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
