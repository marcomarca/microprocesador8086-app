<script lang="ts">
  import { onMount } from 'svelte';
  import type { TheoryLesson } from '../../types';
  import { createSubtitleToggle } from './subtitleToggle';

  export let theory: TheoryLesson;
  export let completed = false;
  export let onComplete: (theory: TheoryLesson) => void = () => undefined;
  export let onStartExercise: (exerciseId: string) => void = () => undefined;

  let root: HTMLDivElement;

  type Cue = {
    number: number;
    start: number;
    end: number;
    text: string;
  };

  type VisualState = {
    registers?: Record<string, string>;
    ops?: Record<string, string>;
  };

  type CueFocus = {
    slide: string;
    targets: string[];
    state?: VisualState;
  };

  const SRT_SOURCE = `1
00:00:00,000 --> 00:00:01,740
Piensa en la suma de un array en

2
00:00:01,740 --> 00:00:02,120
C.

3
00:00:02,120 --> 00:00:03,380
Lo que tenemos es,

4
00:00:03,380 --> 00:00:04,980
definimos suma igual a 0,

5
00:00:04,980 --> 00:00:07,100
iniciamos el ciclo for con un incremento que

6
00:00:07,100 --> 00:00:09,260
inicia en 0 y va a llegar hasta

7
00:00:09,260 --> 00:00:12,260
una determinada cantidad más un incremento de una

8
00:00:12,260 --> 00:00:12,800
cantidad.

9
00:00:13,200 --> 00:00:16,180
Luego definimos dentro del ciclo suma igual a

10
00:00:16,180 --> 00:00:18,700
suma más el array y el valor de

11
00:00:18,700 --> 00:00:19,320
incremento.

12
00:00:19,320 --> 00:00:21,520
Eso es lo típico para hacer un ciclo.

13
00:00:21,520 --> 00:00:24,300
Pero en el 8086 se hace de una

14
00:00:24,300 --> 00:00:25,140
forma diferente.

15
00:00:25,540 --> 00:00:29,080
Lo que se inicia primero es AX para

16
00:00:29,080 --> 00:00:29,840
la suma,

17
00:00:29,840 --> 00:00:32,500
SI para la posición actual del array y

18
00:00:32,500 --> 00:00:34,740
CX según la cantidad de vueltas.

19
00:00:34,740 --> 00:00:37,420
El array está en memoria y cada elemento

20
00:00:37,420 --> 00:00:38,520
es un DWORD,

21
00:00:38,520 --> 00:00:40,400
por eso cada elemento ocupa dos bytes.

22
00:00:40,420 --> 00:00:43,460
Primero se prepara el acumulador MOV AX,

23
00:00:43,460 --> 00:00:44,600
0H.

24
00:00:44,600 --> 00:00:46,900
Esto equivale a iniciar la suma en cero.

25
00:00:46,920 --> 00:00:49,620
Después se prepara el contador MOV CX,

26
00:00:49,620 --> 00:00:50,820
3H.

27
00:00:50,820 --> 00:00:53,440
Este valor indica cuántas veces se repite el

28
00:00:53,440 --> 00:00:53,960
ciclo.

29
00:00:53,960 --> 00:00:55,750
Luego se prepara el puntero.

30
00:00:55,750 --> 00:00:56,550
Si,

31
00:00:56,690 --> 00:00:58,610
offset tabla valores.

32
00:00:58,610 --> 00:01:01,030
Aquí si no recibe el primer dato.

33
00:01:01,030 --> 00:01:03,170
Recibe la dirección del primer dato.

34
00:01:03,170 --> 00:01:05,870
En c escribes arreglo corchetes i.

35
00:01:05,870 --> 00:01:08,710
En la 8080ic se usa una dirección.

36
00:01:08,710 --> 00:01:11,310
Por eso el dato no está en si.

37
00:01:11,310 --> 00:01:14,150
El dato está en word corchetes si.

38
00:01:14,150 --> 00:01:16,390
Ahora empieza el ciclo.

39
00:01:16,610 --> 00:01:17,590
Add a x,

40
00:01:17,590 --> 00:01:19,250
word corchetes si.

41
00:01:19,250 --> 00:01:22,950
Esta instrucción se parece a suma igual a.

42
00:01:22,950 --> 00:01:25,260
Suma más arreglo corchetes y.

43
00:01:25,360 --> 00:01:27,640
AX tiene la suma acumulada.

44
00:01:27,640 --> 00:01:30,840
Word corchetes SI lee el elemento actual del

45
00:01:30,840 --> 00:01:31,440
arreglo.

46
00:01:31,440 --> 00:01:34,140
El valor leído se suma sobre AX.

47
00:01:34,420 --> 00:01:37,160
Después hay que pasar al siguiente elemento.

48
00:01:37,160 --> 00:01:38,180
Ad SI,

49
00:01:38,180 --> 00:01:39,340
2H.

50
00:01:39,440 --> 00:01:41,800
Esto se parece al avance de I.

51
00:01:41,880 --> 00:01:43,940
Pero aquí no se suma 1.

52
00:01:43,940 --> 00:01:44,920
Se suma 2.

53
00:01:44,920 --> 00:01:47,360
Porque el arreglo está formado por palabras de

54
00:01:47,360 --> 00:01:47,840
Word.

55
00:01:47,840 --> 00:01:49,800
Cada palabra ocupa 2 bytes.

56
00:01:49,800 --> 00:01:52,180
Luego viene el control de ciclo.

57
00:01:52,180 --> 00:01:54,470
que sería loop ciclosuma.

58
00:01:54,470 --> 00:01:56,570
Loop usa CX.

59
00:01:56,570 --> 00:01:58,470
Primero le resta 1,

60
00:01:58,470 --> 00:02:01,090
después revisa si quedó en 0.

61
00:02:01,090 --> 00:02:03,390
Si CX no quedó en 0,

62
00:02:03,390 --> 00:02:04,530
vuelve a la etiqueta.

63
00:02:04,530 --> 00:02:05,270
En cambio,

64
00:02:05,270 --> 00:02:06,990
si CX quedó en 0,

65
00:02:06,990 --> 00:02:08,450
el ciclo termina.

66
00:02:08,450 --> 00:02:09,230
Entonces,

67
00:02:09,230 --> 00:02:11,450
el cuerpo del ciclo tiene tres acciones.

68
00:02:11,450 --> 00:02:13,750
Primero suma el elemento actual,

69
00:02:13,890 --> 00:02:14,890
add a X,

70
00:02:14,890 --> 00:02:16,530
word corchetes SI.

71
00:02:16,530 --> 00:02:18,990
Después avanza el puntero,

72
00:02:19,050 --> 00:02:20,490
add SI,

73
00:02:20,490 --> 00:02:21,530
2H.

74
00:02:21,530 --> 00:02:25,720
Y finalmente decide si repite loop ciclo suma.

75
00:02:25,720 --> 00:02:28,600
En la primera vuelta SI apunta al primer

76
00:02:28,600 --> 00:02:29,260
elemento.

77
00:02:29,260 --> 00:02:31,960
El elemento se suma a AX.

78
00:02:31,960 --> 00:02:34,860
Luego SI avanza al siguiente DWORD.

79
00:02:34,860 --> 00:02:37,560
Y CX queda con una vuelta menos.

80
00:02:37,720 --> 00:02:40,080
En la siguiente vuelta la instrucción es la

81
00:02:40,080 --> 00:02:40,580
misma.

82
00:02:40,580 --> 00:02:43,000
AX contiene la suma parcial.

83
00:02:43,000 --> 00:02:45,260
SI apunta al siguiente elemento.

84
00:02:45,300 --> 00:02:47,220
CX contiene una vuelta menos.

85
00:02:47,220 --> 00:02:50,200
Desde aquí el ciclo se entiende por estado.

86
00:02:50,200 --> 00:02:51,870
El ciclo se repite,

87
00:02:51,870 --> 00:02:53,950
pero los valores van a ir cambiando.

88
00:02:53,950 --> 00:02:54,870
En C,

89
00:02:54,870 --> 00:02:56,630
el cuerpo de Ford se repite,

90
00:02:56,630 --> 00:02:57,510
aquí también.

91
00:02:57,550 --> 00:03:00,450
Solo que el índice no aparece como I,

92
00:03:00,450 --> 00:03:03,130
aparece como una dirección dentro de SI.

93
00:03:03,210 --> 00:03:04,650
En cada vuelta,

94
00:03:04,650 --> 00:03:07,410
Word Corchetes SI toma el elemento actual.

95
00:03:07,410 --> 00:03:08,310
Add a X,

96
00:03:08,310 --> 00:03:11,450
Word Corchetes SI lo suma al acumulador.

97
00:03:11,450 --> 00:03:12,610
Add SI,

98
00:03:12,610 --> 00:03:15,490
2H mueve el puntero al siguiente de Word

99
00:03:15,490 --> 00:03:17,650
y Loop reduce a CX.

100
00:03:18,210 --> 00:03:20,530
Si CX no queda en 0,

101
00:03:20,530 --> 00:03:21,670
vuelve la etiqueta.

102
00:03:21,670 --> 00:03:22,230
En cambio,

103
00:03:22,230 --> 00:03:24,210
si CX por fin llega a 0,

104
00:03:24,210 --> 00:03:25,290
el ciclo termina.

105
00:03:25,290 --> 00:03:27,730
Para este ejercicio no conviene leer las instrucciones

106
00:03:27,730 --> 00:03:28,790
como texto.

107
00:03:28,930 --> 00:03:31,210
Conviene seguir la tabla de estados.

108
00:03:31,410 --> 00:03:32,370
Primero,

109
00:03:32,430 --> 00:03:33,750
¿qué valor tiene CI?

110
00:03:33,750 --> 00:03:34,310
Luego,

111
00:03:34,310 --> 00:03:36,070
¿qué palabra se lee en la palabra word

112
00:03:36,070 --> 00:03:37,150
corchetes SI?

113
00:03:37,150 --> 00:03:37,990
Después,

114
00:03:37,990 --> 00:03:40,150
¿cuánto queda en el acumulador AX?

115
00:03:40,670 --> 00:03:41,890
Al final,

116
00:03:41,890 --> 00:03:44,510
¿cuánto queda en CX después del loop?

117
00:03:44,550 --> 00:03:46,130
Cuando el ciclo termina,

118
00:03:46,130 --> 00:03:47,870
el valor importante está en AX.

119
00:03:47,870 --> 00:03:50,230
La última instrucción copia se ha acumulado a

120
00:03:50,230 --> 00:03:50,910
memoria.

121
00:03:51,210 --> 00:03:53,770
Moop word resultado final coma AX.`;

  const slideStartCue: Record<string, number> = {
    'slide-1': 1,
    'slide-2': 15,
    'slide-3': 22,
    'slide-4': 34,
    'slide-5': 47,
    'slide-6': 56,
    'slide-7': 66,
    'slide-8': 75,
    'slide-9': 80,
    'slide-10': 100,
    'slide-11': 105
  };

  const slideRanges = [
    { id: 'slide-1', start: 1, end: 14 },
    { id: 'slide-2', start: 15, end: 21 },
    { id: 'slide-3', start: 22, end: 33 },
    { id: 'slide-4', start: 34, end: 46 },
    { id: 'slide-5', start: 47, end: 55 },
    { id: 'slide-6', start: 56, end: 65 },
    { id: 'slide-7', start: 66, end: 74 },
    { id: 'slide-8', start: 75, end: 79 },
    { id: 'slide-9', start: 80, end: 99 },
    { id: 'slide-10', start: 100, end: 104 },
    { id: 'slide-11', start: 105, end: 121 }
  ];

  const slideNames: Record<string, string> = {
    'slide-1': 'C / for',
    'slide-2': 'Roles',
    'slide-3': 'Inicio',
    'slide-4': '[SI]',
    'slide-5': 'SI +2',
    'slide-6': 'LOOP',
    'slide-7': 'Cuerpo',
    'slide-8': 'Vuelta 1',
    'slide-9': 'Vuelta 2',
    'slide-10': 'Salida',
    'slide-11': 'Estados'
  };

  const cueFocus: Record<number, CueFocus> = {};

  function focus(cue: number, slide: string, targets: string[], state: VisualState = {}): void {
    cueFocus[cue] = { slide, targets, state };
  }

  function range(start: number, end: number, slide: string, targets: string[], state: VisualState = {}): void {
    for (let cue = start; cue <= end; cue += 1) {
      focus(cue, slide, targets, state);
    }
  }

