import React from 'react';
import { TokenType, TOKEN_DETAILS } from '../../types/Pos';
import { cn } from '../../utils/cn';

interface TokenBadgeProps {
  token: TokenType;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const TokenBadge: React.FC<TokenBadgeProps> = ({
  token,
  size = 'md',
  showName = false,
  className,
}) => {
  const tokenDetails = TOKEN_DETAILS[token];
  
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
      style={{ backgroundColor: `${tokenDetails.color}20`, color: tokenDetails.color }}
    >
      <span className="flex items-center">
        <span className="mr-1 font-bold">{tokenDetails.symbol}</span>
        {showName && <span className="ml-1 text-gray-600 dark:text-gray-400">{tokenDetails.name}</span>}
      </span>
    </div>
  );
};