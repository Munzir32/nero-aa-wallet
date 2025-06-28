import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { Transaction, ChainType, Token } from '../types/Pos';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ThemedInput } from '../components/ui/ThemedInput';
import {  Search, Filter, Calendar } from 'lucide-react';
import { TransactionRow } from '@/components/transactions/TransactionRow';
import { useReadTransactionLen, useReadTransaction } from '@/hooks/pos/useReadProduct';
import { TransactionInfo } from '../types/Pos';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tokenFilter, setTokenFilter] = useState<string>('all');
  const [chainFilter, setChainFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [txlen, setTxlen] = useState<Map<string, string>>(new Map())
  const { posTransactionLen } = useReadTransactionLen();
 

  const getPOSTransaction = useCallback(() => {
    try {
      if (!posTransactionLen) {
        console.log("productLen is undefined or null");
        return;
      }

      const newMap = new Map<string, string>();
      if (typeof posTransactionLen === 'bigint' && posTransactionLen > 0) {
        for (let i = 1; i < posTransactionLen; i++) {
          newMap.set(i.toString(), i.toString()); 
        }
        setTxlen(new Map(newMap));
      } else {
        console.log("posTransactionLen isn't valid bigint:", posTransactionLen);
      }
    } catch (error) {
      console.error("Error setting employee IDs:", error);
    }
  }, [posTransactionLen])

  useEffect(() => {
    getPOSTransaction()
  }, [posTransactionLen, getPOSTransaction])
  console.log(txlen, "txlen")

  
  // useEffect(() => {
  //   // Simulated transaction data
  //   const mockTransactions: Transaction[] = Array(20).fill(null).map((_, index) => {
  //     const tokens: Token[] = [
  //       '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
  //       '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74',
  //       '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345'
  //     ];
  //     const chains: ChainType[] = ['ethereum', 'nero', 'base', 'optimism', 'arbitrum'];
  //     const statuses: ('pending' | 'confirmed' | 'failed')[] = ['pending', 'confirmed', 'failed'];
  //     const hash = "ox"
  //     const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
  //     const randomChain = chains[Math.floor(Math.random() * chains.length)];
  //     const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  //     const randomAmount = Math.floor(Math.random() * 50000) / 100;
  //     const randomTimestamp = Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30); // Up to 30 days ago
      
  //     return {
  //       id: `tx${index + 1}`,
  //       items: [{ 
  //         id: `p${index + 1}`, 
  //         name: `Product ${index + 1}`, 
  //         price: randomAmount, 
  //         token: randomToken, 
  //         quantity: Math.floor(Math.random() * 5) + 1,
  //         createdAt: randomTimestamp
  //       }],
  //       total: randomAmount.toString(),
  //       hash: "0x",
  //       token: randomToken,
  //       chain: randomChain,
  //       status: randomStatus,
  //       txHash: randomStatus === 'confirmed' ? `0x${Math.random().toString(16).substring(2, 42)}` : undefined,
  //       timestamp: randomTimestamp,
  //       customerWallet: `0x${Math.random().toString(16).substring(2, 42)}`,
  //     };
  //   });
    
  //   // Sort by timestamp (newest first)
  //   mockTransactions.sort((a, b) => b.timestamp - a.timestamp);
    
  //   setTransactions(mockTransactions);
  //   setFilteredTransactions(mockTransactions);
  // }, []);
  
  // useEffect(() => {
  //   let filtered = [...transactions];
    
  //   // Apply search filter
  //   if (searchTerm) {
  //     filtered = filtered.filter(
  //       tx => 
  //         tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         (tx.customerWallet && tx.customerWallet.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //         (tx.txHash && tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()))
  //     );
  //   }
    
  //   // Apply status filter
  //   if (statusFilter !== 'all') {
  //     filtered = filtered.filter(tx => tx.status === statusFilter);
  //   }
    
  //   // Apply token filter
  //   if (tokenFilter !== 'all') {
  //     filtered = filtered.filter(tx => tx.token === tokenFilter);
  //   }
    
  //   // Apply chain filter
  //   if (chainFilter !== 'all') {
  //     filtered = filtered.filter(tx => tx.chain === chainFilter);
  //   }
    
  //   // Apply date filter
  //   if (dateFilter !== 'all') {
  //     const now = Date.now();
  //     let cutoffTime: number;
      
  //     switch (dateFilter) {
  //       case 'today':
  //         cutoffTime = now - (24 * 60 * 60 * 1000);
  //         break;
  //       case 'week':
  //         cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
  //         break;
  //       case 'month':
  //         cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
  //         break;
  //       default:
  //         cutoffTime = 0;
  //     }
      
  //     filtered = filtered.filter(tx => tx.timestamp >= cutoffTime);
  //   }
    
  //   setFilteredTransactions(filtered);
  // }, [searchTerm, statusFilter, tokenFilter, chainFilter, dateFilter, transactions]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Confirmed</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Failed</span>;
      default:
        return null;
    }
  };
  
  const getEtherscanLink = (chain: string, txHash: string) => {
    // This is a placeholder - in a real implementation, you would map the chain to its explorer URL
    return `https://etherscan.io/tx/${txHash}`;
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <p className="text-gray-600 dark:text-gray-400">View and manage your transaction history</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ThemedInput
              placeholder="Search by ID, wallet, or hash..."
              value={searchTerm}
              onChange={setSearchTerm}
              icon={<Search className="h-5 w-5" />}
              iconPosition="left"
              fullWidth
            />
            
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Filter className="h-4 w-4 inline mr-1" /> Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Filter className="h-4 w-4 inline mr-1" /> Token
              </label>
              <select
                value={tokenFilter}
                onChange={(e) => setTokenFilter(e.target.value)}
                className="rounded-lg border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
              >
                <option value="all">All Tokens</option>
                <option value="0xC86Fed58edF0981e927160C50ecB8a8B05B32fed">USDC</option>
                <option value="0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74">USDT</option>
                <option value="0x5d0E342cCD1aD86a16BfBa26f404486940DBE345">DAI</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" /> Date
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="rounded-lg border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Last 24 Hours</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Token
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Chain
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {txlen?.size === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No transactions found matching your filters.
                </td>
              </tr>
            ) : (

              <>
              {[...txlen.entries()].map(([key, value]) => (
                    <TransactionRow 
                  key={key} 
                  id={value}
                />
                  ))}
              </>
              
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};