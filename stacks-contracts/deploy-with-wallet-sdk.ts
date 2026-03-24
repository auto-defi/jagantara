/**
 * Jagantara Stacks Contract Deployment Script
 * 
 * Deploys all 6 Clarity contracts to Stacks testnet using @stacks/wallet-sdk
 * for proper key derivation
 */

import {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  TxBroadcastResultOk,
  ClarityVersion,
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import { generateWallet, getStxAddress } from '@stacks/wallet-sdk';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
// Expected deployer address is informational only; the script derives the real address
// from DEPLOYER_MNEMONIC and deploys using that.
const DEPLOYER_ADDRESS = 'ST3DB3G0GA39FA8NZ5GG4FQ89D5AN6EJRJJ20R0SY';
// SECURITY: provide mnemonic at runtime via environment variable, do NOT hardcode.
// Example:
//   DEPLOYER_MNEMONIC='word1 word2 ...' npx tsx deploy-with-wallet-sdk.ts
const MNEMONIC = process.env.DEPLOYER_MNEMONIC;

// Contract deployment order
//
// IMPORTANT:
// - The original contracts (jaga-token, jaga-stake, insurance-manager, dao-governance,
//   claim-manager, morpho-reinvest) may already exist under the deployer address.
// - For USDCx/sBTC/STX on-chain settlement we deploy companion "-v2" contracts that
//   can coexist and be wired from the frontend.
// - Deploy tokens first.
const CONTRACTS = [
  'usdcx-token',
  'sbtc-token',
  'vault',
  'insurance-manager-v2',
  'claim-manager-v2',
  'dao-governance-v2',
];

// Optional legacy deployment (will likely fail with ContractAlreadyExists if already deployed)
const LEGACY_CONTRACTS = [
  'jaga-token',
  'jaga-stake',
  'insurance-manager',
  'dao-governance',
  'claim-manager',
  'morpho-reinvest',
];

/**
 * Read contract source file
 */
function readContractSource(contractName: string): string {
  const contractPath = path.join(__dirname, 'contracts', `${contractName}.clar`);
  return fs.readFileSync(contractPath, 'utf8');
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
async function waitForTransaction(txId: string, maxWaitTime: number = 120000): Promise<boolean> {
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
  senderKey: string,
  deployerAddress: string
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
      // Force Clarity2 so the node treats `block-height` as the builtin variable.
      clarityVersion: ClarityVersion.Clarity2,
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
      console.log('   Reason:', broadcastResult.reason || 'Unknown');
      return null;
    }
    
    const txId = (broadcastResult as TxBroadcastResultOk).txid;
    console.log(`   TX ID: ${txId}`);
    console.log(`   Waiting for confirmation...`);
    
    const confirmed = await waitForTransaction(txId);
    
    if (confirmed) {
      console.log(`✅ ${contractName} deployed successfully!`);
      console.log(`   Contract: ${deployerAddress}.${contractName}`);
      console.log(`   Explorer: https://explorer.hiro.so/txid/${txId}?chain=testnet`);
      return txId;
    } else {
      console.log(`⚠️  Transaction submitted but confirmation timed out`);
      console.log(`   Check status: https://explorer.hiro.so/txid/${txId}?chain=testnet`);
      return txId;
    }
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
  console.log(`\n📋 Expected Deployer Address: ${DEPLOYER_ADDRESS}`);
  console.log('🌐 Network: Testnet');

  if (!MNEMONIC) {
    console.error('\n❌ Missing DEPLOYER_MNEMONIC environment variable.');
    process.exit(1);
  }
  
  // Generate wallet from mnemonic
  console.log('\n🔑 Generating wallet from mnemonic...');
  const wallet = await generateWallet({
    secretKey: MNEMONIC,
    password: '',
  });
  
  // Get the address from the wallet
  const derivedAddress = getStxAddress(wallet.accounts[0], 'testnet');
  
  console.log(`   Derived Address: ${derivedAddress}`);
  
  // Check balance
  console.log('\n💰 Checking account balance...');
  const balance = await checkBalance(derivedAddress);
  console.log(`   Balance: ${balance} microSTX (${balance / 1000000} STX)`);
  
  if (balance < 100000) {
    console.log('\n⚠️  Insufficient balance for deployment!');
    console.log('   Please get testnet STX from the faucet:');
    console.log('   https://explorer.hiro.so/?chain=testnet');
    console.log(`   Address: ${derivedAddress}`);
    return;
  }
  
  const deployLegacy = (process.env.DEPLOY_LEGACY || '').toLowerCase() === 'true';
  const allContracts = deployLegacy ? [...CONTRACTS, ...LEGACY_CONTRACTS] : CONTRACTS;

  console.log('\n📁 Contracts to deploy:');
  allContracts.forEach((contract, index) => {
    console.log(`   ${index + 1}. ${contract}`);
  });
  
  // Get private key from wallet
  const privateKey = wallet.accounts[0].stxPrivateKey;
  console.log('\n✅ Private key derived from wallet');
  
  console.log('\n🚀 Starting deployment...');
  
  const deployedContracts: { name: string; txId: string }[] = [];
  
  for (const contractName of allContracts) {
    const source = readContractSource(contractName);
    const txId = await deployContract(contractName, source, privateKey, derivedAddress);
    
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
      console.log(`   ${derivedAddress}.${name}`);
      console.log(`   https://explorer.hiro.so/txid/${txId}?chain=testnet`);
    });
    
    console.log('\n🔗 Contract URLs:');
    deployedContracts.forEach(({ name }) => {
      console.log(`   https://explorer.hiro.so/txid/${derivedAddress}.${name}?chain=testnet`);
    });
  }
}

// Run deployment
main().catch(console.error);
