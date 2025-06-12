import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  sortable?: boolean;
  selectable?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  getItemId?: (item: T) => string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  sortable = true,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  getItemId = (item) => item.id,
  filters,
  actions,
  emptyMessage = 'No data found',
  className,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;

    return columns.some((column) => {
      const value = item[column.key as keyof T];
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn as keyof T];
    const bValue = b[sortColumn as keyof T];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof T | string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (selectedItems.length === sortedData.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(sortedData.map(getItemId));
    }
  };

  const handleSelectItem = (itemId: string) => {
    if (!onSelectionChange) return;

    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter((id) => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <CardTitle>Data ({sortedData.length})</CardTitle>

          <div className='flex flex-col md:flex-row gap-4 w-full md:w-auto'>
            {searchable && (
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10 md:w-64'
                />
              </div>
            )}

            {filters}
            {actions}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <LoadingSpinner size='lg' />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className='hidden lg:block'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-gray-200'>
                      {selectable && (
                        <th className='text-left py-3 px-4 w-12'>
                          <input
                            type='checkbox'
                            checked={
                              selectedItems.length === sortedData.length &&
                              sortedData.length > 0
                            }
                            onChange={handleSelectAll}
                            className='rounded border-gray-300'
                          />
                        </th>
                      )}
                      {columns.map((column) => (
                        <th
                          key={String(column.key)}
                          className={cn(
                            'text-left py-3 px-4 font-medium text-gray-600',
                            column.className,
                            column.sortable &&
                              sortable &&
                              'cursor-pointer hover:text-gray-900'
                          )}
                          onClick={() =>
                            column.sortable &&
                            sortable &&
                            handleSort(column.key)
                          }
                        >
                          <div className='flex items-center gap-2'>
                            {column.label}
                            {column.sortable &&
                              sortable &&
                              sortColumn === column.key &&
                              (sortDirection === 'asc' ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              ))}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((item, index) => (
                      <tr
                        key={getItemId(item)}
                        className='border-b border-gray-100 hover:bg-gray-50'
                      >
                        {selectable && (
                          <td className='py-3 px-4'>
                            <input
                              type='checkbox'
                              checked={selectedItems.includes(getItemId(item))}
                              onChange={() => handleSelectItem(getItemId(item))}
                              className='rounded border-gray-300'
                            />
                          </td>
                        )}
                        {columns.map((column) => (
                          <td
                            key={String(column.key)}
                            className={cn('py-3 px-4', column.className)}
                          >
                            {column.render
                              ? column.render(item, index)
                              : String(item[column.key as keyof T] || '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className='lg:hidden space-y-4'>
              {sortedData.map((item, index) => (
                <Card key={getItemId(item)} className='p-4'>
                  <div className='space-y-3'>
                    {selectable && (
                      <div className='flex justify-end'>
                        <input
                          type='checkbox'
                          checked={selectedItems.includes(getItemId(item))}
                          onChange={() => handleSelectItem(getItemId(item))}
                          className='rounded border-gray-300'
                        />
                      </div>
                    )}
                    {columns.map((column) => (
                      <div
                        key={String(column.key)}
                        className='flex justify-between'
                      >
                        <span className='font-medium text-gray-600'>
                          {column.label}:
                        </span>
                        <span className='text-gray-900'>
                          {column.render
                            ? column.render(item, index)
                            : String(item[column.key as keyof T] || '')}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {sortedData.length === 0 && (
              <div className='text-center py-12'>
                <p className='text-gray-500'>{emptyMessage}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
