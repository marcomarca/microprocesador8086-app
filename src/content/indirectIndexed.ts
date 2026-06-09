import type { Exercise, MemoryRow } from '../types';

const memInitial: MemoryRow[] = [
  { label: 'ARR[0]', address: '0000', bytes: ['03', '00'], word: '0003' },
  { label: 'ARR[1]', address: '0002', bytes: ['04', '00'], word: '0004' },
  { label: 'ARR[2]', address: '0004', bytes: ['05', '00'], word: '0005' },
  { label: 'SUM', address: '0006', bytes: ['00', '00'], word: '0000' }
];

const memFinal: MemoryRow[] = [
  { label: 'ARR[0]', address: '0000', bytes: ['03', '00'], word: '0003' },
  { label: 'ARR[1]', address: '0002', bytes: ['04', '00'], word: '0004' },
  { label: 'ARR[2]', address: '0004', bytes: ['05', '00'], word: '0005' },
  { label: 'SUM', address: '0006', bytes: ['0C', '00'], word: '000C' }
];

export const indirectIndexedExercise: Exercise = {
  id: 'indirect_indexed_03',
  moduleId: 'mod_indirect',
  order: 3,
  title: 'Ejercicio 3 · Direccionamiento indirecto',
  subtitle: 'SI, BX, DI y arreglos DW · 8086',
  description: 'Predice cómo se usan SI, BX y DI como referencias a memoria y distingue registro de [registro].',
  estimatedMinutes: 12,
  initialRegisters: { AX: '0000', BX: '0000', SI: '0000', DI: '0000' },
  initialMemory: memInitial,
  passing: {
    canAdvance: 9.5,
    reviewRecommended: 7.5,
    mustRepeat: 5
  },
  codeLines: [
    'ARR: DW 0x0003',
    'DW 0x0004',
    'DW 0x0005',
    'SUM: DW 0x0000',
    '',
    'start:',
    'MOV SI, offset ARR',
    'MOV AX, word [SI]',
    'ADD SI, 2',
    'ADD AX, word [SI]',
    'MOV BX, SI',
    'ADD BX, 2',
    'ADD AX, word [BX]',
    'MOV DI, offset SUM',
    'MOV word [DI], AX',
    '',
    'print reg',
    'print mem 0:10'
  ],
  steps: [
    {
      id: 'E3_Q1',
      step: 1,
      codeIndex: 0,
      title: 'Arreglo de palabras',
      instruction: 'ARR: DW 0x0003',
      question: 'Si ARR inicia en 0000 y cada DW ocupa 2 bytes, ¿dónde empieza ARR[1]?',
      before: { AX: '0000', BX: '0000', SI: '0000', DI: '0000' },
      after: { AX: '0000', BX: '0000', SI: '0000', DI: '0000' },
      changed: [],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: 'ARR[0] ocupa 0000 y 0001. Por eso ARR[1] empieza en 0002.',
      diagram: 'ARR[0] @0000 -> bytes 03 00\nARR[1] @0002 -> bytes 04 00\nARR[2] @0004 -> bytes 05 00\n\nDW ocupa 2 bytes.',
      options: [
        { id: 'A', text: 'ARR[1] empieza en 0002', correct: true, feedback: 'Cada DW ocupa 2 bytes, por eso el siguiente elemento empieza en 0002.' },
        { id: 'B', text: 'ARR[1] empieza en 0001', correct: false, tag: 'cree_dw_avanza_1', hint: 'DW no ocupa 1 byte. Una palabra ocupa 2 bytes.' },
        { id: 'C', text: 'ARR[1] empieza en 0004', correct: false, tag: 'salta_un_elemento', hint: '0004 corresponde a ARR[2], no a ARR[1].' }
      ]
    },
    {
      id: 'E3_Q2',
      step: 2,
      codeIndex: 6,
      title: 'Instrucción actual',
      instruction: 'MOV SI, offset ARR',
      question: '¿Qué valor tendrá SI después de cargar offset ARR?',
      before: { AX: '0000', BX: '0000', SI: '0000', DI: '0000' },
      after: { AX: '0000', BX: '0000', SI: '0000', DI: '0000' },
      changed: ['SI'],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: 'offset ARR carga la dirección inicial del arreglo. Como ARR empieza en 0000, SI queda 0000.',
      diagram: 'ARR empieza en la dirección 0000.\noffset ARR = 0000.\nSI recibe esa dirección.',
      options: [
        { id: 'A', text: 'SI = 0000', correct: true, feedback: 'offset ARR carga la dirección inicial del arreglo en SI.' },
        { id: 'B', text: 'SI = 0003', correct: false, tag: 'confunde_offset_con_contenido', hint: '0003 es el contenido de ARR[0], no la dirección inicial del arreglo.' },
        { id: 'C', text: 'SI = 0300', correct: false, tag: 'confunde_offset_con_bytes', hint: '03 00 son bytes de memoria. offset ARR carga la dirección, no los bytes.' }
      ]
    },
    {
      id: 'E3_Q3',
      step: 3,
      codeIndex: 7,
      title: 'Instrucción actual',
      instruction: 'MOV AX, word [SI]',
      question: 'Si SI = 0000, ¿qué valor tendrá AX después de ejecutar word [SI]?',
      before: { AX: '0000', BX: '0000', SI: '0000', DI: '0000' },
      after: { AX: '0003', BX: '0000', SI: '0000', DI: '0000' },
      changed: ['AX'],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: '[SI] significa leer memoria en la dirección contenida en SI. En 0000 está ARR[0], cuyo valor lógico es 0003.',
      diagram: 'SI = 0000\n[SI] = memoria ubicada en 0000\nMemoria @0000 = bytes 03 00\nValor lógico = 0003\nAX = 0003',
      options: [
        { id: 'A', text: 'AX = 0003', correct: true, feedback: '[SI] lee el contenido de memoria apuntado por SI.' },
        { id: 'B', text: 'AX = 0000', correct: false, tag: 'confunde_si_con_contenido', hint: '0000 es el valor de SI. Pero [SI] usa SI como dirección y lee memoria.' },
        { id: 'C', text: 'AX = 0300', correct: false, tag: 'confunde_bytes_con_valor_logico', hint: 'Los bytes son 03 00, pero el valor lógico de la palabra es 0003.' }
      ]
    },
    {
      id: 'E3_Q4',
      step: 4,
      codeIndex: 8,
      title: 'Caso hipotético de error',
      instruction: 'Si se hiciera: ADD SI, 1',
      question: 'Si SI avanzara de 0000 a 0001 y luego se leyera word [SI], ¿qué ocurriría?',
      before: { AX: '0003', BX: '0000', SI: '0000', DI: '0000' },
      after: { AX: '0003', BX: '0000', SI: '0000', DI: '0000' },
      changed: [],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: 'Leer desde 0001 toma bytes 00 y 04, formando 0400h. No lee correctamente ARR[1].',
      diagram: 'Memoria:\n@0000 = 03\n@0001 = 00\n@0002 = 04\n@0003 = 00\n\nSi SI = 0001:\nword [SI] lee bytes 00 04\nValor lógico = 0400h\n\nPor eso SI debe avanzar 2, no 1.',
      options: [
        { id: 'A', text: 'Leería una palabra incorrecta: 0400h', correct: true, feedback: 'SI = 0001 apunta a una dirección intermedia, no al inicio de ARR[1].' },
        { id: 'B', text: 'Leería ARR[1] correctamente: 0004h', correct: false, tag: 'cree_add_si_1_apunta_siguiente', hint: 'ARR[1] empieza en 0002. Si SI queda en 0001, estás en una dirección intermedia.' },
        { id: 'C', text: 'Leería el valor de SI: 0001h', correct: false, tag: 'no_reconoce_lectura_desalineada', hint: '[SI] no usa el valor de SI como dato. Usa SI como dirección de memoria.' }
      ]
    },
    {
      id: 'E3_Q5',
      step: 5,
      codeIndex: 8,
      title: 'Instrucción actual',
      instruction: 'ADD SI, 2',
      question: '¿Qué valor tendrá SI después de avanzar al siguiente elemento DW?',
      before: { AX: '0003', BX: '0000', SI: '0000', DI: '0000' },
      after: { AX: '0003', BX: '0000', SI: '0002', DI: '0000' },
      changed: ['SI'],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: 'Como cada DW ocupa 2 bytes, SI debe avanzar de 0000 a 0002 para apuntar a ARR[1].',
      diagram: 'ARR[0] @0000\nARR[1] @0002\nARR[2] @0004\n\nSI = SI + 2\nSI = 0002',
      options: [
        { id: 'A', text: 'SI = 0002', correct: true, feedback: 'Para avanzar al siguiente DW, SI aumenta en 2.' },
        { id: 'B', text: 'SI = 0001', correct: false, tag: 'avance_si_incorrecto_1', hint: '0001 queda en medio de una palabra. DW requiere avanzar 2 bytes.' },
        { id: 'C', text: 'SI = 0004', correct: false, tag: 'avance_si_incorrecto_4', hint: '0004 apunta a ARR[2]. Estarías saltando ARR[1].' }
      ]
    },
    {
      id: 'E3_Q6',
      step: 6,
      codeIndex: 9,
      title: 'Instrucción actual',
      instruction: 'ADD AX, word [SI]',
      question: 'Si AX = 0003 y SI = 0002, ¿qué valor tendrá AX?',
      before: { AX: '0003', BX: '0000', SI: '0002', DI: '0000' },
      after: { AX: '0007', BX: '0000', SI: '0002', DI: '0000' },
      changed: ['AX'],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: '[SI] lee ARR[1], que vale 0004. Entonces AX = 0003 + 0004 = 0007.',
      diagram: 'SI = 0002\n[SI] = memoria @0002\nARR[1] = 0004\nAX antes = 0003\nAX después = 0007',
      options: [
        { id: 'A', text: 'AX = 0007', correct: true, feedback: 'AX suma el contenido de ARR[1]: 0003 + 0004 = 0007.' },
        { id: 'B', text: 'AX = 0004', correct: false, tag: 'add_reemplaza_destino', hint: 'ADD no reemplaza AX por el valor fuente. Suma la fuente al destino.' },
        { id: 'C', text: 'AX = 0003', correct: false, tag: 'add_no_modifica_destino', hint: 'ADD modifica el destino. AX debe cambiar.' }
      ]
    },
    {
      id: 'E3_Q7',
      step: 7,
      codeIndex: 10,
      title: 'Instrucción actual',
      instruction: 'MOV BX, SI',
      question: '¿Qué ocurre después de copiar SI en BX?',
      before: { AX: '0007', BX: '0000', SI: '0002', DI: '0000' },
      after: { AX: '0007', BX: '0002', SI: '0002', DI: '0000' },
      changed: ['BX'],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: 'BX recibe el valor de SI. SI no se borra; MOV copia.',
      diagram: 'Antes:\nSI = 0002\nBX = 0000\n\nDespués de MOV BX, SI:\nBX = 0002\nSI = 0002',
      options: [
        { id: 'A', text: 'BX = 0002 y SI = 0002', correct: true, feedback: 'MOV copia SI hacia BX sin borrar SI.' },
        { id: 'B', text: 'BX = 0000 y SI = 0002', correct: false, tag: 'bx_no_recibe_si', hint: 'El destino es BX. BX debe recibir el valor de SI.' },
        { id: 'C', text: 'BX = 0002 y SI = 0000', correct: false, tag: 'mov_borra_fuente', hint: 'MOV no borra la fuente. SI conserva su valor.' }
      ]
    },
    {
      id: 'E3_Q8',
      step: 8,
      codeIndex: 11,
      title: 'Instrucción actual',
      instruction: 'ADD BX, 2',
      question: 'Si BX = 0002, ¿qué valor tendrá BX para apuntar a ARR[2]?',
      before: { AX: '0007', BX: '0002', SI: '0002', DI: '0000' },
      after: { AX: '0007', BX: '0004', SI: '0002', DI: '0000' },
      changed: ['BX'],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: 'BX avanza de 0002 a 0004. Esa es la dirección de ARR[2].',
      diagram: 'ARR[1] @0002\nARR[2] @0004\n\nBX = 0002 + 2\nBX = 0004',
      options: [
        { id: 'A', text: 'BX = 0004', correct: true, feedback: 'ARR[2] empieza en 0004.' },
        { id: 'B', text: 'BX = 0003', correct: false, tag: 'avance_bx_incorrecto_1', hint: 'Sumar 1 byte dejaría BX en una dirección intermedia.' },
        { id: 'C', text: 'BX = 0002', correct: false, tag: 'avance_bx_no_cambia', hint: 'ADD BX, 2 sí modifica BX.' }
      ]
    },
    {
      id: 'E3_Q9',
      step: 9,
      codeIndex: 12,
      title: 'Instrucción actual',
      instruction: 'ADD AX, word [BX]',
      question: 'Si AX = 0007 y BX = 0004, ¿qué valor tendrá AX?',
      before: { AX: '0007', BX: '0004', SI: '0002', DI: '0000' },
      after: { AX: '000C', BX: '0004', SI: '0002', DI: '0000' },
      changed: ['AX'],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: '[BX] lee memoria en 0004. Allí está ARR[2] = 0005. Entonces AX = 0007 + 0005 = 000C.',
      diagram: 'BX = 0004\n[BX] = memoria @0004\nARR[2] = 0005\nAX antes = 0007\nAX después = 000C',
      options: [
        { id: 'A', text: 'AX = 000C', correct: true, feedback: '[BX] lee ARR[2], que vale 0005. 0007 + 0005 = 000C.' },
        { id: 'B', text: 'AX = 000B', correct: false, tag: 'confunde_bx_con_bx_indirecto', hint: 'Eso sería sumar BX como valor 0004. Pero [BX] lee el contenido ubicado en 0004, que es 0005.' },
        { id: 'C', text: 'AX = 0005', correct: false, tag: 'add_reemplaza_destino', hint: 'ADD no reemplaza AX por la fuente. Suma fuente y destino.' }
      ]
    },
    {
      id: 'E3_Q10',
      step: 10,
      codeIndex: 13,
      title: 'Instrucción actual',
      instruction: 'MOV DI, offset SUM',
      question: '¿Qué valor tendrá DI después de cargar offset SUM?',
      before: { AX: '000C', BX: '0004', SI: '0002', DI: '0000' },
      after: { AX: '000C', BX: '0004', SI: '0002', DI: '0006' },
      changed: ['DI'],
      memoryBefore: memInitial,
      memoryAfter: memInitial,
      changedMemory: [],
      correctExplain: 'SUM empieza en la dirección 0006. offset SUM carga esa dirección en DI.',
      diagram: 'SUM @0006\nContenido inicial de SUM = 0000\n\noffset SUM = 0006\nDI = 0006',
      options: [
        { id: 'A', text: 'DI = 0006', correct: true, feedback: 'DI recibe la dirección de SUM.' },
        { id: 'B', text: 'DI = 0000', correct: false, tag: 'confunde_di_con_contenido_sum', hint: '0000 es el contenido inicial de SUM, no su dirección.' },
        { id: 'C', text: 'DI = 000C', correct: false, tag: 'no_reconoce_offset_sum', hint: '000C es el resultado acumulado en AX. offset SUM carga la dirección de SUM.' }
      ]
    },
    {
      id: 'E3_Q11',
      step: 11,
      codeIndex: 14,
      title: 'Instrucción actual',
      instruction: 'MOV word [DI], AX',
      question: 'Si DI = 0006 y AX = 000C, ¿qué cambia después de ejecutar word [DI]?',
      before: { AX: '000C', BX: '0004', SI: '0002', DI: '0006' },
      after: { AX: '000C', BX: '0004', SI: '0002', DI: '0006' },
      changed: [],
      memoryBefore: memInitial,
      memoryAfter: memFinal,
      changedMemory: ['SUM'],
      correctExplain: '[DI] apunta a la memoria de SUM. La instrucción guarda AX en SUM: word 000C, bytes 0C 00.',
      diagram: 'DI = 0006\n[DI] = memoria @0006\nSUM está en @0006\nAX = 000C\n\nDespués:\nSUM = 000C\nBytes = 0C 00',
      options: [
        { id: 'A', text: 'SUM queda con word 000C y bytes 0C 00', correct: true, feedback: '[DI] apunta a SUM y se escribe el contenido de AX.' },
        { id: 'B', text: 'DI cambia a 000C', correct: false, tag: 'escribe_en_di_no_memoria', hint: 'El destino es [DI], no DI. Se modifica la memoria apuntada por DI.' },
        { id: 'C', text: 'SUM sigue en 0000', correct: false, tag: 'no_reconoce_escritura_indirecta', hint: 'MOV word [DI], AX escribe AX en la memoria apuntada por DI.' }
      ]
    }
  ],
  review: {
    title: 'Repaso corto',
    subtitle: 'SI vs [SI] · avance de palabras DW',
    blocks: [
      {
        title: 'SI no es lo mismo que [SI]',
        body: 'SI contiene una dirección. [SI] usa esa dirección para leer la memoria ubicada allí.',
        code: 'SI = 0004\n\nSI significa el valor 0004 guardado en el registro.\n[SI] significa leer memoria en la dirección 0004.\n\nSi memoria @0004 contiene 05 00:\nword [SI] = 0005'
      },
      {
        title: 'DW avanza de 2 en 2',
        body: 'Cada elemento DW ocupa dos bytes. Para pasar de un elemento de palabra al siguiente, el índice debe aumentar en 2.',
        code: 'ARR[0] @0000 -> ocupa 0000 y 0001\nARR[1] @0002 -> ocupa 0002 y 0003\nARR[2] @0004 -> ocupa 0004 y 0005\n\nADD SI, 2'
      }
    ],
    quickQuestion: {
      id: 'review_indirect_si_03',
      prompt: 'Si SI = 0004 y ARR[2] está en @0004 con word 0005, ¿qué carga MOV AX, word [SI]?',
      options: [
        { id: 'A', text: 'AX = 0005', correct: true },
        { id: 'B', text: 'AX = 0004', correct: false, tag: 'confunde_si_con_contenido' },
        { id: 'C', text: 'AX = 0500', correct: false, tag: 'confunde_bytes_con_valor_logico' }
      ],
      correctFeedback: '[SI] lee el contenido de memoria ubicado en la dirección 0004.',
      incorrectFeedback: 'SI contiene la dirección. [SI] lee la memoria ubicada en esa dirección. Resultado: AX = 0005.'
    }
  },
  variant: {
    id: 'variant_indirect_si_03',
    title: 'Pregunta de defensa',
    subtitle: 'Diferencia entre SI y [SI]',
    prompt: 'Si SI contiene 0004h, ¿la instrucción usa el valor 0004h o el contenido de memoria ubicado en esa dirección?',
    instruction: 'SI = 0004\nMemoria @0004 = 05 00\nMOV AX, word [SI]',
    groups: [
      { id: 'source', label: 'La instrucción usa:', options: ['valor de SI', 'contenido de memoria', 'nombre del arreglo'] },
      { id: 'value', label: 'AX queda:', options: ['0004', '0005', '0500'] }
    ],
    correctSelection: { source: 'contenido de memoria', value: '0005' },
    correctFeedback: '[SI] usa SI como dirección y lee el contenido de memoria. AX queda 0005.',
    incorrectFeedback: '[SI] no usa 0004 como dato. Usa 0004 como dirección y lee memoria. AX queda 0005.'
  }
};
