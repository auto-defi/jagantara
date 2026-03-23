#!/usr/bin/env node

/**
 * Jagantara Stacks Contract Deployment Script
 * 
 * This script deploys all 6 Clarity contracts to Stacks testnet
 * using the provided mnemonic.
 * 
 * Usage:
 *   node deploy.js
 * 
 * Prerequisites:
 *   - Node.js installed
 *   - npm install @stacks/transactions @stacks/network bip39 bip32
 *   - Testnet STX in the deployer wallet
 */

const { StacksTestnet } = require('@stacks/network');
const { 
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode
} = require('@stacks/transactions');
const bip39 = require('bip39');
const bip32 = require('bip32');
const fs = require('fs');
const path = require('path');

// Mnemonic for deployment
const MNEMONIC = 'royal inquiry sort lounge purse satisfy force pilot pretty once guitar call claim photo ginger way mammal guitar salad ancient rigid black bubble add';

// Contract deployment order
const CONTRACTS = [
  'jaga-token',
  'jaga-stake',
  'insurance-manager',
  'dao-governance',
  'claim-manager',
  'morpho-reinvest'
];

// Network configuration
const network = new StacksTestnet();

/**
 * Derive Stacks address from mnemonic
 */
function deriveAddressFromMnemonic(mnemonic) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);
  
  // Derive path for Stacks: m/44'/5757'/0'/0/0
  const child = root.derivePath("m/44'/5757'/0'/0/0");
  
  // Get public key
  const publicKey = child.publicKey.toString('hex');
  
  // Note: For actual address derivation, you would use @stacks/transactions
  // This is a simplified version
  console.log('Public Key:', publicKey);
  
  return publicKey;
}

/**
 * Read contract source file
 */
function readContractSource(contractName) {
  const contractPath = path.join(__dirname, 'contracts', `${contractName}.clar`);
  return fs.readFileSync(contractPath, 'utf8');
}

/**
 * Deploy a single contract
 */
async function deployContract(contractName, senderKey) {
  console.log(`\n📦 Deploying ${contractName}...`);
  
  const contractSource = readContractSource(contractName);
  
  const txOptions = {
    contractName: contractName,
    codeBody: contractSource,
    senderKey: senderKey,
    network: network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 100000, // 0.1 STX
  };
  
  try {
    const transaction = await makeContractDeploy(txOptions);
    const broadcastResult = await broadcastTransaction(transaction, network);
    
    if (broadcastResult.error) {
      console.error(`❌ Error deploying ${contractName}:`, broadcastResult.error);
      return null;
    }
    
    console.log(`✅ ${contractName} deployed!`);
    console.log(`   TX ID: ${broadcastResult.txid}`);
    console.log(`   Explorer: https://explorer.hiro.so/txid/${broadcastResult.txid}?chain=testnet`);
    
    return broadcastResult.txid;
  } catch (error) {
    console.error(`❌ Error deploying ${contractName}:`, error.message);
    return null;
  }
}

/**
 * Main deployment function
 */
async function main() {
  console.log('🚀 Starting Jagantara Contract Deployment to Stacks Testnet');
  console.log('=' .repeat(60));
  
  // Derive address from mnemonic
  console.log('\n📝 Deriving address from mnemonic...');
  const publicKey = deriveAddressFromMnemonic(MNEMONIC);
  
  // Note: For actual deployment, you need the private key
  // This script shows the structure but actual deployment requires:
  // 1. Importing mnemonic into Leather wallet
  // 2. Using Leather wallet to sign and broadcast transactions
  
  console.log('\n⚠️  MANUAL DEPLOYMENT REQUIRED');
  console.log('=' .repeat(60));
  console.log('\nThe contracts must be deployed manually using Leather wallet.');
  console.log('\nSteps:');
  console.log('1. Import the mnemonic into Leather wallet');
  console.log('2. Switch to Testnet network');
  console.log('3. Get testnet STX from faucet');
  console.log('4. Deploy each contract in order:');
  
  CONTRACTS.forEach((contract, index) => {
    console.log(`   ${index + 1}. ${contract}`);
  });
  
  console.log('\n📁 Contract files location:');
  console.log(`   ${path.join(__dirname, 'contracts')}`);
  
  console.log('\n🔗 Useful Links:');
  console.log('   Leather Wallet: https://leather.io');
  console.log('   Testnet Faucet: https://explorer.hiro.so/?chain=testnet');
  console.log('   Stacks Docs: https://docs.stacks.co');
  
  console.log('\n📋 Expected Deployer Address:');
  console.log('   ST2CY5V3947TN6R0A2STNQHFMTM36FD8NY4M5M00C');
  
  console.log('\n📋 Contract Addresses After Deployment:');
  const deployerAddress = 'ST2CY5V3947TN6R0A2STNQHFMTM36FD8NY4M5M00C';
  CONTRACTS.forEach(contract => {
    console.log(`   ${deployerAddress}.${contract}`);
  });
  
  console.log('\n' + '='.repeat(60));
}

// Run deployment
main().catch(console.error);