import React from 'react';
import { Product } from '../../types/Pos';
interface ProductRowProps {
    id: string;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}
export declare const ProductRow: React.FC<ProductRowProps>;
export {};
