import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  icon,
  iconPosition = 'left'
}) => {
  const { currentTheme } = useTheme();

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantStyles = {
    primary: {
      backgroundColor: currentTheme.primaryColor,
      color: '#ffffff',
      borderColor: currentTheme.primaryColor,
      focusRingColor: currentTheme.primaryColor,
      hoverBg: currentTheme.secondaryColor,
    },
    secondary: {
      backgroundColor: currentTheme.accentColor,
      color: '#ffffff',
      borderColor: currentTheme.accentColor,
      focusRingColor: currentTheme.accentColor,
      hoverBg: currentTheme.secondaryColor,
    },
    outline: {
      backgroundColor: 'transparent',
      color: currentTheme.primaryColor,
      borderColor: currentTheme.primaryColor,
      focusRingColor: currentTheme.primaryColor,
      hoverBg: `${currentTheme.primaryColor}10`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: currentTheme.primaryColor,
      borderColor: 'transparent',
      focusRingColor: currentTheme.primaryColor,
      hoverBg: `${currentTheme.primaryColor}10`,
    },
  };

  const style = variantStyles[variant];
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${widthClass} ${className}`}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        border: `1px solid ${style.borderColor}`,
        '--tw-ring-color': style.focusRingColor,
      } as React.CSSProperties}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
}; 