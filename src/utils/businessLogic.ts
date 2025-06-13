import { Clinic } from '@/types/clinic';
import { UserWithRole, AdminRole } from '@/types/auth';

// ============================================================================
// ADDRESS UTILITIES
// ============================================================================

export interface AddressComponents {
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
}

export interface AddressFormatOptions {
  includeCountry?: boolean;
  separator?: string;
  fallback?: string;
  includePostcode?: boolean;
}

export const formatAddress = (
  components: AddressComponents,
  options: AddressFormatOptions = {}
): string => {
  const {
    includeCountry = false,
    separator = ', ',
    fallback = 'Address not available',
    includePostcode = true,
  } = options;

  const parts: string[] = [];

  if (components.street?.trim()) parts.push(components.street.trim());
  if (components.city?.trim()) parts.push(components.city.trim());
  if (components.state?.trim()) parts.push(components.state.trim());
  if (includePostcode && components.postcode?.trim()) {
    parts.push(components.postcode.trim());
  }
  if (includeCountry) parts.push('Malaysia');

  return parts.length > 0 ? parts.join(separator) : fallback;
};

export const formatAddressForMaps = (components: AddressComponents): string => {
  return formatAddress(components, {
    includeCountry: true,
    separator: ', ',
    fallback: '',
  });
};

export const formatAddressShort = (components: AddressComponents): string => {
  const parts: string[] = [];
  if (components.city?.trim()) parts.push(components.city.trim());
  if (components.state?.trim()) parts.push(components.state.trim());

  return parts.length > 0 ? parts.join(', ') : 'Location not available';
};

// ============================================================================
// PHONE UTILITIES
// ============================================================================

export interface PhoneFormatOptions {
  format?: 'display' | 'tel' | 'international';
  fallback?: string;
}

export const formatPhone = (
  phone: string,
  options: PhoneFormatOptions = {}
): string => {
  const { format = 'display', fallback = '' } = options;

  if (!phone?.trim()) return fallback;

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Handle different formats
  switch (format) {
    case 'tel':
      // Return clean format for tel: links
      return cleaned.startsWith('60') ? `+${cleaned}` : phone;

    case 'international':
      // Force international format
      if (cleaned.startsWith('60')) {
        return `+${cleaned}`;
      } else if (cleaned.startsWith('0')) {
        return `+60${cleaned.slice(1)}`;
      }
      return `+60${cleaned}`;

    case 'display':
    default:
      // Format for display
      if (cleaned.startsWith('60')) {
        const withoutCountry = cleaned.slice(2);
        if (withoutCountry.length >= 8) {
          return `+60 ${withoutCountry.slice(0, 1)}-${withoutCountry.slice(
            1,
            5
          )} ${withoutCountry.slice(5)}`;
        }
      }
      return phone; // Return original if can't format
  }
};

export const validatePhone = (phone: string): boolean => {
  if (!phone?.trim()) return false;

  const cleaned = phone.replace(/\D/g, '');

  // Malaysian phone patterns
  const patterns = [
    /^60[1-9]\d{8,9}$/, // Mobile: 60123456789
    /^60[2-9]\d{7,8}$/, // Landline: 6031234567
  ];

  return patterns.some((pattern) => pattern.test(cleaned));
};

// ============================================================================
// OPERATING HOURS UTILITIES
// ============================================================================

export interface OperatingHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface BusinessHoursItem {
  day: string;
  hours: string;
  isToday: boolean;
  isOpen: boolean;
}

export interface HoursFormatOptions {
  includeToday?: boolean;
  format?: 'full' | 'compact' | 'today-only';
  fallback?: string;
}

const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const DAY_DISPLAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const getTodayHours = (
  hours: OperatingHours | undefined,
  fallback: string = 'Hours not available'
): string => {
  if (!hours) return fallback;

  const today = new Date().getDay();
  const todayName = DAY_NAMES[today];

  return hours[todayName as keyof OperatingHours] || 'Closed';
};

export const formatOperatingHours = (
  hours: OperatingHours | undefined,
  options: HoursFormatOptions = {}
): string => {
  const { format = 'today-only', fallback = 'Hours not available' } = options;

  if (!hours) return fallback;

  if (format === 'today-only') {
    return getTodayHours(hours, fallback);
  }

  // For other formats, return formatted business hours
  const businessHours = formatBusinessHours(hours);

  if (format === 'compact') {
    return businessHours.map((item) => `${item.day}: ${item.hours}`).join(', ');
  }

  return businessHours.map((item) => `${item.day}: ${item.hours}`).join('\n');
};

export const formatBusinessHours = (
  hours: OperatingHours | undefined
): BusinessHoursItem[] => {
  if (!hours) return [];

  const today = new Date().getDay();
  const todayName = DAY_NAMES[today];

  return DAY_NAMES.map((day, index) => {
    const dayHours = hours[day as keyof OperatingHours] || 'Closed';
    const isOpen = dayHours.toLowerCase() !== 'closed';

    return {
      day: DAY_DISPLAY_NAMES[index],
      hours: dayHours,
      isToday: day === todayName,
      isOpen,
    };
  });
};

export const isCurrentlyOpen = (
  hours: OperatingHours | undefined,
  currentTime?: Date
): boolean => {
  if (!hours) return false;

  const now = currentTime || new Date();
  const today = DAY_NAMES[now.getDay()];
  const todayHours = hours[today as keyof OperatingHours];

  if (!todayHours || todayHours.toLowerCase() === 'closed') {
    return false;
  }

  // Handle 24-hour format
  if (todayHours.toLowerCase().includes('24 hour')) {
    return true;
  }

  // Parse time ranges (e.g., "09:00 - 18:00" or "09:00 - 12:00, 14:00 - 18:00")
  const timeRanges = todayHours.split(',').map((range) => range.trim());
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return timeRanges.some((range) => {
    const [start, end] = range.split('-').map((time) => time.trim());
    if (!start || !end) return false;

    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    if (
      isNaN(startHour) ||
      isNaN(startMin) ||
      isNaN(endHour) ||
      isNaN(endMin)
    ) {
      return false;
    }

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  });
};

