import React from 'react';
import { Product } from '../../types/Pos';
interface ProductFormProps {
    initialProduct?: Partial<Product>;
    onSubmit: (product: Partial<Product>) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}
export declare const ProductForm: React.FC<ProductFormProps>;
export {};
