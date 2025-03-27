/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  // interface Error {}
  // interface Locals {}
  // interface PageData {}
  // interface Platform {}
}

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    selectedAddress?: string;
    isConnected?: () => boolean;
    chainId?: string;
  };
}

declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    'on:outclick'?: (e: CustomEvent) => void;
  }
}

export {};
