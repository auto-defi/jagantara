/**
 * Jagantara Stacks Contract Deployment Script
 * 
 * Deploys all 6 Clarity contracts to Stacks testnet using @stacks/transactions
 */

import {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const DEPLOYER_ADDRESS = 'ST17NEAXJEETBX9G2J4W8S01CQ7K05HC9GEKR1FQZ';
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

/**
 * Read contract source file
 */
function readContractSource(contractName: string): string {
  const contractPath = path.join(__dirname, 'contracts', `${contractName}.clar`);
  return fs.readFileSync(contractPath, 'utf8');
}

/**
 * Derive private key from mnemonic using bip39
 */
async function derivePrivateKey(mnemonic: string): Promise<string> {
  const bip39 = await import('bip39');
  const { HDKey } = await import('@scure/bip32');
  
  // Generate seed from mnemonic
  const seed = await bip39.mnemonicToSeed(mnemonic);
  
  // Create HD key
  const hdKey = HDKey.fromMasterSeed(seed);
  
  // Derive path for Stacks: m/44'/5757'/0'/0/0
  const childKey = hdKey.derive("m/44'/5757'/0'/0/0");
  
  if (!childKey.privateKey) {
    throw new Error('Failed to derive private key');
  }
  
  // Convert to hex string
  const privateKeyHex = Buffer.from(childKey.privateKey).toString('hex');
  return privateKeyHex;
}

/**
 * Deploy a single contract
 */
async function deployContract(
  contractName: string,
  source: string,
  senderKey: string
): Promise<string | null> {
  console.log(`\n📦 Deploying ${contractName}...`);
  
  try {
    const txOptions = {
      contractName: contractName,
      codeBody: source,
      senderKey: senderKey,
      network: STACKS_TESTNET,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      fee: 100000, // 0.1 STX
    };
    
    console.log('   Creating transaction...');
    const transaction = await makeContractDeploy(txOptions);
    
    console.log('   Broadcasting transaction...');
    const broadcastResult = await broadcastTransaction({
      transaction,
      network: STACKS_TESTNET
    });
    
    if ('error' in broadcastResult && broadcastResult.error) {
      console.error(`❌ Error deploying ${contractName}:`, broadcastResult.error);
      return null;
    }
    
    const txId = broadcastResult.txid;
    
    console.log(`✅ ${contractName} deployed!`);
    console.log(`   TX ID: ${txId}`);
    console.log(`   Contract: ${DEPLOYER_ADDRESS}.${contractName}`);
    console.log(`   Explorer: https://explorer.hiro.so/txid/${txId}?chain=testnet`);
    
    return txId;
  } catch (error: any) {
    console.error(`❌ Error deploying ${contractName}:`, error.message);
    return null;
  }
}

/**
 * Main deployment function
 */
async function main() {
  console.log('🚀 Jagantara Stacks Contract Deployment');
  console.log('='.repeat(60));
  console.log(`\n📋 Deployer Address: ${DEPLOYER_ADDRESS}`);
  console.log('🌐 Network: Testnet');
  
  console.log('\n📁 Contracts to deploy:');
  CONTRACTS.forEach((contract, index) => {
    console.log(`   ${index + 1}. ${contract}`);
  });
  
  console.log('\n🔑 Deriving private key from mnemonic...');
  
  try {
    const senderKey = await derivePrivateKey(MNEMONIC);
    console.log('✅ Private key derived successfully');
    
    console.log('\n🚀 Starting deployment...');
    console.log('⚠️  Note: Each deployment requires ~0.01 STX for fees');
    console.log('   Make sure the deployer address has sufficient STX');
    console.log('   Get testnet STX from: https://explorer.hiro.so/?chain=testnet');
    
    const deployedContracts: { name: string; txId: string }[] = [];
    
    for (const contractName of CONTRACTS) {
      const source = readContractSource(contractName);
      const txId = await deployContract(contractName, source, senderKey);
      
      if (txId) {
        deployedContracts.push({ name: contractName, txId });
      } else {
        console.log(`\n⚠️  Deployment of ${contractName} failed. Continuing...`);
      }
      
      // Wait a bit between deployments
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Deployment Summary');
    console.log('='.repeat(60));
    
    if (deployedContracts.length === 0) {
      console.log('❌ No contracts were deployed successfully');
      console.log('\n⚠️  Manual Deployment Required');
      console.log('   Please deploy manually using Leather wallet:');
      console.log('   1. Install Leather from https://leather.io');
      console.log('   2. Import the mnemonic');
      console.log('   3. Switch to Testnet');
      console.log('   4. Deploy each contract manually');
    } else {
      console.log(`✅ ${deployedContracts.length}/${CONTRACTS.length} contracts deployed`);
      console.log('\n📝 Deployed Contracts:');
      deployedContracts.forEach(({ name, txId }) => {
        console.log(`   ${DEPLOYER_ADDRESS}.${name}`);
        console.log(`   https://explorer.hiro.so/txid/${txId}?chain=testnet`);
      });
      
      console.log('\n🔗 Update jagantara/.env.local with these addresses:');
      deployedContracts.forEach(({ name }) => {
        console.log(`   NEXT_PUBLIC_${name.toUpperCase().replace('-', '_')}=${DEPLOYER_ADDRESS}.${name}`);
      });
    }
    
  } catch (error: any) {
    console.error('❌ Deployment failed:', error.message);
    console.log('\n⚠️  Manual Deployment Required');
    console.log('   Please deploy manually using Leather wallet:');
    console.log('   1. Install Leather from https://leather.io');
    console.log('   2. Import the mnemonic');
    console.log('   3. Switch to Testnet');
    console.log('   4. Deploy each contract manually');
    
    // Print contract sources for manual deployment
    console.log('\n📄 Contract Sources for Manual Deployment:');
    console.log('='.repeat(60));
    
    for (const contractName of CONTRACTS) {
      const source = readContractSource(contractName);
      console.log(`\n### ${contractName}.clar ###`);
      console.log('```clarity');
      console.log(source);
      console.log('```');
    }
  }
}

// Run deployment
main().catch(console.error);