import React, { useState, useEffect } from 'react';
import { CartItem, TokenType, ChainType } from '../../types/Pos';
import { formatCurrency } from '../../utils/formatters';
import { ThemedButton } from '../ui/ThemedButton';
// import { QRCode } from '../ui/QRCode';
import { TokenBadge } from '../ui/TokenBadge';
import { ChainBadge } from '../ui/ChainBadge';
import QRCode from "react-qr-code";
import { X, Copy, CheckCircle, Loader, RefreshCw } from 'lucide-react';
import { useSendUserOp } from '@/hooks';
import POSAbi from "../../contract/abi.json"
import { contractAddress } from '@/contract';

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
  const [isPaymentClicked, setIsPaymentClicked] = useState(false);
  const [address, setAddress] = useState<string>('')
  const [userOpHash, setUserOpHash] = useState<string | null>('');

  const [txStatus, setTxStatus] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  console.log( txStatus, isPolling)

  const { execute, waitForUserOpResult } = useSendUserOp();

  
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
            if (!isPaymentClicked) {
              setStatus('failed');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      
      
      // Simulate payment (randomly between 5-15 seconds)
      const paymentTimer = setTimeout(() => {
        if (isPaymentClicked) {
          const success = Math.random() > 0.2; // 80% success rate
          
          if (success) {
            setStatus('confirmed');
            setTxHash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
          } else {
            setStatus('failed');
          }
        } else {
          setStatus('failed');
        }
        
        clearInterval(countdownInterval);
      }, 120000); // 2 minutes
      
      return () => {
        clearTimeout(paymentTimer);
        clearInterval(countdownInterval);
      };
    }, 2000);
    
    return () => {
      clearTimeout(generateTimer);
    };
  }, [isOpen, isPaymentClicked]);
  
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getId = () => {
    items.forEach((item) => {
      console.log(item.id.toString()); // Access item.id here
    });
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
  
  const isPaymentConfirm = async () => {
    try {
      const itemIds = items.map((item) => item.id);
      
      const quatity = items.map((item) => item.quantity);
      const resultExcute = await execute({
        function: 'acceptPurchaseProduct',
        contractAddress: contractAddress,
        abi: POSAbi,
        params: [itemIds.toString(), quatity, itemIds.toString()],
        value: 0,
      });

      const result = await waitForUserOpResult();
      setUserOpHash(result?.userOpHash);
      setIsPolling(true);
      console.log(result);

      if (result.result === true) {
        setTxStatus('Success!');
        setStatus('confirmed');
        setIsPolling(false);
      } else if (result.transactionHash) {
        setTxStatus('Transaction hash: ' + result.transactionHash);
      }
      setIsPaymentClicked(true);
      setAddress('');
    } catch (error) {
      console.log(error);
      setStatus('failed');
    }
  };

  const itemIds = items.map(item => item.id).join(',');
  const itemId = items.map(item => item.id).join(',');
  console.log(itemIds, "ids")
  const paymentLink = import.meta.env.VITE_DEV_MODE === 'true' 
  ? `http://localhost:5173/payment/${total}/${itemIds}` 
  : `https://web3pos.vercel.app/payment/${total}`;
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
              value={paymentLink}
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
                <ChainBadge size='sm' />
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
              <div className="flex items-center justify-center mt-4">
                  <input
                    type="text"
                    name="Wallet Address"
                    id="wallet" onChange={(e) => setAddress(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 py-4 px-2 rounded text-xs font-mono"
                    placeholder="Enter Wallet Address"
                  />
                  <button
                    onClick={isPaymentConfirm}
                    className="ml-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  >
                    Confirm Payment
                  </button>

                </div>
                <button onClick={getId}>GetId</button>

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
            <ThemedButton 
              variant="primary" 
              onClick={() => {
                setStatus('generating');
                setCountdown(300);
                setTxHash(null);
              }}
            >
              Try Again
            </ThemedButton>
          </div>
        );
      default:
        return null;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Checkout</h2>
                <ThemedButton
                  variant="ghost"
                  size="sm"
                  icon={<X className="h-5 w-5" />}
                  onClick={onClose}
                >
                  Close
                </ThemedButton>
              </div>
              
              {renderStatusIndicator()}
              
              {status === 'pending' && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Time remaining:</span>
                    <span className="font-mono">{formatCountdown(countdown)}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <ThemedButton
                      variant="outline"
                      fullWidth
                      icon={<Copy className="h-4 w-4" />}
                      iconPosition="left"
                      onClick={() => copyToClipboard(paymentLink)}
                    >
                      Copy Link
                    </ThemedButton>
                    <ThemedButton
                      variant="primary"
                      fullWidth
                      onClick={isPaymentConfirm}
                    >
                      Confirm Payment
                    </ThemedButton>
                  </div>
                </div>
              )}
              
              {status === 'confirmed' && (
                <div className="mt-6">
                  <ThemedButton
                    variant="outline"
                    fullWidth
                    onClick={onClose}
                  >
                    Close
                  </ThemedButton>
                </div>
              )}
              
              {status === 'failed' && (
                <div className="mt-6 space-y-4">
                  <p className="text-red-600 dark:text-red-400 text-center">
                    Payment failed or timed out. Please try again.
                  </p>
                  <div className="flex space-x-2">
                    <ThemedButton
                      variant="outline"
                      fullWidth
                      onClick={onClose}
                    >
                      Close
                    </ThemedButton>
                    <ThemedButton
                      variant="primary"
                      fullWidth
                      icon={<RefreshCw className="h-4 w-4" />}
                      iconPosition="left"
                      onClick={() => {
                        setStatus('generating');
                        setCountdown(300);
                        setIsPaymentClicked(false);
                      }}
                    >
                      Try Again
                    </ThemedButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};