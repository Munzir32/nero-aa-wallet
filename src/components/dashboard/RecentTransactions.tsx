import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TokenBadge } from '../ui/TokenBadge';
import { ChainBadge } from '../ui/ChainBadge';
import { ExternalLink } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
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
    <Card className="mt-6">
      <CardHeader className="py-4">
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3">Date</th>
                <th scope="col" className="px-4 py-3">Amount</th>
                <th scope="col" className="px-4 py-3">Token</th>
                <th scope="col" className="px-4 py-3">Chain</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                  <td colSpan={6} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <td className="px-4 py-3">{formatDate(transaction.timestamp)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {formatCurrency(transaction.total)}
                    </td>
                    <td className="px-4 py-3">
                      <TokenBadge token={transaction.token} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <ChainBadge chain={transaction.chain} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-4 py-3">
                      {transaction.txHash && (
                        <a 
                          href={getEtherscanLink(transaction.chain, transaction.txHash)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                        >
                          View <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};