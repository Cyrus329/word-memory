const STORAGE_KEY = "word-memory-trainer:v1";
const SETTINGS_KEY = "word-memory-trainer:settings:v1";
const STUDY_TIME_KEY = "word-memory-trainer:study-time:v1";
const REVIEW_STEPS = [
  { label: "20分钟", ms: 20 * 60 * 1000 },
  { label: "1小时", ms: 60 * 60 * 1000 },
  { label: "9小时", ms: 9 * 60 * 60 * 1000 },
  { label: "1天", ms: 24 * 60 * 60 * 1000 },
  { label: "2天", ms: 2 * 24 * 60 * 60 * 1000 },
  { label: "6天", ms: 6 * 24 * 60 * 60 * 1000 },
  { label: "31天", ms: 31 * 24 * 60 * 60 * 1000 },
];
const PROGRESS_MODES = [
  "card", "threeStep", "enToZh", "zhToEn", "choiceZhToEn", "phrase", "spell", "dictation", "forms",
  "plainList", "multiMeaning", "rareMeaning", "fixedPhrase", "spellingWeak", "dictationWeak"
];
const PROGRESS_MODE_LABELS = {
  card: "卡片",
  threeStep: "三步背诵",
  enToZh: "英译中",
  zhToEn: "中译英",
  choiceZhToEn: "中文选英文",
  phrase: "搭配填空",
  spell: "拼写",
  dictation: "听写",
  forms: "变形",
  plainList: "纯文字速刷",
  multiMeaning: "一词多义",
  rareMeaning: "熟词僻义",
  fixedPhrase: "固定搭配",
  spellingWeak: "拼写易错",
  dictationWeak: "听写错词",
};
const MODE_PROGRESS_HINT = "各模式独立进度；旧模式仍保留，新增模式只追加不删除";
const WORD_SOURCES = ["全方位", "Word List", "四级", "蓝色森林", "听写内容"];
const LIST_MASK_MODES = ["show", "hideEnglish", "hideChinese"];
const CLOUD_CONFIG_KEY = "word-memory-trainer:cloud-config:v1";
const SHARE_BASE_URL_KEY = "word-memory-trainer:share-base-url:v1";
const SUPABASE_SETTINGS_KEY = "word-memory-trainer:supabase-settings:v1";
const CLOUD_REQUEST_TIMEOUT_MS = 12000;
const DEFAULT_SUPABASE_URL = "https://fsizdxkwrxzopkoouipr.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_BfWyJfb6c4GrV0JYLXejUg_QnkuhPvw";
const DEFAULT_SHARE_BASE_URL = "https://your-name.github.io/word-memory/";
const CLOUD_URL_PARAMS = typeof URLSearchParams !== "undefined"
  ? new URLSearchParams(window.location?.search || "")
  : { get: () => "" };
const PUBLIC_VIEWER_SLUG = normalizeCloudSlug(CLOUD_URL_PARAMS.get("public") || "");
const EDITOR_VIEW_SLUG = normalizeCloudSlug(CLOUD_URL_PARAMS.get("edit") || "");
let suppressCloudSync = false;
let cloudSyncTimer = null;
let lastSpeechKey = "";
let lastSpeechAt = 0;
let activeAudioElement = null;
const CLOUD_STUDY_TIME_META_ID = "__word_memory_study_time_meta__";
const CLOUD_COMPACT_PAYLOAD_ID = "__word_memory_compact_payload__";

const BUILTIN_PACKAGE_KEY = "word-memory-trainer:dictation-repair-20260722:v68";
const FORCE_SEPARATE_BUILTIN_ID_PREFIXES = ["dictation-1-", "dictation-2-"]; // 第一次听写内容按要求保留重复词条为独立记录。

const BUILTIN_GROUP_ALIASES = {
  "四级 7": new Set(["stale", "fashion", "fashionable", "contemporary", "temple", "temporary", "temporarily", "abundant", "abundance", "ample", "mass", "massive", "massage", "numerous", "number", "multiply", "multiple", "multiplication", "gang", "band", "bandage", "sort", "resort", "flock", "crowd", "crowded", "dozen", "population", "populous", "populate", "popularity", "popular", "prevail", "prevalent", "prevalence", "available", "availability", "crew", "screw", "colleague", "personnel", "staff", "stuff", "stuffy", "stuffing", "infant", "adolescent", "idle", "idly", "youngster"]),
};

function builtinGroupAliasesForTerm(term = "") {
  const key = normalizeText(term).toLowerCase();
  return Object.entries(BUILTIN_GROUP_ALIASES)
    .filter(([, terms]) => terms.has(key))
    .map(([group]) => group);
}
const BUILTIN_WORDS = Array.isArray(window.WORD_MEMORY_WORDS) ? window.WORD_MEMORY_WORDS : [];
const ALL_BUILTIN_WORDS = BUILTIN_WORDS;
const BUILTIN_ID_ALIASES = (window.WORD_MEMORY_ID_ALIASES && typeof window.WORD_MEMORY_ID_ALIASES === "object") ? window.WORD_MEMORY_ID_ALIASES : {};
let shouldPersistBuiltinWords = false;

const els = {
  totalCount: document.querySelector("#totalCount"),
  totalStudyTime: document.querySelector("#totalStudyTime"),
  todayStudyTime: document.querySelector("#todayStudyTime"),
  dueCount: document.querySelector("#dueCount"),
  todayCount: document.querySelector("#todayCount"),
  doneTodayCount: document.querySelector("#doneTodayCount"),
  examDays: document.querySelector("#examDays"),
  examDateInput: document.querySelector("#examDateInput"),
  todayNewTarget: document.querySelector("#todayNewTarget"),
  todayReviewTarget: document.querySelector("#todayReviewTarget"),
  todayNewHint: document.querySelector("#todayNewHint"),
  todayReviewHint: document.querySelector("#todayReviewHint"),
  importantCount: document.querySelector("#importantCount"),
  estimateMinutes: document.querySelector("#estimateMinutes"),
  clockNow: document.querySelector("#clockNow"),
  sprintStatus: document.querySelector("#sprintStatus"),
  dailyReport: document.querySelector("#dailyReport"),
  activeCard: document.querySelector("#activeCard"),
  todayTimeline: document.querySelector("#todayTimeline"),
  groupProgress: document.querySelector("#groupProgress"),
  wordList: document.querySelector("#wordList"),
  wordForm: document.querySelector("#wordForm"),
  termInput: document.querySelector("#termInput"),
  meaningInput: document.querySelector("#meaningInput"),
  phraseInput: document.querySelector("#phraseInput"),
  tagInput: document.querySelector("#tagInput"),
  sourceInput: document.querySelector("#sourceInput"),
  thirdPersonInput: document.querySelector("#thirdPersonInput"),
  pastTenseInput: document.querySelector("#pastTenseInput"),
  pastParticipleInput: document.querySelector("#pastParticipleInput"),
  noteInput: document.querySelector("#noteInput"),
  clearFormButton: document.querySelector("#clearFormButton"),
  bulkInput: document.querySelector("#bulkInput"),
  bulkAddButton: document.querySelector("#bulkAddButton"),
  clearBulkButton: document.querySelector("#clearBulkButton"),
  searchInput: document.querySelector("#searchInput"),
  statusFilter: document.querySelector("#statusFilter"),
  librarySourceFilter: document.querySelector("#librarySourceFilter"),
  listMaskMode: document.querySelector("#listMaskMode"),
  bulkSourceInput: document.querySelector("#bulkSourceInput"),
  importButton: document.querySelector("#importButton"),
  exportButton: document.querySelector("#exportButton"),
  importInput: document.querySelector("#importInput"),
  startNewButton: document.querySelector("#startNewButton"),
  batchLearnButton: document.querySelector("#batchLearnButton"),
  sprintButton: document.querySelector("#sprintButton"),
  gazeControlButton: document.querySelector("#gazeControlButton"),
  gazePanel: document.querySelector("#gazePanel"),
  gazeStatus: document.querySelector("#gazeStatus"),
  gazeGuide: document.querySelector("#gazeGuide"),
  gazeStopButton: document.querySelector("#gazeStopButton"),
  cloudSyncButton: document.querySelector("#cloudSyncButton"),
  focusDueButton: document.querySelector("#focusDueButton"),
  weakOnlyButton: document.querySelector("#weakOnlyButton"),
  dictationOrderSelect: document.querySelector("#dictationOrderSelect"),
  copyPlanButton: document.querySelector("#copyPlanButton"),
  dueModeButton: document.querySelector("#dueModeButton"),
  newModeButton: document.querySelector("#newModeButton"),
  allModeButton: document.querySelector("#allModeButton"),
  readonlyBanner: document.querySelector("#readonlyBanner"),
  cloudDialog: document.querySelector("#cloudDialog"),
  cloudForm: document.querySelector("#cloudForm"),
  closeCloudButton: document.querySelector("#closeCloudButton"),
  cancelCloudButton: document.querySelector("#cancelCloudButton"),
  loadCloudButton: document.querySelector("#loadCloudButton"),
  tryCloudSaveButton: document.querySelector("#tryCloudSaveButton"),
  localSaveButton: document.querySelector("#localSaveButton"),
  copyPublicLinkButton: document.querySelector("#copyPublicLinkButton"),
  copyEditLinkButton: document.querySelector("#copyEditLinkButton"),
  cloudSlugInput: document.querySelector("#cloudSlugInput"),
  cloudNameInput: document.querySelector("#cloudNameInput"),
  cloudPinInput: document.querySelector("#cloudPinInput"),
  cloudPublicInput: document.querySelector("#cloudPublicInput"),
  supabaseUrlInput: document.querySelector("#supabaseUrlInput"),
  supabaseKeyInput: document.querySelector("#supabaseKeyInput"),
  shareBaseUrlInput: document.querySelector("#shareBaseUrlInput"),
  cloudStatus: document.querySelector("#cloudStatus"),
  toast: document.querySelector("#toast"),
};

function createPracticeSessions(initialMode = "due") {
  return PROGRESS_MODES.reduce((sessions, mode) => {
    sessions[mode] = {
      mode: initialMode,
      activeId: null,
    };
    return sessions;
  }, {});
}

const state = {
  words: loadWords(),
  settings: loadSettings(),
  studyTime: loadStudyTime(),
  mode: "due",
  practiceMode: "card",
  practiceSessions: createPracticeSessions(),
  dictationOrder: "due",
  activeGroup: "all",
  sprint: {
    active: false,
    startedAt: "",
    endsAt: "",
    completed: 0,
  },
  activeId: null,
  answerVisible: false,
  spellingDraft: "",
  spellingResult: null,
  formDrafts: {
    third: "",
    past: "",
    participle: "",
  },
  formResult: null,
  revealStep: 0,
  choiceResult: null,
  lastAutoSpokenId: null,
  gazeControl: {
    enabled: false,
    starting: false,
    mode: "",
    lastZone: "center",
    lastTargetKey: "",
    zoneStartedAt: 0,
    cooldownUntil: 0,
    dwellMs: 2400,
    safeDwellMs: 2000,
    confirmDwellMs: 1600,
    pendingTargetKey: "",
    pendingTargetLabel: "",
    pendingUntil: 0,
    fallbackStream: null,
    fallbackVideo: null,
    fallbackCanvas: null,
    fallbackTimer: null,
    fallbackBaseline: null,
    fallbackSamples: [],
  },
  fingerControl: {
    enabled: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startedAt: 0,
    pendingAction: "",
    pendingLabel: "",
    pendingUntil: 0,
  },
  reviewUndo: null,
  query: "",
  filter: "all",
  librarySourceFilter: "all",
  listMaskMode: "show",
  wordListLimit: 40,
  cloud: {
    config: loadCloudConfig(),
    canEdit: !PUBLIC_VIEWER_SLUG && !EDITOR_VIEW_SLUG,
  },
};

function ensurePracticeSession(mode = state.practiceMode) {
  if (!state.practiceSessions || typeof state.practiceSessions !== "object") {
    state.practiceSessions = createPracticeSessions(state.mode || "due");
  }
  if (!state.practiceSessions[mode]) {
    state.practiceSessions[mode] = {
      mode: state.mode || "due",
      activeId: null,
    };
  }
  return state.practiceSessions[mode];
}

function savePracticeSession() {
  const session = ensurePracticeSession();
  session.mode = state.mode;
  session.activeId = state.activeId;
}

function restorePracticeSession(mode, fallbackMode = state.mode) {
  const session = ensurePracticeSession(mode);
  state.mode = session.mode || fallbackMode || "due";
  state.activeId = session.activeId || null;
}

function setActiveId(id) {
  state.activeId = id || null;
  ensurePracticeSession().activeId = state.activeId;
}

function setStudyMode(mode) {
  state.mode = mode;
  const session = ensurePracticeSession();
  session.mode = mode;
  session.activeId = null;
  state.activeId = null;
}

function switchPracticeMode(mode) {
  if (!PROGRESS_MODES.includes(mode) || mode === state.practiceMode) {
    return;
  }
  savePracticeSession();
  state.practiceMode = mode;
  restorePracticeSession(mode, state.mode);
  state.answerVisible = false;
  resetTypingState();
  state.lastAutoSpokenId = null;
  render();
}

function createId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `word-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowDate() {
  return new Date();
}

function todayKey(date = nowDate()) {
  return date.toISOString().slice(0, 10);
}

function dateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultExamDate() {
  const now = nowDate();
  const currentYearExam = new Date(now.getFullYear(), 3, 18);
  const exam = currentYearExam >= now ? currentYearExam : new Date(now.getFullYear() + 1, 3, 18);
  return dateInputValue(exam);
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeWordSource(value) {
  const source = normalizeText(value);
  return WORD_SOURCES.includes(source) ? source : "全方位";
}

function normalizeWordSources(word = {}) {
  const rawSources = [
    ...(Array.isArray(word.sources) ? word.sources : []),
    word.source,
    word.category,
    word.book,
  ].filter(Boolean);
  const sources = [...new Set(rawSources.map(normalizeWordSource))];
  return sources.length ? sources : ["全方位"];
}

function wordSources(word) {
  const sources = normalizeWordSources(word);
  word.sources = sources;
  word.source = sources[0];
  return sources;
}

function mergeWordSources(existing, incoming) {
  return [...new Set([
    ...normalizeWordSources(existing),
    ...normalizeWordSources(incoming),
  ])];
}

function sourceOptionsHTML(selected = "全方位", includeAll = false) {
  const options = includeAll ? [{ value: "all", label: "全部分类" }] : [];
  WORD_SOURCES.forEach((source) => options.push({ value: source, label: source }));
  return options.map((option) => `
    <option value="${escapeHTML(option.value)}"${option.value === selected ? " selected" : ""}>${escapeHTML(option.label)}</option>`).join("");
}

function maskedText(value, type) {
  const text = normalizeText(value);
  if (type === "english" && state.listMaskMode === "hideEnglish") {
    return `<span class="masked-value">英文已遮住</span>`;
  }
  if (type === "chinese" && state.listMaskMode === "hideChinese") {
    return `<span class="masked-value">中文已遮住</span>`;
  }
  return escapeHTML(text);
}

function renderLibrarySourceFilters() {
  if (els.sourceInput && !els.sourceInput.dataset.ready) {
    els.sourceInput.innerHTML = sourceOptionsHTML("全方位");
    els.sourceInput.dataset.ready = "1";
  }
  if (els.bulkSourceInput && !els.bulkSourceInput.dataset.ready) {
    els.bulkSourceInput.innerHTML = sourceOptionsHTML("全方位");
    els.bulkSourceInput.dataset.ready = "1";
  }
  if (els.librarySourceFilter && !els.librarySourceFilter.dataset.ready) {
    els.librarySourceFilter.innerHTML = sourceOptionsHTML(state.librarySourceFilter, true);
    els.librarySourceFilter.dataset.ready = "1";
  }
  if (els.librarySourceFilter && els.librarySourceFilter.value !== state.librarySourceFilter) {
    els.librarySourceFilter.value = state.librarySourceFilter;
  }
  if (els.listMaskMode && els.listMaskMode.value !== state.listMaskMode) {
    els.listMaskMode.value = state.listMaskMode;
  }
}

function mergeStudyText(current, incoming) {
  const currentText = normalizeText(current);
  const incomingText = normalizeText(incoming);
  if (!incomingText) {
    return currentText;
  }
  if (!currentText) {
    return incomingText;
  }
  return incomingText
    .split(/[；;]/)
    .map(normalizeText)
    .filter(Boolean)
    .reduce((merged, item) => (merged.includes(item) ? merged : `${merged}；${item}`), currentText);
}

function normalizeSpelling(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9'\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isSpellingCorrect(input, word) {
  return normalizeSpelling(input) === normalizeSpelling(word.term);
}

const IRREGULAR_VERB_FORMS = {
  be: { third: "is", past: "was", participle: "been" },
  have: { third: "has", past: "had", participle: "had" },
  do: { third: "does", past: "did", participle: "done" },
  go: { third: "goes", past: "went", participle: "gone" },
  buy: { past: "bought", participle: "bought" },
  sell: { past: "sold", participle: "sold" },
  take: { past: "took", participle: "taken" },
  know: { past: "knew", participle: "known" },
  see: { past: "saw", participle: "seen" },
  feel: { past: "felt", participle: "felt" },
  hear: { past: "heard", participle: "heard" },
  speak: { past: "spoke", participle: "spoken" },
  tell: { past: "told", participle: "told" },
  read: { past: "read", participle: "read" },
  say: { third: "says", past: "said", participle: "said" },
  give: { past: "gave", participle: "given" },
  make: { past: "made", participle: "made" },
  write: { past: "wrote", participle: "written" },
  come: { past: "came", participle: "come" },
  run: { past: "ran", participle: "run" },
  eat: { past: "ate", participle: "eaten" },
  drink: { past: "drank", participle: "drunk" },
  begin: { past: "began", participle: "begun" },
  swim: { past: "swam", participle: "swum" },
  lend: { past: "lent", participle: "lent" },
  spend: { past: "spent", participle: "spent" },
  cost: { past: "cost", participle: "cost" },
  pay: { third: "pays", past: "paid", participle: "paid" },
  bring: { past: "brought", participle: "brought" },
  think: { past: "thought", participle: "thought" },
  teach: { past: "taught", participle: "taught" },
  catch: { past: "caught", participle: "caught" },
  keep: { past: "kept", participle: "kept" },
  sleep: { past: "slept", participle: "slept" },
  leave: { past: "left", participle: "left" },
  meet: { past: "met", participle: "met" },
  get: { past: "got", participle: "gotten" },
  forget: { past: "forgot", participle: "forgotten" },
  understand: { past: "understood", participle: "understood" },
  stand: { past: "stood", participle: "stood" },
  choose: { past: "chose", participle: "chosen" },
  break: { past: "broke", participle: "broken" },
  drive: { past: "drove", participle: "driven" },
  ride: { past: "rode", participle: "ridden" },
  build: { past: "built", participle: "built" },
  send: { past: "sent", participle: "sent" },
  sit: { past: "sat", participle: "sat" },
  cut: { past: "cut", participle: "cut" },
  put: { past: "put", participle: "put" },
  let: { past: "let", participle: "let" },
};

function emptyVerbForms() {
  return { third: "", past: "", participle: "" };
}

function canInferVerbForms(term) {
  return /^[a-z]+$/i.test(normalizeText(term));
}

function thirdPersonForm(base) {
  if (/(ch|sh|s|x|z|o)$/i.test(base)) {
    return `${base}es`;
  }
  if (/[^aeiou]y$/i.test(base)) {
    return `${base.slice(0, -1)}ies`;
  }
  return `${base}s`;
}

function regularPastForm(base) {
  if (/e$/i.test(base)) {
    return `${base}d`;
  }
  if (/[^aeiou]y$/i.test(base)) {
    return `${base.slice(0, -1)}ied`;
  }
  if (/[^aeiou][aeiou][^aeiouwxy]$/i.test(base) && base.length <= 6) {
    return `${base}${base.slice(-1)}ed`;
  }
  return `${base}ed`;
}

function inferVerbForms(term) {
  const base = normalizeText(term).toLowerCase();
  if (!canInferVerbForms(base)) {
    return emptyVerbForms();
  }
  const irregular = IRREGULAR_VERB_FORMS[base] || {};
  const past = irregular.past || regularPastForm(base);
  return {
    third: irregular.third || thirdPersonForm(base),
    past,
    participle: irregular.participle || past,
  };
}

function verbForms(word) {
  const inferred = inferVerbForms(word.term);
  const saved = word.forms || {};
  return {
    third: normalizeText(saved.third || saved.thirdPerson || word.thirdPerson || inferred.third),
    past: normalizeText(saved.past || saved.pastTense || word.pastTense || inferred.past),
    participle: normalizeText(saved.participle || saved.pastParticiple || word.pastParticiple || inferred.participle),
  };
}

function hasVerbForms(word) {
  const forms = verbForms(word);
  return Boolean(forms.third || forms.past || forms.participle);
}

function isVerbFormsCorrect(drafts, word) {
  const forms = verbForms(word);
  const keys = ["third", "past", "participle"].filter((key) => forms[key]);
  return keys.length > 0 && keys.every((key) => normalizeSpelling(drafts[key]) === normalizeSpelling(forms[key]));
}

function verbFormsAnswerText(word) {
  const forms = verbForms(word);
  return `三单：${forms.third || "-"}  过去式：${forms.past || "-"}  过去分词：${forms.participle || "-"}`;
}

function speechSupported() {
  return Boolean(
    typeof window !== "undefined" &&
    window.speechSynthesis &&
    window.SpeechSynthesisUtterance
  );
}

function cleanPronunciationText(term) {
  const raw = normalizeText(term)
    .replace(/（[^）]*）/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[：:：].*$/g, " ")
    .replace(/\b(sth|sb)\.?\b/gi, "")
    .replace(/\+/g, " ")
    .replace(/…|\.\.\./g, " ")
    .replace(/[^a-zA-Z'\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return raw || normalizeText(term).replace(/[^a-zA-Z'\-\s]/g, " ").replace(/\s+/g, " ").trim();
}

function isMobilePronunciationContext() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const touchMac = platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod|Android|Mobile|Mobi/i.test(ua) || touchMac;
}

function primeSpeechVoices() {
  if (!speechSupported()) return;
  try {
    window.speechSynthesis.getVoices?.();
  } catch (err) {
    // 忽略语音列表预热失败
  }
}

function stopCurrentPronunciation() {
  try {
    if (activeAudioElement) {
      activeAudioElement.pause();
      activeAudioElement.src = "";
      activeAudioElement.load?.();
    }
  } catch {
    // 忽略停止在线音频失败
  }
  activeAudioElement = null;
  try {
    if (speechSupported()) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // 忽略停止系统朗读失败
  }
}

function useSpeechFallback(text, accent = "us", options = {}) {
  if (!speechSupported()) {
    if (!options.silent) {
      showToast("当前浏览器不支持自动读音");
    }
    return false;
  }
  const normalized = normalizeText(text);
  const speechKey = `${accent}:${normalized.toLowerCase()}`;
  const now = Date.now();
  if (speechKey === lastSpeechKey && now - lastSpeechAt < 550) {
    return true;
  }
  lastSpeechKey = speechKey;
  lastSpeechAt = now;
  stopCurrentPronunciation();
  const utterance = new window.SpeechSynthesisUtterance(normalized);
  utterance.lang = accent === "uk" ? "en-GB" : "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  const voices = window.speechSynthesis.getVoices?.() || [];
  const preferred = voices.find((v) => v.lang === utterance.lang && /Google|Microsoft|Natural|Daniel|Samantha|Alex|Serena/i.test(v.name))
    || voices.find((v) => v.lang === utterance.lang)
    || voices.find((v) => /^en[-_]/i.test(v.lang));
  if (preferred) {
    utterance.voice = preferred;
  }
  utterance.onerror = () => {
    if (!options.silent) {
      showToast("读音被浏览器拦截，重新点一次即可");
    }
  };
  try {
    window.speechSynthesis.speak(utterance);
    window.setTimeout(() => {
      try { window.speechSynthesis.resume?.(); } catch {}
    }, 80);
    return true;
  } catch {
    if (!options.silent) {
      showToast("当前浏览器读音失败");
    }
    return false;
  }
}

function pronunciationAudioUrls(text, accent = "us") {
  const q = encodeURIComponent(text.toLowerCase());
  const type = accent === "uk" ? 1 : 2;
  const dashed = text.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-+|-+$/g, "");
  const urls = [];
  if (q) {
    // 在线词典标准音频优先；失败后自动走浏览器英/美音兜底。
    urls.push(`https://dict.youdao.com/dictvoice?type=${type}&audio=${q}`);
  }
  if (dashed && !dashed.includes("-")) {
    urls.push(`https://ssl.gstatic.com/dictionary/static/sounds/oxford/${dashed}--_${accent === "uk" ? "gb" : "us"}_1.mp3`);
  }
  return urls;
}

