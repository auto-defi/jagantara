export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
}

export type Policy = {
  tier: bigint;
  startTime: bigint;
  duration: bigint;
  coveredAddress: `0x${string}`;
};
