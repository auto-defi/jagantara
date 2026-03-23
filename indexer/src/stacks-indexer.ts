/**
 * Jagantara - Stacks Indexer
 * 
 * Indexes events from Stacks blockchain for the Jagantara insurance platform
 */

import { StacksApiSocket } from '@stacks/stacks-blockchain-api-client';

// Configuration
const CONFIG = {
  network: process.env.NETWORK || 'testnet',
  api_url: process.env.STACKS_API_URL || 'https://api.testnet.hiro.so',
  websocket_url: process.env.STACKS_WS_URL || 'wss://api.testnet.hiro.so',
  poll_interval: parseInt(process.env.POLL_INTERVAL || '10000'),
  contract_addresses: {
    jagaToken: process.env.JAGA_TOKEN_ADDRESS || '',
    jagaStake: process.env.JAGA_STAKE_ADDRESS || '',
    insuranceManager: process.env.INSURANCE_MANAGER_ADDRESS || '',
    daoGovernance: process.env.DAO_GOVERNANCE_ADDRESS || '',
    claimManager: process.env.CLAIM_MANAGER_ADDRESS || '',
    morphoReinvest: process.env.MORPHO_REINVEST_ADDRESS || '',
  },
};

// Event types from Clarity contracts
interface StacksEvent {
  event_type: string;
  contract_id: string;
  topic: string;
  value: any;
  tx_id: string;
  block_height: number;
  timestamp: number;
}

// Indexed data types
interface Policy {
  id: string;
  user: string;
  tier: number;
  amountToCover: bigint;
  premium: bigint;
  startTime: number;
  endTime: number;
  isActive: boolean;
}

interface Stake {
  id: string;
  user: string;
  amount: bigint;
  rewards: bigint;
  startTime: number;
  isActive: boolean;
}

interface Claim {
  id: string;
  submitter: string;
  reason: string;
  title: string;
  claimType: number;
  amount: bigint;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  createdAt: number;
}

interface Transaction {
  id: string;
  type: 'stake' | 'unstake' | 'premium' | 'claim' | 'reward' | 'payout';
  user: string;
  amount: bigint;
  txId: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

// In-memory storage (replace with database in production)
const policies = new Map<string, Policy>();
const stakes = new Map<string, Stake>();
const claims = new Map<string, Claim>();
const transactions: Transaction[] = [];

/**
 * Stacks Indexer Class
 */
export class StacksIndexer {
  private apiUrl: string;
  private wsUrl: string;
  private socket: StacksApiSocket | null = null;
  private pollInterval: NodeJS.Timeout | null = null;
  private lastProcessedBlock: number = 0;

  constructor(config: typeof CONFIG) {
    this.apiUrl = config.api_url;
    this.wsUrl = config.websocket_url;
  }

  /**
   * Start the indexer
   */
  async start(): Promise<void> {
    console.log('Starting Stacks Indexer...');
    
    // Get last processed block
    this.lastProcessedBlock = await this.getLastProcessedBlock();
    console.log(`Last processed block: ${this.lastProcessedBlock}`);

    // Start polling for new blocks
    this.startPolling();
    
    // Connect to WebSocket for real-time updates
    await this.connectWebSocket();
    
    console.log('Stacks Indexer started successfully');
  }

  /**
   * Stop the indexer
   */
  async stop(): Promise<void> {
    console.log('Stopping Stacks Indexer...');
    
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    
    if (this.socket) {
      this.socket.close();
    }
    
    console.log('Stacks Indexer stopped');
  }

  /**
   * Get last processed block from storage
   */
  private async getLastProcessedBlock(): Promise<number> {
    try {
      const response = await fetch(
        `${this.apiUrl}/extended/v1/block?limit=1`
      );
      const data = await response.json();
      return data.results?.[0]?.height || 0;
    } catch (error) {
      console.error('Error fetching last block:', error);
      return 0;
    }
  }

  /**
   * Start polling for new blocks
   */
  private startPolling(): void {
    this.pollInterval = setInterval(async () => {
      await this.pollNewBlocks();
    }, CONFIG.poll_interval);
  }

  /**
   * Poll for new blocks
   */
  private async pollNewBlocks(): Promise<void> {
    try {
      const response = await fetch(
        `${this.apiUrl}/extended/v1/block?limit=1`
      );
      const data = await response.json();
      const currentBlock = data.results?.[0]?.height || 0;

      if (currentBlock > this.lastProcessedBlock) {
        console.log(`Processing blocks ${this.lastProcessedBlock + 1} to ${currentBlock}`);
        await this.processBlocks(this.lastProcessedBlock + 1, currentBlock);
        this.lastProcessedBlock = currentBlock;
      }
    } catch (error) {
      console.error('Error polling blocks:', error);
    }
  }

  /**
   * Process blocks in range
   */
  private async processBlocks(startBlock: number, endBlock: number): Promise<void> {
    for (let block = startBlock; block <= endBlock; block++) {
      await this.processBlock(block);
    }
  }

