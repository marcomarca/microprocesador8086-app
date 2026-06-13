<script lang="ts">
  import { onMount } from 'svelte';
  import type { TheoryLesson } from '../../types';
  import { createSubtitleToggle } from './subtitleToggle';

  export let theory: TheoryLesson;
  export let completed = false;
  export let onComplete: (theory: TheoryLesson) => void = () => undefined;
  export let onStartExercise: (exerciseId: string) => void = () => undefined;

  let root: HTMLDivElement;

  type Cue = { number: number; start: number; end: number; text: string };
  type CueFocus = { slide: string; targets: string[] };

  const SRT_TEXT = "1\n00:00:00,000 --> 00:00:01,500\nEn el ensamblador,\n\n2\n00:00:01,500 --> 00:00:06,060\nmuchas instrucciones trabajan moviendo datos dentro del procesador.\n\n3\n00:00:06,540 --> 00:00:09,860\nEstos datos pueden estar en distintos lugares,\n\n4\n00:00:09,860 --> 00:00:12,700\npero en este ejercicio nos vamos a enfocar\n\n5\n00:00:12,700 --> 00:00:14,000\nen los registros.\n\n6\n00:00:14,040 --> 00:00:17,280\nLos registros son espacios internos del procesador que\n\n7\n00:00:17,280 --> 00:00:19,400\nsirven para guardar valores temporales.\n\n8\n00:00:19,400 --> 00:00:21,520\nEn el 8086,\n\n9\n00:00:21,540 --> 00:00:24,820\nalgunos registros importantes son AX,\n\n10\n00:00:24,820 --> 00:00:25,840\nBX,\n\n11\n00:00:25,840 --> 00:00:27,780\nCX y DX.\n\n12\n00:00:28,130 --> 00:00:32,210\nUna operación común es copiar un valor desde\n\n13\n00:00:32,210 --> 00:00:34,350\nun registro hacia otro.\n\n14\n00:00:34,590 --> 00:00:38,190\nPara hacer una transferencia se usa la instrucción\n\n15\n00:00:38,190 --> 00:00:38,810\nMOV.\n\n16\n00:00:39,490 --> 00:00:42,890\nLa forma general de esta instrucción es MOV\n\n17\n00:00:42,890 --> 00:00:43,930\ndestino,\n\n18\n00:00:43,970 --> 00:00:45,190\nfuente.\n\n19\n00:00:45,190 --> 00:00:48,150\nEl destino es el lugar que recibe el\n\n20\n00:00:48,150 --> 00:00:48,590\nvalor.\n\n21\n00:00:48,590 --> 00:00:51,310\nLa fuente es el lugar donde se toma\n\n22\n00:00:51,310 --> 00:00:51,910\nel valor.\n\n23\n00:00:52,150 --> 00:00:53,370\nPor ejemplo,\n\n24\n00:00:53,390 --> 00:00:56,190\nsi escribimos MOV a X,\n\n25\n00:00:56,530 --> 00:00:59,650\nBX significa que el valor que está en\n\n26\n00:00:59,650 --> 00:01:02,770\nBX se copia dentro de AX.\n\n27\n00:01:02,770 --> 00:01:06,830\nLa segra principal es MUP copia el valor,\n\n28\n00:01:06,830 --> 00:01:08,650\npero no borra la fuente.\n\n29\n00:01:08,750 --> 00:01:11,950\nDespués de ejecutar MUP AX,\n\n30\n00:01:11,950 --> 00:01:13,190\nBX,\n\n31\n00:01:13,190 --> 00:01:15,950\nel registro AX puede cambiar,\n\n32\n00:01:16,050 --> 00:01:18,510\npero BX conserva su valor.\n\n33\n00:01:18,890 --> 00:01:22,010\nAhora revisemos los registros con más detalle.\n\n34\n00:01:22,350 --> 00:01:23,430\nAX,\n\n35\n00:01:23,430 --> 00:01:24,350\nBX.\n\n36\n00:01:24,350 --> 00:01:27,760\nCX y DX son registros de 16 bits.\n\n37\n00:01:27,760 --> 00:01:30,260\nCada uno puede dividirse en dos partes de\n\n38\n00:01:30,260 --> 00:01:31,020\n8 bits,\n\n39\n00:01:31,020 --> 00:01:33,260\nuna parte alta y una parte baja.\n\n40\n00:01:33,260 --> 00:01:34,260\nPor ejemplo,\n\n41\n00:01:34,260 --> 00:01:38,740\nsi AX tiene un valor hexadecimal de ABCD,\n\n42\n00:01:38,740 --> 00:01:44,160\nentonces AH contiene AB y la parte baja\n\n43\n00:01:44,160 --> 00:01:46,140\nAL contiene CD.\n\n44\n00:01:47,220 --> 00:01:49,960\nLa misma estructura se aplica a los otros\n\n45\n00:01:49,960 --> 00:01:51,360\nregistros.\n\n46\n00:01:51,810 --> 00:01:52,770\nEntonces,\n\n47\n00:01:52,770 --> 00:01:54,230\nal leer la instrucción MOVE,\n\n48\n00:01:54,230 --> 00:01:56,130\nhay que identificar tres cosas.\n\n49\n00:01:56,230 --> 00:01:56,990\nPrimero,\n\n50\n00:01:57,070 --> 00:01:58,290\n¿cuál es el destino?\n\n51\n00:01:58,290 --> 00:01:59,130\nSegundo,\n\n52\n00:01:59,130 --> 00:02:00,470\n¿cuál es la fuente?\n\n53\n00:02:00,470 --> 00:02:01,650\nY tercero,\n\n54\n00:02:01,650 --> 00:02:03,870\nsi se está usando el registro completo o\n\n55\n00:02:03,870 --> 00:02:05,490\nsolo una parte del registro.\n\n56\n00:02:05,770 --> 00:02:08,290\nLos errores más frecuentes son tres.\n\n57\n00:02:08,710 --> 00:02:09,310\nUno,\n\n58\n00:02:09,310 --> 00:02:11,070\ninvertir destino y fuente.\n\n59\n00:02:11,450 --> 00:02:11,990\nDos,\n\n60\n00:02:11,990 --> 00:02:14,210\npensar que MOVE borde el valor de la\n\n61\n00:02:14,210 --> 00:02:14,730\nfuente.\n\n62\n00:02:15,030 --> 00:02:15,550\nTres,\n\n63\n00:02:15,550 --> 00:02:17,750\nconfundir la parte alta con la parte baja.\n\n64\n00:02:17,870 --> 00:02:20,050\nCon esta base ya puedes pasar a la\n\n65\n00:02:20,050 --> 00:02:20,710\npráctica.\n\n66\n00:02:20,970 --> 00:02:24,090\nEn el ejercicio deberás leer la instrucción,\n\n67\n00:02:24,110 --> 00:02:27,410\nidentificar el destino y fuente y determinar qué\n\n68\n00:02:27,410 --> 00:02:28,630\nregistro cambiará.";

  const cueFocus: Record<number, CueFocus> = {
      1:  { slide: "slide-1", targets: ["s1-data"] },
      2:  { slide: "slide-1", targets: ["s1-data"] },
      3:  { slide: "slide-1", targets: ["s1-data"] },
      4:  { slide: "slide-1", targets: ["s1-registers"] },
      5:  { slide: "slide-1", targets: ["s1-registers"] },

      6:  { slide: "slide-2", targets: ["s2-temp"] },
      7:  { slide: "slide-2", targets: ["s2-temp"] },
      8:  { slide: "slide-2", targets: ["s2-list"] },
      9:  { slide: "slide-2", targets: ["s2-list"] },
      10: { slide: "slide-2", targets: ["s2-list"] },
      11: { slide: "slide-2", targets: ["s2-list"] },

      12: { slide: "slide-3", targets: ["s3-copy"] },
      13: { slide: "slide-3", targets: ["s3-arrow"] },

      14: { slide: "slide-4", targets: ["s4-syntax"] },
      15: { slide: "slide-4", targets: ["s4-syntax"] },
      16: { slide: "slide-4", targets: ["s4-syntax"] },
      17: { slide: "slide-4", targets: ["s4-syntax"] },
      18: { slide: "slide-4", targets: ["s4-syntax"] },
      19: { slide: "slide-4", targets: ["s4-dest"] },
      20: { slide: "slide-4", targets: ["s4-dest"] },
      21: { slide: "slide-4", targets: ["s4-source"] },
      22: { slide: "slide-4", targets: ["s4-source"] },

      23: { slide: "slide-5", targets: ["s5-instr"] },
      24: { slide: "slide-5", targets: ["s5-instr"] },
      25: { slide: "slide-5", targets: ["s5-flow"] },
      26: { slide: "slide-5", targets: ["s5-meaning"] },

      27: { slide: "slide-6", targets: ["s6-copy"] },
      28: { slide: "slide-6", targets: ["s6-not-delete"] },
      29: { slide: "slide-6", targets: ["s6-instr"] },
      30: { slide: "slide-6", targets: ["s6-instr"] },
      31: { slide: "slide-6", targets: ["s6-result"] },
      32: { slide: "slide-6", targets: ["s6-result"] },

      33: { slide: "slide-7", targets: ["s7-sixteen"] },
      34: { slide: "slide-7", targets: ["s7-sixteen"] },
      35: { slide: "slide-7", targets: ["s7-sixteen"] },
      36: { slide: "slide-7", targets: ["s7-sixteen"] },
      37: { slide: "slide-7", targets: ["s7-parts"] },
      38: { slide: "slide-7", targets: ["s7-parts"] },
      39: { slide: "slide-7", targets: ["s7-parts"] },

      40: { slide: "slide-8", targets: ["s8-ax"] },
      41: { slide: "slide-8", targets: ["s8-ax"] },
      42: { slide: "slide-8", targets: ["s8-ah"] },
      43: { slide: "slide-8", targets: ["s8-al"] },

      44: { slide: "slide-9", targets: ["s9-bx", "s9-cx", "s9-dx"] },
      45: { slide: "slide-9", targets: ["s9-bx", "s9-cx", "s9-dx"] },

      46: { slide: "slide-10", targets: ["s10-dest", "s10-source", "s10-size"] },
      47: { slide: "slide-10", targets: ["s10-dest", "s10-source", "s10-size"] },
      48: { slide: "slide-10", targets: ["s10-dest", "s10-source", "s10-size"] },
      49: { slide: "slide-10", targets: ["s10-dest"] },
      50: { slide: "slide-10", targets: ["s10-dest"] },
      51: { slide: "slide-10", targets: ["s10-source"] },
      52: { slide: "slide-10", targets: ["s10-source"] },
      53: { slide: "slide-10", targets: ["s10-size"] },
      54: { slide: "slide-10", targets: ["s10-size"] },
      55: { slide: "slide-10", targets: ["s10-size"] },

      56: { slide: "slide-11", targets: ["s11-error1", "s11-error2", "s11-error3"] },
      57: { slide: "slide-11", targets: ["s11-error1"] },
      58: { slide: "slide-11", targets: ["s11-error1"] },
      59: { slide: "slide-11", targets: ["s11-error2"] },
      60: { slide: "slide-11", targets: ["s11-error2"] },
      61: { slide: "slide-11", targets: ["s11-error2"] },
      62: { slide: "slide-11", targets: ["s11-error3"] },
      63: { slide: "slide-11", targets: ["s11-error3"] },

      64: { slide: "slide-12", targets: ["s12-read"] },
      65: { slide: "slide-12", targets: ["s12-read"] },
      66: { slide: "slide-12", targets: ["s12-read"] },
      67: { slide: "slide-12", targets: ["s12-operands"] },
      68: { slide: "slide-12", targets: ["s12-change"] }
    };

  const slideStartCue: Record<string, number> = {
      "slide-1": 1,
      "slide-2": 6,
      "slide-3": 12,
      "slide-4": 14,
      "slide-5": 23,
      "slide-6": 27,
      "slide-7": 33,
      "slide-8": 40,
      "slide-9": 44,
      "slide-10": 46,
      "slide-11": 56,
      "slide-12": 64
    };

  const slideNames: Record<string, string> = {
      "slide-1": "Datos",
      "slide-2": "Registros",
      "slide-3": "Transferencia",
      "slide-4": "MOV",
      "slide-5": "Ejemplo",
      "slide-6": "Regla",
      "slide-7": "16 bits",
      "slide-8": "AX dividido",
      "slide-9": "H/L",
      "slide-10": "Leer MOV",
      "slide-11": "Errores",
      "slide-12": "Práctica"
    };

  onMount(() => {
    const rootElement = root;
    const audioFile = theory.audioFile;
    let completionReported = completed;

    function requireElement<T extends Element>(selector: string): T {
      const element = rootElement.querySelector(selector);
      if (!element) throw new Error(`No se encontró ${selector} en TheoryScreen.`);
      return element as T;
    }

    const audio = requireElement<HTMLAudioElement>('#lessonAudio');
    const playButton = requireElement<HTMLButtonElement>('#playButton');
    const restartButton = requireElement<HTMLButtonElement>('#restartButton');
    const subtitleButton = requireElement<HTMLButtonElement>('#subtitleButton');
    const practiceButton = requireElement<HTMLButtonElement>('#practiceButton');
    const progressBar = requireElement<HTMLElement>('#progressBar');
    const subtitleBox = requireElement<HTMLElement>('#subtitleBox');
    const statusLine = requireElement<HTMLElement>('#statusLine');
    const audioError = requireElement<HTMLElement>('#audioError');
    const toast = requireElement<HTMLElement>('#toast');
    const subtitleToggle = createSubtitleToggle(subtitleButton, subtitleBox);

    audio.src = new URL(audioFile, window.location.href).href;
    audio.load();

    const cues = parseSrt(SRT_TEXT);
    const fallbackDuration = cues.length ? cues[cues.length - 1].end : 0;
    let rafId: number | null = null;
    let lastCueNumber: number | null = null;

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
        .filter((cue): cue is Cue => Boolean(cue));
    }


    function parseTime(value: string): number {
      const [hh, mm, rest] = value.split(':');
      const [ss, ms] = rest.split(',');
      return Number(hh) * 3600 + Number(mm) * 60 + Number(ss) + Number(ms) / 1000;
    }

    function normalizeSubtitle(text: string): string {
      return String(text)
        .replace(/\b(MUP|MUB|MOOC|MOVE)\b/gi, 'MOV')
        .replace(/La segra principal/gi, 'La regla principal')
        .replace(/\bborde el valor\b/gi, 'borra el valor')
        .replace(/\bMOV a X\b/gi, 'MOV AX')
        .replace(/\bA X\b/g, 'AX')
        .replace(/\bB X\b/g, 'BX')
        .replace(/\bC X\b/g, 'CX')
        .replace(/\bD X\b/g, 'DX')
        .replace(/\bA H\b/g, 'AH')
        .replace(/\bA L\b/g, 'AL')
        .replace(/\bB H\b/g, 'BH')
        .replace(/\bB L\b/g, 'BL')
        .replace(/\bC H\b/g, 'CH')
        .replace(/\bC L\b/g, 'CL')
        .replace(/\bD H\b/g, 'DH')
        .replace(/\bD L\b/g, 'DL')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function getDuration(): number {
      return Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : fallbackDuration;
    }

    function getActiveCue(time: number): Cue | null {
      const exact = cues.find((cue) => time >= cue.start && time < cue.end);
      if (exact) return exact;
      const previous = [...cues].reverse().find((cue) => cue.end <= time);
      if (previous && time - previous.end <= 0.75) return previous;
      return null;
    }

    function setActiveSlide(slideId: string): void {
      rootElement.querySelectorAll<HTMLElement>('[data-slide]').forEach((slide) => {
        slide.classList.toggle('is-active', slide.dataset.slide === slideId);
      });
      rootElement.querySelectorAll<HTMLElement>('[data-step]').forEach((step) => {
        step.classList.toggle('is-active', step.dataset.step === slideId);
      });
      const activeDot = rootElement.querySelector<HTMLElement>(`[data-step="${slideId}"]`);
      if (activeDot) activeDot.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }

    function setHotspots(targets: string[]): void {
      const targetSet = new Set(targets || []);
      rootElement.querySelectorAll<HTMLElement>('[data-hotspot]').forEach((node) => {
        node.classList.toggle('is-hot', targetSet.has(node.dataset.hotspot || ''));
      });
    }

    function setSubtitle(text: string): void {
      subtitleBox.innerHTML = escapeHtml(text || 'Reproduciendo…');
    }

    function escapeHtml(value: unknown): string {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function formatTime(seconds: number): string {
      if (!Number.isFinite(seconds)) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${String(s).padStart(2, '0')}`;
    }

    function reportCompletion(): void {
      if (completionReported) return;
      completionReported = true;
      onComplete(theory);
    }

    function update(): void {
      const current = audio.currentTime || 0;
      const duration = getDuration();
      const percent = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;
      progressBar.style.width = `${percent}%`;

      const activeCue = getActiveCue(current);
      if (activeCue) {
        const focus = cueFocus[activeCue.number];
        if (focus) {
          setActiveSlide(focus.slide);
          setHotspots(focus.targets);
          statusLine.textContent = `${formatTime(current)} / ${formatTime(duration)} · ${slideNames[focus.slide] || 'Teoría'}`;
        }
        setSubtitle(activeCue.text);
        lastCueNumber = activeCue.number;
      }

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
          playButton.textContent = 'Pausar teoría';
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
      lastCueNumber = null;
      playButton.textContent = 'Reproducir teoría';
      practiceButton.classList.toggle('is-visible', completionReported);
      toast.classList.remove('is-visible');
      setActiveSlide('slide-1');
      setHotspots([]);
      setSubtitle('Pulsa reproducir para iniciar la teoría.');
      statusLine.innerHTML = `Audio esperado: <strong>${escapeHtml(audioFile)}</strong>`;
      progressBar.style.width = '0%';
    }

    function handleFinished(): void {
      if (!audio.ended && audio.currentTime < getDuration() - 0.1) return;
      reportCompletion();
      playButton.textContent = 'Reproducir de nuevo';
      practiceButton.classList.add('is-visible');
      setActiveSlide('slide-12');
      setHotspots(['s12-change']);
      setSubtitle('En el ejercicio deberás leer la instrucción, identificar destino y fuente, y determinar qué registro cambiará.');
      statusLine.textContent = 'Clase completada.';
      if (rafId !== null) cancelAnimationFrame(rafId);
    }

    function showAudioError(error?: unknown): void {
      const codes: Record<number, string> = {
        1: 'MEDIA_ERR_ABORTED',
        2: 'MEDIA_ERR_NETWORK',
        3: 'MEDIA_ERR_DECODE',
        4: 'MEDIA_ERR_SRC_NOT_SUPPORTED'
      };
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
      toast.classList.remove('is-visible');
      onStartExercise(theory.unlockExerciseId);
    }

    function handleStepClick(event: Event): void {
      const button = event.currentTarget as HTMLButtonElement;
      const cueNumber = slideStartCue[button.dataset.step || ''];
      const cue = cues.find((item) => item.number === cueNumber);
      if (cue) {
        audio.currentTime = cue.start;
        update();
      }
    }

    playButton.addEventListener('click', handlePlayClick);
    restartButton.addEventListener('click', restart);
    practiceButton.addEventListener('click', handlePracticeClick);

    const stepButtons = Array.from(rootElement.querySelectorAll<HTMLButtonElement>('[data-step]'));
    stepButtons.forEach((button) => button.addEventListener('click', handleStepClick));

    audio.addEventListener('timeupdate', update);
    audio.addEventListener('loadedmetadata', () => {
      audioError.classList.remove('is-visible');
      statusLine.textContent = `Audio cargado: ${formatTime(getDuration())}`;
      update();
    });
    audio.addEventListener('canplay', () => {
      audioError.classList.remove('is-visible');
    });
    audio.addEventListener('ended', handleFinished);
    audio.addEventListener('error', showAudioError);

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
    };
  });
</script>

<div class="theory-root" bind:this={root}>

  <main class="theory-app">
    <header class="top">
      <section class="card hero">
        <div class="eyebrow">Microprocesadores · Ensamblador 8086</div>
        <h1>{theory.title}</h1>

        <div class="progress-shell">
          <div id="progressBar" class="progress-bar"></div>
        </div>

        <nav class="timeline" aria-label="Línea de tiempo">
          <button class="time-dot is-active" type="button" data-step="slide-1">Datos</button>
          <button class="time-dot" type="button" data-step="slide-2">Regs.</button>
          <button class="time-dot" type="button" data-step="slide-3">Transferir</button>
          <button class="time-dot" type="button" data-step="slide-4">MOV</button>
          <button class="time-dot" type="button" data-step="slide-5">Ejemplo</button>
          <button class="time-dot" type="button" data-step="slide-6">Regla</button>
          <button class="time-dot" type="button" data-step="slide-7">16 bits</button>
          <button class="time-dot" type="button" data-step="slide-8">AX</button>
          <button class="time-dot" type="button" data-step="slide-9">H/L</button>
          <button class="time-dot" type="button" data-step="slide-10">Leer</button>
          <button class="time-dot" type="button" data-step="slide-11">Errores</button>
          <button class="time-dot" type="button" data-step="slide-12">Práctica</button>
        </nav>

        <div id="audioError" class="audio-error">
          No se pudo cargar el audio. Coloca <strong>teoria1.mp3</strong> en <strong>dist/assets</strong>.
        </div>
      </section>
    </header>

    <section class="slide-stage">
      <article class="card slide is-active" data-slide="slide-1">
        <div class="slide-head">
          <div>
            <div class="slide-kicker">Paso 1</div>
            <h2 class="slide-title">Ensamblador <span>y datos</span></h2>
          </div>
          <div class="slide-number">1 / 12</div>
        </div>
        <div class="stack">
          <div class="hot huge" data-hotspot="s1-data">Las instrucciones manipulan datos dentro del procesador.</div>
          <div class="hot huge" data-hotspot="s1-registers">Este ejercicio se enfoca en los registros.</div>
        </div>
      </article>

      <article class="card slide" data-slide="slide-2">
        <div class="slide-head">
          <div>
            <div class="slide-kicker">Paso 2</div>
            <h2 class="slide-title">Registros <span>8086</span></h2>
          </div>
          <div class="slide-number">2 / 12</div>
        </div>
        <div class="stack">
          <div class="hot huge" data-hotspot="s2-temp">Los registros guardan valores temporales.</div>
          <div class="hot" data-hotspot="s2-list">
            <div class="label">Registros principales</div>
            <div class="register-row">
              <div class="reg mono">AX</div>
              <div class="reg mono">BX</div>
              <div class="reg mono">CX</div>
              <div class="reg mono">DX</div>
            </div>
          </div>
        </div>
      </article>

      <article class="card slide" data-slide="slide-3">
        <div class="slide-head">
          <div>
            <div class="slide-kicker">Paso 3</div>
            <h2 class="slide-title">Transferencia <span>de datos</span></h2>
          </div>
          <div class="slide-number">3 / 12</div>
        </div>
        <div class="stack">
          <div class="hot huge" data-hotspot="s3-copy">Copiar un valor de un registro a otro.</div>
          <div class="hot arrow" data-hotspot="s3-arrow">
            <div class="box">registro fuente</div>
            <div class="arr">→</div>
            <div class="box">registro destino</div>
          </div>
        </div>
      </article>

      <article class="card slide" data-slide="slide-4">
        <div class="slide-head">
          <div>
            <div class="slide-kicker">Paso 4</div>
            <h2 class="slide-title">Instrucción <span>MOV</span></h2>
          </div>
          <div class="slide-number">4 / 12</div>
        </div>
        <div class="stack">
          <div class="hot huge mono" data-hotspot="s4-syntax">MOV destino, fuente</div>
          <div class="split">
            <div class="hot center" data-hotspot="s4-dest">
              <div class="label">Destino</div>
              <p class="big">Recibe el valor.</p>
            </div>
            <div class="hot center" data-hotspot="s4-source">
              <div class="label">Fuente</div>
              <p class="big">Entrega el valor.</p>
            </div>
          </div>
        </div>
      </article>

      <article class="card slide" data-slide="slide-5">
        <div class="slide-head">
          <div>
            <div class="slide-kicker">Paso 5</div>
            <h2 class="slide-title">MOV AX, <span>BX</span></h2>
          </div>
          <div class="slide-number">5 / 12</div>
        </div>
        <div class="stack">
          <div class="hot huge mono" data-hotspot="s5-instr">MOV AX, BX</div>
          <div class="hot arrow" data-hotspot="s5-flow">
            <div class="box mono">BX</div>
            <div class="arr">→</div>
            <div class="box mono">AX</div>
          </div>
          <div class="hot huge" data-hotspot="s5-meaning">AX recibe una copia de BX.</div>
        </div>
      </article>

      <article class="card slide" data-slide="slide-6">
        <div class="slide-head">
          <div>
            <div class="slide-kicker">Paso 6</div>
            <h2 class="slide-title">MOV <span>copia</span></h2>
          </div>
          <div class="slide-number">6 / 12</div>
        </div>
        <div class="stack">
          <div class="hot huge" data-hotspot="s6-copy">MOV copia el valor.</div>
          <div class="hot huge" data-hotspot="s6-not-delete">La fuente no se borra.</div>
          <div class="hot huge mono" data-hotspot="s6-instr">MOV AX, BX</div>
          <div class="hot huge" data-hotspot="s6-result">AX puede cambiar; BX se conserva.</div>
        </div>
      </article>

      <article class="card slide" data-slide="slide-7">
        <div class="slide-head">
          <div>
            <div class="slide-kicker">Paso 7</div>
            <h2 class="slide-title">16 <span>bits</span></h2>
          </div>
          <div class="slide-number">7 / 12</div>
        </div>
        <div class="stack">
          <div class="hot huge" data-hotspot="s7-sixteen">AX, BX, CX y DX son registros de 16 bits.</div>
          <div class="hot huge" data-hotspot="s7-parts">Cada registro tiene parte alta y parte baja.</div>
        </div>
      </article>

      <article class="card slide" data-slide="slide-8">
        <div class="slide-head">
          <div>
            <div class="slide-kicker">Paso 8</div>
            <h2 class="slide-title">Alto <span>y bajo</span></h2>
          </div>
          <div class="slide-number">8 / 12</div>
        </div>
        <div class="stack">
          <div class="hot huge mono" data-hotspot="s8-ax">AX = 0xABCD</div>
          <div class="example-row">
            <div class="hot small-code mono" data-hotspot="s8-ah">AH = 0xAB</div>
            <div class="hot small-code mono" data-hotspot="s8-al">AL = 0xCD</div>
          </div>
        </div>
      </article>

      <article class="card slide" data-slide="slide-9">
        <div class="slide-head">
          <div>
            <div class="slide-kicker">Paso 9</div>
            <h2 class="slide-title">Otros <span>registros</span></h2>
          </div>
          <div class="slide-number">9 / 12</div>
        </div>
        <div class="stack">
          <div class="hot huge mono" data-hotspot="s9-bx">BX = BH : BL</div>
          <div class="hot huge mono" data-hotspot="s9-cx">CX = CH : CL</div>
          <div class="hot huge mono" data-hotspot="s9-dx">DX = DH : DL</div>
        </div>
      </article>

      <article class="card slide" data-slide="slide-10">
        <div class="slide-head">
          <div>
            <div class="slide-kicker">Paso 10</div>
            <h2 class="slide-title">Leer <span>MOV</span></h2>
          </div>
          <div class="slide-number">10 / 12</div>
        </div>
        <div class="steps">
          <div class="hot line-item" data-hotspot="s10-dest">
            <div class="badge">1</div>
            <p class="big">Identificar el destino.</p>
          </div>
          <div class="hot line-item" data-hotspot="s10-source">
            <div class="badge">2</div>
            <p class="big">Identificar la fuente.</p>
          </div>
          <div class="hot line-item" data-hotspot="s10-size">
            <div class="badge">3</div>
            <p class="big">Verificar registro completo o parcial.</p>
          </div>
        </div>
      </article>

      <article class="card slide" data-slide="slide-11">
        <div class="slide-head">
          <div>
            <div class="slide-kicker">Paso 11</div>
            <h2 class="slide-title">Errores <span>frecuentes</span></h2>
          </div>
          <div class="slide-number">11 / 12</div>
        </div>
        <div class="error-list">
          <div class="hot line-item" data-hotspot="s11-error1">
            <div class="badge">1</div>
            <p class="big">Invertir destino y fuente.</p>
          </div>
          <div class="hot line-item" data-hotspot="s11-error2">
            <div class="badge">2</div>
            <p class="big">Pensar que MOV borra la fuente.</p>
          </div>
          <div class="hot line-item" data-hotspot="s11-error3">
            <div class="badge">3</div>
            <p class="big">Confundir H y L.</p>
          </div>
        </div>
      </article>

      <article class="card slide" data-slide="slide-12">
        <div class="slide-head">
          <div>
            <div class="slide-kicker">Paso 12</div>
            <h2 class="slide-title">Para la <span>práctica</span></h2>
          </div>
          <div class="slide-number">12 / 12</div>
        </div>
        <div class="steps">
          <div class="hot line-item" data-hotspot="s12-read">
            <div class="badge">1</div>
            <p class="big">Leer la instrucción.</p>
          </div>
          <div class="hot line-item" data-hotspot="s12-operands">
            <div class="badge">2</div>
            <p class="big">Identificar destino y fuente.</p>
          </div>
          <div class="hot line-item" data-hotspot="s12-change">
            <div class="badge">3</div>
            <p class="big">Determinar qué registro cambia.</p>
          </div>
        </div>
      </article>
    </section>
  </main>

  <footer class="footer-dock">
    <div class="footer-inner">
      <div id="subtitleBox" class="subtitle" hidden>
        Pulsa reproducir para iniciar la teoría.
      </div>
      <div class="controls">
        <button id="playButton" class="primary" type="button">Reproducir teoría</button>
        <button id="restartButton" class="secondary" type="button" aria-label="Reiniciar">↺</button>
        <button id="subtitleButton" class="secondary cc-button" type="button" aria-label="Mostrar subtítulos" aria-pressed="false">CC</button>
      </div>
      <button id="practiceButton" class="primary final-action" type="button">Iniciar práctica</button>
      <div id="toast" class="toast">Abriendo ejercicio asociado.</div>
      <div id="statusLine" class="status-line">Audio esperado: <strong>teoria1.mp3</strong></div>
    </div>
  </footer>

  <audio id="lessonAudio" preload="metadata"></audio>

  
</div>

<style>

    :root {
      --bg: #0f1115;
      --panel: #171a21;
      --panel-2: #202634;
      --line: #2d3443;
      --text: #f3f4f6;
      --muted: #a8b0c0;
      --accent: #f4c542;
      --accent-soft: rgba(244, 197, 66, .115);
      --accent-line: rgba(244, 197, 66, .62);
      --danger: #ef5350;
      --ok: #2fbf71;
    }

    * { box-sizing: border-box; }

    .theory-root {
      min-height: 100dvh;
      margin: -12px;
      margin-bottom: 0;
      background:
        radial-gradient(circle at 50% -18%, rgba(244, 197, 66, .15), transparent 34%),
        linear-gradient(180deg, #0f1115 0%, #11141b 100%);
      color: var(--text);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    button {
      font: inherit;
      -webkit-tap-highlight-color: transparent;
    }

    .theory-app {
      width: 100%;
      max-width: 480px;
      min-height: 100dvh;
      margin: 0 auto;
      padding: 12px;
      padding-bottom: 164px;
    }

    .top {
      position: sticky;
      top: 0;
      z-index: 20;
      padding-top: 4px;
      padding-bottom: 10px;
      background: rgba(15, 17, 21, .94);
      backdrop-filter: blur(12px);
    }

    .card {
      background: rgba(23, 26, 33, .96);
      border: 1px solid var(--line);
      border-radius: 20px;
      box-shadow: 0 14px 28px rgba(0, 0, 0, .26);
    }

    .hero { padding: 14px; }

    .eyebrow {
      color: var(--accent);
      font-size: 11px;
      font-weight: 850;
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    h1, h2, p { margin: 0; }

    h1 {
      margin-top: 4px;
      font-size: 19px;
      line-height: 1.15;
      letter-spacing: -.02em;
    }

    .progress-shell {
      margin-top: 12px;
      height: 8px;
      overflow: hidden;
      border-radius: 999px;
      background: #272d39;
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
      margin-top: 8px;
      padding: 10px;
      border-radius: 12px;
      background: rgba(239, 83, 80, .12);
      border: 1px solid rgba(239, 83, 80, .35);
      color: #ffd7d7;
      font-size: 13px;
      line-height: 1.35;
    }

    .audio-error:global(.is-visible) { display: block; }

    .slide-stage { margin-top: 12px; }

    .slide {
      display: none;
      min-height: calc(100dvh - 332px);
      padding: 14px;
      overflow: hidden;
    }

    .slide.is-active {
      display: block;
      animation: enter .18s ease both;
    }

    @keyframes enter {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .slide-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 14px;
    }

    .slide-kicker {
      color: var(--accent);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    .slide-title {
      margin-top: 4px;
      font-size: 25px;
      line-height: 1.04;
      font-weight: 950;
      letter-spacing: -.035em;
    }

    .slide-title span { color: var(--accent); }

    .slide-number {
      flex: 0 0 auto;
      color: var(--muted);
      font-size: 12px;
      font-weight: 850;
    }

    .stack, .steps, .error-list {
      display: grid;
      gap: 10px;
    }

    .hot {
      position: relative;
      border: 1px solid var(--line);
      background: rgba(32, 38, 52, .72);
      border-radius: 17px;
      padding: 13px;
      transition: border-color .16s ease, background .16s ease, box-shadow .16s ease, transform .16s ease;
    }

    .hot:global(.is-hot) {
      border-color: var(--accent-line);
      background: var(--accent-soft);
      box-shadow: 0 0 0 1px rgba(244, 197, 66, .15), 0 0 22px rgba(244, 197, 66, .11);
      transform: translateY(-1px);
    }

    .hot:global(.is-hot)::after {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      border: 1px solid rgba(244, 197, 66, .34);
      pointer-events: none;
    }

    .label {
      color: var(--muted);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .10em;
      text-transform: uppercase;
      margin-bottom: 5px;
    }

    .big {
      font-size: 18px;
      line-height: 1.24;
      font-weight: 850;
      letter-spacing: -.015em;
    }

    .huge {
      display: grid;
      align-items: center;
      min-height: 78px;
      text-align: center;
      font-size: 23px;
      line-height: 1.12;
      font-weight: 950;
      letter-spacing: -.03em;
    }

    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }

    .register-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .reg {
      padding: 14px 6px;
      text-align: center;
      font-size: 21px;
      font-weight: 950;
      color: var(--accent);
    }

    .split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .center { text-align: center; }

    .arrow {
      display: grid;
      grid-template-columns: 1fr 44px 1fr;
      align-items: center;
      gap: 8px;
      text-align: center;
    }

    .box {
      display: grid;
      place-items: center;
      min-height: 56px;
      border-radius: 13px;
      border: 1px solid var(--line);
      background: #121621;
      font-size: 15px;
      font-weight: 900;
    }

    .arr {
      color: var(--accent);
      font-size: 30px;
      font-weight: 950;
    }

    .example-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .small-code {
      text-align: center;
      font-size: 20px;
      font-weight: 950;
    }

    .line-item {
      display: grid;
      grid-template-columns: 38px 1fr;
      align-items: center;
      gap: 10px;
    }

    .badge {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: rgba(244, 197, 66, .12);
      border: 1px solid rgba(244, 197, 66, .32);
      color: var(--accent);
      font-weight: 950;
    }

    .footer-dock {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 50;
      padding: 22px 12px 12px;
      background: linear-gradient(180deg, rgba(15, 17, 21, 0), rgba(15, 17, 21, .98) 18%);
    }

    .footer-inner {
      width: 100%;
      max-width: 480px;
      margin: 0 auto;
    }

    .subtitle {
      min-height: 60px;
      padding: 11px 12px;
      border-radius: 16px;
      background: rgba(17, 20, 27, .98);
      border: 1px solid var(--line);
      box-shadow: 0 12px 24px rgba(0, 0, 0, .28);
      font-size: 15px;
      line-height: 1.35;
      font-weight: 750;
    }

    .subtitle[hidden] { display: none; }

    .controls {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 8px;
      margin-top: 8px;
    }

    .cc-button:global(.is-active) {
      color: var(--accent);
      border-color: rgba(244, 197, 66, .72);
      background: rgba(244, 197, 66, .14);
    }

    .primary, .secondary {
      min-height: 48px;
      border-radius: 14px;
      border: 1px solid var(--line);
      cursor: pointer;
      font-weight: 900;
    }

    .primary {
      background: var(--accent);
      border-color: rgba(244, 197, 66, .84);
      color: #11141b;
    }

    .secondary {
      width: 52px;
      background: #252b37;
      color: var(--text);
    }

    .final-action {
      display: none;
      width: 100%;
      margin-top: 8px;
    }

    .final-action:global(.is-visible) { display: block; }

    .toast {
      display: none;
      margin-top: 8px;
      padding: 9px 10px;
      border-radius: 12px;
      background: rgba(47, 191, 113, .12);
      border: 1px solid rgba(47, 191, 113, .35);
      color: #d8ffe9;
      font-size: 13px;
      line-height: 1.35;
    }

    .toast:global(.is-visible) { display: block; }

    .status-line {
      margin-top: 7px;
      color: var(--muted);
      text-align: center;
      font-size: 11px;
      line-height: 1.35;
    }

    @media (max-width: 340px) {
      .time-dot { min-width: 58px; font-size: 9px; }
    }

    @media (max-height: 720px) {
      .slide { min-height: auto; }
      .slide-title { font-size: 22px; }
      .huge { min-height: 62px; font-size: 20px; }
      .hot { padding: 11px; }
      .stack, .steps, .error-list { gap: 8px; }
    }
  
</style>
