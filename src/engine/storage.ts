import { appConfig } from '../content/appConfig';
import { courseContent } from '../content';
import type { CourseProgress } from '../types';
import { createInitialProgress, flattenCourseUnitOrder } from './session';

export function loadProgress(): CourseProgress {
  try {
    const raw = window.localStorage.getItem(appConfig.storageKey);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw) as CourseProgress;
    return normalizeProgress(parsed);
  } catch {
    return createInitialProgress();
  }
}

export function saveProgress(progress: CourseProgress): void {
  try {
    window.localStorage.setItem(appConfig.storageKey, JSON.stringify(progress));
  } catch {
    // La app debe seguir funcionando aunque el navegador no acepte almacenamiento.
  }
}

export function clearProgress(): CourseProgress {
  try {
    window.localStorage.removeItem(appConfig.storageKey);
  } catch {
    // Fallback silencioso: devuelve progreso limpio de todos modos.
  }
  return createInitialProgress();
}

function normalizeProgress(progress: Partial<CourseProgress>): CourseProgress {
  const clean = createInitialProgress();
  const completedExerciseIds = Array.isArray(progress.completedExerciseIds) ? progress.completedExerciseIds : [];
  const completedTheoryIds = Array.isArray(progress.completedTheoryIds) ? [...progress.completedTheoryIds] : [];

  for (const exercise of courseContent.exercises) {
    if (!exercise.requiredTheoryId) continue;
    if (!completedExerciseIds.includes(exercise.id)) continue;
    if (!completedTheoryIds.includes(exercise.requiredTheoryId)) completedTheoryIds.push(exercise.requiredTheoryId);
  }

  const normalized: CourseProgress = {
    ...clean,
    ...progress,
    completedTheoryIds,
    manualUnlockedTheoryIds: Array.isArray(progress.manualUnlockedTheoryIds) ? progress.manualUnlockedTheoryIds : [],
    completedExerciseIds,
    manualUnlockedExerciseIds: Array.isArray(progress.manualUnlockedExerciseIds)
      ? progress.manualUnlockedExerciseIds
      : [],
    exerciseResults: progress.exerciseResults ?? {},
    diagnostics: progress.diagnostics ?? {},
    routeCursor: 0,
    lastExerciseId: progress.lastExerciseId ?? null,
    lastTheoryId: progress.lastTheoryId ?? null,
    version: 2
  };

  const routeOrder = flattenCourseUnitOrder(courseContent);
  while (normalized.routeCursor < routeOrder.length) {
    const unit = routeOrder[normalized.routeCursor];
    const completed = unit.type === 'theory'
      ? normalized.completedTheoryIds.includes(unit.id)
      : normalized.completedExerciseIds.includes(unit.id);
    if (!completed) break;
    normalized.routeCursor += 1;
  }

  return normalized;
}
