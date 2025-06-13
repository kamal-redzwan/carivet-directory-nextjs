// src/utils/constants.ts
export const MALAYSIAN_STATES = [
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
] as const;

export const COMMON_ANIMALS = [
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
] as const;

export const VETERINARY_SPECIALIZATIONS = [
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
  'Behavioral Medicine',
  'Radiology',
  'Anesthesiology',
  'Pathology',
] as const;

export const VETERINARY_SERVICES = [
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
  'Microchipping',
  'Spay/Neuter',
  'Parasite Control',
  'Behavioral Consultation',
  'Nutritional Counseling',
  'Senior Pet Care',
  'Puppy/Kitten Care',
  'End-of-Life Care',
] as const;

export const BUSINESS_HOURS_PRESETS = {
  standard: {
    monday: '09:00 - 18:00',
    tuesday: '09:00 - 18:00',
    wednesday: '09:00 - 18:00',
    thursday: '09:00 - 18:00',
    friday: '09:00 - 18:00',
    saturday: '09:00 - 14:00',
    sunday: 'Closed',
  },
  extended: {
    monday: '08:00 - 20:00',
    tuesday: '08:00 - 20:00',
    wednesday: '08:00 - 20:00',
    thursday: '08:00 - 20:00',
    friday: '08:00 - 20:00',
    saturday: '08:00 - 16:00',
    sunday: '10:00 - 14:00',
  },
  emergency: {
    monday: '24 Hours',
    tuesday: '24 Hours',
    wednesday: '24 Hours',
    thursday: '24 Hours',
    friday: '24 Hours',
    saturday: '24 Hours',
    sunday: '24 Hours',
  },
} as const;

export const VALIDATION_RULES = {
  clinic: {
    name: {
      minLength: 3,
      maxLength: 100,
      required: true,
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
    postcode: {
      pattern: /^\d{5}$/,
      message: 'Malaysian postcode must be 5 digits',
    },
  },
  contact: {
    firstName: {
      minLength: 2,
      maxLength: 50,
      required: true,
    },
    lastName: {
      minLength: 2,
      maxLength: 50,
      required: true,
    },
    message: {
      minLength: 10,
      maxLength: 1000,
      required: true,
    },
  },
} as const;

export const STATUS_TYPES = {
  verification: ['pending', 'verified', 'rejected'] as const,
  emergency: ['regular', 'emergency'] as const,
  activity: ['active', 'inactive'] as const,
} as const;

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  CLINIC_OWNER: 'clinic_owner',
} as const;

export const PERMISSIONS = {
  CLINICS: {
    READ: 'read',
    WRITE: 'write',
    DELETE: 'delete',
  },
  USERS: {
    READ: 'read',
    WRITE: 'write',
    DELETE: 'delete',
  },
  CONTENT: {
    READ: 'read',
    WRITE: 'write',
    DELETE: 'delete',
  },
  ANALYTICS: {
    READ: 'read',
    WRITE: 'write',
  },
  SYSTEM: {
    READ: 'read',
    WRITE: 'write',
    DELETE: 'delete',
  },
} as const;

// src/utils/businessRules.ts
import { Clinic } from '@/types/clinic';
import { UserWithRole } from '@/types/auth';

