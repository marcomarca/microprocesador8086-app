import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { memoryDwTheory2 } from '../../content/memoryDwTheory2';

const theory1Source = readFileSync(
  new URL('./MovTheoryScreen.svelte', import.meta.url),
  'utf8'
);
const theory2Source = readFileSync(
  new URL('./MemoryDwTheoryScreen.svelte', import.meta.url),
  'utf8'
);

const requiredAudioOperations = [
  'new URL(audioFile, window.location.href).href',
  'audio.load()',
  'await audio.play()',
  'audio.pause()',
  'audio.currentTime = 0',
  'audio.addEventListener'
];

describe('paridad del reproductor de teorías', () => {
  it('Teoría 2 conserva las operaciones de audio comprobadas de Teoría 1', () => {
    for (const operation of requiredAudioOperations) {
      expect(theory1Source, `Teoría 1 debe contener ${operation}`).toContain(operation);
      expect(theory2Source, `Teoría 2 debe contener ${operation}`).toContain(operation);
    }
  });

  it('Teoría 2 registra y limpia directamente sus controles de reproducción', () => {
    expect(theory2Source).toContain('playBtn.addEventListener("click", handlePlayClick)');
    expect(theory2Source).toContain('resetBtn.addEventListener("click", restart)');
    expect(theory2Source).toContain('playBtn.removeEventListener("click", handlePlayClick)');
    expect(theory2Source).toContain('resetBtn.removeEventListener("click", restart)');
    expect(theory2Source).not.toContain('requestPlayback');
    expect(theory2Source).not.toContain('requestRestart');
  });

  it('Teoría 2 usa el MP3 publicado y un único origen imperativo', () => {
    expect(memoryDwTheory2.audioFile).toBe('assets/teoria2.mp3');
    expect(theory2Source).toContain('<audio id="audio" preload="metadata"></audio>');
    expect(theory2Source).not.toContain('src={theory.audioFile}');
  });
});
