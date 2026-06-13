export type SubtitleToggleController = {
  isVisible: () => boolean;
  toggle: () => void;
  destroy: () => void;
};

export function createSubtitleToggle(
  button: HTMLButtonElement,
  panel: HTMLElement
): SubtitleToggleController {
  let visible = false;

  function render(): void {
    panel.hidden = !visible;
    button.classList.toggle('is-active', visible);
    button.setAttribute('aria-pressed', String(visible));
    button.setAttribute('aria-label', visible ? 'Ocultar subtítulos' : 'Mostrar subtítulos');
  }

  function toggle(): void {
    visible = !visible;
    render();
  }

  button.addEventListener('click', toggle);
  render();

  return {
    isVisible: () => visible,
    toggle,
    destroy: () => button.removeEventListener('click', toggle)
  };
}
