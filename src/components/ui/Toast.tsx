import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Match this with transition duration
    }, duration);
    
    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const backgrounds = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 flex items-center max-w-md p-4 mb-4 rounded-lg border shadow-md transition-all duration-300',
        backgrounds[type],
        isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      )}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
        {icons[type]}
      </div>
      <div className="ml-3 text-sm font-normal text-gray-700 dark:text-gray-300">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg p-1.5 inline-flex h-8 w-8"
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 300);
        }}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};