// Clinic business rules
export const clinicBusinessRules = {
  // Determine if clinic can be featured
  canBeFeatured: (clinic: Clinic): boolean => {
    return (
      clinic.emergency ||
      (clinic.specializations && clinic.specializations.length >= 3) ||
      (clinic.services_offered && clinic.services_offered.length >= 5)
    );
  },

  // Calculate clinic completeness score
  getCompletenessScore: (clinic: Clinic): number => {
    const checks = [
      !!clinic.name,
      !!clinic.street,
      !!clinic.city,
      !!clinic.state,
      !!clinic.phone,
      !!clinic.email,
      !!clinic.website,
      !!clinic.hours,
      !!(clinic.animals_treated && clinic.animals_treated.length > 0),
      !!(clinic.specializations && clinic.specializations.length > 0),
      !!(clinic.services_offered && clinic.services_offered.length > 0),
    ];

    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  },

  // Determine clinic priority for search results
  getSearchPriority: (clinic: Clinic): number => {
    let priority = 0;

    // Emergency clinics get highest priority
    if (clinic.emergency) priority += 100;

    // More specializations = higher priority
    priority += (clinic.specializations?.length || 0) * 10;

    // More services = higher priority
    priority += (clinic.services_offered?.length || 0) * 5;

    // Complete contact info = higher priority
    if (clinic.phone) priority += 20;
    if (clinic.website) priority += 15;
    if (clinic.email) priority += 10;

    return priority;
  },

  // Validate clinic hours format
  validateHours: (
    hours: Clinic['hours']
  ): { isValid: boolean; errors: string[] } => {
    if (!hours) {
      return { isValid: false, errors: ['Hours are required'] };
    }

    const errors: string[] = [];
    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    days.forEach((day) => {
      const dayHours = hours[day as keyof typeof hours];
      if (!dayHours) {
        errors.push(`${day} hours are missing`);
        return;
      }

      if (dayHours.toLowerCase() === 'closed') {
        return; // Valid
      }

      // Check format: "HH:MM - HH:MM" or "24 Hours"
      const timePattern =
        /^(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}(,\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})*|24\s*hours?)$/i;
      if (!timePattern.test(dayHours)) {
        errors.push(`Invalid format for ${day}: ${dayHours}`);
      }
    });

    return { isValid: errors.length === 0, errors };
  },

  // Get recommended services based on specializations
  getRecommendedServices: (specializations: string[]): string[] => {
    const serviceMap: Record<string, string[]> = {
      Surgery: ['Spay/Neuter', 'Soft Tissue Surgery', 'Orthopedic Surgery'],
      Dentistry: ['Dental Cleaning', 'Tooth Extraction', 'Dental X-Ray'],
      Dermatology: [
        'Skin Consultation',
        'Allergy Testing',
        'Dermatological Treatment',
      ],
      Cardiology: ['Heart Examination', 'ECG', 'Cardiac Ultrasound'],
      Oncology: ['Cancer Screening', 'Chemotherapy', 'Tumor Removal'],
      'Emergency Medicine': [
        '24/7 Emergency Care',
        'Critical Care',
        'Emergency Surgery',
      ],
    };

    const recommended = new Set<string>();
    specializations.forEach((spec) => {
      serviceMap[spec]?.forEach((service) => recommended.add(service));
    });

    return Array.from(recommended);
  },
};

// User access business rules
export const userAccessRules = {
  // Determine which clinics user can access
  getAccessibleClinics: (
    user: UserWithRole | null,
    allClinics: Clinic[]
  ): Clinic[] => {
    if (!user) return [];

    // Super admin and admin can see all
    if (['super_admin', 'admin'].includes(user.role.name)) {
      return allClinics;
    }

    // Moderators can see verified clinics
    if (user.role.name === 'moderator') {
      return allClinics.filter(
        (clinic) =>
          !clinic.verification_status ||
          clinic.verification_status === 'verified'
      );
    }

    // Clinic owners can only see their own clinics
    if (user.role.name === 'clinic_owner') {
      // This would need to be enhanced with actual ownership data
      return allClinics.filter((clinic) => clinic.user_id === user.user.id);
    }

    return [];
  },

  // Check if user can perform action on specific clinic
  canPerformAction: (
    user: UserWithRole | null,
    action: string,
    clinic: Clinic
  ): boolean => {
    if (!user) return false;

    // Super admin can do anything
    if (user.role.name === 'super_admin') return true;

    // Check specific actions
    switch (action) {
      case 'view':
        return ['admin', 'moderator', 'clinic_owner'].includes(user.role.name);

      case 'edit':
        if (user.role.name === 'admin') return true;
        if (user.role.name === 'clinic_owner') {
          // Check if user owns this clinic
          return clinic.user_id === user.user.id;
        }
        return false;

      case 'delete':
        return ['admin'].includes(user.role.name);

      case 'verify':
        return ['admin', 'moderator'].includes(user.role.name);

      case 'feature':
        return ['admin'].includes(user.role.name);

      default:
        return false;
    }
  },
};

