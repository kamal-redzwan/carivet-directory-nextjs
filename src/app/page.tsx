'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { seedDatabase } from '@/lib/seedDatabase';
import SearchBar from '@/components/SearchBar';
import ClinicCard from '@/components/ClinicCard';
import FilterPanel from '@/components/FilterPanel';
import { useClinicFilters } from '@/hooks/useClinicFilters';
import { Clinic } from '@/types/clinic';

export default function Home() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use our custom filter hook
  const { filters, updateFilters, filteredClinics, filterOptions } =
    useClinicFilters(clinics, searchQuery);

  // Load clinics from Supabase
  useEffect(() => {
    loadClinics();
  }, []);

  async function loadClinics() {
    try {
      setLoading(true);

      // First, try to seed the database if it's empty
      await seedDatabase();

      // Then load all clinics
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setClinics(data || []);
    } catch (error) {
      console.error('Error loading clinics:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to load clinics'
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading veterinary clinics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>Error: {error}</p>
          <button
            onClick={loadClinics}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasActiveFilters =
    filters.state ||
    filters.city ||
    filters.emergency ||
    filters.animalTypes.length > 0 ||
    filters.services.length > 0;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='text-center mb-8'>
            <h1 className='text-4xl font-bold text-gray-900 mb-2'>
              CariVet Directory
            </h1>
            <p className='text-xl text-gray-600'>
              Find trusted veterinary clinics across Malaysia
            </p>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder='Search by clinic name, location, services, or animal type...'
          />
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Filter Panel */}
          <div className='lg:w-80 lg:flex-shrink-0'>
            <FilterPanel
              filters={filters}
              onFilterChange={updateFilters}
              availableStates={filterOptions.states}
              availableCities={filterOptions.cities}
              availableAnimalTypes={filterOptions.animalTypes}
              availableServices={filterOptions.services}
            />
          </div>

          {/* Results Section */}
          <div className='flex-1'>
            {/* Results Header */}
            <div className='mb-6'>
              <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-semibold text-gray-900'>
                  Veterinary Clinics
                </h2>
                <div className='text-right'>
                  <p className='text-gray-600'>
                    {filteredClinics.length} clinic
                    {filteredClinics.length !== 1 ? 's' : ''} found
                  </p>
                  {clinics.length !== filteredClinics.length && (
                    <p className='text-sm text-gray-500'>
                      from {clinics.length} total clinics
                    </p>
                  )}
                </div>
              </div>

              {/* Active filters summary */}
              {(searchQuery || hasActiveFilters) && (
                <div className='mt-4 flex flex-wrap gap-2'>
                  {searchQuery && (
                    <span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full'>
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {filters.state && (
                    <span className='inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full'>
                      State: {filters.state}
                    </span>
                  )}
                  {filters.city && (
                    <span className='inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full'>
                      City: {filters.city}
                    </span>
                  )}
                  {filters.emergency && (
                    <span className='inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full'>
                      Emergency Services
                    </span>
                  )}
                  {filters.animalTypes.map((animal) => (
                    <span
                      key={animal}
                      className='inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full'
                    >
                      {animal}
                    </span>
                  ))}
                  {filters.services.map((service) => (
                    <span
                      key={service}
                      className='inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full'
                    >
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Results */}
            {filteredClinics.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-gray-500 text-lg mb-4'>
                  {searchQuery || hasActiveFilters
                    ? 'No clinics found matching your criteria'
                    : 'No clinics available'}
                </p>
                {(searchQuery || hasActiveFilters) && (
                  <div className='space-x-4'>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className='text-blue-600 hover:text-blue-800 underline'
                      >
                        Clear search
                      </button>
                    )}
                    {hasActiveFilters && (
                      <button
                        onClick={() =>
                          updateFilters({
                            state: '',
                            city: '',
                            emergency: false,
                            animalTypes: [],
                            services: [],
                          })
                        }
                        className='text-blue-600 hover:text-blue-800 underline'
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {filteredClinics.map((clinic) => (
                  <ClinicCard key={clinic.id} clinic={clinic} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-white border-t mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center text-gray-600'>
            <p>
              &copy; 2025 CariVet Directory. Connecting pets with quality
              veterinary care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
