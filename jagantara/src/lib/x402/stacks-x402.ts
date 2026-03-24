import { getApiUrl, getDeployerAddress } from "@/lib/stacks/network";

export type X402Action = "buy_insurance_onchain" | "create_claim_onchain";

export type X402PaymentRequirement = {
  action: X402Action;
  headerName: string;
  tokenContractId: string;
  merchantAddress: string;
  amount: bigint;
  network: string;
};

export type X402VerifiedPayment = {
  txid: string;
  tokenContractId: string;
  amount: bigint;
  sender: string;
  recipient: string;
  memo?: string;
};

const DEFAULT_HEADER_NAME = "x-payment-txid";

function envBigInt(name: string, fallback: bigint): bigint {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  if (!/^\d+$/.test(raw)) {
    throw new Error(`Invalid bigint env var ${name}=${raw}`);
  }
  return BigInt(raw);
}

function getTokenContractId(): string {
  return (
    process.env.X402_USDCX_CONTRACT_ID ||
    process.env.NEXT_PUBLIC_USDCX_CONTRACT_ID ||
    ""
  );
}

function getMerchantAddress(): string {
  // User requested: merchant = same as NEXT_PUBLIC_DEPLOYER_ADDRESS.
  return process.env.X402_MERCHANT_ADDRESS || getDeployerAddress() || "";
}

export function getX402Requirement(action: X402Action): X402PaymentRequirement {
  const network = process.env.NEXT_PUBLIC_NETWORK || "testnet";
  const headerName = process.env.X402_HEADER_NAME || DEFAULT_HEADER_NAME;

  const tokenContractId = getTokenContractId();
  if (!tokenContractId) {
    throw new Error(
      "Missing X402_USDCX_CONTRACT_ID (or NEXT_PUBLIC_USDCX_CONTRACT_ID)"
    );
  }

  const merchantAddress = getMerchantAddress();
  if (!merchantAddress) {
    throw new Error("Missing merchant address (NEXT_PUBLIC_DEPLOYER_ADDRESS)");
  }

  const amount =
    action === "buy_insurance_onchain"
      ? envBigInt("X402_PRICE_BUY_INSURANCE", BigInt("100000"))
      : envBigInt("X402_PRICE_SUBMIT_CLAIM", BigInt("50000"));

  return {
    action,
    headerName,
    tokenContractId,
    merchantAddress,
    amount,
    network,
  };
}

function parseUIntRepr(repr: string): bigint {
  // e.g. "u100000"
  const m = repr.match(/^u(\d+)$/);
  if (!m) throw new Error(`Expected uint repr, got: ${repr}`);
  return BigInt(m[1]);
}

function parsePrincipalRepr(repr: string): string {
  // e.g. "ST..." or "SP..."
  if (!/^(S[T|P])[A-Z0-9]{38,41}$/.test(repr)) {
    // Keep loose: different lengths for principals.
    // If repr is "'ST..." (rare), strip quotes.
    const stripped = repr.replace(/^'+|'+$/g, "");
    if (/^(S[T|P])[A-Z0-9]{38,41}$/.test(stripped)) return stripped;
    throw new Error(`Expected principal repr, got: ${repr}`);
  }
  return repr;
}

function parseOptionalMemoRepr(repr: string): string | undefined {
  // SIP-010 memo is (optional (buff 34)) so repr may look like:
  // "none" or "(some 0x....)".
  if (repr === "none") return undefined;
  const m = repr.match(/^\(some\s+(0x[0-9a-fA-F]+)\)$/);
  if (!m) return undefined;
  return m[1];
}

export async function verifyUsdcxTransferTxid(options: {
  txid: string;
  expected: X402PaymentRequirement;
  expectedSender?: string;
}): Promise<X402VerifiedPayment> {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}/extended/v1/tx/${options.txid}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Payment lookup failed: ${res.status} ${text}`);
  }

  const tx = (await res.json()) as any;

  if (tx?.tx_status !== "success") {
    throw new Error(`Payment tx not successful (tx_status=${tx?.tx_status})`);
  }
  if (tx?.tx_type !== "contract_call") {
    throw new Error(`Payment tx must be a contract_call (tx_type=${tx?.tx_type})`);
  }

  const contractId = tx?.contract_call?.contract_id;
  const functionName = tx?.contract_call?.function_name;
  const args: Array<{ name: string; repr: string }> =
    tx?.contract_call?.function_args || [];

  if (contractId !== options.expected.tokenContractId) {
    throw new Error(
      `Wrong token contract: expected ${options.expected.tokenContractId}, got ${contractId}`
    );
  }
  if (functionName !== "transfer") {
    throw new Error(`Payment tx must call transfer() (got ${functionName})`);
  }

  const amountArg = args.find((a) => a.name === "amount");
  const senderArg = args.find((a) => a.name === "sender");
  const recipientArg = args.find((a) => a.name === "recipient");
  const memoArg = args.find((a) => a.name === "memo");

  if (!amountArg || !senderArg || !recipientArg) {
    throw new Error(
      `Payment tx missing required args (have: ${args.map((a) => a.name).join(", ")})`
    );
  }

  const amount = parseUIntRepr(amountArg.repr);
  const sender = parsePrincipalRepr(senderArg.repr);
  const recipient = parsePrincipalRepr(recipientArg.repr);
  const memo = memoArg ? parseOptionalMemoRepr(memoArg.repr) : undefined;

  if (recipient !== options.expected.merchantAddress) {
    throw new Error(
      `Wrong recipient: expected ${options.expected.merchantAddress}, got ${recipient}`
    );
  }
  if (amount < options.expected.amount) {
    throw new Error(
      `Insufficient payment: expected >= ${options.expected.amount.toString()}, got ${amount.toString()}`
    );
  }

  if (options.expectedSender && sender !== options.expectedSender) {
    throw new Error(
      `Wrong sender: expected ${options.expectedSender}, got ${sender}`
    );
  }

  return {
    txid: options.txid,
    tokenContractId: contractId,
    amount,
    sender,
    recipient,
    memo,
  };
}
