'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { seedDatabase } from '@/lib/seedDatabase';
import { useClinicFilters } from '@/hooks/useClinicFilters';
import { Clinic } from '@/types/clinic';
import { PawPrint, Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';

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

    if (emergency === 'true') {
      updateFilters({ ...filters, emergency: true });
    }

    if (service) {
      // Convert service parameter to match our data
      const serviceMap: { [key: string]: string } = {
        surgery: 'Surgery',
        'dental-care': 'Dentistry',
        vaccination: 'Vaccination',
        'emergency-care': 'Emergency Services',
        'exotic-pet-care': 'Exotic Pet Care',
        grooming: 'Pet Grooming',
      };

      const mappedService = serviceMap[service] || service;
      updateFilters({
        ...filters,
        services: [mappedService],
      });
    }
  }, [searchParams]);

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
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            {/* Logo */}
            <div className='flex items-center'>
              <PawPrint className='h-8 w-8 text-emerald-600 mr-2' />
              <span className='text-xl font-bold text-gray-900'>CariVet</span>
            </div>

            {/* Navigation */}
            <nav className='hidden md:flex space-x-8'>
              <Link href='/' className='text-gray-600 hover:text-emerald-600'>
                Home
              </Link>
              <Link
                href='/clinics'
                className='text-gray-900 hover:text-emerald-600'
              >
                Find Clinics
              </Link>
              <Link
                href='/tips'
                className='text-gray-600 hover:text-emerald-600'
              >
                Pet Care Tips
              </Link>
              <Link
                href='/blog'
                className='text-gray-600 hover:text-emerald-600'
              >
                Blog
              </Link>
              <Link
                href='/about'
                className='text-gray-600 hover:text-emerald-600'
              >
                About
              </Link>
              <Link
                href='/contact'
                className='text-gray-600 hover:text-emerald-600'
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

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
                      checked={filters.services.includes('Vaccination')}
                      onChange={(e) => {
                        const services = e.target.checked
                          ? [...filters.services, 'Vaccination']
                          : filters.services.filter((s) => s !== 'Vaccination');
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
                      checked={filters.services.includes('Surgery')}
                      onChange={(e) => {
                        const services = e.target.checked
                          ? [...filters.services, 'Surgery']
                          : filters.services.filter((s) => s !== 'Surgery');
                        updateFilters({ ...filters, services });
                      }}
                      className='w-4 h-4 text-emerald-600 border-gray-300 rounded'
                    />
                    <span className='ml-2 text-sm text-gray-700'>Surgery</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={filters.services.includes('Dentistry')}
                      onChange={(e) => {
                        const services = e.target.checked
                          ? [...filters.services, 'Dentistry']
                          : filters.services.filter((s) => s !== 'Dentistry');
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
                      checked={filters.services.includes('Pet Grooming')}
                      onChange={(e) => {
                        const services = e.target.checked
                          ? [...filters.services, 'Pet Grooming']
                          : filters.services.filter(
                              (s) => s !== 'Pet Grooming'
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
                      checked={filters.services.includes('Pet Boarding')}
                      onChange={(e) => {
                        const services = e.target.checked
                          ? [...filters.services, 'Pet Boarding']
                          : filters.services.filter(
                              (s) => s !== 'Pet Boarding'
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
            {/* Results Header */}
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold text-gray-900'>
                {sortedClinics.length} Clinics Found
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
                      <span className='bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded'>
                        Vaccination
                      </span>
                      <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'>
                        Surgery
                      </span>
                      <span className='bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded'>
                        Dental Care
                      </span>
                      {clinic.services_offered.length > 3 && (
                        <span className='text-xs text-gray-500'>
                          +{clinic.services_offered.length - 3} more
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
      <footer className='bg-emerald-600 text-white py-12 mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {/* CariVet Info */}
            <div>
              <div className='flex items-center mb-4'>
                <PawPrint className='h-6 w-6 mr-2' />
                <span className='text-lg font-bold'>CariVet</span>
              </div>
              <p className='text-emerald-100 text-sm'>
                Helping pet owners in Malaysia find the right veterinary care
                for their beloved animals.
              </p>
              <div className='flex space-x-4 mt-4'>
                <Facebook className='h-5 w-5 text-emerald-200 hover:text-white cursor-pointer' />
                <Twitter className='h-5 w-5 text-emerald-200 hover:text-white cursor-pointer' />
                <Instagram className='h-5 w-5 text-emerald-200 hover:text-white cursor-pointer' />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
              <ul className='space-y-2 text-emerald-100'>
                <li>
                  <Link href='/' className='hover:text-white'>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href='/clinics' className='hover:text-white'>
                    Find Clinics
                  </Link>
                </li>
                <li>
                  <Link href='/tips' className='hover:text-white'>
                    Pet Care Tips
                  </Link>
                </li>
                <li>
                  <Link href='/blog' className='hover:text-white'>
                    Veterinary Blog
                  </Link>
                </li>
                <li>
                  <Link href='/about' className='hover:text-white'>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href='/contact' className='hover:text-white'>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Resources</h4>
              <ul className='space-y-2 text-emerald-100'>
                <li>
                  <Link href='/tips' className='hover:text-white'>
                    Pet Care Tips
                  </Link>
                </li>
                <li>
                  <Link href='/blog' className='hover:text-white'>
                    Veterinary Blog
                  </Link>
                </li>
                <li>
                  <Link href='/emergency' className='hover:text-white'>
                    Emergency Services
                  </Link>
                </li>
                <li>
                  <Link href='/add-clinic' className='hover:text-white'>
                    Add Your Clinic
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Legal</h4>
              <ul className='space-y-2 text-emerald-100'>
                <li>
                  <Link href='/privacy' className='hover:text-white'>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href='/terms' className='hover:text-white'>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href='/cookies' className='hover:text-white'>
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-emerald-500 mt-8 pt-8 text-center text-emerald-100'>
            <p>&copy; 2025 CariVet Malaysia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
