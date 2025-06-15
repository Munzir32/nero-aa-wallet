import React from 'react';
import { Token, TOKEN_DETAILS, TokenType } from '../../types/Pos';
import { cn } from '../../utils/cn';

interface TokenBadgeProps {
  token: Token;
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
  // const tokenDetails = TOKEN_DETAILS[token];
  let tokenType: TokenType;
  switch (token) {
    case '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed':
      tokenType = 'USDC';
      break;
    case '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74':
      tokenType = 'USDT';
      break;
    case '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345':
      tokenType = 'DAI';
      break;
    default:
      tokenType = token; // Fallback for other cases
  }
  const tokenDetails = TOKEN_DETAILS[tokenType];

  
  
  
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
      // style={{
      //   backgroundColor: "blue"
      // }}
      style={{ backgroundColor: `${tokenDetails.color}20`, color: tokenDetails.color }}
    >
      <span className="flex items-center">
        <span className="mr-1 font-bold">{tokenDetails.symbol}</span>
        {/* <span className="mr-1 text-white font-bold">Nero</span> */}

        {showName && <span className="ml-1 text-gray-600 dark:text-gray-400">{tokenDetails.name}</span>}
      </span>
    </div>
  );
};