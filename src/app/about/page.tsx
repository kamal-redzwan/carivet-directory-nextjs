'use client';

import { Navbar } from '@/components/layout/Navbar';
import {
  PawPrint,
  Facebook,
  Twitter,
  Instagram,
  Search,
  FileText,
  Eye,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

export default function AboutCariVetPage() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Header Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className='bg-emerald-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl font-bold mb-4'>About CariVet</h1>
          <p className='text-xl text-emerald-100'>
            Connecting pet owners with quality veterinary care across Malaysia
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Our Mission */}
        <section className='mb-16 text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Our Mission</h2>

          <div className='space-y-6 text-gray-600 leading-relaxed'>
            <p>
              CariVet was created with a simple mission: to help pet owners in
              Malaysia quickly find the right veterinary care for their beloved
              animals. We understand that finding the right veterinary clinic
              can be challenging, especially when you need specialized services
              or emergency care.
            </p>

            <p>
              Our platform provides a comprehensive directory of veterinary
              clinics across Malaysia, complete with detailed information about
              services, specializations, operating hours, and contact details.
              We aim to make the process of finding veterinary care as simple
              and stress-free as possible.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-12 text-center'>
            What We Offer
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Comprehensive Search */}
            <div className='text-center'>
              <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Search className='h-8 w-8 text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Comprehensive Search
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Find clinics based on location, services offered, animal types
                treated, and more with our powerful search and filtering tools.
              </p>
            </div>

            {/* Detailed Information */}
            <div className='text-center'>
              <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FileText className='h-8 w-8 text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Detailed Information
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Access comprehensive details about each clinic, including
                services, specializations, operating hours, and contact
                information.
              </p>
            </div>

            {/* Emergency Services */}
            <div className='text-center'>
              <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Eye className='h-8 w-8 text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Emergency Services
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Quickly identify clinics that offer emergency veterinary
                services when your pet needs urgent care.
              </p>
            </div>

            {/* Nationwide Coverage */}
            <div className='text-center'>
              <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <MapPin className='h-8 w-8 text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Nationwide Coverage
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Our directory includes veterinary clinics from across Malaysia,
                helping you find care no matter where you are.
              </p>
            </div>
          </div>
        </section>

        {/* For Veterinary Clinics */}
        <section>
          <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
            For Veterinary Clinics
          </h2>

          <div className='text-gray-600 leading-relaxed mb-8'>
            <p>
              Are you a veterinary clinic in Malaysia? Join our directory to
              increase your visibility and connect with pet owners in your area.
              Our platform helps showcase your services, specializations, and
              unique offerings to potential clients.
            </p>
          </div>

          {/* Get Listed Section */}
          <div className='bg-emerald-50 rounded-lg p-8 text-center'>
            <h3 className='text-2xl font-semibold text-gray-900 mb-4'>
              Get Listed
            </h3>
            <p className='text-gray-600 mb-6 leading-relaxed'>
              If you&apos;d like to add your clinic to our directory or update
              your existing information, please contact us. We&apos;re committed
              to providing accurate and up-to-date information to pet owners.
            </p>
            <Link
              href='/contact'
              className='inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium'
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>

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
