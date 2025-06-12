import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface BaseFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  description?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'tel' | 'url' | 'password';
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
export function TextareaField({
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
}: TextareaFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={label} className='text-sm font-medium text-gray-700'>
          {label} {required && <span className='text-red-500'>*</span>}
        </Label>
      )}
      <Textarea
        id={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={rows}
        className={cn(error && 'border-red-500 focus:border-red-500')}
      />
      {description && <p className='text-xs text-gray-500'>{description}</p>}
      {error && <p className='text-xs text-red-600'>{error}</p>}
    </div>
  );
}

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
