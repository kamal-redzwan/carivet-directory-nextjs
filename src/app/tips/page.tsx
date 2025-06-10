'use client';

import { HeroPageLayout } from '@/components/layout/PageLayout';
import { SimpleHero } from '@/components/layout/HeroSection';
import { PawPrint, Heart, Shield, Clock } from 'lucide-react';

export default function PetCareTipsPage() {
  return (
    <HeroPageLayout
      title='Pet Care Tips - CariVet'
      description='Essential pet care tips and advice to help you keep your furry friends healthy and happy.'
      noPadding
    >
      {/* Hero Section */}
      <SimpleHero
        title='Pet Care Tips'
        subtitle='Essential advice for keeping your pets healthy and happy'
        size='md'
      />

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Introduction */}
        <section className='mb-16'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              Caring for Your Pet
            </h2>
            <p className='text-lg text-gray-600'>
              Taking care of a pet is a rewarding experience, but it also comes
              with responsibilities. Here are some essential tips to help you
              provide the best care for your furry friend.
            </p>
          </div>
        </section>

        {/* Tips Grid */}
        <section className='mb-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {/* Regular Veterinary Care */}
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4'>
                <PawPrint className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Regular Check-ups
              </h3>
              <p className='text-gray-600'>
                Schedule regular veterinary check-ups to ensure your pet&apos;s
                health and catch any potential issues early.
              </p>
            </div>

            {/* Proper Nutrition */}
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4'>
                <Heart className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Proper Nutrition
              </h3>
              <p className='text-gray-600'>
                Feed your pet a balanced diet appropriate for their age, size,
                and health condition. Consult your vet for specific dietary
                recommendations.
              </p>
            </div>

            {/* Exercise */}
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4'>
                <Clock className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Regular Exercise
              </h3>
              <p className='text-gray-600'>
                Keep your pet active with regular exercise to maintain their
                physical and mental well-being.
              </p>
            </div>

            {/* Safety */}
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4'>
                <Shield className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Safety First
              </h3>
              <p className='text-gray-600'>
                Create a safe environment for your pet by removing hazards and
                providing appropriate shelter and supervision.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Tips */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
            Essential Care Guidelines
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Daily Care */}
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                Daily Care
              </h3>
              <ul className='space-y-3 text-gray-600'>
                <li>• Provide fresh water daily</li>
                <li>• Clean food and water bowls regularly</li>
                <li>• Maintain a clean living environment</li>
                <li>• Spend quality time with your pet</li>
                <li>• Monitor for any changes in behavior</li>
              </ul>
            </div>

            {/* Health Care */}
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                Health Care
              </h3>
              <ul className='space-y-3 text-gray-600'>
                <li>• Keep vaccinations up to date</li>
                <li>• Maintain regular parasite prevention</li>
                <li>• Schedule annual check-ups</li>
                <li>• Monitor dental health</li>
                <li>• Keep emergency contacts handy</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className='text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-6'>
            Need Professional Help?
          </h2>
          <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
            If you have specific concerns about your pet&apos;s health or need
            professional advice, our directory can help you find a trusted
            veterinary clinic near you.
          </p>
          <a
            href='/clinics'
            className='inline-block bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors'
          >
            Find a Veterinary Clinic
          </a>
        </section>
      </main>
    </HeroPageLayout>
  );
}
