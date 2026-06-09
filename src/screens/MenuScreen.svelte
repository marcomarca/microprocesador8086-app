<script lang="ts">
  import type { CourseContent, CourseProgress, Exercise } from '../types';
  import { getExerciseAccess } from '../engine/session';

  export let content: CourseContent;
  export let progress: CourseProgress;
  export let onOpenExercise: (exercise: Exercise) => void = () => undefined;
  export let onRequestUnlock: (exercise: Exercise) => void = () => undefined;
  export let onClearProgress: () => void = () => undefined;

  function getExercise(id: string): Exercise | null {
    return content.exercises.find((exercise) => exercise.id === id) ?? null;
  }

  function open(exercise: Exercise) {
    const access = getExerciseAccess(content, progress, exercise.id);
    if (access.unlocked) onOpenExercise(exercise);
    else onRequestUnlock(exercise);
  }
</script>

<div class="header">
  <section class="card" style="margin-bottom:8px">
    <h1>{content.title}</h1>
    <p class="sub">{content.subtitle}</p>
  </section>
</div>

<section class="card">
  <p class="question">Selecciona un módulo y resuelve los ejercicios en orden sugerido.</p>
  <p class="sub" style="margin-top:10px">
    Los ejercicios bloqueados pueden abrirse manualmente con advertencia. Esa apertura no desbloquea los ejercicios siguientes.
  </p>
</section>

{#each [...content.modules].sort((a, b) => a.order - b.order) as module}
  <section class="card module-card">
    <div class="label">{module.subtitle}</div>
    <h2>{module.title}</h2>
    <p class="sub" style="margin-top:6px">{module.description}</p>

    <div class="exercise-list">
      {#each module.exerciseIds as exerciseId}
        {@const exercise = getExercise(exerciseId)}
        {#if exercise}
          {@const access = getExerciseAccess(content, progress, exercise.id)}
          {@const result = progress.exerciseResults[exercise.id]}
          <button class="exercise-item" class:locked={!access.unlocked} on:click={() => open(exercise)}>
            <div>
              <strong>{exercise.title}</strong>
              <span>{exercise.subtitle}</span>
              {#if result}
                <em>{result.score.toFixed(1)} / {result.maxScore} · {result.status}</em>
              {/if}
            </div>
            <div class="status-chip" class:done={access.completed} class:manual={access.manualUnlocked && !access.completed}>
              {#if access.completed}
                Completado
              {:else if access.unlocked}
                Disponible
              {:else}
                Bloqueado
              {/if}
            </div>
          </button>
        {/if}
      {/each}
    </div>
  </section>
{/each}

<section class="card">
  <div class="label">Progreso local</div>
  <p class="sub">El avance se guarda en este navegador mediante localStorage.</p>
  <button class="secondary" on:click={onClearProgress}>Borrar progreso local</button>
</section>
