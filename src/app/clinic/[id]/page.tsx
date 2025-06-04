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
  AlertCircle,
  Share2,
} from 'lucide-react';

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

      console.log('Loading clinic with ID:', id);

      const { data, error: fetchError } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', id)
        .single();

      console.log('Supabase response:', { data, error: fetchError });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw new Error(fetchError.message);
      }

      if (!data) {
        throw new Error('No clinic data found');
      }

      console.log('Setting clinic data:', data);
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
      safeGet(clinic, 'postcode'),
    ].filter((part) => part && part.trim());

    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  };

  const getTodayHours = () => {
    try {
      if (!clinic?.hours || typeof clinic.hours !== 'object') {
        return 'Hours not available';
      }

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

      return clinic.hours[today] || 'Hours not available';
    } catch {
      return 'Hours not available';
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
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
            onClick={() => router.push('/')}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
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
            onClick={() => router.push('/')}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => router.back()}
              className='flex items-center gap-2 text-gray-600 hover:text-gray-900'
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <div className='flex-1'>
              <h1 className='text-2xl font-bold text-gray-900'>
                {safeGet(clinic, 'name', 'Clinic Name')}
              </h1>
              <div className='flex items-center gap-2 mt-1'>
                <MapPin size={16} className='text-gray-500' />
                <span className='text-gray-600'>
                  {safeGet(clinic, 'city', 'City')},{' '}
                  {safeGet(clinic, 'state', 'State')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Emergency Alert */}
            {safeGet(clinic, 'emergency', false) && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='text-red-600 mt-1' size={20} />
                  <div>
                    <h3 className='text-lg font-semibold text-red-900 mb-2'>
                      Emergency Services Available
                    </h3>
                    {safeGet(clinic, 'emergency_details') && (
                      <p className='text-red-800 mb-2'>
                        {clinic.emergency_details}
                      </p>
                    )}
                    {safeGet(clinic, 'emergency_hours') && (
                      <p className='text-red-700 text-sm'>
                        Emergency Hours: {clinic.emergency_hours}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Contact Information
              </h2>
              <div className='space-y-4'>
                {safeGet(clinic, 'phone') && (
                  <div className='flex items-center gap-3'>
                    <Phone size={16} className='text-gray-500' />
                    <a
                      href={`tel:${clinic.phone}`}
                      className='text-blue-600 hover:text-blue-800 underline'
                    >
                      {clinic.phone}
                    </a>
                  </div>
                )}

                {safeGet(clinic, 'email') && (
                  <div className='flex items-center gap-3'>
                    <span className='text-gray-500'>Email:</span>
                    <a
                      href={`mailto:${clinic.email}`}
                      className='text-blue-600 hover:text-blue-800 underline'
                    >
                      {clinic.email}
                    </a>
                  </div>
                )}

                {safeGet(clinic, 'website') && (
                  <div className='flex items-center gap-3'>
                    <Globe size={16} className='text-gray-500' />
                    <a
                      href={clinic.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800 underline'
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Location
              </h2>
              <div className='flex items-start gap-3'>
                <MapPin size={16} className='text-gray-500 mt-1' />
                <div>
                  <p className='text-gray-600'>{formatAddress()}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      formatAddress()
                    )}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:text-blue-800 underline text-sm mt-2 inline-block'
                  >
                    Get Directions on Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Services
              </h2>

              {/* Services Offered */}
              {Array.isArray(clinic.services_offered) &&
                clinic.services_offered.length > 0 && (
                  <div className='mb-4'>
                    <h3 className='font-medium text-gray-900 mb-2'>
                      Services Offered
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {clinic.services_offered.map(
                        (service: string, index: number) => (
                          <span
                            key={index}
                            className='px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full'
                          >
                            {service}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Specializations */}
              {Array.isArray(clinic.specializations) &&
                clinic.specializations.length > 0 && (
                  <div className='mb-4'>
                    <h3 className='font-medium text-gray-900 mb-2'>
                      Specializations
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {clinic.specializations.map(
                        (spec: string, index: number) => (
                          <span
                            key={index}
                            className='px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full'
                          >
                            {spec}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Animals Treated */}
              {Array.isArray(clinic.animals_treated) &&
                clinic.animals_treated.length > 0 && (
                  <div>
                    <h3 className='font-medium text-gray-900 mb-2'>
                      Animals We Care For
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {clinic.animals_treated.map(
                        (animal: string, index: number) => (
                          <span
                            key={index}
                            className='px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full capitalize'
                          >
                            {animal}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Operating Hours */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Operating Hours
              </h2>

              {clinic.hours && typeof clinic.hours === 'object' ? (
                <div className='space-y-2'>
                  {Object.entries(clinic.hours).map(([day, hours]) => (
                    <div
                      key={day}
                      className='flex justify-between items-center py-2 px-3 bg-gray-50 rounded'
                    >
                      <span className='font-medium capitalize text-gray-900'>
                        {day}
                      </span>
                      <span
                        className={`text-sm ${
                          !hours || hours === 'Closed'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {hours || 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-500'>
                  Operating hours information not available.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Quick Actions */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <h3 className='font-semibold text-gray-900 mb-4'>
                Quick Actions
              </h3>
              <div className='space-y-3'>
                {safeGet(clinic, 'phone') && (
                  <a
                    href={`tel:${clinic.phone}`}
                    className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                  >
                    <Phone size={16} />
                    Call Now
                  </a>
                )}

                {safeGet(clinic, 'website') && (
                  <a
                    href={clinic.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                  >
                    <Globe size={16} />
                    Visit Website
                  </a>
                )}

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    formatAddress()
                  )}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                >
                  <MapPin size={16} />
                  Get Directions
                </a>
              </div>
            </div>

            {/* Current Status */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <h3 className='font-semibold text-gray-900 mb-4'>
                Today's Hours
              </h3>
              <p className='text-gray-600'>{getTodayHours()}</p>
            </div>

            {/* Social Media */}
            {(safeGet(clinic, 'facebook_url') ||
              safeGet(clinic, 'instagram_url')) && (
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  Social Media
                </h3>
                <div className='space-y-2'>
                  {safeGet(clinic, 'facebook_url') && (
                    <a
                      href={clinic.facebook_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='w-full flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                    >
                      Facebook
                    </a>
                  )}
                  {safeGet(clinic, 'instagram_url') && (
                    <a
                      href={clinic.instagram_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='w-full flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700'
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
