import { ethers } from 'ethers';

// The error data from the user's message
const errorData = "0xfb8f41b2000000000000000000000000d0a5f0102ad3e32e0d4c2576778d37af9f50c07900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001";

// Extract the function selector (first 4 bytes)
const selector = errorData.substring(0, 10);
console.log('Error selector:', selector);

// Let's analyze the data structure
const dataPart = errorData.substring(10);
console.log('Data part length:', dataPart.length);
console.log('Data part:', dataPart);

// The data seems to have 3 addresses and 1 uint256
// Let's try to decode it manually
try {
  // Each address is 32 bytes (64 hex chars), uint256 is also 32 bytes
  const address1 = '0x' + dataPart.substring(24, 64); // Remove padding
  const address2 = '0x' + dataPart.substring(88, 128); // Remove padding  
  const address3 = '0x' + dataPart.substring(152, 192); // Remove padding
  const amount = dataPart.substring(192, 256); // uint256
  
  console.log('\nManually decoded:');
  console.log('Address 1 (token):', address1);
  console.log('Address 2 (spender):', address2);
  console.log('Address 3 (owner?):', address3);
  console.log('Amount (hex):', amount);
  console.log('Amount (decimal):', ethers.BigNumber.from('0x' + amount).toString());
  console.log('Amount (formatted):', ethers.utils.formatEther('0x' + amount), 'tokens');
  
  // Try different error signatures
  const possibleErrors = [
    'function InsufficientAllowance(address,address,uint256)',
    'function InsufficientBalance(address,address,uint256)',
    'function TransferFailed(address,address,uint256)',
    'function AllowanceExceeded(address,address,uint256)'
  ];
  
  console.log('\nTrying different error signatures:');
  for (const errorSig of possibleErrors) {
    try {
      const iface = new ethers.utils.Interface([errorSig]);
      const decoded = iface.decodeFunctionData(errorSig.split(' ')[1], '0x' + dataPart);
      console.log(`✓ ${errorSig.split(' ')[1]}:`, decoded);
    } catch (e) {
      console.log(`✗ ${errorSig.split(' ')[1]}: Failed`);
    }
  }
  
} catch (error) {
  console.log('Manual decoding failed:', error.message);
} 