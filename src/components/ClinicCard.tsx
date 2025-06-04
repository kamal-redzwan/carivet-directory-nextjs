import { Phone, Globe, MapPin, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ClinicCardProps {
  clinic: {
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
  };
}

export default function ClinicCard({ clinic }: ClinicCardProps) {
  const formatAddress = () => {
    const parts = [
      clinic.street,
      clinic.city,
      clinic.state,
      clinic.postcode,
    ].filter((part) => part && part.trim());
    return parts.join(', ');
  };

  const getTodayHours = () => {
    // Simple fallback approach
    if (!clinic.hours) {
      return 'Hours not available';
    }

    try {
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

      return (
        clinic.hours[today as keyof typeof clinic.hours] ||
        'Hours not available'
      );
    } catch (error) {
      return 'Hours not available';
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group'>
      {/* Clickable header area */}
      <Link href={`/clinic/${clinic.id}`} className='block'>
        <div className='p-6 pb-3'>
          {/* Header */}
          <div className='flex justify-between items-start mb-4'>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors'>
                {clinic.name}
              </h3>
              {clinic.emergency && (
                <div className='flex items-center gap-1 text-red-600 text-sm font-medium'>
                  <AlertCircle size={16} />
                  Emergency Services Available
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className='flex items-start gap-2 mb-3'>
            <MapPin size={16} className='text-gray-500 mt-1 flex-shrink-0' />
            <p className='text-gray-600 text-sm'>{formatAddress()}</p>
          </div>

          {/* Hours */}
          <div className='flex items-center gap-2 mb-3'>
            <Clock size={16} className='text-gray-500' />
            <p className='text-gray-600 text-sm'>Today: {getTodayHours()}</p>
          </div>

          {/* Animals & Services */}
          <div className='mb-4'>
            {clinic.animals_treated.length > 0 && (
              <div className='mb-2'>
                <span className='text-sm font-medium text-gray-700'>
                  Animals:{' '}
                </span>
                <span className='text-sm text-gray-600'>
                  {clinic.animals_treated.slice(0, 3).join(', ')}
                  {clinic.animals_treated.length > 3 &&
                    ` +${clinic.animals_treated.length - 3} more`}
                </span>
              </div>
            )}

            {clinic.specializations.length > 0 && (
              <div className='mb-2'>
                <span className='text-sm font-medium text-gray-700'>
                  Specializations:{' '}
                </span>
                <span className='text-sm text-gray-600'>
                  {clinic.specializations.slice(0, 2).join(', ')}
                  {clinic.specializations.length > 2 &&
                    ` +${clinic.specializations.length - 2} more`}
                </span>
              </div>
            )}
          </div>

          {/* Emergency Details */}
          {clinic.emergency && clinic.emergency_details && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded'>
              <p className='text-sm text-red-800'>
                <strong>Emergency:</strong> {clinic.emergency_details}
              </p>
              {clinic.emergency_hours && (
                <p className='text-sm text-red-700'>
                  Hours: {clinic.emergency_hours}
                </p>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Non-clickable actions area */}
      <div className='px-6 pb-6'>
        <div className='flex gap-2 pt-3 border-t border-gray-100'>
          <a
            href={`tel:${clinic.phone}`}
            onClick={(e) => e.stopPropagation()}
            className='flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors'
          >
            <Phone size={14} />
            Call
          </a>

          {clinic.website && (
            <a
              href={clinic.website}
              target='_blank'
              rel='noopener noreferrer'
              onClick={(e) => e.stopPropagation()}
              className='flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors'
            >
              <Globe size={14} />
              Website
            </a>
          )}

          <Link
            href={`/clinic/${clinic.id}`}
            className='flex items-center gap-1 px-3 py-2 border border-blue-300 text-blue-700 text-sm rounded hover:bg-blue-50 transition-colors ml-auto'
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
