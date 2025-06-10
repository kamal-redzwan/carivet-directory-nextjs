import { Phone, Globe, MapPin, Clock, AlertCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Clinic } from '@/types/clinic';

type ClinicCardVariant = 'default' | 'featured' | 'compact';

interface ClinicCardProps {
  clinic: Clinic;
  variant?: ClinicCardVariant;
  className?: string;
}

export default function ClinicCard({ clinic, variant = 'default', className }: ClinicCardProps) {
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
    } catch {
      return 'Hours not available';
    }
  };

  const renderAnimalsBadges = (limit: number) => (
    <div className="flex flex-wrap gap-1">
      {clinic.animals_treated.slice(0, limit).map((animal) => (
        <Badge key={animal} variant="secondary" className="text-xs">
          {animal}
        </Badge>
      ))}
      {clinic.animals_treated.length > limit && (
        <Badge variant="outline" className="text-xs">
          +{clinic.animals_treated.length - limit} more
        </Badge>
      )}
    </div>
  );

  const renderSpecializationsBadges = (limit: number) => (
    <div className="flex flex-wrap gap-1">
      {clinic.specializations.slice(0, limit).map((spec) => (
        <Badge key={spec} variant="outline" className="text-xs">
          {spec}
        </Badge>
      ))}
      {clinic.specializations.length > limit && (
        <Badge variant="outline" className="text-xs">
          +{clinic.specializations.length - limit} more
        </Badge>
      )}
    </div>
  );

  // Compact variant
  if (variant === 'compact') {
    return (
      <Card className={cn('hover:shadow-md transition-shadow group', className)}>
        <Link href={`/clinic/${clinic.id}`} className="block">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                {clinic.name}
              </CardTitle>
              {clinic.emergency && (
                <Badge variant="destructive" className="text-xs ml-2">
                  Emergency
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
              <p className="text-sm text-muted-foreground line-clamp-1">
                {clinic.city}, {clinic.state}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={14} className="text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Today: {getTodayHours()}</p>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <Card className={cn(
        'hover:shadow-lg transition-shadow group border-blue-200 bg-gradient-to-br from-blue-50 to-white',
        className
      )}>
        <Link href={`/clinic/${clinic.id}`} className="block">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Badge variant="default" className="bg-blue-600">Featured</Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {clinic.name}
                </CardTitle>
                {clinic.emergency && (
                  <div className="flex items-center gap-1 text-red-600 text-sm font-medium mt-1">
                    <AlertCircle size={16} />
                    Emergency Services Available
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-muted-foreground mt-1 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{formatAddress()}</p>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Today: {getTodayHours()}</p>
              </div>

              {clinic.animals_treated.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Animals Treated:</p>
                  {renderAnimalsBadges(4)}
                </div>
              )}

              {clinic.specializations.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Specializations:</p>
                  {renderSpecializationsBadges(3)}
                </div>
              )}

              {clinic.emergency && clinic.emergency_details && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    <strong>Emergency:</strong> {clinic.emergency_details}
                  </p>
                  {clinic.emergency_hours && (
                    <p className="text-sm text-red-700 mt-1">
                      Hours: {clinic.emergency_hours}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Link>

        <CardFooter className="pt-0">
          <div className="flex gap-2 w-full">
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`tel:${clinic.phone}`);
              }}
            >
              <Phone size={14} className="mr-1" />
              Call
            </Button>

            {clinic.website && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(clinic.website!, '_blank', 'noopener,noreferrer');
                }}
              >
                <Globe size={14} className="mr-1" />
                Website
              </Button>
            )}

            <Button asChild variant="outline" size="sm" className="ml-auto">
              <Link href={`/clinic/${clinic.id}`}>View Details</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Default variant - using shadcn Card components
  return (
    <Card className={cn('hover:shadow-lg transition-shadow group', className)}>
      <Link href={`/clinic/${clinic.id}`} className="block">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                {clinic.name}
              </CardTitle>
              {clinic.emergency && (
                <div className="flex items-center gap-1 text-red-600 text-sm font-medium mt-1">
                  <AlertCircle size={16} />
                  Emergency Services Available
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-muted-foreground mt-1 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{formatAddress()}</p>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Today: {getTodayHours()}</p>
            </div>

            {clinic.animals_treated.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Animals:</p>
                {renderAnimalsBadges(3)}
              </div>
            )}

            {clinic.specializations.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Specializations:</p>
                {renderSpecializationsBadges(2)}
              </div>
            )}

            {clinic.emergency && clinic.emergency_details && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  <strong>Emergency:</strong> {clinic.emergency_details}
                </p>
                {clinic.emergency_hours && (
                  <p className="text-sm text-red-700 mt-1">
                    Hours: {clinic.emergency_hours}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="pt-0 border-t">
        <div className="flex gap-2 w-full">
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(`tel:${clinic.phone}`);
            }}
          >
            <Phone size={14} className="mr-1" />
            Call
          </Button>

          {clinic.website && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(clinic.website!, '_blank', 'noopener,noreferrer');
              }}
            >
              <Globe size={14} className="mr-1" />
              Website
            </Button>
          )}

          <Button asChild variant="outline" size="sm" className="ml-auto">
            <Link href={`/clinic/${clinic.id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