function playAudioUrl(url) {
  return new Promise((resolve, reject) => {
    stopCurrentPronunciation();
    const audio = new Audio();
    activeAudioElement = audio;
    audio.preload = "auto";
    audio.src = url;
    let settled = false;
    const cleanup = () => {
      if (activeAudioElement === audio) activeAudioElement = null;
      audio.oncanplay = null;
      audio.onerror = null;
      audio.onended = null;
    };
    const finish = (ok, err) => {
      if (settled) return;
      settled = true;
      cleanup();
      ok ? resolve(true) : reject(err || new Error("audio failed"));
    };
    audio.oncanplay = () => {
      audio.play().then(() => finish(true)).catch((err) => finish(false, err));
    };
    audio.onerror = () => finish(false, new Error("audio failed"));
    try {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(() => finish(true)).catch(() => {
          try { audio.load(); } catch (err) { finish(false, err); }
        });
      } else {
        audio.load();
      }
    } catch (err) {
      try { audio.load(); } catch (loadErr) { finish(false, loadErr); }
    }
    window.setTimeout(() => finish(false, new Error("audio timeout")), 2800);
  });
}

async function speakTerm(term, options = {}) {
  const text = cleanPronunciationText(term);
  const accent = options.accent === "uk" ? "uk" : "us";
  if (!text) {
    if (!options.silent) showToast("这个词条没有可朗读的英文");
    return false;
  }

  // v45：读音改为优先使用浏览器/手机系统语音，避免在线音频请求等待、连点排队、一次性爆音。
  // 每次播放前都会停止上一次读音；550ms 内重复点击同一个词会直接忽略。
  return useSpeechFallback(text, accent, options);
}

if (typeof window !== "undefined") {
  window.speakTerm = speakTerm;
  window.addEventListener("DOMContentLoaded", primeSpeechVoices, { once: true });
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function loadSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return {
      examDate: parsed.examDate || defaultExamDate(),
    };
  } catch {
    return { examDate: defaultExamDate() };
  }
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  } catch {
    showToast("设置保存失败");
  }
}

function normalizeStudyTime(raw = {}) {
  const today = todayKey();
  const totalSeconds = Math.max(0, Math.floor(Number(raw.totalSeconds || 0)));
  const savedToday = raw.today === today ? Math.max(0, Math.floor(Number(raw.todaySeconds || 0))) : 0;
  return {
    totalSeconds,
    todaySeconds: savedToday,
    today,
    updatedAt: raw.updatedAt || "",
  };
}

function loadStudyTime() {
  try {
    return normalizeStudyTime(JSON.parse(localStorage.getItem(STUDY_TIME_KEY) || "{}"));
  } catch {
    return normalizeStudyTime({});
  }
}

function mergeStudyTimeForCloud(localValue, cloudValue) {
  const local = normalizeStudyTime(localValue || {});
  const cloud = normalizeStudyTime(cloudValue || {});
  const today = todayKey();
  return {
    totalSeconds: Math.max(local.totalSeconds || 0, cloud.totalSeconds || 0),
    todaySeconds: Math.max(
      local.today === today ? local.todaySeconds || 0 : 0,
      cloud.today === today ? cloud.todaySeconds || 0 : 0
    ),
    today,
    updatedAt: new Date().toISOString(),
  };
}

function saveStudyTime() {
  try {
    localStorage.setItem(STUDY_TIME_KEY, JSON.stringify({
      totalSeconds: Math.floor(state.studyTime.totalSeconds || 0),
      todaySeconds: Math.floor(state.studyTime.todaySeconds || 0),
      today: state.studyTime.today || todayKey(),
      updatedAt: new Date().toISOString(),
    }));
    return true;
  } catch {
    // 学习时长只保存一个很小的对象；如果这里失败，说明浏览器存储确实满了。
    return false;
  }
}

function syncStudyTimeDay() {
  const today = todayKey();
  if (!state.studyTime || typeof state.studyTime !== "object") {
    state.studyTime = normalizeStudyTime({});
  }
  if (state.studyTime.today !== today) {
    state.studyTime.today = today;
    state.studyTime.todaySeconds = 0;
    saveStudyTime();
  }
}

function formatStudyTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds || 0)));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  if (hours >= 100) {
    return `${hours}小时`;
  }
  if (hours > 0) {
    return `${hours}小时${minutes}分`;
  }
  return `${minutes}分`;
}

function renderStudyTime() {
  if (!els.totalStudyTime || !els.todayStudyTime) {
    return;
  }
  syncStudyTimeDay();
  els.totalStudyTime.textContent = formatStudyTime(state.studyTime.totalSeconds);
  els.todayStudyTime.textContent = `今日 ${formatStudyTime(state.studyTime.todaySeconds)}`;
}

const studyTimeTracker = {
  lastTickAt: Date.now(),
  lastActivityAt: Date.now(),
  dirtySeconds: 0,
};

function markStudyActivity() {
  studyTimeTracker.lastActivityAt = Date.now();
}

function tickStudyTime(forceSave = false) {
  if (!state.studyTime) {
    state.studyTime = normalizeStudyTime({});
  }
  const now = Date.now();
  const elapsedSeconds = Math.max(0, Math.min(30, Math.floor((now - studyTimeTracker.lastTickAt) / 1000)));
  studyTimeTracker.lastTickAt = now;
  const isVisible = document.visibilityState !== "hidden";
  const recentlyActive = now - studyTimeTracker.lastActivityAt <= 5 * 60 * 1000;
  if (elapsedSeconds && isVisible && recentlyActive) {
    syncStudyTimeDay();
    state.studyTime.totalSeconds += elapsedSeconds;
    state.studyTime.todaySeconds += elapsedSeconds;
    studyTimeTracker.dirtySeconds += elapsedSeconds;
    renderStudyTime();
  }
  if (forceSave || studyTimeTracker.dirtySeconds >= 30) {
    const hadDirtyStudyTime = studyTimeTracker.dirtySeconds > 0;
    saveStudyTime();
    if (hadDirtyStudyTime && state.cloud?.config?.autoSync) {
      autoSaveCloudSoon();
    }
    studyTimeTracker.dirtySeconds = 0;
  }
}

function installStudyTimeTracker() {
  ["click", "keydown", "touchstart", "input"].forEach((eventName) => {
    document.addEventListener(eventName, markStudyActivity, { passive: true });
  });
  document.addEventListener("visibilitychange", () => {
    tickStudyTime(true);
    studyTimeTracker.lastTickAt = Date.now();
    if (document.visibilityState !== "hidden") {
      markStudyActivity();
    }
  });
  window.addEventListener("pagehide", () => tickStudyTime(true));
  window.addEventListener("beforeunload", () => tickStudyTime(true));
}


/* builtin word package */
function cloneBuiltinWord(word) {
  return normalizeWord(JSON.parse(JSON.stringify(word)));
}

function cloneBuiltinWords() {
  return ALL_BUILTIN_WORDS.map(cloneBuiltinWord);
}

function createEmptyProgress(source = {}) {
  const stage = Number.isInteger(source.stage) ? source.stage : -1;
  const history = Array.isArray(source.history) ? source.history : [];
  return {
    status: source.status || "new",
    stage,
    nextReviewAt: source.nextReviewAt || "",
    lastStudiedAt: source.lastStudiedAt || "",
    history,
  };
}

function normalizeModeProgress(word) {
  const existing = word.progress && typeof word.progress === "object" ? word.progress : {};
  const legacyProgress = createEmptyProgress(word);
  return PROGRESS_MODES.reduce((progressByMode, mode) => {
    const source = existing[mode] || (mode === "card" ? legacyProgress : {});
    progressByMode[mode] = createEmptyProgress(source);
    return progressByMode;
  }, {});
}

function modeProgress(word, mode = state.practiceMode) {
  if (!word.progress || typeof word.progress !== "object") {
    word.progress = normalizeModeProgress(word);
  }
  if (!PROGRESS_MODES.includes(mode)) {
    mode = "card";
  }
  if (!word.progress[mode]) {
    word.progress[mode] = createEmptyProgress();
  }
  return word.progress[mode];
}

function activeModeProgress(word) {
  return modeProgress(word, state.practiceMode);
}

function recordModeHistory(word, entry, mode = state.practiceMode) {
  const progress = modeProgress(word, mode);
  const historyEntry = { ...entry, mode };
  progress.history.push(historyEntry);
  if (!Array.isArray(word.history)) {
    word.history = [];
  }
  word.history.push(historyEntry);
}


function cleanupLegacyWordListMisimports(words) {
  if (!Array.isArray(words)) return [];
  return words.filter((word) => {
    const tag = normalizeText(word?.tag || "");
    const id = normalizeText(word?.id || "");
    if (tag.includes("第一章第三节") || tag.includes("冠词与数词")) return false;
    if (/^fullway-20260627-v29-0\d\d$/.test(id)) return false;
    if (/^fullway-20260627-v29-1[0-3]\d$/.test(id)) return false;
    if (id === "cet4-20260714-v68-038") return false;
    return true;
  });
}

