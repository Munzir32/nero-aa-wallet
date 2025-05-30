import React, { useCallback, useState, useEffect } from 'react';
import { Product } from '../../types/Pos';
import { Edit, Trash } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { TokenBadge } from '@/components/ui/TokenBadge';
import { useReadProduct } from '@/hooks/pos/useReadProduct';


interface ProductRowProps {
  id: string;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({ id, onEdit, onDelete }) => {

  const [products, setProducts] = useState<Product | null>(null);


  const { posproduct } = useReadProduct(id)
  // const { posproductLen } = useReadProductLen()
  console.log(posproduct, "pos product")
  // console.log(posproductLen, "product len")

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
    <tr key={products?.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {products?.image ? (
            <div className="h-10 w-10 flex-shrink-0 mr-3">
              <img
                className="h-10 w-10 rounded object-cover"
                src={products?.image}
                alt={products?.name}
              />
            </div>
          ) : (
            <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
              No image
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {products?.name}
            </div>
            {products?.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                {products?.description}
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
        <TokenBadge token={products?.token === "0xC86Fed58edF0981e927160C50ecB8a8B05B32fed" ? "USDC" : products?.token === "0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74" ? "USDC" : "USDC"} />
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