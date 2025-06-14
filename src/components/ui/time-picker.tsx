import * as React from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface TimePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (time: string) => void;
}

export function TimePicker({
  value,
  onChange,
  className,
  ...props
}: TimePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    // Validate time format (HH:MM)
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      onChange(time);
    }
  };

  return (
    <Input
      type='time'
      value={value}
      onChange={handleChange}
      className={cn('w-[120px]', className)}
      {...props}
    />
  );
}
