import { describe, expect, it } from 'vitest';
import { courseContent } from '../content';
import type { Exercise, ExerciseSession, QuestionOption } from '../types';
import {
  continueAfterHint,
  createInitialSession,
  getExerciseAction,
  nextStep,
  selectOption,
  submitAnswer
} from './session';

function optionsFor(exercise: Exercise, stepIndex = 0) {
  const options = exercise.steps[stepIndex].options;
  const correct = options.find((option) => option.correct);
  const wrong = options.filter((option) => !option.correct);

  if (!correct || wrong.length < 2) {
    throw new Error(`El paso ${exercise.steps[stepIndex].id} necesita una opción correcta y dos incorrectas.`);
  }

  return { correct, wrong };
}

function answer(session: ExerciseSession, exercise: Exercise, option: QuestionOption) {
  return submitAnswer(selectOption(session, option.id), exercise);
}

describe.each(courseContent.exercises)('$title', (exercise) => {
  it('muestra la acción inicial correcta', () => {
    const session = createInitialSession(exercise);
    expect(getExerciseAction(session, exercise)).toEqual({
      type: 'submit',
      label: 'Confirmar respuesta',
      disabled: false
    });
  });

  it('resuelve correctamente al primer intento', () => {
    const { correct } = optionsFor(exercise);
    const resolved = answer(createInitialSession(exercise), exercise, correct);

    expect(resolved.phase).toBe('complete');
    expect(resolved.feedback?.type).toBe('ok');
    expect(resolved.score).toBe(1);
    expect(resolved.firstCorrect).toBe(1);
    expect(getExerciseAction(resolved, exercise).label).toBe(
      exercise.steps.length === 1 ? 'Ver resultado' : 'Siguiente paso'
    );
  });

  it('permite reintentar después del primer error', () => {
    const { wrong } = optionsFor(exercise);
    const failed = answer(createInitialSession(exercise), exercise, wrong[0]);

    expect(failed.phase).toBe('hint');
    expect(failed.failedOptionIds).toEqual([wrong[0].id]);
    expect(getExerciseAction(failed, exercise).label).toBe('Intentar otra vez');

    const retry = continueAfterHint(failed);
    expect(retry.phase).toBe('answering');
    expect(retry.selectedOptionId).toBeNull();
    expect(retry.feedback).toBeNull();
    expect(retry.failedOptionIds).toEqual([wrong[0].id]);
    expect(selectOption(retry, wrong[0].id)).toBe(retry);
    expect(getExerciseAction(retry, exercise).label).toBe('Confirmar respuesta');
  });

  it('resuelve correctamente después de un error', () => {
    const { correct, wrong } = optionsFor(exercise);
    const failed = answer(createInitialSession(exercise), exercise, wrong[0]);
    const resolved = answer(continueAfterHint(failed), exercise, correct);

    expect(resolved.phase).toBe('complete');
    expect(resolved.feedback?.type).toBe('ok');
    expect(resolved.score).toBe(0.5);
    expect(getExerciseAction(resolved, exercise).label).toBe(
      exercise.steps.length === 1 ? 'Ver resultado' : 'Siguiente paso'
    );
  });

  it('revela la respuesta y permite avanzar después del segundo error', () => {
    const { wrong } = optionsFor(exercise);
    const firstFailure = answer(createInitialSession(exercise), exercise, wrong[0]);
    const secondFailure = answer(continueAfterHint(firstFailure), exercise, wrong[1]);

    expect(secondFailure.phase).toBe('complete');
    expect(secondFailure.feedback?.type).toBe('bad');
    expect(secondFailure.revealed).toBe(1);
    expect(secondFailure.failedOptionIds).toEqual([wrong[0].id, wrong[1].id]);
    expect(getExerciseAction(secondFailure, exercise).label).toBe(
      exercise.steps.length === 1 ? 'Ver resultado' : 'Siguiente paso'
    );
  });

  it('aísla selección, feedback, intentos y opciones fallidas entre pasos', () => {
    if (exercise.steps.length < 2) return;
    const { wrong } = optionsFor(exercise);
    const firstFailure = answer(createInitialSession(exercise), exercise, wrong[0]);
    const completed = answer(continueAfterHint(firstFailure), exercise, wrong[1]);
    const advanced = nextStep(completed, exercise);

    expect(advanced.currentStepIndex).toBe(1);
    expect(advanced.phase).toBe('answering');
    expect(advanced.attempts).toBe(0);
    expect(advanced.selectedOptionId).toBeNull();
    expect(advanced.feedback).toBeNull();
    expect(advanced.failedOptionIds).toEqual([]);
    expect(completed.failedOptionIdsByStepId[exercise.steps[0].id]).toEqual([wrong[0].id, wrong[1].id]);
  });
});

describe('casos defensivos y finalización', () => {
  const exercise = courseContent.exercises[0];

  it('avisa cuando no hay selección', () => {
    const result = submitAnswer(createInitialSession(exercise), exercise);
    expect(result.phase).toBe('answering');
    expect(result.feedback?.type).toBe('warn');
  });

  it('descarta una selección que no existe en el paso', () => {
    const session = { ...createInitialSession(exercise), selectedOptionId: 'inexistente' };
    const result = submitAnswer(session, exercise);
    expect(result.phase).toBe('answering');
    expect(result.selectedOptionId).toBeNull();
    expect(result.feedback?.type).toBe('warn');
  });

  it('marca el último paso resuelto como listo para ver el resultado', () => {
    const lastStepIndex = exercise.steps.length - 1;
    const base = { ...createInitialSession(exercise), currentStepIndex: lastStepIndex };
    const { correct } = optionsFor(exercise, lastStepIndex);
    const resolved = answer(base, exercise, correct);
    const finished = nextStep(resolved, exercise);

    expect(getExerciseAction(resolved, exercise)).toMatchObject({ type: 'finish', label: 'Ver resultado' });
    expect(finished.completedAt).not.toBeNull();
  });
});
