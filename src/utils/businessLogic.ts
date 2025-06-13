// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface Clinic {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email?: string | null;
  website?: string | null;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  emergency: boolean;
  emergency_hours?: string | null;
  emergency_details?: string | null;
  animals_treated: string[];
  specializations: string[];
  services_offered: string[];
  facebook_url?: string | null;
  instagram_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface ClinicStatus {
  status: 'open' | 'closed';
  message: string;
  isEmergency: boolean;
}

// ============================================================================
// BUSINESS LOGIC UTILITIES
// ============================================================================

export const getClinicStatus = (
  hours?: BusinessHours,
  emergency = false
): ClinicStatus => {
  if (!hours) {
    return {
      status: 'closed',
      message: 'Hours not available',
      isEmergency: emergency,
    };
  }

  const now = new Date();
  const currentDay = now
    .toLocaleDateString('en-US', {
      weekday: 'long',
    })
    .toLowerCase() as keyof BusinessHours;
  const currentTime = now.getHours() * 100 + now.getMinutes(); // Convert to HHMM format

  const todayHours = hours[currentDay];

  if (!todayHours || todayHours.toLowerCase() === 'closed') {
    return {
      status: 'closed',
      message: emergency ? 'Closed - Emergency services available' : 'Closed',
      isEmergency: emergency,
    };
  }

  // Parse hours (assume format like "9:00 AM - 5:00 PM")
  const hoursMatch = todayHours.match(
    /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i
  );

  if (!hoursMatch) {
    return {
      status: 'closed',
      message: 'Hours format invalid',
      isEmergency: emergency,
    };
  }

  const [, openHour, openMin, openPeriod, closeHour, closeMin, closePeriod] =
    hoursMatch;

  const openTime = convertTo24Hour(
    parseInt(openHour),
    parseInt(openMin),
    openPeriod
  );
  const closeTime = convertTo24Hour(
    parseInt(closeHour),
    parseInt(closeMin),
    closePeriod
  );

  const isOpen = currentTime >= openTime && currentTime <= closeTime;

  if (emergency) {
    return {
      status: isOpen ? 'open' : 'closed',
      message: isOpen
        ? 'Open - Emergency services available'
        : 'Closed - Emergency services available',
      isEmergency: true,
    };
  }

  return {
    status: isOpen ? 'open' : 'closed',
    message: isOpen ? 'Currently Open' : 'Currently Closed',
    isEmergency: false,
  };
};

// Helper function to convert 12-hour to 24-hour format
const convertTo24Hour = (
  hour: number,
  minute: number,
  period: string
): number => {
  let hour24 = hour;
  if (period.toUpperCase() === 'PM' && hour !== 12) {
    hour24 += 12;
  } else if (period.toUpperCase() === 'AM' && hour === 12) {
    hour24 = 0;
  }
  return hour24 * 100 + minute;
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export const validateClinicData = (
  clinic: Partial<Clinic>
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!clinic.name?.trim()) {
    errors.push('Clinic name is required');
  }

  if (!clinic.city?.trim()) {
    errors.push('City is required');
  }

  if (!clinic.state?.trim()) {
    errors.push('State is required');
  }

  // Optional but recommended fields
  if (!clinic.phone?.trim()) {
    warnings.push('Phone number is recommended');
  }

  if (!clinic.street?.trim()) {
    warnings.push('Street address is recommended');
  }

  // Validate phone if provided
  if (clinic.phone && !validatePhone(clinic.phone)) {
    errors.push('Invalid phone number format');
  }

  // Validate email if provided
  if (clinic.email && !isValidEmail(clinic.email)) {
    errors.push('Invalid email format');
  }

  // Validate website if provided
  if (clinic.website && !isValidUrl(clinic.website)) {
    errors.push('Invalid website URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Phone validation function
export const validatePhone = (phone: string): boolean => {
  // Support various phone formats including international
  const phoneRegex = /^[+]?[\d\s\-\(\)]{7,20}$/;
  return phoneRegex.test(phone.trim());
};

// Helper validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ============================================================================
// SEARCH AND FILTER UTILITIES
// ============================================================================

export interface SearchFilters {
  query?: string;
  city?: string;
  state?: string;
  emergency?: boolean;
  isOpen?: boolean;
  services?: string[];
  specializations?: string[];
}

export const searchClinics = (
  clinics: Clinic[],
  filters: SearchFilters
): Clinic[] => {
  return filterClinics(clinics, filters);
};

export const sortClinics = (
  clinics: Clinic[],
  sortBy: 'name' | 'city' | 'state' | 'emergency',
  sortOrder: 'asc' | 'desc'
): Clinic[] => {
  return [...clinics].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'city':
        comparison = a.city.localeCompare(b.city);
        break;
      case 'state':
        comparison = a.state.localeCompare(b.state);
        break;
      case 'emergency':
        comparison = (a.emergency ? 1 : 0) - (b.emergency ? 1 : 0);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

export const isCurrentlyOpen = (hours?: BusinessHours): boolean => {
  const status = getClinicStatus(hours);
  return status.status === 'open';
};

export const filterClinics = (
  clinics: Clinic[],
  filters: SearchFilters
): Clinic[] => {
  return clinics.filter((clinic) => {
    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchableText = [
        clinic.name,
        clinic.city,
        clinic.state,
        ...(clinic.services_offered || []),
        ...(clinic.specializations || []),
      ]
        .join(' ')
        .toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Location filters
    if (
      filters.city &&
      clinic.city.toLowerCase() !== filters.city.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.state &&
      clinic.state.toLowerCase() !== filters.state.toLowerCase()
    ) {
      return false;
    }

    // Emergency services filter
    if (filters.emergency && !clinic.emergency) {
      return false;
    }

    // Open status filter
    if (filters.isOpen !== undefined) {
      const status = getClinicStatus(clinic.hours, clinic.emergency);
      if ((status.status === 'open') !== filters.isOpen) {
        return false;
      }
    }

    // Services filter
    if (filters.services && filters.services.length > 0) {
      const clinicServices = clinic.services_offered || [];
      const hasRequiredServices = filters.services.some((service) =>
        clinicServices.some((cs) =>
          cs.toLowerCase().includes(service.toLowerCase())
        )
      );
      if (!hasRequiredServices) {
        return false;
      }
    }

    // Specializations filter
    if (filters.specializations && filters.specializations.length > 0) {
      const clinicSpecs = clinic.specializations || [];
      const hasRequiredSpecs = filters.specializations.some((spec) =>
        clinicSpecs.some((cs) => cs.toLowerCase().includes(spec.toLowerCase()))
      );
      if (!hasRequiredSpecs) {
        return false;
      }
    }

    return true;
  });
};
