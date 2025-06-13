'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clinic } from '@/types/clinic';

// ✅ IMPORT CENTRALIZED BUSINESS LOGIC
import {
  searchClinics,
  sortClinics,
  isCurrentlyOpen,
  SearchFilters,
} from '@/utils/businessLogic';

import { getTodayHours } from '@/utils/formatters';

interface EnhancedSearchPanelProps {
  clinics: Clinic[];
  onFiltersChange: (filteredClinics: Clinic[]) => void;
  onFiltersUpdate?: (filters: SearchFilters) => void;
}

export function EnhancedSearchPanel({
  clinics,
  onFiltersChange,
  onFiltersUpdate,
}: EnhancedSearchPanelProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    city: '',
    state: '',
    emergency: undefined,
    isOpen: undefined,
    services: [],
    specializations: [],
  });

  const [sortBy, setSortBy] = useState<'name' | 'city' | 'state' | 'emergency'>(
    'name'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // ✅ EXTRACT FILTER OPTIONS FROM CLINICS
  const filterOptions = useMemo(() => {
    const states = [
      ...new Set(clinics.map((c) => c.state).filter(Boolean)),
    ].sort();
    const cities = [
      ...new Set(clinics.map((c) => c.city).filter(Boolean)),
    ].sort();
    const services = [
      ...new Set(clinics.flatMap((c) => c.services_offered || [])),
    ].sort();
    const specializations = [
      ...new Set(clinics.flatMap((c) => c.specializations || [])),
    ].sort();

    return { states, cities, services, specializations };
  }, [clinics]);

  // ✅ APPLY FILTERS USING CENTRALIZED LOGIC
  const filteredAndSortedClinics = useMemo(() => {
    const filtered = searchClinics(clinics, filters);
    const sorted = sortClinics(filtered, sortBy, sortOrder);
    return sorted;
  }, [clinics, filters, sortBy, sortOrder]);

  // ✅ REAL-TIME STATS WITH FIXED 24/7 LOGIC
  const stats = useMemo(() => {
    // Helper function to determine if clinic is actually open/available
    const isClinicAvailable = (clinic: Clinic) => {
      const todayHours = getTodayHours(clinic.hours);
      const is24Hours =
        todayHours === '24/7' || todayHours.toLowerCase().includes('24');
      const isCurrentlyOpenNow = isCurrentlyOpen(clinic.hours);

      // Consider clinic "open" if:
      // 1. It's 24/7 (always available)
      // 2. It has emergency services (always available for emergencies)
      // 3. It's currently within operating hours
      return is24Hours || clinic.emergency || isCurrentlyOpenNow;
    };

    const openNow = filteredAndSortedClinics.filter(isClinicAvailable);
    const emergency = filteredAndSortedClinics.filter((c) => c.emergency);
    const total = filteredAndSortedClinics.length;

    return { total, openNow: openNow.length, emergency: emergency.length };
  }, [filteredAndSortedClinics]);

  // Update filters and notify parent
  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersUpdate?.(updatedFilters);
  };

  // Apply filters and notify parent
  useEffect(() => {
    onFiltersChange(filteredAndSortedClinics);
  }, [filteredAndSortedClinics, onFiltersChange]);

  const clearAllFilters = () => {
    const emptyFilters: SearchFilters = {
      query: '',
      city: '',
      state: '',
      emergency: undefined,
      isOpen: undefined,
      services: [],
      specializations: [],
    };
    setFilters(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value;
    return value !== '' && value !== undefined;
  }).length;

  return (
    <div className='space-y-6'>
      {/* Search Header */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Search className='h-5 w-5' />
              Search Veterinary Clinics
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant='secondary'>{activeFiltersCount} filters</Badge>
            )}
          </div>
          <div className='text-sm text-gray-600'>
            {stats.total} clinics found
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Main Search */}
          <div className='relative'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Search by clinic name, city, services, or specializations...'
              value={filters.query || ''}
              onChange={(e) => updateFilters({ query: e.target.value })}
              className='pl-10'
            />
          </div>

          {/* Quick Stats */}
          <div className='grid grid-cols-3 gap-3'>
            <div className='text-center p-3 bg-emerald-50 rounded-lg'>
              <div className='text-xl font-bold text-emerald-700'>
                {stats.total}
              </div>
              <div className='text-xs text-emerald-600 mt-1'>Total Clinics</div>
            </div>
            <div className='text-center p-3 bg-green-50 rounded-lg'>
              <div className='text-xl font-bold text-green-700'>
                {stats.openNow}
              </div>
              <div className='text-xs text-green-600 mt-1'>Open Now</div>
            </div>
            <div className='text-center p-3 bg-red-50 rounded-lg'>
              <div className='text-xl font-bold text-red-700'>
                {stats.emergency}
              </div>
              <div className='text-xs text-red-600 mt-1'>24/7 Care</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Filter className='h-5 w-5' />
              Filters
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button variant='outline' size='sm' onClick={clearAllFilters}>
                Clear All ({activeFiltersCount})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Location Filters */}
          <div className='space-y-3'>
            <h4 className='font-medium flex items-center gap-2'>
              <MapPin className='h-4 w-4' />
              Location
            </h4>
            <div className='grid grid-cols-2 gap-3'>
              <Select
                value={filters.state || 'all-states'}
                onValueChange={(value) =>
                  updateFilters({
                    state: value === 'all-states' ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select State' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all-states'>All States</SelectItem>
                  {filterOptions.states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state} ({clinics.filter((c) => c.state === state).length}
                      )
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.city || 'all-cities'}
                onValueChange={(value) =>
                  updateFilters({
                    city: value === 'all-cities' ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select City' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all-cities'>All Cities</SelectItem>
                  {filterOptions.cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city} ({clinics.filter((c) => c.city === city).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Availability Filters */}
          <div className='space-y-3'>
            <h4 className='font-medium flex items-center gap-2'>
              <Clock className='h-4 w-4' />
              Availability
            </h4>
            <div className='flex flex-wrap gap-3'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='open-now'
                  checked={filters.isOpen === true}
                  onCheckedChange={(checked) =>
                    updateFilters({ isOpen: checked ? true : undefined })
                  }
                />
                <label htmlFor='open-now' className='text-sm'>
                  Open Now ({stats.openNow})
                </label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='emergency'
                  checked={filters.emergency === true}
                  onCheckedChange={(checked) =>
                    updateFilters({ emergency: checked ? true : undefined })
                  }
                />
                <label
                  htmlFor='emergency'
                  className='text-sm flex items-center gap-1'
                >
                  <Shield className='h-3 w-3' />
                  Emergency Services ({stats.emergency})
                </label>
              </div>
            </div>
          </div>

          {/* Services Filter */}
          <div className='space-y-3'>
            <h4 className='font-medium'>Services Offered</h4>
            <div className='space-y-2 max-h-48 overflow-y-auto pr-2'>
              {filterOptions.services.map((service) => (
                <div
                  key={service}
                  className='flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors'
                >
                  <Checkbox
                    id={`service-${service}`}
                    checked={filters.services?.includes(service)}
                    onCheckedChange={(checked) => {
                      const newServices = checked
                        ? [...(filters.services || []), service]
                        : (filters.services || []).filter((s) => s !== service);
                      updateFilters({ services: newServices });
                    }}
                  />
                  <label
                    htmlFor={`service-${service}`}
                    className='text-sm flex-1 cursor-pointer'
                  >
                    <span className='font-medium'>{service}</span>
                    <span className='text-gray-500 ml-1'>
                      (
                      {
                        clinics.filter((c) =>
                          c.services_offered?.includes(service)
                        ).length
                      }
                      )
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Specializations Filter */}
          <div className='space-y-3'>
            <h4 className='font-medium'>Animal Specializations</h4>
            <div className='space-y-2 max-h-48 overflow-y-auto pr-2'>
              {filterOptions.specializations.map((spec) => (
                <div
                  key={spec}
                  className='flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors'
                >
                  <Checkbox
                    id={`spec-${spec}`}
                    checked={filters.specializations?.includes(spec)}
                    onCheckedChange={(checked) => {
                      const newSpecs = checked
                        ? [...(filters.specializations || []), spec]
                        : (filters.specializations || []).filter(
                            (s) => s !== spec
                          );
                      updateFilters({ specializations: newSpecs });
                    }}
                  />
                  <label
                    htmlFor={`spec-${spec}`}
                    className='text-sm flex-1 cursor-pointer'
                  >
                    <span className='font-medium'>{spec}</span>
                    <span className='text-gray-500 ml-1'>
                      (
                      {
                        clinics.filter((c) => c.specializations?.includes(spec))
                          .length
                      }
                      )
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card>
        <CardHeader>
          <CardTitle>Sort Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-3'>
            <Select
              value={sortBy}
              onValueChange={(value: 'name' | 'city' | 'state' | 'emergency') =>
                setSortBy(value)
              }
            >
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='name'>Name</SelectItem>
                <SelectItem value='city'>City</SelectItem>
                <SelectItem value='state'>State</SelectItem>
                <SelectItem value='emergency'>Emergency</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
            >
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='asc'>A-Z</SelectItem>
                <SelectItem value='desc'>Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
