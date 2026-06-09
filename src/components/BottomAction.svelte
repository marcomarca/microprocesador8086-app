<script lang="ts">
  export let label = 'Continuar';
  export let disabled = false;
  export let secondaryLabel: string | null = null;
  export let onPrimary: () => void = () => undefined;
  export let onSecondary: (() => void) | null = null;
</script>

<div class="bottom">
  <div class="bottom-inner">
    <button class="primary" {disabled} on:click={onPrimary}>{label}</button>
    {#if secondaryLabel && onSecondary}
      <button class="secondary" on:click={onSecondary}>{secondaryLabel}</button>
    {/if}
  </div>
</div>
