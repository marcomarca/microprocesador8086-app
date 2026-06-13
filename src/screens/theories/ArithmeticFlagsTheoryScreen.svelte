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
    flags?: Record<string, string>;
    captions?: Record<string, string>;
  };

  type CueFocus = {
    slide: string;
    targets: string[];
    state?: VisualState;
  };

  const SRT_SOURCE = `1
00:00:00,000 --> 00:00:01,280
En el ensamblador,

2
00:00:01,280 --> 00:00:04,120
una operación aritmética no solo produce un resultado.

3
00:00:04,120 --> 00:00:06,500
También actualiza el registro FLAGS.

4
00:00:06,500 --> 00:00:09,000
FLAGS resume condiciones del resultado.

5
00:00:09,000 --> 00:00:09,880
Por ejemplo,

6
00:00:09,880 --> 00:00:11,640
si el resultado fue cero,

7
00:00:11,640 --> 00:00:12,780
si hubo carreo,

8
00:00:12,780 --> 00:00:14,600
si el signo cambió o si hubo un

9
00:00:14,600 --> 00:00:15,020
overflow.

10
00:00:15,380 --> 00:00:16,320
Por eso,

11
00:00:16,320 --> 00:00:18,160
después de cada instrucción no basta mirar el

12
00:00:18,160 --> 00:00:18,800
registro.

13
00:00:18,800 --> 00:00:20,640
También hay que revisar las FLAGS.

14
00:00:21,260 --> 00:00:24,660
Toda instrucción aritmética debe leerse por partes.

15
00:00:24,660 --> 00:00:25,360
Primero,

16
00:00:25,360 --> 00:00:26,240
la operación.

17
00:00:26,240 --> 00:00:26,780
Segundo,

18
00:00:26,780 --> 00:00:27,440
el destino.

19
00:00:27,440 --> 00:00:28,200
Y tercero,

20
00:00:28,200 --> 00:00:28,800
la fuente.

21
00:00:28,800 --> 00:00:29,650
Por ejemplo,

22
00:00:29,650 --> 00:00:30,570
add ax,

23
00:00:30,630 --> 00:00:31,450
word,

24
00:00:31,450 --> 00:00:32,490
valor base.

25
00:00:32,490 --> 00:00:34,490
Add indica una suma.

26
00:00:34,490 --> 00:00:36,030
ax es el destino.

27
00:00:36,230 --> 00:00:36,890
Word,

28
00:00:36,890 --> 00:00:37,390
valor base,

29
00:00:37,390 --> 00:00:38,190
es la fuente.

30
00:00:38,190 --> 00:00:39,670
La fuente se lee.

31
00:00:39,670 --> 00:00:41,910
El destino recibe el resultado.

32
00:00:42,350 --> 00:00:45,570
Supongamos que ax contiene 0028h.

33
00:00:45,590 --> 00:00:46,890
En memoria,

34
00:00:46,890 --> 00:00:49,990
valor base contiene el word 0018h.

35
00:00:50,110 --> 00:00:52,610
La instrucción es add ax,

36
00:00:52,610 --> 00:00:53,410
word,

37
00:00:53,410 --> 00:00:54,190
valor base.

38
00:00:54,270 --> 00:00:57,950
El procesador suma 0028h más...

39
00:00:57,950 --> 00:00:59,410
0018H.

40
00:00:59,410 --> 00:01:02,930
El resultado es 0040H.

41
00:01:03,130 --> 00:01:05,290
Como AX es el destino,

42
00:01:05,290 --> 00:01:07,510
AX cambia a 0040H.

43
00:01:07,510 --> 00:01:08,650
En este caso,

44
00:01:08,650 --> 00:01:10,310
el resultado no es cero.

45
00:01:10,310 --> 00:01:13,110
No hay acarreo fuera de 16 bits y

46
00:01:13,110 --> 00:01:14,390
no hay overflow consigo.

47
00:01:14,810 --> 00:01:16,910
Ahora veamos una resta.

48
00:01:16,910 --> 00:01:21,050
La instrucción sub AX ,0040H.

49
00:01:21,050 --> 00:01:23,750
Si AX contiene 0040H,

50
00:01:23,750 --> 00:01:28,930
la operación interna es 0040H menos 0040H.

51
00:01:28,930 --> 00:01:32,270
El resultado es 0000H.

52
00:01:32,530 --> 00:01:35,510
Sub guarda ese resultado en el destino.

53
00:01:35,510 --> 00:01:36,410
Por tanto,

54
00:01:36,410 --> 00:01:38,790
AX queda como 0000H.

55
00:01:39,070 --> 00:01:41,230
Como el resultado es 0,

56
00:01:41,270 --> 00:01:42,890
ZF se activa.

57
00:01:42,890 --> 00:01:44,950
Zero flag significa.

58
00:01:45,550 --> 00:01:48,490
El flag PF mide paridad.

59
00:01:48,490 --> 00:01:50,840
PF no analiza toda la Word,

60
00:01:50,840 --> 00:01:53,200
solo analiza el byte bajo del resultado.

61
00:01:53,200 --> 00:01:53,860
Por ejemplo,

62
00:01:53,980 --> 00:01:58,420
si ax vale 0002 y ejecutamos add ax,

63
00:01:58,420 --> 00:02:00,380
0003h,

64
00:02:00,380 --> 00:02:02,900
el resultado es 0005h.

65
00:02:02,900 --> 00:02:05,300
El byte bajo es 05h.

66
00:02:05,300 --> 00:02:06,480
En binario,

67
00:02:06,480 --> 00:02:11,840
05h es 000101 binario.

68
00:02:11,840 --> 00:02:14,580
Tiene dos bits en uno.

69
00:02:14,600 --> 00:02:16,480
Como dos es par,

70
00:02:16,480 --> 00:02:18,170
PF queda en 1.

71
00:02:19,050 --> 00:02:22,030
CF significa carry flag.

72
00:02:22,090 --> 00:02:24,730
Se usa para operaciones sin signo.

73
00:02:24,730 --> 00:02:28,250
Supongamos que BX contiene FFF0H.

74
00:02:28,250 --> 00:02:33,170
La instrucción es at BX ,0020H.

75
00:02:33,210 --> 00:02:38,490
La suma completa da 10010H.

76
00:02:38,490 --> 00:02:41,370
Pero BX es un registro de 16 bits.

77
00:02:41,370 --> 00:02:44,390
Solo puede conservar 0010H.

78
00:02:44,440 --> 00:02:47,580
El bit que queda fuera del registro activa

79
00:02:47,580 --> 00:02:48,640
carry flag.

80
00:02:48,660 --> 00:02:52,980
Por eso BX queda en 0010H y carry

81
00:02:52,980 --> 00:02:54,520
flag queda en 1.

82
00:02:54,980 --> 00:02:57,720
OF significa overflow flag.

83
00:02:57,720 --> 00:03:00,820
OF se interpreta con números con signo.

84
00:03:00,820 --> 00:03:02,740
No es lo mismo que CF.

85
00:03:02,740 --> 00:03:06,280
Supongamos que CX contiene 7FF0H.

86
00:03:06,300 --> 00:03:11,520
La instrucción es add CX ,0020H.

87
00:03:11,520 --> 00:03:13,960
El resultado de 16 bits es...

88
00:03:13,960 --> 00:03:17,100
80 -10 -H sin signo.

89
00:03:17,100 --> 00:03:19,760
80 -10 -H cabe en una word con

90
00:03:19,760 --> 00:03:20,360
signo.

91
00:03:20,400 --> 00:03:24,400
7 -FF -0 -H representa un valor positivo.

92
00:03:24,400 --> 00:03:27,660
Pero 80 -10 -H cae en un rango

93
00:03:27,660 --> 00:03:28,420
negativo.

94
00:03:28,420 --> 00:03:31,140
Este cambio de rango activa OF.

95
00:03:31,140 --> 00:03:33,460
En ese caso OF vale 1,

96
00:03:33,460 --> 00:03:36,180
aunque CF puede valer 0.

97
00:03:36,840 --> 00:03:40,420
INC y DEC también modifican el destino.

98
00:03:40,420 --> 00:03:42,580
INC -DX suma 1.

99
00:03:42,580 --> 00:03:44,990
DEC DX resta 1.

100
00:03:44,990 --> 00:03:48,290
Si DX contiene 00FEH,

101
00:03:48,730 --> 00:03:50,930
después de un INC DX,

102
00:03:50,930 --> 00:03:53,930
DX queda como 00FFH.

103
00:03:53,930 --> 00:03:56,550
Después de DEC DX,

104
00:03:56,550 --> 00:03:59,950
DX vuelve a 00FEH.

105
00:03:59,950 --> 00:04:02,770
Estas instrucciones actualizan varios flags,

106
00:04:02,770 --> 00:04:05,770
pero no modifican la carry flag.

107
00:04:06,090 --> 00:04:09,410
La carry flag conserva su valor anterior.

108
00:04:09,980 --> 00:04:12,320
CMP sirve para comparar.

109
00:04:12,320 --> 00:04:15,080
Internamente CMP realiza una resta.

110
00:04:15,080 --> 00:04:15,680
Por ejemplo,

111
00:04:15,820 --> 00:04:17,140
CMP AX,

112
00:04:17,140 --> 00:04:17,960
BX.

113
00:04:17,960 --> 00:04:23,780
Si AX vale 0033H y BX vale 0033H,

114
00:04:23,780 --> 00:04:28,500
la operación interna es 0033H menos 0033H.

115
00:04:28,500 --> 00:04:31,780
El resultado interno es 0000H.

116
00:04:31,780 --> 00:04:34,220
Por eso la Zero Flag se activa,

117
00:04:34,220 --> 00:04:36,820
pero CMP no guarda la resta.

118
00:04:36,820 --> 00:04:39,790
AX y BX siguen valiendo lo mismo.

119
00:04:39,790 --> 00:04:42,130
La comparación queda únicamente en las FLAC,

120
00:04:42,130 --> 00:04:43,270
no en los registros.

121
00:04:43,310 --> 00:04:45,170
Para resolver la práctica,

122
00:04:45,170 --> 00:04:46,810
lee cada instrucción en orden,

123
00:04:46,810 --> 00:04:48,330
identifica la operación,

124
00:04:48,330 --> 00:04:49,750
identifica el destino,

125
00:04:49,750 --> 00:04:50,970
identifica la fuente,

126
00:04:51,130 --> 00:04:54,930
después calcula el resultado con el tamaño correcto.

127
00:04:54,930 --> 00:04:57,030
Si el destino es un registro,

128
00:04:57,190 --> 00:04:58,850
ese registro puede cambiar.

129
00:04:58,850 --> 00:05:00,490
Si la instrucción solo compara,

130
00:05:00,490 --> 00:05:01,850
como CMP,

131
00:05:01,850 --> 00:05:03,430
los registros no cambian.

132
00:05:03,430 --> 00:05:04,320
Finalmente.

133
00:05:04,320 --> 00:05:06,620
Revisa flags después de la operación.

134
00:05:06,760 --> 00:05:10,080
Zero flag indica resultado cero.

135
00:05:10,400 --> 00:05:13,100
Cash flag indica acaseo sin signo.

136
00:05:13,300 --> 00:05:16,940
Overflow indica desburlamiento con signo.

137
00:05:17,320 --> 00:05:21,060
Parity flag significa variedad del byte bajo.`;

  const cueFocus: Record<number, CueFocus> = {};

  function focus(cue: number, slide: string, targets: string[], state: VisualState = {}): void {
    cueFocus[cue] = { slide, targets, state };
  }

  function range(start: number, end: number, slide: string, targets: string[], state: VisualState = {}): void {
    for (let cue = start; cue <= end; cue += 1) {
      focus(cue, slide, targets, state);
    }
  }

  const slideStartCue: Record<string, number> = {
    'slide-1': 1,
    'slide-2': 14,
    'slide-3': 30,
    'slide-4': 32,
    'slide-5': 38,
    'slide-6': 47,
    'slide-7': 58,
    'slide-8': 71,
    'slide-9': 82,
    'slide-10': 97,
    'slide-11': 108,
    'slide-12': 121,
    'slide-13': 132
  };

  const slideNames: Record<string, string> = {
    'slide-1': 'Resultado y FLAGS',
    'slide-2': 'Leer por partes',
    'slide-3': 'Fuente leída, destino actualizado',
    'slide-4': 'ADD con memoria',
    'slide-5': 'Resultado de ADD',
    'slide-6': 'SUB y Zero Flag',
    'slide-7': 'PF y byte bajo',
    'slide-8': 'CF y 16 bits',
    'slide-9': 'OF con signo',
    'slide-10': 'INC, DEC y CF',
    'slide-11': 'CMP resta internamente',
    'slide-12': 'Método de resolución',
    'slide-13': 'Leer FLAGS después'
  };

  range(1, 3, 'slide-1', ['s1-instr', 's1-flags']);
  range(4, 5, 'slide-1', ['s1-flags']);
  focus(6, 'slide-1', ['s1-zf']);
  focus(7, 'slide-1', ['s1-cf']);
  focus(8, 'slide-1', ['s1-sf']);
  focus(9, 'slide-1', ['s1-of']);
  range(10, 13, 'slide-1', ['s1-reg', 's1-flags']);

  range(14, 20, 'slide-2', ['s2-full', 's2-parts']);
  range(21, 24, 'slide-2', ['s2-full']);
  focus(25, 'slide-2', ['s2-add']);
  focus(26, 'slide-2', ['s2-ax']);
  range(27, 29, 'slide-2', ['s2-src']);

  focus(30, 'slide-3', ['s3-source', 's3-flow']);
  focus(31, 'slide-3', ['s3-dest', 's3-flow']);

  focus(32, 'slide-4', ['s4-ax'], { registers: { AX: '0028h' } });
  range(33, 34, 'slide-4', ['s4-mem', 's4-word'], { registers: { AX: '0028h' } });
  range(35, 37, 'slide-4', ['s4-instr'], { registers: { AX: '0028h' } });

  range(38, 39, 'slide-5', ['s5-op', 's5-sum'], {
    registers: { AX: '0028h' },
    flags: { ZF: '0', CF: '0', PF: '0', SF: '0', OF: '0' }
  });
  focus(40, 'slide-5', ['s5-result'], {
    registers: { AX: '0028h' },
    flags: { ZF: '0', CF: '0', PF: '0', SF: '0', OF: '0' }
  });
  range(41, 42, 'slide-5', ['s5-ax'], {
    registers: { AX: '0040h' },
    flags: { ZF: '0', CF: '0', PF: '0', SF: '0', OF: '0' }
  });
  range(43, 44, 'slide-5', ['s5-zf'], {
    registers: { AX: '0040h' },
    flags: { ZF: '0', CF: '0', PF: '0', SF: '0', OF: '0' }
  });
  focus(45, 'slide-5', ['s5-cf'], {
    registers: { AX: '0040h' },
    flags: { ZF: '0', CF: '0', PF: '0', SF: '0', OF: '0' }
  });
  focus(46, 'slide-5', ['s5-of'], {
    registers: { AX: '0040h' },
    flags: { ZF: '0', CF: '0', PF: '0', SF: '0', OF: '0' }
  });

  range(47, 48, 'slide-6', ['s6-instr'], {
    registers: { AX: '0040h' },
    flags: { ZF: '0', CF: '0', PF: '0', SF: '0', OF: '0' }
  });
  focus(49, 'slide-6', ['s6-ax'], {
    registers: { AX: '0040h' },
    flags: { ZF: '0', CF: '0', PF: '0', SF: '0', OF: '0' }
  });
  range(50, 51, 'slide-6', ['s6-op', 's6-zero'], {
    registers: { AX: '0040h' },
    flags: { ZF: '0', CF: '0', PF: '0', SF: '0', OF: '0' }
  });
  range(52, 54, 'slide-6', ['s6-ax-final'], {
    registers: { AX: '0000h' },
    flags: { ZF: '0', CF: '0', PF: '0', SF: '0', OF: '0' }
  });
  range(55, 57, 'slide-6', ['s6-zf', 's6-pf'], {
    registers: { AX: '0000h' },
    flags: { ZF: '1', CF: '0', PF: '1', SF: '0', OF: '0' }
  });

  range(58, 60, 'slide-7', ['s7-concept'], {
    registers: { AX: '0002h' },
    flags: { PF: '0' }
  });
  range(61, 63, 'slide-7', ['s7-instr', 's7-ax'], {
    registers: { AX: '0002h' },
    flags: { PF: '0' }
  });
  focus(64, 'slide-7', ['s7-op'], {
    registers: { AX: '0005h' },
    flags: { PF: '0' }
  });
  focus(65, 'slide-7', ['s7-al'], {
    registers: { AX: '0005h' },
    flags: { PF: '0' }
  });
  range(66, 67, 'slide-7', ['s7-bin'], {
    registers: { AX: '0005h' },
    flags: { PF: '0' }
  });
  range(68, 70, 'slide-7', ['s7-bin', 's7-pf'], {
    registers: { AX: '0005h' },
    flags: { PF: '1' }
  });

  range(71, 72, 'slide-8', ['s8-concept'], {
    registers: { BX: 'FFF0h' },
    flags: { CF: '0' }
  });
  focus(73, 'slide-8', ['s8-bx'], {
    registers: { BX: 'FFF0h' },
    flags: { CF: '0' }
  });
  range(74, 75, 'slide-8', ['s8-instr', 's8-op'], {
    registers: { BX: 'FFF0h' },
    flags: { CF: '0' }
  });
  range(76, 77, 'slide-8', ['s8-low'], {
    registers: { BX: 'FFF0h' },
    flags: { CF: '0' }
  });
  range(78, 79, 'slide-8', ['s8-extra', 's8-cf'], {
    registers: { BX: 'FFF0h' },
    flags: { CF: '1' }
  });
  range(80, 81, 'slide-8', ['s8-bx-final', 's8-cf'], {
    registers: { BX: '0010h' },
    flags: { CF: '1' }
  });

  range(82, 84, 'slide-9', ['s9-concept', 's9-of', 's9-cf'], {
    registers: { CX: '7FF0h' },
    flags: { OF: '0', CF: '0', SF: '0' }
  });
  range(85, 86, 'slide-9', ['s9-instr', 's9-cx'], {
    registers: { CX: '7FF0h' },
    flags: { OF: '0', CF: '0', SF: '0' }
  });
  range(87, 88, 'slide-9', ['s9-op'], {
    registers: { CX: '8010h' },
    flags: { OF: '0', CF: '0', SF: '1' }
  });
  range(89, 90, 'slide-9', ['s9-unsigned', 's9-cf'], {
    registers: { CX: '8010h' },
    flags: { OF: '0', CF: '0', SF: '1' }
  });
  range(91, 93, 'slide-9', ['s9-signed'], {
    registers: { CX: '8010h' },
    flags: { OF: '0', CF: '0', SF: '1' }
  });
  range(94, 96, 'slide-9', ['s9-cx-final', 's9-of', 's9-cf'], {
    registers: { CX: '8010h' },
    flags: { OF: '1', CF: '0', SF: '1' }
  });

  range(97, 99, 'slide-10', ['s10-inc', 's10-dec'], {
    registers: { DX: '00FEh' }
  });
  focus(100, 'slide-10', ['s10-dx'], {
    registers: { DX: '00FEh' },
    captions: { dxCaption: 'valor inicial' }
  });
  range(101, 102, 'slide-10', ['s10-inc', 's10-dx'], {
    registers: { DX: '00FFh' },
    captions: { dxCaption: 'después de INC DX' }
  });
  range(103, 104, 'slide-10', ['s10-dec', 's10-dx'], {
    registers: { DX: '00FEh' },
    captions: { dxCaption: 'después de DEC DX' }
  });
  focus(105, 'slide-10', ['s10-flags'], {
    registers: { DX: '00FEh' }
  });
  range(106, 107, 'slide-10', ['s10-cf'], {
    registers: { DX: '00FEh' }
  });

  range(108, 112, 'slide-11', ['s11-instr'], {
    registers: { AX: '0033h', BX: '0033h' },
    flags: { ZF: '0' }
  });
  focus(113, 'slide-11', ['s11-ax', 's11-bx'], {
    registers: { AX: '0033h', BX: '0033h' },
    flags: { ZF: '0' }
  });
  focus(114, 'slide-11', ['s11-op'], {
    registers: { AX: '0033h', BX: '0033h' },
    flags: { ZF: '0' }
  });
  focus(115, 'slide-11', ['s11-zero'], {
    registers: { AX: '0033h', BX: '0033h' },
    flags: { ZF: '0' }
  });
  focus(116, 'slide-11', ['s11-zf'], {
    registers: { AX: '0033h', BX: '0033h' },
    flags: { ZF: '1' }
  });
  focus(117, 'slide-11', ['s11-nostore'], {
    registers: { AX: '0033h', BX: '0033h' },
    flags: { ZF: '1' }
  });
  focus(118, 'slide-11', ['s11-ax', 's11-bx'], {
    registers: { AX: '0033h', BX: '0033h' },
    flags: { ZF: '1' }
  });
  range(119, 120, 'slide-11', ['s11-final'], {
    registers: { AX: '0033h', BX: '0033h' },
    flags: { ZF: '1' }
  });

  range(121, 122, 'slide-12', ['s13-read']);
  focus(123, 'slide-12', ['s13-op']);
  focus(124, 'slide-12', ['s13-dest']);
  focus(125, 'slide-12', ['s13-src']);
  focus(126, 'slide-12', ['s13-size']);
  range(127, 128, 'slide-12', ['s13-reg']);
  range(129, 131, 'slide-12', ['s13-cmp']);

  range(132, 133, 'slide-13', ['s14-rule']);
  focus(134, 'slide-13', ['s14-zf']);
  focus(135, 'slide-13', ['s14-cf']);
  focus(136, 'slide-13', ['s14-of']);
  focus(137, 'slide-13', ['s14-pf']);

  const LAST_END = 321.060;

  onMount(() => {
    const rootElement = root;
    const audioFile = theory.audioFile;
    let completionReported = completed;
    let rafId: number | null = null;

    function requireElement<T extends Element>(selector: string): T {
      const element = rootElement.querySelector(selector);
      if (!element) throw new Error(`No se encontró ${selector} en ArithmeticFlagsTheoryScreen.`);
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
        .replace(/\bcarreo\b/gi, 'acarreo')
        .replace(/\bacaseo\b/gi, 'acarreo')
        .replace(/\bconsigo\b/gi, 'con signo')
        .replace(/\bdesburlamiento\b/gi, 'desbordamiento')
        .replace(/\bvariedad del byte bajo\b/gi, 'paridad del byte bajo')
        .replace(/\blas\s+FLAC\b/gi, 'FLAGS')
        .replace(/\bFLAC\b/gi, 'FLAGS')
        .replace(/\bflags\b/gi, 'FLAGS')
        .replace(/\bcarry flag\b/gi, 'Carry Flag')
        .replace(/\bcash flag\b/gi, 'Carry Flag')
        .replace(/\bzero flag\b/gi, 'Zero Flag')
        .replace(/\boverflow flag\b/gi, 'Overflow Flag')
        .replace(/\bparity flag\b/gi, 'Parity Flag')
        .replace(/\bZero Flag significa\.?/gi, 'ZF significa Zero Flag.')
        .replace(/\bAdd\b/g, 'ADD')
        .replace(/\badd\b/gi, 'ADD')
        .replace(/\bsub\b/gi, 'SUB')
        .replace(/\bat\s+BX\b/gi, 'ADD BX')
        .replace(/INC\s*-\s*DX/gi, 'INC DX')
        .replace(/\bA\s*X\b/gi, 'AX')
        .replace(/\bB\s*X\b/gi, 'BX')
        .replace(/\bC\s*X\b/gi, 'CX')
        .replace(/\bD\s*X\b/gi, 'DX')
        .replace(/\bax\b/g, 'AX')
        .replace(/\bbx\b/g, 'BX')
        .replace(/\bcx\b/g, 'CX')
        .replace(/\bdx\b/g, 'DX')
        .replace(/valor base/gi, 'VALOR_BASE')
        .replace(/\bWord\b/g, 'word')
        .replace(/80\s*-\s*10\s*-\s*H/gi, '8010h')
        .replace(/7\s*-\s*FF\s*-\s*0\s*-\s*H/gi, '7FF0h')
        .replace(/000101\s+binario/gi, '00000101b')
        .replace(/AX vale 0002 y/gi, 'AX vale 0002h y')
        .replace(/8010h cabe en una word con signo/gi, '8010h cabe en una word')
        .replace(/\b([0-9A-F]{4,5})H\b/g, '$1h')
        .replace(/\b([0-9A-F]{2})H\b/g, '$1h')
        .replace(/\s+,/g, ',')
        .replace(/\s+\./g, '.')
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

    function setHotspots(targets: string[] = []): void {
      const active = new Set(targets);

      rootElement.querySelectorAll<HTMLElement>('[data-hotspot]').forEach((node) => {
        const keys = String(node.dataset.hotspot ?? '').split(/\s+/).filter(Boolean);
        node.classList.toggle('is-hot', keys.some((key) => active.has(key)));
      });
    }

    function setRegister(name: string, value: string): void {
      rootElement.querySelectorAll<HTMLElement>(`[data-reg="${name}"]`).forEach((node) => {
        node.textContent = value;
      });
    }

    function setFlag(name: string, value: string): void {
      rootElement.querySelectorAll<HTMLElement>(`[data-flag-value="${name}"]`).forEach((node) => {
        node.textContent = value;
      });

      rootElement.querySelectorAll<HTMLElement>(`[data-flag-card="${name}"]`).forEach((node) => {
        node.classList.toggle('flag-on', String(value) === '1');
      });
    }

    function applyState(state: VisualState = {}): void {
      if (state.registers) {
        Object.entries(state.registers).forEach(([name, value]) => setRegister(name, value));
      }
      if (state.flags) {
        Object.entries(state.flags).forEach(([name, value]) => setFlag(name, value));
      }
      if (state.captions) {
        Object.entries(state.captions).forEach(([id, value]) => {
          const node = rootElement.querySelector<HTMLElement>(`#${id}`);
          if (node) node.textContent = value;
        });
      }
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

      const focusData = cueFocus[activeCue.number] || cueFocus[1];
      setActiveSlide(focusData.slide);
      setHotspots(focusData.targets);
      applyState(focusData.state);
      setSubtitle(activeCue.text);
      statusLine.textContent = `${formatTime(current)} / ${formatTime(duration)} · ${slideNames[focusData.slide] || 'Teoría'}`;

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
      applyState({
        registers: { AX: '0028h', BX: 'FFF0h', CX: '7FF0h', DX: '00FEh' },
        flags: { ZF: '0', CF: '0', PF: '0', SF: '0', OF: '0' },
        captions: { dxCaption: 'valor inicial' }
      });
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
      setActiveSlide('slide-13');
      setHotspots(['s14-pf']);
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
<main class="app">
<header class="top">
<section class="card hero">
<div class="eyebrow">Microprocesadores · Ensamblador 8086</div>
<h1>Teoría 4 · Aritmética y FLAGS</h1>
<p class="sub">ADD, SUB, INC, DEC, CMP y actualización de ZF, CF, PF, SF y OF.</p>
<div class="progress-shell"><div class="progress-bar" id="progressBar"></div></div>
<nav aria-label="Línea de tiempo" class="timeline" id="timeline">
<button class="time-dot is-active" data-step="slide-1" type="button">Intro</button>
<button class="time-dot" data-step="slide-2" type="button">Partes</button>
<button class="time-dot" data-step="slide-3" type="button">Fuente</button>
<button class="time-dot" data-step="slide-4" type="button">ADD mem</button>
<button class="time-dot" data-step="slide-5" type="button">ADD res</button>
<button class="time-dot" data-step="slide-6" type="button">SUB</button>
<button class="time-dot" data-step="slide-7" type="button">PF</button>
<button class="time-dot" data-step="slide-8" type="button">CF</button>
<button class="time-dot" data-step="slide-9" type="button">OF</button>
<button class="time-dot" data-step="slide-10" type="button">INC/DEC</button>
<button class="time-dot" data-step="slide-11" type="button">CMP</button>
<button class="time-dot" data-step="slide-12" type="button">Método</button>
<button class="time-dot" data-step="slide-13" type="button">FLAGS</button>
</nav>
<div class="audio-error" id="audioError"></div>
</section>
</header>
<section class="slide-stage">
<article class="card slide is-active" data-slide="slide-1">
<div class="slide-head"><div><div class="slide-kicker">Paso 1</div><h2 class="slide-title">Resultado y <span>FLAGS</span></h2></div><div class="slide-number">1 / 13</div></div>
<div class="sim-stack">
<div class="sim-panel"><div class="panel-title">Depurador 8086</div>
<div class="mini-list">
<div class="mini-item" data-hotspot="s1-instr"><span class="label">Instrucción activa</span><br/>esperando ejecución</div>
<div class="mini-item" data-hotspot="s1-reg"><span class="label">Registro destino</span><br/><span class="mono">----</span></div>
<div class="mini-item" data-hotspot="s1-result"><span class="label">Resultado</span><br/>pendiente</div>
</div>
</div>
<div class="sim-panel" data-hotspot="s1-flags"><div class="panel-title">FLAGS</div>
<div class="flag-grid">
<div class="flag-card" data-hotspot="s1-zf"><div class="flag-name mono">ZF</div><div class="flag-value mono">0</div></div>
<div class="flag-card" data-hotspot="s1-cf"><div class="flag-name mono">CF</div><div class="flag-value mono">0</div></div>
<div class="flag-card" data-hotspot="s1-pf"><div class="flag-name mono">PF</div><div class="flag-value mono">0</div></div>
<div class="flag-card" data-hotspot="s1-sf"><div class="flag-name mono">SF</div><div class="flag-value mono">0</div></div>
<div class="flag-card" data-hotspot="s1-of"><div class="flag-name mono">OF</div><div class="flag-value mono">0</div></div>
</div>
</div>
</div>
</article>
<article class="card slide" data-slide="slide-2">
<div class="slide-head"><div><div class="slide-kicker">Paso 2</div><h2 class="slide-title">Leer por <span>partes</span></h2></div><div class="slide-number">2 / 13</div></div>
<div class="sim-stack">
<div class="sim-panel"><div class="panel-title">Instrucción activa</div>
<div class="code-line mono" data-hotspot="s2-full"><span class="token" data-hotspot="s2-add">ADD</span> <span class="token" data-hotspot="s2-ax">AX</span>, <span class="token" data-hotspot="s2-src">word VALOR_BASE</span></div>
</div>
<div class="compare-grid" data-hotspot="s2-parts">
<div class="compare-card" data-hotspot="s2-add"><div class="label">Operación</div><div class="value-large mono">ADD</div></div>
<div class="compare-card" data-hotspot="s2-ax"><div class="label">Destino</div><div class="value-large mono">AX</div></div>
</div>
<div class="compare-card" data-hotspot="s2-src"><div class="label">Fuente</div><div class="value-large mono">word VALOR_BASE</div></div>
</div>
</article>
<article class="card slide" data-slide="slide-3">
<div class="slide-head"><div><div class="slide-kicker">Paso 3</div><h2 class="slide-title">Fuente leída, destino <span>actualizado</span></h2></div><div class="slide-number">3 / 13</div></div>
<div class="sim-stack">
<div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono">ADD AX, word VALOR_BASE</div></div>
<div class="compare-grid">
<div class="compare-card" data-hotspot="s3-source"><div class="label">Fuente</div><div class="value-large mono">word VALOR_BASE</div><p class="note">Se lee desde memoria.</p></div>
<div class="compare-card" data-hotspot="s3-dest"><div class="label">Destino</div><div class="value-large mono">AX</div><p class="note">Recibe el resultado.</p></div>
</div>
<div class="op-small center" data-hotspot="s3-flow"><span class="mono">fuente → operación → destino</span></div>
</div>
</article>
<article class="card slide" data-slide="slide-4">
<div class="slide-head"><div><div class="slide-kicker">Paso 4</div><h2 class="slide-title"><span>ADD</span> con memoria</h2></div><div class="slide-number">4 / 13</div></div>
<div class="sim-stack"><div class="sim-panel"><div class="panel-title">Registro destino</div><div class="reg-strip"><div class="reg-card" data-hotspot="s4-ax"><div class="reg-name mono">AX</div><div class="reg-value mono" data-reg="AX">0028h</div><div class="reg-caption">valor antes de sumar</div></div></div></div><div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono" data-hotspot="s4-instr">ADD AX, word VALOR_BASE</div></div><div class="sim-panel"><div class="panel-title">Memoria fuente</div>
<div class="mem-table">
<div class="mem-row" data-hotspot="s4-mem">
<div class="mem-left"><div class="mem-name mono">VALOR_BASE</div><div class="addr mono">@0130</div></div>
<div class="bytes mono" data-hotspot="s4-bytes"><span class="byte-chip">18</span><span class="byte-chip">00</span></div>
<div class="word mono" data-hotspot="s4-word"><span>word</span><span>0018h</span></div>
</div>
</div>
</div></div>
</article>
<article class="card slide" data-slide="slide-5">
<div class="slide-head"><div><div class="slide-kicker">Paso 5</div><h2 class="slide-title">Resultado de <span>ADD</span></h2></div><div class="slide-number">5 / 13</div></div>
<div class="sim-stack"><div class="sim-panel"><div class="panel-title">Registro destino</div><div class="reg-strip"><div class="reg-card" data-hotspot="s5-ax"><div class="reg-name mono">AX</div><div class="reg-value mono" data-reg="AX">0040h</div><div class="reg-caption">destino actualizado</div></div></div></div><div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono">ADD AX, word VALOR_BASE</div></div><div class="sim-panel"><div class="panel-title">FLAGS después</div>
<div class="flag-grid">
<div class="flag-card" data-flag-card="ZF" data-hotspot="s5-zf"><div class="flag-name mono">ZF</div><div class="flag-value mono" data-flag-value="ZF">0</div></div>
<div class="flag-card" data-flag-card="CF" data-hotspot="s5-cf"><div class="flag-name mono">CF</div><div class="flag-value mono" data-flag-value="CF">0</div></div>
<div class="flag-card" data-flag-card="PF" data-hotspot="s5-pf"><div class="flag-name mono">PF</div><div class="flag-value mono" data-flag-value="PF">0</div></div>
<div class="flag-card" data-flag-card="SF" data-hotspot="s5-sf"><div class="flag-name mono">SF</div><div class="flag-value mono" data-flag-value="SF">0</div></div>
<div class="flag-card" data-flag-card="OF" data-hotspot="s5-of"><div class="flag-name mono">OF</div><div class="flag-value mono" data-flag-value="OF">0</div></div>
</div>
</div><div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s5-op"><span data-hotspot="s5-sum">0028h + 0018h</span><br/><span data-hotspot="s5-result">= 0040h</span></div></div></div>
</article>
<article class="card slide" data-slide="slide-6">
<div class="slide-head"><div><div class="slide-kicker">Paso 6</div><h2 class="slide-title"><span>SUB</span> y Zero Flag</h2></div><div class="slide-number">6 / 13</div></div>
<div class="sim-stack"><div class="sim-panel"><div class="panel-title">Registro destino</div><div class="reg-strip"><div class="reg-card" data-hotspot="s6-ax s6-ax-final"><div class="reg-name mono">AX</div><div class="reg-value mono" data-reg="AX">0040h</div><div class="reg-caption">destino de SUB</div></div></div></div><div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono" data-hotspot="s6-instr">SUB AX, 0040h</div></div><div class="sim-panel"><div class="panel-title">FLAGS después</div>
<div class="flag-grid">
<div class="flag-card" data-flag-card="ZF" data-hotspot="s6-zf"><div class="flag-name mono">ZF</div><div class="flag-value mono" data-flag-value="ZF">1</div></div>
<div class="flag-card" data-flag-card="CF" data-hotspot="s6-cf"><div class="flag-name mono">CF</div><div class="flag-value mono" data-flag-value="CF">0</div></div>
<div class="flag-card" data-flag-card="PF" data-hotspot="s6-pf"><div class="flag-name mono">PF</div><div class="flag-value mono" data-flag-value="PF">1</div></div>
<div class="flag-card" data-flag-card="SF" data-hotspot="s6-sf"><div class="flag-name mono">SF</div><div class="flag-value mono" data-flag-value="SF">0</div></div>
<div class="flag-card" data-flag-card="OF" data-hotspot="s6-of"><div class="flag-name mono">OF</div><div class="flag-value mono" data-flag-value="OF">0</div></div>
</div>
</div><div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s6-op">0040h - 0040h<br/><span data-hotspot="s6-zero">= 0000h</span></div><p class="note">SUB guarda el resultado en AX; como el resultado es cero, ZF se activa.</p></div></div>
</article>
<article class="card slide" data-slide="slide-7">
<div class="slide-head"><div><div class="slide-kicker">Paso 7</div><h2 class="slide-title"><span>PF</span> y byte bajo</h2></div><div class="slide-number">7 / 13</div></div>
<div class="sim-stack"><div class="sim-panel" data-hotspot="s7-concept"><div class="panel-title">Regla</div><div class="big">PF mide la paridad del <span class="mono">byte bajo</span>, no de toda la word.</div></div><div class="sim-panel"><div class="panel-title">Registro destino</div><div class="reg-strip"><div class="reg-card" data-hotspot="s7-ax"><div class="reg-name mono">AX</div><div class="reg-value mono" data-reg="AX">0002h</div></div></div></div><div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono" data-hotspot="s7-instr">ADD AX, 0003h</div></div><div class="sim-panel"><div class="panel-title">FLAGS después</div><div class="flag-grid"><div class="flag-card" data-flag-card="PF" data-hotspot="s7-pf"><div class="flag-name mono">PF</div><div class="flag-value mono" data-flag-value="PF">1</div></div></div></div><div class="sim-panel"><div class="panel-title">Operación interna</div>
<div class="op-box mono" data-hotspot="s7-op">0002h + 0003h = 0005h</div>
<div style="height:8px"></div>
<div class="compare-grid">
<div class="compare-card" data-hotspot="s7-al"><div class="label">Byte bajo</div><div class="value-large mono">AL = 05h</div></div>
<div class="compare-card" data-hotspot="s7-bin"><div class="label">Bits</div><div class="value-large mono">00000101b</div><p class="note">dos bits en 1</p></div>
</div>
</div></div>
</article>
<article class="card slide" data-slide="slide-8">
<div class="slide-head"><div><div class="slide-kicker">Paso 8</div><h2 class="slide-title"><span>CF</span> y 16 bits</h2></div><div class="slide-number">8 / 13</div></div>
<div class="sim-stack"><div class="sim-panel" data-hotspot="s8-concept"><div class="panel-title">Carry Flag</div><div class="big">CF detecta acarreo en operaciones sin signo.</div></div><div class="sim-panel"><div class="panel-title">Registro destino</div><div class="reg-strip"><div class="reg-card" data-hotspot="s8-bx s8-bx-final"><div class="reg-name mono">BX</div><div class="reg-value mono" data-reg="BX">FFF0h</div></div></div></div><div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono" data-hotspot="s8-instr">ADD BX, 0020h</div></div><div class="sim-panel"><div class="panel-title">FLAGS después</div><div class="flag-grid"><div class="flag-card" data-flag-card="CF" data-hotspot="s8-cf"><div class="flag-name mono">CF</div><div class="flag-value mono" data-flag-value="CF">1</div></div></div></div><div class="sim-panel"><div class="panel-title">Operación interna</div>
<div class="equation-row">
<div class="op-box mono" data-hotspot="s8-op">FFF0h + 0020h = 10010h</div>
<div class="compare-grid">
<div class="compare-card" data-hotspot="s8-low"><div class="label">16 bits bajos</div><div class="value-large mono">0010h</div></div>
<div class="compare-card" data-hotspot="s8-extra"><div class="label">Bit externo</div><div class="value-large mono">1</div></div>
</div>
</div>
</div></div>
</article>
<article class="card slide" data-slide="slide-9">
<div class="slide-head"><div><div class="slide-kicker">Paso 9</div><h2 class="slide-title"><span>OF</span> con signo</h2></div><div class="slide-number">9 / 13</div></div>
<div class="sim-stack"><div class="sim-panel" data-hotspot="s9-concept"><div class="panel-title">Overflow Flag</div><div class="big">OF se interpreta con números con signo. No equivale a CF.</div></div><div class="sim-panel"><div class="panel-title">Registro destino</div><div class="reg-strip"><div class="reg-card" data-hotspot="s9-cx s9-cx-final"><div class="reg-name mono">CX</div><div class="reg-value mono" data-reg="CX">7FF0h</div></div></div></div><div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono" data-hotspot="s9-instr">ADD CX, 0020h</div></div><div class="sim-panel"><div class="panel-title">FLAGS después</div>
<div class="flag-grid">
<div class="flag-card" data-flag-card="OF" data-hotspot="s9-of"><div class="flag-name mono">OF</div><div class="flag-value mono" data-flag-value="OF">1</div></div>
<div class="flag-card" data-flag-card="CF" data-hotspot="s9-cf"><div class="flag-name mono">CF</div><div class="flag-value mono" data-flag-value="CF">0</div></div>
<div class="flag-card" data-flag-card="SF" data-hotspot="s9-sf"><div class="flag-name mono">SF</div><div class="flag-value mono" data-flag-value="SF">1</div></div>
</div>
</div><div class="sim-panel"><div class="panel-title">Operación interna</div>
<div class="op-box mono" data-hotspot="s9-op">7FF0h + 0020h = 8010h</div>
<div style="height:8px"></div>
<div class="compare-grid">
<div class="compare-card" data-hotspot="s9-unsigned"><div class="label">Sin signo</div><div class="value-large mono">8010h</div><p class="note">cabe en una word.</p></div>
<div class="compare-card" data-hotspot="s9-signed"><div class="label">Con signo</div><div class="value-large mono">+ → −</div><p class="note">cambia de rango.</p></div>
</div>
</div></div>
</article>
<article class="card slide" data-slide="slide-10">
<div class="slide-head"><div><div class="slide-kicker">Paso 10</div><h2 class="slide-title"><span>INC</span>, <span>DEC</span> y CF</h2></div><div class="slide-number">10 / 13</div></div>
<div class="sim-stack"><div class="sim-panel"><div class="panel-title">Registro destino</div><div class="reg-strip"><div class="reg-card" data-hotspot="s10-dx"><div class="reg-name mono">DX</div><div class="reg-value mono" data-reg="DX">00FEh</div><div class="reg-caption" id="dxCaption">valor inicial</div></div></div></div><div class="sim-panel"><div class="panel-title">Instrucciones activas</div><div class="code-line mono"><span data-hotspot="s10-inc">INC DX</span><br/><span data-hotspot="s10-dec">DEC DX</span></div></div><div class="sim-panel"><div class="panel-title">FLAGS</div>
<div class="compare-grid">
<div class="compare-card" data-hotspot="s10-flags"><div class="label">Se recalculan</div><div class="value-large mono">ZF PF SF OF</div></div>
<div class="compare-card" data-hotspot="s10-cf"><div class="label">Sin cambio</div><div class="value-large mono">CF</div><p class="note">conserva su valor anterior.</p></div>
</div>
</div><div class="sim-panel"><div class="panel-title">Operación interna</div><div class="mini-list"><div class="mini-item"><span class="mono">INC DX</span> → DX = DX + 1</div><div class="mini-item"><span class="mono">DEC DX</span> → DX = DX - 1</div></div></div></div>
</article>
<article class="card slide" data-slide="slide-11">
<div class="slide-head"><div><div class="slide-kicker">Paso 11</div><h2 class="slide-title"><span>CMP</span> resta internamente</h2></div><div class="slide-number">11 / 13</div></div>
<div class="sim-stack"><div class="sim-panel"><div class="panel-title">Registros usados</div>
<div class="reg-strip cols-2">
<div class="reg-card" data-hotspot="s11-ax"><div class="reg-name mono">AX</div><div class="reg-value mono" data-reg="AX">0033h</div></div>
<div class="reg-card" data-hotspot="s11-bx"><div class="reg-name mono">BX</div><div class="reg-value mono" data-reg="BX">0033h</div></div>
</div>
</div><div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono" data-hotspot="s11-instr">CMP AX, BX</div></div><div class="sim-panel"><div class="panel-title">FLAGS después</div><div class="flag-grid"><div class="flag-card" data-flag-card="ZF" data-hotspot="s11-zf"><div class="flag-name mono">ZF</div><div class="flag-value mono" data-flag-value="ZF">1</div></div></div></div><div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s11-op">0033h - 0033h<br/><span data-hotspot="s11-zero">= 0000h</span></div><p class="note" data-hotspot="s11-nostore">El resultado interno se usa solo para FLAGS.</p><div style="height:8px"></div><div class="info-card" data-hotspot="s11-final"><div class="label">Estado final</div><div class="big">La comparación queda en <span class="mono">FLAGS</span>, no en los registros.</div></div></div></div>
</article>
<article class="card slide" data-slide="slide-12">
<div class="slide-head"><div><div class="slide-kicker">Paso 12</div><h2 class="slide-title">Método de <span>resolución</span></h2></div><div class="slide-number">12 / 13</div></div>
<div class="sim-stack">
<div class="method">
<div class="method-row" data-hotspot="s13-read"><div class="badge">1</div><div>Leer cada instrucción en orden.</div></div>
<div class="method-row" data-hotspot="s13-op"><div class="badge">2</div><div>Identificar la operación.</div></div>
<div class="method-row" data-hotspot="s13-dest"><div class="badge">3</div><div>Identificar el destino.</div></div>
<div class="method-row" data-hotspot="s13-src"><div class="badge">4</div><div>Identificar la fuente.</div></div>
<div class="method-row" data-hotspot="s13-size"><div class="badge">5</div><div>Calcular con tamaño correcto: <span class="mono">byte</span> o <span class="mono">word</span>.</div></div>
</div>
<div class="compare-grid">
<div class="compare-card" data-hotspot="s13-reg"><div class="label">Destino registro</div><div class="big">puede cambiar</div></div>
<div class="compare-card" data-hotspot="s13-cmp"><div class="label">CMP</div><div class="big">no cambia registros</div></div>
</div>
</div>
</article>
<article class="card slide" data-slide="slide-13">
<div class="slide-head"><div><div class="slide-kicker">Paso 13</div><h2 class="slide-title">Leer FLAGS <span>después</span></h2></div><div class="slide-number">13 / 13</div></div>
<div class="sim-stack">
<div class="sim-panel" data-hotspot="s14-rule"><div class="panel-title">Regla final</div><div class="big">FLAGS se revisa después de la operación.</div></div>
<div class="mini-list">
<div class="mini-item" data-hotspot="s14-zf"><span class="mono" style="color:var(--accent);font-weight:950">ZF</span> → resultado cero</div>
<div class="mini-item" data-hotspot="s14-cf"><span class="mono" style="color:var(--accent);font-weight:950">CF</span> → acarreo sin signo</div>
<div class="mini-item" data-hotspot="s14-of"><span class="mono" style="color:var(--accent);font-weight:950">OF</span> → desbordamiento con signo</div>
<div class="mini-item" data-hotspot="s14-pf"><span class="mono" style="color:var(--accent);font-weight:950">PF</span> → paridad del byte bajo</div>
</div>
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
<button aria-label="Reiniciar" class="secondary" id="resetBtn" type="button">↺</button>
</div>
<button class="primary final-action" id="practiceBtn" type="button">Iniciar práctica</button>
<div class="status-line" id="statusLine">Audio esperado: <span class="mono">teoria4.mp3</span></div>
</div>
</footer>
<audio id="audio" preload="metadata"></audio>
</div>

<style>

  .theory-root {
    --bg: #0f1117;
    --panel: #181d28;
    --panel-2: #1f2532;
    --panel-3: #111722;
    --line: #2e3748;
    --text: #f4f6fb;
    --muted: #aeb6c5;
    --soft: #c8d0df;
    --accent: #f4c542;
    --accent-soft: rgba(244,197,66,.13);
    --accent-line: rgba(244,197,66,.74);
    --danger: #ef5350;
    --ok: #2fbf71;
  }

  * { box-sizing: border-box; }
  button { font: inherit; -webkit-tap-highlight-color: transparent; }
  h1, h2, p { margin: 0; }

  .app {
    width: 100%;
    max-width: 500px;
    min-height: 100dvh;
    margin: 0 auto;
    padding: 12px;
    padding-bottom: 188px;
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
    box-shadow: 0 16px 32px rgba(0,0,0,.26);
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
    background: rgba(31, 37, 50, .62);
    border-radius: 18px;
    padding: 12px;
  }
  .panel-title {
    color: #c9d3ff;
    font-size: 12px;
    font-weight: 900;
    margin-bottom: 8px;
  }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; }
  .note { color: var(--muted); font-size: 12.5px; line-height: 1.32; margin-top: 7px; }
  .big { font-size: 16px; line-height: 1.28; font-weight: 850; }
  .center { text-align: center; }

  [data-hotspot] {
    transition: border-color .16s ease, background .16s ease, box-shadow .16s ease, transform .16s ease, color .16s ease;
  }
  [data-hotspot]:global(.is-hot) {
    border-color: var(--accent-line) !important;
    background-color: var(--accent-soft) !important;
    box-shadow: 0 0 0 1px rgba(244,197,66,.14), 0 0 22px rgba(244,197,66,.11);
    transform: translateY(-1px);
  }
  .token:global(.is-hot), .reg-value:global(.is-hot) { color: var(--accent); }

  .code-line {
    width: 100%;
    overflow: hidden;
    border: 1px solid var(--line);
    background: var(--panel-3);
    border-radius: 15px;
    padding: 11px;
    color: var(--text);
    font-size: clamp(14px, 4.4vw, 20px);
    line-height: 1.24;
    font-weight: 950;
    letter-spacing: -.035em;
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
  .reg-strip { display: grid; gap: 8px; }
  .reg-strip.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .reg-card {
    min-height: 70px;
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .86);
    border-radius: 16px;
    padding: 10px;
    display: grid;
    align-content: center;
  }
  .reg-name { color: #c9d3ff; font-size: 12px; font-weight: 950; letter-spacing: .08em; }
  .reg-value { margin-top: 5px; font-size: clamp(24px, 7.5vw, 34px); line-height: 1; font-weight: 950; letter-spacing: .03em; }
  .reg-caption { color: var(--muted); font-size: 11px; margin-top: 4px; font-weight: 800; }

  .flag-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
  .flag-card {
    min-width: 0;
    border: 1px solid var(--line);
    background: rgba(17,23,34,.86);
    border-radius: 14px;
    padding: 8px 4px;
    text-align: center;
  }
  .flag-name { color: #c9d3ff; font-size: 11px; font-weight: 950; letter-spacing: .08em; }
  .flag-value { margin-top: 3px; font-size: 21px; font-weight: 950; line-height: 1; }
  .flag-card:global(.flag-on) {
    border-color: var(--accent-line);
    background: var(--accent-soft);
  }
  .flag-card:global(.flag-on) .flag-value { color: var(--accent); }

  .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
  .compare-card, .info-card {
    border: 1px solid var(--line);
    background: rgba(17,23,34,.82);
    border-radius: 16px;
    padding: 10px;
  }
  .label { color: var(--muted); font-size: 10px; font-weight: 950; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 5px; }
  .value-large { font-size: clamp(18px, 5.8vw, 26px); font-weight: 950; line-height: 1.05; }

  .op-box {
    border: 1px solid var(--line);
    background: rgba(17,23,34,.86);
    border-radius: 16px;
    padding: 12px;
    text-align: center;
    font-size: clamp(19px, 6vw, 28px);
    line-height: 1.15;
    font-weight: 950;
  }
  .op-small {
    border: 1px solid var(--line);
    background: rgba(17,23,34,.86);
    border-radius: 15px;
    padding: 10px;
    font-size: 15px;
    line-height: 1.3;
    font-weight: 850;
  }
  .equation-row { display: grid; gap: 7px; }

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

  .method { display: grid; gap: 9px; }
  .method-row {
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--line);
    background: rgba(17,23,34,.86);
    border-radius: 16px;
    padding: 10px;
  }
  .badge {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    background: rgba(244,197,66,.12);
    border: 1px solid rgba(244,197,66,.32);
    color: var(--accent);
    font-weight: 950;
  }
  .mini-list { display: grid; gap: 8px; }
  .mini-item {
    border: 1px solid var(--line);
    background: rgba(17,23,34,.86);
    border-radius: 15px;
    padding: 10px;
    font-size: 14px;
    line-height: 1.25;
    font-weight: 850;
  }

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
    .compare-grid, .reg-strip.cols-2 { grid-template-columns: 1fr; }
    .flag-grid { grid-template-columns: repeat(5, minmax(42px, 1fr)); gap: 5px; }
    .flag-card { padding: 7px 3px; }
    .flag-value { font-size: 19px; }
    .method-row { grid-template-columns: 36px 1fr; gap: 8px; padding: 9px; }
    .badge { width: 36px; height: 36px; }
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
  }

  @media (max-height: 720px) {
    .slide { min-height: auto; }
    .sim-panel { padding: 10px; }
    .reg-card { min-height: 62px; }
    .slide-title { font-size: 20px; }
    .footer-dock { padding-top: 18px; }
  }

  .subtitle[hidden] { display: none; }

  .cc-button:global(.is-active) {
    color: var(--accent);
    border-color: var(--accent-line);
    background: var(--accent-soft);
  }

</style>
