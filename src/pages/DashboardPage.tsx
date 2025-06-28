import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { SalesSummary } from '../components/dashboard/SalesSummary';
// import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { ThemedButton } from '../components/ui/ThemedButton';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ShoppingBag, Settings } from 'lucide-react';

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
          <ThemedButton
            variant="primary"
            icon={<ShoppingBag className="h-4 w-4" />}
            iconPosition="left"
            onClick={() => navigate('/pos')}
          >
            New Sale
          </ThemedButton>
          <ThemedButton
            variant="outline"
            icon={<PlusCircle className="h-4 w-4" />}
            iconPosition="left"
            onClick={() => navigate('/products')}
          >
            Add Product
          </ThemedButton>
          <ThemedButton
            variant="outline"
            icon={<PlusCircle className="h-4 w-4" />}
            iconPosition="left"
            onClick={() => navigate("/admin/add-merchant")}
          >
            Add Merchant
          </ThemedButton>
          <ThemedButton
            variant="ghost"
            icon={<Settings className="h-4 w-4" />}
            iconPosition="left"
            onClick={() => navigate('/settings')}
          >
            Settings
          </ThemedButton>
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