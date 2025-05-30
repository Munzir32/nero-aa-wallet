export interface BaseTransaction {
    blockNumber: string;
    timeStamp: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasUsed: string;
    input: string;
    contractAddress: string;
    isError: string;
}
export interface StandardTransaction extends BaseTransaction {
    transactionHash: string;
    type: string;
    callType?: string;
    index?: string;
    errCode?: string;
}
export interface TokenTransaction extends BaseTransaction {
    hash: string;
    blockHash?: string;
    confirmations?: string;
    cumulativeGasUsed?: string;
    gasPrice?: string;
    logIndex?: string;
    nonce?: string;
    transactionIndex?: string;
    tokenDecimal: string;
    tokenName: string;
    tokenSymbol: string;
}
export interface InternalTransaction extends BaseTransaction {
    hash: string;
    type: string;
    traceId: string;
    errCode: string;
}
export interface CombinedStandardTransaction extends StandardTransaction {
    isTokenTransaction: false;
}
export interface CombinedTokenTransaction extends TokenTransaction {
    isTokenTransaction: true;
    transactionHash: string;
    gasToken?: {
        tokenName: string;
        tokenSymbol: string;
        value: string;
        tokenDecimal: string;
    };
}
export type CombinedTransaction = CombinedStandardTransaction | CombinedTokenTransaction;
export interface TransactionParams {
    tokenAddress: string;
    tokenAbi: any;
    functionName: string;
    args: any[];
    value?: bigint;
}
export interface DAppTransactionData {
    contractAddress: string;
    abi: any;
    functionName: string;
    functionParams: any[];
    value?: string | bigint;
}
export interface Transaction {
    id?: string;
    hash: string;
    from?: string;
    to?: string;
    value?: string;
    total?: string;
    timestamp?: number;
    status?: string;
    date?: string;
    token?: string;
    chain?: string;
    explorerUrlTx?: string;
    actions?: {
        type: string;
        value: string;
        token: string;
    }[];
}
export interface FormattedTransaction {
    date: string;
    gasCost: string;
    action: string;
    iconSrc: string;
    token: string;
    value: string;
    explorerUrlTx: string;
    contractAddress: string;
    gasToken?: {
        value: string;
        tokenSymbol: string;
    };
}
export type ActionType = 'txlist' | 'tokentx';
export type gasConfig = TransactionParams;
