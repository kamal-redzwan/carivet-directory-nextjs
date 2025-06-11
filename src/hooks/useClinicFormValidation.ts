export interface ValidationError {
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useClinicFormValidation() {
  // Dummy implementation, replace with your real validation logic
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const validateForm = (_formData: unknown): ValidationError[] => {
    // Return an array of error objects: { message: string }
    return [];
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getFieldError = (_field: string): string | undefined => undefined;
  const clearErrors = (): void => {};

  return { validateForm, getFieldError, clearErrors };
}
