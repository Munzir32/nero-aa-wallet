import React from 'react';
import { cn } from '../../utils/cn';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  showBorder?: boolean;
}

// This is a placeholder component - in a real implementation, you would use a QR code generation library
export const QRCode: React.FC<QRCodeProps> = ({ 
  value, 
  size = 200, 
  className,
  showBorder = true 
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      showBorder && 'p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl',
      className
    )}>
      {/* Placeholder for QR code - in production use a real QR code library */}
      <div 
        className="bg-white p-4 rounded-xl"
        style={{ width: size, height: size }}
      >
        <div className="h-full w-full bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500">QR Code for: {value.substring(0, 20)}...</span>
        </div>
      </div>
    </div>
  );
};