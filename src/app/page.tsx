'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { seedDatabase } from '@/lib/seedDatabase';
import SearchBar from '@/components/SearchBar';
import ClinicCard from '@/components/ClinicCard';
import FilterPanel from '@/components/FilterPanel';
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
  Facebook,
  Twitter,
  Instagram,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroFilters, setHeroFilters] = useState({
    location: '',
    service: '',
    animalType: '',
  });

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

  const handleHeroSearch = () => {
    const searchParams = new URLSearchParams();

    if (heroFilters.location) {
      searchParams.set('state', heroFilters.location);
    }

    if (heroFilters.service) {
      // Map service names to match our filter system
      const serviceMap: { [key: string]: string } = {
        Vaccination: 'vaccination',
        Surgery: 'surgery',
        'Dental Care': 'dental-care',
        'Emergency Care': 'emergency-care',
        'Pet Grooming': 'grooming',
        'Pet Boarding': 'boarding',
      };

      if (heroFilters.service === 'Emergency Care') {
        searchParams.set('emergency', 'true');
      } else {
        const mappedService =
          serviceMap[heroFilters.service] ||
          heroFilters.service.toLowerCase().replace(' ', '-');
        searchParams.set('service', mappedService);
      }
    }

    if (heroFilters.animalType) {
      searchParams.set('animal', heroFilters.animalType.toLowerCase());
    }

    // Navigate to clinics page with filters
    const queryString = searchParams.toString();
    const url = queryString ? `/clinics?${queryString}` : '/clinics';
    window.location.href = url;
  };

  // Get featured clinics (first 3 for display)
  const featuredClinics = clinics.slice(0, 3);

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
              <Link href='/' className='text-gray-900 hover:text-emerald-600'>
                Home
              </Link>
              <Link
                href='/clinics'
                className='text-gray-600 hover:text-emerald-600'
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
      <section className='bg-gradient-to-br from-emerald-500 to-emerald-600 text-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-6'>
            Find the Best Veterinary Care in Malaysia
          </h1>
          <p className='text-xl mb-8 text-emerald-100'>
            Locate trusted veterinary clinics for your pets with our
            comprehensive directory
          </p>

          {/* Search Form */}
          <div className='max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-lg'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Location
                </label>
                <select
                  value={heroFilters.location}
                  onChange={(e) =>
                    setHeroFilters({ ...heroFilters, location: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900'
                >
                  <option value=''>All Locations</option>
                  {filterOptions.states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Service
                </label>
                <select
                  value={heroFilters.service}
                  onChange={(e) =>
                    setHeroFilters({ ...heroFilters, service: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900'
                >
                  <option value=''>All Services</option>
                  <option value='Vaccination'>Vaccination</option>
                  <option value='Surgery'>Surgery</option>
                  <option value='Dental Care'>Dental Care</option>
                  <option value='Emergency Care'>Emergency Care</option>
                  <option value='Pet Grooming'>Pet Grooming</option>
                  <option value='Pet Boarding'>Pet Boarding</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Animal Type
                </label>
                <select
                  value={heroFilters.animalType}
                  onChange={(e) =>
                    setHeroFilters({
                      ...heroFilters,
                      animalType: e.target.value,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900'
                >
                  <option value=''>All Animals</option>
                  <option value='Dogs'>Dogs</option>
                  <option value='Cats'>Cats</option>
                  <option value='Birds'>Birds</option>
                  <option value='Rabbits'>Rabbits</option>
                  <option value='Small Mammals'>Small Mammals</option>
                  <option value='Exotic Pets'>Exotic Pets</option>
                </select>
              </div>
            </div>
            <div className='text-center'>
              <button
                onClick={handleHeroSearch}
                className='bg-emerald-600 text-white px-8 py-3 rounded-md hover:bg-emerald-700 font-medium'
              >
                Find Veterinary Clinics
              </button>
            </div>
          </div>
        </div>
      </section>

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
            <Link
              href='/clinics'
              className='inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium'
            >
              View All Clinics
              <ChevronRight size={16} className='ml-1' />
            </Link>
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
              Find clinics that offer specialized care for your pets' specific
              needs
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
              <Link
                href='/clinics?emergency=true'
                className='text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer'
              >
                Find clinics →
              </Link>
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
              <Link
                href='/clinics?service=surgery'
                className='text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer'
              >
                Find clinics →
              </Link>
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
                Comprehensive dental services to maintain your pet's oral health
              </p>
              <Link
                href='/clinics?service=dental-care'
                className='text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer'
              >
                Find clinics →
              </Link>
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
              <Link
                href='/clinics?service=vaccination'
                className='text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer'
              >
                Find clinics →
              </Link>
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
              <Link
                href='/clinics?service=exotic-pet-care'
                className='text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer'
              >
                Find clinics →
              </Link>
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
              <Link
                href='/clinics?service=grooming'
                className='text-emerald-600 hover:text-emerald-700 text-sm font-medium cursor-pointer'
              >
                Find clinics →
              </Link>
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

      {/* Footer */}
      <footer className='bg-emerald-600 text-white py-12'>
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
