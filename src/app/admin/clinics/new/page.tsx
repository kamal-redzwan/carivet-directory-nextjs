// src/app/admin/clinics/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button, PrimaryButton } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface ClinicFormData {
  name: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  website: string;
  emergency: boolean;
  emergency_hours: string;
  emergency_details: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  animals_treated: string[];
  specializations: string[];
  services_offered: string[];
  facebook_url: string;
  instagram_url: string;
}

const initialFormData: ClinicFormData = {
  name: '',
  street: '',
  city: '',
  state: '',
  postcode: '',
  phone: '',
  email: '',
  website: '',
  emergency: false,
  emergency_hours: '',
  emergency_details: '',
  hours: {
    monday: '09:00 - 18:00',
    tuesday: '09:00 - 18:00',
    wednesday: '09:00 - 18:00',
    thursday: '09:00 - 18:00',
    friday: '09:00 - 18:00',
    saturday: '09:00 - 14:00',
    sunday: 'Closed',
  },
  animals_treated: [],
  specializations: [],
  services_offered: [],
  facebook_url: '',
  instagram_url: '',
};

const malaysianStates = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Kuala Lumpur',
  'Labuan',
  'Malacca',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Putrajaya',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
];

const commonAnimals = [
  'Dogs',
  'Cats',
  'Birds',
  'Rabbits',
  'Hamsters',
  'Guinea Pigs',
  'Fish',
  'Reptiles',
  'Exotic Pets',
  'Farm Animals',
  'Wildlife',
];

const commonSpecializations = [
  'Surgery',
  'Dentistry',
  'Dermatology',
  'Cardiology',
  'Oncology',
  'Orthopedics',
  'Ophthalmology',
  'Neurology',
  'Internal Medicine',
  'Emergency Medicine',
  'Exotic Animal Medicine',
];

const commonServices = [
  'Vaccination',
  'Health Check-ups',
  'Surgery',
  'Dental Care',
  'Grooming',
  'Boarding',
  'Emergency Care',
  'Laboratory Tests',
  'X-Ray',
  'Ultrasound',
  'Pharmacy',
  'Pet Food & Supplies',
];

export default function AddClinicPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ClinicFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name.startsWith('hours.')) {
      const day = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        hours: { ...prev.hours, [day]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayFieldChange = (
    field: keyof Pick<
      ClinicFormData,
      'animals_treated' | 'specializations' | 'services_offered'
    >,
    value: string
  ) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.city || !formData.state) {
        throw new Error('Please fill in all required fields');
      }

      const { data, error } = await supabase
        .from('clinics')
        .insert([
          {
            name: formData.name,
            street: formData.street || null,
            city: formData.city,
            state: formData.state,
            postcode: formData.postcode || null,
            phone: formData.phone || null,
            email: formData.email || null,
            website: formData.website || null,
            hours: formData.hours,
            emergency: formData.emergency,
            emergency_hours: formData.emergency_hours || null,
            emergency_details: formData.emergency_details || null,
            animals_treated: formData.animals_treated,
            specializations: formData.specializations,
            services_offered: formData.services_offered,
            facebook_url: formData.facebook_url || null,
            instagram_url: formData.instagram_url || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Success - redirect to clinic detail page
      router.push(`/admin/clinics/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create clinic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='outline' asChild>
          <Link href='/admin/clinics'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Clinics
          </Link>
        </Button>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Add New Clinic</h1>
          <p className='text-gray-600'>
            Fill in the details below to add a new veterinary clinic
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Clinic Name *
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  placeholder='e.g., Happy Pets Veterinary Clinic'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  placeholder='+60 3-1234 5678'
                />
              </div>

              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Street Address
                </label>
                <input
                  type='text'
                  name='street'
                  value={formData.street}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  placeholder='e.g., 123 Jalan Bukit Bintang'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  City *
                </label>
                <input
                  type='text'
                  name='city'
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  placeholder='e.g., Kuala Lumpur'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  State *
                </label>
                <select
                  name='state'
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                >
                  <option value=''>Select State</option>
                  {malaysianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Postcode
                </label>
                <input
                  type='text'
                  name='postcode'
                  value={formData.postcode}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  placeholder='e.g., 50200'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  placeholder='clinic@example.com'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Website
                </label>
                <input
                  type='url'
                  name='website'
                  value={formData.website}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  placeholder='https://example.com'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Operating Hours</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Object.entries(formData.hours).map(([day, hours]) => (
                <div key={day}>
                  <label className='block text-sm font-medium text-gray-700 mb-1 capitalize'>
                    {day}
                  </label>
                  <input
                    type='text'
                    name={`hours.${day}`}
                    value={hours}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    placeholder='e.g., 09:00 - 18:00 or Closed'
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Services */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Services</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                name='emergency'
                checked={formData.emergency}
                onChange={handleInputChange}
                className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500'
              />
              <label className='ml-2 text-sm text-gray-700'>
                This clinic provides emergency services
              </label>
            </div>

            {formData.emergency && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Emergency Hours
                  </label>
                  <input
                    type='text'
                    name='emergency_hours'
                    value={formData.emergency_hours}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    placeholder='e.g., 24/7 or After hours: +60 12-345 6789'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Emergency Details
                  </label>
                  <textarea
                    name='emergency_details'
                    value={formData.emergency_details}
                    onChange={handleInputChange}
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    placeholder='Additional emergency service details...'
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services and Specializations */}
        <Card>
          <CardHeader>
            <CardTitle>Services and Specializations</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Animals Treated */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Animals Treated
              </label>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                {commonAnimals.map((animal) => (
                  <label key={animal} className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={formData.animals_treated.includes(animal)}
                      onChange={() =>
                        handleArrayFieldChange('animals_treated', animal)
                      }
                      className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500'
                    />
                    <span className='ml-2 text-sm text-gray-700'>{animal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Specializations
              </label>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                {commonSpecializations.map((spec) => (
                  <label key={spec} className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={formData.specializations.includes(spec)}
                      onChange={() =>
                        handleArrayFieldChange('specializations', spec)
                      }
                      className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500'
                    />
                    <span className='ml-2 text-sm text-gray-700'>{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Services Offered */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Services Offered
              </label>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                {commonServices.map((service) => (
                  <label key={service} className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={formData.services_offered.includes(service)}
                      onChange={() =>
                        handleArrayFieldChange('services_offered', service)
                      }
                      className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500'
                    />
                    <span className='ml-2 text-sm text-gray-700'>
                      {service}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Facebook URL
                </label>
                <input
                  type='url'
                  name='facebook_url'
                  value={formData.facebook_url}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  placeholder='https://facebook.com/yourclinic'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Instagram URL
                </label>
                <input
                  type='url'
                  name='instagram_url'
                  value={formData.instagram_url}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  placeholder='https://instagram.com/yourclinic'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-md p-4'>
            <div className='text-red-800 text-sm'>{error}</div>
          </div>
        )}

        {/* Submit Actions */}
        <div className='flex justify-end gap-4 pt-6 border-t'>
          <Button type='button' variant='outline' asChild>
            <Link href='/admin/clinics'>Cancel</Link>
          </Button>
          <PrimaryButton type='submit' disabled={loading}>
            {loading ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                Creating...
              </>
            ) : (
              <>
                <Save className='h-4 w-4 mr-2' />
                Create Clinic
              </>
            )}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
