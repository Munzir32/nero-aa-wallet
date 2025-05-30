import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { ProductForm } from '../components/products/ProductForm';
import { Product, TokenType } from '../types/Pos';
import { Edit, Trash, PlusCircle, Search } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import { TokenBadge } from '../components/ui/TokenBadge';
import { Input } from '../components/ui/Input';
import POSAbi from "../contract/abi.json"
import { contractAddress } from '@/contract';
import { useSendUserOp } from '@/hooks';
import { ProductRow } from '@/components/products/ProductRow';
import {  useReadProductLen } from '@/hooks/pos/useReadProduct';


export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posproductLen, setPosproductLen] = useState<Map<string, string>>(new Map());

  const { execute, waitForUserOpResult } = useSendUserOp();
  const { posproductLen: productLen } = useReadProductLen()


  const [userOpHash, setUserOpHash] = useState<string | null>('');
  const [txStatus, setTxStatus] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  console.log(userOpHash, txStatus, isPolling)
  
  useEffect(() => {
    // Simulated product data
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Basic T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 24.99,
        image: 'https://images.pexels.com/photos/5698850/pexels-photo-5698850.jpeg?auto=compress&cs=tinysrgb&w=800',
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        totalSales: 3,
        createdAt: Date.now(),
      },
      {
        id: '2',
        name: 'Premium Hoodie',
        description: 'Warm and stylish hoodie',
        price: 59.99,
        image: 'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=800',
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        totalSales: 3,
        createdAt: Date.now(),
      },
      {
        id: '3',
        name: 'Wireless Headphones',
        description: 'High-quality sound with noise cancellation',
        price: 129.99,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        totalSales: 3,
        createdAt: Date.now(),
      },
      {
        id: '4',
        name: 'Smartphone Case',
        description: 'Protective case for your device',
        price: 19.99,
        image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        totalSales: 3,
        createdAt: Date.now(),
      },
      {
        id: '5',
        name: 'Smart Watch',
        description: 'Track your fitness and stay connected',
        price: 199.99,
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        totalSales: 3,
        createdAt: Date.now(),
      },
      {
        id: '6',
        name: 'Wireless Charger',
        description: 'Fast charging for compatible devices',
        price: 34.99,
        image: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=800',
        token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
        totalSales: 3,
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

  // console.log(posproductLen)

  
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };
  
  const handleDeleteProduct = (id: string) => {
    setProducts(currentProducts => currentProducts.filter(product => product.id !== id));
  };
  
  const handleSubmit = async (productData: Partial<Product>) => {
    setIsSubmitting(true);
    
    
    try {
      if (editingProduct) {
        // Update existing product
        const resultExecute = await execute({
          function: 'updateProduct',
          contractAddress: contractAddress,
          abi: POSAbi,
          params: [
            editingProduct.id, // productId
            productData.name, // name
            productData.description, // description
            productData.price, // price
            productData.token, // acceptedToken
            productData.active 
          ],
          value: 0,
        });
  
       
  
        const result = await waitForUserOpResult();
        setUserOpHash(result?.userOpHash);
        setIsPolling(true);
        console.log(result);
  
        if (result.result === true) {
          setTxStatus('Success!');
          setIsPolling(false);
        } else if (result.transactionHash) {
          setTxStatus('Transaction hash: ' + result.transactionHash);
        }
       
      } else {
        // Add new product
        const resultExecute = await execute({
          function: 'addProduct',
          contractAddress: contractAddress, 
          abi: POSAbi,
          params: [productData.name, productData.description, productData.image, productData.price, productData.token],
          value: 0,
        });
    
        // console.log(resultExecute, "resultExecute");
    
        const result = await waitForUserOpResult();
        setUserOpHash(result?.userOpHash);
        setIsPolling(true);
        console.log(result);
    
        if (result.result === true) {
          setTxStatus('Success!');
          setIsPolling(false);
        } else if (result.transactionHash) {
          setTxStatus('Transaction hash: ' + result.transactionHash);
        }
      }
      
      setIsSubmitting(false);
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.log(error)
    }
      
  
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };
  
  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your product catalog</p>
        </div>
        
        <Button
          variant="primary"
          leftIcon={<PlusCircle className="h-4 w-4" />}
          onClick={handleAddProduct}
          className="mt-4 sm:mt-0"
        >
          Add Product
        </Button>
      </div>
      
      {showForm ? (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <ProductForm
              initialProduct={editingProduct || {}}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5" />}
              fullWidth
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Token
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {posproductLen?.size === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No products found. Try a different search term or add a new product.
                    </td>
                  </tr>
                ) : (
                
                  <>
                     {[...posproductLen.entries()].map(([key, value]) => (
                    <ProductRow id={value} key={key} 
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct} />
                  ))}
                  </>
                 
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
};