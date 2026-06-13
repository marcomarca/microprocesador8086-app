import { describe, expect, it } from 'vitest';
import { courseContent } from '../content';
import type { CourseProgress } from '../types';
import {
  applyTheoryCompletion,
  flattenCourseUnitOrder,
  getExerciseAccess,
  getTheoryAccess,
  manuallyUnlockExercise,
  manuallyUnlockTheory
} from './session';

const THEORY_8_ID = 'theory_call_ret_08';
const EXERCISE_8_ID = 'call_ret_08';

function routeIndex(unitId: string): number {
  const index = flattenCourseUnitOrder(courseContent).findIndex((unit) => unit.id === unitId);
  if (index < 0) throw new Error(`No existe la unidad ${unitId} en la ruta.`);
  return index;
}

function progressThroughExercise6(): CourseProgress {
  return {
    version: 2,
    routeCursor: routeIndex('theory_stack_lifo_07'),
    completedTheoryIds: [
      'theory_mov_01',
      'theory_memory_dw_02',
      'theory_indirect_indexed_03',
      'theory_arithmetic_flags_04',
      'theory_conditional_jumps_05',
      'theory_loop_accumulator_06'
    ],
    manualUnlockedTheoryIds: [],
    completedExerciseIds: [
      'mov_basic_01',
      'direct_memory_dw_02',
      'indirect_indexed_03',
      'arithmetic_flags_04',
      'conditional_jumps_05',
      'loop_accumulator_06'
    ],
    manualUnlockedExerciseIds: [],
    exerciseResults: {},
    diagnostics: {},
    lastExerciseId: 'loop_accumulator_06',
    lastTheoryId: 'theory_loop_accumulator_06',
    lastUpdated: new Date().toISOString()
  };
}

describe('desbloqueo manual de teorías fuera de ruta', () => {
  it('mantiene bloqueada una teoría futura antes del desbloqueo manual', () => {
    const progress = progressThroughExercise6();
    const access = getTheoryAccess(courseContent, progress, THEORY_8_ID);

    expect(access.unlocked).toBe(false);
    expect(access.manualUnlocked).toBe(false);
  });

  it('desbloquea manualmente la Teoría 8 sin completarla ni avanzar el cursor', () => {
    const progress = progressThroughExercise6();
    const unlocked = manuallyUnlockTheory(progress, THEORY_8_ID);
    const access = getTheoryAccess(courseContent, unlocked, THEORY_8_ID);

    expect(access.unlocked).toBe(true);
    expect(access.manualUnlocked).toBe(true);
    expect(unlocked.manualUnlockedTheoryIds).toContain(THEORY_8_ID);
    expect(unlocked.completedTheoryIds).not.toContain(THEORY_8_ID);
    expect(unlocked.routeCursor).toBe(progress.routeCursor);
  });

  it('completar una teoría desbloqueada manualmente no salta unidades anteriores ni desbloquea su ejercicio', () => {
    const progress = manuallyUnlockTheory(progressThroughExercise6(), THEORY_8_ID);
    const theory = courseContent.theories.find((item) => item.id === THEORY_8_ID);
    if (!theory) throw new Error(`No existe la teoría ${THEORY_8_ID}.`);

    const completed = applyTheoryCompletion(progress, courseContent, theory);
    const exerciseAccess = getExerciseAccess(courseContent, completed, EXERCISE_8_ID);

    expect(completed.completedTheoryIds).toContain(THEORY_8_ID);
    expect(completed.routeCursor).toBe(progress.routeCursor);
    expect(exerciseAccess.unlocked).toBe(false);
    expect(exerciseAccess.manualUnlocked).toBe(false);
  });

  it('mantiene independiente el desbloqueo manual de ejercicios', () => {
    const progress = progressThroughExercise6();
    const unlocked = manuallyUnlockExercise(progress, EXERCISE_8_ID);
    const access = getExerciseAccess(courseContent, unlocked, EXERCISE_8_ID);

    expect(access.unlocked).toBe(true);
    expect(access.manualUnlocked).toBe(true);
    expect(unlocked.manualUnlockedExerciseIds).toContain(EXERCISE_8_ID);
    expect(unlocked.completedTheoryIds).not.toContain(THEORY_8_ID);
    expect(unlocked.routeCursor).toBe(progress.routeCursor);
  });
});
