import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedStatusProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  message: string;
  showIcon?: boolean;
  className?: string;
  onClose?: () => void;
}

export const ThemedStatus: React.FC<ThemedStatusProps> = ({
  type,
  message,
  showIcon = true,
  className = '',
  onClose
}) => {
  const { currentTheme } = useTheme();

  const statusConfig = {
    success: {
      icon: '✅',
      bgColor: '#10B981',
      textColor: '#ffffff',
      borderColor: '#059669',
    },
    error: {
      icon: '❌',
      bgColor: '#EF4444',
      textColor: '#ffffff',
      borderColor: '#DC2626',
    },
    warning: {
      icon: '⚠️',
      bgColor: '#F59E0B',
      textColor: '#ffffff',
      borderColor: '#D97706',
    },
    info: {
      icon: 'ℹ️',
      bgColor: currentTheme.primaryColor,
      textColor: '#ffffff',
      borderColor: currentTheme.secondaryColor,
    },
    loading: {
      icon: '⏳',
      bgColor: currentTheme.accentColor,
      textColor: '#ffffff',
      borderColor: currentTheme.secondaryColor,
    },
  };

  const config = statusConfig[type];

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${className}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        borderColor: config.borderColor,
      }}
    >
      <div className="flex items-center">
        {showIcon && (
          <span className="mr-2 text-lg">
            {type === 'loading' ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              config.icon
            )}
          </span>
        )}
        <span className="font-medium">{message}</span>
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}; 