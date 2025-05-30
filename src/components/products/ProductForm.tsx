import React, { useState } from 'react';
import { Product, TokenType } from '../../types/Pos';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TOKEN_DETAILS, TOKEN_DETAILS_REL } from '../../types/Pos';

interface ProductFormProps {
  initialProduct?: Partial<Product>;
  onSubmit: (product: Partial<Product>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    image: '',
    token: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
    ...initialProduct,
  });
  
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
    
    if (!product.name) {
      newErrors.name = 'Product name is required';
    }
    
    if (!product.price || product.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit(product);
  };

  console.log(product.token, "product")
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Product Name"
        name="name"
        value={product.name}
        onChange={handleChange}
        placeholder="Enter product name"
        error={errors.name}
        required
        fullWidth
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={product.price}
          onChange={handleChange}
          placeholder="0.00"
          error={errors.price}
          required
          fullWidth
        />
        
        <div className="mb-4">
          <label 
            htmlFor="token" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Token
          </label>
          <select
            id="token"
            name="token"
            value={product.token}
            onChange={handleChange}
            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          >
            {Object.entries(TOKEN_DETAILS_REL).map(([key, details]) => (
              <option key={key} value={key}>
                {details.symbol} - {details.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label 
          htmlFor="description" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={product.description || ''}
          onChange={handleChange}
          rows={3}
          className="block w-full rounded-lg border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
          placeholder="Enter product description"
        />
      </div>
      
      <Input
        label="Image URL (optional)"
        name="image"
        value={product.image || ''}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
        fullWidth
      />
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {initialProduct.id ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};