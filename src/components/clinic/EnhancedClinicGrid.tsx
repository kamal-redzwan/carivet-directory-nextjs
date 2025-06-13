// src/components/clinic/EnhancedClinicGrid.tsx
'use client';

import { useState, useMemo } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Shield,
  Globe,
  Star,
  Navigation,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Clinic } from '@/types/clinic';

// ✅ IMPORT CENTRALIZED BUSINESS LOGIC
import {
  formatAddress,
  formatAddressForMaps,
  formatPhone,
  getTodayHours,
  getClinicStatus,
  isCurrentlyOpen,
} from '@/utils/formatters';

interface EnhancedClinicGridProps {
  clinics: Clinic[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  showFilters?: boolean;
}

interface ClinicCardProps {
  clinic: Clinic;
  viewMode: 'grid' | 'list';
}

function EnhancedClinicCard({ clinic, viewMode }: ClinicCardProps) {
  // ✅ USE CENTRALIZED STATUS LOGIC
  const statusInfo = getClinicStatus(clinic);
  const isOpen = isCurrentlyOpen(clinic.hours);
  const todayHours = getTodayHours(clinic.hours);
  const address = formatAddress(clinic);

  if (viewMode === 'list') {
    return (
      <Card className='hover:shadow-lg transition-all duration-200'>
        <CardContent className='p-6'>
          <div className='flex items-start justify-between'>
            <div className='flex-1 space-y-3'>
              {/* Header */}
              <div className='flex items-start justify-between'>
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 hover:text-emerald-600 transition-colors'>
                    <Link href={`/clinic/${clinic.id}`}>{clinic.name}</Link>
                  </h3>
                  <div className='flex items-center gap-2 mt-1'>
                    <MapPin size={14} className='text-gray-400' />
                    <span className='text-sm text-gray-600'>{address}</span>
                  </div>
                </div>

                {/* ✅ ENHANCED STATUS BADGE */}
                <div className='flex items-center gap-2'>
                  {clinic.emergency && (
                    <Badge
                      variant='destructive'
                      className='flex items-center gap-1'
                    >
                      <Shield size={12} />
                      Emergency
                    </Badge>
                  )}
                  <Badge
                    variant={isOpen ? 'default' : 'secondary'}
                    className={`${
                      isOpen
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Clock size={12} className='mr-1' />
                    {isOpen ? 'Open Now' : 'Closed'}
                  </Badge>
                </div>
              </div>

              {/* Services & Specializations */}
              <div className='space-y-2'>
                {clinic.animals_treated &&
                  clinic.animals_treated.length > 0 && (
                    <div>
                      <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                        Animals:
                      </span>
                      <div className='flex flex-wrap gap-1 mt-1'>
                        {clinic.animals_treated.slice(0, 4).map((animal) => (
                          <Badge
                            key={animal}
                            variant='outline'
                            className='text-xs'
                          >
                            {animal}
                          </Badge>
                        ))}
                        {clinic.animals_treated.length > 4 && (
                          <Badge variant='outline' className='text-xs'>
                            +{clinic.animals_treated.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                {clinic.specializations &&
                  clinic.specializations.length > 0 && (
                    <div>
                      <span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                        Specializations:
                      </span>
                      <div className='flex flex-wrap gap-1 mt-1'>
                        {clinic.specializations.slice(0, 3).map((spec) => (
                          <Badge
                            key={spec}
                            variant='secondary'
                            className='text-xs bg-emerald-50 text-emerald-700'
                          >
                            {spec}
                          </Badge>
                        ))}
                        {clinic.specializations.length > 3 && (
                          <Badge variant='secondary' className='text-xs'>
                            +{clinic.specializations.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Contact Info */}
              <div className='flex items-center gap-4 text-sm text-gray-600'>
                <div className='flex items-center gap-1'>
                  <Clock size={14} />
                  <span>Today: {todayHours}</span>
                </div>
                {clinic.phone && (
                  <div className='flex items-center gap-1'>
                    <Phone size={14} />
                    <span>{formatPhone(clinic.phone)}</span>
                  </div>
                )}
              </div>

              {/* Emergency Details */}
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

            {/* Actions */}
            <div className='flex flex-col gap-2 ml-6'>
              <Button size='sm' asChild>
                <Link href={`/clinic/${clinic.id}`}>View Details</Link>
              </Button>

              {clinic.phone && (
                <Button variant='outline' size='sm' asChild>
                  <a
                    href={`tel:${formatPhone(clinic.phone, { format: 'tel' })}`}
                  >
                    <Phone size={14} className='mr-1' />
                    Call
                  </a>
                </Button>
              )}

              <Button variant='outline' size='sm' asChild>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    formatAddressForMaps(clinic)
                  )}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Navigation size={14} className='mr-1' />
                  Directions
                </a>
              </Button>

              {clinic.website && (
                <Button variant='outline' size='sm' asChild>
                  <a
                    href={clinic.website}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Globe size={14} className='mr-1' />
                    Website
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className='hover:shadow-lg transition-all duration-200 group'>
      <Link href={`/clinic/${clinic.id}`}>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <CardTitle className='text-lg group-hover:text-emerald-600 transition-colors'>
                {clinic.name}
              </CardTitle>
              <div className='flex items-center gap-1 text-sm text-gray-600 mt-1'>
                <MapPin size={12} />
                {clinic.city}, {clinic.state}
              </div>
            </div>

            {/* ✅ STATUS INDICATOR */}
            <div
              className={`w-3 h-3 rounded-full ${
                isOpen ? 'bg-green-400' : 'bg-gray-300'
              }`}
              title={isOpen ? 'Open Now' : 'Closed'}
            />
          </div>

          {/* ✅ STATUS BADGES */}
          <div className='flex items-center gap-2 mt-2'>
            {clinic.emergency && (
              <Badge
                variant='destructive'
                className='text-xs flex items-center gap-1'
              >
                <Shield size={10} />
                Emergency
              </Badge>
            )}
            <Badge
              variant={isOpen ? 'default' : 'secondary'}
              className={`text-xs ${
                isOpen
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </CardHeader>
      </Link>

      <CardContent className='pt-0'>
        <div className='space-y-3'>
          {/* Hours */}
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Clock size={14} />
            <span>Today: {todayHours}</span>
          </div>

          {/* Services Preview */}
          {clinic.animals_treated && clinic.animals_treated.length > 0 && (
            <div>
              <p className='text-xs font-medium text-gray-500 mb-1'>ANIMALS:</p>
              <div className='flex flex-wrap gap-1'>
                {clinic.animals_treated.slice(0, 3).map((animal) => (
                  <Badge key={animal} variant='outline' className='text-xs'>
                    {animal}
                  </Badge>
                ))}
                {clinic.animals_treated.length > 3 && (
                  <Badge variant='outline' className='text-xs'>
                    +{clinic.animals_treated.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Specializations Preview */}
          {clinic.specializations && clinic.specializations.length > 0 && (
            <div>
              <p className='text-xs font-medium text-gray-500 mb-1'>
                SPECIALIZATIONS:
              </p>
              <div className='flex flex-wrap gap-1'>
                {clinic.specializations.slice(0, 2).map((spec) => (
                  <Badge
                    key={spec}
                    variant='secondary'
                    className='text-xs bg-emerald-50 text-emerald-700'
                  >
                    {spec}
                  </Badge>
                ))}
                {clinic.specializations.length > 2 && (
                  <Badge variant='secondary' className='text-xs'>
                    +{clinic.specializations.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className='flex gap-2 mt-4'>
          {clinic.phone && (
            <Button variant='outline' size='sm' className='flex-1' asChild>
              <a
                href={`tel:${formatPhone(clinic.phone, { format: 'tel' })}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Phone size={14} className='mr-1' />
                Call
              </a>
            </Button>
          )}

          <Button variant='outline' size='sm' className='flex-1' asChild>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                formatAddressForMaps(clinic)
              )}`}
              target='_blank'
              rel='noopener noreferrer'
              onClick={(e) => e.stopPropagation()}
            >
              <Navigation size={14} className='mr-1' />
              Map
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function EnhancedClinicGrid({
  clinics,
  loading = false,
  viewMode = 'grid',
}: EnhancedClinicGridProps) {
  const [sortBy, setSortBy] = useState<'name' | 'distance' | 'status'>('name');

  // ✅ SORT CLINICS WITH ENHANCED LOGIC
  const sortedClinics = useMemo(() => {
    return [...clinics].sort((a, b) => {
      switch (sortBy) {
        case 'status':
          // Sort by: Emergency first, then Open, then Closed
          const aStatus = a.emergency ? 3 : isCurrentlyOpen(a.hours) ? 2 : 1;
          const bStatus = b.emergency ? 3 : isCurrentlyOpen(b.hours) ? 2 : 1;
          if (aStatus !== bStatus) return bStatus - aStatus;
          return a.name.localeCompare(b.name);

        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [clinics, sortBy]);

  if (loading) {
    return (
      <div className='space-y-4'>
        {[...Array(6)].map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardContent className='p-6'>
              <div className='flex items-start justify-between'>
                <div className='flex-1 space-y-3'>
                  <div className='h-6 bg-gray-200 rounded w-3/4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                  <div className='flex gap-2'>
                    <div className='h-6 bg-gray-200 rounded w-16'></div>
                    <div className='h-6 bg-gray-200 rounded w-16'></div>
                  </div>
                </div>
                <div className='space-y-2'>
                  <div className='h-8 bg-gray-200 rounded w-20'></div>
                  <div className='h-8 bg-gray-200 rounded w-20'></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (clinics.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='text-gray-400 mb-4'>
          <Filter size={48} className='mx-auto' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          No clinics found
        </h3>
        <p className='text-gray-600'>
          Try adjusting your search filters to find more results.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Sort Controls */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-600'>
          Showing {clinics.length} clinic{clinics.length !== 1 ? 's' : ''}
        </p>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600'>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className='text-sm border border-gray-300 rounded px-2 py-1'
          >
            <option value='name'>Name</option>
            <option value='status'>Status (Emergency, Open, Closed)</option>
          </select>
        </div>
      </div>

      {/* Clinic Cards */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {sortedClinics.map((clinic) => (
          <EnhancedClinicCard
            key={clinic.id}
            clinic={clinic}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}
