'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
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

// ✅ IMPORT CENTRALIZED UTILITIES
import {
  formatAddress,
  formatAddressForMaps,
  getTodayHours,
  getClinicStatus,
} from '@/utils/formatters';

export default function ClinicDetailPage() {
  const params = useParams();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const loadClinic = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!params?.id) {
        throw new Error('No clinic ID provided');
      }

      console.log('Loading clinic with ID:', params.id);

      const { data, error: queryError } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', params.id as string)
        .single();

      console.log('Clinic query result:', { data, error: queryError });

      if (queryError) {
        console.error('Supabase error:', queryError);
        throw new Error(queryError.message);
      }

      if (!data) {
        throw new Error('No clinic found with this ID');
      }

      setClinic(data);
    } catch (err) {
      console.error('Error loading clinic:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Load clinic when component mounts or ID changes
  useEffect(() => {
    if (params?.id) {
      loadClinic();
    }
  }, [params?.id]);

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
      onRetry={loadClinic}
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
              <div className='space-y-6'>
                {/* ✅ ENHANCED STATUS CARD WITH FIXED LOGIC */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Custom status logic for detail page
                      const todayHours = getTodayHours(clinic.hours);
                      const isEmergency = clinic.emergency;
                      const is24Hours =
                        todayHours === '24/7' ||
                        todayHours.toLowerCase().includes('24');

                      let status, message, bgColor, textColor;

                      if (isEmergency && is24Hours) {
                        status = 'emergency-open';
                        message = 'Open 24/7 - Emergency services available';
                        bgColor = 'bg-emerald-100';
                        textColor = 'text-emerald-800';
                      } else if (isEmergency) {
                        status = 'emergency';
                        message = 'Emergency services available';
                        bgColor = 'bg-red-100';
                        textColor = 'text-red-800';
                      } else if (is24Hours) {
                        status = 'open';
                        message = 'Open 24/7';
                        bgColor = 'bg-green-100';
                        textColor = 'text-green-800';
                      } else {
                        // Use the original status function for regular clinics
                        const statusInfo = getClinicStatus(clinic);
                        status = statusInfo.status;
                        message = statusInfo.message;
                        bgColor =
                          statusInfo.status === 'open'
                            ? 'bg-green-100'
                            : 'bg-gray-100';
                        textColor =
                          statusInfo.status === 'open'
                            ? 'text-green-800'
                            : 'text-gray-800';
                      }

                      return (
                        <div className='text-center'>
                          <Badge
                            variant='secondary'
                            className={`text-sm px-4 py-2 ${bgColor} ${textColor} border-0`}
                          >
                            {message}
                          </Badge>
                          <p className='text-sm text-gray-600 mt-2'>
                            Today: {todayHours}
                          </p>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Services & Specializations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Services & Specializations</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {clinic.animals_treated &&
                    clinic.animals_treated.length > 0 ? (
                      <div>
                        <h4 className='font-medium text-gray-900 mb-2'>
                          Animals Treated
                        </h4>
                        <div className='flex flex-wrap gap-1'>
                          {clinic.animals_treated.map((animal) => (
                            <Badge key={animal} variant='secondary'>
                              {animal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className='text-gray-500 text-sm'>
                        No animal treatment information specified
                      </p>
                    )}

                    {clinic.specializations &&
                    clinic.specializations.length > 0 ? (
                      <div>
                        <h4 className='font-medium text-gray-900 mb-2'>
                          Specializations
                        </h4>
                        <div className='flex flex-wrap gap-1'>
                          {clinic.specializations.map((spec) => (
                            <Badge
                              key={spec}
                              variant='outline'
                              className='bg-emerald-50 text-emerald-700'
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className='text-gray-500 text-sm'>
                        No specialization information specified
                      </p>
                    )}

                    {clinic.services_offered &&
                    clinic.services_offered.length > 0 ? (
                      <div>
                        <h4 className='font-medium text-gray-900 mb-2'>
                          Services Offered
                        </h4>
                        <div className='flex flex-wrap gap-1'>
                          {clinic.services_offered.map((service) => (
                            <Badge key={service} variant='outline'>
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className='text-gray-500 text-sm'>
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
                          formatAddressForMaps(clinic)
                        )}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Get Directions
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                {/* ✅ ENHANCED CLINIC INFO WITH CENTRALIZED STATUS */}
                <Card>
                  <CardHeader>
                    <CardTitle>Clinic Information</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Status</span>
                      <StatusBadge
                        status={clinic.emergency ? 'emergency' : 'active'}
                        showIcon={false}
                      />
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Location</span>
                      <span className='text-right text-gray-900'>
                        {/* ✅ USING CENTRALIZED ADDRESS FORMATTING */}
                        {formatAddress(clinic, { includePostcode: false })}
                      </span>
                    </div>

                    {clinic.emergency && (
                      <>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Emergency Hours</span>
                          <span className='text-right text-gray-900'>
                            {clinic.emergency_hours || '24/7'}
                          </span>
                        </div>

                        {clinic.emergency_details && (
                          <div className='pt-2 border-t'>
                            <p className='text-sm text-gray-600 mb-1'>
                              Emergency Details:
                            </p>
                            <p className='text-sm text-gray-900'>
                              {clinic.emergency_details}
                            </p>
                          </div>
                        )}
                      </>
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
