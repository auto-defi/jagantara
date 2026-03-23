/**
 * Jagantara - Wallet Connect Component
 * 
 * Stacks wallet connection using @stacks/connect (Leather, Xverse)
 */

'use client';

import React from 'react';
import { useWallet } from '../../hooks/useWallet';

interface WalletConnectProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
}) => {
  const { isConnected, address, username, isConnecting, connect, disconnect } = useWallet();

  const handleConnect = () => {
    connect();
    onConnect?.();
  };

  const handleDisconnect = () => {
    disconnect();
    onDisconnect?.();
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="wallet-connect">
      {isConnected ? (
        <div className="wallet-connected">
          <div className="wallet-info">
            {username && <span className="wallet-username">{username}</span>}
            {address && (
              <span className="wallet-address">{formatAddress(address)}</span>
            )}
          </div>
          <button
            onClick={handleDisconnect}
            className="wallet-disconnect-btn"
            variant="outline"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="wallet-connect-btn"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}

      <style jsx>{`
        .wallet-connect {
          display: inline-block;
        }

        .wallet-connected {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wallet-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .wallet-username {
          font-size: 14px;
          font-weight: 600;
        }

        .wallet-address {
          font-size: 12px;
          color: #666;
        }

        .wallet-connect-btn,
        .wallet-disconnect-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .wallet-connect-btn {
          background: #5542f6;
          color: white;
          border: none;
        }

        .wallet-connect-btn:hover:not(:disabled) {
          background: #4433c7;
        }

        .wallet-connect-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .wallet-disconnect-btn {
          background: transparent;
          border: 1px solid #ccc;
        }

        .wallet-disconnect-btn:hover {
          border-color: #666;
        }
      `}</style>
    </div>
  );
};

export default WalletConnect;
