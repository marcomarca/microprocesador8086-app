<script lang="ts">
  import type { Exercise, ExerciseSession } from '../types';
  import CodeBlock from '../components/CodeBlock.svelte';
  import FeedbackBox from '../components/FeedbackBox.svelte';
  import MemoryPanel from '../components/MemoryPanel.svelte';
  import OptionButton from '../components/OptionButton.svelte';
  import ProgressBar from '../components/ProgressBar.svelte';
  import RegisterPanel from '../components/RegisterPanel.svelte';

  export let exercise: Exercise;
  export let session: ExerciseSession;
  export let onSelectOption: (optionId: string) => void = () => undefined;
  export let onToggleCode: () => void = () => undefined;

  $: step = exercise.steps[session.currentStepIndex];
  $: progress = Math.round(((session.currentStepIndex + 1) / exercise.steps.length) * 100);
</script>

<div class="header">
  <section class="card" style="margin-bottom:8px">
    <h1>{exercise.title}</h1>
    <p class="sub">Paso {step.step} de {exercise.steps.length}</p>
    <ProgressBar value={progress} />
  </section>
</div>

<section class="card">
  <div class="label">Registros actuales</div>
  <RegisterPanel registers={session.registers} changed={session.changed} />
</section>

{#if session.memory.length}
  <section class="card">
    <div class="label">Memoria</div>
    <MemoryPanel memory={session.memory} changed={session.changedMemory} />
  </section>
{/if}

<section class="card">
  <div class="label">{step.title}</div>
  <div class="instruction mono">{step.instruction}</div>
  <button class="code-toggle" on:click={onToggleCode}>
    {session.showCode ? 'Ocultar código completo ▲' : 'Ver código completo ▼'}
  </button>
  {#if session.showCode}
    <CodeBlock lines={exercise.codeLines} currentIndex={step.codeIndex} />
  {/if}
</section>

<section class="card">
  <p class="question">{step.question}</p>
  <div class="options">
    {#each step.options as option}
      <OptionButton
        {option}
        selected={session.selectedOptionId === option.id}
        failed={session.failedOptionIds.includes(option.id) || (session.phase === 'complete' && session.selectedOptionId === option.id && !option.correct)}
        revealCorrect={session.phase === 'complete' && option.correct}
        disabled={session.phase !== 'answering' || session.failedOptionIds.includes(option.id)}
        onSelect={onSelectOption}
      />
    {/each}
  </div>
  <FeedbackBox
    feedback={session.feedback}
    diagram={step.diagram}
    showDiagram={(session.phase === 'hint' || session.phase === 'complete') && Boolean(step.diagram)}
  />
</section>
