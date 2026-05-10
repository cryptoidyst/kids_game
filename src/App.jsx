import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";

// ─── Translations ────────────────────────────────────────────────────────────
const T = {
  en: {
    startTitle: "Body Parts Learning Game",
    startButton: "Start Game",
    bodyPartsMatch: "Matching Body Parts",
    bodyPartsCrossword: "Body Parts Crossword",
    bodyPartsMissingWords: "Missing Word",
    bodyPartsTitle: "Matching Body Parts",
    matchFinished: "You finished the matching game!",
    missingWordsTitle: "Missing Word",
    score: "Score",
    dropHere: "Drop here",
    playAgain: "Play Again",
    nextQuestion: "Next Question",
    restartQuiz: "Restart Quiz",
    checkMissingWord: "Check Answer",
    typeAnswer: "Type your answer",
    pickHint: "Or tap an option to auto-fill:",
    matchedAll: "🎉 You matched all images!",
    finalScore: "Final Score",
    resultLevel: "Result",
    levelLow: "Low",
    levelMid: "Mid",
    levelHigh: "High",
    resultMessageLow: "Nice try! Keep going, you can do even better next time!",
    resultMessageMid: "Good job! You are learning well!",
    resultMessageHigh: "Excellent work! You did amazing!",
    fb_initial: "Drag or tap a word, then match it to the correct image!",
    fb_reset: "Great! New game started. Match all body-part pictures again!",
    fb_locked: (l) => `${l} is already locked and cannot be moved.`,
    fb_taken: "That picture already has an answer.",
    fb_correct: (l) => `Awesome! ${l} is correct. ✅`,
    fb_wrong: (l) => `Wrong place for ${l}. It is now locked. ❌`,
    fb_selected: (l) => `Selected ${l}. Now tap or drag to the matching image.`,
    fb_noword: "Tap a word first, then tap an image.",
    fb_nodrop: (l) => `Oops! ${l} was not dropped on a picture.`,
    crosswordTitle: "Body Parts Crossword",
    solvedWords: "Solved Words",
    correctLetters: "Correct Letters",
    across: "Across",
    down: "Down",
    alphabetHelper: "Letter Helper",
    checkAnswers: "Check Answers",
    resetPuzzle: "Reset Puzzle",
    fb_cw_initial: "Fill in the body parts crossword! Some hint letters are shown.",
    fb_cw_solved: "Amazing! You solved the whole crossword! 🎉",
    fb_cw_partial: (s, t) => `Great effort! You got ${s}/${t} words correct.`,
    fb_cw_reset: "New round! Hint letters refreshed. Fill in and tap Check Answers!",
    fb_mw_initial: "Look at the image and choose the correct missing word.",
    fb_mw_correct: (l) => `Great! ${l} is correct.`,
    fb_mw_wrong: (right) => `Not quite. The correct answer is ${right}.`,
    fb_mw_type_first: "Type an answer or tap an option first.",
    fb_mw_pick_hint: (l) => `Picked ${l}. Press Check Answer.`,
    mw_done: "You completed all missing word questions!",
    question: "Question",
  },
  ms: {
    startTitle: "Permainan Pembelajaran Anggota Badan",
    startButton: "Mula Permainan",
    bodyPartsMatch: "Padankan Anggota Badan",
    bodyPartsCrossword: "Silang Kata Anggota Badan",
    bodyPartsMissingWords: "Isi Tempat Kosong",
    bodyPartsTitle: "Padankan Gambar Anggota Badan",
    matchFinished: "Kamu telah selesai permainan padanan!",
    missingWordsTitle: "Isi Tempat Kosong Anggota Badan",
    score: "Markah",
    dropHere: "Letak di sini",
    playAgain: "Main Semula",
    nextQuestion: "Soalan Seterusnya",
    restartQuiz: "Ulang Kuiz",
    checkMissingWord: "Semak Jawapan",
    typeAnswer: "Isi kan jawapan di bawah",
    pickHint: "sila pilih jawapan di sini",
    matchedAll: "🎉 Kamu berjaya padankan semua gambar!",
    finalScore: "Markah Akhir",
    resultLevel: "Keputusan",
    levelLow: "Rendah",
    levelMid: "Sederhana",
    levelHigh: "Tinggi",
    resultMessageLow: "Cuba lagi! Bagus usaha kamu, mesti boleh buat lebih baik lagi!",
    resultMessageMid: "Syabas! Kamu sedang belajar dengan baik!",
    resultMessageHigh: "Hebat sekali! Kamu memang cemerlang!",
    fb_initial: "Sila padankan jawapan pada gambar anggota badan yang disediakan.",
    fb_reset: "Bagus! Permainan baru dimulakan. Padankan semula semua gambar anggota badan!",
    fb_locked: (l) => `${l} sudah dikunci dan tidak boleh dialihkan.`,
    fb_taken: "Gambar itu sudah mempunyai jawapan.",
    fb_correct: (l) => `Hebat! ${l} adalah betul. ✅`,
    fb_wrong: (l) => `Tempat salah untuk ${l}. Ia kini dikunci. ❌`,
    fb_selected: (l) => `Dipilih ${l}. Ketuk atau seret ke gambar yang sepadan.`,
    fb_noword: "Ketuk perkataan dahulu, kemudian ketuk gambar.",
    fb_nodrop: (l) => `Aduh! ${l} tidak dilepaskan pada gambar.`,
    crosswordTitle: "Silang Kata Anggota Badan",
    solvedWords: "Perkataan Selesai",
    correctLetters: "Huruf Betul",
    across: "Melintang",
    down: "Menegak",
    alphabetHelper: "Pembantu Huruf",
    checkAnswers: "Semak Jawapan",
    resetPuzzle: "Mula Semula",
    fb_cw_initial: "Isi silang kata anggota badan ini! Beberapa huruf petunjuk sudah ditunjukkan.",
    fb_cw_solved: "Luar biasa! Kamu selesaikan keseluruhan silang kata! 🎉",
    fb_cw_partial: (s, t) => `Usaha yang baik! Kamu betul ${s}/${t} perkataan.`,
    fb_cw_reset: "Pusingan baru! Huruf petunjuk berubah. Isi dan ketuk Semak Jawapan!",
    fb_mw_initial: "Lihat gambar dan pilih perkataan yang betul untuk isi tempat kosong.",
    fb_mw_correct: (l) => `Bagus! ${l} ialah jawapan betul.`,
    fb_mw_wrong: (right) => `Belum tepat. Jawapan yang betul ialah ${right}.`,
    fb_mw_type_first: "Taip jawapan atau ketuk pilihan dahulu.",
    fb_mw_pick_hint: (l) => `Dipilih ${l}. Tekan Semak Jawapan.`,
    mw_done: "Kamu telah selesai semua soalan isi tempat kosong!",
    question: "Soalan",
  },
};

