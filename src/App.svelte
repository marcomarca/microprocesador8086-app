<script lang="ts">
  import { onMount } from 'svelte';
  import BottomAction from './components/BottomAction.svelte';
  import UnlockDialog from './components/UnlockDialog.svelte';
  import { courseContent } from './content';
  import {
    applyExerciseCompletion,
    applyTheoryCompletion,
    getExerciseAccess,
    getExerciseAction,
    getExerciseById,
    manuallyUnlockExercise,
    manuallyUnlockTheory
  } from './engine/session';
  import { clearProgress, loadProgress, saveProgress } from './engine/storage';
  import ExerciseScreen from './screens/ExerciseScreen.svelte';
  import FinalScreen from './screens/FinalScreen.svelte';
  import MenuScreen from './screens/MenuScreen.svelte';
  import ReviewScreen from './screens/ReviewScreen.svelte';
  import TheoryScreen from './screens/TheoryScreen.svelte';
  import VariantScreen from './screens/VariantScreen.svelte';
  import { exerciseSessionStore } from './stores/exerciseSession';
  import type { AppScreen, CourseProgress, Exercise, TheoryLesson } from './types';

  type UnlockTarget =
    | { type: 'exercise'; exercise: Exercise }
    | { type: 'theory'; theory: TheoryLesson };

  let screen: AppScreen = 'menu';
  let progress: CourseProgress | null = null;
  let pendingUnlock: UnlockTarget | null = null;
  let activeTheory: TheoryLesson | null = null;
  let runtimeError: string | null = null;
  let navOpen = false;

  onMount(() => {
    progress = loadProgress();
  });

  $: if (progress) saveProgress(progress);

  function withFallback(action: () => void) {
    try {
      runtimeError = null;
      action();
    } catch {
      runtimeError = 'Ocurrió un error inesperado. Se volvió al menú para conservar la funcionalidad.';
      exerciseSessionStore.clearSession();
      screen = 'menu';
    }
  }

  function openTheory(theory: TheoryLesson) {
    withFallback(() => {
      navOpen = false;
      exerciseSessionStore.clearSession();
      activeTheory = theory;
      screen = 'theory';
      if (progress) progress = { ...progress, lastTheoryId: theory.id, lastUpdated: new Date().toISOString() };
    });
  }

  function openExercise(exercise: Exercise) {
    withFallback(() => {
      navOpen = false;
      activeTheory = null;
      exerciseSessionStore.startExercise(exercise);
      screen = 'exercise';
      if (progress) progress = { ...progress, lastExerciseId: exercise.id, lastUpdated: new Date().toISOString() };
    });
  }

  function completeTheory(theory: TheoryLesson) {
    if (!progress) return;
    progress = applyTheoryCompletion(progress, courseContent, theory);
  }

  function startExerciseFromTheory(exerciseId: string) {
    if (!activeTheory) return;
    if (progress && !progress.completedTheoryIds.includes(activeTheory.id)) {
      progress = applyTheoryCompletion(progress, courseContent, activeTheory);
    }

    const exercise = getExerciseById(courseContent, exerciseId);
    if (!exercise || !progress) return;

    const access = getExerciseAccess(courseContent, progress, exercise.id);
    if (access.unlocked) openExercise(exercise);
    else requestExerciseUnlock(exercise);
  }

  function requestExerciseUnlock(exercise: Exercise) {
    pendingUnlock = { type: 'exercise', exercise };
  }

  function requestTheoryUnlock(theory: TheoryLesson) {
    pendingUnlock = { type: 'theory', theory };
  }

  function confirmUnlock() {
    if (!pendingUnlock || !progress) return;

    const target = pendingUnlock;
    pendingUnlock = null;

    if (target.type === 'exercise') {
      progress = manuallyUnlockExercise(progress, target.exercise.id);
      openExercise(target.exercise);
      return;
    }

    progress = manuallyUnlockTheory(progress, target.theory.id);
    openTheory(target.theory);
  }

  function handleSubmitOrContinue() {
    withFallback(() => {
      const completion = exerciseSessionStore.submitOrContinue();
      if (completion) {
        if (progress) progress = applyExerciseCompletion(progress, courseContent, completion.exercise, completion.session);
        screen = 'final';
      }
    });
  }

  function restartExercise() {
    exerciseSessionStore.restart();
    screen = 'exercise';
  }

  function goMenu() {
    navOpen = false;
    exerciseSessionStore.clearSession();
    activeTheory = null;
    screen = 'menu';
  }

  function goHomeFromNav() {
    navOpen = false;
    exerciseSessionStore.clearSession();
    activeTheory = null;
    screen = 'menu';
  }

  function resetProgress() {
    if (!window.confirm('¿Borrar todo el progreso local de este navegador?')) return;
    progress = clearProgress();
    exerciseSessionStore.clearSession();
    activeTheory = null;
    screen = 'menu';
  }

  $: exerciseAction =
    screen === 'exercise' && $exerciseSessionStore.activeExercise && $exerciseSessionStore.session
      ? getExerciseAction($exerciseSessionStore.session, $exerciseSessionStore.activeExercise)
      : null;

  function restoreLastExercise() {
    if (!progress) return;
    const last = progress.lastExerciseId ? getExerciseById(courseContent, progress.lastExerciseId) : null;
    if (last) openExercise(last);
  }
