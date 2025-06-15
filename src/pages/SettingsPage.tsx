import React from 'react';
import { Layout } from '../components/layout/Layout';
import { SettingsForm } from '../components/settings/SettingsForm';
import { ChainType, TokenType } from '../types/Pos';
import { Toast } from '../components/ui/Toast';

export const SettingsPage: React.FC = () => {
  const [showToast, setShowToast] = React.useState(false);
  
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
  
  const handleSaveSettings = (settings: any) => {
    console.log('Saving settings:', settings);
    
    // Show success toast
    setShowToast(true);
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure your merchant account</p>
      </div>
      
      <SettingsForm 
        initialSettings={initialSettings}
        onSave={handleSaveSettings}
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