<script lang="ts">
  export let value = 0;
</script>

<div class="progress" aria-label="Progreso">
  <div style="width: {Math.max(0, Math.min(100, value))}%"></div>
</div>
