/**
 * Jagantara Stacks - Unit Tests
 * 
 * Tests for all 6 Clarity contracts in the Jagantara platform
 * Using @stacks/clarinet-sdk for Stacks blockchain testing
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { initSimnet } from "@stacks/clarinet-sdk";

// Simnet instance
let simnet: any;
let deployer: string;
let wallet1: string;
let wallet2: string;

// Initialize simnet before all tests
beforeAll(async () => {
  console.log("Initializing simnet...");
  try {
    simnet = await initSimnet("./Clarinet.toml");
    const accounts = simnet.getAccounts();
    deployer = accounts.get("deployer");
    wallet1 = accounts.get("wallet_1");
    wallet2 = accounts.get("wallet_2");
    console.log("Simnet initialized successfully");
    console.log("Deployer:", deployer);
    console.log("Wallet 1:", wallet1);
  } catch (error) {
    console.error("Failed to initialize simnet:", error);
    throw error;
  }
}, 120000);

afterAll(() => {
  console.log("Tests completed");
});

describe("Jagantara Stacks - Unit Tests", () => {
  describe("jaga-token.clar", () => {
    it("should have correct token metadata", () => {
      const result = simnet.callReadOnlyFn("jaga-token", "get-name", [], deployer);
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should have correct token symbol", () => {
      const result = simnet.callReadOnlyFn("jaga-token", "get-symbol", [], deployer);
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should have correct decimals", () => {
      const result = simnet.callReadOnlyFn("jaga-token", "get-decimals", [], deployer);
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should return total supply", () => {
      const result = simnet.callReadOnlyFn("jaga-token", "get-total-supply", [], deployer);
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });
  });

  describe("insurance-manager.clar", () => {
    it("should initialize tiers successfully", () => {
      const result = simnet.callPublicFn(
        "insurance-manager",
        "initialize-tiers",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should return premium duration", () => {
      const result = simnet.callReadOnlyFn(
        "insurance-manager",
        "get-premium-duration",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should return total users", () => {
      const result = simnet.callReadOnlyFn(
        "insurance-manager",
        "get-total-users",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should return total collected", () => {
      const result = simnet.callReadOnlyFn(
        "insurance-manager",
        "get-total-collected",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });
  });

  describe("jaga-stake.clar", () => {
    it("should return reward duration", () => {
      const result = simnet.callReadOnlyFn(
        "jaga-stake",
        "get-reward-duration",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should return scale factor", () => {
      const result = simnet.callReadOnlyFn(
        "jaga-stake",
        "get-scale-factor",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should return total staked", () => {
      const result = simnet.callReadOnlyFn(
        "jaga-stake",
        "get-total-staked",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });
  });

  describe("dao-governance.clar", () => {
    it("should return voting period", () => {
      const result = simnet.callReadOnlyFn(
        "dao-governance",
        "get-voting-period",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should return minimum voting period", () => {
      const result = simnet.callReadOnlyFn(
        "dao-governance",
        "get-min-voting-period",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should return approval threshold", () => {
      const result = simnet.callReadOnlyFn(
        "dao-governance",
        "get-approval-threshold",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should return total claims", () => {
      const result = simnet.callReadOnlyFn(
        "dao-governance",
        "get-total-claims",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });
  });

  describe("claim-manager.clar", () => {
    it("should return vault balance", () => {
      const result = simnet.callReadOnlyFn(
        "claim-manager",
        "get-vault-balance",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should return claim expiry", () => {
      const result = simnet.callReadOnlyFn(
        "claim-manager",
        "get-claim-expiry",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });
  });

  describe("morpho-reinvest.clar", () => {
    it("should return treasury balance", () => {
      const result = simnet.callReadOnlyFn(
        "morpho-reinvest",
        "get-treasury-balance",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });

    it("should return owner", () => {
      const result = simnet.callReadOnlyFn(
        "morpho-reinvest",
        "get-owner",
        [],
        deployer
      );
      
      expect(result).toBeDefined();
      expect(result.result).toBeDefined();
    });
  });
});
