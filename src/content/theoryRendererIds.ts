export const theoryRendererIds = ['mov-registers', 'memory-dw'] as const;

export type TheoryRendererId = (typeof theoryRendererIds)[number];
