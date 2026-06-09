import { z } from 'zod';
import type { CourseContent } from '../types';

const registerStateSchema = z.record(z.string(), z.string());

const memoryRowSchema = z.object({
  label: z.string().min(1),
  address: z.string().min(1),
  bytes: z.array(z.string().min(1)).min(1),
  word: z.string().min(1)
});

const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  correct: z.boolean(),
  feedback: z.string().optional(),
  hint: z.string().optional(),
  tag: z.string().optional()
});

const stepSchema = z.object({
  id: z.string().min(1),
  step: z.number().int().positive(),
  codeIndex: z.number().int().nonnegative(),
  title: z.string().min(1),
  instruction: z.string().min(1),
  question: z.string().min(1),
  before: registerStateSchema,
  after: registerStateSchema,
  changed: z.array(z.string()),
  memoryBefore: z.array(memoryRowSchema).optional(),
  memoryAfter: z.array(memoryRowSchema).optional(),
  changedMemory: z.array(z.string()).optional(),
  correctExplain: z.string().min(1),
  diagram: z.string().optional(),
  options: z.array(optionSchema).min(2)
});

const exerciseSchema = z.object({
  id: z.string().min(1),
  moduleId: z.string().min(1),
  order: z.number().int().positive(),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
  initialRegisters: registerStateSchema,
  initialMemory: z.array(memoryRowSchema).optional(),
  codeLines: z.array(z.string()).min(1),
  steps: z.array(stepSchema).min(1),
  passing: z.object({
    canAdvance: z.number(),
    reviewRecommended: z.number(),
    mustRepeat: z.number()
  }),
  review: z.unknown().optional(),
  variant: z.unknown().optional()
});

const moduleSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  exerciseIds: z.array(z.string()).min(1)
});

const courseSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  version: z.string().min(1),
  modules: z.array(moduleSchema).min(1),
  exercises: z.array(exerciseSchema).min(1),
  errorCatalog: z.record(z.string(), z.string())
});

export function validateCourseContent(content: CourseContent): string[] {
  const result = courseSchema.safeParse(content);
  const errors: string[] = [];

  if (!result.success) {
    errors.push(...result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`));
    return errors;
  }

  const exerciseIds = new Set(content.exercises.map((exercise) => exercise.id));
  const moduleIds = new Set(content.modules.map((module) => module.id));

  for (const module of content.modules) {
    for (const exerciseId of module.exerciseIds) {
      if (!exerciseIds.has(exerciseId)) {
        errors.push(`Module ${module.id} references missing exercise ${exerciseId}.`);
      }
    }
  }

  for (const exercise of content.exercises) {
    if (!moduleIds.has(exercise.moduleId)) {
      errors.push(`Exercise ${exercise.id} references missing module ${exercise.moduleId}.`);
    }

    const module = content.modules.find((item) => item.id === exercise.moduleId);
    if (module && !module.exerciseIds.includes(exercise.id)) {
      errors.push(`Exercise ${exercise.id} is not listed in module ${module.id}.exerciseIds.`);
    }

    for (const step of exercise.steps) {
      const correctOptions = step.options.filter((option) => option.correct);
      if (correctOptions.length !== 1) {
        errors.push(`Exercise ${exercise.id}, step ${step.id} must have exactly one correct option.`);
      }

      if (step.codeIndex >= exercise.codeLines.length) {
        errors.push(`Exercise ${exercise.id}, step ${step.id} has codeIndex outside codeLines.`);
      }

      for (const option of step.options) {
        if (!option.correct && !option.hint) {
          errors.push(`Exercise ${exercise.id}, step ${step.id}, option ${option.id} needs a hint.`);
        }
        if (option.tag && !content.errorCatalog[option.tag]) {
          errors.push(`Exercise ${exercise.id}, step ${step.id}, option ${option.id} uses unknown tag ${option.tag}.`);
        }
      }
    }
  }

  return errors;
}
