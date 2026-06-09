<script lang="ts">
  import type { FeedbackMessage } from '../types';

  export let feedback: FeedbackMessage | null = null;
  export let diagram: string | undefined = undefined;
  export let showDiagram = false;
</script>

{#if feedback}
  <div class={`feedback ${feedback.type}`}>
    {feedback.text}
    {#if showDiagram && diagram}
      <pre>{diagram}</pre>
    {/if}
  </div>
{/if}