// ─── Body Parts Data (Drag & Drop) ───────────────────────────────────────────
const BODY_PARTS = [
  { id: "hands",   en: "Hands",   ms: "Tangan",    image: "/body-parts/hands.png.jpeg" },
  { id: "nose",    en: "Nose",    ms: "Hidung",     image: "/body-parts/nose.png.jpeg" },
  { id: "eye",     en: "Eye",     ms: "Mata",       image: "/body-parts/eye.png.jpeg" },
  { id: "stomach", en: "Stomach", ms: "Perut",      image: "/body-parts/stomach.png.jpeg" },
  { id: "feet",    en: "Feet",    ms: "Kaki",       image: "/body-parts/feet.png.jpeg" },
  { id: "lungs",   en: "Lungs",   ms: "Paru-paru",  image: "/body-parts/lungs.png.jpeg" },
  { id: "brain",   en: "Brain",   ms: "Otak",       image: "/body-parts/brain.png.jpeg" },
  { id: "heart",   en: "Heart",   ms: "Jantung",    image: "/body-parts/heart.png.jpeg" },
  { id: "ear",     en: "Ear",     ms: "Telinga",    image: "/body-parts/ear.png.jpeg" },
  { id: "mouth",   en: "Mouth",   ms: "Mulut",      image: "/body-parts/mouth.png.jpeg" },
];

const MISSING_WORDS_QUESTIONS = [
  { id: "nose", en: "You use your ____ to smell.", ms: "Kamu guna ____ untuk menghidu." },
  { id: "eye", en: "You can see with your ____.", ms: "Kamu boleh melihat dengan ____." },
  { id: "ear", en: "You hear sounds with your ____.", ms: "Kamu mendengar bunyi dengan ____." },
  { id: "mouth", en: "You speak and eat with your ____.", ms: "Kamu bercakap dan makan dengan ____." },
  { id: "brain", en: "You think with your ____.", ms: "Kamu berfikir dengan ____." },
  { id: "heart", en: "Your ____ pumps blood.", ms: "____ mengepam darah." },
  { id: "lungs", en: "The ____ functions to supply oxygen.", ms: "____ berfungsi untuk membekalkan oksigen." },
  { id: "hands", en: "You hold things using your ____.", ms: "Kamu pegang barang menggunakan ____." },
  { id: "feet", en: "You walk using your ____.", ms: "Kamu berjalan menggunakan ____." },
  { id: "stomach", en: "Food is digested in the ____.", ms: "Makanan dicerna di dalam ____." },
];

const CROSSWORD_CONFIG = {
  en: {
    size: 10,
    words: [
      {
        number: 1, direction: "Down", answer: "EAR", row: 0, col: 1,
        en: "You hear with this",
        ms: "Membantu kita untuk mendengar",
      },
      {
        number: 2, direction: "Across", answer: "BRAIN", row: 5, col: 1,
        en: "It helps you think",
        ms: "Membantu kita untuk berfikir",
      },
      {
        number: 3, direction: "Down", answer: "NOSE", row: 0, col: 3,
        en: "Used for smelling",
        ms: "Membantu kita untuk menghidu udara segar",
      },
      {
        number: 4, direction: "Across", answer: "MOUTH", row: 7, col: 1,
        en: "You eat and speak with this",
        ms: "Membantu kita untuk makan dan bercakap",
      },
      {
        number: 5, direction: "Across", answer: "HEART", row: 9, col: 1,
        en: "It pumps blood around your body",
        ms: "Membantu kita untuk mengepam darah ke seluruh badan",
      },
    ],
  },
  ms: {
    size: 10,
    words: [
      {
        number: 1, direction: "Down", answer: "OTAK", row: 0, col: 1,
        ms: "Membantu kita untuk berfikir",
        en: "It helps you think",
      },
      {
        number: 2, direction: "Down", answer: "PERUT", row: 0, col: 3,
        ms: "Membantu kita untuk mencerna makanan",
        en: "Where food is digested",
      },
      {
        number: 3, direction: "Down", answer: "HIDUNG", row: 0, col: 6,
        ms: "Membantu kita untuk menghidu udara segar",
        en: "Used for smelling",
      },
      {
        number: 4, direction: "Down", answer: "JANTUNG", row: 0, col: 8,
        ms: "Membantu kita untuk mengepam darah ke seluruh badan",
        en: "It pumps blood around your body",
      },
      {
        number: 5, direction: "Across", answer: "TELINGA", row: 7, col: 1,
        ms: "Membantu kita untuk mendengar",
        en: "You hear with this",
      },
      {
        number: 6, direction: "Across", answer: "MULUT", row: 9, col: 1,
        ms: "Membantu kita untuk makan dan bercakap",
        en: "You eat and speak with this",
      },
    ],
  },
};

// ─── Crossword Builder ────────────────────────────────────────────────────────
function buildCrosswordMeta(words) {
  const cells = {};
  words.forEach((word) => {
    word.answer.split("").forEach((letter, idx) => {
      const row = word.direction === "Across" ? word.row : word.row + idx;
      const col = word.direction === "Across" ? word.col + idx : word.col;
      const key = `${row}-${col}`;
      if (!cells[key]) cells[key] = { row, col, letter, numbers: [] };
      if (idx === 0) cells[key].numbers.push(word.number);
    });
  });

  const totalLetters = Object.keys(cells).length;

  const keys = Object.keys(cells).sort((a, b) => {
    const [rowA, colA] = a.split("-").map(Number);
    const [rowB, colB] = b.split("-").map(Number);
    return rowA !== rowB ? rowA - rowB : colA - colB;
  });

  const letterBank = [...new Set(words.flatMap((w) => w.answer.split("")))].sort();

  return { cells, totalLetters, keys, letterBank };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

function getResultLevel(score, lang) {
  const t = T[lang];
  if (score <= 40) return t.levelLow;
  if (score <= 70) return t.levelMid;
  return t.levelHigh;
}

function getResultMessage(score, lang) {
  const t = T[lang];
  if (score <= 40) return t.resultMessageLow;
  if (score <= 70) return t.resultMessageMid;
  return t.resultMessageHigh;
}

function useFeedbackSound() {
  const audioContextRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, []);

  return useCallback((kind) => {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (kind === "correct") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(1500, now + 0.12);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.42, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
      return;
    }

    osc.type = "square";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.36, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    osc.start(now);
    osc.stop(now + 0.24);
  }, []);
}

