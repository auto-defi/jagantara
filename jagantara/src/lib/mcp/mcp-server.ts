// lib/mcp-server.ts - Fixed MCP Server Configuration
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  principalCV,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function parseContractId(contractId: string): { address: string; name: string } {
  const parts = contractId.split(".");
  if (parts.length !== 2) throw new Error(`Invalid contract id: ${contractId}`);
  return { address: parts[0], name: parts[1] };
}

function isTestnet(): boolean {
  return (process.env.NEXT_PUBLIC_NETWORK || "testnet") === "testnet";
}
class JagantaraMCPServer {
  private server: Server;
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY!
    );
    this.server = new Server(
      {
        name: "jagantara-web3-insurance",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
  }

  private setupTools() {
    // Insurance quote generation tool
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "generate_insurance_quote",
          description: "Generate personalized insurance quotes for web3 assets",
          inputSchema: {
            type: "object",
            properties: {
              asset_type: {
                type: "string",
                description:
                  "Type of asset to insure (NFT, DeFi, Smart Contract, etc.)",
              },
              asset_value: {
                type: "number",
                description: "Value of the asset in USD",
              },
              risk_level: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "Risk assessment level",
              },
              coverage_period: {
                type: "number",
                description: "Coverage period in months",
              },
            },
            required: [
              "asset_type",
              "asset_value",
              "risk_level",
              "coverage_period",
            ],
          },
        },
        {
          name: "analyze_smart_contract",
          description:
            "Analyze smart contract for insurance coverage assessment",
          inputSchema: {
            type: "object",
            properties: {
              contract_address: {
                type: "string",
                description: "Smart contract address",
              },
              network: {
                type: "string",
                description: "Blockchain network (ethereum, polygon, etc.)",
              },
            },
            required: ["contract_address", "network"],
          },
        },
        {
          name: "claim_processing",
          description: "Process insurance claims for web3 assets",
          inputSchema: {
            type: "object",
            properties: {
              claim_type: {
                type: "string",
                description: "Type of claim (hack, exploit, rug pull, etc.)",
              },
              incident_details: {
                type: "string",
                description: "Details of the incident",
              },
              loss_amount: {
                type: "number",
                description: "Amount of loss in USD",
              },
              evidence: {
                type: "string",
                description: "Evidence supporting the claim",
              },
            },
            required: ["claim_type", "incident_details", "loss_amount"],
          },
        },

        // On-chain tools (Stacks testnet)
        {
          name: "buy_insurance_onchain",
          description:
            "(Stacks testnet) Buy an insurance policy by calling insurance-manager.pay-premium. Requires x402 payment proof via API route.",
          inputSchema: {
            type: "object",
            properties: {
              tier: { type: "number", description: "Tier (1-3)" },
              duration: { type: "number", description: "Duration multiplier (e.g. 1 = 30 days)" },
              covered_address: {
                type: "string",
                description: "Stacks principal being covered",
              },
              amount_to_cover: {
                type: "string",
                description: "Amount to cover as uint string (6 decimals if USD-like)",
              },
              payer: {
                type: "string",
                description:
                  "Optional principal expected to have sent the x402 payment transfer. If provided, backend verifies payment sender.",
              },
            },
            required: ["tier", "duration", "covered_address", "amount_to_cover"],
          },
        },
        {
          name: "create_claim_onchain",
          description:
            "(Stacks testnet) Create a claim record by calling claim-manager.submit-claim as contract owner. Requires x402 payment proof via API route.",
          inputSchema: {
            type: "object",
            properties: {
              claimant: {
                type: "string",
                description: "Stacks principal of claimant",
              },
              amount: {
                type: "string",
                description: "Claim amount as uint string",
              },
              payer: {
                type: "string",
                description:
                  "Optional principal expected to have sent the x402 payment transfer. If provided, backend verifies payment sender.",
              },
            },
            required: ["claimant", "amount"],
          },
        },
      ],
    }));

    // Tool execution handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "generate_insurance_quote":
            return await this.generateInsuranceQuote(args);
          case "analyze_smart_contract":
            return await this.analyzeSmartContract(args);
          case "claim_processing":
            return await this.processClaim(args);
          case "buy_insurance_onchain":
            return await this.buyInsuranceOnchain(args);
          case "create_claim_onchain":
            return await this.createClaimOnchain(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: "text",
              text: `Error executing tool: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async buyInsuranceOnchain(args: any) {
    if (!isTestnet()) {
      return {
        content: [
          {
            type: "text",
            text: "buy_insurance_onchain is only enabled on testnet.",
          },
        ],
        isError: true,
      };
    }

    const contractId = mustGetEnv("NEXT_PUBLIC_INSURANCE_MANAGER_CONTRACT_ID");
    const senderKey = mustGetEnv("STACKS_TESTNET_AGENT_PRIVATE_KEY");
    const { address: contractAddress, name: contractName } =
      parseContractId(contractId);

    const tier = BigInt(String(args.tier));
    const duration = BigInt(String(args.duration));
    const coveredAddress = String(args.covered_address);
    const amountToCover = BigInt(String(args.amount_to_cover));

    const tx = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "pay-premium",
      functionArgs: [
        uintCV(tier),
        uintCV(duration),
        principalCV(coveredAddress),
        uintCV(amountToCover),
      ],
      senderKey,
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    });

    const result = await broadcastTransaction(tx as any, new StacksTestnet());

    const txid = (result as any)?.txid || (result as any)?.transactionId;
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: true,
              action: "buy_insurance_onchain",
              contract: contractId,
              txid,
              broadcast: result,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async createClaimOnchain(args: any) {
    if (!isTestnet()) {
      return {
        content: [
          {
            type: "text",
            text: "create_claim_onchain is only enabled on testnet.",
          },
        ],
        isError: true,
      };
    }

    const contractId = mustGetEnv("NEXT_PUBLIC_CLAIM_MANAGER_CONTRACT_ID");
    const senderKey = mustGetEnv("STACKS_TESTNET_AGENT_PRIVATE_KEY");
    const { address: contractAddress, name: contractName } =
      parseContractId(contractId);

    const claimant = String(args.claimant);
    const amount = BigInt(String(args.amount));

    const tx = await makeContractCall({
      contractAddress,
      contractName,
      functionName: "submit-claim",
      functionArgs: [principalCV(claimant), uintCV(amount)],
      senderKey,
      network: new StacksTestnet(),
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    });

    const result = await broadcastTransaction(tx as any, new StacksTestnet());

    const txid = (result as any)?.txid || (result as any)?.transactionId;
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: true,
              action: "create_claim_onchain",
              contract: contractId,
              txid,
              broadcast: result,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async generateInsuranceQuote(args: any) {
    try {
      const tiers = [
        {
          id: "lite",
          name: "Lite",
          claimCap: "$5,000",
          startingPrice: 65,
          maxAssetValue: 5000,
          durations: [1, 3, 6, 12],
          coverage: ["Basic Smart Contract Failure", "Custody Risk"],
          deductible: "$500",
        },
        {
          id: "shield",
          name: "Shield",
          claimCap: "$15,000",
          startingPrice: 145,
          maxAssetValue: 15000,
          durations: [1, 3, 6, 12],
          coverage: [
            "Major Smart Contract Failure",
            "Basic DAO Liability",
            "NFT Theft",
            "Custody Risk",
          ],
          deductible: "$1,000",
        },
        {
          id: "max",
          name: "Max",
          claimCap: "$50,000",
          startingPrice: 205,
          maxAssetValue: 25000,
          durations: [3, 6, 12],
          coverage: [
            "All Shield coverage",
            "Advanced DAO Liability",
            "DeFi Hacks",
            "Optional Audit Review",
          ],
          deductible: "$2,500",
        },
        {
          id: "enterprise",
          name: "Enterprise",
          claimCap: "$100,000+",
          startingPrice: 295,
          custom: true,
          durations: [3, 6, 12],
          coverage: [
            "All Max coverage",
            "Multi-wallet & Cross-chain",
            "Custom treasury options",
            "SLA-backed claims",
          ],
          deductible: "$5,000+",
        },
      ];

      const { asset_type, asset_value, risk_level, coverage_period } = args;
      const numericValue = Number(asset_value);

      // Select tier
      let selectedTier =
        tiers.find(
          (tier) =>
            !tier.custom &&
            numericValue <= (tier.maxAssetValue || Infinity) &&
            tier.durations.includes(coverage_period)
        ) || tiers.find((tier) => tier.custom);

      const basePrice = selectedTier?.startingPrice;
      const multiplier =
        risk_level === "high" ? 1.5 : risk_level === "low" ? 0.9 : 1;
      const totalPremium = basePrice! * coverage_period * multiplier;

      // Ask Gemini to generate a reasoning paragraph
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
      });

      const explanationPrompt = `
You are an insurance advisor. Explain in 3–4 sentences why the following insurance tier is the best choice based on the user's inputs.

Tier 🛡️: ${selectedTier?.name}
Asset Value 💰: $${numericValue}
Risk Level ⚠️: ${risk_level}
Coverage Period 📅: ${coverage_period} months
Coverage ✅: ${selectedTier?.coverage.join(", ")}
Premium 💸: $${totalPremium.toFixed(2)}
Claim Cap 🧾: ${selectedTier?.claimCap}
Deductible 📉: ${selectedTier?.deductible}

Make the response sound clear and supportive without technical jargon.
`;

      const result = await model.generateContent(explanationPrompt);
      const reasoning = await result.response.text();

      // Compose final quote (no formatting, no emojis)
      const quoteText = `
📄 Insurance Quote Summary

Selected Plan 🛡️: ${selectedTier?.name}
Asset Type 🪙: ${asset_type}
Asset Value 💰: $${numericValue}
Risk Level ⚠️: ${risk_level}
Coverage Period 📅: ${coverage_period} months

Premium 💸: $${totalPremium.toFixed(2)}
Claim Cap 🧾: ${selectedTier?.claimCap}
Deductible 📉: ${selectedTier?.deductible}

🛡️ Coverage Includes:
${selectedTier?.coverage.map((c) => `- ${c}`).join("\n")}

📌 Terms and Conditions:
- Subject to on-chain verification 🔗
- SLA response within 5 business days ⏱️

🔍 Recommendation:
${reasoning.trim()}
    `.trim();

      console.log("Generated Insurance Quote:", quoteText);

      return {
        content: [
          {
            type: "text",
            text: quoteText,
          },
        ],
      };
    } catch (error) {
      console.error("Error generating insurance quote:", error);
      return {
        content: [
          {
            type: "text",
            text:
              "Error generating insurance quote: " +
              (error instanceof Error ? error.message : String(error)),
          },
        ],
        isError: true,
      };
    }
  }

  private async analyzeSmartContract(args: any) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
      });

      const prompt = `
        Analyze the smart contract at address ${args.contract_address} on ${args.network} network for insurance purposes.
        
        Please provide:
        1. Security assessment
        2. Risk factors
        3. Audit status
        4. Recommended coverage type
        5. Premium adjustment factors
        
        Note: This is a simulated analysis for demonstration purposes.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      console.log("Smart Contract Analysis:", responseText);

      return {
        content: [
          {
            type: "text",
            text: responseText,
          },
        ],
      };
    } catch (error) {
      console.error("Error analyzing smart contract:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error analyzing smart contract: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async processClaim(args: any) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
      });

      const prompt = `
        Process an insurance claim with the following details:
        - Claim Type: ${args.claim_type}
        - Incident Details: ${args.incident_details}
        - Loss Amount: ${args.loss_amount}
        - Evidence: ${args.evidence || "No evidence provided"}
        
        Please provide:
        1. Initial claim assessment
        2. Required documentation
        3. Investigation steps
        4. Estimated processing time
        5. Preliminary approval status
        
        Format as a professional claim processing report.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      console.log("Claim Processing Result:", responseText);

      return {
        content: [
          {
            type: "text",
            text: responseText,
          },
        ],
      };
    } catch (error) {
      console.error("Error processing claim:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error processing claim: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log("Jagantara MCP Server running on stdio");
  }
}

const server = new JagantaraMCPServer();
server.run();

export default JagantaraMCPServer;
