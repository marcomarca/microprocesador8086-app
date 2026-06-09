import type {
  AttemptLog,
  ConceptErrorTag,
  CourseContent,
  CourseProgress,
  Exercise,
  ExerciseAccess,
  ExerciseResultSummary,
  ExerciseSession,
  MemoryRow,
  MultipleChoiceStep,
  QuestionOption
} from '../types';

function cloneMemory(memory: MemoryRow[] | undefined): MemoryRow[] {
  return (memory ?? []).map((row) => ({
    ...row,
    bytes: [...row.bytes]
  }));
}

export function createInitialSession(exercise: Exercise): ExerciseSession {
  const firstStep = exercise.steps[0];

  return {
    exerciseId: exercise.id,
    currentStepIndex: 0,
    registers: { ...firstStep?.before },
    memory: cloneMemory(firstStep?.memoryBefore ?? exercise.initialMemory),
    selectedOptionId: null,
    failedOptionIds: [],
    attempts: 0,
    phase: 'answering',
    feedback: null,
    changed: [],
    changedMemory: [],
    showCode: false,
    score: 0,
    firstCorrect: 0,
    withHint: 0,
    revealed: 0,
    logs: [],
    startedAt: new Date().toISOString(),
    completedAt: null
  };
}

export function selectOption(session: ExerciseSession, optionId: string): ExerciseSession {
  if (session.phase !== 'answering') return session;
  if (session.failedOptionIds.includes(optionId)) return session;
  return { ...session, selectedOptionId: optionId };
}

export function toggleCode(session: ExerciseSession): ExerciseSession {
  return { ...session, showCode: !session.showCode };
}

export function continueAfterHint(session: ExerciseSession): ExerciseSession {
  if (session.phase !== 'hint') return session;
  return {
    ...session,
    phase: 'answering',
    feedback: null,
    selectedOptionId: null
  };
}

export function submitAnswer(session: ExerciseSession, exercise: Exercise): ExerciseSession {
  const step = exercise.steps[session.currentStepIndex];
  if (!step) return session;

  if (!session.selectedOptionId) {
    return {
      ...session,
      feedback: { type: 'warn', text: 'Selecciona una opción antes de confirmar.' }
    };
  }

  const option = step.options.find((item) => item.id === session.selectedOptionId);
  if (!option) {
    return {
      ...session,
      selectedOptionId: null,
      feedback: { type: 'warn', text: 'La opción seleccionada no existe. Selecciona otra opción.' }
    };
  }

  if (option.correct) return applyCorrectAnswer(session, step, option);
  return applyWrongAnswer(session, step, option);
}

function applyCorrectAnswer(
  session: ExerciseSession,
  step: MultipleChoiceStep,
  option: QuestionOption
): ExerciseSession {
  const partial = session.attempts === 0 ? 1 : 0.5;
  const log = createLog(session, step, option, true, partial);

  return {
    ...session,
    score: session.score + partial,
    firstCorrect: session.firstCorrect + (session.attempts === 0 ? 1 : 0),
    withHint: session.withHint + (session.attempts === 0 ? 0 : 1),
    logs: [...session.logs, log],
    registers: { ...step.after },
    memory: cloneMemory(step.memoryAfter ?? step.memoryBefore ?? session.memory),
    changed: [...step.changed],
    changedMemory: [...(step.changedMemory ?? [])],
    phase: 'complete',
    feedback: { type: 'ok', text: option.feedback ?? step.correctExplain },
    selectedOptionId: option.id
  };
}

function applyWrongAnswer(
  session: ExerciseSession,
  step: MultipleChoiceStep,
  option: QuestionOption
): ExerciseSession {
  const log = createLog(session, step, option, false, 0);
  const failedOptionIds = unique([...session.failedOptionIds, option.id]);

  if (session.attempts === 0) {
    return {
      ...session,
      logs: [...session.logs, log],
      attempts: 1,
      failedOptionIds,
      selectedOptionId: null,
      phase: 'hint',
      feedback: { type: 'bad', text: `Incorrecto. ${option.hint ?? step.correctExplain}` }
    };
  }

  return {
    ...session,
    logs: [...session.logs, log],
    revealed: session.revealed + 1,
    failedOptionIds,
    registers: { ...step.after },
    memory: cloneMemory(step.memoryAfter ?? step.memoryBefore ?? session.memory),
    changed: [...step.changed],
    changedMemory: [...(step.changedMemory ?? [])],
    phase: 'complete',
    feedback: {
      type: 'bad',
      text: `Respuesta correcta: ${getCorrectOption(step).text}. ${step.correctExplain}`
    }
  };
}

export function nextStep(session: ExerciseSession, exercise: Exercise): ExerciseSession {
  if (session.currentStepIndex >= exercise.steps.length - 1) {
    return { ...session, completedAt: new Date().toISOString() };
  }

  const nextIndex = session.currentStepIndex + 1;
  const next = exercise.steps[nextIndex];

  return {
    ...session,
    currentStepIndex: nextIndex,
    registers: { ...next.before },
    memory: cloneMemory(next.memoryBefore ?? session.memory),
    selectedOptionId: null,
    failedOptionIds: [],
    attempts: 0,
    phase: 'answering',
    feedback: null,
    changed: [],
    changedMemory: []
  };
}

