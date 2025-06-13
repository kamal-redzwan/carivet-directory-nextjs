import React from 'react';

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, checked = false, onCheckedChange, disabled = false }, ref) => (
    <input
      ref={ref}
      id={id}
      type='checkbox'
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
      className='h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500'
    />
  )
);
Checkbox.displayName = 'Checkbox';
