const { ethers } = require('ethers');

// The error data from the user's message
const errorData = "0xfb8f41b2000000000000000000000000d0a5f0102ad3e32e0d4c2576778d37af9f50c07900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001";

// Extract the function selector (first 4 bytes)
const selector = errorData.substring(0, 10);
console.log('Error selector:', selector);

// This appears to be a custom error with selector 0xfb8f41b2
// Let's try to decode it as InsufficientAllowance
try {
  const iface = new ethers.utils.Interface([
    'function InsufficientAllowance(address token, address spender, uint256 required)'
  ]);
  
  const decoded = iface.decodeFunctionData('InsufficientAllowance', '0x' + errorData.substring(10));
  
  console.log('Decoded error:');
  console.log('Token address:', decoded[0]);
  console.log('Spender address:', decoded[1]);
  console.log('Required amount:', ethers.utils.formatEther(decoded[2]), 'tokens');
  
  console.log('\nHuman readable error:');
  console.log(`Insufficient allowance: Required ${ethers.utils.formatEther(decoded[2])} tokens, but allowance is insufficient for token ${decoded[0]} by spender ${decoded[1]}`);
  
} catch (error) {
  console.log('Failed to decode as InsufficientAllowance:', error.message);
  
  // Try to decode as a generic error
  try {
    const iface = new ethers.utils.Interface(['function Error(string)']);
    const decoded = iface.decodeFunctionData('Error', '0x' + errorData.substring(10));
    console.log('Decoded as Error(string):', decoded[0]);
  } catch (error2) {
    console.log('Failed to decode as Error(string):', error2.message);
    console.log('Raw error data:', errorData);
  }
} 