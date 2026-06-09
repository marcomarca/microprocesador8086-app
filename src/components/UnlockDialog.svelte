<script lang="ts">
  import type { Exercise } from '../types';

  export let exercise: Exercise | null = null;
  export let onCancel: () => void = () => undefined;
  export let onConfirm: () => void = () => undefined;
</script>

{#if exercise}
  <div class="modal-backdrop" role="presentation">
    <div class="modal card" role="dialog" aria-modal="true" aria-labelledby="unlock-title" tabindex="-1">
      <h2 id="unlock-title">Ejercicio fuera de la ruta sugerida</h2>
      <p class="sub" style="margin-top:8px">
        Estás adelantando el proceso. Puedes resolver este ejercicio, pero no desbloqueará automáticamente los ejercicios posteriores.
      </p>
      <div class="instruction mono" style="font-size:18px">{exercise.title}</div>
      <button class="primary" on:click={onConfirm}>Desbloquear y abrir</button>
      <button class="secondary" on:click={onCancel}>Volver al menú</button>
    </div>
  </div>
{/if}
