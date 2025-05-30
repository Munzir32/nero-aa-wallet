import React from 'react';
import { ChainType, TokenType } from '../../types/Pos';
interface SettingsProps {
    initialSettings: {
        payoutWallet: string;
        supportedChains: ChainType[];
        supportedTokens: TokenType[];
        businessName: string;
        contactEmail: string;
        logoUrl?: string;
        enableOffRamp: boolean;
    };
    onSave: (settings: any) => void;
}
export declare const SettingsForm: React.FC<SettingsProps>;
export {};
