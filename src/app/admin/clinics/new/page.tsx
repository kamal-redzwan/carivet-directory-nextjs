'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button, PrimaryButton } from '@/components/ui/button';
import {
  FormField,
  TextareaField,
  SelectField,
} from '@/components/common/FormField';
import { FormLoading } from '@/components/ui/LoadingComponents';
import { canCreateClinics } from '@/utils/permissions';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { useForm } from '@/hooks/useForm';
import { clinicSchema } from '@/utils/validators';
import { VALIDATION_RULES } from '@/utils/constants';
import { validateClinicData } from '@/utils/businessLogic';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TimePicker } from '@/components/ui/time-picker';
import { Input } from '@/components/ui/input';
import {
  COMMON_ANIMALS,
  VETERINARY_SPECIALIZATIONS,
  MALAYSIAN_STATES,
} from '@/utils/constants';
import { veterinaryServices } from '@/data/serviceFeatures';
import { NewClinicFormData } from '@/types/clinic';
import { ServiceSelector } from '@/components/admin/forms/ServiceSelector';

interface OperatingHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

const initialHours: OperatingHours = {
  monday: '09:00 - 18:00',
  tuesday: '09:00 - 18:00',
  wednesday: '09:00 - 18:00',
  thursday: '09:00 - 18:00',
  friday: '09:00 - 18:00',
  saturday: '09:00 - 16:00',
  sunday: 'Closed',
};

const animalTypes = [...COMMON_ANIMALS];
const specializations = [...VETERINARY_SPECIALIZATIONS];
const services = veterinaryServices.map((service) => service.title);

const initialValues: NewClinicFormData = {
  name: '',
  street: '',
  city: '',
  state: '',
  postcode: '',
  phone: '',
  email: '',
  website: '',
  description: '',
  emergency: false,
  emergency_hours: '',
  emergency_details: '',
  hours: {
    monday: '09:00 - 17:00',
    tuesday: '09:00 - 17:00',
    wednesday: '09:00 - 17:00',
    thursday: '09:00 - 17:00',
    friday: '09:00 - 17:00',
    saturday: 'Closed',
    sunday: 'Closed',
  },
  animals_treated: [],
  specializations: [],
  services_offered: [],
  facebook_url: '',
  instagram_url: '',
};

const malaysianStates = [...MALAYSIAN_STATES];