  /**
   * Process a single block
   */
  private async processBlock(blockHeight: number): Promise<void> {
    try {
      // Fetch transactions for each contract
      for (const [name, address] of Object.entries(CONFIG.contract_addresses)) {
        if (!address) continue;
        
        const response = await fetch(
          `${this.apiUrl}/extended/v1/tx/block/${blockHeight}?contract_id=${address}`
        );
        const data = await response.json();
        
        if (data.results) {
          for (const tx of data.results) {
            await this.processTransaction(tx, name);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing block ${blockHeight}:`, error);
    }
  }

  /**
   * Process a transaction
   */
  private async processTransaction(tx: any, contractName: string): Promise<void> {
    // Extract events from transaction
    if (tx.events) {
      for (const event of tx.events) {
        await this.processEvent(event, tx, contractName);
      }
    }
  }

  /**
   * Process an event
   */
  private async processEvent(event: any, tx: any, contractName: string): Promise<void> {
    const eventData: StacksEvent = {
      event_type: event.event_type,
      contract_id: event.contract_id,
      topic: event.topic || '',
      value: event.value,
      tx_id: tx.tx_id,
      block_height: tx.block_height,
      timestamp: tx.burn_block_time * 1000,
    };

    // Handle different event types
    switch (contractName) {
      case 'jagaToken':
        await this.handleJagaTokenEvent(eventData);
        break;
      case 'jagaStake':
        await this.handleJagaStakeEvent(eventData);
        break;
      case 'insuranceManager':
        await this.handleInsuranceManagerEvent(eventData);
        break;
      case 'daoGovernance':
        await this.handleDAOGovernanceEvent(eventData);
        break;
      case 'claimManager':
        await this.handleClaimManagerEvent(eventData);
        break;
      case 'morphoReinvest':
        await this.handleMorphoReinvestEvent(eventData);
        break;
    }
  }

  /**
   * Handle JagaToken events
   */
  private async handleJagaTokenEvent(event: StacksEvent): Promise<void> {
    if (event.topic === 'tokens-minted') {
      console.log(`JagaToken minted: ${event.value.amount} to ${event.value.to}`);
      // Add transaction record
      transactions.push({
        id: `${event.tx_id}-mint`,
        type: 'stake',
        user: event.value.to,
        amount: BigInt(event.value.amount),
        txId: event.tx_id,
        timestamp: event.timestamp,
        status: 'confirmed',
      });
    } else if (event.topic === 'tokens-burned') {
      console.log(`JagaToken burned: ${event.value.amount} by ${event.value.burner}`);
    } else if (event.topic === 'tokens-transferred') {
      console.log(`JagaToken transferred: ${event.value.amount} from ${event.value.from} to ${event.value.to}`);
    }
  }

  /**
   * Handle JagaStake events
   */
  private async handleJagaStakeEvent(event: StacksEvent): Promise<void> {
    if (event.topic === 'staked') {
      console.log(`Staked: ${event.value.amount} by ${event.value.user}`);
      
      const stake: Stake = {
        id: `${event.value.user}-${event.block_height}`,
        user: event.value.user,
        amount: BigInt(event.value.amount),
        rewards: BigInt(0),
        startTime: event.timestamp,
        isActive: true,
      };
      stakes.set(stake.id, stake);
      
      transactions.push({
        id: `${event.tx_id}-stake`,
        type: 'stake',
        user: event.value.user,
        amount: BigInt(event.value.amount),
        txId: event.tx_id,
        timestamp: event.timestamp,
        status: 'confirmed',
      });
    } else if (event.topic === 'unstaked') {
      console.log(`Unstaked: ${event.value.amount} by ${event.value.user}`);
      
      transactions.push({
        id: `${event.tx_id}-unstake`,
        type: 'unstake',
        user: event.value.user,
        amount: BigInt(event.value.amount),
        txId: event.tx_id,
        timestamp: event.timestamp,
        status: 'confirmed',
      });
    } else if (event.topic === 'reward-claimed') {
      console.log(`Reward claimed: ${event.value.amount} by ${event.value.user}`);
      
      transactions.push({
        id: `${event.tx_id}-reward`,
        type: 'reward',
        user: event.value.user,
        amount: BigInt(event.value.amount),
        txId: event.tx_id,
        timestamp: event.timestamp,
        status: 'confirmed',
      });
    }
  }

  /**
   * Handle InsuranceManager events
   */
  private async handleInsuranceManagerEvent(event: StacksEvent): Promise<void> {
    if (event.topic === 'premium-paid') {
      console.log(`Premium paid: ${event.value.amount} by ${event.value.user}`);
      
      const policy: Policy = {
        id: `${event.value.user}-${event.block_height}`,
        user: event.value.user,
        tier: event.value.tier,
        amountToCover: BigInt(event.value.amount_to_cover),
        premium: BigInt(event.value.amount),
        startTime: event.timestamp,
        endTime: event.timestamp + (event.value.duration * 600000), // blocks to ms
        isActive: true,
      };
      policies.set(policy.id, policy);
      
      transactions.push({
        id: `${event.tx_id}-premium`,
        type: 'premium',
        user: event.value.user,
        amount: BigInt(event.value.amount),
        txId: event.tx_id,
        timestamp: event.timestamp,
        status: 'confirmed',
      });
    } else if (event.topic === 'revenue-transferred') {
      console.log(`Revenue transferred: ${event.value.amount}`);
    }
  }

  /**
   * Handle DAOGovernance events
   */
  private async handleDAOGovernanceEvent(event: StacksEvent): Promise<void> {
    if (event.topic === 'claim-submitted') {
      console.log(`Claim submitted: ${event.value.claim_id} by ${event.value.submitter}`);
      
      const claim: Claim = {
        id: event.value.claim_id,
        submitter: event.value.submitter,
        reason: event.value.reason,
        title: event.value.title,
        claimType: event.value.claim_type,
        amount: BigInt(event.value.amount),
        status: 'pending',
        votesFor: 0,
        votesAgainst: 0,
        createdAt: event.timestamp,
      };
      claims.set(claim.id, claim);
    } else if (event.topic === 'voted') {
      console.log(`Vote cast: ${event.value.approve ? 'for' : 'against'} claim ${event.value.claim_id}`);
      
      const claim = claims.get(event.value.claim_id);
      if (claim) {
        if (event.value.approve) {
          claim.votesFor += 1;
        } else {
          claim.votesAgainst += 1;
        }
        claims.set(claim.id, claim);
      }
    } else if (event.topic === 'vote-executed') {
      console.log(`Vote executed for claim ${event.value.claim_id}`);
      
      const claim = claims.get(event.value.claim_id);
      if (claim) {
        claim.status = event.value.approved ? 'approved' : 'rejected';
        claims.set(claim.id, claim);
      }
    }
  }

  /**
   * Handle ClaimManager events
   */
  private async handleClaimManagerEvent(event: StacksEvent): Promise<void> {
    if (event.topic === 'payout-claimed') {
      console.log(`Payout claimed: ${event.value.amount} for claim ${event.value.claim_id}`);
      
      const claim = claims.get(event.value.claim_id);
      if (claim) {
        claim.status = 'executed';
        claims.set(claim.id, claim);
      }
      
      transactions.push({
        id: `${event.tx_id}-payout`,
        type: 'payout',
        user: event.value.recipient,
        amount: BigInt(event.value.amount),
        txId: event.tx_id,
        timestamp: event.timestamp,
        status: 'confirmed',
      });
    }
  }

  /**
   * Handle MorphoReinvest events
   */
  private async handleMorphoReinvestEvent(event: StacksEvent): Promise<void> {
    if (event.topic === 'deposited') {
      console.log(`Treasury deposit: ${event.value.amount}`);
    } else if (event.topic === 'withdrawn') {
      console.log(`Treasury withdrawal: ${event.value.amount} to ${event.value.to}`);
    }
  }

  /**
   * Connect to WebSocket for real-time updates
   */
  private async connectWebSocket(): Promise<void> {
    try {
      // Note: WebSocket connection for real-time updates
      // This would use @stacks/stacks-blockchain-api-client
      console.log('WebSocket connection would be established here');
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
    }
  }

  // Public API methods for querying indexed data

  /**
   * Get policy by user address
   */
  getPolicy(user: string): Policy | undefined {
    for (const policy of policies.values()) {
      if (policy.user === user && policy.isActive) {
        return policy;
      }
    }
    return undefined;
  }

  /**
   * Get all active policies
   */
  getActivePolicies(): Policy[] {
    return Array.from(policies.values()).filter(p => p.isActive);
  }

  /**
   * Get stake by user address
   */
  getStake(user: string): Stake | undefined {
    for (const stake of stakes.values()) {
      if (stake.user === user && stake.isActive) {
        return stake;
      }
    }
    return undefined;
  }

  /**
   * Get all active stakes
   */
  getActiveStakes(): Stake[] {
    return Array.from(stakes.values()).filter(s => s.isActive);
  }

  /**
   * Get claim by ID
   */
  getClaim(claimId: string): Claim | undefined {
    return claims.get(claimId);
  }

  /**
   * Get all claims
   */
  getAllClaims(): Claim[] {
    return Array.from(claims.values());
  }

  /**
   * Get pending claims
   */
  getPendingClaims(): Claim[] {
    return Array.from(claims.values()).filter(c => c.status === 'pending');
  }

  /**
   * Get transactions by user
   */
  getTransactions(user: string): Transaction[] {
    return transactions.filter(t => t.user === user);
  }

  /**
   * Get all transactions
   */
  getAllTransactions(): Transaction[] {
    return transactions;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalPolicies: policies.size,
      activePolicies: Array.from(policies.values()).filter(p => p.isActive).length,
      totalStakes: stakes.size,
      activeStakes: Array.from(stakes.values()).filter(s => s.isActive).length,
      totalClaims: claims.size,
      pendingClaims: Array.from(claims.values()).filter(c => c.status === 'pending').length,
      totalTransactions: transactions.length,
    };
  }
}

// Export singleton instance
export const indexer = new StacksIndexer(CONFIG);

// Start indexer if run directly
if (require.main === module) {
  indexer.start().catch(console.error);
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await indexer.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await indexer.stop();
    process.exit(0);
  });
}

export default StacksIndexer;