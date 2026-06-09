import type { Exercise } from '../types';

const codeLines = [
      "def doble {",
      "ADD AX, AX",
      "ret",
      "}",
      "",
      "start:",
      "MOV AX, 0x0004",
      "call doble",
      "MOV BX, AX",
      "print reg",
      "HLT"
    ];

    const cCode = `int doble(int x) {
    return x + x;
}`;

    const rawSteps = [
      {
        id: "E8_Q1",
        step: 1,
        title: "Equivalencia conceptual en C",
        instruction: "int doble(int x) { return x + x; }",
        question: "En la función C doble(x), ¿cuál es la entrada, el proceso y la salida?",
        codeIndex: null,
        before: { AX: "0000", BX: "0000", FLUJO: "principal" },
        after:  { AX: "0000", BX: "0000", FLUJO: "principal" },
        flowBefore: { current: "C conceptual", next: "identificar entrada/proceso/salida", executed: [] },
        flowAfter: { current: "C conceptual", next: "pasar a ensamblador", executed: ["entrada x", "proceso x+x", "salida retorno"] },
        mapAfter: [
          { c: "x", asm: "AX como entrada" },
          { c: "x + x", asm: "ADD AX, AX" },
          { c: "return", asm: "AX como resultado" }
        ],
        changedRegs: [],
        changedFlow: [],
        correctExplain: "x es la entrada, x+x es el proceso y el valor retornado es la salida.",
        diagram: "Función C:\nint doble(int x) {\n    return x + x;\n}\n\nEntrada: x\nProceso: x + x\nSalida: return",
        options: [
          { id: "A", text: "Entrada: x · Proceso: x+x · Salida: return", correct: true, feedback: "Correcto. Esa es la estructura entrada-proceso-salida." },
          { id: "B", text: "Entrada: return · Proceso: x · Salida: x+x", correct: false, tag: "no_identifica_entrada", hint: "La entrada es el valor recibido por la función: x." },
          { id: "C", text: "No hay entrada; la función se ejecuta sola", correct: false, tag: "no_identifica_entrada", hint: "La función necesita un dato de entrada. En C es x; en ensamblador usaremos AX." }
        ]
      },
      {
        id: "E8_Q2",
        step: 2,
        title: "Entrada en ensamblador",
        instruction: "MOV AX, 0x0004",
        question: "Después de MOV AX, 0x0004, ¿qué representa AX?",
        codeIndex: 6,
        before: { AX: "0000", BX: "0000", FLUJO: "principal" },
        after:  { AX: "0004", BX: "0000", FLUJO: "principal" },
        flowBefore: { current: "principal", next: "MOV AX, 0004", executed: [] },
        flowAfter: { current: "principal", next: "call doble", executed: ["AX = entrada 0004"] },
        mapAfter: [
          { c: "x = 4", asm: "AX = 0004" },
          { c: "doble(x)", asm: "call doble" },
          { c: "resultado", asm: "AX después de RET" }
        ],
        changedRegs: ["AX"],
        changedFlow: [],
        correctExplain: "AX contiene el valor de entrada para la subrutina doble. En este caso, AX = 0004.",
        diagram: "En C:\ndoble(4)\n\nEn ensamblador didáctico:\nMOV AX, 0004\ncall doble\n\nAX funciona como entrada.",
        options: [
          { id: "A", text: "AX es la entrada/parámetro de la subrutina", correct: true, feedback: "Correcto. AX contiene el valor que procesará doble." },
          { id: "B", text: "AX ya contiene el resultado final", correct: false, tag: "no_identifica_salida", hint: "Todavía no se ejecutó la subrutina. AX solo contiene la entrada." },
          { id: "C", text: "AX indica a qué línea saltar", correct: false, tag: "confunde_principal_con_subrutina", hint: "AX no controla el flujo. El flujo lo cambiará CALL." }
        ]
      },
      {
        id: "E8_Q3",
        step: 3,
        title: "Llamada a subrutina",
        instruction: "call doble",
        question: "¿Qué hace call doble?",
        codeIndex: 7,
        before: { AX: "0004", BX: "0000", FLUJO: "principal" },
        after:  { AX: "0004", BX: "0000", FLUJO: "subrutina" },
        flowBefore: { current: "principal", next: "call doble", executed: ["AX = 0004"] },
        flowAfter: { current: "subrutina doble", next: "ADD AX, AX", executed: ["call doble", "entra a subrutina"] },
        mapAfter: [
          { c: "doble(4)", asm: "call doble" },
          { c: "entra a función", asm: "flujo pasa a def doble" },
          { c: "x sigue valiendo 4", asm: "AX sigue 0004 al entrar" }
        ],
        changedRegs: ["FLUJO"],
        changedFlow: ["subrutina doble"],
        correctExplain: "CALL transfiere el control a la subrutina. No duplica AX por sí mismo; solo entra al procedimiento doble.",
        diagram: "Antes:\nFlujo = principal\nAX = 0004\n\ncall doble:\ntransfiere el control a la subrutina doble.\n\nAX todavía sigue en 0004.",
        options: [
          { id: "A", text: "Transfiere el control a la subrutina doble", correct: true, feedback: "Correcto. CALL entra al procedimiento." },
          { id: "B", text: "Duplica AX automáticamente", correct: false, tag: "call_modifica_ax_directamente", hint: "CALL no realiza la suma. La suma ocurre dentro de la subrutina." },
          { id: "C", text: "Termina el programa", correct: false, tag: "call_no_transfiere_control", hint: "CALL no termina el programa. Cambia el flujo hacia la subrutina." }
        ]
      },
      {
        id: "E8_Q4",
        step: 4,
        title: "Procesamiento dentro de la subrutina doble",
        instruction: "def doble {\n  ADD AX, AX\n  ret\n}",
        question: "Dentro de la subrutina doble, ¿qué efecto exacto produce ADD AX, AX sobre AX y sobre el valor que queda disponible al retornar?",
        codeIndex: 1,
        before: { AX: "0004", BX: "0000", FLUJO: "subrutina" },
        after:  { AX: "0008", BX: "0000", FLUJO: "subrutina" },
        flowBefore: { current: "subrutina doble", next: "ADD AX, AX", executed: ["call doble"] },
        flowAfter: { current: "subrutina doble", next: "ret", executed: ["call doble", "AX = AX + AX"] },
        mapAfter: [
          { c: "return x + x", asm: "ADD AX, AX" },
          { c: "4 + 4", asm: "0004 + 0004" },
          { c: "resultado 8", asm: "AX = 0008" }
        ],
        changedRegs: ["AX"],
        changedFlow: [],
        correctExplain: "ADD usa AX como destino y como fuente: AX se sobrescribe con AX + AX. RET no calcula el resultado; solo permite volver conservando AX = 0008.",
        diagram: "Entrada a doble:\nAX = 0004\n\nADD AX, AX:\nAX = AX + AX\nAX = 0004 + 0004\nAX = 0008\n\nValor disponible al retornar:\nAX = 0008",
        options: [
          { id: "A", text: "Duplica AX en el mismo registro: AX queda 0008 y ese valor queda disponible para el retorno", correct: true, feedback: "Correcto. ADD AX, AX modifica el destino AX y deja ahí el resultado." },
          { id: "B", text: "Deja AX en 0004 y guarda el 0008 como resultado implícito de RET", correct: false, tag: "add_no_modifica_ax", hint: "RET no calcula ni guarda resultados. La modificación ocurre en ADD, sobre el destino AX." },
          { id: "C", text: "Suma AX con BX; AX queda 0004 y BX queda 0008", correct: false, tag: "add_reemplaza_ax", hint: "La instrucción no menciona BX. ADD AX, AX opera solo sobre AX." }
        ]
      },
      {
        id: "E8_Q5",
        step: 5,
        title: "Retorno",
        instruction: "ret",
        question: "¿Qué hace ret después de que AX quedó en 0008?",
        codeIndex: 2,
        before: { AX: "0008", BX: "0000", FLUJO: "subrutina" },
        after:  { AX: "0008", BX: "0000", FLUJO: "principal" },
        flowBefore: { current: "subrutina doble", next: "ret", executed: ["call doble", "AX=0008"] },
        flowAfter: { current: "principal", next: "MOV BX, AX", executed: ["call doble", "AX=0008", "retorna al principal"] },
        mapAfter: [
          { c: "return", asm: "ret" },
          { c: "vuelve después de doble(4)", asm: "vuelve después de call doble" },
          { c: "resultado disponible", asm: "AX = 0008" }
        ],
        changedRegs: ["FLUJO"],
        changedFlow: ["principal"],
        correctExplain: "RET devuelve el control al programa principal, específicamente a la instrucción posterior a CALL. AX conserva el resultado 0008.",
        diagram: "Dentro de subrutina:\nAX = 0008\n\nret:\nvuelve al flujo principal.\n\nLa siguiente instrucción será:\nMOV BX, AX",
        options: [
          { id: "A", text: "Vuelve al programa principal después de CALL", correct: true, feedback: "Correcto. RET devuelve el control al punto posterior a CALL." },
          { id: "B", text: "Reinicia el programa desde start", correct: false, tag: "ret_reinicia_programa", hint: "RET no reinicia. Regresa al punto posterior a la llamada." },
          { id: "C", text: "Borra AX y termina la subrutina", correct: false, tag: "ret_no_vuelve_principal", hint: "RET no borra AX. AX conserva el resultado." }
        ]
      },
      {
        id: "E8_Q6",
        step: 6,
        title: "Captura del resultado después del retorno",
        instruction: "Después de ret:\nMOV BX, AX",
        question: "Después de RET, ¿por qué MOV BX, AX permite conservar el resultado de doble sin destruir el valor devuelto en AX?",
        codeIndex: 8,
        before: { AX: "0008", BX: "0000", FLUJO: "principal" },
        after:  { AX: "0008", BX: "0008", FLUJO: "principal" },
        flowBefore: { current: "principal", next: "MOV BX, AX", executed: ["retorno completado"] },
        flowAfter: { current: "principal", next: "print reg", executed: ["MOV BX, AX", "BX = resultado"] },
        mapAfter: [
          { c: "resultado = doble(4)", asm: "AX = 0008" },
          { c: "guardar resultado", asm: "MOV BX, AX" },
          { c: "verificación", asm: "BX = 0008" }
        ],
        changedRegs: ["BX"],
        changedFlow: [],
        correctExplain: "MOV copia el operando fuente AX hacia el destino BX. No borra AX. Por eso BX queda en 0008 y AX conserva 0008.",
        diagram: "Después de RET:\nAX = 0008\nBX = 0000\n\nMOV BX, AX:\nDestino = BX\nFuente = AX\n\nResultado:\nBX = 0008\nAX = 0008",
        options: [
          { id: "A", text: "Porque MOV copia AX hacia BX: BX queda 0008 y AX sigue 0008", correct: true, feedback: "Correcto. MOV no consume ni borra el registro fuente." },
          { id: "B", text: "Porque MOV transfiere AX hacia BX y deja AX en 0000", correct: false, tag: "bx_no_recibe_resultado", hint: "MOV copia; no vacía el operando fuente." },
          { id: "C", text: "Porque BX recupera la entrada original 0004 almacenada antes del CALL", correct: false, tag: "no_identifica_salida", hint: "BX recibe el valor actual de AX después del retorno, no la entrada original." }
        ]
      },
      {
        id: "E8_Q7",
        step: 7,
        title: "Separación de flujo principal y subrutina",
        instruction: "Subrutina doble:\ndef doble {\n  ADD AX, AX\n  ret\n}\n\nBloque principal:\nstart:\n  MOV AX, 0x0004\n  call doble\n  MOV BX, AX\n  print reg\n  HLT",
        question: "Al separar el bloque principal de la subrutina, ¿qué línea constituye el cuerpo de cálculo de doble y por qué no pertenece al flujo principal?",
        codeIndex: 1,
        before: { AX: "0008", BX: "0008", FLUJO: "principal" },
        after:  { AX: "0008", BX: "0008", FLUJO: "principal" },
        flowBefore: { current: "análisis", next: "separar principal/subrutina", executed: ["resultado verificado"] },
        flowAfter: { current: "análisis", next: "pregunta de control", executed: ["subrutina identificada"] },
        mapAfter: [
          { c: "función doble", asm: "def doble { ... }" },
          { c: "proceso", asm: "ADD AX, AX" },
          { c: "retorno", asm: "ret" }
        ],
        changedRegs: [],
        changedFlow: [],
        correctExplain: "ADD AX, AX está dentro del bloque delimitado por def doble { ... }. Es el cálculo interno de la subrutina; MOV BX, AX pertenece al flujo principal posterior al retorno.",
        diagram: "Subrutina doble:\ndef doble {\nADD AX, AX\nret\n}\n\nFlujo principal:\nstart:\nMOV AX, 0004\ncall doble\nMOV BX, AX\nprint reg\nHLT",
        options: [
          { id: "A", text: "ADD AX, AX, porque está dentro del bloque def doble { ... } y realiza el cálculo interno", correct: true, feedback: "Correcto. Esa línea es el cuerpo operativo de doble." },
          { id: "B", text: "MOV BX, AX, porque aparece después de call doble", correct: false, tag: "confunde_principal_con_subrutina", hint: "Aparecer después de CALL no lo convierte en parte de la subrutina. Se ejecuta después de RET, en el flujo principal." },
          { id: "C", text: "print reg, porque muestra el resultado final", correct: false, tag: "confunde_principal_con_subrutina", hint: "print reg solo verifica el estado final; no realiza el cálculo de doble." }
        ]
      },
      {
        id: "E8_Q8",
        step: 8,
        title: "Orden físico vs punto de entrada",
        instruction: "def doble {\n  ADD AX, AX\n  ret\n}\n\nstart:\n  MOV AX, 0x0004\n  call doble",
        question: "Aunque la subrutina doble esté escrita antes de start, ¿por qué ADD AX, AX no se ejecuta antes de MOV AX, 0x0004?",
        codeIndex: 0,
        before: { AX: "0008", BX: "0008", FLUJO: "principal" },
        after:  { AX: "0008", BX: "0008", FLUJO: "principal" },
        flowBefore: { current: "análisis", next: "punto de entrada start", executed: ["doble definida antes de start"] },
        flowAfter: { current: "análisis", next: "defensa", executed: ["start inicia ejecución", "call entra a doble"] },
        mapAfter: [
          { c: "definir función", asm: "def doble { ... }" },
          { c: "punto de entrada", asm: "start" },
          { c: "invocar función", asm: "call doble" }
        ],
        changedRegs: [],
        changedFlow: [],
        correctExplain: "En esta sintaxis de emulador, las llaves delimitan el bloque de la subrutina. La ruta principal inicia en start; el bloque doble se ejecuta recién cuando call doble transfiere el control hacia él.",
        diagram: "Orden escrito:\ndef doble {\n  ADD AX, AX\n  ret\n}\n\nstart:\nMOV AX, 0004\ncall doble\n\nOrden ejecutado:\n1. start\n2. MOV AX, 0004\n3. call doble\n4. ADD AX, AX\n5. ret\n6. MOV BX, AX",
        options: [
          { id: "A", text: "Porque start es el punto de entrada; las llaves solo delimitan doble y CALL es quien entra al bloque", correct: true, feedback: "Correcto. El orden escrito no obliga a ejecutar doble antes de start." },
          { id: "B", text: "Porque al estar antes de start, doble se ejecuta automáticamente y luego continúa en start", correct: false, tag: "subrutina_ejecuta_sin_call", hint: "La posición física del bloque no lo ejecuta. La entrada a doble ocurre con CALL." },
          { id: "C", text: "Porque las llaves hacen que RET llame a start y después se ejecute CALL", correct: false, tag: "defensa_invertida", hint: "RET no llama a start. RET devuelve el control a la instrucción posterior al CALL." }
        ]
      },
      {
        id: "E8_Q9",
        step: 9,
        title: "Contrato CALL/RET",
        instruction: "call doble\n\nentra a:\ndef doble {\n  ADD AX, AX\n  ret\n}",
        question: "Si se usa call doble, ¿por qué la subrutina debe terminar con ret?",
        codeIndex: 2,
        before: { AX: "0008", BX: "0008", FLUJO: "principal" },
        after:  { AX: "0008", BX: "0008", FLUJO: "principal" },
        flowBefore: { current: "análisis", next: "contrato CALL/RET", executed: ["call doble abre una llamada"] },
        flowAfter: { current: "análisis", next: "resultado final", executed: ["CALL entra a la subrutina", "RET cierra la llamada"] },
        mapAfter: [
          { c: "invocar función", asm: "call doble" },
          { c: "cerrar llamada", asm: "ret" },
          { c: "continuar llamador", asm: "MOV BX, AX" }
        ],
        changedRegs: [],
        changedFlow: [],
        correctExplain: "CALL entra a la subrutina y deja preparada la vuelta al punto posterior a la llamada. RET cierra esa llamada y devuelve el flujo al programa principal para continuar con MOV BX, AX.",
        diagram: "Contrato de control:\n1. call doble transfiere el control a la subrutina.\n2. ADD AX, AX procesa el dato.\n3. ret cierra la llamada y devuelve el flujo al punto posterior a call doble.\n4. MOV BX, AX puede ejecutarse.\n\nSin RET, la llamada queda sin retorno controlado.",
        options: [
          { id: "A", text: "Porque CALL deja pendiente un retorno al flujo principal, y RET usa ese retorno para volver después de call doble.", correct: true, feedback: "Correcto. CALL entra a la subrutina y deja preparada la vuelta al punto posterior a la llamada. RET cierra esa llamada y devuelve el flujo al programa principal para continuar con MOV BX, AX." },
          { id: "B", text: "Porque RET vuelve a ejecutar la subrutina desde def doble {.", correct: false, tag: "ret_reinicia_programa", hint: "RET no reinicia la subrutina ni vuelve a def doble {. RET devuelve el control al punto posterior a la instrucción call doble." },
          { id: "C", text: "Porque CALL duplica AX y RET copia AX hacia BX.", correct: false, tag: "call_modifica_ax_directamente", hint: "CALL y RET controlan el flujo. La duplicación ocurre con ADD AX, AX. La copia del resultado ocurre después, con MOV BX, AX." }
        ]
      },
      {
        id: "E8_Q10",
        step: 10,
        title: "Cierre: evidencia de retorno correcto",
        instruction: "print reg\nHLT\n\nAX = 0008\nBX = 0008",
        question: "¿Qué conclusión técnica demuestra el estado final AX = 0008 y BX = 0008?",
        codeIndex: 9,
        before: { AX: "0008", BX: "0008", FLUJO: "principal" },
        after:  { AX: "0008", BX: "0008", FLUJO: "principal" },
        flowBefore: { current: "principal", next: "print reg", executed: ["doble ejecutado"] },
        flowAfter: { current: "fin", next: "reporte", executed: ["AX=0008", "BX=0008"] },
        mapAfter: [
          { c: "doble(4)", asm: "AX = 0008" },
          { c: "resultado visible", asm: "BX = 0008" },
          { c: "retorno correcto", asm: "MOV BX, AX ejecutado" }
        ],
        changedRegs: [],
        changedFlow: ["fin"],
        correctExplain: "El estado final prueba dos cosas: la subrutina sí modificó AX y RET sí devolvió el control al principal, donde se ejecutó MOV BX, AX.",
        diagram: "Evidencia 1:\nAX = 0008\nLa subrutina ejecutó ADD AX, AX.\n\nEvidencia 2:\nBX = 0008\nDespués de RET se ejecutó MOV BX, AX.\n\nConclusión:\nCALL entró a doble y RET volvió al flujo principal.",
        options: [
          { id: "A", text: "Que doble modificó AX y luego el flujo volvió al principal para ejecutar MOV BX, AX", correct: true, feedback: "Correcto. AX confirma el cálculo y BX confirma que hubo retorno al principal." },
          { id: "B", text: "Que print reg calculó el resultado final y escribió 0008 en AX y BX", correct: false, tag: "no_reconoce_instruccion_posterior_call", hint: "print reg solo muestra el estado. No calcula ni modifica los registros." },
          { id: "C", text: "Que CALL duplicó AX directamente y por eso BX recibió 0008", correct: false, tag: "call_modifica_ax_directamente", hint: "CALL no duplica AX. La duplicación ocurre con ADD AX, AX dentro de la subrutina." }
        ]
      }
    ];