// ============================================================================
// PERMISSION UTILITIES
// ============================================================================

export interface PermissionCheck {
  resource: string;
  action: string;
  requireAll?: boolean;
}

export const checkPermission = (
  user: UserWithRole | null,
  resource: string,
  action: string
): boolean => {
  if (!user) return false;

  const permissions = user.permissions[resource];
  if (!permissions) return false;

  return permissions.includes(action);
};

export const checkMultiplePermissions = (
  user: UserWithRole | null,
  checks: PermissionCheck[],
  requireAll: boolean = false
): boolean => {
  if (!user || checks.length === 0) return false;

  const results = checks.map((check) =>
    checkPermission(user, check.resource, check.action)
  );

  return requireAll ? results.every(Boolean) : results.some(Boolean);
};

export const hasRole = (
  user: UserWithRole | null,
  role: AdminRole['name']
): boolean => {
  if (!user) return false;
  return user.role.name === role;
};

export const hasAnyRole = (
  user: UserWithRole | null,
  roles: AdminRole['name'][]
): boolean => {
  if (!user || roles.length === 0) return false;
  return roles.includes(user.role.name);
};

export const isSuperAdmin = (user: UserWithRole | null): boolean => {
  return hasRole(user, 'super_admin');
};

// Specific permission checks for common actions
export const canManageClinics = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'clinics', 'write') || isSuperAdmin(user);
};

export const canViewClinics = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'clinics', 'read') || isSuperAdmin(user);
};

export const canDeleteClinics = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'clinics', 'delete') || isSuperAdmin(user);
};

export const canViewAnalytics = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'analytics', 'read') || isSuperAdmin(user);
};

export const canManageUsers = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'users', 'write') || isSuperAdmin(user);
};

export const canManageSystem = (user: UserWithRole | null): boolean => {
  return checkPermission(user, 'system', 'write') || isSuperAdmin(user);
};

// ============================================================================
// CLINIC STATUS UTILITIES
// ============================================================================

export type ClinicStatus = 'open' | 'closed' | 'emergency' | 'unknown';

export interface ClinicStatusInfo {
  status: ClinicStatus;
  message: string;
  isEmergency: boolean;
  nextStatusChange?: string;
}

export const getClinicStatus = (
  clinic: Partial<Clinic>,
  currentTime?: Date
): ClinicStatusInfo => {
  const now = currentTime || new Date();

  if (!clinic.hours) {
    return {
      status: 'unknown',
      message: 'Hours not available',
      isEmergency: !!clinic.emergency,
    };
  }

  const isOpen = isCurrentlyOpen(clinic.hours, now);
  const isEmergency = !!clinic.emergency;

  if (isEmergency) {
    return {
      status: 'emergency',
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
  return clinics.filter((clinic) => {
    // Text search
    if (filters.query) {
      const searchTerm = filters.query.toLowerCase();
      const searchableText = [
        clinic.name,
        clinic.city,
        clinic.state,
        clinic.street,
        ...(clinic.specializations || []),
        ...(clinic.services_offered || []),
      ]
        .join(' ')
        .toLowerCase();

      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    // Location filters
    if (
      filters.city &&
      clinic.city?.toLowerCase() !== filters.city.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.state &&
      clinic.state?.toLowerCase() !== filters.state.toLowerCase()
    ) {
      return false;
    }

    // Emergency filter
    if (
      filters.emergency !== undefined &&
      clinic.emergency !== filters.emergency
    ) {
      return false;
    }

    // Currently open filter
    if (filters.isOpen !== undefined) {
      const isOpen = isCurrentlyOpen(clinic.hours);
      if (isOpen !== filters.isOpen) {
        return false;
      }
    }

    // Services filter
    if (filters.services && filters.services.length > 0) {
      const clinicServices = clinic.services_offered || [];
      const hasMatchingService = filters.services.some((service) =>
        clinicServices.includes(service)
      );
      if (!hasMatchingService) {
        return false;
      }
    }

    // Specializations filter
    if (filters.specializations && filters.specializations.length > 0) {
      const clinicSpecs = clinic.specializations || [];
      const hasMatchingSpec = filters.specializations.some((spec) =>
        clinicSpecs.includes(spec)
      );
      if (!hasMatchingSpec) {
        return false;
      }
    }

    return true;
  });
};

export const sortClinics = (
  clinics: Clinic[],
  sortBy: 'name' | 'city' | 'state' | 'emergency' = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
): Clinic[] => {
  return [...clinics].sort((a, b) => {
    let aValue: string | boolean;
    let bValue: string | boolean;

    switch (sortBy) {
      case 'name':
        aValue = a.name || '';
        bValue = b.name || '';
        break;
      case 'city':
        aValue = a.city || '';
        bValue = b.city || '';
        break;
      case 'state':
        aValue = a.state || '';
        bValue = b.state || '';
        break;
      case 'emergency':
        aValue = a.emergency || false;
        bValue = b.emergency || false;
        break;
      default:
        aValue = a.name || '';
        bValue = b.name || '';
    }

    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortOrder === 'asc'
        ? aValue === bValue
          ? 0
          : aValue
          ? 1
          : -1
        : aValue === bValue
        ? 0
        : aValue
        ? -1
        : 1;
    }

    const result = aValue.toString().localeCompare(bValue.toString());
    return sortOrder === 'asc' ? result : -result;
  });
};
