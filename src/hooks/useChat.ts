import { useState, useCallback } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  toolCall?: {
    name: string;
    arguments: any;
    result?: any;
  };
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Tool selection & argument extraction
      let toolCall: Message["toolCall"] | null = null;
      let response = "";

      if (
        content.toLowerCase().includes("quote") ||
        content.toLowerCase().includes("insurance")
      ) {
        const assetType = extractAssetType(content);
        const assetValue = extractAssetValue(content);
        const riskLevel = extractRiskLevel(content);
        const coveragePeriod = extractCoveragePeriod(content);

        if (assetType && assetValue && riskLevel && coveragePeriod) {
          toolCall = {
            name: "generate_insurance_quote",
            arguments: { assetType, assetValue, riskLevel, coveragePeriod },
          };
        }
      } else if (
        content.toLowerCase().includes("analyze") ||
        content.toLowerCase().includes("contract")
      ) {
        const contractAddress = extractContractAddress(content);
        const network = extractNetwork(content) || "ethereum";

        if (contractAddress) {
          toolCall = {
            name: "analyze_smart_contract",
            arguments: { contractAddress, network },
          };
        }
      } else if (content.toLowerCase().includes("claim")) {
        const claimType = extractClaimType(content);
        const incidentDetails = content;
        const lossAmount = extractLossAmount(content);

        if (claimType && lossAmount) {
          toolCall = {
            name: "claim_processing",
            arguments: { claimType, incidentDetails, lossAmount },
          };
        }
      }

      if (toolCall) {
        const res = await fetch("/api/mcp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "call",
            name: toolCall.name,
            arguments: toolCall.arguments,
          }),
        });

        const json = await res.json();

        toolCall.result = json.result;
        response = json.result?.[0]?.text || "Tool executed successfully";
      }

      if (!response) {
        response = `I understand you're asking about "${content}". I can help you with:

🔹 **Insurance Quotes**: Ask me to generate a quote for your web3 assets
🔹 **Smart Contract Analysis**: Have me analyze contracts for insurance coverage
🔹 **Claim Processing**: Submit and process insurance claims

Try asking something like: "Generate a quote for my NFT collection worth $10,000"`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        toolCall: toolCall || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, something went wrong while processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
  };
};

// Helper functions for intent extraction
function extractAssetType(content: string): string {
  const patterns = {
    nft: /nft|non-fungible token/i,
    defi: /defi|decentralized finance/i,
    smart_contract: /smart contract|contract/i,
    token: /token|cryptocurrency/i,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(content)) {
      return type;
    }
  }
  return "other";
}

function extractAssetValue(content: string): number | null {
  const match = content.match(/\$?([\d,]+)/);
  return match ? parseInt(match[1].replace(",", "")) : null;
}

function extractRiskLevel(content: string): string {
  if (/high.risk|risky|dangerous/i.test(content)) return "high";
  if (/low.risk|safe|secure/i.test(content)) return "low";
  return "medium";
}

function extractCoveragePeriod(content: string): number {
  const match = content.match(/(\d+)\s*months?/i);
  return match ? parseInt(match[1]) : 12;
}

function extractContractAddress(content: string): string | null {
  const match = content.match(/0x[a-fA-F0-9]{40}/);
  return match ? match[0] : null;
}

function extractNetwork(content: string): string | null {
  const networks = ["ethereum", "polygon", "bsc", "avalanche"];
  const found = networks.find((network) =>
    content.toLowerCase().includes(network)
  );
  return found || null;
}

function extractClaimType(content: string): string | null {
  const types = ["hack", "exploit", "rug pull", "smart contract bug"];
  const found = types.find((type) => content.toLowerCase().includes(type));
  return found || "other";
}

function extractLossAmount(content: string): number | null {
  const match = content.match(/lost?\s*\$?([\d,]+)/i);
  return match ? parseInt(match[1].replace(",", "")) : null;
}
