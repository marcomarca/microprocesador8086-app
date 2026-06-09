import type { Exercise } from '../types';

const codeLines = [
      "ARR: DW 0x0002",
      "DW 0x0003",
      "DW 0x0004",
      "DW 0x0001",
      "RESULT: DW 0x0000",
      "",
      "start:",
      "MOV AX, 0x0000",
      "MOV CX, 0x0004",
      "MOV SI, offset ARR",
      "",
      "ciclo:",
      "ADD AX, word [SI]",
      "ADD SI, 2",
      "LOOP ciclo",
      "MOV word RESULT, AX",
      "",
      "print reg",
      "print mem 0:12"
    ];

    const memInitial = [
      { label: "ARR[0]", address: "0000", bytes: ["02", "00"], word: "0002" },
      { label: "ARR[1]", address: "0002", bytes: ["03", "00"], word: "0003" },
      { label: "ARR[2]", address: "0004", bytes: ["04", "00"], word: "0004" },
      { label: "ARR[3]", address: "0006", bytes: ["01", "00"], word: "0001" },
      { label: "RESULT", address: "0008", bytes: ["00", "00"], word: "0000" }
    ];

    const memFinal = [
      { label: "ARR[0]", address: "0000", bytes: ["02", "00"], word: "0002" },
      { label: "ARR[1]", address: "0002", bytes: ["03", "00"], word: "0003" },
      { label: "ARR[2]", address: "0004", bytes: ["04", "00"], word: "0004" },
      { label: "ARR[3]", address: "0006", bytes: ["01", "00"], word: "0001" },
      { label: "RESULT", address: "0008", bytes: ["0A", "00"], word: "000A" }
    ];

    const rawSteps = [
      {
        id: "E6_Q1",
        step: 1,
        title: "Contador del bucle",
        instruction: "MOV CX, 0x0004",
        question: "Considerando que este programa usa LOOP ciclo, si CX se carga con 0004, ¿cuántas iteraciones ejecutará el bucle?",
        codeIndex: 8,
        before: { AX: "0000", CX: "0000", SI: "0000" },
        after:  { AX: "0000", CX: "0004", SI: "0000" },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        flowBefore: { current: "start", next: "MOV CX, 0004", executed: [] },
        flowAfter: { current: "start", next: "MOV SI, offset ARR", executed: ["CX = 0004"] },
        changedRegs: ["CX"],
        changedMem: [],
        changedFlow: [],
        correctExplain: "En este programa, LOOP ciclo usa CX como contador: al final de cada vuelta decrementa CX y repite si CX no queda en cero. Como CX inicia en 0004, el bucle ejecuta cuatro iteraciones.",
        diagram: "Arreglo:\nARR[0], ARR[1], ARR[2], ARR[3]\n\nCantidad de elementos = 4\nCX = 0004\n\nEl bucle debe ejecutar 4 iteraciones.",
        options: [
          { id: "A", text: "4 iteraciones", correct: true, feedback: "Correcto. Con LOOP ciclo, CX = 0004 produce cuatro vueltas del ciclo." },
          { id: "B", text: "3 iteraciones", correct: false, tag: "cx_no_es_contador", hint: "En este programa, LOOP ciclo usa CX como contador. Si CX inicia en 4, hay cuatro vueltas." },
          { id: "C", text: "5 iteraciones", correct: false, tag: "loop_no_depende_de_cx", hint: "LOOP depende de CX; no ejecuta una vuelta extra." }
        ]
      },
      {
        id: "E6_Q2",
        step: 2,
        title: "Inicio del arreglo",
        instruction: "MOV SI, offset ARR",
        question: "Si ARR inicia en la dirección 0000, ¿qué valor tendrá SI?",
        codeIndex: 9,
        before: { AX: "0000", CX: "0004", SI: "0000" },
        after:  { AX: "0000", CX: "0004", SI: "0000" },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        flowBefore: { current: "start", next: "MOV SI, offset ARR", executed: ["CX = 0004"] },
        flowAfter: { current: "ciclo", next: "ADD AX, word [SI]", executed: ["CX = 0004", "SI = offset ARR"] },
        changedRegs: ["SI"],
        changedMem: [],
        changedFlow: ["ciclo"],
        correctExplain: "offset ARR carga la dirección inicial del arreglo. Como ARR empieza en 0000, SI queda 0000.",
        diagram: "ARR empieza en @0000.\n\noffset ARR = 0000.\n\nSI = 0000.",
        options: [
          { id: "A", text: "SI = 0000", correct: true, feedback: "Correcto. SI apunta al inicio del arreglo." },
          { id: "B", text: "SI = 0002", correct: false, tag: "si_no_apunta_arreglo", hint: "0002 es la dirección de ARR[1], no el inicio del arreglo." },
          { id: "C", text: "SI = 0002 porque ARR[0] vale 0002", correct: false, tag: "confunde_offset_con_contenido", hint: "0002 es el contenido de ARR[0], no la dirección de ARR." }
        ]
      },
      {
        id: "E6_Q3",
        step: 3,
        title: "Iteración 1 · lectura",
        instruction: "ADD AX, word [SI]",
        question: "Iteración 1: si AX = 0000 y SI = 0000, ¿qué valor tendrá AX?",
        codeIndex: 12,
        before: { AX: "0000", CX: "0004", SI: "0000" },
        after:  { AX: "0002", CX: "0004", SI: "0000" },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        flowBefore: { current: "ciclo", next: "ADD AX, word [SI]", executed: ["Iteración 1 inicia"] },
        flowAfter: { current: "ciclo", next: "ADD SI, 2", executed: ["Iteración 1", "lee ARR[0]"] },
        changedRegs: ["AX"],
        changedMem: [],
        changedFlow: [],
        correctExplain: "[SI] lee la memoria ubicada en 0000, donde está ARR[0] = 0002. AX = 0000 + 0002 = 0002.",
        diagram: "SI = 0000\n[SI] = memoria @0000\nARR[0] = 0002\n\nAX antes = 0000\nAX después = 0002",
        options: [
          { id: "A", text: "AX = 0002", correct: true, feedback: "Correcto. Se suma ARR[0] al acumulador." },
          { id: "B", text: "AX = 0000", correct: false, tag: "confunde_si_con_si_indirecto", hint: "0000 es la dirección en SI. [SI] lee el contenido de memoria en esa dirección." },
          { id: "C", text: "AX = 0200", correct: false, tag: "confunde_bytes_con_valor_logico", hint: "Los bytes son 02 00, pero el valor lógico de la palabra es 0002." }
        ]
      },
      {
        id: "E6_Q4",
        step: 4,
        title: "Iteración 1 · avance de SI",
        instruction: "ADD SI, 2",
        question: "Después de leer ARR[0], ¿qué valor debe tomar SI para apuntar a ARR[1]?",
        codeIndex: 13,
        before: { AX: "0002", CX: "0004", SI: "0000" },
        after:  { AX: "0002", CX: "0004", SI: "0002" },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        flowBefore: { current: "ciclo", next: "ADD SI, 2", executed: ["Iteración 1", "AX = 0002"] },
        flowAfter: { current: "ciclo", next: "LOOP ciclo", executed: ["Iteración 1", "SI avanza a ARR[1]"] },
        changedRegs: ["SI"],
        changedMem: [],
        changedFlow: [],
        correctExplain: "Cada DW ocupa 2 bytes. ARR[1] empieza en 0002, por eso SI debe avanzar de 0000 a 0002.",
        diagram: "ARR[0] @0000\nARR[1] @0002\nARR[2] @0004\nARR[3] @0006\n\nSI = SI + 2\nSI = 0002",
        options: [
          { id: "A", text: "SI = 0002", correct: true, feedback: "Correcto. Para pasar al siguiente DW, SI avanza dos posiciones." },
          { id: "B", text: "SI = 0001", correct: false, tag: "avance_si_incorrecto_1", hint: "0001 queda en medio de la palabra ARR[0]. DW ocupa dos bytes." },
          { id: "C", text: "SI = 0004", correct: false, tag: "avance_si_incorrecto_4", hint: "0004 apunta a ARR[2]; saltarías ARR[1]." }
        ]
      },
      {
        id: "E6_Q5",
        step: 5,
        title: "Iteración 1 · LOOP",
        instruction: "LOOP ciclo",
        question: "Al ejecutar LOOP con CX = 0004, ¿qué ocurre?",
        codeIndex: 14,
        before: { AX: "0002", CX: "0004", SI: "0002" },
        after:  { AX: "0002", CX: "0003", SI: "0002" },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        flowBefore: { current: "LOOP ciclo", next: "¿repetir?", executed: ["Iteración 1 completa"] },
        flowAfter: { current: "ciclo", next: "ADD AX, word [SI]", executed: ["Iteración 1 completa", "CX = 0003", "salta a ciclo"] },
        changedRegs: ["CX"],
        changedMem: [],
        changedFlow: ["ciclo"],
        correctExplain: "LOOP decrementa CX. Si CX queda distinto de cero, salta a la etiqueta ciclo. CX pasa de 0004 a 0003 y el bucle continúa.",
        diagram: "Antes de LOOP:\nCX = 0004\n\nLOOP hace:\nCX = CX - 1\nCX = 0003\n\nComo CX ≠ 0:\nsalta a ciclo.",
        options: [
          { id: "A", text: "CX = 0003 y vuelve a ciclo", correct: true, feedback: "Correcto. LOOP decrementa CX y salta si CX no queda en cero." },
          { id: "B", text: "CX = 0004 y vuelve a ciclo", correct: false, tag: "loop_no_decrementa_cx", hint: "LOOP siempre decrementa CX antes de decidir el salto." },
          { id: "C", text: "CX = 0000 y termina", correct: false, tag: "cx_no_cambia_en_loop", hint: "Después de la primera vuelta CX pasa de 4 a 3, no a 0." }
        ]
      },
      {
        id: "E6_Q6",
        step: 6,
        title: "Caso hipotético aislado de error",
        instruction: "Hipótesis: ADD SI, 1",
        question: "Caso hipotético aislado: después de leer ARR[0] en la iteración 1, imagina que se ejecutara ADD SI, 1 en lugar de ADD SI, 2. SI quedaría en 0001. Si luego se leyera word [SI], ¿qué pasaría?",
        codeIndex: null,
        before: { AX: "0002", CX: "0003", SI: "0001" },
        after:  { AX: "0002", CX: "0003", SI: "0001" },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        flowBefore: { current: "hipótesis", next: "word [SI] con SI = 0001", executed: ["caso hipotético aislado", "SI = 0001"] },
        flowAfter: { current: "análisis", next: "volver al caso real con SI = 0002", executed: ["error identificado", "se retoma el camino real"] },
        changedRegs: ["SI"],
        changedMem: [],
        changedFlow: [],
        correctExplain: "En este caso hipotético, SI = 0001 apunta a una dirección intermedia. word [SI] leería los bytes 00 y 03, formando 0300h, no ARR[1]. Después de esta pregunta, el ejercicio vuelve al camino real, donde SI sí debe quedar en 0002.",
        diagram: "Caso hipotético aislado:\n\nARR[0] ocupa @0000 y @0001\nARR[1] empieza en @0002\n\nSi se hiciera ADD SI, 1:\nSI = 0001\n\nword [SI] leería desde @0001:\n@0001 = 00\n@0002 = 03\nValor lógico = 0300h\n\nEso no es ARR[1].",
        options: [
          { id: "A", text: "Leerá una palabra incorrecta: 0300h", correct: true, feedback: "Correcto. En la hipótesis, SI = 0001 queda en medio de dos palabras." },
          { id: "B", text: "Leerá ARR[1] correctamente: 0003h", correct: false, tag: "avance_si_incorrecto_1", hint: "ARR[1] empieza en 0002, no en 0001." },
          { id: "C", text: "Leerá el valor de SI: 0001h", correct: false, tag: "no_reconoce_lectura_desalineada", hint: "[SI] usa SI como dirección, no como dato." }
        ]
      },
      {
        id: "E6_Q7",
        step: 7,
        title: "Iteración 2 · lectura",
        instruction: "ADD AX, word [SI]",
        question: "Iteración 2: si AX = 0002 y SI = 0002, ¿qué valor tendrá AX?",
        codeIndex: 12,
        before: { AX: "0002", CX: "0003", SI: "0002" },
        after:  { AX: "0005", CX: "0003", SI: "0002" },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        flowBefore: { current: "ciclo", next: "ADD AX, word [SI]", executed: ["Iteración 2 inicia"] },
        flowAfter: { current: "ciclo", next: "ADD SI, 2", executed: ["Iteración 2", "lee ARR[1]"] },
        changedRegs: ["AX"],
        changedMem: [],
        changedFlow: [],
        correctExplain: "SI = 0002 apunta a ARR[1], que vale 0003. AX = 0002 + 0003 = 0005.",
        diagram: "SI = 0002\nARR[1] = 0003\n\nAX antes = 0002\nAX después = 0005",
        options: [
          { id: "A", text: "AX = 0005", correct: true, feedback: "Correcto. Se acumula ARR[1]." },
          { id: "B", text: "AX = 0003", correct: false, tag: "add_reemplaza_ax", hint: "ADD no reemplaza AX por ARR[1]. Lo suma al acumulador." },
          { id: "C", text: "AX = 0002", correct: false, tag: "add_no_modifica_ax", hint: "ADD modifica AX." }
        ]
      },
      {
        id: "E6_Q8",
        step: 8,
        title: "Fin de iteración 2",
        instruction: "ADD SI, 2\nLOOP ciclo",
        question: "Al terminar la iteración 2, ¿qué valores quedan en SI y CX?",
        codeIndex: 14,
        before: { AX: "0005", CX: "0003", SI: "0002" },
        after:  { AX: "0005", CX: "0002", SI: "0004" },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        flowBefore: { current: "LOOP ciclo", next: "¿repetir?", executed: ["Iteración 2", "AX = 0005"] },
        flowAfter: { current: "ciclo", next: "ADD AX, word [SI]", executed: ["Iteración 2 completa", "SI = 0004", "CX = 0002"] },
        changedRegs: ["SI", "CX"],
        changedMem: [],
        changedFlow: ["ciclo"],
        correctExplain: "SI avanza de 0002 a 0004. LOOP decrementa CX de 0003 a 0002 y vuelve a ciclo.",
        diagram: "Antes:\nSI = 0002\nCX = 0003\n\nADD SI, 2 → SI = 0004\nLOOP ciclo → CX = 0002\n\nComo CX ≠ 0, vuelve a ciclo.",
        options: [
          { id: "A", text: "SI = 0004 y CX = 0002", correct: true, feedback: "Correcto. SI avanza al tercer elemento y CX queda en 2." },
          { id: "B", text: "SI = 0003 y CX = 0002", correct: false, tag: "avance_si_incorrecto_1", hint: "SI no debe avanzar a 0003; debe avanzar de dos en dos." },
          { id: "C", text: "SI = 0004 y CX = 0003", correct: false, tag: "loop_no_decrementa_cx", hint: "LOOP decrementa CX." }
        ]
      },
      {
        id: "E6_Q9",
        step: 9,
        title: "Iteración 3 · lectura",
        instruction: "ADD AX, word [SI]",
        question: "Iteración 3: si AX = 0005 y SI = 0004, ¿qué valor tendrá AX?",
        codeIndex: 12,
        before: { AX: "0005", CX: "0002", SI: "0004" },
        after:  { AX: "0009", CX: "0002", SI: "0004" },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        flowBefore: { current: "ciclo", next: "ADD AX, word [SI]", executed: ["Iteración 3 inicia"] },
        flowAfter: { current: "ciclo", next: "ADD SI, 2", executed: ["Iteración 3", "lee ARR[2]"] },
        changedRegs: ["AX"],
        changedMem: [],
        changedFlow: [],
        correctExplain: "SI = 0004 apunta a ARR[2], que vale 0004. AX = 0005 + 0004 = 0009.",
        diagram: "SI = 0004\nARR[2] = 0004\n\nAX antes = 0005\nAX después = 0009",
        options: [
          { id: "A", text: "AX = 0009", correct: true, feedback: "Correcto. 0005 + 0004 = 0009." },
          { id: "B", text: "AX = 0004", correct: false, tag: "add_reemplaza_ax", hint: "ADD acumula; no reemplaza AX por el dato leído." },
          { id: "C", text: "AX = 0005", correct: false, tag: "add_no_modifica_ax", hint: "AX cambia porque se suma ARR[2]." }
        ]
      },
      {
        id: "E6_Q10",
        step: 10,
        title: "Fin de iteración 3",
        instruction: "ADD SI, 2\nLOOP ciclo",
        question: "Al terminar la iteración 3, ¿qué valores quedan en SI y CX?",
        codeIndex: 14,
        before: { AX: "0009", CX: "0002", SI: "0004" },
        after:  { AX: "0009", CX: "0001", SI: "0006" },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        flowBefore: { current: "LOOP ciclo", next: "¿repetir?", executed: ["Iteración 3", "AX = 0009"] },
        flowAfter: { current: "ciclo", next: "ADD AX, word [SI]", executed: ["Iteración 3 completa", "SI = 0006", "CX = 0001"] },
        changedRegs: ["SI", "CX"],
        changedMem: [],
        changedFlow: ["ciclo"],
        correctExplain: "SI avanza a 0006 para apuntar a ARR[3]. LOOP decrementa CX a 0001 y repite una última vez.",
        diagram: "Antes:\nSI = 0004\nCX = 0002\n\nADD SI, 2 → SI = 0006\nLOOP ciclo → CX = 0001\n\nComo CX ≠ 0, todavía falta una iteración.",
        options: [
          { id: "A", text: "SI = 0006 y CX = 0001", correct: true, feedback: "Correcto. Falta una última iteración." },
          { id: "B", text: "SI = 0005 y CX = 0001", correct: false, tag: "avance_si_incorrecto_1", hint: "SI debe avanzar dos posiciones por cada DW." },
          { id: "C", text: "SI = 0006 y CX = 0000", correct: false, tag: "cx_decrementa_antes_de_cuerpo", hint: "Después de la tercera vuelta CX pasa de 2 a 1; aún no termina." }
        ]
      },
      {
        id: "E6_Q11",
        step: 11,
        title: "Iteración 4 · lectura",
        instruction: "ADD AX, word [SI]",
        question: "Iteración 4: si AX = 0009 y SI = 0006, ¿qué valor tendrá AX?",
        codeIndex: 12,
        before: { AX: "0009", CX: "0001", SI: "0006" },
        after:  { AX: "000A", CX: "0001", SI: "0006" },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        flowBefore: { current: "ciclo", next: "ADD AX, word [SI]", executed: ["Iteración 4 inicia"] },
        flowAfter: { current: "ciclo", next: "ADD SI, 2", executed: ["Iteración 4", "lee ARR[3]"] },
        changedRegs: ["AX"],
        changedMem: [],
        changedFlow: [],
        correctExplain: "SI = 0006 apunta a ARR[3], que vale 0001. AX = 0009 + 0001 = 000A.",
        diagram: "SI = 0006\nARR[3] = 0001\n\nAX antes = 0009\nAX después = 000A",
        options: [
          { id: "A", text: "AX = 000A", correct: true, feedback: "Correcto. La suma final del arreglo es 000A." },
          { id: "B", text: "AX = 0009", correct: false, tag: "add_no_modifica_ax", hint: "ADD modifica AX. Debe sumarse ARR[3]." },
          { id: "C", text: "AX = 0001", correct: false, tag: "add_reemplaza_ax", hint: "ADD no reemplaza AX por el último elemento; lo acumula." }
        ]
      },
      {
        id: "E6_Q12",
        step: 12,
        title: "Fin del bucle",
        instruction: "ADD SI, 2\nLOOP ciclo",
        question: "Después de la cuarta iteración, ¿por qué termina el bucle?",
        codeIndex: 14,
        before: { AX: "000A", CX: "0001", SI: "0006" },
        after:  { AX: "000A", CX: "0000", SI: "0008" },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        flowBefore: { current: "LOOP ciclo", next: "¿repetir?", executed: ["Iteración 4", "AX = 000A"] },
        flowAfter: { current: "salida", next: "MOV word RESULT, AX", executed: ["Iteración 4 completa", "SI = 0008", "CX = 0000", "no salta"] },
        changedRegs: ["SI", "CX"],
        changedMem: [],
        changedFlow: ["salida"],
        correctExplain: "SI avanza a 0008. LOOP decrementa CX de 0001 a 0000. Como CX queda en cero, no vuelve a ciclo.",
        diagram: "Antes de LOOP:\nCX = 0001\nSI = 0006\n\nADD SI, 2 → SI = 0008\nLOOP ciclo:\nCX = CX - 1 → CX = 0000\n\nComo CX = 0, el bucle termina.",
        options: [
          { id: "A", text: "CX queda 0000, por eso LOOP no salta", correct: true, feedback: "Correcto. LOOP termina cuando CX llega a cero." },
          { id: "B", text: "SI queda 0008, por eso LOOP siempre salta", correct: false, tag: "loop_no_depende_de_cx", hint: "LOOP no decide con SI; decide con CX." },
          { id: "C", text: "CX queda 0001 y aun así termina", correct: false, tag: "loop_no_decrementa_cx", hint: "LOOP decrementa CX. De 0001 pasa a 0000." }
        ]
      },
      {
        id: "E6_Q13",
        step: 13,
        title: "Guardar resultado",
        instruction: "MOV word RESULT, AX",
        question: "Si AX = 000A, ¿qué queda almacenado en RESULT?",
        codeIndex: 15,
        before: { AX: "000A", CX: "0000", SI: "0008" },
        after:  { AX: "000A", CX: "0000", SI: "0008" },
        memoryBefore: memInitial,
        memoryAfter: memFinal,
        flowBefore: { current: "salida", next: "MOV word RESULT, AX", executed: ["bucle terminado"] },
        flowAfter: { current: "fin", next: "print reg / print mem", executed: ["RESULT = AX", "fin"] },
        changedRegs: [],
        changedMem: ["RESULT"],
        changedFlow: ["fin"],
        correctExplain: "MOV word RESULT, AX escribe el acumulado en memoria. 000Ah se guarda como bytes 0A 00.",
        diagram: "AX = 000Ah\nRESULT antes = 0000h\n\nMOV word RESULT, AX\n\nRESULT después = 000Ah\nBytes en memoria = 0A 00",
        options: [
          { id: "A", text: "RESULT = 000A y bytes 0A 00", correct: true, feedback: "Correcto. Se guarda el acumulado final en memoria." },
          { id: "B", text: "RESULT = 0000 porque AX no se guarda", correct: false, tag: "no_reconoce_escritura_resultado", hint: "El destino es RESULT; la instrucción escribe en memoria." },
          { id: "C", text: "RESULT = 0A00 por el orden de bytes", correct: false, tag: "confunde_bytes_con_valor_logico", hint: "Los bytes son 0A 00, pero el valor lógico es 000A." }
        ]
      },
      {
        id: "E6_Q14",
        step: 14,
        title: "Equivalencia en C",
        instruction: "ADD AX, word [SI]",
        question: "¿Qué operación en C representa mejor ADD AX, word [SI] dentro de este bucle?",
        codeIndex: null,
        before: { AX: "000A", CX: "0000", SI: "0008" },
        after:  { AX: "000A", CX: "0000", SI: "0008" },
        memoryBefore: memFinal,
        memoryAfter: memFinal,
        flowBefore: { current: "comparación C", next: "defensa", executed: ["resultado = 000A"] },
        flowAfter: { current: "comparación C", next: "resultado final", executed: ["C equivalente identificado"] },
        changedRegs: [],
        changedMem: [],
        changedFlow: [],
        correctExplain: "AX funciona como acumulador y word [SI] representa el elemento actual del arreglo. Por eso, dentro del bucle, la operación equivalente en C es sumar arreglo[i] a suma.",
        diagram: "Equivalencia conceptual:\n\nsuma = 0;\nfor (i = 0; i < n; i++) {\n    suma = suma + arreglo[i];\n}\n\nAX = suma\nCX = contador\nSI = posición del arreglo",
        options: [
          { id: "A", text: "suma = suma + arreglo[i]", correct: true, feedback: "Correcto. ADD AX, word [SI] suma el elemento actual al acumulador." },
          { id: "B", text: "suma = arreglo[i] sin acumular", correct: false, tag: "add_reemplaza_ax", hint: "El programa no reemplaza AX; acumula con ADD." },
          { id: "C", text: "i = i + 1", correct: false, tag: "confunde_suma_con_avance_indice", hint: "Esa operación representa el avance del índice en C, no la suma que hace ADD AX, word [SI]." }
        ]
      }
    ];

