'use client';

import { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { Clinic } from '@/types/clinic';
import {
  Search,
  Plus,
  Building,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading';
import { toast } from 'sonner';

// ✅ IMPORT NEW ENHANCED COMPONENTS
import { EnhancedClinicGrid } from '@/components/clinic/EnhancedClinicGrid';

// ✅ IMPORT CENTRALIZED BUSINESS LOGIC
import {
  searchClinics,
  sortClinics,
  isCurrentlyOpen,
  SearchFilters,
} from '@/utils/businessLogic';

// ✅ IMPORT PERMISSION UTILITIES
import { canManageClinics, canDeleteClinics } from '@/utils/permissions';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminClinicsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedClinics, setSelectedClinics] = useState<string[]>([]);

  // ✅ LOAD CLINICS
  const {
    data: clinics,
    loading,
    error,
    refetch: loadClinics,
  } = useSupabaseQuery<Clinic[]>(
    async () => {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('name');

      if (error) throw error;
      return { data: data || [], error: null };
    },
    [],
    { enabled: true, refetchOnMount: true }
  );

  // ✅ FILTER AND SEARCH LOGIC
  const filteredClinics = useMemo(() => {
    if (!clinics) return [];

    const filters: SearchFilters = {
      query: searchTerm,
      state: stateFilter !== 'all' ? stateFilter : undefined,
    };

    let filtered = searchClinics(clinics, filters);

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((clinic) => {
        const actualStatus = clinic.verification_status || 'verified';
        return actualStatus === statusFilter;
      });
    }

    return sortClinics(filtered, 'name', 'asc');
  }, [clinics, searchTerm, statusFilter, stateFilter]);

  // ✅ GET UNIQUE STATES FOR FILTER
  const uniqueStates = useMemo(() => {
    if (!clinics) return [];
    return [...new Set(clinics.map((c) => c.state))].filter(Boolean).sort();
  }, [clinics]);

  // ✅ REAL-TIME STATISTICS
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

  // ✅ HANDLE BULK SELECTION
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

  // ✅ HANDLE CLINIC DELETION
  const handleDelete = async (clinicId: string, clinicName: string) => {
    if (!canDeleteClinics(user)) {
      toast.error('You do not have permission to delete clinics');
      return;
    }

    if (!confirm(`Delete "${clinicName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', clinicId);

      if (error) throw error;

      toast.success(`${clinicName} deleted successfully`);
      loadClinics(); // Refresh the list
    } catch (error) {
      console.error('Error deleting clinic:', error);
      toast.error('Failed to delete clinic');
    }
  };

  // ✅ GET STATUS BADGE
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
      default:
        return <Badge variant='outline'>Unknown</Badge>;
    }
  };

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
        <p className='text-red-600 mb-4'>Error loading clinics: {error}</p>
        <Button onClick={loadClinics}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* ✅ ENHANCED HEADER */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Clinic Management
          </h1>
          <p className='text-gray-600'>
            Manage and monitor all veterinary clinics
          </p>
        </div>
        {canManageClinics(user) && (
          <Button asChild>
            <Link href='/admin/clinics/new'>
              <Plus className='h-4 w-4 mr-2' />
              Add New Clinic
            </Link>
          </Button>
        )}
      </div>

      {/* ✅ ENHANCED STATS CARDS */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Clinics</CardTitle>
            <Building className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.total}</div>
            <p className='text-xs text-muted-foreground'>Registered clinics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Currently Open
            </CardTitle>
            <Clock className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {stats.open}
            </div>
            <p className='text-xs text-muted-foreground'>Open right now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Emergency Services
            </CardTitle>
            <Shield className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {stats.emergency}
            </div>
            <p className='text-xs text-muted-foreground'>24/7 services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Verified</CardTitle>
            <CheckCircle className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {stats.verified}
            </div>
            <p className='text-xs text-muted-foreground'>Verified clinics</p>
          </CardContent>
        </Card>
      </div>

      {/* ✅ ENHANCED FILTERS AND SEARCH */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Filter className='h-5 w-5' />
              Search & Filter
            </CardTitle>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>View:</span>
              <div className='flex border border-gray-300 rounded-md'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 text-sm ${
                    viewMode === 'grid'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm ${
                    viewMode === 'list'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
              </div>
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

      {/* ✅ ENHANCED CLINICS DISPLAY */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Clinics ({filteredClinics.length})</CardTitle>
            {selectedClinics.length > 0 && (
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600'>
                  {selectedClinics.length} selected
                </span>
                <Button variant='outline' size='sm'>
                  Bulk Actions
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
          ) : (
            <>
              {viewMode === 'grid' ? (
                // ✅ USE ENHANCED CLINIC GRID
                <EnhancedClinicGrid
                  clinics={filteredClinics}
                  loading={loading}
                  viewMode='grid'
                />
              ) : (
                // ✅ ENHANCED LIST VIEW
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
                      className='grid grid-cols-1 lg:grid-cols-12 gap-4 py-4 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors items-center'
                    >
                      {/* Selection Checkbox */}
                      <div className='hidden lg:block lg:col-span-1'>
                        <input
                          type='checkbox'
                          checked={selectedClinics.includes(clinic.id)}
                          onChange={() => handleSelectClinic(clinic.id)}
                          className='rounded border-gray-300'
                        />
                      </div>

                      {/* Clinic Details */}
                      <div className='col-span-1 lg:col-span-4'>
                        <div className='font-medium text-gray-900 mb-1'>
                          {clinic.name}
                        </div>
                        <div className='text-sm text-gray-600 space-y-1'>
                          {clinic.phone && (
                            <div className='flex items-center gap-1'>
                              <span>📞 {clinic.phone}</span>
                            </div>
                          )}
                          {clinic.emergency && (
                            <div className='flex items-center gap-1'>
                              <Shield size={12} className='text-red-500' />
                              <span className='text-red-600 text-xs font-medium'>
                                Emergency Services
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div className='col-span-1 lg:col-span-2'>
                        <div className='text-sm text-gray-900'>
                          {clinic.city}
                        </div>
                        <div className='text-xs text-gray-600'>
                          {clinic.state}
                        </div>
                      </div>

                      {/* Status */}
                      <div className='col-span-1 lg:col-span-2 space-y-1'>
                        {getStatusBadge(clinic.verification_status)}
                        <div className='text-xs'>
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

                      {/* Actions */}
                      <div className='col-span-1 lg:col-span-3 flex gap-2 justify-start lg:justify-center'>
                        <Button variant='ghost' size='sm' asChild>
                          <Link href={`/admin/clinics/${clinic.id}`}>View</Link>
                        </Button>
                        {canManageClinics(user) && (
                          <Button variant='ghost' size='sm' asChild>
                            <Link href={`/admin/clinics/${clinic.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                        )}
                        {canDeleteClinics(user) && (
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-red-600 hover:text-red-800'
                            onClick={() => handleDelete(clinic.id, clinic.name)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
