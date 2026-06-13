import type { CourseContent } from '../types';
import { arithmeticFlagsExercise } from './arithmeticFlags';
import { arithmeticFlagsTheory4 } from './arithmeticFlagsTheory4';
import { callRetExercise } from './callRet';
import { conditionalJumpsExercise } from './conditionalJumps';
import { conditionalJumpsTheory5 } from './conditionalJumpsTheory5';
import { directMemoryDwExercise } from './directMemoryDw';
import { errorCatalog } from './errorCatalog';
import { indirectIndexedExercise } from './indirectIndexed';
import { indirectTheory3 } from './indirectTheory3';
import { loopAccumulatorExercise } from './loopAccumulator';
import { loopAccumulatorTheory6 } from './loopAccumulatorTheory6';
import { memoryDwTheory2 } from './memoryDwTheory2';
import { movBasicExercise } from './movBasic';
import { movTheory1 } from './movTheory1';
import { stackLifoExercise } from './stackLifo';

export const courseContent: CourseContent = {
  title: 'Microprocesador 8086',
  subtitle: 'Tutor interactivo de registros e instrucciones básicas',
  version: '0.1.0',
  errorCatalog,
  modules: [
  {
    id: "mod_mov",
    order: 1,
    title: "Módulo 1 · MOV",
    subtitle: "Transferencia entre registros",
    description: "Primer bloque de teoría y práctica sobre MOV, registros completos y registros parciales.",
    theoryIds: [
      "theory_mov_01"
    ],
    exerciseIds: [
      "mov_basic_01"
    ]
  },
  {
    id: "mod_memory",
    order: 2,
    title: "Módulo 2 · Memoria directa",
    subtitle: "DW, direccionamiento directo y little endian",
    description: "Práctica sobre palabras en memoria, etiquetas, operandos inmediatos y escritura de resultados.",
    theoryIds: [
      "theory_memory_dw_02"
    ],
    exerciseIds: [
      "direct_memory_dw_02"
    ]
  },
  {
    id: "mod_indirect",
    order: 3,
    title: "Módulo 3 · Direccionamiento indirecto",
    subtitle: "SI, BX, DI y arreglos DW",
    description: "Práctica sobre registros índice/base, offsets, lectura indirecta y escritura mediante [registro].",
    theoryIds: [
      "theory_indirect_indexed_03"
    ],
    exerciseIds: [
      "indirect_indexed_03"
    ]
  },
  {
    id: "mod_flags",
    order: 4,
    title: "Módulo 4 · Aritmética y flags",
    subtitle: "ADD, SUB, CMP y flags básicos",
    description: "Práctica sobre operaciones aritméticas y actualización de ZF, CF, SF, OF y PF.",
    theoryIds: [
      "theory_arithmetic_flags_04"
    ],
    exerciseIds: [
      "arithmetic_flags_04"
    ]
  },
  {
    id: "mod_jumps",
    order: 5,
    title: "Módulo 5 · Comparación y saltos",
    subtitle: "CMP, JZ, JG y JL",
    description: "Práctica sobre flags preparados por CMP y decisiones de salto condicional.",
    theoryIds: [
      "theory_conditional_jumps_05"
    ],
    exerciseIds: [
      "conditional_jumps_05"
    ]
  },
  {
    id: "mod_loop",
    order: 6,
    title: "Módulo 6 · Bucles con arreglos",
    subtitle: "LOOP, CX, SI y acumulador",
    description: "Práctica sobre recorrido de arreglos DW con SI, acumulación en AX y control con CX.",
    theoryIds: [
      "theory_loop_accumulator_06"
    ],
    exerciseIds: [
      "loop_accumulator_06"
    ]
  },
  {
    id: "mod_stack",
    order: 7,
    title: "Módulo 7 · Pila básica",
    subtitle: "PUSH, POP, SP y LIFO",
    description: "Práctica sobre comportamiento LIFO y cambios de SP al apilar y desapilar palabras.",
    exerciseIds: [
      "stack_lifo_07"
    ]
  },
  {
    id: "mod_subroutine",
    order: 8,
    title: "Módulo 8 · Subrutinas",
    subtitle: "CALL, RET y flujo principal",
    description: "Práctica sobre transferencia de control entre programa principal y subrutina.",
    exerciseIds: [
      "call_ret_08"
    ]
  }
],
  theories: [movTheory1, memoryDwTheory2, indirectTheory3, arithmeticFlagsTheory4, conditionalJumpsTheory5, loopAccumulatorTheory6],
  exercises: [movBasicExercise, directMemoryDwExercise, indirectIndexedExercise, arithmeticFlagsExercise, conditionalJumpsExercise, loopAccumulatorExercise, stackLifoExercise, callRetExercise]
};