export function getCorrectOption(step: MultipleChoiceStep): QuestionOption {
  const correct = step.options.find((option) => option.correct);
  if (!correct) {
    return { id: '?', text: 'No hay respuesta correcta definida.', correct: true };
  }
  return correct;
}

export function countErrors(logs: AttemptLog[]): Record<ConceptErrorTag, number> {
  const counts: Record<ConceptErrorTag, number> = {};
  for (const log of logs) {
    if (!log.correct && log.errorTag) {
      counts[log.errorTag] = (counts[log.errorTag] ?? 0) + 1;
    }
  }
  return counts;
}

export function getExerciseStatus(exercise: Exercise, score: number): string {
  if (score >= exercise.passing.canAdvance) return 'Puede avanzar al siguiente módulo.';
  if (score >= exercise.passing.reviewRecommended) return 'Puede avanzar, pero se recomienda repaso.';
  if (score >= exercise.passing.mustRepeat) return 'Debe repetir el bloque antes de continuar.';
  return 'Requiere explicación guiada o intervención docente.';
}

export function createResultSummary(exercise: Exercise, session: ExerciseSession): ExerciseResultSummary {
  return {
    exerciseId: exercise.id,
    title: exercise.title,
    score: session.score,
    maxScore: exercise.steps.length,
    firstCorrect: session.firstCorrect,
    withHint: session.withHint,
    revealed: session.revealed,
    status: getExerciseStatus(exercise, session.score),
    completedAt: session.completedAt ?? new Date().toISOString(),
    errors: countErrors(session.logs)
  };
}

function createLog(
  session: ExerciseSession,
  step: MultipleChoiceStep,
  option: QuestionOption,
  correct: boolean,
  score: number
): AttemptLog {
  return {
    exerciseId: session.exerciseId,
    stepId: step.id,
    step: step.step,
    instruction: step.instruction,
    selected: option.text,
    selectedOptionId: option.id,
    correct,
    attempts: session.attempts + 1,
    score,
    errorTag: correct ? null : option.tag ?? null,
    timestamp: new Date().toISOString()
  };
}

export function createInitialProgress(): CourseProgress {
  return {
    version: 1,
    routeCursor: 0,
    completedExerciseIds: [],
    manualUnlockedExerciseIds: [],
    exerciseResults: {},
    diagnostics: {},
    lastExerciseId: null,
    lastUpdated: new Date().toISOString()
  };
}

export function flattenExerciseOrder(content: CourseContent): string[] {
  const moduleOrder = [...content.modules].sort((a, b) => a.order - b.order);
  const ids: string[] = [];

  for (const module of moduleOrder) {
    const exercises = module.exerciseIds
      .map((id) => content.exercises.find((exercise) => exercise.id === id))
      .filter((exercise): exercise is Exercise => Boolean(exercise))
      .sort((a, b) => a.order - b.order);

    ids.push(...exercises.map((exercise) => exercise.id));
  }

  return ids;
}

export function getExerciseAccess(content: CourseContent, progress: CourseProgress, exerciseId: string): ExerciseAccess {
  const order = flattenExerciseOrder(content);
  const index = order.indexOf(exerciseId);
  const completed = progress.completedExerciseIds.includes(exerciseId);
  const manualUnlocked = progress.manualUnlockedExerciseIds.includes(exerciseId);
  const unlocked = completed || manualUnlocked || index <= progress.routeCursor;

  return {
    exerciseId,
    index,
    completed,
    unlocked,
    manualUnlocked,
    lockedReason: unlocked ? null : 'Este ejercicio está fuera de la ruta sugerida.'
  };
}

export function manuallyUnlockExercise(progress: CourseProgress, exerciseId: string): CourseProgress {
  return {
    ...progress,
    manualUnlockedExerciseIds: unique([...progress.manualUnlockedExerciseIds, exerciseId]),
    lastUpdated: new Date().toISOString()
  };
}

export function applyExerciseCompletion(
  progress: CourseProgress,
  content: CourseContent,
  exercise: Exercise,
  session: ExerciseSession
): CourseProgress {
  const result = createResultSummary(exercise, session);
  const completedExerciseIds = unique([...progress.completedExerciseIds, exercise.id]);
  const diagnostics = { ...progress.diagnostics };

  for (const [tag, count] of Object.entries(result.errors)) {
    diagnostics[tag] = (diagnostics[tag] ?? 0) + count;
  }

  const order = flattenExerciseOrder(content);
  let routeCursor = progress.routeCursor;
  while (routeCursor < order.length && completedExerciseIds.includes(order[routeCursor])) {
    routeCursor += 1;
  }

  return {
    ...progress,
    routeCursor,
    completedExerciseIds,
    diagnostics,
    lastExerciseId: exercise.id,
    exerciseResults: {
      ...progress.exerciseResults,
      [exercise.id]: result
    },
    lastUpdated: new Date().toISOString()
  };
}

export function getExerciseById(content: CourseContent, exerciseId: string): Exercise | null {
  return content.exercises.find((exercise) => exercise.id === exerciseId) ?? null;
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
