<script lang="ts">
  import type { RegisterName, RegisterState } from '../types';

  export let registers: RegisterState = {};
  export let changed: RegisterName[] = [];

  $: entries = Object.entries(registers);
</script>

<div class="registers">
  {#each entries as [name, value]}
    <div class:changed={changed.includes(name as RegisterName)} class="reg">
      <div class="name">{name}</div>
      <div class="value mono">{value}</div>
    </div>
  {/each}
</div>
