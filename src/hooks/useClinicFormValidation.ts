import { useState } from 'react';

export interface ValidationError {
  message: string;
  field?: string;
}

interface ValidationState {
  errors: ValidationError[];
  touched: Record<string, boolean>;
}

export function useClinicFormValidation() {
  const [validationState, setValidationState] = useState<ValidationState>({
    errors: [],
    touched: {},
  });

  // Real validation logic implementation
  const validateForm = (
    formData: Record<string, unknown>
  ): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Validate required fields
    if (
      !formData.name ||
      typeof formData.name !== 'string' ||
      !formData.name.trim()
    ) {
      errors.push({ message: 'Clinic name is required', field: 'name' });
    }

    if (
      !formData.city ||
      typeof formData.city !== 'string' ||
      !formData.city.trim()
    ) {
      errors.push({ message: 'City is required', field: 'city' });
    }

    if (
      !formData.state ||
      typeof formData.state !== 'string' ||
      !formData.state.trim()
    ) {
      errors.push({ message: 'State is required', field: 'state' });
    }

    // Validate phone format if provided
    if (formData.phone && typeof formData.phone === 'string') {
      const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.push({ message: 'Invalid phone number format', field: 'phone' });
      }
    }

    // Validate email format if provided
    if (formData.email && typeof formData.email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push({ message: 'Invalid email format', field: 'email' });
      }
    }

    // Validate website URL if provided
    if (formData.website && typeof formData.website === 'string') {
      try {
        new URL(formData.website);
      } catch {
        errors.push({ message: 'Invalid website URL', field: 'website' });
      }
    }

    // Validate social media URLs if provided
    if (formData.facebook_url && typeof formData.facebook_url === 'string') {
      try {
        new URL(formData.facebook_url);
      } catch {
        errors.push({ message: 'Invalid Facebook URL', field: 'facebook_url' });
      }
    }

    if (formData.instagram_url && typeof formData.instagram_url === 'string') {
      try {
        new URL(formData.instagram_url);
      } catch {
        errors.push({
          message: 'Invalid Instagram URL',
          field: 'instagram_url',
        });
      }
    }

    // Validate operating hours if provided
    if (formData.hours && typeof formData.hours === 'object') {
      const hours = formData.hours as Record<string, string>;
      const timeRegex =
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      const closedRegex = /^closed$/i;

      Object.entries(hours).forEach(([day, time]) => {
        if (!timeRegex.test(time) && !closedRegex.test(time)) {
          errors.push({
            message: `Invalid time format for ${day}. Use format: HH:MM - HH:MM or "Closed"`,
            field: `hours.${day}`,
          });
        }
      });
    }

    // Update validation state
    setValidationState((prev) => ({
      ...prev,
      errors,
    }));

    return errors;
  };

  const getFieldError = (field: string): string | undefined => {
    // Find the first error for the given field
    const error = validationState.errors.find((err) => err.field === field);
    return error?.message;
  };

  const clearErrors = (): void => {
    setValidationState((prev) => ({
      ...prev,
      errors: [],
    }));
  };

  const setFieldTouched = (field: string, touched: boolean = true): void => {
    setValidationState((prev) => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: touched,
      },
    }));
  };

  const isFieldTouched = (field: string): boolean => {
    return validationState.touched[field] || false;
  };

  const hasErrors = (): boolean => {
    return validationState.errors.length > 0;
  };

  const getErrors = (): ValidationError[] => {
    return validationState.errors;
  };

  return {
    validateForm,
    getFieldError,
    clearErrors,
    setFieldTouched,
    isFieldTouched,
    hasErrors,
    getErrors,
  };
}
