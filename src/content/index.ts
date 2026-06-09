import type { CourseContent } from '../types';
import { errorCatalog } from './errorCatalog';
import { movBasicExercise } from './movBasic';

export const courseContent: CourseContent = {
  title: 'Microprocesador 8086',
  subtitle: 'Tutor interactivo de registros e instrucciones básicas',
  version: '0.1.0',
  errorCatalog,
  modules: [
    {
      id: 'mod_mov',
      order: 1,
      title: 'Módulo 1 · MOV',
      subtitle: 'Transferencia entre registros',
      description: 'Primer bloque de práctica sobre MOV, registros completos y registros parciales.',
      exerciseIds: ['mov_basic_01']
    }
  ],
  exercises: [movBasicExercise]
};
