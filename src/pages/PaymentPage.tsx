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

export const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the product ID from the URL
  const [product, setProduct] = useState<Product | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const { execute, waitForUserOpResult } = useSendUserOp();
  const { posproduct } = useReadProduct(id || '');

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

  // Handle payment
  const handlePayment = async () => {
    if (!product) return;
    setIsPaying(true);

    try {
      const resultExecute = await execute({
        function: 'purchaseProduct',
        contractAddress: contractAddress,
        abi: POSAbi,
        params: [product.id, product.price, product.token],
        value: product.price,
      });

      const result = await waitForUserOpResult();
      if (result?.result) {
        alert('Payment successful!');
      } else {
        alert('Payment failed. Please try again.');
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
            Product: {product.url}
          </div>
          <div className="text-lg text-gray-700 dark:text-gray-300">
            Price:  {id}
             {/* {formatCurrency(product.price)} */}
          </div>
          <div className="text-lg text-gray-700 dark:text-gray-300">
            Token: <TokenBadge token={product.token} />
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