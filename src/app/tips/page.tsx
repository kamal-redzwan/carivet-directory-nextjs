'use client';

import {
  PawPrint,
  Facebook,
  Twitter,
  Instagram,
  Utensils,
  Activity,
  Scissors,
  Shield,
  Home,
  GraduationCap,
  Check,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

export default function PetCareTipsPage() {
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
                className='text-gray-600 hover:text-emerald-600'
              >
                Find Clinics
              </Link>
              <Link
                href='/tips'
                className='text-gray-900 hover:text-emerald-600'
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
      <section className='bg-emerald-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Pet Care Tips</h1>
          <p className='text-xl text-emerald-100'>
            Essential advice to keep your pets healthy, happy, and thriving
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Introduction */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            Caring for Your Pets
          </h2>
          <p className='text-gray-600 max-w-3xl mx-auto'>
            Proper pet care involves attention to nutrition, exercise, grooming,
            healthcare, safety, and training. Here are some essential tips to
            help you provide the best care for your furry, feathered, or scaly
            friends.
          </p>
        </div>

        {/* Tips Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          {/* Nutrition and Diet */}
          <div className='bg-white p-8 rounded-lg shadow-sm border border-gray-100'>
            <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6'>
              <Utensils className='h-6 w-6 text-emerald-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-4'>
              Nutrition and Diet
            </h3>
            <ul className='space-y-3 text-gray-600'>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Feed your pets high-quality food appropriate for their
                  species, age, and health condition
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Maintain a consistent feeding schedule to help with digestion
                  and house training
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Ensure fresh water is always available
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Avoid feeding pets human food, especially chocolate, grapes,
                  onions, and xylitol
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Monitor your pet's weight and adjust portions accordingly
                </span>
              </li>
            </ul>
          </div>

          {/* Exercise and Mental Stimulation */}
          <div className='bg-white p-8 rounded-lg shadow-sm border border-gray-100'>
            <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6'>
              <Activity className='h-6 w-6 text-emerald-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-4'>
              Exercise and Mental Stimulation
            </h3>
            <ul className='space-y-3 text-gray-600'>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Provide daily exercise appropriate for your pet's age, breed,
                  and health status
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Include interactive toys and puzzles to keep your pet mentally
                  stimulated
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Vary walking routes to provide new experiences and smells for
                  dogs
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Set up climbing spaces and perches for cats to explore
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Schedule regular playtime to bond with your pet
                </span>
              </li>
            </ul>
          </div>

          {/* Grooming and Hygiene */}
          <div className='bg-white p-8 rounded-lg shadow-sm border border-gray-100'>
            <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6'>
              <Scissors className='h-6 w-6 text-emerald-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-4'>
              Grooming and Hygiene
            </h3>
            <ul className='space-y-3 text-gray-600'>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Brush your pet regularly to reduce shedding and prevent
                  matting
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Bathe your pet as needed, using species-appropriate shampoo
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Clean your pet's teeth regularly with pet-safe toothpaste
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Trim nails carefully to prevent discomfort and mobility issues
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Check and clean ears regularly to prevent infections
                </span>
              </li>
            </ul>
          </div>

          {/* Preventive Healthcare */}
          <div className='bg-white p-8 rounded-lg shadow-sm border border-gray-100'>
            <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6'>
              <Shield className='h-6 w-6 text-emerald-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-4'>
              Preventive Healthcare
            </h3>
            <ul className='space-y-3 text-gray-600'>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Schedule regular veterinary check-ups, at least once a year
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Keep vaccinations up to date according to your vet's
                  recommendations
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Administer parasite prevention for fleas, ticks, and heartworm
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Spay or neuter your pet to prevent health issues and unwanted
                  litters
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Learn to recognize signs of illness and seek veterinary care
                  promptly
                </span>
              </li>
            </ul>
          </div>

          {/* Safety and Environment */}
          <div className='bg-white p-8 rounded-lg shadow-sm border border-gray-100'>
            <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6'>
              <Home className='h-6 w-6 text-emerald-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-4'>
              Safety and Environment
            </h3>
            <ul className='space-y-3 text-gray-600'>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Pet-proof your home by removing toxic plants, chemicals, and
                  choking hazards
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Secure trash cans to prevent pets from accessing harmful items
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Provide appropriate shelter and temperature control for
                  outdoor pets
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Use proper restraints (leashes, carriers) when traveling with
                  pets
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Ensure your pet has proper identification (microchip, collar
                  tags)
                </span>
              </li>
            </ul>
          </div>

          {/* Behavioral Training */}
          <div className='bg-white p-8 rounded-lg shadow-sm border border-gray-100'>
            <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6'>
              <GraduationCap className='h-6 w-6 text-emerald-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-4'>
              Behavioral Training
            </h3>
            <ul className='space-y-3 text-gray-600'>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Start training early with positive reinforcement techniques
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Be consistent with commands and expectations
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Socialize your pet with other animals and people from a young
                  age
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Address behavioral issues promptly with professional help if
                  needed
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Check
                  size={16}
                  className='text-emerald-600 mt-0.5 flex-shrink-0'
                />
                <span className='text-sm'>
                  Provide a safe space where your pet can retreat when stressed
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className='bg-emerald-50 rounded-lg p-8 text-center'>
          <h3 className='text-2xl font-semibold text-gray-900 mb-4'>
            Need Specific Advice?
          </h3>
          <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
            These tips provide general guidance, but every pet is unique. For
            personalized advice tailored to your pet's specific needs, consult
            with a veterinarian.
          </p>
          <Link
            href='/clinics'
            className='inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors'
          >
            Find a Veterinary Clinic
            <ChevronRight size={16} />
          </Link>
        </div>
      </main>

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
