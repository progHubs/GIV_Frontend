// Checkbox Component
// Reusable checkbox component

import React from 'react';
import { FiCheck, FiMinus } from 'react-icons/fi';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate, onChange, label, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={handleChange}
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white transition-colors dark:border-gray-600 dark:bg-gray-800',
              checked || indeterminate
                ? 'bg-blue-600 border-blue-600 text-white dark:bg-blue-600 dark:border-blue-600'
                : 'hover:border-gray-400 dark:hover:border-gray-500',
              className
            )}
            onClick={() => onChange?.(!checked)}
          >
            {indeterminate ? (
              <FiMinus className="h-3 w-3" />
            ) : checked ? (
              <FiCheck className="h-3 w-3" />
            ) : null}
          </div>
        </div>
        {label && (
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            onClick={() => onChange?.(!checked)}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
