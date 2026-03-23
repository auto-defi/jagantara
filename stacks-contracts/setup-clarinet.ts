/**
 * Clarinet setup for vitest - runs before each test file
 * This file initializes the simnet and makes it available globally
 */
import { initSimnet } from "@stacks/clarinet-sdk";

// Track initialization state
let simnetInstance: any = null;

// Initialize simnet synchronously using top-level await
export async function setup() {
  if (!simnetInstance) {
    try {
      simnetInstance = await initSimnet("./Clarinet.toml");
      (globalThis as any).simnet = simnetInstance;
      console.log("Simnet initialized successfully");
    } catch (error) {
      console.error("Failed to initialize simnet:", error);
      throw error;
    }
  }
  return simnetInstance;
}

// Auto-initialize
setup();

// Export for direct import in tests
export function getSimnet() {
  if (!simnetInstance) {
    throw new Error("Simnet not initialized. Call setup() first.");
  }
  return simnetInstance;
}
