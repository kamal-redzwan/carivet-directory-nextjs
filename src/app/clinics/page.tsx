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
  const [isSeeded, setIsSeeded] = useState(false);
  const searchParams = useSearchParams();

  // ✅ SEPARATE SEEDING LOGIC - RUNS ONLY ONCE
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('Checking if database needs seeding...');

        // Check if data already exists
        const { data: existingClinics, error: checkError } = await supabase
          .from('clinics')
          .select('id')
          .limit(1);

        if (checkError) {
          console.error('Error checking existing data:', checkError);
          setIsSeeded(true);
          return;
        }

        // Only seed if no data exists
        if (!existingClinics || existingClinics.length === 0) {
          console.log('No data found. Seeding database...');
          try {
            await seedDatabase();
            console.log('Database seeded successfully');
          } catch (seedError) {
            console.error('Seeding error:', seedError);
            // Continue anyway - maybe table exists but is empty
          }
        } else {
          console.log('Data already exists. Skipping seeding.');
        }

        setIsSeeded(true);
      } catch (error) {
        console.error('Error initializing database:', error);
        setIsSeeded(true); // Still allow the app to continue
      }
    };

    initializeDatabase();
  }, []);

  // ✅ LOAD CLINICS DIRECTLY - BYPASS THE HOOK
  const [clinics, setClinics] = useState<Clinic[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const loadClinics = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading clinics directly...');

      const { data, error: queryError } = await supabase
        .from('clinics')
        .select('*')
        .order('name');

      console.log('Direct load result:', {
        data: data?.length,
        error: queryError,
      });

      if (queryError) {
        console.error('Query error details:', {
          message: queryError.message,
          details: queryError.details,
          hint: queryError.hint,
          code: queryError.code,
        });
        setError(queryError);
      } else {
        setClinics(data || []);
        console.log('Clinics loaded successfully:', data?.length);
        console.log('First clinic sample:', data?.[0]);
      }
    } catch (err) {
      console.error('Direct load error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Load clinics when seeding is complete
  useEffect(() => {
    if (!isSeeded) return;

    console.log('Seeding complete, loading clinics...');
    loadClinics();
  }, [isSeeded]);

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

  // Show loading while seeding
  if (!isSeeded) {
    return (
      <HeroPageLayout
        title='Find Veterinary Clinics - CariVet Malaysia'
        description='Discover the best veterinary care for your pets in Malaysia'
        loading={true}
        background='white'
        noPadding={true}
      >
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Initializing database...</p>
          </div>
        </div>
      </HeroPageLayout>
    );
  }

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
            {clinics && clinics.length > 0 ? (
              <EnhancedSearchPanel
                clinics={clinics}
                onFiltersChange={handleFiltersChange}
                onFiltersUpdate={handleFiltersUpdate}
              />
            ) : (
              <div className='bg-gray-50 rounded-lg p-4'>
                <p className='text-gray-600'>Loading search options...</p>
              </div>
            )}
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
              {clinics && clinics.length > 0 ? (
                <EnhancedClinicGrid
                  clinics={filteredClinics}
                  loading={loading}
                  viewMode={viewMode}
                />
              ) : (
                <div className='bg-gray-50 rounded-lg p-8 text-center'>
                  <p className='text-gray-600'>
                    {loading ? 'Loading clinics...' : 'No clinics available'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </HeroPageLayout>
  );
}
