'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Clinic } from '@/types/clinic';
import { Button, PrimaryButton } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Globe,
  Clock,
  AlertCircle,
  Facebook,
  Instagram,
  Calendar,
  PawPrint,
  Stethoscope,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

export default function ViewClinicPage() {
  const params = useParams();
  const router = useRouter();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadClinic(params.id as string);
    }
  }, [params.id]);

  const loadClinic = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Clinic not found');

      setClinic(data);
    } catch (error) {
      console.error('Error loading clinic:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to load clinic'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!clinic) return;

    if (
      !window.confirm(
        `Are you sure you want to delete "${clinic.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', clinic.id);

      if (error) throw error;

      // Redirect to clinics list
      router.push('/admin/clinics');
    } catch (error) {
      console.error('Error deleting clinic:', error);
      alert('Failed to delete clinic');
    }
  };

  const formatAddress = () => {
    if (!clinic) return '';
    const parts = [
      clinic.street,
      clinic.city,
      clinic.state,
      clinic.postcode,
    ].filter(Boolean);
    return parts.join(', ');
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

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <LoadingSpinner size='lg' text='Loading clinic details...' />
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Error Loading Clinic
          </h3>
          <p className='text-gray-600 mb-4'>{error || 'Clinic not found'}</p>
          <Button asChild>
            <Link href='/admin/clinics'>Back to Clinics</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start gap-4'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' asChild>
            <Link href='/admin/clinics'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Clinics
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>{clinic.name}</h1>
            <p className='text-gray-600'>{formatAddress()}</p>
          </div>
        </div>

        <div className='flex gap-2'>
          <PrimaryButton asChild>
            <Link href={`/admin/clinics/${clinic.id}/edit`}>
              <Edit className='h-4 w-4 mr-2' />
              Edit Clinic
            </Link>
          </PrimaryButton>
          <Button variant='destructive' onClick={handleDelete}>
            <Trash2 className='h-4 w-4 mr-2' />
            Delete
          </Button>
        </div>
      </div>

      {/* Emergency Badge */}
      {clinic.emergency && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 text-red-600' />
            <span className='font-semibold text-red-800'>
              Emergency Services Available
            </span>
          </div>
          {clinic.emergency_hours && (
            <p className='text-red-700 mt-1'>Hours: {clinic.emergency_hours}</p>
          )}
          {clinic.emergency_details && (
            <p className='text-red-700 mt-1'>{clinic.emergency_details}</p>
          )}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Information */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Phone className='h-5 w-5' />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {clinic.phone && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Phone
                    </label>
                    <p className='text-gray-900'>{clinic.phone}</p>
                  </div>
                )}

                {clinic.email && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Email
                    </label>
                    <p className='text-gray-900'>{clinic.email}</p>
                  </div>
                )}

                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Address
                  </label>
                  <p className='text-gray-900'>{formatAddress()}</p>
                </div>

                {clinic.website && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Website
                    </label>
                    <a
                      href={clinic.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-emerald-600 hover:text-emerald-700 flex items-center gap-1'
                    >
                      <Globe className='h-4 w-4' />
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media */}
              {(clinic.facebook_url || clinic.instagram_url) && (
                <div className='pt-4 border-t'>
                  <label className='text-sm font-medium text-gray-500 block mb-2'>
                    Social Media
                  </label>
                  <div className='flex gap-3'>
                    {clinic.facebook_url && (
                      <a
                        href={clinic.facebook_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-700 flex items-center gap-1'
                      >
                        <Facebook className='h-4 w-4' />
                        Facebook
                      </a>
                    )}
                    {clinic.instagram_url && (
                      <a
                        href={clinic.instagram_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-pink-600 hover:text-pink-700 flex items-center gap-1'
                      >
                        <Instagram className='h-4 w-4' />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='h-5 w-5' />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex justify-between items-center p-2 bg-emerald-50 rounded'>
                  <span className='font-medium text-emerald-800'>Today</span>
                  <span className='text-emerald-700'>{getTodayHours()}</span>
                </div>

                {clinic.hours &&
                  Object.entries(clinic.hours).map(([day, hours]) => (
                    <div
                      key={day}
                      className='flex justify-between items-center py-1'
                    >
                      <span className='capitalize text-gray-700'>{day}</span>
                      <span className='text-gray-900'>{hours}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Services and Specializations */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Stethoscope className='h-5 w-5' />
                Services & Specializations
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Animals Treated */}
              {clinic.animals_treated && clinic.animals_treated.length > 0 && (
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-2'>
                    Animals Treated
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {clinic.animals_treated.map((animal, index) => (
                      <Badge
                        key={index}
                        variant='secondary'
                        className='flex items-center gap-1'
                      >
                        <PawPrint className='h-3 w-3' />
                        {animal}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Specializations */}
              {clinic.specializations && clinic.specializations.length > 0 && (
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-2'>
                    Specializations
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {clinic.specializations.map((spec, index) => (
                      <Badge
                        key={index}
                        variant='outline'
                        className='border-emerald-200 text-emerald-700'
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
                    <label className='text-sm font-medium text-gray-500 block mb-2'>
                      Services Offered
                    </label>
                    <div className='flex flex-wrap gap-2'>
                      {clinic.services_offered.map((service, index) => (
                        <Badge
                          key={index}
                          className='bg-blue-100 text-blue-800 hover:bg-blue-200'
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
                  <p className='text-gray-500 italic'>
                    No services or specializations specified
                  </p>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Settings className='h-5 w-5' />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Button variant='outline' fullWidth asChild>
                <Link href={`/admin/clinics/${clinic.id}/edit`}>
                  <Edit className='h-4 w-4 mr-2' />
                  Edit Details
                </Link>
              </Button>

              <Button variant='outline' fullWidth asChild>
                <Link href={`/clinic/${clinic.id}`} target='_blank'>
                  <Globe className='h-4 w-4 mr-2' />
                  View Public Page
                </Link>
              </Button>

              <Button variant='destructive' fullWidth onClick={handleDelete}>
                <Trash2 className='h-4 w-4 mr-2' />
                Delete Clinic
              </Button>
            </CardContent>
          </Card>

          {/* Clinic Stats */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                Clinic Info
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-500'>Status</span>
                <Badge variant={clinic.emergency ? 'destructive' : 'secondary'}>
                  {clinic.emergency ? 'Emergency Available' : 'Regular Hours'}
                </Badge>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-500'>Animals</span>
                <span className='text-gray-900'>
                  {clinic.animals_treated?.length || 0} types
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-500'>Services</span>
                <span className='text-gray-900'>
                  {clinic.services_offered?.length || 0} services
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-500'>Specializations</span>
                <span className='text-gray-900'>
                  {clinic.specializations?.length || 0} areas
                </span>
              </div>

              {clinic.created_at && (
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Added</span>
                  <span className='text-gray-900'>
                    {new Date(clinic.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
