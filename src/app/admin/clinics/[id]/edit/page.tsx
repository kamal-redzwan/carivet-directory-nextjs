'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Clinic } from '@/types/clinic';
import { Button, PrimaryButton } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import {
  ArrowLeft,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  ExternalLink,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Settings,
  Stethoscope,
} from 'lucide-react';
import Link from 'next/link';

// Import our utility components
import { FormSection } from '@/components/admin/forms/FormSection';
import { OperatingHoursInput } from '@/components/admin/forms/OperatingHoursInput';
import { ServiceSelector } from '@/components/admin/forms/ServiceSelector';
import { PhoneInput } from '@/components/admin/forms/PhoneInput';
import { FormProgress } from '@/components/admin/forms/FormProgress';
import { ValidatedInput } from '@/components/admin/forms/ValidatedInput';
import { useClinicFormValidation } from '@/hooks/useClinicFormValidation';
import { useAutoSave } from '@/hooks/useAutoSave';

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
  hours: OperatingHours;
  animals_treated: string[];
  specializations: string[];
  services_offered: string[];
  facebook_url: string;
  instagram_url: string;
}

interface OperatingHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

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

// Use keyboard shortcuts hook at component level
function useKeyboardShortcuts(
  hasUnsavedChanges: boolean,
  saving: boolean,
  handleSubmit: (e: React.FormEvent) => void,
  handleReset: () => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            if (hasUnsavedChanges && !saving) {
              handleSubmit(e as unknown as React.FormEvent);
            }
            break;
          case 'r':
            e.preventDefault();
            if (hasUnsavedChanges) {
              handleReset();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, saving, handleSubmit, handleReset]);
}

