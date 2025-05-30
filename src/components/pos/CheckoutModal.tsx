import React, { useState, useEffect } from 'react';
import { CartItem, TokenType, ChainType } from '../../types/Pos';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../ui/Button';
// import { QRCode } from '../ui/QRCode';
import { TokenBadge } from '../ui/TokenBadge';
import { ChainBadge } from '../ui/ChainBadge';
import QRCode from "react-qr-code";
import { X, Copy, CheckCircle, Loader, RefreshCw } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  token: TokenType;
  chain: ChainType;
  walletAddress: string;
}

type PaymentStatus = 'generating' | 'pending' | 'confirmed' | 'failed';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  token,
  chain,
  walletAddress,
}) => {
  const [status, setStatus] = useState<PaymentStatus>('generating');
  const [countdown, setCountdown] = useState(300); 
  const [txHash, setTxHash] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isOpen) return;
    
    // Simulate payment flow
    setStatus('generating');
    
    const generateTimer = setTimeout(() => {
      setStatus('pending');
      
      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Simulate payment (randomly between 5-15 seconds)
      const paymentTimer = setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        
        if (success) {
          setStatus('confirmed');
          setTxHash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
        } else {
          setStatus('failed');
        }
        
        clearInterval(countdownInterval);
      }, Math.random() * 10000 + 5000);
      
      return () => {
        clearTimeout(paymentTimer);
        clearInterval(countdownInterval);
      };
    }, 2000);
    
    return () => {
      clearTimeout(generateTimer);
    };
  }, [isOpen]);
  
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const total = calculateTotal();
  
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Would add toast notification in a real implementation
  };
  
  const renderStatusIndicator = () => {
    switch (status) {
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-700 dark:text-gray-300">Generating payment request...</p>
          </div>
        );
      case 'pending':
        return (
          <div className="flex flex-col items-center">
            <QRCode 
              value={`ethereum:${walletAddress}?amount=${total}&token=${token}`}
              size={240}
              className="mb-4"
            />
            <div className="text-center mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Send exactly
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
                {formatCurrency(total)}
                <TokenBadge token={
                    token === 'USDC' ? '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' :
                    token === 'USDT' ? '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74' :
                    token === 'DAI' ? '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345' :
                    token
                  }  className="ml-2" />
              </div>
              <div className="flex items-center justify-center mt-2">
                <ChainBadge chain={chain} />
              </div>
              
              <div className="mt-4 flex items-center justify-center">
                <span className="text-gray-700 dark:text-gray-300 text-sm mr-2">to:</span>
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono">
                  {walletAddress.substring(0, 10)}...{walletAddress.substring(walletAddress.length - 8)}
                </code>
                <button
                  onClick={() => copyToClipboard(walletAddress)}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center">
              <RefreshCw className="h-5 w-5 text-yellow-500 mr-2 animate-spin" />
              <div>
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  Waiting for payment
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-500">
                  Expires in {formatCountdown(countdown)}
                </p>
              </div>
            </div>
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Confirmed!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your transaction has been successfully processed.
            </p>
            {txHash && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 w-full max-w-md">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Transaction Hash
                </div>
                <div className="flex items-center">
                  <code className="text-xs font-mono text-gray-800 dark:text-gray-300 truncate">
                    {txHash}
                  </code>
                  <button
                    onClick={() => copyToClipboard(txHash)}
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'failed':
        return (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <X className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Failed
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              There was an issue processing your payment.
            </p>
            <Button 
              variant="primary" 
              onClick={() => {
                setStatus('generating');
                setCountdown(300);
                setTxHash(null);
              }}
            >
              Try Again
            </Button>
          </div>
        );
      default:
        return null;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6">
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                Complete Payment
              </h3>
              
              {items.length > 0 && (
                <div className="mt-2 mb-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </div>
                  <div className="max-h-32 overflow-y-auto mb-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                {renderStatusIndicator()}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            {status === 'confirmed' && (
              <Button variant="primary" onClick={onClose}>
                Done
              </Button>
            )}
            {status !== 'confirmed' && status !== 'generating' && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};