</script>

{#if progress}
  <main id="app" class="app">
    {#if screen !== 'menu'}
      <nav class="global-nav" aria-label="Navegación principal">
        <button
          class="global-nav-toggle"
          type="button"
          aria-label="Abrir navegación"
          aria-expanded={navOpen}
          on:click={() => (navOpen = !navOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        {#if navOpen}
          <div class="global-nav-menu">
            <button type="button" on:click={goHomeFromNav}>Inicio</button>
          </div>
        {/if}
      </nav>
    {/if}

    {#if runtimeError}
      <section class="feedback bad">{runtimeError}</section>
    {/if}

    {#if screen === 'menu'}
      <MenuScreen
        content={courseContent}
        {progress}
        onOpenTheory={openTheory}
        onOpenExercise={openExercise}
        onRequestUnlock={requestExerciseUnlock}
        onRequestTheoryUnlock={requestTheoryUnlock}
        onClearProgress={resetProgress}
      />
      {#if progress.lastExerciseId}
        <section class="card">
          <div class="label">Última actividad</div>
          <p class="sub">Puedes reiniciar el último ejercicio visitado.</p>
          <button class="secondary" on:click={restoreLastExercise}>Abrir último ejercicio</button>
        </section>
      {/if}
    {:else if screen === 'theory' && activeTheory}
      <TheoryScreen
        theory={activeTheory}
        completed={progress.completedTheoryIds.includes(activeTheory.id)}
        onComplete={completeTheory}
        onStartExercise={startExerciseFromTheory}
      />
    {:else if screen === 'exercise' && $exerciseSessionStore.activeExercise && $exerciseSessionStore.session}
      <ExerciseScreen
        exercise={$exerciseSessionStore.activeExercise}
        session={$exerciseSessionStore.session}
        onSelectOption={exerciseSessionStore.selectOption}
        onToggleCode={exerciseSessionStore.toggleCode}
      />
    {:else if screen === 'final' && $exerciseSessionStore.activeExercise && $exerciseSessionStore.session}
      <FinalScreen
        content={courseContent}
        exercise={$exerciseSessionStore.activeExercise}
        session={$exerciseSessionStore.session}
        onReview={() => (screen = 'review')}
        onVariant={() => (screen = 'variant')}
        onRestart={restartExercise}
        onMenu={goMenu}
      />
    {:else if screen === 'review' && $exerciseSessionStore.activeExercise}
      <ReviewScreen exercise={$exerciseSessionStore.activeExercise} onBack={() => (screen = 'final')} />
    {:else if screen === 'variant' && $exerciseSessionStore.activeExercise}
      <VariantScreen exercise={$exerciseSessionStore.activeExercise} onBack={() => (screen = 'final')} />
    {:else}
      <section class="card" style="margin-top:16px">
        <h1>Estado no recuperable</h1>
        <p class="sub">La app volvió al menú para evitar pérdida de funcionalidad.</p>
        <button class="secondary" on:click={goMenu}>Volver al menú</button>
      </section>
    {/if}
  </main>

  {#if screen === 'exercise'}
    <BottomAction
      label={exerciseAction?.label ?? 'Confirmar respuesta'}
      disabled={exerciseAction?.disabled ?? true}
      onPrimary={handleSubmitOrContinue}
    />
  {/if}

  <UnlockDialog target={pendingUnlock} onCancel={() => (pendingUnlock = null)} onConfirm={confirmUnlock} />
{:else}
  <main class="app">
    <section class="card" style="margin-top:16px">
      <h1>Cargando...</h1>
    </section>
  </main>
{/if}
