import type { Exercise, MultipleChoiceStep, QuestionOption } from '../types';

export function createOptionOrderByStepId(exercise: Exercise): Record<string, string[]> {
  return Object.fromEntries(
    exercise.steps.map((step) => [step.id, shuffle(step.options.map((option) => option.id))])
  );
}

export function getOrderedOptions(
  step: MultipleChoiceStep,
  optionOrderByStepId: Record<string, string[]> | undefined
): QuestionOption[] {
  const order = optionOrderByStepId?.[step.id];
  if (!order || order.length !== step.options.length) return step.options;

  const optionsById = new Map(step.options.map((option) => [option.id, option]));
  const orderedOptions = order.map((id) => optionsById.get(id));

  if (orderedOptions.some((option) => !option)) return step.options;
  return orderedOptions as QuestionOption[];
}

export function getVisibleOptionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}
