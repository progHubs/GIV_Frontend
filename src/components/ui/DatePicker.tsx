// Date Picker Component
// Simple date picker component using HTML input

import React from 'react';
import { cn } from '../../lib/utils';

export interface DatePickerProps {
  selected?: Date;
  onChange: (date: Date | undefined) => void;
  placeholderText?: string;
  maxDate?: Date;
  minDate?: Date;
  className?: string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholderText = 'Select date',
  maxDate,
  minDate,
  className,
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value) {
      onChange(new Date(value));
    } else {
      onChange(undefined);
    }
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <input
      type="date"
      value={selected ? formatDateForInput(selected) : ''}
      onChange={handleChange}
      max={maxDate ? formatDateForInput(maxDate) : undefined}
      min={minDate ? formatDateForInput(minDate) : undefined}
      placeholder={placeholderText}
      disabled={disabled}
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400',
        className
      )}
    />
  );
};

export { DatePicker };
