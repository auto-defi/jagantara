/**
 * Jagantara Stacks Contract Deployment Script
 * 
 * Provides deployment instructions and contract sources for deploying
 * all 6 Clarity contracts to Stacks testnet.
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const DEPLOYER_ADDRESS = 'ST2CY5V3947TN6R0A2STNQHFMTM36FD8NY4M5M00C';
const NETWORK = 'testnet';

// Contract deployment order
const CONTRACTS = [
  'jaga-token',
  'jaga-stake',
  'insurance-manager',
  'dao-governance',
  'claim-manager',
  'morpho-reinvest'
];

/**
 * Read contract source file
 */
function readContractSource(contractName: string): string {
  const contractPath = path.join(__dirname, 'contracts', `${contractName}.clar`);
  return fs.readFileSync(contractPath, 'utf8');
}

/**
 * Main deployment function
 */
async function main() {
  console.log('🚀 Jagantara Stacks Contract Deployment');
  console.log('='.repeat(60));
  console.log(`\n📋 Deployer Address: ${DEPLOYER_ADDRESS}`);
  console.log(`🌐 Network: ${NETWORK}`);
  
  console.log('\n📁 Contracts to deploy:');
  CONTRACTS.forEach((contract, index) => {
    console.log(`   ${index + 1}. ${contract}`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('⚠️  DEPLOYMENT INSTRUCTIONS');
  console.log('='.repeat(60));
  
  console.log('\n1️⃣  Install Leather Wallet extension from https://leather.io');
  
  console.log('\n2️⃣  Import the mnemonic:');
  console.log('   ┌─────────────────────────────────────────────────────────┐');
  console.log('   │ royal inquiry sort lounge purse satisfy force pilot    │');
  console.log('   │ pretty once guitar call claim photo ginger way mammal  │');
  console.log('   │ guitar salad ancient rigid black bubble add           │');
  console.log('   └─────────────────────────────────────────────────────────┘');
  
  console.log('\n3️⃣  Switch to Testnet network in Leather');
  
  console.log('\n4️⃣  Get testnet STX from faucet:');
  console.log('   https://explorer.hiro.so/?chain=testnet');
  console.log('   (Click "Faucet" button)');
  
  console.log('\n5️⃣  Deploy each contract using Leather:');
  console.log('   a. Open Leather wallet');
  console.log('   b. Go to "Contracts" tab');
  console.log('   c. Click "Deploy Contract"');
  console.log('   d. Enter contract name and paste source code');
  console.log('   e. Click "Deploy" and confirm transaction');
  
  console.log('\n📄 Contract Sources Location:');
  console.log(`   ${path.join(__dirname, 'contracts')}`);
  
  // Print contract sources for easy copying
  console.log('\n📝 Contract Sources:');
  console.log('='.repeat(60));
  
  for (const contractName of CONTRACTS) {
    const source = readContractSource(contractName);
    console.log(`\n### ${contractName}.clar ###`);
    console.log('```clarity');
    console.log(source);
    console.log('```');
    console.log('\n' + '-'.repeat(60));
  }
  
  console.log('\n📝 Expected Contract Addresses:');
  CONTRACTS.forEach((contract) => {
    console.log(`   ${DEPLOYER_ADDRESS}.${contract}`);
  });
  
  console.log('\n🔗 Contract URLs after deployment:');
  CONTRACTS.forEach((contract) => {
    console.log(`   https://explorer.hiro.so/txid/${DEPLOYER_ADDRESS}.${contract}?chain=testnet`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ Deployment preparation complete!');
  console.log('   Follow the instructions above to deploy using Leather wallet.');
}

// Run deployment
main().catch(console.error);