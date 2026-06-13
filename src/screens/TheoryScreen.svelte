<script lang="ts">
  import type { TheoryLesson } from '../types';
  import { getTheoryRenderer } from './theories/registry';

  export let theory: TheoryLesson;
  export let completed = false;
  export let onComplete: (theory: TheoryLesson) => void = () => undefined;
  export let onStartExercise: (exerciseId: string) => void = () => undefined;

  $: Renderer = getTheoryRenderer(theory.renderer);
</script>

{#key `${theory.id}:${theory.renderer}`}
  {#if Renderer}
    <svelte:component
      this={Renderer}
      {theory}
      {completed}
      {onComplete}
      {onStartExercise}
    />
  {:else}
    <section class="card" style="margin-top:16px">
      <h1>Teoría no disponible</h1>
      <p class="sub">No existe un renderizador registrado para {theory.title}.</p>
    </section>
  {/if}
{/key}
