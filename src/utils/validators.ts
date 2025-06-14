import { z } from 'zod';

const operatingHoursSchema = z.object({
  monday: z.string(),
  tuesday: z.string(),
  wednesday: z.string(),
  thursday: z.string(),
  friday: z.string(),
  saturday: z.string(),
  sunday: z.string(),
});

export const clinicSchema = z.object({
  name: z.string().min(1, 'Clinic name is required'),
  street: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postcode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  emergency: z.boolean(),
  emergency_hours: z.string().optional(),
  emergency_details: z.string().optional(),
  hours: operatingHoursSchema,
  animals_treated: z.array(z.string()),
  specializations: z.array(z.string()),
  services_offered: z.array(z.string()),
  facebook_url: z
    .string()
    .url('Invalid Facebook URL')
    .optional()
    .or(z.literal('')),
  instagram_url: z
    .string()
    .url('Invalid Instagram URL')
    .optional()
    .or(z.literal('')),
});

export const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  agreeToPrivacy: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the privacy policy'),
});

export const adminSignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
