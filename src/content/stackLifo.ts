import type { Exercise } from '../types';

const codeLines = [
      "start:",
      "MOV AX, 0x1234",
      "MOV BX, 0xABCD",
      "MOV CX, 0x0000",
      "MOV DX, 0x0000",
      "MOV SP, 0x0100",
      "",
      "PUSH AX",
      "PUSH BX",
      "POP CX",
      "POP DX",
      "",
      "print reg"
    ];

    const stackEmpty = [
      { address: "00FC", bytes: ["--", "--"], word: "----", note: "libre", top: false, out: false },
      { address: "00FE", bytes: ["--", "--"], word: "----", note: "libre", top: false, out: false }
    ];

    const stackAfterPushAX = [
      { address: "00FC", bytes: ["--", "--"], word: "----", note: "libre", top: false, out: false },
      { address: "00FE", bytes: ["34", "12"], word: "1234", note: "tope AX", top: true, out: false }
    ];

    const stackAfterPushBX = [
      { address: "00FC", bytes: ["CD", "AB"], word: "ABCD", note: "tope BX", top: true, out: false },
      { address: "00FE", bytes: ["34", "12"], word: "1234", note: "debajo AX", top: false, out: false }
    ];

    const stackAfterPopCX = [
      { address: "00FC", bytes: ["CD", "AB"], word: "ABCD", note: "fuera", top: false, out: true },
      { address: "00FE", bytes: ["34", "12"], word: "1234", note: "tope AX", top: true, out: false }
    ];

    const stackAfterPopDX = [
      { address: "00FC", bytes: ["CD", "AB"], word: "ABCD", note: "fuera", top: false, out: true },
      { address: "00FE", bytes: ["34", "12"], word: "1234", note: "fuera", top: false, out: true }
    ];

    const rawSteps = [
      {
        id: "E7_Q1",
        step: 1,
        title: "Inicialización",
        instruction: "MOV SP, 0x0100",
        question: "Después de la inicialización, ¿cuál es el estado de la pila?",
        codeIndex: 5,
        before: { AX: "1234", BX: "ABCD", CX: "0000", DX: "0000", SP: "0000" },
        after:  { AX: "1234", BX: "ABCD", CX: "0000", DX: "0000", SP: "0100" },
        stackBefore: stackEmpty,
        stackAfter: stackEmpty,
        flowBefore: { current: "start", next: "MOV SP, 0100", executed: ["AX=1234", "BX=ABCD"] },
        flowAfter: { current: "start", next: "PUSH AX", executed: ["AX=1234", "BX=ABCD", "SP=0100"] },
        changedRegs: ["SP"],
        changedStack: [],
        changedFlow: [],
        correctExplain: "SP queda en 0100 y todavía no hay valores apilados.",
        diagram: "AX = 1234\nBX = ABCD\nCX = 0000\nDX = 0000\nSP = 0100\n\nLa pila está vacía.",
        options: [
          { id: "A", text: "SP = 0100 y la pila está vacía", correct: true, feedback: "Correcto. SP queda inicializado y aún no hay PUSH." },
          { id: "B", text: "SP = 0100 y ya contiene AX", correct: false, tag: "push_no_guarda_valor", hint: "AX solo entra a la pila cuando se ejecuta PUSH AX." },
          { id: "C", text: "SP = 0000 porque la pila está vacía", correct: false, tag: "sp_final_incorrecto", hint: "Aunque la pila esté vacía, SP fue inicializado con 0100." }
        ]
      },
      {
        id: "E7_Q2",
        step: 2,
        title: "Primer PUSH",
        instruction: "PUSH AX",
        question: "Con SP = 0100, ¿qué ocurre al ejecutar PUSH AX?",
        codeIndex: 7,
        before: { AX: "1234", BX: "ABCD", CX: "0000", DX: "0000", SP: "0100" },
        after:  { AX: "1234", BX: "ABCD", CX: "0000", DX: "0000", SP: "00FE" },
        stackBefore: stackEmpty,
        stackAfter: stackAfterPushAX,
        flowBefore: { current: "PUSH AX", next: "guardar AX", executed: ["SP=0100"] },
        flowAfter: { current: "PUSH AX", next: "PUSH BX", executed: ["PUSH AX", "SP=00FE", "[00FE]=1234"] },
        changedRegs: ["SP"],
        changedStack: ["00FE"],
        changedFlow: [],
        correctExplain: "PUSH de palabra decrementa SP en 2 y guarda AX en la nueva posición del tope: SP = 00FE, [00FE] = 1234.",
        diagram: "Antes:\nSP = 0100\nAX = 1234\n\nPUSH AX:\nSP = SP - 2\nSP = 00FE\n[00FE] = 1234",
        options: [
          { id: "A", text: "SP = 00FE y [00FE] = 1234", correct: true, feedback: "Correcto. La pila crece hacia abajo y guarda AX." },
          { id: "B", text: "SP = 0102 y [0102] = 1234", correct: false, tag: "stack_crece_arriba", hint: "En 8086, la pila crece hacia direcciones menores. SP baja." },
          { id: "C", text: "SP = 0100 y [0100] = 1234", correct: false, tag: "push_no_modifica_sp", hint: "PUSH de palabra modifica SP en 2 posiciones." }
        ]
      },
      {
        id: "E7_Q3",
        step: 3,
        title: "Contenido del tope",
        instruction: "PUSH AX",
        question: "Después de PUSH AX, ¿qué representa SP = 00FE?",
        codeIndex: 7,
        before: { AX: "1234", BX: "ABCD", CX: "0000", DX: "0000", SP: "00FE" },
        after:  { AX: "1234", BX: "ABCD", CX: "0000", DX: "0000", SP: "00FE" },
        stackBefore: stackAfterPushAX,
        stackAfter: stackAfterPushAX,
        flowBefore: { current: "análisis", next: "distinguir dirección y contenido", executed: ["PUSH AX"] },
        flowAfter: { current: "análisis", next: "PUSH BX", executed: ["SP apunta al tope"] },
        changedRegs: [],
        changedStack: ["00FE"],
        changedFlow: [],
        correctExplain: "SP contiene la dirección del tope. El contenido almacenado en esa dirección es 1234.",
        diagram: "SP = 00FE\n\nSP no es el dato.\nSP es la dirección del tope.\n\n[SP] = [00FE] = 1234",
        options: [
          { id: "A", text: "SP apunta al tope; [SP] = 1234", correct: true, feedback: "Correcto. SP es dirección; [SP] es contenido." },
          { id: "B", text: "SP es el dato 1234", correct: false, tag: "confunde_sp_con_contenido", hint: "SP guarda una dirección, no el valor apilado." },
          { id: "C", text: "SP no tiene relación con la pila", correct: false, tag: "push_no_modifica_sp", hint: "SP es precisamente el registro que apunta al tope de la pila." }
        ]
      },
      {
        id: "E7_Q4",
        step: 4,
        title: "Segundo PUSH",
        instruction: "PUSH BX",
        question: "Si ahora se ejecuta PUSH BX, ¿qué queda en el tope de la pila?",
        codeIndex: 8,
        before: { AX: "1234", BX: "ABCD", CX: "0000", DX: "0000", SP: "00FE" },
        after:  { AX: "1234", BX: "ABCD", CX: "0000", DX: "0000", SP: "00FC" },
        stackBefore: stackAfterPushAX,
        stackAfter: stackAfterPushBX,
        flowBefore: { current: "PUSH BX", next: "guardar BX", executed: ["PUSH AX"] },
        flowAfter: { current: "PUSH BX", next: "POP CX", executed: ["PUSH AX", "PUSH BX", "SP=00FC", "[00FC]=ABCD"] },
        changedRegs: ["SP"],
        changedStack: ["00FC"],
        changedFlow: [],
        correctExplain: "PUSH BX vuelve a decrementar SP en 2. BX queda arriba de AX: SP = 00FC, [00FC] = ABCD.",
        diagram: "Antes:\nSP = 00FE\n[00FE] = 1234\nBX = ABCD\n\nPUSH BX:\nSP = 00FC\n[00FC] = ABCD\n\nTope actual: ABCD",
        options: [
          { id: "A", text: "SP = 00FC y el tope es ABCD", correct: true, feedback: "Correcto. BX queda encima de AX." },
          { id: "B", text: "SP = 00FE y BX reemplaza a AX", correct: false, tag: "cree_push_reemplaza_tope", hint: "PUSH no reemplaza el tope anterior; crea un nuevo tope." },
          { id: "C", text: "SP = 0100 y la pila queda vacía", correct: false, tag: "push_no_modifica_sp", hint: "PUSH agrega un valor; no vacía la pila." }
        ]
      },
      {
        id: "E7_Q5",
        step: 5,
        title: "Predicción antes de POP",
        instruction: "POP CX",
        question: "Antes de ejecutar POP CX, ¿qué valor saldrá primero de la pila?",
        codeIndex: 9,
        before: { AX: "1234", BX: "ABCD", CX: "0000", DX: "0000", SP: "00FC" },
        after:  { AX: "1234", BX: "ABCD", CX: "0000", DX: "0000", SP: "00FC" },
        stackBefore: stackAfterPushBX,
        stackAfter: stackAfterPushBX,
        flowBefore: { current: "POP CX", next: "predecir LIFO", executed: ["PUSH AX", "PUSH BX"] },
        flowAfter: { current: "POP CX", next: "ejecutar POP", executed: ["último apilado = BX"] },
        changedRegs: [],
        changedStack: ["00FC"],
        changedFlow: [],
        correctExplain: "La pila es LIFO. Como BX fue el último en entrar, BX será el primero en salir.",
        diagram: "Orden de entrada:\n1. PUSH AX → 1234\n2. PUSH BX → ABCD\n\nPila LIFO:\núltimo en entrar, primero en salir.\n\nPrimer POP devuelve ABCD.",
        options: [
          { id: "A", text: "ABCD, porque BX fue el último apilado", correct: true, feedback: "Correcto. La pila funciona como LIFO." },
          { id: "B", text: "1234, porque AX fue el primero apilado", correct: false, tag: "cree_fifo", hint: "Eso sería FIFO. La pila no funciona como cola." },
          { id: "C", text: "0000, porque CX está vacío", correct: false, tag: "pop_no_carga_registro", hint: "CX es el destino. El valor viene desde el tope de la pila." }
        ]
      },
      {
        id: "E7_Q6",
        step: 6,
        title: "Primer POP",
        instruction: "POP CX",
        question: "Después de POP CX, ¿qué valores quedan en CX y SP?",
        codeIndex: 9,
        before: { AX: "1234", BX: "ABCD", CX: "0000", DX: "0000", SP: "00FC" },
        after:  { AX: "1234", BX: "ABCD", CX: "ABCD", DX: "0000", SP: "00FE" },
        stackBefore: stackAfterPushBX,
        stackAfter: stackAfterPopCX,
        flowBefore: { current: "POP CX", next: "extraer tope", executed: ["tope = ABCD"] },
        flowAfter: { current: "POP CX", next: "POP DX", executed: ["POP CX", "CX=ABCD", "SP=00FE"] },
        changedRegs: ["CX", "SP"],
        changedStack: ["00FC", "00FE"],
        changedFlow: [],
        correctExplain: "POP CX carga el tope ABCD en CX y luego SP sube de 00FC a 00FE.",
        diagram: "Antes:\nSP = 00FC\n[00FC] = ABCD\n\nPOP CX:\nCX = ABCD\nSP = SP + 2\nSP = 00FE",
        options: [
          { id: "A", text: "CX = ABCD y SP = 00FE", correct: true, feedback: "Correcto. POP extrae el tope y SP avanza dos posiciones." },
          { id: "B", text: "CX = 1234 y SP = 00FE", correct: false, tag: "cree_fifo", hint: "1234 está debajo. El primer POP toma ABCD." },
          { id: "C", text: "CX = 00FC y SP = 00FC", correct: false, tag: "confunde_sp_con_contenido", hint: "CX recibe el contenido del tope, no la dirección SP." }
        ]
      },
      {
        id: "E7_Q7",
        step: 7,
        title: "Tope después del primer POP",
        instruction: "POP CX",
        question: "Después de POP CX, ¿qué valor queda ahora en el tope de la pila activa?",
        codeIndex: 9,
        before: { AX: "1234", BX: "ABCD", CX: "ABCD", DX: "0000", SP: "00FE" },
        after:  { AX: "1234", BX: "ABCD", CX: "ABCD", DX: "0000", SP: "00FE" },
        stackBefore: stackAfterPopCX,
        stackAfter: stackAfterPopCX,
        flowBefore: { current: "análisis", next: "identificar nuevo tope", executed: ["POP CX"] },
        flowAfter: { current: "análisis", next: "POP DX", executed: ["nuevo tope = AX"] },
        changedRegs: [],
        changedStack: ["00FE"],
        changedFlow: [],
        correctExplain: "Después de retirar ABCD, el nuevo tope es el valor anterior: 1234 en la dirección 00FE.",
        diagram: "Antes de POP CX:\nTope = ABCD\nDebajo = 1234\n\nDespués de POP CX:\nABCD sale de la pila activa.\nNuevo tope = 1234.",
        options: [
          { id: "A", text: "1234, el valor que venía de AX", correct: true, feedback: "Correcto. Al salir BX, queda AX en el tope." },
          { id: "B", text: "ABCD, porque queda en memoria", correct: false, tag: "confunde_memoria_historica_con_pila_activa", hint: "Aunque el dato pueda quedar físicamente en memoria, ya no está dentro de la pila activa." },
          { id: "C", text: "La pila queda vacía", correct: false, tag: "cree_pop_borra_toda_pila", hint: "Solo salió un elemento. Todavía queda el valor de AX." }
        ]
      },
      {
        id: "E7_Q8",
        step: 8,
        title: "Segundo POP",
        instruction: "POP DX",
        question: "Después de POP DX, ¿qué valores quedan en DX y SP?",
        codeIndex: 10,
        before: { AX: "1234", BX: "ABCD", CX: "ABCD", DX: "0000", SP: "00FE" },
        after:  { AX: "1234", BX: "ABCD", CX: "ABCD", DX: "1234", SP: "0100" },
        stackBefore: stackAfterPopCX,
        stackAfter: stackAfterPopDX,
        flowBefore: { current: "POP DX", next: "extraer nuevo tope", executed: ["CX=ABCD", "SP=00FE"] },
        flowAfter: { current: "fin", next: "print reg", executed: ["POP DX", "DX=1234", "SP=0100"] },
        changedRegs: ["DX", "SP"],
        changedStack: ["00FE"],
        changedFlow: ["fin"],
        correctExplain: "POP DX toma el valor 1234 del tope y SP vuelve a 0100, el valor inicial.",
        diagram: "Antes:\nSP = 00FE\n[00FE] = 1234\n\nPOP DX:\nDX = 1234\nSP = SP + 2\nSP = 0100\n\nLa pila activa queda vacía.",
        options: [
          { id: "A", text: "DX = 1234 y SP = 0100", correct: true, feedback: "Correcto. El segundo POP recupera AX y SP vuelve al valor inicial." },
          { id: "B", text: "DX = ABCD y SP = 0100", correct: false, tag: "cree_fifo", hint: "ABCD ya salió en POP CX. Ahora sale 1234." },
          { id: "C", text: "DX = 1234 y SP = 00FC", correct: false, tag: "pop_no_modifica_sp", hint: "POP incrementa SP en 2." }
        ]
      },
      {
        id: "E7_Q9",
        step: 9,
        title: "Estado final",
        instruction: "POP DX",
        question: "¿Cuál es el estado final correcto de registros después de los dos POP?",
        codeIndex: 10,
        before: { AX: "1234", BX: "ABCD", CX: "ABCD", DX: "1234", SP: "0100" },
        after:  { AX: "1234", BX: "ABCD", CX: "ABCD", DX: "1234", SP: "0100" },
        stackBefore: stackAfterPopDX,
        stackAfter: stackAfterPopDX,
        flowBefore: { current: "fin", next: "verificar registros", executed: ["PUSH AX", "PUSH BX", "POP CX", "POP DX"] },
        flowAfter: { current: "fin", next: "defensa", executed: ["verificación final"] },
        changedRegs: [],
        changedStack: [],
        changedFlow: [],
        correctExplain: "CX recibe ABCD porque BX fue el último apilado. DX recibe 1234 porque AX quedó debajo.",
        diagram: "Secuencia:\nPUSH AX → 1234 entra primero\nPUSH BX → ABCD entra después\nPOP CX → sale ABCD\nPOP DX → sale 1234\n\nFinal:\nCX = ABCD\nDX = 1234\nSP = 0100",
        options: [
          { id: "A", text: "CX = ABCD, DX = 1234, SP = 0100", correct: true, feedback: "Correcto. Ese es el comportamiento LIFO." },
          { id: "B", text: "CX = 1234, DX = ABCD, SP = 0100", correct: false, tag: "cree_fifo", hint: "Ese resultado correspondería a una cola FIFO, no a una pila." },
          { id: "C", text: "CX = ABCD, DX = ABCD, SP = 00FC", correct: false, tag: "sp_final_incorrecto", hint: "Cada POP extrae un elemento distinto y SP vuelve a 0100." }
        ]
      },
      {
        id: "E7_Q10",
        step: 10,
        title: "Secuencia a analizar",
        instruction: "PUSH AX\nPUSH BX\nPOP CX",
        question: "¿Qué significa LIFO en esta secuencia?",
        codeIndex: null,
        before: { AX: "1234", BX: "ABCD", CX: "ABCD", DX: "1234", SP: "0100" },
        after:  { AX: "1234", BX: "ABCD", CX: "ABCD", DX: "1234", SP: "0100" },
        stackBefore: stackAfterPopDX,
        stackAfter: stackAfterPopDX,
        flowBefore: { current: "defensa", next: "explicar LIFO", executed: ["resultado final"] },
        flowAfter: { current: "defensa", next: "resultado", executed: ["LIFO identificado"] },
        changedRegs: [],
        changedStack: [],
        changedFlow: [],
        correctExplain: "LIFO significa último en entrar, primero en salir. BX entra después de AX, por eso sale primero.",
        diagram: "Entrada:\n1. AX = 1234\n2. BX = ABCD\n\nSalida:\n1. CX recibe ABCD\n2. DX recibe 1234\n\nÚltimo en entrar, primero en salir.",
        options: [
          { id: "A", text: "Último en entrar, primero en salir", correct: true, feedback: "Correcto. Esa es la lógica de la pila." },
          { id: "B", text: "Primero en entrar, primero en salir", correct: false, tag: "cree_fifo", hint: "Eso describe FIFO, una cola, no una pila." },
          { id: "C", text: "El registro mayor sale primero", correct: false, tag: "no_reconoce_lifo", hint: "El orden no depende del valor numérico, sino del orden de apilado." }
        ]
      }
    ];

