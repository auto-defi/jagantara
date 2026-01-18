// src/app/api/mcp/route.ts - Fixed API Route
import { NextRequest, NextResponse } from "next/server";
import { JagantaraMCPClient } from "@/lib/mcp/mcp-client";

// Utility to convert camelCase to snake_case
function toSnakeCase(str: string) {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function normalizeArgs(args: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {};
  for (const key in args) {
    if (args[key] !== undefined) {
      normalized[toSnakeCase(key)] = args[key];
    }
  }
  return normalized;
}

// Validate required fields per tool
function validateArgs(toolName: string, args: Record<string, any>): string[] {
  const required: Record<string, string[]> = {
    analyze_smart_contract: ["contract_address", "network"],
    generate_insurance_quote: [
      "asset_type",
      "asset_value",
      "risk_level",
      "coverage_period",
    ],
    claim_processing: ["claim_type", "incident_details", "loss_amount"],
  };

  const expected = required[toolName] || [];
  return expected.filter((key) => args[key] == null);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("✅ Received MCP request:", body);

  const mcp = new JagantaraMCPClient();

  try {
    await mcp.connect();

    if (body.action === "list") {
      const result = await mcp.getAvailableTools();
      return NextResponse.json({ result });
    }

    if (body.action === "call" && body.name && body.arguments) {
      const normalizedArgs = normalizeArgs(body.arguments);
      const missing = validateArgs(body.name, normalizedArgs);

      if (missing.length > 0) {
        return NextResponse.json(
          {
            error: `Missing required parameters for ${body.name}`,
            missing,
          },
          { status: 400 }
        );
      }

      const toolResult = await mcp.callTool(body.name, normalizedArgs);
      const extractedText =
        typeof toolResult === "string"
          ? toolResult
          : (toolResult?.content &&
              Array.isArray(toolResult.content) &&
              toolResult.content[0]?.text) ||
            JSON.stringify(toolResult);

      return NextResponse.json({
        result: [{ text: extractedText }],
      });
    }

    return NextResponse.json(
      { error: "Invalid action or missing parameters" },
      { status: 400 }
    );
  } catch (err) {
    console.error("❌ MCP call error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Unknown server error",
        details: err instanceof Error ? err.stack : undefined,
      },
      { status: 500 }
    );
  } finally {
    await mcp.disconnect();
  }
}

// Helper function to map frontend arguments to server-expected format
function mapArgumentsForTool(toolName: string, args: any): any {
  switch (toolName) {
    case "analyze_smart_contract":
      return {
        contract_address: args.contractAddress || args.contract_address,
        network: args.network,
      };
    case "generate_insurance_quote":
      return {
        asset_type: args.assetType || args.asset_type,
        asset_value: args.assetValue || args.asset_value,
        risk_level: args.riskLevel || args.risk_level,
        coverage_period: args.coveragePeriod || args.coverage_period,
      };
    case "claim_processing":
      return {
        claim_type: args.claimType || args.claim_type,
        incident_details: args.incidentDetails || args.incident_details,
        loss_amount: args.lossAmount || args.loss_amount,
        evidence: args.evidence,
      };
    default:
      return args;
  }
}