export const loopAccumulatorExercise: Exercise = {
  id: 'loop_accumulator_06',
  moduleId: 'mod_loop',
  order: 6,
  title: 'Ejercicio 6 · Bucle con acumulador',
  subtitle: 'LOOP, CX, SI y arreglo DW · 8086',
  description: 'Predice cómo se acumulan palabras de un arreglo usando AX, SI y CX.',
  estimatedMinutes: 14,
  initialRegisters: {
  "AX": "0000",
  "CX": "0000",
  "SI": "0000",
  "ZF": "0"
},
  initialMemory: memInitial,
  passing: {
  "canAdvance": 12.0,
  "reviewRecommended": 9.5,
  "mustRepeat": 6.0
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
  "subtitle": "Bucle, acumulador, CX y SI",
  "blocks": [
    {
      "title": "AX es el acumulador",
      "body": "AX conserva la suma parcial y recibe cada nuevo valor leído desde el arreglo.",
      "code": "ARR = 0002, 0003, 0004, 0001\n\nAX final:\n0002 + 0003 + 0004 + 0001 = 000A"
    },
    {
      "title": "CX controla el ciclo",
      "body": "LOOP decrementa CX y salta mientras CX no sea cero.",
      "code": "LOOP ciclo\n\n1. CX = CX - 1\n2. Si CX != 0, salta a ciclo"
    },
    {
      "title": "SI avanza de dos en dos",
      "body": "Como el arreglo usa DW, cada elemento ocupa 2 bytes.",
      "code": "ARR[0] @0000\nARR[1] @0002\nARR[2] @0004\nARR[3] @0006\n\nADD SI, 2"
    }
  ],
  "quickQuestion": {
    "id": "review_loop_si_06",
    "prompt": "Si SI = 0002 y el arreglo usa DW, ¿a qué dirección debe avanzar SI para el siguiente elemento?",
    "options": [
      {
        "id": "A",
        "text": "SI = 0004",
        "correct": true
      },
      {
        "id": "B",
        "text": "SI = 0003",
        "correct": false,
        "tag": "avance_si_incorrecto_1"
      },
      {
        "id": "C",
        "text": "SI = 0002",
        "correct": false,
        "tag": "si_no_avanza"
      }
    ],
    "correctFeedback": "Como DW ocupa dos bytes, SI debe pasar de 0002 a 0004.",
    "incorrectFeedback": "En un arreglo DW, el siguiente elemento está dos bytes adelante. SI debe quedar en 0004."
  }
},
  variant: {
  "id": "variant_loop_si_06",
  "title": "Pregunta de defensa",
  "subtitle": "Tamaño de DW y avance del índice",
  "prompt": "Si el arreglo está declarado con palabras, ¿por qué el índice debe avanzar dos posiciones por elemento?",
  "instruction": "ARR: DW 0x0002\nDW 0x0003\nDW 0x0004\nDW 0x0001\n\nADD SI, 2",
  "groups": [
    {
      "id": "size",
      "label": "Cada DW ocupa:",
      "options": [
        "1 byte",
        "2 bytes",
        "4 bytes"
      ]
    },
    {
      "id": "advance",
      "label": "Por eso:",
      "options": [
        "SI debe avanzar 1",
        "SI debe avanzar 2",
        "CX debe avanzar 2"
      ]
    }
  ],
  "correctSelection": {
    "size": "2 bytes",
    "advance": "SI debe avanzar 2"
  },
  "correctFeedback": "DW ocupa 2 bytes; por eso SI debe avanzar 2 posiciones para apuntar al siguiente elemento.",
  "incorrectFeedback": "DW es una palabra de 16 bits, es decir, 2 bytes. Por eso SI debe avanzar 2."
}
};
