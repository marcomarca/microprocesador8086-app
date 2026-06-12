<script lang="ts">
  import type { CourseContent, CourseModule, CourseProgress, Exercise, TheoryLesson } from '../types';
  import { getExerciseAccess, getTheoryAccess } from '../engine/session';

  export let content: CourseContent;
  export let progress: CourseProgress;
  export let onOpenTheory: (theory: TheoryLesson) => void = () => undefined;
  export let onOpenExercise: (exercise: Exercise) => void = () => undefined;
  export let onRequestUnlock: (exercise: Exercise) => void = () => undefined;
  export let onClearProgress: () => void = () => undefined;

  type ModuleItem =
    | { type: 'theory'; order: number; theory: TheoryLesson }
    | { type: 'exercise'; order: number; exercise: Exercise };

  function getExercise(id: string): Exercise | null {
    return content.exercises.find((exercise) => exercise.id === id) ?? null;
  }

  function getTheory(id: string): TheoryLesson | null {
    return content.theories.find((theory) => theory.id === id) ?? null;
  }

  function getModuleItems(module: CourseModule): ModuleItem[] {
    const theories = (module.theoryIds ?? [])
      .map(getTheory)
      .filter((theory): theory is TheoryLesson => Boolean(theory))
      .map((theory) => ({ type: 'theory' as const, order: theory.order, theory }));

    const exercises = module.exerciseIds
      .map(getExercise)
      .filter((exercise): exercise is Exercise => Boolean(exercise))
      .map((exercise) => ({ type: 'exercise' as const, order: exercise.order, exercise }));

    return [...theories, ...exercises].sort((a, b) => a.order - b.order || (a.type === 'theory' ? -1 : 1));
  }

  function openTheory(theory: TheoryLesson) {
    const access = getTheoryAccess(content, progress, theory.id);
    if (access.unlocked) onOpenTheory(theory);
  }

  function openExercise(exercise: Exercise) {
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

{#each [...content.modules].sort((a, b) => a.order - b.order) as module}
  <section class="card module-card">
    <div class="label">{module.subtitle}</div>
    <h2>{module.title}</h2>
    <p class="sub" style="margin-top:6px">{module.description}</p>

    <div class="exercise-list">
      {#each getModuleItems(module) as item}
        {#if item.type === 'theory'}
          {@const theory = item.theory}
          {@const access = getTheoryAccess(content, progress, theory.id)}
          <button
            class="exercise-item theory-item"
            class:locked={!access.unlocked}
            class:recommended={access.unlocked && !access.completed && access.index === progress.routeCursor}
            disabled={!access.unlocked}
            on:click={() => openTheory(theory)}
          >
            <div>
              <strong>{theory.title}</strong>
              {#if theory.subtitle}<span>{theory.subtitle}</span>{/if}
              <em>{theory.description}</em>
            </div>
            <div class="status-chip" class:done={access.completed} class:manual={access.manualUnlocked && !access.completed}>
              {#if access.completed}
                Completada
              {:else if access.unlocked}
                Disponible
              {:else}
                <svg class="status-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 10V7a5 5 0 0 1 10 0v3M6 10h12v10H6z" />
                </svg>
                Bloqueada
              {/if}
            </div>
          </button>
        {:else}
          {@const exercise = item.exercise}
          {@const access = getExerciseAccess(content, progress, exercise.id)}
          {@const result = progress.exerciseResults[exercise.id]}
          <button
            class="exercise-item"
            class:locked={!access.unlocked}
            class:recommended={access.unlocked && !access.completed && access.index === progress.routeCursor}
            on:click={() => openExercise(exercise)}
          >
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
                <svg class="status-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 10V7a5 5 0 0 1 10 0v3M6 10h12v10H6z" />
                </svg>
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
