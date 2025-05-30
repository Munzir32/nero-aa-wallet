import React, { ReactNode } from 'react';
import { CartItem, Product } from '../types/Pos';
interface CartContextType {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    itemCount: number;
}
export declare const CartProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useCart: () => CartContextType;
export {};
