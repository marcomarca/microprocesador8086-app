<script lang="ts">
  import type { MemoryRow } from '../types';

  export let memory: MemoryRow[] = [];
  export let changed: string[] = [];
</script>

<div class="memory">
  <!-- Memory rows are rendered by CSS-friendly markup in the exercise screen. -->
</div>
