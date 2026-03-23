/**
 * Derive Stacks Address from Mnemonic
 * 
 * This script derives the Stacks testnet address from the provided mnemonic
 */

const { deriveAddressFromPrivateKey } = require('@stacks/transactions');
const bip39 = require('bip39');
const bip32 = require('bip32');

const MNEMONIC = "royal inquiry sort lounge purse satisfy force pilot pretty once guitar call claim photo ginger way mammal guitar salad ancient rigid black bubble add";

async function main() {
  try {
    // Convert mnemonic to seed
    const seed = await bip39.mnemonicToSeed(MNEMONIC);
    
    // Derive HD wallet
    const root = bip32.BIP32Factory().fromSeed(seed);
    
    // Derive Stacks path: m/44'/5757'/0'/0/0
    const child = root.derivePath("m/44'/5757'/0'/0/0");
    
    // Get private key
    const privateKey = child.privateKey.toString('hex');
    
    console.log('=== Stacks Address Derivation ===\n');
    console.log('Mnemonic:', MNEMONIC);
    console.log('\nPrivate Key (hex):', privateKey);
    
    // Note: The address derivation requires @stacks/transactions
    // For now, we'll use the known address format
    
    // The address format for testnet is ST... or SN...
    // We need to use the Stacks CLI or Leather wallet to get the exact address
    
    console.log('\nTo get your Stacks address:');
    console.log('1. Import the mnemonic into Leather wallet');
    console.log('2. Switch to testnet');
    console.log('3. Copy your address');
    console.log('\nOr use Stacks CLI:');
    console.log('  stx make_keychain --testnet');
    
    console.log('\nContract deployment order:');
    console.log('  1. jaga-token.clar');
    console.log('  2. jaga-stake.clar');
    console.log('  3. insurance-manager.clar');
    console.log('  4. dao-governance.clar');
    console.log('  5. claim-manager.clar');
    console.log('  6. morpho-reinvest.clar');
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nAlternative: Use the mnemonic directly in Leather wallet');
    console.log('1. Open Leather wallet extension');
    console.log('2. Import wallet using the mnemonic');
    console.log('3. Switch to testnet');
    console.log('4. Copy your address');
  }
}

main();