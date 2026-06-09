<script lang="ts">
  import type { Exercise } from '../types';

  export let exercise: Exercise;
  export let onBack: () => void = () => undefined;

  let selection: Record<string, string> = {};
  let submitted = false;

  $: variant = exercise.variant;
  $: complete = variant ? variant.groups.every((group) => selection[group.id]) : false;
  $: correct = variant ? variant.groups.every((group) => selection[group.id] === variant.correctSelection[group.id]) : false;

  function select(groupId: string, value: string) {
    if (submitted) return;
    selection = { ...selection, [groupId]: value };
  }

  function submit() {
    submitted = true;
  }
</script>

{#if variant}
  <section class="card" style="margin-top:16px">
    <h1>{variant.title}</h1>
    <p class="sub">{variant.subtitle}</p>
  </section>

  <section class="card">
    <p class="question">{variant.prompt}</p>
    {#if variant.instruction}
      <div class="instruction mono">{variant.instruction}</div>
    {/if}
    <p class="sub" style="margin-top:10px">Completa la conclusión.</p>
  </section>

  <section class="card">
    {#each variant.groups as group}
      <div class="label" style="margin-top:12px">{group.label}</div>
      <div class="small-row">
        {#each group.options as option}
          <button class="chip" class:active={selection[group.id] === option} on:click={() => select(group.id, option)}>
            {option}
          </button>
        {/each}
      </div>
    {/each}

    {#if submitted}
      <div class={`feedback ${correct ? 'ok' : 'bad'}`}>
        {correct ? variant.correctFeedback : variant.incorrectFeedback}
      </div>
    {/if}
  </section>

  <section class="card">
    {#if submitted}
      <button class="secondary" on:click={onBack}>Volver al resultado</button>
    {:else}
      <button class="primary" disabled={!complete} on:click={submit}>Confirmar variante</button>
      <button class="secondary" on:click={onBack}>Cancelar</button>
    {/if}
  </section>
{:else}
  <section class="card" style="margin-top:16px">
    <h1>Variante no disponible</h1>
    <p class="sub">Este ejercicio todavía no tiene pregunta variante configurada.</p>
    <button class="secondary" on:click={onBack}>Volver al resultado</button>
  </section>
{/if}
