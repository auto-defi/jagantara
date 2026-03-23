/**
 * Jagantara Stacks - Simple Contract Validation Tests
 * 
 * Tests to validate that contracts are properly structured
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

// Contract files to validate
const CONTRACTS = [
  "jaga-token",
  "jaga-stake",
  "insurance-manager",
  "dao-governance",
  "claim-manager",
  "morpho-reinvest"
];

describe("Jagantara Stacks - Contract Validation", () => {
  describe("Contract Files", () => {
    CONTRACTS.forEach((contractName) => {
      it(`should have ${contractName}.clar file`, () => {
        const contractPath = path.join(__dirname, "..", "contracts", `${contractName}.clar`);
        expect(fs.existsSync(contractPath)).toBe(true);
      });

      it(`should have valid Clarity syntax in ${contractName}.clar`, () => {
        const contractPath = path.join(__dirname, "..", "contracts", `${contractName}.clar`);
        const content = fs.readFileSync(contractPath, "utf-8");
        
        // Check for basic Clarity keywords
        expect(content).toContain("define-");
        expect(content.length).toBeGreaterThan(100);
      });
    });
  });

  describe("Contract Structure", () => {
    it("should have jaga-token with SIP-010 functions", () => {
      const contractPath = path.join(__dirname, "..", "contracts", "jaga-token.clar");
      const content = fs.readFileSync(contractPath, "utf-8");
      
      // SIP-010 required functions
      expect(content).toContain("define-fungible-token");
      expect(content).toContain("get-name");
      expect(content).toContain("get-symbol");
      expect(content).toContain("get-decimals");
      expect(content).toContain("get-balance");
      expect(content).toContain("get-total-supply");
      expect(content).toContain("transfer");
    });

    it("should have jaga-stake with staking functions", () => {
      const contractPath = path.join(__dirname, "..", "contracts", "jaga-stake.clar");
      const content = fs.readFileSync(contractPath, "utf-8");
      
      expect(content).toContain("stake");
      expect(content).toContain("unstake");
      expect(content).toContain("claim-reward");
    });

    it("should have insurance-manager with premium functions", () => {
      const contractPath = path.join(__dirname, "..", "contracts", "insurance-manager.clar");
      const content = fs.readFileSync(contractPath, "utf-8");
      
      expect(content).toContain("pay-premium");
      expect(content).toContain("initialize-tiers");
      expect(content).toContain("is-active");
    });

    it("should have dao-governance with voting functions", () => {
      const contractPath = path.join(__dirname, "..", "contracts", "dao-governance.clar");
      const content = fs.readFileSync(contractPath, "utf-8");
      
      expect(content).toContain("propose");
      expect(content).toContain("vote");
      expect(content).toContain("execute-proposal");
    });

    it("should have claim-manager with payout functions", () => {
      const contractPath = path.join(__dirname, "..", "contracts", "claim-manager.clar");
      const content = fs.readFileSync(contractPath, "utf-8");
      
      expect(content).toContain("claim-payout");
      expect(content).toContain("get-contract-balance");
    });

    it("should have morpho-reinvest with treasury functions", () => {
      const contractPath = path.join(__dirname, "..", "contracts", "morpho-reinvest.clar");
      const content = fs.readFileSync(contractPath, "utf-8");
      
      expect(content).toContain("reinvest");
      expect(content).toContain("compound-yield");
      expect(content).toContain("get-total-reinvested");
    });
  });

  describe("Clarinet Configuration", () => {
    it("should have valid Clarinet.toml", () => {
      const clarinetPath = path.join(__dirname, "..", "Clarinet.toml");
      expect(fs.existsSync(clarinetPath)).toBe(true);
      
      const content = fs.readFileSync(clarinetPath, "utf-8");
      expect(content).toContain("[project]");
      expect(content).toContain("jagantara-stacks");
    });

    it("should have all contracts defined in Clarinet.toml", () => {
      const clarinetPath = path.join(__dirname, "..", "Clarinet.toml");
      const content = fs.readFileSync(clarinetPath, "utf-8");
      
      CONTRACTS.forEach((contractName) => {
        expect(content).toContain(`[contracts.${contractName}]`);
      });
    });
  });
});