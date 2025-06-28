import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md'
}) => {
  const { currentTheme } = useTheme();

  const baseClasses = 'rounded-lg shadow-sm border';
  
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg',
    outlined: `bg-transparent border-2`,
  };

  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const style = variant === 'outlined' ? {
    borderColor: currentTheme.primaryColor,
    backgroundColor: `${currentTheme.primaryColor}10`
  } : {};

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}; 