export type RegisterName =
  | 'AX'
  | 'BX'
  | 'CX'
  | 'DX'
  | 'AH'
  | 'AL'
  | 'BH'
  | 'BL'
  | 'CH'
  | 'CL'
  | 'DH'
  | 'DL'
  | 'SP'
  | 'BP'
  | 'SI'
  | 'DI'
  | 'ZF'
  | 'CF'
  | 'SF'
  | 'OF'
  | 'PF';

export type RegisterState = Partial<Record<RegisterName, string>>;

export type MemoryRow = {
  label: string;
  address: string;
  bytes: string[];
  word: string;
};

export type FeedbackType = 'ok' | 'bad' | 'warn' | 'info';

export type ConceptErrorTag = string;

export type QuestionOption = {
  id: string;
  text: string;
  correct: boolean;
  feedback?: string;
  hint?: string;
  tag?: ConceptErrorTag;
};

export type MultipleChoiceStep = {
  id: string;
  step: number;
  codeIndex: number;
  title: string;
  instruction: string;
  question: string;
  before: RegisterState;
  after: RegisterState;
  changed: RegisterName[];
  memoryBefore?: MemoryRow[];
  memoryAfter?: MemoryRow[];
  changedMemory?: string[];
  correctExplain: string;
  diagram?: string;
  options: QuestionOption[];
};

export type PassingRules = {
  canAdvance: number;
  reviewRecommended: number;
  mustRepeat: number;
};

export type ReviewQuickQuestion = {
  id: string;
  prompt: string;
  options: QuestionOption[];
  correctFeedback: string;
  incorrectFeedback: string;
};

export type ReviewBlock = {
  title: string;
  body: string;
  code?: string;
};

export type ExerciseReview = {
  title: string;
  subtitle: string;
  blocks: ReviewBlock[];
  quickQuestion?: ReviewQuickQuestion;
};

export type VariantGroup = {
  id: string;
  label: string;
  options: string[];
};

export type VariantQuestion = {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  instruction?: string;
  groups: VariantGroup[];
  correctSelection: Record<string, string>;
  correctFeedback: string;
  incorrectFeedback: string;
};

export type Exercise = {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  estimatedMinutes: number;
  requiredTheoryId?: string;
  initialRegisters: RegisterState;
  initialMemory?: MemoryRow[];
  codeLines: string[];
  steps: MultipleChoiceStep[];
  passing: PassingRules;
  review?: ExerciseReview;
  variant?: VariantQuestion;
};

export type TheoryLesson = {
  id: string;
  renderer: TheoryRendererId;
  moduleId: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  estimatedMinutes: number;
  audioFile: string;
  unlockExerciseId: string;
};

export type CourseModule = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  theoryIds?: string[];
  exerciseIds: string[];
};

export type CourseContent = {
  title: string;
  subtitle: string;
  version: string;
  modules: CourseModule[];
  theories: TheoryLesson[];
  exercises: Exercise[];
  errorCatalog: Record<ConceptErrorTag, string>;
};

export type AppScreen = 'menu' | 'theory' | 'exercise' | 'final' | 'review' | 'variant';
export type ExercisePhase = 'answering' | 'hint' | 'complete';
export type ExerciseActionType = 'submit' | 'retry' | 'next' | 'finish';

export type ExerciseAction = {
  type: ExerciseActionType;
  label: 'Confirmar respuesta' | 'Intentar otra vez' | 'Siguiente paso' | 'Ver resultado';
  disabled: boolean;
};

export type FeedbackMessage = {
  type: FeedbackType;
  text: string;
};

export type AttemptLog = {
  exerciseId: string;
  stepId: string;
  step: number;
  instruction: string;
  selected: string;
  selectedOptionId: string;
  correct: boolean;
  attempts: number;
  score: number;
  errorTag: ConceptErrorTag | null;
  timestamp: string;
};

export type ExerciseSession = {
  exerciseId: string;
  currentStepIndex: number;
  registers: RegisterState;
  memory: MemoryRow[];
  selectedOptionId: string | null;
  optionOrderByStepId: Record<string, string[]>;
  failedOptionIds: string[];
  failedOptionIdsByStepId: Record<string, string[]>;
  attempts: number;
  phase: ExercisePhase;
  feedback: FeedbackMessage | null;
  changed: RegisterName[];
  changedMemory: string[];
  showCode: boolean;
  score: number;
  firstCorrect: number;
  withHint: number;
  revealed: number;
  logs: AttemptLog[];
  startedAt: string;
  completedAt: string | null;
};

export type ExerciseResultSummary = {
  exerciseId: string;
  title: string;
  score: number;
  maxScore: number;
  firstCorrect: number;
  withHint: number;
  revealed: number;
  status: string;
  completedAt: string;
  errors: Record<ConceptErrorTag, number>;
};

export type CourseProgress = {
  version: number;
  routeCursor: number;
  completedTheoryIds: string[];
  manualUnlockedTheoryIds: string[];
  completedExerciseIds: string[];
  manualUnlockedExerciseIds: string[];
  exerciseResults: Record<string, ExerciseResultSummary>;
  diagnostics: Record<ConceptErrorTag, number>;
  lastExerciseId: string | null;
  lastTheoryId: string | null;
  lastUpdated: string;
};

export type TheoryAccess = {
  theoryId: string;
  index: number;
  completed: boolean;
  unlocked: boolean;
  manualUnlocked: boolean;
  lockedReason: string | null;
};

export type ExerciseAccess = {
  exerciseId: string;
  index: number;
  completed: boolean;
  unlocked: boolean;
  manualUnlocked: boolean;
  lockedReason: string | null;
};

export type GoogleSheetsPayload = {
  participantLabel: string;
  courseTitle: string;
  courseVersion: string;
  exerciseId: string;
  exerciseTitle: string;
  score: number;
  maxScore: number;
  status: string;
  errors: Record<ConceptErrorTag, number>;
  completedAt: string;
  readableReport: string;
};
import type { TheoryRendererId } from './content/theoryRendererIds';
