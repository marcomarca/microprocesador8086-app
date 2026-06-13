import { describe, expect, it } from 'vitest';
import { courseContent } from '../../content';
import { getTheoryRenderer, theoryRenderers } from './registry';

describe('registro de renderizadores teóricos', () => {
  it('resuelve un componente distinto para cada teoría registrada', () => {
    const theory1 = courseContent.theories.find((theory) => theory.id === 'theory_mov_01');
    const theory2 = courseContent.theories.find((theory) => theory.id === 'theory_memory_dw_02');
    const theory3 = courseContent.theories.find((theory) => theory.id === 'theory_indirect_indexed_03');
    const theory4 = courseContent.theories.find((theory) => theory.id === 'theory_arithmetic_flags_04');
    const theory5 = courseContent.theories.find((theory) => theory.id === 'theory_conditional_jumps_05');
    const theory6 = courseContent.theories.find((theory) => theory.id === 'theory_loop_accumulator_06');
    const theory7 = courseContent.theories.find((item) => item.id === 'theory_stack_lifo_07');
    const theory8 = courseContent.theories.find((item) => item.id === 'theory_call_ret_08');

    expect(theory1).toBeDefined();
    expect(theory2).toBeDefined();
    expect(theory3).toBeDefined();
    expect(theory4).toBeDefined();
    expect(theory5).toBeDefined();
    expect(theory6).toBeDefined();
    expect(theory7).toBeTruthy();
    expect(theory8).toBeTruthy();
    expect(getTheoryRenderer(theory1!.renderer)).toBe(theoryRenderers['mov-registers']);
    expect(getTheoryRenderer(theory2!.renderer)).toBe(theoryRenderers['memory-dw']);
    expect(getTheoryRenderer(theory3!.renderer)).toBe(theoryRenderers['indirect-indexed']);
    expect(getTheoryRenderer(theory4!.renderer)).toBe(theoryRenderers['arithmetic-flags']);
    expect(getTheoryRenderer(theory5!.renderer)).toBe(theoryRenderers['conditional-jumps']);
    expect(getTheoryRenderer(theory6!.renderer)).toBe(theoryRenderers['loop-accumulator']);
    expect(getTheoryRenderer(theory7!.renderer)).toBe(theoryRenderers['stack-lifo']);
    expect(getTheoryRenderer(theory8!.renderer)).toBe(theoryRenderers['call-ret']);
    expect(getTheoryRenderer(theory1!.renderer)).not.toBe(getTheoryRenderer(theory2!.renderer));
  });

  it('todas las teorías del curso tienen un renderizador disponible', () => {
    for (const theory of courseContent.theories) {
      expect(getTheoryRenderer(theory.renderer), theory.id).not.toBeNull();
    }
  });
});
