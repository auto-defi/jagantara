// This project has optional EVM integrations (wagmi/xellar).
// In this workspace environment we run in Stacks-only mode.
//
// Any hook importing this module will intentionally throw if executed,
// but the key purpose is to allow Next.js/webpack to tree-shake and avoid
// bundling missing EVM dependencies during builds.

export const EVM_DISABLED_ERROR = new Error(
  'EVM features are disabled in this build. Enable wagmi/xellar dependencies to use EVM hooks.'
);

