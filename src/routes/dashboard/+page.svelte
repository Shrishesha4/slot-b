<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  import { walletAddress } from '$lib/services/blockchainService';
  import Button from '$lib/components/Button.svelte';
  import WalletConnect from '$lib/components/WalletConnect.svelte';
  
  // Mock data for demonstration
  const recentActivities = [
    { id: 1, type: 'Authentication', service: 'DeFi App', timestamp: '2023-10-15T14:30:00Z', status: 'Success' },
    { id: 2, type: 'Identity Update', service: 'Profile', timestamp: '2023-10-10T09:15:00Z', status: 'Success' },
    { id: 3, type: 'Authentication', service: 'NFT Marketplace', timestamp: '2023-10-05T18:45:00Z', status: 'Success' }
  ];
  
  const connectedServices = [
    { id: 1, name: 'DeFi App', icon: '💰', connectedAt: '2023-09-20T10:00:00Z' },
    { id: 2, name: 'NFT Marketplace', icon: '🖼️', connectedAt: '2023-09-15T14:30:00Z' }
  ];
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
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
    <h1 class="text-3xl font-bold text-gray-800">Identity Dashboard</h1>
    <WalletConnect />
  </header>

  <main>
    {#if $authStore.user}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Identity Card -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Your Digital Identity</h2>
          
          <div class="mb-6 flex items-center justify-center">
            <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl">
              {$authStore.user.name?.charAt(0) || 'U'}
            </div>
          </div>
          
          <div class="space-y-3">
            <div>
              <h3 class="text-sm text-gray-500">Name</h3>
              <p class="font-medium">{$authStore.user.name || 'Not provided'}</p>
            </div>
            
            <div>
              <h3 class="text-sm text-gray-500">Email</h3>
              <p class="font-medium">{$authStore.user.email || 'Not provided'}</p>
            </div>
            
            <div>
              <h3 class="text-sm text-gray-500">Wallet Address</h3>
              <p class="font-medium text-sm break-all">{$authStore.user.address}</p>
            </div>
            
            <div>
              <h3 class="text-sm text-gray-500">Verification Status</h3>
              <p class="font-medium flex items-center">
                {#if $authStore.user.isVerified}
                  <span class="text-green-500 mr-1">✓</span> Verified
                {:else}
                  <span class="text-yellow-500 mr-1">⚠</span> Pending
                {/if}
              </p>
            </div>
          </div>
          
          <div class="mt-6">
            <Button type="secondary" onClick={() => goto('/profile/edit')}>Edit Profile</Button>
          </div>
        </div>
        
        <!-- Recent Activities -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Recent Activities</h2>
          
          {#if recentActivities.length > 0}
            <div class="space-y-4">
              {#each recentActivities as activity}
                <div class="border-b border-gray-100 pb-3">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-medium">{activity.type}</h3>
                      <p class="text-sm text-gray-500">{activity.service}</p>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full {activity.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                      {activity.status}
                    </span>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">{formatDate(activity.timestamp)}</p>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-gray-500 text-center py-4">No recent activities</p>
          {/if}
        </div>
        
        <!-- Connected Services -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Connected Services</h2>
          
          {#if connectedServices.length > 0}
            <div class="space-y-4">
              {#each connectedServices as service}
                <div class="flex items-center p-3 border border-gray-200 rounded-md">
                  <div class="text-2xl mr-3">{service.icon}</div>
                  <div>
                    <h3 class="font-medium">{service.name}</h3>
                    <p class="text-xs text-gray-500">Connected on {formatDate(service.connectedAt)}</p>
                  </div>
                </div>
              {/each}
            </div>
            
            <div class="mt-6">
              <Button type="secondary" onClick={() => goto('/services')}>Manage Services</Button>
            </div>
          {:else}
            <p class="text-gray-500 text-center py-4">No connected services</p>
            
            <div class="mt-6">
              <Button onClick={() => goto('/services/connect')}>Connect a Service</Button>
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="text-center py-12">
        <p class="text-gray-500">Loading your identity data...</p>
      </div>
    {/if}
  </main>
</div>