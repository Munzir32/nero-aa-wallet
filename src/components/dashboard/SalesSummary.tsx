import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ArrowDown, ArrowUp, DollarSign, Activity } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface SalesSummaryProps {
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
  transactionCount: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
}

export const SalesSummary: React.FC<SalesSummaryProps> = ({
  dailySales,
  weeklySales,
  monthlySales,
  transactionCount,
  dailyChange,
  weeklyChange,
  monthlyChange,
}) => {
  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-green-500">
          <ArrowUp className="w-4 h-4 mr-1" />
          <span>{change}%</span>
        </div>
      );
    }
    if (change < 0) {
      return (
        <div className="flex items-center text-red-500">
          <ArrowDown className="w-4 h-4 mr-1" />
          <span>{Math.abs(change)}%</span>
        </div>
      );
    }
    return <span className="text-gray-500">0%</span>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
          <DollarSign className="w-4 h-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(dailySales)}</div>
          <div className="flex items-center pt-1 text-xs">
            {getChangeIndicator(dailyChange)}
            <span className="text-gray-500 ml-2">from yesterday</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-sm font-medium">Weekly Sales</CardTitle>
          <DollarSign className="w-4 h-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(weeklySales)}</div>
          <div className="flex items-center pt-1 text-xs">
            {getChangeIndicator(weeklyChange)}
            <span className="text-gray-500 ml-2">from last week</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
          <DollarSign className="w-4 h-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(monthlySales)}</div>
          <div className="flex items-center pt-1 text-xs">
            {getChangeIndicator(monthlyChange)}
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <Activity className="w-4 h-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{transactionCount}</div>
          <div className="text-xs text-gray-500 pt-1">
            total transactions
          </div>
        </CardContent>
      </Card>
    </div>
  );
};