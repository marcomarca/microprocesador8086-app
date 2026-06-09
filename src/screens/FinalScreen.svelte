<script lang="ts">
  import type { CourseContent, Exercise, ExerciseSession, FeedbackMessage } from '../types';
  import { countErrors, getExerciseStatus } from '../engine/session';
  import { copyText, createGoogleSheetsPayload, createReadableReport, downloadTextFile } from '../engine/report';
  import { submitResultToGoogleSheets } from '../services/googleSheets';
  import { appConfig } from '../content/appConfig';

  export let content: CourseContent;
  export let exercise: Exercise;
  export let session: ExerciseSession;
  export let onReview: () => void = () => undefined;
  export let onVariant: () => void = () => undefined;
  export let onRestart: () => void = () => undefined;
  export let onMenu: () => void = () => undefined;

  let participantLabel = '';
  let actionFeedback: FeedbackMessage | null = null;
  $: errors = countErrors(session.logs);
  $: status = getExerciseStatus(exercise, session.score);
  $: report = createReadableReport(content, exercise, session, participantLabel);

  async function copyReport() {
    const ok = await copyText(report);
    actionFeedback = ok
      ? { type: 'ok', text: 'Reporte copiado como texto.' }
      : { type: 'bad', text: 'No se pudo copiar. Usa la descarga TXT.' };
  }

  function downloadReport() {
    downloadTextFile(`${exercise.id}-resultado.txt`, report);
    actionFeedback = { type: 'ok', text: 'TXT generado.' };
  }

  async function sendReport() {
    const payload = createGoogleSheetsPayload(content, exercise, session, participantLabel);
    actionFeedback = { type: 'info', text: 'Enviando resultado...' };
    const result = await submitResultToGoogleSheets(payload);
    actionFeedback = result.ok
      ? { type: 'ok', text: result.message }
      : { type: 'bad', text: result.message };
  }
</script>

<section class="card" style="margin-top:16px">
  <h1>Resultado del ejercicio</h1>
  <p class="sub">{exercise.title}</p>

  <div class="summary-grid">
    <div class="metric">
      <strong>{session.score.toFixed(1)} / {exercise.steps.length}</strong>
      <span>Puntaje</span>
    </div>
    <div class="metric">
      <strong>{session.firstCorrect}/{exercise.steps.length}</strong>
      <span>Primer intento</span>
    </div>
    <div class="metric">
      <strong>{session.withHint}/{exercise.steps.length}</strong>
      <span>Con pista</span>
    </div>
    <div class="metric">
      <strong>{session.revealed}/{exercise.steps.length}</strong>
      <span>No corregidas</span>
    </div>
  </div>
</section>

<section class="card">
  <div class="label">Diagnóstico</div>
  <p>{status}</p>
</section>

<section class="card">
  <div class="label">Errores detectados</div>
  {#if Object.keys(errors).length}
    <ul class="list">
      {#each Object.entries(errors).sort((a, b) => b[1] - a[1]) as [tag, count]}
        <li>{content.errorCatalog[tag] ?? tag} <span class="muted">({count})</span></li>
      {/each}
    </ul>
  {:else}
    <p>No se detectaron errores conceptuales.</p>
  {/if}
</section>

<section class="card">
  <div class="label">Reporte del estudiante</div>
  <label class="field-label" for="participant">Nombre o registro universitario</label>
  <input id="participant" class="text-input" bind:value={participantLabel} placeholder="Opcional" />
  <div class="split-actions">
    <button class="secondary" on:click={copyReport}>Copiar texto</button>
    <button class="secondary" on:click={downloadReport}>Descargar TXT</button>
  </div>
  {#if appConfig.googleSheets.enabled}
    <button class="secondary" on:click={sendReport}>Enviar a Google Sheets</button>
  {/if}
  {#if actionFeedback}
    <div class={`feedback ${actionFeedback.type}`}>{actionFeedback.text}</div>
  {/if}
</section>

<section class="card">
  <div class="label">Acciones</div>
  {#if Object.keys(errors).length && exercise.review}
    <button class="secondary" on:click={onReview}>Ver repaso corto</button>
  {/if}
  {#if exercise.variant}
    <button class="secondary" on:click={onVariant}>Resolver pregunta variante</button>
  {/if}
  <button class="secondary" on:click={onRestart}>Reiniciar ejercicio</button>
  <button class="secondary" on:click={onMenu}>Volver al menú</button>
</section>
