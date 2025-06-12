'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { seedDatabase } from '@/lib/seedDatabase';
import { useClinicFilters } from '@/hooks/useClinicFilters';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/hooks/useSupabaseMutation';
import { Clinic } from '@/types/clinic';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { HeroPageLayout } from '@/components/layout/PageLayout';
import { SimpleHero } from '@/components/layout/HeroSection';
import { SearchHeader } from '@/components/data/SearchHeader';
import { FilterPanel } from '@/components/data/FilterPanel';
import { DataTable } from '@/components/data/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ClinicContactInfo } from '@/components/common/ClinicContactInfo';
import { Button } from '@/components/ui/button';

type FilterState = {
  state: string;
  city: string;
  emergency: boolean;
  animalTypes: string[];
  services: string[];
};

export default function ClinicsPage() {
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();

  // Load clinics using useSupabaseQuery
  const {
    data: clinics,
    loading,
    error,
    refetch: loadClinics,
  } = useSupabaseQuery<Clinic[]>(
    async () => {
      // Seed database first
      await seedDatabase();

      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('name');

      if (error) throw error;

      return { data: data || [], error: null };
    },
    [], // No dependencies - load once
    { enabled: true, refetchOnMount: true }
  );

  // Delete clinic mutation
  const deleteMutation = useSupabaseMutation<void, string>(
    async (clinicId: string) => {
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', clinicId);

      if (error) throw error;

      return { data: null, error: null };
    }
  );

  // Use our custom filter hook
  const { filters, updateFilters, filteredClinics, filterOptions } =
    useClinicFilters(clinics || [], '');

  // Apply URL parameters to filters on mount
  React.useEffect(() => {
    const emergency = searchParams.get('emergency');
    const service = searchParams.get('service');
    const state = searchParams.get('state');
    const animal = searchParams.get('animal');

    if (!emergency && !service && !state && !animal) return;

    const newFilters: FilterState = {
      state: state || '',
      city: '',
      emergency: emergency === 'true',
      animalTypes: animal ? [animal] : [],
      services: service ? [service] : [],
    };

    updateFilters(newFilters);
  }, [searchParams, updateFilters]);

  // Sort clinics
  const sortedClinics = useMemo(() => {
    return [...filteredClinics].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'city':
          return a.city.localeCompare(b.city);
        case 'state':
          return a.state.localeCompare(b.state);
        default:
          return 0;
      }
    });
  }, [filteredClinics, sortBy]);

  // Handle clinic deletion
  const handleDelete = async (clinicId: string, clinicName: string) => {
    if (!window.confirm(`Delete "${clinicName}"? This cannot be undone.`)) {
      return;
    }

    await deleteMutation.mutate(clinicId);

    if (!deleteMutation.error) {
      // Refresh the clinics list
      loadClinics();
    }
  };

  // Prepare filter groups for FilterPanel
  const filterGroups = [
    {
      key: 'state',
      label: 'State',
      type: 'radio' as const,
      options: [
        { value: '', label: 'All States' },
        ...filterOptions.states.map((state) => ({
          value: state,
          label: state,
          count: clinics?.filter((c) => c.state === state).length,
        })),
      ],
      value: filters.state,
      onChange: (value: string | string[]) =>
        updateFilters({ ...filters, state: value as string, city: '' }),
    },
    {
      key: 'emergency',
      label: 'Emergency Services',
      type: 'checkbox' as const,
      options: [
        {
          value: 'emergency',
          label: 'Emergency Available',
          count: clinics?.filter((c) => c.emergency).length,
        },
      ],
      value: filters.emergency ? ['emergency'] : [],
      onChange: (value: string | string[]) =>
        updateFilters({
          ...filters,
          emergency: (value as string[]).includes('emergency'),
        }),
    },
    {
      key: 'services',
      label: 'Services',
      type: 'checkbox' as const,
      options: [
        'Vaccination',
        'Surgery',
        'Dental Care',
        'Emergency Care',
        'Pet Grooming',
        'Pet Boarding',
      ].map((service) => ({
        value: service,
        label: service,
      })),
      value: filters.services,
      onChange: (value: string | string[]) =>
        updateFilters({ ...filters, services: value as string[] }),
    },
  ];

  // Calculate active filters count
  const activeFiltersCount = [
    filters.state,
    filters.emergency,
    ...filters.services,
    ...filters.animalTypes,
  ].filter(Boolean).length;

  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Clinic Name',
      sortable: true,
      render: (clinic: Clinic) => (
        <div>
          <div className='font-medium text-gray-900 mb-1'>{clinic.name}</div>
          <ClinicContactInfo
            clinic={clinic}
            variant='compact'
            showSocial={false}
          />
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (clinic: Clinic) => (
        <div>
          <div className='text-sm text-gray-900'>{clinic.city}</div>
          <div className='text-xs text-gray-600'>{clinic.state}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (clinic: Clinic) => (
        <div className='space-y-1'>
          <StatusBadge
            status={clinic.emergency ? 'emergency' : 'regular'}
            size='sm'
          />
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (clinic: Clinic) => (
        <div className='flex gap-1'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/clinic/${clinic.id}`}>View</Link>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='text-red-600 hover:text-red-800'
            onClick={() => handleDelete(clinic.id, clinic.name)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <HeroPageLayout
      title='Find Veterinary Clinics - CariVet Malaysia'
      description='Discover the best veterinary care for your pets in Malaysia'
      loading={loading}
      error={error}
      onRetry={loadClinics}
      background='white'
      noPadding={true}
    >
      {/* Hero Section */}
      <SimpleHero
        title='Find Veterinary Clinics'
        subtitle='Discover the best veterinary care for your pets in Malaysia'
        size='sm'
      />

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='space-y-6'>
          {/* Search Header */}
          <SearchHeader
            title='Veterinary Clinics'
            subtitle={`${sortedClinics.length} clinics found`}
            searchValue=''
            onSearchChange={() => {}} // Search is handled by filters
            showFilters={true}
            onToggleFilters={() => setShowFilters(!showFilters)}
            stats={[
              { label: 'Total Clinics', value: clinics?.length || 0 },
              {
                label: 'Emergency Services',
                value: clinics?.filter((c) => c.emergency).length || 0,
              },
              { label: 'States Covered', value: filterOptions.states.length },
            ]}
          />

          <div className='flex flex-col lg:flex-row gap-6'>
            {/* Sidebar Filters */}
            {showFilters && (
              <div className='lg:w-80 lg:flex-shrink-0'>
                <FilterPanel
                  filterGroups={filterGroups}
                  activeFiltersCount={activeFiltersCount}
                  onClearAll={() =>
                    updateFilters({
                      state: '',
                      city: '',
                      emergency: false,
                      animalTypes: [],
                      services: [],
                    })
                  }
                />
              </div>
            )}

            {/* Main Content */}
            <div className='flex-1'>
              <DataTable
                data={sortedClinics}
                columns={columns}
                loading={loading}
                searchable={false} // Search handled by filters
                sortable={true}
                emptyMessage='No clinics found. Try adjusting your filters.'
                actions={
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className='px-3 py-1 border border-gray-300 rounded text-sm'
                  >
                    <option value='name'>Sort by Name</option>
                    <option value='city'>Sort by City</option>
                    <option value='state'>Sort by State</option>
                  </select>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </HeroPageLayout>
  );
}
