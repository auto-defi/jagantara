/**
 * Jagantara - Stacks Wallet Hook
 *
 * Hook for managing Stacks wallet connection using @stacks/connect
 */

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { showConnect, UserSession, AppConfig } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

// App configuration for Stacks Connect
const appConfig = new AppConfig(
  ['store_write', 'publish_data'],
  typeof window !== 'undefined' ? window.location.origin : ''
);

export const userSession = new UserSession({ appConfig });

// Network configuration
export const getStacksNetwork = () => {
  const networkName = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
  return networkName === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
};

export interface StacksWalletState {
  isConnected: boolean;
  address: string | null;
  stxAddress: string | null;
  btcAddress: string | null;
  publicKey: string | null;
  isConnecting: boolean;
}

interface StacksWalletContextValue extends StacksWalletState {
  connect: () => void;
  disconnect: () => void;
  userSession: UserSession;
}

const StacksWalletContext = createContext<StacksWalletContextValue | null>(null);

export const useStacksWallet = () => {
  const [state, setState] = useState<StacksWalletState>({
    isConnected: false,
    address: null,
    stxAddress: null,
    btcAddress: null,
    publicKey: null,
    isConnecting: false,
  });

  const updateWalletState = useCallback((userData: any) => {
    const profile = userData.profile || {};
    const stxAddress =
      profile.stxAddress?.testnet || profile.stxAddress?.mainnet || null;
    const btcAddress =
      profile.btcAddress?.testnet || profile.btcAddress?.mainnet || null;

    setState({
      isConnected: true,
      address: stxAddress,
      stxAddress: stxAddress,
      btcAddress: btcAddress,
      publicKey: profile.publicKey || null,
      isConnecting: false,
    });
  }, []);

  // Check if already connected on mount
  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData: any) => {
        updateWalletState(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      updateWalletState(userData);
    }
  }, [updateWalletState]);

  const connect = useCallback(async () => {
    setState((prev: StacksWalletState) => ({ ...prev, isConnecting: true }));

    showConnect({
      appDetails: {
        name: 'Jagantara',
        icon:
          typeof window !== 'undefined'
            ? `${window.location.origin}/jagantara_icon.png`
            : '',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        updateWalletState(userData);
      },
      onCancel: () => {
        setState((prev: StacksWalletState) => ({
          ...prev,
          isConnecting: false,
        }));
      },
      userSession,
    });
  }, [updateWalletState]);

  const disconnect = useCallback(() => {
    userSession.signUserOut();
    setState({
      isConnected: false,
      address: null,
      stxAddress: null,
      btcAddress: null,
      publicKey: null,
      isConnecting: false,
    });
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    userSession,
  };
};

// Context Provider for Stacks Wallet
export const StacksWalletProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useStacksWallet();

  return (
    <StacksWalletContext.Provider value={wallet}>
      {children}
    </StacksWalletContext.Provider>
  );
};

export const useStacksWalletContext = () => {
  const context = useContext(StacksWalletContext);
  if (!context) {
    throw new Error(
      'useStacksWalletContext must be used within a StacksWalletProvider'
    );
  }
  return context;
};

export default useStacksWallet;

