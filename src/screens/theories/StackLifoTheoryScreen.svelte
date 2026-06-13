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

  type CueVisual = {
    scene: number;
    hots: string[];
  };

  const SRT_SOURCE = `1
00:00:00,520 --> 00:00:02,600
En el siguiente bloque vamos a ver cómo

2
00:00:02,600 --> 00:00:04,980
funciona la pila en el 8086.

3
00:00:04,980 --> 00:00:07,880
La pila sirve para guardar valores temporalmente.

4
00:00:07,880 --> 00:00:10,220
Es útil cuando queremos guardar un dato ahora

5
00:00:10,220 --> 00:00:11,620
y recuperarlo después.

6
00:00:11,700 --> 00:00:14,560
La pila trabaja con una regla llamada LIFO,

7
00:00:14,560 --> 00:00:16,820
que significa último en entrar,

8
00:00:16,820 --> 00:00:17,680
primero en salir.

9
00:00:17,680 --> 00:00:19,840
Si guardamos dos valores en la pila,

10
00:00:19,840 --> 00:00:22,220
sale primero el último que se guardó.

11
00:00:22,220 --> 00:00:25,440
El registro que controla la pila es SP.

12
00:00:25,480 --> 00:00:27,980
SP apunta al tope de la pila.

13
00:00:28,100 --> 00:00:29,420
En este ejemplo,

14
00:00:29,420 --> 00:00:31,100
SP empieza en 0100h.

15
00:00:31,100 --> 00:00:33,420
Eso significa que la pila empezará a trabajar

16
00:00:33,420 --> 00:00:35,340
desde esa zona de memoria.

17
00:00:35,400 --> 00:00:37,340
Ahora usaremos el registro SI.

18
00:00:37,400 --> 00:00:41,100
SI contiene el valor 1020h.

19
00:00:41,100 --> 00:00:43,220
queremos guardar ese valor en la pila para

20
00:00:43,220 --> 00:00:44,020
usarlo después.

21
00:00:44,020 --> 00:00:46,180
La instrucción es PUSH SI.

22
00:00:46,180 --> 00:00:49,420
PUSH guarda una word en la pila.

23
00:00:49,460 --> 00:00:52,120
Como una word ocupa dos bytes,

24
00:00:52,120 --> 00:00:54,160
SP baja dos posiciones.

25
00:00:54,160 --> 00:00:56,880
SP pasa de 0100h a...

26
00:00:57,590 --> 00:00:58,630
00FEh.

27
00:00:58,710 --> 00:01:01,290
Ahora el tope de la pila está en

28
00:01:01,290 --> 00:01:02,710
00FEh.

29
00:01:02,710 --> 00:01:05,210
En esa dirección se guarda el valor de

30
00:01:05,210 --> 00:01:05,690
SI.

31
00:01:05,970 --> 00:01:10,970
La word 1020h se guarda como bytes 20 10.

32
00:01:11,210 --> 00:01:13,570
Ese orden se llama little endian.

33
00:01:13,890 --> 00:01:15,770
Ahora usaremos el registro DI.

34
00:01:15,870 --> 00:01:18,410
DI contiene el valor 3040h.

35
00:01:18,850 --> 00:01:21,350
También queremos guardar ese valor en la pila.

36
00:01:21,430 --> 00:01:23,350
La instrucción es PUSH DI.

37
00:01:23,590 --> 00:01:26,030
Otra vez SP baja dos posiciones.

38
00:01:26,030 --> 00:01:30,460
SP pasa de 00FEh a 00FCh porque

39
00:01:30,460 --> 00:01:31,980
se restan dos posiciones.

40
00:01:32,900 --> 00:01:35,200
Ahora el nuevo tope de la pila está

41
00:01:35,200 --> 00:01:36,740
en 00FCh.

42
00:01:36,940 --> 00:01:39,100
En esa dirección se guarda el valor de

43
00:01:39,100 --> 00:01:39,560
DI.

44
00:01:39,940 --> 00:01:44,420
La word 3040h se guarda como bytes 40 30.

45
00:01:44,680 --> 00:01:47,400
Ahora la pila tiene dos valores guardados.

46
00:01:47,540 --> 00:01:49,480
Abajo quedó el 1020h,

47
00:01:49,480 --> 00:01:51,880
arriba quedó 3040h.

48
00:01:51,920 --> 00:01:54,340
El valor de arriba es el último que

49
00:01:54,340 --> 00:01:54,880
entró.

50
00:01:54,880 --> 00:01:56,230
Y por la regla LIFO,

51
00:01:56,290 --> 00:01:57,990
ese será el primero en salir.

52
00:01:58,030 --> 00:02:00,370
Ahora usamos POP BP.

53
00:02:00,370 --> 00:02:03,070
BP es otro registro de 16 bits.

54
00:02:03,070 --> 00:02:05,250
Aquí lo usaremos como destino.

55
00:02:05,250 --> 00:02:07,990
POP BP saca el valor que está en

56
00:02:07,990 --> 00:02:09,170
el tope de la pila.

57
00:02:09,290 --> 00:02:12,670
El tope actual está en 00FCh.

58
00:02:12,850 --> 00:02:16,290
Ahí está guardado 3040h.

59
00:02:16,330 --> 00:02:19,810
Entonces BP recibe 3040h.

60
00:02:19,870 --> 00:02:21,830
Después de sacar ese valor,

61
00:02:21,830 --> 00:02:23,730
SP sube dos posiciones.

62
00:02:23,840 --> 00:02:28,720
SP pasa de 00FCh a 00FEh.

63
00:02:28,860 --> 00:02:32,640
Ahora el tope queda sobre el valor anterior.

64
00:02:32,780 --> 00:02:35,740
Y el valor anterior es 1020h.

65
00:02:36,000 --> 00:02:38,640
Ahora usamos POP DX.

66
00:02:38,700 --> 00:02:41,700
DX también es otro registro de 16 bits.

67
00:02:41,700 --> 00:02:43,660
Lo usaremos como segundo destino.

68
00:02:43,920 --> 00:02:47,000
POP DX toma el valor del tope actual.

69
00:02:47,200 --> 00:02:49,760
SP apunta a 00FEh.

70
00:02:49,900 --> 00:02:52,780
En esa dirección está guardado 1020h.

71
00:02:52,820 --> 00:02:56,380
Entonces DX recibe 1020h.

72
00:02:56,480 --> 00:02:57,400
Ahora,

73
00:02:57,400 --> 00:02:58,960
después de sacar el valor,

74
00:02:58,960 --> 00:03:00,800
SP sube dos posiciones.

75
00:03:00,800 --> 00:03:05,520
SP vuelve de 00FEh a 0100h.

76
00:03:05,700 --> 00:03:07,260
En este ejemplo,

77
00:03:07,260 --> 00:03:09,060
la pila activa queda vacía.

78
00:03:09,060 --> 00:03:11,140
El resultado importante es el orden.

79
00:03:11,140 --> 00:03:12,960
Primero hicimos PUSH SI,

80
00:03:12,960 --> 00:03:14,240
luego PUSH DI.

81
00:03:14,360 --> 00:03:16,200
Pero al sacar valores,

82
00:03:16,200 --> 00:03:19,520
primero salió DI y después salió SI.

83
00:03:19,520 --> 00:03:21,160
Eso confirma la regla LIFO.

84
00:03:21,170 --> 00:03:24,050
Con PUSH, SP baja dos posiciones y luego

85
00:03:24,050 --> 00:03:25,030
guarda la word.

86
00:03:25,030 --> 00:03:27,830
Con POP se lee la word y luego

87
00:03:27,830 --> 00:03:29,450
SP sube dos posiciones.

88
00:03:29,490 --> 00:03:32,150
Para seguir una pila observa estas tres cosas.

89
00:03:32,150 --> 00:03:34,850
El registro que entrega o recibe el dato,

90
00:03:34,850 --> 00:03:37,230
la instrucción activa y el valor actual de

91
00:03:37,230 --> 00:03:37,770
SP.

92
00:03:37,770 --> 00:03:39,710
Con eso puedes saber qué valor entra,

93
00:03:39,810 --> 00:03:41,810
qué valor sale y dónde queda el tope

94
00:03:41,810 --> 00:03:42,550
de la pila.`;

  const slideStartCue: Record<string, number> = {
    'slide-1': 1,
    'slide-2': 6,
    'slide-3': 11,
    'slide-4': 17,
    'slide-5': 33,
    'slide-6': 45,
    'slide-7': 52,
    'slide-8': 65,
    'slide-9': 78,
    'slide-10': 88
  };

  const slideRanges = [
    { id: 'slide-1', start: 1, end: 5 },
    { id: 'slide-2', start: 6, end: 10 },
    { id: 'slide-3', start: 11, end: 16 },
    { id: 'slide-4', start: 17, end: 32 },
    { id: 'slide-5', start: 33, end: 44 },
    { id: 'slide-6', start: 45, end: 51 },
    { id: 'slide-7', start: 52, end: 64 },
    { id: 'slide-8', start: 65, end: 77 },
    { id: 'slide-9', start: 78, end: 87 },
    { id: 'slide-10', start: 88, end: 94 }
  ];

  const sceneStarts: Record<number, number> = {
    1: 0.52,
    2: 11.7,
    3: 22.22,
    4: 35.4,
    5: 73.89,
    6: 104.68,
    7: 118.03,
    8: 156.0,
    9: 189.06,
    10: 209.49
  };

  const cueVisual: Record<number, CueVisual> = {
    1: { scene: 1, hots: ['intro-title'] },
    2: { scene: 1, hots: ['intro-title'] },
    3: { scene: 1, hots: ['intro-temp'] },
    4: { scene: 1, hots: ['intro-save'] },
    5: { scene: 1, hots: ['intro-recover'] },
    6: { scene: 2, hots: ['lifo-name'] },
    7: { scene: 2, hots: ['lifo-in'] },
    8: { scene: 2, hots: ['lifo-out'] },
    9: { scene: 2, hots: ['lifo-stack'] },
    10: { scene: 2, hots: ['lifo-pop'] },
    11: { scene: 3, hots: ['sp-reg'] },
    12: { scene: 3, hots: ['sp-top'] },
    13: { scene: 3, hots: ['sp-setup'] },
    14: { scene: 3, hots: ['sp-val'] },
    15: { scene: 3, hots: ['sp-zone'] },
    16: { scene: 3, hots: ['sp-zone'] },
    17: { scene: 4, hots: ['si-reg'] },
    18: { scene: 4, hots: ['si-val'] },
    19: { scene: 4, hots: ['si-purpose'] },
    20: { scene: 4, hots: ['si-purpose'] },
    21: { scene: 4, hots: ['pushsi-instr'] },
    22: { scene: 4, hots: ['push-word'] },
    23: { scene: 4, hots: ['word-two'] },
    24: { scene: 4, hots: ['sp-down'] },
    25: { scene: 4, hots: ['sp-live-si'] },
    26: { scene: 4, hots: ['sp-live-si'] },
    27: { scene: 4, hots: ['top-fe'] },
    28: { scene: 4, hots: ['top-fe'] },
    29: { scene: 4, hots: ['row-fe'] },
    30: { scene: 4, hots: ['si-live-store'] },
    31: { scene: 4, hots: ['bytes-2010'] },
    32: { scene: 4, hots: ['little-endian-si'] },
    33: { scene: 5, hots: ['di-reg'] },
    34: { scene: 5, hots: ['di-val'] },
    35: { scene: 5, hots: ['di-purpose'] },
    36: { scene: 5, hots: ['pushdi-instr'] },
    37: { scene: 5, hots: ['sp-down-di'] },
    38: { scene: 5, hots: ['sp-live-di'] },
    39: { scene: 5, hots: ['sp-down-di'] },
    40: { scene: 5, hots: ['top-fc'] },
    41: { scene: 5, hots: ['top-fc'] },
    42: { scene: 5, hots: ['row-fc'] },
    43: { scene: 5, hots: ['di-store'] },
    44: { scene: 5, hots: ['bytes-4030'] },
    45: { scene: 6, hots: ['two-stack'] },
    46: { scene: 6, hots: ['below-1020'] },
    47: { scene: 6, hots: ['above-3040'] },
    48: { scene: 6, hots: ['above-3040'] },
    49: { scene: 6, hots: ['above-3040'] },
    50: { scene: 6, hots: ['lifo-card-2'] },
    51: { scene: 6, hots: ['will-exit'] },
    52: { scene: 7, hots: ['popbp-instr'] },
    53: { scene: 7, hots: ['bp-reg'] },
    54: { scene: 7, hots: ['bp-dest'] },
    55: { scene: 7, hots: ['popbp-instr'] },
    56: { scene: 7, hots: ['pop-top-fc'] },
    57: { scene: 7, hots: ['pop-top-fc'] },
    58: { scene: 7, hots: ['pop-val-3040'] },
    59: { scene: 7, hots: ['bp-reg'] },
    60: { scene: 7, hots: ['after-pop'] },
    61: { scene: 7, hots: ['sp-up-bp'] },
    62: { scene: 7, hots: ['sp-reg-bp'] },
    63: { scene: 7, hots: ['new-top-fe'] },
    64: { scene: 7, hots: ['prev-1020'] },
    65: { scene: 8, hots: ['popdx-instr'] },
    66: { scene: 8, hots: ['dx-reg'] },
    67: { scene: 8, hots: ['dx-dest'] },
    68: { scene: 8, hots: ['popdx-instr'] },
    69: { scene: 8, hots: ['sp-dx'] },
    70: { scene: 8, hots: ['dx-source'] },
    71: { scene: 8, hots: ['dx-reg'] },
    72: { scene: 8, hots: ['sp-up-dx'] },
    73: { scene: 8, hots: ['sp-up-dx'] },
    74: { scene: 8, hots: ['sp-up-dx'] },
    75: { scene: 8, hots: ['sp-reg-dx'] },
    76: { scene: 8, hots: ['empty-stack'] },
    77: { scene: 8, hots: ['empty-stack'] },
    78: { scene: 9, hots: ['result-title'] },
    79: { scene: 9, hots: ['sum-push-si'] },
    80: { scene: 9, hots: ['sum-push-di'] },
    81: { scene: 9, hots: ['sum-pop'] },
    82: { scene: 9, hots: ['sum-pop'] },
    83: { scene: 9, hots: ['sum-lifo'] },
    84: { scene: 9, hots: ['rule-push'] },
    85: { scene: 9, hots: ['rule-push'] },
    86: { scene: 9, hots: ['rule-pop'] },
    87: { scene: 9, hots: ['rule-pop'] },
    88: { scene: 10, hots: ['check-title'] },
    89: { scene: 10, hots: ['check-reg'] },
    90: { scene: 10, hots: ['check-instr'] },
    91: { scene: 10, hots: ['check-sp'] },
    92: { scene: 10, hots: ['check-enter'] },
    93: { scene: 10, hots: ['check-exit'] },
    94: { scene: 10, hots: ['check-top'] },
  };

  const cues = parseSrt(SRT_SOURCE);
  const fallbackDuration = cues[cues.length - 1]?.end ?? 222.55;

  function parseTimestamp(value: string): number {
    const [hours = '0', minutes = '0', rest = '0'] = value.split(':');
    const [seconds = '0', milliseconds = '0'] = rest.split(',');
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds) + Number(milliseconds) / 1000;
  }

  function parseSrt(raw: string): Cue[] {
    return raw.trim().split(/\n\s*\n/).map((block) => {
      const lines = block.split('\n');
      const number = Number(lines[0]);
      const [startRaw, endRaw] = lines[1].split(' --> ');
      return {
        number,
        start: parseTimestamp(startRaw),
        end: parseTimestamp(endRaw),
        text: lines.slice(2).join(' ')
      };
    });
  }

  function normalizeSubtitle(text: string): string {
    return String(text)
      .replace(/push/gi, 'PUSH')
      .replace(/pop/gi, 'POP')
      .replace(/sp/gi, 'SP')
      .replace(/si/gi, 'SI')
      .replace(/di/gi, 'DI')
      .replace(/bp/gi, 'BP')
      .replace(/dx/gi, 'DX')
      .replace(/lifo/gi, 'LIFO')
      .replace(/last\s+in\s*,?\s*first\s+out/gi, 'Last In, First Out')
      .replace(/little\s+indian/gi, 'little endian')
      .replace(/word/gi, 'word')
      .replace(/0100\s*h/gi, '0100h')
      .replace(/00fe\s*h/gi, '00FEh')
      .replace(/00fc\s*h/gi, '00FCh')
      .replace(/1020\s*h/gi, '1020h')
      .replace(/3040\s*h/gi, '3040h')
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
      .replace(/'/g, '&#39;');
  }

  function cueAt(time: number): Cue | null {
    return cues.find((cue) => time >= cue.start && time < cue.end) ?? cues[cues.length - 1] ?? null;
  }

  function slideForCue(cueNumber: number): string {
    const visual = cueVisual[cueNumber];
    if (visual) return `slide-${visual.scene}`;
    return slideRanges.find((range) => cueNumber >= range.start && cueNumber <= range.end)?.id ?? 'slide-1';
  }

  function formatTime(seconds: number): string {
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

  function applyHighlights(rootElement: HTMLElement, hots: string[]): void {
    const activeTargets = new Set(hots || []);
    rootElement.querySelectorAll<HTMLElement>('[data-hotspot].is-hot').forEach((node) => {
      node.classList.remove('is-hot');
    });
    rootElement.querySelectorAll<HTMLElement>('[data-hotspot]').forEach((node) => {
      node.classList.toggle('is-hot', activeTargets.has(node.dataset.hotspot ?? ''));
    });
  }

  function byId<T extends HTMLElement>(rootElement: HTMLElement, id: string): T | null {
    return rootElement.querySelector<T>(`#${id}`);
  }

  function setText(rootElement: HTMLElement, id: string, value: string): void {
    const element = byId<HTMLElement>(rootElement, id);
    if (element) element.textContent = value;
  }

  function setTrustedHtml(rootElement: HTMLElement, id: string, value: string): void {
    const element = byId<HTMLElement>(rootElement, id);
    if (element) element.innerHTML = value;
  }

  function setDisplay(rootElement: HTMLElement, id: string, value: string): void {
    const element = byId<HTMLElement>(rootElement, id);
    if (element) element.style.display = value;
  }

  function toggleClass(rootElement: HTMLElement, id: string, className: string, force: boolean): void {
    const element = byId<HTMLElement>(rootElement, id);
    if (element) element.classList.toggle(className, force);
  }

  function applyRuntimeState(rootElement: HTMLElement, time: number): void {
    const emptyBytes = '<span class="byte-chip">--</span><span class="byte-chip">--</span>';
    const siBytes = '<span class="byte-chip">20</span><span class="byte-chip">10</span>';
    const diBytes = '<span class="byte-chip">40</span><span class="byte-chip">30</span>';
    const emptyWord = '<span>word</span><span>----</span>';
    const siWord = '<span>word</span><span>1020h</span>';
    const diWord = '<span>word</span><span>3040h</span>';

    if (time < 54.16) {
      setText(rootElement, 'spSiVal', '0100h');
      setText(rootElement, 'spSiNote', 'antes del almacenamiento');
      setText(rootElement, 'opSi', 'SP = SP - 2');
    } else {
      setText(rootElement, 'spSiVal', '00FEh');
      setText(rootElement, 'spSiNote', 'nuevo tope');
      setText(rootElement, 'opSi', '0100h - 0002h = 00FEh');
    }

    if (time < 65.97) {
      setTrustedHtml(rootElement, 'bytesFe', emptyBytes);
      setTrustedHtml(rootElement, 'wordFe', emptyWord);
    } else {
      setTrustedHtml(rootElement, 'bytesFe', siBytes);
      setTrustedHtml(rootElement, 'wordFe', siWord);
    }

    if (time < 86.03) {
      setText(rootElement, 'spDiVal', '00FEh');
      setText(rootElement, 'spDiNote', 'tope actual');
      setText(rootElement, 'opDi', 'SP = SP - 2');
    } else {
      setText(rootElement, 'spDiVal', '00FCh');
      setText(rootElement, 'spDiNote', 'nuevo tope');
      setText(rootElement, 'opDi', '00FEh - 0002h = 00FCh');
    }

    if (time < 99.94) {
      setTrustedHtml(rootElement, 'bytesFc', emptyBytes);
      setTrustedHtml(rootElement, 'wordFc', emptyWord);
    } else {
      setTrustedHtml(rootElement, 'bytesFc', diBytes);
      setTrustedHtml(rootElement, 'wordFc', diWord);
    }

    setText(rootElement, 'bpVal', time >= 136.33 ? '3040h' : '0000h');
    if (time < 143.84) {
      setText(rootElement, 'spBpVal', '00FCh');
      setText(rootElement, 'spBpNote', 'apunta al tope');
      setText(rootElement, 'opBpMain', 'BP = [SP]');
      setText(rootElement, 'opBpNote', 'primero se lee el valor del tope');
      toggleClass(rootElement, 'rowBpTop', 'dimmed', false);
      toggleClass(rootElement, 'rowBpNext', 'dimmed', false);
      setText(rootElement, 'bpNextLabel', '@00FE');
      setText(rootElement, 'bpNextAddr', 'debajo');
    } else {
      setText(rootElement, 'spBpVal', '00FEh');
      setText(rootElement, 'spBpNote', 'nuevo tope');
      setText(rootElement, 'opBpMain', 'SP = SP + 2');
      setText(rootElement, 'opBpNote', 'después de sacar el valor');
      toggleClass(rootElement, 'rowBpTop', 'dimmed', true);
      toggleClass(rootElement, 'rowBpNext', 'dimmed', false);
      setText(rootElement, 'bpNextLabel', 'TOPE → @00FE');
      setText(rootElement, 'bpNextAddr', '@00FE');
    }

    setText(rootElement, 'dxVal', time >= 172.82 ? '1020h' : '0000h');
    if (time < 180.80) {
      setText(rootElement, 'spDxVal', '00FEh');
      setText(rootElement, 'spDxNote', 'apunta al tope actual');
      setText(rootElement, 'opDxMain', 'DX = [SP]');
      setText(rootElement, 'opDxNote', 'se toma el valor del tope actual');
      toggleClass(rootElement, 'rowDxTop', 'dimmed', false);
      setDisplay(rootElement, 'rowDxEmpty', 'none');
      setText(rootElement, 'dxTopLabel', 'TOPE → @00FE');
      setText(rootElement, 'dxTopAddr', '@00FE');
    } else {
      setText(rootElement, 'spDxVal', '0100h');
      setText(rootElement, 'spDxNote', 'pila vacía');
      setText(rootElement, 'opDxMain', 'SP = SP + 2');
      setText(rootElement, 'opDxNote', 'la pila activa queda vacía');
      toggleClass(rootElement, 'rowDxTop', 'dimmed', true);
      setDisplay(rootElement, 'rowDxEmpty', 'grid');
      setText(rootElement, 'dxTopLabel', '@00FE');
      setText(rootElement, 'dxTopAddr', 'fuera');
    }
  }

  function setSubtitle(subtitle: HTMLElement, text: string): void {
    subtitle.innerHTML = `<span>${escapeHtml(normalizeSubtitle(text || 'Reproduciendo…'))}</span>`;
  }

  onMount(() => {
    const rootElement = root;
    const audioFile = theory.audioFile ?? 'assets/teoria7.mp3';
    let completionReported = completed;
    let rafId: number | null = null;

    function requireElement<T extends Element>(selector: string): T {
      const element = rootElement.querySelector(selector);
      if (!element) throw new Error(`No se encontró ${selector} en StackLifoTheoryScreen.`);
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

      const visual = cueVisual[activeCue.number];
      const slideId = visual ? `slide-${visual.scene}` : slideForCue(activeCue.number);
      setActiveSlide(rootElement, slideId);
      applyHighlights(rootElement, visual?.hots ?? []);
      applyRuntimeState(rootElement, current);
      setSubtitle(subtitle, activeCue.text);
      statusLine.textContent = `${formatTime(current)} / ${formatTime(duration)} · Teoría 7`;

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
      playBtn.textContent = 'Reproducir de nuevo';
      practiceBtn.classList.add('is-visible');
      setActiveSlide(rootElement, 'slide-10');
      applyHighlights(rootElement, ['check-top']);
      applyRuntimeState(rootElement, getDuration());
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
      setActiveSlide(rootElement, 'slide-1');
      applyHighlights(rootElement, ['intro-title']);
      applyRuntimeState(rootElement, 0);
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
      if (!completionReported) {
        onComplete(theory);
        completionReported = true;
      }
      if (theory.unlockExerciseId) onStartExercise(theory.unlockExerciseId);
    }

    function handleStepClick(event: Event): void {
      const button = event.currentTarget as HTMLElement;
      const cueNumber = slideStartCue[button.dataset.step || ''];
      const cue = cues.find((item) => item.number === cueNumber);
      if (cue) {
        try {
          audio.currentTime = cue.start;
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
    playBtn.addEventListener('click', handlePlayClick);
    resetBtn.addEventListener('click', restart);
    practiceBtn.addEventListener('click', handlePracticeClick);
    const stepButtons = Array.from(rootElement.querySelectorAll<HTMLElement>('[data-step]'));
    stepButtons.forEach((button) => button.addEventListener('click', handleStepClick));
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('loadedmetadata', loadedMetadataHandler);
    audio.addEventListener('canplay', canPlayHandler);
    audio.addEventListener('ended', handleFinished);
    audio.addEventListener('error', errorHandler);

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
<h1>Teoría 7 · Pila básica</h1>
<p class="sub">PUSH, POP, SP y orden LIFO con una explicación separada entre teoría y ejecución.</p>
<div class="progress-shell"><div class="progress-bar" id="progressBar"></div></div>
<nav aria-label="Línea de tiempo" class="timeline" id="timeline">
<button class="time-dot is-active" data-step="slide-1" type="button">Concepto</button><button class="time-dot" data-step="slide-2" type="button">LIFO</button><button class="time-dot" data-step="slide-3" type="button">SP</button><button class="time-dot" data-step="slide-4" type="button">PUSH SI</button><button class="time-dot" data-step="slide-5" type="button">PUSH DI</button><button class="time-dot" data-step="slide-6" type="button">LIFO</button><button class="time-dot" data-step="slide-7" type="button">POP BP</button><button class="time-dot" data-step="slide-8" type="button">POP DX</button><button class="time-dot" data-step="slide-9" type="button">Orden</button><button class="time-dot" data-step="slide-10" type="button">Práctica</button>
</nav>
<div class="audio-error" id="audioError"></div>
</section>
</header>
<section class="slide-stage">
<article class="card slide is-active" data-slide="slide-1">
<div class="slide-head"><div><div class="slide-kicker">Paso 1</div><h2 class="slide-title">Qué es la <span>pila</span></h2></div><div class="slide-number">1 / 10</div></div>
<div class="sim-stack">
<div class="concept-card" data-hotspot="intro-title"><div class="concept-label">Idea central</div><div class="concept-main">La pila es una zona de memoria del 8086</div></div>
<div class="concept-card" data-hotspot="intro-temp"><div class="concept-label">Uso</div><div class="concept-main">Guardar temporalmente</div><p class="concept-note">No es el resultado final: es almacenamiento provisional.</p></div>
<div class="concept-card" data-hotspot="intro-save"><div class="concept-label">Entrada</div><div class="concept-main">Guardar ahora</div><p class="concept-note">El dato queda reservado para más adelante.</p></div>
<div class="concept-card" data-hotspot="intro-recover"><div class="concept-label">Salida</div><div class="concept-main">Recuperar después</div><p class="concept-note">El dato puede volver a un registro cuando se necesite.</p></div>
</div>
</article>
<article class="card slide" data-slide="slide-2">
<div class="slide-head"><div><div class="slide-kicker">Paso 2</div><h2 class="slide-title">Regla <span>LIFO</span></h2></div><div class="slide-number">2 / 10</div></div>
<div class="sim-stack">
<div class="concept-card" data-hotspot="lifo-name"><div class="concept-label">Regla</div><div class="concept-main">LIFO</div><p class="concept-note">Last In, First Out.</p></div>
<div class="concept-card" data-hotspot="lifo-in"><div class="concept-label">Entrada</div><div class="concept-main">Último en entrar</div></div>
<div class="concept-card" data-hotspot="lifo-out"><div class="concept-label">Salida</div><div class="concept-main">Primero en salir</div></div>
<div class="sim-panel" data-hotspot="lifo-stack"><div class="panel-title">Visual de pila</div>
<div class="stack-visual">
<div class="stack-slot" data-hotspot="lifo-pop"><span class="slot-label">sale primero</span><span class="slot-value mono">3040h</span></div>
<div class="stack-slot"><span class="slot-label">entró antes</span><span class="slot-value mono">1020h</span></div>
</div>
</div>
</div>
</article>
<article class="card slide" data-slide="slide-3">
<div class="slide-head"><div><div class="slide-kicker">Paso 3</div><h2 class="slide-title">SP controla el <span>tope</span></h2></div><div class="slide-number">3 / 10</div></div>
<div class="sim-stack">
<div class="sim-panel"><div class="panel-title">Registro usado</div><div class="reg-grid one"><div class="reg-card" data-hotspot="sp-reg"><div class="reg-name mono">SP</div><div class="reg-val mono" data-hotspot="sp-val">0100h</div><div class="reg-note" data-hotspot="sp-top">apunta al tope</div></div></div></div>
<div class="sim-panel"><div class="panel-title">Instrucción de configuración</div><div class="instr-box mono" data-hotspot="sp-setup">MOV SP, 0100h</div></div>
<div class="sim-panel" data-hotspot="sp-zone"><div class="panel-title">Pila</div>
<div class="mem-table">
<div class="mem-row" data-hotspot="sp-empty-row">
<div class="mem-left"><div class="mem-name mono">TOPE_INICIAL</div><div class="addr mono">@0100</div></div>
<div class="bytes mono"><span class="byte-chip">--</span><span class="byte-chip">--</span></div>
<div class="word mono"><span>word</span><span>----</span></div>
</div>
<div class="mem-row dimmed">
<div class="mem-left"><div class="mem-name mono">ESPACIO_PILA</div><div class="addr mono">@00FE</div></div>
<div class="bytes mono"><span class="byte-chip">--</span><span class="byte-chip">--</span></div>
<div class="word mono"><span>word</span><span>----</span></div>
</div>
</div>
</div>
</div>
</article>
<article class="card slide" data-slide="slide-4">
<div class="slide-head"><div><div class="slide-kicker">Paso 4</div><h2 class="slide-title">Guardar <span>SI</span> en la pila</h2></div><div class="slide-number">4 / 10</div></div>
<div class="sim-stack">
  <div class="sim-panel">
    <div class="panel-title">Registros usados</div>
    <div class="reg-grid">
      <div class="reg-card" data-hotspot="si-reg">
        <div class="reg-name mono">SI</div>
        <div class="reg-val mono" data-hotspot="si-val">1020h</div>
        <div class="reg-note">dato que se guardará</div>
      </div>
      <div class="reg-card" data-hotspot="sp-live-si">
        <div class="reg-name mono">SP</div>
        <div class="reg-val mono" id="spSiVal">0100h</div>
        <div class="reg-note" id="spSiNote">tope actual</div>
      </div>
    </div>
  </div>
  <div class="sim-panel">
    <div class="panel-title">Instrucción activa</div>
    <div class="instr-box mono" data-hotspot="pushsi-instr">PUSH SI</div>
  </div>
  <div class="sim-panel">
    <div class="panel-title">Pila</div>
    <div class="mem-table">
      <div class="mem-row" data-hotspot="si-purpose">
        <div class="mem-left">
          <div class="mem-name mono" data-hotspot="top-fe" id="rowFeLabel">TOPE → @00FE</div>
          <div class="addr mono">@00FE</div>
        </div>
        <div class="bytes mono" data-hotspot="bytes-2010" id="bytesFe"><span class="byte-chip">--</span><span class="byte-chip">--</span></div>
        <div class="word mono" id="wordFe"><span>word</span><span>----</span></div>
      </div>
    </div>
  </div>
  <div class="sim-panel">
    <div class="panel-title">Operación interna</div>
    <div class="op-box" data-hotspot="push-word">
      <span class="mono" id="opSi">PUSH guarda una word</span>
      <span class="op-note" data-hotspot="word-two">una word ocupa dos bytes</span>
      <span class="op-note" data-hotspot="sp-down">SP = SP - 2</span>
      <span class="op-note" data-hotspot="little-endian-si">little endian: 1020h → 20 10</span>
    </div>
  </div>
</div>
</article>
<article class="card slide" data-slide="slide-5">
<div class="slide-head"><div><div class="slide-kicker">Paso 5</div><h2 class="slide-title"><span>PUSH DI</span> agrega otro valor</h2></div><div class="slide-number">5 / 10</div></div>
<div class="sim-stack">
<div class="sim-panel"><div class="panel-title">Registros usados</div><div class="reg-grid"><div class="reg-card" data-hotspot="di-reg"><div class="reg-name mono">DI</div><div class="reg-val mono" data-hotspot="di-val">3040h</div><div class="reg-note" data-hotspot="di-purpose">dato que también se guarda</div></div><div class="reg-card" data-hotspot="sp-live-di"><div class="reg-name mono">SP</div><div class="reg-val mono" id="spDiVal">00FEh</div><div class="reg-note" id="spDiNote">tope actual</div></div></div></div>
<div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="pushdi-instr">PUSH DI</div></div>
<div class="sim-panel"><div class="panel-title">Pila</div><div class="mem-table"><div class="mem-row" data-hotspot="row-fc"><div class="mem-left"><div class="mem-name mono" data-hotspot="top-fc">TOPE → @00FC</div><div class="addr mono">@00FC</div></div><div class="bytes mono" data-hotspot="bytes-4030" id="bytesFc"><span class="byte-chip">--</span><span class="byte-chip">--</span></div><div class="word mono" id="wordFc"><span>word</span><span>----</span></div></div><div class="mem-row"><div class="mem-left"><div class="mem-name mono">@00FE</div><div class="addr mono">debajo</div></div><div class="bytes mono"><span>20</span><span>10</span></div><div class="word mono"><span>word</span><span>1020h</span></div></div></div></div>
<div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box" data-hotspot="sp-down-di"><span class="mono" id="opDi">SP = SP - 2</span><span class="op-note">se reserva otra word</span></div></div>
</div>
</article>
<article class="card slide" data-slide="slide-6">
<div class="slide-head"><div><div class="slide-kicker">Paso 6</div><h2 class="slide-title">Dos valores en <span>pila</span></h2></div><div class="slide-number">6 / 10</div></div>
<div class="sim-stack">
<div class="sim-panel" data-hotspot="two-stack"><div class="panel-title">Estado de la pila</div><div class="stack-visual"><div class="stack-slot" data-hotspot="above-3040"><span class="slot-label">arriba · último en entrar</span><span class="slot-value mono">3040h</span></div><div class="stack-slot" data-hotspot="below-1020"><span class="slot-label">abajo · entró antes</span><span class="slot-value mono">1020h</span></div></div></div>
<div class="concept-grid cols-2"><div class="concept-card" data-hotspot="lifo-card-2"><div class="concept-label">Regla</div><div class="concept-main">LIFO</div></div><div class="concept-card" data-hotspot="will-exit"><div class="concept-label">Próxima salida</div><div class="concept-main mono">3040h</div><p class="concept-note">sale primero porque está arriba.</p></div></div>
</div>
</article>
<article class="card slide" data-slide="slide-7">
<div class="slide-head"><div><div class="slide-kicker">Paso 7</div><h2 class="slide-title"><span>POP BP</span> en acción</h2></div><div class="slide-number">7 / 10</div></div>
<div class="sim-stack">
<div class="sim-panel"><div class="panel-title">Registros usados</div><div class="reg-grid"><div class="reg-card" data-hotspot="bp-reg"><div class="reg-name mono">BP</div><div class="reg-val mono" id="bpVal">0000h</div><div class="reg-note" data-hotspot="bp-dest">registro destino</div></div><div class="reg-card" data-hotspot="sp-reg-bp"><div class="reg-name mono">SP</div><div class="reg-val mono" id="spBpVal">00FCh</div><div class="reg-note" id="spBpNote">apunta al tope</div></div></div></div>
<div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="popbp-instr">POP BP</div></div>
<div class="sim-panel"><div class="panel-title">Pila activa</div><div class="mem-table"><div class="mem-row" id="rowBpTop" data-hotspot="pop-top-fc"><div class="mem-left"><div class="mem-name mono">TOPE → @00FC</div><div class="addr mono" id="addrBpTop">@00FC</div></div><div class="bytes mono"><span>40</span><span>30</span></div><div class="word mono" data-hotspot="pop-val-3040"><span>word</span><span>3040h</span></div></div><div class="mem-row" id="rowBpNext" data-hotspot="new-top-fe"><div class="mem-left"><div class="mem-name mono" id="bpNextLabel">@00FE</div><div class="addr mono" id="bpNextAddr">debajo</div></div><div class="bytes mono"><span>20</span><span>10</span></div><div class="word mono" data-hotspot="prev-1020"><span>word</span><span>1020h</span></div></div></div></div>
<div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box"><span class="mono" id="opBpMain">BP = [SP]</span><span class="op-note" id="opBpNote" data-hotspot="after-pop">primero se lee el valor del tope</span><span class="op-note" data-hotspot="sp-up-bp">SP = SP + 2</span></div></div>
</div>
</article>

<article class="card slide" data-slide="slide-8">
<div class="slide-head"><div><div class="slide-kicker">Paso 8</div><h2 class="slide-title"><span>POP DX</span> en acción</h2></div><div class="slide-number">8 / 10</div></div>
<div class="sim-stack">
<div class="sim-panel">
  <div class="panel-title">Registros usados</div>
  <div class="reg-grid">
    <div class="reg-card" data-hotspot="dx-reg">
      <div class="reg-name mono">DX</div>
      <div class="reg-val mono" id="dxVal">0000h</div>
      <div class="reg-note" data-hotspot="dx-dest">segundo destino</div>
    </div>
    <div class="reg-card" data-hotspot="sp-reg-dx">
      <div class="reg-name mono">SP</div>
      <div class="reg-val mono" id="spDxVal">00FEh</div>
      <div class="reg-note" id="spDxNote">apunta al tope actual</div>
    </div>
  </div>
</div>

<div class="sim-panel">
  <div class="panel-title">Instrucción activa</div>
  <div class="instr-box mono" data-hotspot="popdx-instr">POP DX</div>
</div>

<div class="sim-panel">
  <div class="panel-title">Pila activa</div>
  <div class="mem-table">
    <div class="mem-row dimmed">
      <div class="mem-left"><div class="mem-name mono">@00FC</div><div class="addr mono">fuera</div></div>
      <div class="bytes mono"><span>40</span><span>30</span></div>
      <div class="word mono"><span>word</span><span>3040h</span></div>
    </div>
    <div class="mem-row" id="rowDxTop" data-hotspot="dx-source">
      <div class="mem-left"><div class="mem-name mono" id="dxTopLabel">TOPE → @00FE</div><div class="addr mono" id="dxTopAddr">@00FE</div></div>
      <div class="bytes mono"><span>20</span><span>10</span></div>
      <div class="word mono"><span>word</span><span>1020h</span></div>
    </div>
    <div class="mem-row" id="rowDxEmpty" data-hotspot="empty-stack" style="display:none;">
      <div class="mem-left"><div class="mem-name mono">TOPE → @0100</div><div class="addr mono">@0100</div></div>
      <div class="bytes mono"><span class="byte-chip">--</span><span class="byte-chip">--</span></div>
      <div class="word mono"><span>word</span><span>----</span></div>
    </div>
  </div>
</div>

<div class="sim-panel">
  <div class="panel-title">Operación interna</div>
  <div class="op-box">
    <span class="mono" id="opDxMain">DX = [SP]</span>
    <span class="op-note" id="opDxNote">se toma el valor del tope actual</span>
    <span class="op-note" data-hotspot="sp-up-dx">SP = SP + 2</span>
  </div>
</div>
</div>
</article>
<article class="card slide" data-slide="slide-9">
<div class="slide-head"><div><div class="slide-kicker">Paso 9</div><h2 class="slide-title">Resultado y <span>regla</span></h2></div><div class="slide-number">9 / 10</div></div>
<div class="sim-stack">
<div class="sim-panel" data-hotspot="result-title"><div class="panel-title">Orden importante</div><div class="flow-line"><div class="flow-chip" data-hotspot="sum-push-si"><b class="mono">PUSH SI</b><span>entra 1020h</span></div><div class="flow-arrow">→</div><div class="flow-chip" data-hotspot="sum-push-di"><b class="mono">PUSH DI</b><span>entra 3040h</span></div></div></div>
<div class="sim-panel"><div class="panel-title">Salida</div><div class="flow-line"><div class="flow-chip" data-hotspot="sum-pop"><b class="mono">POP BP</b><span>sale DI</span></div><div class="flow-arrow">→</div><div class="flow-chip" data-hotspot="sum-pop"><b class="mono">POP DX</b><span>sale SI</span></div></div></div>
<div class="concept-card" data-hotspot="sum-lifo"><div class="concept-label">Conclusión</div><div class="concept-main">La salida es inversa a la entrada</div></div>
<div class="concept-grid cols-2"><div class="concept-card" data-hotspot="rule-push"><div class="concept-label mono">PUSH</div><div class="concept-main">SP baja 2</div><p class="concept-note">Luego se guarda la word.</p></div><div class="concept-card" data-hotspot="rule-pop"><div class="concept-label mono">POP</div><div class="concept-main">lee la word</div><p class="concept-note">Luego SP sube 2.</p></div></div>
</div>
</article>
<article class="card slide" data-slide="slide-10">
<div class="slide-head"><div><div class="slide-kicker">Paso 10</div><h2 class="slide-title">Qué mirar en la <span>práctica</span></h2></div><div class="slide-number">10 / 10</div></div>
<div class="sim-stack">
<div class="concept-card" data-hotspot="check-title"><div class="concept-label">Seguimiento</div><div class="concept-main">Observa tres cosas</div></div>
<div class="concept-grid"><div class="concept-card" data-hotspot="check-reg"><div class="concept-label">1</div><div class="concept-main">Registro que entrega o recibe</div></div><div class="concept-card" data-hotspot="check-instr"><div class="concept-label">2</div><div class="concept-main">Instrucción activa</div></div><div class="concept-card" data-hotspot="check-sp"><div class="concept-label">3</div><div class="concept-main">Valor actual de SP</div></div></div>
<div class="sim-panel"><div class="panel-title">Con eso se determina</div><div class="flow-line"><div class="flow-chip" data-hotspot="check-enter"><b>qué entra</b><span>a la pila</span></div><div class="flow-arrow">/</div><div class="flow-chip" data-hotspot="check-exit"><b>qué sale</b><span>de la pila</span></div></div><div class="concept-card" data-hotspot="check-top" style="margin-top:8px"><div class="concept-label">Tope</div><div class="concept-main">dónde queda SP</div></div></div>
</div>
</article>
</section>
</main>
<div class="footer-dock">
<div class="footer-inner">
<div class="subtitle" id="subtitle" hidden>
<span>Presiona reproducir para iniciar.</span>
</div>
<div class="controls">
<button class="primary" id="playBtn" type="button">Reproducir</button>
<button aria-label="Reiniciar" class="secondary" id="resetBtn" type="button">↺</button>
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
<button class="primary final-action" id="practiceBtn" type="button">Iniciar práctica</button>
<div class="status-line" id="statusLine">Audio local esperado: <span class="mono">assets/teoria7.mp3</span></div>
</div>
</div>

</div>

<style>
.theory-root {
    --bg: #0f1117;
    --panel: #181d28;
    --panel-2: #1f2532;
    --panel-3: #111722;
    --line: #2e3748;
    --line-2: #3b4659;
    --text: #f4f6fb;
    --soft: #d4d9e5;
    --muted: #aeb6c5;
    --accent: #f4c542;
    --accent-soft: rgba(244, 197, 66, .13);
    --accent-line: rgba(244, 197, 66, .72);
    --blue: #c7d2fe;
    --ok: #2fbf71;
    --danger: #ef5350;
    min-height: 100dvh;
    color: var(--text);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:
      radial-gradient(circle at 50% -14%, rgba(244,197,66,.12), transparent 34%),
      linear-gradient(180deg, #0f1117 0%, #11151d 100%);
  }
  .theory-root, .theory-root * { box-sizing: border-box; }

  button { font: inherit; -webkit-tap-highlight-color: transparent; }
  h1,h2,p { margin: 0; }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; }
  .app { width: 100%; max-width: 500px; min-height: 100dvh; margin: 0 auto; padding: 12px; padding-bottom: 188px; }
  .top { position: sticky; top: 0; z-index: 20; padding-top: 4px; padding-bottom: 10px; background: rgba(15,17,23,.94); backdrop-filter: blur(12px); }
  .card { background: rgba(24,29,40,.96); border: 1px solid var(--line); border-radius: 22px; box-shadow: 0 16px 32px rgba(0,0,0,.26); }
  .hero { padding: 14px; }
  .eyebrow { color: var(--accent); font-size: 11px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
  h1 { margin-top: 4px; font-size: 19px; line-height: 1.12; letter-spacing: -.025em; }
  .sub { margin-top: 6px; color: var(--muted); font-size: 13px; line-height: 1.35; }
  .progress-shell { margin-top: 12px; height: 8px; overflow: hidden; border-radius: 999px; background: #272e3a; }
  .progress-bar { width: 0%; height: 100%; border-radius: inherit; background: var(--accent); transition: width .12s linear; }
  .timeline { display: flex; gap: 6px; margin-top: 10px; overflow-x: auto; overflow-y: hidden; padding-bottom: 2px; scrollbar-width: none; -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain; }
  .timeline::-webkit-scrollbar { display: none; }
  .time-dot { flex: 0 0 auto; min-width: 62px; border: 1px solid var(--line); background: var(--panel-2); color: var(--muted); border-radius: 12px; padding: 7px 6px; font-size: 9.5px; font-weight: 850; text-align: center; cursor: pointer; white-space: nowrap; }
  .time-dot.is-active { color: var(--accent); border-color: var(--accent-line); background: var(--accent-soft); }
  .audio-error { display: none; margin-top: 9px; padding: 10px; border-radius: 13px; background: rgba(239,83,80,.12); border: 1px solid rgba(239,83,80,.38); color: #ffd7d7; font-size: 12.5px; line-height: 1.35; overflow-wrap: anywhere; }
  .audio-error:global(.is-visible) { display: block; }
  .slide-stage { margin-top: 12px; }
  .slide { display: none; min-height: calc(100dvh - 350px); padding: 14px; overflow: hidden; }
  .slide.is-active { display: block; animation: enter .16s ease both; }
  @keyframes enter { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .slide-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
  .slide-kicker { color: var(--accent); font-size: 11px; font-weight: 950; letter-spacing: .12em; text-transform: uppercase; }
  .slide-title { margin-top: 4px; font-size: 21px; line-height: 1.06; font-weight: 950; letter-spacing: -.035em; }
  .slide-title span { color: var(--accent); }
  .slide-number { flex: 0 0 auto; color: var(--muted); font-size: 12px; font-weight: 900; }
  .sim-stack { display: grid; gap: 10px; }
  .sim-panel { border: 1px solid var(--line); background: rgba(32,38,52,.58); border-radius: 17px; padding: 10px; }
  .panel-title { color: var(--blue); font-size: 12px; font-weight: 850; margin-bottom: 8px; }
  .concept-grid { display: grid; gap: 8px; }
  .concept-grid.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .concept-card { border: 1px solid var(--line); background: rgba(17,23,34,.86); border-radius: 16px; padding: 11px; min-width: 0; }
  .concept-label { color: var(--muted); font-size: 10px; font-weight: 950; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 5px; }
  .concept-main { color: var(--text); font-size: clamp(16px, 4.7vw, 23px); font-weight: 950; line-height: 1.08; letter-spacing: -.03em; }
  .concept-note { margin-top: 6px; color: var(--muted); font-size: 12.5px; line-height: 1.32; font-weight: 750; }
  .reg-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .reg-grid.one { grid-template-columns: 1fr; }
  .reg-card { min-height: 68px; border: 1px solid var(--line); background: rgba(17,23,34,.86); border-radius: 16px; padding: 10px; display: grid; align-content: center; min-width: 0; }
  .reg-name { color: var(--blue); font-size: 12px; font-weight: 950; letter-spacing: .08em; }
  .reg-val { margin-top: 5px; color: var(--text); font-size: clamp(24px, 7.4vw, 33px); line-height: 1; font-weight: 950; letter-spacing: .02em; }
  .reg-note { color: var(--muted); font-size: 11px; margin-top: 4px; font-weight: 800; }
  .instr-box { width: 100%; border: 1px solid var(--line); background: var(--panel-3); border-radius: 15px; padding: 11px; color: var(--text); font-size: clamp(17px, 5.2vw, 25px); line-height: 1.18; font-weight: 950; letter-spacing: -.025em; text-align: center; }
  .op-box { border: 1px solid var(--line); background: rgba(17,23,34,.86); border-radius: 16px; padding: 11px; text-align: center; font-size: clamp(16px, 4.7vw, 22px); line-height: 1.15; font-weight: 950; }
  .op-note { display: block; margin-top: 6px; color: var(--muted); font-size: 11px; font-weight: 850; line-height: 1.25; }
  .stack-visual { display: grid; gap: 7px; }
  .stack-slot { border: 1px solid var(--line); background: rgba(17,23,34,.86); border-radius: 15px; padding: 10px; display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; min-height: 48px; }
  .stack-slot .slot-label { color: var(--muted); font-size: 11px; font-weight: 950; text-transform: uppercase; letter-spacing: .08em; }
  .stack-slot .slot-value { color: var(--text); font-size: clamp(16px, 5vw, 24px); font-weight: 950; line-height: 1; }
  .stack-slot:global(.dimmed), .mem-row:global(.dimmed) { opacity: .48; }
  .flow-line { display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px; align-items: center; }
  .flow-chip { border: 1px solid var(--line); background: rgba(17,23,34,.86); border-radius: 15px; padding: 10px; text-align: center; min-width: 0; }
  .flow-chip b { display: block; color: var(--text); font-size: 15px; line-height: 1.1; }
  .flow-chip span { display: block; margin-top: 4px; color: var(--muted); font-size: 11px; font-weight: 800; }
  .flow-arrow { color: var(--muted); font-weight: 950; }
  .mem-table { display: grid; gap: 8px; width: 100%; }
  .mem-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(58px, 76px) minmax(76px, 94px); gap: 6px; align-items: center; width: 100%; min-height: 50px; border: 1px solid var(--line); background: rgba(17,22,32,.78); border-radius: 15px; padding: 8px; overflow: hidden; }
  .mem-left { min-width: 0; display: grid; gap: 2px; }
  .mem-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text); font-size: clamp(11px, 3.15vw, 16px); line-height: 1.05; font-weight: 950; letter-spacing: -.04em; }
  .addr { color: var(--blue); font-size: clamp(9px, 2.45vw, 11px); line-height: 1; font-weight: 850; }
  .bytes { min-width: 0; max-width: 76px; display: flex; justify-content: center; align-items: center; gap: 3px; overflow: hidden; white-space: nowrap; border: 1px solid var(--line); background: rgba(23,28,40,.82); border-radius: 13px; padding: 5px 4px; color: var(--text); font-size: clamp(17px, 5vw, 24px); line-height: 1; font-weight: 950; letter-spacing: .01em; }
  .word { min-width: 0; max-width: 94px; display: flex; justify-content: center; align-items: center; gap: 4px; overflow: hidden; white-space: nowrap; border: 1px solid var(--line); background: rgba(23,28,40,.82); border-radius: 13px; padding: 5px 5px; color: var(--text); font-size: clamp(12px, 3.4vw, 16px); line-height: 1; font-weight: 950; }
  .byte-chip { display: inline-block; min-width: 0; }
  [data-hotspot] { transition: border-color .14s ease, background .14s ease, box-shadow .14s ease, color .14s ease, opacity .14s ease; }
  [data-hotspot]:global(.is-hot) { border-color: var(--accent-line) !important; background-color: var(--accent-soft) !important; box-shadow: 0 0 0 1px rgba(244,197,66,.10); }
  [data-hotspot]:global(.is-hot) .concept-main,
  [data-hotspot]:global(.is-hot) .reg-val,
  [data-hotspot]:global(.is-hot) .slot-value,
  [data-hotspot]:global(.is-hot) .mem-name,
  [data-hotspot]:global(.is-hot) .bytes,
  [data-hotspot]:global(.is-hot) .word,
  [data-hotspot]:global(.is-hot).instr-box,
  [data-hotspot]:global(.is-hot).op-box,
  [data-hotspot]:global(.is-hot).flow-chip b { color: var(--accent); }
  .footer-dock { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; padding: 22px 12px 12px; background: linear-gradient(180deg, rgba(15,17,23,0), rgba(15,17,23,.98) 18%); }
  .footer-inner { width: 100%; max-width: 500px; margin: 0 auto; }
  .subtitle { min-height: 64px; padding: 11px 12px; border-radius: 17px; background: rgba(17,20,27,.98); border: 1px solid var(--line); box-shadow: 0 12px 24px rgba(0,0,0,.3); font-size: 15px; line-height: 1.35; font-weight: 760; }
  .controls { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; margin-top: 8px; }
  .primary,.secondary { min-height: 48px; border-radius: 14px; border: 1px solid var(--line); cursor: pointer; font-weight: 950; }
  .primary { background: var(--accent); border-color: rgba(244,197,66,.84); color: #11141b; }
  .secondary { width: 54px; background: #252c39; color: var(--text); }
  .final-action { display: none; width: 100%; margin-top: 8px; }
  .final-action:global(.is-visible) { display: block; }
  .status-line { margin-top: 7px; color: var(--muted); text-align: center; font-size: 11px; line-height: 1.35; overflow-wrap: anywhere; }
  @media (max-width: 390px) {
    .app { padding-left: 10px; padding-right: 10px; }
    .slide { padding: 12px; }
    .concept-grid.cols-2, .reg-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 380px) {
    .mem-row { grid-template-columns: minmax(0, 1fr) minmax(52px, 68px) minmax(70px, 86px); gap: 5px; padding: 7px; }
    .bytes { max-width: 68px; font-size: clamp(15px, 4.6vw, 20px); padding: 5px 3px; }
    .word { max-width: 86px; font-size: clamp(11px, 3.1vw, 14px); gap: 3px; padding: 5px 4px; }
    .mem-name { font-size: clamp(10px, 3vw, 14px); }
  }
  @media (max-height: 720px) { .slide { min-height: auto; } .sim-panel { padding: 10px; } .slide-title { font-size: 20px; } }

  .subtitle[hidden] { display: none; }

</style>
