'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export function PhoneInput({
  value,
  onChange,
  error,
  placeholder = '+60 3-1234 5678',
}: PhoneInputProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [formatted, setFormatted] = useState(value);

  const validatePhoneNumber = (phone: string): boolean => {
    // Malaysian phone number patterns
    const patterns = [
      /^\+60\s?\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}$/, // Landline: +60 3-1234 5678
      /^\+60\s?1[0-9][-\s]?\d{3,4}[-\s]?\d{4}$/, // Mobile: +60 12-345 6789
    ];

    return patterns.some((pattern) => pattern.test(phone));
  };

  const formatPhoneNumber = (input: string): string => {
    // Remove all non-digits except +
    let cleaned = input.replace(/[^\d+]/g, '');

    // Ensure it starts with +60
    if (!cleaned.startsWith('+60')) {
      if (cleaned.startsWith('60')) {
        cleaned = '+' + cleaned;
      } else if (cleaned.startsWith('0')) {
        cleaned = '+60' + cleaned.substring(1);
      } else if (cleaned.length > 0 && !cleaned.startsWith('+')) {
        cleaned = '+60' + cleaned;
      }
    }

    // Format the number
    if (cleaned.length >= 3) {
      const countryCode = cleaned.substring(0, 3); // +60
      const remaining = cleaned.substring(3);

      if (remaining.length >= 2) {
        const areaCode = remaining.substring(0, 2);
        const number = remaining.substring(2);

        if (number.length >= 4) {
          const firstPart = number.substring(0, 4);
          const secondPart = number.substring(4, 8);
          return `${countryCode} ${areaCode}-${firstPart}${
            secondPart ? ' ' + secondPart : ''
          }`;
        } else {
          return `${countryCode} ${areaCode}${number ? '-' + number : ''}`;
        }
      } else {
        return `${countryCode}${remaining ? ' ' + remaining : ''}`;
      }
    }

    return cleaned;
  };

  useEffect(() => {
    if (value) {
      const isValidPhone = validatePhoneNumber(value);
      setIsValid(isValidPhone);
    } else {
      setIsValid(null);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formattedValue = formatPhoneNumber(input);
    setFormatted(formattedValue);
    onChange(formattedValue);
  };

  return (
    <div className='space-y-2'>
      <div className='relative'>
        <Phone className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
        <Input
          type='tel'
          value={formatted}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'pl-10 pr-10',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            isValid === true &&
              'border-green-300 focus:border-green-500 focus:ring-green-500',
            isValid === false &&
              'border-red-300 focus:border-red-500 focus:ring-red-500'
          )}
        />

        {/* Validation indicator */}
        {value && (
          <div className='absolute right-3 top-3'>
            {isValid ? (
              <Check className='h-4 w-4 text-green-500' />
            ) : (
              <X className='h-4 w-4 text-red-500' />
            )}
          </div>
        )}
      </div>

      {/* Format examples */}
      {!value && (
        <div className='text-xs text-gray-500'>
          <span className='font-medium'>Examples:</span>
          <div className='flex flex-wrap gap-2 mt-1'>
            <Badge variant='outline' className='text-xs'>
              +60 3-1234 5678
            </Badge>
            <Badge variant='outline' className='text-xs'>
              +60 12-345 6789
            </Badge>
          </div>
        </div>
      )}

      {error && <div className='text-sm text-red-600'>{error}</div>}
    </div>
  );
}
