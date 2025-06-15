import React, { useState, useCallback, useEffect } from 'react';
import { Product } from '../../types/Pos';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { TokenBadge } from '../ui/TokenBadge';
import { PlusCircle } from 'lucide-react';
import { useReadProduct } from '@/hooks/pos/useReadProduct';
import { useCart } from '../../contexts/CartContext';
import { fetchIPFSData } from '@/utils/IpfsDataFetch';


interface ProductCardProps {
  id: string;
}


interface Web3POSDetailsParams {
  image: string;
  name: string;
  description: string;
}


export const ProductCard: React.FC<ProductCardProps> = ({ id }) => {

  const [products, setProducts] = useState<Product | null>(null);
  const { addItem} = useCart();

  const [productIPFSDetail, setproductIPFSDetail] = useState<Web3POSDetailsParams | null>(null)

  


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
      url: posproduct[1],
      price: Number(posproduct[2]),
      token: posproduct[3],
      merchant: posproduct[4],
      active: Boolean(posproduct[5]),
      totalSales: Number(posproduct[6]),
      createdAt: Number(posproduct[7])
    })
  }, [posproduct])

  const fetchProductIPFSDetails = useCallback(async () => {
    if (!posproduct || !Array.isArray(posproduct)) {
      return;
    }
    if (!products?.url) return;

    try {
      const data = await fetchIPFSData(posproduct[1]);
      setproductIPFSDetail(data);
    } catch (error) {
      console.error('Error while fetching details:', error);
    }
  }, [products?.url]);

  console.log(productIPFSDetail, "productIPFSDetail  details");

  useEffect(() => {
    fetchProductIPFSDetails();
  }, [fetchProductIPFSDetails]);

  useEffect(() => {
    productFetch()
  }, [productFetch])

  console.log(posproduct, "pors")


  const imageURL = productIPFSDetail?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/');

  console.log(imageURL, "image")


  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer">
      <div
        className="h-36 bg-gray-200 dark:bg-gray-700 relative"
        style={{
          backgroundImage: imageURL ? `url(${imageURL})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {!imageURL && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{productIPFSDetail?.name}</h3>
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
        {productIPFSDetail?.description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {productIPFSDetail?.description}
          </p>
        )}
      </div>
    </Card>
  );
};