import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./setup-clarinet.ts"],
    globals: true,
    testTimeout: 120000,
    hookTimeout: 120000,
    // Run tests sequentially to avoid simnet initialization issues
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
