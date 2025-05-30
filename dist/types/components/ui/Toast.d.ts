import React from 'react';
export type ToastType = 'success' | 'error' | 'info';
interface ToastProps {
    type: ToastType;
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}
export declare const Toast: React.FC<ToastProps>;
export {};
