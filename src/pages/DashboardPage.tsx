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
  
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    // Simulated data loading
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        items: [{ id: 'p1', name: 'Product 1', price: 99.99, token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed', quantity: 1, createdAt: Date.now() }],
        total: 99.99,
        token: 'USDC',
        hash: "ox",
        chain: 'ethereum',
        status: 'confirmed',
        txHash: '0x1234567890abcdef',
        timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
      },
      {
        id: '2',
        items: [{ id: 'p2', name: 'Product 2', price: 149.99, token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed', quantity: 2, createdAt: Date.now() }],
        total: 299.98,
        token: 'USDT',
        hash: "ox",
        chain: 'polygon',
        status: 'confirmed',
        txHash: '0xabcdef1234567890',
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
      },
      {
        id: '3',
        items: [{ id: 'p3', name: 'Product 3', price: 199.99, token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed', quantity: 1, createdAt: Date.now() }],
        total: 199.99,
        token: 'DAI',
        hash: "ox",
        chain: 'base',
        status: 'pending',
        timestamp: Date.now() - 1000 * 60 * 10, // 10 minutes ago
      },
      {
        id: '4',
        items: [{ id: 'p4', name: 'Product 4', price: 49.99, token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed', quantity: 3, createdAt: Date.now() }],
        total: 149.97,
        token: 'USDC',
        hash: "ox",
        chain: 'ethereum',
        status: 'confirmed',
        txHash: '0xfedcba0987654321',
        timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
      },
      {
        id: '5',
        items: [{ id: 'p5', name: 'Product 5', price: 299.99, token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed', quantity: 1, createdAt: Date.now() }],
        total: 299.99,
        token: 'USDT',
        hash: "ox",
        chain: 'optimism',
        status: 'failed',
        timestamp: Date.now() - 1000 * 60 * 45, // 45 minutes ago
      },
    ];
    
    setRecentTransactions(mockTransactions);
  }, []);
  
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