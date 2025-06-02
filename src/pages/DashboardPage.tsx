import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { SalesSummary } from '../components/dashboard/SalesSummary';
// import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ShoppingBag, Wallet } from 'lucide-react';
import { Transaction } from '../types/Pos';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salesData, setSalesData] = useState({
    dailySales: 1250.75,
    weeklySales: 8724.32,
    monthlySales: 32458.90,
    transactionCount: 128,
    dailyChange: 12.5,
    weeklyChange: -3.2,
    monthlyChange: 8.7,
  });
  
  // const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  

  
  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's an overview of your sales.</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button
            variant="primary"
            leftIcon={<ShoppingBag className="h-4 w-4" />}
            onClick={() => navigate('/pos')}
          >
            New Sale
          </Button>
          <Button
            variant="outline"
            leftIcon={<PlusCircle className="h-4 w-4" />}
            onClick={() => navigate('/products')}
          >
            Add Product
          </Button>
          <Button
            variant="outline"
            leftIcon={<PlusCircle className="h-4 w-4" />}
            onClick={() => navigate("/admin/add-merchant")}
          >
            Add Merchant
          </Button>
          <Button
            variant="ghost"
            leftIcon={<Wallet className="h-4 w-4" />}
            onClick={() => navigate('/settings')}
          >
            Withdraw Funds
          </Button>
        </div>
      </div>
      
      <SalesSummary
        dailySales={salesData.dailySales}
        weeklySales={salesData.weeklySales}
        monthlySales={salesData.monthlySales}
        transactionCount={salesData.transactionCount}
        dailyChange={salesData.dailyChange}
        weeklyChange={salesData.weeklyChange}
        monthlyChange={salesData.monthlyChange}
      />
      
      {/* <RecentTransactions transactions={recentTransactions} /> */}
    </Layout>
  );
};