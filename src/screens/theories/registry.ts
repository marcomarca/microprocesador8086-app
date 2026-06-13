import MovTheoryScreen from './MovTheoryScreen.svelte';
import MemoryDwTheoryScreen from './MemoryDwTheoryScreen.svelte';
import type { TheoryRendererId } from '../../content/theoryRendererIds';
import type { TheoryRenderer } from './types';

export const theoryRenderers: Record<TheoryRendererId, TheoryRenderer> = {
  'mov-registers': MovTheoryScreen,
  'memory-dw': MemoryDwTheoryScreen
};

export function getTheoryRenderer(renderer: TheoryRendererId): TheoryRenderer | null {
  return theoryRenderers[renderer] ?? null;
}
