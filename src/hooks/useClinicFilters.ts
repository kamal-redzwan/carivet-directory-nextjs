import { useState, useMemo } from 'react';
import { Clinic } from '@/types/clinic';

export interface FilterState {
  state: string;
  city: string;
  emergency: boolean;
  animalTypes: string[];
  services: string[];
}

export function useClinicFilters(clinics: Clinic[], searchQuery: string) {
  const [filters, setFilters] = useState<FilterState>({
    state: '',
    city: '',
    emergency: false,
    animalTypes: [],
    services: [],
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const states = [
      ...new Set(clinics.map((c) => c.state).filter(Boolean)),
    ].sort();
    const cities = [
      ...new Set(clinics.map((c) => c.city).filter(Boolean)),
    ].sort();

    // Extract all unique animal types
    const animalTypes = [
      ...new Set(clinics.flatMap((c) => c.animals_treated || [])),
    ]
      .filter(Boolean)
      .sort();

    // Extract all unique services (combining services_offered and specializations)
    const services = [
      ...new Set([
        ...clinics.flatMap((c) => c.services_offered || []),
        ...clinics.flatMap((c) => c.specializations || []),
      ]),
    ]
      .filter(Boolean)
      .sort();

    return {
      states,
      cities,
      animalTypes,
      services,
    };
  }, [clinics]);

  // Apply all filters
  const filteredClinics = useMemo(() => {
    let filtered = clinics;

    // Apply search query first
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(query) ||
          clinic.city.toLowerCase().includes(query) ||
          clinic.state.toLowerCase().includes(query) ||
          clinic.street.toLowerCase().includes(query) ||
          (clinic.animals_treated || []).some((animal) =>
            animal.toLowerCase().includes(query)
          ) ||
          (clinic.specializations || []).some((spec) =>
            spec.toLowerCase().includes(query)
          ) ||
          (clinic.services_offered || []).some((service) =>
            service.toLowerCase().includes(query)
          )
      );
    }

    // Apply state filter
    if (filters.state) {
      filtered = filtered.filter((clinic) => clinic.state === filters.state);
    }

    // Apply city filter
    if (filters.city) {
      filtered = filtered.filter((clinic) => clinic.city === filters.city);
    }

    // Apply emergency filter
    if (filters.emergency) {
      filtered = filtered.filter((clinic) => clinic.emergency === true);
    }

    // Apply animal types filter
    if (filters.animalTypes.length > 0) {
      filtered = filtered.filter((clinic) =>
        filters.animalTypes.some((animalType) =>
          (clinic.animals_treated || []).includes(animalType)
        )
      );
    }

    // Apply services filter
    if (filters.services.length > 0) {
      filtered = filtered.filter((clinic) => {
        return filters.services.some((service) => {
          // Handle Vaccination specially - assume all clinics offer vaccination
          if (service === 'Vaccination' || service === 'vaccination') {
            return true; // All veterinary clinics offer vaccination
          }

          // Check if service matches in services_offered or specializations
          const serviceInOffered = (clinic.services_offered || []).some(
            (s) =>
              s.toLowerCase().includes(service.toLowerCase()) ||
              service.toLowerCase().includes(s.toLowerCase())
          );

          const serviceInSpecializations = (clinic.specializations || []).some(
            (s) =>
              s.toLowerCase().includes(service.toLowerCase()) ||
              service.toLowerCase().includes(s.toLowerCase())
          );

          return serviceInOffered || serviceInSpecializations;
        });
      });
    }

    return filtered;
  }, [clinics, searchQuery, filters]);

  // Get available cities based on selected state
  const availableCities = useMemo(() => {
    if (!filters.state) {
      return filterOptions.cities;
    }
    return [
      ...new Set(
        clinics
          .filter((c) => c.state === filters.state)
          .map((c) => c.city)
          .filter(Boolean)
      ),
    ].sort();
  }, [clinics, filters.state, filterOptions.cities]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => {
      // If we're updating the state, reset all other filters
      if (newFilters.state !== undefined && newFilters.state !== prev.state) {
        return {
          state: newFilters.state,
          city: '',
          emergency: false,
          animalTypes: [],
          services: [],
        };
      }

      // Otherwise, do a partial update
      return { ...prev, ...newFilters };
    });
  };

  return {
    filters,
    updateFilters,
    filteredClinics,
    filterOptions: {
      ...filterOptions,
      cities: availableCities,
    },
  };
}
