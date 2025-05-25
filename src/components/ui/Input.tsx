import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <div className={cn('mb-4', fullWidth ? 'w-full' : '')}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{icon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            'block rounded-lg border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm',
            icon ? 'pl-10' : '',
            error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '',
            fullWidth ? 'w-full' : '',
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
};