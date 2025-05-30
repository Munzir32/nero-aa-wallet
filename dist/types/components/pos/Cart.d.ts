import React from 'react';
import { CartItem as CartItemType, TokenType } from '../../types/Pos';
import { ChainType } from '../../types/Pos';
interface CartProps {
    items: CartItemType[];
    onRemoveItem: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onClearCart: () => void;
    onCheckout: () => void;
    selectedToken: TokenType;
    selectedChain: ChainType;
    onTokenChange: (token: TokenType) => void;
    onChainChange: (chain: ChainType) => void;
}
export declare const Cart: React.FC<CartProps>;
export {};
