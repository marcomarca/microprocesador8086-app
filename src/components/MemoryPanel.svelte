<script lang="ts">
  import type { MemoryRow } from '../types';

  export let memory: MemoryRow[] = [];
  export let changed: string[] = [];

  function isChanged(label: string): boolean {
    return changed.includes(label);
  }
</script>

<div class="memory">
  {#each memory as row}
    <div class="memrow" class:changed={isChanged(row.label)}>
      <div class="mem-label mono">{row.label}</div>
      <div class="mem-addr mono">@{row.address}</div>
      <div class="mem-bytes mono">{row.bytes.join(' ')}</div>
      <div class="mem-word mono">word {row.word}</div>
    </div>
  {/each}
</div>

<style>
  .memory {
    display: grid;
    gap: 8px;
  }

  .memrow {
    display: grid;
    grid-template-columns: 46px 58px 1fr 74px;
    gap: 8px;
    align-items: center;
    background: var(--card2);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 10px;
  }

  .memrow.changed {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px rgba(244, 197, 66, .35);
  }

  .mem-label {
    font-weight: 850;
    color: var(--accent);
  }

  .mem-addr {
    color: var(--muted);
    font-size: 12px;
  }

  .mem-bytes {
    font-size: 17px;
    font-weight: 850;
  }

  .mem-word {
    text-align: right;
    font-size: 14px;
  }
</style>
