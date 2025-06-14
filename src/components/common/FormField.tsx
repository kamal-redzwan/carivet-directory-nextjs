'use client';

import { forwardRef, ChangeEvent } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { cn } from '@/lib/utils';

interface BaseFieldProps {
  label?: string;
  error?: string | null;
  required?: boolean;
  className?: string;
  description?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

interface TextareaFieldProps extends BaseFieldProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

interface CheckboxFieldProps extends BaseFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}

// Input Field
export const FormField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      required,
      className,
      description,
      type = 'text',
      placeholder,
      value,
      onChange,
      onBlur,
    },
    ref
  ) => {
    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label htmlFor={label} className='text-sm font-medium text-gray-700'>
            {label} {required && <span className='text-red-500'>*</span>}
          </Label>
        )}
        <Input
          ref={ref}
          id={label}
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          onBlur={onBlur}
          className={cn(error && 'border-red-500 focus:border-red-500')}
        />
        {description && <p className='text-xs text-gray-500'>{description}</p>}
        {error && <p className='text-xs text-red-600'>{error}</p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

// Textarea Field
export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      label,
      error,
      required,
      className,
      description,
      placeholder,
      value,
      onChange,
      onBlur,
      rows = 4,
    },
    ref
  ) => {
    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label htmlFor={label} className='text-sm font-medium text-gray-700'>
            {label} {required && <span className='text-red-500'>*</span>}
          </Label>
        )}
        <textarea
          ref={ref}
          id={label}
          placeholder={placeholder}
          value={value || ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            onChange(e.target.value)
          }
          onBlur={onBlur}
          rows={rows}
          className={cn(
            'w-full px-3 py-2 border rounded-md transition-all duration-200',
            'focus:ring-2 focus:ring-offset-0 focus:outline-none',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20',
            className
          )}
        />
        {description && <p className='text-xs text-gray-500'>{description}</p>}
        {error && <p className='text-xs text-red-600'>{error}</p>}
      </div>
    );
  }
);

// Select Field
export function SelectField({
  label,
  error,
  required,
  className,
  description,
  placeholder,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={label} className='text-sm font-medium text-gray-700'>
          {label} {required && <span className='text-red-500'>*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(error && 'border-red-500')}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <p className='text-xs text-gray-500'>{description}</p>}
      {error && <p className='text-xs text-red-600'>{error}</p>}
    </div>
  );
}

// Checkbox Field
export function CheckboxField({
  label,
  error,
  required,
  className,
  description,
  checked,
  onChange,
  children,
}: CheckboxFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className='flex items-center space-x-2'>
        <input
          type='checkbox'
          id={label}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500'
        />
        <Label htmlFor={label} className='text-sm text-gray-700 flex-1'>
          {children} {required && <span className='text-red-500'>*</span>}
        </Label>
      </div>
      {description && (
        <p className='text-xs text-gray-500 ml-6'>{description}</p>
      )}
      {error && <p className='text-xs text-red-600 ml-6'>{error}</p>}
    </div>
  );
}
