// Core Types
export type ChainType = 'ethereum' | 'nero' | 'base' | 'optimism' | 'arbitrum';

export type TokenType = 'USDC' | 'USDT' | 'DAI';
// '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' | '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74' | '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345'
export type Token = '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' | '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74' | '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345'

export interface Wallet {
  address: string;
  ensName?: string;
  chainId: number;
  isConnected: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  merchant?: string;
  active?: boolean;
  totalSales?: number;
  category?: string;
  token: Token;
  createdAt: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export interface Transaction {
  id: string;
  items: CartItem[];
  total: string;
  token: Token;
  chain: ChainType;
  hash: string;
  customerWallet?: string;
  status: TransactionStatus;
  txHash?: string;
  timestamp: number;
}

// Chain Constants
export const CHAIN_DETAILS: Record<ChainType, { name: string; id: number; color: string }> = {
  ethereum: { name: 'Ethereum', id: 1, color: '#627EEA' },
  nero: { name: 'nero', id: 137, color: '#00000' },
  base: { name: 'Base', id: 8453, color: '#0052FF' },
  optimism: { name: 'Optimism', id: 10, color: '#FF0420' },
  arbitrum: { name: 'Arbitrum', id: 42161, color: '#28A0F0' }
};

// Token Constants
export const TOKEN_DETAILS: Record<TokenType, { name: string; symbol: string; decimals: number; color: string }> = {
  USDC: { name: 'USD Coin', symbol: 'USDC', decimals: 6, color: '#2775CA' },
  USDT: { name: 'Tether', symbol: 'USDT', decimals: 6, color: '#26A17B' },
  DAI: { name: 'Dai', symbol: 'DAI', decimals: 18, color: '#F5AC37' }
};

export const TOKEN_DETAILS_REL = {
  '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed': { symbol: 'USDC', name: 'USD Coin' },
  '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74': { symbol: 'USDC', name: 'USD Coin' },
  '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345': { symbol: 'USDC', name: 'USD Coin' },
};

export interface TransactionInfo {
  customer: string; // Address of the customer
  merchant: string; // Address of the merchant
  token: string;    // Address of the token
  amount: number;   // Amount of the transaction
  orderId: string;  // Order ID
  timestamp: number; // Timestamp of the transaction
  processed: boolean; // Whether the transaction is processed
  productId: number; // ID of the product
  quantity: number;  // Quantity of the product
}