'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { seedDatabase } from '@/lib/seedDatabase';
import { useClinicFilters } from '@/hooks/useClinicFilters';
import { Clinic } from '@/types/clinic';
import { PawPrint, Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('name');
  const searchParams = useSearchParams();

  // Use our custom filter hook
  const { filters, updateFilters, filteredClinics, filterOptions } =
    useClinicFilters(clinics, '');

  // Load clinics from Supabase
  useEffect(() => {
    loadClinics();
  }, []);

  // Apply URL parameters to filters
  useEffect(() => {
    const emergency = searchParams.get('emergency');
    const service = searchParams.get('service');
    const state = searchParams.get('state');
    const animal = searchParams.get('animal');

    const newFilters = { ...filters };

    if (emergency === 'true') {
      newFilters.emergency = true;
    }

    if (service) {
      // Convert service parameter to match our data
      const serviceMap: { [key: string]: string } = {
        surgery: 'Surgery',
        'dental-care': 'Dentistry',
        vaccination: 'Vaccination',
        'emergency-care': 'Emergency Services',
        grooming: 'Pet Grooming',
        boarding: 'Pet Boarding',
      };

      const mappedService = serviceMap[service] || service;
      newFilters.services = [mappedService];
    }

    if (state) {
      newFilters.state = state;
    }

    if (animal) {
      const animalMap: { [key: string]: string } = {
        dogs: 'dogs',
        cats: 'cats',
        birds: 'birds',
        rabbits: 'rabbits',
        'small mammals': 'small mammals',
        'exotic pets': 'exotic pets',
      };

      const mappedAnimal =
        animalMap[animal.toLowerCase()] || animal.toLowerCase();
      newFilters.animalTypes = [mappedAnimal];
    }

    // Only update if there are actual changes
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      updateFilters(newFilters);
    }
  }, [searchParams, filters, updateFilters]);

  async function loadClinics() {
    try {
      setLoading(true);
      await seedDatabase();

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

  // Sort clinics
  const sortedClinics = [...filteredClinics].sort((a, b) => {
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

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4'></div>
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
            className='px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Header Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className='bg-emerald-600 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-3xl font-bold mb-2'>Find Veterinary Clinics</h1>
          <p className='text-emerald-100'>
            Discover the best veterinary care for your pets in Malaysia
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar Filters */}
          <div className='lg:w-80 lg:flex-shrink-0'>
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-6'>
                Filter Clinics
              </h3>

              {/* Location */}
              <div className='mb-6'>
                <h4 className='text-sm font-medium text-gray-900 mb-3'>
                  Location
                </h4>
                <select
                  value={filters.state}
                  onChange={(e) =>
                    updateFilters({ ...filters, state: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-3'
                >
                  <option value=''>All Locations</option>
                  {filterOptions.states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Services */}
              <div className='mb-6'>
                <h4 className='text-sm font-medium text-gray-900 mb-3'>
                  Services
                </h4>
                <div className='space-y-2'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={
                        filters.services.includes('Vaccination') ||
                        filters.services.includes('vaccination')
                      }
                      onChange={(e) => {
                        const services = e.target.checked
                          ? [
                              ...filters.services.filter(
                                (s) =>
                                  s !== 'Vaccination' && s !== 'vaccination'
                              ),
                              'Vaccination',
                            ]
                          : filters.services.filter(
                              (s) => s !== 'Vaccination' && s !== 'vaccination'
                            );
                        updateFilters({ ...filters, services });
                      }}
                      className='w-4 h-4 text-emerald-600 border-gray-300 rounded'
                    />
                    <span className='ml-2 text-sm text-gray-700'>
                      Vaccination
                    </span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={
                        filters.services.includes('Surgery') ||
                        filters.services.includes('surgery')
                      }
                      onChange={(e) => {
                        const services = e.target.checked
                          ? [
                              ...filters.services.filter(
                                (s) => s !== 'Surgery' && s !== 'surgery'
                              ),
                              'Surgery',
                            ]
                          : filters.services.filter(
                              (s) => s !== 'Surgery' && s !== 'surgery'
                            );
                        updateFilters({ ...filters, services });
                      }}
                      className='w-4 h-4 text-emerald-600 border-gray-300 rounded'
                    />
                    <span className='ml-2 text-sm text-gray-700'>Surgery</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={
                        filters.services.includes('Dentistry') ||
                        filters.services.includes('Dental Care') ||
                        filters.services.includes('dental care')
                      }
                      onChange={(e) => {
                        const services = e.target.checked
                          ? [
                              ...filters.services.filter(
                                (s) =>
                                  s !== 'Dentistry' &&
                                  s !== 'Dental Care' &&
                                  s !== 'dental care'
                              ),
                              'Dental Care',
                            ]
                          : filters.services.filter(
                              (s) =>
                                s !== 'Dentistry' &&
                                s !== 'Dental Care' &&
                                s !== 'dental care'
                            );
                        updateFilters({ ...filters, services });
                      }}
                      className='w-4 h-4 text-emerald-600 border-gray-300 rounded'
                    />
                    <span className='ml-2 text-sm text-gray-700'>
                      Dental Care
                    </span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={
                        filters.services.includes('Pet Grooming') ||
                        filters.services.includes('Grooming') ||
                        filters.services.includes('grooming')
                      }
                      onChange={(e) => {
                        const services = e.target.checked
                          ? [
                              ...filters.services.filter(
                                (s) =>
                                  s !== 'Pet Grooming' &&
                                  s !== 'Grooming' &&
                                  s !== 'grooming'
                              ),
                              'Pet Grooming',
                            ]
                          : filters.services.filter(
                              (s) =>
                                s !== 'Pet Grooming' &&
                                s !== 'Grooming' &&
                                s !== 'grooming'
                            );
                        updateFilters({ ...filters, services });
                      }}
                      className='w-4 h-4 text-emerald-600 border-gray-300 rounded'
                    />
                    <span className='ml-2 text-sm text-gray-700'>Grooming</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={
                        filters.services.includes('Pet Boarding') ||
                        filters.services.includes('Boarding') ||
                        filters.services.includes('boarding')
                      }
                      onChange={(e) => {
                        const services = e.target.checked
                          ? [
                              ...filters.services.filter(
                                (s) =>
                                  s !== 'Pet Boarding' &&
                                  s !== 'Boarding' &&
                                  s !== 'boarding'
                              ),
                              'Pet Boarding',
                            ]
                          : filters.services.filter(
                              (s) =>
                                s !== 'Pet Boarding' &&
                                s !== 'Boarding' &&
                                s !== 'boarding'
                            );
                        updateFilters({ ...filters, services });
                      }}
                      className='w-4 h-4 text-emerald-600 border-gray-300 rounded'
                    />
                    <span className='ml-2 text-sm text-gray-700'>Boarding</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={filters.emergency}
                      onChange={(e) =>
                        updateFilters({
                          ...filters,
                          emergency: e.target.checked,
                        })
                      }
                      className='w-4 h-4 text-emerald-600 border-gray-300 rounded'
                    />
                    <span className='ml-2 text-sm text-gray-700'>
                      Emergency Care
                    </span>
                  </label>
                </div>
              </div>

              {/* Animal Type */}
              <div className='mb-6'>
                <h4 className='text-sm font-medium text-gray-900 mb-3'>
                  Animal Type
                </h4>
                <div className='space-y-2'>
                  {[
                    'Dogs',
                    'Cats',
                    'Birds',
                    'Rabbits',
                    'Small Mammals',
                    'Exotic Pets',
                    'Reptiles',
                    'Farm Animals',
                    'Wildlife',
                  ].map((animal) => (
                    <label key={animal} className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={filters.animalTypes.includes(
                          animal.toLowerCase()
                        )}
                        onChange={(e) => {
                          const animalTypes = e.target.checked
                            ? [...filters.animalTypes, animal.toLowerCase()]
                            : filters.animalTypes.filter(
                                (a) => a !== animal.toLowerCase()
                              );
                          updateFilters({ ...filters, animalTypes });
                        }}
                        className='w-4 h-4 text-emerald-600 border-gray-300 rounded'
                      />
                      <span className='ml-2 text-sm text-gray-700'>
                        {animal}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className='mb-6'>
                <h4 className='text-sm font-medium text-gray-900 mb-3'>
                  Additional Filters
                </h4>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={filters.emergency}
                    onChange={(e) =>
                      updateFilters({ ...filters, emergency: e.target.checked })
                    }
                    className='w-4 h-4 text-emerald-600 border-gray-300 rounded'
                  />
                  <span className='ml-2 text-sm text-gray-700'>
                    Emergency Services
                  </span>
                </label>
              </div>

              {/* Apply and Clear Buttons */}
              <div className='space-y-3'>
                <button className='w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 font-medium'>
                  Apply Filters
                </button>
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
                  className='w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50'
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className='flex-1'>
            {/* Active Filters Display */}
            {(filters.state ||
              filters.emergency ||
              filters.services.length > 0 ||
              filters.animalTypes.length > 0) && (
              <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                <h3 className='text-sm font-medium text-gray-900 mb-2'>
                  Active Filters:
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {filters.state && (
                    <span className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full'>
                      State: {filters.state}
                    </span>
                  )}
                  {filters.emergency && (
                    <span className='inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full'>
                      Emergency Services
                    </span>
                  )}
                  {filters.services.map((service) => (
                    <span
                      key={service}
                      className='inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full'
                    >
                      Service: {service}
                    </span>
                  ))}
                  {filters.animalTypes.map((animal) => (
                    <span
                      key={animal}
                      className='inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full'
                    >
                      Animal: {animal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold text-gray-900'>
                {sortedClinics.length} Clinics Found
                {filters.state && (
                  <span className='text-sm font-normal text-gray-600 ml-2'>
                    in {filters.state}
                  </span>
                )}
              </h2>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600'>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='px-3 py-1 border border-gray-300 rounded text-sm'
                >
                  <option value='name'>Name (A-Z)</option>
                  <option value='city'>City</option>
                  <option value='state'>State</option>
                </select>
              </div>
            </div>

            {/* Clinic Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {sortedClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full'
                >
                  {/* Placeholder Image */}
                  <div className='h-40 bg-gray-200 flex items-center justify-center'>
                    <div className='text-center text-gray-400'>
                      <PawPrint size={32} className='mx-auto mb-1' />
                      <span className='text-xs'>Clinic Image</span>
                    </div>
                  </div>

                  <div className='p-4 flex flex-col flex-1'>
                    <div className='flex justify-between items-start mb-2'>
                      <h3 className='font-semibold text-gray-900 text-sm leading-tight'>
                        {clinic.name}
                      </h3>
                      {clinic.emergency && (
                        <span className='bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0'>
                          Emergency
                        </span>
                      )}
                    </div>

                    <p className='text-gray-600 text-xs mb-3'>
                      {clinic.street}, {clinic.city}, {clinic.state}
                    </p>

                    <div className='mb-3 flex-1'>
                      <p className='text-xs text-gray-600 mb-1'>
                        <strong>Animals:</strong>{' '}
                        {clinic.animals_treated.length > 0
                          ? clinic.animals_treated.slice(0, 3).join(', ')
                          : 'Dogs, Cats, Birds, Small Mammals'}
                      </p>
                    </div>

                    {/* Service Tags */}
                    <div className='flex flex-wrap gap-1 mb-3'>
                      {/* Show Vaccination if it's a common service */}
                      <span className='bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded'>
                        Vaccination
                      </span>
                      {/* Show Surgery if available in services or specializations */}
                      {(clinic.services_offered?.some((s) =>
                        s.toLowerCase().includes('surgery')
                      ) ||
                        clinic.specializations?.some((s) =>
                          s.toLowerCase().includes('surgery')
                        ) ||
                        clinic.specializations?.some((s) =>
                          s.toLowerCase().includes('orthopedic')
                        )) && (
                        <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'>
                          Surgery
                        </span>
                      )}
                      {/* Show Dental Care if available */}
                      {(clinic.services_offered?.some((s) =>
                        s.toLowerCase().includes('dental')
                      ) ||
                        clinic.specializations?.some((s) =>
                          s.toLowerCase().includes('dentistry')
                        )) && (
                        <span className='bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded'>
                          Dental Care
                        </span>
                      )}
                      {/* Show Grooming if available */}
                      {clinic.services_offered?.some((s) =>
                        s.toLowerCase().includes('grooming')
                      ) && (
                        <span className='bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded'>
                          Grooming
                        </span>
                      )}
                      {/* Show more indicator if there are additional services */}
                      {(clinic.services_offered?.length || 0) +
                        (clinic.specializations?.length || 0) >
                        4 && (
                        <span className='text-xs text-gray-500'>
                          +
                          {(clinic.services_offered?.length || 0) +
                            (clinic.specializations?.length || 0) -
                            4}{' '}
                          more
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/clinic/${clinic.id}`}
                      className='block w-full text-center bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm mt-auto'
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {sortedClinics.length === 0 && (
              <div className='text-center py-12'>
                <PawPrint size={48} className='mx-auto text-gray-400 mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No clinics found
                </h3>
                <p className='text-gray-600'>
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
