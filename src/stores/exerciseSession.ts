import { get, writable } from 'svelte/store';
import type { Exercise, ExerciseSession } from '../types';
import {
  continueAfterHint,
  createInitialSession,
  getExerciseAction,
  nextStep,
  normalizeSessionForCurrentStep,
  selectOption,
  submitAnswer,
  toggleCode
} from '../engine/session';

type ExerciseSessionState = {
  activeExercise: Exercise | null;
  session: ExerciseSession | null;
};

type ExerciseCompletion = {
  exercise: Exercise;
  session: ExerciseSession;
};

const initialState: ExerciseSessionState = {
  activeExercise: null,
  session: null
};

function createExerciseSessionStore() {
  const store = writable<ExerciseSessionState>(initialState);
  const { subscribe, set, update } = store;

  function startExercise(exercise: Exercise) {
    set({
      activeExercise: exercise,
      session: createInitialSession(exercise)
    });
  }

  function select(optionId: string) {
    update((state) => {
      if (!state.activeExercise || !state.session) return state;
      const session = normalizeSessionForCurrentStep(state.session, state.activeExercise);
      return { ...state, session: selectOption(session, optionId) };
    });
  }

  function toggleCodeVisibility() {
    update((state) => {
      if (!state.session) return state;
      return { ...state, session: toggleCode(state.session) };
    });
  }

  function submitOrContinue(): ExerciseCompletion | null {
    const state = get(store);
    const { activeExercise, session } = state;
    if (!activeExercise || !session) return null;
    const currentSession = normalizeSessionForCurrentStep(session, activeExercise);
    const action = getExerciseAction(currentSession, activeExercise);

    if (action.type === 'submit') {
      const nextSession = submitAnswer(currentSession, activeExercise);
      set({ activeExercise, session: nextSession });
      return null;
    }

    if (action.type === 'retry') {
      const nextSession = continueAfterHint(currentSession);
      set({ activeExercise, session: nextSession });
      return null;
    }

    const nextSession = nextStep(currentSession, activeExercise);
    set({ activeExercise, session: nextSession });

    if (action.type === 'finish') {
      return { exercise: activeExercise, session: nextSession };
    }

    return null;
  }

  function restart() {
    const { activeExercise } = get(store);
    if (!activeExercise) return;
    startExercise(activeExercise);
  }

  function clearSession() {
    set(initialState);
  }

  return {
    subscribe,
    startExercise,
    selectOption: select,
    submitOrContinue,
    toggleCode: toggleCodeVisibility,
    restart,
    clearSession
  };
}

export const exerciseSessionStore = createExerciseSessionStore();
