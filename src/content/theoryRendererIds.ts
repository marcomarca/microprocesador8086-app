export const theoryRendererIds = ['mov-registers', 'memory-dw', 'indirect-indexed'] as const;

export type TheoryRendererId = (typeof theoryRendererIds)[number];
