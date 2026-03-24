/**
 * Clarinet setup for vitest - runs before each test file
 * This file initializes the simnet and makes it available globally
 */
import { initSimnet } from "@stacks/clarinet-sdk";

// Track initialization state
let simnetInstance: any = null;
let simnetInitPromise: Promise<any> | null = null;

// Initialize simnet synchronously using top-level await
export async function setup() {
  if (simnetInstance) return simnetInstance;

  // Prevent concurrent initSimnet() calls (can crash WASM with unsafe aliasing).
  if (!simnetInitPromise) {
    simnetInitPromise = (async () => {
      try {
        const sn = await initSimnet("./Clarinet.toml");
        simnetInstance = sn;
        (globalThis as any).simnet = simnetInstance;
        console.log("Simnet initialized successfully");
        return simnetInstance;
      } catch (error) {
        console.error("Failed to initialize simnet:", error);
        // allow retry on next call
        simnetInitPromise = null;
        throw error;
      }
    })();
  }

  return await simnetInitPromise;
}

// Auto-initialize
// Fire-and-forget (safe due to simnetInitPromise guard)
setup().catch(() => void 0);

// Export for direct import in tests
export function getSimnet() {
  if (!simnetInstance) {
    throw new Error("Simnet not initialized. Call setup() first.");
  }
  return simnetInstance;
}
