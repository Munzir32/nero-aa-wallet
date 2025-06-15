import React, { useCallback, useState, useEffect } from 'react';
import { ChainType, Product, TokenType } from '../../types/Pos';
import { Edit, Trash } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { TokenBadge } from '@/components/ui/TokenBadge';
import { useReadProduct } from '@/hooks/pos/useReadProduct';
import { fetchIPFSData } from '@/utils/IpfsDataFetch';

interface ProductRowProps {
  id: string;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

interface IPFSPRODUCTDETAILS {
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  supportedChains: ChainType[];
  supportedTokens: TokenType[];
}

interface Web3POSDetailsParams {
  image: string;
  name: string;
  description: string;
}


export const ProductRow: React.FC<ProductRowProps> = ({ id, onEdit, onDelete }) => {

  const [products, setProducts] = useState<Product | null>(null);
  const [productIPFSDetail, setproductIPFSDetail] = useState<Web3POSDetailsParams | null>(null)

  const { posproduct } = useReadProduct(id)
  
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


  if(!products) return null;


  return (
    <tr key={products?.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {imageURL ? (
            <div className="h-10 w-10 flex-shrink-0 mr-3">
              <img
                className="h-10 w-10 rounded object-cover"
                src={imageURL}
                alt={productIPFSDetail?.name}
              />
            </div>
          ) : (
            <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
              No image
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {productIPFSDetail?.name}
            </div>
            {productIPFSDetail?.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                {productIPFSDetail?.description}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {formatCurrency(products?.price || 0)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <TokenBadge 
        token={
          products?.token === '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' ? '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' :
                products?.token === '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74' ? '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74' :
                products?.token === '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345' ? '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345' :
                products?.token || '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' // Fallback to USDC 
        } 
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
          onClick={() => onEdit(products!)}
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          onClick={() => onDelete(products?.id || "0")}
        >
          <Trash className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
};