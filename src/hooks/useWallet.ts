/**
 * Jagantara - useWallet Hook
 * 
 * React hook for wallet connection using @stacks/connect
 */

import { useState, useEffect, useCallback } from 'react';
import {
  showConnect,
  createUserSession,
  UserSession,
} from '@stacks/connect';
import { APP_DETAILS, AUTH_ORIGIN } from '../lib/stacks/network';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  username: string | null;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useWallet = (): WalletState => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Create user session
  const userSession = new UserSession();

  // Check if already connected on mount
  useEffect(() => {
    if (userSession.isSignInPending()) {
      handlePendingSignIn();
    } else if (userSession.isUserSignedIn()) {
      handleSignedIn();
    }
  }, []);

  // Handle pending sign in
  const handlePendingSignIn = async () => {
    try {
      await userSession.handlePendingSignIn();
      handleSignedIn();
    } catch (error) {
      console.error('Error handling sign in:', error);
      setIsConnecting(false);
    }
  };

  // Handle successful sign in
  const handleSignedIn = () => {
    const userData = userSession.loadUserData();
    setAddress(userData.profile.stxAddress?.testnet || userData.profile.stxAddress?.mainnet || '');
    setUsername(userData.username || null);
    setIsConnected(true);
    setIsConnecting(false);
  };

  // Connect wallet
  const connect = useCallback(() => {
    setIsConnecting(true);
    
    showConnect({
      appDetails: APP_DETAILS,
      authOrigin: AUTH_ORIGIN,
      redirectTo: '/',
      onFinish: () => {
        handlePendingSignIn();
      },
      onCancel: () => {
        setIsConnecting(false);
      },
    });
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    userSession.signUserOut('/');
    setAddress(null);
    setUsername(null);
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    address,
    username,
    isConnecting,
    connect,
    disconnect,
  };
};

export default useWallet;
