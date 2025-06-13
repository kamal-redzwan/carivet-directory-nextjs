'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Mail,
  Globe,
  MapPin,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// ✅ IMPORT CENTRALIZED UTILITIES (replacing duplicate functions)
import {
  formatAddress,
  formatAddressForMaps,
  formatPhone,
  getTodayHours,
  getClinicStatus,
} from '@/utils/formatters';

// ✅ IMPORT PERMISSION UTILITIES (now available in permissions.ts)
import {
  canDeleteClinics,
  canManageClinics,
  canViewClinics,
} from '@/utils/permissions';

// ✅ IMPORT PERMISSION UTILITIES
import { useAuth } from '@/contexts/AuthContext';

export default function AdminClinicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const loadClinic = useCallback(async () => {
    if (!params?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', params.id as string)
        .single();

      if (error) throw error;
      setClinic(data);
    } catch (error) {
      console.error('Error loading clinic:', error);
      toast.error('Failed to load clinic details');
    } finally {
      setLoading(false);
    }
  }, [params?.id]); // Add params.id as dependency

  useEffect(() => {
    loadClinic();
  }, [loadClinic]); // Now loadClinic is properly included

  const handleDelete = async () => {
    if (!clinic || !canDeleteClinics(user)) {
      toast.error('You do not have permission to delete clinics');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete "${clinic.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', clinic.id);

      if (error) throw error;

      toast.success('Clinic deleted successfully');
      router.push('/admin/clinics');
    } catch (error) {
      console.error('Error deleting clinic:', error);
      toast.error('Failed to delete clinic');
    } finally {
      setDeleting(false);
    }
  };

  // ✅ PERMISSION CHECK
  if (!canViewClinics(user)) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Access Denied
          </h2>
          <p className='text-gray-600'>
            You do not have permission to view clinic details.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Clinic Not Found
          </h2>
          <p className='text-gray-600 mb-4'>
            The clinic you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href='/admin/clinics'>Back to Clinics</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ✅ GET ENHANCED STATUS INFO
  const statusInfo = getClinicStatus(clinic);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' asChild>
            <Link href='/admin/clinics'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Clinics
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>{clinic.name}</h1>
            {/* ✅ USING CENTRALIZED ADDRESS FORMATTING */}
            <p className='text-gray-600'>{formatAddress(clinic)}</p>
          </div>
        </div>

        <div className='flex gap-2'>
          {/* ✅ PERMISSION-BASED EDIT BUTTON */}
          {canManageClinics(user) && (
            <PrimaryButton asChild>
              <Link href={`/admin/clinics/${clinic.id}/edit`}>
                <Edit className='h-4 w-4 mr-2' />
                Edit Clinic
              </Link>
            </PrimaryButton>
          )}

          {/* ✅ PERMISSION-BASED DELETE BUTTON */}
          {canDeleteClinics(user) && (
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className='h-4 w-4 mr-2' />
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
        </div>
      </div>

      {/* ✅ ENHANCED STATUS BANNER */}
      <div
        className={`p-4 rounded-lg border ${
          statusInfo.status === 'open'
            ? 'bg-green-50 border-green-200'
            : statusInfo.status === 'emergency'
            ? 'bg-red-50 border-red-200'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className='flex items-center gap-2'>
          <AlertCircle
            className={`h-5 w-5 ${
              statusInfo.status === 'open'
                ? 'text-green-600'
                : statusInfo.status === 'emergency'
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          />
          <span
            className={`font-semibold ${
              statusInfo.status === 'open'
                ? 'text-green-800'
                : statusInfo.status === 'emergency'
                ? 'text-red-800'
                : 'text-gray-800'
            }`}
          >
            {statusInfo.message}
          </span>
        </div>
        {clinic.emergency && (
          <div className='mt-2'>
            {clinic.emergency_hours && (
              <p className='text-red-700 text-sm'>
                Emergency Hours: {clinic.emergency_hours}
              </p>
            )}
            {clinic.emergency_details && (
              <p className='text-red-700 text-sm mt-1'>
                {clinic.emergency_details}
              </p>
            )}
          </div>
        )}
      </div>

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
                    {/* ✅ USING CENTRALIZED PHONE FORMATTING */}
                    <p className='text-gray-900'>{formatPhone(clinic.phone)}</p>
                    <a
                      href={`tel:${formatPhone(clinic.phone, {
                        format: 'tel',
                      })}`}
                      className='text-emerald-600 hover:text-emerald-700 text-sm'
                    >
                      Call now
                    </a>
                  </div>
                )}

                {clinic.email && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Email
                    </label>
                    <p className='text-gray-900'>{clinic.email}</p>
                    <a
                      href={`mailto:${clinic.email}`}
                      className='text-emerald-600 hover:text-emerald-700 text-sm'
                    >
                      Send email
                    </a>
                  </div>
                )}

                {clinic.website && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Website
                    </label>
                    <p className='text-gray-900'>{clinic.website}</p>
                    <a
                      href={clinic.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1'
                    >
                      Visit website <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Address
                  </label>
                  {/* ✅ USING CENTRALIZED ADDRESS FORMATTING */}
                  <p className='text-gray-900'>{formatAddress(clinic)}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      formatAddressForMaps(clinic) // ✅ CENTRALIZED MAPS FORMATTING
                    )}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1'
                  >
                    View on maps <ExternalLink size={12} />
                  </a>
                </div>
              </div>
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
              {clinic.hours ? (
                <div className='space-y-2'>
                  {Object.entries(clinic.hours).map(([day, hours]) => (
                    <div
                      key={day}
                      className='flex justify-between items-center py-1'
                    >
                      <span className='text-gray-700 capitalize font-medium'>
                        {day}
                      </span>
                      <span className='text-gray-900'>{hours}</span>
                    </div>
                  ))}
                  <div className='pt-3 border-t'>
                    <p className='text-sm text-gray-600'>
                      {/* ✅ USING CENTRALIZED HOURS FORMATTING */}
                      Today:{' '}
                      <span className='font-medium'>
                        {getTodayHours(clinic.hours)}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className='text-gray-500'>No operating hours specified</p>
              )}
            </CardContent>
          </Card>

          {/* Services & Specializations */}
          <Card>
            <CardHeader>
              <CardTitle>Services & Specializations</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {clinic.animals_treated && clinic.animals_treated.length > 0 ? (
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    Animals Treated
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {clinic.animals_treated.map((animal) => (
                      <Badge key={animal} variant='secondary'>
                        {animal}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    Animals Treated
                  </h4>
                  <p className='text-gray-500 text-sm'>Not specified</p>
                </div>
              )}

              {clinic.specializations && clinic.specializations.length > 0 ? (
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    Specializations
                  </h4>
                  <div className='flex flex-wrap gap-2'>
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
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    Specializations
                  </h4>
                  <p className='text-gray-500 text-sm'>Not specified</p>
                </div>
              )}

              {clinic.services_offered && clinic.services_offered.length > 0 ? (
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    Services Offered
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {clinic.services_offered.map((service) => (
                      <Badge key={service} variant='outline'>
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    Services Offered
                  </h4>
                  <p className='text-gray-500 text-sm'>Not specified</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Status</span>
                <Badge
                  variant={
                    statusInfo.status === 'open' ? 'default' : 'secondary'
                  }
                  className={
                    statusInfo.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : statusInfo.status === 'emergency'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {statusInfo.status === 'open'
                    ? 'Open'
                    : statusInfo.status === 'emergency'
                    ? 'Emergency'
                    : 'Closed'}
                </Badge>
              </div>

              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Emergency Services</span>
                <Badge variant={clinic.emergency ? 'destructive' : 'secondary'}>
                  {clinic.emergency ? 'Available' : 'Not Available'}
                </Badge>
              </div>

              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Animals Treated</span>
                <span className='text-gray-900'>
                  {clinic.animals_treated?.length || 0} types
                </span>
              </div>

              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Specializations</span>
                <span className='text-gray-900'>
                  {clinic.specializations?.length || 0} specialties
                </span>
              </div>

              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Services</span>
                <span className='text-gray-900'>
                  {clinic.services_offered?.length || 0} services
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {clinic.phone && (
                <Button variant='outline' className='w-full' asChild>
                  <a
                    href={`tel:${formatPhone(clinic.phone, { format: 'tel' })}`}
                  >
                    <Phone size={16} className='mr-2' />
                    Call Clinic
                  </a>
                </Button>
              )}

              {clinic.email && (
                <Button variant='outline' className='w-full' asChild>
                  <a href={`mailto:${clinic.email}`}>
                    <Mail size={16} className='mr-2' />
                    Send Email
                  </a>
                </Button>
              )}

              {clinic.website && (
                <Button variant='outline' className='w-full' asChild>
                  <a
                    href={clinic.website}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Globe size={16} className='mr-2' />
                    Visit Website
                  </a>
                </Button>
              )}

              <Button variant='outline' className='w-full' asChild>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    formatAddressForMaps(clinic)
                  )}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <MapPin size={16} className='mr-2' />
                  View on Maps
                </a>
              </Button>

              <Button variant='outline' className='w-full' asChild>
                <Link href={`/clinic/${clinic.id}`}>
                  <ExternalLink size={16} className='mr-2' />
                  View Public Page
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          {(canManageClinics(user) || canDeleteClinics(user)) && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {canManageClinics(user) && (
                  <Button className='w-full' asChild>
                    <Link href={`/admin/clinics/${clinic.id}/edit`}>
                      <Edit size={16} className='mr-2' />
                      Edit Clinic
                    </Link>
                  </Button>
                )}

                {canDeleteClinics(user) && (
                  <Button
                    variant='destructive'
                    className='w-full'
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    <Trash2 size={16} className='mr-2' />
                    {deleting ? 'Deleting...' : 'Delete Clinic'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
