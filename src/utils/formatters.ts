// src/utils/formatters.ts
import { Clinic } from '@/types/clinic';

// ============================================================================
// ADDRESS FORMATTING (Enhanced)
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

// Enhanced formatAddress with backward compatibility
export const formatAddress = (
  clinic: Partial<Clinic> | AddressComponents,
  options: AddressFormatOptions = {}
): string => {
  const {
    includeCountry = false,
    separator = ', ',
    fallback = 'Address not available',
    includePostcode = true,
  } = options;

  const parts: string[] = [];

  if (clinic.street?.trim()) parts.push(clinic.street.trim());
  if (clinic.city?.trim()) parts.push(clinic.city.trim());
  if (clinic.state?.trim()) parts.push(clinic.state.trim());
  if (includePostcode && clinic.postcode?.trim()) {
    parts.push(clinic.postcode.trim());
  }
  if (includeCountry) parts.push('Malaysia');

  return parts.length > 0 ? parts.join(separator) : fallback;
};

// New utility functions for different address formats
export const formatAddressForMaps = (clinic: Partial<Clinic>): string => {
  return formatAddress(clinic, {
    includeCountry: true,
    separator: ', ',
    fallback: '',
  });
};

export const formatAddressShort = (clinic: Partial<Clinic>): string => {
  const parts: string[] = [];
  if (clinic.city?.trim()) parts.push(clinic.city.trim());
  if (clinic.state?.trim()) parts.push(clinic.state.trim());

  return parts.length > 0 ? parts.join(', ') : 'Location not available';
};

// ============================================================================
// PHONE FORMATTING (Enhanced)
// ============================================================================

export interface PhoneFormatOptions {
  format?: 'display' | 'tel' | 'international';
  fallback?: string;
}

// Enhanced formatPhone with multiple format options
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
      // Enhanced display formatting (backward compatible)
      if (cleaned.startsWith('60')) {
        const withoutCountry = cleaned.slice(2);
        if (withoutCountry.length >= 8) {
          // Mobile numbers (10-11 digits total)
          if (withoutCountry.length >= 9) {
            return `+60 ${withoutCountry.slice(0, 2)}-${withoutCountry.slice(
              2,
              6
            )} ${withoutCountry.slice(6)}`;
          } else {
            // Landline numbers (8-9 digits total)
            return `+60 ${withoutCountry.slice(0, 1)}-${withoutCountry.slice(
              1,
              5
            )} ${withoutCountry.slice(5)}`;
          }
        }
      }
      // If can't format properly, return original
      return phone;
  }
};

// New phone validation utility
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
// OPERATING HOURS FORMATTING (Enhanced)
// ============================================================================

export interface HoursFormatOptions {
  fallback?: string;
  format?: 'full' | 'compact' | 'today-only';
}

// Enhanced formatOperatingHours with backward compatibility
export const formatOperatingHours = (
  hours: Clinic['hours'],
  day?: string,
  options: HoursFormatOptions = {}
): string => {
  const { fallback = 'Hours not available' } = options;

  if (!hours) return fallback;

  if (day) {
    return hours[day as keyof typeof hours] || 'Closed';
  }

  // Get today's hours (backward compatible)
  return getTodayHours(hours, fallback);
};

// New utility function for getting today's hours
export const getTodayHours = (
  hours: Clinic['hours'] | undefined,
  fallback: string = 'Hours not available'
): string => {
  if (!hours) return fallback;

  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const today = days[new Date().getDay()];

  return hours[today as keyof typeof hours] || 'Closed';
};

// Enhanced formatBusinessHours with status info
export const formatBusinessHours = (
  hours: Clinic['hours']
): Array<{ day: string; hours: string; isToday: boolean; isOpen: boolean }> => {
  if (!hours) return [];

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  const today = new Date().getDay();
  const todayName = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ][today];

  return days.map((day) => {
    const dayHours = hours[day as keyof typeof hours] || 'Closed';
    const isOpen = dayHours.toLowerCase() !== 'closed';

    return {
      day: day.charAt(0).toUpperCase() + day.slice(1),
      hours: dayHours,
      isToday: day === todayName,
      isOpen,
    };
  });
};

// New utility for checking if currently open
export const isCurrentlyOpen = (
  hours: Clinic['hours'] | undefined,
  currentTime?: Date
): boolean => {
  if (!hours) return false;

  const now = currentTime || new Date();
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const today = days[now.getDay()];
  const todayHours = hours[today as keyof typeof hours];

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
// NEW UTILITY FUNCTIONS
// ============================================================================

// Clinic status utility
export type ClinicStatus = 'open' | 'closed' | 'emergency' | 'unknown';

export interface ClinicStatusInfo {
  status: ClinicStatus;
  message: string;
  isEmergency: boolean;
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

// Format time for display
export const formatTimeRange = (start: string, end: string): string => {
  if (!start || !end) return 'Invalid time range';

  // Simple validation
  const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timePattern.test(start) || !timePattern.test(end)) {
    return `${start} - ${end}`; // Return as-is if not standard format
  }

  return `${start} - ${end}`;
};

// Format business hours for different contexts
export const formatHoursForDisplay = (
  hours: Clinic['hours'],
  context: 'card' | 'detail' | 'today' = 'card'
): string => {
  if (!hours) return 'Hours not available';

  switch (context) {
    case 'today':
      return getTodayHours(hours);

    case 'card':
      return `Today: ${getTodayHours(hours)}`;

    case 'detail':
      const businessHours = formatBusinessHours(hours);
      return businessHours
        .map(({ day, hours }) => `${day}: ${hours}`)
        .join('\n');

    default:
      return getTodayHours(hours);
  }
};