function progressStatusRank(status = "new") { return ({ new: 0, learning: 1, mature: 2 })[status] ?? 0; }
function mergeProgressRecord(target = {}, incoming = {}) {
  const tStage = Number.isInteger(target.stage) ? target.stage : -1;
  const iStage = Number.isInteger(incoming.stage) ? incoming.stage : -1;
  const tTime = Date.parse(target.lastStudiedAt || "") || 0;
  const iTime = Date.parse(incoming.lastStudiedAt || "") || 0;
  const useIncoming = iStage > tStage || (iStage === tStage && iTime > tTime) || (iStage === tStage && iTime === tTime && progressStatusRank(incoming.status) > progressStatusRank(target.status));
  const chosen = useIncoming ? incoming : target;
  const history = [...(Array.isArray(target.history) ? target.history : []), ...(Array.isArray(incoming.history) ? incoming.history : [])]
    .filter(Boolean).sort((a,b) => String(a.time || "").localeCompare(String(b.time || "")));
  const seen = new Set();
  const compactHistory = history.filter((item) => { const key = [item.time,item.result,item.mode].join("|"); if(seen.has(key)) return false; seen.add(key); return true; }).slice(-20);
  return { status: chosen.status || "new", stage: Number.isInteger(chosen.stage) ? chosen.stage : -1, nextReviewAt: chosen.nextReviewAt || "", lastStudiedAt: chosen.lastStudiedAt || "", history: compactHistory };
}
function mergeRuntimeWord(target, incoming) {
  target.meaning = mergeStudyText(target.meaning, incoming.meaning);
  target.phrase = mergeStudyText(target.phrase, incoming.phrase);
  target.note = mergeStudyText(target.note, incoming.note);
  target.important = Boolean(target.important || incoming.important);
  target.sources = mergeWordSources(target, incoming); target.source = target.sources[0];
  target.groups = [...new Set([...(target.groups || []), ...(incoming.groups || []), normalizeText(incoming.tag || "").split("/")[0].trim()].map(normalizeText).filter(Boolean))];
  if ((incoming.mastery || "未学") !== "未学") target.mastery = incoming.mastery;
  target.progress = target.progress || {}; incoming.progress = incoming.progress || {};
  PROGRESS_MODES.forEach((mode) => { target.progress[mode] = mergeProgressRecord(target.progress[mode] || {}, incoming.progress[mode] || {}); });
  const card = target.progress.card || {}; target.status = card.status || target.status || "new"; target.stage = Number.isInteger(card.stage) ? card.stage : (Number.isInteger(target.stage) ? target.stage : -1); target.nextReviewAt = card.nextReviewAt || target.nextReviewAt || ""; target.lastStudiedAt = card.lastStudiedAt || target.lastStudiedAt || "";
  target.history = mergeProgressRecord({history:target.history || []},{history:incoming.history || []}).history;
  return target;
}
function dedupeRuntimeWords(words) {
  const out = []; const byTerm = new Map();
  (Array.isArray(words) ? words : []).forEach((item) => {
    const word = normalizeWord(item);
    const termKey = normalizeText(word.term).toLowerCase().replace(/[’‘`]/g,"'").replace(/\s+/g," ");
    if(!termKey) return;
    const keepSeparate = /^dictation-[12]-/.test(normalizeText(word.id));
    const key = keepSeparate ? `id:${normalizeText(word.id)}` : `term:${termKey}`;
    const existing = byTerm.get(key);
    if(existing) mergeRuntimeWord(existing, word);
    else { byTerm.set(key, word); out.push(word); }
  });
  return out;
}

function applyBuiltinWords(words) {
  words = dedupeRuntimeWords(cleanupLegacyWordListMisimports(words));
  let packageAlreadyApplied = false;
  try {
    packageAlreadyApplied = localStorage.getItem(BUILTIN_PACKAGE_KEY) === "1";
  } catch {
    packageAlreadyApplied = false;
  }

  const byId = new Map(words.map((word) => [normalizeText(word.id), word]));
  const byTerm = new Map(words.map((word) => [normalizeText(word.term).toLowerCase(), word]));
  ALL_BUILTIN_WORDS.forEach((sourceWord) => {
    const builtin = cloneBuiltinWord(sourceWord);
    const builtinId = normalizeText(builtin.id);
    const termKey = normalizeText(builtin.term).toLowerCase();
    const existingById = byId.get(builtinId);
    const forceSeparate = FORCE_SEPARATE_BUILTIN_ID_PREFIXES.some((prefix) => builtinId.startsWith(prefix));
    if (!existingById && forceSeparate && !packageAlreadyApplied) {
      words.push(builtin);
      byId.set(builtinId, builtin);
      if (!byTerm.has(termKey)) byTerm.set(termKey, builtin);
      shouldPersistBuiltinWords = true;
      return;
    }
    const existing = existingById || byTerm.get(termKey);
    if (existing) {
      const previous = JSON.stringify(existing);
      const isDictationBuiltin = /^dictation-[12]-/.test(builtinId);
      if (isDictationBuiltin) {
        // 修复旧版听写存档：内容字段以当前资料为准，学习进度继续保留。
        existing.term = builtin.term;
        existing.meaning = builtin.meaning;
        existing.phrase = builtin.phrase || "";
        existing.note = builtin.note || "";
        existing.tag = builtin.tag;
        existing.groups = [...(builtin.groups || [])];
        existing.sources = [...(builtin.sources || ["听写内容"])];
        existing.source = builtin.source || "听写内容";
      } else {
        existing.meaning = mergeStudyText(existing.meaning, builtin.meaning);
        existing.phrase = mergeStudyText(existing.phrase, builtin.phrase);
        existing.note = mergeStudyText(existing.note, builtin.note);
      }
      existing.forms = {
        third: normalizeText(existing.forms?.third) || normalizeText(builtin.forms?.third),
        past: normalizeText(existing.forms?.past) || normalizeText(builtin.forms?.past),
        participle: normalizeText(existing.forms?.participle) || normalizeText(builtin.forms?.participle),
      };
      const shouldMoveV29FullwayToWordList = /^(fullway-20260627-v29-|wordlist-20260627-v31-|wordlist-20260627-v35-|wordlist-20260627-v35-)/.test(builtin.id || "");
      if (shouldMoveV29FullwayToWordList) {
        existing.tag = builtin.tag;
        existing.source = builtin.source || "Word List";
        existing.sources = [existing.source];
      } else {
        existing.tag = normalizeText(existing.tag) || builtin.tag;
        existing.sources = mergeWordSources(existing, builtin);
        existing.source = existing.sources[0];
      }
      if (JSON.stringify(existing) !== previous) {
        shouldPersistBuiltinWords = true;
      }
      return;
    }

    if (!packageAlreadyApplied) {
      words.push(builtin);
      byId.set(builtinId, builtin);
      byTerm.set(termKey, builtin);
      shouldPersistBuiltinWords = true;
    }
  });

  if (!packageAlreadyApplied) {
    shouldPersistBuiltinWords = true;
  }
  return words;
}


function compactProgress(progress = {}, options = {}) {
  const out = {};
  const emergency = Boolean(options.emergency);
  PROGRESS_MODES.forEach((mode) => {
    const item = progress && progress[mode] ? progress[mode] : null;
    if (!item) return;
    const history = emergency ? [] : (Array.isArray(item.history) ? item.history.slice(-4) : []);
    const status = item.status || "new";
    const stage = Number.isInteger(item.stage) ? item.stage : -1;
    const hasData = status !== "new" || stage >= 0 || Boolean(item.nextReviewAt) || Boolean(item.lastStudiedAt) || history.length > 0;
    if (!hasData) return;
    const record = {};
    if (status !== "new") record.status = status;
    if (stage >= 0) record.stage = stage;
    if (item.nextReviewAt) record.nextReviewAt = item.nextReviewAt;
    if (item.lastStudiedAt) record.lastStudiedAt = item.lastStudiedAt;
    if (history.length) record.history = history;
    out[mode] = record;
  });
  return out;
}

function applyCompactProgress(word, compact = {}) {
  if (!word || !compact) return word;
  if (compact.mastery && compact.mastery !== "未学") word.mastery = compact.mastery;
  if (typeof compact.important === "boolean") word.important = Boolean(word.important || compact.important);
  const legacyIncoming = { status: compact.status || "new", stage: Number.isInteger(compact.stage) ? compact.stage : -1, nextReviewAt: compact.nextReviewAt || "", lastStudiedAt: compact.lastStudiedAt || "", history: [] };
  const legacyMerged = mergeProgressRecord({ status: word.status, stage: word.stage, nextReviewAt: word.nextReviewAt, lastStudiedAt: word.lastStudiedAt, history: word.history || [] }, legacyIncoming);
  word.status = legacyMerged.status; word.stage = legacyMerged.stage; word.nextReviewAt = legacyMerged.nextReviewAt; word.lastStudiedAt = legacyMerged.lastStudiedAt;
  if (compact.updatedAt && (!word.updatedAt || compact.updatedAt > word.updatedAt)) word.updatedAt = compact.updatedAt;
  word.progress = normalizeModeProgress(word);
  if (compact.progress && typeof compact.progress === "object") {
    PROGRESS_MODES.forEach((mode) => { if (compact.progress[mode]) word.progress[mode] = mergeProgressRecord(word.progress[mode], compact.progress[mode]); });
  }
  return normalizeWord(word);
}
function compactWordRecord(word, options = {}) {
  const record = { id: word.id };
  const mastery = word.mastery || "未学";
  const status = word.status || "new";
  const stage = Number.isInteger(word.stage) ? word.stage : -1;
  if (mastery !== "未学") record.mastery = mastery;
  if (word.important) record.important = true;
  if (status !== "new") record.status = status;
  if (stage >= 0) record.stage = stage;
  if (word.nextReviewAt) record.nextReviewAt = word.nextReviewAt;
  if (word.lastStudiedAt) record.lastStudiedAt = word.lastStudiedAt;
  if (word.updatedAt && (status !== "new" || stage >= 0 || word.important || mastery !== "未学")) record.updatedAt = word.updatedAt;
  const progress = compactProgress(word.progress, options);
  if (Object.keys(progress).length) record.progress = progress;
  return record;
}

function compactCustomWord(word, options = {}) {
  const emergency = Boolean(options.emergency);
  const custom = {
    id: word.id,
    term: word.term,
    meaning: word.meaning || "",
  };
  if (word.phrase) custom.phrase = word.phrase;
  if (word.note) custom.note = word.note;
  if (word.tag) custom.tag = word.tag;
  if (Array.isArray(word.groups) && word.groups.length) custom.groups = [...new Set(word.groups.filter(Boolean))];
  if (word.source) custom.source = word.source;
  if (Array.isArray(word.sources) && word.sources.length) custom.sources = [...new Set(word.sources.filter(Boolean))];
  const forms = word.forms || {};
  if (forms.third || forms.past || forms.participle) {
    custom.forms = {};
    if (forms.third) custom.forms.third = forms.third;
    if (forms.past) custom.forms.past = forms.past;
    if (forms.participle) custom.forms.participle = forms.participle;
  }
  if (word.mastery && word.mastery !== "未学") custom.mastery = word.mastery;
  if (word.important) custom.important = true;
  if (word.status && word.status !== "new") custom.status = word.status;
  if (Number.isInteger(word.stage) && word.stage >= 0) custom.stage = word.stage;
  if (word.nextReviewAt) custom.nextReviewAt = word.nextReviewAt;
  if (word.lastStudiedAt) custom.lastStudiedAt = word.lastStudiedAt;
  if (word.createdAt) custom.createdAt = word.createdAt;
  if (word.updatedAt) custom.updatedAt = word.updatedAt;
  if (!emergency && Array.isArray(word.history) && word.history.length) custom.history = word.history.slice(-4);
  const progress = compactProgress(word.progress, options);
  if (Object.keys(progress).length) custom.progress = progress;
  return custom;
}

function compactPayloadForStorage(words, options = {}) {
  const builtinIds = new Set(ALL_BUILTIN_WORDS.map((word) => word.id));
  const builtinTerms = new Set(ALL_BUILTIN_WORDS.map((word) => normalizeText(word.term).toLowerCase()));
  const progress = [];
  const customWords = [];
  words.forEach((word) => {
    const normalized = normalizeWord(word);
    const isBuiltin = builtinIds.has(normalized.id) || builtinTerms.has(normalizeText(normalized.term).toLowerCase());
    if (isBuiltin) {
      const record = compactWordRecord(normalized, options);
      // 只有真正学习过、标记过或改变过的内置词才写入存档。
      // 旧版把 6000 多个词的默认状态全部重复存进 localStorage，容易把浏览器空间撑满。
      if (Object.keys(record).length > 1) progress.push(record);
    } else {
      customWords.push(compactCustomWord(normalized, options));
    }
  });
  return {
    app: "专升本单词记忆",
    version: 29,
    compact: true,
    savedAt: new Date().toISOString(),
    progress,
    customWords,
  };
}

function loadCompactWords(parsed) {
  const words = cloneBuiltinWords();
  const byId = new Map(words.map((word) => [word.id, word]));
  const byTerm = new Map(words.map((word) => [normalizeText(word.term).toLowerCase(), word]));
  Object.entries(BUILTIN_ID_ALIASES).forEach(([oldId, canonicalId]) => { const target = byId.get(canonicalId); if (target) byId.set(oldId, target); });
  (Array.isArray(parsed.progress) ? parsed.progress : []).forEach((item) => {
    const key = normalizeText(item.term).toLowerCase();
    const target = byId.get(item.id) || byTerm.get(key);
    if (target) applyCompactProgress(target, item);
  });
  (Array.isArray(parsed.customWords) ? parsed.customWords : []).forEach((item) => {
    const word = normalizeWord(item);
    const key = normalizeText(word.term).toLowerCase();
    if (!byId.has(word.id) && !byTerm.has(key)) {
      words.push(word);
      byId.set(word.id, word);
      byTerm.set(key, word);
    }
  });
  return applyBuiltinWords(words);
}

function cleanupStorageForWordSave() {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("word-memory-trainer:wordlist-") && key !== BUILTIN_PACKAGE_KEY) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // ignore
  }
}

function shrinkHistoriesForEmergency() {
  state.words.forEach((word) => {
    if (Array.isArray(word.history)) word.history = word.history.slice(-4);
    if (word.progress && typeof word.progress === "object") {
      Object.values(word.progress).forEach((item) => {
        if (item && Array.isArray(item.history)) item.history = item.history.slice(-4);
      });
    }
  });
}

function loadWords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      shouldPersistBuiltinWords = true;
      return cloneBuiltinWords();
    }
    const parsed = JSON.parse(raw);
    if (parsed && parsed.compact) {
      return loadCompactWords(parsed);
    }
    const words = Array.isArray(parsed) ? parsed.map(normalizeWord) : (Array.isArray(parsed.words) ? parsed.words.map(normalizeWord) : []);
    return applyBuiltinWords(words);
  } catch {
    shouldPersistBuiltinWords = true;
    return cloneBuiltinWords();
  }
}

function persistBuiltinWordsIfNeeded() {
  if (!shouldPersistBuiltinWords) {
    return;
  }
  saveWords();
  try {
    localStorage.setItem(BUILTIN_PACKAGE_KEY, "1");
  } catch {
    // Storage failures are handled by saveWords when possible.
  }
}

function normalizeWord(word) {
  const sources = normalizeWordSources(word);
  const groups = [...new Set([
    ...(Array.isArray(word.groups) ? word.groups : []),
    ...builtinGroupAliasesForTerm(word.term),
  ].map(normalizeText).filter(Boolean))];
  return {
    id: word.id || createId(),
    term: word.term || "",
    meaning: word.meaning || "",
    phrase: word.phrase || "",
    note: word.note || "",
    tag: word.tag || "",
    groups,
    source: sources[0],
    sources,
    mastery: normalizeText(word.mastery || "未学"),
    forms: {
      third: normalizeText(word.forms?.third || word.forms?.thirdPerson || word.thirdPerson || ""),
      past: normalizeText(word.forms?.past || word.forms?.pastTense || word.pastTense || ""),
      participle: normalizeText(word.forms?.participle || word.forms?.pastParticiple || word.pastParticiple || ""),
    },
    important: Boolean(word.important),
    status: word.status || "new",
    stage: Number.isInteger(word.stage) ? word.stage : -1,
    nextReviewAt: word.nextReviewAt || "",
    lastStudiedAt: word.lastStudiedAt || "",
    createdAt: word.createdAt || new Date().toISOString(),
    updatedAt: word.updatedAt || new Date().toISOString(),
    history: Array.isArray(word.history) ? word.history : [],
    progress: normalizeModeProgress(word),
  };
}

function writeCompactStorage(payload) {
  const serialized = JSON.stringify(payload);
  const previous = localStorage.getItem(STORAGE_KEY);
  try {
    localStorage.setItem(STORAGE_KEY, serialized);
    return serialized.length;
  } catch (firstError) {
    // 某些手机浏览器在“旧大存档换成新小存档”时仍会先计算两份空间。
    // 新存档更小时，先暂时移除旧值再写入；失败则尽力恢复旧值。
    if (previous && serialized.length < previous.length) {
      localStorage.removeItem(STORAGE_KEY);
      try {
        localStorage.setItem(STORAGE_KEY, serialized);
        return serialized.length;
      } catch (secondError) {
        try { localStorage.setItem(STORAGE_KEY, previous); } catch { /* 保留内存中的当前学习状态 */ }
        throw secondError;
      }
    }
    throw firstError;
  }
}

function saveWords(options = {}) {
  if (PUBLIC_VIEWER_SLUG) {
    return true;
  }
  try {
    cleanupStorageForWordSave();
    writeCompactStorage(compactPayloadForStorage(state.words));
    if (!options.skipCloud) autoSaveCloudSoon();
    return true;
  } catch {
    try {
      // 第二层保护：只丢弃冗余历史，不丢单词、释义、分组和当前学习进度。
      shrinkHistoriesForEmergency();
      cleanupStorageForWordSave();
      writeCompactStorage(compactPayloadForStorage(state.words, { emergency: true }));
      if (!options.skipCloud) autoSaveCloudSoon();
      showToast("已自动压缩旧存档并保存，不需要清理网站数据");
      return true;
    } catch {
      showToast("存档空间仍不足：先导出备份，暂时不要清理网站数据");
      return false;
    }
  }
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function normalizeCloudSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 32);
}

function toWordMemoryCloudSlug(value) {
  const slug = normalizeCloudSlug(value).slice(0, 29);
  if (!slug) {
    return "";
  }
  return `wm-${slug}`;
}

function loadCloudConfig() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CLOUD_CONFIG_KEY) || "{}");
    return {
      slug: normalizeCloudSlug(parsed.slug || ""),
      displayName: normalizeText(parsed.displayName || "专升本单词记忆"),
      pin: String(parsed.pin || ""),
      isPublic: parsed.isPublic !== false,
      autoSync: Boolean(parsed.autoSync),
    };
  } catch {
    return {
      slug: "",
      displayName: "专升本单词记忆",
      pin: "",
      isPublic: true,
      autoSync: false,
    };
  }
}

function saveCloudConfig(config) {
  if (PUBLIC_VIEWER_SLUG) {
    return;
  }
  try {
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
  } catch {
    showToast("云同步设置保存失败");
  }
}

function isCloudReadOnly() {
  return Boolean(PUBLIC_VIEWER_SLUG || (EDITOR_VIEW_SLUG && !state.cloud.canEdit));
}

function guardEditable() {
  if (PUBLIC_VIEWER_SLUG) {
    showToast("公开链接只能查看，不能修改");
    return false;
  }
  if (EDITOR_VIEW_SLUG && !state.cloud.canEdit) {
    openCloudDialog();
    setCloudStatus("这是协作链接，先输入编辑密码才能修改。", "warn");
    return false;
  }
  return true;
}

function setCloudStatus(message, tone = "") {
  if (!els.cloudStatus) {
    return;
  }
  els.cloudStatus.textContent = message || "";
  els.cloudStatus.dataset.tone = tone;
}

function defaultShareBaseUrl() {
  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    return url.href;
  }
  try {
    const saved = localStorage.getItem(SHARE_BASE_URL_KEY);
    return saved && !saved.startsWith("file:") ? saved : DEFAULT_SHARE_BASE_URL;
  } catch {
    return DEFAULT_SHARE_BASE_URL;
  }
}

function normalizeShareBaseUrl(value) {
  const candidate = normalizeText(value) || defaultShareBaseUrl();
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return DEFAULT_SHARE_BASE_URL;
    }
    url.search = "";
    url.hash = "";
    return url.href;
  } catch {
    return DEFAULT_SHARE_BASE_URL;
  }
}

function normalizeSupabaseUrl(value) {
  const candidate = normalizeText(value);
  if (!candidate) {
    return "";
  }
  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".supabase.co")) {
      return "";
    }
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.href.replace(/\/$/, "");
  } catch {
    return "";
  }
}

function currentSupabaseSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SUPABASE_SETTINGS_KEY) || "{}");
    const url = normalizeSupabaseUrl(saved.url) || DEFAULT_SUPABASE_URL;
    const key = normalizeText(saved.key) || DEFAULT_SUPABASE_PUBLISHABLE_KEY;
    return { url, key };
  } catch {
    return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_PUBLISHABLE_KEY };
  }
}

function saveSupabaseSettingsFromDialog() {
  const url = normalizeSupabaseUrl(els.supabaseUrlInput?.value || "");
  const key = normalizeText(els.supabaseKeyInput?.value || "");
  if (!url || !key) {
    return { ok: false, message: "请填写 Supabase 项目地址和 anon public key" };
  }
  try {
    localStorage.setItem(SUPABASE_SETTINGS_KEY, JSON.stringify({ url, key }));
  } catch {
    return { ok: false, message: "浏览器无法保存 Supabase 配置" };
  }
  if (els.supabaseUrlInput) {
    els.supabaseUrlInput.value = url;
  }
  if (els.supabaseKeyInput) {
    els.supabaseKeyInput.value = key;
  }
  return { ok: true, url, key };
}

function hydrateCloudDialog() {
  if (!els.cloudDialog) {
    return;
  }
  const config = state.cloud.config;
  if (els.cloudSlugInput) {
    els.cloudSlugInput.value = EDITOR_VIEW_SLUG || PUBLIC_VIEWER_SLUG || config.slug || "";
    els.cloudSlugInput.readOnly = Boolean(EDITOR_VIEW_SLUG || PUBLIC_VIEWER_SLUG);
  }
  if (els.cloudNameInput) {
    els.cloudNameInput.value = config.displayName || "专升本单词记忆";
  }
  if (els.cloudPinInput) {
    els.cloudPinInput.value = PUBLIC_VIEWER_SLUG ? "" : config.pin || "";
  }
  if (els.cloudPublicInput) {
    els.cloudPublicInput.checked = config.isPublic !== false;
    els.cloudPublicInput.disabled = Boolean(PUBLIC_VIEWER_SLUG);
  }
  const supabaseSettings = currentSupabaseSettings();
  if (els.supabaseUrlInput) {
    els.supabaseUrlInput.value = supabaseSettings.url;
  }
  if (els.supabaseKeyInput) {
    els.supabaseKeyInput.value = supabaseSettings.key;
  }
  if (els.shareBaseUrlInput) {
    els.shareBaseUrlInput.value = normalizeShareBaseUrl(els.shareBaseUrlInput.value || defaultShareBaseUrl());
  }
  if (els.loadCloudButton) {
    els.loadCloudButton.disabled = Boolean(PUBLIC_VIEWER_SLUG);
  }
}

function openCloudDialog() {
  hydrateCloudDialog();
  if (!els.cloudDialog) {
    return;
  }
  if (typeof els.cloudDialog.showModal === "function" && !els.cloudDialog.open) {
    els.cloudDialog.showModal();
  } else {
    els.cloudDialog.setAttribute("open", "");
  }
}

function closeCloudDialog() {
  if (!els.cloudDialog) {
    return;
  }
  if (typeof els.cloudDialog.close === "function") {
    els.cloudDialog.close();
  } else {
    els.cloudDialog.removeAttribute("open");
  }
}

function readCloudFormConfig() {
  const supabaseSaved = saveSupabaseSettingsFromDialog();
  if (!supabaseSaved.ok) {
    setCloudStatus(supabaseSaved.message, "warn");
  }
  const slug = normalizeCloudSlug(els.cloudSlugInput?.value || state.cloud.config.slug);
  const config = {
    slug,
    displayName: normalizeText(els.cloudNameInput?.value || state.cloud.config.displayName || "专升本单词记忆"),
    pin: String(els.cloudPinInput?.value || state.cloud.config.pin || ""),
    isPublic: els.cloudPublicInput ? els.cloudPublicInput.checked : state.cloud.config.isPublic !== false,
    autoSync: state.cloud.config.autoSync,
  };
  state.cloud.config = config;
  return config;
}

function safeParseCloudResponse(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const shortText = text.replace(/\s+/g, " ").trim().slice(0, 90);
    const detail = shortText ? `返回内容：${shortText}` : "返回内容为空";
    throw new Error(`云端接口没有返回 JSON，通常是 Supabase 服务未部署、接口被拦截或网络异常。${detail}`);
  }
}

function readableCloudError(error) {
  const message = normalizeText(error?.message || String(error || ""));
  if (!message) return "云同步失败，但本机学习记录已经保存。";
  if (/Unexpected token|not valid JSON|JSON/i.test(message)) {
    return "云同步失败：云端返回内容不是 JSON。大概率是 Supabase 接口没部署好或网络拦截。本机学习记录已经保存。";
  }
  if (/Failed to fetch|NetworkError|Load failed|fetch/i.test(message)) {
    return "云同步失败：网络连不上 Supabase。本机学习记录已经保存。";
  }
  if (/schema cache|PGRST202|Could not query|function|rpc|procedure/i.test(message)) {
    return "云同步失败：Supabase 云端表和函数还没建好。请先运行压缩包里的 supabase-word-memory-repair.sql，运行成功后等 30 秒再点保存。";
  }
  if (/upstream|connect error|connection|reset|timeout|503|502|504/i.test(message)) {
    return "云同步失败：Supabase 上游连接异常。本机学习记录已经保存，晚点再试即可。";
  }
  return message;
}

async function cloudRequest(functionName, payload) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), CLOUD_REQUEST_TIMEOUT_MS);
  try {
    const supabase = currentSupabaseSettings();
    if (!supabase.url || !supabase.key) {
      throw new Error("请先填写 Supabase 项目地址和 anon public key");
    }
    const response = await fetch(`${supabase.url}/rest/v1/rpc/${functionName}`, {
      method: "POST",
      headers: {
        apikey: supabase.key,
        Authorization: `Bearer ${supabase.key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const text = await response.text();
    let data = null;
    try {
      data = safeParseCloudResponse(text);
    } catch (parseError) {
      throw parseError;
    }
    if (!response.ok) {
      throw new Error(data?.message || data?.hint || data?.details || "云端请求失败");
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("云端连接超过 12 秒。本机学习记录已先保存；请检查 Supabase 网络或稍后重试。");
    }
    throw new Error(readableCloudError(error));
  } finally {
    window.clearTimeout(timer);
  }
}

function cloudWordsPayload() {
  tickStudyTime(true);
  // v38：云端只保存一个压缩包，避免 1800+ 单词逐条插入导致超时。
  // 内置词条正文仍由网页自带；云端只同步掌握状态、重点、复习进度、自定义词和学习时长。
  return [{
    id: CLOUD_COMPACT_PAYLOAD_ID,
    type: "word-memory-compact-cloud",
    app: "专升本单词记忆",
    version: 49,
    studyTime: normalizeStudyTime(state.studyTime || {}),
    data: compactPayloadForStorage(state.words),
    updatedAt: new Date().toISOString(),
  }];
}

function saveLocalCloudSettingsOnly(config, options = {}) {
  if (PUBLIC_VIEWER_SLUG) {
    showToast("公开链接只能查看，不能保存");
    return false;
  }
  tickStudyTime(true);
  state.cloud.config = { ...state.cloud.config, ...config, autoSync: false };
  saveCloudConfig(state.cloud.config);
  saveWords({ skipCloud: true });
  saveStudyTime();
  if (!options.silent) {
    setCloudStatus("已保存到本机。没有上传到云端。", "ok");
    showToast("已保存到本机");
  }
  if (options.closeDialog !== false) {
    closeCloudDialog();
  }
  return true;
}

async function saveCloudNow(options = {}) {
  const silent = Boolean(options.silent);
  if (PUBLIC_VIEWER_SLUG || (EDITOR_VIEW_SLUG && !state.cloud.canEdit)) {
    return false;
  }
  const config = options.config || state.cloud.config;
  if (!config.slug || config.pin.length < 4) {
    if (!silent) {
      setCloudStatus("请填写公开编号，并设置至少 4 位编辑密码。", "warn");
      showToast("云同步需要公开编号和编辑密码");
    }
    return false;
  }
  try {
    if (!silent) {
      setCloudStatus("正在保存到云端……");
    }
    const result = await cloudRequest("save_word_memory_cloud", {
      p_slug: toWordMemoryCloudSlug(config.slug),
      p_pin: config.pin,
      p_words: cloudWordsPayload(),
      p_display_name: config.displayName || "专升本单词记忆",
      p_is_public: config.isPublic !== false,
    });
    state.cloud.config = { ...config, autoSync: true };
    saveCloudConfig(state.cloud.config);
    if (!silent) {
      setCloudStatus(`已保存到云端：${state.cloud.config.slug}`, "ok");
      showToast("已保存到云端并开启自动同步");
    }
    return result;
  } catch (error) {
    state.cloud.config = { ...state.cloud.config, ...config, autoSync: false };
    saveCloudConfig(state.cloud.config);
    const message = error.message || "云同步失败，但本机学习记录已经保存。";
    if (!silent) {
      setCloudStatus(`${message} 已关闭自动云同步，避免反复卡顿。`, "warn");
      showToast("云同步失败，本机已保存");
    }
    return false;
  }
}

async function loadCloudToLocal(options = {}) {
  const slug = normalizeCloudSlug(options.slug || state.cloud.config.slug || PUBLIC_VIEWER_SLUG || EDITOR_VIEW_SLUG);
  const pin = options.pin ?? state.cloud.config.pin ?? "";
  const publicView = Boolean(options.publicView || PUBLIC_VIEWER_SLUG);
  if (!slug) {
    setCloudStatus("请先填写公开编号。", "warn");
    return false;
  }
  try {
    if (!options.silent) {
      setCloudStatus("正在从云端加载……");
    }
    const data = await cloudRequest("load_word_memory_cloud", {
      p_slug: toWordMemoryCloudSlug(slug),
      p_pin: pin || null,
    });
    const incoming = Array.isArray(data?.words) ? data.words : Array.isArray(data) ? data : [];
    const compactCloud = incoming.find((item) => item && item.id === CLOUD_COMPACT_PAYLOAD_ID && item.data?.compact);
    if (compactCloud) {
      state.words = loadCompactWords(compactCloud.data);
      if (compactCloud.studyTime) {
        state.studyTime = mergeStudyTimeForCloud(state.studyTime, compactCloud.studyTime);
        saveStudyTime();
      }
    } else {
      const studyMeta = incoming.find((item) => item && item.id === CLOUD_STUDY_TIME_META_ID);
      const wordRecords = incoming.filter((item) => !(item && item.id === CLOUD_STUDY_TIME_META_ID));
      state.words = dedupeRuntimeWords(wordRecords.map(normalizeWord));
      if (studyMeta?.studyTime) {
        state.studyTime = mergeStudyTimeForCloud(state.studyTime, studyMeta.studyTime);
        saveStudyTime();
      }
    }
    suppressCloudSync = true;
    if (!publicView) {
      saveWords({ skipCloud: true });
      state.cloud.config = {
        ...state.cloud.config,
        slug,
        pin,
        displayName: data?.display_name || state.cloud.config.displayName || "专升本单词记忆",
        isPublic: data?.is_public !== false,
        autoSync: true,
      };
      saveCloudConfig(state.cloud.config);
    }
    suppressCloudSync = false;
    setActiveId(null);
    resetTypingState();
    render();
    if (!options.silent) {
      setCloudStatus(`已连接并加载 ${state.words.length} 个词条，自动同步已开启。`, "ok");
      showToast("已连接云端并开启同步");
    }
    return true;
  } catch (error) {
    suppressCloudSync = false;
    setCloudStatus(error.message || "从云端加载失败", "warn");
    showToast(error.message || "从云端加载失败");
    return false;
  }
}

function autoSaveCloudSoon() {
  if (suppressCloudSync || PUBLIC_VIEWER_SLUG || (EDITOR_VIEW_SLUG && !state.cloud.canEdit)) {
    return;
  }
  const config = state.cloud.config;
  if (!config.autoSync || !config.slug || !config.pin) {
    return;
  }
  window.clearTimeout(cloudSyncTimer);
  cloudSyncTimer = window.setTimeout(() => {
    saveCloudNow({ silent: true });
  }, 1000);
}

function makeShareLink(kind) {
  const config = readCloudFormConfig();
  const base = normalizeShareBaseUrl(els.shareBaseUrlInput?.value || defaultShareBaseUrl());
  try {
    localStorage.setItem(SHARE_BASE_URL_KEY, base);
  } catch {
    // Link generation can continue without saving the address.
  }
  const url = new URL(base);
  url.search = kind === "edit" ? `?edit=${config.slug}` : `?public=${config.slug}`;
  return url.href;
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch {
    showToast(text);
  }
}

function copyPublicLink() {
  const config = readCloudFormConfig();
  if (!config.slug) {
    setCloudStatus("请先填写公开编号。", "warn");
    return;
  }
  copyText(makeShareLink("public"), "公开链接已复制");
}

function copyEditLink() {
  const config = readCloudFormConfig();
  if (!config.slug) {
    setCloudStatus("请先填写公开编号。", "warn");
    return;
  }
  copyText(makeShareLink("edit"), "协作链接已复制");
}

async function connectSharedEditCloud() {
  const config = readCloudFormConfig();
  config.slug = EDITOR_VIEW_SLUG || config.slug;
  if (!config.slug || config.pin.length < 4) {
    setCloudStatus("协作编辑需要公开编号和编辑密码。", "warn");
    return false;
  }
  try {
    setCloudStatus("正在验证编辑密码……");
    await cloudRequest("verify_word_memory_cloud_pin", {
      p_slug: toWordMemoryCloudSlug(config.slug),
      p_pin: config.pin,
    });
    state.cloud.canEdit = true;
    state.cloud.config = { ...config, autoSync: true };
    saveCloudConfig(state.cloud.config);
    await loadCloudToLocal({ slug: config.slug, pin: config.pin, silent: true });
    setCloudStatus("协作编辑已开启，之后的修改会自动同步。", "ok");
    showToast("协作编辑已开启");
    closeCloudDialog();
    return true;
  } catch (error) {
    setCloudStatus(error.message || "编辑密码不正确", "warn");
    showToast(error.message || "编辑密码不正确");
    return false;
  }
}

function renderCloudAccessState() {
  const readonly = isCloudReadOnly();
  document.body?.classList?.toggle("is-readonly-cloud", readonly);
  if (!els.readonlyBanner) {
    return;
  }
  if (PUBLIC_VIEWER_SLUG) {
    els.readonlyBanner.hidden = false;
    els.readonlyBanner.textContent = `正在查看公开词库：${PUBLIC_VIEWER_SLUG}，这里只能查看，不能编辑。`;
    return;
  }
  if (EDITOR_VIEW_SLUG && !state.cloud.canEdit) {
    els.readonlyBanner.hidden = false;
    els.readonlyBanner.textContent = `协作词库：${EDITOR_VIEW_SLUG}。输入编辑密码后才能修改并同步。`;
    return;
  }
  els.readonlyBanner.hidden = true;
}

function initializeCloudFromUrl() {
  if (PUBLIC_VIEWER_SLUG) {
    state.cloud.canEdit = false;
    state.words = [];
    setActiveId(null);
    render();
    loadCloudToLocal({ slug: PUBLIC_VIEWER_SLUG, publicView: true, silent: true }).then((ok) => {
      if (ok) {
        showToast("已打开公开词库，只能查看");
      }
    });
    return;
  }
  if (EDITOR_VIEW_SLUG) {
    state.cloud.canEdit = false;
    state.cloud.config = { ...state.cloud.config, slug: EDITOR_VIEW_SLUG, autoSync: false };
    state.words = [];
    setActiveId(null);
    render();
    openCloudDialog();
    setCloudStatus("这是协作链接，输入编辑密码后可以修改同一份云端数据。", "warn");
  }
}

function formatDateTime(value) {
  if (!value) {
    return "未安排";
  }
  const date = new Date(value);
  const sameDay = todayKey(date) === todayKey();
  const day = sameDay ? "今天" : `${date.getMonth() + 1}/${date.getDate()}`;
  return `${day} ${date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function isDue(word, date = nowDate(), mode = state.practiceMode) {
  const progress = modeProgress(word, mode);
  return Boolean(progress.nextReviewAt && new Date(progress.nextReviewAt) <= date);
}

function isTodayReview(word, mode = state.practiceMode) {
  const progress = modeProgress(word, mode);
  return Boolean(progress.nextReviewAt && todayKey(new Date(progress.nextReviewAt)) === todayKey());
}

function learnedToday(word, mode = state.practiceMode) {
  const progress = modeProgress(word, mode);
  return progress.history.some((entry) => todayKey(new Date(entry.time)) === todayKey());
}

function wordGroupName(word) {
  return wordGroupNames(word)[0] || "未分组";
}

function wordGroupNames(word) {
  const tag = normalizeText(word.tag);
  const primary = tag ? (tag.split("/")[0].trim() || tag) : "未分组";
  return [...new Set([
    primary,
    ...(Array.isArray(word.groups) ? word.groups : []),
    ...builtinGroupAliasesForTerm(word.term),
  ].map(normalizeText).filter(Boolean))];
}

function wordMatchesActiveGroup(word) {
  if (state.activeGroup === "all") return true;
  const groupNames = wordGroupNames(word);
  if (groupNames.includes(state.activeGroup)) return true;
  if (["全方位", "蓝色森林", "Word List", "四级"].includes(state.activeGroup)) {
    return groupNames.some((groupName) => progressRootName(groupName) === state.activeGroup);
  }
  return false;
}

function wordTextBlob(word) {
  return [word.term, word.meaning, word.phrase, word.note, word.tag, ...(word.groups || []), ...(word.sources || [])].join(" ").toLowerCase();
}

function meaningSegments(text) {
  const raw = normalizeText(text || "");
  if (!raw) return [];
  return raw
    .split(/[；;。]|(?:\s+[/／]\s+)|(?:，(?=[^，]{1,18}(?:；|$)))/)
    .map((item) => normalizeText(item).replace(/^[,，、:：\s]+/, ""))
    .filter(Boolean)
    .slice(0, 8);
}

function hasMultiMeaning(word) {
  const parts = meaningSegments(word.meaning);
  return parts.length >= 2 || /；|;|一词多义|多义|熟词僻义/.test(word.meaning || word.note || "");
}

function hasFixedPhrase(word) {
  return Boolean(normalizeText(word.phrase)) || /搭配|短语|固定搭配|look forward to|be .* to|depend on|according to/i.test(wordTextBlob(word));
}

const RARE_MEANING_TERMS = new Set("case charge present park leave book match fair fine still light address rest mean right term course issue matter business raise lie bear sound spring capital subject object form figure deal".split(" "));
function hasRareMeaning(word) {
  const term = normalizeText(word.term).toLowerCase().replace(/[^a-z]/g, "");
  const text = wordTextBlob(word);
  return RARE_MEANING_TERMS.has(term) || /熟词僻义|僻义|考试义|多义|指控|充电|提出|出席|案件|期限|术语/.test(text);
}

function progressHasResult(word, matcher) {
  const progress = word.progress && typeof word.progress === "object" ? word.progress : {};
  return Object.values(progress).some((item) => Array.isArray(item?.history) && item.history.some((entry) => matcher(entry.result || "")))
    || (Array.isArray(word.history) && word.history.some((entry) => matcher(entry.result || "")));
}

function isSpellingWeakWord(word) {
  return word.important || progressHasResult(word, (result) => ["spell-wrong", "forms-wrong"].includes(result));
}

function isDictationWeakWord(word) {
  return word.important || progressHasResult(word, (result) => ["dictation-wrong", "spell-wrong"].includes(result));
}

function weakScore(word) {
  let score = 0;
  if (word.important) score += 50;
  if (isDue(word)) score += 30;
  const progress = activeModeProgress(word);
  if (progress.stage < 1) score += 16;
  if (progress.status === "new") score += 8;
  if (progressHasResult(word, (result) => ["forgot", "fuzzy", "spell-wrong", "forms-wrong", "choice-wrong"].includes(result))) score += 30;
  return score;
}

function isWeakWord(word) {
  return weakScore(word) > 0;
}

function priorityOf(word) {
  if (word.priority) return word.priority;
  if (word.important || /重点|高频|核心|必背|四级|蓝色森林/i.test(wordTextBlob(word))) return "A";
  if (hasMultiMeaning(word) || hasFixedPhrase(word) || hasRareMeaning(word)) return "B";
  return "C";
}

function practiceEligibleWords(words) {
  switch (state.practiceMode) {
    case "forms":
      return words.filter(hasVerbForms);
    case "multiMeaning":
      return words.filter(hasMultiMeaning);
    case "rareMeaning":
      return words.filter(hasRareMeaning);
    case "fixedPhrase":
      return words.filter(hasFixedPhrase);
    case "spellingWeak":
      return words.filter(isSpellingWeakWord);
    case "dictationWeak":
      return words.filter(isDictationWeakWord);
    default:
      return words;
  }
}

function resetTypingState() {
  state.spellingDraft = "";
  state.spellingResult = null;
  state.formDrafts = emptyVerbForms();
  state.formResult = null;
  state.revealStep = 0;
  state.choiceResult = null;
}

function statusOf(word, mode = state.practiceMode) {
  const progress = modeProgress(word, mode);
  if (isDue(word, nowDate(), mode)) {
    return "due";
  }
  if (progress.status === "new" || (progress.stage < 0 && !progress.nextReviewAt)) {
    return "new";
  }
  if (progress.stage >= REVIEW_STEPS.length - 1) {
    return "mature";
  }
  return "learning";
}

function statusLabel(status) {
  return {
    due: "到期",
    new: "新词",
    learning: "学习中",
    mature: "稳定",
    important: "重点",
  }[status] || "新词";
}

function cloneWordForUndo(word) {
  return JSON.parse(JSON.stringify(word));
}

function rememberReviewUndo(word, action) {
  state.reviewUndo = {
    wordId: word.id,
    word: cloneWordForUndo(word),
    action,
    practiceMode: state.practiceMode,
    mode: state.mode,
    activeGroup: state.activeGroup,
    sprintWasActive: Boolean(state.sprint.active),
    createdAt: new Date().toISOString(),
  };
}


const GAZE_PROTECTED_ACTIONS = new Set(["remember", "fuzzy", "forgot", "undo-review", "show", "speak", "speak-uk"]);
const GAZE_SAFE_ACTIONS = new Set([]);

function isProtectedGazeAction(action) {
  return GAZE_PROTECTED_ACTIONS.has(action);
}

function clearGazePending() {
  const control = state.gazeControl;
  control.pendingTargetKey = "";
  control.pendingTargetLabel = "";
  control.pendingUntil = 0;
  document.querySelectorAll(".gaze-armed").forEach((node) => node.classList.remove("gaze-armed"));
}

function setGazeStatus(message, tone = "") {
  if (els.gazeStatus) {
    els.gazeStatus.textContent = message;
  }
  if (els.gazePanel) {
    els.gazePanel.dataset.tone = tone;
  }
}

function updateGazeButton() {
  if (!els.gazeControlButton) return;
  const active = Boolean(state.fingerControl?.enabled);
  els.gazeControlButton.classList.toggle("active", active);
  document.body.classList.toggle("finger-active", active);
  document.body.classList.remove("gaze-active");
  els.gazeControlButton.innerHTML = active ? '<span aria-hidden="true">☝</span> 关闭手指' : '<span aria-hidden="true">☝</span> 手指已关闭';
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateGazeGuidePosition() {
  if (!els.gazeGuide || !els.activeCard) return;
  const rect = els.activeCard.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const viewportWidth = Math.max(320, window.innerWidth || document.documentElement.clientWidth || 320);
  const viewportHeight = Math.max(420, window.innerHeight || document.documentElement.clientHeight || 420);
  const markerWidth = viewportWidth <= 720 ? 106 : 136;
  const safePad = viewportWidth <= 720 ? 6 : 12;
  const sideTop = clampNumber(
    rect.top + Math.min(Math.max(rect.height * 0.46, 145), rect.height - 110),
    78,
    viewportHeight - 118
  );
  const centerTop = clampNumber(rect.top + 12, 78, viewportHeight - 102);
  const leftX = clampNumber(rect.left + 18, safePad, viewportWidth - markerWidth - safePad);
  const rightX = clampNumber(rect.right - markerWidth - 18, safePad, viewportWidth - markerWidth - safePad);
  const centerX = clampNumber(rect.left + rect.width / 2, markerWidth / 2 + safePad, viewportWidth - markerWidth / 2 - safePad);
  els.gazeGuide.style.setProperty("--gaze-left-x", `${Math.round(leftX)}px`);
  els.gazeGuide.style.setProperty("--gaze-right-x", `${Math.round(rightX)}px`);
  els.gazeGuide.style.setProperty("--gaze-center-x", `${Math.round(centerX)}px`);
  els.gazeGuide.style.setProperty("--gaze-side-top", `${Math.round(sideTop)}px`);
  els.gazeGuide.style.setProperty("--gaze-center-top", `${Math.round(centerTop)}px`);
}

function loadExternalScript(src, timeoutMs = 4500) {
  return new Promise((resolve, reject) => {
    if (window.webgazer && typeof window.webgazer.setGazeListener === "function") {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[data-dynamic-src="${src}"]`);
    if (existing) existing.remove();
    const script = document.createElement("script");
    let done = false;
    const timer = window.setTimeout(() => {
      if (done) return;
      done = true;
      script.remove();
      reject(new Error(`脚本加载超时：${src}`));
    }, timeoutMs);
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.dynamicSrc = src;
    script.onload = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      resolve();
    };
    script.onerror = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      script.remove();
      reject(new Error(`脚本加载失败：${src}`));
    };
    document.head.appendChild(script);
  });
}

