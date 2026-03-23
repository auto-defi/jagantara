/**
 * Jagantara Stacks Testnet Deployment Guide
 * 
 * This script provides deployment instructions for the Jagantara contracts
 * on Stacks testnet using the provided mnemonic.
 */

// Mnemonic for deployment (24 words)
const MNEMONIC = "royal inquiry sort lounge purse satisfy force pilot pretty once guitar call claim photo ginger way mammal guitar salad ancient rigid black bubble add";

// Contract deployment order
const CONTRACTS = [
  'jaga-token',
  'jaga-stake',
  'insurance-manager',
  'dao-governance',
  'claim-manager',
  'morpho-reinvest'
];

console.log('=== Jagantara Stacks Testnet Deployment ===\n');
console.log('Mnemonic (24 words):');
console.log(MNEMONIC);
console.log('\n');

console.log('DEPLOYMENT INSTRUCTIONS:');
console.log('========================\n');

console.log('1. DERIVE YOUR ADDRESS FROM THE MNEMONIC');
console.log('   - Use Leather wallet or Stacks CLI to import the mnemonic');
console.log('   - The derived address will be your deployer address\n');

console.log('2. GET TESTNET STX');
console.log('   - Visit: https://explorer.hiro.so/?chain=testnet');
console.log('   - Use the faucet to get testnet STX\n');

console.log('3. DEPLOY CONTRACTS (using Stacks CLI or Leather)');
console.log('   Deploy in this order:\n');

CONTRACTS.forEach((contract, i) => {
  console.log(`   ${i + 1}. ${contract}.clar`);
});

console.log('\n4. EXPECTED CONTRACT ADDRESSES');
console.log('   After deployment, your contracts will be at:');
console.log('   <DEPLOYER_ADDRESS>.jaga-token');
console.log('   <DEPLOYER_ADDRESS>.jaga-stake');
console.log('   <DEPLOYER_ADDRESS>.insurance-manager');
console.log('   <DEPLOYER_ADDRESS>.dao-governance');
console.log('   <DEPLOYER_ADDRESS>.claim-manager');
console.log('   <DEPLOYER_ADDRESS>.morpho-reinvest\n');

console.log('5. UPDATE FRONTEND CONFIGURATION');
console.log('   Create jagantara/.env.local with:');
console.log('   NEXT_PUBLIC_NETWORK=testnet');
console.log('   NEXT_PUBLIC_DEPLOYER_ADDRESS=<YOUR_DEPLOYER_ADDRESS>\n');

console.log('ALTERNATIVE: Use Clarinet for deployment');
console.log('   clarinet deploy --network testnet\n');

// Export for programmatic use
module.exports = {
  MNEMONIC,
  CONTRACTS
};