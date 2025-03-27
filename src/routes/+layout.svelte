<script lang="ts">
  import '../app.css';
  import { enableMockWallet, isMockWalletEnabled } from '$lib/services/mockWalletService';
  import { dev } from '$app/environment';

  let { children } = $props();
  
  function toggleMockWallet() {
    enableMockWallet();
  }
</script>

{#if dev && !$isMockWalletEnabled}
  <div class="fixed bottom-4 right-4 bg-amber-100 p-3 rounded-md shadow-md z-50 text-sm">
    <p class="mb-2">No wallet detected. For development:</p>
    <button 
      class="bg-blue-500 text-white px-3 py-1 rounded-md text-xs"
      on:click={toggleMockWallet}
    >
      Enable Mock Wallet
    </button>
  </div>
{/if}

{@render children()}
