import { appConfig } from '../content/appConfig';
import type { CourseProgress } from '../types';
import { createInitialProgress } from './session';

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
  return {
    ...clean,
    ...progress,
    completedExerciseIds: Array.isArray(progress.completedExerciseIds) ? progress.completedExerciseIds : [],
    manualUnlockedExerciseIds: Array.isArray(progress.manualUnlockedExerciseIds)
      ? progress.manualUnlockedExerciseIds
      : [],
    exerciseResults: progress.exerciseResults ?? {},
    diagnostics: progress.diagnostics ?? {},
    routeCursor: typeof progress.routeCursor === 'number' ? progress.routeCursor : 0,
    version: 1
  };
}
