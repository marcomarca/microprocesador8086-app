import { afterEach, describe, expect, it, vi } from 'vitest';
import { courseContent } from '../content';
import { loadProgress } from './storage';
import { flattenCourseUnitOrder, getExerciseAccess } from './session';

describe('ruta de Teoría 2', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('coloca Teoría 2 inmediatamente antes del Ejercicio 2', () => {
    const route = flattenCourseUnitOrder(courseContent);
    const theoryIndex = route.findIndex((unit) => unit.id === 'theory_memory_dw_02');
    const exerciseIndex = route.findIndex((unit) => unit.id === 'direct_memory_dw_02');

    expect(theoryIndex).toBeGreaterThan(-1);
    expect(exerciseIndex).toBe(theoryIndex + 1);
    expect(route[theoryIndex]).toMatchObject({ type: 'theory', id: 'theory_memory_dw_02' });
  });

  it('mantiene bloqueado el Ejercicio 2 hasta completar su teoría', () => {
    const progress = {
      version: 2,
      routeCursor: 2,
      completedTheoryIds: ['theory_mov_01'],
      manualUnlockedTheoryIds: [],
      completedExerciseIds: ['mov_basic_01'],
      manualUnlockedExerciseIds: [],
      exerciseResults: {},
      diagnostics: {},
      lastExerciseId: 'mov_basic_01',
      lastTheoryId: 'theory_mov_01',
      lastUpdated: new Date().toISOString()
    };

    expect(getExerciseAccess(courseContent, progress, 'direct_memory_dw_02').unlocked).toBe(false);
  });

  it('migra progreso previo completando la teoría requerida por un ejercicio ya terminado', () => {
    const stored = JSON.stringify({
      version: 2,
      completedTheoryIds: ['theory_mov_01'],
      completedExerciseIds: ['mov_basic_01', 'direct_memory_dw_02'],
      manualUnlockedTheoryIds: [],
      manualUnlockedExerciseIds: [],
      exerciseResults: {},
      diagnostics: {},
      lastExerciseId: 'direct_memory_dw_02',
      lastTheoryId: 'theory_mov_01',
      lastUpdated: new Date().toISOString()
    });
    const localStorage = {
      getItem: vi.fn(() => stored),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    vi.stubGlobal('window', { localStorage });

    const progress = loadProgress();
    expect(progress.completedTheoryIds).toContain('theory_memory_dw_02');
    expect(progress.routeCursor).toBeGreaterThan(
      flattenCourseUnitOrder(courseContent).findIndex((unit) => unit.id === 'direct_memory_dw_02')
    );
  });
});
