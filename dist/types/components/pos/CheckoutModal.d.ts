import React from 'react';
import { CartItem, TokenType, ChainType } from '../../types/Pos';
interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    token: TokenType;
    chain: ChainType;
    walletAddress: string;
}
export declare const CheckoutModal: React.FC<CheckoutModalProps>;
export {};
