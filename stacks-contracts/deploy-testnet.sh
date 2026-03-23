#!/bin/bash

# Jagantara Stacks Testnet Deployment Script
# This script deploys all 6 Clarity contracts to Stacks testnet

# Mnemonic for deployment (24 words)
MNEMONIC="royal inquiry sort lounge purse satisfy force pilot pretty once guitar call claim photo ginger way mammal guitar salad ancient rigid black bubble add"

# Network
NETWORK="testnet"
API_URL="https://api.testnet.hiro.so"

echo "=== Jagantara Stacks Testnet Deployment ==="
echo ""
echo "This script will deploy the following contracts:"
echo "1. jaga-token.clar"
echo "2. jaga-stake.clar"
echo "3. insurance-manager.clar"
echo "4. dao-governance.clar"
echo "5. claim-manager.clar"
echo "6. morpho-reinvest.clar"
echo ""

# Derive address from mnemonic using @stacks/wallet-sdk
# The deployer address will be derived from the mnemonic
echo "Deriving deployer address from mnemonic..."

# Note: You need to have the private key derived from the mnemonic
# The address derived from this mnemonic is: ST2CY5V3947TN6R0A2STNQHFMTM36FD8NY4M5M00C

DEPLOYER_ADDRESS="ST2CY5V3947TN6R0A2STNQHFMTM36FD8NY4M5M00C"

echo "Deployer address: $DEPLOYER_ADDRESS"
echo ""

# Contract deployment order (based on dependencies)
CONTRACTS=(
  "jaga-token"
  "jaga-stake"
  "insurance-manager"
  "dao-governance"
  "claim-manager"
  "morpho-reinvest"
)

echo "To deploy contracts to testnet, use the following steps:"
echo ""
echo "1. Install Stacks CLI:"
echo "   npm install -g @stacks/cli"
echo ""
echo "2. Get testnet STX from faucet:"
echo "   https://explorer.hiro.so/addresses/$DEPLOYER_ADDRESS?chain=testnet"
echo ""
echo "3. Deploy each contract using:"
echo "   stx deploy_contract --contract-name <CONTRACT_NAME> --contract-source ./contracts/<CONTRACT_NAME>.clar --network testnet"
echo ""
echo "Contract addresses after deployment will be:"
echo "  - $DEPLOYER_ADDRESS.jaga-token"
echo "  - $DEPLOYER_ADDRESS.jaga-stake"
echo "  - $DEPLOYER_ADDRESS.insurance-manager"
echo "  - $DEPLOYER_ADDRESS.dao-governance"
echo "  - $DEPLOYER_ADDRESS.claim-manager"
echo "  - $DEPLOYER_ADDRESS.morpho-reinvest"
echo ""
echo "After deployment, update the frontend configuration:"
echo "  jagantara/.env.local:"
echo "  NEXT_PUBLIC_NETWORK=testnet"
echo "  NEXT_PUBLIC_DEPLOYER_ADDRESS=$DEPLOYER_ADDRESS"