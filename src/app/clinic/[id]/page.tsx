'use client';

import { useParams } from 'next/navigation';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import { Clinic } from '@/types/clinic';
import { ArrowLeft, PawPrint, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { HeroPageLayout } from '@/components/layout/PageLayout';
import { SimpleHero } from '@/components/layout/HeroSection';
import { ClinicContactInfo } from '@/components/common/ClinicContactInfo';
import { OperatingHours } from '@/components/common/OperatingHours';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ClinicMap from '@/components/ClinicMap';

export default function ClinicDetailPage() {
  const params = useParams();

  // Load clinic data using useSupabaseQuery
  const {
    data: clinic,
    loading,
    error,
    refetch: loadClinic,
  } = useSupabaseQuery<Clinic>(
    async () => {
      if (!params?.id) {
        throw new Error('No clinic ID provided');
      }

      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', params.id as string)
        .single();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('No clinic data found');

      return { data, error: null };
    },
    [params?.id], // Refetch when ID changes
    { enabled: !!params?.id, refetchOnMount: true }
  );

  // Helper functions
  const formatAddress = () => {
    if (!clinic) return 'Address not available';
    const parts = [
      clinic.street,
      clinic.city,
      clinic.state,
      clinic.postcode,
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
      onRetry={() => loadClinic()}
      noPadding
    >
      {clinic && (
        <>
          {/* Dynamic Hero Section */}
          <SimpleHero
            title={clinic.name}
            subtitle={`${clinic.city ? clinic.city + ', ' : ''}${
              clinic.state || ''
            }`}
            size='sm'
            bgColor={clinic.emergency ? 'bg-red-600' : 'bg-emerald-600'}
          >
            {clinic.emergency && (
              <div className='mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full'>
                <StatusBadge status='emergency' showIcon={true} />
              </div>
            )}
          </SimpleHero>

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
                <Card>
                  <CardContent className='p-0'>
                    <div className='h-64 bg-gray-100 flex items-center justify-center'>
                      <div className='text-center text-gray-400'>
                        <PawPrint size={48} className='mx-auto mb-2' />
                        <span className='text-sm'>Clinic Image</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ClinicContactInfo clinic={clinic} variant='full' />
                  </CardContent>
                </Card>

                {/* Operating Hours */}
                <OperatingHours hours={clinic.hours} variant='card' />

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
                  <Card className='border-red-200'>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-red-800'>
                        <StatusBadge status='emergency' />
                        Emergency Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {clinic.emergency_details && (
                        <p className='text-sm text-red-700 mb-2'>
                          {clinic.emergency_details}
                        </p>
                      )}
                      {clinic.emergency_hours && (
                        <p className='text-sm text-red-700'>
                          <strong>Hours:</strong> {clinic.emergency_hours}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Services & Specializations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Services & Specializations</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    {/* Animals Treated */}
                    {clinic.animals_treated &&
                      clinic.animals_treated.length > 0 && (
                        <div>
                          <h4 className='text-sm font-medium text-gray-700 mb-2'>
                            Animals Treated
                          </h4>
                          <div className='flex flex-wrap gap-2'>
                            {clinic.animals_treated.map((animal, index) => (
                              <Badge
                                key={index}
                                variant='secondary'
                                className='text-xs'
                              >
                                {animal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Specializations */}
                    {clinic.specializations &&
                      clinic.specializations.length > 0 && (
                        <div>
                          <h4 className='text-sm font-medium text-gray-700 mb-2'>
                            Specializations
                          </h4>
                          <div className='flex flex-wrap gap-2'>
                            {clinic.specializations.map((spec, index) => (
                              <Badge
                                key={index}
                                variant='outline'
                                className='text-xs border-emerald-200 text-emerald-700'
                              >
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Services Offered */}
                    {clinic.services_offered &&
                      clinic.services_offered.length > 0 && (
                        <div>
                          <h4 className='text-sm font-medium text-gray-700 mb-2'>
                            Services Offered
                          </h4>
                          <div className='flex flex-wrap gap-2'>
                            {clinic.services_offered.map((service, index) => (
                              <Badge
                                key={index}
                                className='text-xs bg-blue-100 text-blue-800 hover:bg-blue-200'
                              >
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* No services message */}
                    {!clinic.animals_treated?.length &&
                      !clinic.specializations?.length &&
                      !clinic.services_offered?.length && (
                        <p className='text-gray-500 italic text-sm'>
                          No services or specializations specified
                        </p>
                      )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    {clinic.phone && (
                      <Button variant='emerald' fullWidth asChild>
                        <a href={`tel:${clinic.phone}`}>Call Clinic</a>
                      </Button>
                    )}

                    {clinic.website && (
                      <Button variant='outline' fullWidth asChild>
                        <a
                          href={clinic.website}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center justify-center gap-2'
                        >
                          <ExternalLink size={14} />
                          Visit Website
                        </a>
                      </Button>
                    )}

                    <Button variant='outline' fullWidth asChild>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          formatAddress()
                        )}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Get Directions
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                {/* Clinic Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Clinic Information</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Status</span>
                      <StatusBadge
                        status={clinic.emergency ? 'emergency' : 'regular'}
                        size='sm'
                      />
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Animals</span>
                      <span className='text-gray-900'>
                        {clinic.animals_treated?.length || 0} types
                      </span>
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Services</span>
                      <span className='text-gray-900'>
                        {clinic.services_offered?.length || 0} services
                      </span>
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Specializations</span>
                      <span className='text-gray-900'>
                        {clinic.specializations?.length || 0} areas
                      </span>
                    </div>

                    {clinic.created_at && (
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-600'>Added</span>
                        <span className='text-gray-900'>
                          {new Date(clinic.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </>
      )}
    </HeroPageLayout>
  );
}
