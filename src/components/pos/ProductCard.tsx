import React, { useState, useCallback, useEffect } from 'react';
import { Product } from '../../types/Pos';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { TokenBadge } from '../ui/TokenBadge';
import { PlusCircle } from 'lucide-react';
import { useReadProduct } from '@/hooks/pos/useReadProduct';
import { useCart } from '../../contexts/CartContext';


interface ProductCardProps {
  id: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id }) => {

  const [products, setProducts] = useState<Product | null>(null);
  const { addItem} = useCart();
  


  const { posproduct } = useReadProduct(id)
  const productFetch = useCallback(async () => {
    if (!posproduct || !Array.isArray(posproduct)) {
      return;
    }
    if (!posproduct) {
      return;
    }
    setProducts({
      id: posproduct[0],
      name: posproduct[1],
      description: posproduct[2],
      image: posproduct[3],
      price: Number(posproduct[4]),
      token: posproduct[5],
      merchant: posproduct[6],
      active: Boolean(posproduct[7]),
      totalSales: Number(posproduct[8]),
      createdAt: Number(posproduct[9])
    })
  }, [posproduct])

  useEffect(() => {
    productFetch()
  }, [productFetch])

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer">
      <div
        className="h-36 bg-gray-200 dark:bg-gray-700 relative"
        style={{
          backgroundImage: products?.image ? `url(${products?.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {!products?.image && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{products?.name}</h3>
            <div className="mt-1 flex items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(products?.price || 0)}
              </span>
              {/* <TokenBadge 
              token={
                products?.token === '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' ? '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' :
                products?.token === '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74' ? '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74' :
                products?.token === '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345' ? '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345' :
                products?.token || '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' // Fallback to USDC 
              }
              /> */}
                            {/* <TokenBadge token={
                    products?.token === 'USDC' ? '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' :
                    products?.token === 'USDT' ? '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74' :
                    products?.token === 'DAI' ? '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345' :
                    products?.token
                  } className="ml-2" size="sm" /> */}
            </div>
          </div>
          <button
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            onClick={() => addItem(products!)}
          >
            <PlusCircle className="h-6 w-6" />
          </button>
        </div>
        {products?.description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {products?.description}
          </p>
        )}
      </div>
    </Card>
  );
};