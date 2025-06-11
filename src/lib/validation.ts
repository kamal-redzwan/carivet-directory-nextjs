export const clinicValidationRules = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  phone: {
    pattern: /^\+60\s?\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}$/,
    message: 'Use format: +60 3-1234 5678',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Enter a valid email address',
  },
  website: {
    pattern: /^https?:\/\/.+/,
    message: 'URL must start with http:// or https://',
  },
};
