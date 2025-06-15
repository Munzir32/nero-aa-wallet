import React, { useCallback, useEffect, useState } from 'react';
import { CartItem as CartItemType, Web3POSDetailsParams } from '../../types/Pos';
import { formatCurrency } from '../../utils/formatters';
import { Trash, Minus, Plus } from 'lucide-react';
import { useReadProduct } from '@/hooks/pos/useReadProduct';
import { fetchIPFSData } from '@/utils/IpfsDataFetch';
import { Product } from '../../types/Pos';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
}) => {
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };


  const [products, setProducts] = useState<Product | null>(null);
  const [productIPFSDetail, setproductIPFSDetail] = useState<Web3POSDetailsParams | null>(null)

  const { posproduct } = useReadProduct(item?.id)
  
  // const { posproductLen } = useReadProductLen()
  // console.log(posproduct, "pos product")
  

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
      const data = await fetchIPFSData(products?.url);
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

  const imageURL = productIPFSDetail?.image.replace('ipfs://', 'https://ipfs.io/ipfs/');

  

  return (
    <div className="py-3 flex border-b border-gray-200 dark:border-gray-700 last:border-0">
      {imageURL ? (
        <div 
          className="h-16 w-16 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 mr-3"
          style={{ 
            backgroundImage: `url(${imageURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center' 
          }}
        />
      ) : (
        <div className="h-16 w-16 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
          No image
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{productIPFSDetail?.name}</h4>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-1 flex justify-between items-center">
          <div className="text-sm text-gray-900 dark:text-white font-medium">
            {formatCurrency(item.price)}
          </div>
          
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
            <button
              onClick={handleDecrement}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-2 py-1 text-sm">{item.quantity}</span>
            <button
              onClick={handleIncrement}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};