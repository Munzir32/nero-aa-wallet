import React from 'react';
import { CartItem as CartItemType, TokenType } from '../../types/Pos';
import { CartItemComponent } from './CartItem';
import { ThemedButton } from '../ui/ThemedButton';
import { TokenBadge } from '../ui/TokenBadge';
import { formatCurrency } from '../../utils/formatters';
import { ChainType } from '../../types/Pos';
import { ShoppingCart } from 'lucide-react';

interface CartProps {
  items: CartItemType[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  selectedToken: TokenType;
  selectedChain: ChainType;
  onTokenChange: (token: TokenType) => void;
  onChainChange: (chain: ChainType) => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
  selectedToken,
  selectedChain,
  onTokenChange,
  onChainChange,
}) => {
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const total = calculateTotal();
  const isEmpty = items.length === 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Cart</h2>
        {!isEmpty && (
          <ThemedButton variant="ghost" size="sm" onClick={onClearCart}>
            Clear
          </ThemedButton>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          items.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              onRemove={onRemoveItem}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(total)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(total)}
              </span>
              <TokenBadge token={
                    selectedToken === 'USDC' ? '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' :
                    selectedToken === 'USDT' ? '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74' :
                    selectedToken === 'DAI' ? '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345' :
                    selectedToken
                  } className="ml-2" size="sm" />
            </div>
          </div>
        </div>
        
        <ThemedButton
          variant="primary"
          fullWidth
          disabled={isEmpty}
          onClick={onCheckout}
        >
          Checkout
        </ThemedButton>
      </div>
    </div>
  );
};