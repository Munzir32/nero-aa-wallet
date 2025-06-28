import React, { useState } from 'react';
import { ChainType, CHAIN_DETAILS, TokenType, TOKEN_DETAILS, BUSINESS_THEMES } from '../../types/Pos';
import { Input } from '../ui/Input';
import { ThemedButton } from '../ui/ThemedButton';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { web3POSBusinessDetails } from '@/utils/ipfsUpload';
import { useSignature, useSendUserOp } from '@/hooks';
import POSAbi from "@/contract/abi.json"
import { contractAddress } from '@/contract';
import { Toast } from '../ui/Toast';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsProps {
  initialSettings: {
    payoutWallet: string;
    supportedChains: ChainType[];
    supportedTokens: TokenType[];
    businessName: string;
    contactEmail: string;
    enableOffRamp: boolean;
    businessTheme?: string;
  };
}

export const SettingsForm: React.FC<SettingsProps> = ({
  initialSettings,
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const [showToast, setShowToast] = React.useState(false);

  const [userOpHash, setUserOpHash] = useState<string | null>('');
  const [txStatus, setTxStatus] = useState('');
  const [isPolling, setIsPolling] = useState(false);

  const { AAaddress } = useSignature();
  const { execute, waitForUserOpResult } = useSendUserOp();
  const { setBusinessType, currentTheme, businessType } = useTheme();

  console.log('SettingsForm - Current theme:', currentTheme);
  console.log('SettingsForm - Business type:', businessType);
  console.log('SettingsForm - Settings theme:', settings.businessTheme);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleThemeChange = (theme: string) => {
    setSettings(prev => ({
      ...prev,
      businessTheme: theme,
    }));
    setBusinessType(theme); // Update the current theme immediately
  };
  
  const handleChainToggle = (chain: ChainType) => {
    setSettings(prev => ({
        ...prev,
      supportedChains: prev.supportedChains.includes(chain)
        ? prev.supportedChains.filter(c => c !== chain)
        : [...prev.supportedChains, chain],
    }));
  };
  
  const handleTokenToggle = (token: TokenType) => {
    setSettings(prev => ({
        ...prev,
      supportedTokens: prev.supportedTokens.includes(token)
        ? prev.supportedTokens.filter(t => t !== token)
        : [...prev.supportedTokens, token],
    }));
  };
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const metaURL = await web3POSBusinessDetails({
        businessName: settings.businessName,
        businessAddress: settings.payoutWallet,
        businessEmail: settings.contactEmail,
        supportedChains: settings.supportedChains,
        supportedTokens: settings.supportedTokens,
        businessTheme: settings.businessTheme,
      })

      const resultExecute = await execute({
        function: 'setBusinsessDetails',
        contractAddress: contractAddress, 
        abi: POSAbi,
        params: [
          metaURL
          ],
        value: 0,
      });
      const result = await waitForUserOpResult();
        setUserOpHash(result?.userOpHash);
        setIsPolling(true);
        console.log(result);
    
        if (result.result === true) {
          setTxStatus('Success!');
          setIsPolling(false);
        } else if (result.transactionHash) {
          setTxStatus('Transaction hash: ' + result.transactionHash);
        }
        setShowToast(true);

    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <>
    <div>
      <div className="space-y-6">
        <Card themed>
          <CardHeader themed>
            <CardTitle themed>Business Information</CardTitle>
          </CardHeader>
          <CardContent themed className="space-y-4">
            <Input
              label="Business Name"
              name="businessName"
              value={settings.businessName}
              onChange={handleChange}
              placeholder="Your Business Name"
              fullWidth
            />
            
            <Input
              label="Contact Email"
              name="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={handleChange}
              placeholder="contact@yourbusiness.com"
              fullWidth
            />
          </CardContent>
        </Card>
        
        <Card themed>
          <CardHeader themed>
            <CardTitle themed>Business Theme</CardTitle>
          </CardHeader>
          <CardContent themed className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Choose a theme that matches your business type. This will customize the appearance of your payment interface.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(BUSINESS_THEMES).map(([key, theme]) => (
                <div
                  key={key}
                  className={`
                    border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                    ${settings.businessTheme === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }
                  `}
                  onClick={() => handleThemeChange(key)}
                  style={settings.businessTheme === key ? { borderColor: theme.primaryColor } : {}}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${theme.primaryColor}20` }}
                    >
                      <span className="text-xl">{theme.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {theme.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {key} theme
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {settings.businessTheme && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Selected theme: <span className="font-medium">{BUSINESS_THEMES[settings.businessTheme]?.name}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Current theme: <span className="font-medium">{businessType}</span> - {currentTheme.name}
                </p>
                <div 
                  className="mt-2 w-4 h-4 rounded-full"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card themed>
          <CardHeader themed>
            <CardTitle themed>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent themed className="space-y-4">
            <Input
              label="Payout Wallet Address"
              name="payoutWallet"
              value={settings.payoutWallet}
              onChange={handleChange}
              placeholder="0x..."
              fullWidth
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Supported Chains
              </label>
              <div className="flex flex-wrap gap-2">
              {Object.entries(CHAIN_DETAILS)
                  .filter(([key, details]) => details?.id === 698) // Filter to only include NERO chain
                  .map(([key, details]) => (
                    <div 
                      key={key}
                      className={`
                        border rounded-lg px-3 py-2 cursor-pointer transition-colors
                        ${settings.supportedChains.includes(key as ChainType)
                          ? `bg-${details.color.substring(1)} bg-opacity-10 border-${details.color.substring(1)} text-${details.color.substring(1)}`
                          : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                        }
                      `}
                      onClick={() => handleChainToggle(key as ChainType)}
                    >
                      <div className="flex items-center">
                        <span 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: details.color }}
                        ></span>
                        {details.name}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Supported Tokens
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(TOKEN_DETAILS).map(([key, details]) => (
                  <div 
                    key={key}
                    className={`
                      border rounded-lg px-3 py-2 cursor-pointer transition-colors
                      ${settings.supportedTokens.includes(key as TokenType)
                        ? `bg-${details.color.substring(1)} bg-opacity-10 border-${details.color.substring(1)} text-${details.color.substring(1)}`
                        : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                      }
                    `}
                    onClick={() => handleTokenToggle(key as TokenType)}
                  >
                    <div className="flex items-center">
                      {details.symbol}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="enableOffRamp"
                name="enableOffRamp"
                type="checkbox"
                checked={settings.enableOffRamp}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="enableOffRamp" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable off-ramp to fiat (coming soon)
              </label>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <ThemedButton
            onClick={handleSubmit}
            variant="primary"
            loading={isSaving}
          >
            Save Settings
          </ThemedButton>
        </div>
      </div>
    </div>

    <Toast
        type="success"
        message="Settings saved successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
    
    </>
  );
};