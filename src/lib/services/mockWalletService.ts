import { writable } from 'svelte/store';

// Mock wallet data
export const isMockWalletEnabled = writable(false);
export const mockAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

// Enable mock wallet for development
export function enableMockWallet() {
  // Add mock ethereum object to window if it doesn't exist
  if (typeof window !== 'undefined' && !window.ethereum) {
    window.ethereum = {
      isMetaMask: true,
      selectedAddress: mockAddress,
      chainId: '0x1', // Ethereum mainnet
      
      request: async (request: { method: string; params?: any[] }) => {
        if (request.method === 'eth_requestAccounts') {
          return [mockAddress];
        }
        if (request.method === 'eth_chainId') {
          return '0x1';
        }
        return null;
      },
      
      on: (event: string, callback: (...args: any[]) => void) => {
        // Mock implementation
      },
      
      removeListener: (event: string, callback: (...args: any[]) => void) => {
        // Mock implementation
      },
      
      isConnected: () => true
    };
  }
  
  isMockWalletEnabled.set(true);
}

// Disable mock wallet
export function disableMockWallet() {
  isMockWalletEnabled.set(false);
}