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
  const SRT_SOURCE = "1\n00:00:00,000 --> 00:00:01,480\nEn ensamblador,\n\n2\n00:00:01,480 --> 00:00:04,140\nlos datos no viven solamente en los registros.\n\n3\n00:00:04,140 --> 00:00:06,580\nTambién pueden estar guardados en la memoria.\n\n4\n00:00:06,580 --> 00:00:09,600\nLa memoria permite conservar valores con un nombre\n\n5\n00:00:09,600 --> 00:00:10,560\ny una posición.\n\n6\n00:00:10,720 --> 00:00:13,060\nPara declarar datos en memoria,\n\n7\n00:00:13,060 --> 00:00:14,440\nse puede usar DW.\n\n8\n00:00:14,680 --> 00:00:17,020\nDW significa Define word.\n\n9\n00:00:17,020 --> 00:00:20,320\nUna word o palabra ocupa 16 bits.\n\n10\n00:00:20,400 --> 00:00:21,640\nEn memoria,\n\n11\n00:00:21,640 --> 00:00:24,000\nuna palabra ocupa 2 bytes consecutivos.\n\n12\n00:00:24,060 --> 00:00:27,600\nEsto importa porque el 8086 trabaja con valores\n\n13\n00:00:27,600 --> 00:00:28,700\nde 16 bits.\n\n14\n00:00:28,820 --> 00:00:32,060\nPero la memoria se organiza byte por byte.\n\n15\n00:00:32,060 --> 00:00:33,700\nCuando declaramos un dato,\n\n16\n00:00:33,700 --> 00:00:35,200\nusamos una etiqueta.\n\n17\n00:00:35,200 --> 00:00:37,620\nLa etiqueta es el nombre del dato.\n\n18\n00:00:37,620 --> 00:00:40,620\nEse nombre permite referirse a una posición de\n\n19\n00:00:40,620 --> 00:00:43,600\nmemoria sin escribir directamente la dirección.\n\n20\n00:00:43,620 --> 00:00:44,900\nPor ejemplo,\n\n21\n00:00:45,080 --> 00:00:49,400\npodemos escribir NUMERO_INICIAL: DW 2468h.\n\n22\n00:00:49,520 --> 00:00:51,960\nNUMERO_INICIAL es el nombre del dato.\n\n23\n00:00:52,320 --> 00:00:54,660\nDW reserva una palabra.\n\n24\n00:00:54,660 --> 00:00:58,160\nY 2468h es el contenido inicial.\n\n25\n00:00:58,500 --> 00:01:01,540\nNo hay que confundir dirección con contenido.\n\n26\n00:01:01,540 --> 00:01:04,280\nLa dirección indica dónde empieza el dato.\n\n27\n00:01:04,280 --> 00:01:07,080\nEl contenido indica qué valor está guardado ahí.\n\n28\n00:01:07,440 --> 00:01:11,420\nUna etiqueta puede estar en la dirección 0100h,\n\n29\n00:01:11,420 --> 00:01:13,840\npero el valor guardado en esa posición puede\n\n30\n00:01:13,840 --> 00:01:16,360\nser 2468h.\n\n31\n00:01:16,660 --> 00:01:20,000\nAhora veamos un detalle importante del 8086.\n\n32\n00:01:20,080 --> 00:01:24,480\nEl 8086 guarda las palabras en formato Little\n\n33\n00:01:24,480 --> 00:01:25,100\nIndian.\n\n34\n00:01:25,200 --> 00:01:26,700\nEsto significa...\n\n35\n00:01:26,700 --> 00:01:29,130\nque primero se guarda el byte bajo y\n\n36\n00:01:29,130 --> 00:01:31,170\ndespués se guarda el byte alto.\n\n37\n00:01:31,170 --> 00:01:32,270\nPor ejemplo,\n\n38\n00:01:32,410 --> 00:01:37,110\n2468h se guarda en memoria como 68h y\n\n39\n00:01:37,110 --> 00:01:39,410\nluego 24h.\n\n40\n00:01:39,470 --> 00:01:43,570\nEl valor lógico sigue siendo 2468h.\n\n41\n00:01:43,570 --> 00:01:46,190\nSolo cambia el orden físico de los bytes\n\n42\n00:01:46,190 --> 00:01:46,950\nen memoria.\n\n43\n00:01:46,950 --> 00:01:48,910\nPodemos declarar varios datos.\n\n44\n00:01:49,230 --> 00:01:52,790\nNUMERO_INICIAL DW 2468h.\n\n45\n00:01:52,790 --> 00:01:56,470\nAJUSTE_MEMORIA: DW 0010h.\n\n46\n00:01:56,770 --> 00:02:00,830\nTOTAL_CALCULADO: DW 0000h.\n\n47\n00:02:01,090 --> 00:02:03,570\nEl primero guarda el valor inicial.\n\n48\n00:02:03,570 --> 00:02:06,050\nEl segundo guarda un valor que se usará\n\n49\n00:02:06,050 --> 00:02:07,450\nen una operación.\n\n50\n00:02:07,450 --> 00:02:09,950\nY el tercero reserva espacio para un\n\n51\n00:02:09,950 --> 00:02:10,570\nresultado.\n\n52\n00:02:10,750 --> 00:02:13,270\nLuego el programa puede leer estos datos desde\n\n53\n00:02:13,270 --> 00:02:13,950\nmemoria.\n\n54\n00:02:13,950 --> 00:02:14,630\nPor ejemplo,\n\n55\n00:02:14,670 --> 00:02:15,930\nMOV AX,\n\n56\n00:02:16,030 --> 00:02:17,090\nword,\n\n57\n00:02:17,090 --> 00:02:17,990\nNUMERO_INICIAL.\n\n58\n00:02:18,210 --> 00:02:21,190\nEsta instrucción carga en AX el contenido del\n\n59\n00:02:21,190 --> 00:02:22,050\nNUMERO_INICIAL.\n\n60\n00:02:22,070 --> 00:02:24,530\nAX no recibe la dirección.\n\n61\n00:02:24,530 --> 00:02:26,770\nAX recibe el valor guardado ahí.\n\n62\n00:02:26,930 --> 00:02:30,750\nSi el NUMERO_INICIAL contiene 2468h,\n\n63\n00:02:30,750 --> 00:02:34,290\nAX queda con 2468h.\n\n64\n00:02:34,670 --> 00:02:38,330\nDespués podemos sumar otro dato de memoria.\n\n65\n00:02:38,710 --> 00:02:40,750\nADD AX,\n\n66\n00:02:40,750 --> 00:02:42,550\nword AJUSTE_MEMORIA.\n\n67\n00:02:42,550 --> 00:02:46,130\nEsta instrucción suma a AX el contenido de\n\n68\n00:02:46,130 --> 00:02:47,410\nAJUSTE_MEMORIA.\n\n69\n00:02:49,070 --> 00:02:56,260\n2468h Más 0010h da 2478h.\n\n70\n00:02:56,340 --> 00:02:58,220\nDespués de la suma,\n\n71\n00:02:58,220 --> 00:03:01,740\nAX queda con 2478h.\n\n72\n00:03:01,920 --> 00:03:05,040\nTambién existen valores que no vienen de memoria.\n\n73\n00:03:05,040 --> 00:03:07,220\nSe llaman valores inmediatos.\n\n74\n00:03:07,220 --> 00:03:10,680\nUn valor inmediato está escrito directamente en la\n\n75\n00:03:10,680 --> 00:03:11,400\ninstrucción.\n\n76\n00:03:11,400 --> 00:03:12,320\nPor ejemplo,\n\n77\n00:03:12,480 --> 00:03:18,280\nMOV word MARCADOR 0007h.\n\n78\n00:03:18,280 --> 00:03:19,080\nAquí.\n\n79\n00:03:19,890 --> 00:03:23,290\n0007h no se busca en otra etiqueta.\n\n80\n00:03:23,290 --> 00:03:26,370\nLa instrucción toma ese valor directamente y lo\n\n81\n00:03:26,370 --> 00:03:27,750\nescribe en MARCADOR.\n\n82\n00:03:27,750 --> 00:03:30,510\nTambién podemos usar un valor inmediato en una\n\n83\n00:03:30,510 --> 00:03:31,270\noperación,\n\n84\n00:03:31,630 --> 00:03:34,850\nSUB AX, 0004h.\n\n85\n00:03:34,850 --> 00:03:40,450\nEsta instrucción resta 0004h al contenido actual de\n\n86\n00:03:40,450 --> 00:03:41,130\nAX.\n\n87\n00:03:41,130 --> 00:03:45,210\nSi AX tenía 2478h,\n\n88\n00:03:45,350 --> 00:03:49,210\nel resultado será 2474h.\n\n89\n00:03:49,210 --> 00:03:52,670\nAX cambia porque AX es el destino.\n\n90\n00:03:52,870 --> 00:03:53,870\nFinalmente,\n\n91\n00:03:53,870 --> 00:03:55,750\npodemos guardar el resultado en memoria.\n\n92\n00:03:56,230 --> 00:03:56,930\nMOV,\n\n93\n00:03:56,930 --> 00:03:57,550\nword,\n\n94\n00:03:57,550 --> 00:03:58,710\nTOTAL_CALCULADO,\n\n95\n00:03:58,710 --> 00:03:59,890\nAX.\n\n96\n00:03:59,890 --> 00:04:03,310\nEsta instrucción copia el contenido de AX hacia\n\n97\n00:04:03,310 --> 00:04:04,710\nTOTAL_CALCULADO.\n\n98\n00:04:04,710 --> 00:04:09,170\nSi AX contiene 2474h,\n\n99\n00:04:09,170 --> 00:04:13,250\nTOTAL_CALCULADO queda con 2474h.\n\n100\n00:04:13,950 --> 00:04:15,590\nComo es una palabra,\n\n101\n00:04:15,590 --> 00:04:16,790\nse guarda en dos bytes.\n\n102\n00:04:16,790 --> 00:04:18,290\nPor little endian,\n\n103\n00:04:18,330 --> 00:04:24,910\n2474h se guarda como 74h y luego 24h\n\n104\n00:04:24,910 --> 00:04:25,810\nen memoria.\n\n105\n00:04:25,910 --> 00:04:28,330\nPara resolver la práctica,\n\n106\n00:04:28,330 --> 00:04:30,350\nlee cada instrucción en orden.\n\n107\n00:04:30,370 --> 00:04:33,610\nIdentifica si el dato viene de un registro,\n\n108\n00:04:33,610 --> 00:04:35,810\nde memoria o de un valor inmediato.\n\n109\n00:04:35,810 --> 00:04:36,630\nDespués,\n\n110\n00:04:36,630 --> 00:04:39,870\ndetermina cuál es el destino y finalmente decide\n\n111\n00:04:39,870 --> 00:04:40,550\nqué cambia,\n\n112\n00:04:40,550 --> 00:04:43,210\nun registro o una posición de memoria.";

  onMount(() => {
    const rootElement = root;
    const audioFile = theory.audioFile;
    let completionReported = completed;
    function requireElement(selector) {
      const element = rootElement.querySelector(selector);
      if (!element) throw new Error(`No se encontró ${selector} en MemoryDwTheoryScreen.`);
      return element;
    }
const cueFocus = {};
  function focus(cue, slide, targets) { cueFocus[cue] = { slide, targets }; }
  function range(start, end, slide, targets) { for (let i = start; i <= end; i += 1) focus(i, slide, targets); }

  range(1, 3, "slide-1", ["mem-memory"]);
    range(4, 5, "slide-1", ["mem-name", "mem-position"]);
    range(6, 8, "slide-2", ["dw-directive"]);
    focus(9, "slide-2", ["dw-word16"]);
    range(10, 11, "slide-2", ["dw-two-bytes", "dw-mem-row"]);
    range(12, 13, "slide-2", ["dw-8086", "dw-word16"]);
    focus(14, "slide-2", ["dw-byte-by-byte", "dw-mem-row"]);
    range(15, 17, "slide-3", ["decl-label"]);
    range(18, 19, "slide-3", ["decl-reference", "decl-address"]);
    focus(20, "slide-3", ["decl-code"]);
    focus(21, "slide-3", ["decl-code"]);
    focus(22, "slide-3", ["decl-label"]);
    focus(23, "slide-3", ["decl-dw"]);
    focus(24, "slide-3", ["decl-value", "decl-content"]);
    range(25, 26, "slide-3", ["decl-address"]);
    focus(27, "slide-3", ["decl-content"]);
    focus(28, "slide-3", ["decl-address"]);
    range(29, 30, "slide-3", ["decl-content", "decl-mem-row"]);
    range(31, 33, "slide-4", ["endian-title", "endian-logical"]);
    focus(34, "slide-4", ["endian-meaning"]);
    focus(35, "slide-4", ["endian-low", "endian-byte-low"]);
    focus(36, "slide-4", ["endian-high", "endian-byte-high"]);
    focus(37, "slide-4", ["endian-example"]);
    focus(38, "slide-4", ["endian-byte-low"]);
    focus(39, "slide-4", ["endian-byte-high"]);
    range(40, 42, "slide-4", ["endian-key", "endian-logical"]);
    focus(43, "slide-5", ["data-all"]);
    focus(44, "slide-5", ["data-numero"]);
    focus(45, "slide-5", ["data-ajuste"]);
    focus(46, "slide-5", ["data-total"]);
    focus(47, "slide-5", ["data-numero"]);
    range(48, 49, "slide-5", ["data-ajuste"]);
    range(50, 51, "slide-5", ["data-total"]);
    range(52, 57, "slide-6", ["mov-instr"]);
    range(58, 59, "slide-6", ["mov-mem", "mov-word"]);
    range(60, 61, "slide-6", ["mov-op-content"]);
    focus(62, "slide-6", ["mov-word"]);
    focus(63, "slide-6", ["mov-ax"]);
    range(64, 66, "slide-7", ["add-instr"]);
    range(67, 68, "slide-7", ["add-mem", "add-word"]);
    focus(69, "slide-7", ["add-op"]);
    range(70, 71, "slide-7", ["add-ax"]);
    range(72, 73, "slide-8", ["imm-idea"]);
    range(74, 75, "slide-8", ["imm-written"]);
    range(76, 77, "slide-8", ["imm-instr", "imm-value"]);
    focus(78, "slide-8", ["imm-value"]);
    range(79, 80, "slide-8", ["imm-direct"]);
    focus(81, "slide-8", ["imm-dest", "imm-bytes", "imm-word"]);
    range(82, 84, "slide-9", ["sub-instr", "sub-imm"]);
    range(85, 87, "slide-9", ["sub-ax"]);
    focus(88, "slide-9", ["sub-op"]);
    focus(89, "slide-9", ["sub-ax"]);
    range(90, 95, "slide-10", ["store-instr"]);
    range(96, 97, "slide-10", ["store-ax", "store-dest"]);
    range(98, 99, "slide-10", ["store-word", "store-dest"]);
    range(100, 101, "slide-10", ["store-two-bytes"]);
    range(102, 104, "slide-10", ["store-bytes", "store-endian"]);
    range(105, 106, "slide-11", ["practice-read"]);
    range(107, 108, "slide-11", ["practice-source"]);
    range(109, 112, "slide-11", ["practice-dest", "practice-change"]);

  const slideStartCue = {
    "slide-1": 1,
    "slide-2": 6,
    "slide-3": 15,
    "slide-4": 31,
    "slide-5": 43,
    "slide-6": 52,
    "slide-7": 64,
    "slide-8": 72,
    "slide-9": 82,
    "slide-10": 90,
    "slide-11": 105
  };

  const slideNames = {
    "slide-1": "Datos en memoria",
    "slide-2": "DW y bytes",
    "slide-3": "Etiqueta",
    "slide-4": "little endian",
    "slide-5": "Datos declarados",
    "slide-6": "MOV desde memoria",
    "slide-7": "ADD con memoria",
    "slide-8": "Valor inmediato",
    "slide-9": "SUB inmediato",
    "slide-10": "Guardar resultado",
    "slide-11": "Práctica"
  };

  const LAST_END = 283.21;
  const audio = requireElement("#audio");
  const playBtn = requireElement("#playBtn");
  const resetBtn = requireElement("#resetBtn");
  const subtitleBtn = requireElement("#subtitleBtn");
  const practiceBtn = requireElement("#practiceBtn");
  const progressBar = requireElement("#progressBar");
  const subtitle = requireElement("#subtitle");
  const statusLine = requireElement("#statusLine");
  const audioError = requireElement("#audioError");
  const subtitleToggle = createSubtitleToggle(subtitleBtn, subtitle);
let rafId = null;

  const cues = parseSrt(SRT_SOURCE);
  const fallbackDuration = cues.length ? cues[cues.length - 1].end : LAST_END;

  function parseSrt(raw) {
    return String(raw)
      .replace(/\r/g, "")
      .split(/\n\s*\n+/)
      .map((block) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const number = Number(lines[0]);
        const timeLine = lines[1] || "";
        const text = lines.slice(2).join(" ").trim();
        const match = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
        if (!Number.isFinite(number) || !match) return null;
        return { number, start: parseTime(match[1]), end: parseTime(match[2]), text: normalizeSubtitle(text) };
      })
      .filter(Boolean);
  }

  function parseTime(value) {
    const [hh, mm, rest] = value.split(":");
    const [ss, ms] = rest.split(",");
    return Number(hh) * 3600 + Number(mm) * 60 + Number(ss) + Number(ms) / 1000;
  }

  function normalizeSubtitle(text) {
    return String(text)
      .replace(/\bLittle\b/g, "little")
      .replace(/\bIndian\b/g, "endian")
      .trim();
  }

  function cueAt(t) {
    if (!cues.length) return null;
    if (t <= cues[0].start) return cues[0];

    let last = cues[0];

    for (const cue of cues) {
      if (t >= cue.start && t <= cue.end) return cue;
      if (t >= cue.start) last = cue;
    }

    return t >= LAST_END ? cues[cues.length - 1] : last;
  }

  function getDuration() {
    return Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : fallbackDuration;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function setActiveSlide(slideId) {
    rootElement.querySelectorAll("[data-slide]").forEach((slide) => {
      slide.classList.toggle("is-active", slide.dataset.slide === slideId);
    });
    rootElement.querySelectorAll("[data-step]").forEach((step) => {
      step.classList.toggle("is-active", step.dataset.step === slideId);
    });
    const activeButton = rootElement.querySelector(`[data-step="${slideId}"]`);
    if (activeButton) activeButton.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }

  function setHotspots(targets) {
    const targetSet = new Set(targets || []);
    rootElement.querySelectorAll("[data-hotspot]").forEach((node) => {
      node.classList.toggle("is-hot", targetSet.has(node.dataset.hotspot));
    });
  }

  function setSubtitle(text) {
    subtitle.innerHTML = `<span>${escapeHtml(text || "Reproduciendo…")}</span>`;
  }

  function setText(id, text) {
    const el = rootElement.querySelector(`#${id}`);
    if (el) el.textContent = text;
  }

  function setWord(id, value) {
    const el = rootElement.querySelector(`#${id}`);
    if (!el) return;
    el.innerHTML = `<span>word</span><span>${escapeHtml(value)}</span>`;
  }

  function setBytes(id, a, b) {
    const el = rootElement.querySelector(`#${id}`);
    if (!el) return;
    el.innerHTML = `<span>${escapeHtml(a)}</span><span>${escapeHtml(b)}</span>`;
  }

  function applyCueState(cueNumber) {
    setText("axMovVal", cueNumber >= 63 ? "2468h" : "0000h");
    setText("axMovNote", cueNumber >= 63 ? "contenido cargado" : "destino");

    setText("axAddVal", cueNumber >= 70 ? "2478h" : "2468h");

    if (cueNumber >= 81) {
      setBytes("markerBytes", "07", "00");
      setWord("markerWord", "0007h");
    } else {
      setBytes("markerBytes", "00", "00");
      setWord("markerWord", "0000h");
    }

    setText("axSubVal", cueNumber >= 88 ? "2474h" : "2478h");

    if (cueNumber >= 99) {
      setWord("totalWord", "2474h");
    } else {
      setWord("totalWord", "0000h");
    }

    if (cueNumber >= 103) {
      setBytes("totalBytes", "74", "24");
    } else if (cueNumber >= 99) {
      setBytes("totalBytes", "74", "24");
    } else {
      setBytes("totalBytes", "00", "00");
    }
  }

  function update() {
    const current = audio.currentTime || 0;
    const duration = getDuration();
    const percent = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;
    progressBar.style.width = `${percent}%`;

    const activeCue = cueAt(current);
    if (!activeCue) return;

    const focusData = cueFocus[activeCue.number] || cueFocus[1];
    setActiveSlide(focusData.slide);
    setHotspots(focusData.targets);
    applyCueState(activeCue.number);
    setSubtitle(activeCue.text);
    statusLine.textContent = `${formatTime(current)} / ${formatTime(duration)} · ${slideNames[focusData.slide] || "Teoría"}`;

    if (audio.ended || (duration > 0 && current >= duration - 0.05)) {
      handleFinished();
    }
  }

  function startLoop() {
    cancelAnimationFrame(rafId);
    const loop = () => {
      update();
      if (!audio.paused && !audio.ended) rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
  }

  async function togglePlayback() {
    try {
      audioError.classList.remove("is-visible");
      if (audio.paused) {
        await audio.play();
        playBtn.textContent = "Pausar";
        startLoop();
      } else {
        audio.pause();
        playBtn.textContent = "Continuar";
        cancelAnimationFrame(rafId);
        update();
      }
    } catch (error) {
      showAudioError(error);
    }
  }

  function restart() {
    audio.pause();
    audio.currentTime = 0;
    playBtn.textContent = "Reproducir";
    practiceBtn.classList.remove("is-visible");
    
    setActiveSlide("slide-1");
    setHotspots([]);
    setSubtitle("Presiona reproducir para iniciar.");
    statusLine.innerHTML = `Audio local esperado: <span class="mono">${escapeHtml(theory.audioFile)}<\/span>`;
    progressBar.style.width = "0%";
    applyCueState(1);
  }

  function reportCompletion() {
    if (completionReported) return;
    completionReported = true;
    onComplete(theory);
  }

  function handleFinished() {
    if (!audio.ended && audio.currentTime < getDuration() - 0.1) return;
    reportCompletion();
    playBtn.textContent = "Reproducir de nuevo";
    practiceBtn.classList.add("is-visible");
    setActiveSlide("slide-11");
    setHotspots(["practice-change"]);
    setSubtitle("Determina cuál es el destino y decide qué cambia.");
    statusLine.textContent = "Clase completada.";
    cancelAnimationFrame(rafId);
  }

  function showAudioError(error) {
    const codes = { 1: "MEDIA_ERR_ABORTED", 2: "MEDIA_ERR_NETWORK", 3: "MEDIA_ERR_DECODE", 4: "MEDIA_ERR_SRC_NOT_SUPPORTED" };
    const mediaError = audio.error;
    const codeText = mediaError ? `${codes[mediaError.code] || "ERROR"} (${mediaError.code})` : "sin código";
    audioError.classList.add("is-visible");
    audioError.innerHTML = `No se pudo cargar el audio <strong>${escapeHtml(audioFile)}<\/strong>.<br>Ruta usada: <code>${escapeHtml(audio.src)}<\/code><br>Error: ${escapeHtml(codeText)}.`;
    if (error) console.error(error);
  }


  function handlePlayClick() {
    if (audio.ended) { restart(); void togglePlayback(); return; }
    void togglePlayback();
  }

  function handlePracticeClick() {
    reportCompletion();
    onStartExercise(theory.unlockExerciseId);
  }

  function handleStepClick(event) {
    const button = event.currentTarget;
    const cueNumber = slideStartCue[button.dataset.step];
    const cue = cues.find((item) => item.number === cueNumber);
    if (cue) { audio.currentTime = cue.start; update(); }
  }

  audio.src = new URL(audioFile, window.location.href).href;
  audio.load();
  playBtn.addEventListener("click", handlePlayClick);
  resetBtn.addEventListener("click", restart);
  practiceBtn.addEventListener("click", handlePracticeClick);
  const stepButtons = Array.from(rootElement.querySelectorAll("[data-step]"));
  stepButtons.forEach((button) => button.addEventListener("click", handleStepClick));
  audio.addEventListener("timeupdate", update);
  audio.addEventListener("loadedmetadata", () => { audioError.classList.remove("is-visible"); statusLine.textContent = `Audio cargado: ${formatTime(getDuration())}`; update(); });
  audio.addEventListener("canplay", () => audioError.classList.remove("is-visible"));
  audio.addEventListener("ended", handleFinished);
  audio.addEventListener("error", showAudioError);
  restart();
  if (completionReported) {
    playBtn.textContent = "Reproducir de nuevo";
    practiceBtn.classList.add("is-visible");
    statusLine.textContent = "Teoría completada.";
  }

  return () => {
    audio.pause();
    if (rafId !== null) cancelAnimationFrame(rafId);
    playBtn.removeEventListener("click", handlePlayClick);
    resetBtn.removeEventListener("click", restart);
    subtitleToggle.destroy();
    practiceBtn.removeEventListener("click", handlePracticeClick);
    stepButtons.forEach((button) => button.removeEventListener("click", handleStepClick));
  };
  });
</script>

<div class="theory-root" bind:this={root}>

<main class="app">
<header class="top">
<section class="card hero">
<div class="eyebrow">Microprocesadores · Ensamblador 8086</div>
<h1>{theory.title}</h1>
<p class="sub">Datos declarados con DW, bytes físicos, little endian y operaciones con memoria.</p>
<div class="progress-shell"><div class="progress-bar" id="progressBar"></div></div>
<nav aria-label="Línea de tiempo" class="timeline" id="timeline">
<button class="time-dot" data-step="slide-1" type="button">Memoria</button>
<button class="time-dot" data-step="slide-2" type="button">DW</button>
<button class="time-dot" data-step="slide-3" type="button">Etiqueta</button>
<button class="time-dot" data-step="slide-4" type="button">Endian</button>
<button class="time-dot" data-step="slide-5" type="button">Datos</button>
<button class="time-dot" data-step="slide-6" type="button">MOV</button>
<button class="time-dot" data-step="slide-7" type="button">ADD</button>
<button class="time-dot" data-step="slide-8" type="button">Inmediato</button>
<button class="time-dot" data-step="slide-9" type="button">SUB</button>
<button class="time-dot" data-step="slide-10" type="button">Guardar</button>
<button class="time-dot" data-step="slide-11" type="button">Práctica</button>
</nav>
<div class="audio-error" id="audioError"></div>
</section>
</header>

<section class="slide-stage">
<article class="card slide is-active" data-slide="slide-1">
<div class="slide-head"><div><div class="slide-kicker">Paso 1</div><h2 class="slide-title">Datos <span>en memoria</span></h2></div><div class="slide-number">1 / 11</div></div>
<div class="sim-stack">
  <div class="concept-card" data-hotspot="mem-memory"><div class="concept-label">Idea central</div><div class="concept-main">Los datos también pueden vivir en memoria</div><p class="concept-note">No todo valor tiene que estar dentro de un registro.</p></div>
  <div class="concept-grid cols-2">
    <div class="concept-card" data-hotspot="mem-name"><div class="concept-label">Nombre</div><div class="concept-main">Etiqueta</div><p class="concept-note">Permite referirse al dato sin escribir la dirección.</p></div>
    <div class="concept-card" data-hotspot="mem-position"><div class="concept-label">Posición</div><div class="concept-main">Dirección</div><p class="concept-note">Indica dónde empieza el dato en memoria.</p></div>
  </div>
</div>
</article>

<article class="card slide" data-slide="slide-2">
<div class="slide-head"><div><div class="slide-kicker">Paso 2</div><h2 class="slide-title"><span>DW</span> reserva una word</h2></div><div class="slide-number">2 / 11</div></div>
<div class="sim-stack">
  <div class="concept-grid cols-2">
    <div class="concept-card" data-hotspot="dw-directive"><div class="concept-label">Directiva</div><div class="concept-main mono">DW</div><p class="concept-note">Define Word.</p></div>
    <div class="concept-card" data-hotspot="dw-word16"><div class="concept-label">Tamaño lógico</div><div class="concept-main">16 bits</div><p class="concept-note">Una word completa para el 8086.</p></div>
    <div class="concept-card" data-hotspot="dw-two-bytes"><div class="concept-label">Tamaño físico</div><div class="concept-main">2 bytes</div><p class="concept-note">Ocupan posiciones consecutivas.</p></div>
    <div class="concept-card" data-hotspot="dw-byte-by-byte"><div class="concept-label">Memoria</div><div class="concept-main">byte por byte</div><p class="concept-note">La memoria no se organiza como words aisladas.</p></div>
  </div>
  <div class="sim-panel"><div class="panel-title">Memoria reservada</div>
    <div class="mem-table">
      <div class="mem-row" data-hotspot="dw-mem-row">
        <div class="mem-left"><div class="mem-name mono">PALABRA</div><div class="addr mono">@0100</div></div>
        <div class="bytes mono"><span class="byte-chip">--</span><span class="byte-chip">--</span></div>
        <div class="word mono"><span>word</span><span>----</span></div>
      </div>
    </div>
  </div>
  <div class="concept-card" data-hotspot="dw-8086"><div class="concept-label">Procesador</div><div class="concept-main">El 8086 trabaja con valores de 16 bits</div></div>
</div>
</article>

<article class="card slide" data-slide="slide-3">
<div class="slide-head"><div><div class="slide-kicker">Paso 3</div><h2 class="slide-title">Etiqueta, dirección y <span>contenido</span></h2></div><div class="slide-number">3 / 11</div></div>
<div class="sim-stack">
  <div class="sim-panel"><div class="panel-title">Declaración</div>
    <div class="code-line mono" data-hotspot="decl-code"><span class="code-token" data-hotspot="decl-label">NUMERO_INICIAL:</span> <span class="code-token" data-hotspot="decl-dw">DW</span> <span class="code-token" data-hotspot="decl-value">2468h</span></div>
  </div>
  <div class="sim-panel"><div class="panel-title">Memoria</div>
    <div class="mem-table">
      <div class="mem-row" data-hotspot="decl-mem-row">
        <div class="mem-left"><div class="mem-name mono" data-hotspot="decl-reference">NUMERO_INICIAL</div><div class="addr mono" data-hotspot="decl-address">@0100</div></div>
        <div class="bytes mono"><span class="byte-chip">68</span><span class="byte-chip">24</span></div>
        <div class="word mono" data-hotspot="decl-content"><span>word</span><span>2468h</span></div>
      </div>
    </div>
  </div>
  <div class="concept-grid cols-2">
    <div class="concept-card" data-hotspot="decl-address"><div class="concept-label">Dirección</div><div class="concept-main mono">0100h</div><p class="concept-note">Dónde empieza el dato.</p></div>
    <div class="concept-card" data-hotspot="decl-content"><div class="concept-label">Contenido</div><div class="concept-main mono">2468h</div><p class="concept-note">Qué valor está guardado ahí.</p></div>
  </div>
</div>
</article>

<article class="card slide" data-slide="slide-4">
<div class="slide-head"><div><div class="slide-kicker">Paso 4</div><h2 class="slide-title">Formato <span>little endian</span></h2></div><div class="slide-number">4 / 11</div></div>
<div class="sim-stack">
  <div class="concept-card" data-hotspot="endian-title"><div class="concept-label">Detalle técnico</div><div class="concept-main">La word lógica no cambia</div><p class="concept-note">Cambia el orden físico de sus bytes en memoria.</p></div>
  <div class="flow-line" data-hotspot="endian-example">
    <div class="flow-chip" data-hotspot="endian-logical"><b class="mono">2468h</b><span>word lógica</span></div>
    <div class="flow-arrow">→</div>
    <div class="flow-chip" data-hotspot="endian-meaning"><b class="mono">68 24</b><span>bytes físicos</span></div>
  </div>
  <div class="sim-panel"><div class="panel-title">Memoria</div>
    <div class="mem-table">
      <div class="mem-row">
        <div class="mem-left"><div class="mem-name mono">NUMERO_INICIAL</div><div class="addr mono">@0100</div></div>
        <div class="bytes mono" data-hotspot="endian-byte-low"><span class="byte-chip" data-hotspot="endian-low">68</span><span class="byte-chip" data-hotspot="endian-byte-high">24</span></div>
        <div class="word mono" data-hotspot="endian-logical"><span>word</span><span>2468h</span></div>
      </div>
    </div>
  </div>
  <div class="sim-panel"><div class="panel-title">Operación interna</div>
    <div class="op-box" data-hotspot="endian-key"><span class="mono">byte bajo primero</span><span class="op-note" data-hotspot="endian-low">68h</span><span class="op-note" data-hotspot="endian-high">24h después</span></div>
  </div>
</div>
</article>

<article class="card slide" data-slide="slide-5">
<div class="slide-head"><div><div class="slide-kicker">Paso 5</div><h2 class="slide-title">Datos declarados <span>para operar</span></h2></div><div class="slide-number">5 / 11</div></div>
<div class="sim-stack">
  <div class="sim-panel" data-hotspot="data-all"><div class="panel-title">Declaraciones</div>
    <div class="code-list">
      <div class="code-line mono" data-hotspot="data-numero">NUMERO_INICIAL: DW 2468h</div>
      <div class="code-line mono" data-hotspot="data-ajuste">AJUSTE_MEMORIA: DW 0010h</div>
      <div class="code-line mono" data-hotspot="data-total">TOTAL_CALCULADO: DW 0000h</div>
    </div>
  </div>
  <div class="sim-panel"><div class="panel-title">Memoria</div>
    <div class="mem-table">
      <div class="mem-row" data-hotspot="data-numero"><div class="mem-left"><div class="mem-name mono">NUMERO_INICIAL</div><div class="addr mono">@0100</div></div><div class="bytes mono"><span>68</span><span>24</span></div><div class="word mono"><span>word</span><span>2468h</span></div></div>
      <div class="mem-row" data-hotspot="data-ajuste"><div class="mem-left"><div class="mem-name mono">AJUSTE_MEMORIA</div><div class="addr mono">@0102</div></div><div class="bytes mono"><span>10</span><span>00</span></div><div class="word mono"><span>word</span><span>0010h</span></div></div>
      <div class="mem-row" data-hotspot="data-total"><div class="mem-left"><div class="mem-name mono">TOTAL_CALCULADO</div><div class="addr mono">@0104</div></div><div class="bytes mono"><span>00</span><span>00</span></div><div class="word mono"><span>word</span><span>0000h</span></div></div>
    </div>
  </div>
</div>
</article>

<article class="card slide" data-slide="slide-6">
<div class="slide-head"><div><div class="slide-kicker">Paso 6</div><h2 class="slide-title">Leer una word <span>desde memoria</span></h2></div><div class="slide-number">6 / 11</div></div>
<div class="sim-stack">
  <div class="sim-panel"><div class="panel-title">Registros usados</div>
    <div class="reg-grid one"><div class="reg-card" data-hotspot="mov-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" id="axMovVal">0000h</div><div class="reg-note" id="axMovNote">destino</div></div></div>
  </div>
  <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="mov-instr">MOV AX, word NUMERO_INICIAL</div></div>
  <div class="sim-panel"><div class="panel-title">Memoria fuente</div>
    <div class="mem-table">
      <div class="mem-row" data-hotspot="mov-mem"><div class="mem-left"><div class="mem-name mono">NUMERO_INICIAL</div><div class="addr mono">@0100</div></div><div class="bytes mono"><span>68</span><span>24</span></div><div class="word mono" data-hotspot="mov-word"><span>word</span><span>2468h</span></div></div>
    </div>
  </div>
  <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box" data-hotspot="mov-op-content"><span class="mono">AX = [NUMERO_INICIAL]</span><span class="op-note">AX recibe el contenido, no la dirección.</span></div></div>
</div>
</article>

<article class="card slide" data-slide="slide-7">
<div class="slide-head"><div><div class="slide-kicker">Paso 7</div><h2 class="slide-title">Sumar con <span>memoria</span></h2></div><div class="slide-number">7 / 11</div></div>
<div class="sim-stack">
  <div class="sim-panel"><div class="panel-title">Registros usados</div>
    <div class="reg-grid one"><div class="reg-card" data-hotspot="add-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" id="axAddVal">2468h</div><div class="reg-note">destino y acumulador</div></div></div>
  </div>
  <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="add-instr">ADD AX, word AJUSTE_MEMORIA</div></div>
  <div class="sim-panel"><div class="panel-title">Memoria fuente</div>
    <div class="mem-table"><div class="mem-row" data-hotspot="add-mem"><div class="mem-left"><div class="mem-name mono">AJUSTE_MEMORIA</div><div class="addr mono">@0102</div></div><div class="bytes mono"><span>10</span><span>00</span></div><div class="word mono" data-hotspot="add-word"><span>word</span><span>0010h</span></div></div></div>
  </div>
  <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box" data-hotspot="add-op"><span class="mono">2468h + 0010h = 2478h</span><span class="op-note">AX cambia porque AX es el destino.</span></div></div>
</div>
</article>

<article class="card slide" data-slide="slide-8">
<div class="slide-head"><div><div class="slide-kicker">Paso 8</div><h2 class="slide-title">Valor <span>inmediato</span></h2></div><div class="slide-number">8 / 11</div></div>
<div class="sim-stack">
  <div class="concept-grid cols-2">
    <div class="concept-card" data-hotspot="imm-idea"><div class="concept-label">Idea</div><div class="concept-main">No viene de memoria</div><p class="concept-note">No se busca en otra etiqueta.</p></div>
    <div class="concept-card" data-hotspot="imm-written"><div class="concept-label">Dónde está</div><div class="concept-main">En la instrucción</div><p class="concept-note">El valor ya está escrito ahí.</p></div>
  </div>
  <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="imm-instr">MOV word MARCADOR, <span data-hotspot="imm-value">0007h</span></div></div>
  <div class="sim-panel"><div class="panel-title">Memoria destino</div>
    <div class="mem-table"><div class="mem-row" data-hotspot="imm-dest"><div class="mem-left"><div class="mem-name mono">MARCADOR</div><div class="addr mono">@0106</div></div><div class="bytes mono" data-hotspot="imm-bytes" id="markerBytes"><span>00</span><span>00</span></div><div class="word mono" data-hotspot="imm-word" id="markerWord"><span>word</span><span>0000h</span></div></div></div>
  </div>
  <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box" data-hotspot="imm-direct"><span class="mono">[MARCADOR] = 0007h</span><span class="op-note">El dato se toma directamente de la instrucción.</span></div></div>
</div>
</article>

<article class="card slide" data-slide="slide-9">
<div class="slide-head"><div><div class="slide-kicker">Paso 9</div><h2 class="slide-title">Restar un inmediato <span>a AX</span></h2></div><div class="slide-number">9 / 11</div></div>
<div class="sim-stack">
  <div class="sim-panel"><div class="panel-title">Registros usados</div>
    <div class="reg-grid one"><div class="reg-card" data-hotspot="sub-ax"><div class="reg-name mono">AX</div><div class="reg-val mono" id="axSubVal">2478h</div><div class="reg-note">destino</div></div></div>
  </div>
  <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="sub-instr">SUB AX, <span data-hotspot="sub-imm">0004h</span></div></div>
  <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box" data-hotspot="sub-op"><span class="mono">2478h - 0004h = 2474h</span><span class="op-note">El resultado queda en AX.</span></div></div>
</div>
</article>

<article class="card slide" data-slide="slide-10">
<div class="slide-head"><div><div class="slide-kicker">Paso 10</div><h2 class="slide-title">Guardar el resultado <span>en memoria</span></h2></div><div class="slide-number">10 / 11</div></div>
<div class="sim-stack">
  <div class="sim-panel"><div class="panel-title">Registros usados</div>
    <div class="reg-grid one"><div class="reg-card" data-hotspot="store-ax"><div class="reg-name mono">AX</div><div class="reg-val mono">2474h</div><div class="reg-note">fuente</div></div></div>
  </div>
  <div class="sim-panel"><div class="panel-title">Instrucción activa</div><div class="instr-box mono" data-hotspot="store-instr">MOV word TOTAL_CALCULADO, AX</div></div>
  <div class="sim-panel"><div class="panel-title">Memoria destino</div>
    <div class="mem-table"><div class="mem-row" data-hotspot="store-dest"><div class="mem-left"><div class="mem-name mono">TOTAL_CALCULADO</div><div class="addr mono">@0104</div></div><div class="bytes mono" data-hotspot="store-bytes" id="totalBytes"><span>00</span><span>00</span></div><div class="word mono" data-hotspot="store-word" id="totalWord"><span>word</span><span>0000h</span></div></div></div>
  </div>
  <div class="sim-panel"><div class="panel-title">Operación interna</div><div class="op-box" data-hotspot="store-endian"><span class="mono">[TOTAL_CALCULADO] = AX</span><span class="op-note" data-hotspot="store-two-bytes">word = dos bytes</span><span class="op-note">little endian: 2474h → 74 24</span></div></div>
</div>
</article>

<article class="card slide" data-slide="slide-11">
<div class="slide-head"><div><div class="slide-kicker">Paso 11</div><h2 class="slide-title">Para la <span>práctica</span></h2></div><div class="slide-number">11 / 11</div></div>
<div class="sim-stack">
  <div class="concept-card" data-hotspot="practice-read"><div class="concept-label">1</div><div class="concept-main">Lee cada instrucción en orden</div></div>
  <div class="concept-card" data-hotspot="practice-source"><div class="concept-label">2</div><div class="concept-main">Identifica de dónde viene el dato</div><p class="concept-note">Registro, memoria o inmediato.</p></div>
  <div class="concept-card" data-hotspot="practice-dest"><div class="concept-label">3</div><div class="concept-main">Ubica el destino</div><p class="concept-note" data-hotspot="practice-change">Luego decide qué cambia.</p></div>
</div>
</article>
</section>
</main>

<footer class="footer-dock">
<div class="footer-inner">
<div class="subtitle" id="subtitle" hidden><span>Presiona reproducir para iniciar.</span></div>
<div class="controls">
<button class="primary" id="playBtn" type="button">Reproducir</button>
<button aria-label="Reiniciar" class="secondary" id="resetBtn" type="button">↺</button>
<button aria-label="Mostrar subtítulos" aria-pressed="false" class="secondary cc-button" id="subtitleBtn" type="button">CC</button>
</div>
<button class="primary final-action" id="practiceBtn" type="button">Iniciar práctica</button>
<div class="status-line" id="statusLine">Audio esperado: <strong>{theory.audioFile}</strong></div>
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
  }
  * { box-sizing: border-box; }
  .theory-root { margin: 0; min-height: 100%; background: var(--bg); color: var(--text); }
  .theory-root {
    min-height: 100dvh;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:
      radial-gradient(circle at 50% -14%, rgba(244,197,66,.12), transparent 34%),
      linear-gradient(180deg, #0f1117 0%, #11151d 100%);
  }
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
  .time-dot:global(.is-active) { color: var(--accent); border-color: var(--accent-line); background: var(--accent-soft); }
  .audio-error { display: none; margin-top: 9px; padding: 10px; border-radius: 13px; background: rgba(239,83,80,.12); border: 1px solid rgba(239,83,80,.38); color: #ffd7d7; font-size: 12.5px; line-height: 1.35; overflow-wrap: anywhere; }
  .audio-error:global(.is-visible) { display: block; }
  .slide-stage { margin-top: 12px; }
  .slide { display: none; min-height: calc(100dvh - 350px); padding: 14px; overflow: hidden; }
  .slide:global(.is-active) { display: block; animation: enter .16s ease both; }
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
  .instr-box { width: 100%; border: 1px solid var(--line); background: var(--panel-3); border-radius: 15px; padding: 11px; color: var(--text); font-size: clamp(16px, 4.8vw, 23px); line-height: 1.18; font-weight: 950; letter-spacing: -.025em; text-align: center; overflow-wrap: anywhere; }
  .code-line { width: 100%; border: 1px solid var(--line); background: var(--panel-3); border-radius: 15px; padding: 11px; color: var(--text); font-size: clamp(14px, 4.3vw, 21px); line-height: 1.25; font-weight: 950; letter-spacing: -.03em; overflow-wrap: anywhere; }
  .code-list { display: grid; gap: 8px; }
  .code-token { display: inline-block; padding: 2px 5px; border-radius: 8px; border: 1px solid transparent; }
  .op-box { border: 1px solid var(--line); background: rgba(17,23,34,.86); border-radius: 16px; padding: 11px; text-align: center; font-size: clamp(15px, 4.3vw, 21px); line-height: 1.15; font-weight: 950; }
  .op-note { display: block; margin-top: 6px; color: var(--muted); font-size: 11px; font-weight: 850; line-height: 1.25; }
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
  [data-hotspot]:global(.is-hot) .mem-name,
  [data-hotspot]:global(.is-hot) .bytes,
  [data-hotspot]:global(.is-hot) .word,
  [data-hotspot]:global(.is-hot).instr-box,
  [data-hotspot]:global(.is-hot).op-box,
  [data-hotspot]:global(.is-hot).code-line,
  [data-hotspot]:global(.is-hot).code-token,
  [data-hotspot]:global(.is-hot).flow-chip b { color: var(--accent); }
  .code-token:global(.is-hot) { border-color: var(--accent-line) !important; background-color: var(--accent-soft) !important; color: var(--accent); }
  .footer-dock { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; padding: 22px 12px 12px; background: linear-gradient(180deg, rgba(15,17,23,0), rgba(15,17,23,.98) 18%); }
  .footer-inner { width: 100%; max-width: 500px; margin: 0 auto; }
  .subtitle { min-height: 64px; padding: 11px 12px; border-radius: 17px; background: rgba(17,20,27,.98); border: 1px solid var(--line); box-shadow: 0 12px 24px rgba(0,0,0,.3); font-size: 15px; line-height: 1.35; font-weight: 760; }
  .subtitle[hidden] { display: none; }
  .controls { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; margin-top: 8px; }
  .primary,.secondary { min-height: 48px; border-radius: 14px; border: 1px solid var(--line); cursor: pointer; font-weight: 950; }
  .primary { background: var(--accent); border-color: rgba(244,197,66,.84); color: #11141b; }
  .secondary { width: 54px; background: #252c39; color: var(--text); }
  .cc-button:global(.is-active) { color: var(--accent); border-color: var(--accent-line); background: var(--accent-soft); }
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

</style>
