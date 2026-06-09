<script lang="ts">
  export let lines: string[] = [];
  export let currentIndex = 0;
</script>

<div class="code">
  {#each lines as line, index}
    <div class:current={index === currentIndex}>
      {line}{index === currentIndex ? '   ← actual' : ''}
    </div>
  {/each}
</div>