export default function EnhancedEditClinicPage() {
  const params = useParams();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [formData, setFormData] = useState<ClinicFormData | null>(null);
  const [originalData, setOriginalData] = useState<ClinicFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Use validation hook
  const { validateForm, getFieldError, clearErrors } =
    useClinicFormValidation();

  // Calculate form progress
  const formProgress = useMemo(() => {
    if (!formData) return [];

    return [
      {
        id: 'basic',
        name: 'Basic Information',
        required: true,
        completed: !!(formData.name && formData.city && formData.state),
        hasErrors: !!(
          getFieldError('name') ||
          getFieldError('city') ||
          getFieldError('state')
        ),
      },
      {
        id: 'contact',
        name: 'Contact Details',
        required: false,
        completed: !!(formData.phone || formData.email || formData.website),
        hasErrors: !!(
          getFieldError('phone') ||
          getFieldError('email') ||
          getFieldError('website')
        ),
      },
      {
        id: 'hours',
        name: 'Operating Hours',
        required: true,
        completed: Object.values(formData.hours).some(
          (h) => h && h !== 'Closed'
        ),
        hasErrors: false,
      },
      {
        id: 'services',
        name: 'Services & Animals',
        required: false,
        completed:
          formData.animals_treated.length > 0 ||
          formData.services_offered.length > 0,
        hasErrors: false,
      },
      {
        id: 'emergency',
        name: 'Emergency Services',
        required: false,
        completed:
          !formData.emergency ||
          !!(formData.emergency_hours || formData.emergency_details),
        hasErrors: false,
      },
    ];
  }, [formData, getFieldError]);

  // Load clinic data
  useEffect(() => {
    if (params.id) {
      loadClinic(params.id as string);
    }
  }, [params.id]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Auto-save functionality
  const handleAutoSave = useCallback(
    async (data: ClinicFormData) => {
      if (!clinic || !data || !autoSaveEnabled) return;

      try {
        // Prepare the update data
        const updateData = {
          name: data.name.trim(),
          street: data.street.trim() || null,
          city: data.city.trim(),
          state: data.state,
          postcode: data.postcode.trim() || null,
          phone: data.phone.trim() || null,
          email: data.email.trim() || null,
          website: data.website.trim() || null,
          hours: data.hours,
          emergency: data.emergency,
          emergency_hours: data.emergency_hours.trim() || null,
          emergency_details: data.emergency_details.trim() || null,
          animals_treated: data.animals_treated,
          specializations: data.specializations,
          services_offered: data.services_offered,
          facebook_url: data.facebook_url.trim() || null,
          instagram_url: data.instagram_url.trim() || null,
          updated_at: new Date().toISOString(),
        };

        // Perform the auto-save update
        const { error } = await supabase
          .from('clinics')
          .update(updateData)
          .eq('id', clinic.id);

        if (error) {
          console.error('Auto-save failed:', error);
          return;
        }

        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    },
    [clinic, autoSaveEnabled]
  );

  // Use auto-save hook
  useAutoSave({
    data: formData,
    onSave: handleAutoSave,
    enabled: autoSaveEnabled && hasUnsavedChanges,
    delay: 3000,
  });

  const loadClinic = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Clinic not found');

      setClinic(data);

      const initialFormData = {
        name: data.name || '',
        street: data.street || '',
        city: data.city || '',
        state: data.state || '',
        postcode: data.postcode || '',
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        emergency: data.emergency || false,
        emergency_hours: data.emergency_hours || '',
        emergency_details: data.emergency_details || '',
        hours: data.hours || {
          monday: '09:00 - 18:00',
          tuesday: '09:00 - 18:00',
          wednesday: '09:00 - 18:00',
          thursday: '09:00 - 18:00',
          friday: '09:00 - 18:00',
          saturday: '09:00 - 14:00',
          sunday: 'Closed',
        },
        animals_treated: data.animals_treated || [],
        specializations: data.specializations || [],
        services_offered: data.services_offered || [],
        facebook_url: data.facebook_url || '',
        instagram_url: data.instagram_url || '',
      };

      setFormData(initialFormData);
      setOriginalData(initialFormData);

      // Enable auto-save after form is loaded
      setTimeout(() => setAutoSaveEnabled(true), 1000);
    } catch (err) {
      console.error('Error loading clinic:', err);
      setError(err instanceof Error ? err.message : 'Failed to load clinic');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof ClinicFormData,
    value: string | boolean | string[] | OperatingHours
  ) => {
    if (!formData) return;

    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
    setHasUnsavedChanges(true);
    clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData || !clinic) return;

    // Validate form
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
      setError(validationErrors.map((e) => e.message).join(', '));
      return;
    }

    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // First, check if the clinic exists
      const { data: existingClinic, error: checkError } = await supabase
        .from('clinics')
        .select('id')
        .eq('id', clinic.id)
        .single();

      if (checkError || !existingClinic) {
        throw new Error(`Clinic with ID ${clinic.id} not found`);
      }

      // Prepare the update data
      const updateData = {
        name: formData.name.trim(),
        street: formData.street.trim() || null,
        city: formData.city.trim(),
        state: formData.state,
        postcode: formData.postcode.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        website: formData.website.trim() || null,
        hours: formData.hours,
        emergency: formData.emergency,
        emergency_hours: formData.emergency_hours.trim() || null,
        emergency_details: formData.emergency_details.trim() || null,
        animals_treated: formData.animals_treated,
        specializations: formData.specializations,
        services_offered: formData.services_offered,
        facebook_url: formData.facebook_url.trim() || null,
        instagram_url: formData.instagram_url.trim() || null,
        updated_at: new Date().toISOString(),
      };

      // Perform the update without requiring .single()
      const { data, error } = await supabase
        .from('clinics')
        .update(updateData)
        .eq('id', clinic.id)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error(
          'No rows were updated. The clinic may not exist or you may not have permission to update it.'
        );
      }

      // Get the updated clinic data
      const updatedClinic = data[0];

      setClinic(updatedClinic);
      setOriginalData(formData);
      setHasUnsavedChanges(false);
      setSaveSuccess(true);
      setLastSaved(new Date());

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating clinic:', err);

      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes('PGRST116')) {
          setError(
            'Unable to update clinic. The clinic may not exist or you may not have permission to edit it.'
          );
        } else if (err.message.includes('not found')) {
          setError(
            'Clinic not found. It may have been deleted by another user.'
          );
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to update clinic. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!originalData) return;

    if (hasUnsavedChanges && !window.confirm('Discard all changes?')) {
      return;
    }

    setFormData(originalData);
    setHasUnsavedChanges(false);
    setError(null);
    setSaveSuccess(false);
    clearErrors();
  };

  // Use keyboard shortcuts
  useKeyboardShortcuts(hasUnsavedChanges, saving, handleSubmit, handleReset);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <LoadingSpinner size='lg' text='Loading clinic details...' />
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Error Loading Clinic
          </h3>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button onClick={() => loadClinic(params.id as string)}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!clinic || !formData) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Clinic Not Found
          </h3>
          <p className='text-gray-600 mb-4'>
            The clinic you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href='/admin/clinics'>Back to Clinics</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex flex-col lg:flex-row justify-between items-start gap-4'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' asChild>
            <Link href={`/admin/clinics/${clinic.id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Details
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Edit Clinic</h1>
            <p className='text-gray-600'>{clinic.name}</p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
            {hasUnsavedChanges && (
              <Badge
                variant='secondary'
                className='bg-orange-100 text-orange-800'
              >
                <Clock className='h-3 w-3 mr-1' />
                Unsaved Changes
              </Badge>
            )}
            {saveSuccess && (
              <Badge variant='default' className='bg-green-100 text-green-800'>
                <CheckCircle className='h-3 w-3 mr-1' />
                Saved Successfully
              </Badge>
            )}
            {autoSaveEnabled && lastSaved && (
              <Badge variant='outline' className='text-xs'>
                Auto-saved {lastSaved.toLocaleTimeString()}
              </Badge>
            )}
          </div>

          <div className='flex gap-2'>
            <Button variant='outline' size='sm' asChild>
              <Link href={`/clinic/${clinic.id}`} target='_blank'>
                <ExternalLink className='h-4 w-4 mr-2' />
                Preview
              </Link>
            </Button>

            <Button variant='outline' size='sm' asChild>
              <Link href={`/admin/clinics/${clinic.id}`}>
                <Eye className='h-4 w-4 mr-2' />
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Progress Sidebar */}
        <div className='lg:col-span-1'>
          <FormProgress sections={formProgress} />

          {/* Auto-save Toggle */}
          <div className='mt-4 p-4 bg-white rounded-lg border'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Auto-save</span>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className='sr-only peer'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <p className='text-xs text-gray-500 mt-1'>
              Automatically save changes every 3 seconds
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className='lg:col-span-3'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Basic Information */}
            <FormSection
              title='Basic Information'
              icon={<Settings className='h-5 w-5' />}
              required
              error={
                getFieldError('name') ||
                getFieldError('city') ||
                getFieldError('state')
              }
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <ValidatedInput
                  label='Clinic Name'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={getFieldError('name')}
                  required
                  placeholder='e.g., Happy Pets Veterinary Clinic'
                />

                <div className='space-y-1'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Phone Number
                  </label>
                  <PhoneInput
                    value={formData.phone}
                    onChange={(value) => handleInputChange('phone', value)}
                    error={getFieldError('phone')}
                  />
                </div>

                <ValidatedInput
                  label='Street Address'
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  error={getFieldError('street')}
                  placeholder='e.g., 123 Jalan Bukit Bintang'
                  className='md:col-span-2'
                />

                <ValidatedInput
                  label='City'
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  error={getFieldError('city')}
                  required
                  placeholder='e.g., Kuala Lumpur'
                />

                <div className='space-y-1'>
                  <label className='block text-sm font-medium text-gray-700'>
                    State <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
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
                  {getFieldError('state') && (
                    <div className='text-sm text-red-600'>
                      {getFieldError('state')}
                    </div>
                  )}
                </div>

                <ValidatedInput
                  label='Postcode'
                  value={formData.postcode}
                  onChange={(e) =>
                    handleInputChange('postcode', e.target.value)
                  }
                  error={getFieldError('postcode')}
                  placeholder='e.g., 50200'
                />

                <ValidatedInput
                  label='Email'
                  type='email'
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={getFieldError('email')}
                  placeholder='clinic@example.com'
                />

                <ValidatedInput
                  label='Website'
                  type='url'
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  error={getFieldError('website')}
                  placeholder='https://example.com'
                />
              </div>
            </FormSection>

            {/* Operating Hours */}
            <FormSection
              title='Operating Hours'
              icon={<Clock className='h-5 w-5' />}
              required
              description='Set the regular operating hours for your clinic'
            >
              <OperatingHoursInput
                hours={formData.hours}
                onChange={(hours) => handleInputChange('hours', hours)}
              />
            </FormSection>

            {/* Emergency Services */}
            <FormSection
              title='Emergency Services'
              icon={<AlertTriangle className='h-5 w-5' />}
              description='Configure emergency service availability and details'
            >
              <div className='space-y-4'>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={formData.emergency}
                    onChange={(e) =>
                      handleInputChange('emergency', e.target.checked)
                    }
                    className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500'
                  />
                  <label className='ml-2 text-sm text-gray-700'>
                    This clinic provides emergency services
                  </label>
                </div>

                {formData.emergency && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t'>
                    <ValidatedInput
                      label='Emergency Hours'
                      value={formData.emergency_hours}
                      onChange={(e) =>
                        handleInputChange('emergency_hours', e.target.value)
                      }
                      placeholder='e.g., 24/7 or After hours: +60 12-345 6789'
                      helperText='Specify when emergency services are available'
                    />

                    <div className='space-y-1'>
                      <label className='block text-sm font-medium text-gray-700'>
                        Emergency Details
                      </label>
                      <textarea
                        value={formData.emergency_details}
                        onChange={(e) =>
                          handleInputChange('emergency_details', e.target.value)
                        }
                        rows={3}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        placeholder='Additional emergency service details...'
                      />
                      <p className='text-xs text-gray-500'>
                        Provide additional information about emergency
                        procedures
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </FormSection>

            {/* Animals Treated */}
            <FormSection
              title='Animals Treated'
              icon={<MapPin className='h-5 w-5' />}
              description='Select the types of animals your clinic treats'
            >
              <ServiceSelector
                title='Animals Treated'
                category='animals'
                selectedItems={formData.animals_treated}
                availableItems={commonAnimals}
                onChange={(items) =>
                  handleInputChange('animals_treated', items)
                }
                placeholder='Search for animal types...'
                allowCustom={true}
              />
            </FormSection>

            {/* Specializations */}
            <FormSection
              title='Specializations'
              icon={<Stethoscope className='h-5 w-5' />}
              description="Select your clinic's areas of specialization"
            >
              <ServiceSelector
                title='Medical Specializations'
                category='specializations'
                selectedItems={formData.specializations}
                availableItems={commonSpecializations}
                onChange={(items) =>
                  handleInputChange('specializations', items)
                }
                placeholder='Search for specializations...'
                allowCustom={true}
              />
            </FormSection>

            {/* Services Offered */}
            <FormSection
              title='Services Offered'
              icon={<Settings className='h-5 w-5' />}
              description='Select the services your clinic provides'
            >
              <ServiceSelector
                title='Services & Treatments'
                category='services'
                selectedItems={formData.services_offered}
                availableItems={commonServices}
                onChange={(items) =>
                  handleInputChange('services_offered', items)
                }
                placeholder='Search for services...'
                allowCustom={true}
              />
            </FormSection>

            {/* Social Media */}
            <FormSection
              title='Social Media'
              icon={<Globe className='h-5 w-5' />}
              description="Add your clinic's social media profiles"
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='block text-sm font-medium text-gray-700 flex items-center gap-2'>
                    <Facebook className='h-4 w-4' />
                    Facebook URL
                  </label>
                  <input
                    type='url'
                    value={formData.facebook_url}
                    onChange={(e) =>
                      handleInputChange('facebook_url', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    placeholder='https://facebook.com/yourclinic'
                  />
                </div>

                <div className='space-y-1'>
                  <label className='block text-sm font-medium text-gray-700 flex items-center gap-2'>
                    <Instagram className='h-4 w-4' />
                    Instagram URL
                  </label>
                  <input
                    type='url'
                    value={formData.instagram_url}
                    onChange={(e) =>
                      handleInputChange('instagram_url', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    placeholder='https://instagram.com/yourclinic'
                  />
                </div>
              </div>
            </FormSection>

            {/* Form Status and Actions */}
            <div className='space-y-4'>
              {saving && <LoadingSpinner size='sm' text='Saving changes...' />}
              {saveSuccess && (
                <div className='text-green-600 flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5' />
                  <span>Clinic updated successfully!</span>
                </div>
              )}
              {error && (
                <div className='text-red-600 flex items-center gap-2'>
                  <AlertTriangle className='h-5 w-5' />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex justify-between items-center pt-6 border-t bg-white sticky bottom-0 z-10 py-4'>
                <div className='flex gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleReset}
                    disabled={saving || !hasUnsavedChanges}
                  >
                    <RefreshCw className='h-4 w-4 mr-2' />
                    Reset Changes
                  </Button>

                  <Button type='button' variant='outline' asChild>
                    <Link href={`/admin/clinics/${clinic.id}`}>Cancel</Link>
                  </Button>
                </div>

                <div className='flex gap-3'>
                  <PrimaryButton
                    type='submit'
                    disabled={saving || !hasUnsavedChanges}
                    loading={saving}
                  >
                    {saving ? (
                      <>
                        <LoadingSpinner
                          size='sm'
                          variant='white'
                          className='mr-2'
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className='h-4 w-4 mr-2' />
                        Save Changes
                      </>
                    )}
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className='fixed bottom-4 right-4 bg-white border rounded-lg p-3 text-xs text-gray-500 shadow-lg max-w-xs'>
        <div className='font-medium mb-1'>Keyboard Shortcuts:</div>
        <div>Ctrl/Cmd + S - Save changes</div>
        <div>Ctrl/Cmd + R - Reset form</div>
      </div>
    </div>
  );
}
