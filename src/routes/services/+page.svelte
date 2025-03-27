<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  import Button from '$lib/components/Button.svelte';
  import WalletConnect from '$lib/components/WalletConnect.svelte';
  
  // Mock data for demonstration
  const connectedServices = [
    { id: 1, name: 'DeFi App', icon: '💰', connectedAt: '2023-09-20T10:00:00Z', permissions: ['Read profile', 'Authentication'] },
    { id: 2, name: 'NFT Marketplace', icon: '🖼️', connectedAt: '2023-09-15T14:30:00Z', permissions: ['Read profile', 'Authentication', 'Transaction history'] }
  ];
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }
  
  function disconnectService(id) {
    // In a real app, this would call an API to revoke access
    // For demo, we'll just show an alert
    alert(`Service ${id} disconnected successfully`);
  }
  
  onMount(() => {
    // If user is not authenticated, redirect to login
    if (!$authStore.isAuthenticated) {
      goto('/login');
    }
  });
</script>

<div class="container mx-auto px-4 py-8">
  <header class="mb-12 flex justify-between items-center">
    <h1 class="text-3xl font-bold text-gray-800">Connected Services</h1>
    <WalletConnect />
  </header>

  <main>
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">Manage Your Connected Services</h2>
        <Button onClick={() => goto('/services/connect')}>Connect New</Button>
      </div>
      
      {#if connectedServices.length > 0}
        <div class="space-y-6">
          {#each connectedServices as service}
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex items-center">
                  <div class="text-3xl mr-4">{service.icon}</div>
                  <div>
                    <h3 class="text-lg font-medium">{service.name}</h3>
                    <p class="text-sm text-gray-500">Connected on {formatDate(service.connectedAt)}</p>
                  </div>
                </div>
                <Button type="danger" onClick={() => disconnectService(service.id)}>Disconnect</Button>
              </div>
              
              <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
                <div class="flex flex-wrap gap-2">
                  {#each service.permissions as permission}
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{permission}</span>
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8">
          <p class="text-gray-500 mb-4">You don't have any connected services yet.</p>
          <Button onClick={() => goto('/services/connect')}>Connect a Service</Button>
        </div>
      {/if}
      
      <div class="mt-8 pt-6 border-t border-gray-200">
        <Button type="secondary" onClick={() => goto('/dashboard')}>Back to Dashboard</Button>
      </div>
    </div>
  </main>
</div>