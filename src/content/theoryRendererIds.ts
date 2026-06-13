export const theoryRendererIds = [
  'mov-registers',
  'memory-dw',
  'indirect-indexed',
  'arithmetic-flags',
  'conditional-jumps',
  'loop-accumulator',
  'stack-lifo'
] as const;

export type TheoryRendererId = (typeof theoryRendererIds)[number];
