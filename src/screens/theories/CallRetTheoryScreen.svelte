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

  type CueFocus = {
    start: number;
    end: number;
    slide: string;
    hots: string[];
  };

  const SRT_SOURCE = `1
00:00:00,000 --> 00:00:01,760
Piense en una función en C.

2
00:00:01,760 --> 00:00:02,840
Por ejemplo,

3
00:00:02,840 --> 00:00:04,380
una función llamada double.

4
00:00:04,380 --> 00:00:06,080
Esta función recibe un valor.

5
00:00:06,080 --> 00:00:07,980
Este valor puede llamarse x.

6
00:00:08,160 --> 00:00:10,800
Dentro de esa función se calcula x más

7
00:00:10,800 --> 00:00:11,380
x.

8
00:00:11,380 --> 00:00:13,340
Y luego se devuelve el resultado.

9
00:00:13,700 --> 00:00:16,380
En C podríamos escribir algo como int double

10
00:00:16,380 --> 00:00:17,660
int x.

11
00:00:17,700 --> 00:00:18,840
Y dentro,

12
00:00:18,840 --> 00:00:20,480
return x más x.

13
00:00:20,780 --> 00:00:21,760
Después,

14
00:00:21,760 --> 00:00:22,820
desde el programa principal,

15
00:00:22,820 --> 00:00:24,140
llamamos a esa función,

16
00:00:24,140 --> 00:00:24,980
por ejemplo,

17
00:00:25,200 --> 00:00:27,520
resultado igual a double 4.

18
00:00:28,120 --> 00:00:29,700
Entra un parámetro,

19
00:00:29,700 --> 00:00:32,460
se ejecuta una acción y vuelve un resultado.

20
00:00:32,860 --> 00:00:36,420
En el ensamblador usamos la misma idea,

21
00:00:36,420 --> 00:00:37,620
pero no se llama función.

22
00:00:37,620 --> 00:00:39,700
La llamamos subrutina.

23
00:00:39,700 --> 00:00:42,420
Una subrutina también es un bloque de código

24
00:00:42,420 --> 00:00:43,380
reutilizable.

25
00:00:43,380 --> 00:00:46,400
Sirve para separar una acción concreta y llamarla

26
00:00:46,400 --> 00:00:47,920
cuando el programa la necesita.

27
00:00:48,000 --> 00:00:50,780
La llamada en C sería double 4.

28
00:00:50,900 --> 00:00:54,580
En el 8086 la llamada será call double.

29
00:00:54,580 --> 00:00:57,720
El parámetro X no existe como variable automática.

30
00:00:57,720 --> 00:01:00,420
En este ejercicio el parámetro viajará hacia el

31
00:01:00,420 --> 00:01:01,500
registro ax.

32
00:01:01,500 --> 00:01:04,880
Por eso primero colocamos el valor 4h en

33
00:01:04,880 --> 00:01:05,580
ax.

34
00:01:05,580 --> 00:01:08,280
ax será la entrada de la subrutina.

35
00:01:08,320 --> 00:01:10,840
Luego la subrutina ejecutará el cálculo.

36
00:01:10,840 --> 00:01:13,680
El return x más x se representa con

37
00:01:13,680 --> 00:01:14,980
add ax,

38
00:01:14,980 --> 00:01:15,940
ax.

39
00:01:15,980 --> 00:01:18,860
Esta instrucción suma ax consigo mismo.

40
00:01:18,900 --> 00:01:20,740
Si ax contiene 4h,

41
00:01:20,740 --> 00:01:22,500
el resultado será 8h.

42
00:01:22,560 --> 00:01:25,480
El resultado también queda en ax.

43
00:01:25,550 --> 00:01:29,130
Entonces AX funciona como entrada y también como

44
00:01:29,130 --> 00:01:29,770
salida.

45
00:01:29,830 --> 00:01:32,550
Ese es el contrato de esta subrutina.

46
00:01:32,550 --> 00:01:34,290
AX entra con el parámetro,

47
00:01:34,470 --> 00:01:37,530
la subrutina modifica AX y AX sale con

48
00:01:37,530 --> 00:01:38,410
el resultado.

49
00:01:38,590 --> 00:01:40,790
Ahora mira el orden del programa.

50
00:01:40,790 --> 00:01:43,610
La subrutina Double puede estar escrita como un

51
00:01:43,610 --> 00:01:44,610
bloque separado.

52
00:01:44,610 --> 00:01:47,450
Pero definir una subrutina no significa ejecutarla.

53
00:01:47,450 --> 00:01:49,650
El flujo real empieza en Start.

54
00:01:49,990 --> 00:01:51,990
Desde Start se prepara el dato.

55
00:01:51,990 --> 00:01:54,430
Primero se ejecuta Move AX 4H.

56
00:01:54,580 --> 00:01:56,320
Con eso cargamos el parámetro.

57
00:01:56,320 --> 00:01:58,820
Ahora ax contiene 4h.

58
00:01:58,820 --> 00:02:00,840
Después viene cal double.

59
00:02:00,840 --> 00:02:03,800
Cal cambia el flujo del programa.

60
00:02:03,800 --> 00:02:06,940
El programa deja momentáneamente el bloque principal y

61
00:02:06,940 --> 00:02:08,460
entra en la subrutina double.

62
00:02:08,540 --> 00:02:10,080
Ax no se pierde.

63
00:02:10,080 --> 00:02:11,760
Sigue conteniendo 4h.

64
00:02:12,760 --> 00:02:16,000
Dentro de double aparece la instrucción importante add

65
00:02:16,000 --> 00:02:16,640
ax,

66
00:02:16,640 --> 00:02:17,240
ax.

67
00:02:17,240 --> 00:02:19,740
Esta instrucción es el cuerpo de la función.

68
00:02:19,740 --> 00:02:21,820
Equivale a return x más x.

69
00:02:22,050 --> 00:02:24,030
Como AX vale 4H,

70
00:02:24,030 --> 00:02:26,050
se calcula 4H más 4H.

71
00:02:26,050 --> 00:02:27,510
El resultado es 8H.

72
00:02:27,510 --> 00:02:30,570
AX se actualiza en el mismo registro.

73
00:02:30,570 --> 00:02:32,450
Ahora AX contiene 8H.

74
00:02:32,910 --> 00:02:34,270
Después aparece Z.

75
00:02:34,270 --> 00:02:38,250
Z termina la subrutina y devuelve al flujo

76
00:02:38,250 --> 00:02:39,530
principal del programa.

77
00:02:39,530 --> 00:02:41,790
El programa continúa justo después de CAL.

78
00:02:41,790 --> 00:02:45,070
La siguiente instrucción es MOV BX,

79
00:02:45,070 --> 00:02:45,770
AX.

80
00:02:45,770 --> 00:02:46,570
En este punto,

81
00:02:46,570 --> 00:02:48,870
AX contiene el resultado retornado.

82
00:02:48,870 --> 00:02:50,730
Para seguir esta práctica,

83
00:02:50,730 --> 00:02:52,300
Observa cinco partes.

84
00:02:52,300 --> 00:02:52,860
Primero,

85
00:02:52,860 --> 00:02:54,240
¿qué valor entra en ax?

86
00:02:54,400 --> 00:02:55,460
Segundo,

87
00:02:55,460 --> 00:02:57,920
cuando cal entra a la subrutina.

88
00:02:57,920 --> 00:02:58,720
Tercero,

89
00:02:58,720 --> 00:03:00,520
¿qué instrucción hace el cálculo?

90
00:03:00,620 --> 00:03:01,700
Cuarto,

91
00:03:01,700 --> 00:03:04,080
cuando red vuelve al principal.

92
00:03:04,620 --> 00:03:05,920
Y quinto,

93
00:03:05,920 --> 00:03:07,840
¿dónde se guarda el resultado final?

94
00:03:07,840 --> 00:03:09,100
En este ejercicio,

95
00:03:09,100 --> 00:03:11,940
ax transporta el parámetro y ahí el resultado.

96
00:03:12,020 --> 00:03:13,460
Cal entra en double,

97
00:03:13,460 --> 00:03:16,320
add ax calcula el double y red vuelve

98
00:03:16,320 --> 00:03:17,360
al programa principal.`;

  function parseTime(value: string): number {
    const parts = value.trim().replace(',', '.').split(':');
    const hours = Number(parts[0] || 0);
    const minutes = Number(parts[1] || 0);
    const seconds = Number(parts[2] || 0);
    return hours * 3600 + minutes * 60 + seconds;
  }

  function parseSrt(text: string): Cue[] {
    return String(text)
      .replace(/^\uFEFF/, '')
      .trim()
      .split(/\n\s*\n/)
      .map((block) => {
        const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
        if (lines.length < 3) return null;
        const number = Number(lines[0]);
        const timing = lines[1].split(/\s+-->\s+/);
        if (!Number.isFinite(number) || timing.length !== 2) return null;
        return {
          number,
          start: parseTime(timing[0]),
          end: parseTime(timing[1]),
          text: lines.slice(2).join(' ')
        };
      })
      .filter((cue): cue is Cue => Boolean(cue))
      .sort((a, b) => a.start - b.start);
  }

  const cues = parseSrt(SRT_SOURCE);
  const fallbackDuration = cues[cues.length - 1]?.end ?? 0;

  const slideStartCue: Record<string, number> = {
    'slide-1': 1,
    'slide-2': 20,
    'slide-3': 29,
    'slide-4': 49,
    'slide-5': 54,
    'slide-6': 58,
    'slide-7': 64,
    'slide-8': 74,
    'slide-9': 82
  };

  const slideRanges = [
    { id: 'slide-1', start: 1, end: 19 },
    { id: 'slide-2', start: 20, end: 28 },
    { id: 'slide-3', start: 29, end: 48 },
    { id: 'slide-4', start: 49, end: 53 },
    { id: 'slide-5', start: 54, end: 57 },
    { id: 'slide-6', start: 58, end: 63 },
    { id: 'slide-7', start: 64, end: 73 },
    { id: 'slide-8', start: 74, end: 81 },
    { id: 'slide-9', start: 82, end: 98 }
  ];

  const slideNames: Record<string, string> = {
    'slide-1': 'Función C',
    'slide-2': 'Subrutina',
    'slide-3': 'Contrato',
    'slide-4': 'Orden',
    'slide-5': 'MOV AX',
    'slide-6': 'CALL',
    'slide-7': 'ADD',
    'slide-8': 'RET',
    'slide-9': 'Práctica'
  };

  const cueMap: CueFocus[] = [
  { start: 1, end: 3, slide: 'slide-1', hots: ['s1-fn'] },
  { start: 4, end: 4, slide: 'slide-1', hots: ['s1-param'] },
  { start: 5, end: 5, slide: 'slide-1', hots: ['s1-x'] },
  { start: 6, end: 8, slide: 'slide-1', hots: ['s1-return'] },
  { start: 9, end: 12, slide: 'slide-1', hots: ['s1-return'] },
  { start: 13, end: 17, slide: 'slide-1', hots: ['s1-call'] },
  { start: 18, end: 18, slide: 'slide-1', hots: ['s1-param'] },
  { start: 19, end: 19, slide: 'slide-1', hots: ['s1-action'] },

  { start: 20, end: 20, slide: 'slide-2', hots: ['s2-col-c', 's2-col-asm'] },
  { start: 21, end: 21, slide: 'slide-2', hots: ['s2-name-c'] },
  { start: 22, end: 22, slide: 'slide-2', hots: ['s2-name-asm'] },
  { start: 23, end: 24, slide: 'slide-2', hots: ['s2-use-c', 's2-use-asm'] },
  { start: 25, end: 25, slide: 'slide-2', hots: ['s2-goal-c', 's2-goal-asm'] },
  { start: 26, end: 26, slide: 'slide-2', hots: ['s2-when-c', 's2-when-asm'] },
  { start: 27, end: 27, slide: 'slide-2', hots: ['s2-call-c'] },
  { start: 28, end: 28, slide: 'slide-2', hots: ['s2-call-asm'] },

  { start: 29, end: 31, slide: 'slide-3', hots: ['s3-no-auto', 's3-register'] },
  { start: 32, end: 34, slide: 'slide-3', hots: ['s3-input'] },
  { start: 35, end: 39, slide: 'slide-3', hots: ['s3-process'] },
  { start: 40, end: 42, slide: 'slide-3', hots: ['s3-output'] },
  { start: 43, end: 48, slide: 'slide-3', hots: ['s3-contract'] },

  { start: 49, end: 51, slide: 'slide-4', hots: ['s4-double'] },
  { start: 52, end: 52, slide: 'slide-4', hots: ['s4-define'] },
  { start: 53, end: 53, slide: 'slide-4', hots: ['s4-start', 's4-flow'] },

  { start: 54, end: 55, slide: 'slide-5', hots: ['s5-mov'] },
  { start: 56, end: 57, slide: 'slide-5', hots: ['s5-ax', 's5-op', 's5-c-call'] },

  { start: 58, end: 59, slide: 'slide-6', hots: ['s6-call'] },
  { start: 60, end: 60, slide: 'slide-6', hots: ['s6-main'] },
  { start: 61, end: 61, slide: 'slide-6', hots: ['s6-sub'] },
  { start: 62, end: 63, slide: 'slide-6', hots: ['s6-ax', 's6-keeps'] },

  { start: 64, end: 66, slide: 'slide-7', hots: ['s7-add'] },
  { start: 67, end: 68, slide: 'slide-7', hots: ['s7-c-return'] },
  { start: 69, end: 69, slide: 'slide-7', hots: ['s7-ax'] },
  { start: 70, end: 71, slide: 'slide-7', hots: ['s7-op'] },
  { start: 72, end: 73, slide: 'slide-7', hots: ['s7-ax'] },

  { start: 74, end: 76, slide: 'slide-8', hots: ['s8-ret', 's8-sub'] },
  { start: 77, end: 77, slide: 'slide-8', hots: ['s8-main'] },
  { start: 78, end: 79, slide: 'slide-8', hots: ['s8-next'] },
  { start: 80, end: 81, slide: 'slide-8', hots: ['s8-ax'] },

  { start: 82, end: 85, slide: 'slide-9', hots: ['s9-v1'] },
  { start: 86, end: 87, slide: 'slide-9', hots: ['s9-v2'] },
  { start: 88, end: 89, slide: 'slide-9', hots: ['s9-v3'] },
  { start: 90, end: 91, slide: 'slide-9', hots: ['s9-v4'] },
  { start: 92, end: 93, slide: 'slide-9', hots: ['s9-v5', 's9-final-bx'] },
  { start: 94, end: 95, slide: 'slide-9', hots: ['s9-contract', 's9-final-ax'] },
  { start: 96, end: 96, slide: 'slide-9', hots: ['s9-v2'] },
  { start: 97, end: 97, slide: 'slide-9', hots: ['s9-v3'] },
  { start: 98, end: 98, slide: 'slide-9', hots: ['s9-v4'] }
];

  function escapeHtml(value: string): string {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeSubtitle(text: string): string {
    return String(text)
      .replace(/Piense/g, 'Piensa')
      .replace(/int\s+double\s+int\s+x/gi, 'int double(int x)')
      .replace(/double\s+4/gi, 'double(4)')
      .replace(/call\s+double/gi, 'CALL double')
      .replace(/cal\s+double/gi, 'CALL double')
      .replace(/Cal/g, 'CALL')
      .replace(/cal/g, 'CALL')
      .replace(/CAL/g, 'CALL')
      .replace(/Move\s+AX\s+4H/g, 'MOV AX, 0004h')
      .replace(/move\s+AX\s+4H/gi, 'MOV AX, 0004h')
      .replace(/MOV\s+AX\s+4H/g, 'MOV AX, 0004h')
      .replace(/add\s+ax\s*,\s*ax/gi, 'ADD AX, AX')
      .replace(/add\s+ax/gi, 'ADD AX, AX')
      .replace(/red/gi, 'RET')
      .replace(/Z/g, 'RET')
      .replace(/4H/g, '0004h')
      .replace(/4h/g, '0004h')
      .replace(/8H/g, '0008h')
      .replace(/8h/g, '0008h')
      .replace(/ax/g, 'AX')
      .replace(/bx/g, 'BX')
      .replace(/Start/g, 'start')
      .replace(/Double/g, 'double')
      .replace(/ADD AX, AX,\s*AX/g, 'ADD AX, AX')
      .replace(/ADD AX, AX calcula el double/g, 'ADD AX, AX calcula el doble')
      .replace(/\s+,/g, ',')
      .replace(/\s+\./g, '.')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function cueAt(time: number): Cue | null {
    if (!cues.length) return null;
    if (time <= cues[0].start) return cues[0];

    let last = cues[0];
    for (const cue of cues) {
      if (time >= cue.start && time <= cue.end) return cue;
      if (time >= cue.start) last = cue;
    }

    return time >= fallbackDuration ? cues[cues.length - 1] : last;
  }

  function metaForCue(number: number): CueFocus {
    return cueMap.find((item) => number >= item.start && number <= item.end) ?? cueMap[0];
  }

  function metaForTime(time: number, meta: CueFocus): CueFocus {
    if (time >= 31.20 && time <= 32.46) {
      return { start: meta.start, end: meta.end, slide: 'slide-1', hots: ['s1-result'] };
    }
    return meta;
  }

  function slideForCue(number: number): string {
    return slideRanges.find((range) => number >= range.start && number <= range.end)?.id ?? 'slide-1';
  }

  function setActiveSlide(rootElement: HTMLElement, slideId: string): void {
    rootElement.querySelectorAll<HTMLElement>('[data-slide]').forEach((slide) => {
      slide.classList.toggle('is-active', slide.dataset.slide === slideId);
    });

    rootElement.querySelectorAll<HTMLElement>('[data-step]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.step === slideId);
    });

    const activeButton = rootElement.querySelector<HTMLElement>(`[data-step="${slideId}"]`);
    if (activeButton) {
      activeButton.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }

  function applyHotspots(rootElement: HTMLElement, hots: string[]): void {
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

  function applyDynamicState(rootElement: HTMLElement, cueNumber: number): void {
    setText(rootElement, 's5AxVal', cueNumber >= 57 ? '0004h' : '0000h');
    setText(rootElement, 's5OpText', cueNumber >= 57 ? 'AX = 0004h' : 'AX recibe 0004h');
    setText(rootElement, 's7AxVal', cueNumber >= 73 ? '0008h' : '0004h');
    setText(rootElement, 's7OpText', cueNumber >= 72 ? 'AX = 0008h' : 'AX = AX + AX');
    setText(rootElement, 's7OpNote', cueNumber >= 70 ? '0004h + 0004h = 0008h' : 'duplica el valor de entrada');
  }

  function setSubtitle(subtitle: HTMLElement, text: string): void {
    subtitle.innerHTML = `<span>${escapeHtml(normalizeSubtitle(text || 'Reproduciendo…'))}</span>`;
  }

  function formatTime(value: number): string {
    if (!Number.isFinite(value) || value < 0) return '00:00';
    const minutes = Math.floor(value / 60).toString().padStart(2, '0');
    const seconds = Math.floor(value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  onMount(() => {
    const rootElement = root;
    const audioFile = theory.audioFile ?? 'assets/teoria8.mp3';
    let completionReported = completed;
    let rafId: number | null = null;

    function requireElement<T extends Element>(selector: string): T {
      const element = rootElement.querySelector(selector);
      if (!element) throw new Error(`No se encontró ${selector} en CallRetTheoryScreen.`);
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
    const timeline = requireElement<HTMLElement>('#timeline');
    const subtitleToggle = createSubtitleToggle(subtitleBtn, subtitle);

    function getDuration(): number {
      return Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : fallbackDuration;
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
      setActiveSlide(rootElement, 'slide-9');
      applyHotspots(rootElement, ['s9-contract', 's9-final-ax']);
      applyDynamicState(rootElement, 98);
      setSubtitle(subtitle, cues[cues.length - 1]?.text || 'Clase completada.');
      statusLine.textContent = 'Clase completada.';
      progressBar.style.width = '100%';
      if (rafId !== null) cancelAnimationFrame(rafId);
    }

    function update(): void {
      const current = audio.currentTime || 0;
      const duration = getDuration();
      const percent = duration > 0 ? Math.min(100, Math.max(0, (current / duration) * 100)) : 0;
      progressBar.style.width = `${percent}%`;

      const activeCue = cueAt(current);
      if (!activeCue) return;

      const meta = metaForTime(current, metaForCue(activeCue.number));
      setActiveSlide(rootElement, meta.slide || slideForCue(activeCue.number));
      applyHotspots(rootElement, meta.hots);
      applyDynamicState(rootElement, activeCue.number);
      setSubtitle(subtitle, activeCue.text);
      statusLine.textContent = `${formatTime(current)} / ${formatTime(duration)} · ${slideNames[meta.slide] || 'Teoría'}`;

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
      applyHotspots(rootElement, ['s1-fn']);
      applyDynamicState(rootElement, 1);
      setSubtitle(subtitle, 'Presiona reproducir para iniciar.');
      statusLine.innerHTML = `Audio esperado: <span class="mono">${escapeHtml(audioFile)}</span>`;
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
      update();
    };
    const endedHandler = () => handleFinished();
    const timeUpdateHandler = () => update();
    const errorHandler = () => showAudioError();

    audio.src = new URL(audioFile, window.location.href).href;
    audio.load();

    audio.addEventListener('loadedmetadata', loadedMetadataHandler);
    audio.addEventListener('timeupdate', timeUpdateHandler);
    audio.addEventListener('ended', endedHandler);
    audio.addEventListener('error', errorHandler);
    playButton.addEventListener('click', handlePlayClick);
    restartButton.addEventListener('click', restart);
    practiceButton.addEventListener('click', handlePracticeClick);
    timeline.querySelectorAll<HTMLElement>('[data-step]').forEach((button) => {
      button.addEventListener('click', handleStepClick);
    });

    restart();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      audio.pause();
      audio.removeEventListener('loadedmetadata', loadedMetadataHandler);
      audio.removeEventListener('timeupdate', timeUpdateHandler);
      audio.removeEventListener('ended', endedHandler);
      audio.removeEventListener('error', errorHandler);
      playButton.removeEventListener('click', handlePlayClick);
      restartButton.removeEventListener('click', restart);
      practiceButton.removeEventListener('click', handlePracticeClick);
      timeline.querySelectorAll<HTMLElement>('[data-step]').forEach((button) => {
        button.removeEventListener('click', handleStepClick);
      });
      subtitleToggle.destroy();
    };
  });
</script>

<div class="theory-root" bind:this={root}>
<main class="app">
  <header class="top">
    <section class="card hero">
      <div class="eyebrow">Microprocesadores · Ensamblador 8086</div>
      <h1>Teoría 8 · Subrutinas como funciones</h1>
      <p class="sub">Analogía con C: parámetro en AX, CALL, cuerpo de subrutina, RET y resultado retornado.</p>
      <div class="progress-shell"><div class="progress-bar" id="progressBar"></div></div>
      <nav aria-label="Línea de tiempo" class="timeline" id="timeline">
        <button class="time-dot is-active" data-step="slide-1" type="button">Función C</button>
        <button class="time-dot" data-step="slide-2" type="button">Subrutina</button>
        <button class="time-dot" data-step="slide-3" type="button">Contrato</button>
        <button class="time-dot" data-step="slide-4" type="button">Orden</button>
        <button class="time-dot" data-step="slide-5" type="button">MOV AX</button>
        <button class="time-dot" data-step="slide-6" type="button">CALL</button>
        <button class="time-dot" data-step="slide-7" type="button">ADD</button>
        <button class="time-dot" data-step="slide-8" type="button">RET</button>
        <button class="time-dot" data-step="slide-9" type="button">Práctica</button>
      </nav>
      <div class="audio-error" id="audioError"></div>
    </section>
  </header>

  <section class="slide-stage">
    <article class="card slide is-active" data-slide="slide-1">
      <div class="slide-head"><div><div class="slide-kicker">Paso 1</div><h2 class="slide-title">Función en <span>C</span></h2></div><div class="slide-number">1 / 9</div></div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Idea en C</div>
          <div class="code-line c-code mono">
            <span class="token" data-hotspot="s1-fn">int double(int x) &#123;</span><br>
            <span class="indent"><span class="token" data-hotspot="s1-return">return x + x;</span></span><br>
            <span class="brace">&#125;</span>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Llamada desde el principal</div>
          <div class="code-line c-code mono"><span class="token" data-hotspot="s1-call">resultado = double(4);</span></div>
        </div>
        <div class="concept-grid cols-2">
          <div class="concept-card" data-hotspot="s1-param"><span class="concept-label">Entrada</span><div class="concept-main">parámetro</div><p class="concept-note">el valor entra a la función.</p></div>
          <div class="concept-card" data-hotspot="s1-action"><span class="concept-label">Proceso</span><div class="concept-main">acción</div><p class="concept-note">el bloque ejecuta una tarea.</p></div>
          <div class="concept-card" data-hotspot="s1-result"><span class="concept-label">Salida</span><div class="concept-main">resultado</div><p class="concept-note">el valor vuelve al principal.</p></div>
          <div class="concept-card" data-hotspot="s1-x"><span class="concept-label">Parámetro</span><div class="concept-main mono">x</div><p class="concept-note">nombre usado dentro de la función.</p></div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-2">
      <div class="slide-head"><div><div class="slide-kicker">Paso 2</div><h2 class="slide-title">Función en C y <span>subrutina</span></h2></div><div class="slide-number">2 / 9</div></div>
      <div class="sim-stack">
        <div class="step2-grid">
          <div class="compare-card" data-hotspot="s2-col-c"><span class="label">Columna 1</span><div class="value-large mono">C</div><p class="concept-note">función.</p></div>
          <div class="compare-card" data-hotspot="s2-col-asm"><span class="label">Columna 2</span><div class="value-large mono">8086</div><p class="concept-note">subrutina.</p></div>
        </div>
        <div class="step2-grid">
          <div class="concept-card" data-hotspot="s2-name-c"><span class="concept-label">Nombre</span><div class="concept-main">función</div></div>
          <div class="concept-card" data-hotspot="s2-name-asm"><span class="concept-label">Nombre</span><div class="concept-main">subrutina</div></div>
        </div>
        <div class="step2-grid">
          <div class="concept-card" data-hotspot="s2-use-c"><span class="concept-label">Uso</span><div class="concept-main">bloque reutilizable</div></div>
          <div class="concept-card" data-hotspot="s2-use-asm"><span class="concept-label">Uso</span><div class="concept-main">bloque reutilizable</div></div>
        </div>
        <div class="step2-grid">
          <div class="concept-card" data-hotspot="s2-goal-c"><span class="concept-label">Objetivo</span><div class="concept-main">acción concreta</div></div>
          <div class="concept-card" data-hotspot="s2-goal-asm"><span class="concept-label">Objetivo</span><div class="concept-main">acción concreta</div></div>
        </div>
        <div class="step2-grid">
          <div class="concept-card" data-hotspot="s2-when-c"><span class="concept-label">Cuándo</span><div class="concept-main">cuando se necesita</div></div>
          <div class="concept-card" data-hotspot="s2-when-asm"><span class="concept-label">Cuándo</span><div class="concept-main">cuando se necesita</div></div>
        </div>
        <div class="step2-grid">
          <div class="compare-card" data-hotspot="s2-call-c"><span class="label">Llamada</span><div class="value-large mono">double(4)</div><p class="concept-note">función en C.</p></div>
          <div class="compare-card" data-hotspot="s2-call-asm"><span class="label">Llamada</span><div class="value-large mono">CALL double</div><p class="concept-note">subrutina en 8086.</p></div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-3">
      <div class="slide-head"><div><div class="slide-kicker">Paso 3</div><h2 class="slide-title">Contrato de <span>AX</span></h2></div><div class="slide-number">3 / 9</div></div>
      <div class="sim-stack">
        <div class="concept-panel">
          <div class="panel-title">Referencia breve</div>
          <div class="concept-lines">
            <div class="concept-line" data-hotspot="s3-no-auto"><span class="concept-label">En C</span><span class="concept-code mono">x</span> parece una variable de la función.</div>
            <div class="concept-line" data-hotspot="s3-register"><span class="concept-label">En 8086</span>El parámetro viajará en <span class="concept-code mono">AX</span>.</div>
          </div>
        </div>
        <div class="flow-grid three">
          <div class="route-chip mono" data-hotspot="s3-input"><span class="flow-main">AX = 0004h</span><span>entrada</span></div>
          <div class="route-chip mono" data-hotspot="s3-process"><span class="flow-main">ADD AX, AX</span><span>proceso</span></div>
          <div class="route-chip mono" data-hotspot="s3-output"><span class="flow-main">AX = 0008h</span><span>salida</span></div>
        </div>
        <div class="concept-card" data-hotspot="s3-contract"><span class="concept-label">Regla del ejercicio</span><div class="concept-main">AX entra y AX sale</div><p class="concept-note">La subrutina modifica el mismo registro.</p></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-4">
      <div class="slide-head"><div><div class="slide-kicker">Paso 4</div><h2 class="slide-title">Orden del <span>programa</span></h2></div><div class="slide-number">4 / 9</div></div>
      <div class="sim-stack">
        <div class="sim-panel">
          <div class="panel-title">Subrutina definida</div>
          <div class="code-line small mono">
            <span class="token soft" data-hotspot="s4-double">double:</span><br>
            <span class="token soft">ADD AX, AX</span><br>
            <span class="token soft">RET</span>
          </div>
        </div>
        <div class="sim-panel">
          <div class="panel-title">Flujo principal</div>
          <div class="code-line small mono">
            <span class="token soft" data-hotspot="s4-start">start:</span><br>
            <span class="token soft">MOV AX, 0004h</span><br>
            <span class="token soft">CALL double</span><br>
            <span class="token soft">MOV BX, AX</span>
          </div>
        </div>
        <div class="concept-grid cols-2">
          <div class="concept-card" data-hotspot="s4-define"><span class="concept-label">Regla</span><div class="concept-main">definir no ejecuta</div></div>
          <div class="concept-card" data-hotspot="s4-flow"><span class="concept-label">Inicio real</span><div class="concept-main mono">start</div></div>
        </div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-5">
      <div class="slide-head"><div><div class="slide-kicker">Paso 5</div><h2 class="slide-title">Preparar el <span>parámetro</span></h2></div><div class="slide-number">5 / 9</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registro usado</div><div class="reg-grid one"><div class="reg-card" data-hotspot="s5-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" id="s5AxVal">0000h</div><div class="reg-note">parámetro de entrada</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono"><span class="token" data-hotspot="s5-mov">MOV AX, 0004h</span></div></div>
        <div class="concept-panel"><div class="panel-title">Analogía con C</div><div class="concept-lines"><div class="concept-line" data-hotspot="s5-c-call"><span class="concept-label">Idea</span><span class="concept-code mono">double(4)</span>: el valor 0004h debe entrar antes de llamar.</div></div></div>
        <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s5-op"><span id="s5OpText">AX recibe 0004h</span><small>carga el parámetro para la subrutina</small></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-6">
      <div class="slide-head"><div><div class="slide-kicker">Paso 6</div><h2 class="slide-title"><span>CALL</span> cambia el flujo</h2></div><div class="slide-number">6 / 9</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registro usado</div><div class="reg-grid one"><div class="reg-card" data-hotspot="s6-ax"><div class="reg-name mono">AX</div><div class="reg-val mono">0004h</div><div class="reg-note">no se pierde al entrar</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono"><span class="token" data-hotspot="s6-call">CALL double</span></div></div>
        <div class="flow-grid cols-2">
          <div class="route-chip mono" data-hotspot="s6-main"><span class="flow-main">principal</span><span>sale desde aquí</span></div>
          <div class="route-chip mono" data-hotspot="s6-sub"><span class="flow-main">double</span><span>entra aquí</span></div>
        </div>
        <div class="concept-card" data-hotspot="s6-keeps"><span class="concept-label">Estado</span><div class="concept-main">AX conserva 0004h</div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-7">
      <div class="slide-head"><div><div class="slide-kicker">Paso 7</div><h2 class="slide-title">Cuerpo de la <span>subrutina</span></h2></div><div class="slide-number">7 / 9</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registro usado</div><div class="reg-grid one"><div class="reg-card" data-hotspot="s7-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" id="s7AxVal">0004h</div><div class="reg-note">mismo registro fuente y destino</div></div></div></div>
        <div class="concept-panel"><div class="panel-title">Idea en C</div><div class="concept-lines"><div class="concept-line" data-hotspot="s7-c-return"><span class="concept-label">Cuerpo</span><span class="concept-code mono">return x + x;</span></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono"><span class="token" data-hotspot="s7-add">ADD AX, AX</span></div></div>
        <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box mono" data-hotspot="s7-op"><span id="s7OpText">AX = AX + AX</span><small id="s7OpNote">0004h + 0004h = 0008h</small></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-8">
      <div class="slide-head"><div><div class="slide-kicker">Paso 8</div><h2 class="slide-title"><span>RET</span> vuelve al principal</h2></div><div class="slide-number">8 / 9</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Registro usado</div><div class="reg-grid one"><div class="reg-card" data-hotspot="s8-ax"><div class="reg-name mono">AX</div><div class="reg-val mono">0008h</div><div class="reg-note">resultado retornado</div></div></div></div>
        <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="code-line mono"><span class="token" data-hotspot="s8-ret">RET</span></div></div>
        <div class="flow-grid cols-2">
          <div class="route-chip mono" data-hotspot="s8-sub"><span class="flow-main">double</span><span>termina la subrutina</span></div>
          <div class="route-chip mono" data-hotspot="s8-main"><span class="flow-main">principal</span><span>continúa después de CALL</span></div>
        </div>
        <div class="sim-panel"><div class="panel-title">Siguiente instrucción</div><div class="code-line mono"><span class="token" data-hotspot="s8-next">MOV BX, AX</span></div></div>
      </div>
    </article>

    <article class="card slide" data-slide="slide-9">
      <div class="slide-head"><div><div class="slide-kicker">Paso 9</div><h2 class="slide-title">Qué observar en la <span>práctica</span></h2></div><div class="slide-number">9 / 9</div></div>
      <div class="sim-stack">
        <div class="sim-panel"><div class="panel-title">Cinco puntos</div><div class="state-table">
          <div class="state-row head"><div class="state-cell">#</div><div class="state-cell">mirar</div><div class="state-cell">clave</div></div>
          <div class="state-row" data-hotspot="s9-v1"><div class="state-cell mono">1</div><div class="state-cell">entrada</div><div class="state-cell mono">AX</div></div>
          <div class="state-row" data-hotspot="s9-v2"><div class="state-cell mono">2</div><div class="state-cell">llamada</div><div class="state-cell mono">CALL</div></div>
          <div class="state-row" data-hotspot="s9-v3"><div class="state-cell mono">3</div><div class="state-cell">cálculo</div><div class="state-cell mono">ADD AX, AX</div></div>
          <div class="state-row" data-hotspot="s9-v4"><div class="state-cell mono">4</div><div class="state-cell">retorno</div><div class="state-cell mono">RET</div></div>
          <div class="state-row" data-hotspot="s9-v5"><div class="state-cell mono">5</div><div class="state-cell">resultado</div><div class="state-cell mono">BX</div></div>
        </div></div>
        <div class="concept-grid cols-2">
          <div class="concept-card" data-hotspot="s9-final-ax"><span class="concept-label">Resultado en AX</span><div class="concept-main mono">0008h</div></div>
          <div class="concept-card" data-hotspot="s9-final-bx"><span class="concept-label">Copia final</span><div class="concept-main mono">BX recibe AX</div><p class="concept-note mono">MOV BX, AX</p></div>
        </div>
        <div class="concept-card" data-hotspot="s9-contract"><span class="concept-label">Contrato</span><div class="concept-main">AX transporta el parámetro y el resultado</div></div>
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
    <div class="status-line" id="statusLine">Audio esperado: <span class="mono">assets/teoria8.mp3</span></div>
  </div>
</footer>

<audio id="audio" preload="metadata"></audio>
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
    --blue: #c7d2fe;
    min-height: 100dvh;
    color: var(--text);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:
      radial-gradient(circle at 50% -16%, rgba(244, 197, 66, .13), transparent 34%),
      linear-gradient(180deg, var(--bg) 0%, #11151d 100%);
  }
  .theory-root, .theory-root * { box-sizing: border-box; }

  * { box-sizing: border-box; }
  button { font: inherit; -webkit-tap-highlight-color: transparent; }
  h1, h2, p { margin: 0; }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; }

  .app { width: 100%; max-width: 500px; min-height: 100dvh; margin: 0 auto; padding: 12px; padding-bottom: 188px; }
  .top { position: sticky; top: 0; z-index: 20; padding-top: 4px; padding-bottom: 10px; background: rgba(15, 17, 23, .94); backdrop-filter: blur(12px); }
  .card { background: rgba(24, 29, 40, .96); border: 1px solid var(--line); border-radius: 22px; box-shadow: 0 16px 32px rgba(0,0,0,.26); }
  .hero { padding: 14px; }
  .eyebrow { color: var(--accent); font-size: 11px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
  h1 { margin-top: 4px; font-size: 19px; line-height: 1.12; letter-spacing: -.025em; }
  .sub { margin-top: 6px; color: var(--muted); font-size: 13px; line-height: 1.35; }
  .progress-shell { margin-top: 12px; height: 8px; overflow: hidden; border-radius: 999px; background: #272e3a; }
  .progress-bar { width: 0%; height: 100%; border-radius: inherit; background: var(--accent); transition: width .12s linear; }
  .timeline { display: flex; gap: 6px; margin-top: 10px; overflow-x: auto; overflow-y: hidden; padding-bottom: 2px; scrollbar-width: none; -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain; }
  .timeline::-webkit-scrollbar { display: none; }
  .time-dot { flex: 0 0 auto; min-width: 64px; border: 1px solid var(--line); background: var(--panel-2); color: var(--muted); border-radius: 12px; padding: 7px 6px; font-size: 9.5px; font-weight: 850; text-align: center; cursor: pointer; white-space: nowrap; }
  .time-dot.is-active { color: var(--accent); border-color: var(--accent-line); background: var(--accent-soft); }
  .audio-error { display: none; margin-top: 9px; padding: 10px; border-radius: 13px; background: rgba(239,83,80,.12); border: 1px solid rgba(239,83,80,.38); color: #ffd7d7; font-size: 12.5px; line-height: 1.35; overflow-wrap: anywhere; }
  .audio-error:global(.is-visible) { display: block; }

  .slide-stage { margin-top: 12px; }
  .slide { display: none; min-height: calc(100dvh - 350px); padding: 14px; overflow: hidden; }
  .slide.is-active { display: block; animation: enter .18s ease both; }
  @keyframes enter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .slide-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
  .slide-kicker { color: var(--accent); font-size: 11px; font-weight: 950; letter-spacing: .12em; text-transform: uppercase; }
  .slide-title { margin-top: 4px; font-size: 21px; line-height: 1.06; font-weight: 950; letter-spacing: -.035em; }
  .slide-title span { color: var(--accent); }
  .slide-number { flex: 0 0 auto; color: var(--muted); font-size: 12px; font-weight: 900; }
  .sim-stack { display: grid; gap: 10px; }
  .sim-panel { border: 1px solid var(--line); background: rgba(32, 38, 52, .58); border-radius: 17px; padding: 10px; }
  .panel-title { color: var(--blue); font-size: 12px; font-weight: 850; margin-bottom: 8px; }

  [data-hotspot] { transition: border-color .16s ease, background .16s ease, box-shadow .16s ease, transform .16s ease, color .16s ease, opacity .16s ease; }
  [data-hotspot]:global(.is-hot) { border-color: var(--accent-line) !important; background-color: var(--accent-soft) !important; box-shadow: 0 0 0 1px rgba(244,197,66,.14), 0 0 22px rgba(244,197,66,.11); transform: translateY(-1px); }
  .token:global(.is-hot), .reg-val:global(.is-hot), .route-chip:global(.is-hot), .state-cell:global(.is-hot), .concept-code:global(.is-hot) { color: var(--accent); }
  [data-hotspot]:global(.is-hot) .reg-val, [data-hotspot]:global(.is-hot) .value-large, [data-hotspot]:global(.is-hot) .concept-code, [data-hotspot]:global(.is-hot) .flow-main { color: var(--accent); }
    .code-line { overflow: hidden; width: 100%; border: 1px solid var(--line); background: var(--panel-3); border-radius: 15px; padding: 10px; color: var(--soft); font-size: clamp(15px, 4.4vw, 21px); line-height: 1.24; font-weight: 950; letter-spacing: -.03em; white-space: normal; word-break: break-word; }
  .code-line.small { font-size: clamp(13px, 3.85vw, 17px); line-height: 1.32; }
  .code-line.c-code { color: var(--soft); font-size: clamp(13px, 3.6vw, 17px); line-height: 1.42; letter-spacing: -.035em; }
  .code-line.c-code .indent { display: inline-block; padding-left: 1.45em; }
  .code-line.c-code .brace { color: var(--soft); }
  .token { display: inline-block; padding: 2px 5px; margin: 1px 0; border: 1px solid transparent; border-radius: 8px; color: var(--accent); }
  .token.soft { color: var(--soft); }

  .reg-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .reg-grid.one { grid-template-columns: 1fr; }
  .reg-card, .concept-card, .compare-card { min-height: 64px; border: 1px solid var(--line); background: rgba(17, 23, 34, .86); border-radius: 16px; padding: 10px; display: grid; align-content: center; min-width: 0; }
  .reg-name, .label { color: var(--blue); font-size: 12px; font-weight: 950; letter-spacing: .08em; text-transform: uppercase; }
  .reg-val { margin-top: 5px; font-size: clamp(22px, 6.8vw, 31px); line-height: 1; font-weight: 950; letter-spacing: .03em; }
  .reg-note, .concept-note { color: var(--muted); font-size: 11px; margin-top: 4px; font-weight: 800; line-height: 1.28; }
  .concept-grid { display: grid; gap: 8px; }
  .concept-grid.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .concept-label { display: block; color: var(--muted); font-size: 10px; font-weight: 950; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 4px; }
  .concept-main { color: var(--text); font-size: clamp(16px, 4.8vw, 24px); font-weight: 950; line-height: 1.08; letter-spacing: -.03em; }
  .concept-code { color: var(--accent); font-weight: 950; overflow-wrap: anywhere; }
  .step2-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .value-large { color: var(--accent); font-size: clamp(16px, 4.8vw, 24px); font-weight: 950; line-height: 1.08; }

  .concept-panel { border: 1px dashed var(--line-2); background: rgba(12, 16, 24, .48); border-radius: 17px; padding: 10px; }
  .concept-lines { display: grid; gap: 8px; }
  .concept-line { border: 1px solid rgba(46, 55, 72, .72); background: rgba(17, 23, 34, .50); border-radius: 14px; padding: 9px; color: var(--soft); font-size: 13px; line-height: 1.28; font-weight: 780; }

  .op-box { border: 1px solid var(--line); background: rgba(17,23,34,.86); border-radius: 16px; padding: 12px; text-align: center; font-size: clamp(18px, 5.7vw, 26px); line-height: 1.12; font-weight: 950; }
  .op-box small { display: block; color: var(--muted); font-size: 11px; margin-top: 6px; font-family: system-ui, sans-serif; font-weight: 850; }

  .flow-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .flow-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .route-chip { border: 1px solid var(--line); background: rgba(17, 23, 34, .86); border-radius: 16px; padding: 12px; font-size: clamp(15px, 4.5vw, 21px); font-weight: 950; line-height: 1.1; }
  .route-chip span { display: block; margin-top: 4px; color: var(--muted); font-size: 11px; font-weight: 850; font-family: system-ui, sans-serif; }
  .flow-main { color: var(--text); }

  .state-table { display: grid; gap: 6px; width: 100%; }
  .state-row { display: grid; grid-template-columns: .7fr 1fr 1fr; gap: 5px; align-items: center; border: 1px solid var(--line); background: rgba(17,23,34,.86); border-radius: 13px; padding: 7px 6px; min-width: 0; }
  .state-row.head { background: rgba(31,37,50,.82); color: var(--blue); font-size: 10px; letter-spacing: .06em; text-transform: uppercase; }
  .state-cell { min-width: 0; text-align: center; font-size: clamp(10px, 2.9vw, 13px); font-weight: 900; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .footer-dock { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; padding: 22px 12px 12px; background: linear-gradient(180deg, rgba(15,17,23,0), rgba(15,17,23,.98) 18%); }
  .footer-inner { width: 100%; max-width: 500px; margin: 0 auto; }
  .subtitle { min-height: 64px; padding: 11px 12px; border-radius: 17px; background: rgba(17, 20, 27, .98); border: 1px solid var(--line); box-shadow: 0 12px 24px rgba(0,0,0,.3); font-size: 15px; line-height: 1.35; font-weight: 760; }
  .controls { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; margin-top: 8px; }
  .primary, .secondary { min-height: 48px; border-radius: 14px; border: 1px solid var(--line); cursor: pointer; font-weight: 950; }
  .primary { background: var(--accent); border-color: rgba(244,197,66,.84); color: #11141b; }
  .secondary { width: 54px; background: #252c39; color: var(--text); }
  .final-action { display: none; width: 100%; margin-top: 8px; }
  .final-action:global(.is-visible) { display: block; }
.status-line { margin-top: 7px; color: var(--muted); text-align: center; font-size: 11px; line-height: 1.35; overflow-wrap: anywhere; }

  @media (max-width: 390px) {
    .app { padding-left: 10px; padding-right: 10px; }
    .slide { padding: 12px; }
    .reg-grid, .step2-grid, .flow-grid, .flow-grid.three, .concept-grid.cols-2 { grid-template-columns: 1fr; }
    .reg-card { min-height: 62px; }
  }
  @media (max-width: 340px) {
    .time-dot { min-width: 58px; font-size: 9px; }
    .code-line { font-size: 14px; }
    .reg-val { font-size: 22px; }
  }
  @media (max-height: 720px) { .slide { min-height: auto; } .sim-panel { padding: 10px; } .slide-title { font-size: 20px; } }

  .subtitle[hidden] { display: none; }

</style>
