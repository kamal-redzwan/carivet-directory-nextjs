'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, X, Tag, Stethoscope, PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceSelectorProps {
  title: string;
  icon?: React.ReactNode;
  selectedItems: string[];
  availableItems: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
  maxItems?: number;
  category?: 'animals' | 'services' | 'specializations';
}

const categoryIcons = {
  animals: PawPrint,
  services: Tag,
  specializations: Stethoscope,
};

const categoryColors = {
  animals: 'bg-blue-100 text-blue-800 border-blue-200',
  services: 'bg-purple-100 text-purple-800 border-purple-200',
  specializations: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export function ServiceSelector({
  title,
  icon,
  selectedItems,
  availableItems,
  onChange,
  placeholder = 'Search or add new...',
  allowCustom = true,
  maxItems,
  category = 'services',
}: ServiceSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const IconComponent = icon ? () => icon : categoryIcons[category];
  const badgeClass = categoryColors[category];

  const filteredItems = useMemo(() => {
    const available = availableItems.filter(
      (item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedItems.includes(item)
    );
    return showAll ? available : available.slice(0, 10);
  }, [availableItems, searchTerm, selectedItems, showAll]);

  const handleToggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      onChange(selectedItems.filter((i) => i !== item));
    } else {
      if (maxItems && selectedItems.length >= maxItems) {
        alert(`Maximum ${maxItems} items allowed`);
        return;
      }
      onChange([...selectedItems, item]);
    }
  };

  const handleAddCustom = () => {
    const trimmedTerm = searchTerm.trim();
    if (
      trimmedTerm &&
      !availableItems.includes(trimmedTerm) &&
      !selectedItems.includes(trimmedTerm)
    ) {
      if (maxItems && selectedItems.length >= maxItems) {
        alert(`Maximum ${maxItems} items allowed`);
        return;
      }
      onChange([...selectedItems, trimmedTerm]);
      setSearchTerm('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && allowCustom && searchTerm.trim()) {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconComponent className='h-5 w-5' />
          {title}
          {maxItems && (
            <Badge variant='outline' className='text-xs'>
              {selectedItems.length}/{maxItems}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Search Input */}
        <div className='relative'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className='pl-10'
          />
          {allowCustom && searchTerm.trim() && (
            <Button
              type='button'
              onClick={handleAddCustom}
              className='absolute right-2 top-2 h-6 px-2 text-xs'
              size='sm'
            >
              <Plus className='h-3 w-3 mr-1' />
              Add
            </Button>
          )}
        </div>

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <div>
            <h4 className='text-sm font-medium text-gray-700 mb-2'>
              Selected ({selectedItems.length})
            </h4>
            <div className='flex flex-wrap gap-2'>
              {selectedItems.map((item) => (
                <Badge
                  key={item}
                  className={cn(badgeClass, 'cursor-pointer hover:opacity-80')}
                  onClick={() => handleToggleItem(item)}
                >
                  {item}
                  <X className='h-3 w-3 ml-1' />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Available Items */}
        {filteredItems.length > 0 && (
          <div>
            <h4 className='text-sm font-medium text-gray-700 mb-2'>
              Available Options
            </h4>
            <div className='flex flex-wrap gap-2'>
              {filteredItems.map((item) => (
                <Badge
                  key={item}
                  variant='outline'
                  className='cursor-pointer hover:bg-gray-50'
                  onClick={() => handleToggleItem(item)}
                >
                  <Plus className='h-3 w-3 mr-1' />
                  {item}
                </Badge>
              ))}
            </div>

            {availableItems.length > 10 && !showAll && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => setShowAll(true)}
                className='mt-2 text-xs'
              >
                Show all {availableItems.length} options
              </Button>
            )}
          </div>
        )}

        {/* No results */}
        {searchTerm && filteredItems.length === 0 && (
          <div className='text-center py-4 text-gray-500'>
            <p className='text-sm'>No matching options found</p>
            {allowCustom && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={handleAddCustom}
                className='mt-2'
              >
                <Plus className='h-4 w-4 mr-1' />
                Add &quot;{searchTerm}&quot;
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
