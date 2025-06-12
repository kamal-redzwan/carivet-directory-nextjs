import { Clinic } from '@/types/clinic';

export const formatAddress = (clinic: Partial<Clinic>): string => {
  const parts = [
    clinic.street,
    clinic.city,
    clinic.state,
    clinic.postcode,
  ].filter((part) => part && part.trim());

  return parts.length > 0 ? parts.join(', ') : 'Address not available';
};

export const formatPhone = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Format Malaysian phone numbers
  if (cleaned.startsWith('60')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 3)}-${cleaned.slice(
      3,
      7
    )} ${cleaned.slice(7)}`;
  }

  return phone;
};

export const formatOperatingHours = (
  hours: Clinic['hours'],
  day?: string
): string => {
  if (!hours) return 'Hours not available';

  if (day) {
    return hours[day as keyof typeof hours] || 'Closed';
  }

  // Get today's hours
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
  return hours[today as keyof typeof hours] || 'Hours not available';
};

export const formatBusinessHours = (
  hours: Clinic['hours']
): Array<{ day: string; hours: string; isToday: boolean }> => {
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

  return days.map((day) => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    hours: hours[day as keyof typeof hours] || 'Closed',
    isToday: day === todayName,
  }));
};
