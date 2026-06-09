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