range(1, 4, "slide-1", ["s1-suma", "s1-role-ax"]);
  range(5, 8, "slide-1", ["s1-for", "s1-role-cx"]);
  range(9, 12, "slide-1", ["s1-add", "s1-role-ax", "s1-role-si"]);
  range(13, 14, "slide-1", ["s1-role-ax", "s1-role-si", "s1-role-cx"]);

  range(15, 16, "slide-2", ["s2-ax"]);
  focus(17, "slide-2", ["s2-si"]);
  focus(18, "slide-2", ["s2-cx"]);
  range(19, 21, "slide-2", ["s2-mem0", "s2-mem1", "s2-mem2"]);

  range(22, 24, "slide-3", ["s3-mov-ax", "s3-reg-ax"], { registers: { AX: "0000h", CX: "----", SI: "----" } });
  range(25, 28, "slide-3", ["s3-mov-cx", "s3-reg-cx"], { registers: { AX: "0000h", CX: "0003h", SI: "----" } });
  range(29, 31, "slide-3", ["s3-mov-si", "s3-reg-si", "s3-mem0"], { registers: { AX: "0000h", CX: "0003h", SI: "0140h" } });
  range(32, 33, "slide-3", ["s3-reg-si", "s3-mem0"], { registers: { AX: "0000h", CX: "0003h", SI: "0140h" } });

  focus(34, "slide-4", ["s4-c-array"], { registers: { AX: "0000h", SI: "0140h" } });
  range(35, 37, "slide-4", ["s4-asm-word", "s4-reg-si", "s4-source", "s4-mem0"], { registers: { AX: "0000h", SI: "0140h" } });
  range(38, 40, "slide-4", ["s4-add", "s4-ax", "s4-source"], { registers: { AX: "0000h", SI: "0140h" } });
  range(41, 45, "slide-4", ["s4-source", "s4-mem0", "s4-reg-ax"], { registers: { AX: "0000h", SI: "0140h" }, ops: { sumOp: "AX = 0000h + 0005h<small>lee word [SI]</small>" } });
  focus(46, "slide-4", ["s4-op", "s4-reg-ax"], { registers: { AX: "0005h", SI: "0140h" }, ops: { sumOp: "AX = 0000h + 0005h<small>AX queda 0005h</small>" } });

  range(47, 49, "slide-5", ["s5-add", "s5-si-token", "s5-two", "s5-reg-si"], { registers: { AX: "0005h", SI: "0140h" } });
  range(50, 55, "slide-5", ["s5-reason", "s5-reg-si", "s5-mem1"], { registers: { AX: "0005h", SI: "0142h" } });

  range(56, 58, "slide-6", ["s6-loop", "s6-reg-cx"], { registers: { AX: "0005h", SI: "0142h", CX: "0003h" } });
  range(59, 60, "slide-6", ["s6-op", "s6-reg-cx"], { registers: { AX: "0005h", SI: "0142h", CX: "0002h" }, ops: { loopOp: "CX = 0003h - 0001h<small>CX queda 0002h</small>" } });
  range(61, 62, "slide-6", ["s6-taken", "s6-loop"], { registers: { AX: "0005h", SI: "0142h", CX: "0002h" } });
  range(63, 65, "slide-6", ["s6-end", "s6-reg-cx"], { registers: { AX: "0005h", SI: "0142h", CX: "0000h" }, ops: { loopOp: "CX = 0001h - 0001h<small>si queda cero, termina</small>" } });

  range(66, 68, "slide-7", ["s7-add-ax", "s7-reg-ax"], { registers: { AX: "0005h", SI: "0142h", CX: "0002h" } });
  range(69, 70, "slide-7", ["s7-add-ax", "s7-reg-ax", "s7-reg-si"], { registers: { AX: "0005h", SI: "0142h", CX: "0002h" } });
  range(71, 73, "slide-7", ["s7-add-si", "s7-reg-si"], { registers: { AX: "0005h", SI: "0144h", CX: "0002h" } });
  focus(74, "slide-7", ["s7-loop", "s7-reg-cx"], { registers: { AX: "0005h", SI: "0144h", CX: "0001h" } });

  range(75, 76, "slide-8", ["s8-reg-si", "s8-mem0", "s8-add-ax"], { registers: { AX: "0000h", SI: "0140h", CX: "0003h" } });
  focus(77, "slide-8", ["s8-op", "s8-reg-ax"], { registers: { AX: "0005h", SI: "0140h", CX: "0003h" }, ops: { turnOp: "0000h + 0005h = 0005h<small>AX queda 0005h</small>" } });
  focus(78, "slide-8", ["s8-add-si", "s8-reg-si"], { registers: { AX: "0005h", SI: "0142h", CX: "0003h" }, ops: { turnOp: "SI = 0140h + 0002h<small>SI queda 0142h</small>" } });
  focus(79, "slide-8", ["s8-loop", "s8-reg-cx"], { registers: { AX: "0005h", SI: "0142h", CX: "0002h" }, ops: { turnOp: "CX = 0003h - 0001h<small>CX queda 0002h</small>" } });

  range(80, 81, "slide-9", ["s9-add-ax", "s9-reg-si"], { registers: { AX: "0005h", SI: "0142h", CX: "0002h" } });
  focus(82, "slide-9", ["s9-reg-ax", "s9-op"], { registers: { AX: "000Ch", SI: "0142h", CX: "0002h" }, ops: { repeatOp: "0005h + 0007h = 000Ch<small>AX queda 000Ch</small>" } });
  focus(83, "slide-9", ["s9-reg-si", "s9-mem2", "s9-add-si"], { registers: { AX: "000Ch", SI: "0144h", CX: "0002h" }, ops: { repeatOp: "SI = 0142h + 0002h<small>SI queda 0144h</small>" } });
  focus(84, "slide-9", ["s9-reg-cx", "s9-loop"], { registers: { AX: "000Ch", SI: "0144h", CX: "0001h" }, ops: { repeatOp: "CX = 0002h - 0001h<small>CX queda 0001h</small>" } });
  range(85, 92, "slide-9", ["s9-reg-ax", "s9-reg-si", "s9-reg-cx"], { registers: { AX: "000Ch", SI: "0144h", CX: "0001h" } });
  range(93, 94, "slide-9", ["s9-mem2", "s9-reg-si"], { registers: { AX: "000Ch", SI: "0144h", CX: "0001h" } });
  range(95, 96, "slide-9", ["s9-add-ax", "s9-op", "s9-reg-ax"], { registers: { AX: "000Dh", SI: "0144h", CX: "0001h" }, ops: { repeatOp: "000Ch + 0001h = 000Dh<small>AX queda 000Dh</small>" } });
  range(97, 99, "slide-9", ["s9-add-si", "s9-loop", "s9-reg-si", "s9-reg-cx"], { registers: { AX: "000Dh", SI: "0146h", CX: "0000h" }, ops: { repeatOp: "SI = 0144h + 0002h · CX = 0000h<small>puntero avanza y LOOP reduce CX</small>" } });

  range(100, 101, "slide-10", ["s10-loop", "s10-reg-cx"], { registers: { AX: "000Dh", SI: "0146h", CX: "0001h" }, ops: { exitOp: "CX = 0001h - 0001h<small>evaluando LOOP</small>" } });
  range(102, 104, "slide-10", ["s10-op", "s10-not-taken", "s10-reg-cx"], { registers: { AX: "000Dh", SI: "0146h", CX: "0000h" }, ops: { exitOp: "CX = 0001h - 0001h<small>CX queda 0000h</small>" } });

  range(105, 107, "slide-11", ["s11-row1", "s11-row2", "s11-row3"], { registers: { AX: "000Dh", SI: "0146h", CX: "0000h" } });
  range(108, 110, "slide-11", ["s11-col-si", "s11-row1", "s11-row2", "s11-row3"]);
  range(111, 112, "slide-11", ["s11-col-word", "s11-row1", "s11-row2", "s11-row3"]);
  range(113, 114, "slide-11", ["s11-col-ax", "s11-reg-ax"]);
  range(115, 116, "slide-11", ["s11-col-cx", "s11-row1", "s11-row2", "s11-row3"]);
  range(117, 118, "slide-11", ["s11-reg-ax"]);
  focus(119, "slide-11", ["s11-mov-final", "s11-reg-ax", "s11-mem-before"]);
  range(120, 121, "slide-11", ["s11-mov-final", "s11-mem-after"]);

  function parseSrt(raw: string): Cue[] {
    return String(raw)
      .replace(/\r/g, '')
      .trim()
      .split(/\n\s*\n+/)
      .map((block) => {
        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
        const number = Number(lines[0]);
        const timeLine = lines[1] || '';
        const text = lines.slice(2).join(' ').trim();
        const match = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
        if (!Number.isFinite(number) || !match) return null;
        return { number, start: parseTime(match[1]), end: parseTime(match[2]), text };
      })
      .filter((cue): cue is Cue => Boolean(cue));
  }

  function parseTime(value: string): number {
    const match = value.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
    if (!match) return 0;
    return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000;
  }

  function normalizeSubtitle(text: string): string {
    return String(text)
      .replace(/\b886\b/g, '8086')
      .replace(/\b8080ic\b/gi, '8086')
      .replace(/\ben\s+la\s+8086\b/gi, 'en el 8086')
      .replace(/\bDWORD\b/gi, 'DW')
      .replace(/\b0H\b/g, '0000h')
      .replace(/\b2H\b/g, '0002h')
      .replace(/\b3H\b/g, '0003h')
      .replace(/\bmove\b/gi, 'MOV')
      .replace(/\bmuv\b/gi, 'MOV')
      .replace(/\bmup\b/gi, 'MOV')
      .replace(/\bMOOP\b/gi, 'MOV')
      .replace(/\bMoop\b/gi, 'MOV')
      .replace(/\bCMPE\b/gi, 'CMP')
      .replace(/\bAdd\b/g, 'ADD')
      .replace(/\badd\b/gi, 'ADD')
      .replace(/\bAd\s+SI\b/gi, 'ADD SI')
      .replace(/\bADD\s+a\s*X\b/gi, 'ADD AX')
      .replace(/\bA\s*X\b/gi, 'AX')
      .replace(/\bB\s*X\b/gi, 'BX')
      .replace(/\bC\s*X\b/gi, 'CX')
      .replace(/\bD\s*X\b/gi, 'DX')
      .replace(/\bCI\b/g, 'SI')
      .replace(/\bFLAC\b/gi, 'FLAGS')
      .replace(/\bFLAX\b/gi, 'FLAGS')
      .replace(/\bCash\s+Flag\b/gi, 'Carry Flag')
      .replace(/\bcarreo\b/gi, 'acarreo')
      .replace(/\bacaseo\b/gi, 'acarreo')
      .replace(/\bdesburlamiento\b/gi, 'desbordamiento')
      .replace(/Little\s+Indian/gi, 'little endian')
      .replace(/arreglo\s+corchetes\s+i/gi, 'arreglo[i]')
      .replace(/arreglo\s+corchetes\s+y/gi, 'arreglo[i]')
      .replace(/array\s+y\s+el\s+valor\s+de\s+incremento/gi, 'array[i]')
      .replace(/word\s+corchetes\s+SI/gi, 'word [SI]')
      .replace(/Word\s+Corchetes\s+SI/gi, 'word [SI]')
      .replace(/la\s+palabra\s+word\s+\[SI\]/gi, 'word [SI]')
      .replace(/corchetes\s+SI/gi, '[SI]')
      .replace(/\bloop\s+ciclosuma\b/gi, 'LOOP CICLO_SUMA')
      .replace(/\bloop\s+ciclo\s+suma\b/gi, 'LOOP CICLO_SUMA')
      .replace(/\bloop\b/gi, 'LOOP')
      .replace(/siguiente\s+de\s+Word/gi, 'siguiente DW')
      .replace(/copia\s+se\s+ha\s+acumulado/gi, 'copia ese acumulado')
      .replace(/resultado\s+final\s+coma\s+AX/gi, 'RESULTADO_FINAL, AX')
      .replace(/\bSi\s*,?$/g, 'SI,')
      .replace(/\bsi\b/g, 'si')
      .replace(/offset\s+tabla\s+valores/gi, 'offset TABLA_VALORES')
      .replace(/\s+,/g, ',')
      .replace(/\s+\./g, '.')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeHtml(value: string | number): string {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const cues = parseSrt(SRT_SOURCE);
  const fallbackDuration = cues.length ? cues[cues.length - 1].end : 0;

  function cueAt(currentTime: number): Cue | null {
    if (!cues.length) return null;
    if (currentTime <= cues[0].start) return cues[0];
    let last = cues[0];

    for (let index = 0; index < cues.length; index += 1) {
      const cue = cues[index];
      const isLastCue = index === cues.length - 1;
      if (currentTime >= cue.start && (currentTime < cue.end || (isLastCue && currentTime <= cue.end))) return cue;
      if (currentTime >= cue.start) last = cue;
    }

    return currentTime >= fallbackDuration ? cues[cues.length - 1] : last;
  }

  function slideForCue(cueNumber: number): string {
    const rangeData = slideRanges.find((item) => cueNumber >= item.start && cueNumber <= item.end);
    return rangeData ? rangeData.id : 'slide-1';
  }

  function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  }

  function setActiveSlide(rootElement: HTMLElement, slideId: string): void {
    rootElement.querySelectorAll<HTMLElement>('[data-slide]').forEach((slide) => {
      slide.classList.toggle('is-active', slide.dataset.slide === slideId);
    });
    rootElement.querySelectorAll<HTMLElement>('[data-step]').forEach((step) => {
      step.classList.toggle('is-active', step.dataset.step === slideId);
    });
    const activeButton = rootElement.querySelector<HTMLElement>(`[data-step="${slideId}"]`);
    if (activeButton) activeButton.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }

  function setHotspots(rootElement: HTMLElement, targets: string[]): void {
    const activeTargets = new Set(targets || []);
    rootElement.querySelectorAll<HTMLElement>('[data-hotspot]').forEach((node) => {
      node.classList.toggle('is-hot', activeTargets.has(node.dataset.hotspot ?? ''));
    });
  }

  function setRegister(rootElement: HTMLElement, name: string, value: string): void {
    rootElement.querySelectorAll<HTMLElement>(`[data-reg="${name}"]`).forEach((node) => {
      node.textContent = value;
    });
  }

  function setOperation(rootElement: HTMLElement, name: string, html: string): void {
    rootElement.querySelectorAll<HTMLElement>(`[data-op="${name}"]`).forEach((node) => {
      node.innerHTML = html;
    });
  }

  function applyState(rootElement: HTMLElement, state: VisualState = {}): void {
    if (state.registers) {
      Object.entries(state.registers).forEach(([registerName, value]) => setRegister(rootElement, registerName, value));
    }
    if (state.ops) {
      Object.entries(state.ops).forEach(([operationName, html]) => setOperation(rootElement, operationName, html));
    }
  }

  function setSubtitle(subtitle: HTMLElement, text: string): void {
    subtitle.innerHTML = `<span>${escapeHtml(normalizeSubtitle(text || 'Reproduciendo…'))}</span>`;
  }

  onMount(() => {
    const rootElement = root;
    const audioFile = theory.audioFile ?? 'assets/teoria6.mp3';
    let completionReported = completed;
    let rafId: number | null = null;

    function requireElement<T extends Element>(selector: string): T {
      const element = rootElement.querySelector(selector);
      if (!element) throw new Error(`No se encontró ${selector} en LoopAccumulatorTheoryScreen.`);
      return element as T;
    }

    const audio = requireElement<HTMLAudioElement>('#audio');
    const playButton = requireElement<HTMLButtonElement>('#playButton');
    const restartButton = requireElement<HTMLButtonElement>('#restartButton');
    const subtitleBtn = requireElement<HTMLButtonElement>('#subtitleBtn');
    const practiceButton = requireElement<HTMLButtonElement>('#practiceButton');
    const progressBar = requireElement<HTMLElement>('#progressBar');
    const subtitle = requireElement<HTMLElement>('#subtitle');
    const statusLine = requireElement<HTMLElement>('#statusLine');
    const audioError = requireElement<HTMLElement>('#audioError');
    const subtitleToggle = createSubtitleToggle(subtitleBtn, subtitle);

    function getDuration(): number {
      return Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : fallbackDuration;
    }

    function update(): void {
      const current = audio.currentTime || 0;
      const duration = getDuration();
      const percent = duration > 0 ? Math.min(100, Math.max(0, (current / duration) * 100)) : 0;
      progressBar.style.width = `${percent}%`;

      const activeCue = cueAt(current);
      if (!activeCue) return;

      const focusData = cueFocus[activeCue.number];
      const slideId = focusData?.slide ?? slideForCue(activeCue.number);
      setActiveSlide(rootElement, slideId);
      setHotspots(rootElement, focusData?.targets ?? []);
      applyState(rootElement, focusData?.state ?? {});
      setSubtitle(subtitle, activeCue.text);
      statusLine.textContent = `${formatTime(current)} / ${formatTime(duration)} · ${slideNames[slideId] || 'Teoría'}`;

      if (audio.ended || (duration > 0 && current >= duration - 0.05)) {
        handleFinished();
      }
    }

    function startLoop(): void {
      if (rafId !== null) cancelAnimationFrame(rafId);
      const loop = () => {
        update();
        if (!audio.paused && !audio.ended) rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }

    function reportCompletion(): void {
      if (completionReported) return;
      completionReported = true;
      onComplete(theory);
    }

    function handleFinished(): void {
      if (!audio.ended && audio.currentTime < getDuration() - 0.1) return;
      reportCompletion();
      playButton.textContent = 'Reproducir de nuevo';
      practiceButton.classList.add('is-visible');
      setActiveSlide(rootElement, 'slide-11');
      setHotspots(rootElement, ['s11-mov-final', 's11-mem-after']);
      setSubtitle(subtitle, cues[cues.length - 1]?.text || 'Clase completada.');
      statusLine.textContent = 'Clase completada.';
      progressBar.style.width = '100%';
      if (rafId !== null) cancelAnimationFrame(rafId);
    }

    function showAudioError(error?: unknown): void {
      const codes: Record<number, string> = { 1: 'MEDIA_ERR_ABORTED', 2: 'MEDIA_ERR_NETWORK', 3: 'MEDIA_ERR_DECODE', 4: 'MEDIA_ERR_SRC_NOT_SUPPORTED' };
      const mediaError = audio.error;
      const codeText = mediaError ? `${codes[mediaError.code] || 'ERROR'} (${mediaError.code})` : 'sin código';
      audioError.classList.add('is-visible');
      audioError.innerHTML = `No se pudo cargar el audio.<br>Archivo esperado: <strong>${escapeHtml(audioFile)}</strong><br>Ruta usada: <code>${escapeHtml(audio.src)}</code><br>Código de error: <strong>${escapeHtml(codeText)}</strong>.`;
      if (error) console.error(error);
    }

    async function togglePlayback(): Promise<void> {
      try {
        audioError.classList.remove('is-visible');
        if (audio.paused) {
          await audio.play();
          playButton.textContent = 'Pausar teoría';
          practiceButton.classList.remove('is-visible');
          startLoop();
        } else {
          audio.pause();
          playButton.textContent = 'Continuar teoría';
          if (rafId !== null) cancelAnimationFrame(rafId);
          update();
        }
      } catch (error) {
        showAudioError(error);
      }
    }

    function restart(): void {
      audio.pause();
      audio.currentTime = 0;
      playButton.textContent = 'Reproducir teoría';
      practiceButton.classList.remove('is-visible');
      setActiveSlide(rootElement, 'slide-1');
      setHotspots(rootElement, ['s1-suma', 's1-role-ax']);
      setSubtitle(subtitle, 'Presiona reproducir para iniciar.');
      statusLine.innerHTML = `Audio local esperado: <span class="mono">${escapeHtml(audioFile)}</span>`;
      progressBar.style.width = '0%';
      if (rafId !== null) cancelAnimationFrame(rafId);
    }

    function handlePlayClick(): void {
      if (audio.ended) {
        restart();
        void togglePlayback();
        return;
      }
      void togglePlayback();
    }

    function handlePracticeClick(): void {
      reportCompletion();
      if (theory.unlockExerciseId) onStartExercise(theory.unlockExerciseId);
    }

    function handleStepClick(event: Event): void {
      const button = event.currentTarget as HTMLElement;
      const cueNumber = slideStartCue[button.dataset.step || ''];
      const cue = cues.find((item) => item.number === cueNumber);
      if (cue) {
        try {
          audio.currentTime = cue.start + 0.03;
        } catch {
          // El navegador puede rechazar el salto antes de cargar metadata.
        }
        update();
      } else if (button.dataset.step) {
        setActiveSlide(rootElement, button.dataset.step);
      }
    }

    const loadedMetadataHandler = () => {
      audioError.classList.remove('is-visible');
      statusLine.textContent = `Audio cargado: ${formatTime(getDuration())}`;
      update();
    };
    const canPlayHandler = () => audioError.classList.remove('is-visible');
    const errorHandler = () => showAudioError(audio.error);

    audio.src = new URL(audioFile, window.location.href).href;
    audio.load();
    playButton.addEventListener('click', handlePlayClick);
    restartButton.addEventListener('click', restart);
    practiceButton.addEventListener('click', handlePracticeClick);
    const stepButtons = Array.from(rootElement.querySelectorAll<HTMLElement>('[data-step]'));
    stepButtons.forEach((button) => button.addEventListener('click', handleStepClick));
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('loadedmetadata', loadedMetadataHandler);
    audio.addEventListener('canplay', canPlayHandler);
    audio.addEventListener('ended', handleFinished);
    audio.addEventListener('error', errorHandler);

    restart();
    if (completionReported) {
      playButton.textContent = 'Reproducir de nuevo';
      practiceButton.classList.add('is-visible');
      statusLine.textContent = 'Teoría completada.';
    }

    return () => {
      audio.pause();
      if (rafId !== null) cancelAnimationFrame(rafId);
      playButton.removeEventListener('click', handlePlayClick);
      restartButton.removeEventListener('click', restart);
      subtitleToggle.destroy();
      practiceButton.removeEventListener('click', handlePracticeClick);
      stepButtons.forEach((button) => button.removeEventListener('click', handleStepClick));
      audio.removeEventListener('timeupdate', update);
      audio.removeEventListener('loadedmetadata', loadedMetadataHandler);
      audio.removeEventListener('canplay', canPlayHandler);
      audio.removeEventListener('ended', handleFinished);
      audio.removeEventListener('error', errorHandler);
    };
  });
</script>

<div class="theory-root" bind:this={root}>
  <audio id="audio" preload="metadata"></audio>
<main class="app">
  <header class="top">
    <section class="card hero">
      <div class="eyebrow">Microprocesadores · Ensamblador 8086</div>
      <h1>Teoría 6 · Bucle con acumulador</h1>
      <p class="sub">Suma de un arreglo DW usando AX, SI, CX, word [SI] y LOOP.</p>
      <div class="progress-shell"><div class="progress-bar" id="progressBar"></div></div>
      <nav aria-label="Línea de tiempo" class="timeline" id="timeline">
        <button class="time-dot is-active" data-step="slide-1" type="button">C / for</button>
        <button class="time-dot" data-step="slide-2" type="button">Roles</button>
        <button class="time-dot" data-step="slide-3" type="button">Inicio</button>
        <button class="time-dot" data-step="slide-4" type="button">[SI]</button>
        <button class="time-dot" data-step="slide-5" type="button">SI +2</button>
        <button class="time-dot" data-step="slide-6" type="button">LOOP</button>
        <button class="time-dot" data-step="slide-7" type="button">Cuerpo</button>
        <button class="time-dot" data-step="slide-8" type="button">Vuelta 1</button>
        <button class="time-dot" data-step="slide-9" type="button">Vuelta 2</button>
        <button class="time-dot" data-step="slide-10" type="button">Salida</button>
        <button class="time-dot" data-step="slide-11" type="button">Estados</button>
      </nav>
      <div class="audio-error" id="audioError"></div>
    </section>
  </header>

  <section class="slide-stage">
    <article class="card slide is-active" data-slide="slide-1">

      <div class="slide-head"><div><div class="slide-kicker">Paso 1</div><h2 class="slide-title">Suma de un <span>array</span></h2></div><div class="slide-number">1 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Idea en C</div>
          <div class="code-line c-code mono">
            <span class="token" data-hotspot="s1-suma">int suma = 0;</span><br>
            <span class="token" data-hotspot="s1-for">for (int i = 0; i &lt; 3; i++) &#123;</span><br>
            <span class="indent"><span class="token" data-hotspot="s1-add">suma = suma + array[i];</span></span><br>
            <span class="brace">&#125;</span>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Equivalentes que se buscarán en 8086</div>
          <div class="role-grid">
            <div class="role-card" data-hotspot="s1-role-ax"><div class="role-name mono">AX</div><div class="role-val mono">acumula</div><div class="role-note">suma parcial</div></div>
            <div class="role-card" data-hotspot="s1-role-si"><div class="role-name mono">SI</div><div class="role-val mono">apunta</div><div class="role-note">posición actual</div></div>
            <div class="role-card" data-hotspot="s1-role-cx"><div class="role-name mono">CX</div><div class="role-val mono">cuenta</div><div class="role-note">vueltas</div></div>
          </div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-2">
      <div class="slide-head"><div><div class="slide-kicker">Paso 2</div><h2 class="slide-title">Roles del <span>bucle</span></h2></div><div class="slide-number">2 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Registros implicados</div>
          <div class="role-grid">
            <div class="role-card" data-hotspot="s2-ax"><div class="role-name mono">AX</div><div class="role-val mono">----</div><div class="role-note">suma acumulada</div></div>
            <div class="role-card" data-hotspot="s2-si"><div class="role-name mono">SI</div><div class="role-val mono">----</div><div class="role-note">posición actual</div></div>
            <div class="role-card" data-hotspot="s2-cx"><div class="role-name mono">CX</div><div class="role-val mono">----</div><div class="role-note">vueltas</div></div>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Array DW en memoria</div>
          <div class="mem-table">
            <div class="mem-row" data-hotspot="s2-mem0"><div class="mem-left"><div class="mem-name mono">TABLA_VALORES[0]</div><div class="addr mono">@0140</div></div><div class="bytes mono"><span class="byte-chip">05</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>0005h</span></div></div>
            <div class="mem-row" data-hotspot="s2-mem1"><div class="mem-left"><div class="mem-name mono">TABLA_VALORES[1]</div><div class="addr mono">@0142</div></div><div class="bytes mono"><span class="byte-chip">07</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>0007h</span></div></div>
            <div class="mem-row" data-hotspot="s2-mem2"><div class="mem-left"><div class="mem-name mono">TABLA_VALORES[2]</div><div class="addr mono">@0144</div></div><div class="bytes mono"><span class="byte-chip">01</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>0001h</span></div></div>
          </div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-3">

      <div class="slide-head"><div><div class="slide-kicker">Paso 3</div><h2 class="slide-title">Preparar <span>estado</span></h2></div><div class="slide-number">3 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Registros</div>
          <div class="reg-grid">
            <div class="reg-card" data-hotspot="s3-reg-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" data-reg="AX">----</div><div class="reg-note">acumulador</div></div>
            <div class="reg-card" data-hotspot="s3-reg-cx"><div class="reg-name mono">CX</div><div class="reg-val mono" data-reg="CX">----</div><div class="reg-note">contador</div></div>
            <div class="reg-card" data-hotspot="s3-reg-si"><div class="reg-name mono">SI</div><div class="reg-val mono" data-reg="SI">----</div><div class="reg-note">dirección inicial</div></div>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Instrucciones activas</div>
          <div class="code-line mono">
            <span class="token" data-hotspot="s3-mov-ax">MOV AX, 0000h</span><br>
            <span class="token" data-hotspot="s3-mov-cx">MOV CX, 0003h</span><br>
            <span class="token" data-hotspot="s3-mov-si">MOV SI, offset TABLA_VALORES</span>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Dirección inicial del array</div>
          <div class="mem-table">
            <div class="mem-row" data-hotspot="s3-mem0"><div class="mem-left"><div class="mem-name mono">TABLA_VALORES[0]</div><div class="addr mono">@0140</div></div><div class="bytes mono"><span class="byte-chip">05</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>0005h</span></div></div>
          </div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-4">

      <div class="slide-head"><div><div class="slide-kicker">Paso 4</div><h2 class="slide-title"><span>word [SI]</span> lee memoria</h2></div><div class="slide-number">4 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Registros implicados</div>
          <div class="reg-grid cols-2">
            <div class="reg-card" data-hotspot="s4-reg-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" data-reg="AX">0000h</div><div class="reg-note">suma acumulada</div></div>
            <div class="reg-card" data-hotspot="s4-reg-si"><div class="reg-name mono">SI</div><div class="reg-val mono" data-reg="SI">0140h</div><div class="reg-note">dirección actual</div></div>
          </div>
        </div>
        <div class="concept-panel">
          <div class="panel-title">Referencia breve</div>
          <div class="concept-lines">
            <div class="concept-line" data-hotspot="s4-c-array"><span class="concept-label">Idea en C</span><span class="concept-code mono">suma = suma + array[i];</span></div>
            <div class="concept-line" data-hotspot="s4-asm-word"><span class="concept-label">En 8086</span>El índice se resuelve como dirección. El dato leído está en <span class="concept-code mono">word [SI]</span>, no en <span class="concept-code mono">SI</span>.</div>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Instrucción activa</div>
          <div class="code-line mono"><span class="token" data-hotspot="s4-add">ADD</span> <span class="token" data-hotspot="s4-ax">AX</span>, <span class="token" data-hotspot="s4-source">word [SI]</span></div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Memoria fuente</div>
          <div class="mem-table">
            <div class="mem-row" data-hotspot="s4-mem0"><div class="mem-left"><div class="mem-name mono">TABLA_VALORES[0]</div><div class="addr mono">@0140</div></div><div class="bytes mono"><span class="byte-chip">05</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>0005h</span></div></div>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Operación interna</div>
          <div class="op-box mono" data-hotspot="s4-op" data-op="sumOp">AX = 0000h + 0005h<small>AX queda 0005h</small></div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-5">

      <div class="slide-head"><div><div class="slide-kicker">Paso 5</div><h2 class="slide-title">Avanzar al siguiente <span>word</span></h2></div><div class="slide-number">5 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registros implicados</div><div class="reg-grid cols-2"><div class="reg-card" data-hotspot="s5-reg-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" data-reg="AX">0005h</div><div class="reg-note">permanece</div></div><div class="reg-card" data-hotspot="s5-reg-si"><div class="reg-name mono">SI</div><div class="reg-val mono" data-reg="SI">0140h</div><div class="reg-note">puntero</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono"><span class="token" data-hotspot="s5-add">ADD</span> <span class="token" data-hotspot="s5-si-token">SI</span>, <span class="token" data-hotspot="s5-two">0002h</span></div></div>
        <div class="sim-panel"><div class="panel-title">Nuevo elemento apuntado</div><div class="mem-table"><div class="mem-row" data-hotspot="s5-mem0"><div class="mem-left"><div class="mem-name mono">TABLA_VALORES[0]</div><div class="addr mono">@0140</div></div><div class="bytes mono"><span class="byte-chip">05</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>0005h</span></div></div><div class="mem-row" data-hotspot="s5-mem1"><div class="mem-left"><div class="mem-name mono">TABLA_VALORES[1]</div><div class="addr mono">@0142</div></div><div class="bytes mono"><span class="byte-chip">07</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>0007h</span></div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Razón del avance</div><div class="op-box mono" data-hotspot="s5-reason">0140h + 0002h = 0142h<small>DW / word ocupa dos bytes</small></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-6">

      <div class="slide-head"><div><div class="slide-kicker">Paso 6</div><h2 class="slide-title"><span>LOOP</span> usa CX</h2></div><div class="slide-number">6 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registros implicados</div><div class="reg-grid"><div class="reg-card" data-hotspot="s6-reg-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" data-reg="AX">0005h</div></div><div class="reg-card" data-hotspot="s6-reg-si"><div class="reg-name mono">SI</div><div class="reg-val mono" data-reg="SI">0142h</div></div><div class="reg-card" data-hotspot="s6-reg-cx"><div class="reg-name mono">CX</div><div class="reg-val mono" data-reg="CX">0003h</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono"><span class="token" data-hotspot="s6-loop">LOOP CICLO_SUMA</span></div></div>
        <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s6-op" data-op="loopOp">CX = 0003h - 0001h<small>CX queda 0002h</small></div></div>
        <div class="flow-grid"><div class="route-chip mono" data-hotspot="s6-taken">CX ≠ 0000h<span>vuelve a CICLO_SUMA</span></div><div class="route-chip mono" data-hotspot="s6-end">CX = 0000h<span>el ciclo termina</span></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-7">

      <div class="slide-head"><div><div class="slide-kicker">Paso 7</div><h2 class="slide-title">Tres acciones del <span>cuerpo</span></h2></div><div class="slide-number">7 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Estado que cambia</div><div class="reg-grid"><div class="reg-card" data-hotspot="s7-reg-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" data-reg="AX">0005h</div><div class="reg-note">suma</div></div><div class="reg-card" data-hotspot="s7-reg-si"><div class="reg-name mono">SI</div><div class="reg-val mono" data-reg="SI">0142h</div><div class="reg-note">posición</div></div><div class="reg-card" data-hotspot="s7-reg-cx"><div class="reg-name mono">CX</div><div class="reg-val mono" data-reg="CX">0002h</div><div class="reg-note">vueltas</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Código del ciclo</div><div class="code-line mono"><span class="token soft">CICLO_SUMA:</span><br><span class="token" data-hotspot="s7-add-ax">ADD AX, word [SI]</span><br><span class="token" data-hotspot="s7-add-si">ADD SI, 0002h</span><br><span class="token" data-hotspot="s7-loop">LOOP CICLO_SUMA</span></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-8">

      <div class="slide-head"><div><div class="slide-kicker">Paso 8</div><h2 class="slide-title">Primera <span>vuelta</span></h2></div><div class="slide-number">8 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registros</div><div class="reg-grid"><div class="reg-card" data-hotspot="s8-reg-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" data-reg="AX">0000h</div></div><div class="reg-card" data-hotspot="s8-reg-si"><div class="reg-name mono">SI</div><div class="reg-val mono" data-reg="SI">0140h</div></div><div class="reg-card" data-hotspot="s8-reg-cx"><div class="reg-name mono">CX</div><div class="reg-val mono" data-reg="CX">0003h</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono"><span class="token" data-hotspot="s8-add-ax">ADD AX, word [SI]</span><br><span class="token" data-hotspot="s8-add-si">ADD SI, 0002h</span><br><span class="token" data-hotspot="s8-loop">LOOP CICLO_SUMA</span></div></div>
        <div class="sim-panel"><div class="panel-title">Memoria leída</div><div class="mem-table"><div class="mem-row" data-hotspot="s8-mem0"><div class="mem-left"><div class="mem-name mono">TABLA_VALORES[0]</div><div class="addr mono">@0140</div></div><div class="bytes mono"><span class="byte-chip">05</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>0005h</span></div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s8-op" data-op="turnOp">0000h + 0005h = 0005h<small>AX queda 0005h</small></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-9">

      <div class="slide-head"><div><div class="slide-kicker">Paso 9</div><h2 class="slide-title">Mismo código, <span>otro estado</span></h2></div><div class="slide-number">9 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registros</div><div class="reg-grid"><div class="reg-card" data-hotspot="s9-reg-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" data-reg="AX">0005h</div><div class="reg-note">suma parcial</div></div><div class="reg-card" data-hotspot="s9-reg-si"><div class="reg-name mono">SI</div><div class="reg-val mono" data-reg="SI">0142h</div><div class="reg-note">siguiente elemento</div></div><div class="reg-card" data-hotspot="s9-reg-cx"><div class="reg-name mono">CX</div><div class="reg-val mono" data-reg="CX">0002h</div><div class="reg-note">vueltas</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Código que se repite</div><div class="code-line mono"><span class="token" data-hotspot="s9-add-ax">ADD AX, word [SI]</span><br><span class="token" data-hotspot="s9-add-si">ADD SI, 0002h</span><br><span class="token" data-hotspot="s9-loop">LOOP CICLO_SUMA</span></div></div>
        <div class="sim-panel"><div class="panel-title">Memoria actual</div><div class="mem-table"><div class="mem-row" data-hotspot="s9-mem1"><div class="mem-left"><div class="mem-name mono">TABLA_VALORES[1]</div><div class="addr mono">@0142</div></div><div class="bytes mono"><span class="byte-chip">07</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>0007h</span></div></div><div class="mem-row" data-hotspot="s9-mem2"><div class="mem-left"><div class="mem-name mono">TABLA_VALORES[2]</div><div class="addr mono">@0144</div></div><div class="bytes mono"><span class="byte-chip">01</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>0001h</span></div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s9-op" data-op="repeatOp">0005h + 0007h = 000Ch<small>AX queda 000Ch</small></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-10">

      <div class="slide-head"><div><div class="slide-kicker">Paso 10</div><h2 class="slide-title">Cuando <span>CX</span> llega a cero</h2></div><div class="slide-number">10 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registros</div><div class="reg-grid"><div class="reg-card" data-hotspot="s10-reg-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" data-reg="AX">000Dh</div></div><div class="reg-card" data-hotspot="s10-reg-si"><div class="reg-name mono">SI</div><div class="reg-val mono" data-reg="SI">0146h</div></div><div class="reg-card" data-hotspot="s10-reg-cx"><div class="reg-name mono">CX</div><div class="reg-val mono" data-reg="CX">0001h</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Última vuelta</div><div class="code-line mono"><span class="token" data-hotspot="s10-add-ax">ADD AX, word [SI]</span><br><span class="token" data-hotspot="s10-add-si">ADD SI, 0002h</span><br><span class="token" data-hotspot="s10-loop">LOOP CICLO_SUMA</span></div></div>
        <div class="sim-panel"><div class="panel-title">Memoria leída</div><div class="mem-table"><div class="mem-row" data-hotspot="s10-mem2"><div class="mem-left"><div class="mem-name mono">TABLA_VALORES[2]</div><div class="addr mono">@0144</div></div><div class="bytes mono"><span class="byte-chip">01</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>0001h</span></div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Resultado de flujo</div><div class="op-box mono" data-hotspot="s10-op" data-op="exitOp">CX = 0001h - 0001h<small>CX queda 0000h</small></div><div class="route-chip mono" data-hotspot="s10-not-taken" style="margin-top:8px;">CICLO_SUMA no tomado<span>continúa debajo del bucle</span></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-11">

      <div class="slide-head"><div><div class="slide-kicker">Paso 11</div><h2 class="slide-title">Tabla de <span>estados</span></h2></div><div class="slide-number">11 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Seguimiento del ciclo</div><div class="state-table">
          <div class="state-row head"><div class="state-cell">Vuelta</div><div class="state-cell" data-hotspot="s11-col-si">SI</div><div class="state-cell" data-hotspot="s11-col-word">word [SI]</div><div class="state-cell" data-hotspot="s11-col-ax">AX</div><div class="state-cell" data-hotspot="s11-col-cx">CX</div></div>
          <div class="state-row" data-hotspot="s11-row1"><div class="state-cell mono">1</div><div class="state-cell mono">0140h</div><div class="state-cell mono">0005h</div><div class="state-cell mono">0005h</div><div class="state-cell mono">0002h</div></div>
          <div class="state-row" data-hotspot="s11-row2"><div class="state-cell mono">2</div><div class="state-cell mono">0142h</div><div class="state-cell mono">0007h</div><div class="state-cell mono">000Ch</div><div class="state-cell mono">0001h</div></div>
          <div class="state-row" data-hotspot="s11-row3"><div class="state-cell mono">3</div><div class="state-cell mono">0144h</div><div class="state-cell mono">0001h</div><div class="state-cell mono">000Dh</div><div class="state-cell mono">0000h</div></div>
        </div></div>
        <div class="sim-panel"><div class="panel-title">Registro fuente</div><div class="reg-grid cols-2"><div class="reg-card" data-hotspot="s11-reg-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" data-reg="AX">000Dh</div><div class="reg-note">acumulado final</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción final</div><div class="code-line mono"><span class="token" data-hotspot="s11-mov-final">MOV word RESULTADO_FINAL, AX</span></div></div>
        <div class="sim-panel"><div class="panel-title">Memoria antes</div><div class="mem-table"><div class="mem-row" data-hotspot="s11-mem-before"><div class="mem-left"><div class="mem-name mono">RESULTADO_FINAL</div><div class="addr mono">@0146</div></div><div class="bytes mono"><span class="byte-chip">00</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>0000h</span></div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Memoria después</div><div class="mem-table"><div class="mem-row" data-hotspot="s11-mem-after"><div class="mem-left"><div class="mem-name mono">RESULTADO_FINAL</div><div class="addr mono">@0146</div></div><div class="bytes mono"><span class="byte-chip">0D</span><span class="byte-chip">00</span></div><div class="word mono"><span>word</span><span>000Dh</span></div></div></div></div>
      </div>
    </article>
  </section>
</main>

<footer class="footer-dock">
  <div class="footer-inner">
    <div class="subtitle" id="subtitle" hidden>
      <span>Presiona reproducir para iniciar.</span>
    </div>
    <div class="controls">
      <button class="primary" id="playButton" type="button">Reproducir</button>
      <button class="secondary" id="restartButton" type="button" aria-label="Reiniciar">↺</button>
      <button
        aria-label="Mostrar subtítulos"
        aria-pressed="false"
        class="secondary cc-button"
        id="subtitleBtn"
        type="button"
      >
        CC
      </button>
    </div>
    <button class="primary final-action" id="practiceButton" type="button">Iniciar práctica</button>
    <div class="status-line" id="statusLine">Audio esperado: assets/teoria6.mp3</div>
  </div>
</footer>
</div>

<style>
.theory-root {
    --bg: #0f1117;
    --bg-2: #111620;
    --panel: #181d28;
    --panel-2: #1f2532;
    --panel-3: #111722;
    --line: #2e3748;
    --line-2: #3b4659;
    --text: #f4f6fb;
    --muted: #aeb6c5;
    --soft: #d4d9e5;
    --accent: #f4c542;
    --accent-soft: rgba(244, 197, 66, .13);
    --accent-line: rgba(244, 197, 66, .72);
    --danger: #ef5350;
    --ok: #2fbf71;
    min-height: 100dvh;
    color: var(--text);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:
      radial-gradient(circle at 50% -16%, rgba(244, 197, 66, .13), transparent 34%),
      linear-gradient(180deg, var(--bg) 0%, #11151d 100%);
  }

  .theory-root, .theory-root * { box-sizing: border-box; }
  button { font: inherit; -webkit-tap-highlight-color: transparent; }
  h1, h2, p { margin: 0; }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; }

  .app {
    width: 100%;
    max-width: 500px;
    min-height: 100dvh;
    margin: 0 auto;
    padding: 12px;
    padding-bottom: 184px;
  }

  .top {
    position: sticky;
    top: 0;
    z-index: 20;
    padding-top: 4px;
    padding-bottom: 10px;
    background: rgba(15, 17, 23, .94);
    backdrop-filter: blur(12px);
  }

  .card {
    background: rgba(24, 29, 40, .96);
    border: 1px solid var(--line);
    border-radius: 22px;
    box-shadow: 0 16px 32px rgba(0, 0, 0, .26);
  }

  .hero { padding: 14px; }
  .eyebrow {
    color: var(--accent);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: .12em;
    text-transform: uppercase;
  }
  h1 {
    margin-top: 4px;
    font-size: 19px;
    line-height: 1.12;
    letter-spacing: -.025em;
  }
  .sub {
    margin-top: 6px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.35;
  }

  .progress-shell {
    margin-top: 12px;
    height: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: #272e3a;
  }
  .progress-bar {
    width: 0%;
    height: 100%;
    border-radius: inherit;
    background: var(--accent);
    transition: width .12s linear;
  }

  .timeline {
    display: flex;
    gap: 6px;
    margin-top: 10px;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 2px;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
  }
  .timeline::-webkit-scrollbar { display: none; }
  .time-dot {
    flex: 0 0 auto;
    min-width: 64px;
    border: 1px solid var(--line);
    background: var(--panel-2);
    color: var(--muted);
    border-radius: 12px;
    padding: 7px 6px;
    font-size: 9.5px;
    font-weight: 850;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
  }
  .time-dot:global(.is-active) {
    color: var(--accent);
    border-color: var(--accent-line);
    background: var(--accent-soft);
  }

  .audio-error {
    display: none;
    margin-top: 9px;
    padding: 10px;
    border-radius: 13px;
    background: rgba(239, 83, 80, .12);
    border: 1px solid rgba(239, 83, 80, .38);
    color: #ffd7d7;
    font-size: 12.5px;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
  .audio-error:global(.is-visible) { display: block; }

  .slide-stage { margin-top: 12px; }
  .slide {
    display: none;
    min-height: calc(100dvh - 350px);
    padding: 14px;
    overflow: hidden;
  }
  .slide:global(.is-active) { display: block; animation: enter .18s ease both; }
  @keyframes enter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .slide-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }
  .slide-kicker {
    color: var(--accent);
    font-size: 11px;
    font-weight: 950;
    letter-spacing: .12em;
    text-transform: uppercase;
  }
  .slide-title {
    margin-top: 4px;
    font-size: 21px;
    line-height: 1.06;
    font-weight: 950;
    letter-spacing: -.035em;
  }
  .slide-title span { color: var(--accent); }
  .slide-number { flex: 0 0 auto; color: var(--muted); font-size: 12px; font-weight: 900; }

  .sim-stack { display: grid; gap: 10px; }
  .sim-panel {
    border: 1px solid var(--line);
    background: rgba(32, 38, 52, .58);
    border-radius: 17px;
    padding: 10px;
  }
  .panel-title {
    color: #c7d2fe;
    font-size: 12px;
    font-weight: 850;
    margin-bottom: 8px;
  }

  [data-hotspot] {
    transition: border-color .16s ease, background .16s ease, box-shadow .16s ease, transform .16s ease, color .16s ease, opacity .16s ease;
  }
  [data-hotspot]:global(.is-hot) {
    border-color: var(--accent-line) !important;
    background-color: var(--accent-soft) !important;
    box-shadow: 0 0 0 1px rgba(244,197,66,.14), 0 0 22px rgba(244,197,66,.11);
    transform: translateY(-1px);
  }
  .token:global(.is-hot), .reg-val:global(.is-hot), .route-chip:global(.is-hot), .state-cell:global(.is-hot), .byte-chip:global(.is-hot) { color: var(--accent); }

  .code-line {
    overflow: hidden;
    width: 100%;
    border: 1px solid var(--line);
    background: var(--panel-3);
    border-radius: 15px;
    padding: 10px;
    color: var(--soft);
    font-size: clamp(15px, 4.4vw, 21px);
    line-height: 1.2;
    font-weight: 950;
    letter-spacing: -.03em;
    white-space: normal;
    word-break: break-word;
  }
  .token {
    display: inline-block;
    padding: 2px 5px;
    margin: 1px 0;
    border: 1px solid transparent;
    border-radius: 8px;
    color: var(--accent);
  }
  .token.soft { color: var(--soft); }

  .role-grid, .reg-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .reg-grid.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .reg-card, .role-card {
    min-height: 68px;
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .86);
    border-radius: 16px;
    padding: 10px;
    display: grid;
    align-content: center;
    min-width: 0;
  }
  .reg-name, .role-name { color: #c7d2fe; font-size: 12px; font-weight: 950; letter-spacing: .08em; }
  .reg-val, .role-val { margin-top: 5px; font-size: clamp(22px, 6.8vw, 31px); line-height: 1; font-weight: 950; letter-spacing: .03em; }
  .reg-note, .role-note { color: var(--muted); font-size: 11px; margin-top: 4px; font-weight: 800; }

  .op-box {
    border: 1px solid var(--line);
    background: rgba(17,23,34,.86);
    border-radius: 16px;
    padding: 12px;
    text-align: center;
    font-size: clamp(18px, 5.7vw, 26px);
    line-height: 1.12;
    font-weight: 950;
  }
  .op-box small { display: block; color: var(--muted); font-size: 11px; margin-top: 6px; font-family: system-ui, sans-serif; font-weight: 850; }

  .flow-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .route-chip {
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .86);
    border-radius: 16px;
    padding: 12px;
    font-size: clamp(15px, 4.5vw, 21px);
    font-weight: 950;
    line-height: 1.1;
  }
  .route-chip span { display: block; margin-top: 4px; color: var(--muted); font-size: 11px; font-weight: 850; font-family: system-ui, sans-serif; }

  .mem-table {
    display: grid;
    gap: 8px;
    width: 100%;
  }
  .mem-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(58px, 76px) minmax(76px, 94px);
    gap: 6px;
    align-items: center;
    width: 100%;
    min-height: 50px;
    border: 1px solid var(--line);
    background: rgba(17, 22, 32, .78);
    border-radius: 15px;
    padding: 8px;
    overflow: hidden;
  }
  .mem-left {
    min-width: 0;
    display: grid;
    gap: 2px;
  }
  .mem-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--accent);
    font-size: clamp(11px, 3.15vw, 16px);
    line-height: 1.05;
    font-weight: 950;
    letter-spacing: -.04em;
  }
  .addr {
    color: #c7d2fe;
    font-size: clamp(9px, 2.45vw, 11px);
    line-height: 1;
    font-weight: 850;
  }
  .bytes {
    min-width: 0;
    max-width: 76px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;
    overflow: hidden;
    white-space: nowrap;
    border: 1px solid var(--line);
    background: rgba(23, 28, 40, .82);
    border-radius: 13px;
    padding: 5px 4px;
    font-size: clamp(17px, 5vw, 24px);
    line-height: 1;
    font-weight: 950;
    letter-spacing: .01em;
  }
  .word {
    min-width: 0;
    max-width: 94px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    overflow: hidden;
    white-space: nowrap;
    border: 1px solid var(--line);
    background: rgba(23, 28, 40, .82);
    border-radius: 13px;
    padding: 5px 5px;
    font-size: clamp(12px, 3.4vw, 16px);
    line-height: 1;
    font-weight: 950;
  }
  .byte-chip { display: inline-block; min-width: 0; }

  .state-table {
    display: grid;
    gap: 6px;
    width: 100%;
  }
  .state-row {
    display: grid;
    grid-template-columns: .7fr 1fr 1.15fr 1fr 1fr;
    gap: 5px;
    align-items: center;
    border: 1px solid var(--line);
    background: rgba(17,23,34,.86);
    border-radius: 13px;
    padding: 7px 6px;
    min-width: 0;
  }
  .state-row.head { background: rgba(31,37,50,.82); color: #c7d2fe; font-size: 10px; letter-spacing: .06em; text-transform: uppercase; }
  .state-cell { min-width: 0; text-align: center; font-size: clamp(10px, 2.9vw, 13px); font-weight: 900; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .footer-dock {
    position: fixed;
    left: 0; right: 0; bottom: 0;
    z-index: 50;
    padding: 22px 12px 12px;
    background: linear-gradient(180deg, rgba(15,17,23,0), rgba(15,17,23,.98) 18%);
  }
  .footer-inner { width: 100%; max-width: 500px; margin: 0 auto; }
  .subtitle {
    min-height: 64px;
    padding: 11px 12px;
    border-radius: 17px;
    background: rgba(17, 20, 27, .98);
    border: 1px solid var(--line);
    box-shadow: 0 12px 24px rgba(0,0,0,.3);
    font-size: 15px;
    line-height: 1.35;
    font-weight: 760;
  }
  .controls { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; margin-top: 8px; }
  .primary, .secondary {
    min-height: 48px;
    border-radius: 14px;
    border: 1px solid var(--line);
    cursor: pointer;
    font-weight: 950;
  }
  .primary { background: var(--accent); border-color: rgba(244,197,66,.84); color: #11141b; }
  .secondary { width: 54px; background: #252c39; color: var(--text); }
  .final-action { display: none; width: 100%; margin-top: 8px; }
  .final-action:global(.is-visible) { display: block; }
  .status-line {
    margin-top: 7px;
    color: var(--muted);
    text-align: center;
    font-size: 11px;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  @media (max-width: 390px) {
    .app { padding-left: 10px; padding-right: 10px; }
    .slide { padding: 12px; }
    .role-grid, .reg-grid, .reg-grid.cols-2, .flow-grid { grid-template-columns: 1fr; }
    .reg-card, .role-card { min-height: 62px; }
  }
  @media (max-width: 380px) {
    .mem-row {
      grid-template-columns: minmax(0, 1fr) minmax(52px, 68px) minmax(70px, 86px);
      gap: 5px;
      padding: 7px;
    }
    .bytes {
      max-width: 68px;
      font-size: clamp(15px, 4.6vw, 20px);
      padding: 5px 3px;
    }
    .word {
      max-width: 86px;
      font-size: clamp(11px, 3.1vw, 14px);
      gap: 3px;
      padding: 5px 4px;
    }
    .mem-name { font-size: clamp(10px, 3vw, 14px); }
    .state-row { grid-template-columns: .6fr .9fr 1fr .8fr .8fr; gap: 3px; padding: 6px 4px; }
    .state-cell { font-size: 10px; }
  }
  @media (max-width: 340px) {
    .time-dot { min-width: 58px; font-size: 9px; }
    .code-line { font-size: 14px; }
    .reg-val, .role-val { font-size: 22px; }
  }
  @media (max-height: 720px) {
    .slide { min-height: auto; }
    .sim-panel { padding: 10px; }
    .slide-title { font-size: 20px; }
  }


  /* Corrección v2: bloques más consistentes y orden visual normalizado. */
  .code-line.c-code {
    color: var(--soft);
    font-size: clamp(13px, 3.6vw, 17px);
    line-height: 1.42;
    letter-spacing: -.035em;
  }
  .code-line.c-code .indent {
    display: inline-block;
    padding-left: 1.45em;
  }
  .code-line.c-code .brace {
    color: var(--soft);
  }
  .role-card .role-val {
    font-size: clamp(14px, 3.65vw, 19px);
    line-height: 1.05;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -.02em;
  }
  .role-card {
    min-height: 64px;
  }
  .concept-panel {
    border: 1px dashed var(--line-2);
    background: rgba(12, 16, 24, .48);
    border-radius: 17px;
    padding: 10px;
  }
  .concept-lines {
    display: grid;
    gap: 8px;
  }
  .concept-line {
    border: 1px solid rgba(46, 55, 72, .72);
    background: rgba(17, 23, 34, .50);
    border-radius: 14px;
    padding: 9px;
    color: var(--soft);
    font-size: 13px;
    line-height: 1.28;
    font-weight: 780;
  }
  .concept-label {
    display: block;
    color: var(--muted);
    font-size: 10px;
    font-weight: 950;
    letter-spacing: .1em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .concept-code {
    color: var(--accent);
    font-weight: 950;
    overflow-wrap: anywhere;
  }
  .subtitle[hidden] { display: none; }

</style>
