<script lang="ts">
  import { onMount } from 'svelte';
  import { connectWallet, disconnectWallet, walletAddress, isConnected } from '$lib/services/blockchainService';
  import Button from './Button.svelte';
  import { authStore } from '$lib/stores/authStore';
  
  let loading = false;
  let error = '';
  let hasWallet = false;

  // Check if wallet is available
  onMount(() => {
    hasWallet = typeof window !== 'undefined' && !!window.ethereum;
    
    // Check if wallet is already connected
    if (hasWallet && window.ethereum.selectedAddress) {
      handleConnect();
    }
  });

  async function handleConnect() {
    try {
      loading = true;
      error = '';
      await connectWallet();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to connect wallet';
    } finally {
      loading = false;
    }
  }

  async function handleDisconnect() {
    try {
      loading = true;
      await disconnectWallet();
      authStore.logout();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to disconnect wallet';
    } finally {
      loading = false;
    }
  }
</script>

<div class="wallet-connect">
  {#if $isConnected}
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-600">Connected: {$walletAddress?.slice(0, 6)}...{$walletAddress?.slice(-4)}</span>
      <Button type="secondary" onClick={handleDisconnect} loading={loading}>Disconnect</Button>
    </div>
  {:else if hasWallet}
    <Button onClick={handleConnect} loading={loading}>Connect Wallet</Button>
  {:else}
    <div class="flex flex-col items-start gap-2">
      <Button onClick={handleConnect} loading={loading}>Connect Wallet</Button>
      <span class="text-xs text-amber-600">No wallet detected. <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" class="underline">Install MetaMask</a></span>
    </div>
  {/if}
  
  {#if error}
    <p class="text-red-500 text-sm mt-2">{error}</p>
  {/if}
</div>