import React from 'react';
import { CartItem as CartItemType } from '../../types/Pos';
interface CartItemProps {
    item: CartItemType;
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
}
export declare const CartItemComponent: React.FC<CartItemProps>;
export {};
