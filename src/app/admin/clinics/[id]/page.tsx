'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Archive,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  AlertCircle,
  ExternalLink,
  AlertTriangle,
  Shield,
  Activity,
  CheckCircle,
  XCircle,
  MoreVertical,
} from 'lucide-react';
import { toast } from 'sonner';

// Import utilities and components
import {
  formatAddress,
  formatAddressForMaps,
  formatPhone,
  getClinicStatus,
} from '@/utils/formatters';
import {
  canDeleteClinics,
  canManageClinics,
  canViewClinics,
} from '@/utils/permissions';
import { useAuth } from '@/contexts/AuthContext';
import {
  useDeleteOperations,
  DeleteConfirmationDialog,
} from '../deleteOperations';

// ============================================================================
// TYPES
// ============================================================================

interface DeleteAction {
  type: 'hard' | 'soft';
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  confirmTitle: string;
  confirmMessage: string;
  variant: 'destructive' | 'outline';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EnhancedAdminClinicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  // State management
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    action: DeleteAction | null;
    operation?: () => Promise<void>;
  }>({
    isOpen: false,
    action: null,
  });

  // Initialize delete operations hook
  const { isDeleting, deleteSingleClinic, softDeleteClinic } =
    useDeleteOperations(user);

  // ============================================================================
  // DELETE ACTION DEFINITIONS
  // ============================================================================

  const deleteActions: DeleteAction[] = [
    {
      type: 'soft',
      title: 'Archive Clinic',
      description: 'Hide from public view but preserve data',
      icon: <Archive className='h-4 w-4' />,
      buttonText: 'Archive',
      confirmTitle: 'Archive Clinic',
      confirmMessage: `Are you sure you want to archive "${clinic?.name}"? This will hide it from public view but preserve all data.`,
      variant: 'outline',
    },
    {
      type: 'hard',
      title: 'Delete Permanently',
      description: 'Permanently remove all clinic data',
      icon: <Trash2 className='h-4 w-4' />,
      buttonText: 'Delete',
      confirmTitle: 'Delete Clinic Permanently',
      confirmMessage: `Are you sure you want to permanently delete "${clinic?.name}"? This action cannot be undone and all data will be lost.`,
      variant: 'destructive',
    },
  ];

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  const loadClinic = useCallback(async () => {
    if (!params?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', params.id as string)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          toast.error('Clinic not found');
          router.push('/admin/clinics');
          return;
        }
        throw error;
      }

      setClinic(data);
    } catch (error) {
      console.error('Error loading clinic:', error);
      toast.error('Failed to load clinic details');
    } finally {
      setLoading(false);
    }
  }, [params?.id, router]);

  useEffect(() => {
    loadClinic();
  }, [loadClinic]);

  // ============================================================================
  // DELETE HANDLERS
  // ============================================================================

  const handleDeleteAction = (action: DeleteAction) => {
    if (!clinic) return;

    const operation = async () => {
      if (action.type === 'soft') {
        const result = await softDeleteClinic(clinic.id, clinic.name);
        if (result.success) {
          toast.success('Clinic archived successfully');
          router.push('/admin/clinics');
        }
      } else {
        const result = await deleteSingleClinic(clinic.id, clinic.name);
        if (result.success) {
          router.push('/admin/clinics');
        }
      }
    };

    setDeleteConfirmation({
      isOpen: true,
      action,
      operation,
    });
    setShowDeleteMenu(false);
  };

  const confirmDelete = async () => {
    if (deleteConfirmation.operation) {
      await deleteConfirmation.operation();
    }
    setDeleteConfirmation({ isOpen: false, action: null });
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const getClinicHealthScore = (clinic: Clinic): number => {
    const checks = [
      !!clinic.name,
      !!clinic.street,
      !!clinic.city,
      !!clinic.state,
      !!clinic.phone,
      !!clinic.email,
      !!clinic.website,
      !!clinic.hours,
      !!(clinic.animals_treated && clinic.animals_treated.length > 0),
      !!(clinic.specializations && clinic.specializations.length > 0),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  };

  const getHealthScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreBadge = (score: number) => {
    if (score >= 80) {
      return (
        <Badge className='bg-green-100 text-green-800 border-green-200'>
          <CheckCircle size={12} className='mr-1' />
          Excellent ({score}%)
        </Badge>
      );
    }
    if (score >= 60) {
      return (
        <Badge className='bg-yellow-100 text-yellow-800 border-yellow-200'>
          <AlertCircle size={12} className='mr-1' />
          Good ({score}%)
        </Badge>
      );
    }
    return (
      <Badge className='bg-red-100 text-red-800 border-red-200'>
        <XCircle size={12} className='mr-1' />
        Needs Improvement ({score}%)
      </Badge>
    );
  };

  // ============================================================================
  // PERMISSION CHECKS
  // ============================================================================

  if (!canViewClinics(user)) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <Shield className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Access Denied
          </h2>
          <p className='text-gray-600'>
            You do not have permission to view clinic details.
          </p>
          <Button asChild className='mt-4'>
            <Link href='/admin'>Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // LOADING AND ERROR STATES
  // ============================================================================

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <LoadingSpinner size='lg' text='Loading clinic details...' />
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <AlertTriangle className='h-12 w-12 text-gray-400 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Clinic Not Found
          </h2>
          <p className='text-gray-600 mb-4'>
            The clinic you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href='/admin/clinics'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Clinics
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get enhanced status and health information
  const statusInfo = getClinicStatus(clinic);
  const healthScore = getClinicHealthScore(clinic);

  // ============================================================================
  // RENDER MAIN COMPONENT
  // ============================================================================

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
            <p className='text-gray-600'>{formatAddress(clinic)}</p>
          </div>
        </div>

        <div className='flex gap-2'>
          {/* Edit Button */}
          {canManageClinics(user) && (
            <PrimaryButton asChild>
              <Link href={`/admin/clinics/${clinic.id}/edit`}>
                <Edit className='h-4 w-4 mr-2' />
                Edit Clinic
              </Link>
            </PrimaryButton>
          )}

          {/* Delete Actions Dropdown */}
          {canDeleteClinics(user) && (
            <div className='relative'>
              <Button
                variant='outline'
                onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                disabled={isDeleting}
                className='border-red-200 text-red-600 hover:bg-red-50'
              >
                <MoreVertical className='h-4 w-4 mr-2' />
                Delete Options
              </Button>

              {showDeleteMenu && (
                <div className='absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
                  <div className='p-2'>
                    {deleteActions.map((action) => (
                      <button
                        key={action.type}
                        onClick={() => handleDeleteAction(action)}
                        disabled={isDeleting}
                        className='w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50'
                      >
                        <div className='flex items-start gap-3'>
                          <div
                            className={`mt-0.5 ${
                              action.type === 'hard'
                                ? 'text-red-600'
                                : 'text-orange-600'
                            }`}
                          >
                            {action.icon}
                          </div>
                          <div>
                            <div
                              className={`font-medium ${
                                action.type === 'hard'
                                  ? 'text-red-900'
                                  : 'text-orange-900'
                              }`}
                            >
                              {action.title}
                            </div>
                            <div className='text-sm text-gray-600'>
                              {action.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`p-4 rounded-lg border ${
          statusInfo.status === 'open'
            ? 'bg-green-50 border-green-200'
            : statusInfo.status === 'emergency'
            ? 'bg-red-50 border-red-200'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Activity
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
            {clinic.emergency && (
              <Badge variant='destructive' className='ml-2'>
                Emergency Clinic
              </Badge>
            )}
          </div>

          <div className='flex items-center gap-3'>
            {getHealthScoreBadge(healthScore)}
            <Badge
              variant={
                clinic.verification_status === 'verified'
                  ? 'default'
                  : 'secondary'
              }
              className={
                clinic.verification_status === 'verified'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : clinic.verification_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  : 'bg-red-100 text-red-800 border-red-200'
              }
            >
              {clinic.verification_status || 'verified'}
            </Badge>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Information */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Clinic Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Name
                  </label>
                  <p className='text-gray-900'>{clinic.name}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Phone
                  </label>
                  <p className='text-gray-900'>
                    {clinic.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <p className='text-gray-900'>
                    {clinic.email || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Website
                  </label>
                  <p className='text-gray-900'>
                    {clinic.website ? (
                      <a
                        href={clinic.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:underline'
                      >
                        {clinic.website}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                </div>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700'>
                  Address
                </label>
                <p className='text-gray-900'>{formatAddress(clinic)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          {clinic.hours && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='h-5 w-5' />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {Object.entries(clinic.hours).map(([day, hours]) => {
                    const isToday =
                      day.toLowerCase() ===
                      new Date()
                        .toLocaleDateString('en-US', { weekday: 'long' })
                        .toLowerCase();

                    return (
                      <div
                        key={day}
                        className={`flex justify-between p-2 rounded ${
                          isToday
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <span
                          className={`font-medium ${
                            isToday ? 'text-blue-900' : 'text-gray-700'
                          }`}
                        >
                          {day}
                          {isToday && (
                            <span className='ml-1 text-xs'>(Today)</span>
                          )}
                        </span>
                        <span
                          className={
                            isToday ? 'text-blue-800' : 'text-gray-600'
                          }
                        >
                          {typeof hours === 'string'
                            ? hours
                            : (hours as { open: string; close: string })
                                ?.open &&
                              (hours as { open: string; close: string })?.close
                            ? `${
                                (hours as { open: string; close: string }).open
                              } - ${
                                (hours as { open: string; close: string }).close
                              }`
                            : 'Closed'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Services & Specializations */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {clinic.animals_treated && clinic.animals_treated.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Animals Treated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {clinic.animals_treated.map((animal, index) => (
                      <Badge key={index} variant='outline'>
                        {animal}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {clinic.specializations && clinic.specializations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {clinic.specializations.map((spec, index) => (
                      <Badge key={index} variant='secondary'>
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {clinic.services_offered && clinic.services_offered.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  {clinic.services_offered.map((service, index) => (
                    <div key={index} className='flex items-center gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-600' />
                      <span className='text-gray-700'>{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
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

          {/* Clinic Health Score */}
          <Card>
            <CardHeader>
              <CardTitle>Clinic Profile Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-center'>
                <div
                  className={`text-3xl font-bold ${getHealthScoreColor(
                    healthScore
                  )}`}
                >
                  {healthScore}%
                </div>
                <p className='text-sm text-gray-600 mt-1'>
                  Profile Completeness
                </p>
                <div className='mt-4'>{getHealthScoreBadge(healthScore)}</div>
                {healthScore < 100 && (
                  <p className='text-xs text-gray-500 mt-2'>
                    Complete missing information to improve visibility
                  </p>
                )}
              </div>
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
                  <div className='space-y-2'>
                    <Button
                      variant='outline'
                      className='w-full border-orange-200 text-orange-600 hover:bg-orange-50'
                      onClick={() => handleDeleteAction(deleteActions[0])}
                      disabled={isDeleting}
                    >
                      <Archive size={16} className='mr-2' />
                      Archive Clinic
                    </Button>

                    <Button
                      variant='destructive'
                      className='w-full'
                      onClick={() => handleDeleteAction(deleteActions[1])}
                      disabled={isDeleting}
                    >
                      <Trash2 size={16} className='mr-2' />
                      {isDeleting ? 'Processing...' : 'Delete Permanently'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Clinic ID:</span>
                <span className='font-mono text-gray-900'>{clinic.id}</span>
              </div>
              {clinic.created_at && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Created:</span>
                  <span className='text-gray-900'>
                    {new Date(clinic.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              {clinic.updated_at && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Last Updated:</span>
                  <span className='text-gray-900'>
                    {new Date(clinic.updated_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.action && (
        <DeleteConfirmationDialog
          isOpen={deleteConfirmation.isOpen}
          onClose={() => setDeleteConfirmation({ isOpen: false, action: null })}
          onConfirm={confirmDelete}
          title={deleteConfirmation.action.confirmTitle}
          message={deleteConfirmation.action.confirmMessage}
          type={deleteConfirmation.action.type === 'soft' ? 'soft' : 'single'}
          isLoading={isDeleting}
        />
      )}

      {/* Click outside to close dropdown */}
      {showDeleteMenu && (
        <div
          className='fixed inset-0 z-0'
          onClick={() => setShowDeleteMenu(false)}
        />
      )}
    </div>
  );
}
