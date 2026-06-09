import type { CourseContent } from '../types';
import { directMemoryDwExercise } from './directMemoryDw';
import { errorCatalog } from './errorCatalog';
import { indirectIndexedExercise } from './indirectIndexed';
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
    },
    {
      id: 'mod_memory',
      order: 2,
      title: 'Módulo 2 · Memoria directa',
      subtitle: 'DW, direccionamiento directo y little endian',
      description: 'Práctica sobre palabras en memoria, etiquetas, operandos inmediatos y escritura de resultados.',
      exerciseIds: ['direct_memory_dw_02']
    },
    {
      id: 'mod_indirect',
      order: 3,
      title: 'Módulo 3 · Direccionamiento indirecto',
      subtitle: 'SI, BX, DI y arreglos DW',
      description: 'Práctica sobre registros índice/base, offsets, lectura indirecta y escritura mediante [registro].',
      exerciseIds: ['indirect_indexed_03']
    }
  ],
  exercises: [movBasicExercise, directMemoryDwExercise, indirectIndexedExercise]
};
