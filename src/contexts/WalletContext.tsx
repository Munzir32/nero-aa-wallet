import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Wallet } from '../types/Pos';

interface WalletContextType {
  wallet: Wallet | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const connectWallet = async (): Promise<void> => {
    try {
      // Simulate wallet connection
      console.log('Connecting wallet...');
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock wallet connection success
      setWallet({
        address: '0x1234567890123456789012345678901234567890',
        ensName: 'merchant.eth',
        chainId: 1,
        isConnected: true,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = (): void => {
    console.log('Disconnecting wallet...');
    setWallet(null);
  };

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};