import type { CourseContent, Exercise, ExerciseSession, GoogleSheetsPayload } from '../types';
import { countErrors, getExerciseStatus } from './session';

export function createReadableReport(
  content: CourseContent,
  exercise: Exercise,
  session: ExerciseSession,
  participantLabel = 'Sin identificar'
): string {
  const errors = countErrors(session.logs);
  const lines: string[] = [];

  lines.push('REPORTE DE EJERCICIO');
  lines.push('====================');
  lines.push(`Curso: ${content.title}`);
  lines.push(`Versión: ${content.version}`);
  lines.push(`Participante: ${participantLabel || 'Sin identificar'}`);
  lines.push(`Ejercicio: ${exercise.title}`);
  lines.push(`Fecha: ${new Date(session.completedAt ?? Date.now()).toLocaleString('es')}`);
  lines.push('');
  lines.push('RESULTADO');
  lines.push('---------');
  lines.push(`Puntaje: ${session.score.toFixed(1)} / ${exercise.steps.length}`);
  lines.push(`Correctas al primer intento: ${session.firstCorrect}/${exercise.steps.length}`);
  lines.push(`Correctas con pista: ${session.withHint}/${exercise.steps.length}`);
  lines.push(`No corregidas: ${session.revealed}/${exercise.steps.length}`);
  lines.push(`Diagnóstico: ${getExerciseStatus(exercise, session.score)}`);
  lines.push('');
  lines.push('ERRORES DETECTADOS');
  lines.push('-------------------');

  if (Object.keys(errors).length === 0) {
    lines.push('No se detectaron errores conceptuales en este ejercicio.');
  } else {
    for (const [tag, count] of Object.entries(errors).sort((a, b) => b[1] - a[1])) {
      lines.push(`- ${content.errorCatalog[tag] ?? tag} (${count})`);
    }
  }

  lines.push('');
  lines.push('DETALLE DE INTENTOS');
  lines.push('-------------------');

  for (const log of session.logs) {
    lines.push(
      `Paso ${log.step}: ${log.instruction} | Selección: ${log.selected} | ${log.correct ? 'Correcta' : 'Incorrecta'} | Intento: ${log.attempts}`
    );
  }

  return lines.join('\n');
}

export function createGoogleSheetsPayload(
  content: CourseContent,
  exercise: Exercise,
  session: ExerciseSession,
  participantLabel: string
): GoogleSheetsPayload {
  const readableReport = createReadableReport(content, exercise, session, participantLabel);
  return {
    participantLabel: participantLabel || 'Sin identificar',
    courseTitle: content.title,
    courseVersion: content.version,
    exerciseId: exercise.id,
    exerciseTitle: exercise.title,
    score: session.score,
    maxScore: exercise.steps.length,
    status: getExerciseStatus(exercise, session.score),
    errors: countErrors(session.logs),
    completedAt: session.completedAt ?? new Date().toISOString(),
    readableReport
  };
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadTextFile(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
