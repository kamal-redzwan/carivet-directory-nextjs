'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  required?: boolean;
  error?: string;
  description?: string;
  className?: string;
}

export function FormSection({
  title,
  icon,
  children,
  collapsible = false,
  defaultExpanded = true,
  required = false,
  error,
  description,
  className,
}: FormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card
      className={cn(
        'transition-all duration-200',
        error && 'border-red-300 shadow-red-100',
        className
      )}
    >
      <CardHeader
        className={cn(
          collapsible && 'cursor-pointer hover:bg-gray-50',
          'transition-colors'
        )}
      >
        <div
          className='flex items-center justify-between'
          onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <CardTitle className='flex items-center gap-2'>
            {icon}
            {title}
            {required && <span className='text-red-500'>*</span>}
            {error && <AlertTriangle className='h-4 w-4 text-red-500' />}
          </CardTitle>

          {collapsible && (
            <Button variant='ghost' size='sm' className='p-1'>
              {isExpanded ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </Button>
          )}
        </div>

        {description && (
          <p className='text-sm text-gray-600 mt-2'>{description}</p>
        )}

        {error && (
          <div className='text-sm text-red-600 bg-red-50 p-3 rounded-md mt-2 flex items-center gap-2'>
            <AlertTriangle className='h-4 w-4 flex-shrink-0' />
            {error}
          </div>
        )}
      </CardHeader>

      {(!collapsible || isExpanded) && <CardContent>{children}</CardContent>}
    </Card>
  );
}
