/**
 * Jagantara Stacks Contract Deployment Script
 * 
 * Deploys all 6 Clarity contracts to Stacks testnet using @stacks/transactions
 * with detailed error handling and transaction status checking
 */

import {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  TxBroadcastResultOk,
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
 * Check account balance on testnet
 */
async function checkBalance(address: string): Promise<number> {
  try {
    const response = await fetch(`https://api.testnet.hiro.so/extended/v1/address/${address}/balances`);
    const data = await response.json();
    const stxBalance = data.stx?.balance || '0';
    return parseInt(stxBalance);
  } catch (error) {
    console.error('Error checking balance:', error);
    return 0;
  }
}

/**
 * Wait for transaction confirmation
 */
async function waitForTransaction(txId: string, maxWaitTime: number = 60000): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      const response = await fetch(`https://api.testnet.hiro.so/extended/v1/tx/${txId}`);
      const data = await response.json();
      
      if (data.tx_status === 'success') {
        return true;
      } else if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
        console.log(`Transaction failed with status: ${data.tx_status}`);
        return false;
      }
    } catch (error) {
      // Continue waiting
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  return false;
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
      fee: 500000, // 0.5 STX for higher fee to ensure inclusion
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
      console.log('   Reason:', broadcastResult.reason || 'Unknown');
      return null;
    }
    
    const txId = (broadcastResult as TxBroadcastResultOk).txid;
    console.log(`   TX ID: ${txId}`);
    console.log(`   Waiting for confirmation...`);
    
    const confirmed = await waitForTransaction(txId);
    
    if (confirmed) {
      console.log(`✅ ${contractName} deployed successfully!`);
      console.log(`   Contract: ${DEPLOYER_ADDRESS}.${contractName}`);
      console.log(`   Explorer: https://explorer.hiro.so/txid/${txId}?chain=testnet`);
      return txId;
    } else {
      console.log(`⚠️  Transaction submitted but confirmation timed out`);
      console.log(`   Check status: https://explorer.hiro.so/txid/${txId}?chain=testnet`);
      return txId;
    }
  } catch (error: any) {
    console.error(`❌ Error deploying ${contractName}:`, error.message);
    if (error.response) {
      console.error('   Response:', error.response);
    }
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
  
  // Check balance first
  console.log('\n💰 Checking account balance...');
  const balance = await checkBalance(DEPLOYER_ADDRESS);
  console.log(`   Balance: ${balance} microSTX (${balance / 1000000} STX)`);
  
  if (balance < 1000000) {
    console.log('\n⚠️  Insufficient balance for deployment!');
    console.log('   Please get testnet STX from the faucet:');
    console.log('   https://explorer.hiro.so/?chain=testnet');
    console.log(`   Address: ${DEPLOYER_ADDRESS}`);
    console.log('\n   Each contract deployment requires ~0.5 STX');
    console.log('   Total required: ~3 STX for 6 contracts');
    
    console.log('\n📄 Contract Sources for Manual Deployment:');
    console.log('='.repeat(60));
    
    for (const contractName of CONTRACTS) {
      const source = readContractSource(contractName);
      console.log(`\n### ${contractName}.clar ###`);
      console.log('```clarity');
      console.log(source);
      console.log('```');
    }
    
    return;
  }
  
  console.log('\n📁 Contracts to deploy:');
  CONTRACTS.forEach((contract, index) => {
    console.log(`   ${index + 1}. ${contract}`);
  });
  
  console.log('\n🔑 Deriving private key from mnemonic...');
  
  try {
    const senderKey = await derivePrivateKey(MNEMONIC);
    console.log('✅ Private key derived successfully');
    
    console.log('\n🚀 Starting deployment...');
    
    const deployedContracts: { name: string; txId: string }[] = [];
    
    for (const contractName of CONTRACTS) {
      const source = readContractSource(contractName);
      const txId = await deployContract(contractName, source, senderKey);
      
      if (txId) {
        deployedContracts.push({ name: contractName, txId });
      } else {
        console.log(`\n⚠️  Deployment of ${contractName} failed. Continuing...`);
      }
      
      // Wait between deployments
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Deployment Summary');
    console.log('='.repeat(60));
    
    if (deployedContracts.length === 0) {
      console.log('❌ No contracts were deployed successfully');
    } else {
      console.log(`✅ ${deployedContracts.length}/${CONTRACTS.length} contracts deployed`);
      console.log('\n📝 Deployed Contracts:');
      deployedContracts.forEach(({ name, txId }) => {
        console.log(`   ${DEPLOYER_ADDRESS}.${name}`);
        console.log(`   https://explorer.hiro.so/txid/${txId}?chain=testnet`);
      });
      
      console.log('\n🔗 Contract URLs:');
      deployedContracts.forEach(({ name }) => {
        console.log(`   https://explorer.hiro.so/txid/${DEPLOYER_ADDRESS}.${name}?chain=testnet`);
      });
    }
    
  } catch (error: any) {
    console.error('❌ Deployment failed:', error.message);
    
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