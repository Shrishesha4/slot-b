<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  import Button from '$lib/components/Button.svelte';
  import WalletConnect from '$lib/components/WalletConnect.svelte';
  
  // Mock data for demonstration
  const availableServices = [
    { 
      id: 1, 
      name: 'DeFi App', 
      icon: '💰', 
      description: 'Decentralized finance application for trading and yield farming',
      permissions: ['Read profile', 'Authentication']
    },
    { 
      id: 2, 
      name: 'NFT Marketplace', 
      icon: '🖼️', 
      description: 'Buy, sell, and trade digital collectibles and artwork',
      permissions: ['Read profile', 'Authentication', 'Transaction history']
    },
    { 
      id: 3, 
      name: 'DAO Governance', 
      icon: '🏛️', 
      description: 'Participate in decentralized governance and voting',
      permissions: ['Read profile', 'Authentication', 'Voting rights']
    },
    { 
      id: 4, 
      name: 'Crypto Wallet', 
      icon: '👛', 
      description: 'Manage your cryptocurrency assets across multiple chains',
      permissions: ['Read profile', 'Authentication', 'Transaction history', 'Asset management']
    }
  ];
  
  let loading = false;
  let selectedService = null;
  
  function selectService(service) {
    selectedService = service;
  }
  
  async function connectService() {
    if (!selectedService) return;
    
    try {
      loading = true;
      
      // In a real app, this would call an API to establish the connection
      // For demo, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to services page
      goto('/services');
    } catch (error) {
      console.error('Error connecting service:', error);
    } finally {
      loading = false;
    }
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
    <h1 class="text-3xl font-bold text-gray-800">Connect a Service</h1>
    <WalletConnect />
  </header>

  <main>
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
      <h2 class="text-2xl font-semibold mb-6">Available Services</h2>
      
      {#if selectedService}
        <div class="mb-8 p-6 border border-blue-200 bg-blue-50 rounded-lg">
          <div class="flex items-center mb-4">
            <div class="text-4xl mr-4">{selectedService.icon}</div>
            <div>
              <h3 class="text-xl font-medium">{selectedService.name}</h3>
              <p class="text-gray-600">{selectedService.description}</p>
            </div>
          </div>
          
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Requested Permissions</h4>
            <div class="flex flex-wrap gap-2">
              {#each selectedService.permissions as permission}
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{permission}</span>
              {/each}
            </div>
          </div>
          
          <div class="flex gap-4">
            <Button onClick={connectService} loading={loading}>Connect Service</Button>
            <Button type="secondary" onClick={() => selectedService = null}>Cancel</Button>
          </div>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {#each availableServices as service}
            <div 
              class="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              on:click={() => selectService(service)}
            >
              <div class="flex items-center">
                <div class="text-3xl mr-3">{service.icon}</div>
                <div>
                  <h3 class="font-medium">{service.name}</h3>
                  <p class="text-sm text-gray-500">{service.description}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      
      <div class="mt-8 pt-6 border-t border-gray-200">
        <Button type="secondary" onClick={() => goto('/services')}>Back to Services</Button>
      </div>
    </div>
  </main>
</div>