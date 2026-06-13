export const theoryRendererIds = [
  'mov-registers',
  'memory-dw',
  'indirect-indexed',
  'arithmetic-flags',
  'conditional-jumps'
] as const;

export type TheoryRendererId = (typeof theoryRendererIds)[number];
