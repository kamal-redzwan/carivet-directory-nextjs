'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { seedDatabase } from '@/lib/seedDatabase';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { Clinic } from '@/types/clinic';
import { supabase } from '@/lib/supabase';
import { HeroPageLayout } from '@/components/layout/PageLayout';
import { SimpleHero } from '@/components/layout/HeroSection';

// ✅ IMPORT NEW ENHANCED COMPONENTS
import { EnhancedSearchPanel } from '@/components/search/EnhancedSearchPanel';
import { EnhancedClinicGrid } from '@/components/clinic/EnhancedClinicGrid';

// ✅ IMPORT CENTRALIZED BUSINESS LOGIC
import { SearchFilters } from '@/utils/businessLogic';

export default function ClinicsPage() {
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [_currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const searchParams = useSearchParams();

  // ✅ LOAD CLINICS USING EXISTING HOOK
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

  // ✅ INITIALIZE FILTERS FROM URL PARAMETERS
  useEffect(() => {
    if (!clinics) return;

    const emergency = searchParams.get('emergency');
    const service = searchParams.get('service');
    const state = searchParams.get('state');
    const animal = searchParams.get('animal');

    const initialFilters: SearchFilters = {
      query: '',
      state: state || undefined,
      emergency: emergency === 'true' ? true : undefined,
      services: service ? [service] : [],
      specializations: animal ? [animal] : [], // Map animal to specializations for now
    };

    setCurrentFilters(initialFilters);

    // Initialize with all clinics if no filters
    if (!emergency && !service && !state && !animal) {
      setFilteredClinics(clinics);
    }
  }, [searchParams, clinics]);

  // ✅ HANDLE FILTER CHANGES FROM SEARCH PANEL
  const handleFiltersChange = (filtered: Clinic[]) => {
    setFilteredClinics(filtered);
  };

  const handleFiltersUpdate = (filters: SearchFilters) => {
    setCurrentFilters(filters);
  };

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
      {/* ✅ ENHANCED HERO SECTION */}
      <SimpleHero
        title='Find Veterinary Clinics'
        subtitle='Discover the best veterinary care for your pets in Malaysia'
        size='sm'
      />

      {/* ✅ MAIN CONTENT WITH NEW COMPONENTS */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* ✅ ENHANCED SEARCH PANEL */}
          <div className='lg:col-span-1'>
            <EnhancedSearchPanel
              clinics={clinics || []}
              onFiltersChange={handleFiltersChange}
              onFiltersUpdate={handleFiltersUpdate}
            />
          </div>

          {/* ✅ ENHANCED CLINIC GRID */}
          <div className='lg:col-span-3'>
            <div className='space-y-4'>
              {/* View Mode Toggle */}
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Veterinary Clinics
                  </h2>
                  <p className='text-gray-600'>
                    {filteredClinics.length} clinic
                    {filteredClinics.length !== 1 ? 's' : ''} found
                  </p>
                </div>

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

              {/* ✅ ENHANCED CLINIC GRID */}
              <EnhancedClinicGrid
                clinics={filteredClinics}
                loading={loading}
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      </div>
    </HeroPageLayout>
  );
}
