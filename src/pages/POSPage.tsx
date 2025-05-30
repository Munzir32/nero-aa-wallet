import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { ProductCard } from '../components/pos/ProductCard';
import { Cart } from '../components/pos/Cart';
import { CheckoutModal } from '../components/pos/CheckoutModal';
import { Input } from '../components/ui/Input';
import { Product, ChainType, TokenType } from '../types/Pos';
import { useCart } from '../contexts/CartContext';
// import { useWallet } from '../contexts/WalletContext';
import { useSignature } from '@/hooks';
import {  useReadProductLen } from '@/hooks/pos/useReadProduct';
import { Search } from 'lucide-react';
// import Chec
export const POSPage: React.FC = () => {
  // const { wallet } = useWallet();
  const { AAaddress } = useSignature()
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState<ChainType>('ethereum');
  const [selectedToken, setSelectedToken] = useState<TokenType>('USDC');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [posproductLen, setPosproductLen] = useState<Map<string, string>>(new Map());
  

  const { posproductLen: productLen } = useReadProductLen()

  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Basic T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 24.99,
        image: 'https://images.pexels.com/photos/5698850/pexels-photo-5698850.jpeg?auto=compress&cs=tinysrgb&w=800',
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        createdAt: Date.now(),
      },
      {
        id: '2',
        name: 'Premium Hoodie',
        description: 'Warm and stylish hoodie',
        price: 59.99,
        image: 'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=800',
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        createdAt: Date.now(),
      },
      {
        id: '3',
        name: 'Wireless Headphones',
        description: 'High-quality sound with noise cancellation',
        price: 129.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        createdAt: Date.now(),
      },
      {
        id: '4',
        name: 'Smartphone Case',
        description: 'Protective case for your device',
        price: 19.99,
        image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        createdAt: Date.now(),
      },
      {
        id: '5',
        name: 'Smart Watch',
        description: 'Track your fitness and stay connected',
        price: 199.99,
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        createdAt: Date.now(),
      },
      {
        id: '6',
        name: 'Wireless Charger',
        description: 'Fast charging for compatible devices',
        price: 34.99,
        image: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=800',
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        createdAt: Date.now(),
      },
    ];
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const getProductLen = useCallback(() => {
    try {
      if (!productLen) {
        console.log("productLen is undefined or null");
        return;
      }

      const newMap = new Map<string, string>();
      if (typeof productLen === 'bigint' && productLen > 0) {
        for (let i = 1; i < productLen; i++) {
          newMap.set(i.toString(), i.toString()); 
        }
        setPosproductLen(new Map(newMap));
      } else {
        console.log("productLen isn't valid bigint:", productLen);
      }
    } catch (error) {
      console.error("Error setting employee IDs:", error);
    }
  }, [productLen])

  useEffect(() => {
    getProductLen()
  }, [productLen, getProductLen])
  
  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };
  
  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">POS Terminal</h1>
        <p className="text-gray-600 dark:text-gray-400">Create a new sale by adding products to the cart.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5" />}
              fullWidth
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-8 text-center text-gray-500 dark:text-gray-400">
                No products found. Try a different search term.
              </div>
            ) : (
              <>
              {[...posproductLen.entries()].map(([key, value]) => (
                    <ProductCard 
                  key={key} 
                  id={value}
                />
                  ))}
              </>
            )}
          </div>
        </div>
        
        <div>
          <Cart
            items={items}
            onRemoveItem={removeItem}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
            onCheckout={handleCheckout}
            selectedToken={selectedToken}
            selectedChain={selectedChain}
            onTokenChange={setSelectedToken}
            onChainChange={setSelectedChain}
          />
        </div>
      </div>
      
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={handleCloseCheckoutModal}
        items={items}
        token={selectedToken}
        chain={selectedChain}
        walletAddress={AAaddress || '0xdEAD000000000000000000000000000000000000'}
      />
    </Layout>
  );
};