export default function NewClinicPage() {
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<NewClinicFormData>({
    initialValues,
    validationSchema: clinicSchema,
    onSubmit: async (values) => {
      if (!canCreateClinics(user)) {
        toast.error('You do not have permission to create clinics');
        return;
      }

      try {
        // Validate the data using our business logic
        const validationResult = validateClinicData(values);
        if (!validationResult.isValid) {
          toast.error(validationResult.errors.join(', '));
          return;
        }

        // Prepare the clinic data with proper structure
        const clinicData = {
          name: values.name.trim(),
          street: values.street?.trim() || null,
          city: values.city.trim(),
          state: values.state,
          postcode: values.postcode?.trim() || null,
          phone: values.phone?.trim() || null,
          email: values.email?.trim() || null,
          website: values.website?.trim() || null,
          emergency: values.emergency,
          emergency_hours: values.emergency_hours?.trim() || null,
          emergency_details: values.emergency_details?.trim() || null,
          hours: values.hours,
          animals_treated: values.animals_treated,
          specializations: values.specializations,
          services_offered: values.services_offered,
          facebook_url: values.facebook_url?.trim() || null,
          instagram_url: values.instagram_url?.trim() || null,
          verification_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log('Submitting clinic data:', clinicData);

        const { data, error } = await supabase
          .from('clinics')
          .insert([clinicData])
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message || 'Failed to create clinic');
        }

        if (!data) {
          throw new Error('No data returned after clinic creation');
        }

        console.log('Clinic created successfully:', data);
        toast.success('Clinic created successfully');

        // Wait a moment before redirecting to ensure the toast is visible
        setTimeout(() => {
          router.push('/admin/clinics');
        }, 1000);
      } catch (error) {
        console.error('Error creating clinic:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to create clinic'
        );
      }
    },
  });

  if (!canCreateClinics(user)) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Access Denied
          </h2>
          <p className='text-gray-600'>
            You do not have permission to create clinics.
          </p>
        </div>
      </div>
    );
  }

  if (form.loading) {
    return <FormLoading />;
  }

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Create New Clinic</h1>
        <p className='mt-2 text-gray-600'>
          Add a new veterinary clinic to the directory
        </p>
      </div>

      <form onSubmit={form.handleSubmit} className='space-y-8'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                label='Clinic Name'
                value={form.values.name || ''}
                onChange={(value) => form.handleChange('name', value)}
                onBlur={() => form.handleBlur('name')}
                error={form.errors.name}
                required
                placeholder='Enter clinic name'
              />
              <FormField
                label='Phone Number'
                type='tel'
                value={form.values.phone || ''}
                onChange={(value) => form.handleChange('phone', value)}
                onBlur={() => form.handleBlur('phone')}
                error={form.errors.phone}
                placeholder='Enter phone number'
              />
              <FormField
                label='Email'
                type='email'
                value={form.values.email || ''}
                onChange={(value) => form.handleChange('email', value)}
                onBlur={() => form.handleBlur('email')}
                error={form.errors.email}
                placeholder='Enter email address'
              />
              <FormField
                label='Website'
                type='url'
                value={form.values.website || ''}
                onChange={(value) => form.handleChange('website', value)}
                onBlur={() => form.handleBlur('website')}
                error={form.errors.website}
                placeholder='Enter website URL'
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                label='Street Address'
                value={form.values.street || ''}
                onChange={(value) => form.handleChange('street', value)}
                onBlur={() => form.handleBlur('street')}
                error={form.errors.street}
                required
                placeholder='Enter street address'
              />
              <FormField
                label='City'
                value={form.values.city || ''}
                onChange={(value) => form.handleChange('city', value)}
                onBlur={() => form.handleBlur('city')}
                error={form.errors.city}
                required
                placeholder='Enter city'
              />
              <div className='space-y-2'>
                <Label htmlFor='state'>State</Label>
                <Select
                  name='state'
                  value={form.values.state}
                  onValueChange={(value: string) =>
                    form.setFieldValue('state', value)
                  }
                >
                  <SelectTrigger id='state' className='w-full'>
                    <SelectValue placeholder='Select a state' />
                  </SelectTrigger>
                  <SelectContent>
                    {malaysianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.errors.state && (
                  <p className='text-sm text-red-500'>{form.errors.state}</p>
                )}
              </div>
              <FormField
                label='Postcode'
                value={form.values.postcode || ''}
                onChange={(value) => form.handleChange('postcode', value)}
                onBlur={() => form.handleBlur('postcode')}
                error={form.errors.postcode}
                placeholder='Enter postcode'
              />
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Operating Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <Label>Operating Hours</Label>
              {Object.entries(form.values.hours).map(([day, time]) => (
                <div key={day} className='space-y-2'>
                  <Label className='capitalize'>{day}</Label>
                  <RadioGroup
                    value={
                      time === '24/7'
                        ? '24/7'
                        : time === 'Closed'
                        ? 'closed'
                        : 'custom'
                    }
                    onValueChange={(value: string) => {
                      if (value === '24/7') {
                        form.setFieldValue('hours', {
                          ...form.values.hours,
                          [day]: '24/7',
                        });
                      } else if (value === 'closed') {
                        form.setFieldValue('hours', {
                          ...form.values.hours,
                          [day]: 'Closed',
                        });
                      }
                    }}
                    className='flex items-center space-x-4'
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='24/7' id={`${day}-24/7`} />
                      <Label htmlFor={`${day}-24/7`}>24/7</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='closed' id={`${day}-closed`} />
                      <Label htmlFor={`${day}-closed`}>Closed</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='custom' id={`${day}-custom`} />
                      <Label htmlFor={`${day}-custom`}>Custom Hours</Label>
                    </div>
                  </RadioGroup>

                  {time !== '24/7' && time !== 'Closed' && (
                    <div className='flex items-center space-x-4'>
                      <TimePicker
                        value={time.split(' - ')[0]}
                        onChange={(newTime: string) => {
                          const [_, endTime] = time.split(' - ');
                          form.setFieldValue('hours', {
                            ...form.values.hours,
                            [day]: `${newTime} - ${endTime}`,
                          });
                        }}
                      />
                      <span>to</span>
                      <TimePicker
                        value={time.split(' - ')[1]}
                        onChange={(newTime: string) => {
                          const [startTime, _] = time.split(' - ');
                          form.setFieldValue('hours', {
                            ...form.values.hours,
                            [day]: `${startTime} - ${newTime}`,
                          });
                        }}
                      />
                    </div>
                  )}
                  {form.errors.hours && (form.errors.hours as any)[day] && (
                    <p className='text-sm text-red-500'>
                      {(form.errors.hours as any)[day]}
                    </p>
                  )}
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
          <CardContent>
            <div className='space-y-6'>
              <div className='flex items-center space-x-2'>
                <Switch
                  checked={form.values.emergency}
                  onCheckedChange={(checked) =>
                    form.handleChange('emergency', checked)
                  }
                />
                <Label htmlFor='emergency'>This is an emergency clinic</Label>
              </div>
              {form.values.emergency && (
                <>
                  <FormField
                    label='Emergency Hours'
                    value={form.values.emergency_hours || ''}
                    onChange={(value) =>
                      form.handleChange('emergency_hours', value)
                    }
                    onBlur={() => form.handleBlur('emergency_hours')}
                    error={form.errors.emergency_hours}
                    placeholder='e.g., 24/7 or specific hours'
                  />
                  <TextareaField
                    label='Emergency Details'
                    value={form.values.emergency_details || ''}
                    onChange={(value) =>
                      form.handleChange('emergency_details', value)
                    }
                    onBlur={() => form.handleBlur('emergency_details')}
                    error={form.errors.emergency_details}
                    placeholder='Enter emergency service details'
                    rows={3}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Services and Specializations */}
        <Card>
          <CardHeader>
            <CardTitle>Services and Specializations</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Services Offered */}
            <div className='space-y-2'>
              <Label>Services Offered</Label>
              <ServiceSelector
                title='Services & Treatments'
                category='services'
                selectedItems={form.values.services_offered}
                availableItems={services}
                onChange={(selected) =>
                  form.handleChange('services_offered', selected)
                }
                placeholder='Search for services...'
                allowCustom={true}
              />
              {form.errors.services_offered && (
                <p className='text-sm text-red-500'>
                  {form.errors.services_offered}
                </p>
              )}
            </div>

            {/* Specializations */}
            <div className='space-y-2'>
              <Label>Specializations</Label>
              <ServiceSelector
                title='Medical Specializations'
                category='specializations'
                selectedItems={form.values.specializations}
                availableItems={specializations}
                onChange={(selected) =>
                  form.handleChange('specializations', selected)
                }
                placeholder='Search for specializations...'
                allowCustom={true}
              />
              {form.errors.specializations && (
                <p className='text-sm text-red-500'>
                  {form.errors.specializations}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                label='Facebook URL'
                type='url'
                value={form.values.facebook_url || ''}
                onChange={(value) => form.handleChange('facebook_url', value)}
                onBlur={() => form.handleBlur('facebook_url')}
                error={form.errors.facebook_url}
                placeholder='Enter Facebook page URL'
              />
              <FormField
                label='Instagram URL'
                type='url'
                value={form.values.instagram_url || ''}
                onChange={(value) => form.handleChange('instagram_url', value)}
                onBlur={() => form.handleBlur('instagram_url')}
                error={form.errors.instagram_url}
                placeholder='Enter Instagram profile URL'
              />
            </div>
          </CardContent>
        </Card>

        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.back()}
            disabled={form.loading}
          >
            Cancel
          </Button>
          <PrimaryButton type='submit' disabled={form.loading}>
            Create Clinic
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
