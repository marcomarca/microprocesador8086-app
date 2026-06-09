import type { Exercise } from '../types';

const codeLines = [
      "VAL: DW 0x0001",
      "",
      "start:",
      "MOV AX, 0x0001",
      "ADD AX, word VAL",
      "SUB AX, 0x0002",
      "MOV BX, 0xFFFF",
      "ADD BX, 0x0001",
      "MOV CX, 0x8000",
      "SUB CX, 0x0001",
      "INC AX",
      "DEC AX",
      "MOV AX, 0x0005",
      "MOV BX, 0x0005",
      "CMP AX, BX",
      "MOV AX, 0x007F",
      "ADD AX, 0x0001",
      "",
      "print reg",
      "print flags"
    ];

    const memInitial = [
      { label: "VAL", address: "0000", bytes: ["01", "00"], word: "0001" }
    ];

    const flags0 = { ZF: 0, CF: 0, SF: 0, OF: 0, PF: 0 };

    const rawSteps = [
      {
        id: "E4_Q1",
        step: 1,
        codeIndex: 4,
        title: "Instrucción actual",
        instruction: "ADD AX, word VAL",
        question: "Si AX = 0001 y VAL = 0001, ¿qué valor tendrá AX?",
        before: { AX: "0001", BX: "0000", CX: "0000" },
        after:  { AX: "0002", BX: "0000", CX: "0000" },
        flagsBefore: flags0,
        flagsAfter: { ZF: 0, CF: 0, SF: 0, OF: 0, PF: 0 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["AX"],
        changedFlags: [],
        correctExplain: "ADD suma el contenido de VAL al destino. 0001h + 0001h = 0002h.",
        diagram: "AX antes = 0001h\nVAL = 0001h\nADD AX, word VAL\n\nAX después = 0002h",
        options: [
          { id: "A", text: "AX = 0002", correct: true, feedback: "Correcto. ADD suma VAL al valor actual de AX." },
          { id: "B", text: "AX = 0001", correct: false, tag: "add_no_modifica_destino", hint: "ADD modifica el destino. AX debe cambiar." },
          { id: "C", text: "AX = 0000", correct: false, tag: "add_reemplaza_destino", hint: "ADD no reemplaza AX por cero; suma el operando fuente al destino." }
        ]
      },
      {
        id: "E4_Q2",
        step: 2,
        codeIndex: 4,
        title: "Flags después de ADD",
        instruction: "ADD AX, word VAL",
        question: "Después de obtener AX = 0002, ¿qué pasa con ZF?",
        before: { AX: "0001", BX: "0000", CX: "0000" },
        after:  { AX: "0002", BX: "0000", CX: "0000" },
        flagsBefore: flags0,
        flagsAfter: { ZF: 0, CF: 0, SF: 0, OF: 0, PF: 0 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["AX"],
        changedFlags: [],
        correctExplain: "ZF solo se activa si el resultado es cero. Como 0002 no es cero, ZF = 0.",
        diagram: "Resultado = 0002h\n0002h ≠ 0000h\n\nPor tanto:\nZF = 0",
        options: [
          { id: "A", text: "ZF = 0", correct: true, feedback: "Correcto. El resultado no es cero, por eso ZF queda en 0." },
          { id: "B", text: "ZF = 1", correct: false, tag: "zf_se_activa_sin_cero", hint: "ZF se activa solo cuando el resultado es 0000h." },
          { id: "C", text: "ZF no existe en operaciones ADD", correct: false, tag: "no_reconoce_zf", hint: "ADD sí actualiza flags, incluyendo ZF." }
        ]
      },
      {
        id: "E4_Q3",
        step: 3,
        codeIndex: 5,
        title: "Instrucción actual",
        instruction: "SUB AX, 0x0002",
        question: "Si AX = 0002, ¿qué valor tendrá AX después de SUB AX, 0x0002?",
        before: { AX: "0002", BX: "0000", CX: "0000" },
        after:  { AX: "0000", BX: "0000", CX: "0000" },
        flagsBefore: { ZF: 0, CF: 0, SF: 0, OF: 0, PF: 0 },
        flagsAfter: { ZF: 1, CF: 0, SF: 0, OF: 0, PF: 1 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["AX"],
        changedFlags: ["ZF", "PF"],
        correctExplain: "SUB resta el inmediato al destino. 0002h - 0002h = 0000h.",
        diagram: "AX antes = 0002h\nInmediato = 0002h\n\n0002h - 0002h = 0000h\nAX = 0000h",
        options: [
          { id: "A", text: "AX = 0000", correct: true, feedback: "Correcto. 0002h - 0002h produce cero." },
          { id: "B", text: "AX = 0002", correct: false, tag: "sub_no_modifica_destino", hint: "SUB modifica el destino. AX debe cambiar." },
          { id: "C", text: "AX = FFFE", correct: false, tag: "sub_reemplaza_destino", hint: "Aquí no se resta 0002h desde cero; se resta 0002h desde AX = 0002h." }
        ]
      },
      {
        id: "E4_Q4",
        step: 4,
        codeIndex: 5,
        title: "Flags después de resultado cero",
        instruction: "SUB AX, 0x0002",
        question: "Si el resultado fue AX = 0000, ¿qué flags quedan activos?",
        before: { AX: "0002", BX: "0000", CX: "0000" },
        after:  { AX: "0000", BX: "0000", CX: "0000" },
        flagsBefore: { ZF: 0, CF: 0, SF: 0, OF: 0, PF: 0 },
        flagsAfter: { ZF: 1, CF: 0, SF: 0, OF: 0, PF: 1 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["AX"],
        changedFlags: ["ZF", "PF"],
        correctExplain: "ZF = 1 porque el resultado es cero. PF = 1 porque el byte bajo 00h tiene cantidad par de bits en 1.",
        diagram: "Resultado = 0000h\n\nZF = 1 porque resultado = 0\nSF = 0 porque el bit más alto es 0\nCF = 0 porque no hubo préstamo\nOF = 0\nPF = 1 porque 00h tiene paridad par",
        options: [
          { id: "A", text: "ZF = 1 y PF = 1", correct: true, feedback: "Correcto. Resultado cero activa ZF; 00h tiene paridad par, por eso PF = 1." },
          { id: "B", text: "ZF = 0 y PF = 0", correct: false, tag: "no_reconoce_zf", hint: "Si el resultado es 0000h, ZF debe activarse." },
          { id: "C", text: "CF = 1 y SF = 1", correct: false, tag: "confunde_negativo_decimal", hint: "0002h - 0002h no es negativo y no requiere préstamo." }
        ]
      },
      {
        id: "E4_Q5",
        step: 5,
        codeIndex: 7,
        title: "Acarreo en 16 bits",
        instruction: "ADD BX, 0x0001",
        question: "Si BX = FFFF y se suma 0001, ¿qué valor queda en BX?",
        before: { AX: "0000", BX: "FFFF", CX: "0000" },
        after:  { AX: "0000", BX: "0000", CX: "0000" },
        flagsBefore: { ZF: 1, CF: 0, SF: 0, OF: 0, PF: 1 },
        flagsAfter: { ZF: 1, CF: 1, SF: 0, OF: 0, PF: 1 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["BX"],
        changedFlags: ["CF"],
        correctExplain: "FFFFh + 0001h = 10000h, pero en 16 bits se conserva 0000h y se activa CF.",
        diagram: "FFFFh + 0001h = 10000h\n\nRegistro de 16 bits conserva:\n0000h\n\nEl bit extra activa:\nCF = 1",
        options: [
          { id: "A", text: "BX = 0000", correct: true, feedback: "Correcto. En 16 bits, FFFFh + 1 vuelve a 0000h." },
          { id: "B", text: "BX = 10000", correct: false, tag: "no_reconoce_wraparound", hint: "BX es de 16 bits. No puede almacenar 10000h completo." },
          { id: "C", text: "BX = FFFF", correct: false, tag: "add_no_modifica_destino", hint: "ADD modifica BX. FFFFh + 1 no queda igual." }
        ]
      },
      {
        id: "E4_Q6",
        step: 6,
        codeIndex: 7,
        title: "Flag de acarreo",
        instruction: "ADD BX, 0x0001",
        question: "Después de FFFFh + 0001h, ¿qué pasa con CF?",
        before: { AX: "0000", BX: "FFFF", CX: "0000" },
        after:  { AX: "0000", BX: "0000", CX: "0000" },
        flagsBefore: { ZF: 1, CF: 0, SF: 0, OF: 0, PF: 1 },
        flagsAfter: { ZF: 1, CF: 1, SF: 0, OF: 0, PF: 1 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["BX"],
        changedFlags: ["CF"],
        correctExplain: "CF se activa porque la suma produjo acarreo fuera de los 16 bits.",
        diagram: "FFFFh + 0001h = 10000h\n\nEl resultado visible en BX es 0000h.\nEl acarreo externo activa CF.\n\nCF = 1",
        options: [
          { id: "A", text: "CF = 1", correct: true, feedback: "Correcto. Hubo acarreo fuera de los 16 bits." },
          { id: "B", text: "CF = 0", correct: false, tag: "no_reconoce_cf", hint: "El resultado excede FFFFh. Eso activa CF." },
          { id: "C", text: "OF = 1, pero CF no cambia", correct: false, tag: "confunde_cf_con_of", hint: "Aquí el punto central es el acarreo sin signo: CF = 1." }
        ]
      },
      {
        id: "E4_Q7",
        step: 7,
        codeIndex: 9,
        title: "Resultado con bit de signo",
        instruction: "SUB CX, 0x0001",
        question: "Si CX = 8000 y se resta 0001, ¿qué valor queda en CX?",
        before: { AX: "0000", BX: "0000", CX: "8000" },
        after:  { AX: "0000", BX: "0000", CX: "7FFF" },
        flagsBefore: { ZF: 1, CF: 1, SF: 0, OF: 0, PF: 1 },
        flagsAfter: { ZF: 0, CF: 0, SF: 0, OF: 1, PF: 1 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["CX"],
        changedFlags: ["ZF", "CF", "OF"],
        correctExplain: "8000h - 0001h = 7FFFh.",
        diagram: "CX antes = 8000h\nResta = 0001h\n\n8000h - 0001h = 7FFFh\nCX = 7FFFh",
        options: [
          { id: "A", text: "CX = 7FFF", correct: true, feedback: "Correcto. 8000h - 0001h = 7FFFh." },
          { id: "B", text: "CX = 8001", correct: false, tag: "sub_reemplaza_destino", hint: "SUB resta, no suma." },
          { id: "C", text: "CX = FFFF", correct: false, tag: "confunde_negativo_decimal", hint: "FFFFh sería -1 en complemento a dos, pero aquí 8000h - 1 = 7FFFh." }
        ]
      },
      {
        id: "E4_Q8",
        step: 8,
        codeIndex: 9,
        title: "Overflow con signo",
        instruction: "SUB CX, 0x0001",
        question: "En CX = 8000h - 0001h = 7FFFh, ¿qué ocurre con OF?",
        before: { AX: "0000", BX: "0000", CX: "8000" },
        after:  { AX: "0000", BX: "0000", CX: "7FFF" },
        flagsBefore: { ZF: 1, CF: 1, SF: 0, OF: 0, PF: 1 },
        flagsAfter: { ZF: 0, CF: 0, SF: 0, OF: 1, PF: 1 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["CX"],
        changedFlags: ["OF"],
        correctExplain: "8000h representa el mínimo negativo con signo. Al restar 1, el resultado pasa a 7FFFh, causando overflow con signo.",
        diagram: "Interpretación con signo de 16 bits:\n8000h = -32768\n7FFFh = +32767\n\n-32768 - 1 no cabe en 16 bits con signo.\nOF = 1",
        options: [
          { id: "A", text: "OF = 1", correct: true, feedback: "Correcto. Hay overflow con signo." },
          { id: "B", text: "OF = 0", correct: false, tag: "no_reconoce_of", hint: "En aritmética con signo, -32768 - 1 no cabe en 16 bits." },
          { id: "C", text: "CF = 1 porque OF y CF son lo mismo", correct: false, tag: "of_confunde_con_cf", hint: "OF y CF no significan lo mismo. OF es overflow con signo." }
        ]
      },
      {
        id: "E4_Q9",
        step: 9,
        codeIndex: 10,
        title: "INC y flags",
        instruction: "INC AX",
        question: "Si AX = 0000, ¿qué valor tendrá AX después de INC AX?",
        before: { AX: "0000", BX: "0000", CX: "7FFF" },
        after:  { AX: "0001", BX: "0000", CX: "7FFF" },
        flagsBefore: { ZF: 0, CF: 0, SF: 0, OF: 1, PF: 1 },
        flagsAfter: { ZF: 0, CF: 0, SF: 0, OF: 0, PF: 0 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["AX"],
        changedFlags: ["OF", "PF"],
        correctExplain: "INC incrementa el destino en 1. AX pasa de 0000h a 0001h.",
        diagram: "AX antes = 0000h\nINC AX = AX + 1\nAX después = 0001h",
        options: [
          { id: "A", text: "AX = 0001", correct: true, feedback: "Correcto. INC aumenta AX en 1." },
          { id: "B", text: "AX = 0000", correct: false, tag: "inc_no_modifica_destino", hint: "INC modifica el destino." },
          { id: "C", text: "AX = FFFF", correct: false, tag: "confunde_negativo_decimal", hint: "0000h + 1 = 0001h, no FFFFh." }
        ]
      },
      {
        id: "E4_Q10",
        step: 10,
        codeIndex: 10,
        title: "INC no modifica CF",
        instruction: "INC AX",
        question: "¿Qué ocurre con CF cuando se ejecuta INC?",
        before: { AX: "0000", BX: "0000", CX: "7FFF" },
        after:  { AX: "0001", BX: "0000", CX: "7FFF" },
        flagsBefore: { ZF: 0, CF: 0, SF: 0, OF: 1, PF: 1 },
        flagsAfter: { ZF: 0, CF: 0, SF: 0, OF: 0, PF: 0 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["AX"],
        changedFlags: ["OF", "PF"],
        correctExplain: "INC actualiza varias banderas, pero no modifica CF.",
        diagram: "INC modifica flags como ZF, SF, OF y PF según resultado.\n\nPero CF no se modifica por INC.",
        options: [
          { id: "A", text: "CF no se modifica por INC", correct: true, feedback: "Correcto. INC no modifica CF." },
          { id: "B", text: "CF siempre queda en 1", correct: false, tag: "inc_modifica_cf", hint: "INC no modifica CF." },
          { id: "C", text: "CF siempre queda en 0", correct: false, tag: "inc_modifica_cf", hint: "INC no fuerza CF a 0; simplemente no lo modifica." }
        ]
      },
      {
        id: "E4_Q11",
        step: 11,
        codeIndex: 11,
        title: "DEC y cero",
        instruction: "DEC AX",
        question: "Si AX = 0001, ¿qué valor tendrá AX después de DEC AX?",
        before: { AX: "0001", BX: "0000", CX: "7FFF" },
        after:  { AX: "0000", BX: "0000", CX: "7FFF" },
        flagsBefore: { ZF: 0, CF: 0, SF: 0, OF: 0, PF: 0 },
        flagsAfter: { ZF: 1, CF: 0, SF: 0, OF: 0, PF: 1 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["AX"],
        changedFlags: ["ZF", "PF"],
        correctExplain: "DEC decrementa el destino en 1. 0001h - 1 = 0000h.",
        diagram: "AX antes = 0001h\nDEC AX = AX - 1\nAX después = 0000h",
        options: [
          { id: "A", text: "AX = 0000", correct: true, feedback: "Correcto. DEC resta 1 al destino." },
          { id: "B", text: "AX = 0001", correct: false, tag: "inc_no_modifica_destino", hint: "DEC modifica el destino." },
          { id: "C", text: "AX = 0002", correct: false, tag: "sub_reemplaza_destino", hint: "DEC decrementa, no incrementa." }
        ]
      },
      {
        id: "E4_Q12",
        step: 12,
        codeIndex: 11,
        title: "DEC y ZF",
        instruction: "DEC AX",
        question: "Si DEC AX produjo AX = 0000, ¿qué ocurre con ZF?",
        before: { AX: "0001", BX: "0000", CX: "7FFF" },
        after:  { AX: "0000", BX: "0000", CX: "7FFF" },
        flagsBefore: { ZF: 0, CF: 0, SF: 0, OF: 0, PF: 0 },
        flagsAfter: { ZF: 1, CF: 0, SF: 0, OF: 0, PF: 1 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["AX"],
        changedFlags: ["ZF", "PF"],
        correctExplain: "ZF se activa porque el resultado es cero.",
        diagram: "Resultado = 0000h\n\nZF = 1 porque el resultado es cero.\nPF = 1 porque el byte bajo 00h tiene paridad par.",
        options: [
          { id: "A", text: "ZF = 1", correct: true, feedback: "Correcto. Resultado cero activa ZF." },
          { id: "B", text: "ZF = 0", correct: false, tag: "dec_no_reconoce_zf", hint: "Si el resultado es 0000h, ZF debe activarse." },
          { id: "C", text: "CF = 1 y ZF = 0", correct: false, tag: "dec_modifica_cf", hint: "DEC no modifica CF; el resultado cero activa ZF." }
        ]
      },
      {
        id: "E4_Q13",
        step: 13,
        codeIndex: 14,
        title: "Comparación",
        instruction: "CMP AX, BX",
        question: "Si AX = 0005 y BX = 0005, ¿qué ocurre después de CMP AX, BX?",
        before: { AX: "0005", BX: "0005", CX: "7FFF" },
        after:  { AX: "0005", BX: "0005", CX: "7FFF" },
        flagsBefore: { ZF: 1, CF: 0, SF: 0, OF: 0, PF: 1 },
        flagsAfter: { ZF: 1, CF: 0, SF: 0, OF: 0, PF: 1 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: [],
        changedFlags: ["ZF", "PF"],
        correctExplain: "CMP calcula internamente AX - BX para actualizar flags, pero no guarda la resta en AX.",
        diagram: "CMP AX, BX hace comparación interna:\nAX - BX = 0005h - 0005h = 0000h\n\nNo guarda 0000h en AX.\nAX sigue en 0005h.\nZF = 1.",
        options: [
          { id: "A", text: "AX sigue en 0005 y ZF = 1", correct: true, feedback: "Correcto. CMP no modifica AX; solo actualiza flags." },
          { id: "B", text: "AX queda en 0000 y ZF = 1", correct: false, tag: "cmp_modifica_ax", hint: "CMP no guarda la resta en AX." },
          { id: "C", text: "AX sigue en 0005 y ZF = 0", correct: false, tag: "cmp_no_modifica_flags", hint: "CMP sí modifica flags. Como AX y BX son iguales, ZF = 1." }
        ]
      },
      {
        id: "E4_Q14",
        step: 14,
        codeIndex: 14,
        title: "Error central del ejercicio",
        instruction: "CMP AX, BX",
        question: "Después de CMP AX, BX, ¿dónde queda guardada la resta?",
        before: { AX: "0005", BX: "0005", CX: "7FFF" },
        after:  { AX: "0005", BX: "0005", CX: "7FFF" },
        flagsBefore: { ZF: 1, CF: 0, SF: 0, OF: 0, PF: 1 },
        flagsAfter: { ZF: 1, CF: 0, SF: 0, OF: 0, PF: 1 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: [],
        changedFlags: ["ZF", "PF"],
        correctExplain: "La resta no queda guardada. CMP solo usa el resultado interno para actualizar flags.",
        diagram: "CMP AX, BX:\n1. Calcula internamente AX - BX.\n2. Actualiza flags.\n3. No modifica AX ni BX.\n\nLa evidencia queda en flags, no en un registro destino.",
        options: [
          { id: "A", text: "No se guarda; solo cambian flags", correct: true, feedback: "Correcto. CMP no guarda la resta; actualiza flags." },
          { id: "B", text: "Se guarda en AX", correct: false, tag: "cmp_modifica_ax", hint: "CMP no modifica AX." },
          { id: "C", text: "Se guarda en BX", correct: false, tag: "cmp_confunde_resultado", hint: "CMP tampoco modifica BX. Solo actualiza banderas." }
        ]
      },
      {
        id: "E4_Q15",
        step: 15,
        codeIndex: 16,
        title: "Overflow positivo",
        instruction: "ADD AX, 0x0001",
        question: "Si AX = 007F y se suma 0001, ¿qué valor queda en AX?",
        before: { AX: "007F", BX: "0005", CX: "7FFF" },
        after:  { AX: "0080", BX: "0005", CX: "7FFF" },
        flagsBefore: { ZF: 1, CF: 0, SF: 0, OF: 0, PF: 1 },
        flagsAfter: { ZF: 0, CF: 0, SF: 0, OF: 0, PF: 0 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["AX"],
        changedFlags: ["ZF", "PF"],
        correctExplain: "007Fh + 0001h = 0080h. En operación de 16 bits no hay overflow de signo porque el bit 15 no cambió.",
        diagram: "AX antes = 007Fh\nADD AX, 0001h\nAX después = 0080h\n\nComo estamos trabajando AX de 16 bits, el bit de signo es el bit 15.\n0080h todavía tiene bit 15 = 0.",
        options: [
          { id: "A", text: "AX = 0080", correct: true, feedback: "Correcto. 007Fh + 1 = 0080h." },
          { id: "B", text: "AX = 0000", correct: false, tag: "no_reconoce_wraparound", hint: "007Fh + 1 no desborda un registro de 16 bits." },
          { id: "C", text: "AX = 007F", correct: false, tag: "add_no_modifica_destino", hint: "ADD modifica AX." }
        ]
      },
      {
        id: "E4_Q16",
        step: 16,
        codeIndex: 16,
        title: "Paridad",
        instruction: "ADD AX, 0x0001",
        question: "Si el resultado es AX = 0080, ¿qué valor toma PF?",
        before: { AX: "007F", BX: "0005", CX: "7FFF" },
        after:  { AX: "0080", BX: "0005", CX: "7FFF" },
        flagsBefore: { ZF: 1, CF: 0, SF: 0, OF: 0, PF: 1 },
        flagsAfter: { ZF: 0, CF: 0, SF: 0, OF: 0, PF: 0 },
        memoryBefore: memInitial,
        memoryAfter: memInitial,
        changedRegs: ["AX"],
        changedFlags: ["ZF", "PF"],
        correctExplain: "PF se calcula sobre el byte bajo. En 0080h, el byte bajo es 80h, que tiene un solo bit en 1. Paridad impar: PF = 0.",
        diagram: "Resultado = 0080h\nByte bajo = 80h\n80h = 1000 0000b\nCantidad de bits en 1 = 1\n\nParidad impar → PF = 0",
        options: [
          { id: "A", text: "PF = 0", correct: true, feedback: "Correcto. 80h tiene un solo bit en 1; paridad impar." },
          { id: "B", text: "PF = 1", correct: false, tag: "pf_confunde_bits_uno", hint: "80h tiene un solo bit en 1. Eso es paridad impar." },
          { id: "C", text: "PF no depende del byte bajo", correct: false, tag: "no_reconoce_pf", hint: "PF se calcula usando el byte bajo del resultado." }
        ]
      }
    ];

export const arithmeticFlagsExercise: Exercise = {
  id: 'arithmetic_flags_04',
  moduleId: 'mod_flags',
  order: 4,
  title: 'Ejercicio 4 · Aritmética y flags',
  subtitle: 'ADD, SUB, CMP y flags básicos · 8086',
  description: 'Predice resultados y flags después de operaciones aritméticas y comparaciones.',
  estimatedMinutes: 14,
  initialRegisters: {
  "AX": "0000",
  "BX": "0000",
  "ZF": "0",
  "CF": "0",
  "SF": "0",
  "OF": "0",
  "PF": "0"
},
  initialMemory: memInitial,
  passing: {
  "canAdvance": 14.0,
  "reviewRecommended": 11.0,
  "mustRepeat": 7.0
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
  "subtitle": "Flags básicos en operaciones aritméticas",
  "blocks": [
    {
      "title": "ZF, CF, SF, OF y PF",
      "body": "Los flags resumen propiedades del resultado de la operación.",
      "code": "ZF = 1 si el resultado es cero.\nCF = 1 si hay acarreo/préstamo sin signo.\nSF = copia el bit más significativo del resultado.\nOF = 1 si hay overflow con signo.\nPF = 1 si el byte bajo tiene paridad par."
    },
    {
      "title": "CMP no guarda la resta",
      "body": "CMP calcula una resta interna, pero no modifica los operandos. Solo actualiza flags.",
      "code": "CMP AX, BX\n\nHace internamente:\nAX - BX\n\nPero no modifica AX ni BX.\nSolo actualiza flags.\n\nSi AX = 0005 y BX = 0005:\nResultado interno = 0000\nAX sigue = 0005\nZF = 1"
    }
  ],
  "quickQuestion": {
    "id": "review_cmp_flags_04",
    "prompt": "Si AX = 0003 y BX = 0003, después de CMP AX, BX, ¿qué ocurre?",
    "options": [
      {
        "id": "A",
        "text": "AX sigue 0003 y ZF = 1",
        "correct": true
      },
      {
        "id": "B",
        "text": "AX queda 0000 y ZF = 1",
        "correct": false,
        "tag": "cmp_modifica_destino"
      },
      {
        "id": "C",
        "text": "AX sigue 0003 y ZF = 0",
        "correct": false,
        "tag": "zf_no_detecta_cero"
      }
    ],
    "correctFeedback": "CMP no modifica AX; solo actualiza flags. Como son iguales, ZF = 1.",
    "incorrectFeedback": "CMP no guarda la resta. AX se conserva y ZF se activa porque la comparación da cero."
  }
},
  variant: {
  "id": "variant_cmp_flags_04",
  "title": "Pregunta de defensa",
  "subtitle": "CMP y actualización de flags",
  "prompt": "Después de CMP AX, BX, ¿dónde queda guardada la resta?",
  "instruction": "AX = 0005\nBX = 0005\n\nCMP AX, BX",
  "groups": [
    {
      "id": "storage",
      "label": "La resta:",
      "options": [
        "se guarda en AX",
        "se guarda en BX",
        "no se guarda"
      ]
    },
    {
      "id": "changes",
      "label": "Lo que cambia es:",
      "options": [
        "AX",
        "BX",
        "flags"
      ]
    }
  ],
  "correctSelection": {
    "storage": "no se guarda",
    "changes": "flags"
  },
  "correctFeedback": "CMP calcula una resta interna, no la guarda, y actualiza flags.",
  "incorrectFeedback": "CMP no guarda la resta en AX ni en BX. Solo actualiza flags."
}
};
