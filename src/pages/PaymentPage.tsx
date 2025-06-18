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
import { Product } from '@/types/Pos';
import { ethers } from 'ethers';
import erc20 from "../abis/ERC20/ERC20.json"
import { useWriteContract, useAccount } from 'wagmi';

export const PaymentPage: React.FC = () => {
  const { total, id } = useParams<{ total: string, id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [userOpHash, setUserOpHash] = useState<string | null>('');

  const [txStatus, setTxStatus] = useState('');

  const { execute, waitForUserOpResult } = useSendUserOp();
  const { posproduct } = useReadProduct(id || '');
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();

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
      });
    }
  }, [posproduct]);
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
      // Step 1: Approve the contract to spend tokens
      // const approveResult = await execute({
      //   function: 'approve',
      //   contractAddress: product.token,
      //   abi: erc20,
      //   params: [contractAddress, total],
      //   value: 0,
      // });
      

      // // Wait for the approval transaction to be confirmed
      // const approveConfirmation = await waitForUserOpResult();
      // setUserOpHash(approveConfirmation?.userOpHash);
      // setIsPolling(true);
      // if (approveConfirmation?.result == true) {
        
      // }

      // Step 2: Execute the purchaseProduct transaction
      const purchaseResult = await execute({
        function: 'purchaseProduct',
        contractAddress: contractAddress,
        abi: POSAbi,
        params: [product.id, total, product.token],
        value: 0,
      });

      // Wait for the purchase transaction to be confirmed
      const purchaseConfirmation = await waitForUserOpResult();
        setUserOpHash(purchaseConfirmation?.userOpHash);
        setIsPolling(true);
        console.log(purchaseConfirmation);
  
        if (purchaseConfirmation.result === true) {
          setTxStatus('Success!');
          setIsPolling(false);
        } else if (purchaseConfirmation.transactionHash) {
          setTxStatus('Transaction hash: ' + purchaseConfirmation.transactionHash);
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
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payment</h1>
        <div className="space-y-4">
          <div className="text-lg font-medium text-gray-900 dark:text-white">
            {/* Product: {product.url} */}
          </div>
          <div className="text-lg text-gray-700 dark:text-gray-300">
            Price:  {total}
             {/* {formatCurrency(product.price)} */}
          </div>
          <div className="text-lg text-gray-700 dark:text-gray-300">
            Token:   <TokenBadge token={product?.token} />
          </div>
          <Button
            variant="primary"
            onClick={handlePayment}
            isLoading={isPaying}
            fullWidth
          >
            Pay Now
          </Button>
        </div>
      </div>
    </Layout>
  );
};