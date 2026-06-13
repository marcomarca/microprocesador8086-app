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

  it('declara el audio de Teoría 2 dentro de los assets públicos', () => {
    const theory = courseContent.theories.find((item) => item.id === 'theory_memory_dw_02');

    expect(theory?.audioFile).toBe('assets/teoria2.mp3');
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


describe('ruta de Teoría 3', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('coloca Teoría 3 inmediatamente antes del Ejercicio 3', () => {
    const route = flattenCourseUnitOrder(courseContent);
    const theoryIndex = route.findIndex((unit) => unit.id === 'theory_indirect_indexed_03');
    const exerciseIndex = route.findIndex((unit) => unit.id === 'indirect_indexed_03');

    expect(theoryIndex).toBeGreaterThan(-1);
    expect(exerciseIndex).toBe(theoryIndex + 1);
    expect(route[theoryIndex]).toMatchObject({
      type: 'theory',
      id: 'theory_indirect_indexed_03'
    });
  });

  it('declara el audio de Teoría 3 dentro de los assets públicos', () => {
    const theory = courseContent.theories.find((item) => item.id === 'theory_indirect_indexed_03');
    expect(theory?.audioFile).toBe('assets/teoria3.mp3');
  });

  it('mantiene bloqueado el Ejercicio 3 hasta completar su teoría', () => {
    const progress = {
      version: 2,
      routeCursor: 4,
      completedTheoryIds: ['theory_mov_01', 'theory_memory_dw_02'],
      manualUnlockedTheoryIds: [],
      completedExerciseIds: ['mov_basic_01', 'direct_memory_dw_02'],
      manualUnlockedExerciseIds: [],
      exerciseResults: {},
      diagnostics: {},
      lastExerciseId: 'direct_memory_dw_02',
      lastTheoryId: 'theory_memory_dw_02',
      lastUpdated: new Date().toISOString()
    };

    expect(getExerciseAccess(courseContent, progress, 'indirect_indexed_03').unlocked).toBe(false);
  });

  it('migra progreso previo completando la teoría requerida por el ejercicio 3 ya terminado', () => {
    const stored = JSON.stringify({
      version: 2,
      completedTheoryIds: ['theory_mov_01', 'theory_memory_dw_02'],
      completedExerciseIds: ['mov_basic_01', 'direct_memory_dw_02', 'indirect_indexed_03'],
      manualUnlockedTheoryIds: [],
      manualUnlockedExerciseIds: [],
      exerciseResults: {},
      diagnostics: {},
      lastExerciseId: 'indirect_indexed_03',
      lastTheoryId: 'theory_memory_dw_02',
      lastUpdated: new Date().toISOString()
    });

    const localStorage = {
      getItem: vi.fn(() => stored),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };

    vi.stubGlobal('window', { localStorage });

    const progress = loadProgress();

    expect(progress.completedTheoryIds).toContain('theory_indirect_indexed_03');
    expect(progress.routeCursor).toBeGreaterThan(
      flattenCourseUnitOrder(courseContent).findIndex((unit) => unit.id === 'indirect_indexed_03')
    );
  });
});

describe('ruta de Teoría 4', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('coloca Teoría 4 inmediatamente antes del Ejercicio 4', () => {
    const route = flattenCourseUnitOrder(courseContent);
    const theoryIndex = route.findIndex((unit) => unit.id === 'theory_arithmetic_flags_04');
    const exerciseIndex = route.findIndex((unit) => unit.id === 'arithmetic_flags_04');

    expect(theoryIndex).toBeGreaterThan(-1);
    expect(exerciseIndex).toBe(theoryIndex + 1);
    expect(route[theoryIndex]).toMatchObject({
      type: 'theory',
      id: 'theory_arithmetic_flags_04'
    });
  });

  it('declara el audio de Teoría 4 dentro de los assets públicos', () => {
    const theory = courseContent.theories.find((item) => item.id === 'theory_arithmetic_flags_04');
    expect(theory?.audioFile).toBe('assets/teoria4.mp3');
  });

  it('mantiene bloqueado el Ejercicio 4 hasta completar su teoría', () => {
    const progress = {
      version: 2,
      routeCursor: 6,
      completedTheoryIds: [
        'theory_mov_01',
        'theory_memory_dw_02',
        'theory_indirect_indexed_03'
      ],
      manualUnlockedTheoryIds: [],
      completedExerciseIds: [
        'mov_basic_01',
        'direct_memory_dw_02',
        'indirect_indexed_03'
      ],
      manualUnlockedExerciseIds: [],
      exerciseResults: {},
      diagnostics: {},
      lastExerciseId: 'indirect_indexed_03',
      lastTheoryId: 'theory_indirect_indexed_03',
      lastUpdated: new Date().toISOString()
    };

    expect(getExerciseAccess(courseContent, progress, 'arithmetic_flags_04').unlocked).toBe(false);
  });

  it('migra progreso previo completando la teoría requerida por el ejercicio 4 ya terminado', () => {
    const stored = JSON.stringify({
      version: 2,
      completedTheoryIds: [
        'theory_mov_01',
        'theory_memory_dw_02',
        'theory_indirect_indexed_03'
      ],
      completedExerciseIds: [
        'mov_basic_01',
        'direct_memory_dw_02',
        'indirect_indexed_03',
        'arithmetic_flags_04'
      ],
      manualUnlockedTheoryIds: [],
      manualUnlockedExerciseIds: [],
      exerciseResults: {},
      diagnostics: {},
      lastExerciseId: 'arithmetic_flags_04',
      lastTheoryId: 'theory_indirect_indexed_03',
      lastUpdated: new Date().toISOString()
    });

    const localStorage = {
      getItem: vi.fn(() => stored),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };

    vi.stubGlobal('window', { localStorage });

    const progress = loadProgress();

    expect(progress.completedTheoryIds).toContain('theory_arithmetic_flags_04');
    expect(progress.routeCursor).toBeGreaterThan(
      flattenCourseUnitOrder(courseContent).findIndex((unit) => unit.id === 'arithmetic_flags_04')
    );
  });
});


