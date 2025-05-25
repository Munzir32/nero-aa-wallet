import React from 'react';
import { ChainType, CHAIN_DETAILS } from '../../types';
import { cn } from '../../utils/cn';

interface ChainBadgeProps {
  chain: ChainType;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const ChainBadge: React.FC<ChainBadgeProps> = ({
  chain,
  size = 'md',
  showName = true,
  className,
}) => {
  const chainDetails = CHAIN_DETAILS[chain];
  
  const sizeStyles = {
    sm: 'h-5 text-xs',
    md: 'h-6 text-sm',
    lg: 'h-8 text-base',
  };
  
  return (
    <div 
      className={cn(
        'inline-flex items-center rounded-full px-2.5 font-medium',
        sizeStyles[size],
        className
      )}
      style={{ backgroundColor: `${chainDetails.color}20`, color: chainDetails.color }}
    >
      <span className="flex items-center">
        <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: chainDetails.color }}></span>
        {chainDetails.name}
      </span>
    </div>
  );
};