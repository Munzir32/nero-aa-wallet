import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helpTextClassName?: string;
  onClick?: () => void;
  readOnly?: boolean;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  helpText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  inputClassName = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  helpTextClassName = '',
  onClick,
  readOnly = false,
  rightElement,
  leftElement,
}) => {
  const { currentTheme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const baseContainerClass = fullWidth ? 'w-full mb-4' : 'mb-4';
  const baseLabelClass = 'block text-sm font-medium mb-1';
  const baseInputClass = 'block w-full rounded-lg py-2 px-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm';
  const baseErrorClass = 'mt-1 text-sm';
  const baseHelpTextClass = 'mt-1 text-sm';

  const labelStyle = {
    color: '#374151', // Gray-700
  };

  const inputStyle = {
    backgroundColor: '#ffffff',
    color: '#111827', // Gray-900
    borderColor: error ? '#ef4444' : '#d1d5db', // Gray-300
    '--tw-ring-color': currentTheme.primaryColor,
  } as React.CSSProperties;

  const errorStyle = {
    color: '#ef4444',
  };

  const helpTextStyle = {
    color: '#6b7280', // Gray-500
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const readOnlyClass = readOnly ? 'cursor-pointer' : '';
  const leftPaddingClass = (leftElement || (icon && iconPosition === 'left')) ? 'pl-10' : '';
  const rightPaddingClass = (rightElement || (icon && iconPosition === 'right')) ? 'pr-10' : '';

  return (
    <div className={`${baseContainerClass} ${containerClassName} ${className}`}>
      {label && (
        <label 
          className={`${baseLabelClass} ${labelClassName}`}
          style={labelStyle}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {(leftElement || (icon && iconPosition === 'left')) && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span style={{ color: '#6b7280' }}>
              {leftElement || icon}
            </span>
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onClick={onClick}
          className={`${baseInputClass} ${widthClass} ${disabledClass} ${readOnlyClass} ${leftPaddingClass} ${rightPaddingClass} ${inputClassName}`}
          style={inputStyle}
        />
        
        {(rightElement || (icon && iconPosition === 'right')) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span style={{ color: '#6b7280' }}>
              {rightElement || icon}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <p className={`${baseErrorClass} ${errorClassName}`} style={errorStyle}>
          {error}
        </p>
      )}
      
      {helpText && (
        <p className={`${baseHelpTextClass} ${helpTextClassName}`} style={helpTextStyle}>
          {helpText}
        </p>
      )}
    </div>
  );
}; 