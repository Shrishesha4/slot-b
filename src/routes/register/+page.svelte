<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { walletAddress, isConnected, registerIdentity } from '$lib/services/blockchainService';
  import { authStore } from '$lib/stores/authStore';
  import Button from '$lib/components/Button.svelte';
  import WalletConnect from '$lib/components/WalletConnect.svelte';
  
  let name = '';
  let email = '';
  let loading = false;
  let error = '';
  
  async function handleRegister() {
    if (!$walletAddress) {
      error = 'Please connect your wallet first';
      return;
    }
    
    try {
      loading = true;
      error = '';
      
      // Register identity on blockchain
      await registerIdentity($walletAddress, {
        name,
        email,
        registeredAt: new Date().toISOString()
      });
      
      // Update auth store
      authStore.login({
        address: $walletAddress,
        name,
        email,
        isVerified: true
      });
      
      // Redirect to dashboard
      goto('/dashboard');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to register identity';
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    // If user is already authenticated, redirect to dashboard
    if ($authStore.isAuthenticated) {
      goto('/dashboard');
    }
  });
</script>

<div class="container mx-auto px-4 py-8">
  <header class="mb-12 flex justify-between items-center">
    <h1 class="text-3xl font-bold text-gray-800">Register Digital Identity</h1>
    <WalletConnect />
  </header>

  <main>
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <h2 class="text-2xl font-semibold mb-6">Create Your Blockchain Identity</h2>
      
      {#if !$isConnected}
        <div class="text-center mb-6">
          <p class="mb-4 text-gray-600">Please connect your wallet to register your identity</p>
          <WalletConnect />
        </div>
      {:else}
        <form on:submit|preventDefault={handleRegister} class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              bind:value={name}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              bind:value={email}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
              {$walletAddress}
            </div>
          </div>
          
          {#if error}
            <p class="text-red-500 text-sm">{error}</p>
          {/if}
          
          <div class="pt-4">
            <Button loading={loading}>Register Identity</Button>
          </div>
        </form>
      {/if}
    </div>
  </main>
</div>