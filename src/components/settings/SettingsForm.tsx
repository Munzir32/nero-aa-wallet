import React, { useState } from 'react';
import { ChainType, CHAIN_DETAILS, TokenType, TOKEN_DETAILS } from '../../types/Pos';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { web3POSBusinessDetails } from '@/utils/ipfsUpload';
import { useSignature, useSendUserOp } from '@/hooks';
import POSAbi from "../../contract/abi.json"
import { contractAddress } from '@/contract';
import { Toast } from '../ui/Toast';

interface SettingsProps {
  initialSettings: {
    payoutWallet: string;
    supportedChains: ChainType[];
    supportedTokens: TokenType[];
    businessName: string;
    contactEmail: string;
    enableOffRamp: boolean;
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

  console.log(userOpHash, txStatus, isPolling)

  const { AAaddress } = useSignature();
  const { execute, waitForUserOpResult } = useSendUserOp();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleChainToggle = (chain: ChainType) => {
    setSettings((prev) => {
      const supportedChains = prev.supportedChains.includes(chain)
        ? prev.supportedChains.filter((c) => c !== chain)
        : [...prev.supportedChains, chain];
      
      return {
        ...prev,
        supportedChains,
      };
    });
  };
  
  const handleTokenToggle = (token: TokenType) => {
    setSettings((prev) => {
      const supportedTokens = prev.supportedTokens.includes(token)
        ? prev.supportedTokens.filter((t) => t !== token)
        : [...prev.supportedTokens, token];
      
      return {
        ...prev,
        supportedTokens,
      };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {

      const metaURL = await web3POSBusinessDetails({
        businessName: settings.businessName,
        businessAddress: settings.payoutWallet,
        businessEmail: settings.contactEmail,
        supportedChains: settings.supportedChains,
        supportedTokens: settings.supportedTokens,
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
    }
        
  };
  
  return (
    <>
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            
            {/* <Input
              label="Logo URL (optional)"
              name="logoUrl"
              value={settings.logoUrl || ''}
              onChange={handleChange}
              placeholder="https://yourbusiness.com/logo.png"
              fullWidth
            /> */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </form>

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