function createRandomStarterLetters(words) {
  const getWordCellKey = (word, index) => {
    const row = word.direction === "Across" ? word.row : word.row + index;
    const col = word.direction === "Across" ? word.col + index : word.col;
    return `${row}-${col}`;
  };

  const starterLetters = {};
  const usedKeys = new Set();

  // For younger learners, start-of-word hints are clearer than random hints.
  words.forEach((word) => {
    const firstKey = getWordCellKey(word, 0);
    if (!usedKeys.has(firstKey)) {
      starterLetters[firstKey] = word.answer[0];
      usedKeys.add(firstKey);
      return;
    }

    const fallbackIndex = Array.from({ length: word.answer.length }, (_, idx) => idx)
      .find((idx) => !usedKeys.has(getWordCellKey(word, idx)));
    if (fallbackIndex !== undefined) {
      const key = getWordCellKey(word, fallbackIndex);
      starterLetters[key] = word.answer[fallbackIndex];
      usedKeys.add(key);
    }
  });

  return starterLetters;
}

function buildCombinedCrosswordConfig(baseConfig) {
  const size = baseConfig.size;
  const grid = Array.from({ length: size }, () => Array(size).fill(""));

  const words = baseConfig.words.map((w) => ({ ...w }));
  const byLengthDesc = [...words].sort((a, b) => b.answer.length - a.answer.length);
  const placed = [];

  const inBounds = (r, c) => r >= 0 && r < size && c >= 0 && c < size;
  const isFilled = (r, c) => inBounds(r, c) && grid[r][c] !== "";

  const canPlace = (word, row, col) => {
    const isAcross = word.direction === "Across";
    const len = word.answer.length;

    const beforeRow = isAcross ? row : row - 1;
    const beforeCol = isAcross ? col - 1 : col;
    const afterRow = isAcross ? row : row + len;
    const afterCol = isAcross ? col + len : col;

    if (inBounds(beforeRow, beforeCol) && isFilled(beforeRow, beforeCol)) return { ok: false, intersections: 0 };
    if (inBounds(afterRow, afterCol) && isFilled(afterRow, afterCol)) return { ok: false, intersections: 0 };

    let intersections = 0;
    for (let i = 0; i < len; i += 1) {
      const r = isAcross ? row : row + i;
      const c = isAcross ? col + i : col;
      if (!inBounds(r, c)) return { ok: false, intersections: 0 };

      const existing = grid[r][c];
      const letter = word.answer[i];
      if (existing && existing !== letter) return { ok: false, intersections: 0 };
      if (existing === letter) intersections += 1;

      if (!existing) {
        if (isAcross) {
          if (isFilled(r - 1, c) || isFilled(r + 1, c)) return { ok: false, intersections: 0 };
        } else {
          if (isFilled(r, c - 1) || isFilled(r, c + 1)) return { ok: false, intersections: 0 };
        }
      }
    }

    return { ok: true, intersections };
  };

  const applyPlacement = (word, row, col) => {
    const isAcross = word.direction === "Across";
    for (let i = 0; i < word.answer.length; i += 1) {
      const r = isAcross ? row : row + i;
      const c = isAcross ? col + i : col;
      grid[r][c] = word.answer[i];
    }
    placed.push({ key: `${word.number}-${word.answer}`, row, col });
  };

  const findBestPlacement = (word, requireIntersection) => {
    const candidates = [];
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        const { ok, intersections } = canPlace(word, r, c);
        if (!ok) continue;
        if (requireIntersection && intersections === 0) continue;
        const centerBias = Math.abs(r - size / 2) + Math.abs(c - size / 2);
        candidates.push({ row: r, col: c, intersections, centerBias });
      }
    }

    if (!candidates.length) return null;
    candidates.sort((a, b) => {
      if (b.intersections !== a.intersections) return b.intersections - a.intersections;
      return a.centerBias - b.centerBias;
    });
    return candidates[0];
  };

  const anchor = byLengthDesc[0];
  if (anchor) {
    const isAcross = anchor.direction === "Across";
    const row = isAcross ? Math.floor(size / 2) : Math.max(0, Math.floor((size - anchor.answer.length) / 2));
    const col = isAcross ? Math.max(0, Math.floor((size - anchor.answer.length) / 2)) : Math.floor(size / 2);
    const anchorSpot = canPlace(anchor, row, col).ok ? { row, col } : findBestPlacement(anchor, false);
    if (anchorSpot) applyPlacement(anchor, anchorSpot.row, anchorSpot.col);
  }

  byLengthDesc.slice(1).forEach((word) => {
    const withIntersections = findBestPlacement(word, true);
    if (withIntersections) {
      applyPlacement(word, withIntersections.row, withIntersections.col);
      return;
    }
    const separated = findBestPlacement(word, false);
    if (separated) applyPlacement(word, separated.row, separated.col);
  });

  const placedMap = new Map(placed.map((p) => [p.key, p]));
  const finalWords = words.map((word) => {
    const key = `${word.number}-${word.answer}`;
    const p = placedMap.get(key);
    if (!p) return word;
    return { ...word, row: p.row, col: p.col };
  });

  return { ...baseConfig, words: finalWords };
}

