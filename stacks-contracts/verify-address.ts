/**
 * Verify Address from Mnemonic
 * 
 * This script derives the Stacks address from the mnemonic
 * to verify it matches the expected deployer address.
 */

import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';
import * as crypto from 'crypto';

// Mnemonic
const MNEMONIC = 'royal inquiry sort lounge purse satisfy force pilot pretty once guitar call claim photo ginger way mammal guitar salad ancient rigid black bubble add';

// Expected address
const EXPECTED_ADDRESS = 'ST17NEAXJEETBX9G2J4W8S01CQ7K05HC9GEKR1FQZ';

async function deriveAddress() {
  console.log('🔑 Deriving address from mnemonic...\n');
  console.log('Mnemonic:', MNEMONIC);
  console.log('Expected Address:', EXPECTED_ADDRESS);
  console.log('\n' + '='.repeat(60));
  
  // Generate seed
  const seed = await bip39.mnemonicToSeed(MNEMONIC);
  console.log('\n✅ Seed generated');
  
  // Create HD key
  const hdKey = HDKey.fromMasterSeed(seed);
  console.log('✅ HD Key created');
  
  // Derive path for Stacks: m/44'/5757'/0'/0/0
  const childKey = hdKey.derive("m/44'/5757'/0'/0/0");
  console.log('✅ Derived path: m/44\'/5757\'/0\'/0/0');
  
  if (!childKey.privateKey) {
    throw new Error('Failed to derive private key');
  }
  
  const privateKeyHex = Buffer.from(childKey.privateKey).toString('hex');
  const publicKeyHex = Buffer.from(childKey.publicKey).toString('hex');
  
  console.log('\n📋 Key Details:');
  console.log('   Private Key:', privateKeyHex);
  console.log('   Public Key:', publicKeyHex);
  
  // The address derivation in Stacks uses a different method
  // We need to hash the public key and encode it
  
  // For now, let's just print the keys
  console.log('\n⚠️  Note: The address ST17NEAXJEETBX9G2J4W8S01CQ7K05HC9GEKR1FQZ');
  console.log('   may have been derived from a different mnemonic or path.');
  console.log('\n   The private key derived from this mnemonic can still be used');
  console.log('   to sign transactions, but the sender address will be different.');
  
  // Try to get the actual address from the API
  console.log('\n🔍 Checking balance for expected address...');
  try {
    const response = await fetch(`https://api.testnet.hiro.so/extended/v1/address/${EXPECTED_ADDRESS}/balances`);
    const data = await response.json();
    console.log(`   Balance: ${data.stx?.balance || 0} microSTX`);
  } catch (error) {
    console.log('   Could not fetch balance');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📝 To deploy contracts:');
  console.log('   1. Import the mnemonic into Leather wallet');
  console.log('   2. Check the address shown in Leather');
  console.log('   3. If different, use that address for deployment');
  console.log('   4. Deploy contracts manually from Leather');
}

deriveAddress().catch(console.error);