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

  const SRT_SOURCE = `1
00:00:00,000 --> 00:00:01,300
En lenguaje C,

2
00:00:01,300 --> 00:00:03,120
una decisión puede escribirse así.

3
00:00:03,120 --> 00:00:04,960
Si un valor es mayor que otro,

4
00:00:04,960 --> 00:00:06,000
ejecuta una ruta.

5
00:00:06,000 --> 00:00:06,820
Si es menor,

6
00:00:06,820 --> 00:00:07,660
ejecuta otra.

7
00:00:07,660 --> 00:00:08,780
Y si son iguales,

8
00:00:08,780 --> 00:00:09,940
ejecuta una tercera.

9
00:00:09,940 --> 00:00:10,780
Por ejemplo,

10
00:00:10,940 --> 00:00:13,480
if izquierda es mayor que derecha,

11
00:00:13,480 --> 00:00:15,700
entonces se ejecuta la ruta del mayor.

12
00:00:15,720 --> 00:00:16,760
En C,

13
00:00:16,760 --> 00:00:18,740
esa comparación parece una sola instrucción de alto

14
00:00:18,740 --> 00:00:19,180
nivel.

15
00:00:19,180 --> 00:00:21,200
Pero en el ensamblador,

16
00:00:21,200 --> 00:00:23,920
la CPU trabaja con pasos más pequeños.

17
00:00:23,920 --> 00:00:26,460
Primero hay que tener los valores en registros.

18
00:00:26,460 --> 00:00:28,660
Después se ejecuta CMP.

19
00:00:28,820 --> 00:00:32,860
Y recién después se usan saltos condicionales.

20
00:00:32,860 --> 00:00:35,160
CMP prepara la comparación.

21
00:00:35,200 --> 00:00:37,720
Los saltos deciden la ruta.

22
00:00:37,720 --> 00:00:40,180
Por eso una estructura parecida a un IF

23
00:00:40,180 --> 00:00:42,560
se convierte en una secuencia de instrucciones.

24
00:00:42,620 --> 00:00:44,840
MOV para cargar datos.

25
00:00:44,840 --> 00:00:46,480
CMP para comparar.

26
00:00:46,940 --> 00:00:50,240
JZ para saltar si hubo igualdad.

27
00:00:50,260 --> 00:00:53,420
JG para saltar si el primer valor fue

28
00:00:53,420 --> 00:00:53,920
mayor.

29
00:00:53,920 --> 00:00:56,860
JL para saltar si el primer valor fue

30
00:00:56,860 --> 00:00:57,340
menor.

31
00:00:57,610 --> 00:01:01,030
El código en C oculta la mecánica interna.

32
00:01:01,030 --> 00:01:03,950
El código en ensamblador muestra cada decisión en

33
00:01:03,950 --> 00:01:04,610
la CPU.

34
00:01:04,690 --> 00:01:07,730
Ahora pasemos ese código a registros reales.

35
00:01:07,730 --> 00:01:10,030
Primero cargamos un valor a CX.

36
00:01:10,030 --> 00:01:12,290
Luego cargamos otro valor a DX.

37
00:01:12,410 --> 00:01:13,790
En este ejemplo,

38
00:01:13,790 --> 00:01:15,790
CX recibe el valor de 0009h.

39
00:01:15,830 --> 00:01:18,690
DX recibe el valor de 0004h.

40
00:01:18,830 --> 00:01:22,330
Ahora la CPU ejecuta CMP CX,

41
00:01:22,330 --> 00:01:23,090
DX.

42
00:01:23,090 --> 00:01:26,190
CMP usa los dos operandos para actualizar FLAGS.

43
00:01:26,190 --> 00:01:29,740
Internamente la CPU evalúa CX menos DX.

44
00:01:29,740 --> 00:01:32,740
En este caso evalúa 0009h menos 0004h.

45
00:01:32,740 --> 00:01:35,160
El resultado interno será 0005h.

46
00:01:35,160 --> 00:01:37,400
Este resultado no se escribe en CX,

47
00:01:37,400 --> 00:01:38,760
tampoco en DX.

48
00:01:39,000 --> 00:01:40,720
CX sigue valiendo lo mismo,

49
00:01:40,720 --> 00:01:41,720
al igual que DX.

50
00:01:41,780 --> 00:01:42,780
En cambio,

51
00:01:42,780 --> 00:01:44,880
los cambios se reflejan en FLAGS.

52
00:01:45,500 --> 00:01:47,760
Si ambos son iguales,

53
00:01:47,760 --> 00:01:49,680
el resultado interno es 0.

54
00:01:49,680 --> 00:01:51,780
Entonces ZF queda en 1.

55
00:01:51,780 --> 00:01:54,100
Por eso después de CMP,

56
00:01:54,230 --> 00:01:57,130
JZ puede saltar.

57
00:01:57,130 --> 00:02:00,130
JZ significa jump if zero.

58
00:02:00,130 --> 00:02:03,350
En este contexto salta si los valores comparados

59
00:02:03,350 --> 00:02:04,450
eran iguales.

60
00:02:04,450 --> 00:02:06,230
La secuencia sería esta.

61
00:02:06,430 --> 00:02:08,370
CMP CX,

62
00:02:08,370 --> 00:02:12,510
DX JZ RUTA_IGUAL.

63
00:02:12,530 --> 00:02:15,490
Si ZF vale 1,

64
00:02:15,490 --> 00:02:17,890
la CPU salta a RUTA_IGUAL.

65
00:02:17,890 --> 00:02:20,030
Si ZF vale 0,

66
00:02:20,030 --> 00:02:22,410
continúa con la siguiente instrucción.

67
00:02:22,690 --> 00:02:25,290
Para decidir si el primer valor es mayor,

68
00:02:25,290 --> 00:02:27,810
se usa JG.

69
00:02:27,890 --> 00:02:30,990
JG significa Jump If Greater.

70
00:02:31,930 --> 00:02:34,590
JG no compara otra vez.

71
00:02:34,590 --> 00:02:38,550
JG lee los FLAGS que dejó CMP.

72
00:02:38,950 --> 00:02:41,130
Para que JG se tome,

73
00:02:41,130 --> 00:02:43,310
ZF debe valer 0.

74
00:02:43,550 --> 00:02:44,370
Además,

75
00:02:44,370 --> 00:02:48,030
SF y OF deben ser iguales.

76
00:02:48,030 --> 00:02:48,870
Entonces,

77
00:02:48,870 --> 00:02:51,570
la CPU interpretará que el primer valor es

78
00:02:51,570 --> 00:02:52,070
mayor.

79
00:02:52,070 --> 00:02:53,580
La secuencia sería esta.

80
00:02:53,800 --> 00:02:55,520
CMP CX,

81
00:02:55,520 --> 00:02:56,240
DX,

82
00:02:56,260 --> 00:02:58,540
JG RUTA_MAYOR.

83
00:02:58,540 --> 00:03:01,220
Si CX es mayor que DX,

84
00:03:01,380 --> 00:03:04,100
la ejecución salta a RUTA_MAYOR.

85
00:03:04,100 --> 00:03:06,640
Para decidir si el primer valor es menor,

86
00:03:06,640 --> 00:03:08,580
se usa JL.

87
00:03:08,740 --> 00:03:11,340
JL significa jump if less.

88
00:03:11,580 --> 00:03:14,280
JL también depende de los FLAGS anteriores.

89
00:03:14,400 --> 00:03:16,700
Para que JL se tome,

90
00:03:16,960 --> 00:03:20,220
SF debe ser distinto de OF.

91
00:03:20,310 --> 00:03:23,130
Entonces la CPU interpreta que el primer valor

92
00:03:23,130 --> 00:03:23,790
es menor.

93
00:03:23,790 --> 00:03:25,650
La secuencia sería esta.

94
00:03:25,930 --> 00:03:26,750
CMP,

95
00:03:26,750 --> 00:03:27,790
CX,

96
00:03:27,790 --> 00:03:28,550
DX,

97
00:03:28,710 --> 00:03:29,790
JL,

98
00:03:29,870 --> 00:03:30,930
RUTA_MENOR.

99
00:03:30,970 --> 00:03:33,650
Ahora juntemos las tres rutas.

100
00:03:33,870 --> 00:03:34,750
CMP,

101
00:03:35,070 --> 00:03:36,430
CX,

102
00:03:36,430 --> 00:03:37,190
DX,

103
00:03:37,570 --> 00:03:38,430
JZ,

104
00:03:38,430 --> 00:03:39,230
RUTA_IGUAL.

105
00:03:39,350 --> 00:03:40,190
JG,

106
00:03:40,190 --> 00:03:41,010
RUTA_MAYOR.

107
00:03:41,130 --> 00:03:41,950
JL,

108
00:03:41,950 --> 00:03:42,610
RUTA_MENOR.

109
00:03:42,610 --> 00:03:45,210
La CPU revisa los saltos en orden.

110
00:03:45,370 --> 00:03:46,990
Primero la igualdad,

111
00:03:46,990 --> 00:03:47,990
después mayor,

112
00:03:47,990 --> 00:03:49,130
después menor.

113
00:03:49,130 --> 00:03:51,880
Cada salto mira los mismos FLAGS.

114
00:03:51,880 --> 00:03:54,740
No hay nueva comparación en cada salto.

115
00:03:54,740 --> 00:03:57,060
La comparación ya ocurrió en CMP.

116
00:03:57,060 --> 00:04:00,620
Las etiquetas representan rutas posibles del programa.

117
00:04:00,660 --> 00:04:04,640
Pero solo debe ejecutarse la ruta que corresponde.

118
00:04:04,640 --> 00:04:09,560
Después de una ruta normalmente aparece JMP SALIDA.

119
00:04:09,680 --> 00:04:12,980
JMP es el salto incondicional.

120
00:04:12,980 --> 00:04:14,760
No revisa FLAGS,

121
00:04:14,760 --> 00:04:17,880
solo cambia el flujo hacia la etiqueta indicada.

122
00:04:17,920 --> 00:04:20,940
Esto evita que la CPU caiga en otra

123
00:04:20,940 --> 00:04:21,520
ruta.

124
00:04:21,520 --> 00:04:24,280
Las etiquetas no detienen la ejecución,

125
00:04:24,280 --> 00:04:26,640
solo marcan posiciones del código.

126
00:04:26,640 --> 00:04:27,620
Por eso,

127
00:04:27,620 --> 00:04:31,800
después de resolver una condición JMP SALIDA,

128
00:04:31,800 --> 00:04:33,280
corta el flujo.

129
00:04:33,280 --> 00:04:36,480
El método para analizar este tipo de ejercicios

130
00:04:36,480 --> 00:04:37,380
es directo.

131
00:04:37,380 --> 00:04:38,200
Primero,

132
00:04:38,200 --> 00:04:39,760
ubica el CMP.

133
00:04:39,900 --> 00:04:40,420
Segundo,

134
00:04:40,420 --> 00:04:42,140
identifica qué valores compara.

135
00:04:42,220 --> 00:04:42,940
Tercero,

136
00:04:42,940 --> 00:04:43,980
determina FLAGS.

137
00:04:44,180 --> 00:04:44,900
Cuarto,

138
00:04:44,900 --> 00:04:46,600
revisa los saltos en orden.

139
00:04:46,600 --> 00:04:47,460
Quinto,

140
00:04:47,460 --> 00:04:49,260
sigue solo la ruta tomada.

141
00:04:49,260 --> 00:04:50,220
Sexto,

142
00:04:50,220 --> 00:04:52,380
si aparece JMP SALIDA,

143
00:04:52,380 --> 00:04:54,040
corta el flujo ahí.

144
00:04:54,220 --> 00:04:56,080
La idea es,

145
00:04:56,360 --> 00:04:58,940
CMP prepara la decisión,

146
00:04:59,500 --> 00:05:01,520
JZ detecta igualdad,

147
00:05:01,520 --> 00:05:04,380
JG detecta mayor con signo,

148
00:05:04,460 --> 00:05:09,700
JL detecta menor con signo y JMP evita

149
00:05:09,700 --> 00:05:11,300
caer en otra ruta.`;

  const slideStartCue: Record<string, number> = {
    'slide-1': 1,
    'slide-2': 15,
    'slide-3': 34,
    'slide-4': 52,
    'slide-5': 67,
    'slide-6': 85,
    'slide-7': 99,
    'slide-8': 116,
    'slide-9': 118,
    'slide-10': 129,
    'slide-11': 144
  };

  const slideRanges = [
    { id: 'slide-1', start: 1, end: 14 },
    { id: 'slide-2', start: 15, end: 33 },
    { id: 'slide-3', start: 34, end: 51 },
    { id: 'slide-4', start: 52, end: 66 },
    { id: 'slide-5', start: 67, end: 84 },
    { id: 'slide-6', start: 85, end: 98 },
    { id: 'slide-7', start: 99, end: 115 },
    { id: 'slide-8', start: 116, end: 117 },
    { id: 'slide-9', start: 118, end: 128 },
    { id: 'slide-10', start: 129, end: 143 },
    { id: 'slide-11', start: 144, end: 149 }
  ];

  const slideNames: Record<string, string> = {
    'slide-1': 'C / if',
    'slide-2': '8086',
    'slide-3': 'CMP',
    'slide-4': 'JZ',
    'slide-5': 'JG',
    'slide-6': 'JL',
    'slide-7': 'Orden',
    'slide-8': 'Rutas',
    'slide-9': 'JMP',
    'slide-10': 'Método',
    'slide-11': 'Cierre'
  };

  const focusByCue: Record<number, string[]> = {
    1: ["s1-if-greater", "s1-if-less", "s1-if-eq"],
    2: ["s1-if-greater", "s1-if-less", "s1-if-eq"],
    3: ["s1-if-greater"],
    4: ["s1-if-greater"],
    5: ["s1-if-less"],
    6: ["s1-if-less"],
    7: ["s1-if-eq"],
    8: ["s1-if-eq"],
    9: ["s1-if-greater"],
    10: ["s1-if-greater"],
    11: ["s1-if-greater"],
    12: ["s1-if-greater", "s1-if-less", "s1-if-eq"],
    13: ["s1-if-greater", "s1-if-less", "s1-if-eq"],
    14: ["s1-if-greater", "s1-if-less", "s1-if-eq"],

    15: ["s2-c", "s2-asm"],
    16: ["s2-asm"],
    17: ["s2-mov"],
    18: ["s2-cmp"],
    19: ["s2-jz", "s2-jg", "s2-jl"],
    20: ["s2-map", "s2-map-cmp"],
    21: ["s2-map", "s2-map-jumps"],
    22: ["s2-c", "s2-asm"],
    23: ["s2-asm"],
    24: ["s2-mov"],
    25: ["s2-cmp"],
    26: ["s2-jz"],
    27: ["s2-jg"],
    28: ["s2-jg"],
    29: ["s2-jl"],
    30: ["s2-jl"],
    31: ["s2-c"],
    32: ["s2-asm", "s2-map"],
    33: ["s2-asm", "s2-map"],

    34: ["s3-cx", "s3-dx"],
    35: ["s3-cx"],
    36: ["s3-dx"],
    37: ["s3-cx", "s3-dx"],
    38: ["s3-cx"],
    39: ["s3-dx"],
    40: ["s3-cmp", "s3-cmp-cx", "s3-cmp-dx"],
    41: ["s3-cmp", "s3-cmp-cx", "s3-cmp-dx"],
    42: ["s3-cmp", "s3-zf", "s3-sf", "s3-of"],
    43: ["s3-op"],
    44: ["s3-op-a", "s3-op-b"],
    45: ["s3-op-r"],
    46: ["s3-cx"],
    47: ["s3-dx"],
    48: ["s3-cx"],
    49: ["s3-cx", "s3-dx"],
    50: ["s3-zf", "s3-sf", "s3-of"],
    51: ["s3-zf", "s3-sf", "s3-of"],

    52: ["s4-cx", "s4-dx"],
    53: ["s4-op", "s4-op-r"],
    54: ["s4-zf"],
    55: ["s4-cmp", "s4-jz"],
    56: ["s4-jz"],
    57: ["s4-jz"],
    58: ["s4-jz", "s4-route"],
    59: ["s4-route"],
    60: ["s4-cmp", "s4-jz"],
    61: ["s4-cmp"],
    62: ["s4-cmp", "s4-jz"],
    63: ["s4-zf", "s4-jz"],
    64: ["s4-route"],
    65: ["s4-zf"],
    66: ["s4-jz"],

    67: ["s5-jg"],
    68: ["s5-jg"],
    69: ["s5-jg"],
    70: ["s5-jg", "s5-cmp"],
    71: ["s5-zf", "s5-sf", "s5-of"],
    72: ["s5-cond-zf"],
    73: ["s5-cond-zf", "s5-zf"],
    74: ["s5-cond-sf-of"],
    75: ["s5-cond-sf-of", "s5-sf", "s5-of"],
    76: ["s5-cond-zf", "s5-cond-sf-of"],
    77: ["s5-route"],
    78: ["s5-route"],
    79: ["s5-cmp", "s5-jg"],
    80: ["s5-cmp"],
    81: ["s5-cmp"],
    82: ["s5-jg"],
    83: ["s5-cx", "s5-dx", "s5-route"],
    84: ["s5-route"],

    85: ["s6-jl"],
    86: ["s6-jl"],
    87: ["s6-jl"],
    88: ["s6-zf", "s6-sf", "s6-of"],
    89: ["s6-cond"],
    90: ["s6-cond", "s6-sf", "s6-of"],
    91: ["s6-route"],
    92: ["s6-route"],
    93: ["s6-cmp", "s6-jl"],
    94: ["s6-cmp"],
    95: ["s6-cmp"],
    96: ["s6-cmp"],
    97: ["s6-jl"],
    98: ["s6-jl", "s6-route"],

    99: ["s7-cmp", "s7-jz", "s7-jg", "s7-jl"],
    100: ["s7-cmp"],
    101: ["s7-cmp"],
    102: ["s7-cmp"],
    103: ["s7-jz"],
    104: ["s7-jz"],
    105: ["s7-jg"],
    106: ["s7-jg"],
    107: ["s7-jl"],
    108: ["s7-jl"],
    109: ["s7-order-1", "s7-order-2", "s7-order-3"],
    110: ["s7-order-1"],
    111: ["s7-order-2"],
    112: ["s7-order-3"],
    113: ["s7-rule"],
    114: ["s7-rule"],
    115: ["s7-cmp", "s7-rule"],

    116: ["s8-igual", "s8-mayor", "s8-menor"],
    117: ["s8-mayor"],

    118: ["s9-label-mayor", "s9-action", "s9-jmp"],
    119: ["s9-jmp", "s9-incond"],
    120: ["s9-no-flags"],
    121: ["s9-jmp", "s9-salida", "s9-dest"],
    122: ["s9-risk", "s9-label-menor", "s9-skip"],
    123: ["s9-risk", "s9-label-menor", "s9-skip"],
    124: ["s9-label-mayor", "s9-label-menor", "s9-salida"],
    125: ["s9-label-mayor", "s9-label-menor", "s9-salida"],
    126: ["s9-jmp", "s9-salida", "s9-dest"],
    127: ["s9-jmp", "s9-salida", "s9-dest"],
    128: ["s9-jmp", "s9-salida", "s9-dest"],

    129: ["s10-m1", "s10-m2", "s10-m3", "s10-m4", "s10-m5", "s10-m6"],
    130: ["s10-m1", "s10-m2", "s10-m3", "s10-m4", "s10-m5", "s10-m6"],
    131: ["s10-m1"],
    132: ["s10-m1"],
    133: ["s10-m2"],
    134: ["s10-m2"],
    135: ["s10-m3"],
    136: ["s10-m3"],
    137: ["s10-m4"],
    138: ["s10-m4"],
    139: ["s10-m5"],
    140: ["s10-m5"],
    141: ["s10-m6"],
    142: ["s10-m6"],
    143: ["s10-m6"],

    144: ["s11-cmp"],
    145: ["s11-cmp"],
    146: ["s11-jz"],
    147: ["s11-jg"],
    148: ["s11-jl"],
    149: ["s11-jmp"]
  };

  const LAST_END = 311.3;

  onMount(() => {
    const rootElement = root;
    const audioFile = theory.audioFile;
    let completionReported = completed;
    let rafId: number | null = null;

    function requireElement<T extends Element>(selector: string): T {
      const element = rootElement.querySelector(selector);
      if (!element) throw new Error(`No se encontró ${selector} en ConditionalJumpsTheoryScreen.`);
      return element as T;
    }

    const audio = requireElement<HTMLAudioElement>('#audio');
    const playBtn = requireElement<HTMLButtonElement>('#playBtn');
    const resetBtn = requireElement<HTMLButtonElement>('#resetBtn');
    const subtitleBtn = requireElement<HTMLButtonElement>('#subtitleBtn');
    const practiceBtn = requireElement<HTMLButtonElement>('#practiceBtn');
    const progressBar = requireElement<HTMLElement>('#progressBar');
    const subtitle = requireElement<HTMLElement>('#subtitle');
    const statusLine = requireElement<HTMLElement>('#statusLine');
    const audioError = requireElement<HTMLElement>('#audioError');
    const subtitleToggle = createSubtitleToggle(subtitleBtn, subtitle);

    const cues = parseSrt(SRT_SOURCE);
    const fallbackDuration = cues.length ? cues[cues.length - 1].end : LAST_END;

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
          return { number, start: parseTime(match[1]), end: parseTime(match[2]), text: normalizeSubtitle(text) };
        })
        .filter((cue): cue is Cue => Boolean(cue));
    }

    function parseTime(value: string): number {
      const match = value.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
      if (!match) return 0;
      return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000;
    }

    function cueAt(t: number): Cue | null {
      if (!cues.length) return null;
      if (t <= cues[0].start) return cues[0];
      let last = cues[0];

      for (let i = 0; i < cues.length; i += 1) {
        const cue = cues[i];
        const isLastCue = i === cues.length - 1;
        if (t >= cue.start && (t < cue.end || (isLastCue && t <= cue.end))) return cue;
        if (t >= cue.start) last = cue;
      }

      return t >= LAST_END ? cues[cues.length - 1] : last;
    }

    function slideForCue(cueNumber: number): string {
      const range = slideRanges.find((item) => cueNumber >= item.start && cueNumber <= item.end);
      return range ? range.id : 'slide-1';
    }

    function getDuration(): number {
      return Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : fallbackDuration;
    }

    function escapeHtml(value: string | number): string {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function normalizeSubtitle(text: string): string {
      return String(text)
        .replace(/\bMOOP\b/gi, 'MOV')
        .replace(/\bCMPE\b/gi, 'CMP')
        .replace(/\bflags\b/gi, 'FLAGS')
        .replace(/\bjump if 0\b/gi, 'jump if zero')
        .replace(/\bruta igual\b/gi, 'RUTA_IGUAL')
        .replace(/\bruta mayor\b/gi, 'RUTA_MAYOR')
        .replace(/\bruta menor\b/gi, 'RUTA_MENOR')
        .replace(/\bJMP de salida\b/gi, 'JMP SALIDA')
        .replace(/\bJMP salida\b/gi, 'JMP SALIDA')
        .replace(/\b9H\b/g, '0009h')
        .replace(/\b4H\b/g, '0004h')
        .replace(/\b5H\b/g, '0005h')
        .replace(/corte el flujo ahí/g, 'corta el flujo ahí')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function formatTime(seconds: number): string {
      if (!Number.isFinite(seconds)) return '0:00';
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${String(secs).padStart(2, '0')}`;
    }

    function setActiveSlide(slideId: string): void {
      rootElement.querySelectorAll<HTMLElement>('[data-slide]').forEach((slide) => {
        slide.classList.toggle('is-active', slide.dataset.slide === slideId);
      });
      rootElement.querySelectorAll<HTMLElement>('[data-step]').forEach((step) => {
        step.classList.toggle('is-active', step.dataset.step === slideId);
      });
      const activeButton = rootElement.querySelector<HTMLElement>(`[data-step="${slideId}"]`);
      if (activeButton) activeButton.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }

    function setHotspots(targets: string[] = [], cue?: Cue | null, currentTime = 0): void {
      let focus = targets;
      if (cue?.number === 148) {
        focus = currentTime < cue.start + 3.05 ? ['s11-jl'] : ['s11-jmp'];
      }
      const active = new Set(focus);

      rootElement.querySelectorAll<HTMLElement>('[data-hotspot]').forEach((node) => {
        const keys = String(node.dataset.hotspot ?? '').split(/\s+/).filter(Boolean);
        node.classList.toggle('is-hot', keys.some((key) => active.has(key)));
      });
    }

    function setSubtitle(text: string): void {
      subtitle.innerHTML = `<span>${escapeHtml(normalizeSubtitle(text || 'Reproduciendo…'))}</span>`;
    }

    function update(): void {
      const current = audio.currentTime || 0;
      const duration = getDuration();
      const percent = duration > 0 ? Math.min(100, Math.max(0, (current / duration) * 100)) : 0;
      progressBar.style.width = `${percent}%`;

      const activeCue = cueAt(current);
      if (!activeCue) return;

      const slideId = slideForCue(activeCue.number);
      const targets = focusByCue[activeCue.number] || [];
      setActiveSlide(slideId);
      setHotspots(targets, activeCue, current);
      setSubtitle(activeCue.text);
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

    async function togglePlayback(): Promise<void> {
      try {
        audioError.classList.remove('is-visible');
        if (audio.paused) {
          await audio.play();
          playBtn.textContent = 'Pausar teoría';
          practiceBtn.classList.remove('is-visible');
          startLoop();
        } else {
          audio.pause();
          playBtn.textContent = 'Continuar teoría';
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
      playBtn.textContent = 'Reproducir teoría';
      practiceBtn.classList.remove('is-visible');
      setActiveSlide('slide-1');
      setHotspots([]);
      setSubtitle('Presiona reproducir para iniciar.');
      statusLine.innerHTML = `Audio local esperado: <span class="mono">${escapeHtml(audioFile)}</span>`;
      progressBar.style.width = '0%';
      if (rafId !== null) cancelAnimationFrame(rafId);
    }

    function reportCompletion(): void {
      if (completionReported) return;
      completionReported = true;
      onComplete(theory);
    }

    function handleFinished(): void {
      if (!audio.ended && audio.currentTime < getDuration() - 0.1) return;
      reportCompletion();
      playBtn.textContent = 'Reproducir de nuevo';
      practiceBtn.classList.add('is-visible');
      setActiveSlide('slide-11');
      setHotspots(['s11-jmp']);
      setSubtitle(cues[cues.length - 1]?.text || 'Clase completada.');
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
      }
    }

    const loadedMetadataHandler = () => {
      audioError.classList.remove('is-visible');
      statusLine.textContent = `Audio cargado: ${formatTime(getDuration())}`;
      update();
    };
    const canPlayHandler = () => audioError.classList.remove('is-visible');

    audio.src = new URL(audioFile, window.location.href).href;
    audio.load();
    playBtn.addEventListener('click', handlePlayClick);
    resetBtn.addEventListener('click', restart);
    practiceBtn.addEventListener('click', handlePracticeClick);
    const stepButtons = Array.from(rootElement.querySelectorAll<HTMLElement>('[data-step]'));
    stepButtons.forEach((button) => button.addEventListener('click', handleStepClick));
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('loadedmetadata', loadedMetadataHandler);
    audio.addEventListener('canplay', canPlayHandler);
    audio.addEventListener('ended', handleFinished);
    audio.addEventListener('error', showAudioError);

    restart();
    if (completionReported) {
      playBtn.textContent = 'Reproducir de nuevo';
      practiceBtn.classList.add('is-visible');
      statusLine.textContent = 'Teoría completada.';
    }

    return () => {
      audio.pause();
      if (rafId !== null) cancelAnimationFrame(rafId);
      playBtn.removeEventListener('click', handlePlayClick);
      resetBtn.removeEventListener('click', restart);
      subtitleToggle.destroy();
      practiceBtn.removeEventListener('click', handlePracticeClick);
      stepButtons.forEach((button) => button.removeEventListener('click', handleStepClick));
      audio.removeEventListener('timeupdate', update);
      audio.removeEventListener('loadedmetadata', loadedMetadataHandler);
      audio.removeEventListener('canplay', canPlayHandler);
      audio.removeEventListener('ended', handleFinished);
      audio.removeEventListener('error', showAudioError);
    };
  });
</script>

<div class="theory-root" bind:this={root}>
  <audio id="audio" preload="metadata"></audio>
<main class="app">
  <header class="top">
    <section class="card hero">
      <div class="eyebrow">Microprocesadores · Ensamblador 8086</div>
      <h1>Teoría 5 · CMP, FLAGS y saltos</h1>
      <p class="sub">Comparaciones, FLAGS, rutas condicionales y corte de flujo con JMP.</p>
      <div class="progress-shell"><div class="progress-bar" id="progressBar"></div></div>
      <nav aria-label="Línea de tiempo" class="timeline" id="timeline">
        <button class="time-dot is-active" data-step="slide-1" type="button">C / if</button>
        <button class="time-dot" data-step="slide-2" type="button">8086</button>
        <button class="time-dot" data-step="slide-3" type="button">CMP</button>
        <button class="time-dot" data-step="slide-4" type="button">JZ</button>
        <button class="time-dot" data-step="slide-5" type="button">JG</button>
        <button class="time-dot" data-step="slide-6" type="button">JL</button>
        <button class="time-dot" data-step="slide-7" type="button">Orden</button>
        <button class="time-dot" data-step="slide-8" type="button">Rutas</button>
        <button class="time-dot" data-step="slide-9" type="button">JMP</button>
        <button class="time-dot" data-step="slide-10" type="button">Método</button>
        <button class="time-dot" data-step="slide-11" type="button">Cierre</button>
      </nav>
      <div class="audio-error" id="audioError"></div>
    </section>
  </header>

  <section class="slide-stage">
    <article class="card slide is-active" data-slide="slide-1">
      <div class="slide-head">
        <div><div class="slide-kicker">Paso 1</div><h2 class="slide-title">Una decisión en <span>C</span></h2></div>
        <div class="slide-number">1 / 11</div>
      </div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Código de alto nivel</div>
          <div class="if-card">
            <div class="if-row" data-hotspot="s1-if-greater"><div class="if-main mono">if (IZQUIERDA &gt; DERECHA)</div><div class="if-route mono">ejecutar RUTA_MAYOR</div></div>
            <div class="if-row" data-hotspot="s1-if-less"><div class="if-main mono">else if (IZQUIERDA &lt; DERECHA)</div><div class="if-route mono">ejecutar RUTA_MENOR</div></div>
            <div class="if-row" data-hotspot="s1-if-eq"><div class="if-main mono">else</div><div class="if-route mono">ejecutar RUTA_IGUAL</div></div>
          </div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-2">
      <div class="slide-head">
        <div><div class="slide-kicker">Paso 2</div><h2 class="slide-title">El <span>if</span> se desarma</h2></div>
        <div class="slide-number">2 / 11</div>
      </div>
      <div class="sim-stack">
        <div class="map-grid">
          <div class="map-card" data-hotspot="s2-c"><div class="map-title">C</div><div class="code-line small mono">if / else if / else<br><span class="token soft">estructura compacta</span></div></div>
          <div class="map-card" data-hotspot="s2-asm"><div class="map-title">8086</div><div class="map-lines">
            <div class="chip mono" data-hotspot="s2-mov">MOV · cargar datos</div>
            <div class="chip mono" data-hotspot="s2-cmp">CMP · comparar</div>
            <div class="chip mono" data-hotspot="s2-jz">JZ · igualdad</div>
            <div class="chip mono" data-hotspot="s2-jg">JG · mayor</div>
            <div class="chip mono" data-hotspot="s2-jl">JL · menor</div>
          </div></div>
        </div>
        <div class="sim-panel" data-hotspot="s2-map">
          <div class="panel-title">Mapa de decisión</div>
          <div class="code-line small mono"><span class="token" data-hotspot="s2-map-cmp">CMP</span> → <span class="token soft">FLAGS</span> → <span class="token" data-hotspot="s2-map-jumps">JZ / JG / JL</span> → <span class="token soft">ruta</span></div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-3">
      <div class="slide-head">
        <div><div class="slide-kicker">Paso 3</div><h2 class="slide-title"><span>CMP</span> con registros</h2></div>
        <div class="slide-number">3 / 11</div>
      </div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Registros y FLAGS</div>
          <div class="reg-grid">
            <div class="reg-card" data-hotspot="s3-cx"><div class="reg-name mono">CX</div><div class="reg-val mono">0009h</div><div class="reg-note">primer operando</div></div>
            <div class="reg-card" data-hotspot="s3-dx"><div class="reg-name mono">DX</div><div class="reg-val mono">0004h</div><div class="reg-note">segundo operando</div></div>
          </div>
          <div class="flag-row">
            <div class="flag-card" data-hotspot="s3-zf"><div class="flag-name mono">ZF</div><div class="flag-value mono">0</div></div>
            <div class="flag-card" data-hotspot="s3-sf"><div class="flag-name mono">SF</div><div class="flag-value mono">0</div></div>
            <div class="flag-card" data-hotspot="s3-of"><div class="flag-name mono">OF</div><div class="flag-value mono">0</div></div>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Instrucción activa</div>
          <div class="code-line mono"><span class="token" data-hotspot="s3-cmp">CMP</span> <span class="token" data-hotspot="s3-cmp-cx">CX</span>, <span class="token" data-hotspot="s3-cmp-dx">DX</span></div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Operación interna</div>
          <div class="op-box mono" data-hotspot="s3-op"><span data-hotspot="s3-op-a">0009h</span> - <span data-hotspot="s3-op-b">0004h</span> = <span data-hotspot="s3-op-r">0005h</span><small>no se guarda en CX ni en DX</small></div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-4">
      <div class="slide-head">
        <div><div class="slide-kicker">Paso 4</div><h2 class="slide-title"><span>JZ</span> mira ZF</h2></div>
        <div class="slide-number">4 / 11</div>
      </div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Registros y FLAGS</div>
          <div class="reg-grid">
            <div class="reg-card" data-hotspot="s4-cx"><div class="reg-name mono">CX</div><div class="reg-val mono">0007h</div><div class="reg-note">primer operando</div></div>
            <div class="reg-card" data-hotspot="s4-dx"><div class="reg-name mono">DX</div><div class="reg-val mono">0007h</div><div class="reg-note">segundo operando</div></div>
          </div>
          <div class="flag-row" style="grid-template-columns: 1fr;">
            <div class="flag-card" data-hotspot="s4-zf"><div class="flag-name mono">ZF</div><div class="flag-value mono">1</div><div class="flag-caption">resultado interno cero</div></div>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Instrucciones activas</div>
          <div class="code-line mono"><span class="token" data-hotspot="s4-cmp">CMP CX, DX</span><br><span class="token" data-hotspot="s4-jz">JZ RUTA_IGUAL</span></div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Operación interna</div>
          <div class="op-box mono" data-hotspot="s4-op"><span data-hotspot="s4-op-a">0007h</span> - <span data-hotspot="s4-op-b">0007h</span> = <span data-hotspot="s4-op-r">0000h</span><small>resultado cero activa ZF</small></div>
          <div class="route-chip mono" data-hotspot="s4-route" style="margin-top:8px;">RUTA_IGUAL<span>salto tomado por ZF</span></div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-5">
      <div class="slide-head">
        <div><div class="slide-kicker">Paso 5</div><h2 class="slide-title"><span>JG</span> mayor con signo</h2></div>
        <div class="slide-number">5 / 11</div>
      </div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Registros y FLAGS</div>
          <div class="reg-grid">
            <div class="reg-card" data-hotspot="s5-cx"><div class="reg-name mono">CX</div><div class="reg-val mono">0009h</div></div>
            <div class="reg-card" data-hotspot="s5-dx"><div class="reg-name mono">DX</div><div class="reg-val mono">0004h</div></div>
          </div>
          <div class="flag-row">
            <div class="flag-card" data-hotspot="s5-zf"><div class="flag-name mono">ZF</div><div class="flag-value mono">0</div></div>
            <div class="flag-card" data-hotspot="s5-sf"><div class="flag-name mono">SF</div><div class="flag-value mono">0</div></div>
            <div class="flag-card" data-hotspot="s5-of"><div class="flag-name mono">OF</div><div class="flag-value mono">0</div></div>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Instrucciones</div>
          <div class="code-line mono"><span class="token" data-hotspot="s5-cmp">CMP CX, DX</span><br><span class="token" data-hotspot="s5-jg">JG RUTA_MAYOR</span></div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Condición y ruta</div>
          <div class="condition-grid">
            <div class="condition-card" data-hotspot="s5-cond-zf"><div class="condition-label">condición</div><div class="condition-value mono">ZF = 0</div></div>
            <div class="condition-card" data-hotspot="s5-cond-sf-of"><div class="condition-label">condición</div><div class="condition-value mono">SF = OF</div></div>
          </div>
          <div class="route-chip mono" data-hotspot="s5-route" style="margin-top:8px;">RUTA_MAYOR<span>CX &gt; DX</span></div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-6">
      <div class="slide-head">
        <div><div class="slide-kicker">Paso 6</div><h2 class="slide-title"><span>JL</span> menor con signo</h2></div>
        <div class="slide-number">6 / 11</div>
      </div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Registros y FLAGS</div>
          <div class="reg-grid">
            <div class="reg-card" data-hotspot="s6-cx"><div class="reg-name mono">CX</div><div class="reg-val mono">0004h</div></div>
            <div class="reg-card" data-hotspot="s6-dx"><div class="reg-name mono">DX</div><div class="reg-val mono">0009h</div></div>
          </div>
          <div class="flag-row">
            <div class="flag-card" data-hotspot="s6-zf"><div class="flag-name mono">ZF</div><div class="flag-value mono">0</div></div>
            <div class="flag-card" data-hotspot="s6-sf"><div class="flag-name mono">SF</div><div class="flag-value mono">1</div></div>
            <div class="flag-card" data-hotspot="s6-of"><div class="flag-name mono">OF</div><div class="flag-value mono">0</div></div>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Instrucciones</div>
          <div class="code-line mono"><span class="token" data-hotspot="s6-cmp">CMP CX, DX</span><br><span class="token" data-hotspot="s6-jl">JL RUTA_MENOR</span></div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Condición y ruta</div>
          <div class="condition-card" data-hotspot="s6-cond"><div class="condition-label">condición</div><div class="condition-value mono">SF ≠ OF</div></div>
          <div class="route-chip mono" data-hotspot="s6-route" style="margin-top:8px;">RUTA_MENOR<span>CX &lt; DX</span></div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-7">
      <div class="slide-head">
        <div><div class="slide-kicker">Paso 7</div><h2 class="slide-title">Orden de <span>saltos</span></h2></div>
        <div class="slide-number">7 / 11</div>
      </div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Código 8086</div>
          <div class="code-line mono"><span class="token" data-hotspot="s7-cmp">CMP CX, DX</span><br><span class="token" data-hotspot="s7-jz">JZ RUTA_IGUAL</span><br><span class="token" data-hotspot="s7-jg">JG RUTA_MAYOR</span><br><span class="token" data-hotspot="s7-jl">JL RUTA_MENOR</span></div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Orden de evaluación</div>
          <div class="order-grid">
            <div class="order-card" data-hotspot="s7-order-1"><div class="order-num">1</div><div class="order-text">igualdad</div></div>
            <div class="order-card" data-hotspot="s7-order-2"><div class="order-num">2</div><div class="order-text">mayor</div></div>
            <div class="order-card" data-hotspot="s7-order-3"><div class="order-num">3</div><div class="order-text">menor</div></div>
          </div>
        </div>
        <div class="sim-panel" data-hotspot="s7-rule">
          <div class="panel-title">Regla</div>
          <div class="code-line small mono"><span class="token">un CMP</span> → <span class="token soft">los mismos FLAGS</span> → <span class="token">tres saltos</span></div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-8">
      <div class="slide-head">
        <div><div class="slide-kicker">Paso 8</div><h2 class="slide-title">Etiquetas como <span>rutas</span></h2></div>
        <div class="slide-number">8 / 11</div>
      </div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Rutas posibles</div>
          <div class="route-list">
            <div class="route-chip mono" data-hotspot="s8-igual">RUTA_IGUAL<span>caso igualdad</span></div>
            <div class="route-chip mono" data-hotspot="s8-mayor">RUTA_MAYOR<span>caso mayor</span></div>
            <div class="route-chip mono" data-hotspot="s8-menor">RUTA_MENOR<span>caso menor</span></div>
          </div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-9">
      <div class="slide-head">
        <div><div class="slide-kicker">Paso 9</div><h2 class="slide-title"><span>JMP</span> corta el flujo</h2></div>
        <div class="slide-number">9 / 11</div>
      </div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Código con etiquetas</div>
          <div class="code-line mono">
            <span class="token soft" data-hotspot="s9-label-mayor">RUTA_MAYOR:</span><br>
            <span class="token soft" data-hotspot="s9-action">MOV word RESULTADO_RUTA, 0020h</span><br>
            <span class="token" data-hotspot="s9-jmp">JMP SALIDA</span><br>
            <span class="token soft" data-hotspot="s9-label-menor">RUTA_MENOR:</span><br>
            <span class="token soft" data-hotspot="s9-skip">MOV word RESULTADO_RUTA, 0010h</span><br>
            <span class="token" data-hotspot="s9-salida">SALIDA:</span><br>
            <span class="token soft" data-hotspot="s9-after">; continúa el programa</span>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Lectura de JMP</div>
          <div class="condition-grid">
            <div class="condition-card" data-hotspot="s9-incond"><div class="condition-label">tipo</div><div class="condition-value mono">incondicional</div></div>
            <div class="condition-card" data-hotspot="s9-no-flags"><div class="condition-label">FLAGS</div><div class="condition-value mono">no lee</div></div>
          </div>
          <div class="route-chip mono" data-hotspot="s9-dest" style="margin-top:8px;">SALIDA<span>etiqueta destino</span></div>
        </div>
        <div class="sim-panel" data-hotspot="s9-risk">
          <div class="panel-title">Sin JMP</div>
          <div class="code-line small mono"><span class="token soft">la CPU seguiría abajo</span><br><span class="token">podría entrar en RUTA_MENOR</span></div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-10">
      <div class="slide-head">
        <div><div class="slide-kicker">Paso 10</div><h2 class="slide-title">Método para <span>resolver</span></h2></div>
        <div class="slide-number">10 / 11</div>
      </div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Lectura del flujo</div>
          <div class="method">
            <div class="method-row" data-hotspot="s10-m1"><div class="method-num">1</div><div class="method-text">Ubica el CMP.</div></div>
            <div class="method-row" data-hotspot="s10-m2"><div class="method-num">2</div><div class="method-text">Identifica qué valores compara.</div></div>
            <div class="method-row" data-hotspot="s10-m3"><div class="method-num">3</div><div class="method-text">Determina los FLAGS.</div></div>
            <div class="method-row" data-hotspot="s10-m4"><div class="method-num">4</div><div class="method-text">Revisa los saltos en orden.</div></div>
            <div class="method-row" data-hotspot="s10-m5"><div class="method-num">5</div><div class="method-text">Sigue solo la ruta tomada.</div></div>
            <div class="method-row" data-hotspot="s10-m6"><div class="method-num">6</div><div class="method-text">Si aparece JMP SALIDA, corta el flujo ahí.</div></div>
          </div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-11">
      <div class="slide-head">
        <div><div class="slide-kicker">Paso 11</div><h2 class="slide-title">Resumen <span>operativo</span></h2></div>
        <div class="slide-number">11 / 11</div>
      </div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Claves</div>
          <div class="method">
            <div class="method-row" data-hotspot="s11-cmp"><div class="method-num mono">CMP</div><div class="method-text">prepara la decisión</div></div>
            <div class="method-row" data-hotspot="s11-jz"><div class="method-num mono">JZ</div><div class="method-text">detecta igualdad</div></div>
            <div class="method-row" data-hotspot="s11-jg"><div class="method-num mono">JG</div><div class="method-text">detecta mayor con signo</div></div>
            <div class="method-row" data-hotspot="s11-jl"><div class="method-num mono">JL</div><div class="method-text">detecta menor con signo</div></div>
            <div class="method-row" data-hotspot="s11-jmp"><div class="method-num mono">JMP</div><div class="method-text">evita caer en otra ruta</div></div>
          </div>
        </div>
      </div>
    </article>
  </section>
</main>
<footer class="footer-dock">
  <div class="footer-inner">
    <div class="subtitle" id="subtitle" hidden><span>Presiona reproducir para iniciar.</span></div>
    <div class="controls">
      <button class="primary" id="playBtn" type="button">Reproducir teoría</button>
      <button
        aria-label="Mostrar subtítulos"
        aria-pressed="false"
        class="secondary cc-button"
        id="subtitleBtn"
        type="button"
      >
        CC
      </button>
      <button class="secondary" id="resetBtn" type="button" aria-label="Reiniciar">↺</button>
    </div>
    <button class="primary final-action" id="practiceBtn" type="button">Iniciar práctica</button>
    <div class="status-line" id="statusLine">Audio local esperado: assets/teoria5.mp3</div>
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
  }

  * { box-sizing: border-box; }
  .theory-root {
    min-height: 100dvh;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:
      radial-gradient(circle at 50% -16%, rgba(244, 197, 66, .13), transparent 34%),
      linear-gradient(180deg, var(--bg) 0%, #11151d 100%);
  }

  button { font: inherit; -webkit-tap-highlight-color: transparent; }
  h1, h2, p { margin: 0; }

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
  .time-dot.is-active {
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
  .slide.is-active { display: block; animation: enter .18s ease both; }
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
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; }

  [data-hotspot] {
    transition: border-color .16s ease, background .16s ease, box-shadow .16s ease, transform .16s ease, color .16s ease, opacity .16s ease;
  }
  [data-hotspot]:global(.is-hot) {
    border-color: var(--accent-line) !important;
    background-color: var(--accent-soft) !important;
    box-shadow: 0 0 0 1px rgba(244,197,66,.14), 0 0 22px rgba(244,197,66,.11);
    transform: translateY(-1px);
  }
  .token:global(.is-hot), .chip:global(.is-hot), .flag-value:global(.is-hot), .reg-val:global(.is-hot), .route-chip:global(.is-hot), .method-num:global(.is-hot) { color: var(--accent); }

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
  .code-line.small { font-size: clamp(13px, 3.85vw, 17px); line-height: 1.28; }
  .token {
    display: inline-block;
    padding: 2px 5px;
    margin: 1px 0;
    border: 1px solid transparent;
    border-radius: 8px;
    color: var(--accent);
  }
  .token.soft { color: var(--soft); }

  .if-card {
    display: grid;
    gap: 8px;
  }
  .if-row {
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .86);
    border-radius: 16px;
    padding: 10px;
    display: grid;
    gap: 4px;
  }
  .if-main { color: var(--accent); font-size: clamp(14px, 4.1vw, 18px); font-weight: 950; line-height: 1.18; }
  .if-route { color: var(--soft); font-size: 12.5px; font-weight: 850; }

  .map-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
  .map-card {
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .82);
    border-radius: 16px;
    padding: 10px;
  }
  .map-title { color: var(--muted); font-size: 10px; font-weight: 950; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 7px; }
  .map-lines { display: grid; gap: 6px; }
  .chip {
    border: 1px solid var(--line);
    background: rgba(22, 27, 38, .92);
    border-radius: 12px;
    padding: 7px 8px;
    font-size: 12.5px;
    font-weight: 900;
    line-height: 1.15;
  }

  .reg-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .reg-card {
    min-height: 68px;
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .86);
    border-radius: 16px;
    padding: 10px;
    display: grid;
    align-content: center;
  }
  .reg-name { color: #c7d2fe; font-size: 12px; font-weight: 950; letter-spacing: .08em; }
  .reg-val { margin-top: 5px; font-size: clamp(24px, 7.2vw, 32px); line-height: 1; font-weight: 950; letter-spacing: .03em; }
  .reg-note { color: var(--muted); font-size: 11px; margin-top: 4px; font-weight: 800; }

  .flag-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; margin-top: 8px; }
  .flag-card {
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .86);
    border-radius: 15px;
    padding: 8px;
    min-height: 58px;
    display: grid;
    align-content: center;
    text-align: center;
  }
  .flag-name { color: #c7d2fe; font-size: 11px; font-weight: 950; letter-spacing: .08em; }
  .flag-value { margin-top: 5px; font-size: clamp(20px, 6vw, 26px); font-weight: 950; line-height: 1; }
  .flag-caption { color: var(--muted); font-size: 10px; margin-top: 3px; font-weight: 800; }

  .op-box {
    border: 1px solid var(--line);
    background: rgba(17,23,34,.86);
    border-radius: 16px;
    padding: 12px;
    text-align: center;
    font-size: clamp(20px, 6.2vw, 28px);
    line-height: 1.12;
    font-weight: 950;
  }
  .op-box small { display: block; color: var(--muted); font-size: 11px; margin-top: 6px; font-family: system-ui, sans-serif; font-weight: 850; }

  .condition-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .condition-card {
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .86);
    border-radius: 16px;
    padding: 10px;
    display: grid;
    gap: 5px;
  }
  .condition-label { color: var(--muted); font-size: 10px; font-weight: 950; letter-spacing: .1em; text-transform: uppercase; }
  .condition-value { color: var(--accent); font-size: clamp(18px, 5.2vw, 25px); font-weight: 950; line-height: 1.05; }

  .route-list { display: grid; gap: 8px; }
  .route-chip {
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .86);
    border-radius: 16px;
    padding: 12px;
    font-size: clamp(16px, 4.7vw, 22px);
    font-weight: 950;
    line-height: 1.1;
  }
  .route-chip span { display: block; margin-top: 4px; color: var(--muted); font-size: 11px; font-weight: 850; font-family: system-ui, sans-serif; }

  .order-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .order-card {
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .86);
    border-radius: 15px;
    padding: 10px 8px;
    text-align: center;
  }
  .order-num { color: var(--accent); font-weight: 950; font-size: 18px; line-height: 1; }
  .order-text { color: var(--soft); font-size: 11.5px; font-weight: 900; margin-top: 5px; }

  .method { display: grid; gap: 8px; }
  .method-row {
    display: grid;
    grid-template-columns: 38px 1fr;
    gap: 9px;
    align-items: center;
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .86);
    border-radius: 16px;
    padding: 9px;
  }
  .method-num {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: rgba(244,197,66,.12);
    border: 1px solid rgba(244,197,66,.32);
    color: var(--accent);
    font-weight: 950;
  }
  .method-text { font-size: 13.5px; font-weight: 850; line-height: 1.2; color: var(--soft); }

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
  .cc-button:global(.is-active) { border-color: var(--accent-line); color: var(--accent); background: var(--accent-soft); }
  .subtitle[hidden] { display: none; }
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
    .map-grid, .condition-grid { grid-template-columns: 1fr; }
    .reg-card { min-height: 62px; }
    .flag-row { gap: 6px; }
    .order-grid { gap: 6px; }
    .route-chip { padding: 10px; }
  }
  @media (max-width: 340px) {
    .time-dot { min-width: 58px; font-size: 9px; }
    .code-line { font-size: 14px; }
    .reg-val { font-size: 22px; }
    .flag-value { font-size: 19px; }
  }
  @media (max-height: 720px) {
    .slide { min-height: auto; }
    .sim-panel { padding: 10px; }
    .slide-title { font-size: 20px; }
  }
</style>
