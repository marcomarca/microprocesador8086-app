import type { TheoryLesson } from '../types';

export const movTheory1: TheoryLesson = {
  id: 'theory_mov_01',
  moduleId: 'mod_mov',
  order: 1,
  title: 'Teoría 1 · MOV en 8086',
  subtitle: 'Audio sincronizado · registros y transferencia',
  description: 'Base conceptual previa al ejercicio 1: registros, destino, fuente, MOV y partes H/L.',
  estimatedMinutes: 3,
  audioFile: 'assets/teoria1.mp3',
  unlockExerciseId: 'mov_basic_01'
};
