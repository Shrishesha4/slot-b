<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { walletAddress, isConnected, getIdentity, verifyIdentity } from '$lib/services/blockchainService';
  import { generateChallenge } from '$lib/utils/cryptoUtils';
  import { authStore } from '$lib/stores/authStore';
  import Button from '$lib/components/Button.svelte';
  import WalletConnect from '$lib/components/WalletConnect.svelte';
  
  let loading = false;
  let error = '';
  let step = 1; // 1: Connect wallet, 2: Sign message, 3: Success
  let challenge = '';
  
  async function handleLogin() {
    if (!$walletAddress) {
      error = 'Please connect your wallet first';
      return;
    }
    
    try {
      loading = true;
      error = '';
      
      // Get identity from blockchain
      const identity = await getIdentity($walletAddress);
      
      if (!identity) {
        error = 'No identity found for this wallet. Please register first.';
        return;
      }
      
      // Generate challenge for signing
      challenge = generateChallenge();
      step = 2;
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to verify identity';
    } finally {
      loading = false;
    }
  }
  
  async function handleSignMessage() {
    try {
      loading = true;
      error = '';
      
      // Request signature from wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(challenge);
      
      // Verify signature
      const isValid = await verifyIdentity($walletAddress, challenge, signature);
      
      if (!isValid) {
        error = 'Signature verification failed';
        return;
      }
      
      // Get identity data
      const identity = await getIdentity($walletAddress);
      
      // Login user
      authStore.login({
        address: $walletAddress,
        name: identity.name,
        email: identity.email,
        isVerified: true
      });
      
      step = 3;
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        goto('/dashboard');
      }, 1500);
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to sign message';
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
    <h1 class="text-3xl font-bold text-gray-800">Login with Blockchain</h1>
    <WalletConnect />
  </header>

  <main>
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <h2 class="text-2xl font-semibold mb-6">Authenticate with Your Wallet</h2>
      
      {#if step === 1}
        {#if !$isConnected}
          <div class="text-center mb-6">
            <p class="mb-4 text-gray-600">Please connect your wallet to authenticate</p>
            <WalletConnect />
          </div>
        {:else}
          <div class="space-y-4">
            <p class="text-gray-600">
              Connected wallet: <span class="font-medium">{$walletAddress?.slice(0, 6)}...{$walletAddress?.slice(-4)}</span>
            </p>
            
            <p class="text-gray-600">
              Click the button below to verify your identity by signing a message with your wallet.
            </p>
            
            {#if error}
              <p class="text-red-500 text-sm">{error}</p>
            {/if}
            
            <div class="pt-4">
              <Button onClick={handleLogin} loading={loading}>Verify Identity</Button>
            </div>
          </div>
        {/if}
      {:else if step === 2}
        <div class="space-y-4">
          <p class="text-gray-600">
            Please sign the following message with your wallet to authenticate:
          </p>
          
          <div class="bg-gray-100 p-3 rounded-md border border-gray-300">
            <code class="text-sm break-all">Authentication challenge: {challenge}</code>
          </div>
          
          {#if error}
            <p class="text-red-500 text-sm">{error}</p>
          {/if}
          
          <div class="pt-4">
            <Button onClick={handleSignMessage} loading={loading}>Sign Message</Button>
          </div>
        </div>
      {:else if step === 3}
        <div class="text-center">
          <div class="text-green-500 text-5xl mb-4">✓</div>
          <h3 class="text-xl font-medium mb-2">Authentication Successful</h3>
          <p class="text-gray-600">Redirecting to dashboard...</p>
        </div>
      {/if}
    </div>
  </main>
</div>