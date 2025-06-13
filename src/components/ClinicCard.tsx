// src/components/ClinicCard.tsx
import { Phone, MapPin, Clock, Globe, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Clinic } from '@/types/clinic';

// ✅ IMPORT CENTRALIZED UTILITIES (replacing duplicate functions)
import {
  formatAddress,
  getTodayHours,
  getClinicStatus,
} from '@/utils/formatters';

interface ClinicCardProps {
  clinic: Clinic;
  variant?: 'default' | 'minimal';
  className?: string;
}

export function ClinicCard({
  clinic,
  variant = 'default',
  className,
}: ClinicCardProps) {
  // ✅ USE CENTRALIZED UTILITIES (removed duplicate formatAddress and getTodayHours)
  const address = formatAddress(clinic);
  const todayHours = getTodayHours(clinic.hours);
  const statusInfo = getClinicStatus(clinic);

  const renderAnimalsBadges = (limit?: number) => {
    const animals = limit
      ? clinic.animals_treated.slice(0, limit)
      : clinic.animals_treated;
    const remaining =
      limit && clinic.animals_treated.length > limit
        ? clinic.animals_treated.length - limit
        : 0;

    return (
      <div className='flex flex-wrap gap-1'>
        {animals.map((animal) => (
          <Badge key={animal} variant='secondary' className='text-xs'>
            {animal}
          </Badge>
        ))}
        {remaining > 0 && (
          <Badge variant='outline' className='text-xs'>
            +{remaining} more
          </Badge>
        )}
      </div>
    );
  };

  const renderSpecializationsBadges = (limit?: number) => {
    const specs = limit
      ? clinic.specializations.slice(0, limit)
      : clinic.specializations;
    const remaining =
      limit && clinic.specializations.length > limit
        ? clinic.specializations.length - limit
        : 0;

    return (
      <div className='flex flex-wrap gap-1'>
        {specs.map((spec) => (
          <Badge
            key={spec}
            variant='outline'
            className='text-xs bg-emerald-50 text-emerald-700'
          >
            {spec}
          </Badge>
        ))}
        {remaining > 0 && (
          <Badge variant='outline' className='text-xs'>
            +{remaining} more
          </Badge>
        )}
      </div>
    );
  };

  // Minimal variant for compact display
  if (variant === 'minimal') {
    return (
      <Card className={cn('hover:shadow-md transition-shadow', className)}>
        <CardContent className='p-4'>
          <div className='flex justify-between items-start mb-3'>
            <div className='flex-1'>
              <h3 className='font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors'>
                {clinic.name}
              </h3>
              {clinic.emergency && (
                <div className='flex items-center gap-1 text-red-600 text-sm font-medium mt-1'>
                  <AlertCircle size={14} />
                  Emergency
                </div>
              )}
            </div>
            {/* ✅ ENHANCED STATUS BADGE */}
            <Badge
              variant={statusInfo.status === 'open' ? 'default' : 'secondary'}
              className={cn(
                statusInfo.status === 'open' && 'bg-green-100 text-green-800',
                statusInfo.status === 'emergency' && 'bg-red-100 text-red-800'
              )}
            >
              {statusInfo.status === 'open'
                ? 'Open'
                : statusInfo.status === 'emergency'
                ? 'Emergency'
                : 'Closed'}
            </Badge>
          </div>

          <div className='space-y-2 text-sm text-gray-600'>
            <div className='flex items-start gap-2'>
              <MapPin
                size={14}
                className='text-muted-foreground mt-0.5 flex-shrink-0'
              />
              {/* ✅ USING CENTRALIZED ADDRESS FORMATTING */}
              <p>{address}</p>
            </div>

            <div className='flex items-center gap-2'>
              <Clock size={14} className='text-muted-foreground' />
              {/* ✅ USING CENTRALIZED HOURS FORMATTING */}
              <p>Today: {todayHours}</p>
            </div>
          </div>

          <div className='flex gap-2 mt-4'>
            {clinic.phone && (
              <Button
                variant='outline'
                size='sm'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`tel:${clinic.phone}`);
                }}
              >
                Call
              </Button>
            )}

            {clinic.website && (
              <Button
                variant='outline'
                size='sm'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(clinic.website!, '_blank', 'noopener,noreferrer');
                }}
              >
                <Globe size={14} className='mr-1' />
                Website
              </Button>
            )}

            <Button asChild variant='outline' size='sm' className='ml-auto'>
              <Link href={`/clinic/${clinic.id}`}>View Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant - using shadcn Card components
  return (
    <Card className={cn('hover:shadow-lg transition-shadow group', className)}>
      <Link href={`/clinic/${clinic.id}`} className='block'>
        <CardHeader className='pb-4'>
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <CardTitle className='text-xl group-hover:text-blue-600 transition-colors'>
                {clinic.name}
              </CardTitle>
              {clinic.emergency && (
                <div className='flex items-center gap-1 text-red-600 text-sm font-medium mt-1'>
                  <AlertCircle size={16} />
                  Emergency Services Available
                </div>
              )}
            </div>
            {/* ✅ ENHANCED STATUS INDICATOR */}
            <div className='text-right'>
              <Badge
                variant={statusInfo.status === 'open' ? 'default' : 'secondary'}
                className={cn(
                  statusInfo.status === 'open' && 'bg-green-100 text-green-800',
                  statusInfo.status === 'emergency' && 'bg-red-100 text-red-800'
                )}
              >
                {statusInfo.message}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className='pb-4'>
          <div className='space-y-3'>
            <div className='flex items-start gap-2'>
              <MapPin
                size={16}
                className='text-muted-foreground mt-1 flex-shrink-0'
              />
              {/* ✅ USING CENTRALIZED ADDRESS FORMATTING */}
              <p className='text-sm text-muted-foreground'>{address}</p>
            </div>

            <div className='flex items-center gap-2'>
              <Clock size={16} className='text-muted-foreground' />
              {/* ✅ USING CENTRALIZED HOURS FORMATTING */}
              <p className='text-sm text-muted-foreground'>
                Today: {todayHours}
              </p>
            </div>

            {clinic.animals_treated.length > 0 && (
              <div>
                <p className='text-sm font-medium mb-2'>Animals Treated:</p>
                {renderAnimalsBadges(4)}
              </div>
            )}

            {clinic.specializations.length > 0 && (
              <div>
                <p className='text-sm font-medium mb-2'>Specializations:</p>
                {renderSpecializationsBadges(3)}
              </div>
            )}

            {clinic.emergency && clinic.emergency_details && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                <p className='text-sm text-red-800'>
                  <strong>Emergency:</strong> {clinic.emergency_details}
                </p>
                {clinic.emergency_hours && (
                  <p className='text-sm text-red-700 mt-1'>
                    Hours: {clinic.emergency_hours}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className='pt-0'>
        <div className='flex gap-2 w-full'>
          <Button
            variant='default'
            size='sm'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(`tel:${clinic.phone}`);
            }}
          >
            <Phone size={14} className='mr-1' />
            Call
          </Button>

          {clinic.website && (
            <Button
              variant='outline'
              size='sm'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(clinic.website!, '_blank', 'noopener,noreferrer');
              }}
            >
              <Globe size={14} className='mr-1' />
              Website
            </Button>
          )}

          <Button asChild variant='outline' size='sm' className='ml-auto'>
            <Link href={`/clinic/${clinic.id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
