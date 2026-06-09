<script lang="ts">
  import { onMount } from 'svelte';
  import BottomAction from './components/BottomAction.svelte';
  import UnlockDialog from './components/UnlockDialog.svelte';
  import { courseContent } from './content';
  import {
    applyExerciseCompletion,
    continueAfterHint,
    createInitialSession,
    getExerciseById,
    manuallyUnlockExercise,
    nextStep,
    selectOption,
    submitAnswer,
    toggleCode
  } from './engine/session';
  import { clearProgress, loadProgress, saveProgress } from './engine/storage';
  import ExerciseScreen from './screens/ExerciseScreen.svelte';
  import FinalScreen from './screens/FinalScreen.svelte';
  import MenuScreen from './screens/MenuScreen.svelte';
  import ReviewScreen from './screens/ReviewScreen.svelte';
  import VariantScreen from './screens/VariantScreen.svelte';
  import type { AppScreen, CourseProgress, Exercise, ExerciseSession } from './types';

  let screen: AppScreen = 'menu';
  let progress: CourseProgress | null = null;
  let activeExercise: Exercise | null = null;
  let session: ExerciseSession | null = null;
  let pendingUnlock: Exercise | null = null;
  let runtimeError: string | null = null;

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
      screen = 'menu';
    }
  }

  function openExercise(exercise: Exercise) {
    withFallback(() => {
      activeExercise = exercise;
      session = createInitialSession(exercise);
      screen = 'exercise';
      if (progress) progress = { ...progress, lastExerciseId: exercise.id, lastUpdated: new Date().toISOString() };
    });
  }

  function requestUnlock(exercise: Exercise) {
    pendingUnlock = exercise;
  }

  function confirmUnlock() {
    if (!pendingUnlock) return;
    if (!progress) return;
    progress = manuallyUnlockExercise(progress, pendingUnlock.id);
    const exercise = pendingUnlock;
    pendingUnlock = null;
    openExercise(exercise);
  }

  function handleSubmitOrContinue() {
    withFallback(() => {
      if (!activeExercise || !session) return;

      if (session.phase === 'answering') {
        session = submitAnswer(session, activeExercise);
        return;
      }

      if (session.phase === 'hint') {
        session = continueAfterHint(session);
        return;
      }

      if (session.currentStepIndex >= activeExercise.steps.length - 1) {
        session = nextStep(session, activeExercise);
        if (progress) progress = applyExerciseCompletion(progress, courseContent, activeExercise, session);
        screen = 'final';
        return;
      }

      session = nextStep(session, activeExercise);
    });
  }

  function restartExercise() {
    if (!activeExercise) return;
    openExercise(activeExercise);
  }

  function goMenu() {
    screen = 'menu';
  }

  function resetProgress() {
    if (!window.confirm('¿Borrar todo el progreso local de este navegador?')) return;
    progress = clearProgress();
    activeExercise = null;
    session = null;
    screen = 'menu';
  }

  function getActionLabel(): string {
    if (!session || screen !== 'exercise') return 'Continuar';
    if (session.phase === 'answering') return 'Confirmar respuesta';
    if (session.phase === 'hint') return 'Intentar otra vez';
    if (!activeExercise) return 'Continuar';
    return session.currentStepIndex >= activeExercise.steps.length - 1 ? 'Ver resultado' : 'Siguiente paso';
  }

  function restoreLastExercise() {
    if (!progress) return;
    const last = progress.lastExerciseId ? getExerciseById(courseContent, progress.lastExerciseId) : null;
    if (last) openExercise(last);
  }
</script>

{#if progress}
  <main id="app" class="app">
    {#if runtimeError}
      <section class="feedback bad">{runtimeError}</section>
    {/if}

    {#if screen === 'menu'}
      <MenuScreen
        content={courseContent}
        {progress}
        onOpenExercise={openExercise}
        onRequestUnlock={requestUnlock}
        onClearProgress={resetProgress}
      />
      {#if progress.lastExerciseId}
        <section class="card">
          <div class="label">Última actividad</div>
          <p class="sub">Puedes reiniciar el último ejercicio visitado.</p>
          <button class="secondary" on:click={restoreLastExercise}>Abrir último ejercicio</button>
        </section>
      {/if}
    {:else if screen === 'exercise' && activeExercise && session}
      <ExerciseScreen
        exercise={activeExercise}
        {session}
        onSelectOption={(id) => (session = selectOption(session as ExerciseSession, id))}
        onToggleCode={() => (session = toggleCode(session as ExerciseSession))}
      />
    {:else if screen === 'final' && activeExercise && session}
      <FinalScreen
        content={courseContent}
        exercise={activeExercise}
        {session}
        onReview={() => (screen = 'review')}
        onVariant={() => (screen = 'variant')}
        onRestart={restartExercise}
        onMenu={goMenu}
      />
    {:else if screen === 'review' && activeExercise}
      <ReviewScreen exercise={activeExercise} onBack={() => (screen = 'final')} />
    {:else if screen === 'variant' && activeExercise}
      <VariantScreen exercise={activeExercise} onBack={() => (screen = 'final')} />
    {:else}
      <section class="card" style="margin-top:16px">
        <h1>Estado no recuperable</h1>
        <p class="sub">La app volvió al menú para evitar pérdida de funcionalidad.</p>
        <button class="secondary" on:click={goMenu}>Volver al menú</button>
      </section>
    {/if}
  </main>

  {#if screen === 'exercise'}
    <BottomAction label={getActionLabel()} onPrimary={handleSubmitOrContinue} />
  {/if}

  <UnlockDialog exercise={pendingUnlock} onCancel={() => (pendingUnlock = null)} onConfirm={confirmUnlock} />
{:else}
  <main class="app">
    <section class="card" style="margin-top:16px">
      <h1>Cargando...</h1>
    </section>
  </main>
{/if}
