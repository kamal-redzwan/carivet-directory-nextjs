'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Check } from 'lucide-react';

interface ValidatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  required?: boolean;
  helperText?: string;
  success?: boolean;
  showValidation?: boolean;
}

export function ValidatedInput({
  label,
  error,
  required,
  helperText,
  success = false,
  showValidation = true,
  className,
  ...props
}: ValidatedInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(!!props.value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const inputId = React.useId();
  const hasError = !!error;
  const showSuccess = success && !hasError && hasValue && showValidation;

  return (
    <div className='space-y-1'>
      <label
        htmlFor={inputId}
        className={cn(
          'block text-sm font-medium transition-colors',
          hasError ? 'text-red-700' : 'text-gray-700',
          isFocused && !hasError && 'text-emerald-600'
        )}
      >
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>

      <div className='relative'>
        <input
          id={inputId}
          className={cn(
            'w-full px-3 py-2 border rounded-md transition-all duration-200',
            'focus:ring-2 focus:ring-offset-0 focus:outline-none',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            hasError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : showSuccess
              ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
              : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20',
            showValidation && (hasError || showSuccess) && 'pr-10',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          {...props}
        />

        {/* Validation Icons */}
        {showValidation && (hasError || showSuccess) && (
          <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
            {hasError ? (
              <AlertCircle className='h-4 w-4 text-red-500' />
            ) : showSuccess ? (
              <Check className='h-4 w-4 text-green-500' />
            ) : null}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className='flex items-center gap-1 text-sm text-red-600'>
          <AlertCircle size={14} className='flex-shrink-0' />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className='text-xs text-gray-500'>{helperText}</p>
      )}

      {/* Success Message */}
      {showSuccess && !helperText && (
        <p className='text-xs text-green-600'>Valid input</p>
      )}
    </div>
  );
}

// Enhanced TextArea variant
interface ValidatedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string | null;
  required?: boolean;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export function ValidatedTextarea({
  label,
  error,
  required,
  helperText,
  maxLength,
  showCharCount = false,
  className,
  ...props
}: ValidatedTextareaProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [charCount, setCharCount] = React.useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const inputId = React.useId();
  const hasError = !!error;
  const isNearLimit = maxLength && charCount > maxLength * 0.8;
  const isOverLimit = maxLength && charCount > maxLength;

  return (
    <div className='space-y-1'>
      <label
        htmlFor={inputId}
        className={cn(
          'block text-sm font-medium transition-colors',
          hasError ? 'text-red-700' : 'text-gray-700',
          isFocused && !hasError && 'text-emerald-600'
        )}
      >
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>

      <div className='relative'>
        <textarea
          id={inputId}
          className={cn(
            'w-full px-3 py-2 border rounded-md transition-all duration-200',
            'focus:ring-2 focus:ring-offset-0 focus:outline-none resize-vertical',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            hasError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
      </div>

      {/* Character Count */}
      {(showCharCount || maxLength) && (
        <div className='flex justify-between items-center'>
          <div>
            {/* Error Message */}
            {error && (
              <div className='flex items-center gap-1 text-sm text-red-600'>
                <AlertCircle size={14} className='flex-shrink-0' />
                <span>{error}</span>
              </div>
            )}

            {/* Helper Text */}
            {helperText && !error && (
              <p className='text-xs text-gray-500'>{helperText}</p>
            )}
          </div>

          {/* Character Counter */}
          {(showCharCount || maxLength) && (
            <div
              className={cn(
                'text-xs',
                isOverLimit
                  ? 'text-red-600'
                  : isNearLimit
                  ? 'text-yellow-600'
                  : 'text-gray-500'
              )}
            >
              {charCount}
              {maxLength && `/${maxLength}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Enhanced Select variant
interface ValidatedSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string | null;
  required?: boolean;
  helperText?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export function ValidatedSelect({
  label,
  error,
  required,
  helperText,
  options,
  placeholder = 'Select an option...',
  className,
  ...props
}: ValidatedSelectProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const inputId = React.useId();
  const hasError = !!error;

  return (
    <div className='space-y-1'>
      <label
        htmlFor={inputId}
        className={cn(
          'block text-sm font-medium transition-colors',
          hasError ? 'text-red-700' : 'text-gray-700',
          isFocused && !hasError && 'text-emerald-600'
        )}
      >
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>

      <div className='relative'>
        <select
          id={inputId}
          className={cn(
            'w-full px-3 py-2 border rounded-md transition-all duration-200',
            'focus:ring-2 focus:ring-offset-0 focus:outline-none',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            hasError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          <option value='' disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Error Icon */}
        {error && (
          <div className='absolute inset-y-0 right-8 flex items-center pr-3'>
            <AlertCircle className='h-4 w-4 text-red-500' />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className='flex items-center gap-1 text-sm text-red-600'>
          <AlertCircle size={14} className='flex-shrink-0' />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className='text-xs text-gray-500'>{helperText}</p>
      )}
    </div>
  );
}
