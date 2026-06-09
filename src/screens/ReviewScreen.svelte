<script lang="ts">
  import type { Exercise, FeedbackMessage } from '../types';

  export let exercise: Exercise;
  export let onBack: () => void = () => undefined;

  let selected: string | null = null;
  let feedback: FeedbackMessage | null = null;

  $: review = exercise.review;

  function answer(optionId: string) {
    if (!review?.quickQuestion) return;
    selected = optionId;
    const option = review.quickQuestion.options.find((item) => item.id === optionId);
    if (!option) return;
    feedback = option.correct
      ? { type: 'ok', text: review.quickQuestion.correctFeedback }
      : { type: 'bad', text: review.quickQuestion.incorrectFeedback };
  }
</script>

{#if review}
  <section class="card" style="margin-top:16px">
    <h1>{review.title}</h1>
    <p class="sub">{review.subtitle}</p>
  </section>

  {#each review.blocks as block}
    <section class="card">
      <p class="question">{block.title}</p>
      <p class="sub" style="margin-top:8px">{block.body}</p>
      {#if block.code}
        <pre>{block.code}</pre>
      {/if}
    </section>
  {/each}

  {#if review.quickQuestion}
    <section class="card">
      <p class="question">Pregunta rápida</p>
      <p class="sub" style="margin-top:6px">{review.quickQuestion.prompt}</p>
      <div class="options">
        {#each review.quickQuestion.options as option}
          <button
            class="option"
            class:selected={selected === option.id}
            class:correct={selected === option.id && option.correct}
            class:wrong={selected === option.id && !option.correct}
            on:click={() => answer(option.id)}
          >
            <strong>{option.id}.</strong> {option.text}
          </button>
        {/each}
      </div>
      {#if feedback}
        <div class={`feedback ${feedback.type}`}>{feedback.text}</div>
      {/if}
    </section>
  {/if}
{:else}
  <section class="card" style="margin-top:16px">
    <h1>Repaso no disponible</h1>
    <p class="sub">Este ejercicio todavía no tiene repaso configurado.</p>
  </section>
{/if}

<section class="card">
  <button class="secondary" on:click={onBack}>Volver al resultado</button>
</section>
