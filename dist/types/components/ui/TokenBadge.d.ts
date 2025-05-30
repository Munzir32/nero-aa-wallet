import React from 'react';
import { TokenType } from '../../types/Pos';
interface TokenBadgeProps {
    token: TokenType;
    size?: 'sm' | 'md' | 'lg';
    showName?: boolean;
    className?: string;
}
export declare const TokenBadge: React.FC<TokenBadgeProps>;
export {};
