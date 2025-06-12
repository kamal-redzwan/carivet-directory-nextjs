import { Phone, Mail, Globe, MapPin, Facebook, Instagram } from 'lucide-react';
import { formatAddress, formatPhone } from '@/utils/formatters';
import { Clinic } from '@/types/clinic';
import { cn } from '@/lib/utils';

interface ClinicContactInfoProps {
  clinic: Partial<Clinic>;
  variant?: 'full' | 'compact';
  showSocial?: boolean;
}

export function ClinicContactInfo({
  clinic,
  variant = 'full',
  showSocial = true,
}: ClinicContactInfoProps) {
  const isCompact = variant === 'compact';

  return (
    <div className={cn('space-y-3', isCompact && 'space-y-2')}>
      {/* Address */}
      <div className='flex items-start gap-2'>
        <MapPin
          size={isCompact ? 14 : 16}
          className='text-muted-foreground mt-0.5 flex-shrink-0'
        />
        <div>
          {!isCompact && (
            <p className='text-sm font-medium text-gray-700 mb-1'>Address</p>
          )}
          <p
            className={cn('text-gray-600', isCompact ? 'text-sm' : 'text-base')}
          >
            {formatAddress(clinic)}
          </p>
        </div>
      </div>

      {/* Phone */}
      {clinic.phone && (
        <div className='flex items-center gap-2'>
          <Phone size={isCompact ? 14 : 16} className='text-muted-foreground' />
          <div>
            {!isCompact && (
              <p className='text-sm font-medium text-gray-700 mb-1'>Phone</p>
            )}
            <a
              href={`tel:${clinic.phone}`}
              className={cn(
                'text-emerald-600 hover:text-emerald-700',
                isCompact ? 'text-sm' : 'text-base'
              )}
            >
              {formatPhone(clinic.phone)}
            </a>
          </div>
        </div>
      )}

      {/* Email */}
      {clinic.email && (
        <div className='flex items-center gap-2'>
          <Mail size={isCompact ? 14 : 16} className='text-muted-foreground' />
          <div>
            {!isCompact && (
              <p className='text-sm font-medium text-gray-700 mb-1'>Email</p>
            )}
            <a
              href={`mailto:${clinic.email}`}
              className={cn(
                'text-emerald-600 hover:text-emerald-700',
                isCompact ? 'text-sm' : 'text-base'
              )}
            >
              {clinic.email}
            </a>
          </div>
        </div>
      )}

      {/* Website */}
      {clinic.website && (
        <div className='flex items-center gap-2'>
          <Globe size={isCompact ? 14 : 16} className='text-muted-foreground' />
          <div>
            {!isCompact && (
              <p className='text-sm font-medium text-gray-700 mb-1'>Website</p>
            )}
            <a
              href={clinic.website}
              target='_blank'
              rel='noopener noreferrer'
              className={cn(
                'text-emerald-600 hover:text-emerald-700 flex items-center gap-1',
                isCompact ? 'text-sm' : 'text-base'
              )}
            >
              Visit Website
            </a>
          </div>
        </div>
      )}

      {/* Social Media */}
      {showSocial && (clinic.facebook_url || clinic.instagram_url) && (
        <div className='flex items-center gap-2'>
          <div className='flex gap-3'>
            {clinic.facebook_url && (
              <a
                href={clinic.facebook_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-700 flex items-center gap-1'
              >
                <Facebook size={isCompact ? 14 : 16} />
                {!isCompact && 'Facebook'}
              </a>
            )}
            {clinic.instagram_url && (
              <a
                href={clinic.instagram_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-pink-600 hover:text-pink-700 flex items-center gap-1'
              >
                <Instagram size={isCompact ? 14 : 16} />
                {!isCompact && 'Instagram'}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
