import type { Exercise } from '../types';

export const movBasicExercise: Exercise = {
  id: 'mov_basic_01',
  moduleId: 'mod_mov',
  order: 1,
  title: 'Ejercicio 1 · MOV',
  subtitle: 'Transferencia entre registros · 8086',
  description: 'Predice el efecto de instrucciones MOV sobre registros completos y parciales.',
  estimatedMinutes: 8,
  initialRegisters: { AX: '0000', BX: '0000', CX: '0000', DX: '0000' },
  passing: {
    canAdvance: 5,
    reviewRecommended: 3.5,
    mustRepeat: 2
  },
  codeLines: [
    'MOV AX, 0x1234',
    'MOV BX, AX',
    'MOV CL, 0x05',
    'MOV AH, 0xAB',
    'MOV DL, AL'
  ],
  steps: [
    {
      id: 'E1_Q1',
      step: 1,
      codeIndex: 0,
      title: 'Instrucción actual',
      instruction: 'MOV AX, 0x1234',
      question: '¿Qué valor tendrá AX?',
      before: { AX: '0000', BX: '0000', CX: '0000', DX: '0000' },
      after: { AX: '1234', BX: '0000', CX: '0000', DX: '0000' },
      changed: ['AX'],
      correctExplain: 'AX queda 1234 porque 0x1234 es un dato inmediato.',
      options: [
        { id: 'A', text: 'AX = 1234', correct: true, feedback: 'MOV copia el dato inmediato 1234h hacia AX.' },
        { id: 'B', text: 'AX = 0000', correct: false, tag: 'no_reconoce_inmediato', hint: '0x1234 es un dato inmediato. La instrucción carga ese valor directamente en AX.' },
        { id: 'C', text: 'AX = 3412', correct: false, tag: 'confunde_endianness_registro', hint: 'No inviertas los bytes dentro del registro. AX queda 1234h.' }
      ]
    },
    {
      id: 'E1_Q2',
      step: 2,
      codeIndex: 1,
      title: 'Instrucción actual',
      instruction: 'MOV BX, AX',
      question: '¿Qué ocurre después de ejecutar la instrucción?',
      before: { AX: '1234', BX: '0000', CX: '0000', DX: '0000' },
      after: { AX: '1234', BX: '1234', CX: '0000', DX: '0000' },
      changed: ['BX'],
      correctExplain: 'BX recibe el contenido de AX. AX no se borra.',
      options: [
        { id: 'A', text: 'BX = 1234 y AX = 1234', correct: true, feedback: 'AX es fuente y BX es destino. MOV copia, no borra AX.' },
        { id: 'B', text: 'AX = 0000 y BX = 0000', correct: false, tag: 'invierte_fuente_destino', hint: 'En MOV destino, fuente, el primer operando recibe el valor del segundo.' },
        { id: 'C', text: 'BX = 1234 y AX = 0000', correct: false, tag: 'cree_mov_borra_fuente', hint: 'MOV copia. No borra el registro fuente.' }
      ]
    },
    {
      id: 'E1_Q3',
      step: 3,
      codeIndex: 2,
      title: 'Instrucción actual',
      instruction: 'MOV CL, 0x05',
      question: '¿Qué valor tendrá CX?',
      before: { AX: '1234', BX: '1234', CX: '0000', DX: '0000' },
      after: { AX: '1234', BX: '1234', CX: '0005', DX: '0000' },
      changed: ['CX'],
      correctExplain: 'CX = CH:CL. CH queda 00 y CL queda 05, por eso CX = 0005.',
      diagram: 'CX = CH:CL\nCH = 00\nCL = 05\nCX = 0005',
      options: [
        { id: 'A', text: 'CX = 0005', correct: true, feedback: 'CL es el byte bajo de CX. CH queda 00 y CL queda 05.' },
        { id: 'B', text: 'CX = 0500', correct: false, tag: 'confunde_cl_ch', hint: '0500 ocurriría si modificaras CH. Aquí se modifica CL, el byte bajo.' },
        { id: 'C', text: 'CX = 0000', correct: false, tag: 'cree_byte_no_afecta_registro', hint: 'CL forma parte de CX. Si CL cambia, también cambia CX.' }
      ]
    },
    {
      id: 'E1_Q4',
      step: 4,
      codeIndex: 3,
      title: 'Instrucción actual',
      instruction: 'MOV AH, 0xAB',
      question: '¿Qué valor tendrá AX?',
      before: { AX: '1234', BX: '1234', CX: '0005', DX: '0000' },
      after: { AX: 'AB34', BX: '1234', CX: '0005', DX: '0000' },
      changed: ['AX'],
      correctExplain: 'AX = AH:AL. AH cambia a AB, pero AL conserva 34. Resultado: AX = AB34.',
      diagram: 'AX = AH:AL\nAntes: AH = 12, AL = 34\nDespués: AH = AB, AL = 34\nAX = AB34',
      options: [
        { id: 'A', text: 'AX = AB34', correct: true, feedback: 'AH cambia a AB, pero AL conserva 34. AX queda AB34.' },
        { id: 'B', text: 'AX = AB00', correct: false, tag: 'cree_ah_borra_al', hint: 'Cambiar AH no borra AL. AL conserva 34.' },
        { id: 'C', text: 'AX = 12AB', correct: false, tag: 'confunde_ah_al', hint: '12AB ocurriría si se modificara AL, no AH.' }
      ]
    },
    {
      id: 'E1_Q5',
      step: 5,
      codeIndex: 4,
      title: 'Pregunta preparatoria',
      instruction: 'MOV DL, AL',
      question: 'Antes de ejecutar MOV DL, AL, ¿cuánto vale AL?',
      before: { AX: 'AB34', BX: '1234', CX: '0005', DX: '0000' },
      after: { AX: 'AB34', BX: '1234', CX: '0005', DX: '0000' },
      changed: [],
      correctExplain: 'AX = AB34, por tanto AH = AB y AL = 34.',
      diagram: 'AX = AH:AL\nAX = AB34\nAH = AB\nAL = 34',
      options: [
        { id: 'A', text: 'AL = 34', correct: true, feedback: 'AX = AB34, por tanto AH = AB y AL = 34.' },
        { id: 'B', text: 'AL = AB', correct: false, tag: 'confunde_ah_al', hint: 'AB corresponde a AH, no a AL.' },
        { id: 'C', text: 'AL = 00', correct: false, tag: 'cree_ah_borra_al', hint: 'AL no fue borrado. Conserva el byte bajo de AX.' }
      ]
    },
    {
      id: 'E1_Q6',
      step: 6,
      codeIndex: 4,
      title: 'Instrucción actual',
      instruction: 'MOV DL, AL',
      question: '¿Qué valor tendrá DX?',
      before: { AX: 'AB34', BX: '1234', CX: '0005', DX: '0000' },
      after: { AX: 'AB34', BX: '1234', CX: '0005', DX: '0034' },
      changed: ['DX'],
      correctExplain: 'DL recibe AL, que vale 34. DH sigue en 00. Resultado: DX = 0034.',
      diagram: 'DX = DH:DL\nDH = 00\nDL recibe AL = 34\nDX = 0034',
      options: [
        { id: 'A', text: 'DX = 0034', correct: true, feedback: 'DL recibe AL, que vale 34. DH sigue en 00, por eso DX queda 0034.' },
        { id: 'B', text: 'DX = 00AB', correct: false, tag: 'confunde_ah_al', hint: '00AB ocurriría si copiaras AH. Aquí se copia AL.' },
        { id: 'C', text: 'DX = AB34', correct: false, tag: 'cree_copia_ax_completo', hint: 'MOV DL, AL copia un byte, no copia AX completo.' }
      ]
    }
  ],
  review: {
    title: 'Repaso corto',
    subtitle: 'Registros completos y registros parciales',
    blocks: [
      {
        title: 'AX se compone de AH y AL',
        body: 'AX es un registro de 16 bits. AH representa el byte alto y AL representa el byte bajo.',
        code: 'AX = AH:AL\n\nSi AX = 1234:\nAH = 12\nAL = 34'
      },
      {
        title: 'Modificar AH no borra AL',
        body: 'Cuando una instrucción modifica AH, solo cambia el byte alto. El byte bajo se conserva.',
        code: 'MOV AH, 0xAB\n\nAntes:  AX = 1234\nDespués: AX = AB34'
      }
    ],
    quickQuestion: {
      id: 'review_ah_01',
      prompt: 'Si AX = 5678 y se ejecuta MOV AH, 0x9A, ¿qué valor tendrá AX?',
      options: [
        { id: 'A', text: 'AX = 9A78', correct: true },
        { id: 'B', text: 'AX = 9A00', correct: false, tag: 'cree_ah_borra_al' },
        { id: 'C', text: 'AX = 569A', correct: false, tag: 'confunde_ah_al' }
      ],
      correctFeedback: 'AH cambia a 9A y AL conserva 78.',
      incorrectFeedback: 'Solo cambia AH. AL conserva 78. Resultado: AX = 9A78.'
    }
  },
  variant: {
    id: 'variant_mov_al_01',
    title: 'Pregunta variante',
    subtitle: 'Transferencia del aprendizaje',
    prompt: 'Si AX = 1234 y se ejecuta:',
    instruction: 'MOV AL, 0xAB',
    groups: [
      { id: 'value', label: 'AX queda:', options: ['12AB', 'AB34', '00AB'] },
      { id: 'byte', label: 'porque AL es:', options: ['byte alto', 'byte bajo', 'registro completo'] }
    ],
    correctSelection: { value: '12AB', byte: 'byte bajo' },
    correctFeedback: 'AX queda 12AB porque AL es el byte bajo.',
    incorrectFeedback: 'AL es el byte bajo. AH conserva 12 y AL cambia a AB. Resultado: AX = 12AB.'
  }
};
