import React from 'react';
import { ChainType } from '../../types/Pos';
interface ChainBadgeProps {
    chain: ChainType;
    size?: 'sm' | 'md' | 'lg';
    showName?: boolean;
    className?: string;
}
export declare const ChainBadge: React.FC<ChainBadgeProps>;
export {};
