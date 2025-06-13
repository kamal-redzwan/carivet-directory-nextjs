import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchHeaderProps {
  title: string;
  subtitle?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  actions?: Array<{
    label: string;
    icon?: React.ComponentType<{ size?: number }>;
    variant?: 'default' | 'outline' | 'destructive';
    onClick: () => void;
  }>;
  stats?: Array<{
    label: string;
    value: string | number;
  }>;
}

export function SearchHeader({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  showFilters = false,
  onToggleFilters,
  actions = [],
  stats = [],
}: SearchHeaderProps) {
  return (
    <div className='space-y-6'>
      {/* Title and Actions */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
          {subtitle && <p className='text-gray-600 mt-1'>{subtitle}</p>}
        </div>

        {actions.length > 0 && (
          <div className='flex items-center gap-3'>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                size='sm'
                onClick={action.onClick}
              >
                {action.icon && <action.icon size={16} className='mr-2' />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className='flex flex-wrap gap-6'>
          {stats.map((stat, index) => (
            <div key={index} className='text-center'>
              <div className='text-2xl font-bold text-gray-900'>
                {stat.value}
              </div>
              <div className='text-sm text-gray-500'>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-10'
          />
        </div>

        {showFilters && onToggleFilters && (
          <Button variant='outline' onClick={onToggleFilters}>
            <Filter size={16} className='mr-2' />
            Filters
          </Button>
        )}
      </div>
    </div>
  );
}