export const callRetExercise: Exercise = {
  id: 'call_ret_08',
  moduleId: 'mod_subroutine',
  order: 8,
  title: 'Ejercicio 8 · CALL y RET',
  subtitle: 'Flujo principal y subrutina · 8086',
  description: 'Predice cómo CALL entra a una subrutina, cómo RET vuelve y cómo se conserva el resultado.',
  estimatedMinutes: 10,
  initialRegisters: {
  "AX": "0000",
  "BX": "0000",
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
  "subtitle": "Flujo principal, CALL, subrutina y RET",
  "blocks": [
    {
      "title": "Entrada, proceso y salida",
      "body": "AX puede actuar como entrada y salida de la subrutina didáctica.",
      "code": "def doble { ... } = definición de subrutina\nAX = entrada\nADD AX, AX = proceso\nAX después de RET = salida"
    },
    {
      "title": "CALL entra a la subrutina",
      "body": "CALL transfiere el control a la subrutina. No duplica AX por sí mismo.",
      "code": "start:\nMOV AX, 0004\ncall doble\n\nCALL transfiere el control a doble."
    },
    {
      "title": "RET vuelve al principal",
      "body": "RET devuelve el control al flujo principal, donde puede ejecutarse la siguiente instrucción.",
      "code": "call doble\n  ADD AX, AX\n  ret\n\nDespués se ejecuta:\nMOV BX, AX"
    }
  ],
  "quickQuestion": {
    "id": "review_call_ret_08",
    "prompt": "Si AX = 0006 antes de call doble, ¿cuánto valdrá AX después de ADD AX, AX?",
    "options": [
      {
        "id": "A",
        "text": "AX = 000C",
        "correct": true
      },
      {
        "id": "B",
        "text": "AX = 0006",
        "correct": false,
        "tag": "add_no_modifica_destino"
      },
      {
        "id": "C",
        "text": "AX = 0000",
        "correct": false,
        "tag": "pierde_valor_en_call"
      }
    ],
    "correctFeedback": "0006h + 0006h = 000Ch.",
    "incorrectFeedback": "ADD AX, AX suma AX consigo mismo. 0006h + 0006h = 000Ch."
  }
},
  variant: {
  "id": "variant_call_ret_08",
  "title": "Pregunta de defensa",
  "subtitle": "CALL y RET",
  "prompt": "¿Qué instrucción transfiere el control a la subrutina y qué instrucción devuelve el control al programa principal?",
  "instruction": "def doble {\nADD AX, AX\nret\n}\n\nstart:\nMOV AX, 0004\ncall doble\nMOV BX, AX",
  "groups": [
    {
      "id": "call",
      "label": "Para entrar a la subrutina:",
      "options": [
        "CALL transfiere a la subrutina",
        "RET transfiere a la subrutina",
        "ADD transfiere a la subrutina"
      ]
    },
    {
      "id": "ret",
      "label": "Para volver al principal:",
      "options": [
        "CALL devuelve al principal",
        "RET devuelve al principal",
        "MOV devuelve al principal"
      ]
    }
  ],
  "correctSelection": {
    "call": "CALL transfiere a la subrutina",
    "ret": "RET devuelve al principal"
  },
  "correctFeedback": "CALL entra a la subrutina y RET devuelve el control al flujo principal.",
  "incorrectFeedback": "CALL transfiere el control a la subrutina; RET devuelve el control al programa principal."
}
};
