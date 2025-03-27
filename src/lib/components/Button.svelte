<script lang="ts">
  export let type: 'primary' | 'secondary' | 'danger' = 'primary';
  export let disabled = false;
  export let loading = false;
  export let onClick: (() => void) | null = null;
</script>

<button
  class="px-4 py-2 rounded-md font-medium transition-colors {type === 'primary'
    ? 'bg-blue-600 hover:bg-blue-700 text-white'
    : type === 'secondary'
    ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
    : 'bg-red-600 hover:bg-red-700 text-white'} {disabled || loading
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer'}"
  on:click={onClick}
  disabled={disabled || loading}
>
  {#if loading}
    <span class="inline-block animate-spin mr-2">⟳</span>
  {/if}
  <slot />
</button>