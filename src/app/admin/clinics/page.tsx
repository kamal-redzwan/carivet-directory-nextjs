'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Download,
  Upload,
  Search,
  Edit,
  Trash2,
  Eye,
  Phone,
  Globe,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading';
import { supabase } from '@/lib/supabase';
import { Clinic } from '@/types/clinic';
import Link from 'next/link';

interface ClinicWithStatus extends Clinic {
  verification_status?: 'pending' | 'verified' | 'rejected';
}

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState<ClinicWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [selectedClinics, setSelectedClinics] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load clinics from Supabase
  useEffect(() => {
    loadClinics();
  }, []);

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
    } catch (err) {
      console.error('Error loading clinics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load clinics');
    } finally {
      setLoading(false);
    }
  };

  // Get unique states for filter
  const uniqueStates = [...new Set(clinics.map((c) => c.state))]
    .filter(Boolean)
    .sort();

  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch =
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (clinic.verification_status || 'verified') === statusFilter;

    const matchesState = stateFilter === 'all' || clinic.state === stateFilter;

    return matchesSearch && matchesStatus && matchesState;
  });

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

  const handleDelete = async (clinicId: string, clinicName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${clinicName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', clinicId);

      if (error) throw error;

      // Reload clinics after deletion
      await loadClinics();
    } catch (err) {
      console.error('Error deleting clinic:', err);
      alert('Failed to delete clinic');
    }
  };

  // Calculate stats
  const stats = {
    total: clinics.length,
    verified: clinics.filter(
      (c) => (c.verification_status || 'verified') === 'verified'
    ).length,
    pending: clinics.filter(
      (c) => (c.verification_status || 'verified') === 'pending'
    ).length,
    emergency: clinics.filter((c) => c.emergency).length,
  };

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Error Loading Clinics
          </h3>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button onClick={loadClinics}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Clinic Management
          </h1>
          <p className='text-gray-600'>
            Manage veterinary clinics and their information
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='outline' size='sm'>
            <Download size={16} className='mr-2' />
            Export
          </Button>
          <Button variant='outline' size='sm'>
            <Upload size={16} className='mr-2' />
            Import
          </Button>
          <Button
            size='sm'
            className='bg-emerald-600 hover:bg-emerald-700'
            asChild
          >
            <Link href='/admin/clinics/new'>
              <Plus size={16} className='mr-2' />
              Add Clinic
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Clinics
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.total}
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                <MapPin className='w-6 h-6 text-blue-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Verified</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.verified}
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                <CheckCircle className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>
              {stats.total > 0
                ? Math.round((stats.verified / stats.total) * 100)
                : 0}
              % verification rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Pending</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.pending}
                </p>
              </div>
              <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center'>
                <Clock className='w-6 h-6 text-yellow-600' />
              </div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Emergency</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.emergency}
                </p>
              </div>
              <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
                <AlertCircle className='w-6 h-6 text-red-600' />
              </div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>24/7 services</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Filters</CardTitle>
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

      {/* Clinics Table */}
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
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <LoadingSpinner size='lg' text='Loading clinics...' />
            </div>
          ) : (
            <div className='space-y-4'>
              {/* Desktop Table View */}
              <div className='hidden lg:block'>
                {/* Table Header */}
                <div className='grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-lg font-medium text-sm text-gray-600 mb-2'>
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
                  <div className='col-span-4'>Clinic Name</div>
                  <div className='col-span-2'>Location</div>
                  <div className='col-span-1'>Status</div>
                  <div className='col-span-1'>Emergency</div>
                  <div className='col-span-3 text-center'>Actions</div>
                </div>

                {/* Table Rows */}
                {filteredClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className='grid grid-cols-12 gap-4 py-4 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-2 items-center'
                  >
                    <div className='col-span-1'>
                      <input
                        type='checkbox'
                        checked={selectedClinics.includes(clinic.id)}
                        onChange={() => handleSelectClinic(clinic.id)}
                        className='rounded border-gray-300'
                      />
                    </div>

                    <div className='col-span-4'>
                      <div className='font-medium text-gray-900 mb-1'>
                        {clinic.name}
                      </div>
                      <div className='text-sm text-gray-600 flex items-center gap-3'>
                        {clinic.phone && (
                          <span className='flex items-center gap-1'>
                            <Phone size={12} />
                            {clinic.phone}
                          </span>
                        )}
                        {clinic.website && (
                          <span className='flex items-center gap-1'>
                            <Globe size={12} />
                            <a
                              href={clinic.website}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-600 hover:underline'
                            >
                              Website
                            </a>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='col-span-2'>
                      <div className='text-sm text-gray-900'>{clinic.city}</div>
                      <div className='text-xs text-gray-600'>
                        {clinic.state}
                      </div>
                    </div>

                    <div className='col-span-1'>
                      {getStatusBadge(clinic.verification_status)}
                    </div>

                    <div className='col-span-1'>
                      {clinic.emergency ? (
                        <Badge
                          variant='destructive'
                          className='bg-red-100 text-red-800 border-red-200'
                        >
                          <AlertCircle size={12} className='mr-1' />
                          24/7
                        </Badge>
                      ) : (
                        <Badge variant='outline'>Regular</Badge>
                      )}
                    </div>

                    <div className='col-span-3'>
                      <div className='flex items-center justify-center gap-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          title='View Details'
                          asChild
                        >
                          <Link href={`/admin/clinics/${clinic.id}`}>
                            <Eye size={14} />
                          </Link>
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          title='Edit Clinic'
                          asChild
                        >
                          <Link href={`/admin/clinics/${clinic.id}/edit`}>
                            <Edit size={14} />
                          </Link>
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          title='View Public Page'
                          asChild
                        >
                          <Link href={`/clinic/${clinic.id}`} target='_blank'>
                            <ExternalLink size={14} />
                          </Link>
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-red-600 hover:text-red-800'
                          title='Delete Clinic'
                          onClick={() => handleDelete(clinic.id, clinic.name)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile/Tablet Card View */}
              <div className='lg:hidden space-y-4'>
                {filteredClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1'>
                        <h3 className='font-medium text-gray-900 mb-1'>
                          {clinic.name}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {clinic.city}, {clinic.state}
                        </p>
                      </div>
                      <input
                        type='checkbox'
                        checked={selectedClinics.includes(clinic.id)}
                        onChange={() => handleSelectClinic(clinic.id)}
                        className='rounded border-gray-300 mt-1'
                      />
                    </div>

                    <div className='flex flex-wrap gap-2 mb-3'>
                      {getStatusBadge(clinic.verification_status)}
                      {clinic.emergency ? (
                        <Badge
                          variant='destructive'
                          className='bg-red-100 text-red-800 border-red-200'
                        >
                          <AlertCircle size={12} className='mr-1' />
                          24/7
                        </Badge>
                      ) : (
                        <Badge variant='outline'>Regular</Badge>
                      )}
                    </div>

                    <div className='flex items-center gap-2 mb-3 text-sm text-gray-600'>
                      {clinic.phone && (
                        <span className='flex items-center gap-1'>
                          <Phone size={12} />
                          {clinic.phone}
                        </span>
                      )}
                      {clinic.website && (
                        <span className='flex items-center gap-1'>
                          <Globe size={12} />
                          <a
                            href={clinic.website}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'
                          >
                            Website
                          </a>
                        </span>
                      )}
                    </div>

                    <div className='flex items-center gap-1 pt-3 border-t border-gray-100'>
                      <Button
                        variant='ghost'
                        size='sm'
                        title='View Details'
                        asChild
                      >
                        <Link href={`/admin/clinics/${clinic.id}`}>
                          <Eye size={14} />
                        </Link>
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        title='Edit Clinic'
                        asChild
                      >
                        <Link href={`/admin/clinics/${clinic.id}/edit`}>
                          <Edit size={14} />
                        </Link>
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        title='View Public Page'
                        asChild
                      >
                        <Link href={`/clinic/${clinic.id}`} target='_blank'>
                          <ExternalLink size={14} />
                        </Link>
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600 hover:text-red-800'
                        title='Delete Clinic'
                        onClick={() => handleDelete(clinic.id, clinic.name)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredClinics.length === 0 && !loading && (
                <div className='text-center py-12'>
                  <div className='text-gray-500 mb-2'>No clinics found</div>
                  <div className='text-sm text-gray-400'>
                    Try adjusting your search or filters
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
