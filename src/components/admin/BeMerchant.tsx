import React, { useState } from 'react';
import { Product, TokenType } from '../../types/Pos';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TOKEN_DETAILS } from '../../types/Pos';
import POSAbi from "../../contract/abi.json"
import { contractAddress } from '@/contract';
import { useSendUserOp, useConfig } from '@/hooks';

interface ProductFormProps {
  initialProduct?: Partial<Product>;
  onSubmit: (product: Partial<Product>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const BeMerchant: React.FC = ({
//   initialProduct = {},
//   onSubmit,
//   onCancel,
//   isSubmitting = false,
}) => {
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    image: new File([], ''),
    token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
    // ...initialProduct,
  });



  const [address, setAddress] = useState('')

//   const { AAaddress, isConnected } = useSignature();
  const { execute, waitForUserOpResult } = useSendUserOp();
  const config = useConfig();

  const [userOpHash, setUserOpHash] = useState<string | null>('');
  const [txStatus, setTxStatus] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  console.log(userOpHash, txStatus, isPolling)
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    if (name === 'price') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setProduct((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!address) {
      newErrors.address = 'Merchant address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
        // onSubmit(product);
        const resultExcute = await execute({
            function: 'addMerchantNotAdmin',
            contractAddress: contractAddress,
            abi: POSAbi,
            params: [address],
            value: 0,
          });
    
          console.log(resultExcute, "resultExcute")
    
          const result = await waitForUserOpResult();
          setUserOpHash(result?.userOpHash);
          setIsPolling(true);
          console.log(result)
    
          if (result.result === true) {
            setTxStatus('Success!');
            setIsPolling(false);
          } else if (result.transactionHash) {
            setTxStatus('Transaction hash: ' + result.transactionHash);
          }
    } catch (error) {
        
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Merchant Address "
        name="name"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter merchant address"
        error={errors.address}
        required
        fullWidth
      />
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
        //   onClick={onCancel}
        //   disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
        //   isLoading={isSubmitting}
        >
          Be Merchant
          {/* {initialProduct.id ? 'Update Product' : 'Add Product'} */}
        </Button>
      </div>
    </form>
  );
};