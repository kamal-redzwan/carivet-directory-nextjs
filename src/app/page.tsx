'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { seedDatabase } from '@/lib/seedDatabase';
import SearchBar from '@/components/SearchBar';
import ClinicCard from '@/components/ClinicCard';
import { Clinic } from '@/types/clinic';

export default function Home() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load clinics from Supabase
  useEffect(() => {
    loadClinics();
  }, []);

  // Filter clinics based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClinics(clinics);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clinics.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(query) ||
          clinic.city.toLowerCase().includes(query) ||
          clinic.state.toLowerCase().includes(query) ||
          clinic.animals_treated.some((animal) =>
            animal.toLowerCase().includes(query)
          ) ||
          clinic.specializations.some((spec) =>
            spec.toLowerCase().includes(query)
          ) ||
          clinic.services_offered.some((service) =>
            service.toLowerCase().includes(query)
          )
      );
      setFilteredClinics(filtered);
    }
  }, [searchQuery, clinics]);

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
      setFilteredClinics(data || []);
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
        {/* Results Header */}
        <div className='mb-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-semibold text-gray-900'>
              Veterinary Clinics
            </h2>
            <p className='text-gray-600'>
              {filteredClinics.length} clinic
              {filteredClinics.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {searchQuery && (
            <p className='text-gray-600 mt-2'>
              Showing results for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Results */}
        {filteredClinics.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>
              {searchQuery
                ? `No clinics found matching "${searchQuery}"`
                : 'No clinics available'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='mt-4 text-blue-600 hover:text-blue-800 underline'
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredClinics.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        )}
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
