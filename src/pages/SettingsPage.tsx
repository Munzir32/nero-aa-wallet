import React, { useCallback, useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { SettingsForm } from '../components/settings/SettingsForm';
import { ChainType, TokenType } from '../types/Pos';
import { Toast } from '../components/ui/Toast';
import POSAbi from "../contract/abi.json";
import { contractAddress } from '@/contract';
import { useSignature } from '@/hooks';
import { useReadContract } from 'wagmi';
import { fetchIPFSData } from '@/utils/IpfsDataFetch';


interface Settings {
  businessName: string;
  payoutWallet: string;
  contactEmail: string;
  supportedChains: ChainType[];
  supportedTokens: TokenType[];
  enableOffRamp: boolean; // Add this line

}


export const SettingsPage: React.FC = () => {
  const [showToast, setShowToast] = React.useState(false);
  const [setBusiness, setSetBusiness] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { AAaddress } = useSignature();

  const { data: BussinessDetails } = useReadContract({
    address: contractAddress,
    abi: POSAbi,
    functionName: "businessProfile",
    args: [AAaddress],
  });

  const fetchProductIPFSDetails = useCallback(async () => {
    if (!BussinessDetails || !Array.isArray(BussinessDetails)) {
      setIsLoading(false); // Stop loading if no data
      return;
    }
    if (!BussinessDetails[1]) {
      setIsLoading(false); // Stop loading if no URL
      return;
    }

    try {
      const data = await fetchIPFSData(BussinessDetails[1]);
      console.log(data, "Fetched Data");

      const mappedData: Settings = {
        businessName: data.businessName || 'My Web3 Store',
        payoutWallet: data.payoutWallet || '0x1234567890123456789012345678901234567890',
        contactEmail: data.contactEmail || 'contact@web3store.com',
        supportedChains: data.supportedChains || ['nero'],
        supportedTokens: data.supportedTokens || ['USDC', 'USDT', 'DAI'],
        enableOffRamp: data.enableOffRamp || false,
      };

      console.log(mappedData, "Mapped Data");
      setSetBusiness(mappedData);
    } catch (error) {
      console.error('Error while fetching details:', error);
    } finally {
      setIsLoading(false); // Stop loading after fetch completes
    }
  }, [BussinessDetails]);

  useEffect(() => {
    fetchProductIPFSDetails();
  }, [fetchProductIPFSDetails, BussinessDetails]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  const initialSettings = {
    payoutWallet: '0x1234567890123456789012345678901234567890',
    // supportedChains: ['ethereum', 'nero', 'base', 'optimism', 'arbitrum'] as ChainType[],
    supportedChains: ['nero'] as ChainType[],
    supportedTokens: ['USDC', 'USDT', 'DAI'] as TokenType[],
    businessName: 'My Web3 Store',
    contactEmail: 'contact@web3store.com',
    logoUrl: '',
    enableOffRamp: false,
  };


  
  

  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure your merchant account</p>
      </div>
      
      <SettingsForm 
        initialSettings={setBusiness || {
          payoutWallet: '0x1234567890123456789012345678901234567890',
          supportedChains: ['nero'] as ChainType[],
          supportedTokens: ['USDC', 'USDT', 'DAI'] as TokenType[],
          businessName: 'My Web3 Store',
          contactEmail: 'contact@web3store.com',
          enableOffRamp: false,
        }}
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