function isCameraSecureContext() {
  return window.isSecureContext || location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
}

async function requestGazeCameraStream() {
  if (!isCameraSecureContext()) {
    throw new Error("摄像头只能在 HTTPS 网页或本机 localhost 使用，不能直接用 D 盘文件稳定开启");
  }
  if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
    throw new Error("当前浏览器不支持摄像头权限接口");
  }
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 320 }, height: { ideal: 240 } },
      audio: false,
    });
  } catch (error) {
    const name = error && error.name ? error.name : "";
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      throw new Error("浏览器拒绝了摄像头权限：点地址栏左边小锁/网站设置，把摄像头改成允许");
    }
    if (name === "NotFoundError" || name === "DevicesNotFoundError") {
      throw new Error("没有检测到可用摄像头");
    }
    if (name === "NotReadableError" || name === "TrackStartError") {
      throw new Error("摄像头正在被其他软件占用，先关闭微信/钉钉/相机/会议软件再试");
    }
    throw new Error(error?.message || "摄像头开启失败");
  }
}

function stopMediaStream(stream) {
  try {
    stream?.getTracks?.().forEach((track) => track.stop());
  } catch (error) {}
}

async function ensureWebGazer() {
  if (window.webgazer && typeof window.webgazer.setGazeListener === "function") {
    return window.webgazer;
  }
  const sources = [
    "https://webgazer.cs.brown.edu/webgazer.js",
    "https://cdn.jsdelivr.net/npm/webgazer@2.1.1/dist/webgazer.min.js",
    "https://unpkg.com/webgazer@2.1.1/dist/webgazer.min.js",
    "https://cdn.jsdelivr.net/npm/webgazer/dist/webgazer.min.js",
  ];
  const errors = [];
  for (const src of sources) {
    try {
      await loadExternalScript(src);
      if (window.webgazer && typeof window.webgazer.setGazeListener === "function") return window.webgazer;
      errors.push(`${src} 未生成 webgazer`);
    } catch (error) {
      errors.push(error?.message || String(error));
    }
  }
  throw new Error(`眼神识别库加载失败，已切换备用模式。${errors.slice(0, 2).join("；")}`);
}

function readableGazeActionLabel(button) {
  const action = button?.dataset?.cardAction || "";
  const text = (button?.textContent || "").replace(/\s+/g, " ").trim();
  if (text) return text.length > 16 ? `${text.slice(0, 16)}…` : text;
  const labels = {
    remember: "记完",
    fuzzy: "模糊",
    forgot: "忘了",
    "undo-review": "撤回上一个",
    show: "显示释义",
    speak: "美音",
    "speak-uk": "英音",
    "toggle-important": "标重点",
  };
  return labels[action] || action || "按钮";
}

function gazeTargetFromPoint(data) {
  if (!data || !Number.isFinite(data.x) || !Number.isFinite(data.y) || !els.activeCard) return null;
  const x = data.x;
  const y = data.y;
  const buttons = Array.from(els.activeCard.querySelectorAll("[data-card-action]"))
    .filter((button) => !button.disabled && button.offsetParent !== null);
  let nearest = null;
  let nearestDistance = Infinity;
  for (const button of buttons) {
    const rect = button.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    // v58: 只认按钮中间的安全区域，不再把按钮边缘也算进去，减少误触。
    const insetX = Math.min(34, Math.max(14, rect.width * 0.18));
    const insetY = Math.min(22, Math.max(10, rect.height * 0.20));
    const innerLeft = rect.left + insetX;
    const innerRight = rect.right - insetX;
    const innerTop = rect.top + insetY;
    const innerBottom = rect.bottom - insetY;
    const inside = x >= innerLeft && x <= innerRight && y >= innerTop && y <= innerBottom;
    if (!inside) continue;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const distance = Math.hypot(x - cx, y - cy);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = button;
    }
  }
  if (!nearest) return null;
  return {
    action: nearest.dataset.cardAction,
    label: readableGazeActionLabel(nearest),
    button: nearest,
  };
}

