import React, { useCallback, useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { SettingsForm } from '../components/settings/SettingsForm';
import { ChainType, TokenType } from '../types/Pos';
import { Toast } from '../components/ui/Toast';
import { ThemedButton } from '../components/ui/ThemedButton';
import { IoArrowBack } from 'react-icons/io5';
import POSAbi from "@/contract/abi.json";
import { contractAddress } from '@/contract';
import { useSignature } from '@/hooks';
import { useReadContract } from 'wagmi';
import { fetchIPFSData } from '@/utils/IpfsDataFetch';
import { useScreenManager } from '@/hooks';
import { screens } from '@/types';

interface Settings {
  businessName: string;
  payoutWallet: string;
  contactEmail: string;
  supportedChains: ChainType[];
  supportedTokens: TokenType[];
  enableOffRamp: boolean;
  businessTheme: string;
}

export const SettingsPage: React.FC = () => {
  const [showToast, setShowToast] = React.useState(false);
  const [businessSettings, setBusinessSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { AAaddress } = useSignature();
  const { navigateTo } = useScreenManager();

  const { data: BusinessDetails } = useReadContract({
    address: contractAddress,
    abi: POSAbi,
    functionName: "businessProfile",
    args: [AAaddress],
  });

  const fetchBusinessIPFSDetails = useCallback(async () => {
    if (!BusinessDetails || !Array.isArray(BusinessDetails)) {
      setIsLoading(false);
      return;
    }
    if (!BusinessDetails[1]) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchIPFSData(BusinessDetails[1]);

      const mappedData: Settings = {
        businessName: data.businessName || 'My Web3 Store',
        payoutWallet: data.businessAddress || AAaddress || '0x1234567890123456789012345678901234567890',
        contactEmail: data.businessEmail || 'contact@web3store.com',
        supportedChains: data.supportedChains || ['nero'],
        supportedTokens: data.supportedTokens || ['USDC', 'USDT', 'DAI'],
        enableOffRamp: data.enableOffRamp || false,
        businessTheme: data.businessTheme || 'market',
      };

      setBusinessSettings(mappedData);
    } catch (error) {
      // Set default settings on error
      setBusinessSettings({
        businessName: 'My Web3 Store',
        payoutWallet: AAaddress || '0x1234567890123456789012345678901234567890',
        contactEmail: 'contact@web3store.com',
        supportedChains: ['nero'],
        supportedTokens: ['USDC', 'USDT', 'DAI'],
        enableOffRamp: false,
        businessTheme: 'market',
      });
    } finally {
      setIsLoading(false);
    }
  }, [BusinessDetails, AAaddress]);

  useEffect(() => {
    fetchBusinessIPFSDetails();
  }, [fetchBusinessIPFSDetails]);

  // Default settings if no data is loaded
  const defaultSettings: Settings = {
    businessName: 'My Web3 Store',
    payoutWallet: AAaddress || '0x1234567890123456789012345678901234567890',
    contactEmail: 'contact@web3store.com',
    supportedChains: ['nero'],
    supportedTokens: ['USDC', 'USDT', 'DAI'],
    enableOffRamp: false,
    businessTheme: 'market',
  };

  const handleBackClick = () => {
    navigateTo(screens.SETTING);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <ThemedButton
            variant="ghost"
            onClick={handleBackClick}
            className="mr-3 p-2"
          >
            <IoArrowBack size={20} />
          </ThemedButton>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure your merchant account</p>
          </div>
        </div>
      </div>
      
      <SettingsForm 
        initialSettings={businessSettings || defaultSettings}
      />
      
      <Toast
        type="success"
        message="Settings saved successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      /> 
    </Layout>
  );
};