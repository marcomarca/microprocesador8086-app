import type { Exercise } from '../types';

const codeLines = [
      "A: DW 0x0005",
      "B: DW 0x0005",
      "R: DW 0x0000",
      "",
      "start:",
      "MOV AX, word A",
      "MOV BX, word B",
      "CMP AX, BX",
      "JZ iguales",
      "JG mayor",
      "JL menor",
      "",
      "iguales:",
      "MOV word R, 0x0001",
      "JMP fin",
      "",
      "mayor:",
      "MOV word R, 0x0002",
      "JMP fin",
      "",
      "menor:",
      "MOV word R, 0x0003",
      "",
      "fin:",
      "print reg",
      "print flags",
      "print mem 0:8"
    ];

    function getCodeLinesForStep(step) {
      const a = step.memoryBefore.find(row => row.label === "A").word;
      const b = step.memoryBefore.find(row => row.label === "B").word;

      return [
        `A: DW 0x${a}`,
        `B: DW 0x${b}`,
        "R: DW 0x0000",
        "",
        "start:",
        "MOV AX, word A",
        "MOV BX, word B",
        "CMP AX, BX",
        "JZ iguales",
        "JG mayor",
        "JL menor",
        "",
        "iguales:",
        "MOV word R, 0x0001",
        "JMP fin",
        "",
        "mayor:",
        "MOV word R, 0x0002",
        "JMP fin",
        "",
        "menor:",
        "MOV word R, 0x0003",
        "",
        "fin:",
        "print reg",
        "print flags",
        "print mem 0:8"
      ];
    }

    const flags0 = { ZF: 0, SF: 0, OF: 0, CF: 0 };

    const memEqBefore = [
      { label: "A", address: "0000", bytes: ["05", "00"], word: "0005" },
      { label: "B", address: "0002", bytes: ["05", "00"], word: "0005" },
      { label: "R", address: "0004", bytes: ["00", "00"], word: "0000" }
    ];

    const memEqAfter = [
      { label: "A", address: "0000", bytes: ["05", "00"], word: "0005" },
      { label: "B", address: "0002", bytes: ["05", "00"], word: "0005" },
      { label: "R", address: "0004", bytes: ["01", "00"], word: "0001" }
    ];

    const memGtBefore = [
      { label: "A", address: "0000", bytes: ["07", "00"], word: "0007" },
      { label: "B", address: "0002", bytes: ["05", "00"], word: "0005" },
      { label: "R", address: "0004", bytes: ["00", "00"], word: "0000" }
    ];

    const memGtAfter = [
      { label: "A", address: "0000", bytes: ["07", "00"], word: "0007" },
      { label: "B", address: "0002", bytes: ["05", "00"], word: "0005" },
      { label: "R", address: "0004", bytes: ["02", "00"], word: "0002" }
    ];

    const memLtBefore = [
      { label: "A", address: "0000", bytes: ["03", "00"], word: "0003" },
      { label: "B", address: "0002", bytes: ["05", "00"], word: "0005" },
      { label: "R", address: "0004", bytes: ["00", "00"], word: "0000" }
    ];

    const memLtAfter = [
      { label: "A", address: "0000", bytes: ["03", "00"], word: "0003" },
      { label: "B", address: "0002", bytes: ["05", "00"], word: "0005" },
      { label: "R", address: "0004", bytes: ["03", "00"], word: "0003" }
    ];

    const flowBase = {
      current: "start",
      executed: [],
      next: "CMP / salto condicional"
    };

    const rawSteps = [
      {
        id: "E5_Q1",
        step: 1,
        scenario: "Caso 1: igualdad",
        codeIndex: 7,
        title: "Comparación",
        instruction: "CMP AX, BX",
        question: "Si AX = 0005 y BX = 0005, ¿qué flags prepara CMP?",
        before: { AX: "0005", BX: "0005", R: "0000" },
        after:  { AX: "0005", BX: "0005", R: "0000" },
        flagsBefore: flags0,
        flagsAfter: { ZF: 1, SF: 0, OF: 0, CF: 0 },
        memoryBefore: memEqBefore,
        memoryAfter: memEqBefore,
        flowBefore: { current: "start", executed: [], next: "CMP AX, BX" },
        flowAfter: { current: "start", executed: ["CMP"], next: "JZ iguales" },
        changedRegs: [],
        changedFlags: ["ZF"],
        changedMem: [],
        changedFlow: [],
        correctExplain: "CMP calcula internamente AX - BX. Como 0005 - 0005 = 0000, ZF = 1. AX y BX no se modifican.",
        diagram: "CMP AX, BX\n\nInternamente:\n0005h - 0005h = 0000h\n\nResultado cero:\nZF = 1\nSF = 0\nOF = 0\nCF = 0\n\nAX y BX no cambian.",
        options: [
          { id: "A", text: "ZF = 1; AX y BX no cambian", correct: true, feedback: "Correcto. CMP prepara ZF = 1 porque los valores son iguales." },
          { id: "B", text: "AX queda 0000 y ZF = 1", correct: false, tag: "cmp_modifica_registros", hint: "CMP no guarda la resta en AX. Solo actualiza flags." },
          { id: "C", text: "ZF = 0 porque CMP no cambia flags", correct: false, tag: "cmp_no_modifica_flags", hint: "CMP sí actualiza flags. Si los valores son iguales, ZF = 1." }
        ]
      },
      {
        id: "E5_Q2",
        step: 2,
        scenario: "Caso 1: igualdad",
        codeIndex: 8,
        title: "Salto condicional",
        instruction: "JZ iguales",
        question: "Con ZF = 1, ¿el salto JZ iguales se toma?",
        before: { AX: "0005", BX: "0005", R: "0000" },
        after:  { AX: "0005", BX: "0005", R: "0000" },
        flagsBefore: { ZF: 1, SF: 0, OF: 0, CF: 0 },
        flagsAfter: { ZF: 1, SF: 0, OF: 0, CF: 0 },
        memoryBefore: memEqBefore,
        memoryAfter: memEqBefore,
        flowBefore: { current: "JZ iguales", executed: ["CMP"], next: "¿saltar a iguales?" },
        flowAfter: { current: "iguales", executed: ["CMP", "JZ tomado"], next: "MOV word R, 0001" },
        changedRegs: [],
        changedFlags: [],
        changedMem: [],
        changedFlow: ["iguales"],
        correctExplain: "JZ significa jump if zero. Usa ZF. Como ZF = 1, salta a la etiqueta iguales.",
        diagram: "JZ no compara por sí mismo.\n\nJZ mira ZF:\nZF = 1 → salto tomado\nZF = 0 → salto no tomado\n\nAquí ZF = 1, entonces va a iguales.",
        options: [
          { id: "A", text: "Sí, salta a iguales", correct: true, feedback: "Correcto. JZ se toma porque ZF = 1." },
          { id: "B", text: "No, JZ compara AX y BX otra vez", correct: false, tag: "jz_compara_por_si_mismo", hint: "JZ no compara. Solo revisa ZF preparado por una instrucción previa." },
          { id: "C", text: "No, porque AX no cambió", correct: false, tag: "jz_ignora_flags", hint: "El salto no depende de que AX cambie. Depende de ZF." }
        ]
      },
      {
        id: "E5_Q3",
        step: 3,
        scenario: "Caso 1: igualdad",
        codeIndex: 14,
        title: "Control de flujo",
        instruction: "JMP fin",
        question: "Después de escribir R = 0001 en la ruta iguales, ¿por qué se ejecuta JMP fin?",
        before: { AX: "0005", BX: "0005", R: "0001" },
        after:  { AX: "0005", BX: "0005", R: "0001" },
        flagsBefore: { ZF: 1, SF: 0, OF: 0, CF: 0 },
        flagsAfter: { ZF: 1, SF: 0, OF: 0, CF: 0 },
        memoryBefore: memEqAfter,
        memoryAfter: memEqAfter,
        flowBefore: { current: "JMP fin", executed: ["CMP", "JZ tomado", "iguales", "MOV word R, 0001"], next: "evitar caer en mayor" },
        flowAfter: { current: "fin", executed: ["CMP", "JZ tomado", "iguales", "MOV word R, 0001", "JMP fin"], next: "fin" },
        changedRegs: [],
        changedFlags: [],
        changedMem: [],
        changedFlow: ["fin"],
        correctExplain: "JMP fin corta la ruta iguales. Sin ese salto, la ejecución continuaría secuencialmente hacia la etiqueta mayor.",
        diagram: "Ruta ejecutada:\nCMP AX, BX\nJZ iguales\niguales:\nMOV word R, 0001\nJMP fin\n\nSin JMP fin, la CPU seguiría con la línea siguiente: mayor:",
        options: [
          { id: "A", text: "Para evitar caer accidentalmente en la etiqueta mayor", correct: true, feedback: "Correcto. JMP fin evita que el flujo continúe hacia la siguiente etiqueta." },
          { id: "B", text: "Para volver a ejecutar CMP AX, BX", correct: false, tag: "no_reconoce_jmp_fin", hint: "JMP fin no vuelve a comparar. Cambia el flujo hacia la etiqueta fin." },
          { id: "C", text: "Para cambiar ZF antes de salir", correct: false, tag: "salto_sin_flags_previos", hint: "JMP no modifica flags. Solo mueve la ejecución hacia otra etiqueta." }
        ]
      },
      {
        id: "E5_Q4",
        step: 4,
        scenario: "Caso 2: mayor",
        codeIndex: 7,
        title: "Comparación",
        instruction: "CMP AX, BX",
        question: "Después de CMP AX, BX con AX = 0007 y BX = 0005, ¿qué condición queda preparada para que JG mayor pueda tomarse?",
        before: { AX: "0007", BX: "0005", R: "0000" },
        after:  { AX: "0007", BX: "0005", R: "0000" },
        flagsBefore: flags0,
        flagsAfter: { ZF: 0, SF: 0, OF: 0, CF: 0 },
        memoryBefore: memGtBefore,
        memoryAfter: memGtBefore,
        flowBefore: { current: "start", executed: [], next: "CMP AX, BX" },
        flowAfter: { current: "start", executed: ["CMP"], next: "JZ iguales" },
        changedRegs: [],
        changedFlags: [],
        changedMem: [],
        changedFlow: [],
        correctExplain: "CMP evalúa AX - BX. 0007 - 0005 = 0002. Para JG con signo, la condición útil es ZF = 0 y SF = OF.",
        diagram: "CMP AX, BX\n\nInternamente:\n0007h - 0005h = 0002h\n\nFlags resultantes:\nZF = 0\nSF = 0\nOF = 0\nCF = 0\n\nCondición de JG:\nZF = 0 y SF = OF.",
        options: [
          { id: "A", text: "ZF = 0 y SF = OF", correct: true, feedback: "Correcto. Esa es la condición que permite tomar JG en comparación con signo." },
          { id: "B", text: "ZF = 1", correct: false, tag: "no_reconoce_zf_diferente", hint: "ZF = 1 solo si la resta interna de CMP da cero. Aquí 0007h - 0005h no da cero." },
          { id: "C", text: "CF = 1", correct: false, tag: "confunde_cf_con_signed", hint: "JG es un salto con signo. Para JG importan ZF, SF y OF, no CF como condición central." }
        ]
      },
      {
        id: "E5_Q5",
        step: 5,
        scenario: "Caso 2: mayor",
        codeIndex: 8,
        title: "Primer salto",
        instruction: "JZ iguales",
        question: "Con ZF = 0, ¿JZ iguales se toma?",
        before: { AX: "0007", BX: "0005", R: "0000" },
        after:  { AX: "0007", BX: "0005", R: "0000" },
        flagsBefore: { ZF: 0, SF: 0, OF: 0, CF: 0 },
        flagsAfter: { ZF: 0, SF: 0, OF: 0, CF: 0 },
        memoryBefore: memGtBefore,
        memoryAfter: memGtBefore,
        flowBefore: { current: "JZ iguales", executed: ["CMP"], next: "¿saltar a iguales?" },
        flowAfter: { current: "JG mayor", executed: ["CMP", "JZ no tomado"], next: "evaluar JG" },
        changedRegs: [],
        changedFlags: [],
        changedMem: [],
        changedFlow: ["JG mayor"],
        correctExplain: "JZ solo salta si ZF = 1. Como ZF = 0, no se toma y el flujo pasa a JG mayor.",
        diagram: "ZF = 0\n\nJZ iguales:\nrequiere ZF = 1\n\nEntonces:\nJZ no se toma.\nSiguiente instrucción: JG mayor.",
        options: [
          { id: "A", text: "No, pasa a JG mayor", correct: true, feedback: "Correcto. JZ no se toma porque ZF = 0." },
          { id: "B", text: "Sí, salta a iguales", correct: false, tag: "jz_ignora_flags", hint: "JZ requiere ZF = 1. Aquí ZF = 0." },
          { id: "C", text: "Sí, porque JZ compara AX y BX", correct: false, tag: "jz_compara_por_si_mismo", hint: "JZ no compara. Solo revisa ZF." }
        ]
      },
      {
        id: "E5_Q6",
        step: 6,
        scenario: "Caso 2: mayor",
        codeIndex: 9,
        title: "Salto mayor",
        instruction: "JG mayor",
        question: "Con ZF = 0, SF = 0 y OF = 0, ¿JG mayor se toma?",
        before: { AX: "0007", BX: "0005", R: "0000" },
        after:  { AX: "0007", BX: "0005", R: "0000" },
        flagsBefore: { ZF: 0, SF: 0, OF: 0, CF: 0 },
        flagsAfter: { ZF: 0, SF: 0, OF: 0, CF: 0 },
        memoryBefore: memGtBefore,
        memoryAfter: memGtBefore,
        flowBefore: { current: "JG mayor", executed: ["CMP", "JZ no tomado"], next: "¿saltar a mayor?" },
        flowAfter: { current: "mayor", executed: ["CMP", "JZ no tomado", "JG tomado"], next: "MOV word R, 0002" },
        changedRegs: [],
        changedFlags: [],
        changedMem: [],
        changedFlow: ["mayor"],
        correctExplain: "JG se toma para comparación con signo si ZF = 0 y SF = OF. Aquí ZF = 0 y SF = OF = 0.",
        diagram: "Condición de JG:\nZF = 0 y SF = OF\n\nAquí:\nZF = 0\nSF = 0\nOF = 0\n\nSF = OF → verdadero\nJG tomado.",
        options: [
          { id: "A", text: "Sí, salta a mayor", correct: true, feedback: "Correcto. Se cumple ZF = 0 y SF = OF." },
          { id: "B", text: "No, debe ir a menor", correct: false, tag: "invierte_mayor_menor", hint: "AX = 0007 es mayor que BX = 0005." },
          { id: "C", text: "No, porque CF decide JG", correct: false, tag: "confunde_cf_con_signed", hint: "JG/JL son saltos con signo. Para JG se usan ZF, SF y OF." }
        ]
      },
      {
        id: "E5_Q7",
        step: 7,
        scenario: "Caso 2: mayor",
        codeIndex: 18,
        title: "Control de flujo",
        instruction: "JMP fin",
        question: "Después de ejecutar la ruta mayor, ¿qué evita que también se ejecute la etiqueta menor?",
        before: { AX: "0007", BX: "0005", R: "0002" },
        after:  { AX: "0007", BX: "0005", R: "0002" },
        flagsBefore: { ZF: 0, SF: 0, OF: 0, CF: 0 },
        flagsAfter: { ZF: 0, SF: 0, OF: 0, CF: 0 },
        memoryBefore: memGtAfter,
        memoryAfter: memGtAfter,
        flowBefore: { current: "JMP fin", executed: ["CMP", "JZ no tomado", "JG tomado", "mayor", "MOV word R, 0002"], next: "evitar caer en menor" },
        flowAfter: { current: "fin", executed: ["CMP", "JZ no tomado", "JG tomado", "mayor", "MOV word R, 0002", "JMP fin"], next: "fin" },
        changedRegs: [],
        changedFlags: [],
        changedMem: [],
        changedFlow: ["fin"],
        correctExplain: "JMP fin evita la caída secuencial desde la ruta mayor hacia la etiqueta menor.",
        diagram: "Ruta mayor:\nmayor:\nMOV word R, 0002\nJMP fin\n\nEse JMP salta por encima de menor:\nmenor:\nMOV word R, 0003",
        options: [
          { id: "A", text: "JMP fin", correct: true, feedback: "Correcto. JMP fin corta la ruta mayor antes de llegar a menor." },
          { id: "B", text: "CMP AX, BX", correct: false, tag: "no_reconoce_jmp_fin", hint: "CMP ya ocurrió antes. El que evita caer en menor es el salto incondicional JMP fin." },
          { id: "C", text: "JL menor", correct: false, tag: "no_reconoce_jmp_fin", hint: "JL decide si se entra a menor desde la zona de saltos. No evita la caída después de ejecutar mayor." }
        ]
      },
      {
        id: "E5_Q8",
        step: 8,
        scenario: "Caso 3: menor",
        codeIndex: 7,
        title: "Comparación",
        instruction: "CMP AX, BX",
        question: "Nuevo caso: A = 0003 y B = 0005. ¿Qué flags son relevantes para menor con signo?",
        before: { AX: "0003", BX: "0005", R: "0000" },
        after:  { AX: "0003", BX: "0005", R: "0000" },
        flagsBefore: flags0,
        flagsAfter: { ZF: 0, SF: 1, OF: 0, CF: 1 },
        memoryBefore: memLtBefore,
        memoryAfter: memLtBefore,
        flowBefore: { current: "start", executed: [], next: "CMP AX, BX" },
        flowAfter: { current: "start", executed: ["CMP"], next: "JZ iguales" },
        changedRegs: [],
        changedFlags: ["SF", "CF"],
        changedMem: [],
        changedFlow: [],
        correctExplain: "CMP calcula AX - BX. 0003 - 0005 produce FFFEh. Para comparación con signo, SF ≠ OF indica menor.",
        diagram: "CMP AX, BX\n\nInternamente:\n0003h - 0005h = FFFEh\n\nZF = 0\nSF = 1\nOF = 0\nCF = 1\n\nPara JL:\nSF ≠ OF → verdadero.",
        options: [
          { id: "A", text: "ZF = 0, SF = 1, OF = 0", correct: true, feedback: "Correcto. Para JL importa que SF sea distinto de OF." },
          { id: "B", text: "ZF = 1 porque son distintos", correct: false, tag: "no_reconoce_zf_diferente", hint: "ZF = 1 solo cuando el resultado de la comparación es cero." },
          { id: "C", text: "Solo CF decide JL", correct: false, tag: "confunde_cf_con_signed", hint: "JL es salto con signo; depende de SF y OF." }
        ]
      },
      {
        id: "E5_Q9",
        step: 9,
        scenario: "Caso 3: menor",
        codeIndex: 8,
        title: "Primer salto",
        instruction: "JZ iguales",
        question: "Con ZF = 0, ¿qué ocurre con JZ iguales?",
        before: { AX: "0003", BX: "0005", R: "0000" },
        after:  { AX: "0003", BX: "0005", R: "0000" },
        flagsBefore: { ZF: 0, SF: 1, OF: 0, CF: 1 },
        flagsAfter: { ZF: 0, SF: 1, OF: 0, CF: 1 },
        memoryBefore: memLtBefore,
        memoryAfter: memLtBefore,
        flowBefore: { current: "JZ iguales", executed: ["CMP"], next: "¿saltar a iguales?" },
        flowAfter: { current: "JG mayor", executed: ["CMP", "JZ no tomado"], next: "evaluar JG" },
        changedRegs: [],
        changedFlags: [],
        changedMem: [],
        changedFlow: ["JG mayor"],
        correctExplain: "Como ZF = 0, JZ no se toma y continúa hacia JG mayor.",
        diagram: "JZ mira ZF.\n\nZF = 0 → no salta.\n\nSiguiente instrucción:\nJG mayor.",
        options: [
          { id: "A", text: "No se toma; continúa hacia JG mayor", correct: true, feedback: "Correcto. JZ no se toma porque ZF = 0." },
          { id: "B", text: "Se toma porque A y B son distintos", correct: false, tag: "jz_ignora_flags", hint: "JZ no significa diferente. JZ salta si ZF = 1." },
          { id: "C", text: "Compara A y B otra vez", correct: false, tag: "jz_compara_por_si_mismo", hint: "JZ no compara. Solo revisa ZF." }
        ]
      },
      {
        id: "E5_Q10",
        step: 10,
        scenario: "Caso 3: menor",
        codeIndex: 9,
        title: "Salto mayor",
        instruction: "JG mayor",
        question: "Con ZF = 0, SF = 1 y OF = 0, ¿JG mayor se toma?",
        before: { AX: "0003", BX: "0005", R: "0000" },
        after:  { AX: "0003", BX: "0005", R: "0000" },
        flagsBefore: { ZF: 0, SF: 1, OF: 0, CF: 1 },
        flagsAfter: { ZF: 0, SF: 1, OF: 0, CF: 1 },
        memoryBefore: memLtBefore,
        memoryAfter: memLtBefore,
        flowBefore: { current: "JG mayor", executed: ["CMP", "JZ no tomado"], next: "¿saltar a mayor?" },
        flowAfter: { current: "JL menor", executed: ["CMP", "JZ no tomado", "JG no tomado"], next: "evaluar JL" },
        changedRegs: [],
        changedFlags: [],
        changedMem: [],
        changedFlow: ["JL menor"],
        correctExplain: "JG requiere ZF = 0 y SF = OF. Aquí SF = 1 y OF = 0, por tanto SF ≠ OF. JG no se toma.",
        diagram: "Condición de JG:\nZF = 0 y SF = OF\n\nAquí:\nZF = 0\nSF = 1\nOF = 0\n\nSF ≠ OF → JG no se toma.",
        options: [
          { id: "A", text: "No, continúa hacia JL menor", correct: true, feedback: "Correcto. JG no se toma porque SF ≠ OF." },
          { id: "B", text: "Sí, salta a mayor", correct: false, tag: "invierte_mayor_menor", hint: "AX = 0003 es menor que BX = 0005." },
          { id: "C", text: "Sí, porque CF = 1 decide JG", correct: false, tag: "confunde_cf_con_signed", hint: "JG usa ZF, SF y OF; no se decide solo con CF." }
        ]
      },
      {
        id: "E5_Q11",
        step: 11,
        scenario: "Caso 3: menor",
        codeIndex: 10,
        title: "Salto menor",
        instruction: "JL menor",
        question: "Con SF = 1 y OF = 0, ¿JL menor se toma?",
        before: { AX: "0003", BX: "0005", R: "0000" },
        after:  { AX: "0003", BX: "0005", R: "0000" },
        flagsBefore: { ZF: 0, SF: 1, OF: 0, CF: 1 },
        flagsAfter: { ZF: 0, SF: 1, OF: 0, CF: 1 },
        memoryBefore: memLtBefore,
        memoryAfter: memLtBefore,
        flowBefore: { current: "JL menor", executed: ["CMP", "JZ no tomado", "JG no tomado"], next: "¿saltar a menor?" },
        flowAfter: { current: "menor", executed: ["CMP", "JZ no tomado", "JG no tomado", "JL tomado"], next: "MOV word R, 0003" },
        changedRegs: [],
        changedFlags: [],
        changedMem: [],
        changedFlow: ["menor"],
        correctExplain: "JL se toma cuando SF ≠ OF. Aquí SF = 1 y OF = 0, por tanto salta a menor.",
        diagram: "Condición de JL:\nSF ≠ OF\n\nAquí:\nSF = 1\nOF = 0\n\nSF ≠ OF → verdadero\nJL tomado.",
        options: [
          { id: "A", text: "Sí, salta a menor", correct: true, feedback: "Correcto. JL se toma porque SF ≠ OF." },
          { id: "B", text: "No, porque ZF = 0", correct: false, tag: "no_reconoce_jl", hint: "JL no requiere ZF = 1. Para menor con signo importa SF ≠ OF." },
          { id: "C", text: "No, porque CF no importa", correct: false, tag: "confunde_cf_con_signed", hint: "Que CF no sea la condición central no impide el salto. JL usa SF y OF." }
        ]
      },
      {
        id: "E5_Q12",
        step: 12,
        scenario: "Caso 3: menor",
        codeIndex: 21,
        title: "Flujo secuencial",
        instruction: "MOV word R, 0x0003",
        question: "En la etiqueta menor, después de MOV word R, 0x0003, ¿por qué no hace falta un JMP fin?",
        before: { AX: "0003", BX: "0005", R: "0000" },
        after:  { AX: "0003", BX: "0005", R: "0003" },
        flagsBefore: { ZF: 0, SF: 1, OF: 0, CF: 1 },
        flagsAfter: { ZF: 0, SF: 1, OF: 0, CF: 1 },
        memoryBefore: memLtBefore,
        memoryAfter: memLtAfter,
        flowBefore: { current: "menor", executed: ["CMP", "JZ no tomado", "JG no tomado", "JL tomado"], next: "MOV word R, 0003" },
        flowAfter: { current: "fin", executed: ["CMP", "JZ no tomado", "JG no tomado", "JL tomado", "menor", "MOV word R, 0003"], next: "fin" },
        changedRegs: ["R"],
        changedFlags: [],
        changedMem: ["R"],
        changedFlow: ["fin"],
        correctExplain: "Después del MOV, la ejecución continúa con la línea siguiente. Como fin está inmediatamente debajo de menor, no hace falta saltar.",
        diagram: "menor:\nMOV word R, 0003\n\nfin:\nprint reg\nprint flags\nprint mem 0:8\n\nComo fin está justo después, el flujo cae naturalmente ahí.",
        options: [
          { id: "A", text: "Porque fin está inmediatamente después de menor", correct: true, feedback: "Correcto. Al no haber más instrucciones intermedias, el flujo continúa directamente hacia fin." },
          { id: "B", text: "Porque JL borra las demás etiquetas", correct: false, tag: "no_reconoce_flujo_secuencial", hint: "JL no borra etiquetas. Solo decide si salta a menor; luego la CPU sigue con la instrucción siguiente." },
          { id: "C", text: "Porque MOV salta automáticamente a fin", correct: false, tag: "no_reconoce_flujo_secuencial", hint: "MOV no salta. Escribe el dato y después la ejecución continúa en la siguiente línea." }
        ]
      },
      {
        id: "E5_Q13",
        step: 13,
        scenario: "Defensa conceptual",
        codeIndex: 8,
        title: "Dependencia de flags",
        instruction: "JZ iguales",
        question: "¿Por qué JZ depende de una instrucción previa como CMP?",
        before: { AX: "0003", BX: "0005", R: "0003" },
        after:  { AX: "0003", BX: "0005", R: "0003" },
        flagsBefore: { ZF: 0, SF: 1, OF: 0, CF: 1 },
        flagsAfter: { ZF: 0, SF: 1, OF: 0, CF: 1 },
        memoryBefore: memLtAfter,
        memoryAfter: memLtAfter,
        flowBefore: { current: "JZ iguales", executed: ["CMP previo"], next: "depende de ZF" },
        flowAfter: { current: "JZ iguales", executed: ["CMP previo", "JZ usa ZF"], next: "decisión de salto" },
        changedRegs: [],
        changedFlags: [],
        changedMem: [],
        changedFlow: [],
        correctExplain: "JZ no compara operandos. Solo revisa ZF. Por eso necesita que una instrucción anterior prepare ZF.",
        diagram: "CMP AX, BX prepara flags.\n\nJZ iguales revisa ZF:\nZF = 1 → salta\nZF = 0 → no salta\n\nJZ no sabe qué son A y B.\nSolo mira el estado de ZF.",
        options: [
          { id: "A", text: "Porque JZ solo revisa ZF; no compara por sí mismo", correct: true, feedback: "Correcto. JZ depende del estado previo de ZF." },
          { id: "B", text: "Porque JZ vuelve a comparar AX y BX", correct: false, tag: "jz_compara_por_si_mismo", hint: "JZ no compara AX y BX. Solo revisa ZF." },
          { id: "C", text: "Porque JZ salta siempre a una dirección física", correct: false, tag: "cree_salto_a_direccion_fisica", hint: "En esta práctica, el salto se trabaja por etiqueta didáctica, no por dirección física." }
        ]
      }
    ];

