import type { Exercise, MemoryRow } from '../types';

const memInitial: MemoryRow[] = [
  { label: 'A', address: '0000', bytes: ['34', '12'], word: '1234' },
  { label: 'B', address: '0002', bytes: ['05', '00'], word: '0005' },
  { label: 'R', address: '0004', bytes: ['00', '00'], word: '0000' }
];

const memFinal: MemoryRow[] = [
  { label: 'A', address: '0000', bytes: ['34', '12'], word: '1234' },
  { label: 'B', address: '0002', bytes: ['05', '00'], word: '0005' },
  { label: 'R', address: '0004', bytes: ['37', '12'], word: '1237' }
];

export const directMemoryDwExercise: Exercise = {
  id: 'direct_memory_dw_02',
  moduleId: 'mod_memory',
  order: 2,
  title: 'Ejercicio 2 · Memoria DW',
  subtitle: 'Memoria directa con DW · 8086',
  description: 'Predice cómo cambian registros y memoria al cargar, sumar, restar y guardar palabras de 16 bits.',
  estimatedMinutes: 10,
  initialRegisters: { AX: '0000', BX: '0000', CX: '0000', DX: '0000' },
  initialMemory: memInitial,
  passing: {
    canAdvance: 6,
    reviewRecommended: 4.5,
    mustRepeat: 3
  },
  codeLines: [
    'A: DW 0x1234',
    'B: DW 0x0005',
    'R: DW 0x0000',
    '',
    'start:',
    'MOV AX, word A',
    'ADD AX, word B',
    'SUB AX, 0x0002',
    'MOV word R, AX',
    '',
    'print reg',
    'print mem 0:8'
  ],
  steps: [
    {
      id: 'E2_Q1',
      step: 1,
      codeIndex: 0,
      title: 'Declaración de dato',
      instruction: 'A: DW 0x1234',
      question: 'A está declarado como DW 0x1234. ¿Cómo se guarda en memoria?',
      before: { AX: '0000', BX: '0000', CX: '0000', DX: '0000' },
      after: { AX: '0000', BX: '0000', CX: '0000', DX: '0000' },
      changed: [],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: 'DW reserva dos bytes. En little endian se guarda primero el byte bajo: 34 12.',
      diagram: 'Valor lógico: 1234h\nByte alto: 12\nByte bajo: 34\nOrden en memoria: 34 12',
      options: [
        { id: 'A', text: '34 12', correct: true, feedback: 'DW reserva dos bytes. En little endian se guarda primero el byte bajo: 34 12.' },
        { id: 'B', text: '12 34', correct: false, tag: 'confunde_little_endian', hint: 'Ese es el orden visual del número, pero en memoria little endian se guarda primero el byte bajo.' },
        { id: 'C', text: '00 12', correct: false, tag: 'no_comprende_dw_16_bits', hint: 'DW guarda una palabra de 16 bits: usa dos bytes completos, no solo una parte.' }
      ]
    },
    {
      id: 'E2_Q2',
      step: 2,
      codeIndex: 5,
      title: 'Instrucción actual',
      instruction: 'MOV AX, word A',
      question: '¿Qué valor tendrá AX después de cargar word A?',
      before: { AX: '0000', BX: '0000', CX: '0000', DX: '0000' },
      after: { AX: '1234', BX: '0000', CX: '0000', DX: '0000' },
      changed: ['AX'],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: 'A es una etiqueta. word A carga el contenido asociado a A: 1234h.',
      diagram: 'A @0000 significa que A empieza en la dirección 0000.\nEl contenido de A es 1234h.\nMOV AX, word A carga el contenido, no la dirección.',
      options: [
        { id: 'A', text: 'AX = 1234', correct: true, feedback: 'word A carga el contenido asociado a A: 1234h.' },
        { id: 'B', text: 'AX = 0000', correct: false, tag: 'confunde_etiqueta_con_direccion', hint: '0000 es la dirección donde empieza A, no el contenido de A.' },
        { id: 'C', text: 'AX = 3412', correct: false, tag: 'confunde_bytes_con_valor_logico', hint: 'Los bytes se ven como 34 12 en memoria, pero el valor lógico cargado en AX es 1234h.' }
      ]
    },
    {
      id: 'E2_Q3',
      step: 3,
      codeIndex: 6,
      title: 'Instrucción actual',
      instruction: 'ADD AX, word B',
      question: '¿Qué valor tendrá AX?',
      before: { AX: '1234', BX: '0000', CX: '0000', DX: '0000' },
      after: { AX: '1239', BX: '0000', CX: '0000', DX: '0000' },
      changed: ['AX'],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: 'ADD suma el contenido de B al valor actual de AX: 1234h + 0005h = 1239h.',
      diagram: 'AX antes = 1234h\nB = 0005h\n1234h + 0005h = 1239h',
      options: [
        { id: 'A', text: 'AX = 1239', correct: true, feedback: '1234h + 0005h = 1239h.' },
        { id: 'B', text: 'AX = 0005', correct: false, tag: 'add_reemplaza_destino', hint: 'ADD no reemplaza AX por B. Suma B al valor que AX ya tenía.' },
        { id: 'C', text: 'AX = 1234', correct: false, tag: 'add_no_modifica_destino', hint: 'ADD modifica el destino. AX sí cambia.' }
      ]
    },
    {
      id: 'E2_Q4',
      step: 4,
      codeIndex: 7,
      title: 'Instrucción actual',
      instruction: 'SUB AX, 0x0002',
      question: '¿Qué tipo de operando es 0x0002?',
      before: { AX: '1239', BX: '0000', CX: '0000', DX: '0000' },
      after: { AX: '1239', BX: '0000', CX: '0000', DX: '0000' },
      changed: [],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: '0x0002 está escrito directamente en la instrucción. Es un dato inmediato.',
      diagram: 'word B  → contenido en memoria\n0x0002  → valor inmediato escrito en la instrucción',
      options: [
        { id: 'A', text: 'Dato inmediato', correct: true, feedback: '0x0002 está escrito directamente en la instrucción.' },
        { id: 'B', text: 'Etiqueta de memoria', correct: false, tag: 'confunde_inmediato_con_memoria', hint: 'Una etiqueta sería un nombre como A, B o R. 0x0002 es un literal inmediato.' },
        { id: 'C', text: 'Registro', correct: false, tag: 'confunde_inmediato_con_registro', hint: 'Un registro sería AX, BX, CX o DX. 0x0002 es un valor literal.' }
      ]
    },
    {
      id: 'E2_Q5',
      step: 5,
      codeIndex: 7,
      title: 'Instrucción actual',
      instruction: 'SUB AX, 0x0002',
      question: '¿Qué valor tendrá AX después de la resta?',
      before: { AX: '1239', BX: '0000', CX: '0000', DX: '0000' },
      after: { AX: '1237', BX: '0000', CX: '0000', DX: '0000' },
      changed: ['AX'],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: 'SUB resta el inmediato 0002h al valor actual de AX: 1239h - 0002h = 1237h.',
      diagram: 'AX antes = 1239h\nInmediato = 0002h\n1239h - 0002h = 1237h',
      options: [
        { id: 'A', text: 'AX = 1237', correct: true, feedback: '1239h - 0002h = 1237h.' },
        { id: 'B', text: 'AX = 1239', correct: false, tag: 'sub_no_modifica_destino', hint: 'SUB modifica el destino. AX debe cambiar.' },
        { id: 'C', text: 'AX = 0002', correct: false, tag: 'sub_reemplaza_destino', hint: 'SUB no reemplaza AX por el inmediato. Resta el inmediato al valor actual de AX.' }
      ]
    },
    {
      id: 'E2_Q6',
      step: 6,
      codeIndex: 8,
      title: 'Instrucción actual',
      instruction: 'MOV word R, AX',
      question: '¿Qué elemento cambia después de ejecutar esta instrucción?',
      before: { AX: '1237', BX: '0000', CX: '0000', DX: '0000' },
      after: { AX: '1237', BX: '0000', CX: '0000', DX: '0000' },
      changed: [],
      memoryBefore: memInitial,
      memoryAfter: memFinal,
      changedMemory: ['R'],
      correctExplain: 'MOV word R, AX guarda el contenido de AX en la memoria asociada a R.',
      diagram: 'AX = 1237h\nR antes = 0000h\nMOV word R, AX escribe 1237h en R.\nR después = 1237h',
      options: [
        { id: 'A', text: 'R queda con el valor 1237', correct: true, feedback: 'MOV word R, AX guarda el contenido de AX en la memoria asociada a R.' },
        { id: 'B', text: 'AX queda en 0000', correct: false, tag: 'mov_borra_fuente', hint: 'MOV copia. No borra la fuente AX.' },
        { id: 'C', text: 'R sigue en 0000', correct: false, tag: 'no_reconoce_escritura_memoria', hint: 'El destino es word R. Por tanto, esta instrucción escribe en memoria.' }
      ]
    },
    {
      id: 'E2_Q7',
      step: 7,
      codeIndex: 8,
      title: 'Verificación de memoria',
      instruction: 'R = 1237h',
      question: 'Si R guarda el valor lógico 1237h, ¿qué bytes aparecen en memoria?',
      before: { AX: '1237', BX: '0000', CX: '0000', DX: '0000' },
      after: { AX: '1237', BX: '0000', CX: '0000', DX: '0000' },
      changed: [],
      memoryBefore: memFinal,
      memoryAfter: memFinal,
      changedMemory: ['R'],
      correctExplain: 'En little endian se almacena primero el byte bajo: 37, luego el byte alto: 12.',
      diagram: 'Valor lógico: 1237h\nByte alto: 12\nByte bajo: 37\nOrden en memoria: 37 12',
      options: [
        { id: 'A', text: '37 12', correct: true, feedback: 'En little endian se almacena primero el byte bajo: 37, luego el byte alto: 12.' },
        { id: 'B', text: '12 37', correct: false, tag: 'confunde_little_endian', hint: 'Ese es el orden visual del número. En memoria little endian primero va el byte bajo.' },
        { id: 'C', text: '00 37', correct: false, tag: 'pierde_byte_alto', hint: 'R es una palabra de 16 bits. Debes conservar byte bajo y byte alto.' }
      ]
    }
  ],
  review: {
    title: 'Repaso corto',
    subtitle: 'Dirección, contenido y little endian',
    blocks: [
      {
        title: 'Dirección no es contenido',
        body: 'A @0000 significa que A empieza en la dirección 0000, pero el contenido almacenado en A es 1234h.',
        code: 'MOV AX, word A\n\nNo carga 0000.\nCarga el contenido: 1234h.'
      },
      {
        title: 'DW y little endian',
        body: 'DW reserva una palabra de 16 bits. En memoria 8086 se guarda primero el byte bajo.',
        code: 'Valor lógico: 1234h\nByte alto: 12\nByte bajo: 34\nOrden en memoria: 34 12'
      }
    ],
    quickQuestion: {
      id: 'review_little_endian_02',
      prompt: 'Si X: DW 0xABCD, ¿qué bytes se guardan en memoria?',
      options: [
        { id: 'A', text: 'CD AB', correct: true },
        { id: 'B', text: 'AB CD', correct: false, tag: 'confunde_little_endian' },
        { id: 'C', text: '00 CD', correct: false, tag: 'pierde_byte_alto' }
      ],
      correctFeedback: 'ABCDh se guarda como CD AB porque primero va el byte bajo.',
      incorrectFeedback: 'ABCDh tiene byte bajo CD y byte alto AB. En memoria queda CD AB.'
    }
  },
  variant: {
    id: 'variant_direct_memory_02',
    title: 'Pregunta de defensa',
    subtitle: 'Diferencia entre inmediato y memoria directa',
    prompt: '¿Cuál es la diferencia entre estas dos instrucciones?',
    instruction: 'MOV AX, 0x0000\nMOV AX, word A',
    groups: [
      { id: 'first', label: '0x0000 es un valor:', options: ['inmediato', 'etiqueta', 'registro'] },
      { id: 'second', label: 'word A toma el:', options: ['contenido', 'nombre', 'registro'] }
    ],
    correctSelection: { first: 'inmediato', second: 'contenido' },
    correctFeedback: '0x0000 es un inmediato. word A carga el contenido asociado a la etiqueta A.',
    incorrectFeedback: '0x0000 es un valor inmediato. word A toma el contenido asociado a la etiqueta A.'
  }
};
