import React, { useState, useEffect } from 'react';
import { ChainType, TokenType, CartItem, Token } from '../types/Pos';
import { Button } from '../components/ui/Button';
import { QRCode } from '../components/ui/QRCode';
import { TokenBadge } from '../components/ui/TokenBadge';
import { ChainBadge } from '../components/ui/ChainBadge';
import { formatCurrency } from '../utils/formatters';
import { Wallet, AlertCircle, CheckCircle, Clock3 } from 'lucide-react';

// This is a customer-facing checkout page for online orders
export const CheckoutPage: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState<'initial' | 'connecting' | 'pending' | 'confirmed' | 'failed'>('initial');
  const [selectedChain] = useState<ChainType>('ethereum');
  const [selectedToken] = useState<Token>('0xC86Fed58edF0981e927160C50ecB8a8B05B32fed');
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  useEffect(() => {
    // Simulate cart items (in a real app these would come from URL params or context)
    const mockCartItems: CartItem[] = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description of product 1',
        price: 49.99,
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        quantity: 2,
        createdAt: Date.now(),
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description of product 2',
        price: 29.99,
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        quantity: 1,
        createdAt: Date.now(),
      },
    ];
    
    setCartItems(mockCartItems);
  }, []);
  
  useEffect(() => {
    if (paymentStatus === 'pending') {
      // Start countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Simulate payment completion after random time
      const timeout = setTimeout(() => {
        // 80% chance of success
        const success = Math.random() > 0.2;
        setPaymentStatus(success ? 'confirmed' : 'failed');
        clearInterval(interval);
      }, Math.random() * 10000 + 5000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [paymentStatus]);
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const total = calculateTotal();
  
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleConnectWallet = () => {
    setPaymentStatus('connecting');
    
    // Simulate wallet connection delay
    setTimeout(() => {
      setPaymentStatus('pending');
    }, 1500);
  };
  
  const getStatusContent = () => {
    switch (paymentStatus) {
      case 'initial':
        return (
          <div className="mt-8 flex flex-col items-center">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Wallet className="h-5 w-5" />}
              onClick={handleConnectWallet}
            >
              Connect Wallet to Pay
            </Button>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Connect your wallet to complete this purchase
            </p>
          </div>
        );
      
      case 'connecting':
        return (
          <div className="mt-8 flex flex-col items-center">
            <div className="animate-pulse flex flex-col items-center">
              <Wallet className="h-12 w-12 text-blue-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Connecting to your wallet...
              </p>
            </div>
          </div>
        );
      
      case 'pending':
        return (
          <div className="mt-8 flex flex-col items-center">
            <QRCode
              value={`ethereum:0xPaymentAddress?amount=${total}&token=${selectedToken}`}
              size={240}
              className="mb-6"
            />
            
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Send exactly
              </p>
              <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
                {formatCurrency(total)}
                <TokenBadge token={
                  selectedToken === '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' ? '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' :
                  selectedToken === '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74' ? '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74' :
                  selectedToken === '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345' ? '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345' :
                  selectedToken || '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' // Fallback to USDC 
                } className="ml-2" />
              </div>
            </div>
            
            <div className="w-full max-w-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center">
              <Clock3 className="h-6 w-6 text-yellow-500 mr-3 animate-pulse" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-400">
                  Waiting for payment
                </h3>
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  This window will update automatically. Expires in {formatCountdown(countdown)}
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'confirmed':
        return (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Your transaction has been confirmed. Thank you for your purchase!
            </p>
            
            <div className="w-full max-w-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-400">
                Transaction Hash: <span className="font-mono">0x123...abc</span>
              </p>
            </div>
            
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => window.location.href = '/'}
            >
              Return to Store
            </Button>
          </div>
        );
      
      case 'failed':
        return (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Failed
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              There was an issue processing your payment. Please try again.
            </p>
            
            <Button
              variant="primary"
              onClick={() => setPaymentStatus('initial')}
            >
              Try Again
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complete Your Purchase</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {item.name} <span className="text-gray-500 dark:text-gray-400">x{item.quantity}</span>
                    </p>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(total)}
                </span>
              </div>
              
              <div className="mt-2 flex items-center justify-end space-x-2">
                <TokenBadge token={selectedToken} />
                <ChainBadge />
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {getStatusContent()}
          </div>
        </div>
      </div>
    </div>
  );
};