function stopGazeControl(message = "已关闭眼神翻词") {
  const control = state.gazeControl;
  control.enabled = false;
  control.starting = false;
  control.mode = "";
  control.lastZone = "center";
  control.lastTargetKey = "";
  control.zoneStartedAt = 0;
  control.cooldownUntil = 0;
  clearGazePending();
  control.fallbackBaseline = null;
  control.fallbackSamples = [];
  if (control.fallbackTimer) {
    window.cancelAnimationFrame(control.fallbackTimer);
    control.fallbackTimer = null;
  }
  stopMediaStream(control.fallbackStream);
  control.fallbackStream = null;
  if (control.fallbackVideo) {
    try { control.fallbackVideo.pause?.(); } catch (error) {}
    control.fallbackVideo.srcObject = null;
    control.fallbackVideo.remove();
    control.fallbackVideo = null;
  }
  if (control.fallbackCanvas) {
    control.fallbackCanvas.remove();
    control.fallbackCanvas = null;
  }
  if (window.webgazer) {
    try { window.webgazer.clearGazeListener?.(); } catch (error) {}
    try { window.webgazer.pause?.(); } catch (error) {}
    try { window.webgazer.showVideoPreview?.(false); } catch (error) {}
    try { window.webgazer.showPredictionPoints?.(false); } catch (error) {}
  }
  if (els.gazePanel) els.gazePanel.hidden = true;
  if (els.gazeGuide) els.gazeGuide.hidden = true;
  clearGazeHover();
  updateGazeButton();
  if (message) showToast(message);
}

function runGazeAction(target) {
  const word = activeWord();
  if (!word || !target?.action) return;
  const action = target.action;
  handleCardAction(action);
  setGazeStatus(`已触发：${target.label}`, "ok");
}

function clearGazeHover() {
  document.querySelectorAll(".gaze-hover").forEach((node) => node.classList.remove("gaze-hover"));
}

function markGazePending(target) {
  clearGazePending();
  const control = state.gazeControl;
  const key = `${target.action}:${target.label}`;
  control.pendingTargetKey = key;
  control.pendingTargetLabel = target.label;
  control.pendingUntil = Date.now() + 4500;
  target.button?.classList.add("gaze-armed");
}

function handleResolvedGazeTarget(target, emptyMessage = "保护模式：所有按钮都要先锁定，再看同一个按钮确认。") {
  const control = state.gazeControl;
  if (!control.enabled) return;
  const now = Date.now();
  if (now < control.cooldownUntil) return;

  if (control.pendingTargetKey && now > control.pendingUntil) {
    const oldLabel = control.pendingTargetLabel;
    clearGazePending();
    setGazeStatus(oldLabel ? `已取消“${oldLabel}”确认` : emptyMessage, "");
  }

  if (!target) {
    clearGazeHover();
    control.lastTargetKey = "";
    control.zoneStartedAt = now;
    setGazeStatus(control.pendingTargetKey ? `已锁定“${control.pendingTargetLabel}”，再看同一个按钮确认；4 秒后自动取消。` : emptyMessage, "");
    return;
  }

  const key = `${target.action}:${target.label}`;
  if (control.pendingTargetKey && control.pendingTargetKey !== key) {
    clearGazeHover();
    target.button?.classList.add("gaze-hover");
    setGazeStatus(`已锁定“${control.pendingTargetLabel}”。要执行就再看它；不想执行等 4 秒自动取消。`, "warn");
    return;
  }

  if (key !== control.lastTargetKey) {
    clearGazeHover();
    target.button?.classList.add("gaze-hover");
    control.lastTargetKey = key;
    control.zoneStartedAt = now;
  }

  const dwell = now - (control.zoneStartedAt || now);
  const protectedAction = isProtectedGazeAction(target.action);
  const isConfirming = control.pendingTargetKey === key;
  const requiredMs = isConfirming ? control.confirmDwellMs : (protectedAction ? control.dwellMs : control.safeDwellMs);
  const pct = Math.min(100, Math.round((dwell / requiredMs) * 100));
  const prefix = isConfirming ? "确认" : (protectedAction ? "锁定" : "看着");
  setGazeStatus(`${prefix}“${target.label}” ${pct}%`, protectedAction ? "warn" : "");

  if (dwell < requiredMs) return;

  if (protectedAction && !isConfirming) {
    markGazePending(target);
    control.cooldownUntil = now + 500;
    control.lastTargetKey = "";
    control.zoneStartedAt = 0;
    setGazeStatus(`已锁定“${target.label}”：4 秒内再看一次才会执行。`, "warn");
    return;
  }

  clearGazePending();
  control.cooldownUntil = now + 1800;
  control.lastTargetKey = "";
  control.zoneStartedAt = 0;
  clearGazeHover();
  runGazeAction(target);
}

function handleGazePoint(data) {
  handleResolvedGazeTarget(gazeTargetFromPoint(data));
}

function buttonTargetByAction(action) {
  const button = els.activeCard?.querySelector(`[data-card-action="${action}"]`);
  if (!button || button.disabled || button.offsetParent === null) return null;
  return { action, label: readableGazeActionLabel(button), button };
}

function fallbackTargetFromDirection(dx, dy) {
  // v59: 备用眼控更保守，方向不明显时一律不触发。布局按三列三行：
  // 记完 / 模糊 / 显示释义；撤回 / 美音 / 忘了；空 / 英音 / 空。
  if (Math.abs(dx) < 0.095 && Math.abs(dy) < 0.095) return null;
  let col = 1;
  if (dx < -0.16) col = 0;
  else if (dx > 0.16) col = 2;
  else if (Math.abs(dx) > 0.095) col = 1;
  let row = null;
  if (dy < -0.12) row = 0;
  else if (dy > 0.22) row = 2;
  else if (dy > 0.105) row = 1;
  if (row === null) return null;
  const actionRows = [
    ["remember", "fuzzy", "show"],
    ["undo-review", "speak", "forgot"],
    ["", "speak-uk", ""],
  ];
  const action = actionRows[row]?.[col] || "";
  return action ? buttonTargetByAction(action) : null;
}

function estimateEyeDirectionFromVideo(video, canvas, control) {
  const width = 160;
  const height = 120;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx || video.readyState < 2) return null;
  try { ctx.drawImage(video, 0, 0, width, height); } catch (error) { return null; }
  const rx = Math.round(width * 0.22);
  const ry = Math.round(height * 0.22);
  const rw = Math.round(width * 0.56);
  const rh = Math.round(height * 0.34);
  const image = ctx.getImageData(rx, ry, rw, rh);
  const data = image.data;
  const grays = [];
  for (let i = 0; i < data.length; i += 4) {
    grays.push(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
  }
  if (!grays.length) return null;
  const sorted = grays.slice().sort((a, b) => a - b);
  const threshold = sorted[Math.floor(sorted.length * 0.22)] + 10;
  let total = 0, sx = 0, sy = 0, p = 0;
  for (let y = 0; y < rh; y += 1) {
    for (let x = 0; x < rw; x += 1) {
      const gray = grays[p++];
      if (gray <= threshold) {
        const weight = Math.max(1, threshold - gray);
        total += weight;
        sx += x * weight;
        sy += y * weight;
      }
    }
  }
  if (total < 80) return null;
  const nx = sx / total / rw;
  const ny = sy / total / rh;
  if (!control.fallbackBaseline) {
    control.fallbackSamples.push({ nx, ny });
    if (control.fallbackSamples.length < 12) {
      setGazeStatus(`备用眼控校准中 ${control.fallbackSamples.length}/12：正视单词，不要动`, "");
      return null;
    }
    const sum = control.fallbackSamples.reduce((acc, item) => ({ x: acc.x + item.nx, y: acc.y + item.ny }), { x: 0, y: 0 });
    control.fallbackBaseline = { x: sum.x / control.fallbackSamples.length, y: sum.y / control.fallbackSamples.length };
    setGazeStatus("备用眼控已开启：保护模式开启。所有按钮都需要二次确认。", "ok");
    return null;
  }
  return { dx: nx - control.fallbackBaseline.x, dy: ny - control.fallbackBaseline.y };
}

async function startLocalGazeFallback(reason = "标准眼神识别不可用") {
  const control = state.gazeControl;
  const stream = await requestGazeCameraStream();
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.srcObject = stream;
  video.style.position = "fixed";
  video.style.left = "-9999px";
  video.style.width = "1px";
  video.style.height = "1px";
  const canvas = document.createElement("canvas");
  canvas.hidden = true;
  document.body.append(video, canvas);
  await video.play().catch(() => {});
  control.fallbackStream = stream;
  control.fallbackVideo = video;
  control.fallbackCanvas = canvas;
  control.fallbackBaseline = null;
  control.fallbackSamples = [];
  control.mode = "fallback";
  control.enabled = true;
  control.starting = false;
  control.cooldownUntil = Date.now() + 1200;
  setGazeStatus(`${reason}，已启用本机备用眼控。先正视单词 1 秒校准。`, "warn");
  const tick = () => {
    if (!control.enabled || control.mode !== "fallback") return;
    const estimate = estimateEyeDirectionFromVideo(video, canvas, control);
    if (estimate) {
      handleResolvedGazeTarget(fallbackTargetFromDirection(estimate.dx, estimate.dy), "备用眼控保护模式：方向明显才识别；所有按钮都需要二次确认。");
    }
    control.fallbackTimer = window.requestAnimationFrame(tick);
  };
  tick();
  updateGazeButton();
  showToast("已启用备用眼控模式");
}

async function startGazeControl() {
  const control = state.gazeControl;
  if (control.enabled || control.starting) {
    stopGazeControl();
    return;
  }
  control.starting = true;
  control.mode = "starting";
  updateGazeButton();
  if (els.gazePanel) els.gazePanel.hidden = false;
  setGazeStatus("正在检查摄像头权限。首次使用请点允许。", "");
  let permissionStream = null;
  try {
    permissionStream = await requestGazeCameraStream();
    stopMediaStream(permissionStream);
    permissionStream = null;
    setGazeStatus("摄像头已允许，最多等待 6 秒加载标准眼神识别库；失败会自动切换备用模式。", "");
    const webgazer = await Promise.race([
      ensureWebGazer(),
      new Promise((_, reject) => window.setTimeout(() => reject(new Error("标准眼神识别库加载超过 6 秒，已改用备用模式")), 6000))
    ]);
    try { webgazer.showVideoPreview?.(false); } catch (error) {}
    try { webgazer.showPredictionPoints?.(false); } catch (error) {}
    try { webgazer.showFaceOverlay?.(false); } catch (error) {}
    try { webgazer.showFaceFeedbackBox?.(false); } catch (error) {}
    webgazer.setGazeListener((data) => handleGazePoint(data));
    const result = webgazer.begin();
    if (result && typeof result.then === "function") await result;
    control.enabled = true;
    control.starting = false;
    control.mode = "webgazer";
    control.lastZone = "center";
    control.lastTargetKey = "";
    control.zoneStartedAt = Date.now();
    control.cooldownUntil = Date.now() + 1000;
    setGazeStatus("已开启保护模式：所有按钮都需要先锁定，再看同一个按钮确认。", "ok");
    showToast("眼神翻词已开启");
  } catch (error) {
    stopMediaStream(permissionStream);
    try {
      await startLocalGazeFallback(error?.message || "标准眼神识别不可用");
      return;
    } catch (fallbackError) {
      control.enabled = false;
      control.starting = false;
      control.mode = "";
      if (els.gazePanel) els.gazePanel.hidden = false;
      if (els.gazeGuide) els.gazeGuide.hidden = true;
      const message = fallbackError?.message || error?.message || "眼神翻词开启失败";
      setGazeStatus(`开启失败：${message}`, "warn");
      showToast(`眼神翻词开启失败：${message}`);
    }
  }
  updateGazeButton();
}

function undoLastReview() {
  if (!state.reviewUndo) {
    showToast("没有可撤回的上一步");
    return;
  }
  if (!guardEditable()) {
    return;
  }
  const snapshot = state.reviewUndo;
  const index = state.words.findIndex((item) => item.id === snapshot.wordId);
  if (index < 0) {
    state.reviewUndo = null;
    showToast("上一个词已经不存在，不能撤回");
    renderActiveCard();
    return;
  }
  state.words[index] = normalizeWord(snapshot.word);
  state.practiceMode = PROGRESS_MODES.includes(snapshot.practiceMode) ? snapshot.practiceMode : state.practiceMode;
  state.mode = ["due", "new", "all", "weak"].includes(snapshot.mode) ? snapshot.mode : state.mode;
  state.activeGroup = snapshot.activeGroup || state.activeGroup;
  setActiveId(snapshot.wordId);
  state.answerVisible = true;
  resetTypingState();
  state.lastAutoSpokenId = null;
  if (snapshot.sprintWasActive && state.sprint.active) {
    state.sprint.completed = Math.max(0, Number(state.sprint.completed || 0) - 1);
  }
  state.reviewUndo = null;
  saveWords();
  render();
  showToast("已撤回上一步，回到上一个词");
}

function scheduleNext(word, result, options = {}) {
  const progress = modeProgress(word);
  const completedAt = options.completedAt || nowDate();
  let nextStep = 0;
  let delay = REVIEW_STEPS[0].ms;
  let label = REVIEW_STEPS[0].label;

  if (result === "new" || result === "remember") {
    nextStep = Math.min(progress.stage + 1, REVIEW_STEPS.length - 1);
    if (progress.stage < 0) {
      nextStep = 0;
    }
    delay = REVIEW_STEPS[nextStep].ms;
    label = REVIEW_STEPS[nextStep].label;
  }

  if (result === "fuzzy") {
    nextStep = Math.max(0, progress.stage);
    delay = 8 * 60 * 1000;
    label = "8分钟";
    word.important = true;
  }

  if (result === "forgot") {
    nextStep = -1;
    delay = 2 * 60 * 1000;
    label = "2分钟";
    word.important = true;
  }

  const nextDate = new Date(completedAt.getTime() + delay);
  progress.stage = nextStep;
  progress.status = nextStep >= REVIEW_STEPS.length - 1 ? "mature" : "learning";
  progress.nextReviewAt = nextDate.toISOString();
  progress.lastStudiedAt = completedAt.toISOString();
  word.updatedAt = completedAt.toISOString();
  recordModeHistory(word, {
    time: completedAt.toISOString(),
    result,
    nextReviewAt: progress.nextReviewAt,
  });
  if (!options.silent) {
    showToast(`下次：${formatDateTime(progress.nextReviewAt)}（${label}后）`);
  }
}

function getQueue() {
  const scopedWords = practiceEligibleWords(state.words.filter(wordMatchesActiveGroup));
  if (state.sprint.active) {
    return sprintQueue(scopedWords);
  }
  const sorted = getOrderedStudyWords(scopedWords);

  if (state.mode === "new") {
    return sorted.filter((word) => statusOf(word) === "new");
  }
  if (state.mode === "all") {
    return sorted;
  }
  if (state.mode === "weak") {
    return sorted.filter(isWeakWord).sort((a, b) => weakScore(b) - weakScore(a));
  }
  return sorted.filter((word) => isDue(word));
}

function sprintQueue(words = state.words.filter(wordMatchesActiveGroup)) {
  const rank = (word) => {
    if (isDue(word)) {
      return 0;
    }
    if (word.important) {
      return 1;
    }
    if (statusOf(word) === "new") {
      return 2;
    }
    return 3;
  };
  return [...words].sort((a, b) => {
    const rankDiff = rank(a) - rank(b);
    if (rankDiff) {
      return rankDiff;
    }
    const aTime = activeModeProgress(a).nextReviewAt || "9999-12-31";
    const bTime = activeModeProgress(b).nextReviewAt || "9999-12-31";
    return aTime.localeCompare(bTime) || a.term.localeCompare(b.term, "en", { sensitivity: "base" });
  });
}

function stableRandomRank(word) {
  const seed = `${todayKey()}-${word.id || word.term}`;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function getOrderedStudyWords(words, order = state.dictationOrder) {
  const sortedByDue = [...words].sort((a, b) => {
    const ad = activeModeProgress(a).nextReviewAt || "9999-12-31";
    const bd = activeModeProgress(b).nextReviewAt || "9999-12-31";
    return ad.localeCompare(bd);
  });

  if (!["dictation", "dictationWeak"].includes(state.practiceMode)) {
    return sortedByDue.sort((a, b) => {
      const pa = priorityOf(a) === "A" ? 0 : (priorityOf(a) === "B" ? 1 : 2);
      const pb = priorityOf(b) === "A" ? 0 : (priorityOf(b) === "B" ? 1 : 2);
      return (Number(b.important) - Number(a.important)) || pa - pb || ((activeModeProgress(a).nextReviewAt || "9999-12-31").localeCompare(activeModeProgress(b).nextReviewAt || "9999-12-31"));
    });
  }

  switch (order) {
    case "important":
      return sortedByDue.sort((a, b) => Number(b.important) - Number(a.important));
    case "random":
      return sortedByDue.sort((a, b) => stableRandomRank(a) - stableRandomRank(b));
    case "az":
      return sortedByDue.sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));
    case "due":
    default:
      return sortedByDue.sort((a, b) => {
        const dueDiff = Number(isDue(b)) - Number(isDue(a));
        if (dueDiff) {
          return dueDiff;
        }
        const aTime = activeModeProgress(a).nextReviewAt || "9999-12-31";
        const bTime = activeModeProgress(b).nextReviewAt || "9999-12-31";
        return aTime.localeCompare(bTime);
      });
  }
}

function chooseActiveWord(forceFirst = false) {
  const queue = getQueue();
  if (!queue.length) {
    setActiveId(null);
    state.answerVisible = false;
    return;
  }
  const activeStillValid = queue.some((word) => word.id === state.activeId);
  if (forceFirst || !activeStillValid) {
    setActiveId(queue[0].id);
    state.answerVisible = false;
    resetTypingState();
    state.lastAutoSpokenId = null;
  }
}

function activeWord() {
  return state.words.find((word) => word.id === state.activeId) || null;
}

function render() {
  renderCloudAccessState();
  chooseActiveWord();
  renderStats();
  renderDashboard();
  renderDailyReport();
  renderClock();
  renderSprintStatus();
  updateGazeButton();
  renderModeButtons();
  renderPracticeButtons();
  renderDictationTools();
  renderLibrarySourceFilters();
  renderActiveCard();
  renderTimeline();
  renderGroupProgress();
  renderWordList();
}

function renderStats() {
  els.totalCount.textContent = state.words.length;
  els.dueCount.textContent = state.words.filter((word) => isDue(word)).length;
  els.todayCount.textContent = state.words.filter(isTodayReview).length;
  els.doneTodayCount.textContent = state.words.filter(learnedToday).length;
  renderStudyTime();
}

