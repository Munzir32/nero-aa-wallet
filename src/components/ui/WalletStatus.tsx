import React from 'react';
import { Wallet } from '../../types';
import { formatAddress } from '../../utils/formatters';
import { cn } from '../../utils/cn';

interface WalletStatusProps {
  wallet: Wallet | null;
  className?: string;
}

export const WalletStatus: React.FC<WalletStatusProps> = ({ wallet, className }) => {
  if (!wallet) {
    return (
      <div className={cn(
        'flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1',
        className
      )}>
        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
        Not connected
      </div>
    );
  }
  
  return (
    <div className={cn(
      'flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1',
      className
    )}>
      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
      {wallet.ensName || formatAddress(wallet.address)}
    </div>
  );
};