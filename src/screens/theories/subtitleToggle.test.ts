import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { createSubtitleToggle } from './subtitleToggle';

function createElements() {
  const listeners = new Map<string, EventListener>();
  const classes = new Set<string>();
  const attributes = new Map<string, string>();
  const button = {
    classList: {
      toggle: (name: string, force: boolean) => force ? classes.add(name) : classes.delete(name)
    },
    setAttribute: (name: string, value: string) => attributes.set(name, value),
    addEventListener: (name: string, listener: EventListener) => listeners.set(name, listener),
    removeEventListener: vi.fn((name: string) => listeners.delete(name))
  } as unknown as HTMLButtonElement;
  const panel = { hidden: false } as HTMLElement;

  return { button, panel, listeners, classes, attributes };
}

describe('control compartido de subtítulos', () => {
  it('empieza oculto y expone el estado accesible correcto', () => {
    const { button, panel, classes, attributes } = createElements();
    const controller = createSubtitleToggle(button, panel);

    expect(controller.isVisible()).toBe(false);
    expect(panel.hidden).toBe(true);
    expect(classes.has('is-active')).toBe(false);
    expect(attributes.get('aria-pressed')).toBe('false');
    expect(attributes.get('aria-label')).toBe('Mostrar subtítulos');
  });

  it('alterna visibilidad y estado activo con el mismo botón CC', () => {
    const { button, panel, listeners, classes, attributes } = createElements();
    createSubtitleToggle(button, panel);
    const click = listeners.get('click');

    click?.(new Event('click'));
    expect(panel.hidden).toBe(false);
    expect(classes.has('is-active')).toBe(true);
    expect(attributes.get('aria-pressed')).toBe('true');
    expect(attributes.get('aria-label')).toBe('Ocultar subtítulos');

    click?.(new Event('click'));
    expect(panel.hidden).toBe(true);
    expect(classes.has('is-active')).toBe(false);
    expect(attributes.get('aria-pressed')).toBe('false');
  });

  it('elimina su listener al desmontar la teoría', () => {
    const { button } = createElements();
    const controller = createSubtitleToggle(button, {} as HTMLElement);

    controller.destroy();
    expect(button.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });
});


describe('uso estático de CC en Teoría 3', () => {
  const source = readFileSync(new URL('./IndirectIndexedTheoryScreen.svelte', import.meta.url), 'utf8');

  it('declara el botón y panel de subtítulos ocultos por defecto', () => {
    expect(source).toContain('createSubtitleToggle');
    expect(source).toContain('id="subtitleBtn"');
    expect(source).toContain('id="subtitle" hidden');
    expect(source).toContain('CC');
    expect(source).toContain('.subtitle[hidden]');
  });
});


describe('uso estático de CC en Teoría 4', () => {
  const source = readFileSync(new URL('./ArithmeticFlagsTheoryScreen.svelte', import.meta.url), 'utf8');

  it('declara el botón y panel de subtítulos ocultos por defecto', () => {
    expect(source).toContain('createSubtitleToggle');
    expect(source).toContain('id="subtitleBtn"');
    expect(source).toContain('id="subtitle" hidden');
    expect(source).toContain('CC');
    expect(source).toContain('.subtitle[hidden]');
    expect(source).toContain('subtitleToggle.destroy()');
  });
});


describe('uso estático de CC en Teoría 5', () => {
  const source = readFileSync(new URL('./ConditionalJumpsTheoryScreen.svelte', import.meta.url), 'utf8');

  it('declara el botón y panel de subtítulos ocultos por defecto', () => {
    expect(source).toContain('createSubtitleToggle');
    expect(source).toContain('id="subtitleBtn"');
    expect(source).toContain('id="subtitle" hidden');
    expect(source).toContain('CC');
    expect(source).toContain('.subtitle[hidden]');
    expect(source).toContain('subtitleToggle.destroy()');
  });
});
