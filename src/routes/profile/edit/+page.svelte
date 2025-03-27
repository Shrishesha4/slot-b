<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  import Button from '$lib/components/Button.svelte';
  import WalletConnect from '$lib/components/WalletConnect.svelte';
  import { registerIdentity } from '$lib/services/blockchainService';
  
  let name = '';
  let email = '';
  let loading = false;
  let error = '';
  let success = false;
  
  onMount(() => {
    // If user is not authenticated, redirect to login
    if (!$authStore.isAuthenticated) {
      goto('/login');
      return;
    }
    
    // Pre-fill form with existing user data
    if ($authStore.user) {
      name = $authStore.user.name || '';
      email = $authStore.user.email || '';
    }
  });
  
  async function handleUpdate() {
    try {
      loading = true;
      error = '';
      success = false;
      
      if (!$authStore.user?.address) {
        error = 'No wallet address found';
        return;
      }
      
      // Update identity on blockchain
      await registerIdentity($authStore.user.address, {
        name,
        email,
        updatedAt: new Date().toISOString()
      });
      
      // Update auth store
      authStore.updateUser({
        ...$authStore.user,
        name,
        email
      });
      
      success = true;
      
      // Redirect after a short delay
      setTimeout(() => {
        goto('/dashboard');
      }, 1500);
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update profile';
    } finally {
      loading = false;
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <header class="mb-12 flex justify-between items-center">
    <h1 class="text-3xl font-bold text-gray-800">Edit Profile</h1>
    <WalletConnect />
  </header>

  <main>
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <h2 class="text-2xl font-semibold mb-6">Update Your Identity</h2>
      
      {#if success}
        <div class="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6">
          Profile updated successfully!
        </div>
      {/if}
      
      <form on:submit|preventDefault={handleUpdate} class="space-y-4">
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
          <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 break-all">
            {$authStore.user?.address || 'Not connected'}
          </div>
        </div>
        
        {#if error}
          <p class="text-red-500 text-sm">{error}</p>
        {/if}
        
        <div class="pt-4 flex gap-4">
          <Button loading={loading}>Update Profile</Button>
          <Button type="secondary" onClick={() => goto('/dashboard')}>Cancel</Button>
        </div>
      </form>
    </div>
  </main>
</div>