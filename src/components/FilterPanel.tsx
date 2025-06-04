import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  X,
  MapPin,
  Clock,
  Heart,
  Wrench,
} from 'lucide-react';

interface FilterPanelProps {
  filters: {
    state: string;
    city: string;
    emergency: boolean;
    animalTypes: string[];
    services: string[];
  };
  onFilterChange: (filters: any) => void;
  availableStates: string[];
  availableCities: string[];
  availableAnimalTypes: string[];
  availableServices: string[];
}

export default function FilterPanel({
  filters,
  onFilterChange,
  availableStates,
  availableCities,
  availableAnimalTypes,
  availableServices,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const currentArray = filters[key as keyof typeof filters] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFilterChange({
      state: '',
      city: '',
      emergency: false,
      animalTypes: [],
      services: [],
    });
  };

  const hasActiveFilters =
    filters.state ||
    filters.city ||
    filters.emergency ||
    filters.animalTypes.length > 0 ||
    filters.services.length > 0;

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
      {/* Filter Header */}
      <div className='p-4 border-b border-gray-100'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <h3 className='text-lg font-semibold text-gray-900'>Filters</h3>
            {hasActiveFilters && (
              <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
                Active
              </span>
            )}
          </div>
          <div className='flex items-center gap-2'>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className='text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1'
              >
                <X size={14} />
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='lg:hidden flex items-center gap-1 text-gray-500 hover:text-gray-700'
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {isExpanded ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className='p-4 space-y-6'>
          {/* Location Filters */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <MapPin size={16} className='text-gray-500' />
              <h4 className='font-medium text-gray-900'>Location</h4>
            </div>

            <div className='space-y-3'>
              {/* State Filter */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  State
                </label>
                <select
                  value={filters.state}
                  onChange={(e) => updateFilter('state', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                >
                  <option value=''>All States</option>
                  {availableStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  City
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => updateFilter('city', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                >
                  <option value=''>All Cities</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Services */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <Clock size={16} className='text-gray-500' />
              <h4 className='font-medium text-gray-900'>Availability</h4>
            </div>

            <label className='flex items-center gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={filters.emergency}
                onChange={(e) => updateFilter('emergency', e.target.checked)}
                className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700'>
                Emergency Services Available
              </span>
            </label>
          </div>

          {/* Animal Types */}
          {availableAnimalTypes.length > 0 && (
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <Heart size={16} className='text-gray-500' />
                <h4 className='font-medium text-gray-900'>Animals Treated</h4>
              </div>

              <div className='space-y-2 max-h-32 overflow-y-auto'>
                {availableAnimalTypes.map((animal) => (
                  <label
                    key={animal}
                    className='flex items-center gap-3 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      checked={filters.animalTypes.includes(animal)}
                      onChange={() => toggleArrayFilter('animalTypes', animal)}
                      className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <span className='text-sm text-gray-700 capitalize'>
                      {animal}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {availableServices.length > 0 && (
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <Wrench size={16} className='text-gray-500' />
                <h4 className='font-medium text-gray-900'>Services</h4>
              </div>

              <div className='space-y-2 max-h-40 overflow-y-auto'>
                {availableServices.map((service) => (
                  <label
                    key={service}
                    className='flex items-center gap-3 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      checked={filters.services.includes(service)}
                      onChange={() => toggleArrayFilter('services', service)}
                      className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <span className='text-sm text-gray-700'>{service}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
