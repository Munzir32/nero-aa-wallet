import React, { ReactNode } from 'react';
import { Wallet } from '../types/Pos';
interface WalletContextType {
    wallet: Wallet | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}
export declare const WalletProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useWallet: () => WalletContextType;
export {};