describe('ruta de Teoría 5', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('coloca Teoría 5 inmediatamente antes del Ejercicio 5', () => {
    const route = flattenCourseUnitOrder(courseContent);
    const theoryIndex = route.findIndex((unit) => unit.id === 'theory_conditional_jumps_05');
    const exerciseIndex = route.findIndex((unit) => unit.id === 'conditional_jumps_05');

    expect(theoryIndex).toBeGreaterThan(-1);
    expect(exerciseIndex).toBe(theoryIndex + 1);
    expect(route[theoryIndex]).toMatchObject({
      type: 'theory',
      id: 'theory_conditional_jumps_05'
    });
  });

  it('declara el audio de Teoría 5 dentro de los assets públicos', () => {
    const theory = courseContent.theories.find((item) => item.id === 'theory_conditional_jumps_05');
    expect(theory?.audioFile).toBe('assets/teoria5.mp3');
  });

  it('mantiene bloqueado el Ejercicio 5 hasta completar su teoría', () => {
    const progress = {
      version: 2,
      routeCursor: 8,
      completedTheoryIds: [
        'theory_mov_01',
        'theory_memory_dw_02',
        'theory_indirect_indexed_03',
        'theory_arithmetic_flags_04'
      ],
      manualUnlockedTheoryIds: [],
      completedExerciseIds: [
        'mov_basic_01',
        'direct_memory_dw_02',
        'indirect_indexed_03',
        'arithmetic_flags_04'
      ],
      manualUnlockedExerciseIds: [],
      exerciseResults: {},
      diagnostics: {},
      lastExerciseId: 'arithmetic_flags_04',
      lastTheoryId: 'theory_arithmetic_flags_04',
      lastUpdated: new Date().toISOString()
    };

    expect(getExerciseAccess(courseContent, progress, 'conditional_jumps_05').unlocked).toBe(false);
  });

  it('migra progreso previo completando la teoría requerida por el ejercicio 5 ya terminado', () => {
    const stored = JSON.stringify({
      version: 2,
      completedTheoryIds: [
        'theory_mov_01',
        'theory_memory_dw_02',
        'theory_indirect_indexed_03',
        'theory_arithmetic_flags_04'
      ],
      completedExerciseIds: [
        'mov_basic_01',
        'direct_memory_dw_02',
        'indirect_indexed_03',
        'arithmetic_flags_04',
        'conditional_jumps_05'
      ],
      manualUnlockedTheoryIds: [],
      manualUnlockedExerciseIds: [],
      exerciseResults: {},
      diagnostics: {},
      lastExerciseId: 'conditional_jumps_05',
      lastTheoryId: 'theory_arithmetic_flags_04',
      lastUpdated: new Date().toISOString()
    });

    const localStorage = {
      getItem: vi.fn(() => stored),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };

    vi.stubGlobal('window', { localStorage });

    const progress = loadProgress();

    expect(progress.completedTheoryIds).toContain('theory_conditional_jumps_05');
    expect(progress.routeCursor).toBeGreaterThan(
      flattenCourseUnitOrder(courseContent).findIndex((unit) => unit.id === 'conditional_jumps_05')
    );
  });
});
