import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { memoryDwTheory2 } from '../../content/memoryDwTheory2';
import { indirectTheory3 } from '../../content/indirectTheory3';
import { arithmeticFlagsTheory4 } from '../../content/arithmeticFlagsTheory4';
import { conditionalJumpsTheory5 } from '../../content/conditionalJumpsTheory5';
import { loopAccumulatorTheory6 } from '../../content/loopAccumulatorTheory6';
import { stackLifoTheory7 } from '../../content/stackLifoTheory7';
import { callRetTheory8 } from '../../content/callRetTheory8';

const theory1Source = readFileSync(
  new URL('./MovTheoryScreen.svelte', import.meta.url),
  'utf8'
);
const theory2Source = readFileSync(
  new URL('./MemoryDwTheoryScreen.svelte', import.meta.url),
  'utf8'
);
const theory3Source = readFileSync(
  new URL('./IndirectIndexedTheoryScreen.svelte', import.meta.url),
  'utf8'
);
const theory4Source = readFileSync(
  new URL('./ArithmeticFlagsTheoryScreen.svelte', import.meta.url),
  'utf8'
);
const theory5Source = readFileSync(
  new URL('./ConditionalJumpsTheoryScreen.svelte', import.meta.url),
  'utf8'
);
const theory6Source = readFileSync(
  new URL('./LoopAccumulatorTheoryScreen.svelte', import.meta.url),
  'utf8'
);
const theory7Source = readFileSync(
  new URL('./StackLifoTheoryScreen.svelte', import.meta.url),
  'utf8'
);
const theory8Source = readFileSync(
  new URL('./CallRetTheoryScreen.svelte', import.meta.url),
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
  it('Teorías 2, 3, 4, 5, 6, 7 y 8 conservan las operaciones de audio comprobadas de Teoría 1', () => {
    for (const operation of requiredAudioOperations) {
      expect(theory1Source, `Teoría 1 debe contener ${operation}`).toContain(operation);
      expect(theory2Source, `Teoría 2 debe contener ${operation}`).toContain(operation);
      expect(theory3Source, `Teoría 3 debe contener ${operation}`).toContain(operation);
      expect(theory4Source, `Teoría 4 debe contener ${operation}`).toContain(operation);
      expect(theory5Source, `Teoría 5 debe contener ${operation}`).toContain(operation);
      expect(theory6Source, `Teoría 6 debe contener ${operation}`).toContain(operation);
      expect(theory7Source, `Teoría 7 debe contener ${operation}`).toContain(operation);
      expect(theory8Source, `Teoría 8 debe contener ${operation}`).toContain(operation);
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

  it('Teoría 2 analiza la constante SRT que realmente declara', () => {
    expect(theory2Source).toContain('const SRT_SOURCE =');
    expect(theory2Source).toContain('parseSrt(SRT_SOURCE)');
    expect(theory2Source).not.toContain('parseSrt(SRT_TEXT)');
  });

  it('Teoría 3 usa el MP3 publicado y el origen imperativo correcto', () => {
    expect(indirectTheory3.audioFile).toBe('assets/teoria3.mp3');
    expect(theory3Source).toContain('<audio id="audio" preload="metadata"></audio>');
    expect(theory3Source).not.toContain('src={theory.audioFile}');
    expect(theory3Source).toContain('const SRT_SOURCE =');
    expect(theory3Source).toContain('parseSrt(SRT_SOURCE)');
    expect(theory3Source).not.toContain('parseSrt(SRT_TEXT)');
  });

  it('Teoría 4 usa el MP3 publicado, SRT normalizado y estados de FLAGS', () => {
    expect(arithmeticFlagsTheory4.audioFile).toBe('assets/teoria4.mp3');
    expect(theory4Source).toContain('<audio id="audio" preload="metadata"></audio>');
    expect(theory4Source).not.toContain('src={theory.audioFile}');
    expect(theory4Source).toContain('const SRT_SOURCE =');
    expect(theory4Source).toContain('parseSrt(SRT_SOURCE)');
    expect(theory4Source).not.toContain('parseSrt(SRT_TEXT)');
    expect(theory4Source).toContain('normalizeSubtitle');
    expect(theory4Source).toContain('setFlag');
    expect(theory4Source).toContain('data-flag-value');
    expect(theory4Source).toContain('data-flag-card');
  });

  it('Teoría 5 usa el MP3 publicado, SRT normalizado y control CC', () => {
    expect(conditionalJumpsTheory5.audioFile).toBe('assets/teoria5.mp3');
    expect(theory5Source).toContain('<audio id="audio" preload="metadata"></audio>');
    expect(theory5Source).not.toContain('src={theory.audioFile}');
    expect(theory5Source).toContain('const SRT_SOURCE =');
    expect(theory5Source).toContain('parseSrt(SRT_SOURCE)');
    expect(theory5Source).not.toContain('parseSrt(SRT_TEXT)');
    expect(theory5Source).toContain('normalizeSubtitle');
    expect(theory5Source).toContain('slideStartCue');
    expect(theory5Source).toContain('focusByCue');
    expect(theory5Source).toContain('JZ RUTA_IGUAL');
    expect(theory5Source).toContain('JG RUTA_MAYOR');
    expect(theory5Source).toContain('JL RUTA_MENOR');
    expect(theory5Source).toContain('JMP SALIDA');
  });

  it('Teoría 6 usa el MP3 publicado, SRT normalizado, estados de registros y control CC', () => {
    expect(loopAccumulatorTheory6.audioFile).toBe('assets/teoria6.mp3');
    expect(theory6Source).toContain('<audio id="audio" preload="metadata"></audio>');
    expect(theory6Source).not.toContain('src={theory.audioFile}');
    expect(theory6Source).toContain('const SRT_SOURCE =');
    expect(theory6Source).toContain('parseSrt(SRT_SOURCE)');
    expect(theory6Source).not.toContain('parseSrt(SRT_TEXT)');
    expect(theory6Source).toContain('normalizeSubtitle');
    expect(theory6Source).toContain('slideStartCue');
    expect(theory6Source).toContain('slideRanges');
    expect(theory6Source).toContain('cueFocus');
    expect(theory6Source).toContain('setRegister');
    expect(theory6Source).toContain('setOperation');
    expect(theory6Source).toContain('data-reg="AX"');
    expect(theory6Source).toContain('data-reg="CX"');
    expect(theory6Source).toContain('data-reg="SI"');
    expect(theory6Source).toContain('data-op="sumOp"');
    expect(theory6Source).toContain('data-op="loopOp"');
    expect(theory6Source).toContain('data-op="turnOp"');
    expect(theory6Source).toContain('data-op="repeatOp"');
    expect(theory6Source).toContain('data-op="exitOp"');
    expect(theory6Source).toContain('LOOP CICLO_SUMA');
    expect(theory6Source).toContain('word [SI]');
    expect(theory6Source).toContain('MOV word RESULTADO_FINAL, AX');
  });

  it('Teoría 7 usa el MP3 publicado, SRT normalizado, estados de pila y control CC', () => {
    expect(stackLifoTheory7.audioFile).toBe('assets/teoria7.mp3');
    expect(theory7Source).toContain('<audio id="audio" preload="metadata"></audio>');
    expect(theory7Source).not.toContain('src={theory.audioFile}');
    expect(theory7Source).not.toContain('teoria7%20pro.mp3');
    expect(theory7Source).toContain('const SRT_SOURCE =');
    expect(theory7Source).toContain('parseSrt(SRT_SOURCE)');
    expect(theory7Source).toContain('cueVisual');
    expect(theory7Source).toContain('slideStartCue');
    expect(theory7Source).toContain('slideRanges');
    expect(theory7Source).toContain('sceneStarts');
    expect(theory7Source).toContain('applyRuntimeState');
    expect(theory7Source).toContain('setTrustedHtml');
    expect(theory7Source).toContain('PUSH SI');
    expect(theory7Source).toContain('PUSH DI');
    expect(theory7Source).toContain('POP BP');
    expect(theory7Source).toContain('POP DX');
    expect(theory7Source).toContain('LIFO');
    expect(theory7Source).toContain('SP = SP - 2');
    expect(theory7Source).toContain('SP = SP + 2');
    expect(theory7Source).toContain('1020h');
    expect(theory7Source).toContain('3040h');
    expect(theory7Source).toContain('bytesFe');
    expect(theory7Source).toContain('bytesFc');
    expect(theory7Source).toContain('rowBpTop');
    expect(theory7Source).toContain('rowDxEmpty');
  });

  it('Teoría 8 usa el MP3 publicado, SRT normalizado, flujo CALL/RET y control CC', () => {
    expect(callRetTheory8.audioFile).toBe('assets/teoria8.mp3');
    expect(theory8Source).toContain('<audio id="audio" preload="metadata"></audio>');
    expect(theory8Source).not.toContain('src={theory.audioFile}');
    expect(theory8Source).not.toContain('const AUDIO_FILE = "teoria8.mp3"');
    expect(theory8Source).toContain('const SRT_SOURCE =');
    expect(theory8Source).toContain('parseSrt(SRT_SOURCE)');
    expect(theory8Source).not.toContain('parseSrt(SRT_TEXT)');
    expect(theory8Source).toContain('normalizeSubtitle');
    expect(theory8Source).toContain('slideStartCue');
    expect(theory8Source).toContain('slideRanges');
    expect(theory8Source).toContain('cueMap');
    expect(theory8Source).toContain('metaForTime');
    expect(theory8Source).toContain('applyDynamicState');
    expect(theory8Source).toContain('s5AxVal');
    expect(theory8Source).toContain('s5OpText');
    expect(theory8Source).toContain('s7AxVal');
    expect(theory8Source).toContain('s7OpText');
    expect(theory8Source).toContain('s7OpNote');
    expect(theory8Source).toContain('MOV AX, 0004h');
    expect(theory8Source).toContain('CALL double');
    expect(theory8Source).toContain('ADD AX, AX');
    expect(theory8Source).toContain('RET');
    expect(theory8Source).toContain('MOV BX, AX');
    expect(theory8Source).toContain('0004h');
    expect(theory8Source).toContain('0008h');
  });


});
