<script lang="ts">
  import type { QuestionOption } from '../types';

  export let option: QuestionOption;
  export let selected = false;
  export let failed = false;
  export let revealCorrect = false;
  export let disabled = false;
  export let onSelect: (id: string) => void = () => undefined;
</script>

<button
  class="option"
  class:selected
  class:wrong={failed}
  class:correct={revealCorrect}
  {disabled}
  on:click={() => onSelect(option.id)}
>
  <strong>{option.id}.</strong> {option.text}
</button>
