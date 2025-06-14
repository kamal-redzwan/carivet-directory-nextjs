'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Clinic } from '@/types/clinic';
import { useAuth } from '@/contexts/AuthContext';
import { Button, PrimaryButton } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Archive,
  CheckCircle,
  Clock,
  XCircle,
  Building,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

// Import the delete operations hook and components
import {
  useDeleteOperations,
  DeleteProgressIndicator,
  BulkDeleteActions,
  DeleteConfirmationDialog,
} from '@/app/admin/clinics/deleteOperations';

// Import existing utilities
import {
  canViewClinics,
  canManageClinics,
  canDeleteClinics,
} from '@/utils/permissions';
import { isCurrentlyOpen } from '@/utils/formatters';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EnhancedAdminClinicsPage() {
  const { user } = useAuth();

  // State management
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClinics, setSelectedClinics] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'single' | 'bulk' | 'soft';
    clinicId?: string;
    clinicName?: string;
    operation?: () => Promise<void>;
  }>({
    isOpen: false,
    type: 'single',
  });

  // Initialize delete operations hook
  const {
    isDeleting,
    deleteProgress,
    deleteSingleClinic,
    deleteBulkClinics,
    softDeleteClinic,
  } = useDeleteOperations(user);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  const loadClinics = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('name');

      if (error) throw error;
      setClinics(data || []);
    } catch (error) {
      console.error('Error loading clinics:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to load clinics'
      );
      toast.error('Failed to load clinics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canViewClinics(user)) {
      loadClinics();
    }
  }, [user]);

  // ============================================================================
  // FILTERING AND SEARCH
  // ============================================================================

  const filteredClinics = useMemo(() => {
    if (!clinics) return [];

    const filtered = clinics.filter((clinic) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          clinic.name.toLowerCase().includes(searchLower) ||
          clinic.city.toLowerCase().includes(searchLower) ||
          clinic.state.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        const actualStatus = clinic.verification_status || 'verified';
        if (actualStatus !== statusFilter) return false;
      }

      // State filter
      if (stateFilter !== 'all') {
        if (clinic.state !== stateFilter) return false;
      }

      return true;
    });

    return filtered;
  }, [clinics, searchTerm, statusFilter, stateFilter]);

  const uniqueStates = useMemo(() => {
    if (!clinics) return [];
    return [...new Set(clinics.map((c) => c.state))].filter(Boolean).sort();
  }, [clinics]);

  // Statistics
  const stats = useMemo(() => {
    if (!clinics) return { total: 0, open: 0, emergency: 0, verified: 0 };

    const open = clinics.filter((clinic) => isCurrentlyOpen(clinic.hours));
    const emergency = clinics.filter((clinic) => clinic.emergency);
    const verified = clinics.filter(
      (clinic) => (clinic.verification_status || 'verified') === 'verified'
    );

    return {
      total: clinics.length,
      open: open.length,
      emergency: emergency.length,
      verified: verified.length,
    };
  }, [clinics]);

  // ============================================================================
  // SELECTION HANDLERS
  // ============================================================================

  const handleSelectClinic = (clinicId: string) => {
    setSelectedClinics((prev) =>
      prev.includes(clinicId)
        ? prev.filter((id) => id !== clinicId)
        : [...prev, clinicId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClinics.length === filteredClinics.length) {
      setSelectedClinics([]);
    } else {
      setSelectedClinics(filteredClinics.map((clinic) => clinic.id));
    }
  };

  const clearSelection = () => {
    setSelectedClinics([]);
  };

  // ============================================================================
  // DELETE HANDLERS
  // ============================================================================

  const handleSingleDelete = (clinicId: string, clinicName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'single',
      clinicId,
      clinicName,
      operation: async () => {
        const result = await deleteSingleClinic(clinicId, clinicName);
        if (result.success) {
          await loadClinics();
        }
      },
    });
  };

  const handleBulkDelete = () => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'bulk',
      operation: async () => {
        const result = await deleteBulkClinics(selectedClinics);
        if (result.success) {
          clearSelection();
          await loadClinics();
        }
      },
    });
  };

  const handleBulkSoftDelete = () => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'soft',
      operation: async () => {
        // Process soft delete for each selected clinic
        let successCount = 0;
        for (const clinicId of selectedClinics) {
          const clinic = clinics.find((c) => c.id === clinicId);
          if (clinic) {
            const result = await softDeleteClinic(clinicId, clinic.name);
            if (result.success) {
              successCount++;
            }
          }
        }

        if (successCount > 0) {
          clearSelection();
          await loadClinics();
          toast.success(
            `${successCount} clinic${
              successCount > 1 ? 's' : ''
            } archived successfully`
          );
        }
      },
    });
  };

  const confirmDelete = async () => {
    if (deleteConfirmation.operation) {
      await deleteConfirmation.operation();
      setDeleteConfirmation({ isOpen: false, type: 'single' });
    }
  };

  // ============================================================================
  // STATUS BADGE HELPER
  // ============================================================================

  const getStatusBadge = (status: string | undefined) => {
    const actualStatus = status || 'verified';

    switch (actualStatus) {
      case 'verified':
        return (
          <Badge
            variant='default'
            className='bg-green-100 text-green-800 border-green-200'
          >
            <CheckCircle size={12} className='mr-1' />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge
            variant='secondary'
            className='bg-yellow-100 text-yellow-800 border-yellow-200'
          >
            <Clock size={12} className='mr-1' />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge
            variant='destructive'
            className='bg-red-100 text-red-800 border-red-200'
          >
            <XCircle size={12} className='mr-1' />
            Rejected
          </Badge>
        );
      case 'archived':
        return (
          <Badge
            variant='outline'
            className='bg-gray-100 text-gray-800 border-gray-200'
          >
            <Archive size={12} className='mr-1' />
            Archived
          </Badge>
        );
      default:
        return <Badge variant='outline'>Unknown</Badge>;
    }
  };

  // ============================================================================
  // PERMISSION CHECK
  // ============================================================================

  if (!canViewClinics(user)) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Access Denied
          </h2>
          <p className='text-gray-600'>
            You do not have permission to view the clinic management page.
          </p>
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
        <LoadingSpinner size='lg' text='Loading clinics...' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
        <p className='text-red-600 mb-4'>Error loading clinics: {error}</p>
        <Button onClick={loadClinics}>Try Again</Button>
      </div>
    );
  }

  // ============================================================================
  // RENDER MAIN COMPONENT
  // ============================================================================

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Clinic Management
          </h1>
          <p className='text-gray-600'>
            Manage veterinary clinics and their information
          </p>
        </div>
        {canManageClinics(user) && (
          <PrimaryButton asChild>
            <Link href='/admin/clinics/new'>
              <Plus className='h-4 w-4 mr-2' />
              Add New Clinic
            </Link>
          </PrimaryButton>
        )}
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center'>
              <Building className='h-8 w-8 text-blue-600' />
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Clinics
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center'>
              <CheckCircle className='h-8 w-8 text-green-600' />
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Currently Open
                </p>
                <p className='text-2xl font-bold text-gray-900'>{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center'>
              <AlertTriangle className='h-8 w-8 text-red-600' />
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Emergency</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.emergency}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center'>
              <CheckCircle className='h-8 w-8 text-emerald-600' />
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Verified</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.verified}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Search & Filter</CardTitle>
            <div className='flex items-center border rounded-lg'>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-sm rounded-l-lg ${
                  viewMode === 'grid'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className='h-4 w-4' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm rounded-r-lg ${
                  viewMode === 'list'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className='h-4 w-4' />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search clinics by name, city, or state...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='verified'>Verified</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='rejected'>Rejected</SelectItem>
                <SelectItem value='archived'>Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='All States' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All States</SelectItem>
                {uniqueStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {canDeleteClinics(user) && (
        <BulkDeleteActions
          selectedCount={selectedClinics.length}
          onDelete={handleBulkDelete}
          onSoftDelete={handleBulkSoftDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* Clinics List */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Clinics ({filteredClinics.length})</CardTitle>
            {selectedClinics.length > 0 && (
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600'>
                  {selectedClinics.length} selected
                </span>
                <Button variant='outline' size='sm' onClick={clearSelection}>
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredClinics.length === 0 ? (
            <div className='text-center py-12'>
              <Building className='h-12 w-12 text-gray-300 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                No clinics found
              </h3>
              <p className='text-gray-600 mb-4'>
                {searchTerm || statusFilter !== 'all' || stateFilter !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'Get started by adding your first clinic'}
              </p>
              {canManageClinics(user) && (
                <Button asChild>
                  <Link href='/admin/clinics/new'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add New Clinic
                  </Link>
                </Button>
              )}
            </div>
          ) : viewMode === 'list' ? (
            // List View
            <div className='space-y-4'>
              {/* List Header */}
              <div className='hidden lg:grid lg:grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-lg font-medium text-sm text-gray-600'>
                <div className='col-span-1 flex items-center'>
                  <input
                    type='checkbox'
                    checked={
                      selectedClinics.length === filteredClinics.length &&
                      filteredClinics.length > 0
                    }
                    onChange={handleSelectAll}
                    className='rounded border-gray-300'
                  />
                </div>
                <div className='col-span-4'>Clinic Details</div>
                <div className='col-span-2'>Location</div>
                <div className='col-span-2'>Status</div>
                <div className='col-span-3 text-center'>Actions</div>
              </div>

              {/* List Items */}
              {filteredClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className='grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  {/* Selection Checkbox */}
                  <div className='col-span-1 flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedClinics.includes(clinic.id)}
                      onChange={() => handleSelectClinic(clinic.id)}
                      className='rounded border-gray-300'
                    />
                  </div>

                  {/* Clinic Details */}
                  <div className='col-span-1 lg:col-span-4'>
                    <div className='flex items-start gap-3'>
                      <div className='flex-1'>
                        <h3 className='font-semibold text-gray-900 mb-1'>
                          {clinic.name}
                        </h3>
                        <p className='text-sm text-gray-600 mb-2'>
                          {clinic.phone && (
                            <span className='mr-3'>📞 {clinic.phone}</span>
                          )}
                          {clinic.email && <span>✉️ {clinic.email}</span>}
                        </p>
                        <div className='flex flex-wrap gap-1'>
                          {clinic.emergency && (
                            <Badge variant='destructive' className='text-xs'>
                              Emergency
                            </Badge>
                          )}
                          <Badge
                            variant={
                              isCurrentlyOpen(clinic.hours)
                                ? 'default'
                                : 'secondary'
                            }
                            className={`text-xs ${
                              isCurrentlyOpen(clinic.hours)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {isCurrentlyOpen(clinic.hours) ? 'Open' : 'Closed'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className='col-span-1 lg:col-span-2'>
                    <p className='text-sm text-gray-900 font-medium'>
                      {clinic.city}
                    </p>
                    <p className='text-sm text-gray-600'>{clinic.state}</p>
                  </div>

                  {/* Status */}
                  <div className='col-span-1 lg:col-span-2'>
                    {getStatusBadge(clinic.verification_status)}
                  </div>

                  {/* Actions */}
                  <div className='col-span-1 lg:col-span-3 flex gap-2 justify-start lg:justify-center'>
                    <Button variant='ghost' size='sm' asChild>
                      <Link href={`/admin/clinics/${clinic.id}`}>
                        <Eye className='h-4 w-4' />
                      </Link>
                    </Button>
                    {canManageClinics(user) && (
                      <Button variant='ghost' size='sm' asChild>
                        <Link href={`/admin/clinics/${clinic.id}/edit`}>
                          <Edit className='h-4 w-4' />
                        </Link>
                      </Button>
                    )}
                    {canDeleteClinics(user) && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600 hover:text-red-800 hover:bg-red-50'
                        onClick={() =>
                          handleSingleDelete(clinic.id, clinic.name)
                        }
                        disabled={isDeleting}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Grid View
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredClinics.map((clinic) => (
                <Card
                  key={clinic.id}
                  className='hover:shadow-md transition-shadow'
                >
                  <CardHeader className='pb-3'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <CardTitle className='text-lg'>{clinic.name}</CardTitle>
                        <p className='text-sm text-gray-600 mt-1'>
                          {clinic.city}, {clinic.state}
                        </p>
                      </div>
                      <input
                        type='checkbox'
                        checked={selectedClinics.includes(clinic.id)}
                        onChange={() => handleSelectClinic(clinic.id)}
                        className='rounded border-gray-300'
                      />
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='flex flex-wrap gap-2'>
                      {getStatusBadge(clinic.verification_status)}
                      {clinic.emergency && (
                        <Badge variant='destructive' className='text-xs'>
                          Emergency
                        </Badge>
                      )}
                      <Badge
                        variant={
                          isCurrentlyOpen(clinic.hours)
                            ? 'default'
                            : 'secondary'
                        }
                        className={`text-xs ${
                          isCurrentlyOpen(clinic.hours)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {isCurrentlyOpen(clinic.hours) ? 'Open' : 'Closed'}
                      </Badge>
                    </div>

                    <div className='flex justify-between pt-2'>
                      <Button variant='outline' size='sm' asChild>
                        <Link href={`/admin/clinics/${clinic.id}`}>
                          <Eye className='h-4 w-4 mr-1' />
                          View
                        </Link>
                      </Button>

                      <div className='flex gap-1'>
                        {canManageClinics(user) && (
                          <Button variant='outline' size='sm' asChild>
                            <Link href={`/admin/clinics/${clinic.id}/edit`}>
                              <Edit className='h-4 w-4' />
                            </Link>
                          </Button>
                        )}
                        {canDeleteClinics(user) && (
                          <Button
                            variant='outline'
                            size='sm'
                            className='text-red-600 hover:text-red-800 hover:bg-red-50'
                            onClick={() =>
                              handleSingleDelete(clinic.id, clinic.name)
                            }
                            disabled={isDeleting}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, type: 'single' })}
        onConfirm={confirmDelete}
        title={
          deleteConfirmation.type === 'single'
            ? 'Delete Clinic'
            : deleteConfirmation.type === 'soft'
            ? 'Archive Clinics'
            : 'Delete Multiple Clinics'
        }
        message={
          deleteConfirmation.type === 'single'
            ? `Are you sure you want to delete "${deleteConfirmation.clinicName}"?`
            : deleteConfirmation.type === 'soft'
            ? `Are you sure you want to archive ${
                selectedClinics.length
              } clinic${selectedClinics.length > 1 ? 's' : ''}?`
            : `Are you sure you want to delete ${
                selectedClinics.length
              } clinic${selectedClinics.length > 1 ? 's' : ''}?`
        }
        type={deleteConfirmation.type}
        isLoading={isDeleting}
      />

      {/* Delete Progress Indicator */}
      {deleteProgress && (
        <DeleteProgressIndicator
          current={deleteProgress.current}
          total={deleteProgress.total}
          message={
            deleteConfirmation.type === 'soft'
              ? 'Archiving clinics...'
              : 'Deleting clinics...'
          }
        />
      )}
    </div>
  );
}