// Search and filtering business rules
export const searchRules = {
  // Boost clinics in search results
  applySearchBoosts: (clinics: Clinic[], query?: string): Clinic[] => {
    return clinics
      .map((clinic) => ({
        ...clinic,
        _searchScore: clinicBusinessRules.getSearchPriority(clinic),
        _isExactMatch: query
          ? clinic.name.toLowerCase().includes(query.toLowerCase())
          : false,
      }))
      .sort((a, b) => {
        // Exact matches first
        if (a._isExactMatch && !b._isExactMatch) return -1;
        if (!a._isExactMatch && b._isExactMatch) return 1;

        // Then by search score
        return (b._searchScore || 0) - (a._searchScore || 0);
      });
  },

  // Filter clinics by distance (if coordinates available)
  filterByDistance: (
    clinics: Clinic[],
    userLat: number,
    userLng: number,
    maxDistance: number
  ): Clinic[] => {
    return clinics.filter((clinic) => {
      if (!clinic.latitude || !clinic.longitude) return true; // Include if no coordinates

      const distance = calculateDistance(
        userLat,
        userLng,
        clinic.latitude,
        clinic.longitude
      );

      return distance <= maxDistance;
    });
  },

  // Get smart filter suggestions based on search query
  getSuggestedFilters: (query: string, allClinics: Clinic[]) => {
    const lowerQuery = query.toLowerCase();
    const suggestions: Record<string, string[]> = {
      states: [],
      cities: [],
      services: [],
      animals: [],
    };

    // Find matching states and cities
    const matchingStates = new Set<string>();
    const matchingCities = new Set<string>();

    allClinics.forEach((clinic) => {
      if (clinic.state.toLowerCase().includes(lowerQuery)) {
        matchingStates.add(clinic.state);
      }
      if (clinic.city.toLowerCase().includes(lowerQuery)) {
        matchingCities.add(clinic.city);
      }
    });

    suggestions.states = Array.from(matchingStates).slice(0, 3);
    suggestions.cities = Array.from(matchingCities).slice(0, 5);

    // Find matching services and animals
    const matchingServices = new Set<string>();
    const matchingAnimals = new Set<string>();

    allClinics.forEach((clinic) => {
      clinic.services_offered?.forEach((service) => {
        if (service.toLowerCase().includes(lowerQuery)) {
          matchingServices.add(service);
        }
      });

      clinic.animals_treated?.forEach((animal) => {
        if (animal.toLowerCase().includes(lowerQuery)) {
          matchingAnimals.add(animal);
        }
      });
    });

    suggestions.services = Array.from(matchingServices).slice(0, 5);
    suggestions.animals = Array.from(matchingAnimals).slice(0, 5);

    return suggestions;
  },
};

// Notification and communication rules
export const notificationRules = {
  // Determine if clinic needs attention
  needsAttention: (clinic: Clinic): { needs: boolean; reasons: string[] } => {
    const reasons: string[] = [];

    // Check completeness
    if (clinicBusinessRules.getCompletenessScore(clinic) < 70) {
      reasons.push('Profile incomplete');
    }

    // Check if hours are outdated (this would need last_updated field)
    if (!clinic.hours) {
      reasons.push('Operating hours missing');
    }

    // Check if contact info is missing
    if (!clinic.phone && !clinic.email) {
      reasons.push('No contact information');
    }

    return {
      needs: reasons.length > 0,
      reasons,
    };
  },

  // Get priority for admin notifications
  getNotificationPriority: (clinic: Clinic): 'low' | 'medium' | 'high' => {
    const attention = notificationRules.needsAttention(clinic);

    if (clinic.emergency && attention.needs) {
      return 'high'; // Emergency clinic with issues
    }

    if (attention.reasons.length >= 3) {
      return 'medium'; // Multiple issues
    }

    if (attention.needs) {
      return 'low'; // Minor issues
    }

    return 'low';
  },
};

// Helper function for distance calculation (referenced in searchRules)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
