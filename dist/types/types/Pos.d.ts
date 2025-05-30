export type ChainType = 'ethereum' | 'polygon' | 'base' | 'optimism' | 'arbitrum';
export type TokenType = 'USDC' | 'USDT' | 'DAI';
export type Token = '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed' | '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74' | '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345';
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
    total: number;
    token: TokenType;
    chain: ChainType;
    hash: string;
    customerWallet?: string;
    status: TransactionStatus;
    txHash?: string;
    timestamp: number;
}
export declare const CHAIN_DETAILS: Record<ChainType, {
    name: string;
    id: number;
    color: string;
}>;
export declare const TOKEN_DETAILS: Record<TokenType, {
    name: string;
    symbol: string;
    decimals: number;
    color: string;
}>;
export declare const TOKEN_DETAILS_REL: {
    '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed': {
        symbol: string;
        name: string;
    };
    '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74': {
        symbol: string;
        name: string;
    };
    '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345': {
        symbol: string;
        name: string;
    };
};
