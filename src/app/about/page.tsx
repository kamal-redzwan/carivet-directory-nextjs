'use client';

import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { HeroPageLayout } from '@/components/layout/PageLayout';
import { Heart, PawPrint, Users, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutCariVetPage() {
  return (
    <HeroPageLayout
      title='About CariVet - Your Trusted Veterinary Directory'
      description="Learn about CariVet, Malaysia's leading veterinary directory service connecting pet owners with trusted veterinary clinics."
    >
      {/* Hero Section */}
      <section className='bg-emerald-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl font-bold mb-4'>About CariVet</h1>
          <p className='text-xl text-emerald-100'>
            Connecting pet owners with trusted veterinary care across Malaysia
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Our Mission */}
        <section className='mb-16'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              Our Mission
            </h2>
            <p className='text-lg text-gray-600'>
              At CariVet, we believe that every pet deserves access to quality
              veterinary care. Our mission is to make it easier for pet owners
              to find and connect with trusted veterinary clinics across
              Malaysia, ensuring that pets receive the best possible care when
              they need it most.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
            What We Do
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4'>
                <PawPrint className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Veterinary Directory
              </h3>
              <p className='text-gray-600'>
                Comprehensive listing of veterinary clinics across Malaysia with
                detailed information about services, facilities, and expertise.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4'>
                <Heart className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Pet Care Resources
              </h3>
              <p className='text-gray-600'>
                Educational content and resources to help pet owners make
                informed decisions about their pets&apos; health and well-being.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4'>
                <Users className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Community Support
              </h3>
              <p className='text-gray-600'>
                Building a community of pet owners and veterinary professionals
                who share knowledge and experiences.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4'>
                <Globe className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Nationwide Coverage
              </h3>
              <p className='text-gray-600'>
                Extensive network of veterinary clinics covering all major
                cities and regions in Malaysia.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className='mb-16'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6 text-center'>
              Our Story
            </h2>
            <div className='prose prose-emerald max-w-none'>
              <p className='text-gray-600 mb-4'>
                CariVet was founded in 2023 with a simple yet powerful vision:
                to make veterinary care more accessible to pet owners across
                Malaysia. We recognized the challenges that pet owners face when
                trying to find reliable veterinary care, especially in times of
                emergency.
              </p>
              <p className='text-gray-600 mb-4'>
                What started as a small directory has grown into a comprehensive
                platform that connects thousands of pet owners with trusted
                veterinary clinics every day. Our commitment to quality and
                transparency has made us the go-to resource for pet owners
                seeking veterinary care in Malaysia.
              </p>
              <p className='text-gray-600'>
                Today, we continue to expand our network and enhance our
                services to better serve the needs of both pet owners and
                veterinary professionals. We believe that by making veterinary
                care more accessible, we can help improve the health and
                well-being of pets across the country.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
            Our Values
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Trust & Reliability
              </h3>
              <p className='text-gray-600'>
                We verify and maintain high standards for all veterinary clinics
                listed on our platform to ensure pet owners can trust the care
                their pets receive.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Accessibility
              </h3>
              <p className='text-gray-600'>
                We believe that quality veterinary care should be accessible to
                all pet owners, regardless of their location or circumstances.
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Community
              </h3>
              <p className='text-gray-600'>
                We foster a supportive community where pet owners and veterinary
                professionals can share knowledge and experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className='text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-6'>
            Join Our Community
          </h2>
          <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
            Whether you&apos;re a pet owner looking for veterinary care or a
            veterinary professional interested in listing your clinic, we invite
            you to join our growing community.
          </p>
          <div className='flex justify-center gap-4'>
            <PrimaryButton size='lg' asChild>
              <Link href='/clinics'>Find a Clinic</Link>
            </PrimaryButton>
            <SecondaryButton
              size='lg'
              asChild
              className='border-emerald-600 text-emerald-600 hover:bg-emerald-50'
            >
              <Link href='/contact'>Contact Us</Link>
            </SecondaryButton>
          </div>
        </section>
      </main>
    </HeroPageLayout>
  );
}
