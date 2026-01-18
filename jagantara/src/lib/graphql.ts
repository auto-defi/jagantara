import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: "http://localhost:42069/graphql",
});
// Create HTTP link to Ponder GraphQL endpoint
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Configure caching for paginated results
          stakess: {
            merge: false, // Don't merge, replace completely
            keyArgs: ["orderBy", "orderDirection", "limit"], // Cache based on these args
          },
          unstakess: {
            merge: false,
            keyArgs: ["orderBy", "orderDirection", "limit"],
          },
          rewardClaimss: {
            merge: false,
            keyArgs: ["orderBy", "orderDirection", "limit"],
          },
          rewardSessionss: {
            merge: false,
            keyArgs: ["orderBy", "orderDirection", "limit"],
          },
        },
      },
      // Cache individual records by ID
      stakes: {
        keyFields: ["id"],
      },
      unstakes: {
        keyFields: ["id"],
      },
      rewardClaims: {
        keyFields: ["id"],
      },
      rewardSessions: {
        keyFields: ["id"],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "cache-first", // Use cache first
      notifyOnNetworkStatusChange: false, // Prevent unnecessary re-renders
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first",
    },
  },
  // Add connection retry logic
  connectToDevTools: process.env.NODE_ENV === "development",
});

// GraphQL queries for Stakes
export const GET_RECENT_STAKES = gql`
  query GetRecentStakes($limit: Int = 10) {
    stakess(orderBy: "timestamp", orderDirection: "desc", limit: $limit) {
      items {
        id
        user
        amount
        blockNumber
        timestamp
        transactionHash
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_STAKES_BY_USER = gql`
  query GetStakesByUser($userAddress: String!, $limit: Int = 10) {
    stakess(
      where: { user: $userAddress }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        user
        amount
        blockNumber
        timestamp
        transactionHash
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_STAKE_BY_ID = gql`
  query GetStakeById($id: String!) {
    stakes(id: $id) {
      id
      user
      amount
      blockNumber
      timestamp
      transactionHash
    }
  }
`;

// GraphQL queries for Unstakes
export const GET_RECENT_UNSTAKES = gql`
  query GetRecentUnstakes($limit: Int = 10) {
    unstakess(orderBy: "timestamp", orderDirection: "desc", limit: $limit) {
      items {
        id
        user
        amount
        blockNumber
        timestamp
        transactionHash
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_UNSTAKES_BY_USER = gql`
  query GetUnstakesByUser($userAddress: String!, $limit: Int = 10) {
    unstakess(
      where: { user: $userAddress }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        user
        amount
        blockNumber
        timestamp
        transactionHash
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// GraphQL queries for Reward Claims
export const GET_RECENT_REWARD_CLAIMS = gql`
  query GetRecentRewardClaims($limit: Int = 10) {
    rewardClaimss(orderBy: "timestamp", orderDirection: "desc", limit: $limit) {
      items {
        id
        user
        session
        reward
        blockNumber
        timestamp
        transactionHash
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_REWARD_CLAIMS_BY_USER = gql`
  query GetRewardClaimsByUser($userAddress: String!, $limit: Int = 10) {
    rewardClaimss(
      where: { user: $userAddress }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        user
        session
        reward
        blockNumber
        timestamp
        transactionHash
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_REWARD_CLAIMS_BY_SESSION = gql`
  query GetRewardClaimsBySession($sessionId: BigInt!, $limit: Int = 10) {
    rewardClaimss(
      where: { session: $sessionId }
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        user
        session
        reward
        blockNumber
        timestamp
        transactionHash
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// GraphQL queries for Reward Sessions
export const GET_RECENT_REWARD_SESSIONS = gql`
  query GetRecentRewardSessions($limit: Int = 10) {
    rewardSessionss(
      orderBy: "timestamp"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        session
        totalReward
        totalStaked
        startTime
        endTime
        transactionHash
        timestamp
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_ACTIVE_REWARD_SESSIONS = gql`
  query GetActiveRewardSessions($currentTime: BigInt!, $limit: Int = 10) {
    rewardSessionss(
      where: { startTime_lte: $currentTime, endTime_gte: $currentTime }
      orderBy: "startTime"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        session
        totalReward
        totalStaked
        startTime
        endTime
        transactionHash
        timestamp
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_REWARD_SESSION_BY_ID = gql`
  query GetRewardSessionById($id: String!) {
    rewardSessions(id: $id) {
      id
      session
      totalReward
      totalStaked
      startTime
      endTime
      transactionHash
      timestamp
    }
  }
`;

// Helper function to format BigInt values for GraphQL
export const formatBigIntForGraphQL = (value: bigint): string => {
  return value.toString();
};

// Helper function to parse BigInt values from GraphQL
export const parseBigIntFromGraphQL = (value: string): bigint => {
  return BigInt(value);
};

// Helper function to get current timestamp as BigInt
export const getCurrentTimestampBigInt = (): bigint => {
  return BigInt(Math.floor(Date.now() / 1000));
};

// Type definitions for GraphQL responses
export interface StakeData {
  id: string;
  user: string;
  amount: string; // BigInt as string
  blockNumber: string; // BigInt as string
  timestamp: string; // BigInt as string
  transactionHash: string;
}

export interface UnstakeData {
  id: string;
  user: string;
  amount: string; // BigInt as string
  blockNumber: string; // BigInt as string
  timestamp: string; // BigInt as string
  transactionHash: string;
}

export interface RewardClaimData {
  id: string;
  user: string;
  session: string; // BigInt as string
  reward: string; // BigInt as string
  blockNumber: string; // BigInt as string
  timestamp: string; // BigInt as string
  transactionHash: string;
}

export interface RewardSessionData {
  id: string;
  session: string; // BigInt as string
  totalReward: string; // BigInt as string
  totalStaked: string; // BigInt as string
  startTime: string; // BigInt as string
  endTime?: string; // BigInt as string, optional
  transactionHash: string;
  timestamp: string; // BigInt as string
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageInfo: PageInfo;
  totalCount: number;
}

export const calculateTotalStaked = (
  stakes: StakeData[],
  unstakes: UnstakeData[]
): bigint => {
  const totalStaked = stakes.reduce(
    (sum, stake) => sum + parseBigIntFromGraphQL(stake.amount),
    BigInt(0)
  );
  const totalUnstaked = unstakes.reduce(
    (sum, unstake) => sum + parseBigIntFromGraphQL(unstake.amount),
    BigInt(0)
  );
  return totalStaked - totalUnstaked;
};

export const calculateTotalRewards = (
  rewardClaims: RewardClaimData[]
): bigint => {
  return rewardClaims.reduce(
    (sum, claim) => sum + parseBigIntFromGraphQL(claim.reward),
    BigInt(0)
  );
};
