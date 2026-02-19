import { onchainTable, index, onchainEnum } from "ponder";

// === ENUMS ===

// If you have event types in your logic (not needed now, but optional)
export const stakeActionType = onchainEnum("stake_action_type", [
  "STAKE",
  "UNSTAKE",
  "CLAIM",
]);

// === STAKE EVENTS ===

export const stakes = onchainTable(
  "stakes",
  (t) => ({
    id: t.text().primaryKey(), // txHash-logIndex
    user: t.hex().notNull(),
    amount: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
  }),
  (table) => ({
    userIdx: index().on(table.user),
    timestampIdx: index().on(table.timestamp),
  })
);

// === UNSTAKE EVENTS ===

export const unstakes = onchainTable(
  "unstakes",
  (t) => ({
    id: t.text().primaryKey(),
    user: t.hex().notNull(),
    amount: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
  }),
  (table) => ({
    userIdx: index().on(table.user),
    timestampIdx: index().on(table.timestamp),
  })
);

// === CLAIM EVENTS ===

export const rewardClaims = onchainTable(
  "reward_claims",
  (t) => ({
    id: t.text().primaryKey(),
    user: t.hex().notNull(),
    session: t.bigint().notNull(),
    reward: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
  }),
  (table) => ({
    userIdx: index().on(table.user),
    sessionIdx: index().on(table.session),
    timestampIdx: index().on(table.timestamp),
  })
);

// === REWARD SESSIONS ===

export const rewardSessions = onchainTable(
  "reward_sessions",
  (t) => ({
    id: t.text().primaryKey(), // sessionId as string
    session: t.bigint().notNull(),
    totalReward: t.bigint().notNull(),
    totalStaked: t.bigint().notNull(),
    startTime: t.bigint().notNull(),
    endTime: t.bigint(),
    transactionHash: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
  }),
  (table) => ({
    sessionIdx: index().on(table.session),
    timestampIdx: index().on(table.timestamp),
  })
);
