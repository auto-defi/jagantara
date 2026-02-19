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
