'use client';

import { useState, useMemo } from 'react';
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

  // ✅ REAL-TIME STATS
  const stats = useMemo(() => {
    const openNow = filteredAndSortedClinics.filter((c) =>
      isCurrentlyOpen(c.hours)
    );
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
  React.useEffect(() => {
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
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <span>{stats.total} clinics found</span>
              {activeFiltersCount > 0 && (
                <Badge variant='secondary'>{activeFiltersCount} filters</Badge>
              )}
            </div>
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
          <div className='grid grid-cols-3 gap-4'>
            <div className='text-center p-3 bg-emerald-50 rounded-lg'>
              <div className='text-lg font-semibold text-emerald-700'>
                {stats.total}
              </div>
              <div className='text-sm text-emerald-600'>Total Clinics</div>
            </div>
            <div className='text-center p-3 bg-green-50 rounded-lg'>
              <div className='text-lg font-semibold text-green-700'>
                {stats.openNow}
              </div>
              <div className='text-sm text-green-600'>Open Now</div>
            </div>
            <div className='text-center p-3 bg-red-50 rounded-lg'>
              <div className='text-lg font-semibold text-red-700'>
                {stats.emergency}
              </div>
              <div className='text-sm text-red-600'>Emergency</div>
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
                value={filters.state || ''}
                onValueChange={(value) =>
                  updateFilters({ state: value || undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select State' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>All States</SelectItem>
                  {filterOptions.states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state} ({clinics.filter((c) => c.state === state).length}
                      )
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.city || ''}
                onValueChange={(value) =>
                  updateFilters({ city: value || undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select City' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>All Cities</SelectItem>
                  {filterOptions.cities
                    .filter(
                      (city) =>
                        !filters.state ||
                        clinics.some(
                          (c) => c.city === city && c.state === filters.state
                        )
                    )
                    .map((city) => (
                      <SelectItem key={city} value={city}>
                        {city} (
                        {
                          clinics.filter(
                            (c) =>
                              c.city === city &&
                              (!filters.state || c.state === filters.state)
                          ).length
                        }
                        )
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ✅ NEW: Real-time Status Filters */}
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
                <label htmlFor='open-now' className='text-sm font-medium'>
                  Open Now (
                  {clinics.filter((c) => isCurrentlyOpen(c.hours)).length})
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
                  className='text-sm font-medium flex items-center gap-1'
                >
                  <Shield className='h-3 w-3' />
                  Emergency Services (
                  {clinics.filter((c) => c.emergency).length})
                </label>
              </div>
            </div>
          </div>

          {/* Services Filter */}
          <div className='space-y-3'>
            <h4 className='font-medium'>Services Offered</h4>
            <div className='grid grid-cols-2 gap-2 max-h-32 overflow-y-auto'>
              {filterOptions.services.map((service) => (
                <div key={service} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`service-${service}`}
                    checked={filters.services?.includes(service) || false}
                    onCheckedChange={(checked) => {
                      const newServices = checked
                        ? [...(filters.services || []), service]
                        : (filters.services || []).filter((s) => s !== service);
                      updateFilters({ services: newServices });
                    }}
                  />
                  <label htmlFor={`service-${service}`} className='text-sm'>
                    {service} (
                    {
                      clinics.filter((c) =>
                        c.services_offered?.includes(service)
                      ).length
                    }
                    )
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Specializations Filter */}
          <div className='space-y-3'>
            <h4 className='font-medium'>Specializations</h4>
            <div className='grid grid-cols-2 gap-2 max-h-32 overflow-y-auto'>
              {filterOptions.specializations.map((spec) => (
                <div key={spec} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`spec-${spec}`}
                    checked={filters.specializations?.includes(spec) || false}
                    onCheckedChange={(checked) => {
                      const newSpecs = checked
                        ? [...(filters.specializations || []), spec]
                        : (filters.specializations || []).filter(
                            (s) => s !== spec
                          );
                      updateFilters({ specializations: newSpecs });
                    }}
                  />
                  <label htmlFor={`spec-${spec}`} className='text-sm'>
                    {spec} (
                    {
                      clinics.filter((c) => c.specializations?.includes(spec))
                        .length
                    }
                    )
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
              onValueChange={(value: any) => setSortBy(value)}
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
              onValueChange={(value: any) => setSortOrder(value)}
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
