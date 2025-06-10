'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Add this import
import { supabase } from '@/lib/supabase';
import { seedDatabase } from '@/lib/seedDatabase';
import { useClinicFilters } from '@/hooks/useClinicFilters';
import { Clinic } from '@/types/clinic';
import {
  Search,
  Clock,
  Shield,
  FileText,
  Heart,
  Scissors,
  Stethoscope,
  Syringe,
  PawPrint,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { HeroPageLayout } from '@/components/layout/PageLayout';
import { HeroWithSearch } from '@/components/layout/HeroSection';
import { LinkButton } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use our custom filter hook
  const { filterOptions } = useClinicFilters(clinics, '');

  const loadClinics = useCallback(async () => {
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
  }, []); // Empty dependency array since it doesn't depend on any props or state

  // Load clinics from Supabase
  useEffect(() => {
    loadClinics();
  }, [loadClinics]);

  const handleHeroSearch = (searchData: any) => {
    const searchParams = new URLSearchParams();

    if (searchData.location) {
      searchParams.set('state', searchData.location);
    }

    if (searchData.service) {
      // Map service names to match our filter system
      const serviceMap: { [key: string]: string } = {
        Vaccination: 'vaccination',
        Surgery: 'surgery',
        'Dental Care': 'dental-care',
        'Emergency Care': 'emergency-care',
        'Pet Grooming': 'grooming',
        'Pet Boarding': 'boarding',
      };

      if (searchData.service === 'Emergency Care') {
        searchParams.set('emergency', 'true');
      } else {
        const mappedService =
          serviceMap[searchData.service] ||
          searchData.service.toLowerCase().replace(' ', '-');
        searchParams.set('service', mappedService);
      }
    }

    if (searchData.animalType) {
      searchParams.set('animal', searchData.animalType.toLowerCase());
    }

    // Navigate to clinics page with filters
    const queryString = searchParams.toString();
    const url = queryString ? `/clinics?${queryString}` : '/clinics';
    window.location.href = url;
  };

  // Get featured clinics (first 3 for display)
  const featuredClinics = clinics.slice(0, 3);

  // Search configuration for hero
  const searchConfig = {
    filters: [
      {
        name: 'location',
        label: 'Location',
        options: filterOptions.states.map((state) => ({
          value: state,
          label: state,
        })),
      },
      {
        name: 'service',
        label: 'Service',
        options: [
          { value: 'Vaccination', label: 'Vaccination' },
          { value: 'Surgery', label: 'Surgery' },
          { value: 'Dental Care', label: 'Dental Care' },
          { value: 'Emergency Care', label: 'Emergency Care' },
          { value: 'Pet Grooming', label: 'Pet Grooming' },
          { value: 'Pet Boarding', label: 'Pet Boarding' },
        ],
      },
      {
        name: 'animalType',
        label: 'Animal Type',
        options: [
          { value: 'Dogs', label: 'Dogs' },
          { value: 'Cats', label: 'Cats' },
          { value: 'Birds', label: 'Birds' },
          { value: 'Rabbits', label: 'Rabbits' },
          { value: 'Small Mammals', label: 'Small Mammals' },
          { value: 'Exotic Pets', label: 'Exotic Pets' },
        ],
      },
    ],
    buttonText: 'Find Veterinary Clinics',
    onSearch: handleHeroSearch,
  };

  return (
    <HeroPageLayout
      title='CariVet - Find Veterinary Clinics in Malaysia'
      description='Find trusted veterinary clinics across Malaysia. CariVet helps pet owners locate the best veterinary care for their beloved animals.'
      loading={loading}
      error={error}
      onRetry={loadClinics}
      noPadding // Hero pages often handle their own padding
    >
      {/* Hero Section with Search */}
      <HeroWithSearch
        title='Find the Best Veterinary Care in Malaysia'
        subtitle='Locate trusted veterinary clinics for your pets with our comprehensive directory'
        variant='gradient'
        size='lg'
        searchConfig={searchConfig}
      />

      {/* Featured Clinics Section */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>
            Featured Veterinary Clinics
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {featuredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className='bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full'
              >
                {/* Placeholder Image */}
                <div className='h-48 bg-gray-200 flex items-center justify-center'>
                  <div className='text-center text-gray-400'>
                    <PawPrint size={48} className='mx-auto mb-2' />
                    <span className='text-sm'>Clinic Image</span>
                  </div>
                </div>

                <div className='p-6 flex flex-col flex-1'>
                  <div className='flex justify-between items-start mb-2'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {clinic.name}
                    </h3>
                    {clinic.emergency && (
                      <span className='bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full'>
                        Emergency
                      </span>
                    )}
                  </div>
                  <p className='text-gray-600 text-sm mb-4'>
                    {clinic.street}, {clinic.city}, {clinic.state}
                  </p>

                  <div className='space-y-2 mb-4 flex-1'>
                    <p className='text-sm text-gray-600'>
                      <strong>Animals:</strong>{' '}
                      {clinic.animals_treated.length > 0
                        ? clinic.animals_treated.slice(0, 3).join(', ')
                        : 'All animals'}
                    </p>
                    {clinic.specializations.length > 0 && (
                      <p className='text-sm text-gray-600'>
                        <strong>Specializations:</strong>{' '}
                        {clinic.specializations.slice(0, 2).join(', ')}
                      </p>
                    )}
                  </div>

                  <div className='flex gap-2 mb-4'>
                    <span className='bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded'>
                      Vaccination
                    </span>
                    <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'>
                      Surgery
                    </span>
                    <span className='bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded'>
                      Dental Care
                    </span>
                  </div>

                  <Link
                    href={`/clinic/${clinic.id}`}
                    className='block w-full text-center bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors mt-auto'
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className='text-center mt-8'>
            <LinkButton
              size='lg'
              rightIcon={<ChevronRight size={14} />}
              onClick={() => router.push('/clinics')}
              className='text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer'
            >
              View All Clinics
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Specialized Services Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Specialized Veterinary Services
            </h2>
            <p className='text-gray-600'>
              Find clinics that offer specialized care for your pets&apos;
              specific needs
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Emergency Care */}
            <div className='text-center p-6'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Clock className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Emergency Care
              </h3>
              <p className='text-gray-600 text-sm mb-4'>
                24/7 emergency veterinary services for urgent pet health issues
              </p>
              <LinkButton
                size='default'
                rightIcon={<ChevronRight size={14} />}
                onClick={() => router.push('/clinics?emergency=true')}
                className='text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer'
              >
                Find clinics
              </LinkButton>
            </div>

            {/* Surgery */}
            <div className='text-center p-6'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Stethoscope className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Surgery
              </h3>
              <p className='text-gray-600 text-sm mb-4'>
                Advanced surgical procedures performed by experienced
                veterinarians
              </p>
              <LinkButton
                size='default'
                rightIcon={<ChevronRight size={14} />}
                onClick={() => router.push('/clinics?service=surgery')}
                className='text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer'
              >
                Find clinics
              </LinkButton>
            </div>

            {/* Dental Care */}
            <div className='text-center p-6'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Heart className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Dental Care
              </h3>
              <p className='text-gray-600 text-sm mb-4'>
                Comprehensive dental services to maintain your pet&apos;s oral
                health
              </p>
              <LinkButton
                size='default'
                rightIcon={<ChevronRight size={14} />}
                onClick={() => router.push('/clinics?service=dental-care')}
                className='text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer'
              >
                Find clinics
              </LinkButton>
            </div>

            {/* Vaccination */}
            <div className='text-center p-6'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Syringe className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Vaccination
              </h3>
              <p className='text-gray-600 text-sm mb-4'>
                Essential vaccinations to protect your pets from common diseases
              </p>
              <LinkButton
                size='default'
                rightIcon={<ChevronRight size={14} />}
                onClick={() => router.push('/clinics?service=vaccination')}
                className='text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer'
              >
                Find clinics
              </LinkButton>
            </div>

            {/* Exotic Pet Care */}
            <div className='text-center p-6'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <PawPrint className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Exotic Pet Care
              </h3>
              <p className='text-gray-600 text-sm mb-4'>
                Specialized care for birds, reptiles, and other exotic pets
              </p>
              <LinkButton
                size='default'
                rightIcon={<ChevronRight size={14} />}
                onClick={() => router.push('/clinics?service=exotic-pet-care')}
                className='text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer'
              >
                Find clinics
              </LinkButton>
            </div>

            {/* Grooming */}
            <div className='text-center p-6'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Scissors className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Grooming
              </h3>
              <p className='text-gray-600 text-sm mb-4'>
                Professional grooming services to keep your pets clean and
                healthy
              </p>
              <LinkButton
                size='default'
                rightIcon={<ChevronRight size={14} />}
                onClick={() => router.push('/clinics?service=grooming')}
                className='text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer'
              >
                Find clinics
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use CariVet Section */}
      <section className='py-16 bg-emerald-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>
            Why Use CariVet?
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Easy Search */}
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Search className='h-8 w-8 text-emerald-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Easy Search
              </h3>
              <p className='text-gray-600'>
                Quickly find veterinary clinics near you with our powerful
                search tools
              </p>
            </div>

            {/* Trusted Information */}
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Shield className='h-8 w-8 text-emerald-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Trusted Information
              </h3>
              <p className='text-gray-600'>
                Accurate and up-to-date details about clinic services and
                specializations
              </p>
            </div>

            {/* Detailed Profiles */}
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FileText className='h-8 w-8 text-emerald-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Detailed Profiles
              </h3>
              <p className='text-gray-600'>
                View comprehensive information about each clinic to make
                informed decisions
              </p>
            </div>
          </div>
        </div>
      </section>
    </HeroPageLayout>
  );
}
