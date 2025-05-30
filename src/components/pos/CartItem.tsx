import React from 'react';
import { CartItem as CartItemType } from '../../types/Pos';
import { formatCurrency } from '../../utils/formatters';
import { Trash, Minus, Plus } from 'lucide-react';

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

  return (
    <div className="py-3 flex border-b border-gray-200 dark:border-gray-700 last:border-0">
      {item.image ? (
        <div 
          className="h-16 w-16 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 mr-3"
          style={{ 
            backgroundImage: `url(${item.image})`,
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
          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</h4>
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