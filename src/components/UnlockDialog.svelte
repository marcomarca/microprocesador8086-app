<script lang="ts">
  import type { Exercise, TheoryLesson } from '../types';

  type UnlockTarget =
    | { type: 'exercise'; exercise: Exercise }
    | { type: 'theory'; theory: TheoryLesson };

  export let target: UnlockTarget | null = null;
  export let onCancel: () => void = () => undefined;
  export let onConfirm: () => void = () => undefined;

  $: title = target?.type === 'theory' ? 'Teoría fuera de la ruta sugerida' : 'Ejercicio fuera de la ruta sugerida';
  $: message =
    target?.type === 'theory'
      ? 'Estás adelantando el proceso. Puedes estudiar esta teoría, pero no desbloqueará automáticamente las teorías, ejercicios ni módulos posteriores.'
      : 'Estás adelantando el proceso. Puedes resolver este ejercicio, pero no desbloqueará automáticamente los ejercicios posteriores.';
  $: itemTitle = target?.type === 'theory' ? target.theory.title : target?.exercise.title;
  $: confirmLabel = target?.type === 'theory' ? 'Desbloquear y abrir teoría' : 'Desbloquear y abrir';
</script>

{#if target}
  <div class="modal-backdrop" role="presentation">
    <div class="modal card" role="dialog" aria-modal="true" aria-labelledby="unlock-title" tabindex="-1">
      <h2 id="unlock-title">{title}</h2>
      <p class="sub" style="margin-top:8px">
        {message}
      </p>
      <div class="instruction mono" style="font-size:18px">{itemTitle}</div>
      <button class="primary" on:click={onConfirm}>{confirmLabel}</button>
      <button class="secondary" on:click={onCancel}>Volver al menú</button>
    </div>
  </div>
{/if}