// ─── Draggable Word Button ────────────────────────────────────────────────────
function DraggableWord({ word, lang, onDropTry, onSelect, disabled, isSelected }) {
  const dragControls = useDragControls();
  const primary   = word[lang];
  const secondary = word[lang === "en" ? "ms" : "en"];

  const handlePointerDown = (event) => {
    if (disabled) return;
    dragControls.start(event, { snapToCursor: event.pointerType === "mouse" });
  };

  return (
    <motion.button
      type="button"
      drag={!disabled}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      whileHover={{ scale: disabled ? 1 : 1.06 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileDrag={{ scale: 1.02, zIndex: 20 }}
      onPointerDown={handlePointerDown}
      onClick={() => onSelect(word)}
      onDragEnd={(event, info) => onDropTry(word, event, info)}
      style={{ touchAction: "none" }}
      className={`select-none rounded-2xl border-4 px-3 py-2 text-center font-bold shadow-playful leading-tight ${
        disabled
          ? "cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500"
          : isSelected
            ? "cursor-grab border-amber-300 bg-rose-500 text-white"
            : "cursor-grab border-white bg-bubblegum text-white"
      }`}
    >
      <div className="text-sm sm:text-base">{primary}</div>
      <div className={`text-[10px] sm:text-xs font-semibold opacity-80 ${disabled ? "text-slate-400" : "text-white/90"}`}>
        {secondary}
      </div>
    </motion.button>
  );
}

// ─── Body Parts Drag & Drop Game ──────────────────────────────────────────────
function BodyPartsGame({ lang, playFeedbackSound }) {
  const t = T[lang];
  const [wordPool, setWordPool]       = useState(() => shuffle(BODY_PARTS));
  const [assignments, setAssignments] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);
  const [feedback, setFeedback]       = useState(t.fb_initial);
  const [gameRound, setGameRound]     = useState(0);
  const zoneRefs        = useRef({});

  useEffect(() => { setFeedback(T[lang].fb_initial); }, [lang]);

  const wordById      = useMemo(() => BODY_PARTS.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}), []);
  const assignedCount = Object.keys(assignments).length;
  const correctCount  = useMemo(
    () => Object.entries(assignments).filter(([partId, wordId]) => partId === wordId).length,
    [assignments]
  );
  const score    = correctCount * 10;
  const gameFinished = assignedCount === BODY_PARTS.length;
  const complete = correctCount === BODY_PARTS.length;
  const resultLevel = getResultLevel(score, lang);
  const resultMessage = getResultMessage(score, lang);

  const resetGame = () => {
    setWordPool(shuffle(BODY_PARTS));
    setAssignments({});
    setSelectedWord(null);
    setFeedback(T[lang].fb_reset);
    setGameRound((prev) => prev + 1);
  };

  const assignWordToPart = (word, partId) => {
    const taken = Object.values(assignments);
    const label = word[lang];
    if (taken.includes(word.id)) { setFeedback(T[lang].fb_locked(label)); playFeedbackSound("wrong"); return; }
    if (assignments[partId])      { setFeedback(T[lang].fb_taken);         playFeedbackSound("wrong"); return; }
    setAssignments((prev) => ({ ...prev, [partId]: word.id }));
    if (word.id === partId) { setSelectedWord(null); setFeedback(T[lang].fb_correct(label)); playFeedbackSound("correct"); }
    else                    { setSelectedWord(null); setFeedback(T[lang].fb_wrong(label));   playFeedbackSound("wrong");   }
  };

  const handleWordSelect = (word) => {
    if (Object.values(assignments).includes(word.id)) return;
    setSelectedWord(word);
    setFeedback(T[lang].fb_selected(word[lang]));
  };

  const getDropPoint = (event, info) => {
    if (event?.changedTouches?.[0]) return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    if (typeof event?.clientX === "number") return { x: event.clientX, y: event.clientY };
    return { x: info.point.x, y: info.point.y };
  };

  const handleDropTry = (word, event, info) => {
    if (Object.values(assignments).includes(word.id)) return;
    const { x, y } = getDropPoint(event, info);
    const hitPart = BODY_PARTS.find((part) => {
      const node = zoneRefs.current[part.id];
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    });
    if (hitPart) assignWordToPart(word, hitPart.id);
    else { setFeedback(T[lang].fb_nodrop(word[lang])); playFeedbackSound("wrong"); }
  };

  const handleZoneTap = (partId) => {
    if (!selectedWord) { setFeedback(T[lang].fb_noword); return; }
    assignWordToPart(selectedWord, partId);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border-4 border-white bg-white/80 p-4 text-center shadow-playful backdrop-blur"
      >
        <h1 className="text-2xl font-extrabold text-emerald-600 sm:text-4xl">{t.bodyPartsTitle}</h1>
        <p className="text-lg font-semibold text-slate-700">{t.score}: {score}</p>
      </motion.header>

      <section className="grid flex-1 gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border-4 border-white bg-white/80 p-4 shadow-playful"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BODY_PARTS.map((part) => {
              const assignedWordId = assignments[part.id];
              const isCorrect  = assignedWordId === part.id;
              const hasAnswer  = Boolean(assignedWordId);
              const assignedP  = hasAnswer ? wordById[assignedWordId] : null;
              return (
                <button
                  key={part.id} type="button"
                  ref={(n) => { zoneRefs.current[part.id] = n; }}
                  onClick={() => handleZoneTap(part.id)}
                  className={`relative overflow-hidden rounded-2xl border-4 bg-white shadow-md transition ${
                    hasAnswer ? (isCorrect ? "border-emerald-500" : "border-rose-500") : "border-skyplay hover:scale-[1.02]"
                  }`}
                >
                  <img src={part.image} alt={part[lang]} className="h-28 w-full object-cover sm:h-32" loading="lazy" />
                  <div className="absolute inset-x-1 bottom-1 rounded-xl bg-white/90 px-2 py-1 text-center leading-tight">
                    {assignedP ? (
                      <>
                        <div className="text-xs font-extrabold text-slate-700 sm:text-sm">{assignedP[lang]}</div>
                        <div className="text-[9px] font-semibold text-slate-500">{assignedP[lang === "en" ? "ms" : "en"]}</div>
                      </>
                    ) : (
                      <div className="text-xs font-bold text-slate-400 sm:text-sm">{t.dropHere}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4 rounded-3xl border-4 border-white bg-white/80 p-4 shadow-playful"
        >
          <p className="rounded-2xl bg-sunshine p-3 text-center text-base font-bold text-slate-700 sm:text-lg">{feedback}</p>
          <div className="grid grid-cols-2 gap-3">
            {wordPool.map((word) => {
              const isLocked = Object.values(assignments).includes(word.id);
              return (
                <div key={`${word.id}-${gameRound}`} className="flex justify-center">
                  <DraggableWord
                    word={word} lang={lang} disabled={isLocked}
                    isSelected={selectedWord?.id === word.id}
                    onSelect={handleWordSelect} onDropTry={handleDropTry}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-auto">
            <button
              type="button" onClick={resetGame}
              className="w-full rounded-2xl border-4 border-white bg-emerald-500 px-4 py-3 text-lg font-extrabold text-white shadow-playful transition hover:brightness-105"
            >
              {t.playAgain}
            </button>
          </div>
        </motion.aside>
      </section>

      <AnimatePresence>
        {gameFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-x-4 bottom-6 z-20 mx-auto max-w-lg rounded-3xl border-4 border-white bg-emerald-500 p-4 text-center text-white shadow-playful"
          >
            <p className="text-2xl font-extrabold">{complete ? t.matchedAll : t.matchFinished}</p>
            <p className="text-lg font-semibold">{t.finalScore}: {score}</p>
            <p className="text-lg font-semibold">{t.resultLevel}: {resultLevel}</p>
            <p className="mt-1 text-sm font-semibold sm:text-base">{resultMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Body Parts Crossword Game ────────────────────────────────────────────────
function BodyPartsCrosswordGame({ lang, playFeedbackSound }) {
  const t      = T[lang];
  const config = useMemo(() => buildCombinedCrosswordConfig(CROSSWORD_CONFIG[lang]), [lang]);

  const { cells, totalLetters, keys, letterBank } = useMemo(
    () => buildCrosswordMeta(config.words),
    [config]
  );

  const [inputs, setInputs]               = useState({});
  const [checked, setChecked]             = useState(false);
  const [feedback, setFeedback]           = useState(t.fb_cw_initial);
  const [starterLetters, setStarterLetters] = useState(
    () => createRandomStarterLetters(config.words)
  );
  const [activeCell, setActiveCell]       = useState(null);

  const editableKeys = useMemo(
    () => keys.filter((key) => !starterLetters[key]),
    [keys, starterLetters]
  );

  useEffect(() => {
    if (!editableKeys.length) { setActiveCell(null); return; }
    if (!activeCell || !editableKeys.includes(activeCell)) setActiveCell(editableKeys[0]);
  }, [activeCell, editableKeys]);

  const mergedInputs = useMemo(() => ({ ...inputs, ...starterLetters }), [inputs, starterLetters]);

  const solvedWords = useMemo(
    () =>
      config.words.filter((word) =>
        word.answer.split("").every((letter, idx) => {
          const row = word.direction === "Across" ? word.row : word.row + idx;
          const col = word.direction === "Across" ? word.col + idx : word.col;
          return (mergedInputs[`${row}-${col}`] || "") === letter;
        })
      ).length,
    [mergedInputs, config.words]
  );

  const correctLettersCount = useMemo(
    () => Object.entries(cells).filter(([key, cell]) => (mergedInputs[key] || "") === cell.letter).length,
    [mergedInputs, cells]
  );
  const crosswordScore = Math.round((correctLettersCount / totalLetters) * 100);
  const crosswordResultLevel = getResultLevel(crosswordScore, lang);
  const crosswordResultMessage = getResultMessage(crosswordScore, lang);

  const moveNext = (currentKey) => {
    const idx = editableKeys.indexOf(currentKey);
    if (idx === -1) return;
    setActiveCell(editableKeys[(idx + 1) % editableKeys.length]);
  };

  const handleInputChange = (key, value) => {
    if (starterLetters[key]) return;
    const ch = value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
    setInputs((prev) => ({ ...prev, [key]: ch }));
    setChecked(false);
    if (ch) moveNext(key);
  };

  const handleLetterPick = (letter) => {
    if (!activeCell || starterLetters[activeCell]) return;
    setInputs((prev) => ({ ...prev, [activeCell]: letter }));
    setChecked(false);
    moveNext(activeCell);
  };

  const checkAnswers = () => {
    setChecked(true);
    const total = config.words.length;
    const isSolved = solvedWords === total;
    setFeedback(isSolved ? t.fb_cw_solved : t.fb_cw_partial(solvedWords, total));
    playFeedbackSound(isSolved ? "correct" : "wrong");
  };

  const resetCrossword = () => {
    setInputs({});
    setChecked(false);
    setStarterLetters(createRandomStarterLetters(config.words));
    setFeedback(t.fb_cw_reset);
    setActiveCell(null);
  };

  const acrossWords = config.words.filter((w) => w.direction === "Across");
  const downWords   = config.words.filter((w) => w.direction === "Down");
  const secLang     = lang === "en" ? "ms" : "en";

  // Cell sizing adapts to grid size
  const cellClass = config.size <= 7
    ? "h-10 w-10 sm:h-12 sm:w-12"
    : "h-8  w-8  sm:h-10 sm:w-10";
  const textClass = config.size <= 7
    ? "text-lg font-extrabold"
    : "text-base font-extrabold";

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border-4 border-white bg-white/80 p-4 text-center shadow-playful backdrop-blur"
      >
        <h1 className="text-3xl font-extrabold text-emerald-600 sm:text-4xl">{t.crosswordTitle}</h1>
        <p className="text-base font-semibold text-slate-700 sm:text-lg">
          {t.solvedWords}: {solvedWords}/{config.words.length}&nbsp;&nbsp;|&nbsp;&nbsp;{t.correctLetters}: {correctLettersCount}/{totalLetters}
        </p>
      </motion.header>

      <section className="grid flex-1 gap-4 lg:grid-cols-[1fr_0.9fr] lg:gap-6">
        {/* Grid panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-center rounded-3xl border-4 border-white bg-white/80 p-4 shadow-playful overflow-auto"
        >
          <div
            className="grid w-fit gap-1 rounded-2xl bg-slate-200 p-2"
            style={{ gridTemplateColumns: `repeat(${config.size}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: config.size * config.size }, (_, index) => {
              const row  = Math.floor(index / config.size);
              const col  = index % config.size;
              const key  = `${row}-${col}`;
              const cell = cells[key];

              if (!cell) return <div key={key} className={`${cellClass} rounded-md bg-slate-400`} />;

              const isStarter = Boolean(starterLetters[key]);
              const value     = mergedInputs[key] || "";
              const isCorrect = value === cell.letter;
              const showWrong = checked && value && !isCorrect;
              const isActive  = activeCell === key && !isStarter;

              return (
                <label key={key} className={`relative ${cellClass}`}>
                  {cell.numbers.length > 0 && (
                    <span className="absolute left-0.5 top-0 z-10 text-[8px] font-bold text-slate-600 leading-none">
                      {cell.numbers[0]}
                    </span>
                  )}
                  <input
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    onFocus={() => { if (!isStarter) setActiveCell(key); }}
                    readOnly={isStarter}
                    maxLength={1}
                    aria-label={`Row ${row + 1} column ${col + 1}`}
                    className={`h-full w-full rounded-md border-2 text-center uppercase outline-none ${textClass} ${
                      showWrong
                        ? "border-rose-500 bg-rose-100 text-rose-700"
                        : checked && isCorrect
                          ? "border-emerald-500 bg-emerald-100 text-emerald-700"
                          : isStarter
                            ? "border-indigo-400 bg-indigo-100 text-indigo-700"
                            : isActive
                              ? "border-amber-400 bg-amber-50 text-slate-800"
                              : "border-skyplay bg-white text-slate-800"
                    }`}
                  />
                </label>
              );
            })}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4 rounded-3xl border-4 border-white bg-white/80 p-4 shadow-playful"
        >
          {/* Feedback */}
          <p className="rounded-2xl bg-sunshine p-3 text-center text-base font-bold text-slate-700 sm:text-lg">
            {feedback}
          </p>

          {/* Clues — bilingual */}
          <div className="grid gap-4 sm:grid-cols-2">
            {acrossWords.length > 0 && (
              <div>
                <h2 className="mb-2 text-base font-extrabold text-emerald-700 sm:text-lg">{t.across}</h2>
                <ul className="space-y-3 text-sm text-slate-700">
                  {acrossWords.map((word) => (
                    <li key={word.number}>
                      <span className="font-extrabold">{word.number}.</span>{" "}
                      <span className="font-semibold">{word[lang]}</span>
                      <span className="block text-xs font-normal text-slate-400 italic">{word[secLang]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {downWords.length > 0 && (
              <div>
                <h2 className="mb-2 text-base font-extrabold text-emerald-700 sm:text-lg">{t.down}</h2>
                <ul className="space-y-3 text-sm text-slate-700">
                  {downWords.map((word) => (
                    <li key={word.number}>
                      <span className="font-extrabold">{word.number}.</span>{" "}
                      <span className="font-semibold">{word[lang]}</span>
                      <span className="block text-xs font-normal text-slate-400 italic">{word[secLang]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Letter bank */}
          <div>
            <h2 className="mb-2 text-base font-extrabold text-emerald-700 sm:text-lg">{t.alphabetHelper}</h2>
            <div className="flex flex-wrap gap-2">
              {letterBank.map((letter) => (
                <button
                  key={letter} type="button"
                  onClick={() => handleLetterPick(letter)}
                  className="rounded-xl border-2 border-white bg-bubblegum px-3 py-2 text-sm font-extrabold text-white shadow-playful transition hover:brightness-105 sm:text-base"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto grid grid-cols-2 gap-3">
            <button
              type="button" onClick={checkAnswers}
              className="rounded-2xl border-4 border-white bg-emerald-500 px-4 py-3 text-base font-extrabold text-white shadow-playful transition hover:brightness-105 sm:text-lg"
            >
              {t.checkAnswers}
            </button>
            <button
              type="button" onClick={resetCrossword}
              className="rounded-2xl border-4 border-white bg-sky-500 px-4 py-3 text-base font-extrabold text-white shadow-playful transition hover:brightness-105 sm:text-lg"
            >
              {t.resetPuzzle}
            </button>
          </div>
        </motion.aside>
      </section>

      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-4 bottom-6 z-20 mx-auto max-w-lg rounded-3xl border-4 border-white bg-emerald-500 p-4 text-center text-white shadow-playful"
          >
            <p className="text-2xl font-extrabold">{t.crosswordTitle}</p>
            <p className="text-lg font-semibold">{t.finalScore}: {crosswordScore}</p>
            <p className="text-lg font-semibold">{t.resultLevel}: {crosswordResultLevel}</p>
            <p className="mt-1 text-sm font-semibold sm:text-base">{crosswordResultMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function BodyPartsMissingWordsGame({ lang, playFeedbackSound }) {
  const t = T[lang];
  const partMap = useMemo(
    () => BODY_PARTS.reduce((acc, part) => ({ ...acc, [part.id]: part }), {}),
    []
  );
  const [questions, setQuestions] = useState(() => shuffle(MISSING_WORDS_QUESTIONS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(t.fb_mw_initial);

  useEffect(() => {
    setFeedback(T[lang].fb_mw_initial);
  }, [lang]);

  const currentQuestion = questions[currentIndex];
  const completed = currentIndex >= questions.length;
  const resultLevel = getResultLevel(score, lang);
  const resultMessage = getResultMessage(score, lang);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    const distractors = shuffle(BODY_PARTS.filter((part) => part.id !== currentQuestion.id)).slice(0, 3);
    const mixed = shuffle([partMap[currentQuestion.id], ...distractors]);
    return mixed;
  }, [currentQuestion, partMap]);

  const normalizeAnswer = (value) =>
    value
      .toLowerCase()
      .replace(/[^a-z]/g, "");

  const handleOptionPick = (optionId) => {
    if (!currentQuestion || answered) return;
    setSelectedId(optionId);
    const pickedLabel = partMap[optionId][lang];
    setTypedAnswer(pickedLabel);
    setFeedback(T[lang].fb_mw_pick_hint(pickedLabel));
  };

  const checkAnswer = () => {
    if (!currentQuestion || answered) return;
    if (!typedAnswer.trim()) {
      setFeedback(t.fb_mw_type_first);
      playFeedbackSound("wrong");
      return;
    }
    const correctLabel = partMap[currentQuestion.id][lang];
    const correct = normalizeAnswer(typedAnswer) === normalizeAnswer(correctLabel);
    setAnswered(true);
    if (correct) {
      setScore((prev) => prev + 10);
      setFeedback(T[lang].fb_mw_correct(correctLabel));
      playFeedbackSound("correct");
    } else {
      setFeedback(T[lang].fb_mw_wrong(correctLabel));
      playFeedbackSound("wrong");
    }
  };

  const goNext = () => {
    if (!answered) return;
    if (currentIndex + 1 >= questions.length) {
      setCurrentIndex(questions.length);
      setTypedAnswer("");
      setSelectedId(null);
      setAnswered(false);
      setFeedback(t.mw_done);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setTypedAnswer("");
    setSelectedId(null);
    setAnswered(false);
    setFeedback(t.fb_mw_initial);
  };

  const resetGame = () => {
    setQuestions(shuffle(MISSING_WORDS_QUESTIONS));
    setCurrentIndex(0);
    setScore(0);
    setTypedAnswer("");
    setSelectedId(null);
    setAnswered(false);
    setFeedback(t.fb_mw_initial);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border-4 border-white bg-white/80 p-4 text-center shadow-playful backdrop-blur"
      >
        <h1 className="text-2xl font-extrabold text-emerald-600 sm:text-4xl">{t.missingWordsTitle}</h1>
        <p className="text-lg font-semibold text-slate-700">{t.score}: {score}</p>
      </motion.header>

      <section className="grid flex-1 gap-4 lg:grid-cols-[1fr_0.9fr] lg:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border-4 border-white bg-white/80 p-4 shadow-playful"
        >
          {!completed && currentQuestion ? (
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-600 sm:text-base">
                {t.question}: {currentIndex + 1}/{questions.length}
              </p>
              <img
                src={partMap[currentQuestion.id].image}
                alt={partMap[currentQuestion.id][lang]}
                className="h-56 w-full rounded-2xl border-4 border-skyplay object-cover sm:h-72"
                loading="lazy"
              />
              <p className="rounded-2xl bg-sunshine p-4 text-lg font-extrabold text-slate-700 sm:text-2xl">
                {currentQuestion[lang]}
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center rounded-2xl bg-emerald-100 p-6 text-center">
              <div>
                <p className="text-2xl font-extrabold text-emerald-700">{t.mw_done}</p>
                <p className="mt-2 text-lg font-semibold text-slate-700">{t.finalScore}: {score}</p>
                <p className="mt-1 text-lg font-semibold text-slate-700">{t.resultLevel}: {resultLevel}</p>
                <p className="mt-1 text-sm font-semibold text-slate-700 sm:text-base">{resultMessage}</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4 rounded-3xl border-4 border-white bg-white/80 p-4 shadow-playful"
        >
          <p className="rounded-2xl bg-sunshine p-3 text-center text-base font-bold text-slate-700 sm:text-lg">
            {feedback}
          </p>

          {!completed && currentQuestion && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t.typeAnswer}</label>
                <input
                  type="text"
                  value={typedAnswer}
                  onChange={(e) => {
                    setTypedAnswer(e.target.value);
                    setSelectedId(null);
                    if (answered) setAnswered(false);
                  }}
                  disabled={answered}
                  className="w-full rounded-2xl border-4 border-skyplay bg-white px-4 py-3 text-base font-bold text-slate-700 outline-none focus:border-emerald-400 sm:text-lg"
                />
              </div>

              <p className="text-sm font-bold text-slate-600">{t.pickHint}</p>
              <div className="grid grid-cols-1 gap-3">
                {options.map((option) => {
                  const isPicked = selectedId === option.id;
                  const isCorrectAnswer = option.id === currentQuestion.id;
                  const showCorrect = answered && isCorrectAnswer;
                  const showWrong = answered && isPicked && !isCorrectAnswer;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleOptionPick(option.id)}
                      disabled={answered}
                      className={`rounded-2xl border-4 px-4 py-3 text-left text-base font-extrabold shadow-playful transition sm:text-lg ${
                        showCorrect
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : showWrong
                            ? "border-rose-500 bg-rose-500 text-white"
                            : isPicked
                              ? "border-amber-300 bg-amber-400 text-white"
                              : "border-white bg-bubblegum text-white hover:brightness-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      {option[lang]}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {!completed && (
            <div className="mt-auto grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={checkAnswer}
                disabled={answered}
                className={`rounded-2xl border-4 border-white px-4 py-3 text-base font-extrabold text-white shadow-playful transition sm:text-lg ${
                  answered ? "bg-slate-400" : "bg-emerald-500 hover:brightness-105"
                }`}
              >
                {t.checkMissingWord}
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!answered}
                className={`rounded-2xl border-4 border-white px-4 py-3 text-base font-extrabold text-white shadow-playful transition sm:text-lg ${
                  !answered ? "bg-slate-400" : "bg-emerald-500 hover:brightness-105"
                }`}
              >
                {t.nextQuestion}
              </button>
            </div>
          )}

          {completed && (
            <div className="mt-auto grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={resetGame}
                className="rounded-2xl border-4 border-white bg-emerald-500 px-4 py-3 text-base font-extrabold text-white shadow-playful transition hover:brightness-105 sm:text-lg"
              >
                {t.restartQuiz}
              </button>
              <button
                type="button"
                onClick={resetGame}
                className="rounded-2xl border-4 border-white bg-sky-500 px-4 py-3 text-base font-extrabold text-white shadow-playful transition hover:brightness-105 sm:text-lg"
              >
                {t.playAgain}
              </button>
            </div>
          )}

          {!completed && (
            <button
              type="button"
              onClick={resetGame}
              className="rounded-2xl border-4 border-white bg-sky-500 px-4 py-3 text-base font-extrabold text-white shadow-playful transition hover:brightness-105 sm:text-lg"
            >
              {t.playAgain}
            </button>
          )}
        </motion.aside>
      </section>

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-4 bottom-6 z-20 mx-auto max-w-lg rounded-3xl border-4 border-white bg-emerald-500 p-4 text-center text-white shadow-playful"
          >
            <p className="text-2xl font-extrabold">{t.mw_done}</p>
            <p className="text-lg font-semibold">{t.finalScore}: {score}</p>
            <p className="text-lg font-semibold">{t.resultLevel}: {resultLevel}</p>
            <p className="mt-1 text-sm font-semibold sm:text-base">{resultMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeGame, setActiveGame]   = useState("match");
  const [hasStarted, setHasStarted]   = useState(false);
  const [lang, setLang]               = useState("en");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const backgroundAudioRef            = useRef(null);
  const playFeedbackSound             = useFeedbackSound();
  const t = T[lang];

  useEffect(() => {
    const audio = new Audio("/audio/background-music.mpeg");
    audio.loop = true;
    audio.preload = "auto";
    audio.autoplay = true;
    audio.volume = 0.1;
    audio.playbackRate = 1;
    backgroundAudioRef.current = audio;

    let unlockCleanup = () => {};

    const tryPlay = () => {
      if (!audio.paused) return;

      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => unlockCleanup())
          .catch(() => {
            // Browsers can block audible autoplay until the first user gesture.
          });
      }
    };

    const unlockAudio = () => {
      tryPlay();
    };

    const unlockEvents = ["pointerdown", "touchstart", "keydown", "click"];
    unlockEvents.forEach((eventName) => {
      window.addEventListener(eventName, unlockAudio, { once: true, passive: true });
    });

    unlockCleanup = () => {
      unlockEvents.forEach((eventName) => {
        window.removeEventListener(eventName, unlockAudio);
      });
    };

    tryPlay();

    return () => {
      unlockCleanup();
      audio.pause();
      audio.currentTime = 0;
      backgroundAudioRef.current = null;
    };
  }, []);

  const toggleLang = () => setLang((prev) => (prev === "en" ? "ms" : "en"));

  const toggleAudio = () => {
    const audio = backgroundAudioRef.current;
    if (!audio) return;

    if (isAudioMuted) {
      audio.play().catch(() => {});
      setIsAudioMuted(false);
      return;
    }

    audio.pause();
    setIsAudioMuted(true);
  };

  const handleStartGame = () => {
    const audio = backgroundAudioRef.current;
    if (audio && !isAudioMuted) {
      audio.play().catch(() => {});
    }
    setHasStarted(true);
  };

  const audioToggle = (
    <div className="absolute top-4 left-4 z-50 sm:top-6 sm:left-6">
      <button
        type="button"
        onClick={toggleAudio}
        className="flex items-center justify-center gap-2 rounded-2xl border-4 border-white bg-white/90 px-3 py-2 shadow-playful transition hover:opacity-80 active:scale-95 backdrop-blur"
        aria-label={isAudioMuted ? "Play background music" : "Mute background music"}
      >
        <span className="text-lg leading-none">{isAudioMuted ? "🔇" : "🔊"}</span>
        <span className="text-sm font-extrabold text-slate-700 sm:text-base">
          {isAudioMuted ? "Play" : "Mute"}
        </span>
      </button>
    </div>
  );

  const languageToggle = (
    <div className="absolute top-4 right-4 z-50 sm:top-6 sm:right-6">
      <button
        type="button" onClick={toggleLang}
        className="flex items-center justify-center gap-2 rounded-2xl border-4 border-white bg-white/90 px-3 py-2 shadow-playful transition hover:opacity-80 active:scale-95 backdrop-blur"
        aria-label="Toggle language"
      >
        <span className={`text-sm font-extrabold transition sm:text-base ${lang === "en" ? "text-slate-700" : "text-slate-300"}`}>EN</span>
        
        <div className="flex h-8 w-[64px] shrink-0 items-center rounded-full bg-slate-200 shadow-[inset_0_3px_6px_rgba(0,0,0,0.15)] p-1">
          <motion.div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.2)]"
            animate={{ x: lang === "ms" ? 32 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <span className="text-[12px] leading-none">{lang === "en" ? "🇬🇧" : "🇲🇾"}</span>
          </motion.div>
        </div>
        
        <span className={`text-sm font-extrabold transition sm:text-base ${lang === "ms" ? "text-slate-700" : "text-slate-300"}`}>BM</span>
      </button>
    </div>
  );

  if (!hasStarted) {
    return (
      <main
        className="relative flex min-h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden p-4 sm:p-6"
        style={{
          backgroundImage: "url('/wallpapers/start-wallpaper.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
        
        {audioToggle}
        {languageToggle}

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-5xl p-6 text-center sm:p-10"
        >
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">{t.startTitle}</h1>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleStartGame}
              className="w-full rounded-full bg-emerald-500 px-8 py-4 text-lg font-extrabold text-white shadow-playful transition hover:scale-[1.01] hover:brightness-105"
            >
              {t.startButton}
            </button>
          </div>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4 pt-20 sm:gap-6 sm:p-6 sm:pt-24">
      {audioToggle}
      {languageToggle}

      {/* ── Navigation ── */}
      <div className="grid grid-cols-1 gap-3 rounded-3xl border-4 border-white bg-white/80 p-3 shadow-playful sm:grid-cols-3">
        <button
          type="button" onClick={() => setActiveGame("match")}
          className={`rounded-2xl px-4 py-3 text-sm font-extrabold transition sm:text-base ${
            activeGame === "match" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700"
          }`}
        >
          {t.bodyPartsMatch}
        </button>
        <button
          type="button" onClick={() => setActiveGame("crossword")}
          className={`rounded-2xl px-4 py-3 text-sm font-extrabold transition sm:text-base ${
            activeGame === "crossword" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700"
          }`}
        >
          {t.bodyPartsCrossword}
        </button>
        <button
          type="button" onClick={() => setActiveGame("missingWords")}
          className={`rounded-2xl px-4 py-3 text-sm font-extrabold transition sm:text-base ${
            activeGame === "missingWords" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700"
          }`}
        >
          {t.bodyPartsMissingWords}
        </button>
      </div>

      {/* ── Active Game ── */}
      {activeGame === "match" && (
        <BodyPartsGame key={`match-${lang}`} lang={lang} playFeedbackSound={playFeedbackSound} />
      )}
      {activeGame === "crossword" && (
        <BodyPartsCrosswordGame key={`crossword-${lang}`} lang={lang} playFeedbackSound={playFeedbackSound} />
      )}
      {activeGame === "missingWords" && (
        <BodyPartsMissingWordsGame key={`missing-${lang}`} lang={lang} playFeedbackSound={playFeedbackSound} />
      )}
    </main>
  );
}
