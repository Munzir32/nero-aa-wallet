import React, { useCallback, useEffect, useState} from 'react';
// import { Token, Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TokenBadge } from '../ui/TokenBadge';
import { ChainBadge } from '../ui/ChainBadge';
// import { ExternalLink } from 'lucide-react';
import { ChainType } from '@/types/Pos';
import { useReadTransaction, } from '@/hooks/pos/useReadProduct';
import { TransactionInfo } from '@/types/Pos';
interface TransactionRowProps {
  id: string;
  getEtherscanLink: (chain: string, txHash: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  id,
  getEtherscanLink,
  getStatusBadge,
}) => {

    const [transactionInfo, setTransactionInfo] = useState<TransactionInfo | null>(null)

    const { posTransaction } = useReadTransaction(id)

    const productFetch = useCallback(async () => {
        if (!posTransaction || !Array.isArray(posTransaction)) {
          return;
        }
        if (!posTransaction) {
          return;
        }
        setTransactionInfo({
          customer: posTransaction[0],
          merchant: posTransaction[1],
          token: posTransaction[2],
          amount: Number(posTransaction[3]),
          orderId: posTransaction[4],
          timestamp: posTransaction[5],
          processed: Boolean(posTransaction[6]),
          productId: Number(posTransaction[7]),
          quantity: Number(posTransaction[8]),
        })
      }, [posTransaction])
    
      useEffect(() => {
        productFetch()
      }, [productFetch])    

    console.log(posTransaction, "pos")
  return (
    <tr key={transactionInfo?.orderId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDate(transactionInfo?.timestamp || Date.now())}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {transactionInfo?.productId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {formatCurrency(Number(transactionInfo?.amount) || 0)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
      <TokenBadge 
        token={transactionInfo?.token || "USDC"} 
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {/* <ChainBadge chain={transaction.chain as ChainType || 'usdc'} size="sm" /> */}
        <ChainBadge chain={'nero' as ChainType} size="sm" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge('confirmed')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {/* {transaction?.hash && (
          <a 
            href={getEtherscanLink(transaction?.chain || 'ethereum', transaction.hash)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
          >
            View <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        )} */}
      </td>
    </tr>
  );
};