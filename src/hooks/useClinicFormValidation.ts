export interface ValidationError {
  message: string;
}

export function useClinicFormValidation() {
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
      errors.push({ message: 'Clinic name is required' });
    }

    if (
      !formData.city ||
      typeof formData.city !== 'string' ||
      !formData.city.trim()
    ) {
      errors.push({ message: 'City is required' });
    }

    if (
      !formData.state ||
      typeof formData.state !== 'string' ||
      !formData.state.trim()
    ) {
      errors.push({ message: 'State is required' });
    }

    // Validate phone format if provided
    if (formData.phone && typeof formData.phone === 'string') {
      const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.push({ message: 'Invalid phone number format' });
      }
    }

    // Validate email format if provided
    if (formData.email && typeof formData.email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push({ message: 'Invalid email format' });
      }
    }

    return errors;
  };

  const getFieldError = (field: string): string | undefined => {
    // Implementation to get specific field error
    // This would typically be connected to your form state
    return undefined;
  };

  const clearErrors = (): void => {
    // Implementation to clear all validation errors
    // This would typically clear form state errors
  };

  return { validateForm, getFieldError, clearErrors };
}
