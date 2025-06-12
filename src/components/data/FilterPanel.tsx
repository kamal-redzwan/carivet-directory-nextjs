import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  key: string;
  label: string;
  type: 'checkbox' | 'radio' | 'select';
  options: FilterOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

interface FilterPanelProps {
  filterGroups: FilterGroup[];
  activeFiltersCount: number;
  onClearAll: () => void;
  collapsible?: boolean;
  className?: string;
}

export function FilterPanel({
  filterGroups,
  activeFiltersCount,
  onClearAll,
  collapsible = true,
  className,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsible);

  const renderFilterGroup = (group: FilterGroup) => {
    switch (group.type) {
      case 'checkbox':
        return (
          <div className='space-y-2'>
            {group.options.map((option) => (
              <label
                key={option.value}
                className='flex items-center space-x-2 cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={
                    Array.isArray(group.value) &&
                    group.value.includes(option.value)
                  }
                  onChange={(e) => {
                    const currentValues = Array.isArray(group.value)
                      ? group.value
                      : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v) => v !== option.value);
                    group.onChange(newValues);
                  }}
                  className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500'
                />
                <span className='text-sm text-gray-700 flex-1'>
                  {option.label}
                </span>
                {option.count !== undefined && (
                  <Badge variant='secondary' className='text-xs'>
                    {option.count}
                  </Badge>
                )}
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className='space-y-2'>
            {group.options.map((option) => (
              <label
                key={option.value}
                className='flex items-center space-x-2 cursor-pointer'
              >
                <input
                  type='radio'
                  name={group.key}
                  checked={group.value === option.value}
                  onChange={() => group.onChange(option.value)}
                  className='w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500'
                />
                <span className='text-sm text-gray-700 flex-1'>
                  {option.label}
                </span>
                {option.count !== undefined && (
                  <Badge variant='secondary' className='text-xs'>
                    {option.count}
                  </Badge>
                )}
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-lg'>Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge
                variant='default'
                className='bg-emerald-100 text-emerald-800'
              >
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          <div className='flex items-center gap-2'>
            {activeFiltersCount > 0 && (
              <Button
                onClick={onClearAll}
                variant='ghost'
                size='sm'
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={14} className='mr-1' />
                Clear all
              </Button>
            )}
            {collapsible && (
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant='ghost'
                size='sm'
                className='lg:hidden text-gray-500 hover:text-gray-700'
              >
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          'space-y-6',
          collapsible && !isExpanded && 'hidden lg:block'
        )}
      >
        {filterGroups.map((group) => (
          <div key={group.key}>
            <h4 className='font-medium text-gray-900 mb-3'>{group.label}</h4>
            {renderFilterGroup(group)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
