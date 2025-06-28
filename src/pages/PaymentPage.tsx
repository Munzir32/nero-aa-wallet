import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { useReadProduct } from '@/hooks/pos/useReadProduct';
import { TokenBadge } from '@/components/ui/TokenBadge';
import { useSendUserOp } from '@/hooks';
import POSAbi from "../contract/abi.json";
import { contractAddress } from '@/contract';
import { Product, BUSINESS_THEMES } from '@/types/Pos';
import { ethers } from 'ethers';
import erc20 from "../abis/ERC20/ERC20.json"
import { useWriteContract, useAccount } from 'wagmi';
import { useEthersSigner, useConfig } from '@/hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedCard } from '@/components/ui/ThemedCard';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedHeader } from '@/components/ui/ThemedHeader';
import { ThemedStatus } from '@/components/ui/ThemedStatus';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

export const PaymentPage: React.FC = () => {
  const { total, id } = useParams<{ total: string, id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [userOpHash, setUserOpHash] = useState<string | null>('');

  const [txStatus, setTxStatus] = useState('');
  const { tokenPaymaster } = useConfig();
  const { currentTheme } = useTheme();

  const signer = useEthersSigner();

  const { execute, executeBatch, waitForUserOpResult } = useSendUserOp();
  const { posproduct } = useReadProduct(id || '');
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();

  const contract = new ethers.Contract(contractAddress, POSAbi, signer)

  // Fetch product details
  useEffect(() => {
    if (posproduct && Array.isArray(posproduct)) {
      setProduct({
        id: posproduct[0],
        url: posproduct[1],
        price: Number(posproduct[2]),
        token: posproduct[3],
        merchant: posproduct[4],
        active: Boolean(posproduct[5]),
        totalSales: Number(posproduct[6]),
        createdAt: Number(posproduct[7]),
        businessType: 'market', // Default to market, can be made dynamic
      });
    }
  }, [posproduct]);

  // Get business theme
  const businessType = product?.businessType || 'market';
  const theme = BUSINESS_THEMES[businessType];

  console.log(posproduct)

  const erc20Interface = new ethers.utils.Interface([
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)'
  ]);
  console.log(address, "addres")

  // Handle payment
  const handlePayment = async () => {
    if (!product) return;
    setIsPaying(true);

    try {
      // Parse the total amount to the correct token units
      // USDC has 6 decimals, so 1 USDC = 1000000 units
      const tokenDecimals = 19; // USDC decimals
      const parsedAmount = ethers.utils.parseUnits(total || '0', tokenDecimals);
      
      console.log('Original total:', total);
      console.log('Parsed amount:', parsedAmount.toString());
      console.log('Product token:', product.token);
      console.log('Product price from contract:', product.price);
      
      const quantity = parsedAmount.div(product.price);
      console.log('Calculated quantity:', quantity.toString());
      
      // Generate a unique order ID
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const batchOperations = [
        {
          function: 'approve',
          contractAddress: product.token,
          abi: erc20,
          params: [contractAddress, parsedAmount],
          value: 0,
        },
        {
        function: 'purchaseProduct',
        contractAddress: contractAddress,
        abi: POSAbi,
          params: [product.id, quantity, orderId],
        value: 0,
        }
      ];

      const batchResult = await executeBatch(batchOperations);

      // Wait for the batch transaction to be confirmed
      const batchConfirmation = await waitForUserOpResult();
      setUserOpHash(batchConfirmation?.userOpHash);
        setIsPolling(true);
      console.log('Batch confirmation:', batchConfirmation);
  
      if (batchConfirmation && batchConfirmation.result === true) {
        setTxStatus('Payment successful!');
          setIsPolling(false);
      } else if (batchConfirmation && batchConfirmation.transactionHash) {
        setTxStatus('Transaction hash: ' + batchConfirmation.transactionHash);
      } else {
        setTxStatus('Payment transaction failed or timed out');
        setIsPolling(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred during payment.');
    } finally {
      setIsPaying(false);
    }
  };

  if (!product) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <ThemedCard variant="elevated" padding="lg" className="mb-6">
          <ThemedHeader
            title="Payment"
            subtitle="Complete your purchase securely"
            showBusinessIcon={true}
            size="lg"
          />
        </ThemedCard>
        
        {/* Transaction Status */}
        {txStatus && (
          <ThemedCard className="mb-6">
            <ThemedStatus
              type={
                txStatus.includes('Success') ? 'success' :
                txStatus.includes('failed') ? 'error' :
                txStatus.includes('Processing') ? 'loading' : 'info'
              }
              message={txStatus}
              onClose={() => setTxStatus('')}
            />
          </ThemedCard>
        )}
        
        {/* Payment Details */}
        <ThemedCard variant="outlined" className="mb-6">
        <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Product:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {product?.url || `Product #${product?.id}`}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Price:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {total} USDC
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Token:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                USDC
              </span>
          </div>
            
            {userOpHash && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Transaction:</span>
                <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                  {userOpHash.substring(0, 10)}...{userOpHash.substring(userOpHash.length - 8)}
                </span>
          </div>
            )}
          </div>
        </ThemedCard>
        
        {/* Action Button */}
        <ThemedButton
            onClick={handlePayment}
          loading={isPaying}
          disabled={isPaying || isPolling}
            fullWidth
          size="lg"
          variant="primary"
        >
          {isPaying ? 'Processing Payment...' : isPolling ? 'Confirming Transaction...' : 'Pay Now'}
        </ThemedButton>
        
        {/* Loading Indicator */}
        {isPolling && (
          <ThemedCard className="mt-6 text-center">
            <ThemedStatus
              type="loading"
              message="Transaction is being processed on the blockchain..."
              showIcon={true}
            />
          </ThemedCard>
        )}
      </div>
    </Layout>
  );
};