import React from 'react';
import { Button } from '../ui/Button';
import { WalletStatus } from '../ui/WalletStatus';
import { useSignature } from '@/hooks';
import { Wallet } from '@/types/Pos';
import { useTheme } from '@/contexts/ThemeContext';

export const Header: React.FC = () => {
  const { AAaddress } = useSignature();
  const { currentTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div 
                className="font-bold text-xl"
                style={{ color: currentTheme.primaryColor }}
              >
                <a href="/">
                  WEB3POS
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <WalletStatus wallet={AAaddress as unknown as Wallet} />
            
            {AAaddress ? (
              
            <>
              <Button 
                variant="ghost" 
                size="sm"
                style={{ 
                  color: currentTheme.primaryColor,
                  borderColor: currentTheme.primaryColor 
                }}
              >
                <a href="/products">
                Products
                </a>
                
              </Button>
              <Button 
              variant="ghost" 
              size="sm"
              style={{ 
                color: currentTheme.primaryColor,
                borderColor: currentTheme.primaryColor 
              }}
            >
              Connected
            </Button>
            </>
            ) : (
              <Button 
                variant="primary" 
                size="sm"
                style={{ 
                  backgroundColor: currentTheme.primaryColor,
                  borderColor: currentTheme.primaryColor 
                }}
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};