function renderClock() {
  els.clockNow.textContent = nowDate().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(ms) {
  const safeMs = Math.max(0, ms);
  const minutes = Math.floor(safeMs / 60000);
  const seconds = Math.floor((safeMs % 60000) / 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function endSprint() {
  if (!state.sprint.active) {
    return;
  }
  state.sprint.active = false;
  state.sprint.endsAt = "";
  state.sprint.startedAt = "";
  showToast(`15分钟冲刺结束，完成 ${state.sprint.completed} 个`);
}

function renderSprintStatus() {
  if (!els.sprintStatus) {
    return;
  }
  if (!state.sprint.active) {
    els.sprintStatus.textContent = "15分钟未开始";
    els.sprintStatus.classList.remove("active");
    return;
  }
  const remaining = new Date(state.sprint.endsAt) - nowDate();
  if (remaining <= 0) {
    endSprint();
    els.sprintStatus.textContent = `本轮完成 ${state.sprint.completed} 个`;
    els.sprintStatus.classList.remove("active");
    return;
  }
  els.sprintStatus.classList.add("active");
  els.sprintStatus.textContent = `冲刺 ${formatDuration(remaining)} · ${state.sprint.completed} 个`;
}

function todayHistoryEntries(mode = state.practiceMode) {
  const today = todayKey();
  return state.words.flatMap((word) => modeProgress(word, mode).history
    .filter((entry) => todayKey(new Date(entry.time)) === today)
    .map((entry) => ({ ...entry, word })));
}

function dailyReportStats() {
  const entries = todayHistoryEntries();
  const studiedWords = new Set(entries.map((entry) => entry.word.id));
  const reviewEntries = entries.filter((entry) => ["new", "remember", "fuzzy", "forgot"].includes(entry.result));
  const spellingEntries = entries.filter((entry) => ["spell-correct", "spell-wrong", "forms-correct", "forms-wrong"].includes(entry.result));
  const spellingCorrect = spellingEntries.filter((entry) => ["spell-correct", "forms-correct"].includes(entry.result)).length;
  const forgotten = entries.filter((entry) => ["forgot", "spell-wrong", "forms-wrong", "dictation-wrong", "choice-wrong"].includes(entry.result)).length;
  const importantNow = state.words.filter((word) => word.important).length;
  const nextReview = state.words
    .map((word) => modeProgress(word))
    .filter((progress) => progress.nextReviewAt)
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt))[0]?.nextReviewAt || "";
  syncStudyTimeDay();
  return {
    studied: studiedWords.size,
    reviews: reviewEntries.length,
    spellingTotal: spellingEntries.length,
    spellingCorrect,
    spellingRate: spellingEntries.length ? Math.round((spellingCorrect / spellingEntries.length) * 100) : 0,
    forgotten,
    importantNow,
    nextReview,
    todayStudyTime: state.studyTime?.todaySeconds || 0,
    totalStudyTime: state.studyTime?.totalSeconds || 0,
  };
}

function renderDailyReport() {
  if (!els.dailyReport) {
    return;
  }
  const report = dailyReportStats();
  els.dailyReport.innerHTML = `
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Report</p>
        <h2>今日战报</h2>
      </div>
      <span class="status-pill">${todayKey()}</span>
    </div>
    <div class="report-grid">
      <article><span>今日学习</span><strong>${report.studied}</strong><p>个词有记录</p></article>
      <article><span>今日时长</span><strong>${formatStudyTime(report.todayStudyTime)}</strong><p>总计 ${formatStudyTime(report.totalStudyTime)}</p></article>
      <article><span>复习动作</span><strong>${report.reviews}</strong><p>记完/会了/模糊/忘了</p></article>
      <article><span>拼写正确率</span><strong>${report.spellingTotal ? `${report.spellingRate}%` : "--"}</strong><p>${report.spellingCorrect}/${report.spellingTotal}</p></article>
      <article><span>忘记/拼错</span><strong>${report.forgotten}</strong><p>自动进入重点复盘</p></article>
      <article><span>重点词</span><strong>${report.importantNow}</strong><p>当前重点词本</p></article>
      <article><span>下次提醒</span><strong>${report.nextReview ? formatDateTime(report.nextReview) : "--"}</strong><p>按间隔复习生成</p></article>
    </div>`;
}

function renderModeButtons() {
  [
    [els.dueModeButton, "due"],
    [els.newModeButton, "new"],
    [els.allModeButton, "all"],
    [els.weakOnlyButton, "weak"],
  ].forEach(([button, mode]) => button?.classList.toggle("active", state.mode === mode));
}

function renderPracticeButtons() {
  document.querySelectorAll("[data-practice-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.practiceMode === state.practiceMode);
  });
}

function renderDictationTools() {
  if (!els.dictationOrderSelect) {
    return;
  }
  if (els.dictationOrderSelect.value !== state.dictationOrder) {
    els.dictationOrderSelect.value = state.dictationOrder;
  }
  const visible = ["dictation", "dictationWeak"].includes(state.practiceMode);
  els.dictationOrderSelect.closest(".dictation-tools")?.classList.toggle("is-visible", visible);
}

function renderDashboard() {
  const newCount = state.words.filter((word) => statusOf(word) === "new").length;
  const dueNow = state.words.filter((word) => isDue(word)).length;
  const todayReview = state.words.filter(isTodayReview).length;
  const important = state.words.filter((word) => word.important).length;
  const importantDue = state.words.filter((word) => word.important && (isDue(word) || statusOf(word) === "new")).length;
  const newTarget = Math.min(30, newCount);
  const reviewTarget = Math.max(dueNow, todayReview);
  const estimate = Math.max(0, Math.ceil(newTarget * 0.8 + reviewTarget * 0.45 + importantDue * 0.35));
  const examDate = new Date(`${state.settings.examDate}T00:00:00`);
  const today = new Date(`${todayKey()}T00:00:00`);
  const dayDiff = Math.ceil((examDate - today) / (24 * 60 * 60 * 1000));

  els.examDays.textContent = Number.isFinite(dayDiff) ? Math.max(0, dayDiff) : "--";
  if (els.examDateInput.value !== state.settings.examDate) {
    els.examDateInput.value = state.settings.examDate;
  }
  els.todayNewTarget.textContent = newTarget;
  els.todayReviewTarget.textContent = reviewTarget;
  els.importantCount.textContent = important;
  els.estimateMinutes.textContent = estimate;
  els.todayNewHint.textContent = newCount ? `还剩 ${newCount} 个新词，建议今天先拿下 ${newTarget} 个` : "新词清空了，今天专心复习";
  els.todayReviewHint.textContent = reviewTarget ? `现在到期 ${dueNow} 个，今日已排 ${todayReview} 个` : "暂无到期复习，等系统提醒";
}

function progressRootName(groupName = "") {
  const name = normalizeText(groupName);
  if (/^全方位/.test(name)) return "全方位";
  if (/^蓝色森林/.test(name)) return "蓝色森林";
  if (/^Word List/.test(name)) return "Word List";
  if (/^四级/.test(name)) return "四级";
  return "其他";
}

let progressGroupFilter = "全部";

function renderGroupProgress() {
  const groups = new Map();
  state.words.forEach((word) => {
    wordGroupNames(word).forEach((name) => {
      if (!groups.has(name)) groups.set(name, []);
      if (!groups.get(name).some((item) => item.id === word.id)) groups.get(name).push(word);
    });
  });

  if (!groups.size) {
    els.groupProgress.innerHTML = `<div class="group-card"><strong>暂无分组</strong><p>导入 Word List 后会显示进度</p></div>`;
    return;
  }

  const modeName = PROGRESS_MODE_LABELS[state.practiceMode] || "当前模式";
  const rootNames = ["全部", ...Array.from(new Set([...groups.keys()].map(progressRootName))).filter(Boolean)];
  if (!rootNames.includes(progressGroupFilter)) progressGroupFilter = "全部";
  const shownEntries = [...groups.entries()].filter(([name]) => progressGroupFilter === "全部" || progressRootName(name) === progressGroupFilter);
  const shownWordsRaw = progressGroupFilter === "全部" ? state.words : shownEntries.flatMap(([, words]) => words);
  const shownWords = [...new Map(shownWordsRaw.map((word) => [word.id, word])).values()];
  const learnedAll = shownWords.filter((word) => modeProgress(word).stage >= 0).length;
  const matureAll = shownWords.filter((word) => statusOf(word) === "mature").length;
  const dueAll = shownWords.filter((word) => isDue(word)).length;
  const importantAll = shownWords.filter((word) => word.important).length;
  const allPercent = shownWords.length ? Math.round((learnedAll / shownWords.length) * 100) : 0;

  const tabs = `<div class="progress-folder-tabs">${rootNames.map((name) => `<button class="progress-folder-tab ${name === progressGroupFilter ? "active" : ""}" data-progress-filter="${escapeHTML(name)}" type="button">${escapeHTML(name)}</button>`).join("")}</div>`;
  const allGroupName = progressGroupFilter === "全部" ? "all" : `__root__${progressGroupFilter}`;
  const allCard = `
      <article class="group-card progress-summary-card${state.activeGroup === allGroupName ? " active" : ""}" data-group-action="study" data-group="${escapeHTML(allGroupName)}" data-root-group="${escapeHTML(progressGroupFilter)}">
        <strong>${escapeHTML(progressGroupFilter === "全部" ? "全部词库" : progressGroupFilter + " 总进度")}</strong>
        <div class="progress-bar"><div class="progress-fill" style="width:${allPercent}%"></div></div>
        <p>${learnedAll}/${shownWords.length} 已学 · 到期 ${dueAll} · 重点 ${importantAll} · 稳定 ${matureAll}</p>
        <button class="text-button" type="button">只背这一大类</button>
      </article>`;

  const cards = shownEntries.map(([name, words]) => {
    const learned = words.filter((word) => modeProgress(word).stage >= 0).length;
    const mature = words.filter((word) => statusOf(word) === "mature").length;
    const due = words.filter((word) => isDue(word)).length;
    const important = words.filter((word) => word.important).length;
    const percent = Math.round((learned / words.length) * 100);
    return `
      <article class="group-card${state.activeGroup === name ? " active" : ""}" data-group-action="study" data-group="${escapeHTML(name)}">
        <strong>${escapeHTML(name)}</strong>
        <div class="progress-bar"><div class="progress-fill" style="width:${percent}%"></div></div>
        <p>${learned}/${words.length} 已学 · 到期 ${due} · 重点 ${important} · 稳定 ${mature}</p>
        <button class="text-button" type="button">只背本组</button>
      </article>`;
  }).join("");

  els.groupProgress.innerHTML = tabs + allCard + cards;
}

function activateModuleFromApp(name = "study") {
  const titleMap = { folder: "英语资料夹", study: "记忆训练", smart: "构词归类", progress: "学习进度", manage: "管理词库" };
  const target = titleMap[name] ? name : "study";
  document.querySelectorAll("[data-module-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.moduleTarget === target);
  });
  document.querySelectorAll("[data-module-section]").forEach((section) => {
    section.classList.toggle("active", section.dataset.moduleSection === target);
  });
  const main = document.querySelector(".workspace");
  if (main) main.dataset.activeModule = target;
  try {
    history.replaceState(null, "", `#${target}`);
  } catch {
    // hash update is cosmetic; training still works without it.
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}


const MASTERY_LEVELS = ["未学", "认识", "熟悉", "掌握", "稳定"];

function masteryIndex(level) {
  const index = MASTERY_LEVELS.indexOf(normalizeText(level));
  return index >= 0 ? index : 0;
}

function masteryClass(level) {
  return `mastery-${masteryIndex(level)}`;
}

function setMastery(word, level) {
  if (!MASTERY_LEVELS.includes(level)) {
    return;
  }
  word.mastery = level;
  if (level === "稳定") {
    word.status = "mature";
  }
  word.updatedAt = new Date().toISOString();
  saveWords();
  render();
  showToast(`已设为：${level}`);
}

