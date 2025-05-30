import React from 'react';
import { Wallet } from '../../types';
interface WalletStatusProps {
    wallet: Wallet | null;
    className?: string;
}
export declare const WalletStatus: React.FC<WalletStatusProps>;
export {};