export const conditionalJumpsExercise: Exercise = {
  id: 'conditional_jumps_05',
  moduleId: 'mod_jumps',
  order: 5,
  title: 'Ejercicio 5 · Comparación y saltos',
  subtitle: 'CMP y saltos condicionales · 8086',
  description: 'Predice el flujo de ejecución después de CMP, JZ, JG y JL.',
  estimatedMinutes: 14,
  initialRegisters: {
  "AX": "0000",
  "BX": "0000",
  "ZF": "0",
  "SF": "0",
  "OF": "0"
},
  initialMemory: undefined,
  passing: {
  "canAdvance": 11.0,
  "reviewRecommended": 8.5,
  "mustRepeat": 5.0
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
  "subtitle": "CMP y saltos condicionales",
  "blocks": [
    {
      "title": "CMP prepara flags",
      "body": "CMP calcula una resta interna y deja los flags listos para el salto.",
      "code": "CMP AX, BX\n\nCalcula internamente:\nAX - BX\n\nNo modifica AX ni BX.\nSolo actualiza flags.\n\nSi AX = BX: ZF = 1\nSi AX != BX: ZF = 0"
    },
    {
      "title": "JZ no compara",
      "body": "JZ no vuelve a comparar los registros. Solo revisa el ZF que quedó preparado antes.",
      "code": "JZ iguales\n\nZF = 1 -> salta\nZF = 0 -> no salta"
    },
    {
      "title": "JG y JL con signo",
      "body": "JG y JL interpretan la comparación como valores con signo.",
      "code": "JG mayor: salta si ZF = 0 y SF = OF\nJL menor: salta si SF != OF"
    }
  ],
  "quickQuestion": {
    "id": "review_jz_05",
    "prompt": "Si CMP dejó ZF = 1, ¿qué hace JZ iguales?",
    "options": [
      {
        "id": "A",
        "text": "Salta a iguales",
        "correct": true
      },
      {
        "id": "B",
        "text": "Compara AX y BX otra vez",
        "correct": false,
        "tag": "jz_compara_de_nuevo"
      },
      {
        "id": "C",
        "text": "Nunca salta",
        "correct": false,
        "tag": "jz_ignora_zf"
      }
    ],
    "correctFeedback": "JZ salta cuando ZF = 1.",
    "incorrectFeedback": "JZ no compara por sí mismo. Solo revisa ZF."
  }
},
  variant: {
  "id": "variant_jz_05",
  "title": "Pregunta de defensa",
  "subtitle": "JZ depende de flags anteriores",
  "prompt": "¿Por qué un JZ depende de una instrucción anterior y no compara por sí mismo?",
  "instruction": "CMP AX, BX\nJZ iguales",
  "groups": [
    {
      "id": "reason",
      "label": "JZ salta o no salta:",
      "options": [
        "porque revisa ZF",
        "porque compara AX y BX",
        "porque lee memoria"
      ]
    },
    {
      "id": "source",
      "label": "Ese ZF fue preparado por:",
      "options": [
        "CMP previo",
        "JZ mismo",
        "la etiqueta iguales"
      ]
    }
  ],
  "correctSelection": {
    "reason": "porque revisa ZF",
    "source": "CMP previo"
  },
  "correctFeedback": "JZ no compara. Solo revisa ZF, que fue preparado antes por CMP.",
  "incorrectFeedback": "JZ no compara AX y BX. Depende del ZF preparado previamente por CMP u otra instrucción que modifique flags."
}
};
