import { ethers } from 'ethers';
import { writable } from 'svelte/store';

// Store for blockchain connection state
export const walletAddress = writable<string | null>(null);
export const isConnected = writable(false);
export const chainId = writable<string | null>(null);

// Simple in-memory identity storage (in a real app, this would be on-chain)
const identities = new Map();

export async function connectWallet() {
  try {
    // Check if ethereum object exists in window
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      
      walletAddress.set(accounts[0]);
      isConnected.set(true);
      chainId.set(network.chainId.toString());
      
      return accounts[0];
    } else {
      // Provide more helpful error message with instructions
      throw new Error("No Ethereum wallet detected. Please install MetaMask or another compatible wallet extension.");
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

export async function disconnectWallet() {
  walletAddress.set(null);
  isConnected.set(false);
  chainId.set(null);
}

export async function registerIdentity(address: string, identityData: any) {
  // In a real implementation, this would create a transaction on the blockchain
  // For demo purposes, we'll just store it in memory
  identities.set(address.toLowerCase(), {
    ...identityData,
    createdAt: Date.now(),
    lastUpdated: Date.now()
  });
  
  return true;
}

export async function getIdentity(address: string) {
  return identities.get(address.toLowerCase()) || null;
}

export async function verifyIdentity(address: string, challenge: string, signature: string) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const recoveredAddress = ethers.verifyMessage(challenge, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error("Error verifying identity:", error);
    return false;
  }
}