<script lang="ts">
  import { authStore } from '$lib/stores/authStore';
  import WalletConnect from '$lib/components/WalletConnect.svelte';
  import Button from '$lib/components/Button.svelte';
  import { goto } from '$app/navigation';
</script>

<div class="container mx-auto px-4 py-8">
  <header class="mb-12 flex justify-between items-center">
    <h1 class="text-3xl font-bold text-gray-800">Blockchain Identity Management</h1>
    <WalletConnect />
  </header>

  <main>
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
      <h2 class="text-2xl font-semibold mb-6">Secure Digital Identity on the Blockchain</h2>
      
      <p class="mb-6 text-gray-600">
        Our platform provides a secure, decentralized way to manage your digital identity using blockchain technology.
        Take control of your personal data and authenticate securely across services without relying on centralized authorities.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="border border-gray-200 rounded-md p-4">
          <h3 class="text-lg font-medium mb-2">Self-Sovereign Identity</h3>
          <p class="text-gray-600">Own and control your identity without depending on any centralized authority.</p>
        </div>
        
        <div class="border border-gray-200 rounded-md p-4">
          <h3 class="text-lg font-medium mb-2">Secure Authentication</h3>
          <p class="text-gray-600">Authenticate using cryptographic proofs without sharing sensitive information.</p>
        </div>
        
        <div class="border border-gray-200 rounded-md p-4">
          <h3 class="text-lg font-medium mb-2">Immutable Record</h3>
          <p class="text-gray-600">Your identity credentials are stored on an immutable blockchain ledger.</p>
        </div>
        
        <div class="border border-gray-200 rounded-md p-4">
          <h3 class="text-lg font-medium mb-2">Privacy Focused</h3>
          <p class="text-gray-600">Share only the information you want with selective disclosure capabilities.</p>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        {#if $authStore.isAuthenticated}
          <Button onClick={() => goto('/dashboard')}>Go to Dashboard</Button>
        {:else}
          <Button onClick={() => goto('/register')}>Register Identity</Button>
          <Button type="secondary" onClick={() => goto('/login')}>Login with Blockchain</Button>
        {/if}
      </div>
    </div>
  </main>
</div>
