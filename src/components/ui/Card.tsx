import React from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  themed?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, themed = false }) => {
  const { currentTheme } = useTheme();
  
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700';
  const themedClasses = themed ? 'border-2' : '';
  
  const style = themed ? {
    borderColor: currentTheme.primaryColor,
    backgroundColor: `${currentTheme.primaryColor}05`
  } : {};

  return (
    <div 
      className={cn(baseClasses, themedClasses, className)}
      style={style}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className, themed = false }) => {
  const { currentTheme } = useTheme();
  
  const baseClasses = 'px-6 py-4 border-b border-gray-200 dark:border-gray-700';
  const themedClasses = themed ? 'border-b-2' : '';
  
  const style = themed ? {
    borderBottomColor: currentTheme.primaryColor
  } : {};

  return (
    <div 
      className={cn(baseClasses, themedClasses, className)}
      style={style}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardProps> = ({ children, className, themed = false }) => {
  const { currentTheme } = useTheme();
  
  const baseClasses = 'text-lg font-semibold text-gray-900 dark:text-white';
  
  const style = themed ? {
    color: currentTheme.primaryColor
  } : {};

  return (
    <h3 
      className={cn(baseClasses, className)}
      style={style}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<CardProps> = ({ children, className, themed = false }) => {
  return (
    <p className={cn('mt-1 text-sm text-gray-500 dark:text-gray-400', className)}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className, themed = false }) => {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, className, themed = false }) => {
  return (
    <div className={cn('px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-xl border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
};