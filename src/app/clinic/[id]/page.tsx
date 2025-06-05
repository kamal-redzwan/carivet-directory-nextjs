'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Phone,
  Globe,
  MapPin,
  Clock,
  Mail,
  Check,
  PawPrint,
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react';
import Link from 'next/link';

export default function ClinicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [clinic, setClinic] = useState<any>(null);
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

      setClinic(data);
    } catch (err) {
      console.error('Error in loadClinic:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  const safeGet = (obj: any, path: string, defaultValue: any = '') => {
    try {
      return obj && obj[path] ? obj[path] : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const formatAddress = () => {
    if (!clinic) return 'Address not available';

    const parts = [
      safeGet(clinic, 'street'),
      safeGet(clinic, 'city'),
      safeGet(clinic, 'state'),
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
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            {/* Logo */}
            <div className='flex items-center'>
              <PawPrint className='h-8 w-8 text-emerald-600 mr-2' />
              <span className='text-xl font-bold text-gray-900'>CariVet</span>
            </div>

            {/* Navigation */}
            <nav className='hidden md:flex space-x-8'>
              <Link href='/' className='text-gray-600 hover:text-emerald-600'>
                Home
              </Link>
              <Link
                href='/clinics'
                className='text-gray-900 hover:text-emerald-600'
              >
                Find Clinics
              </Link>
              <Link
                href='/tips'
                className='text-gray-600 hover:text-emerald-600'
              >
                Pet Care Tips
              </Link>
              <Link
                href='/blog'
                className='text-gray-600 hover:text-emerald-600'
              >
                Blog
              </Link>
              <Link
                href='/about'
                className='text-gray-600 hover:text-emerald-600'
              >
                About
              </Link>
              <Link
                href='/contact'
                className='text-gray-600 hover:text-emerald-600'
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

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
                {safeGet(clinic, 'name', 'Clinic Name')}
              </h1>
              <p className='text-gray-600'>{formatAddress()}</p>
            </div>

            {/* Quick Actions */}
            <div className='flex gap-4'>
              {safeGet(clinic, 'phone') && (
                <a
                  href={`tel:${clinic.phone}`}
                  className='inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors'
                >
                  <Phone size={16} />
                  Call Clinic
                </a>
              )}
              {safeGet(clinic, 'website') && (
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
                About {safeGet(clinic, 'name', 'This Clinic')}
              </h2>
              <p className='text-gray-600 leading-relaxed'>
                {safeGet(clinic, 'name', 'This clinic')} is a veterinary clinic
                located in {safeGet(clinic, 'city', 'Kuala Lumpur')},{' '}
                {safeGet(clinic, 'state', 'Malaysia')}. They provide
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
                {safeGet(clinic, 'phone') && (
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

                {safeGet(clinic, 'email') && (
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
              {(safeGet(clinic, 'facebook_url') ||
                safeGet(clinic, 'instagram_url')) && (
                <div className='mt-6 pt-4 border-t border-gray-200'>
                  <h4 className='font-medium text-gray-900 mb-3'>
                    Follow on Social Media
                  </h4>
                  <div className='flex gap-3'>
                    {safeGet(clinic, 'facebook_url') && (
                      <a
                        href={clinic.facebook_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700'
                      >
                        <Facebook size={16} />
                      </a>
                    )}
                    {safeGet(clinic, 'instagram_url') && (
                      <a
                        href={clinic.instagram_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700'
                      >
                        <Instagram size={16} />
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
