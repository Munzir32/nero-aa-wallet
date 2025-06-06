import React, { useState } from 'react';
import { ChainType, CHAIN_DETAILS, TokenType, TOKEN_DETAILS } from '../../types/Pos';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface SettingsProps {
  initialSettings: {
    payoutWallet: string;
    supportedChains: ChainType[];
    supportedTokens: TokenType[];
    businessName: string;
    contactEmail: string;
    logoUrl?: string;
    enableOffRamp: boolean;
  };
  onSave: (settings: any) => void;
}

export const SettingsForm: React.FC<SettingsProps> = ({
  initialSettings,
  onSave,
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(settings);
      setIsSaving(false);
    }, 1000);
  };
  
  return (
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
            
            <Input
              label="Logo URL (optional)"
              name="logoUrl"
              value={settings.logoUrl || ''}
              onChange={handleChange}
              placeholder="https://yourbusiness.com/logo.png"
              fullWidth
            />
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
                {Object.entries(CHAIN_DETAILS).map(([key, details]) => (
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
  );
};