import type { Component } from 'svelte';
import type { TheoryLesson } from '../../types';

export type TheoryScreenProps = {
  theory: TheoryLesson;
  completed?: boolean;
  onComplete?: (theory: TheoryLesson) => void;
  onStartExercise?: (exerciseId: string) => void;
};

export type TheoryRenderer = Component<TheoryScreenProps>;
