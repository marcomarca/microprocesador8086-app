<script lang="ts">
  // @ts-nocheck
  import { onMount } from 'svelte';
  import type { TheoryLesson } from '../../types';
  import { createSubtitleToggle } from './subtitleToggle';

  export let theory: TheoryLesson;
  export let completed = false;
  export let onComplete: (theory: TheoryLesson) => void = () => undefined;
  export let onStartExercise: (exerciseId: string) => void = () => undefined;

  let root: HTMLDivElement;

  const SRT_SOURCE = `1
00:00:00,000 --> 00:00:02,500
Un registro no siempre se usa solo para

2
00:00:02,500 --> 00:00:03,480
guardar un número.

3
00:00:03,480 --> 00:00:06,240
También puede guardar una dirección de memoria.

4
00:00:06,240 --> 00:00:08,700
Cuando un registro guarda una dirección,

5
00:00:08,700 --> 00:00:11,000
decimos que funciona como puntero.

6
00:00:11,000 --> 00:00:11,940
Por ejemplo,

7
00:00:11,940 --> 00:00:15,720
si SI contiene 0120h,

8
00:00:15,720 --> 00:00:18,280
ese valor puede indicar una posición dentro de

9
00:00:18,280 --> 00:00:19,000
la memoria.

10
00:00:19,000 --> 00:00:21,280
La diferencia importante es esta.

11
00:00:21,320 --> 00:00:24,760
SI representa el valor guardado dentro del registro,

12
00:00:24,760 --> 00:00:25,560
pero...

13
00:00:25,560 --> 00:00:29,880
[SI] representa la memoria ubicada en la

14
00:00:29,880 --> 00:00:31,560
dirección que contiene SI.

15
00:00:31,560 --> 00:00:37,400
Entonces SI puede valer 0120h.

16
00:00:37,400 --> 00:00:41,440
word [SI] puede referirse al contenido guardado en

17
00:00:41,440 --> 00:00:44,020
la dirección 0120h.

18
00:00:44,060 --> 00:00:46,580
Los corchetes cambian el significado.

19
00:00:46,640 --> 00:00:49,380
Sin corchetes trabajamos con el registro.

20
00:00:49,380 --> 00:00:52,360
Con corchetes usamos el registro como dirección de

21
00:00:52,360 --> 00:00:52,960
memoria.

22
00:00:53,000 --> 00:00:56,400
Ahora pensemos en un arreglo declarado con DW.

23
00:00:56,840 --> 00:00:58,180
En memoria,

24
00:00:58,180 --> 00:01:00,440
eso equivale a dos bytes consecutivos.

25
00:01:00,440 --> 00:01:01,160
Por eso,

26
00:01:01,160 --> 00:01:04,780
si un arreglo empieza en 0120h,

27
00:01:04,780 --> 00:01:08,340
el siguiente elemento no empieza en 0121h,

28
00:01:08,340 --> 00:01:11,320
empieza en 0122h,

29
00:01:11,320 --> 00:01:15,240
y el siguiente empieza en 0124h.

30
00:01:15,240 --> 00:01:17,820
Cada elemento avanza dos posiciones de memoria.

31
00:01:17,820 --> 00:01:20,620
Para cargar la dirección inicial de un arreglo,

32
00:01:20,620 --> 00:01:21,940
usamos offset.

33
00:01:21,940 --> 00:01:22,900
Por ejemplo,

34
00:01:23,040 --> 00:01:25,900
MOV SI, offset TABLA_VALORES.

35
00:01:25,920 --> 00:01:28,680
Esta instrucción no carga el primer dato del

36
00:01:28,680 --> 00:01:29,340
arreglo,

37
00:01:29,340 --> 00:01:31,960
carga la dirección donde empieza el arreglo.

38
00:01:31,980 --> 00:01:33,460
Después de esa instrucción,

39
00:01:33,460 --> 00:01:35,480
SI contiene la dirección inicial.

40
00:01:35,500 --> 00:01:40,760
Si TABLA_VALORES empieza en 0120h,

41
00:01:40,860 --> 00:01:44,560
entonces SI queda con 0120h.

42
00:01:44,900 --> 00:01:48,180
Ahora sí podemos leer el dato apuntado por

43
00:01:48,180 --> 00:01:48,620
SI.

44
00:01:48,660 --> 00:01:50,900
La instrucción MOV AX,

45
00:01:50,960 --> 00:01:55,700
word [SI] lee una word desde memoria.

46
00:01:55,700 --> 00:01:58,680
Primero toma el valor de SI como dirección,

47
00:01:58,680 --> 00:02:01,380
luego busca la word ubicada en esa dirección

48
00:02:01,380 --> 00:02:04,380
y finalmente copia esa word hacia AX.

49
00:02:04,380 --> 00:02:08,580
Si SI vale 0120h,

50
00:02:08,700 --> 00:02:12,840
entonces word [SI] lee la memoria que

51
00:02:12,840 --> 00:02:15,600
empieza en 0120h.

52
00:02:15,700 --> 00:02:19,260
AX no recibe 0120h.

53
00:02:19,260 --> 00:02:22,760
AX recibe el contenido guardado en esa posición.

54
00:02:22,920 --> 00:02:24,740
Aquí aparece un error común.

55
00:02:24,840 --> 00:02:28,160
Como la memoria se organiza byte por byte,

56
00:02:28,160 --> 00:02:31,340
podría parecer que para avanzar basta sumar 1.

57
00:02:31,440 --> 00:02:35,260
Pero si estamos recorriendo elementos DW,

58
00:02:35,260 --> 00:02:38,240
sumar 1 produce una dirección intermedia.

59
00:02:38,240 --> 00:02:41,260
Eso puede hacer que se lean bytes mezclados

60
00:02:41,260 --> 00:02:42,780
de dos elementos distintos.

61
00:02:43,050 --> 00:02:46,470
Para avanzar correctamente dentro de un arreglo DW,

62
00:02:46,470 --> 00:02:47,730
se suma 2.

63
00:02:47,730 --> 00:02:49,330
ADD SI,

64
00:02:49,330 --> 00:02:50,010
2.

65
00:02:50,010 --> 00:02:52,530
Mueve el puntero al siguiente elemento del tipo

66
00:02:52,530 --> 00:02:53,110
word.

67
00:02:53,310 --> 00:02:56,950
Si SI estaba en 0120h,

68
00:02:56,950 --> 00:03:00,030
después queda en 0122h.

69
00:03:00,030 --> 00:03:00,670
Ahora,

70
00:03:00,670 --> 00:03:04,150
[SI] apunta al segundo elemento del arreglo.

71
00:03:04,170 --> 00:03:07,630
También podemos usar este acceso indirecto dentro de

72
00:03:07,630 --> 00:03:09,010
operaciones aritméticas.

73
00:03:09,010 --> 00:03:09,770
Por ejemplo,

74
00:03:09,770 --> 00:03:10,500
ADD...

75
00:03:10,500 --> 00:03:11,100
AX,

76
00:03:11,100 --> 00:03:11,880
word,

77
00:03:11,880 --> 00:03:12,940
[SI].

78
00:03:12,940 --> 00:03:14,440
En esta instrucción,

79
00:03:14,440 --> 00:03:15,960
AX es el destino.

80
00:03:15,960 --> 00:03:16,620
word,

81
00:03:16,620 --> 00:03:17,660
[SI],

82
00:03:17,660 --> 00:03:18,620
es la fuente.

83
00:03:18,800 --> 00:03:22,320
La CPU lee la word apuntada por SI.

84
00:03:22,360 --> 00:03:24,820
Luego suma ese valor a AX.

85
00:03:24,820 --> 00:03:27,220
El resultado queda guardado en AX.

86
00:03:27,220 --> 00:03:30,500
No se suma el número 0122h.

87
00:03:30,500 --> 00:03:32,780
Se suma el contenido de la memoria ubicada

88
00:03:32,780 --> 00:03:34,460
en 0122h.

89
00:03:34,740 --> 00:03:37,920
También es posible copiar una dirección entre registros.

90
00:03:37,920 --> 00:03:39,320
MOV BX,

91
00:03:39,320 --> 00:03:40,140
SI.

92
00:03:40,140 --> 00:03:43,080
Copia el valor de SI dentro de BX.

93
00:03:43,080 --> 00:03:45,380
Esa operación no borra SI.

94
00:03:45,380 --> 00:03:48,220
Solo duplica la dirección en otro registro.

95
00:03:48,460 --> 00:03:49,240
Después,

96
00:03:49,300 --> 00:03:52,640
BX también puede funcionar como puntero.

97
00:03:52,640 --> 00:03:55,040
Si hacemos ADD BX,

98
00:03:55,040 --> 00:03:55,740
2.

99
00:03:55,740 --> 00:03:58,800
BX avanza hacia otro elemento de word.

100
00:03:59,400 --> 00:04:00,840
SI queda igual.

101
00:04:00,880 --> 00:04:02,580
BX cambia.

102
00:04:02,630 --> 00:04:05,970
Esto permite tener dos referencias distintas dentro de

103
00:04:05,970 --> 00:04:07,470
la misma zona de memoria.

104
00:04:07,470 --> 00:04:09,810
Cuando escribimos ADD AX,

105
00:04:09,810 --> 00:04:11,690
word [BX],

106
00:04:11,690 --> 00:04:13,430
ocurre la misma lógica.

107
00:04:13,430 --> 00:04:15,110
BX contiene una dirección,

108
00:04:15,110 --> 00:04:18,250
[BX] accede a la memoria apuntada por

109
00:04:18,250 --> 00:04:19,110
esa dirección,

110
00:04:19,110 --> 00:04:22,150
y word indica que se leen dos bytes

111
00:04:22,150 --> 00:04:23,350
como una palabra.

112
00:04:23,350 --> 00:04:26,050
El valor leído se suma a AX.

113
00:04:26,050 --> 00:04:28,890
Hasta ahora hemos usado punteros para leer,

114
00:04:28,890 --> 00:04:31,570
pero también pueden usarse para escribir.

115
00:04:31,570 --> 00:04:35,300
Para eso podemos preparar otro registro como DI.

116
00:04:35,420 --> 00:04:37,020
MOV DI,

117
00:04:37,020 --> 00:04:40,720
offset RESULTADO_TEMP carga en DI la dirección

118
00:04:40,720 --> 00:04:42,020
de una variable destino.

119
00:04:42,020 --> 00:04:45,520
DI no recibe el contenido de RESULTADO_TEMP,

120
00:04:45,520 --> 00:04:47,320
recibe su dirección.

121
00:04:47,360 --> 00:04:51,640
Luego podemos escribir MOV word [DI],

122
00:04:51,640 --> 00:04:52,460
AX.

123
00:04:52,460 --> 00:04:55,460
Aquí el destino es word [DI].

124
00:04:55,460 --> 00:04:57,580
Eso significa que no cambia DI,

125
00:04:57,580 --> 00:05:00,220
cambia la memoria apuntada por DI.

126
00:05:00,280 --> 00:05:01,960
AX es la fuente.

127
00:05:01,960 --> 00:05:04,760
La word guardada en AX se copia hacia

128
00:05:04,760 --> 00:05:06,780
la dirección indicada por DI.

129
00:05:06,780 --> 00:05:09,880
Si AX contiene 0020h,

130
00:05:09,880 --> 00:05:13,220
la memoria destino queda con la word 0020h.

131
00:05:13,280 --> 00:05:16,840
Como el 8086 usa little endian,

132
00:05:16,840 --> 00:05:19,320
físicamente se guarda primero el byte bajo y

133
00:05:19,320 --> 00:05:20,520
después el byte alto.

134
00:05:20,640 --> 00:05:23,940
Para resolver ejercicios con direccionamiento indirecto,

135
00:05:23,940 --> 00:05:25,260
conviene seguir un método.

136
00:05:25,520 --> 00:05:26,560
Primero,

137
00:05:26,560 --> 00:05:28,200
identifica si aparece offset.

138
00:05:28,200 --> 00:05:29,760
Si aparece...

139
00:05:29,760 --> 00:05:31,680
Se está cargando una dirección.

140
00:05:31,920 --> 00:05:32,640
Segundo,

141
00:05:32,640 --> 00:05:34,160
revisa si hay corchetes.

142
00:05:34,160 --> 00:05:37,000
Si hay [SI],

143
00:05:37,000 --> 00:05:38,100
[BX] o [DI],

144
00:05:38,100 --> 00:05:39,920
se está accediendo a la memoria.

145
00:05:40,040 --> 00:05:40,740
Tercero,

146
00:05:40,740 --> 00:05:42,020
revisa el tamaño del dato.

147
00:05:42,020 --> 00:05:43,880
Si es una DW o word,

148
00:05:43,880 --> 00:05:47,600
el avance correcto entre elementos es 2 bytes.

149
00:05:47,660 --> 00:05:48,380
Y cuarto,

150
00:05:48,380 --> 00:05:49,500
identifica el destino.

151
00:05:49,500 --> 00:05:51,040
Si el destino es un registro,

152
00:05:51,480 --> 00:05:52,860
el registro cambiará.

153
00:05:53,000 --> 00:05:56,280
Si el destino es [registro],

154
00:05:56,280 --> 00:05:59,120
cambia la memoria apuntada por ese registro.`;

  type Cue = { number: number; start: number; end: number; text: string };
  type CueFocus = {
    slide: string;
    targets: string[];
  };

  const cueFocus: Record<number, CueFocus> = {
  1: { slide: 'slide-1', targets: ['s1-idea'] },
  2: { slide: 'slide-1', targets: ['s1-idea'] },
  3: { slide: 'slide-1', targets: ['s1-idea'] },
  4: { slide: 'slide-1', targets: ['s1-pointer', 's1-si'] },
  5: { slide: 'slide-1', targets: ['s1-pointer', 's1-si'] },
  6: { slide: 'slide-1', targets: ['s1-si', 's1-memory'] },
  7: { slide: 'slide-1', targets: ['s1-si', 's1-memory'] },
  8: { slide: 'slide-1', targets: ['s1-si', 's1-memory'] },
  9: { slide: 'slide-1', targets: ['s1-si', 's1-memory'] },
  10: { slide: 'slide-2', targets: ['s2-si'] },
  11: { slide: 'slide-2', targets: ['s2-si'] },
  12: { slide: 'slide-2', targets: ['s2-si'] },
  13: { slide: 'slide-2', targets: ['s2-bracket', 's2-memory'] },
  14: { slide: 'slide-2', targets: ['s2-bracket', 's2-memory'] },
  15: { slide: 'slide-2', targets: ['s2-bracket', 's2-memory'] },
  16: { slide: 'slide-2', targets: ['s2-bracket', 's2-memory'] },
  17: { slide: 'slide-2', targets: ['s2-bracket', 's2-memory'] },
  18: { slide: 'slide-2', targets: ['s2-rule', 's2-si', 's2-bracket'] },
  19: { slide: 'slide-2', targets: ['s2-rule', 's2-si', 's2-bracket'] },
  20: { slide: 'slide-2', targets: ['s2-rule', 's2-si', 's2-bracket'] },
  21: { slide: 'slide-2', targets: ['s2-rule', 's2-si', 's2-bracket'] },
  22: { slide: 'slide-3', targets: ['s3-dw', 's3-two', 's3-decl'] },
  23: { slide: 'slide-3', targets: ['s3-dw', 's3-two', 's3-decl'] },
  24: { slide: 'slide-3', targets: ['s3-dw', 's3-two', 's3-decl'] },
  25: { slide: 'slide-3', targets: ['s3-two', 's3-addr0', 's3-addr1', 's3-addr2'] },
  26: { slide: 'slide-3', targets: ['s3-two', 's3-addr0', 's3-addr1', 's3-addr2'] },
  27: { slide: 'slide-3', targets: ['s3-two', 's3-addr0', 's3-addr1', 's3-addr2'] },
  28: { slide: 'slide-3', targets: ['s3-two', 's3-addr0', 's3-addr1', 's3-addr2'] },
  29: { slide: 'slide-3', targets: ['s3-two', 's3-addr0', 's3-addr1', 's3-addr2'] },
  30: { slide: 'slide-3', targets: ['s3-two', 's3-addr0', 's3-addr1', 's3-addr2'] },
  31: { slide: 'slide-4', targets: ['s4-mov', 's4-si', 's4-offset'] },
  32: { slide: 'slide-4', targets: ['s4-mov', 's4-si', 's4-offset'] },
  33: { slide: 'slide-4', targets: ['s4-mov', 's4-si', 's4-offset'] },
  34: { slide: 'slide-4', targets: ['s4-mov', 's4-si', 's4-offset'] },
  35: { slide: 'slide-4', targets: ['s4-offset', 's4-memory', 's4-op'] },
  36: { slide: 'slide-4', targets: ['s4-offset', 's4-memory', 's4-op'] },
  37: { slide: 'slide-4', targets: ['s4-offset', 's4-memory', 's4-op'] },
  38: { slide: 'slide-4', targets: ['s4-reg', 's4-memory'] },
  39: { slide: 'slide-4', targets: ['s4-reg', 's4-memory'] },
  40: { slide: 'slide-4', targets: ['s4-reg', 's4-memory'] },
  41: { slide: 'slide-4', targets: ['s4-reg', 's4-memory'] },
  42: { slide: 'slide-5', targets: ['s5-mov', 's5-ax-token', 's5-bracket', 's5-si'] },
  43: { slide: 'slide-5', targets: ['s5-mov', 's5-ax-token', 's5-bracket', 's5-si'] },
  44: { slide: 'slide-5', targets: ['s5-mov', 's5-ax-token', 's5-bracket', 's5-si'] },
  45: { slide: 'slide-5', targets: ['s5-mov', 's5-ax-token', 's5-bracket', 's5-si'] },
  46: { slide: 'slide-5', targets: ['s5-bracket', 's5-word', 's5-op'] },
  47: { slide: 'slide-5', targets: ['s5-bracket', 's5-word', 's5-op'] },
  48: { slide: 'slide-5', targets: ['s5-bracket', 's5-word', 's5-op'] },
  49: { slide: 'slide-5', targets: ['s5-si', 's5-memory'] },
  50: { slide: 'slide-5', targets: ['s5-si', 's5-memory'] },
  51: { slide: 'slide-5', targets: ['s5-si', 's5-memory'] },
  52: { slide: 'slide-5', targets: ['s5-ax', 's5-word', 's5-op'] },
  53: { slide: 'slide-5', targets: ['s5-ax', 's5-word', 's5-op'] },
  54: { slide: 'slide-6', targets: ['s6-error', 's6-reg', 's6-byte-0121', 's6-byte-0122', 's6-cross-read'] },
  55: { slide: 'slide-6', targets: ['s6-error', 's6-reg', 's6-byte-0121', 's6-byte-0122', 's6-cross-read'] },
  56: { slide: 'slide-6', targets: ['s6-error', 's6-reg', 's6-byte-0121', 's6-byte-0122', 's6-cross-read'] },
  57: { slide: 'slide-6', targets: ['s6-error', 's6-reg', 's6-byte-0121', 's6-byte-0122', 's6-cross-read'] },
  58: { slide: 'slide-6', targets: ['s6-error', 's6-reg', 's6-byte-0121', 's6-byte-0122', 's6-cross-read'] },
  59: { slide: 'slide-6', targets: ['s6-byte-0121', 's6-byte-0122', 's6-cross-read'] },
  60: { slide: 'slide-6', targets: ['s6-byte-0121', 's6-byte-0122', 's6-cross-read'] },
  61: { slide: 'slide-6', targets: ['s6-instr', 's6-reg'] },
  62: { slide: 'slide-6', targets: ['s6-instr', 's6-reg'] },
  63: { slide: 'slide-6', targets: ['s6-instr', 's6-reg'] },
  64: { slide: 'slide-6', targets: ['s6-instr', 's6-reg'] },
  65: { slide: 'slide-6', targets: ['s6-instr', 's6-reg'] },
  66: { slide: 'slide-6', targets: ['s6-instr', 's6-reg'] },
  67: { slide: 'slide-6', targets: ['s6-reg', 's6-next'] },
  68: { slide: 'slide-6', targets: ['s6-reg', 's6-next'] },
  69: { slide: 'slide-6', targets: ['s6-reg', 's6-next'] },
  70: { slide: 'slide-6', targets: ['s6-reg', 's6-next'] },
  71: { slide: 'slide-7', targets: ['s7-add', 's7-ax-token', 's7-source', 's7-ax', 's7-si'] },
  72: { slide: 'slide-7', targets: ['s7-add', 's7-ax-token', 's7-source', 's7-ax', 's7-si'] },
  73: { slide: 'slide-7', targets: ['s7-add', 's7-ax-token', 's7-source', 's7-ax', 's7-si'] },
  74: { slide: 'slide-7', targets: ['s7-add', 's7-ax-token', 's7-source', 's7-ax', 's7-si'] },
  75: { slide: 'slide-7', targets: ['s7-add', 's7-ax-token', 's7-source', 's7-ax', 's7-si'] },
  76: { slide: 'slide-7', targets: ['s7-add', 's7-ax-token', 's7-source', 's7-ax', 's7-si'] },
  77: { slide: 'slide-7', targets: ['s7-add', 's7-ax-token', 's7-source', 's7-ax', 's7-si'] },
  78: { slide: 'slide-7', targets: ['s7-add', 's7-ax-token', 's7-source', 's7-ax', 's7-si'] },
  79: { slide: 'slide-7', targets: ['s7-add', 's7-ax-token', 's7-source', 's7-ax', 's7-si'] },
  80: { slide: 'slide-7', targets: ['s7-add', 's7-ax-token', 's7-source', 's7-ax', 's7-si'] },
  81: { slide: 'slide-7', targets: ['s7-add', 's7-ax-token', 's7-source', 's7-ax', 's7-si'] },
  82: { slide: 'slide-7', targets: ['s7-add', 's7-ax-token', 's7-source', 's7-ax', 's7-si'] },
  83: { slide: 'slide-7', targets: ['s7-memory', 's7-op', 's7-ax'] },
  84: { slide: 'slide-7', targets: ['s7-memory', 's7-op', 's7-ax'] },
  85: { slide: 'slide-7', targets: ['s7-memory', 's7-op', 's7-ax'] },
  86: { slide: 'slide-7', targets: ['s7-memory', 's7-source', 's7-op'] },
  87: { slide: 'slide-7', targets: ['s7-memory', 's7-source', 's7-op'] },
  88: { slide: 'slide-7', targets: ['s7-memory', 's7-source', 's7-op'] },
  89: { slide: 'slide-8', targets: ['s8-instr', 's8-si', 's8-bx'] },
  90: { slide: 'slide-8', targets: ['s8-instr', 's8-si', 's8-bx'] },
  91: { slide: 'slide-8', targets: ['s8-instr', 's8-si', 's8-bx'] },
  92: { slide: 'slide-8', targets: ['s8-instr', 's8-si', 's8-bx'] },
  93: { slide: 'slide-8', targets: ['s8-bx', 's8-si', 's8-op'] },
  94: { slide: 'slide-8', targets: ['s8-bx', 's8-si', 's8-op'] },
  95: { slide: 'slide-8', targets: ['s8-instr', 's8-bx'] },
  96: { slide: 'slide-8', targets: ['s8-instr', 's8-bx'] },
  97: { slide: 'slide-8', targets: ['s8-instr', 's8-bx'] },
  98: { slide: 'slide-8', targets: ['s8-instr', 's8-bx'] },
  99: { slide: 'slide-8', targets: ['s8-instr', 's8-bx'] },
  100: { slide: 'slide-8', targets: ['s8-bx', 's8-next'] },
  101: { slide: 'slide-8', targets: ['s8-bx', 's8-next'] },
  102: { slide: 'slide-8', targets: ['s8-bx', 's8-next'] },
  103: { slide: 'slide-8', targets: ['s8-bx', 's8-next'] },
  104: { slide: 'slide-9', targets: ['s9-add', 's9-ax-token', 's9-source', 's9-bx'] },
  105: { slide: 'slide-9', targets: ['s9-add', 's9-ax-token', 's9-source', 's9-bx'] },
  106: { slide: 'slide-9', targets: ['s9-add', 's9-ax-token', 's9-source', 's9-bx'] },
  107: { slide: 'slide-9', targets: ['s9-source', 's9-memory', 's9-op', 's9-ax'] },
  108: { slide: 'slide-9', targets: ['s9-source', 's9-memory', 's9-op', 's9-ax'] },
  109: { slide: 'slide-9', targets: ['s9-source', 's9-memory', 's9-op', 's9-ax'] },
  110: { slide: 'slide-9', targets: ['s9-source', 's9-memory', 's9-op', 's9-ax'] },
  111: { slide: 'slide-9', targets: ['s9-source', 's9-memory', 's9-op', 's9-ax'] },
  112: { slide: 'slide-9', targets: ['s9-source', 's9-memory', 's9-op', 's9-ax'] },
  113: { slide: 'slide-10', targets: ['s10-instr', 's10-di', 's10-memory', 's10-op'] },
  114: { slide: 'slide-10', targets: ['s10-instr', 's10-di', 's10-memory', 's10-op'] },
  115: { slide: 'slide-10', targets: ['s10-instr', 's10-di', 's10-memory', 's10-op'] },
  116: { slide: 'slide-10', targets: ['s10-instr', 's10-di', 's10-memory', 's10-op'] },
  117: { slide: 'slide-10', targets: ['s10-instr', 's10-di', 's10-memory', 's10-op'] },
  118: { slide: 'slide-10', targets: ['s10-instr', 's10-di', 's10-memory', 's10-op'] },
  119: { slide: 'slide-10', targets: ['s10-di', 's10-memory'] },
  120: { slide: 'slide-10', targets: ['s10-di', 's10-memory'] },
  121: { slide: 'slide-10', targets: ['s10-instr', 's10-di', 's10-ax', 's10-op'] },
  122: { slide: 'slide-10', targets: ['s10-instr', 's10-di', 's10-ax', 's10-op'] },
  123: { slide: 'slide-10', targets: ['s10-instr', 's10-di', 's10-ax', 's10-op'] },
  124: { slide: 'slide-10', targets: ['s10-instr', 's10-di', 's10-ax', 's10-op'] },
  125: { slide: 'slide-10', targets: ['s10-instr', 's10-di', 's10-ax', 's10-op'] },
  126: { slide: 'slide-10', targets: ['s10-instr', 's10-di', 's10-ax', 's10-op'] },
  127: { slide: 'slide-10', targets: ['s10-bytes', 's10-word', 's10-ax'] },
  128: { slide: 'slide-10', targets: ['s10-bytes', 's10-word', 's10-ax'] },
  129: { slide: 'slide-10', targets: ['s10-bytes', 's10-word', 's10-ax'] },
  130: { slide: 'slide-10', targets: ['s10-bytes', 's10-word', 's10-ax'] },
  131: { slide: 'slide-10', targets: ['s10-bytes', 's10-word', 's10-op'] },
  132: { slide: 'slide-10', targets: ['s10-bytes', 's10-word', 's10-op'] },
  133: { slide: 'slide-10', targets: ['s10-bytes', 's10-word', 's10-op'] },
  134: { slide: 'slide-11', targets: ['s11-offset'] },
  135: { slide: 'slide-11', targets: ['s11-offset'] },
  136: { slide: 'slide-11', targets: ['s11-offset'] },
  137: { slide: 'slide-11', targets: ['s11-offset'] },
  138: { slide: 'slide-11', targets: ['s11-offset'] },
  139: { slide: 'slide-11', targets: ['s11-offset'] },
  140: { slide: 'slide-11', targets: ['s11-brackets'] },
  141: { slide: 'slide-11', targets: ['s11-brackets'] },
  142: { slide: 'slide-11', targets: ['s11-brackets'] },
  143: { slide: 'slide-11', targets: ['s11-brackets'] },
  144: { slide: 'slide-11', targets: ['s11-brackets'] },
  145: { slide: 'slide-11', targets: ['s11-size'] },
  146: { slide: 'slide-11', targets: ['s11-size'] },
  147: { slide: 'slide-11', targets: ['s11-size'] },
  148: { slide: 'slide-11', targets: ['s11-size'] },
  149: { slide: 'slide-11', targets: ['s11-dest'] },
  150: { slide: 'slide-11', targets: ['s11-dest'] },
  151: { slide: 'slide-11', targets: ['s11-dest'] },
  152: { slide: 'slide-11', targets: ['s11-dest'] },
  153: { slide: 'slide-11', targets: ['s11-dest'] },
  154: { slide: 'slide-11', targets: ['s11-dest'] }
};

  const slideStartCue: Record<string, number> = {
    "slide-1": 1,
    "slide-2": 10,
    "slide-3": 22,
    "slide-4": 31,
    "slide-5": 42,
    "slide-6": 54,
    "slide-7": 71,
    "slide-8": 89,
    "slide-9": 104,
    "slide-10": 113,
    "slide-11": 134
  };

  const slideNames: Record<string, string> = {
    'slide-1': 'Registro como puntero',
    'slide-2': 'SI frente a [SI]',
    'slide-3': 'Arreglo DW',
    'slide-4': 'Cargar offset',
    'slide-5': 'Leer con [SI]',
    'slide-6': 'Avanzar por DW',
    'slide-7': 'Sumar con [SI]',
    'slide-8': 'BX como segundo puntero',
    'slide-9': 'Leer con [BX]',
    'slide-10': 'Escribir con [DI]',
    'slide-11': 'Método para la práctica'
  };

  const LAST_END = 359.120;

  onMount(() => {
    const rootElement = root;
    const audioFile = theory.audioFile;
    let completionReported = completed;
    let rafId: number | null = null;

    function requireElement<T extends Element>(selector: string): T {
      const element = rootElement.querySelector(selector);
      if (!element) throw new Error(`No se encontró ${selector} en IndirectIndexedTheoryScreen.`);
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
        .filter(Boolean) as Cue[];
    }

    function normalizeSubtitle(text: string): string {
      return String(text)
        .replace(/886/g, '8086')
        .replace(/Little Indian/gi, 'little endian')
        .replace(/move/gi, 'MOV')
        .replace(/add/g, 'ADD')
        .replace(/sub/g, 'SUB')
        .replace(/word\s*,\s*\[/gi, 'word [')
        .trim();
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
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
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

    function setHotspots(targets: string[]): void {
      const targetSet = new Set(targets || []);
      rootElement.querySelectorAll<HTMLElement>('[data-hotspot]').forEach((node) => {
        node.classList.toggle('is-hot', targetSet.has(node.dataset.hotspot || ''));
      });
    }

    function setSubtitle(text: string): void {
      subtitle.innerHTML = `<span>${escapeHtml(text || 'Reproduciendo…')}</span>`;
    }

    function setText(id: string, text: string): void {
      const el = rootElement.querySelector<HTMLElement>(`#${id}`);
      if (el) el.textContent = text;
    }

    function setHtml(id: string, htmlValue: string): void {
      const el = rootElement.querySelector<HTMLElement>(`#${id}`);
      if (el) el.innerHTML = htmlValue;
    }

    function applyCueState(cueNumber: number): void {
      setText('siOffsetVal', cueNumber >= 38 ? '0120h' : '0000h');
      setText('siOffsetNote', cueNumber >= 38 ? 'dirección inicial cargada' : 'aún no apunta al arreglo');
      setHtml('opOffset', cueNumber >= 38
        ? 'SI = 0120h<span class="op-note">TABLA_VALORES empieza en @0120</span>'
        : 'SI = offset TABLA_VALORES<span class="op-note">se carga una dirección, no el primer dato</span>');

      setText('axReadVal', cueNumber >= 52 ? '0012h' : '0000h');
      setText('axReadNote', cueNumber >= 52 ? 'recibió el contenido' : 'destino de la lectura');
      setHtml('opRead', cueNumber >= 52
        ? 'AX = 0012h<span class="op-note">AX no recibe 0120h; recibe el dato guardado ahí</span>'
        : 'AX = word [SI]<span class="op-note">lee el contenido ubicado en @0120</span>');

      const badAdvance = cueNumber >= 54 && cueNumber <= 60;
      const goodAdvance = cueNumber >= 67;
      setText('siAdvanceVal', badAdvance ? '0121h' : goodAdvance ? '0122h' : '0120h');
      setText('siAdvanceNote', badAdvance ? (cueNumber >= 59 ? 'lectura cruzada' : 'avance incorrecto') : goodAdvance ? 'segundo elemento' : 'primer elemento');

      setText('axAddSiVal', cueNumber >= 83 ? '001Ah' : '0012h');

      setText('bxVal', cueNumber >= 95 ? '0124h' : cueNumber >= 93 ? '0122h' : '0000h');
      setText('bxNote', cueNumber >= 100 ? 'tercer elemento' : cueNumber >= 95 ? 'avanza a otra word' : cueNumber >= 93 ? 'copia de SI' : 'recibirá una copia');
      setHtml('instrBx', cueNumber >= 95 ? 'ADD BX, 2' : 'MOV BX, SI');
      setHtml('opBx', cueNumber >= 100
        ? 'SI queda en 0122h; BX queda en 0124h<span class="op-note">dos referencias dentro del mismo arreglo</span>'
        : cueNumber >= 95
          ? 'BX = BX + 2<span class="op-note">0122h + 0002h = 0124h</span>'
          : cueNumber >= 93
            ? 'BX = 0122h<span class="op-note">SI conserva 0122h</span>'
            : 'BX = SI<span class="op-note">copiar no borra SI</span>');

      setText('axBxVal', cueNumber >= 107 ? '0020h' : '001Ah');

      setText('diVal', cueNumber >= 119 ? '0126h' : '0000h');
      setText('diNote', cueNumber >= 121 ? 'no cambia' : cueNumber >= 119 ? 'dirección destino' : 'recibirá la dirección destino');
      setHtml('instrDi', cueNumber >= 121 ? 'MOV word [DI], AX' : 'MOV DI, offset RESULTADO_TEMP');
      setText('resultBytes', cueNumber >= 127 ? '20 00' : '00 00');
      setText('resultWord', cueNumber >= 127 ? 'word 0020h' : 'word 0000h');
      setHtml('opDi', cueNumber >= 131
        ? '0020h → 20 00<span class="op-note">little endian: byte bajo primero</span>'
        : cueNumber >= 127
          ? 'RESULTADO_TEMP = 0020h<span class="op-note">se copia la word guardada en AX</span>'
          : cueNumber >= 121
            ? '[DI] = AX<span class="op-note">el destino es memoria; AX es la fuente</span>'
            : 'DI = offset RESULTADO_TEMP<span class="op-note">se carga la dirección del destino</span>');
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
      applyCueState(activeCue.number);
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
      applyCueState(1);
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
      setHotspots(['s11-dest']);
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
      audioError.innerHTML = `No se pudo cargar el audio <strong>${escapeHtml(audioFile)}</strong>.<br>Ruta usada: <code>${escapeHtml(audio.src)}</code><br>Error: ${escapeHtml(codeText)}.`;
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
        audio.currentTime = cue.start + 0.03;
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
      <h1>Teoría 3 · Direccionamiento indirecto</h1>
      <p class="sub">Punteros con SI, BX y DI; lectura y escritura de words en memoria.</p>
      <div class="progress-shell"><div class="progress-bar" id="progressBar"></div></div>
      <nav class="timeline" aria-label="Línea de tiempo">
        <button class="time-dot is-active" data-seek="0" data-step="slide-1" type="button">Puntero</button>
        <button class="time-dot" data-seek="19" data-step="slide-2" type="button">SI/[SI]</button>
        <button class="time-dot" data-seek="53" data-step="slide-3" type="button">DW +2</button>
        <button class="time-dot" data-seek="77.82" data-step="slide-4" type="button">offset</button>
        <button class="time-dot" data-seek="104.9" data-step="slide-5" type="button">Leer [SI]</button>
        <button class="time-dot" data-seek="142.92" data-step="slide-6" type="button">Avanzar</button>
        <button class="time-dot" data-seek="184.17" data-step="slide-7" type="button">ADD [SI]</button>
        <button class="time-dot" data-seek="214.74" data-step="slide-8" type="button">BX</button>
        <button class="time-dot" data-seek="247.47" data-step="slide-9" type="button">ADD [BX]</button>
        <button class="time-dot" data-seek="266.05" data-step="slide-10" type="button">Escribir</button>
        <button class="time-dot" data-seek="320.64" data-step="slide-11" type="button">Método</button>
      </nav>
      <div class="audio-error" id="audioError"></div>
    </section>
  </header>

  <section class="slide-stage">
    <article class="card slide is-active" data-slide="slide-1">
      <div class="slide-head"><div><div class="slide-kicker">Paso 1</div><h2 class="slide-title">Registro como <span>puntero</span></h2></div><div class="slide-number">1 / 11</div></div>
      <div class="sim-stack">
        <div class="concept-card" data-hotspot="s1-idea"><div class="concept-label">Idea central</div><div class="concept-main">Un registro puede guardar una dirección de memoria</div></div>
        <div class="concept-card" data-hotspot="s1-pointer"><div class="concept-label">Uso</div><div class="concept-main">Cuando guarda una dirección, funciona como puntero</div></div>
        <div class="sim-panel"><div class="panel-title">Registro usado</div><div class="reg-strip"><div class="reg-card" data-hotspot="s1-si"><div class="reg-name mono">SI</div><div class="reg-value mono">0120h</div><div class="reg-caption">dirección guardada</div></div></div></div>
        <div class="memory-section" data-hotspot="s1-memory"><div class="memory-title">Posición en memoria apuntada</div><div class="memory-table"><div class="memory-row" data-hotspot="s1-address"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[0]</div><div class="mem-addr mono">@0120</div></div><div class="mem-bytes mono">12 00</div><div class="mem-word mono">word 0012h</div></div></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-2">
      <div class="slide-head"><div><div class="slide-kicker">Paso 2</div><h2 class="slide-title"><span>SI</span> frente a <span>[SI]</span></h2></div><div class="slide-number">2 / 11</div></div>
      <div class="sim-stack">
        <div class="compare-grid">
          <div class="compare-card" data-hotspot="s2-si"><div class="label">Sin corchetes</div><div class="value-large mono">SI = 0120h</div><p class="note">Se usa el valor guardado en el registro.</p></div>
          <div class="compare-card" data-hotspot="s2-bracket"><div class="label">Con corchetes</div><div class="value-large mono">[SI] → memoria</div><p class="note">El registro se interpreta como dirección.</p></div>
        </div>
        <div class="memory-section" data-hotspot="s2-memory"><div class="memory-title">Memoria resuelta por [SI]</div><div class="memory-table"><div class="memory-row"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[0]</div><div class="mem-addr mono">@0120</div></div><div class="mem-bytes mono">12 00</div><div class="mem-word mono">word 0012h</div></div></div></div>
        <div class="concept-card" data-hotspot="s2-rule"><div class="concept-label">Regla</div><div class="concept-main">Los corchetes cambian el significado</div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-3">
      <div class="slide-head"><div><div class="slide-kicker">Paso 3</div><h2 class="slide-title">Arreglo <span>DW</span></h2></div><div class="slide-number">3 / 11</div></div>
      <div class="sim-stack">
        <div class="concept-grid cols-2">
          <div class="concept-card" data-hotspot="s3-dw"><div class="concept-label">Tamaño lógico</div><div class="concept-main">DW = word</div><p class="concept-note">Un elemento de 16 bits.</p></div>
          <div class="concept-card" data-hotspot="s3-two"><div class="concept-label">Tamaño físico</div><div class="concept-main">2 bytes</div><p class="concept-note">Por eso el puntero avanza de dos en dos.</p></div>
        </div>
        <div class="sim-panel" data-hotspot="s3-decl"><div class="panel-title">Código de ensamblador</div><div class="code-line mono"><span class="token">TABLA_VALORES:</span> <span class="token soft">DW 0012h</span><br><span class="token soft">DW 0008h</span><br><span class="token soft">DW 0006h</span></div><p class="note">Código para declarar un arreglo de words en memoria.</p></div>
        <div class="memory-section"><div class="memory-title">Direcciones reales</div><div class="memory-table">
          <div class="memory-row compact" data-hotspot="s3-addr0"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[0]</div><div class="mem-addr mono">@0120</div></div><div class="mem-bytes mono">12 00</div><div class="mem-word mono">word 0012h</div></div>
          <div class="memory-row compact" data-hotspot="s3-addr1"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[1]</div><div class="mem-addr mono">@0122</div></div><div class="mem-bytes mono">08 00</div><div class="mem-word mono">word 0008h</div></div>
          <div class="memory-row compact" data-hotspot="s3-addr2"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[2]</div><div class="mem-addr mono">@0124</div></div><div class="mem-bytes mono">06 00</div><div class="mem-word mono">word 0006h</div></div>
        </div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-4">
      <div class="slide-head"><div><div class="slide-kicker">Paso 4</div><h2 class="slide-title">Cargar <span>offset</span></h2></div><div class="slide-number">4 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registros usados</div><div class="reg-strip"><div class="reg-card" data-hotspot="s4-reg"><div class="reg-name mono">SI</div><div class="reg-value mono" id="siOffsetVal">0000h</div><div class="reg-caption" id="siOffsetNote">aún no apunta al arreglo</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="s4-instr"><span data-hotspot="s4-mov">MOV</span> <span data-hotspot="s4-si">SI</span>, <span data-hotspot="s4-offset">offset TABLA_VALORES</span></div></div>
        <div class="memory-section" data-hotspot="s4-memory"><div class="memory-title">Dirección inicial del arreglo</div><div class="memory-table"><div class="memory-row"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[0]</div><div class="mem-addr mono">@0120</div></div><div class="mem-bytes mono">12 00</div><div class="mem-word mono">word 0012h</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s4-op" id="opOffset">SI = offset TABLA_VALORES<span class="op-note">se carga una dirección, no el primer dato</span></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-5">
      <div class="slide-head"><div><div class="slide-kicker">Paso 5</div><h2 class="slide-title">Leer con <span>[SI]</span></h2></div><div class="slide-number">5 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registros usados</div><div class="reg-strip cols-2"><div class="reg-card" data-hotspot="s5-si"><div class="reg-name mono">SI</div><div class="reg-value mono">0120h</div><div class="reg-caption">dirección fuente</div></div><div class="reg-card" data-hotspot="s5-ax"><div class="reg-name mono">AX</div><div class="reg-value mono" id="axReadVal">0000h</div><div class="reg-caption" id="axReadNote">destino de la lectura</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="s5-instr"><span data-hotspot="s5-mov">MOV</span> <span data-hotspot="s5-ax-token">AX</span>, <span data-hotspot="s5-bracket">word [SI]</span></div></div>
        <div class="memory-section" data-hotspot="s5-memory"><div class="memory-title">Memoria fuente</div><div class="memory-table"><div class="memory-row"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[0]</div><div class="mem-addr mono">@0120</div></div><div class="mem-bytes mono" data-hotspot="s5-bytes">12 00</div><div class="mem-word mono" data-hotspot="s5-word">word 0012h</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s5-op" id="opRead">AX = word [SI]<span class="op-note">lee el contenido ubicado en @0120</span></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-6">
      <div class="slide-head"><div><div class="slide-kicker">Paso 6</div><h2 class="slide-title">Avanzar por <span>DW</span></h2></div><div class="slide-number">6 / 11</div></div>
      <div class="sim-stack">
        <div class="concept-card" data-hotspot="s6-error"><div class="concept-label">Error común</div><div class="concept-main">Sumar 1 deja el puntero en medio de una word</div></div>
        <div class="memory-section"><div class="memory-title">Qué pasa si se avanza mal</div><div class="memory-table">
          <div class="memory-row compact"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[0]</div><div class="mem-addr mono">@0120</div></div><div class="mem-bytes mono byte-split"><span class="byte-cell">12</span><span class="byte-cell is-wrong" data-hotspot="s6-byte-0121">00</span></div><div class="mem-word mono">word 0012h</div></div>
          <div class="memory-row compact"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[1]</div><div class="mem-addr mono">@0122</div></div><div class="mem-bytes mono byte-split"><span class="byte-cell is-wrong" data-hotspot="s6-byte-0122">08</span><span class="byte-cell">00</span></div><div class="mem-word mono">word 0008h</div></div>
        </div><p class="danger-note" data-hotspot="s6-cross-read">Si SI queda en 0121h, word [SI] toma @0121 y @0122: una lectura cruzada entre dos DW.</p></div>
        <div class="sim-panel"><div class="panel-title">Registros usados</div><div class="reg-strip"><div class="reg-card" data-hotspot="s6-reg"><div class="reg-name mono">SI</div><div class="reg-value mono" id="siAdvanceVal">0120h</div><div class="reg-caption" id="siAdvanceNote">primer elemento</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="s6-instr">ADD SI, 2</div></div>
        <div class="memory-section"><div class="memory-title">Nuevo elemento apuntado</div><div class="memory-table"><div class="memory-row compact" data-hotspot="s6-next"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[1]</div><div class="mem-addr mono">@0122</div></div><div class="mem-bytes mono">08 00</div><div class="mem-word mono">word 0008h</div></div></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-7">
      <div class="slide-head"><div><div class="slide-kicker">Paso 7</div><h2 class="slide-title">Sumar con <span>[SI]</span></h2></div><div class="slide-number">7 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registros usados</div><div class="reg-strip cols-2"><div class="reg-card" data-hotspot="s7-ax"><div class="reg-name mono">AX</div><div class="reg-value mono" id="axAddSiVal">0012h</div><div class="reg-caption">acumulador</div></div><div class="reg-card" data-hotspot="s7-si"><div class="reg-name mono">SI</div><div class="reg-value mono">0122h</div><div class="reg-caption">apunta al segundo valor</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="s7-instr"><span data-hotspot="s7-add">ADD</span> <span data-hotspot="s7-ax-token">AX</span>, <span data-hotspot="s7-source">word [SI]</span></div></div>
        <div class="memory-section" data-hotspot="s7-memory"><div class="memory-title">Memoria fuente</div><div class="memory-table"><div class="memory-row"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[1]</div><div class="mem-addr mono">@0122</div></div><div class="mem-bytes mono">08 00</div><div class="mem-word mono">word 0008h</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s7-op" id="opAddSi">0012h + 0008h = 001Ah<span class="op-note">se suma el contenido de @0122, no el número 0122h</span></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-8">
      <div class="slide-head"><div><div class="slide-kicker">Paso 8</div><h2 class="slide-title"><span>BX</span> como segundo puntero</h2></div><div class="slide-number">8 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registros usados</div><div class="reg-strip cols-2"><div class="reg-card" data-hotspot="s8-si"><div class="reg-name mono">SI</div><div class="reg-value mono">0122h</div><div class="reg-caption">queda igual</div></div><div class="reg-card" data-hotspot="s8-bx"><div class="reg-name mono">BX</div><div class="reg-value mono" id="bxVal">0000h</div><div class="reg-caption" id="bxNote">recibirá una copia</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="s8-instr" id="instrBx">MOV BX, SI</div></div>
        <div class="memory-section"><div class="memory-title">Referencias dentro del arreglo</div><div class="memory-table"><div class="memory-row compact"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[1]</div><div class="mem-addr mono">@0122</div></div><div class="mem-bytes mono">08 00</div><div class="mem-word mono">word 0008h</div></div><div class="memory-row compact" data-hotspot="s8-next"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[2]</div><div class="mem-addr mono">@0124</div></div><div class="mem-bytes mono">06 00</div><div class="mem-word mono">word 0006h</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s8-op" id="opBx">BX = SI<span class="op-note">copiar no borra SI</span></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-9">
      <div class="slide-head"><div><div class="slide-kicker">Paso 9</div><h2 class="slide-title">Leer con <span>[BX]</span></h2></div><div class="slide-number">9 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registros usados</div><div class="reg-strip cols-2"><div class="reg-card" data-hotspot="s9-ax"><div class="reg-name mono">AX</div><div class="reg-value mono" id="axBxVal">001Ah</div><div class="reg-caption">acumulador</div></div><div class="reg-card" data-hotspot="s9-bx"><div class="reg-name mono">BX</div><div class="reg-value mono">0124h</div><div class="reg-caption">apunta al tercer valor</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="s9-instr"><span data-hotspot="s9-add">ADD</span> <span data-hotspot="s9-ax-token">AX</span>, <span data-hotspot="s9-source">word [BX]</span></div></div>
        <div class="memory-section" data-hotspot="s9-memory"><div class="memory-title">Memoria fuente</div><div class="memory-table"><div class="memory-row"><div class="mem-ident"><div class="mem-label mono">TABLA_VALORES[2]</div><div class="mem-addr mono">@0124</div></div><div class="mem-bytes mono">06 00</div><div class="mem-word mono">word 0006h</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s9-op">001Ah + 0006h = 0020h<span class="op-note">word [BX] lee dos bytes como palabra</span></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-10">
      <div class="slide-head"><div><div class="slide-kicker">Paso 10</div><h2 class="slide-title">Escribir con <span>[DI]</span></h2></div><div class="slide-number">10 / 11</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registros usados</div><div class="reg-strip cols-2"><div class="reg-card" data-hotspot="s10-di"><div class="reg-name mono">DI</div><div class="reg-value mono" id="diVal">0000h</div><div class="reg-caption" id="diNote">recibirá la dirección destino</div></div><div class="reg-card" data-hotspot="s10-ax"><div class="reg-name mono">AX</div><div class="reg-value mono">0020h</div><div class="reg-caption">fuente del resultado</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="s10-instr" id="instrDi">MOV DI, offset RESULTADO_TEMP</div></div>
        <div class="memory-section" data-hotspot="s10-memory"><div class="memory-title">Memoria destino</div><div class="memory-table"><div class="memory-row"><div class="mem-ident"><div class="mem-label mono">RESULTADO_TEMP</div><div class="mem-addr mono">@0126</div></div><div class="mem-bytes mono" id="resultBytes" data-hotspot="s10-bytes">00 00</div><div class="mem-word mono" id="resultWord" data-hotspot="s10-word">word 0000h</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s10-op" id="opDi">DI = offset RESULTADO_TEMP<span class="op-note">se carga la dirección del destino</span></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-11">
      <div class="slide-head"><div><div class="slide-kicker">Paso 11</div><h2 class="slide-title">Método para la <span>práctica</span></h2></div><div class="slide-number">11 / 11</div></div>
      <div class="sim-stack">
        <div class="method">
          <div class="method-row" data-hotspot="s11-offset"><div class="badge">1</div><p class="big"><span class="mono">offset</span> carga una dirección.</p></div>
          <div class="method-row" data-hotspot="s11-brackets"><div class="badge">2</div><p class="big"><span class="mono">[SI]</span>, <span class="mono">[BX]</span> o <span class="mono">[DI]</span> acceden a memoria.</p></div>
          <div class="method-row" data-hotspot="s11-size"><div class="badge">3</div><p class="big"><span class="mono">DW</span> / <span class="mono">word</span> avanza de 2 bytes.</p></div>
          <div class="method-row" data-hotspot="s11-dest"><div class="badge">4</div><p class="big">Destino registro: cambia registro. Destino <span class="mono">[registro]</span>: cambia memoria.</p></div>
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
    <div class="controls"><button class="primary" id="playBtn" type="button">Reproducir teoría</button><button
  aria-label="Mostrar subtítulos"
  aria-pressed="false"
  class="secondary cc-button"
  id="subtitleBtn"
  type="button"
>
  CC
</button><button class="secondary" id="resetBtn" type="button" aria-label="Reiniciar">↺</button></div>
    <button class="primary final-action" id="practiceBtn" type="button">Iniciar práctica</button>
    <div class="status-line" id="statusLine">Audio esperado: <strong>teoria3.mp3</strong></div>
  </div>
</footer>

<audio id="audio" preload="metadata"></audio>
</div>

<style>

  .theory-root {
    --bg: #0f1117;
    --bg2: #121720;
    --panel: #181d28;
    --panel2: #1f2532;
    --panel3: #111722;
    --line: #2e3748;
    --line2: #3a4558;
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
    width: 0%; height: 100%; border-radius: inherit;
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
    background: var(--panel2);
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
  [data-hotspot] {
    transition: border-color .16s ease, background .16s ease, box-shadow .16s ease, transform .16s ease, color .16s ease;
  }
  [data-hotspot]:global(.is-hot) {
    border-color: var(--accent-line) !important;
    background-color: var(--accent-soft) !important;
    box-shadow: 0 0 0 1px rgba(244,197,66,.14), 0 0 22px rgba(244,197,66,.11);
    transform: translateY(-1px);
  }
  .token:global(.is-hot), .mem-word:global(.is-hot), .mem-bytes:global(.is-hot), .reg-value:global(.is-hot) { color: var(--accent); }

  .code-line {
    width: 100%;
    overflow: hidden;
    border: 1px solid var(--line);
    background: var(--panel3);
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
  .token.soft { color: var(--soft); }

  .reg-strip { display: grid; gap: 8px; }
  .reg-strip.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .reg-card {
    min-height: 72px;
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .86);
    border-radius: 16px;
    padding: 10px;
    display: grid;
    align-content: center;
  }
  .reg-name { color: #c9d3ff; font-size: 12px; font-weight: 950; letter-spacing: .08em; }
  .reg-value { margin-top: 5px; font-size: clamp(25px, 8vw, 34px); line-height: 1; font-weight: 950; letter-spacing: .03em; }
  .reg-caption { color: var(--muted); font-size: 11px; margin-top: 4px; font-weight: 800; }

  .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
  .compare-card {
    border: 1px solid var(--line);
    background: rgba(17,23,34,.82);
    border-radius: 16px;
    padding: 10px;
  }
  .label { color: var(--muted); font-size: 10px; font-weight: 950; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 5px; }
  .value-large { font-size: clamp(18px, 5.8vw, 26px); font-weight: 950; line-height: 1.05; }

  .memory-section {
    border: 1px solid var(--line);
    background: rgba(31, 37, 50, .62);
    border-radius: 20px;
    padding: 10px;
  }
  .memory-title {
    color: var(--muted);
    font-size: 11.5px;
    font-weight: 950;
    letter-spacing: .1em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .memory-table { display: grid; gap: 8px; }

  /* Fila de memoria normalizada.
     Se usan columnas acotadas para impedir que los bytes o la word
     se sobredimensionen y salgan del contenedor en móvil. */
  .memory-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 74px 92px;
    gap: 6px;
    align-items: center;
    min-height: 70px;
    border: 1px solid var(--line);
    background: rgba(17, 23, 34, .86);
    border-radius: 18px;
    padding: 8px 10px;
    overflow: hidden;
  }
  .mem-ident { min-width: 0; display: grid; gap: 2px; }
  .mem-label {
    min-width: 0;
    color: var(--accent);
    font-size: clamp(11px, 3.1vw, 15px);
    font-weight: 950;
    letter-spacing: -.045em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mem-addr { color: #c9d3ff; font-size: 10.5px; font-weight: 900; }
  .mem-bytes, .mem-word {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    border: 1px solid var(--line);
    background: rgba(22, 27, 38, .92);
    border-radius: 13px;
    padding: 7px 5px;
    text-align: center;
    font-weight: 950;
    line-height: 1;
  }
  .mem-bytes { font-size: clamp(16px, 4.6vw, 21px); letter-spacing: .035em; }
  .mem-word { font-size: clamp(11.5px, 3.1vw, 15px); letter-spacing: -.04em; }
  .memory-row.compact { min-height: 58px; }
  .memory-row.compact .mem-bytes { font-size: clamp(15px, 4.1vw, 19px); }
  .memory-row.compact .mem-word { font-size: clamp(11px, 2.9vw, 14px); }

  .op-box {
    border: 1px solid var(--line);
    background: rgba(17,23,34,.86);
    border-radius: 16px;
    padding: 12px;
    text-align: center;
    font-size: clamp(20px, 6.4vw, 29px);
    line-height: 1.1;
    font-weight: 950;
  }
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

  @media (max-width: 390px) {
    .app { padding-left: 10px; padding-right: 10px; }
    .slide { padding: 12px; }
    .compare-grid, .reg-strip.cols-2 { grid-template-columns: 1fr; }
    .memory-section { padding: 9px; }
    .memory-row { grid-template-columns: minmax(0, 1fr) 66px 84px; gap: 5px; padding: 8px; min-height: 64px; }
    .mem-label { font-size: clamp(10px, 3vw, 13px); letter-spacing: -.06em; }
    .mem-addr { font-size: 9.5px; }
    .mem-bytes { font-size: clamp(14px, 4vw, 18px); padding: 6px 4px; letter-spacing: .02em; }
    .mem-word { font-size: clamp(10px, 2.7vw, 13px); padding: 6px 4px; letter-spacing: -.06em; }
  }
  @media (max-width: 340px) {
    .memory-row { grid-template-columns: minmax(0, 1fr) 58px 76px; gap: 4px; padding: 7px; }
    .mem-label { font-size: 10px; }
    .mem-bytes { font-size: 14px; letter-spacing: 0; }
    .mem-word { font-size: 10px; letter-spacing: -.08em; }
  }
  @media (max-height: 720px) {
    .slide { min-height: auto; }
    .sim-panel, .memory-section { padding: 10px; }
    .reg-card { min-height: 62px; }
    .memory-row { min-height: 66px; }
    .slide-title { font-size: 20px; }
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
  .subtitle[hidden] { display: none; }
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
  .cc-button:global(.is-active) {
    color: var(--accent);
    border-color: var(--accent-line);
    background: var(--accent-soft);
  }
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


  .concept-grid { display: grid; gap: 8px; }
  .concept-grid.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .concept-card {
    border: 1px solid var(--line);
    background: rgba(17,23,34,.84);
    border-radius: 16px;
    padding: 11px;
    min-width: 0;
  }
  .concept-label { color: var(--muted); font-size: 10px; font-weight: 950; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 5px; }
  .concept-main { color: var(--text); font-size: clamp(16px, 4.7vw, 23px); font-weight: 950; line-height: 1.08; letter-spacing: -.03em; }
  .concept-note { margin-top: 6px; color: var(--muted); font-size: 12.5px; line-height: 1.32; font-weight: 750; }
  .instr-box { width: 100%; border: 1px solid var(--line); background: var(--panel3); border-radius: 15px; padding: 11px; color: var(--text); font-size: clamp(16px, 4.9vw, 23px); line-height: 1.18; font-weight: 950; letter-spacing: -.025em; text-align: center; }
  .op-note { display: block; margin-top: 6px; color: var(--muted); font-size: 11px; font-weight: 850; line-height: 1.25; }
  .mem-bytes.byte-split { display: flex; justify-content: center; align-items: center; gap: 4px; }
  .byte-cell { display: inline-grid; place-items: center; min-width: 24px; padding: 3px 4px; border-radius: 8px; border: 1px solid transparent; line-height: 1; }
  .byte-cell.is-wrong { border-color: rgba(239,83,80,.42); background: rgba(239,83,80,.08); }
  .byte-cell.is-wrong:global(.is-hot) { color: #ff6b6b !important; border-color: rgba(239,83,80,.88) !important; background: rgba(239,83,80,.22) !important; box-shadow: 0 0 0 1px rgba(239,83,80,.20), 0 0 20px rgba(239,83,80,.16); }
  .danger-note { margin-top: 8px; color: #ffb3b3; font-size: 12px; line-height: 1.28; font-weight: 850; }
  [data-hotspot]:global(.is-hot) .concept-main,
  [data-hotspot]:global(.is-hot) .value-large,
  [data-hotspot]:global(.is-hot) .reg-value,
  [data-hotspot]:global(.is-hot) .mem-label,
  [data-hotspot]:global(.is-hot) .mem-bytes,
  [data-hotspot]:global(.is-hot) .mem-word,
  [data-hotspot]:global(.is-hot).instr-box,
  [data-hotspot]:global(.is-hot).op-box,
  [data-hotspot]:global(.is-hot) .badge,
  .memory-row [data-hotspot]:global(.is-hot) { color: var(--accent); }
  @media (max-width: 390px) { .concept-grid.cols-2 { grid-template-columns: 1fr; } }

</style>