export const stackLifoExercise: Exercise = {
  id: 'stack_lifo_07',
  moduleId: 'mod_stack',
  order: 7,
  title: 'Ejercicio 7 · Pila básica',
  subtitle: 'PUSH, POP, SP y LIFO · 8086',
  description: 'Predice el comportamiento de la pila, el tope y el registro SP.',
  estimatedMinutes: 10,
  initialRegisters: {
  "AX": "0000",
  "BX": "0000",
  "CX": "0000",
  "DX": "0000",
  "SP": "0100"
},
  initialMemory: undefined,
  passing: {
  "canAdvance": 8.5,
  "reviewRecommended": 7.0,
  "mustRepeat": 4.5
},
  codeLines,
  steps: rawSteps.map((step: any) => ({
    ...step,
    codeIndex: step.codeIndex ?? 0,
    changed: step.changed ?? step.changedRegs ?? [],
    changedMemory: step.changedMemory ?? step.changedMem ?? []
  })),
  review: {
  "title": "Repaso corto",
  "subtitle": "Pila, SP y comportamiento LIFO",
  "blocks": [
    {
      "title": "La pila es LIFO",
      "body": "El último valor apilado es el primero que sale.",
      "code": "PUSH AX -> entra 1234\nPUSH BX -> entra ABCD\n\nPrimer POP -> sale ABCD\nSegundo POP -> sale 1234"
    },
    {
      "title": "SP apunta al tope",
      "body": "SP no es el dato apilado. SP es la dirección del tope.",
      "code": "SP = 00FC\n[SP] = [00FC] = ABCD\n\nPOP CX:\nCX = ABCD\nSP = 00FE"
    },
    {
      "title": "PUSH y POP modifican SP",
      "body": "En palabras de 16 bits, PUSH resta 2 a SP y POP suma 2 a SP.",
      "code": "PUSH de palabra: SP = SP - 2\nPOP de palabra: SP = SP + 2"
    }
  ],
  "quickQuestion": {
    "id": "review_stack_lifo_07",
    "prompt": "Si se ejecuta PUSH AX y luego PUSH BX, ¿qué valor sale con el primer POP?",
    "options": [
      {
        "id": "A",
        "text": "BX",
        "correct": true
      },
      {
        "id": "B",
        "text": "AX",
        "correct": false,
        "tag": "confunde_lifo_fifo"
      },
      {
        "id": "C",
        "text": "SP",
        "correct": false,
        "tag": "confunde_sp_con_dato"
      }
    ],
    "correctFeedback": "BX fue el último apilado, por eso sale primero.",
    "incorrectFeedback": "La pila es LIFO: último en entrar, primero en salir. Sale BX."
  }
},
  variant: {
  "id": "variant_stack_lifo_07",
  "title": "Pregunta de defensa",
  "subtitle": "LIFO: último en entrar, primero en salir",
  "prompt": "Si primero se apila AX y luego BX, ¿por qué al primer POP no aparece AX?",
  "instruction": "PUSH AX\nPUSH BX\nPOP CX",
  "groups": [
    {
      "id": "firstPop",
      "label": "El primer POP devuelve:",
      "options": [
        "AX / 1234",
        "BX / ABCD",
        "SP / 00FC"
      ]
    },
    {
      "id": "reason",
      "label": "porque:",
      "options": [
        "entró primero",
        "quedó en el tope",
        "tiene mayor valor"
      ]
    }
  ],
  "correctSelection": {
    "firstPop": "BX / ABCD",
    "reason": "quedó en el tope"
  },
  "correctFeedback": "BX fue el último valor apilado y quedó en el tope; por eso sale primero.",
  "incorrectFeedback": "El primer POP no devuelve AX porque después de PUSH BX, BX queda en el tope de la pila."
}
};
