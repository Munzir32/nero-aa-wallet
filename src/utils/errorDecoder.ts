import { ethers } from 'ethers';

// Common error signatures and their corresponding error messages
const ERROR_SIGNATURES: { [key: string]: string } = {
  '0x08c379a0': 'Error(string)',
  '0x4e487b71': 'Panic(uint256)',
  '0xfb8f41b2': 'InsufficientAllowance(address,address,uint256)',
  '0xa9059cbb': 'Transfer(address,address,uint256)',
  '0x23b872dd': 'TransferFrom(address,address,address,uint256)',
  '0x095ea7b3': 'Approval(address,address,uint256)',
};

// Panic codes and their meanings
const PANIC_CODES: { [key: number]: string } = {
  0x00: 'Generic panic',
  0x01: 'Assertion failed',
  0x11: 'Arithmetic overflow/underflow',
  0x12: 'Division by zero',
  0x21: 'Invalid enum value',
  0x22: 'Invalid encoded storage byte array',
  0x31: 'Pop on empty array',
  0x32: 'Array index out of bounds',
  0x41: 'Out of memory',
  0x51: 'Uninitialized function',
};

export interface DecodedError {
  type: 'string' | 'panic' | 'custom' | 'unknown';
  message: string;
  details?: any;
}

export function decodeRevertError(errorData: string): DecodedError {
  if (!errorData || errorData === '0x') {
    return {
      type: 'unknown',
      message: 'No error data provided'
    };
  }

  // Extract the function selector (first 4 bytes)
  const selector = errorData.substring(0, 10);
  
  // Handle Error(string) - most common
  if (selector === '0x08c379a0') {
    try {
      const iface = new ethers.utils.Interface(['function Error(string)']);
      const decoded = iface.decodeFunctionData('Error', '0x' + errorData.substring(10));
      return {
        type: 'string',
        message: decoded[0]
      };
    } catch (error) {
      return {
        type: 'string',
        message: 'Failed to decode error string'
      };
    }
  }
  
  // Handle Panic(uint256)
  if (selector === '0x4e487b71') {
    try {
      const iface = new ethers.utils.Interface(['function Panic(uint256)']);
      const decoded = iface.decodeFunctionData('Panic', '0x' + errorData.substring(10));
      const panicCode = decoded[0].toNumber();
      const panicMessage = PANIC_CODES[panicCode] || `Unknown panic code: ${panicCode}`;
      return {
        type: 'panic',
        message: panicMessage,
        details: { panicCode }
      };
    } catch (error) {
      return {
        type: 'panic',
        message: 'Failed to decode panic error'
      };
    }
  }
  
  // Handle InsufficientAllowance error
  if (selector === '0xfb8f41b2') {
    try {
      const iface = new ethers.utils.Interface([
        'function InsufficientAllowance(address token, address spender, uint256 required)'
      ]);
      const decoded = iface.decodeFunctionData('InsufficientAllowance', '0x' + errorData.substring(10));
      return {
        type: 'custom',
        message: `Insufficient allowance: Required ${ethers.utils.formatEther(decoded[2])} tokens, but allowance is insufficient for token ${decoded[0]} by spender ${decoded[1]}`,
        details: {
          token: decoded[0],
          spender: decoded[1],
          required: decoded[2]
        }
      };
    } catch (error) {
      return {
        type: 'custom',
        message: 'Failed to decode insufficient allowance error'
      };
    }
  }
  
  // Handle other known error signatures
  if (ERROR_SIGNATURES[selector]) {
    return {
      type: 'custom',
      message: `Custom error: ${ERROR_SIGNATURES[selector]}`,
      details: { selector, errorData }
    };
  }
  
  // Unknown error
  return {
    type: 'unknown',
    message: `Unknown error with selector: ${selector}`,
    details: { selector, errorData }
  };
}

export function formatErrorForUser(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.error?.data) {
    const decoded = decodeRevertError(error.error.data);
    return decoded.message;
  }
  
  if (error?.data) {
    const decoded = decodeRevertError(error.data);
    return decoded.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unknown error occurred';
} 