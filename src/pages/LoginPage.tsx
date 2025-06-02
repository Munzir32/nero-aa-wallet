import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useWallet } from '../contexts/WalletContext';
import { Button } from '../components/ui/Button';
import { ChainBadge } from '../components/ui/ChainBadge';
import { Wallet, LogIn } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useSignature } from '@/hooks';

export const LoginPage: React.FC = () => {
  // const { wallet, connectWallet } = useWallet();
  // const { isConnected, address} = useAccount()
  const { AAaddress } = useSignature()
  const navigate = useNavigate();
  
  // Redirect to dashboard if already connected
  React.useEffect(() => {
    if (AAaddress) {
      navigate('/dashboard');
    }
  }, [navigate, AAaddress]);
  
  const handleConnect = async () => {
    // await connectWallet();
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Web3POS</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Accept crypto payments for your business</p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <Button
              variant="primary"
              fullWidth
              size="lg"
              leftIcon={<Wallet className="h-5 w-5" />}
              onClick={handleConnect}
            >
              Connect with MetaMask
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              size="lg"
              leftIcon={<LogIn className="h-5 w-5" />}
              onClick={handleConnect}
            >
              Connect with WalletConnect
            </Button>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Supported Networks
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <ChainBadge size='sm' />
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          <p>By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};