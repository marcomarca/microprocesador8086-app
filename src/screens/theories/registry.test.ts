import { describe, expect, it } from 'vitest';
import { courseContent } from '../../content';
import { getTheoryRenderer, theoryRenderers } from './registry';

describe('registro de renderizadores teóricos', () => {
  it('resuelve un componente distinto para cada teoría registrada', () => {
    const theory1 = courseContent.theories.find((theory) => theory.id === 'theory_mov_01');
    const theory2 = courseContent.theories.find((theory) => theory.id === 'theory_memory_dw_02');
    const theory3 = courseContent.theories.find((theory) => theory.id === 'theory_indirect_indexed_03');

    expect(theory1).toBeDefined();
    expect(theory2).toBeDefined();
    expect(theory3).toBeDefined();
    expect(getTheoryRenderer(theory1!.renderer)).toBe(theoryRenderers['mov-registers']);
    expect(getTheoryRenderer(theory2!.renderer)).toBe(theoryRenderers['memory-dw']);
    expect(getTheoryRenderer(theory3!.renderer)).toBe(theoryRenderers['indirect-indexed']);
    expect(getTheoryRenderer(theory1!.renderer)).not.toBe(getTheoryRenderer(theory2!.renderer));
  });

  it('todas las teorías del curso tienen un renderizador disponible', () => {
    for (const theory of courseContent.theories) {
      expect(getTheoryRenderer(theory.renderer), theory.id).not.toBeNull();
    }
  });
});
