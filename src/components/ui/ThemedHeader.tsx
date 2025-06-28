import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedHeaderProps {
  title: string;
  subtitle?: string;
  showBusinessIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemedHeader: React.FC<ThemedHeaderProps> = ({
  title,
  subtitle,
  showBusinessIcon = true,
  className = '',
  size = 'md'
}) => {
  const { currentTheme, businessType } = useTheme();

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const subtitleSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex items-center ${className}`}>
      {showBusinessIcon && (
        <div 
          className="mr-4 p-3 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${currentTheme.primaryColor}20` }}
        >
          <span className="text-2xl">{currentTheme.icon}</span>
        </div>
      )}
      
      <div>
        <h1 
          className={`font-bold text-gray-900 dark:text-white ${sizeClasses[size]}`}
          style={{ color: currentTheme.primaryColor }}
        >
          {title}
        </h1>
        
        {subtitle && (
          <p className={`text-gray-600 dark:text-gray-400 ${subtitleSizeClasses[size]} mt-1`}>
            {subtitle}
          </p>
        )}
        
        <div className="flex items-center mt-2">
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: currentTheme.accentColor,
              color: '#ffffff'
            }}
          >
            {currentTheme.name}
          </span>
        </div>
      </div>
    </div>
  );
}; 