function choiceOptionsFor(word) {
  const seed = normalizeText(word.term).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const candidates = state.words
    .filter((item) => item.id !== word.id && normalizeText(item.term))
    .map((item, index) => ({ item, score: Math.abs((index * 37 + seed) % 997) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((entry) => entry.item);
  const options = [word, ...candidates].slice(0, 4);
  return options
    .map((item, index) => ({ item, sortKey: (seed + index * 113) % 389 }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((entry) => entry.item);
}

function answerChoice(word, selectedTerm) {
  const correct = normalizeSpelling(selectedTerm) === normalizeSpelling(word.term);
  state.choiceResult = { selectedTerm, correct };
  state.answerVisible = true;
  const completedAt = new Date();
  if (!correct) {
    word.important = true;
    word.errorReason = word.errorReason || "忘记中文";
  }
  recordModeHistory(word, {
    time: completedAt.toISOString(),
    result: correct ? "choice-correct" : "choice-wrong",
    nextReviewAt: modeProgress(word).nextReviewAt || "",
  }, "choiceZhToEn");
  if (correct) {
    rememberReviewUndo(word, "remember");
    scheduleNext(word, modeProgress(word, "choiceZhToEn").stage < 0 ? "new" : "remember", { completedAt, silent: true });
  }
  word.updatedAt = completedAt.toISOString();
  saveWords();
  renderActiveCard();
  showToast(correct ? "选对了，自动进入下一个" : "已加入重点词");
  if (correct) {
    window.setTimeout(() => {
      if (state.choiceResult?.correct) {
        state.answerVisible = false;
        resetTypingState();
        chooseActiveWord(true);
        render();
      }
    }, 550);
  }
}

function practiceView(word) {
  const safeMeaning = word.meaning || "未填中文";
  const safeTerm = word.term || "未命名";
  const phrase = word.phrase || "";


  if (state.practiceMode === "threeStep") {
    return {
      prompt: "三步背诵",
      target: safeTerm,
      hidden: "先看英文，再点开中文和例句",
      answer: safeMeaning,
      extra: phrase ? `例句 / 搭配：${phrase}` : (word.note ? `备注：${word.note}` : ""),
    };
  }

  if (state.practiceMode === "choiceZhToEn") {
    return {
      prompt: "中文选英文",
      target: safeMeaning,
      hidden: "先选答案，再查看结果",
      answer: safeTerm,
      extra: phrase ? `搭配：${phrase}` : "",
    };
  }

  if (state.practiceMode === "multiMeaning") {
    return {
      prompt: "一词多义专项",
      target: safeTerm,
      hidden: "多义词释义已盖住",
      answer: safeMeaning,
      extra: phrase ? `常见搭配：${phrase}` : "重点看不同语境下的意思",
    };
  }

  if (state.practiceMode === "rareMeaning") {
    return {
      prompt: "熟词僻义专项",
      target: safeTerm,
      hidden: "考试义 / 僻义已盖住",
      answer: safeMeaning,
      extra: word.note ? `备注：${word.note}` : (phrase ? `搭配：${phrase}` : "不要只记最常见意思"),
    };
  }

  if (state.practiceMode === "fixedPhrase") {
    return {
      prompt: "固定搭配速记",
      target: phrase || safeTerm,
      hidden: "搭配含义已盖住",
      answer: phrase ? `${safeTerm}：${safeMeaning}` : safeMeaning,
      extra: phrase ? `固定搭配：${phrase}` : "暂无搭配，建议后续补充",
    };
  }

  if (state.practiceMode === "spellingWeak") {
    return {
      prompt: "拼写易错专项",
      target: safeMeaning,
      hidden: "英文已盖住",
      answer: safeTerm,
      extra: phrase ? `搭配：${phrase}` : "只刷拼错、模糊、重点里的拼写弱项",
    };
  }

  if (state.practiceMode === "dictationWeak") {
    return {
      prompt: "听写错词本",
      target: "先听读音，再把易错词拼出来",
      hidden: "答案已盖住",
      answer: safeTerm,
      extra: state.answerVisible ? safeMeaning : "",
    };
  }

  if (state.practiceMode === "forms") {
    return {
      prompt: "动词变形拼写",
      target: safeTerm,
      hidden: "三单 / 过去式 / 过去分词已盖住",
      answer: verbFormsAnswerText(word),
      extra: safeMeaning,
    };
  }

  if (state.practiceMode === "spell") {
    const pattern = new RegExp(escapeRegExp(safeTerm), "ig");
    const hintPhrase = phrase && pattern.test(phrase) ? phrase.replace(pattern, "____") : phrase;
    return {
      prompt: "看提示，拼出英文",
      target: safeMeaning,
      hidden: "输入英文后检查",
      answer: safeTerm,
      extra: hintPhrase ? `搭配提示：${hintPhrase}` : "",
    };
  }

  if (state.practiceMode === "dictation") {
    return {
      prompt: "听读音，拼写英文",
      target: "先听读音，再把单词或短语拼出来",
      hidden: "答案已盖住",
      answer: safeTerm,
      extra: state.answerVisible ? safeMeaning : "",
    };
  }

  if (state.practiceMode === "zhToEn") {
    return {
      prompt: "看中文，拼出英文",
      target: safeMeaning,
      hidden: "英文已盖住",
      answer: safeTerm,
      extra: phrase ? `搭配：${phrase}` : "",
    };
  }

  if (state.practiceMode === "phrase") {
    const pattern = new RegExp(escapeRegExp(safeTerm), "i");
    const blanked = phrase && pattern.test(phrase) ? phrase.replace(pattern, "____") : (phrase || safeMeaning);
    return {
      prompt: "搭配填空",
      target: blanked,
      hidden: "答案已盖住",
      answer: safeTerm,
      extra: safeMeaning,
    };
  }

  if (state.practiceMode === "enToZh") {
    return {
      prompt: "看英文，说中文",
      target: safeTerm,
      hidden: "中文已盖住",
      answer: safeMeaning,
      extra: phrase ? `搭配：${phrase}` : "",
    };
  }

  return {
    prompt: "卡片记忆",
    target: safeTerm,
    hidden: "释义已盖住",
    answer: safeMeaning,
    extra: phrase ? `搭配：${phrase}` : "",
  };
}

function renderVerbFormsBox(word) {
  if (state.practiceMode !== "forms") {
    return "";
  }
  const forms = verbForms(word);
  const drafts = state.formDrafts;
  const result = state.formResult;
  const answer = result ? `
    <div class="forms-summary ${result.correct ? "is-correct" : "is-wrong"}">
      ${result.correct ? "三个变形都拼对了" : `正确答案：${escapeHTML(verbFormsAnswerText(word))}`}
    </div>` : "";
  return `
    <div class="spell-box verb-forms-box">
      <div class="form-result-grid">
        <label>
          <span>三单</span>
          <input data-form-input="third" type="text" value="${escapeHTML(drafts.third)}" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="请输入三单">
        </label>
        <label>
          <span>过去式</span>
          <input data-form-input="past" type="text" value="${escapeHTML(drafts.past)}" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="请输入过去式">
        </label>
        <label>
          <span>过去分词</span>
          <input data-form-input="participle" type="text" value="${escapeHTML(drafts.participle)}" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="请输入过去分词">
        </label>
      </div>
      <div class="spell-actions">
        <button class="primary-button" data-card-action="check-forms" type="button">检查变形</button>
        <button class="secondary-button" data-card-action="clear-spelling" type="button">重写</button>
        <button class="secondary-button audio-button" data-card-action="speak" type="button">播放原词</button>
      </div>
      <p>三个都填对才算通过；不规则词可以在添加单词时手动填准。</p>
      ${answer}
    </div>`;
}

function renderSpellingBox(word) {
  if (!["spell", "dictation", "spellingWeak", "dictationWeak"].includes(state.practiceMode)) {
    return "";
  }
  const result = state.spellingResult;
  const value = escapeHTML(state.spellingDraft);
  const feedback = result ? `
    <div class="spell-feedback ${result.correct ? "is-correct" : "is-wrong"}">
      ${result.correct ? "拼对了" : `差一点，正确答案：${escapeHTML(word.term)}`}
    </div>` : "";
  const isDictationMode = ["dictation", "dictationWeak"].includes(state.practiceMode);
  const hint = isDictationMode
    ? "听不清可以点“播放读音”，不会就点显示答案。"
    : "大小写不影响判断，短语里的空格也会自动整理。";
  return `
    <div class="spell-box">
      <label>
        <span>${["dictation", "dictationWeak"].includes(state.practiceMode) ? "听写输入" : "拼写输入"}</span>
        <input data-spell-input type="text" value="${value}" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="在这里输入英文">
      </label>
      <div class="spell-actions">
        <button class="primary-button" data-card-action="check-spelling" type="button">检查拼写</button>
        <button class="secondary-button" data-card-action="clear-spelling" type="button">重写</button>
        <button class="secondary-button audio-button" data-card-action="speak" type="button">播放读音</button>
      </div>
      <p>${hint}</p>
      ${feedback}
    </div>`;
}


function renderThreeStepBox(word, view) {
  const step = Number(state.revealStep || 0);
  const meaning = step >= 1 ? `<div class="three-step-reveal"><b>中文释义</b><p>${escapeHTML(view.answer)}</p></div>` : `<div class="answer-mask">第2步：中文已盖住</div>`;
  const examples = step >= 2 ? `<div class="three-step-reveal"><b>例句 / 搭配 / 备注</b><p>${escapeHTML(view.extra || word.note || "暂无例句，后续可继续补")}</p></div>` : `<div class="answer-mask">第3步：例句和备注已盖住</div>`;
  return `
    <div class="three-step-box">
      <div class="three-step-head"><span class="step-dot active">1</span><span class="step-dot ${step >= 1 ? "active" : ""}">2</span><span class="step-dot ${step >= 2 ? "active" : ""}">3</span></div>
      ${meaning}
      ${examples}
      <div class="spell-actions">
        <button class="primary-button" data-card-action="next-reveal" type="button">${step < 1 ? "显示中文" : (step < 2 ? "显示例句" : "已全部显示")}</button>
        <button class="secondary-button" data-card-action="reset-reveal" type="button">重新盖住</button>
      </div>
    </div>`;
}

function renderChoiceBox(word) {
  const options = choiceOptionsFor(word);
  const result = state.choiceResult;
  return `
    <div class="choice-box">
      <p class="choice-tip">根据中文释义选出正确英文。</p>
      <div class="choice-grid">
        ${options.map((option, index) => {
          const selected = result && normalizeSpelling(result.selectedTerm) === normalizeSpelling(option.term);
          const correct = normalizeSpelling(option.term) === normalizeSpelling(word.term);
          const klass = result ? (correct ? "is-correct" : (selected ? "is-wrong" : "")) : "";
          return `<button class="choice-option ${klass}" data-card-action="choice:${encodeURIComponent(option.term)}" type="button"><span>${String.fromCharCode(65 + index)}.</span>${escapeHTML(option.term)}</button>`;
        }).join("")}
      </div>
      ${result ? `<div class="choice-result ${result.correct ? "is-correct" : "is-wrong"}">${result.correct ? "选对了" : `选错了，正确答案：${escapeHTML(word.term)}`}</div>` : ""}
    </div>`;
}

function renderMasteryBox(word) {
  const level = normalizeText(word.mastery || "未学");
  return `
    <div class="mastery-box ${masteryClass(level)}">
      <div class="mastery-title"><span>掌握等级</span><b>${escapeHTML(level)}</b></div>
      <div class="mastery-buttons">
        ${MASTERY_LEVELS.map((item) => `<button class="mini-pill ${item === level ? "active" : ""}" data-card-action="set-mastery:${escapeHTML(item)}" type="button">${escapeHTML(item)}</button>`).join("")}
      </div>
    </div>`;
}


function compactMeaningParts(word) {
  const raw = normalizeText(word?.meaning || word?.phrase || word?.note || "");
  if (!raw) return [];
  const posRegex = /\b(?:exclamation|modal|aux|prep|pron|conj|det|num|adj|adv|vt|vi|n|v|int|art)\./gi;
  const matches = [...raw.matchAll(posRegex)].map((match) => ({ label: match[0], index: match.index }));
  const cleanDefinition = (text) => normalizeText(text)
    .replace(/^[\s:：,，;；、.。/／-]+/, "")
    .split(/[；;，,、。]/)
    .map((item) => normalizeText(item).replace(/^\(?[^\u4e00-\u9fa5A-Za-z0-9]+/, ""))
    .find(Boolean) || "";
  const normalizeLabels = (labels) => {
    const seen = new Set();
    return labels
      .map((label) => normalizeText(label).toLowerCase())
      .filter((label) => {
        if (!label || seen.has(label)) return false;
        seen.add(label);
        return true;
      })
      .join("/");
  };
  const parts = [];
  if (!matches.length) {
    const fallback = cleanDefinition(raw);
    return fallback ? [{ label: "释义", text: fallback }] : [];
  }
  let pendingLabels = [];
  for (let i = 0; i < matches.length; i += 1) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : raw.length;
    const segment = raw.slice(start, end);
    const labels = [...segment.matchAll(posRegex)].map((match) => match[0]);
    const afterLabel = segment.replace(new RegExp(`^(?:\\s|/|／|、|,|，|;|；|和|及|or|and|${labels.map(escapeRegExp).join("|")})+`, "i"), "");
    const definition = cleanDefinition(afterLabel);
    if (!definition) {
      pendingLabels.push(...labels);
      continue;
    }
    const label = normalizeLabels([...pendingLabels, ...labels]) || "释义";
    pendingLabels = [];
    if (!parts.some((item) => item.label === label && item.text === definition)) {
      parts.push({ label, text: definition });
    }
    if (parts.length >= 4) break;
  }
  return parts;
}

function renderPreviousWordHint() {
  const previous = state.reviewUndo?.word;
  if (!previous) return "";
  const parts = compactMeaningParts(previous);
  if (!parts.length) return "";
  return `
    <div class="previous-word-hint">
      <span class="previous-word-label">上一个</span>
      <b>${escapeHTML(previous.term || "上一词")}</b>
      <span>${parts.map((part) => `${escapeHTML(part.label)} ${escapeHTML(part.text)}`).join(" · ")}</span>
    </div>`;
}

function extractWordPhonetic(word) {
  const candidates = [word?.phonetic, word?.ipa, word?.pronunciation, word?.note, word?.phrase]
    .filter(Boolean)
    .map((value) => String(value));
  for (const value of candidates) {
    const match = value.match(/\/[A-Za-zɑɒæʌɔəɜː:ɪiʊuɛeɡθðʃʒŋˈˌ\'`\.\-\s\(\)r]+\//);
    if (match && match[0].length >= 4 && match[0].length <= 48) {
      return match[0].replace(/\s+/g, "");
    }
  }
  return "";
}

function renderAudioButton(label, action, phonetic) {
  const phoneticText = phonetic ? `<small>${escapeHTML(phonetic)}</small>` : "";
  return `<button class="secondary-button audio-button phonetic-audio" data-card-action="${escapeHTML(action)}" type="button"><span>${escapeHTML(label)}</span>${phoneticText}</button>`;
}

function renderLayeredMeaning(answerText) {
  const parts = meaningSegments(answerText);
  if (parts.length <= 1) {
    return `<p class="word-meaning">${escapeHTML(answerText)}</p>`;
  }
  const labels = ["核心义", "常考义", "扩展义"];
  return `<div class="meaning-layers">${parts.slice(0, 5).map((part, index) => `<p><b>${labels[index] || "补充义"}</b><span>${escapeHTML(part)}</span></p>`).join("")}</div>`;
}

function renderErrorReasonBox(word) {
  if (!state.answerVisible && !word.important) return "";
  const reasons = ["忘记中文", "拼写不熟", "相似词混了", "听音不熟", "一词多义", "搭配没记住"];
  const current = normalizeText(word.errorReason || "");
  return `<div class="error-reason-box"><span>错词原因</span>${reasons.map((reason) => `<button class="mini-pill ${current === reason ? "active" : ""}" data-card-action="set-error-reason:${escapeHTML(reason)}" type="button">${escapeHTML(reason)}</button>`).join("")}</div>`;
}


function renderPlainListCard() {
  const queue = getQueue().slice(0, 14);
  if (!queue.length) {
    els.activeCard.innerHTML = `<div class="empty-card"><div><h3>纯文字速刷暂无单词</h3><p>切换到新词记忆、全部抽查或只背不会的继续。</p></div></div>`;
    return;
  }
  els.activeCard.innerHTML = `
    <div class="plain-speed-card">
      <div class="plain-speed-head"><h3>纯文字速刷</h3><p>一屏多词，适合快速过重点和到期词。</p></div>
      <div class="plain-speed-list">
        ${queue.map((word) => `<article class="plain-speed-row" data-id="${escapeHTML(word.id)}"><b>${escapeHTML(word.term)}</b><span>${escapeHTML(meaningSegments(word.meaning)[0] || word.meaning || word.phrase || "未填释义")}</span><em>${priorityOf(word)}级</em><div><button data-card-action="studyword:${escapeHTML(word.id)}:remember" class="primary-button" type="button">记完</button><button data-card-action="studyword:${escapeHTML(word.id)}:fuzzy" class="secondary-button" type="button">模糊</button><button data-card-action="studyword:${escapeHTML(word.id)}:forgot" class="danger-button" type="button">忘了</button></div></article>`).join("")}
      </div>
    </div>`;
}

function renderActiveCard() {
  const word = activeWord();
  if (!word) {
    const message = state.practiceMode === "forms" && state.words.length ? "当前没有可练的动词变形" : (state.words.length ? "现在没有到期词" : "先加入第一批单词");
    const detail = state.practiceMode === "forms" && state.words.length ? "短语不会进入变形练习；可以切换 Word List 或添加单个动词" : (state.words.length ? "切到“新词记忆”或“全部抽查”继续" : "把你发来的单词和短语放进词库");
    els.activeCard.innerHTML = `
      <div class="empty-card">
        <div>
          <h3>${message}</h3>
          <p>${detail}</p>
          <button class="primary-button" data-card-action="new-mode">新词记忆</button>
        </div>
      </div>`;
    return;
  }

  const progress = activeModeProgress(word);
  const status = statusOf(word);
  if (state.practiceMode === "plainList") {
    renderPlainListCard();
    return;
  }
  const typingMode = ["spell", "dictation", "forms", "spellingWeak", "dictationWeak"].includes(state.practiceMode);
  const letters = typingMode ? [] : word.term.replace(/[^a-zA-Z]/g, "").slice(0, 9).split("");
  const ribbon = typingMode
    ? (state.practiceMode === "forms" ? "<span>F</span><span>O</span><span>R</span><span>M</span>" : "<span>S</span><span>P</span><span>E</span><span>L</span><span>L</span>")
    : (letters.length ? letters.map((letter) => `<span>${escapeHTML(letter)}</span>`).join("") : "<span>W</span><span>O</span><span>R</span><span>D</span>");
  const view = practiceView(word);
  const choiceBox = state.practiceMode === "choiceZhToEn" ? renderChoiceBox(word) : "";
  const previousHint = renderPreviousWordHint();
  const phonetic = extractWordPhonetic(word);
  const threeStepBox = state.practiceMode === "threeStep" ? renderThreeStepBox(word, view) : "";
  const answer = state.practiceMode === "threeStep" ? "" : (state.answerVisible ? renderLayeredMeaning(view.answer) : `<div class="answer-mask">${escapeHTML(view.hidden)}</div>`);
  const extra = state.practiceMode === "threeStep" ? "" : (state.answerVisible && view.extra ? `<p class="word-phrase">${escapeHTML(view.extra)}</p>` : "");
  const note = state.practiceMode === "threeStep" ? "" : (state.answerVisible && word.note ? `<p class="word-note">备注：${escapeHTML(word.note)}</p>` : "");
  const important = word.important ? `<p class="important-line">重点词</p>` : "";
  const masteryBox = renderMasteryBox(word);
  const errorReasonBox = renderErrorReasonBox(word);
  const spellingBox = state.practiceMode === "forms" ? renderVerbFormsBox(word) : renderSpellingBox(word);
  const undoDisabled = state.reviewUndo ? "" : "disabled";
  const quickActions = `
    <div class="quick-review-actions action-grid-v59 action-grid-v61">
      <button class="primary-button" data-card-action="remember">${progress.stage < 0 ? "记完" : "会了"}</button>
      <button class="secondary-button" data-card-action="fuzzy">模糊</button>
      <button class="secondary-button meaning-button" data-card-action="show">${state.answerVisible ? "隐藏词义" : "显示词义"}</button>
      <button class="secondary-button" data-card-action="undo-review" ${undoDisabled}>撤回上一个</button>
      ${renderAudioButton("美音", "speak", phonetic)}
      <button class="danger-button" data-card-action="forgot">忘了</button>
      <span class="action-spacer" aria-hidden="true"></span>
      ${renderAudioButton("英音", "speak-uk", phonetic)}
      <span class="action-spacer" aria-hidden="true"></span>
    </div>`;

  els.activeCard.innerHTML = `
    <div class="card-top">
      <div class="letter-ribbon">${ribbon}</div>
      ${previousHint}
      <p class="quiz-prompt">${escapeHTML(view.prompt)}</p>
      <h3 class="${state.practiceMode === "card" || state.practiceMode === "enToZh" ? "word-term" : "quiz-target"}">${escapeHTML(view.target)}</h3>
      ${quickActions}
      ${spellingBox}
      ${choiceBox}
      ${threeStepBox}
      ${answer}
      ${extra}
      ${note}
      ${important}
      ${errorReasonBox}
      ${masteryBox}
      <p class="next-line">下次：${formatDateTime(progress.nextReviewAt)} · ${statusLabel(status)}</p>
    </div>
    <div class="card-bottom">
      <div class="stage-track">${REVIEW_STEPS.map((_, index) => `<span class="stage-dot${index <= progress.stage ? " active" : ""}"></span>`).join("")}</div>
      <div class="card-actions">
        <button class="secondary-button" data-card-action="toggle-important">${word.important ? "取消重点" : "标重点"}</button>
      </div>
    </div>`;

  updateGazeGuidePosition();

  if (["dictation", "dictationWeak"].includes(state.practiceMode) && state.lastAutoSpokenId !== word.id) {
    state.lastAutoSpokenId = word.id;
    window.setTimeout(() => speakTerm(word.term, { silent: true, accent: "us" }), 120);
  }
}

function renderTimeline() {
  const todayWords = state.words
    .filter(isTodayReview)
    .filter(wordMatchesActiveGroup)
    .sort((a, b) => activeModeProgress(a).nextReviewAt.localeCompare(activeModeProgress(b).nextReviewAt));

  if (!todayWords.length) {
    els.todayTimeline.innerHTML = `<div class="time-slot"><strong>今天</strong><div><span>暂无安排</span></div></div>`;
    return;
  }

  els.todayTimeline.innerHTML = todayWords.slice(0, 18).map((word) => `
    <div class="time-slot">
      <strong>${formatTime(activeModeProgress(word).nextReviewAt)}</strong>
      <div>
        <span>${escapeHTML(word.term)}</span>
        <span>${escapeHTML(word.meaning || word.phrase || "未填释义")}</span>
      </div>
    </div>`).join("");
}

function filteredWords() {
  const query = state.query.toLowerCase();
  return state.words
    .filter((word) => {
      const forms = verbForms(word);
      const text = [word.term, word.meaning, word.phrase, word.note, word.tag, ...wordSources(word), forms.third, forms.past, forms.participle].join(" ").toLowerCase();
      const matchesQuery = !query || text.includes(query);
      const status = statusOf(word);
      const matchesFilter = state.filter === "all" || status === state.filter || (state.filter === "important" && word.important);
      const matchesSource = state.librarySourceFilter === "all" || wordSources(word).includes(state.librarySourceFilter);
      return matchesQuery && matchesFilter && matchesSource && wordMatchesActiveGroup(word);
    })
    .sort((a, b) => {
      const statusDiff = Number(isDue(b)) - Number(isDue(a));
      if (statusDiff) {
        return statusDiff;
      }
      return (activeModeProgress(a).nextReviewAt || "9999").localeCompare(activeModeProgress(b).nextReviewAt || "9999");
    });
}

function renderWordList() {
  const words = filteredWords();
  if (!words.length) {
    els.wordList.innerHTML = `<div class="empty-card"><div><h3>没有匹配的单词</h3><p>换一个分组、状态或搜索词再看</p></div></div>`;
    return;
  }

  const limit = Math.max(20, state.wordListLimit || 40);
  const visibleWords = words.slice(0, limit);
  const hiddenCount = Math.max(0, words.length - visibleWords.length);

  const summary = `
    <div class="light-list-summary">
      <strong>当前只显示 ${visibleWords.length} / ${words.length} 个</strong>
      <span>为了手机不卡，列表不会一次性渲染全部单词。想找具体单词请用搜索。</span>
    </div>`;

  const rows = visibleWords.map((word) => {
    const status = statusOf(word);
    const progress = activeModeProgress(word);
    return `
      <article class="word-row" data-id="${escapeHTML(word.id)}">
        <div>
          <strong>${maskedText(word.term, "english")}</strong>
          ${wordSources(word).map((source) => `<span class="source-pill">${escapeHTML(source)}</span>`).join("")}
          <p>${escapeHTML(word.tag || "未标记")}</p>
        </div>
        <div>
          <p>${maskedText(word.meaning || "未填中文", "chinese")}</p>
          <p>${escapeHTML(word.phrase || "")}</p>
        </div>
        <div>
          <span class="status-pill status-${status}">${statusLabel(status)}</span>
          ${word.important ? `<span class="status-pill status-important">重点</span>` : ""}
          <p>${formatDateTime(progress.nextReviewAt)}</p>
        </div>
        <div class="mini-actions">
          <button class="secondary-button" data-row-action="study">打开</button>
          <button class="secondary-button" data-row-action="important">${word.important ? "取消重点" : "重点"}</button>
          <button class="danger-button" data-row-action="delete">删</button>
        </div>
      </article>`;
  }).join("");

  const more = hiddenCount ? `
    <div class="light-load-more">
      <button class="secondary-button" data-row-action="load-more" type="button">再显示 40 个</button>
      <p>还有 ${hiddenCount} 个未显示。搜索结果仍然会从全部词库里找，不会漏。</p>
    </div>` : "";

  els.wordList.innerHTML = summary + rows + more;
}

function clearForm() {
  els.wordForm.reset();
  els.termInput.focus();
}

function wordFromForm() {
  const now = new Date().toISOString();
  return normalizeWord({
    id: createId(),
    term: normalizeText(els.termInput.value),
    meaning: normalizeText(els.meaningInput.value),
    phrase: normalizeText(els.phraseInput.value),
    tag: normalizeText(els.tagInput.value),
    source: els.sourceInput.value,
    note: normalizeText(els.noteInput.value),
    forms: {
      third: normalizeText(els.thirdPersonInput.value),
      past: normalizeText(els.pastTenseInput.value),
      participle: normalizeText(els.pastParticipleInput.value),
    },
    status: "new",
    stage: -1,
    createdAt: now,
    updatedAt: now,
  });
}

function addWord(event) {
  event.preventDefault();
  if (!guardEditable()) {
    return;
  }
  const word = wordFromForm();
  if (!word.term) {
    return;
  }
  state.words.unshift(word);
  saveWords();
  clearForm();
  setStudyMode("new");
  setActiveId(word.id);
  state.answerVisible = false;
  render();
  showToast("已加入词库");
}

function splitImportLine(line) {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }
  let parts = [];
  if (trimmed.includes("|")) {
    parts = trimmed.split("|");
  } else if (trimmed.includes("\t")) {
    parts = trimmed.split("\t");
  } else if (/\s[-—]\s/.test(trimmed)) {
    parts = trimmed.split(/\s[-—]\s/);
  } else {
    parts = trimmed.split(/[,，；;]/);
  }
  parts = parts.map(normalizeText).filter(Boolean);
  const hasForms = parts.length >= 6;
  return {
    term: parts[0] || trimmed,
    meaning: parts[1] || "",
    phrase: parts[2] || "",
    forms: hasForms ? {
      third: parts[3] || "",
      past: parts[4] || "",
      participle: parts[5] || "",
    } : emptyVerbForms(),
    note: (hasForms ? parts.slice(6) : parts.slice(3)).join("；"),
  };
}

function bulkAdd() {
  if (!guardEditable()) {
    return;
  }
  const lines = els.bulkInput.value.split(/\r?\n/).map(splitImportLine).filter(Boolean);
  if (!lines.length) {
    showToast("没有识别到单词");
    return;
  }
  const now = new Date().toISOString();
  const existing = new Set(state.words.map((word) => word.term.toLowerCase()));
  const created = lines
    .filter((item) => item.term && !existing.has(item.term.toLowerCase()))
    .map((item) => normalizeWord({
      id: createId(),
      term: item.term,
      meaning: item.meaning,
      phrase: item.phrase,
      source: els.bulkSourceInput.value,
      forms: item.forms,
      note: item.note,
      tag: "导入",
      status: "new",
      stage: -1,
      createdAt: now,
      updatedAt: now,
    }));
  state.words = dedupeRuntimeWords([...created, ...state.words]);
  saveWords();
  els.bulkInput.value = "";
  setStudyMode("new");
  setActiveId(created[0]?.id || state.activeId);
  state.answerVisible = false;
  render();
  showToast(`已加入 ${created.length} 个词条`);
}

function handleCardAction(action) {
  if (action === "new-mode") {
    setMode("new");
    return;
  }
  if (action === "undo-review") {
    undoLastReview();
    return;
  }
  if (action.startsWith("studyword:")) {
    if (!guardEditable()) return;
    const [, id, result] = action.split(":");
    const targetWord = state.words.find((item) => item.id === id);
    if (!targetWord || !["remember", "fuzzy", "forgot"].includes(result)) return;
    state.activeId = targetWord.id;
    rememberReviewUndo(targetWord, result);
    scheduleNext(targetWord, modeProgress(targetWord).stage < 0 && result === "remember" ? "new" : result, { silent: true });
    saveWords();
    state.answerVisible = false;
    resetTypingState();
    render();
    showToast(result === "remember" ? "已记完" : (result === "fuzzy" ? "已加入模糊复习" : "已加入重点复习"));
    return;
  }
  const word = activeWord();
  if (!word) {
    return;
  }
  if (action === "speak") {
    speakTerm(word.term, { accent: "us" });
    return;
  }
  if (action === "next-reveal") {
    state.revealStep = Math.min(2, Number(state.revealStep || 0) + 1);
    renderActiveCard();
    return;
  }
  if (action === "reset-reveal") {
    state.revealStep = 0;
    state.answerVisible = false;
    renderActiveCard();
    return;
  }
  if (action.startsWith("set-error-reason:")) {
    if (!guardEditable()) return;
    word.errorReason = action.slice("set-error-reason:".length);
    word.important = true;
    word.updatedAt = new Date().toISOString();
    saveWords();
    renderActiveCard();
    showToast(`已标记原因：${word.errorReason}`);
    return;
  }
  if (action.startsWith("set-mastery:")) {
    if (!guardEditable()) {
      return;
    }
    setMastery(word, action.slice("set-mastery:".length));
    return;
  }
  if (action.startsWith("choice:")) {
    if (!guardEditable()) {
      return;
    }
    answerChoice(word, decodeURIComponent(action.slice("choice:".length)));
    return;
  }
  if (action === "speak-uk") {
    speakTerm(word.term, { accent: "uk" });
    return;
  }
  if (["check-spelling", "check-forms", "toggle-important", "remember", "fuzzy", "forgot"].includes(action) && !guardEditable()) {
    return;
  }
  if (action === "check-spelling") {
    const correct = isSpellingCorrect(state.spellingDraft, word);
    const completedAt = new Date().toISOString();
    state.spellingResult = { correct };
    state.answerVisible = true;
    recordModeHistory(word, {
      time: completedAt,
      result: correct ? (["dictation", "dictationWeak"].includes(state.practiceMode) ? "dictation-correct" : "spell-correct") : (["dictation", "dictationWeak"].includes(state.practiceMode) ? "dictation-wrong" : "spell-wrong"),
      nextReviewAt: modeProgress(word).nextReviewAt || "",
    });
    if (!correct) {
      word.important = true;
    }
    word.updatedAt = completedAt;
    saveWords();
    render();
    showToast(correct ? "拼对了" : "已标为重点，等会儿再听写");
    return;
  }
  if (action === "check-forms") {
    const correct = isVerbFormsCorrect(state.formDrafts, word);
    const completedAt = new Date().toISOString();
    state.formResult = { correct };
    state.answerVisible = true;
    recordModeHistory(word, {
      time: completedAt,
      result: correct ? "forms-correct" : "forms-wrong",
      nextReviewAt: modeProgress(word).nextReviewAt || "",
    });
    if (!correct) {
      word.important = true;
    }
    word.updatedAt = completedAt;
    saveWords();
    render();
    showToast(correct ? "变形拼对了" : "变形有错，已放进重点复盘");
    return;
  }
  if (action === "clear-spelling") {
    resetTypingState();
    state.answerVisible = false;
    renderActiveCard();
    return;
  }
  if (action === "show") {
    state.answerVisible = !state.answerVisible;
    renderActiveCard();
    return;
  }
  if (action === "toggle-important") {
    word.important = !word.important;
    word.updatedAt = new Date().toISOString();
    saveWords();
    render();
    showToast(word.important ? "已加入重点词" : "已取消重点");
    return;
  }
  if (["remember", "fuzzy", "forgot"].includes(action)) {
    const progress = activeModeProgress(word);
    rememberReviewUndo(word, action);
    scheduleNext(word, progress.stage < 0 && action === "remember" ? "new" : action);
    if (state.sprint.active) {
      state.sprint.completed += 1;
    }
    saveWords();
    state.answerVisible = false;
    resetTypingState();
    chooseActiveWord(true);
    render();
  }
}

function setMode(mode) {
  setStudyMode(mode);
  state.answerVisible = false;
  resetTypingState();
  state.lastAutoSpokenId = null;
  render();
}

function startSprint() {
  if (state.sprint.active) {
    endSprint();
    render();
    return;
  }
  const now = nowDate();
  state.sprint = {
    active: true,
    startedAt: now.toISOString(),
    endsAt: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
    completed: 0,
  };
  setStudyMode("all");
  state.answerVisible = false;
  resetTypingState();
  state.lastAutoSpokenId = null;
  render();
  showToast("15分钟冲刺开始：到期 → 重点 → 新词");
}

function startNewWords() {
  const newWords = state.words.filter((word) => statusOf(word) === "new" && wordMatchesActiveGroup(word));
  if (!newWords.length) {
    showToast("没有新词了");
    return;
  }
  setMode("new");
}

function batchLearnNewWords() {
  if (!guardEditable()) {
    return;
  }
  const visibleNew = filteredWords().filter((word) => statusOf(word) === "new");
  const words = visibleNew.length ? visibleNew : state.words.filter((word) => statusOf(word) === "new" && wordMatchesActiveGroup(word));
  if (!words.length) {
    showToast("没有新词需要安排");
    return;
  }

  const scope = visibleNew.length === words.length && (state.query || state.filter !== "all") ? "当前筛选的新词" : "所有新词";
  if (!confirm(`把${scope}（${words.length} 个）全部标为已记完，并从现在开始安排 20 分钟后的第一次复习？`)) {
    return;
  }

  const completedAt = nowDate();
  words.forEach((word) => scheduleNext(word, "new", { completedAt, silent: true }));
  saveWords();
  setStudyMode("due");
  state.answerVisible = false;
  render();
  showToast(`已安排 ${words.length} 个新词：${formatDateTime(activeModeProgress(words[0]).nextReviewAt)} 复习`);
}

function deleteWord(id) {
  if (!guardEditable()) {
    return;
  }
  const word = state.words.find((item) => item.id === id);
  if (!word) {
    return;
  }
  if (!confirm(`删除「${word.term}」？`)) {
    return;
  }
  state.words = state.words.filter((item) => item.id !== id);
  saveWords();
  if (state.activeId === id) {
    setActiveId(null);
  }
  render();
  showToast("已删除");
}

function exportWords() {
  const payload = {
    app: "专升本单词记忆",
    version: 1,
    reviewSteps: REVIEW_STEPS.map((step) => step.label),
    exportedAt: new Date().toISOString(),
    studyTime: state.studyTime,
    words: state.words,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `专升本单词本机备份-${todayKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importWords(event) {
  if (!guardEditable()) {
    event.target.value = "";
    return;
  }
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const incoming = Array.isArray(parsed) ? parsed : parsed.words;
    if (!Array.isArray(incoming)) {
      throw new Error("Invalid file");
    }
    const records = incoming.map(normalizeWord).filter((word) => word.term);
    const existingTerms = new Set(state.words.map((word) => normalizeText(word.term).toLowerCase()).filter(Boolean));
    const seenTerms = new Set();
    let internalDuplicate = 0;
    const uniqueRecords = [];
    records.forEach((word) => {
      const key = normalizeText(word.term).toLowerCase();
      if (seenTerms.has(key)) {
        internalDuplicate += 1;
        return;
      }
      seenTerms.add(key);
      uniqueRecords.push(word);
    });
    const duplicateExisting = uniqueRecords.filter((word) => existingTerms.has(normalizeText(word.term).toLowerCase())).length;
    const newCount = uniqueRecords.length - duplicateExisting;
    const replace = confirm(`导入前预览：
文件词条：${incoming.length}
有效词条：${records.length}
文件内部重复：${internalDuplicate}
和当前词库重复：${duplicateExisting}
预计新增：${newCount}

确定=替换当前词库；取消=合并导入并自动去重。`);
    if (replace) {
      state.words = dedupeRuntimeWords(uniqueRecords);
    } else {
      const byTerm = new Map(state.words.map((word) => [normalizeText(word.term).toLowerCase(), word]));
      uniqueRecords.reverse().forEach((word) => {
        const key = normalizeText(word.term).toLowerCase();
        if (byTerm.has(key)) {
          const old = byTerm.get(key);
          old.meaning = old.meaning || word.meaning;
          old.phrase = old.phrase || word.phrase;
          old.note = old.note || word.note;
          old.sources = Array.from(new Set([...(old.sources || []), ...(word.sources || []), word.source, old.source].filter(Boolean)));
          old.updatedAt = new Date().toISOString();
        } else {
          state.words.unshift(word);
          byTerm.set(key, word);
        }
      });
    }
    saveWords();
    if (parsed.studyTime) {
      state.studyTime = normalizeStudyTime(parsed.studyTime);
      saveStudyTime();
    }
    setActiveId(null);
    render();
    showToast("导入完成：数据已进入当前网址的本机记录");
  } catch {
    showToast("导入失败，请选择正确的词库文件");
  } finally {
    event.target.value = "";
  }
}

function planText() {
  const items = state.words
    .filter(wordMatchesActiveGroup)
    .filter(isTodayReview)
    .sort((a, b) => activeModeProgress(a).nextReviewAt.localeCompare(activeModeProgress(b).nextReviewAt));
  if (!items.length) {
    return "今天暂无单词复习安排。";
  }
  return items.map((word) => `${formatTime(activeModeProgress(word).nextReviewAt)}  ${word.term}  ${word.meaning || word.phrase || ""}`).join("\n");
}

async function copyPlan() {
  const text = planText();
  try {
    await navigator.clipboard.writeText(text);
    showToast("今日计划已复制");
  } catch {
    showToast(text);
  }
}


function fingerActionLabel(action) {
  const labels = {
    remember: "记完",
    fuzzy: "模糊",
    forgot: "忘了",
    "undo-review": "撤回上一个",
    show: state.answerVisible ? "隐藏释义" : "显示释义",
  };
  return labels[action] || action;
}

function setFingerStatus(message, tone = "") {
  if (els.gazeStatus) els.gazeStatus.textContent = message;
  if (els.gazePanel) els.gazePanel.dataset.tone = tone;
}

function startFingerControl() {
  showToast("手指翻词已关闭：当前版本优先保证按钮稳定和显示词义。");
  return;
  const control = state.fingerControl;
  if (control.enabled) {
    stopFingerControl();
    return;
  }
  try { stopGazeControl(""); } catch (error) {}
  control.enabled = true;
  control.pointerId = null;
  control.pendingAction = "";
  control.pendingLabel = "";
  control.pendingUntil = 0;
  if (els.gazePanel) els.gazePanel.hidden = false;
  if (els.gazeGuide) els.gazeGuide.hidden = true;
  setFingerStatus("手指翻词已开启：轻点卡片空白处显示释义；右滑两次记完，左滑两次忘了，上滑两次模糊，下滑两次撤回。", "ok");
  updateGazeButton();
  showToast("手指翻词已开启，不需要摄像头");
}

function stopFingerControl(message = "已关闭手指翻词") {
  const control = state.fingerControl;
  if (!control) return;
  control.enabled = false;
  control.pointerId = null;
  control.pendingAction = "";
  control.pendingLabel = "";
  control.pendingUntil = 0;
  document.querySelectorAll(".finger-armed").forEach((node) => node.classList.remove("finger-armed"));
  if (els.gazePanel) els.gazePanel.hidden = true;
  updateGazeButton();
  if (message) showToast(message);
}

function isFingerIgnoredTarget(target) {
  return Boolean(target?.closest?.("button, input, textarea, select, a, [contenteditable='true'], [data-card-action], [data-row-action]"));
}

function clearFingerArmed() {
  document.querySelectorAll(".finger-armed").forEach((node) => node.classList.remove("finger-armed"));
}

function armFingerAction(action, label, directionText) {
  const control = state.fingerControl;
  const now = Date.now();
  const samePending = control.pendingAction === action && now < control.pendingUntil;
  const button = els.activeCard?.querySelector(`[data-card-action="${action}"]`);
  clearFingerArmed();
  if (samePending) {
    control.pendingAction = "";
    control.pendingLabel = "";
    control.pendingUntil = 0;
    handleCardAction(action);
    setFingerStatus(`已执行：${label}`, "ok");
    return;
  }
  control.pendingAction = action;
  control.pendingLabel = label;
  control.pendingUntil = now + 3800;
  button?.classList.add("finger-armed");
  setFingerStatus(`${directionText}已锁定：${label}。3.8 秒内再滑一次同方向才执行。`, "warn");
  showToast(`再${directionText}一次确认：${label}`);
}

function handleFingerGesture(action, directionText) {
  if (!action) return;
  if (action === "show") {
    handleCardAction("show");
    setFingerStatus(`${fingerActionLabel("show")}已执行。`, "ok");
    return;
  }
  armFingerAction(action, fingerActionLabel(action), directionText);
}

function onFingerPointerDown(event) {
  const control = state.fingerControl;
  if (!control?.enabled || !els.activeCard?.contains(event.target)) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (isFingerIgnoredTarget(event.target)) return;
  control.pointerId = event.pointerId;
  control.startX = event.clientX;
  control.startY = event.clientY;
  control.startedAt = Date.now();
}

function onFingerPointerUp(event) {
  const control = state.fingerControl;
  if (!control?.enabled || control.pointerId !== event.pointerId) return;
  const dx = event.clientX - control.startX;
  const dy = event.clientY - control.startY;
  const elapsed = Date.now() - control.startedAt;
  control.pointerId = null;
  if (elapsed > 1600) return;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const minSwipe = 72;
  if (Math.max(absX, absY) < 28) {
    handleFingerGesture("show", "轻点");
    return;
  }
  if (Math.max(absX, absY) < minSwipe) return;
  if (absX > absY * 1.25) {
    if (dx > 0) handleFingerGesture("remember", "右滑");
    else handleFingerGesture("forgot", "左滑");
    return;
  }
  if (absY > absX * 1.25) {
    if (dy < 0) handleFingerGesture("fuzzy", "上滑");
    else handleFingerGesture("undo-review", "下滑");
  }
}

function onFingerPointerCancel(event) {
  const control = state.fingerControl;
  if (!control?.enabled) return;
  if (control.pointerId === event.pointerId) control.pointerId = null;
}

function wireEvents() {
  els.wordForm.addEventListener("submit", addWord);
  els.clearFormButton.addEventListener("click", clearForm);
  els.bulkAddButton.addEventListener("click", bulkAdd);
  els.clearBulkButton.addEventListener("click", () => {
    els.bulkInput.value = "";
    els.bulkInput.focus();
  });
  els.gazeControlButton?.addEventListener("click", startFingerControl);
  els.gazeStopButton?.addEventListener("click", () => stopFingerControl());
  window.addEventListener("resize", () => updateGazeGuidePosition());
  window.addEventListener("scroll", () => {
    if (state.gazeControl?.enabled || state.gazeControl?.starting) updateGazeGuidePosition();
  }, { passive: true });
  els.activeCard.addEventListener("pointerdown", onFingerPointerDown, { passive: true });
  els.activeCard.addEventListener("pointerup", onFingerPointerUp, { passive: true });
  els.activeCard.addEventListener("pointercancel", onFingerPointerCancel, { passive: true });
  els.activeCard.addEventListener("pointerleave", onFingerPointerCancel, { passive: true });
  els.activeCard.addEventListener("click", (event) => {
    const button = event.target.closest("[data-card-action]");
    if (button) {
      handleCardAction(button.dataset.cardAction);
    }
  });
  els.activeCard.addEventListener("input", (event) => {
    if (event.target.matches("[data-spell-input]")) {
      state.spellingDraft = event.target.value;
      state.spellingResult = null;
    }
    if (event.target.matches("[data-form-input]")) {
      state.formDrafts[event.target.dataset.formInput] = event.target.value;
      state.formResult = null;
    }
  });
  els.activeCard.addEventListener("keydown", (event) => {
    if (event.target.matches("[data-spell-input]") && event.key === "Enter") {
      event.preventDefault();
      handleCardAction("check-spelling");
    }
    if (event.target.matches("[data-form-input]") && event.key === "Enter") {
      event.preventDefault();
      handleCardAction("check-forms");
    }
  });
  els.wordList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-row-action]");
    if (!button) {
      return;
    }
    if (button.dataset.rowAction === "load-more") {
      state.wordListLimit = Math.min((state.wordListLimit || 40) + 40, filteredWords().length);
      renderWordList();
      return;
    }
    const row = button.closest("[data-id]");
    if (!row) {
      return;
    }
    if (button.dataset.rowAction === "study") {
      setStudyMode("all");
      setActiveId(row.dataset.id);
      state.answerVisible = false;
      resetTypingState();
      state.lastAutoSpokenId = null;
      render();
    }
    if (button.dataset.rowAction === "important") {
      if (!guardEditable()) {
        return;
      }
      const word = state.words.find((item) => item.id === row.dataset.id);
      if (word) {
        word.important = !word.important;
        word.updatedAt = new Date().toISOString();
        saveWords();
        render();
      }
    }
    if (button.dataset.rowAction === "delete") {
      deleteWord(row.dataset.id);
    }
  });
  els.groupProgress.addEventListener("click", (event) => {
    const filterBtn = event.target.closest('[data-progress-filter]');
    if (filterBtn) {
      progressGroupFilter = filterBtn.dataset.progressFilter || "全部";
      renderGroupProgress();
      return;
    }
    const card = event.target.closest('[data-group-action="study"]');
    if (!card) {
      return;
    }
    const picked = card.dataset.group || "all";
    if (picked.startsWith("__root__")) {
      state.activeGroup = picked.replace("__root__", "");
    } else {
      state.activeGroup = picked;
    }
    state.wordListLimit = 40;
    state.mode = "all";
    state.practiceMode = "card";
    ensurePracticeSession("card");
    setActiveId(null);
    state.answerVisible = false;
    resetTypingState();
    state.lastAutoSpokenId = null;
    chooseActiveWord(true);
    render();
    activateModuleFromApp("study");
    showToast(state.activeGroup === "all" ? "已切回全部词库，已进入卡片" : `只背 ${state.activeGroup}，已进入卡片`);
  });
  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    state.wordListLimit = 40;
    renderWordList();
  });
  els.statusFilter.addEventListener("change", (event) => {
    state.filter = event.target.value;
    state.wordListLimit = 40;
    renderWordList();
  });
  els.librarySourceFilter.addEventListener("change", (event) => {
    state.librarySourceFilter = event.target.value;
    state.wordListLimit = 40;
    renderWordList();
  });
  els.listMaskMode.addEventListener("change", (event) => {
    state.listMaskMode = LIST_MASK_MODES.includes(event.target.value) ? event.target.value : "show";
    renderWordList();
  });
  els.cloudSyncButton?.addEventListener("click", openCloudDialog);
  els.closeCloudButton?.addEventListener("click", closeCloudDialog);
  els.cancelCloudButton?.addEventListener("click", closeCloudDialog);
  els.cloudSlugInput?.addEventListener("blur", () => {
    els.cloudSlugInput.value = normalizeCloudSlug(els.cloudSlugInput.value);
  });
  els.supabaseUrlInput?.addEventListener("blur", () => {
    const normalized = normalizeSupabaseUrl(els.supabaseUrlInput.value);
    if (normalized) {
      els.supabaseUrlInput.value = normalized;
    }
    saveSupabaseSettingsFromDialog();
  });
  els.supabaseKeyInput?.addEventListener("blur", () => {
    els.supabaseKeyInput.value = normalizeText(els.supabaseKeyInput.value);
    saveSupabaseSettingsFromDialog();
  });
  els.shareBaseUrlInput?.addEventListener("blur", () => {
    els.shareBaseUrlInput.value = normalizeShareBaseUrl(els.shareBaseUrlInput.value);
    try {
      localStorage.setItem(SHARE_BASE_URL_KEY, els.shareBaseUrlInput.value);
    } catch {
      // The link can still be copied even if the browser refuses storage.
    }
  });
  els.cloudForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const config = readCloudFormConfig();
    if (EDITOR_VIEW_SLUG && !state.cloud.canEdit) {
      await connectSharedEditCloud();
      return;
    }
    saveLocalCloudSettingsOnly(config, { silent: true, closeDialog: false });
    setCloudStatus("正在保存到云端……本机记录已先保存。", "");
    const ok = await saveCloudNow({ config: { ...config, autoSync: true } });
    if (ok) {
      closeCloudDialog();
    }
  });
  els.localSaveButton?.addEventListener("click", () => {
    const config = readCloudFormConfig();
    saveLocalCloudSettingsOnly(config);
  });
  els.tryCloudSaveButton?.addEventListener("click", async () => {
    const config = readCloudFormConfig();
    saveLocalCloudSettingsOnly(config, { silent: true, closeDialog: false });
    setCloudStatus("正在检查并保存到云端……本机记录已先保存。", "");
    const ok = await saveCloudNow({ config: { ...config, autoSync: true } });
    if (ok) {
      closeCloudDialog();
    }
  });
  els.loadCloudButton?.addEventListener("click", async () => {
    const config = readCloudFormConfig();
    await loadCloudToLocal({ slug: config.slug, pin: config.pin });
  });
  els.copyPublicLinkButton?.addEventListener("click", copyPublicLink);
  els.copyEditLinkButton?.addEventListener("click", copyEditLink);
  els.importButton.addEventListener("click", () => els.importInput.click());
  els.importInput.addEventListener("change", importWords);
  els.exportButton.addEventListener("click", exportWords);
  els.copyPlanButton.addEventListener("click", copyPlan);
  els.examDateInput.addEventListener("change", (event) => {
    state.settings.examDate = event.target.value || defaultExamDate();
    saveSettings();
    renderDashboard();
  });
  els.dictationOrderSelect?.addEventListener("change", (event) => {
    state.dictationOrder = event.target.value;
    setActiveId(null);
    state.answerVisible = false;
    resetTypingState();
    state.lastAutoSpokenId = null;
    render();
  });
  document.querySelectorAll("[data-practice-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      switchPracticeMode(button.dataset.practiceMode);
    });
  });
  els.startNewButton.addEventListener("click", startNewWords);
  els.batchLearnButton.addEventListener("click", batchLearnNewWords);
  els.sprintButton.addEventListener("click", startSprint);
  els.weakOnlyButton?.addEventListener("click", () => setMode("weak"));
  els.focusDueButton.addEventListener("click", () => setMode("due"));
  els.dueModeButton.addEventListener("click", () => setMode("due"));
  els.newModeButton.addEventListener("click", () => setMode("new"));
  els.allModeButton.addEventListener("click", () => setMode("all"));
}

// v68：打开页面默认回到卡片模式。不会删除其它模式的进度，只是避免刷新后停在专项/旧模式。
state.practiceMode = "card";
ensurePracticeSession("card");

wireEvents();
installStudyTimeTracker();
render();
persistBuiltinWordsIfNeeded();
initializeCloudFromUrl();
setInterval(() => {
  tickStudyTime();
  renderClock();
  renderStats();
  renderDashboard();
  renderTimeline();
  renderGroupProgress();
  renderSprintStatus();
  renderDailyReport();
}, 30 * 1000);
