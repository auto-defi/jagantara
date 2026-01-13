import { ponder } from "ponder:registry";
import {
  stakes,
  unstakes,
  rewardClaims,
  rewardSessions,
  stakeActionType,
} from "ponder:schema";

// Stake Event
ponder.on("JagaStake:Staked", async ({ event, context }) => {
  const { user, amount } = event.args;

  await context.db.insert(stakes).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    user: user,
    amount: amount,
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    action: "STAKE",
  });
});

// Unstake Event
ponder.on("JagaStake:Unstaked", async ({ event, context }) => {
  const { user, amount } = event.args;

  await context.db.insert(unstakes).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    user: user,
    amount: amount,
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    action: "UNSTAKE",
  });
});

// Reward Claimed Event
// Reward Paid Event
// ponder.on("JagaStake:RewardPaid", async ({ event, context }) => {
//   const { user, reward } = event.args;

//   await context.db.insert(rewardClaims).values({
//     id: `${event.transaction.hash}-${event.log.logIndex}`,
//     user: user,
//     reward: reward,
//     blockNumber: event.block.number,
//     timestamp: event.block.timestamp,
//     transactionHash: event.transaction.hash,
//   });
// });
