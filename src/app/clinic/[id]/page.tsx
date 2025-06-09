'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Phone,
  Globe,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Clock,
  PawPrint,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { HeroPageLayout } from '@/components/layout/PageLayout';
import ClinicMap from '@/components/ClinicMap';

interface Clinic {
  id: string;
  name: string;
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
  phone?: string;
  website?: string;
  email?: string;
  facebook_url?: string;
  instagram_url?: string;
  emergency: boolean;
  emergency_hours?: string;
  emergency_details?: string;
  animals_treated?: string[];
  specializations?: string[];
  services_offered?: string[];
  hours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  [key: string]: unknown;
}

export default function ClinicDetailPage() {
  const params = useParams();
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
    obj: Record<string, unknown> | null,
    path: string,
    defaultValue: T
  ): T => {
    if (!obj) return defaultValue;
    try {
      return (obj[path] as T) || defaultValue;
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
      safeGet<string>(clinic, 'postcode', ''),
    ].filter((part) => part && part.trim());

    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  };

  const getTodayHours = () => {
    if (!clinic?.hours) return 'Hours not available';
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const today = days[new Date().getDay()];
    return clinic.hours[today as keyof typeof clinic.hours] || 'Closed';
  };

  return (
    <HeroPageLayout
      title={clinic ? `${clinic.name} - Veterinary Clinic` : 'Loading...'}
      description={
        clinic
          ? `Find contact details and services for ${clinic.name}`
          : undefined
      }
      loading={loading}
      error={error}
      onRetry={() => loadClinic(params.id as string)}
    >
      {clinic && (
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
              {/* Clinic Image */}
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                <div className='h-64 bg-gray-100 flex items-center justify-center'>
                  <div className='text-center text-gray-400'>
                    <PawPrint size={48} className='mx-auto mb-2' />
                    <span className='text-sm'>Clinic Image</span>
                  </div>
                </div>
              </div>

              {/* Clinic Details */}
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <h1 className='text-2xl font-bold text-gray-900 mb-4'>
                  {clinic.name}
                </h1>

                <div className='space-y-4'>
                  <div className='flex items-start gap-3'>
                    <MapPin className='w-5 h-5 text-gray-400 mt-0.5' />
                    <div>
                      <h3 className='text-sm font-medium text-gray-900'>
                        Address
                      </h3>
                      <p className='text-sm text-gray-600'>{formatAddress()}</p>
                    </div>
                  </div>

                  {clinic.phone && (
                    <div className='flex items-start gap-3'>
                      <Phone className='w-5 h-5 text-gray-400 mt-0.5' />
                      <div>
                        <h3 className='text-sm font-medium text-gray-900'>
                          Phone
                        </h3>
                        <a
                          href={`tel:${clinic.phone}`}
                          className='text-sm text-emerald-600 hover:text-emerald-700'
                        >
                          {clinic.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {clinic.website && (
                    <div className='flex items-start gap-3'>
                      <Globe className='w-5 h-5 text-gray-400 mt-0.5' />
                      <div>
                        <h3 className='text-sm font-medium text-gray-900'>
                          Website
                        </h3>
                        <a
                          href={clinic.website}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm text-emerald-600 hover:text-emerald-700'
                        >
                          {clinic.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {clinic.email && (
                    <div className='flex items-start gap-3'>
                      <Mail className='w-5 h-5 text-gray-400 mt-0.5' />
                      <div>
                        <h3 className='text-sm font-medium text-gray-900'>
                          Email
                        </h3>
                        <a
                          href={`mailto:${clinic.email}`}
                          className='text-sm text-emerald-600 hover:text-emerald-700'
                        >
                          {clinic.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {clinic.hours && (
                    <div className='flex items-start gap-3'>
                      <Clock className='w-5 h-5 text-gray-400 mt-0.5' />
                      <div>
                        <h3 className='text-sm font-medium text-gray-900'>
                          Today&apos;s Hours
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {getTodayHours()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map */}
              <ClinicMap
                clinicName={clinic.name}
                address={clinic.street || ''}
                city={clinic.city || ''}
                state={clinic.state || ''}
              />
            </div>

            {/* Sidebar */}
            <div className='lg:col-span-1 space-y-8'>
              {/* Emergency Services */}
              {clinic.emergency && (
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                  <div className='flex items-center gap-2 mb-4'>
                    <AlertCircle className='w-5 h-5 text-red-600' />
                    <h2 className='text-lg font-semibold text-gray-900'>
                      Emergency Services
                    </h2>
                  </div>
                  {clinic.emergency_details && (
                    <p className='text-sm text-gray-600 mb-2'>
                      {clinic.emergency_details}
                    </p>
                  )}
                  {clinic.emergency_hours && (
                    <p className='text-sm text-gray-600'>
                      <strong>Hours:</strong> {clinic.emergency_hours}
                    </p>
                  )}
                </div>
              )}

              {/* Services & Specializations */}
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                  Services & Specializations
                </h2>

                {clinic.animals_treated &&
                  clinic.animals_treated.length > 0 && (
                    <div className='mb-4'>
                      <h3 className='text-sm font-medium text-gray-900 mb-2'>
                        Animals Treated
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {clinic.animals_treated.map((animal, index) => (
                          <span
                            key={index}
                            className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                          >
                            {animal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {clinic.specializations &&
                  clinic.specializations.length > 0 && (
                    <div className='mb-4'>
                      <h3 className='text-sm font-medium text-gray-900 mb-2'>
                        Specializations
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {clinic.specializations.map((spec, index) => (
                          <span
                            key={index}
                            className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800'
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {clinic.services_offered &&
                  clinic.services_offered.length > 0 && (
                    <div className='mb-4'>
                      <h3 className='text-sm font-medium text-gray-900 mb-2'>
                        Services Offered
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {clinic.services_offered.map((service, index) => (
                          <span
                            key={index}
                            className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Social Media Links */}
                {(clinic.facebook_url || clinic.instagram_url) && (
                  <div className='mt-6'>
                    <h3 className='text-sm font-medium text-gray-900 mb-3'>
                      Follow Us
                    </h3>
                    <div className='flex gap-3'>
                      {clinic.facebook_url && (
                        <a
                          href={clinic.facebook_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-gray-400 hover:text-blue-600'
                        >
                          <Facebook className='w-5 h-5' />
                        </a>
                      )}
                      {clinic.instagram_url && (
                        <a
                          href={clinic.instagram_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-gray-400 hover:text-pink-600'
                        >
                          <Instagram className='w-5 h-5' />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </HeroPageLayout>
  );
}
