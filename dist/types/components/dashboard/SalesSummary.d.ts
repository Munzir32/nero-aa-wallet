import React from 'react';
interface SalesSummaryProps {
    dailySales: number;
    weeklySales: number;
    monthlySales: number;
    transactionCount: number;
    dailyChange: number;
    weeklyChange: number;
    monthlyChange: number;
}
export declare const SalesSummary: React.FC<SalesSummaryProps>;
export {};
