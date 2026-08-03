const DB_NAME = "zsb-question-bank-trainer-v34-empty";
const DB_VERSION = 1;
const QUESTION_STORE = "questions";
const PROGRESS_STORE = "progress";
const BUNDLED_DATA_URL = "question-bank-data.json"; // 轻量版主要使用 question-bank-data.js
const PAGE_SIZE = QuestionBankCore.PAGE_SIZE;

const FORCE_CLEAN_VERSION_KEY = "zsb-question-bank-empty-v34:clean-version";
const FORCE_CLEAN_VERSION = "20260801-v63-homework-summer-zones";
const FORCE_EMPTY_BANK = false;
const COMPLETE_PRACTICE_SET_ID = "bf-math-function-ch1-sec1-complete-20260726";
const AUDIT_FEEDBACK_KEY = "zsb-question-bank-empty-v34:audit-feedback-v29";
const MISTAKE_REASON_KEY = "zsb-question-bank-empty-v34:mistake-reasons-v29";
const CONCEPT_WRONG_STREAK_KEY = "zsb-question-bank-empty-v34:concept-wrong-streak-v29";
const LOCAL_BACKUP_SCHEMA = "question-bank-local-backup-v42-mobile-text-extra";
const MISTAKE_REASON_LABELS = {
  unknown: "不会",
  careless: "粗心",
  formula: "公式忘了",
  concept: "概念混淆",
  stem: "题干看错",
  analysis: "解析看不懂"
};
const STUDY_MODE_KEY = "zsb-question-bank-empty-v34:study-mode";
const STUDY_DAYS_KEY = "zsb-question-bank-empty-v34:study-days";
const AUTO_HIDE_MASTERED_KEY = "zsb-question-bank-empty-v34:auto-hide-mastered";
const DAILY_GOAL_KEY = "zsb-question-bank-empty-v34:daily-goal";
const DAILY_ATTEMPTS_KEY = "zsb-question-bank-empty-v34:daily-attempts";
const TIMER_REMAINING_KEY = "zsb-question-bank-empty-v34:timer-remaining";
const STUDY_TOTAL_SECONDS_KEY = "zsb-question-bank-empty-v34:study-total-seconds";
const STUDY_DAILY_SECONDS_KEY = "zsb-question-bank-empty-v34:study-daily-seconds";
const TIMER_DEFAULT_SECONDS = 25 * 60;
const MOBILE_TAB_KEY = "zsb-question-bank-empty-v34:mobile-tab";
const REVIEW_INTERVALS = [1, 2, 4, 7, 15, 30, 45, 60];
const SUPABASE_URL = "https://fsizdxkwrxzopkoouipr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_BfWyJfb6c4GrV0JYLXejUg_QnkuhPvw";
const CLOUD_SLUG_KEY = "zsb-question-bank-empty-v34:cloud-slug";
const CLOUD_PIN_KEY = "zsb-question-bank-empty-v34:cloud-pin";
const CLOUD_DISPLAY_NAME_KEY = "zsb-question-bank-empty-v34:cloud-display-name";
const CLOUD_LAST_SYNC_KEY = "zsb-question-bank-empty-v34:cloud-last-sync";
const LOCAL_LAST_SAVE_KEY = "zsb-question-bank-empty-v34:local-last-save";
const CLOUD_RECORD_ID = "question_bank_progress_day1_v38";
const CLOUD_SYNC_DELAY_MS = 2500;
const CLOUD_SYNC_ENABLED = false;
const SOURCE_OVERRIDE_KEY = "zsb-question-bank-v35:source-overrides";
const QUESTION_VIEW_KEY = "zsb-question-bank-v36:question-view";
const GENERATED_VARIANTS_KEY = "zsb-question-bank-v38:generated-variants";
const ACTIVE_COMPLETE_SET_KEY = "zsb-question-bank-v57:active-complete-set";
const ACTIVE_COMPLETE_SET_WRONG_ONLY_KEY = "zsb-question-bank-v58:active-complete-set-wrong-only";

const els = {
  searchInput: document.querySelector("#searchInput"),
  assignmentFilter: document.querySelector("#assignmentFilter"),
  subjectFilter: document.querySelector("#subjectFilter"),
  chapterFilter: document.querySelector("#chapterFilter"),
  typeFilter: document.querySelector("#typeFilter"),
  sourceFilter: document.querySelector("#sourceFilter"),
  dayFilter: document.querySelector("#dayFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  difficultyFilter: document.querySelector("#difficultyFilter"),
  questionsList: document.querySelector("#questionsList"),
  detailPanel: document.querySelector("#detailPanel"),
  totalCount: document.querySelector("#totalCount"),
  filteredCount: document.querySelector("#filteredCount"),
  wrongCount: document.querySelector("#wrongCount"),
  wrongBookCount: document.querySelector("#wrongBookCount"),
  dueReviewCount: document.querySelector("#dueReviewCount"),
  streakCount: document.querySelector("#streakCount"),
  dailyProgressCount: document.querySelector("#dailyProgressCount"),
  masteredCount: document.querySelector("#masteredCount"),
  totalStudyTimeCount: document.querySelector("#totalStudyTimeCount"),
  mobileTotalStudyTime: document.querySelector("#mobileTotalStudyTime"),
  mobileTodayStudyTime: document.querySelector("#mobileTodayStudyTime"),
  dashboardPanel: document.querySelector("#dashboardPanel"),
  mobileFilterToggle: document.querySelector("#mobileFilterToggle"),
  mobileTimerPill: document.querySelector("#mobileTimerPill"),
  mobileScreenTitle: document.querySelector("#mobileScreenTitle"),
  mobileTabButtons: [...document.querySelectorAll("[data-mobile-tab]")],
  mobileMePanel: document.querySelector("#mobileMePanel"),
  mobileSimilarPanel: document.querySelector("#mobileSimilarPanel"),
  mobileTotalCount: document.querySelector("#mobileTotalCount"),
  mobileFilteredCount: document.querySelector("#mobileFilteredCount"),
  mobileCloudButton: document.querySelector("#mobileCloudButton"),
  mobileImportBackupButton: document.querySelector("#mobileImportBackupButton"),
  mobileDailyGoalInput: document.querySelector("#mobileDailyGoalInput"),
  mobileMeStudyModeButton: document.querySelector("#mobileMeStudyModeButton"),
  mobileTextModeButton: document.querySelector("#mobileTextModeButton"),
  mobileMeAutoHideMasteredButton: document.querySelector("#mobileMeAutoHideMasteredButton"),
  mobileMeTimerButton: document.querySelector("#mobileMeTimerButton"),
  mobileResetAllChoicesButton: document.querySelector("#mobileResetAllChoicesButton"),
  mobileWrongPlannerButton: document.querySelector("#mobileWrongPlannerButton"),
  mobileBackupButton: document.querySelector("#mobileBackupButton"),
  pageInfo: document.querySelector("#pageInfo"),
  prevPageButton: document.querySelector("#prevPageButton"),
  nextPageButton: document.querySelector("#nextPageButton"),
  reviewQueueButton: document.querySelector("#reviewQueueButton"),
  wrongBookModeButton: document.querySelector("#wrongBookModeButton"),
  wrongPlannerButton: document.querySelector("#wrongPlannerButton"),
  completeSetsButton: document.querySelector("#completeSetsButton"),
  mobileCompleteSetsButton: document.querySelector("#mobileCompleteSetsButton"),
  completeSetsModal: document.querySelector("#completeSetsModal"),
  completeSetsCloseButton: document.querySelector("#completeSetsCloseButton"),
  completeSetsSearchInput: document.querySelector("#completeSetsSearchInput"),
  completeSetsSummary: document.querySelector("#completeSetsSummary"),
  completeSetsAssignmentTabs: document.querySelector("#completeSetsAssignmentTabs"),
  completeSetsSubjectTabs: document.querySelector("#completeSetsSubjectTabs"),
  completeSetsContent: document.querySelector("#completeSetsContent"),
  completeSetActiveBar: document.querySelector("#completeSetActiveBar"),
  completeSetActiveTitle: document.querySelector("#completeSetActiveTitle"),
  completeSetActiveMeta: document.querySelector("#completeSetActiveMeta"),
  completeSetQuickButton: document.querySelector("#completeSetQuickButton"),
  completeSetExitButton: document.querySelector("#completeSetExitButton"),
  completeTextModal: document.querySelector("#completeTextModal"),
  completeTextCloseButton: document.querySelector("#completeTextCloseButton"),
  completeTextTitle: document.querySelector("#completeTextTitle"),
  completeTextMeta: document.querySelector("#completeTextMeta"),
  completeTextTypeTabs: document.querySelector("#completeTextTypeTabs"),
  completeTextSearchInput: document.querySelector("#completeTextSearchInput"),
  completeTextToc: document.querySelector("#completeTextToc"),
  completeTextContent: document.querySelector("#completeTextContent"),
  completeTextPrintButton: document.querySelector("#completeTextPrintButton"),
  quickBrowseButton: document.querySelector("#quickBrowseButton"),
  mobileQuickBrowseButton: document.querySelector("#mobileQuickBrowseButton"),
  quickBrowseModal: document.querySelector("#quickBrowseModal"),
  quickBrowseCloseButton: document.querySelector("#quickBrowseCloseButton"),
  quickBrowseGroupSelect: document.querySelector("#quickBrowseGroupSelect"),
  quickBrowseSearchInput: document.querySelector("#quickBrowseSearchInput"),
  quickBrowseSummary: document.querySelector("#quickBrowseSummary"),
  quickBrowseContent: document.querySelector("#quickBrowseContent"),
  auditModeButton: document.querySelector("#auditModeButton"),
  studyModeButton: document.querySelector("#studyModeButton"),
  textModeButton: document.querySelector("#textModeButton"),
  autoHideMasteredButton: document.querySelector("#autoHideMasteredButton"),
  timerButton: document.querySelector("#timerButton"),
  resetAllChoicesButton: document.querySelector("#resetAllChoicesButton"),
  importBackupButton: document.querySelector("#importBackupButton"),
  backupFileInput: document.querySelector("#backupFileInput"),
  cloudButton: document.querySelector("#cloudButton"),
  assignmentZoneTabs: document.querySelector("#assignmentZoneTabs")
};

const state = {
  db: null,
  questions: [],
  progressById: new Map(),
  filtered: [],
  page: 1,
  selectedId: "",
  studyMode: localStorage.getItem(STUDY_MODE_KEY) === "single",
  questionView: localStorage.getItem(QUESTION_VIEW_KEY) === "text" ? "text" : "image",
  autoHideMastered: localStorage.getItem(AUTO_HIDE_MASTERED_KEY) !== "0",
  mobileTab: localStorage.getItem(MOBILE_TAB_KEY) || "quiz",
  filtersOpen: false,
  timerSecondsRemaining: Number(localStorage.getItem(TIMER_REMAINING_KEY) || TIMER_DEFAULT_SECONDS) || TIMER_DEFAULT_SECONDS,
  timerRunning: false,
  timerId: 0,
  studyTimeTickerId: 0,
  studyTimeUnsavedSeconds: 0,
  cloudSyncTimer: 0,
  cloudSaving: false,
  activeCompleteSetId: localStorage.getItem(ACTIVE_COMPLETE_SET_KEY) || "",
  activeCompleteSetWrongOnly: localStorage.getItem(ACTIVE_COMPLETE_SET_WRONG_ONLY_KEY) === "1",
  completeSetAssignment: "",
  completeSetSubject: "",
  completeTextSetId: "",
  completeTextType: "全部"
};

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(QUESTION_STORE)) {
        db.createObjectStore(QUESTION_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        db.createObjectStore(PROGRESS_STORE, { keyPath: "questionId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAll(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function clearStore(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function putMany(storeName, items) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    items.forEach((item) => store.put(item));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function putOne(storeName, item) {
  return putMany(storeName, [item]);
}

async function pruneProgressForMissingQuestions() {
  const validIds = new Set(state.questions.map((question) => String(question.id || "")));
  const kept = [...state.progressById.values()].filter((progress) => validIds.has(String(progress.questionId || "")));
  if (kept.length !== state.progressById.size) {
    await clearStore(PROGRESS_STORE);
    if (kept.length) await putMany(PROGRESS_STORE, kept);
    state.progressById = new Map(kept.map((progress) => [progress.questionId, progress]));
  }
  const wrongRecords = QuestionBankCore.loadWrongBookRecords();
  const filtered = wrongRecords.filter((record) => {
    const recordId = String(record.id || "");
    const bankId = String(record.bankQuestionId || (recordId.startsWith("QB-") ? recordId.slice(3) : ""));
    return !bankId || validIds.has(bankId);
  });
  if (filtered.length !== wrongRecords.length) QuestionBankCore.saveWrongBookRecords(filtered);
}


function readSourceOverrides() {
  try {
    const value = JSON.parse(localStorage.getItem(SOURCE_OVERRIDE_KEY) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch (error) {
    return {};
  }
}

function applySourceOverrides(questions) {
  const overrides = readSourceOverrides();
  return (questions || []).map((question) => {
    const override = String(overrides[question.id] || "").trim();
    if (!override) return question;
    return { ...question, source: override, questionSource: override, sourceRecognition: "manual" };
  });
}

function writeSourceOverride(questionId, source) {
  const overrides = readSourceOverrides();
  overrides[questionId] = source;
  localStorage.setItem(SOURCE_OVERRIDE_KEY, JSON.stringify(overrides));
}

async function setQuestionSource(questionId, source) {
  if (!["全方位", "蓝色森林"].includes(source)) return;
  const index = state.questions.findIndex((item) => item.id === questionId);
  if (index < 0) return;
  const next = { ...state.questions[index], source, questionSource: source, sourceRecognition: "manual" };
  state.questions[index] = next;
  writeSourceOverride(questionId, source);
  await putOne(QUESTION_STORE, next);
  updateFilters();
  applyFilters();
  showToast(`已手动识别为${source}`);
}


function getAssignmentDisplayName(value) {
  const map = {
    "课后作业": "课后练习",
    "暑假集训的作业": "暑假作业",
    "额外题库": "额外题库",
    "all": "全部题库"
  };
  return map[String(value || "")] || String(value || "题库");
}

function questionBelongsToAssignment(question, assignment) {
  if (!question || !assignment || assignment === "all") return true;
  return String(question.assignmentGroup || "课后作业") === String(assignment) ||
    (Array.isArray(question.assignmentAliases) && question.assignmentAliases.map(String).includes(String(assignment)));
}

function getAssignmentZoneCount(assignment) {
  return state.questions.filter((question) => questionBelongsToAssignment(question, assignment)).length;
}

function renderAssignmentZoneTabs() {
  if (!els.assignmentZoneTabs) return;
  const current = els.assignmentFilter ? (els.assignmentFilter.value || "all") : "all";
  const zones = ["all", "课后作业", "暑假集训的作业", "额外题库"];
  els.assignmentZoneTabs.querySelectorAll("[data-assignment-zone]").forEach((button) => {
    const zone = button.dataset.assignmentZone || "all";
    button.classList.toggle("active", zone === current);
    const count = zone === "all" ? state.questions.length : getAssignmentZoneCount(zone);
    const counter = button.querySelector("span");
    if (counter) counter.textContent = String(count);
  });
}

function activateAssignmentZone(zone) {
  const value = ["课后作业", "暑假集训的作业", "额外题库"].includes(zone) ? zone : "all";
  if (state.activeCompleteSetId) {
    state.activeCompleteSetId = "";
    state.activeCompleteSetWrongOnly = false;
    localStorage.removeItem(ACTIVE_COMPLETE_SET_KEY);
    localStorage.removeItem(ACTIVE_COMPLETE_SET_WRONG_ONLY_KEY);
  }
  if (els.assignmentFilter) els.assignmentFilter.value = value;
  state.page = 1;
  state.selectedId = "";
  applyFilters();
  showToast(`已切换到${getAssignmentDisplayName(value)}`);
}


function getCompleteSetRegistry() {
  const data = globalThis.BUNDLED_QUESTION_BANK;
  const list = data && Array.isArray(data.completeSetRegistry) ? data.completeSetRegistry : [];
  return list.filter((item) => item && item.id && Array.isArray(item.items));
}

function getCompleteSetById(setId) {
  return getCompleteSetRegistry().find((item) => String(item.id) === String(setId || "")) || null;
}

function getActiveCompleteSet() {
  const set = getCompleteSetById(state.activeCompleteSetId);
  if (!set && state.activeCompleteSetId) {
    state.activeCompleteSetId = "";
    localStorage.removeItem(ACTIVE_COMPLETE_SET_KEY);
  }
  return set;
}

function getActiveCompleteSetItem(questionId) {
  const set = getActiveCompleteSet();
  if (!set) return null;
  return set.items.find((item) => String(item.questionId) === String(questionId || "")) || null;
}

function getCompleteSetQuestions(set) {
  if (!set) return [];
  const byId = new Map(state.questions.map((question) => [String(question.id), question]));
  return set.items.map((item) => byId.get(String(item.questionId))).filter(Boolean);
}

function getCompleteSetSourceCountLabel(set) {
  if (!set) return "0页";
  return String(set.sourceCountLabel || `${Number(set.pageCount || 0)}页`);
}

function getCompleteSetSectionSummary(set) {
  const counts = new Map();
  (set && set.items || []).forEach((item) => {
    const section = String(item.section || "题目");
    counts.set(section, Number(counts.get(section) || 0) + 1);
  });
  return [...counts.entries()].map(([section, count]) => `${section}${count}${set && set.pageMode ? "页" : "题"}`).join(" · ");
}

function getCompleteSetSubjectCategory(setOrQuestion) {
  const subject = String(setOrQuestion && setOrQuestion.subject || "");
  if (subject.includes("数学")) return "数学";
  if (subject.includes("计算机")) return "计算机";
  if (subject.includes("英语")) return "英语";
  return subject || "其他";
}

function isAttemptedQuestion(question) {
  const progress = question ? readProgress(question.id) : null;
  return Boolean(progress && (Number(progress.attempts || 0) > 0 || ["correct", "wrong"].includes(String(progress.lastResult || ""))));
}

function isWrongQuestion(question) {
  const progress = question ? readProgress(question.id) : null;
  return Boolean(progress && String(progress.lastResult || "") === "wrong");
}

function renderCompleteSetsContent() {
  if (!els.completeSetsContent) return;
  const allRegistry = getCompleteSetRegistry();
  const assignmentOrder = ["课后作业", "暑假集训的作业"];
  const availableAssignments = assignmentOrder.filter((assignment) => allRegistry.some((set) => String(set.assignmentGroup || "课后作业") === assignment));
  if (!availableAssignments.includes(state.completeSetAssignment)) state.completeSetAssignment = availableAssignments[0] || "";

  if (els.completeSetsAssignmentTabs) {
    els.completeSetsAssignmentTabs.innerHTML = availableAssignments.map((assignment) => {
      const sets = allRegistry.filter((set) => String(set.assignmentGroup || "课后作业") === assignment);
      const unitCount = sets.reduce((sum, set) => sum + Number(set.sourceQuestionCount || set.questionCount || (set.items || []).length || 0), 0);
      return `<button type="button" class="complete-assignment-tab${state.completeSetAssignment === assignment ? " active" : ""}" data-complete-assignment="${escapeHtml(assignment)}"><strong>${escapeHtml(getAssignmentDisplayName(assignment))}</strong><span>${sets.length}套 · ${unitCount}题</span></button>`;
    }).join("");
    els.completeSetsAssignmentTabs.querySelectorAll("[data-complete-assignment]").forEach((button) => button.addEventListener("click", () => {
      state.completeSetAssignment = button.dataset.completeAssignment || "";
      state.completeSetSubject = "";
      if (els.completeSetsSearchInput) els.completeSetsSearchInput.value = "";
      renderCompleteSetsContent();
    }));
  }

  const assignmentRegistry = allRegistry.filter((set) => String(set.assignmentGroup || "课后作业") === state.completeSetAssignment);
  const categories = ["数学", "计算机", "英语"].filter((category) => assignmentRegistry.some((set) => getCompleteSetSubjectCategory(set) === category));
  if (!categories.includes(state.completeSetSubject)) state.completeSetSubject = categories[0] || "";
  if (els.completeSetsSubjectTabs) {
    els.completeSetsSubjectTabs.innerHTML = categories.map((category) => {
      const count = assignmentRegistry.filter((set) => getCompleteSetSubjectCategory(set) === category).length;
      return `<button type="button" class="complete-subject-tab${state.completeSetSubject === category ? " active" : ""}" data-complete-subject="${escapeHtml(category)}"><strong>${escapeHtml(category)}</strong><span>${count}套</span></button>`;
    }).join("");
    els.completeSetsSubjectTabs.querySelectorAll("[data-complete-subject]").forEach((button) => button.addEventListener("click", () => {
      state.completeSetSubject = button.dataset.completeSubject || "";
      renderCompleteSetsContent();
    }));
  }
  const keyword = String(els.completeSetsSearchInput && els.completeSetsSearchInput.value || "").trim().toLowerCase();
  const registry = assignmentRegistry.filter((set) => getCompleteSetSubjectCategory(set) === state.completeSetSubject).filter((set) => {
    if (!keyword) return true;
    return [set.title, set.subject, set.source, set.dayLabel, getCompleteSetSectionSummary(set)].join(" ").toLowerCase().includes(keyword);
  });
  const totalQuestions = registry.reduce((sum, set) => sum + Number(set.sourceQuestionCount || set.questionCount || set.items.length || 0), 0);
  const totalPages = registry.reduce((sum, set) => sum + Number(set.pageCount || 0), 0);
  if (els.completeSetsSummary) {
    els.completeSetsSummary.innerHTML = `<strong>${escapeHtml(getAssignmentDisplayName(state.completeSetAssignment))} · ${escapeHtml(state.completeSetSubject || "完整")} ${registry.length}套</strong><span>合计 ${totalQuestions} 题 · ${totalPages} 页原资料</span>`;
  }
  els.completeSetsContent.innerHTML = registry.map((set) => {
    const questions = getCompleteSetQuestions(set);
    const completed = questions.filter(isAttemptedQuestion).length;
    const wrong = questions.filter(isWrongQuestion).length;
    const remaining = Math.max(0, questions.length - completed);
    const pageMode = Boolean(set.pageMode);
    const sourceQuestionText = Number(set.sourceQuestionCount || 0) ? ` · 原题 ${Number(set.sourceQuestionCount)} 题` : "";
    const active = String(set.id) === String(state.activeCompleteSetId);
    const wrongActive = active && state.activeCompleteSetWrongOnly;
    const answerReady = String(set.answerStatus || "") === "official_complete_set";
    const answerPages = Number(set.answerPageCount || 0);
    const answerDocument = String(set.answerDocument || "").trim();
    const textPending = String(set.textAuditStatus || "") === "pending_manual_transcription";
    return `<article class="complete-set-card${active ? " active" : ""}${wrongActive ? " wrong-active" : ""}${textPending ? " text-pending" : ""}">
      <div class="complete-set-card-head"><span>${escapeHtml(getCompleteSetSubjectCategory(set))} · ${escapeHtml(set.source || "来源未标")}</span><b>${escapeHtml(getCompleteSetSourceCountLabel(set))}</b></div>${answerReady ? `<div class="complete-answer-ready">答案解析已补齐${answerPages ? ` · ${answerPages}页` : ""}</div>` : ""}${textPending ? `<div class="complete-text-pending">OCR乱码已撤回 · 纯文字待人工校对</div>` : ""}
      <h3>${escapeHtml(set.title || "完整题组")}</h3>
      <p><strong>${escapeHtml(getAssignmentDisplayName(set.assignmentGroup || "课后作业"))}</strong> · ${escapeHtml(set.source || "蓝色森林")} · ${escapeHtml(set.dayLabel || set.studyDate || "")} · ${pageMode ? `原页 ${Number(set.pageCount || questions.length)} 页${sourceQuestionText}` : `共 ${Number(set.questionCount || set.items.length || 0)} 题`}</p>
      <div class="complete-set-sections">${escapeHtml(getCompleteSetSectionSummary(set))}</div>
      <div class="complete-set-progress"><i style="width:${questions.length ? Math.round(completed / questions.length * 100) : 0}%"></i></div>
      <div class="complete-set-status-line"><span>${pageMode ? "已浏览" : "已完成"} ${completed}/${questions.length}</span><span>${pageMode ? "未浏览" : "未做"} ${remaining}</span>${pageMode ? `<b>原页归档</b>` : `<b>错题 ${wrong}</b>`}</div>
      <footer class="complete-set-card-actions"><button type="button" class="primary-button" data-open-complete-set="${escapeHtml(set.id)}">${active && !wrongActive ? "继续整套" : "打开整套"}</button><button type="button" class="secondary-button complete-text-button" data-open-complete-text="${escapeHtml(set.id)}">${textPending ? "原题安全查看" : "纯文字整套"}</button>${answerReady && answerDocument ? `<a class="secondary-button complete-answer-document" href="${escapeHtml(answerDocument)}" target="_blank" rel="noopener">整套答案</a>` : ""}${pageMode ? "" : `<button type="button" class="secondary-button complete-wrong-button" data-open-complete-set-wrong="${escapeHtml(set.id)}" ${wrong ? "" : "disabled"}>${wrongActive ? "继续错题" : "只看错题"}</button>`}</footer>
    </article>`;
  }).join("") || `<div class="hidden-solution">当前分区没有找到符合关键词的完整题组</div>`;
  els.completeSetsContent.querySelectorAll("[data-open-complete-set]").forEach((button) => {
    button.addEventListener("click", () => activateCompleteSet(button.dataset.openCompleteSet, false));
  });
  els.completeSetsContent.querySelectorAll("[data-open-complete-text]").forEach((button) => {
    button.addEventListener("click", () => openCompleteTextReader(button.dataset.openCompleteText));
  });
  els.completeSetsContent.querySelectorAll("[data-open-complete-set-wrong]:not(:disabled)").forEach((button) => {
    button.addEventListener("click", () => activateCompleteSet(button.dataset.openCompleteSetWrong, true));
  });
}


function getPureTextTypeLabel(question) {
  const raw = String(question && (question.sectionLabel || question.practiceSection || question.type) || "题目");
  if (/选择|单选|多选/.test(raw)) return "选择题";
  if (/判断|正误/.test(raw)) return "判断题";
  if (/填空/.test(raw)) return "填空题";
  if (/汉译英/.test(raw)) return "汉译英";
  if (/英译汉/.test(raw)) return "英译汉";
  if (/计算|解答|证明/.test(raw)) return "计算题";
  if (/原页/.test(raw)) return "原页资料";
  return raw || "题目";
}

function splitPureTextLines(value) {
  let text = String(value || "").replace(/\r/g, "\n").replace(/\u00a0/g, " ").trim();
  if (!text) return [];
  text = text.replace(/\s+([A-DＡ-Ｄ])[\.、．]\s*/g, "\n$1. ");
  text = text.replace(/\s+(答案|解析|句意|考点)[:：]/g, "\n$1：");
  return text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function renderPureTextStem(question) {
  const lines = splitPureTextLines(getQuestionTextStem(question));
  if (!lines.length) return `<p class="paper-missing">本题纯文字题干尚未录入。</p>`;
  return lines.map((line) => `<p class="paper-stem-line">${renderRichText(line)}</p>`).join("");
}

function renderPureTextOptions(question) {
  const options = getQuestionTextOptions(question);
  const normalized = getQuestionOptions(question, options);
  if (!normalized.length) {
    if (getPureTextTypeLabel(question) === "填空题") return `<div class="paper-answer-line"></div>`;
    return "";
  }
  return `<ol class="paper-options">${normalized.map((option, index) => {
    const raw = String(option || "").trim();
    const letter = String.fromCharCode(65 + index);
    const body = raw.replace(/^[A-DＡ-Ｄ][\.、．]\s*/i, "");
    return `<li><b>${letter}.</b><span>${renderRichText(body)}</span></li>`;
  }).join("")}</ol>`;
}

function renderCompleteTextQuestion(question, item, index) {
  const type = getPureTextTypeLabel(question);
  const number = String(item && item.displayNo || getQuestionDisplayNo(question) || index + 1);
  const progress = readProgress(question.id);
  const status = isAttemptedQuestion(question) ? (isWrongQuestion(question) ? "已完成·错题" : "已完成") : "未做";
  if (question && question.forceImageTextFallback) {
    return `<article class="paper-question paper-page-unit paper-text-pending" id="pure-${escapeHtml(question.id)}" data-pure-type="${escapeHtml(type)}">
      <header><span class="paper-number">${escapeHtml(number)}</span><span class="paper-type">${escapeHtml(type)}</span><em>${status}</em></header>
      <div class="paper-page-note"><strong>已撤回错误 OCR，不再显示乱码</strong><span>该题尚未完成可靠逐字转写。现阶段显示原题页用于作答和核对，不能把自动识别草稿冒充纯文字正文。</span></div>
      ${renderImages(question.images || [], "原题页")}
    </article>`;
  }
  if (question.pageArchive || type === "原页资料") {
    return `<article class="paper-question paper-page-unit" id="pure-${escapeHtml(question.id)}" data-pure-type="${escapeHtml(type)}">
      <header><span class="paper-number">${escapeHtml(number)}</span><span class="paper-type">${escapeHtml(type)}</span><em>${status}</em></header>
      <h4>${escapeHtml(question.titleLabel || question.chapter || "原页资料")}</h4>
      <div class="paper-page-note"><strong>该页尚未拆分成逐题文字</strong><span>为避免错字、漏题和公式识别错误，本页保留原图；后续有清晰文字源时会自动替换为逐题纯文字。</span></div>
      ${renderImages(question.images || [], "原题")}
    </article>`;
  }
  const sourceImages = Array.isArray(question.images) ? question.images.filter(Boolean) : [];
  const sourceAssist = sourceImages.length ? `<details class="paper-source-assist"><summary>查看原题图（辅助核对）</summary>${renderImages(sourceImages, "原题辅助图")}</details>` : "";
  return `<article class="paper-question" id="pure-${escapeHtml(question.id)}" data-pure-type="${escapeHtml(type)}">
    <header><span class="paper-number">${escapeHtml(number)}</span><span class="paper-type">${escapeHtml(type)}</span><em>${status}</em></header>
    <div class="paper-stem">${renderPureTextStem(question)}</div>
    ${renderPureTextOptions(question)}
    ${sourceAssist}
  </article>`;
}

function renderCompleteTextReader() {
  const set = getCompleteSetById(state.completeTextSetId);
  if (!set || !els.completeTextContent) return;
  const byId = new Map(state.questions.map((q) => [String(q.id), q]));
  const rows = set.items.map((item, index) => ({ item, index, question: byId.get(String(item.questionId)) })).filter((row) => row.question);
  const types = ["全部", ...new Set(rows.map((row) => getPureTextTypeLabel(row.question)))];
  if (!types.includes(state.completeTextType)) state.completeTextType = "全部";
  const keyword = String(els.completeTextSearchInput && els.completeTextSearchInput.value || "").trim().toLowerCase();
  const visibleRows = rows.filter((row) => {
    const type = getPureTextTypeLabel(row.question);
    if (state.completeTextType !== "全部" && type !== state.completeTextType) return false;
    if (!keyword) return true;
    return [row.item.displayNo, type, getQuestionTextStem(row.question), ...(getQuestionTextOptions(row.question) || [])].join(" ").toLowerCase().includes(keyword);
  });
  if (els.completeTextTitle) els.completeTextTitle.textContent = set.title || "完整纯文字版";
  if (els.completeTextMeta) els.completeTextMeta.textContent = `${getAssignmentDisplayName(set.assignmentGroup || "课后作业")} · ${set.source || "来源未标"} · ${set.subject || ""} · ${Number(set.sourceQuestionCount || set.questionCount || rows.length)}题`;
  if (els.completeTextTypeTabs) {
    els.completeTextTypeTabs.innerHTML = types.map((type) => `<button type="button" class="complete-text-type-tab${state.completeTextType === type ? " active" : ""}" data-pure-type-tab="${escapeHtml(type)}">${escapeHtml(type)}<small>${type === "全部" ? rows.length : rows.filter((row) => getPureTextTypeLabel(row.question) === type).length}</small></button>`).join("");
    els.completeTextTypeTabs.querySelectorAll("[data-pure-type-tab]").forEach((button) => button.addEventListener("click", () => { state.completeTextType = button.dataset.pureTypeTab || "全部"; renderCompleteTextReader(); }));
  }
  const sections = [];
  visibleRows.forEach((row) => {
    const section = String(row.item.section || getPureTextTypeLabel(row.question));
    let group = sections.find((item) => item.name === section);
    if (!group) { group = { name: section, rows: [] }; sections.push(group); }
    group.rows.push(row);
  });
  if (els.completeTextToc) els.completeTextToc.innerHTML = sections.map((section, i) => `<a href="#paper-section-${i}"><strong>${escapeHtml(section.name)}</strong><span>${section.rows.length}题</span></a>`).join("");
  if (els.completeTextContent) els.completeTextContent.innerHTML = sections.map((section, i) => `<section class="paper-section" id="paper-section-${i}"><h3>${escapeHtml(section.name)}</h3>${section.rows.map((row) => renderCompleteTextQuestion(row.question, row.item, row.index)).join("")}</section>`).join("") || `<div class="hidden-solution">当前条件下没有题目</div>`;
}

function openCompleteTextReader(setId) {
  if (!els.completeTextModal) return;
  state.completeTextSetId = String(setId || "");
  state.completeTextType = "全部";
  if (els.completeTextSearchInput) els.completeTextSearchInput.value = "";
  renderCompleteTextReader();
  els.completeTextModal.hidden = false;
  document.body.classList.add("complete-text-open");
}

function closeCompleteTextReader() {
  if (!els.completeTextModal) return;
  els.completeTextModal.hidden = true;
  document.body.classList.remove("complete-text-open");
}

function openCompleteSets() {
  if (!els.completeSetsModal) return;
  if (els.completeSetsSearchInput) els.completeSetsSearchInput.value = "";
  const activeSet = getActiveCompleteSet();
  const selectedQuestion = state.questions.find((question) => question.id === state.selectedId) || null;
  const seed = activeSet || selectedQuestion || getCompleteSetRegistry()[0] || null;
  const seedAssignment = String(seed && seed.assignmentGroup || "");
  state.completeSetAssignment = ["课后作业", "暑假集训的作业"].includes(seedAssignment) ? seedAssignment : "课后作业";
  state.completeSetSubject = getCompleteSetSubjectCategory(seed);
  renderCompleteSetsContent();
  els.completeSetsModal.hidden = false;
  document.body.classList.add("quick-browse-open");
}

function closeCompleteSets() {
  if (!els.completeSetsModal) return;
  els.completeSetsModal.hidden = true;
  document.body.classList.remove("quick-browse-open");
}

function resetVisibleFiltersForCompleteSet() {
  if (els.searchInput) els.searchInput.value = "";
  [els.assignmentFilter, els.subjectFilter, els.chapterFilter, els.typeFilter, els.sourceFilter, els.dayFilter, els.statusFilter, els.difficultyFilter].filter(Boolean).forEach((control) => { control.value = "all"; });
}

function activateCompleteSet(setId, wrongOnly = false) {
  const set = getCompleteSetById(setId);
  if (!set) return;
  state.activeCompleteSetId = String(set.id);
  state.activeCompleteSetWrongOnly = Boolean(wrongOnly);
  localStorage.setItem(ACTIVE_COMPLETE_SET_KEY, state.activeCompleteSetId);
  localStorage.setItem(ACTIVE_COMPLETE_SET_WRONG_ONLY_KEY, state.activeCompleteSetWrongOnly ? "1" : "0");
  resetVisibleFiltersForCompleteSet();
  state.page = 1;
  state.selectedId = "";
  state.mobileTab = "quiz";
  localStorage.setItem(MOBILE_TAB_KEY, "quiz");
  closeCompleteSets();
  applyFilters();
  showToast(`${state.activeCompleteSetWrongOnly ? "已打开本套错题：" : "已打开完整题组："}${set.title}`);
}

function clearActiveCompleteSet() {
  const current = getActiveCompleteSet();
  state.activeCompleteSetId = "";
  state.activeCompleteSetWrongOnly = false;
  localStorage.removeItem(ACTIVE_COMPLETE_SET_KEY);
  localStorage.removeItem(ACTIVE_COMPLETE_SET_WRONG_ONLY_KEY);
  state.page = 1;
  state.selectedId = "";
  applyFilters();
  if (current) showToast("已退出完整题组模式");
}

function renderCompleteSetActiveBar() {
  if (!els.completeSetActiveBar) return;
  const set = getActiveCompleteSet();
  els.completeSetActiveBar.hidden = !set;
  document.body.classList.toggle("complete-set-mode", Boolean(set));
  if (!set) return;
  if (els.completeSetActiveTitle) els.completeSetActiveTitle.textContent = set.title || "完整题组";
  if (els.completeSetActiveMeta) els.completeSetActiveMeta.textContent = set.pageMode ? `${getCompleteSetSourceCountLabel(set)} · 原页归档 · ${getCompleteSetSectionSummary(set)}` : `${state.activeCompleteSetWrongOnly ? "只看错题 · " : ""}${getCompleteSetSourceCountLabel(set)} · ${Number(set.questionCount || set.items.length || 0)}题 · ${getCompleteSetSectionSummary(set)}`;
}

function getQuestionDisplayNo(question) {
  const activeItem = question ? getActiveCompleteSetItem(question.id) : null;
  return String(activeItem && activeItem.displayNo || question && question.originalNo || question && question.id || "").trim();
}

function getQuestionDayLabel(question) {
  return String(question && question.dayLabel || (question && question.studyDate) || "").trim();
}

function getQuestionSequenceLabel(question) {
  const activeItem = question ? getActiveCompleteSetItem(question.id) : null;
  const section = String(activeItem && activeItem.section || question && (question.sectionLabel || question.practiceSection || question.type) || "题目").trim();
  const no = getQuestionDisplayNo(question);
  return `${section} ${no}`.trim();
}

function getQuickBrowseGroupKey(question) {
  if (!question) return "";
  return String(question.practiceSetId || [question.assignmentGroup || "课后作业", question.subject || "", question.chapter || "", question.studyDay || ""].join("||"));
}

function getCurrentQuickBrowseScope() {
  const activeSet = getActiveCompleteSet();
  if (activeSet) {
    const allQuestions = getCompleteSetQuestions(activeSet);
    const questions = state.activeCompleteSetWrongOnly ? allQuestions.filter(isWrongQuestion) : allQuestions;
    const selectedQuestion = state.questions.find((question) => question.id === state.selectedId) || questions[0] || null;
    return { questions, selectedQuestion, label: String(activeSet.title || "当前完整题组"), assignment: String(activeSet.assignmentGroup || "课后作业"), subject: String(activeSet.subject || ""), dayLabel: String(activeSet.dayLabel || activeSet.studyDate || "") };
  }
  const selectedQuestion = state.questions.find((question) => question.id === state.selectedId) || state.filtered[0] || null;
  if (!selectedQuestion) {
    return { questions: [], selectedQuestion: null, label: "当前范围", assignment: "", subject: "", dayLabel: "" };
  }

  const selectedKey = getQuickBrowseGroupKey(selectedQuestion);
  let questions = state.questions.filter((question) => getQuickBrowseGroupKey(question) === selectedKey);

  // Some older imported sets did not carry a consistent practiceSetId. In that case,
  // use the exact current filtered range instead of exposing the whole question bank.
  if (questions.length <= 1 && state.filtered.length) {
    questions = state.filtered.slice();
  }

  questions.sort((a, b) => {
    const practiceDiff = Number(a.practiceOrder || 0) - Number(b.practiceOrder || 0);
    if (practiceDiff) return practiceDiff;
    return sortQuestionsForMode(a, b, "all");
  });

  return {
    questions,
    selectedQuestion,
    label: String(selectedQuestion.practiceSetTitle || selectedQuestion.chapter || selectedQuestion.titleLabel || "当前题组"),
    assignment: String(selectedQuestion.assignmentGroup || "课后作业"),
    subject: String(selectedQuestion.subject || ""),
    dayLabel: getQuestionDayLabel(selectedQuestion)
  };
}

function renderQuickBrowseContent() {
  if (!els.quickBrowseContent) return;
  const scope = getCurrentQuickBrowseScope();
  if (!scope.questions.length) {
    els.quickBrowseContent.innerHTML = `<div class="hidden-solution">当前范围没有可查阅题目</div>`;
    if (els.quickBrowseSummary) els.quickBrowseSummary.innerHTML = "";
    return;
  }

  const keyword = String(els.quickBrowseSearchInput && els.quickBrowseSearchInput.value || "").trim().toLowerCase();
  const items = scope.questions.filter((question) => {
    if (!keyword) return true;
    const haystack = [
      getQuestionDisplayNo(question),
      question.type,
      question.sectionLabel,
      question.practiceSection,
      question.stem,
      question.titleLabel
    ].join(" ").toLowerCase();
    return haystack.includes(keyword);
  });

  const completedCount = scope.questions.filter(isAttemptedQuestion).length;
  const wrongCount = scope.questions.filter(isWrongQuestion).length;
  const remainingCount = Math.max(0, scope.questions.length - completedCount);
  if (els.quickBrowseSummary) {
    els.quickBrowseSummary.innerHTML = `
      <div class="quick-current-range-title">
        <span>当前题组</span>
        <strong>${escapeHtml(scope.label)}</strong>
      </div>
      <div class="quick-current-range-stats">
        <span>${escapeHtml(scope.assignment)} · ${escapeHtml(scope.subject)}${scope.dayLabel ? ` · ${escapeHtml(scope.dayLabel)}` : ""}</span>
        <b>共 ${getActiveCompleteSet() && getActiveCompleteSet().pageMode ? `${scope.questions.length} 页` : `${scope.questions.length} 题`}</b>
        <b>${getActiveCompleteSet() && getActiveCompleteSet().pageMode ? "未浏览" : "未做"} ${remainingCount}</b>
        <b>${getActiveCompleteSet() && getActiveCompleteSet().pageMode ? "已浏览" : "已完成"} ${completedCount}</b>
        ${getActiveCompleteSet() && getActiveCompleteSet().pageMode ? "" : `<b class="quick-wrong-stat">错题 ${wrongCount} 题</b>`}
      </div>`;
  }

  const sections = [];
  items.forEach((question) => {
    const activeItem = getActiveCompleteSetItem(question.id);
    const section = String(activeItem && activeItem.section || question.sectionLabel || question.practiceSection || question.type || "题目");
    const previous = sections[sections.length - 1];
    if (!previous || previous.section !== section) sections.push({ section, questions: [] });
    sections[sections.length - 1].questions.push(question);
  });

  els.quickBrowseContent.innerHTML = sections.map(({ section, questions: sectionQuestions }) => `
    <section class="quick-section-block">
      <header><strong>${escapeHtml(section)}</strong><span>${sectionQuestions.length}题</span></header>
      <div class="quick-question-grid">
        ${sectionQuestions.map((question) => {
          const attempted = isAttemptedQuestion(question);
          const wrong = isWrongQuestion(question);
          const mastered = isMasteredQuestion(question);
          const active = question.id === state.selectedId;
          const statusLabel = wrong ? "已完成 · 错题" : attempted ? "已完成 · 正确" : "未做";
          return `<button type="button" class="quick-question-button${active ? " active" : ""}${attempted ? " completed" : ""}${wrong ? " wrong" : ""}" data-quick-question-id="${escapeHtml(question.id)}" ${mastered && !wrong && !question.pageArchive ? "disabled" : ""}>
            <b>${escapeHtml(getQuestionDisplayNo(question))}</b>
            <span>${escapeHtml(question.type)} · ${statusLabel}</span>
            <small>${escapeHtml(String(question.stem || "").slice(0, 58))}</small>
          </button>`;
        }).join("")}
      </div>
    </section>`).join("") || `<div class="hidden-solution">当前题组中没有符合关键词的题</div>`;

  els.quickBrowseContent.querySelectorAll("[data-quick-question-id]:not(:disabled)").forEach((button) => {
    button.addEventListener("click", () => jumpToQuestionFromQuickBrowse(button.dataset.quickQuestionId));
  });
}

function openQuickBrowse() {
  if (!els.quickBrowseModal) return;
  if (els.quickBrowseSearchInput) els.quickBrowseSearchInput.value = "";
  renderQuickBrowseContent();
  els.quickBrowseModal.hidden = false;
  document.body.classList.add("quick-browse-open");
  window.requestAnimationFrame(() => els.quickBrowseSearchInput && els.quickBrowseSearchInput.focus());
}

function closeQuickBrowse() {
  if (!els.quickBrowseModal) return;
  els.quickBrowseModal.hidden = true;
  document.body.classList.remove("quick-browse-open");
}

function jumpToQuestionFromQuickBrowse(questionId) {
  const index = state.filtered.findIndex((item) => item.id === questionId);
  if (index < 0) {
    showToast("这道题不在当前待做范围内");
    return;
  }
  state.page = Math.floor(index / PAGE_SIZE) + 1;
  state.selectedId = questionId;
  render();
  closeQuickBrowse();
  scrollDetailPanelIntoView();
}

function renderSourceClassifier(question) {
  const current = String(question.source || "");
  const mode = question.sourceRecognition === "manual" ? "手动识别（优先保留）" : (question.sourceRecognition === "generated" ? "自动生成" : "自动识别");
  return `
    <section class="source-classifier" aria-label="手动识别题源">
      <div><strong>题源识别</strong><span>${escapeHtml(mode)} · 当前：${escapeHtml(current || "未识别")}</span></div>
      <div class="source-choice-buttons">
        <button type="button" class="secondary-button ${current === "全方位" ? "active" : ""}" data-source-choice="全方位">全方位</button>
        <button type="button" class="secondary-button ${current === "蓝色森林" ? "active" : ""}" data-source-choice="蓝色森林">蓝色森林</button>
      </div>
    </section>`;
}

async function replaceQuestions(questions, options = {}) {
  const normalized = applySourceOverrides(questions.map(QuestionBankCore.normalizeQuestion)).filter((question) => question.id && question.stem);
  await clearStore(QUESTION_STORE);
  await putMany(QUESTION_STORE, normalized);
  state.questions = normalized;
  state.page = 1;
  state.selectedId = normalized[0] ? normalized[0].id : "";
  updateFilters();
  applyFilters();
  if (!options.silent) {
    showToast(`已载入 ${normalized.length} 道题`);
  }
}

async function loadState() {
  state.questions = applySourceOverrides((await getAll(QUESTION_STORE)).map(QuestionBankCore.normalizeQuestion));
  const progressList = await getAll(PROGRESS_STORE);
  state.progressById = new Map(progressList.map((progress) => [progress.questionId, enrichProgress(progress, progress.questionId)]));
  if (await ensureBundledQuestionsCurrent()) {
    return;
  }
  if (!state.questions.length) {
    updateFilters();
    applyFilters();
    return;
  }
  state.selectedId = state.questions[0].id;
  updateFilters();
  applyFilters();
}

function repairWrongBookOptionsFromProgress() {
  const wrongRecords = QuestionBankCore.loadWrongBookRecords();
  if (!wrongRecords.length || !state.questions.length) {
    return;
  }
  const questionsById = new Map(state.questions.map((question) => [question.id, question]));
  let changed = false;
  const nextRecords = wrongRecords.map((record) => {
    const recordId = String(record.id || "");
    const bankQuestionId = record.bankQuestionId || (recordId.startsWith("QB-") ? recordId.slice(3) : "");
    const question = questionsById.get(bankQuestionId);
    if (!question || !Array.isArray(question.options) || !question.options.length) {
      return record;
    }
    const existingOptions = Array.isArray(record.options) ? record.options : [];
    if (JSON.stringify(existingOptions) === JSON.stringify(question.options)) {
      return record;
    }
    changed = true;
    return { ...record, options: question.options, updatedAt: new Date().toISOString() };
  });
  if (changed) {
    QuestionBankCore.saveWrongBookRecords(nextRecords);
  }
}

function normalizeDedupeText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/^[\s*]*\d+[.．、]\s*/, "")
    .replace(/[（）]/g, (char) => (char === "（" ? "(" : ")"))
    .replace(/\s+/g, "")
    .toLowerCase();
}

function questionContentKey(question) {
  const normalized = QuestionBankCore.normalizeQuestion(question);
  const optionKey = (normalized.options || []).map(normalizeDedupeText).join("||");
  return `${normalizeDedupeText(normalized.stem)}||${optionKey}`;
}

function mergeQuestionsPreferBundled(localQuestions, bundledQuestions) {
  const merged = [];
  const seenIds = new Set();
  const bundledContent = new Set();

  // 完整题组可能有相同题干但属于不同完整套题。内置题库按ID完整保留，
  // 不能再按题干去重，否则会造成整套题缺号、跳题或页数不完整。
  (bundledQuestions || []).forEach((item) => {
    const question = QuestionBankCore.normalizeQuestion(item);
    if (!question.id || !question.stem || seenIds.has(question.id)) return;
    seenIds.add(question.id);
    bundledContent.add(questionContentKey(question));
    merged.push(question);
  });

  // 仅对用户本地自动生成题做内容去重，避免刷新后反复追加同一道自动变式题。
  (localQuestions || []).forEach((item) => {
    const question = QuestionBankCore.normalizeQuestion(item);
    if (!question.id || !question.stem || seenIds.has(question.id)) return;
    const contentKey = questionContentKey(question);
    if (bundledContent.has(contentKey)) return;
    seenIds.add(question.id);
    bundledContent.add(contentKey);
    merged.push(question);
  });
  return merged;
}

async function ensureBundledQuestionsCurrent() {
  const bundled = await loadBundledQuestions();
  const savedCleanVersion = localStorage.getItem(FORCE_CLEAN_VERSION_KEY) || "";

  // v35 从空白版开始，导入 7.16 第1天题目。
  // 使用独立 IndexedDB 与 localStorage 命名空间，不会破坏原完整版的数据。
  if (FORCE_EMPTY_BANK) {
    const needsReset = savedCleanVersion !== FORCE_CLEAN_VERSION || state.questions.length > 0 || state.progressById.size > 0;
    if (needsReset) {
      await clearStore(QUESTION_STORE);
      await clearStore(PROGRESS_STORE);
      state.questions = [];
      state.progressById = new Map();
      QuestionBankCore.saveWrongBookRecords([]);
      localStorage.removeItem(AUDIT_FEEDBACK_KEY);
      localStorage.removeItem(MISTAKE_REASON_KEY);
      localStorage.removeItem(CONCEPT_WRONG_STREAK_KEY);
      localStorage.setItem(FORCE_CLEAN_VERSION_KEY, FORCE_CLEAN_VERSION);
      state.page = 1;
      state.selectedId = "";
      updateFilters();
      applyFilters();
      showToast("空白题库已就绪：当前 0 道题，全部训练功能保留");
      return true;
    }
    return false;
  }

  if (!bundled.length) {
    return false;
  }

  const generated = state.questions.filter((question) => question && question.autoGenerated === true);
  const expectedQuestions = mergeQuestionsPreferBundled(generated, bundled);
  const expectedIds = new Set(expectedQuestions.map((question) => String(question.id || "")));
  const localIds = new Set(state.questions.map((question) => String(question.id || "")));
  const sameQuestionSet = state.questions.length === expectedQuestions.length &&
    expectedQuestions.every((question) => localIds.has(String(question.id || ""))) &&
    state.questions.every((question) => expectedIds.has(String(question.id || "")));

  if (savedCleanVersion !== FORCE_CLEAN_VERSION || !sameQuestionSet) {
    await replaceQuestions(expectedQuestions, { silent: true });
    await pruneProgressForMissingQuestions();
    state.autoHideMastered = true;
    localStorage.setItem(AUTO_HIDE_MASTERED_KEY, "1");
    await normalizeCompletedProgressForOneCorrect();
    state.selectedId = "";
    localStorage.setItem(FORCE_CLEAN_VERSION_KEY, FORCE_CLEAN_VERSION);
    showToast(`题库已更新：课后练习与暑假作业已分区，暑假原页单元已加入题库`);
    return true;
  }

  return false;
}

async function loadBundledQuestions() {
  if (globalThis.BUNDLED_QUESTION_BANK) {
    const data = globalThis.BUNDLED_QUESTION_BANK;
    const questions = Array.isArray(data) ? data : data.questions;
    if (Array.isArray(questions)) {
      return questions;
    }
  }
  try {
    const response = await fetch(BUNDLED_DATA_URL, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    const questions = Array.isArray(data) ? data : data.questions;
    return Array.isArray(questions) ? questions : [];
  } catch (error) {
    return [];
  }
}

function updateFilters() {
  if (els.assignmentFilter) {
    const assignmentValues = QuestionBankCore.uniqueValues(state.questions.flatMap((question) => [question.assignmentGroup || "课后作业", ...(Array.isArray(question.assignmentAliases) ? question.assignmentAliases : [])]));
    refillSelect(els.assignmentFilter, ["all", ...assignmentValues], "全部作业");
  }
  refillSelect(els.subjectFilter, ["all", ...QuestionBankCore.uniqueValues(state.questions.map((question) => question.subject))], "全部");
  const selectedSubject = els.subjectFilter.value || "all";
  refillSelect(els.chapterFilter, ["all", ...QuestionBankCore.availableChapters(state.questions, selectedSubject)], "全部");
  const selectedChapter = els.chapterFilter.value || "all";
  if (els.typeFilter) {
    const typeValues = state.questions
      .filter((question) => selectedSubject === "all" || question.subject === selectedSubject)
      .filter((question) => selectedChapter === "all" || question.chapter === selectedChapter)
      .map((question) => question.type || "题目");
    refillSelect(els.typeFilter, ["all", ...QuestionBankCore.uniqueValues(typeValues)], "全部题型");
  }
  const sourceValues = state.questions
    .filter((question) => selectedSubject === "all" || question.subject === selectedSubject)
    .filter((question) => selectedChapter === "all" || question.chapter === selectedChapter)
    .map((question) => question.source || "题库");
  if (els.sourceFilter) {
    refillSelect(els.sourceFilter, ["all", ...QuestionBankCore.uniqueValues(sourceValues)], "全部题源");
  }
  if (els.dayFilter) {
    const dayValues = QuestionBankCore.uniqueValues(state.questions.flatMap((question) => [getQuestionDayLabel(question), ...(Array.isArray(question.dayAliases) ? question.dayAliases : [])]).filter(Boolean));
    refillSelect(els.dayFilter, ["all", ...dayValues], "全部日期");
  }
}

function refillSelect(select, values, allText) {
  const previous = select.value || "all";
  select.innerHTML = "";
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value === "all" ? allText : (select === els.assignmentFilter ? getAssignmentDisplayName(value) : value);
    select.append(option);
  });
  select.value = values.includes(previous) ? previous : "all";
}

function applyFilters() {
  const status = els.statusFilter.value;
  const auditStatusList = ["auditQueue", "auditFeedback", "auditLocked", "auditReference", "auditAnswerOnly", "auditMissing"];
  const coreStatus = ["dueReview", "weakChapter", "mastered", "answerReview", ...auditStatusList].includes(status) ? "all" : status;
  const difficulty = els.difficultyFilter ? els.difficultyFilter.value : "all";
  const assignment = els.assignmentFilter ? els.assignmentFilter.value : "all";
  const type = els.typeFilter ? els.typeFilter.value : "all";
  const source = els.sourceFilter ? els.sourceFilter.value : "all";
  const day = els.dayFilter ? els.dayFilter.value : "all";
  const weakKeys = new Set(getWeakChapterStats().map((item) => item.key));
  const completeSequenceMode = isCompletePracticeSequenceContext() && status === "all";
  const activeCompleteSet = getActiveCompleteSet();
  const activeCompleteOrder = new Map((activeCompleteSet && activeCompleteSet.items || []).map((item, index) => [String(item.questionId), Number(item.order || index + 1)]));

  state.filtered = QuestionBankCore.filterQuestions(state.questions, {
    keyword: els.searchInput.value,
    subject: els.subjectFilter.value,
    chapter: els.chapterFilter.value,
    status: coreStatus,
    progressById: state.progressById
  })
    .filter((question) => questionBelongsToAssignment(question, assignment))
    .filter((question) => type === "all" || String(question.type || "题目") === type)
    .filter((question) => source === "all" || String(question.source || "题库") === source)
    .filter((question) => day === "all" || getQuestionDayLabel(question) === day || (Array.isArray(question.dayAliases) && question.dayAliases.includes(day)))
    .filter((question) => difficulty === "all" || String(question.difficulty) === difficulty)
    .filter((question) => status === "answerReview" ? isUnverifiedAnswer(question) : !isUnverifiedAnswer(question))
    .filter((question) => status !== "auditQueue" || isAuditQueueQuestion(question))
    .filter((question) => status !== "auditFeedback" || hasLocalAuditIssue(question.id))
    .filter((question) => status !== "dueReview" || isDueReview(question))
    .filter((question) => status !== "weakChapter" || weakKeys.has(chapterKey(question)))
    .filter((question) => status !== "mastered" || isMasteredQuestion(question))
    .filter((question) => status !== "auditLocked" || ["locked_text", "locked_image"].includes(getAnalysisAuditCategory(question)))
    .filter((question) => status !== "auditReference" || getAnalysisAuditCategory(question) === "reference_only")
    .filter((question) => status !== "auditAnswerOnly" || getAnalysisAuditCategory(question) === "answer_only")
    .filter((question) => status !== "auditMissing" || getAnalysisAuditCategory(question) === "missing_answer")
    .filter((question) => !activeCompleteSet || activeCompleteOrder.has(String(question.id)))
    .filter((question) => !activeCompleteSet || !state.activeCompleteSetWrongOnly || isWrongQuestion(question))
    .filter((question) => question.pageArchive || !state.autoHideMastered || status === "mastered" || state.activeCompleteSetWrongOnly || !isMasteredQuestion(question))
    .sort((a, b) => activeCompleteSet ? (Number(activeCompleteOrder.get(String(a.id)) || 0) - Number(activeCompleteOrder.get(String(b.id)) || 0)) : sortQuestionsForMode(a, b, status));

  const page = QuestionBankCore.paginate(state.filtered, state.page, PAGE_SIZE);
  state.page = page.page;
  if (!state.selectedId || !state.filtered.some((question) => question.id === state.selectedId)) {
    state.selectedId = page.items[0] ? page.items[0].id : "";
  }
  render();
}


function renderMobileChrome() {
  const tabTitles = { quiz: "刷题", similar: "同类", review: "复习", stats: "统计", me: "我的" };
  const safeTab = tabTitles[state.mobileTab] ? state.mobileTab : "quiz";
  state.mobileTab = safeTab;
  ["quiz", "similar", "review", "stats", "me"].forEach((tab) => {
    document.body.classList.toggle(`mobile-tab-${tab}`, safeTab === tab);
  });
  document.body.classList.toggle("filters-open", Boolean(state.filtersOpen));
  if (els.mobileScreenTitle) {
    els.mobileScreenTitle.textContent = tabTitles[safeTab];
  }
  els.mobileTabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mobileTab === safeTab);
  });
  if (els.mobileTotalCount) {
    els.mobileTotalCount.textContent = state.questions.length;
  }
  if (els.mobileFilteredCount) {
    els.mobileFilteredCount.textContent = state.filtered.length;
  }
  if (els.mobileDailyGoalInput) {
    els.mobileDailyGoalInput.value = getDailyGoal();
  }
  if (els.mobileMeStudyModeButton) {
    els.mobileMeStudyModeButton.classList.toggle("active", state.studyMode);
    els.mobileMeStudyModeButton.textContent = state.studyMode ? "已开单题模式" : "单题模式";
  }
  if (els.mobileTextModeButton) {
    const textMode = state.questionView === "text";
    els.mobileTextModeButton.classList.toggle("active", textMode);
    els.mobileTextModeButton.textContent = textMode ? "返回图文版" : "纯文字版";
  }
  if (els.mobileMeAutoHideMasteredButton) {
    els.mobileMeAutoHideMasteredButton.classList.toggle("active", state.autoHideMastered);
    els.mobileMeAutoHideMasteredButton.textContent = state.autoHideMastered ? "已开启：做对一次隐藏" : "做对一次隐藏";
  }
  if (els.mobileMeTimerButton) {
    els.mobileMeTimerButton.classList.toggle("active", state.timerRunning);
    els.mobileMeTimerButton.textContent = state.timerRunning ? `暂停 ${formatTimer(state.timerSecondsRemaining)}` : "开始倒计时";
  }
}

function setMobileTab(tab) {
  const safe = ["quiz", "similar", "review", "stats", "me"].includes(tab) ? tab : "quiz";
  state.mobileTab = safe;
  state.filtersOpen = false;
  localStorage.setItem(MOBILE_TAB_KEY, safe);
  render();
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function render() {
  const page = QuestionBankCore.paginate(state.filtered, state.page, PAGE_SIZE);
  document.body.classList.toggle("study-mode", state.studyMode);
  if (els.studyModeButton) {
    els.studyModeButton.classList.toggle("active", state.studyMode);
    els.studyModeButton.querySelector("span:last-child").textContent = state.studyMode ? "退出单题" : "单题模式";
  }
  if (els.textModeButton) {
    const textMode = state.questionView === "text";
    els.textModeButton.classList.toggle("active", textMode);
    els.textModeButton.querySelector("span:last-child").textContent = textMode ? "返回图文版" : "纯文字版";
  }
  if (els.autoHideMasteredButton) {
    els.autoHideMasteredButton.classList.toggle("active", state.autoHideMastered);
    els.autoHideMasteredButton.querySelector("span:last-child").textContent = state.autoHideMastered ? "已开启：做对一次隐藏" : "做对一次隐藏";
  }
  updateTimerUI();
  renderCompleteSetActiveBar();
  renderAssignmentZoneTabs();
  renderMobileChrome();
  renderStats();
  renderDashboard();
  renderList(page);
  renderDetail();
  renderSimilarPanel();
  els.pageInfo.textContent = `${page.page} / ${page.totalPages}`;
  els.prevPageButton.disabled = page.page <= 1;
  els.nextPageButton.disabled = page.page >= page.totalPages;
  typesetMathSoon();
}

function renderStats() {
  const progressList = [...state.progressById.values()];
  els.totalCount.textContent = state.questions.length;
  els.filteredCount.textContent = state.filtered.length;
  els.wrongCount.textContent = progressList.filter((progress) => progress.lastResult === "wrong").length;
  els.wrongBookCount.textContent = progressList.filter((progress) => progress.addedToWrongBookAt).length;
  if (els.dueReviewCount) {
    els.dueReviewCount.textContent = state.questions.filter((question) => !question.pageArchive).filter(isDueReview).length;
  }
  if (els.streakCount) {
    els.streakCount.textContent = `${getStudyStreak()}天`;
  }
  if (els.dailyProgressCount) {
    els.dailyProgressCount.textContent = `${getTodayAttemptCount()}/${getDailyGoal()}`;
  }
  if (els.masteredCount) {
    els.masteredCount.textContent = state.questions.filter((question) => !question.pageArchive).filter(isMasteredQuestion).length;
  }
  updateStudyTimeUI();
}




function getMistakeReasonStats() {
  const counts = Object.fromEntries(Object.keys(MISTAKE_REASON_LABELS).map((key) => [key, 0]));
  state.progressById.forEach((progress) => {
    const history = Array.isArray(progress.mistakeReasonHistory) ? progress.mistakeReasonHistory : [];
    if (history.length) {
      history.forEach((item) => {
        if (item && counts[item.type] !== undefined) counts[item.type] += 1;
      });
    } else if (progress.mistakeReason && counts[progress.mistakeReason] !== undefined) {
      counts[progress.mistakeReason] += 1;
    }
  });
  return Object.entries(counts).map(([type, count]) => ({ type, label: MISTAKE_REASON_LABELS[type], count })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count);
}

function renderMistakeReasonChart() {
  const stats = getMistakeReasonStats();
  const max = Math.max(1, ...stats.map((item) => item.count));
  if (!stats.length) {
    return `<p class="muted-text">做错后记录错因，这里会显示粗心、不会、公式忘等分布。</p>`;
  }
  return `<div class="mistake-chart">${stats.map((item) => `<div class="mistake-bar-row"><span>${escapeHtml(item.label)}</span><i><b style="width:${Math.max(6, Math.round(item.count / max * 100))}%"></b></i><em>${item.count}</em></div>`).join("")}</div>`;
}

function renderConceptWrongStreakAlerts() {
  const map = readConceptWrongStreakMap();
  const items = Object.values(map || {}).filter((item) => item && Number(item.count || 0) >= 3).sort((a, b) => Number(b.count || 0) - Number(a.count || 0)).slice(0, 5);
  if (!items.length) return `<p class="muted-text">同一考点连续错 3 次后，会在这里提示你先回看知识点。</p>`;
  return `<div class="streak-alert-list">${items.map((item) => `<button type="button" class="streak-alert" data-streak-search="${escapeHtml(item.label || "")}"><strong>${escapeHtml(item.label || "连续错题")}</strong><span>连续错 ${Number(item.count || 0)} 次</span></button>`).join("")}</div>`;
}

function renderDashboard() {
  if (!els.dashboardPanel) {
    return;
  }
  const mastery = getChapterMasteryStats();
  const weak = getWeakChapterStats();
  const due = state.questions.filter(isDueReview).length;
  const english = getEnglishGrammarStats();
  const dailyDone = getTodayAttemptCount();
  const dailyGoal = getDailyGoal();
  const dailyPercent = Math.min(100, Math.round((dailyDone / Math.max(1, dailyGoal)) * 100));
  const backup = getBackupStatus();
  const topMastery = mastery.slice(0, 8);
  const weakList = weak.slice(0, 5);
  const englishList = english.slice(0, 8);
  const totalStudySeconds = getTotalStudySeconds();
  const todayStudySeconds = getTodayStudySeconds();

  els.dashboardPanel.innerHTML = `
    <div class="dashboard-card dashboard-summary-card review-card">
      <div>
        <p class="eyebrow">Review</p>
        <h2>今日队列 ${due} 题</h2>
        <p>按 1、2、4、7、15 天复习间隔推进。今日任务 ${dailyDone}/${dailyGoal} 题。</p>
      </div>
      <button class="primary-button" id="dashboardReviewButton" type="button">只刷今日复习</button>
      <div class="mobile-review-actions" aria-label="复习入口">
        <button type="button" class="review-action" id="mobileDueReviewButton"><strong>${due}</strong><span>今日复习</span></button>
        <button type="button" class="review-action" id="mobileWeakChapterButton"><strong>${weak.length}</strong><span>薄弱章节</span></button>
        <button type="button" class="review-action" id="mobileWrongRecentButton"><strong>${[...state.progressById.values()].filter((progress) => progress.lastResult === "wrong").length}</strong><span>最近做错</span></button>
        <button type="button" class="review-action" id="mobileWrongBookReviewButton"><strong>${[...state.progressById.values()].filter((progress) => progress.addedToWrongBookAt).length}</strong><span>错题本</span></button>
        <button type="button" class="review-action" id="mobileMasteredReviewButton"><strong>${state.questions.filter(isMasteredQuestion).length}</strong><span>已完成题</span></button>
      </div>
    </div>
    <div class="dashboard-card mastery-card">
      <div class="dashboard-card-head">
        <div>
          <p class="eyebrow">Mastery</p>
          <h2>章节掌握度</h2>
        </div>
        <button class="secondary-button" id="weakOnlyButton" type="button">只刷薄弱章节</button>
      </div>
      <div class="mastery-list">
        ${topMastery.length ? topMastery.map(renderMasteryRow).join("") : `<p class="muted-text">开始做题后这里会显示每章正确率。</p>`}
      </div>
      ${weakList.length ? `<div class="weak-tags">${weakList.map((item) => `<button type="button" class="weak-tag" data-subject="${escapeHtml(item.subject)}" data-chapter="${escapeHtml(item.chapter)}">${escapeHtml(item.subject)} · ${escapeHtml(item.chapter)} ${item.accuracy}%</button>`).join("")}</div>` : ""}
    </div>
    <div class="dashboard-card english-card">
      <p class="eyebrow">English</p>
      <h2>英语语法归类</h2>
      <div class="grammar-grid">
        ${englishList.length ? englishList.map((item) => `<button type="button" class="grammar-pill" data-grammar="${escapeHtml(item.name)}"><strong>${escapeHtml(item.name)}</strong><span>${item.total}题</span></button>`).join("") : `<p class="muted-text">当前英语题暂未识别到更多语法分类。</p>`}
      </div>
    </div>
    <div class="dashboard-card daily-card">
      <div class="dashboard-card-head">
        <div>
          <p class="eyebrow">Daily</p>
          <h2>每日任务 ${dailyDone}/${dailyGoal}</h2>
        </div>
        <label class="mini-field">目标 <input id="dailyGoalInput" type="number" min="10" max="500" step="10" value="${dailyGoal}"></label>
      </div>
      <div class="mastery-bar daily-bar"><i style="width:${dailyPercent}%"></i></div>
      <p>${dailyPercent >= 100 ? "今日任务已完成，可以转入错题复盘。" : `还差 ${Math.max(0, dailyGoal - dailyDone)} 题完成今日目标。`}</p>
    </div>
    <div class="dashboard-card study-time-card">
      <p class="eyebrow">Study Time</p>
      <h2>累计学习 ${formatStudyDuration(totalStudySeconds)}</h2>
      <p>今日学习 ${formatStudyDuration(todayStudySeconds)}。只要页面处于打开状态，就会自动累计；切到后台会暂停计时。</p>
    </div>
    <div class="dashboard-card timer-card">
      <p class="eyebrow">Timer</p>
      <h2 id="timerDisplay">${formatTimer(state.timerSecondsRemaining)}</h2>
      <div class="timer-actions">
        <button class="primary-button" id="timerStartPauseButton" type="button">${state.timerRunning ? "暂停" : "开始"}</button>
        <button class="secondary-button" id="timerResetButton" type="button">重置25分钟</button>
      </div>
      <p>倒计时适合限时刷题，时间到会提示，不会自动清掉进度。</p>
    </div>
    <div class="dashboard-card mistake-card">
      <p class="eyebrow">Mistakes</p>
      <h2>错因统计</h2>
      ${renderMistakeReasonChart()}
    </div>
    <div class="dashboard-card streak-card">
      <p class="eyebrow">Alert</p>
      <h2>三连错提醒</h2>
      ${renderConceptWrongStreakAlerts()}
    </div>
    <div class="dashboard-card backup-card ${backup.needsBackup ? "needs-backup" : ""}">
      <p class="eyebrow">Backup</p>
      <h2>${backup.title}</h2>
      <p>${backup.message}</p>
      <div class="timer-actions backup-actions">
        <button class="secondary-button" id="backupNowButton" type="button">导出本地备份</button>
        <button class="secondary-button" id="importBackupNowButton" type="button">导入本地备份</button>
      </div>
    </div>
  `;

  const dashboardReviewButton = els.dashboardPanel.querySelector("#dashboardReviewButton");
  if (dashboardReviewButton) {
    dashboardReviewButton.addEventListener("click", () => {
      els.statusFilter.value = "dueReview";
      state.page = 1;
      applyFilters();
    });
  }

  const mobileReviewFilters = {
    mobileDueReviewButton: "dueReview",
    mobileWeakChapterButton: "weakChapter",
    mobileWrongRecentButton: "wrong",
    mobileWrongBookReviewButton: "wrongBook",
    mobileMasteredReviewButton: "mastered"
  };
  Object.entries(mobileReviewFilters).forEach(([buttonId, status]) => {
    const button = els.dashboardPanel.querySelector(`#${buttonId}`);
    if (!button) {
      return;
    }
    button.addEventListener("click", () => {
      els.statusFilter.value = status;
      state.mobileTab = "quiz";
      localStorage.setItem(MOBILE_TAB_KEY, "quiz");
      state.page = 1;
      applyFilters();
    });
  });
  const weakOnlyButton = els.dashboardPanel.querySelector("#weakOnlyButton");
  if (weakOnlyButton) {
    weakOnlyButton.addEventListener("click", () => {
      els.statusFilter.value = "weakChapter";
      state.page = 1;
      applyFilters();
    });
  }
  const dailyGoalInput = els.dashboardPanel.querySelector("#dailyGoalInput");
  if (dailyGoalInput) {
    dailyGoalInput.addEventListener("change", () => {
      setDailyGoal(dailyGoalInput.value);
      render();
    });
  }
  const timerStartPauseButton = els.dashboardPanel.querySelector("#timerStartPauseButton");
  if (timerStartPauseButton) {
    timerStartPauseButton.addEventListener("click", toggleTimer);
  }
  const timerResetButton = els.dashboardPanel.querySelector("#timerResetButton");
  if (timerResetButton) {
    timerResetButton.addEventListener("click", resetTimer);
  }
  const backupNowButton = els.dashboardPanel.querySelector("#backupNowButton");
  if (backupNowButton) {
    backupNowButton.addEventListener("click", exportLocalBackup);
  }
  const importBackupNowButton = els.dashboardPanel.querySelector("#importBackupNowButton");
  if (importBackupNowButton) {
    importBackupNowButton.addEventListener("click", openLocalBackupImport);
  }
  els.dashboardPanel.querySelectorAll("[data-streak-search]").forEach((button) => {
    button.addEventListener("click", () => {
      els.searchInput.value = button.dataset.streakSearch || "";
      state.page = 1;
      applyFilters();
    });
  });
  els.dashboardPanel.querySelectorAll(".weak-tag").forEach((button) => {
    button.addEventListener("click", () => {
      els.subjectFilter.value = button.dataset.subject || "all";
      updateFilters();
      els.chapterFilter.value = button.dataset.chapter || "all";
      els.statusFilter.value = "all";
      state.page = 1;
      applyFilters();
    });
  });
  els.dashboardPanel.querySelectorAll(".grammar-pill").forEach((button) => {
    button.addEventListener("click", () => {
      els.subjectFilter.value = "英语";
      updateFilters();
      els.searchInput.value = button.dataset.grammar || "";
      state.page = 1;
      applyFilters();
    });
  });
}

function renderMasteryRow(item) {
  const label = `${item.subject} · ${item.chapter}`;
  const barWidth = Math.max(3, Math.min(100, item.accuracy));
  const statusText = item.attempts ? `${item.correct}/${item.attempts} 对` : "未做";
  return `
    <div class="mastery-row">
      <div class="mastery-row-top">
        <strong>${escapeHtml(label)}</strong>
        <span>${item.accuracy}% · ${statusText}</span>
      </div>
      <div class="mastery-bar"><i style="width:${barWidth}%"></i></div>
    </div>
  `;
}

function renderList(page) {
  const fragment = document.createDocumentFragment();
  let previousAssignment = "";
  let previousPracticeSection = "";
  page.items.forEach((question) => {
    const assignment = String(question.assignmentGroup || "课后作业");
    if (assignment !== previousAssignment) {
      const heading = document.createElement("div");
      heading.className = "assignment-group-heading";
      heading.innerHTML = `<span>大标题</span><strong>${escapeHtml(assignment)}</strong>`;
      fragment.append(heading);
      previousAssignment = assignment;
      previousPracticeSection = "";
    }
    const practiceSection = String(question.practiceSection || question.sectionLabel || question.type || "");
    if (question.practiceSetId && practiceSection && practiceSection !== previousPracticeSection) {
      const sectionHeading = document.createElement("div");
      sectionHeading.className = "practice-section-heading";
      sectionHeading.innerHTML = `<span>题型分区</span><strong>${escapeHtml(practiceSection)}</strong><em>${escapeHtml(question.practiceSetTitle || "")}</em>`;
      fragment.append(sectionHeading);
      previousPracticeSection = practiceSection;
    }
    const progress = readProgress(question.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `question-row${question.id === state.selectedId ? " active" : ""}`;
    button.dataset.id = question.id;
    button.innerHTML = `
      <div class="meta-line">
        <span class="badge assignment-badge">${escapeHtml(getAssignmentDisplayName(question.assignmentGroup || "课后作业"))}</span>
        <span class="badge">${escapeHtml(question.subject)}</span>
        <span>${escapeHtml(question.chapter)}</span>
        <span>${escapeHtml(question.type)}</span>
        <span>${escapeHtml(question.source)}</span>
        <span>${escapeHtml(getQuestionDayLabel(question))}</span>
      </div>
      <h3><span class="sequence-chip">${escapeHtml(getQuestionSequenceLabel(question))}</span>${renderRichText(question.titleLabel || "")}</h3>
      <div class="tag-line">
        ${renderStatusBadges(progress)}
        ${renderAnalysisAuditPill(question)}
        ${renderLocalAuditPill(question.id)}
        <span>难度 ${escapeHtml(question.difficulty)}</span>
      </div>
    `;
    button.addEventListener("click", () => {
      selectQuestion(question.id);
    });
    fragment.append(button);
  });
  els.questionsList.replaceChildren(fragment);
  if (!page.items.length) {
    els.questionsList.innerHTML = `<div class="hidden-solution">没有符合条件的题</div>`;
  }
}

function selectQuestion(questionId) {
  state.selectedId = questionId;
  render();
  scrollDetailPanelIntoView();
}

function isMobileStudyLayout() {
  return window.matchMedia && window.matchMedia("(max-width: 980px)").matches;
}

function scrollDetailPanelIntoView() {
  if (!isMobileStudyLayout() || !els.detailPanel) {
    return;
  }
  window.requestAnimationFrame(() => {
    els.detailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    const firstAction = els.detailPanel.querySelector(".detail-action-dock button");
    if (firstAction) {
      firstAction.focus({ preventScroll: true });
    }
  });
}

function getSelectedQuestionPosition() {
  const index = state.filtered.findIndex((question) => question.id === state.selectedId);
  return {
    index,
    total: state.filtered.length
  };
}

function selectAdjacentQuestion(direction) {
  const position = getSelectedQuestionPosition();
  const nextIndex = position.index + direction;
  if (nextIndex < 0 || nextIndex >= position.total) {
    return;
  }
  const nextQuestion = state.filtered[nextIndex];
  state.page = Math.floor(nextIndex / PAGE_SIZE) + 1;
  selectQuestion(nextQuestion.id);
}

function renderStatusBadges(progress) {
  const badges = [];
  if (!progress || !progress.attempts) {
    badges.push(`<span class="badge">未做</span>`);
  } else if (progress.lastResult === "correct") {
    badges.push(`<span class="badge correct">最近做对</span>`);
  } else {
    badges.push(`<span class="badge wrong">最近做错</span>`);
  }
  if (progress && progress.addedToWrongBookAt) {
    badges.push(`<span class="badge book">已进错题本</span>`);
  }
  if (progress && isProgressMastered(progress)) {
    badges.push(`<span class="badge mastered">已完成</span>`);
  }
  return badges.join("");
}


function setQuestionView(mode) {
  state.questionView = mode === "text" ? "text" : "image";
  localStorage.setItem(QUESTION_VIEW_KEY, state.questionView);
  render();
}

function toggleQuestionView() {
  setQuestionView(state.questionView === "text" ? "image" : "text");
}

function getQuestionTextStem(question) {
  return String(question && (question.textStem || question.stem || question.titleLabel) || "").trim();
}

function getQuestionTextOptions(question) {
  if (Array.isArray(question && question.textOptions) && question.textOptions.length) {
    return question.textOptions;
  }
  return Array.isArray(question && question.options) ? question.options : [];
}

function renderQuestionViewSwitch() {
  const textMode = state.questionView === "text";
  return `
    <div class="question-view-switch" role="group" aria-label="题目显示方式">
      <button type="button" class="view-switch-button ${textMode ? "" : "active"}" data-question-view="image">图文版</button>
      <button type="button" class="view-switch-button ${textMode ? "active" : ""}" data-question-view="text">纯文字版</button>
    </div>`;
}

function renderQuestionBody(question, progress) {
  if (state.questionView === "text") {
    if (question && question.forceImageTextFallback) {
      return `
        <div class="pure-text-question pure-text-image-fallback">
          <div class="ocr-protection-note"><strong>已自动避开乱码文字</strong><span>本题直接显示清晰原题图，题干和选项不再使用错误OCR文本。</span></div>
          ${renderImages(question.images, "原题")}
        </div>`;
    }
    const englishDrill = renderEnglishSentenceDrill(question);
    if (englishDrill) return englishDrill;
    const options = getQuestionTextOptions(question);
    const noOptions = !options.length && !isJudgmentQuestion(question)
      ? `<p class="pure-text-no-options">本题原资料没有选择项，按题目要求作答。</p>`
      : "";
    const formulaProof = question.textFormulaImage
      ? `<div class="pure-text-formula-proof">
          <p class="pure-text-formula-label">公式原式（用于核对根号、分式、上下标等符号）</p>
          ${renderImages([question.textFormulaImage], "公式原式")}
        </div>`
      : "";
    return `
      <div class="pure-text-question">
        <div class="pure-text-paper-head"><span>${escapeHtml(getQuestionSequenceLabel(question))}</span><b>${escapeHtml(getPureTextTypeLabel(question))}</b></div>
        <div class="pure-text-stem">${renderPureTextStem(question)}</div>
        ${formulaProof}
        ${renderOptions(options, question, progress)}
        ${noOptions}
      </div>`;
  }
  return `
    <p class="image-question-label">${renderRichText(question.titleLabel || question.stem)}</p>
    ${renderImages(question.images, "原题")}
    ${renderOptions(question.options, question, progress)}`;
}

function renderDetail() {
  const question = state.questions.find((item) => item.id === state.selectedId);
  if (!question) {
    els.detailPanel.innerHTML = `
      <div class="empty-detail">
        <p class="eyebrow">Detail</p>
        <h2>选择一道题开始</h2>
        <p>答案和解析会先隐藏，检查时再打开。</p>
      </div>
    `;
    return;
  }

  const progress = getProgress(question.id);
  const visible = QuestionBankCore.isSolutionVisible(progress);
  const hasSolution = Boolean(String(question.answer || "").trim() || String(question.analysis || "").trim() || String(question.officialAnalysis || "").trim() || (Array.isArray(question.analysisImages) && question.analysisImages.length));
  const inWrongBook = Boolean(progress.addedToWrongBookAt);
  const position = getSelectedQuestionPosition();
  const currentPosition = position.index >= 0 ? position.index + 1 : 0;
  const canGoPrev = position.index > 0;
  const canGoNext = position.index >= 0 && position.index < position.total - 1;
  const grammar = getEnglishGrammarCategory(question);
  els.detailPanel.innerHTML = `
    <article class="question-detail" data-question-id="${escapeHtml(question.id)}">
      <header class="detail-header">
        <p class="eyebrow">${escapeHtml(getAssignmentDisplayName(question.assignmentGroup || "课后作业"))} · ${escapeHtml(question.source)} · ${escapeHtml(getQuestionDayLabel(question))} · ${escapeHtml(question.subject)} · ${escapeHtml(question.chapter)}</p>
        <h2><span class="desktop-question-title">${escapeHtml(getQuestionSequenceLabel(question))}</span><span class="mobile-question-title">${escapeHtml(getQuestionSequenceLabel(question))}</span></h2>
        <div class="mobile-question-topnav">
          <button class="secondary-button nav-button" id="mobilePrevQuestionButton" type="button" aria-label="上一题"${canGoPrev ? "" : " disabled"}>←</button>
          <span class="detail-position">${currentPosition} / ${position.total}</span>
          <button class="secondary-button nav-button" id="mobileNextQuestionButton" type="button" aria-label="下一题"${canGoNext ? "" : " disabled"}>→</button>
        </div>
        <div class="meta-line">
          ${renderStatusBadges(progress)}
          ${isDueReview(question) ? `<span class="badge review">今日复习</span>` : ""}
          ${grammar ? `<span class="badge grammar">${escapeHtml(grammar)}</span>` : ""}
          ${renderAnalysisAuditPill(question)}
          ${renderLocalAuditPill(question.id)}
          <span>已做 ${progress.attempts} 次</span>
          <span>对 ${progress.correct} 次</span>
          <span>错 ${progress.wrong} 次</span>
          ${progress.lastSelectedOption ? `<span>上次选 ${escapeHtml(progress.lastSelectedOption)}${progress.lastChoiceCorrect ? " ✓" : " ✗"}</span>` : ""}
          ${progress.mistakeReasonLabel ? `<span>错因：${escapeHtml(progress.mistakeReasonLabel)}</span>` : ""}
          ${progress.nextReviewAt ? `<span>下次 ${escapeHtml(progress.nextReviewAt)}</span>` : ""}
        </div>
        ${renderSourceClassifier(question)}
      </header>

      <section class="stem-box ${state.questionView === "text" ? "text-view-active" : "image-view-active"}">
        <div class="stem-box-heading"><strong>题目</strong>${renderQuestionViewSwitch()}</div>
        ${renderQuestionBody(question, progress)}
      </section>

      ${progress.hintVisible ? renderFormulaHint(question) : ""}
      ${hasSolution ? (visible ? renderSolution(question, progress) : `<div class="hidden-solution">答案与解析已隐藏</div>`) : `<div class="hidden-solution">答案和解析待你后续提供</div>`}

      <div class="detail-action-dock">
        <div class="detail-nav-actions">
          <button class="secondary-button nav-button" id="prevQuestionButton" type="button" aria-label="上一题"${canGoPrev ? "" : " disabled"}>←</button>
          <span class="detail-position">${currentPosition} / ${position.total}</span>
          <button class="secondary-button nav-button" id="nextQuestionButton" type="button" aria-label="下一题"${canGoNext ? "" : " disabled"}>→</button>
        </div>
        <div class="detail-actions">
          <button class="secondary-button" id="hintButton" type="button">${progress.hintVisible ? "隐藏公式提示" : "公式提示"}</button>
          <button class="secondary-button" id="revealButton" type="button"${hasSolution ? "" : " disabled"}>${hasSolution ? (visible ? "隐藏解析" : "答案解析") : "答案待补"}</button>
          <button class="primary-button" id="correctButton" type="button">做对了</button>
          <button class="secondary-button" id="wrongButton" type="button">做错了</button>
          <button class="secondary-button" id="addWrongBookButton" type="button">${inWrongBook ? "取消错题本" : "加入错题本"}</button>
          <button class="secondary-button generated-practice-button" id="generateSimilarButton" type="button">自动出类似题</button>
          <button class="secondary-button audit-action-button" id="auditFeedbackButton" type="button">标记解析问题</button>
          <button class="secondary-button audit-action-button" id="auditDeskButton" type="button">打开校对台</button>
        </div>
      </div>

    </article>
  `;

  document.querySelector("#prevQuestionButton").addEventListener("click", () => selectAdjacentQuestion(-1));
  document.querySelector("#nextQuestionButton").addEventListener("click", () => selectAdjacentQuestion(1));
  const mobilePrevQuestionButton = document.querySelector("#mobilePrevQuestionButton");
  const mobileNextQuestionButton = document.querySelector("#mobileNextQuestionButton");
  if (mobilePrevQuestionButton) {
    mobilePrevQuestionButton.addEventListener("click", () => selectAdjacentQuestion(-1));
  }
  if (mobileNextQuestionButton) {
    mobileNextQuestionButton.addEventListener("click", () => selectAdjacentQuestion(1));
  }
  document.querySelector("#hintButton").addEventListener("click", () => toggleHint(question.id));
  const revealButton = document.querySelector("#revealButton");
  if (revealButton && hasSolution) revealButton.addEventListener("click", () => toggleSolution(question.id));
  document.querySelector("#correctButton").addEventListener("click", () => saveAttempt(question.id, "correct"));
  document.querySelector("#wrongButton").addEventListener("click", () => saveAttempt(question.id, "wrong"));
  document.querySelector("#addWrongBookButton").addEventListener("click", () => {
    if (getProgress(question.id).addedToWrongBookAt) {
      removeFromWrongBook(question.id);
      return;
    }
    addToWrongBook(question.id);
  });
  const generateSimilarButton = document.querySelector("#generateSimilarButton");
  if (generateSimilarButton) {
    generateSimilarButton.addEventListener("click", () => generateAndOpenSimilarQuestion(question));
  }
  const auditFeedbackButton = document.querySelector("#auditFeedbackButton");
  if (auditFeedbackButton) {
    auditFeedbackButton.addEventListener("click", () => quickAuditFeedback(question.id));
  }
  const auditDeskButton = document.querySelector("#auditDeskButton");
  if (auditDeskButton) {
    auditDeskButton.addEventListener("click", () => openAuditDesk(question.id));
  }
  els.detailPanel.querySelectorAll("[data-question-view]").forEach((button) => {
    button.addEventListener("click", () => setQuestionView(button.dataset.questionView));
  });
  els.detailPanel.querySelectorAll("[data-source-choice]").forEach((button) => {
    button.addEventListener("click", () => setQuestionSource(question.id, button.dataset.sourceChoice));
  });
  els.detailPanel.querySelectorAll("[data-solution-level]").forEach((button) => {
    button.addEventListener("click", () => setSolutionLevel(question.id, button.dataset.solutionLevel));
  });
  els.detailPanel.querySelectorAll("[data-option-choice]").forEach((button) => {
    button.addEventListener("click", () => handleOptionChoice(question.id, button.dataset.optionChoice));
  });
  els.detailPanel.querySelectorAll("[data-similar-id]").forEach((button) => {
    button.addEventListener("click", () => selectQuestion(button.dataset.similarId));
  });
  els.detailPanel.querySelectorAll("[data-audit-feedback]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.auditFeedback;
      if (action === "clear") return clearAuditFeedback(question.id);
      saveAuditFeedback(question.id, action);
    });
  });
  els.detailPanel.querySelectorAll("[data-zoom-image]").forEach((button) => {
    button.addEventListener("click", () => openImageZoom(button.dataset.zoomImage));
  });
}

function isJudgmentQuestion(question) {
  const type = String(question && question.type || "");
  return /判断|正误/i.test(type);
}

function getQuestionOptions(question, options) {
  if (isJudgmentQuestion(question)) {
    return ["A. 对", "B. 错"];
  }
  return Array.isArray(options) ? options : [];
}

function renderOptions(options, question = null, progress = null) {
  const displayOptions = getQuestionOptions(question, options);
  if (!displayOptions.length) {
    return "";
  }
  const letters = question ? normalizeAnswerLetters(question.answer, question) : new Set();
  const answerKnown = letters.size === 1;
  const canClick = Boolean(question && displayOptions.length);
  const selected = String(progress && progress.lastSelectedOption || "").toUpperCase();
  return `<ul class="options-list ${canClick ? "clickable-options" : ""}">${displayOptions.map((option, index) => {
    const letter = extractOptionLetter(option, index);
    const isSelected = selected && selected === letter;
    const isCorrect = letters.has(letter);
    const cls = ["option-choice", isSelected ? "selected" : "", isSelected && !answerKnown ? "pending" : "", isSelected && answerKnown && isCorrect ? "correct" : "", isSelected && answerKnown && !isCorrect ? "wrong" : ""].filter(Boolean).join(" ");
    const body = `${canClick ? `<button type="button" class="${cls}" data-option-choice="${escapeHtml(letter)}" aria-label="选择 ${escapeHtml(letter)}">` : `<span class="option-choice plain">`}${renderRichText(option)}${canClick ? `</button>` : `</span>`}`;
    return `<li>${body}</li>`;
  }).join("")}</ul>`;
}

function getPersonalPhraseEntries(text) {
  const source = String(text || "").toLowerCase();
  if (!source || !Array.isArray(window.WORD_MEMORY_WORDS)) return [];
  const seen = new Set();
  return window.WORD_MEMORY_WORDS.map((word) => {
    const clean = (value) => {
      const raw = String(value || "").split(/[；;，,。、“”"<>]/)[0].trim();
      return /^[A-Za-z][A-Za-z .'-]*$/.test(raw) && !/[\u4e00-\u9fff]/.test(raw) ? raw.replace(/\.{2,}/g, ".") : "";
    };
    const fromPhrase = clean(String(word.phrase || "").match(/[A-Za-z][A-Za-z .'-]*/)?.[0]);
    return { term: clean(word.term), fallback: fromPhrase };
  }).flatMap((item) => [item, item.fallback ? { term: item.fallback, meaning: item.meaning } : []])
    .filter((item) => /\s/.test(item.term) && item.term.length >= 3 && source.includes(item.term.toLowerCase()))
    .sort((a, b) => b.term.length - a.term.length)
    .filter((item) => !seen.has(item.term.toLowerCase()) && seen.add(item.term.toLowerCase()))
    .slice(0, 5);
}

function highlightPersonalPhrases(text) {
  let html = escapeHtml(String(text || ""));
  getPersonalPhraseEntries(text).forEach((item) => {
    const escaped = item.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(new RegExp(`\\b(${escaped})\\b`, "gi"), `<mark class="phrase-hit">$1</mark>`);
  });
  return html;
}

function renderEnglishSentenceDrill(question) {
  if (String(question && question.subject || "") !== "英语") return "";
  const stem = getQuestionTextStem(question);
  const chunks = String(stem || "").split(/(?=\s*\d{1,2}[\.．、])/).map((part) => part.trim()).filter(Boolean);
  if (chunks.length < 3) return "";
  const instruction = chunks.shift();
  const completed = JSON.parse(localStorage.getItem(`qb-english-drill-${question.id}`) || "[]");
  return `<div class="english-micro-drill"><div class="english-drill-intro"><strong>拆分练习</strong><span>${renderRichText(instruction)}</span></div>${chunks.map((sentence, index) => {
    const phrases = getPersonalPhraseEntries(sentence);
    const done = completed.includes(index);
    return `<article class="english-micro-card ${done ? "done" : ""}" data-english-sub="${index}"><div class="english-micro-head"><span>第 ${index + 1} 句</span><button type="button" onclick="toggleEnglishSubQuestion('${escapeHtml(question.id)}',${index},this)">${done ? "已完成 ✓" : "完成本句"}</button></div><div class="english-micro-sentence">${highlightPersonalPhrases(sentence)}</div>${phrases.length ? `<div class="phrase-note">${phrases.map((item) => `<span>${escapeHtml(item.term)}</span>`).join("")}</div>` : ""}</article>`;
  }).join("")}</div>`;
}

window.toggleEnglishSubQuestion = function toggleEnglishSubQuestion(questionId, index, button) {
  const key = `qb-english-drill-${questionId}`;
  const saved = new Set(JSON.parse(localStorage.getItem(key) || "[]"));
  if (saved.has(index)) saved.delete(index); else saved.add(index);
  localStorage.setItem(key, JSON.stringify([...saved]));
  const card = button.closest(".english-micro-card");
  const done = saved.has(index);
  card.classList.toggle("done", done);
  button.textContent = done ? "已完成 ✓" : "完成本句";
};



const IMAGE_VERSION = "20260801-v62-summer-continuation-pages";
const IMAGE_PACK_SCRIPTS = [
  { prefix: "question-images/day-15-0730-homework-encoding/", file: "image-pack-homework-v59.js" },
  { prefix: "question-images/day-14-0729-homework-58/", file: "image-pack-homework-v57.js" },
  { prefix: "question-images/day-14-0729-homework-supplement/", file: "image-pack-homework-v57.js" },
  { prefix: "question-images/day-13-0728-homework-binary-427/", file: "image-pack-homework-v55.js" },
  { prefix: "question-images/day-13-0728-homework-complete/", file: "image-pack-homework-v54.js" },
  { prefix: "question-images/day-11-0726-bf-math-function/", file: "image-pack-bf-math-function.js" },
  { prefix: "question-images/day-06-0721-summer/", file: "image-pack-summer.js" },
  { prefix: "question-images/official-answer-crops/comp_scan/", file: "image-pack-comp.js" },
  { prefix: "question-images/wrongbook-math/", files: ["image-pack-wrongbook-01.js", "image-pack-wrongbook-02.js", "image-pack-wrongbook-03.js", "image-pack-wrongbook-04.js"] },
  { prefix: "question-images/official-answer-crops/math_func/", file: "image-pack-math-eng.js" },
  { prefix: "question-images/official-answer-crops/eng_np/", file: "image-pack-math-eng.js" },
  { prefix: "question-images/answer-math-function/", file: "image-pack-math-eng.js" },
  { prefix: "question-images/official-answer-pages/english_uploaded/", file: "image-pack-english-uploaded-v24.js" }
];
const loadedImagePackPromises = new Map();

function normalizeImagePath(path) {
  return String(path || "").trim().replace(/^\.\//, "").replace(/\\/g, "/");
}

function isLocalFileMode() {
  return typeof window !== "undefined" && window.location && window.location.protocol === "file:";
}

function imageSrc(path) {
  const raw = normalizeImagePath(path);
  if (!raw || raw.startsWith("data:") || /^https?:\/\//i.test(raw) || raw.startsWith("blob:")) return raw;
  return `./${raw}`;
}

function getImagePackFiles(rawPath) {
  const raw = normalizeImagePath(rawPath);
  const hit = IMAGE_PACK_SCRIPTS.find((item) => raw.startsWith(item.prefix));
  if (!hit) return [];
  if (Array.isArray(hit.files)) return hit.files;
  return hit.file ? [hit.file] : [];
}

function loadImagePack(file) {
  if (!file) return Promise.resolve(false);
  if (window.QB_IMAGE_PACKS_LOADED && window.QB_IMAGE_PACKS_LOADED[file]) return Promise.resolve(true);
  if (loadedImagePackPromises.has(file)) return loadedImagePackPromises.get(file);
  const promise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = isLocalFileMode() ? `./${file}` : `./${file}?v=${IMAGE_VERSION}`;
    script.onload = () => {
      window.QB_IMAGE_PACKS = window.QB_IMAGE_PACKS || {};
      if (window.IMAGE_PACKS && typeof window.IMAGE_PACKS === "object") {
        Object.values(window.IMAGE_PACKS).forEach((pack) => {
          if (pack && typeof pack === "object") Object.assign(window.QB_IMAGE_PACKS, pack);
        });
      }
      window.QB_IMAGE_PACKS_LOADED = window.QB_IMAGE_PACKS_LOADED || {};
      window.QB_IMAGE_PACKS_LOADED[file] = true;
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  loadedImagePackPromises.set(file, promise);
  return promise;
}

function loadImagePacks(files) {
  const list = Array.isArray(files) ? files.filter(Boolean) : [];
  if (!list.length) return Promise.resolve(false);
  return Promise.all(list.map((file) => loadImagePack(file))).then((results) => results.some(Boolean));
}

window.handleQuestionImageError = async function handleQuestionImageError(img) {
  if (!img) return;
  const raw = normalizeImagePath(String(img.dataset.rawImage || img.getAttribute("src") || "").split("?")[0].replace(/^\.\//, ""));
  if (!raw) return;
  if (img.dataset.fallbackTried === "1") {
    img.classList.add("image-load-failed");
    const box = img.closest("figure") || img.parentElement;
    if (box && !box.querySelector(".image-error-note")) {
      const note = document.createElement("div");
      note.className = "image-error-note";
      note.innerHTML = "图片未加载：已尝试备用图片包。请检查 question-images 是否完整上传，或点图重新放大再试。";
      box.appendChild(note);
    }
    return;
  }
  img.dataset.fallbackTried = "1";
  const existing = window.QB_IMAGE_PACKS && window.QB_IMAGE_PACKS[raw];
  if (existing) {
    img.src = existing;
    return;
  }
  const packFiles = getImagePackFiles(raw);
  const ok = await loadImagePacks(packFiles);
  const packed = ok && window.QB_IMAGE_PACKS && window.QB_IMAGE_PACKS[raw];
  if (packed) {
    img.src = packed;
    return;
  }
  const fallbackCandidates = [];
  if (/\.jpg$/i.test(raw)) fallbackCandidates.push(raw.replace(/\.jpg$/i, ".webp"), raw.replace(/\.jpg$/i, ".png"));
  if (/\.webp$/i.test(raw)) fallbackCandidates.push(raw.replace(/\.webp$/i, ".jpg"), raw.replace(/\.webp$/i, ".png"));
  const next = fallbackCandidates.find((candidate) => candidate && candidate !== raw);
  img.src = next ? `./${next}` : `./${raw}`;
};

function renderImages(images, label = "原题图片") {
  if (!images || !images.length) {
    return "";
  }
  return `
    <div class="question-images">
      ${images.map((image, index) => {
        const raw = normalizeImagePath(image);
        const src = imageSrc(raw);
        return `
        <figure class="question-image">
          <button class="image-zoom-button" type="button" data-zoom-image="${escapeHtml(raw)}" aria-label="放大查看${escapeHtml(label)} ${index + 1}">
            <img src="${escapeHtml(src)}" data-raw-image="${escapeHtml(raw)}" alt="${escapeHtml(label)} ${index + 1}" loading="eager" decoding="async" onerror="window.handleQuestionImageError && window.handleQuestionImageError(this)">
          </button>
          <figcaption>点图放大</figcaption>
        </figure>`;
      }).join("")}
    </div>
  `;
}


function isUnverifiedAnswer(question) {
  return String(question && question.answerStatus || "") === "unverified" || (question && Array.isArray(question.tags) && question.tags.includes("答案待核对"));
}


function getAnalysisAuditCategory(question) {
  if (!question) return "answer_only";
  if (question.auditCategory) return String(question.auditCategory);
  const officialAnalysis = String(question.officialAnalysis || "").trim();
  const imageLabel = String(question.analysisImageLabel || "");
  const analysisSource = String(question.analysisSource || "");
  if (officialAnalysis) return "locked_text";
  if (Array.isArray(question.analysisImages) && question.analysisImages.length && !imageLabel.includes("备查") && !analysisSource.includes("未逐题")) return "locked_image";
  if ((Array.isArray(question.backupAnalysisImages) && question.backupAnalysisImages.length) || analysisSource.includes("备查") || analysisSource.includes("未绑定")) return "reference_only";
  if (question.answer) return "answer_only";
  return "missing_answer";
}

function getAnalysisAuditLabel(question) {
  const category = getAnalysisAuditCategory(question);
  if (category === "complete_set_official") return "整套官方答案已录入";
  if (category === "locked_text") return "逐题文字解析已锁定";
  if (category === "locked_image") return "逐题图片/原图已锁定";
  if (category === "reference_only") return "仅答案原图备查";
  if (category === "answer_only") return "仅答案";
  return "无答案/解析";
}

function renderAnalysisAuditNotice(question) {
  const category = getAnalysisAuditCategory(question);
  const flags = Array.isArray(question.auditFlags) ? question.auditFlags.filter(Boolean) : [];
  const label = getAnalysisAuditLabel(question);
  if (category === "complete_set_official") {
    return `<section class="audit-card audit-ok"><strong>答案核查</strong><p>整套官方答案与解析已录入。当前原题按教材原页归档，请在下方答案页或PDF中按原题题号查阅，避免把一页内多道题错误拆配。</p></section>`;
  }
  if (category === "locked_text" || category === "locked_image") {
    return `<section class="audit-card audit-ok"><strong>解析核查</strong><p>${escapeHtml(label)}</p></section>`;
  }
  if (category === "reference_only") {
    return `<section class="audit-card audit-reference"><strong>解析核查</strong><p>${escapeHtml(label)}：这类题暂未确认逐题对应，已放同章节答案原图供核对，不再伪装成当前题解析。</p>${flags.length ? `<p class="source-line">${escapeHtml(flags.join("；"))}</p>` : ""}</section>`;
  }
  return `<section class="audit-card audit-warning"><strong>解析核查</strong><p>${escapeHtml(label)}：目前只保留答案，等待继续补官方解析。</p>${flags.length ? `<p class="source-line">${escapeHtml(flags.join("；"))}</p>` : ""}</section>`;
}

function renderAnswerQualityNotice(question) {
  if (!isUnverifiedAnswer(question)) {
    return "";
  }
  return `
    <section class="answer-quality-box">
      <strong>答案待核对</strong>
      <p>这题题目还保留，但答案和解析暂不作为可背内容；已从默认刷题、今日复习和同类推荐中移出。需要核对原答案后再恢复。</p>
    </section>
  `;
}

function getAnswerAuthorityLabel(question) {
  const authority = String(question && question.answerAuthority || "");
  if (authority === "official") return "官方答案";
  if (authority === "ai") return "AI整理";
  if (authority === "unverified") return "待核对";
  if (String(question && question.answerStatus || "").startsWith("official")) return "官方答案";
  return "";
}

function getSourceDisplay(question) {
  const parts = [];
  if (question.questionSource || question.source) parts.push(`题源：${question.questionSource || question.source}`);
  if (question.answerSource || question.verifiedSource) parts.push(`答案：${question.answerSource || question.verifiedSource}`);
  if (question.analysisSource) parts.push(`解析：${question.analysisSource}`);
  return parts.filter(Boolean).join(" ｜ ");
}

function compactAnalysisText(text, maxLength = 150) {
  const clean = String(text || "").replace(/\n+/g, " ").replace(/\s{2,}/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength)}……`;
}

function renderShortAnalysis(title, text, source, className = "analysis-box official-text-card") {
  const content = String(text || "").trim();
  if (!content) return "";
  const normalized = content.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  const flat = normalized.replace(/\n+/g, " ").replace(/\s{2,}/g, " ").trim();
  const needsDetails = flat.length > 520;
  return `
    <section class="${className}">
      <strong>${escapeHtml(title)}</strong>
      ${source ? `<div class="source-line">${escapeHtml(source)}</div>` : ""}
      ${needsDetails
        ? `<p class="analysis-preview">${renderRichText(compactAnalysisText(normalized, 260))}</p><details class="analysis-details"><summary>展开完整解析</summary><p class="official-analysis-full">${renderRichText(normalized)}</p></details>`
        : `<p class="official-analysis-full">${renderRichText(normalized)}</p>`}
    </section>
  `;
}

function renderSourceCard(question) {
  const source = getSourceDisplay(question);
  if (!source) return "";
  return `<section class="source-card"><strong>来源</strong><p>${escapeHtml(source)}</p></section>`;
}

function renderAnalysisImageToggle(question, forceOpen = false) {
  if (!Array.isArray(question.analysisImages) || !question.analysisImages.length) return "";
  const imageLabel = String(question.analysisImageLabel || "官方解析原图").trim() || "官方解析原图";
  const summaryLabel = imageLabel === "错题本原图" ? "查看错题本原图" : `查看${imageLabel}`;
  if (forceOpen) {
    return `
      <section class="analysis-image-card official-image-open">
        <strong>${escapeHtml(imageLabel)}</strong>
        ${renderImages(question.analysisImages, imageLabel)}
      </section>
    `;
  }
  return `
    <section class="analysis-image-card">
      <strong>${escapeHtml(imageLabel)}</strong>
      <details>
        <summary>${escapeHtml(summaryLabel)}</summary>
        ${renderImages(question.analysisImages, imageLabel)}
      </details>
    </section>
  `;
}

function renderBackupAnalysisImages(question) {
  if (!Array.isArray(question.backupAnalysisImages) || !question.backupAnalysisImages.length) return "";
  const label = String(question.backupAnalysisImageLabel || "完整答案页备份").trim() || "完整答案页备份";
  return `
    <section class="analysis-image-card backup-page-card">
      <strong>${escapeHtml(label)}</strong>
      <details ${label.includes("备查") ? "open" : ""}>
        <summary>查看${escapeHtml(label)}</summary>
        ${renderImages(question.backupAnalysisImages, label)}
      </details>
    </section>
  `;
}

function renderAnalysisPdfLink(question) {
  const pdf = String(question && question.analysisPdf || "").trim();
  if (!pdf) return "";
  const label = String(question.analysisPdfLabel || "打开完整答案PDF").trim() || "打开完整答案PDF";
  return `<section class="analysis-pdf-card"><strong>完整答案文件</strong><a class="secondary-button answer-pdf-button" href="${escapeHtml(pdf)}" target="_blank" rel="noopener">${escapeHtml(label)}</a></section>`;
}

function renderSolution(question, progress) {
  const level = progress.solutionLevel || "answer";
  const showAnalysis = level === "analysis";
  const officialAnalysis = String(question.officialAnalysis || "").trim();
  const hasOfficialImage = Array.isArray(question.analysisImages) && question.analysisImages.length > 0;
  const imageLabel = String(question.analysisImageLabel || "").trim();
  const isWrongbookMathImage = imageLabel === "错题本原图" || String(question.source || "").includes("高数270道错题本") || String(question.questionSource || "").includes("高数270道错题本");
  const sourceLabel = getSourceDisplay(question);
  return `
    <section class="solution-tabs" aria-label="分层答案">
      <button type="button" class="secondary-button ${level === "answer" ? "active" : ""}" data-solution-level="answer">只看答案</button>
      <button type="button" class="secondary-button ${level === "analysis" ? "active" : ""}" data-solution-level="analysis">查看解析</button>
    </section>
    ${renderAnswerQualityNotice(question)}
    ${showAnalysis ? renderAnalysisAuditNotice(question) : ""}
    ${showAnalysis ? renderAuditFeedbackPanel(question) : ""}
    <section class="solution-box ${isUnverifiedAnswer(question) ? "unverified-solution" : ""}">
      <div class="solution-title-row"><strong>答案</strong>${getAnswerAuthorityLabel(question) ? `<span class="answer-authority ${escapeHtml(String(question.answerAuthority || ""))}">${escapeHtml(getAnswerAuthorityLabel(question))}</span>` : ""}</div>
      <p>${renderRichText(question.answer || "未填写")}</p>
      ${sourceLabel ? `<div class="source-line">${escapeHtml(sourceLabel)}</div>` : ""}
      ${showAnalysis && hasOfficialImage && isWrongbookMathImage ? `<div class="wrongbook-inline-analysis"><strong>${escapeHtml(imageLabel || "错题本原图")}</strong>${renderImages(question.analysisImages, imageLabel || "错题本原图")}</div>` : ""}
    </section>
    ${showAnalysis && officialAnalysis ? renderShortAnalysis("官方解析", officialAnalysis, question.analysisSource || question.verifiedSource || "") : ""}
    ${showAnalysis && hasOfficialImage && !isWrongbookMathImage ? renderAnalysisImageToggle(question, !officialAnalysis) : ""}
    ${showAnalysis ? renderBackupAnalysisImages(question) : ""}
    ${showAnalysis ? renderAnalysisPdfLink(question) : ""}
  `;
}

function enrichProgress(progress, questionId) {
  const base = QuestionBankCore.normalizeProgress(progress, questionId);
  return {
    ...base,
    reviewLevel: Number(progress && progress.reviewLevel || 0),
    nextReviewAt: String(progress && progress.nextReviewAt || ""),
    hintVisible: Boolean(progress && progress.hintVisible),
    solutionLevel: String(progress && progress.solutionLevel || "answer"),
    correctStreak: Number(progress && progress.correctStreak || 0),
    lastSelectedOption: String(progress && progress.lastSelectedOption || ""),
    lastChoiceCorrect: Boolean(progress && progress.lastChoiceCorrect),
    mistakeReason: String(progress && progress.mistakeReason || ""),
    mistakeReasonLabel: String(progress && progress.mistakeReasonLabel || ""),
    mistakeReasonHistory: Array.isArray(progress && progress.mistakeReasonHistory) ? progress.mistakeReasonHistory : []
  };
}


function readProgress(questionId) {
  return enrichProgress(state.progressById.get(questionId), questionId);
}

function getProgress(questionId) {
  if (!state.progressById.has(questionId)) {
    state.progressById.set(questionId, enrichProgress(QuestionBankCore.createProgress(questionId), questionId));
  }
  const progress = enrichProgress(state.progressById.get(questionId), questionId);
  state.progressById.set(questionId, progress);
  return progress;
}

async function saveProgress(progress) {
  const next = enrichProgress(progress, progress.questionId);
  state.progressById.set(next.questionId, next);
  await putOne(PROGRESS_STORE, next);
  markLocalSaved();
  queueCloudSync();
}

async function toggleHint(questionId) {
  const progress = getProgress(questionId);
  await saveProgress({ ...progress, hintVisible: !progress.hintVisible });
  render();
}

async function setSolutionLevel(questionId, level) {
  const safeLevel = ["answer", "analysis"].includes(level) ? level : "answer";
  await saveProgress({ ...getProgress(questionId), solutionLevel: safeLevel, solutionVisible: true });
  render();
}

async function toggleSolution(questionId) {
  const progress = getProgress(questionId);
  const visible = !QuestionBankCore.isSolutionVisible(progress);
  const next = QuestionBankCore.setSolutionVisible(progress, visible);
  await saveProgress({ ...next, solutionLevel: visible ? "analysis" : (progress.solutionLevel || "answer") });
  render();
}


function askMistakeReason(question) {
  const promptText = [
    "请选择错因：",
    "1 不会",
    "2 粗心",
    "3 公式忘了",
    "4 概念混淆",
    "5 题干看错",
    "6 解析看不懂",
    "直接回车 = 不记录错因"
  ].join("\n");
  const choice = String(window.prompt(promptText, "1") || "").trim();
  const map = { "1": "unknown", "2": "careless", "3": "formula", "4": "concept", "5": "stem", "6": "analysis" };
  const type = map[choice];
  if (!type) return null;
  return { type, label: MISTAKE_REASON_LABELS[type] || "错因" };
}

function getConceptKey(question) {
  if (!question) return "未分类";
  const grammar = question.subject === "英语" ? getEnglishGrammarCategory(question) : "";
  const tag = Array.isArray(question.tags) && question.tags.length ? String(question.tags[0]) : "";
  return [question.subject || "未分类", question.chapter || "未分章", grammar || tag || question.type || "练习"].filter(Boolean).join(" · ");
}

function readConceptWrongStreakMap() {
  return readJsonMap(CONCEPT_WRONG_STREAK_KEY);
}

function writeConceptWrongStreakMap(map) {
  writeJsonMap(CONCEPT_WRONG_STREAK_KEY, map);
}

function updateConceptWrongStreak(question, result) {
  const key = getConceptKey(question);
  const map = readConceptWrongStreakMap();
  const current = map[key] && typeof map[key] === "object" ? map[key] : { count: 0, label: key };
  if (result === "wrong") {
    current.count = Number(current.count || 0) + 1;
    current.label = key;
    current.updatedAt = new Date().toISOString();
    map[key] = current;
  } else {
    current.count = 0;
    current.label = key;
    current.updatedAt = new Date().toISOString();
    map[key] = current;
  }
  writeConceptWrongStreakMap(map);
  return current;
}

async function resetAllQuestionChoices() {
  const changed = [];
  let resetCount = 0;

  for (const [questionId, storedProgress] of state.progressById.entries()) {
    const progress = enrichProgress(storedProgress, questionId);
    if (!progress.lastSelectedOption) {
      continue;
    }
    const next = enrichProgress({
      ...progress,
      lastSelectedOption: "",
      lastChoiceCorrect: false,
      solutionVisible: false,
      hintVisible: false
    }, questionId);
    state.progressById.set(questionId, next);
    changed.push(next);
    resetCount += 1;
  }

  if (!changed.length) {
    showToast("当前没有已选标识需要重置");
    return;
  }

  await putMany(PROGRESS_STORE, changed);
  markLocalSaved();
  queueCloudSync();
  render();
  showToast(`已一键重置 ${resetCount} 道题的选项标识，统计和错题本已保留`);
}

async function handleOptionChoice(questionId, letter) {
  const question = state.questions.find((item) => item.id === questionId);
  if (!question) return;
  const answers = normalizeAnswerLetters(question.answer, question);
  const selected = String(letter || "").toUpperCase();
  if (answers.size !== 1) {
    await saveProgress({ ...getProgress(questionId), lastSelectedOption: selected, lastChoiceCorrect: false });
    showToast(`已选择 ${selected}，答案待补充，暂不判定对错`);
    render();
    return;
  }
  const result = answers.has(selected) ? "correct" : "wrong";
  await saveProgress({ ...getProgress(questionId), lastSelectedOption: selected, lastChoiceCorrect: result === "correct", solutionVisible: true, solutionLevel: "analysis" });
  await saveAttempt(questionId, result, { selectedOption: selected, viaOption: true });
}

async function saveAttempt(questionId, result, options = {}) {
  markStudyToday();
  markDailyAttempt();
  const question = state.questions.find((item) => item.id === questionId);
  const visibleIndexBefore = state.filtered.findIndex((item) => item.id === questionId);
  const preferredNextId = result === "correct" && state.autoHideMastered
    ? String((state.filtered[visibleIndexBefore + 1] || state.filtered[visibleIndexBefore - 1] || {}).id || "")
    : "";
  const before = getProgress(questionId);
  const reasonInfo = result === "wrong" && !options.skipReason ? askMistakeReason(question) : null;
  let progress = QuestionBankCore.recordAttempt(before, result);
  const history = Array.isArray(before.mistakeReasonHistory) ? before.mistakeReasonHistory.slice() : [];
  if (reasonInfo) {
    history.push({ type: reasonInfo.type, label: reasonInfo.label, at: new Date().toISOString() });
  }
  progress = {
    ...progress,
    correctStreak: result === "correct" ? Number(before.correctStreak || 0) + 1 : 0,
    lastSelectedOption: options.selectedOption || before.lastSelectedOption || "",
    lastChoiceCorrect: result === "correct",
    mistakeReason: reasonInfo ? reasonInfo.type : (result === "correct" ? "" : before.mistakeReason || ""),
    mistakeReasonLabel: reasonInfo ? reasonInfo.label : (result === "correct" ? "" : before.mistakeReasonLabel || ""),
    mistakeReasonHistory: history.slice(-20)
  };
  progress = scheduleNextReview(progress, result);
  await saveProgress(progress);
  if (result === "correct" && state.autoHideMastered && progress.addedToWrongBookAt) {
    await removeFromWrongBook(questionId, { silent: true });
    progress = getProgress(questionId);
  }
  const streakInfo = updateConceptWrongStreak(question, result);
  if (result === "wrong") {
    await addToWrongBook(questionId, { silent: true });
    if (streakInfo && streakInfo.count >= 3) {
      showToast(`${streakInfo.label} 连续错 ${streakInfo.count} 次，建议先回看知识点`);
    } else {
      showToast(reasonInfo ? `已记错因：${reasonInfo.label}，并加入错题本` : "已记录做错，已加入错题本");
    }
  } else if (state.autoHideMastered && isProgressMastered(progress)) {
    showToast("已做对1次：该题已完成，之后不再显示和复习");
  } else if (isDueReview(question)) {
    showToast(progress.nextReviewAt ? `已完成今日复习，下次 ${progress.nextReviewAt}` : "已完成今日复习");
  } else {
    showToast(progress.nextReviewAt ? `已记录做对，下次复习 ${progress.nextReviewAt}` : "已记录做对");
  }
  const autoNextId = questionId;
  if (preferredNextId) {
    state.selectedId = preferredNextId;
  }
  applyFilters();
  if (!preferredNextId) {
    window.setTimeout(() => {
      if (state.selectedId === autoNextId) {
        selectAdjacentQuestion(1);
      }
    }, 500);
  }
}

async function addToWrongBook(questionId, options = {}) {
  const question = state.questions.find((item) => item.id === questionId);
  if (!question) {
    return;
  }
  const progress = getProgress(questionId);
  const today = new Date().toISOString().slice(0, 10);
  const record = QuestionBankCore.toWrongBookRecord(question, progress, today);
  const existing = QuestionBankCore.loadWrongBookRecords();
  const next = QuestionBankCore.upsertWrongBookRecord(existing, record);
  QuestionBankCore.saveWrongBookRecords(next);
  await saveProgress({ ...progress, addedToWrongBookAt: today });
  if (!options.silent) {
    showToast("已加入错题本");
    applyFilters();
  }
}

async function removeFromWrongBook(questionId, options = {}) {
  const existing = QuestionBankCore.loadWrongBookRecords();
  const next = QuestionBankCore.removeWrongBookRecord(existing, questionId);
  QuestionBankCore.saveWrongBookRecords(next);
  await saveProgress({ ...getProgress(questionId), addedToWrongBookAt: "" });
  if (!options.silent) {
    showToast("已取消错题本");
    applyFilters();
  }
}





function isMobileBackupEnvironment() {
  const ua = String(navigator.userAgent || "");
  return /Android|iPhone|iPad|iPod|Mobile|MicroMessenger|QQ\//i.test(ua) ||
    (window.matchMedia && window.matchMedia("(max-width: 820px)").matches);
}

function makeDownloadBlob(content, type = "application/json") {
  const normalizedType = String(type || "application/octet-stream");
  const finalType = /charset=/i.test(normalizedType) ? normalizedType : `${normalizedType};charset=utf-8`;
  return new Blob([content], { type: finalType });
}

function triggerBlobDownload(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // iOS/Safari 需要等下载或预览真正开始后才能释放，立即 revoke 会导致“点了没反应”。
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  return url;
}

function downloadTextFile(filename, content, type = "application/json") {
  return triggerBlobDownload(filename, makeDownloadBlob(content, type));
}

async function copyBackupText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

function closeBackupExportDialog() {
  const overlay = document.querySelector("#backupExportOverlay");
  const url = overlay?.dataset?.backupUrl || "";
  if (url) URL.revokeObjectURL(url);
  overlay?.remove();
}

function openBackupExportDialog(filename, content, blob) {
  closeBackupExportDialog();
  const objectUrl = URL.createObjectURL(blob);
  const overlay = document.createElement("div");
  overlay.className = "wrong-planner-overlay backup-export-overlay";
  overlay.id = "backupExportOverlay";
  overlay.dataset.backupUrl = objectUrl;
  overlay.innerHTML = `
    <section class="wrong-planner-dialog backup-export-dialog" role="dialog" aria-modal="true" aria-label="手机备份导出">
      <header class="wrong-planner-head">
        <div><p class="eyebrow">Mobile Backup</p><h2>手机备份导出</h2><p>优先选择“保存到文件”。在微信或QQ内打开时，可先点“打开备份文件”，再使用浏览器分享菜单保存。</p></div>
        <button type="button" class="icon-button secondary" data-close-backup-export>关闭</button>
      </header>
      <div class="backup-export-actions">
        <button type="button" class="primary-button" data-backup-download>下载 JSON 备份</button>
        <button type="button" class="secondary-button" data-backup-open>打开备份文件</button>
        <button type="button" class="secondary-button" data-backup-copy>复制备份文本</button>
      </div>
      <p class="backup-export-filename">文件名：${escapeHtml(filename)}</p>
      <details class="backup-export-details">
        <summary>查看备用文本</summary>
        <textarea readonly aria-label="备份JSON文本">${escapeHtml(content)}</textarea>
      </details>
    </section>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", async (event) => {
    if (event.target === overlay || event.target.closest("[data-close-backup-export]")) {
      closeBackupExportDialog();
      return;
    }
    if (event.target.closest("[data-backup-download]")) {
      triggerBlobDownload(filename, blob);
      showToast("已再次发起下载；请在手机“文件/下载”中查看");
      return;
    }
    if (event.target.closest("[data-backup-open]")) {
      const opened = window.open(objectUrl, "_blank", "noopener");
      if (!opened) window.location.href = objectUrl;
      return;
    }
    if (event.target.closest("[data-backup-copy]")) {
      try {
        const copied = await copyBackupText(content);
        showToast(copied ? "备份文本已复制" : "复制失败，请展开备用文本后手动复制");
      } catch (error) {
        showToast("复制失败，请展开备用文本后手动复制");
      }
    }
  });
}

async function shareBackupFile(filename, content, blob) {
  if (typeof navigator.share !== "function" || typeof File !== "function") return "unsupported";
  const file = new File([blob], filename, { type: "application/json;charset=utf-8", lastModified: Date.now() });
  try {
    if (typeof navigator.canShare === "function" && !navigator.canShare({ files: [file] })) {
      return "unsupported";
    }
    await navigator.share({
      title: "专升本题库本地备份",
      text: "保存此 JSON 文件，之后可在题库中使用“导入备份”恢复记录。",
      files: [file]
    });
    return "shared";
  } catch (error) {
    if (error && error.name === "AbortError") return "cancelled";
    console.warn("Mobile backup share failed", error);
    return "failed";
  }
}

function markLocalSaved() {
  localStorage.setItem(LOCAL_LAST_SAVE_KEY, new Date().toISOString());
}

function getLocalLastSaveText() {
  const last = localStorage.getItem(LOCAL_LAST_SAVE_KEY) || "";
  if (!last) return "暂无本地保存记录";
  try {
    return new Date(last).toLocaleString("zh-CN", { hour12: false });
  } catch (error) {
    return last.replace("T", " ").slice(0, 19);
  }
}

function buildLocalBackupPayload() {
  return {
    schema: LOCAL_BACKUP_SCHEMA,
    schemaVersion: 54,
    exportedAt: new Date().toISOString(),
    progress: [...state.progressById.values()],
    wrongBookRecords: QuestionBankCore.loadWrongBookRecords(),
    auditFeedback: getAuditFeedbackMap(),
    conceptWrongStreaks: readConceptWrongStreakMap(),
    sourceOverrides: readSourceOverrides(),
    generatedQuestions: state.questions.filter((question) => question && question.autoGenerated === true),
    generatedVariants: readJsonMap(GENERATED_VARIANTS_KEY),
    study: {
      studyDays: readStudyDays(),
      dailyAttempts: readJsonMap(DAILY_ATTEMPTS_KEY),
      dailyStudySeconds: readJsonMap(STUDY_DAILY_SECONDS_KEY),
      totalStudySeconds: getTotalStudySeconds()
    },
    settings: {
      studyMode: state.studyMode,
      questionView: state.questionView,
      autoHideMastered: state.autoHideMastered,
      mobileTab: state.mobileTab,
      dailyGoal: getDailyGoal(),
      timerSecondsRemaining: state.timerSecondsRemaining
    }
  };
}

async function exportLocalBackup() {
  const payload = buildLocalBackupPayload();
  const filename = `专升本题库本地备份-${todayISO()}.json`;
  const content = JSON.stringify(payload, null, 2);
  const blob = makeDownloadBlob(content, "application/json");
  markLocalSaved();

  if (isMobileBackupEnvironment()) {
    const result = await shareBackupFile(filename, content, blob);
    if (result === "shared") {
      showToast("备份文件已交给手机分享菜单，请选择“存储到文件”");
      return;
    }
    if (result === "cancelled") {
      showToast("已取消导出");
      return;
    }
    openBackupExportDialog(filename, content, blob);
    showToast("已打开手机备份面板");
    return;
  }

  downloadTextFile(filename, content, "application/json");
  showToast("本地备份已导出，可用“导入备份”恢复记录");
}

function isRecognizedLocalBackup(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
  const schema = String(payload.schema || "");
  return schema.startsWith("question-bank-local-backup-") ||
    Array.isArray(payload.progress) ||
    Array.isArray(payload.wrongBookRecords) ||
    (payload.study && typeof payload.study === "object");
}

function openLocalBackupImport() {
  if (!els.backupFileInput) {
    showToast("导入控件加载失败，请刷新页面重试");
    return;
  }
  els.backupFileInput.value = "";
  els.backupFileInput.click();
}

async function importLocalBackupPayload(payload) {
  if (!isRecognizedLocalBackup(payload)) {
    throw new Error("这不是本题库导出的备份文件");
  }

  if (payload.sourceOverrides && typeof payload.sourceOverrides === "object" && !Array.isArray(payload.sourceOverrides)) {
    localStorage.setItem(SOURCE_OVERRIDE_KEY, JSON.stringify(payload.sourceOverrides));
  }

  const importedGenerated = Array.isArray(payload.generatedQuestions)
    ? payload.generatedQuestions.map(QuestionBankCore.normalizeQuestion).filter((question) => question.id && question.stem)
    : [];
  if (importedGenerated.length) {
    const baseQuestions = state.questions.filter((question) => !question.autoGenerated);
    const currentGenerated = state.questions.filter((question) => question.autoGenerated);
    const generatedPool = [...currentGenerated, ...importedGenerated];
    const mergedQuestions = mergeQuestionsPreferBundled(generatedPool, baseQuestions);
    await replaceQuestions(mergedQuestions, { silent: true });
  } else if (payload.sourceOverrides && typeof payload.sourceOverrides === "object") {
    state.questions = applySourceOverrides(state.questions);
    await clearStore(QUESTION_STORE);
    if (state.questions.length) await putMany(QUESTION_STORE, state.questions);
  }

  const validIds = new Set(state.questions.map((question) => String(question.id || "")));
  const progressList = Array.isArray(payload.progress)
    ? payload.progress
        .map((progress) => enrichProgress(progress, progress && progress.questionId))
        .filter((progress) => progress.questionId && validIds.has(String(progress.questionId)))
    : [];
  await clearStore(PROGRESS_STORE);
  if (progressList.length) await putMany(PROGRESS_STORE, progressList);
  state.progressById = new Map(progressList.map((progress) => [progress.questionId, progress]));

  if (Array.isArray(payload.wrongBookRecords)) {
    QuestionBankCore.saveWrongBookRecords(payload.wrongBookRecords);
  }
  if (payload.auditFeedback && typeof payload.auditFeedback === "object") {
    saveAuditFeedbackMap(payload.auditFeedback);
  }
  if (payload.conceptWrongStreaks && typeof payload.conceptWrongStreaks === "object") {
    writeConceptWrongStreakMap(payload.conceptWrongStreaks);
  }
  if (payload.generatedVariants && typeof payload.generatedVariants === "object") {
    writeJsonMap(GENERATED_VARIANTS_KEY, payload.generatedVariants);
  }

  const settings = payload.settings && typeof payload.settings === "object" ? payload.settings : {};
  if (Object.prototype.hasOwnProperty.call(settings, "studyMode")) {
    state.studyMode = Boolean(settings.studyMode);
    localStorage.setItem(STUDY_MODE_KEY, state.studyMode ? "single" : "list");
  }
  if (settings.questionView === "text" || settings.questionView === "image") {
    state.questionView = settings.questionView;
    localStorage.setItem(QUESTION_VIEW_KEY, settings.questionView);
  }
  if (Object.prototype.hasOwnProperty.call(settings, "autoHideMastered")) {
    state.autoHideMastered = Boolean(settings.autoHideMastered);
    localStorage.setItem(AUTO_HIDE_MASTERED_KEY, state.autoHideMastered ? "1" : "0");
  }
  if (state.autoHideMastered) {
    await normalizeCompletedProgressForOneCorrect();
  }
  if (settings.mobileTab) {
    state.mobileTab = String(settings.mobileTab);
    localStorage.setItem(MOBILE_TAB_KEY, state.mobileTab);
  }
  if (settings.dailyGoal) {
    localStorage.setItem(DAILY_GOAL_KEY, String(Math.min(500, Math.max(10, Number(settings.dailyGoal) || 80))));
  }
  if (Number.isFinite(Number(settings.timerSecondsRemaining))) {
    state.timerSecondsRemaining = Math.max(0, Math.floor(Number(settings.timerSecondsRemaining)));
    localStorage.setItem(TIMER_REMAINING_KEY, String(state.timerSecondsRemaining));
  }

  const study = payload.study && typeof payload.study === "object" ? payload.study : {};
  if (Array.isArray(study.studyDays)) saveStudyDays(study.studyDays);
  if (study.dailyAttempts && typeof study.dailyAttempts === "object") writeJsonMap(DAILY_ATTEMPTS_KEY, study.dailyAttempts);
  if (study.dailyStudySeconds && typeof study.dailyStudySeconds === "object") writeJsonMap(STUDY_DAILY_SECONDS_KEY, study.dailyStudySeconds);
  if (Number.isFinite(Number(study.totalStudySeconds))) setTotalStudySeconds(Number(study.totalStudySeconds));

  await pruneProgressForMissingQuestions();
  repairWrongBookOptionsFromProgress();
  markLocalSaved();
  state.page = 1;
  state.selectedId = state.questions[0] ? state.questions[0].id : "";
  updateFilters();
  applyFilters();
  updateStudyTimeUI();
  updateTimerUI();
  render();
  return progressList.length;
}

async function handleLocalBackupFile(file) {
  if (!file) return;
  const confirmed = window.confirm("导入备份会覆盖当前做题记录、错题本和学习统计。是否继续？");
  if (!confirmed) return;
  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    const restoredCount = await importLocalBackupPayload(payload);
    showToast(`备份导入成功：恢复 ${restoredCount} 道题的做题记录`);
  } catch (error) {
    console.error(error);
    showToast(error && error.message ? error.message : "备份导入失败，请检查文件");
  } finally {
    if (els.backupFileInput) els.backupFileInput.value = "";
  }
}

function createSupabaseClient() {
  async function rpc(functionName, payload) {
    if (!CLOUD_SYNC_ENABLED) {
      throw new Error("云端保存暂时关闭：当前版本已改为本地自动保存，请用本地备份导出记录");
    }
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      const message = data && (data.message || data.error_description || data.error) || text || "云端请求失败";
      throw new Error(message);
    }
    return data;
  }
  return { rpc };
}

const cloudClient = createSupabaseClient();

function readCloudProfile(interactive = false) {
  const params = new URLSearchParams(window.location.search);
  const urlSlug = (params.get("edit") || params.get("view") || "").trim().toLowerCase();
  let slug = (urlSlug || localStorage.getItem(CLOUD_SLUG_KEY) || "").trim().toLowerCase();
  let pin = localStorage.getItem(CLOUD_PIN_KEY) || "";
  let displayName = localStorage.getItem(CLOUD_DISPLAY_NAME_KEY) || "";
  if (interactive) {
    slug = (window.prompt("公开编号，例如 cyrus329", slug) || "").trim().toLowerCase();
    if (!slug) {
      return null;
    }
    pin = window.prompt("编辑密码，至少4位", pin) || "";
    if (pin.length < 4) {
      showToast("编辑密码至少4位");
      return null;
    }
    displayName = window.prompt("显示名称，可留空", displayName) || "";
  }
  if (!slug) {
    return null;
  }
  localStorage.setItem(CLOUD_SLUG_KEY, slug);
  if (pin) {
    localStorage.setItem(CLOUD_PIN_KEY, pin);
  }
  if (displayName) {
    localStorage.setItem(CLOUD_DISPLAY_NAME_KEY, displayName);
  }
  return { slug, pin, displayName };
}

function buildCloudRecord() {
  return {
    id: CLOUD_RECORD_ID,
    app: "question-bank",
    version: FORCE_CLEAN_VERSION,
    updatedAt: new Date().toISOString(),
    progress: [...state.progressById.values()].map((progress) => enrichProgress(progress, progress.questionId)),
    wrongBookRecords: QuestionBankCore.loadWrongBookRecords(),
    auditFeedback: getAuditFeedbackMap(),
    conceptWrongStreaks: readConceptWrongStreakMap(),
    settings: {
      studyMode: state.studyMode,
      autoHideMastered: state.autoHideMastered,
      dailyGoal: getDailyGoal(),
      mobileTab: state.mobileTab,
      timerSecondsRemaining: state.timerSecondsRemaining
    },
    study: {
      studyDays: readStudyDays(),
      dailyAttempts: readJsonMap(DAILY_ATTEMPTS_KEY),
      totalStudySeconds: getTotalStudySeconds(),
      dailyStudySeconds: getDailyStudySecondsMap()
    }
  };
}

async function readCloudRecords(profile) {
  try {
    const records = await cloudClient.rpc("load_study_cloud", {
      p_slug: profile.slug,
      p_pin: profile.pin || null
    });
    return Array.isArray(records) ? records : [];
  } catch (error) {
    if (/not found|profile/i.test(error.message || "")) {
      return [];
    }
    throw error;
  }
}

async function saveCloudState(options = {}) {
  if (!CLOUD_SYNC_ENABLED) {
    markLocalSaved();
    if (options.interactive) {
      showToast("已改为本地自动保存；需要迁移数据请点导出本地备份");
    }
    return false;
  }
  const profile = readCloudProfile(Boolean(options.interactive));
  if (!profile || !profile.pin) {
    if (options.interactive) {
      showToast("请先填写公开编号和编辑密码");
    }
    return false;
  }
  if (state.cloudSaving) {
    return false;
  }
  state.cloudSaving = true;
  try {
    const existingRecords = await readCloudRecords(profile);
    const keptRecords = existingRecords.filter((record) => record && record.id !== CLOUD_RECORD_ID);
    const records = [...keptRecords, buildCloudRecord()];
    await cloudClient.rpc("save_study_cloud", {
      p_slug: profile.slug,
      p_pin: profile.pin,
      p_records: records,
      p_display_name: profile.displayName || profile.slug,
      p_is_public: true
    });
    localStorage.setItem(CLOUD_LAST_SYNC_KEY, new Date().toISOString());
    if (!options.silent) {
      showToast(`已保存到云端：${profile.slug}`);
    }
    return true;
  } catch (error) {
    if (!options.silent) {
      showToast(error.message || "云端保存失败");
    }
    return false;
  } finally {
    state.cloudSaving = false;
  }
}

async function applyCloudRecord(record) {
  if (!record || typeof record !== "object") {
    throw new Error("云端没有题库进度");
  }
  const progressList = Array.isArray(record.progress) ? record.progress.map((progress) => enrichProgress(progress, progress.questionId)).filter((progress) => progress.questionId) : [];
  await clearStore(PROGRESS_STORE);
  await putMany(PROGRESS_STORE, progressList);
  state.progressById = new Map(progressList.map((progress) => [progress.questionId, progress]));
  if (Array.isArray(record.wrongBookRecords)) {
    QuestionBankCore.saveWrongBookRecords(record.wrongBookRecords);
  }
  if (record.auditFeedback && typeof record.auditFeedback === "object") {
    saveAuditFeedbackMap(record.auditFeedback);
  }
  if (record.conceptWrongStreaks && typeof record.conceptWrongStreaks === "object") {
    writeConceptWrongStreakMap(record.conceptWrongStreaks);
  }
  if (record.settings && typeof record.settings === "object") {
    state.studyMode = Boolean(record.settings.studyMode);
    state.autoHideMastered = Boolean(record.settings.autoHideMastered);
    state.mobileTab = record.settings.mobileTab || state.mobileTab;
    state.timerSecondsRemaining = Number(record.settings.timerSecondsRemaining || state.timerSecondsRemaining);
    localStorage.setItem(STUDY_MODE_KEY, state.studyMode ? "single" : "list");
    localStorage.setItem(AUTO_HIDE_MASTERED_KEY, state.autoHideMastered ? "1" : "0");
    localStorage.setItem(MOBILE_TAB_KEY, state.mobileTab);
    localStorage.setItem(TIMER_REMAINING_KEY, String(state.timerSecondsRemaining));
    if (record.settings.dailyGoal) {
      localStorage.setItem(DAILY_GOAL_KEY, String(record.settings.dailyGoal));
    }
  }
  if (state.autoHideMastered) {
    await normalizeCompletedProgressForOneCorrect();
  }
  if (record.study && typeof record.study === "object") {
    if (Array.isArray(record.study.studyDays)) {
      saveStudyDays(record.study.studyDays);
    }
    if (record.study.dailyAttempts) {
      writeJsonMap(DAILY_ATTEMPTS_KEY, record.study.dailyAttempts);
    }
    if (record.study.dailyStudySeconds) {
      writeJsonMap(STUDY_DAILY_SECONDS_KEY, record.study.dailyStudySeconds);
    }
    if (Number.isFinite(Number(record.study.totalStudySeconds))) {
      setTotalStudySeconds(Number(record.study.totalStudySeconds));
    }
  }
  updateFilters();
  applyFilters();
  updateStudyTimeUI();
  updateTimerUI();
}

async function loadCloudState(options = {}) {
  if (!CLOUD_SYNC_ENABLED) {
    if (options.interactive) {
      showToast("云端加载暂时关闭；本机记录会自动保存，可用本地备份恢复");
    }
    return false;
  }
  const profile = readCloudProfile(Boolean(options.interactive));
  if (!profile) {
    if (options.interactive) {
      showToast("请先填写公开编号");
    }
    return false;
  }
  try {
    const records = await readCloudRecords(profile);
    const record = records.find((item) => item && item.id === CLOUD_RECORD_ID);
    await applyCloudRecord(record);
    if (!options.silent) {
      showToast(`已从云端加载：${profile.slug}`);
    }
    return true;
  } catch (error) {
    if (!options.silent) {
      showToast(error.message || "云端加载失败");
    }
    return false;
  }
}

function queueCloudSync() {
  if (!CLOUD_SYNC_ENABLED) {
    return;
  }
  const profile = readCloudProfile(false);
  if (!profile || !profile.pin) {
    return;
  }
  window.clearTimeout(state.cloudSyncTimer);
  state.cloudSyncTimer = window.setTimeout(() => {
    saveCloudState({ silent: true });
  }, CLOUD_SYNC_DELAY_MS);
}

async function openCloudPanel() {
  showToast("云端数据库当前不可用，已切换为本地备份");
  exportLocalBackup();
}


function getTotalStudySeconds() {
  const raw = Number(localStorage.getItem(STUDY_TOTAL_SECONDS_KEY) || 0);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
}

function setTotalStudySeconds(seconds) {
  localStorage.setItem(STUDY_TOTAL_SECONDS_KEY, String(Math.max(0, Math.floor(Number(seconds || 0)))));
}

function getDailyStudySecondsMap() {
  return readJsonMap(STUDY_DAILY_SECONDS_KEY);
}

function getTodayStudySeconds() {
  const map = getDailyStudySecondsMap();
  return Math.floor(Number(map[todayISO()] || 0));
}

function addStudySeconds(seconds) {
  const add = Math.max(0, Math.floor(Number(seconds || 0)));
  if (!add) {
    return;
  }
  setTotalStudySeconds(getTotalStudySeconds() + add);
  const map = getDailyStudySecondsMap();
  const today = todayISO();
  map[today] = Math.floor(Number(map[today] || 0)) + add;
  writeJsonMap(STUDY_DAILY_SECONDS_KEY, map);
  if (getTotalStudySeconds() % 60 === 0) {
    queueCloudSync();
  }
}

function formatStudyDuration(seconds) {
  const safe = Math.max(0, Math.floor(Number(seconds || 0)));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  if (hours <= 0) {
    return `${minutes}分钟`;
  }
  return `${hours}小时${String(minutes).padStart(2, "0")}分钟`;
}

function updateStudyTimeUI() {
  const total = getTotalStudySeconds();
  const today = getTodayStudySeconds();
  if (els.totalStudyTimeCount) {
    els.totalStudyTimeCount.textContent = formatStudyDuration(total);
  }
  if (els.mobileTotalStudyTime) {
    els.mobileTotalStudyTime.textContent = formatStudyDuration(total);
  }
  if (els.mobileTodayStudyTime) {
    els.mobileTodayStudyTime.textContent = formatStudyDuration(today);
  }
}

function startStudyTimeCounter() {
  if (state.studyTimeTickerId) {
    return;
  }
  state.studyTimeTickerId = window.setInterval(() => {
    if (document.visibilityState === "hidden") {
      return;
    }
    addStudySeconds(1);
    state.studyTimeUnsavedSeconds += 1;
    if (state.studyTimeUnsavedSeconds >= 10) {
      state.studyTimeUnsavedSeconds = 0;
      updateStudyTimeUI();
    }
  }, 1000);
  document.addEventListener("visibilitychange", updateStudyTimeUI);
  window.addEventListener("beforeunload", updateStudyTimeUI);
  updateStudyTimeUI();
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(dateISO, days) {
  const date = new Date(`${dateISO}T00:00:00`);
  date.setDate(date.getDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
}

function readStudyDays() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STUDY_DAYS_KEY) || "[]");
    return Array.isArray(parsed) ? [...new Set(parsed.filter(Boolean))].sort() : [];
  } catch (error) {
    return [];
  }
}

function saveStudyDays(days) {
  localStorage.setItem(STUDY_DAYS_KEY, JSON.stringify([...new Set(days)].sort()));
}

function markStudyToday() {
  const days = readStudyDays();
  days.push(todayISO());
  saveStudyDays(days);
}

function getStudyStreak() {
  const days = new Set(readStudyDays());
  let date = new Date(`${todayISO()}T00:00:00`);
  let streak = 0;
  while (days.has(date.toISOString().slice(0, 10))) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

function readJsonMap(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    return {};
  }
}

function writeJsonMap(key, value) {
  localStorage.setItem(key, JSON.stringify(value || {}));
}

function getDailyGoal() {
  const raw = Number(localStorage.getItem(DAILY_GOAL_KEY) || 80);
  return Math.min(500, Math.max(10, Number.isFinite(raw) ? raw : 80));
}

function setDailyGoal(value) {
  const next = Math.min(500, Math.max(10, Number(value || 80)));
  localStorage.setItem(DAILY_GOAL_KEY, String(next));
  showToast(`每日目标已设为 ${next} 题`);
  queueCloudSync();
}

function getTodayAttemptCount() {
  const map = readJsonMap(DAILY_ATTEMPTS_KEY);
  return Number(map[todayISO()] || 0);
}

function markDailyAttempt() {
  const map = readJsonMap(DAILY_ATTEMPTS_KEY);
  const today = todayISO();
  map[today] = Number(map[today] || 0) + 1;
  writeJsonMap(DAILY_ATTEMPTS_KEY, map);
}

function daysBetweenISO(startISO, endISO = todayISO()) {
  if (!startISO) {
    return Infinity;
  }
  const start = new Date(`${startISO}T00:00:00`).getTime();
  const end = new Date(`${endISO}T00:00:00`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return Infinity;
  }
  return Math.floor((end - start) / 86400000);
}

function getBackupStatus() {
  const attempted = [...state.progressById.values()].some((progress) => Number(progress.attempts || 0) > 0);
  const last = localStorage.getItem(LOCAL_LAST_SAVE_KEY) || "";
  if (!attempted) {
    return { needsBackup: false, title: "本地自动保存已开启", message: "开始做题后，记录会先保存在本机，不再因为云端数据库报错影响刷题。" };
  }
  if (!last) {
    return { needsBackup: true, title: "建议导出一次本地备份", message: "你已经有做题记录，本机会自动保存；导出备份可防止换手机或清缓存丢失。" };
  }
  return { needsBackup: false, title: "本地保存正常", message: `上次本地保存：${getLocalLastSaveText()}。继续刷题即可。` };
}
function isProgressMastered(progress) {
  return Boolean(progress && Number(progress.correct || 0) >= 1);
}

function isMasteredQuestion(question) {
  const progress = readProgress(question.id);
  return isProgressMastered(progress);
}

function formatTimer(seconds) {
  const safe = Math.max(0, Number(seconds || 0));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function updateTimerUI() {
  if (els.timerButton) {
    els.timerButton.classList.toggle("active", state.timerRunning);
    const label = els.timerButton.querySelector("span:last-child");
    if (label) {
      label.textContent = state.timerRunning ? formatTimer(state.timerSecondsRemaining) : "倒计时";
    }
  }
  if (els.mobileTimerPill) {
    els.mobileTimerPill.textContent = state.timerRunning ? formatTimer(state.timerSecondsRemaining) : formatTimer(state.timerSecondsRemaining);
    els.mobileTimerPill.classList.toggle("active", state.timerRunning);
  }
  const display = document.querySelector("#timerDisplay");
  if (display) {
    display.textContent = formatTimer(state.timerSecondsRemaining);
  }
  const button = document.querySelector("#timerStartPauseButton");
  if (button) {
    button.textContent = state.timerRunning ? "暂停" : "开始";
  }
}

function startTimer() {
  if (state.timerRunning) {
    return;
  }
  if (state.timerSecondsRemaining <= 0) {
    state.timerSecondsRemaining = TIMER_DEFAULT_SECONDS;
  }
  state.timerRunning = true;
  state.timerId = window.setInterval(() => {
    state.timerSecondsRemaining = Math.max(0, state.timerSecondsRemaining - 1);
    localStorage.setItem(TIMER_REMAINING_KEY, String(state.timerSecondsRemaining));
    updateTimerUI();
    if (state.timerSecondsRemaining <= 0) {
      pauseTimer();
      showToast("倒计时结束，建议先核对本轮错题");
    }
  }, 1000);
  updateTimerUI();
}

function pauseTimer() {
  state.timerRunning = false;
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = 0;
  }
  updateTimerUI();
}

function toggleTimer() {
  if (state.timerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function resetTimer() {
  pauseTimer();
  state.timerSecondsRemaining = TIMER_DEFAULT_SECONDS;
  localStorage.setItem(TIMER_REMAINING_KEY, String(state.timerSecondsRemaining));
  updateTimerUI();
  showToast("倒计时已重置为25分钟");
}

async function normalizeCompletedProgressForOneCorrect() {
  const completedIds = new Set();
  const updates = [];
  state.progressById.forEach((rawProgress, questionId) => {
    const progress = enrichProgress(rawProgress, questionId);
    if (!isProgressMastered(progress)) {
      return;
    }
    completedIds.add(questionId);
    const next = {
      ...progress,
      reviewLevel: 0,
      nextReviewAt: "",
      addedToWrongBookAt: ""
    };
    state.progressById.set(questionId, next);
    updates.push(next);
  });
  if (updates.length) {
    await putMany(PROGRESS_STORE, updates);
  }
  if (completedIds.size) {
    const wrongBook = QuestionBankCore.loadWrongBookRecords();
    QuestionBankCore.saveWrongBookRecords(
      wrongBook.filter((item) => !completedIds.has(String(item.questionId || item.id || "")))
    );
  }
  markLocalSaved();
}

async function toggleCorrectOnceCompletionMode() {
  state.autoHideMastered = !state.autoHideMastered;
  localStorage.setItem(AUTO_HIDE_MASTERED_KEY, state.autoHideMastered ? "1" : "0");
  if (state.autoHideMastered) {
    await normalizeCompletedProgressForOneCorrect();
    showToast("已开启：任意题做对1次后自动完成，不再显示和复习");
  } else {
    showToast("已关闭：做对过的题会重新显示，可再次复习");
  }
  queueCloudSync();
  state.page = 1;
  state.selectedId = "";
  applyFilters();
}

function scheduleNextReview(progress, result) {
  const today = todayISO();
  const next = enrichProgress(progress, progress.questionId);
  if (result === "wrong") {
    next.reviewLevel = 0;
    next.nextReviewAt = addDaysISO(today, REVIEW_INTERVALS[0]);
    return next;
  }
  if (state.autoHideMastered) {
    next.reviewLevel = 0;
    next.nextReviewAt = "";
    return next;
  }
  const level = Math.min(Number(next.reviewLevel || 0) + 1, REVIEW_INTERVALS.length - 1);
  next.reviewLevel = level;
  next.nextReviewAt = addDaysISO(today, REVIEW_INTERVALS[level]);
  return next;
}

function isDueReview(question) {
  const progress = readProgress(question.id);
  if (state.autoHideMastered && isProgressMastered(progress)) {
    return false;
  }
  if (!progress.attempts && !progress.addedToWrongBookAt) {
    return false;
  }
  const due = progress.nextReviewAt || progress.addedToWrongBookAt || progress.lastAt;
  if (!due) {
    return progress.lastResult === "wrong";
  }
  return due <= todayISO();
}

function isCompletePracticeQuestion(question) {
  return String(question && question.practiceSetId || "") === COMPLETE_PRACTICE_SET_ID;
}

function isCompletePracticeSequenceContext() {
  const chapter = String(els.chapterFilter && els.chapterFilter.value || "");
  const day = String(els.dayFilter && els.dayFilter.value || "");
  const subject = String(els.subjectFilter && els.subjectFilter.value || "");
  const source = String(els.sourceFilter && els.sourceFilter.value || "");
  return chapter.includes("课后练习（完整版）") ||
    (day === "第11天 · 7.26" && ["all", "高等数学"].includes(subject) && ["all", "蓝色森林"].includes(source));
}

function sortQuestionsForMode(a, b, status) {
  if (status === "dueReview") {
    const pa = readProgress(a.id);
    const pb = readProgress(b.id);
    const da = pa.nextReviewAt || pa.lastAt || "9999-12-31";
    const db = pb.nextReviewAt || pb.lastAt || "9999-12-31";
    if (da !== db) {
      return da.localeCompare(db);
    }
    return Number(pb.wrong || 0) - Number(pa.wrong || 0);
  }
  if (status === "weakChapter") {
    const pa = readProgress(a.id);
    const pb = readProgress(b.id);
    return Number(pb.wrong || 0) - Number(pa.wrong || 0);
  }
  const aPracticeSet = String(a.practiceSetId || "");
  const bPracticeSet = String(b.practiceSetId || "");
  if (aPracticeSet && aPracticeSet === bPracticeSet) {
    const practiceDiff = Number(a.practiceOrder || 0) - Number(b.practiceOrder || 0);
    if (practiceDiff) return practiceDiff;
  }
  const dayDiff = Number(a.studyDay || 0) - Number(b.studyDay || 0);
  if (dayDiff) return dayDiff;
  const sourceDiff = Number(a.sourceOrder || (a.source === "全方位" ? 1 : 2)) - Number(b.sourceOrder || (b.source === "全方位" ? 1 : 2));
  if (sourceDiff) return sourceDiff;
  return Number(a.importOrder || 0) - Number(b.importOrder || 0);
}

function chapterKey(question) {
  return `${question.subject}||${question.chapter}`;
}

function getChapterMasteryStats() {
  const groups = new Map();
  state.questions.forEach((question) => {
    if (question.pageArchive) return;
    const key = chapterKey(question);
    if (!groups.has(key)) {
      groups.set(key, { key, subject: question.subject, chapter: question.chapter, total: 0, attempts: 0, correct: 0, wrong: 0, unseen: 0, accuracy: 0 });
    }
    const item = groups.get(key);
    const progress = readProgress(question.id);
    item.total += 1;
    item.attempts += Number(progress.attempts || 0);
    item.correct += Number(progress.correct || 0);
    item.wrong += Number(progress.wrong || 0);
    if (!progress.attempts) {
      item.unseen += 1;
    }
  });
  return [...groups.values()].map((item) => ({
    ...item,
    accuracy: item.attempts ? Math.round((item.correct / item.attempts) * 100) : 0
  })).sort((a, b) => {
    if (a.attempts && b.attempts && a.accuracy !== b.accuracy) {
      return a.accuracy - b.accuracy;
    }
    if (a.wrong !== b.wrong) {
      return b.wrong - a.wrong;
    }
    return b.total - a.total;
  });
}

function getWeakChapterStats() {
  return getChapterMasteryStats().filter((item) => {
    if (!item.attempts) {
      return false;
    }
    return item.accuracy < 70 || item.wrong >= 2;
  });
}

function normalizeSearchText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "");
}

function getEnglishGrammarCategory(question) {
  if (question.subject !== "英语") {
    return "";
  }
  const text = normalizeSearchText([question.chapter, question.stem, question.answer, question.analysis, ...(question.tags || [])].join(" "));
  const rules = [
    ["名词", /名词|noun|可数|不可数|复数|单数/],
    ["代词", /代词|pronoun|物主|反身|指示|不定代词|it用法/],
    ["冠词", /冠词|article|\ba\b|\ban\b|\bthe\b/],
    ["介词", /介词|preposition|in|on|at|of|for|with|from|to/],
    ["时态", /时态|现在时|过去时|完成时|进行时|将来时|tense/],
    ["从句", /从句|定语从句|宾语从句|状语从句|主语从句|clause|which|that|who|where|when/],
    ["非谓语", /非谓语|动名词|不定式|分词|todo|doing|done/],
    ["主谓一致", /主谓一致|就近原则|谓语单复数|therebe/],
    ["句子结构", /句子结构|句型|倒装|强调句|祈使句|感叹句/]
  ];
  const found = rules.find(([, pattern]) => pattern.test(text));
  return found ? found[0] : "基础语法";
}

function getEnglishGrammarStats() {
  const map = new Map();
  state.questions.filter((question) => question.subject === "英语").forEach((question) => {
    const name = getEnglishGrammarCategory(question) || "基础语法";
    map.set(name, (map.get(name) || 0) + 1);
  });
  return [...map.entries()].map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);
}


function getAuditFeedbackMap() {
  try {
    const raw = localStorage.getItem(AUDIT_FEEDBACK_KEY) || "{}";
    const data = JSON.parse(raw);
    return data && typeof data === "object" ? data : {};
  } catch (error) {
    return {};
  }
}

function saveAuditFeedbackMap(map) {
  localStorage.setItem(AUDIT_FEEDBACK_KEY, JSON.stringify(map || {}));
}

function getAuditFeedback(questionId) {
  return getAuditFeedbackMap()[questionId] || null;
}

function hasLocalAuditIssue(questionId) {
  const item = getAuditFeedback(questionId);
  return Boolean(item && item.type && item.type !== "confirmed");
}

function isAuditQueueQuestion(question) {
  const category = getAnalysisAuditCategory(question);
  return ["reference_only", "answer_only", "missing_answer"].includes(category) || hasLocalAuditIssue(question.id);
}

function getAuditFeedbackLabel(type) {
  const labels = {
    mismatch: "解析不对应",
    wrongAnswer: "答案疑似错",
    cropIssue: "图片缺边",
    noAnalysis: "没有解析",
    confirmed: "已人工确认"
  };
  return labels[type] || "待核查";
}

function saveAuditFeedback(questionId, type, note = "") {
  const question = state.questions.find((item) => item.id === questionId);
  if (!question) return;
  const map = getAuditFeedbackMap();
  map[questionId] = {
    questionId,
    type,
    label: getAuditFeedbackLabel(type),
    note: String(note || ""),
    subject: question.subject || "",
    chapter: question.chapter || "",
    stem: question.stem || "",
    answer: question.answer || "",
    source: getSourceDisplay(question),
    auditCategory: getAnalysisAuditCategory(question),
    updatedAt: new Date().toISOString()
  };
  saveAuditFeedbackMap(map);
  queueCloudSync();
  showToast(type === "confirmed" ? "已标记为人工确认" : `已标记：${getAuditFeedbackLabel(type)}`);
  render();
}

function clearAuditFeedback(questionId) {
  const map = getAuditFeedbackMap();
  if (map[questionId]) {
    delete map[questionId];
    saveAuditFeedbackMap(map);
    queueCloudSync();
    showToast("已清除本题核查标记");
    render();
  }
}

function quickAuditFeedback(questionId) {
  const text = "请选择问题类型：\n1 解析不对应\n2 答案疑似错\n3 图片缺边\n4 没有解析\n5 已人工确认\n0 清除标记";
  const choice = String(window.prompt(text, "1") || "").trim();
  const typeMap = { "1": "mismatch", "2": "wrongAnswer", "3": "cropIssue", "4": "noAnalysis", "5": "confirmed" };
  if (choice === "0") return clearAuditFeedback(questionId);
  const type = typeMap[choice];
  if (!type) return;
  saveAuditFeedback(questionId, type);
}

function renderLocalAuditPill(questionId) {
  const record = getAuditFeedback(questionId);
  if (!record) return "";
  const cls = record.type === "confirmed" ? "audit-confirmed" : "audit-flagged";
  return `<span class="badge ${cls}">${escapeHtml(record.label || getAuditFeedbackLabel(record.type))}</span>`;
}

function renderAnalysisAuditPill(question) {
  const category = getAnalysisAuditCategory(question);
  const labels = {
    locked_text: "文字锁定",
    locked_image: "原图锁定",
    reference_only: "原图备查",
    answer_only: "仅答案",
    missing_answer: "无答案"
  };
  const cls = category === "locked_text" || category === "locked_image" ? "audit-ok-pill" : (category === "reference_only" ? "audit-ref-pill" : "audit-warn-pill");
  return `<span class="badge ${cls}">${escapeHtml(labels[category] || "待核查")}</span>`;
}

function renderAuditFeedbackPanel(question) {
  const record = getAuditFeedback(question.id);
  return `
    <section class="audit-feedback-panel">
      <div>
        <strong>人工核查</strong>
        <p>${record ? `当前标记：${escapeHtml(record.label || getAuditFeedbackLabel(record.type))}${record.note ? `｜${escapeHtml(record.note)}` : ""}` : "还没有人工核查标记。发现问题可以一键记录，后续导出给我批量修。"}</p>
      </div>
      <div class="audit-feedback-actions">
        <button type="button" class="secondary-button tiny" data-audit-feedback="mismatch">解析不对应</button>
        <button type="button" class="secondary-button tiny" data-audit-feedback="wrongAnswer">答案疑似错</button>
        <button type="button" class="secondary-button tiny" data-audit-feedback="cropIssue">图片缺边</button>
        <button type="button" class="secondary-button tiny" data-audit-feedback="noAnalysis">没有解析</button>
        <button type="button" class="secondary-button tiny" data-audit-feedback="confirmed">确认对应</button>
        ${record ? `<button type="button" class="secondary-button tiny" data-audit-feedback="clear">清除</button>` : ""}
      </div>
    </section>`;
}

function enterAuditMode() {
  if (els.statusFilter) els.statusFilter.value = "auditQueue";
  state.page = 1;
  applyFilters();
  showToast("已进入解析核查模式：只看未逐题/仅答案/有反馈的题");
}

function renderAuditDeskQuestion(question) {
  return `
    <section class="audit-desk-card">
      <p class="eyebrow">题目</p>
      <h3>${escapeHtml(question.id)}｜${escapeHtml(question.subject)} · ${escapeHtml(question.chapter)}</h3>
      <div class="audit-desk-stem">${renderRichText(question.stem)}</div>
      ${renderImages(question.images || [], "原题图片")}
      ${renderOptions(question.options || [])}
      <div class="audit-desk-answer"><strong>答案：</strong>${renderRichText(question.answer || "未填写")}</div>
      <div class="source-line">${escapeHtml(getSourceDisplay(question) || "暂无来源信息")}</div>
      <div class="audit-status-row">${renderAnalysisAuditPill(question)} ${renderLocalAuditPill(question.id)}</div>
    </section>`;
}

function renderAuditDeskAnalysis(question) {
  const officialAnalysis = String(question.officialAnalysis || "").trim();
  const parts = [];
  if (officialAnalysis) parts.push(renderShortAnalysis("官方文字解析", officialAnalysis, question.analysisSource || question.verifiedSource || "", "analysis-box official-text-card audit-desk-text"));
  if (Array.isArray(question.analysisImages) && question.analysisImages.length) parts.push(`<section class="analysis-image-card official-image-open"><strong>${escapeHtml(question.analysisImageLabel || "逐题解析原图")}</strong>${renderImages(question.analysisImages, question.analysisImageLabel || "逐题解析原图")}</section>`);
  if (Array.isArray(question.backupAnalysisImages) && question.backupAnalysisImages.length) parts.push(`<section class="analysis-image-card backup-page-card"><strong>${escapeHtml(question.backupAnalysisImageLabel || "完整答案页/备查原图")}</strong>${renderImages(question.backupAnalysisImages, question.backupAnalysisImageLabel || "完整答案页/备查原图")}</section>`);
  if (!parts.length) parts.push(`<section class="audit-card audit-warning"><strong>暂无解析图</strong><p>这题目前只有答案，没有可核对的解析图或文字。</p></section>`);
  return `<section class="audit-desk-card"><p class="eyebrow">解析 / 答案页</p>${parts.join("")}</section>`;
}

function openAuditDesk(questionId) {
  const question = state.questions.find((item) => item.id === questionId);
  if (!question) return;
  closeAuditDesk();
  const overlay = document.createElement("div");
  overlay.className = "audit-desk-overlay";
  overlay.innerHTML = `
    <div class="audit-desk-window" role="dialog" aria-modal="true" aria-label="题目解析校对台">
      <div class="audit-desk-head">
        <div><p class="eyebrow">Audit Desk</p><h2>题目—解析对照校对台</h2></div>
        <button type="button" class="image-zoom-close" data-audit-close aria-label="关闭">×</button>
      </div>
      <div class="audit-desk-grid">
        ${renderAuditDeskQuestion(question)}
        ${renderAuditDeskAnalysis(question)}
      </div>
      <div class="audit-desk-actions">
        <button type="button" class="primary-button" data-audit-action="confirmed">确认对应</button>
        <button type="button" class="secondary-button" data-audit-action="mismatch">解析不对应</button>
        <button type="button" class="secondary-button" data-audit-action="wrongAnswer">答案疑似错</button>
        <button type="button" class="secondary-button" data-audit-action="cropIssue">图片缺边</button>
        <button type="button" class="secondary-button" data-audit-action="noAnalysis">没有解析</button>
        <button type="button" class="secondary-button" data-audit-action="clear">清除标记</button>
        <button type="button" class="secondary-button" data-audit-action="export">导出反馈清单</button>
        <button type="button" class="secondary-button" data-audit-action="next">下一道待核查</button>
      </div>
    </div>`;
  overlay.addEventListener("click", (event) => {
    const target = event.target;
    if (target === overlay || target.closest("[data-audit-close]")) return closeAuditDesk();
    const actionButton = target.closest("[data-audit-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.auditAction;
    if (action === "clear") return clearAuditFeedback(question.id);
    if (action === "export") return exportAuditFeedback();
    if (action === "next") {
      closeAuditDesk();
      selectNextAuditQueueQuestion();
      return;
    }
    saveAuditFeedback(question.id, action);
  });
  document.body.appendChild(overlay);
  overlay.querySelectorAll("[data-zoom-image]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openImageZoom(button.dataset.zoomImage);
    });
  });
  if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([overlay]).catch(() => {});
}

function closeAuditDesk() {
  document.querySelectorAll(".audit-desk-overlay").forEach((node) => node.remove());
}

function selectNextAuditQueueQuestion() {
  const currentIndex = state.filtered.findIndex((item) => item.id === state.selectedId);
  const list = state.filtered.length ? state.filtered : state.questions.filter(isAuditQueueQuestion);
  const start = Math.max(0, currentIndex + 1);
  const next = list.slice(start).find(isAuditQueueQuestion) || list.find(isAuditQueueQuestion);
  if (next) selectQuestion(next.id);
}

function exportAuditFeedback() {
  const rows = Object.values(getAuditFeedbackMap());
  if (!rows.length) {
    showToast("目前没有人工反馈记录");
    return;
  }
  const header = ["题号", "问题类型", "科目", "章节", "答案", "题干", "来源", "备注", "更新时间"];
  const lines = rows.map((row) => [row.questionId, row.label || getAuditFeedbackLabel(row.type), row.subject, row.chapter, row.answer, row.stem, row.source, row.note, row.updatedAt]
    .map((value) => `"${String(value || "").replace(/"/g, '""')}"`).join(","));
  const csv = [header.join(","), ...lines].join("\n");
  downloadTextFile(`解析问题反馈-${new Date().toISOString().slice(0,10)}.csv`, "\ufeff" + csv, "text/csv;charset=utf-8");
  showToast("已导出反馈清单");
}

function legacyDownloadTextFile(filename, text, type = "text/plain;charset=utf-8") {
  return downloadTextFile(filename, text, type);
}

function getFormulaHints(question) {
  const text = [question.chapter, question.stem, question.analysis].join(" ");
  if (question.subject === "高数") {
    if (/定义域|根号|分母|对数|ln|lg/.test(text)) {
      return ["根号内：被开方数 ≥ 0", "分母：分母 ≠ 0", "对数：真数 > 0", "偶次根号在分母：被开方数 > 0"];
    }
    if (/极限|无穷小|无穷大/.test(text)) {
      return ["先代入，能直接算先直接算", "0/0 型：因式分解、约分、等价无穷小", "常用：sinx ~ x，1-cosx ~ x²/2，ln(1+x) ~ x"];
    }
    if (/导数|求导|微分|切线|法线/.test(text)) {
      return ["(u±v)'=u'±v'", "(uv)'=u'v+uv'", "(u/v)'=(u'v-uv')/v²", "复合函数：外层导数 × 内层导数"];
    }
    if (/单调|极值|最值|凹凸|拐点/.test(text)) {
      return ["单调性看 f'(x) 的正负", "极值点通常先找 f'(x)=0 或不可导点", "凹凸性看 f''(x) 的正负", "拐点要求凹凸性发生改变"];
    }
    return ["先判断题型，再找对应条件：定义域、连续、可导、单调、极值。"];
  }
  if (question.subject === "英语") {
    const grammar = getEnglishGrammarCategory(question);
    return [`本题归类：${grammar || "基础语法"}`, "先看空格位置，再判断词性、单复数、时态或从句连接词。"];
  }
  if (question.subject === "计算机") {
    return ["先抓关键词，再定位概念：硬件、系统软件、Office、网络、安全。", "概念题优先背定义，操作题优先背菜单/快捷键/步骤。"];
  }
  return ["先看考点，再按固定步骤检查条件。"];
}

function renderFormulaHint(question) {
  const hints = getFormulaHints(question);
  return `
    <section class="hint-box">
      <strong>公式 / 思路提示</strong>
      <ul>${hints.map((item) => `<li>${renderRichText(item)}</li>`).join("")}</ul>
    </section>
  `;
}


function openImageZoom(src) {
  if (!src) return;
  closeImageZoom();
  const overlay = document.createElement("div");
  overlay.className = "image-zoom-overlay";
  overlay.innerHTML = `
    <div class="image-zoom-inner">
      <button class="image-zoom-close" type="button" aria-label="关闭图片">×</button>
      <img class="pinch-zoom-image" src="${escapeHtml(imageSrc(src))}" data-raw-image="${escapeHtml(normalizeImagePath(src))}" alt="放大图片" onerror="window.handleQuestionImageError && window.handleQuestionImageError(this)">
      <div class="pinch-hint">双指缩放 · 双击还原</div>
    </div>
  `;
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target.classList.contains("image-zoom-close")) closeImageZoom();
  });
  document.body.appendChild(overlay);
  const img = overlay.querySelector(".pinch-zoom-image");
  if (img) enablePinchZoom(img);
}

function enablePinchZoom(img) {
  let scale = 1;
  let startDistance = 0;
  let startScale = 1;
  let lastTap = 0;
  const apply = () => {
    img.style.transform = `scale(${scale})`;
    img.style.cursor = scale > 1 ? "zoom-out" : "zoom-in";
  };
  const distance = (touches) => {
    const [a, b] = touches;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };
  img.addEventListener("touchstart", (event) => {
    if (event.touches.length === 2) {
      startDistance = distance(event.touches);
      startScale = scale;
    }
  }, { passive: true });
  img.addEventListener("touchmove", (event) => {
    if (event.touches.length === 2 && startDistance) {
      event.preventDefault();
      scale = Math.min(4, Math.max(1, startScale * distance(event.touches) / startDistance));
      apply();
    }
  }, { passive: false });
  img.addEventListener("dblclick", () => {
    scale = scale > 1 ? 1 : 2;
    apply();
  });
  img.addEventListener("click", () => {
    const now = Date.now();
    if (now - lastTap < 260) {
      scale = scale > 1 ? 1 : 2;
      apply();
    }
    lastTap = now;
  });
}

function closeImageZoom() {
  document.querySelectorAll(".image-zoom-overlay").forEach((node) => node.remove());
}

function normalizeAnswerLetters(answer, question = null) {
  const raw = String(answer || "").trim();
  const text = raw.toUpperCase();
  const letters = new Set();

  if (isJudgmentQuestion(question)) {
    const compactJudgment = text
      .replace(/^(?:答案|正确答案|结论)\s*[：:]?\s*/i, "")
      .replace(/[。.!！\s]/g, "");
    if (/^(?:A|对|正确|√|TRUE|T|YES|是)$/.test(compactJudgment)) {
      letters.add("A");
    } else if (/^(?:B|错|错误|×|FALSE|F|NO|否)$/.test(compactJudgment)) {
      letters.add("B");
    }
    return letters;
  }

  const compact = text.replace(/\s+/g, "");
  const answerLike = compact.match(/(?:答案|选|正确答案|为|是|：|:)?([A-D](?:[、,，/和及]*[A-D]){0,3})(?:$|[^A-Z])/);
  if (answerLike) {
    answerLike[1].replace(/[A-D]/g, (letter) => {
      letters.add(letter);
      return letter;
    });
    return letters;
  }
  text.replace(/(^|[^A-Z])([A-D])([^A-Z]|$)/g, (_, before, letter) => {
    letters.add(letter);
    return `${before}${letter}`;
  });
  return letters;
}

function extractOptionLetter(option, index) {
  const text = String(option || "").trim();
  const match = text.match(/^([A-D])\s*[.．、)]/i);
  return match ? match[1].toUpperCase() : String.fromCharCode(65 + index);
}

function englishDistractorReason(grammar) {
  const map = {
    "名词": "重点检查可数/不可数、单复数和名词所有格。",
    "代词": "重点检查指代对象、人称、物主代词和反身代词。",
    "冠词": "重点检查泛指/特指，以及 a、an、the 的搭配。",
    "介词": "重点检查固定搭配、时间地点介词和动词介词搭配。",
    "时态": "重点检查时间标志词、主谓一致和动作先后。",
    "从句": "重点检查连接词在从句中充当的成分。",
    "非谓语": "重点检查主动/被动、to do/doing/done 的区别。",
    "主谓一致": "重点检查真正主语、就近原则和单复数。",
    "句子结构": "重点检查句子成分是否完整，以及是否缺谓语或连接词。"
  };
  return map[grammar] || "重点检查词性、搭配、句子结构和中文直译陷阱。";
}

function renderEnglishOptionAnalysis(question) {
  return "";
}

function renderMistakePoint(question) {
  return "";
}

function getMistakePoints(question) {
  const text = [question.chapter, question.stem, question.analysis].join(" ");
  if (question.subject === "高数") {
    if (/定义域|根号|分母|对数/.test(text)) {
      return ["不要只看根号，分母和对数真数也要一起限制。", "最后结果要取交集，不是并集。"];
    }
    if (/导数|求导|切线|法线/.test(text)) {
      return ["复合函数求导容易漏乘内层导数。", "切线斜率用 f'(x₀)，法线斜率是 -1/f'(x₀)。"];
    }
    if (/极值|单调|最值/.test(text)) {
      return ["f'(x)=0 只是候选点，不一定就是极值点。", "闭区间最值要比较端点和驻点。"];
    }
    return ["先补全限制条件，再计算；最后检查答案是否落在定义域内。"];
  }
  if (question.subject === "英语") {
    return ["不要只凭中文意思选，先判断空格需要的词性。", "名词题注意单复数，代词题注意指代对象和格。"];
  }
  if (question.subject === "计算机") {
    return ["相近概念要区分：内存/外存、系统软件/应用软件、RAM/ROM。", "缩写题不要只背中文，还要记清英文全称或作用。"];
  }
  return ["先定位考点，再按步骤排除干扰项。"];
}

function textTokens(question) {
  return new Set(normalizeSearchText([question.chapter, question.type, question.stem, ...(question.tags || [])].join(" ")).match(/[a-z0-9]+|[\u4e00-\u9fa5]{2,}/g) || []);
}

function questionSignature(question) {
  return normalizeSearchText(String(question && question.stem || ""))
    .replace(/^\d+[\.、．]/, "")
    .replace(/[abcd][\.、．][^abcd]+/gi, "")
    .replace(/[（）()\s，。,.；;：:？！?]/g, "");
}

function getSimilarQuestions(question, limit = 5) {
  const baseTokens = textTokens(question);
  const baseTags = new Set(question.tags || []);
  const baseSignature = questionSignature(question);
  const seen = new Set([baseSignature]);
  const ranked = state.questions
    .filter((item) => item.id !== question.id)
    .filter((item) => !isUnverifiedAnswer(item))
    .filter((item) => !((item.tags || []).includes("不进同类推荐")))
    .map((item) => {
      let score = 0;
      if (item.subject === question.subject) score += 10;
      if (item.chapter === question.chapter) score += 14;
      if (String(item.type || "") === String(question.type || "")) score += 3;
      if (String(item.difficulty) === String(question.difficulty)) score += 2;
      (item.tags || []).forEach((tag) => { if (baseTags.has(tag)) score += 4; });
      textTokens(item).forEach((token) => { if (baseTokens.has(token)) score += 1; });
      return { item, score, signature: questionSignature(item) };
    })
    .filter((entry) => entry.signature && entry.signature !== baseSignature)
    .filter((entry) => entry.score >= 10)
    .sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id));
  const unique = [];
  for (const entry of ranked) {
    if (seen.has(entry.signature)) continue;
    seen.add(entry.signature);
    unique.push(entry.item);
    if (unique.length >= limit) break;
  }
  return unique;
}

function renderSimilarPanel() {
  if (!els.mobileSimilarPanel) {
    return;
  }
  const question = state.questions.find((item) => item.id === state.selectedId);
  if (!question) {
    els.mobileSimilarPanel.innerHTML = `<div class="mobile-similar-card"><h2>同类题</h2><p>先选择一道题，再查看同类题。</p></div>`;
    return;
  }
  const similar = getSimilarQuestions(question, 5);
  els.mobileSimilarPanel.innerHTML = `
    <div class="mobile-similar-card">
      <p class="mobile-similar-kicker">当前题</p>
      <h2>${escapeHtml(question.subject || "")} · ${escapeHtml(question.chapter || "")}</h2>
      <p class="mobile-similar-current">${escapeHtml(String(question.stem || "").slice(0, 120))}</p>
      <p class="mobile-similar-note">同类题只从现有题库里挑，不新编；已排除当前题、重复题干和答案待核对题。</p>
    </div>
    <div class="mobile-similar-card">
      <h2>同类题推荐</h2>
      ${similar.length ? `<div class="similar-list standalone">${similar.map((item, index) => `
        <button type="button" class="similar-item" data-similar-id="${escapeHtml(item.id)}">
          <b>同类 ${index + 1}</b>
          <span>${escapeHtml(item.subject || "")} · ${escapeHtml(item.chapter || "")}</span>
          <small>${escapeHtml(String(item.stem || "").slice(0, 90))}</small>
        </button>
      `).join("")}</div>` : `<p class="mobile-similar-note">这道题暂时没有足够可靠的同类题。可以换同章节其它题再看。</p>`}
    </div>
  `;
  els.mobileSimilarPanel.querySelectorAll("[data-similar-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectQuestion(button.dataset.similarId);
      setMobileTab("quiz");
    });
  });
}

function renderSimilarQuestions(question) {
  return "";
}

function typesetMathSoon() {
  // v50: formulas are pre-rendered locally, so mobile browsers never expose raw TeX source.
}


function renderRichText(value) {
  const text = String(value || "");
  const mathPattern = /(\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$[^$\n]+\$)/g;
  let cursor = 0;
  const parts = [];
  text.replace(mathPattern, (segment, _match, offset) => {
    if (offset > cursor) parts.push(renderLooseTextChunk(text.slice(cursor, offset)));
    parts.push(renderMathSegment(segment));
    cursor = offset + segment.length;
    return segment;
  });
  if (cursor < text.length) parts.push(renderLooseTextChunk(text.slice(cursor)));
  return parts.join("").replace(/\r?\n/g, "<br>");
}

function renderMathSegment(segment) {
  const cache = window.PRE_RENDERED_MATH || {};
  if (cache[segment]) return cache[segment];
  let inner = String(segment || "");
  if ((inner.startsWith("\\(") && inner.endsWith("\\)")) || (inner.startsWith("\\[") && inner.endsWith("\\]"))) {
    inner = inner.slice(2, -2);
  } else if (inner.startsWith("$") && inner.endsWith("$")) {
    inner = inner.slice(1, -1);
  }
  return `<span class="math-render-fallback">${renderLatexFallback(inner)}</span>`;
}

function renderLooseTextChunk(value) {
  const text = String(value || "");
  if (!/\\[A-Za-z]+/.test(text)) return prettifyMathHtml(highlightPersonalPhrases(text));
  return `<span class="math-render-fallback">${renderLatexFallback(text)}</span>`;
}

function renderLatexFallback(value) {
  let text = escapeHtml(String(value || ""));
  text = text
    .replace(/\\displaystyle\s*/g, "")
    .replace(/\\left|\\right/g, "")
    .replace(/\\(?:,|;|!|quad|qquad)\s*/g, " ")
    .replace(/\\infty/g, "∞")
    .replace(/\\cup/g, "∪")
    .replace(/\\cap/g, "∩")
    .replace(/\\leq?|\\le/g, "≤")
    .replace(/\\geq?|\\ge/g, "≥")
    .replace(/\\neq?|\\ne/g, "≠")
    .replace(/\\to/g, "→")
    .replace(/\\pm/g, "±")
    .replace(/\\cdot/g, "·")
    .replace(/\\ldots|\\cdots/g, "…")
    .replace(/\\pi/g, "π")
    .replace(/\\varphi/g, "φ")
    .replace(/\\mathbb\\{R\\}/g, "ℝ")
    .replace(/\\(arccos|arcsin|arctan|sin|cos|tan|cot|sec|ln|lg|log|max|lim|int)\b/g, "$1")
    .replace(/\\sqrt\\[3\\]\\{([^{}]+)\\}/g, "∛($1)")
    .replace(/\\sqrt\\[5\\]\\{([^{}]+)\\}/g, "⁵√($1)")
    .replace(/\\sqrt\\{([^{}]+)\\}/g, "√($1)")
    .replace(/\\(?:d?frac)\\{([^{}]+)\\}\\{([^{}]+)\\}/g, "$1/$2")
    .replace(/\\underline\\{([^{}]+)\\}/g, "$1")
    .replace(/\\begin\\{cases\\}/g, "{")
    .replace(/\\end\\{cases\\}/g, "")
    .replace(/&amp;/g, " ")
    .replace(/\\\\/g, "; ")
    .replace(/\\([A-Za-z]+)/g, "$1")
    .replace(/[{}]/g, "");
  return prettifyMathHtml(text);
}

function prettifyMathHtml(html, depth = 0) {
  let output = String(html || "");
  if (depth > 5) {
    return output;
  }

  const placeholders = [];
  const placeholderPattern = /\uE000(\d+)\uE001/g;
  const makePlaceholder = (value) => {
    const token = `\uE000${placeholders.length}\uE001`;
    placeholders.push(value);
    return token;
  };
  const restorePlaceholders = (value) => String(value || "").replace(placeholderPattern, (_, index) => placeholders[Number(index)] || "");
  const hasPlaceholder = (value) => {
    placeholderPattern.lastIndex = 0;
    return placeholderPattern.test(String(value || ""));
  };
  const formatOperand = (value) => {
    const text = String(value || "");
    if (hasPlaceholder(text)) {
      placeholderPattern.lastIndex = 0;
      return restorePlaceholders(text);
    }
    return prettifyMathHtml(text, depth + 1);
  };
  const makeFraction = (top, bottom) => makePlaceholder(`<span class="math-frac"><span>${formatOperand(top)}</span><span>${formatOperand(bottom)}</span></span>`);
  const makeRoot = (symbol, radicand, degree = 2) => makePlaceholder(
    `<span class="math-root ${degree === 3 ? "cube-root" : "square-root"}"><span class="math-root-sign">${symbol}</span><span class="math-radicand">${prettifyMathHtml(radicand, depth + 1)}</span></span>`
  );

  function findMatching(text, start, openChar, closeChar) {
    let level = 0;
    for (let index = start; index < text.length; index += 1) {
      const char = text[index];
      if (char === openChar) {
        level += 1;
      } else if (char === closeChar) {
        level -= 1;
        if (level === 0) {
          return index;
        }
      }
    }
    return -1;
  }

  function readGrouped(text, start) {
    const openChar = text[start];
    const closeChar = openChar === "(" ? ")" : (openChar === "[" ? "]" : "}");
    const end = findMatching(text, start, openChar, closeChar);
    if (end < 0) {
      return null;
    }
    return {
      value: text.slice(start + 1, end),
      end: end + 1
    };
  }

  function readRadicand(text, start) {
    let index = start;
    while (text[index] === " ") {
      index += 1;
    }
    if (text[index] === "(" || text[index] === "[" || text[index] === "{") {
      return readGrouped(text, index);
    }

    const atomStart = index;
    while (index < text.length) {
      const char = text[index];
      if (/^[\s,，;；。:：=<>≤≥+\-*\/\\|&\)\]\}]$/.test(char)) {
        break;
      }
      if (char === "^" && (text[index + 1] === "(" || text[index + 1] === "[")) {
        const grouped = readGrouped(text, index + 1);
        if (!grouped) {
          index += 1;
        } else {
          index = grouped.end;
        }
        continue;
      }
      index += 1;
    }

    if (index <= atomStart) {
      return null;
    }
    return {
      value: text.slice(atomStart, index),
      end: index
    };
  }

  function convertRadicals(text) {
    let result = "";
    for (let index = 0; index < text.length;) {
      const tail = text.slice(index);
      const sqrtMatch = tail.match(/^sqrt\s*(?=[\(\[\{])/i);
      let symbol = "";
      let degree = 2;
      let radicandStart = -1;

      if (sqrtMatch) {
        symbol = "√";
        degree = 2;
        radicandStart = index + sqrtMatch[0].length;
      } else if (text.startsWith("根号", index)) {
        symbol = "√";
        degree = 2;
        radicandStart = index + 2;
      } else if (text.startsWith("³√", index)) {
        symbol = "∛";
        degree = 3;
        radicandStart = index + 2;
      } else if (text[index] === "∛") {
        symbol = "∛";
        degree = 3;
        radicandStart = index + 1;
      } else if (text[index] === "√") {
        symbol = "√";
        degree = 2;
        radicandStart = index + 1;
      }

      if (!symbol) {
        result += text[index];
        index += 1;
        continue;
      }

      const radicand = readRadicand(text, radicandStart);
      if (!radicand) {
        result += symbol;
        index = radicandStart;
        continue;
      }

      result += makeRoot(symbol, radicand.value, degree);
      index = radicand.end;
    }
    return result;
  }


  function findMatchingBackward(text, closeIndex, openChar, closeChar) {
    let level = 0;
    for (let index = closeIndex; index >= 0; index -= 1) {
      const char = text[index];
      if (char === closeChar) {
        level += 1;
      } else if (char === openChar) {
        level -= 1;
        if (level === 0) {
          return index;
        }
      }
    }
    return -1;
  }

  function readPlaceholderForward(text, start) {
    if (text[start] !== "\uE000") {
      return null;
    }
    const end = text.indexOf("\uE001", start + 1);
    if (end < 0) {
      return null;
    }
    return { start, end: end + 1, value: text.slice(start, end + 1) };
  }

  function readPlaceholderBackward(text, end) {
    if (text[end - 1] !== "\uE001") {
      return null;
    }
    const start = text.lastIndexOf("\uE000", end - 2);
    if (start < 0) {
      return null;
    }
    return { start, end, value: text.slice(start, end) };
  }

  function extendLeftCoefficient(text, start) {
    let index = start;
    while (index > 0 && /[A-Za-z0-9π∞φθξαβγ]/.test(text[index - 1])) {
      index -= 1;
    }
    return index;
  }

  function readLeftOperand(text, slashIndex) {
    let end = slashIndex;
    while (end > 0 && text[end - 1] === " ") {
      end -= 1;
    }
    if (end <= 0) {
      return null;
    }

    const placeholder = readPlaceholderBackward(text, end);
    if (placeholder) {
      const start = extendLeftCoefficient(text, placeholder.start);
      return { start, end, value: text.slice(start, end) };
    }

    const closeChar = text[end - 1];
    if (closeChar === ")" || closeChar === "]") {
      const openChar = closeChar === ")" ? "(" : "[";
      const groupStart = findMatchingBackward(text, end - 1, openChar, closeChar);
      if (groupStart >= 0) {
        const start = extendLeftCoefficient(text, groupStart);
        return { start, end, value: text.slice(start, end) };
      }
    }

    let start = end;
    while (start > 0 && /[A-Za-z0-9π∞φθξαβγ₀₁₂₃₄₅₆₇₈₉ₙₖ₊₋⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/.test(text[start - 1])) {
      start -= 1;
    }
    if (start === end) {
      return null;
    }
    return { start, end, value: text.slice(start, end) };
  }

  function readRightOperand(text, slashIndex) {
    let start = slashIndex + 1;
    while (start < text.length && text[start] === " ") {
      start += 1;
    }
    if (start >= text.length) {
      return null;
    }

    let end = start;
    while (end < text.length && /[A-Za-z0-9π∞φθξαβγ]/.test(text[end])) {
      end += 1;
    }
    const placeholder = readPlaceholderForward(text, end);
    if (placeholder) {
      return { start, end: placeholder.end, value: text.slice(start, placeholder.end) };
    }

    const directPlaceholder = readPlaceholderForward(text, start);
    if (directPlaceholder) {
      return directPlaceholder;
    }

    const openChar = text[start];
    if (openChar === "(" || openChar === "[" || openChar === "{") {
      const grouped = readGrouped(text, start);
      if (grouped) {
        return { start, end: grouped.end, value: text.slice(start, grouped.end) };
      }
    }

    end = start;
    while (end < text.length && /[A-Za-z0-9π∞φθξαβγ₀₁₂₃₄₅₆₇₈₉ₙₖ₊₋⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/.test(text[end])) {
      end += 1;
    }
    if (end === start) {
      return null;
    }
    return { start, end, value: text.slice(start, end) };
  }

  function looksLikeMathOperand(value) {
    const text = String(value || "");
    return /[A-Za-z0-9π∞φθξαβγ\uE000⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/.test(text) && !/[\u4e00-\u9fa5]/.test(text);
  }

  function convertBalancedFractions(text) {
    let result = String(text || "");
    let index = 0;
    while (index < result.length) {
      if (result[index] !== "/") {
        index += 1;
        continue;
      }
      const left = readLeftOperand(result, index);
      const right = readRightOperand(result, index);
      if (!left || !right || !looksLikeMathOperand(left.value) || !looksLikeMathOperand(right.value)) {
        index += 1;
        continue;
      }
      const replacement = makeFraction(left.value, right.value);
      result = result.slice(0, left.start) + replacement + result.slice(right.end);
      index = left.start + replacement.length;
    }
    return result;
  }

  output = convertRadicals(output);

  // Powers first, so x^(3/2) becomes a compact exponent instead of a stacked fraction.
  output = output.replace(/([A-Za-z0-9πφθξαβγ]|\)|\])\^\(([^()<>\n]{1,60})\)/g, (_, base, exponent) => `${base}<sup>${String(exponent).replace(/\//g, "⁄")}</sup>`);
  output = output.replace(/([A-Za-z0-9πφθξαβγ]|\)|\])\^\[([^\[\]<>\n]{1,60})\]/g, (_, base, exponent) => `${base}<sup>${String(exponent).replace(/\//g, "⁄")}</sup>`);
  output = output.replace(/([A-Za-z0-9πφθξαβγ]|\)|\])\^([A-Za-z0-9πφθξαβγ]|-?\d+)/g, "$1<sup>$2</sup>");

  // Common differential quotients such as dy/dx, dy/dt, dx/dt.
  output = output.replace(/\b(d[xyzt])\s*\/\s*(d[xyzt])\b/g, (_, top, bottom) => makeFraction(top, bottom));

  // Fractions after radicals: supports 1/√(...), 3√2/2, (dy/dt)/(dx/dt), x/(x-1)².
  const placeholderAtom = "\\uE000\\d+\\uE001";
  const placeholderWithCoeff = `(?:[A-Za-z0-9π∞φθξαβγ]*${placeholderAtom})`;
  const roundGroup = "(?:\\([^()<>]{1,90}\\)|\\[[^\\[\\]<>]{1,90}\\])(?:[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+|\\^[A-Za-z0-9πφθξαβγ+-]+)?";
  const plainAtom = "[A-Za-z0-9π∞φθξαβγ]+[₀₁₂₃₄₅₆₇₈₉ₙₖ₊₋]*(?:[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+|\\^[A-Za-z0-9πφθξαβγ+-]+)?";
  const atom = `(?:${placeholderWithCoeff}|${placeholderAtom}|${roundGroup}|${plainAtom})`;
  const fractionPattern = new RegExp(`(${atom})\\s*\\/\\s*(${atom})`, "g");
  output = convertBalancedFractions(output);
  output = output.replace(fractionPattern, (_, top, bottom) => makeFraction(top, bottom));



  return restorePlaceholders(output);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function debounce(fn, wait = 180) {
  let timer = 0;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 1800);
}


function getWrongPlanningQuestions() {
  return state.questions.filter((question) => {
    const progress = getProgress(question.id);
    return Number(progress.wrong || 0) > 0 || Boolean(progress.addedToWrongBookAt);
  }).sort((a, b) => {
    const pa = getProgress(a.id);
    const pb = getProgress(b.id);
    return Number(pb.wrong || 0) - Number(pa.wrong || 0) || Number(b.importOrder || 0) - Number(a.importOrder || 0);
  });
}

function getWrongPlanGroups(questions) {
  const map = new Map();
  questions.forEach((question) => {
    const progress = getProgress(question.id);
    const key = progress.mistakeReason || "unknown";
    if (!map.has(key)) map.set(key, { key, label: MISTAKE_REASON_LABELS[key] || "未分类", questions: [] });
    map.get(key).questions.push(question);
  });
  return [...map.values()].sort((a, b) => b.questions.length - a.questions.length);
}

function getPlanAdvice(group) {
  const advice = {
    unknown: "先看答案与解析，再做 3 道同考点题；第二天重新做原题。",
    careless: "开启倒计时，逐项圈出题干条件；连续做 5 题控制失误。",
    formula: "先抄写并口述公式，再做 2 道直接应用题和 1 道变式题。",
    concept: "对比易混概念，写出区别，再做 3 道辨析题。",
    stem: "做题前先标出否定词、范围和设问对象，再开始计算或选择。",
    analysis: "先看答案结论，再分步骤读解析；仍不懂就标记解析问题。"
  };
  return advice[group.key] || advice.unknown;
}

function closeWrongPlanner() {
  document.querySelector("#wrongPlannerOverlay")?.remove();
}

function openWrongPlanner() {
  closeWrongPlanner();
  const wrongQuestions = getWrongPlanningQuestions();
  const groups = getWrongPlanGroups(wrongQuestions);
  const overlay = document.createElement("div");
  overlay.className = "wrong-planner-overlay";
  overlay.id = "wrongPlannerOverlay";
  const topItems = wrongQuestions.slice(0, 12);
  overlay.innerHTML = `
    <section class="wrong-planner-dialog" role="dialog" aria-modal="true" aria-label="错题规划">
      <header class="wrong-planner-head">
        <div><p class="eyebrow">Wrong Plan</p><h2>错题规划与同类训练</h2><p>按错因分组，自动安排复习顺序，并可生成带答案与解析的类似题。</p></div>
        <button type="button" class="icon-button secondary" data-close-wrong-planner>关闭</button>
      </header>
      <div class="wrong-plan-summary">
        <div><strong>${wrongQuestions.length}</strong><span>错题总数</span></div>
        <div><strong>${wrongQuestions.filter((q) => isDueReview(q)).length}</strong><span>今日应复习</span></div>
        <div><strong>${groups.length}</strong><span>错因类型</span></div>
      </div>
      ${wrongQuestions.length ? `
        <div class="wrong-plan-actions">
          <button type="button" class="primary-button" data-start-wrong-plan>开始刷错题</button>
          <button type="button" class="secondary-button" data-generate-wrong-set>自动生成 3 道类似题</button>
        </div>
        <div class="wrong-plan-grid">
          ${groups.map((group) => `<article class="wrong-plan-card"><h3>${escapeHtml(group.label)} · ${group.questions.length}题</h3><p>${escapeHtml(getPlanAdvice(group))}</p><button type="button" class="secondary-button" data-plan-reason="${escapeHtml(group.key)}">查看这一类</button></article>`).join("")}
        </div>
        <div class="wrong-plan-list"><h3>优先复习</h3>${topItems.map((question) => { const p=getProgress(question.id); return `<button type="button" class="wrong-plan-item" data-plan-question="${escapeHtml(question.id)}"><b>${escapeHtml(question.subject)} · 原题${escapeHtml(getQuestionDisplayNo(question))}</b><span>${escapeHtml(question.chapter)}</span><small>错 ${Number(p.wrong || 0)} 次${p.mistakeReasonLabel ? ` · ${escapeHtml(p.mistakeReasonLabel)}` : ""}</small></button>`; }).join("")}</div>
      ` : `<div class="wrong-plan-empty"><h3>当前还没有错题</h3><p>做错题后会自动记录错因并生成复习计划。</p></div>`}
    </section>`;
  document.body.append(overlay);
  overlay.addEventListener("click", async (event) => {
    if (event.target === overlay || event.target.closest("[data-close-wrong-planner]")) return closeWrongPlanner();
    const questionButton = event.target.closest("[data-plan-question]");
    if (questionButton) { closeWrongPlanner(); selectQuestion(questionButton.dataset.planQuestion); return; }
    if (event.target.closest("[data-start-wrong-plan]")) {
      closeWrongPlanner();
      els.statusFilter.value = wrongQuestions.some((q) => getProgress(q.id).addedToWrongBookAt) ? "wrongBook" : "wrong";
      state.page = 1; applyFilters(); return;
    }
    const reasonButton = event.target.closest("[data-plan-reason]");
    if (reasonButton) {
      const group = groups.find((item) => item.key === reasonButton.dataset.planReason);
      if (group?.questions[0]) { closeWrongPlanner(); selectQuestion(group.questions[0].id); }
      return;
    }
    if (event.target.closest("[data-generate-wrong-set]")) {
      await generateWrongPracticeSet(wrongQuestions.slice(0, 3));
      closeWrongPlanner();
    }
  });
}

function generatedTemplateFor(question, index = 0) {
  const english = [
    { stem: '“very quiet” in “The classroom is very quiet.” is ______.', options: ['A. 宾语','B. 表语','C. 定语','D. 状语'], answer: 'B', analysis: 'is 是系动词，very quiet 说明主语 The classroom 的状态，因此作表语。' },
    { stem: '“in the library” in “They read English books in the library every afternoon.” is ______.', options: ['A. 主语','B. 宾语','C. 定语','D. 状语'], answer: 'D', analysis: 'in the library 表示动作 read 发生的地点，修饰谓语，作地点状语。' },
    { stem: '“a useful dictionary” in “The teacher gave me a useful dictionary.” is ______.', options: ['A. 主语','B. 直接宾语','C. 表语','D. 状语'], answer: 'B', analysis: 'gave 后有双宾语：me 是间接宾语，a useful dictionary 是直接宾语。' },
    { stem: '“became” in “The weather became colder at night.” is ______.', options: ['A. 实义动词','B. 系动词','C. 助动词','D. 情态动词'], answer: 'B', analysis: 'became 后接 colder 作表语，说明主语状态变化，因此 became 是系动词。' },
    { stem: '划出句中的谓语动词：\nThe young volunteers have finished the difficult task.', options: [], answer: 'have finished', analysis: 'have 与 finished 共同构成现在完成时谓语。' },
    { stem: '找出句中的状语并标明类型：\nShe practices English carefully every morning.', options: [], answer: 'carefully（方式状语）；every morning（时间状语）', analysis: 'carefully 说明练习的方式；every morning 说明动作发生的时间。' }
  ];
  const computer = [
    { stem: '第一代电子计算机采用的主要电子元器件是（ ）。', options: ['A. 晶体管','B. 电子管','C. 集成电路','D. 大规模集成电路'], answer: 'B', analysis: '第一代计算机以电子管为主要电子元器件。' },
    { stem: '冯·诺依曼计算机的核心工作原理是（ ）。', options: ['A. 存储程序','B. 分时处理','C. 云计算','D. 人工智能'], answer: 'A', analysis: '程序和数据预先存入内存，计算机按程序顺序自动执行，即存储程序原理。' },
    { stem: '世界上第一台电子数字计算机是（ ）。', options: ['A. EDVAC','B. UNIVAC','C. ENIAC','D. EDSAC'], answer: 'C', analysis: 'ENIAC 于 1946 年在美国宾夕法尼亚大学研制成功。' },
    { stem: '图灵机本质上是一种（ ）。', options: ['A. 真空管计算机','B. 抽象计算模型','C. 商用计算机','D. 机械计算器'], answer: 'B', analysis: '图灵机是研究可计算性的抽象理论模型，没有对应的真空管硬件实体。' },
    { stem: '按用途分类，专门完成某一特定任务的计算机称为（ ）。', options: ['A. 通用计算机','B. 专用计算机','C. 巨型计算机','D. 模拟计算机'], answer: 'B', analysis: '专用计算机面向特定用途设计，功能集中。' }
  ];
  const math = [
    { stem: '\\(f(x)=\\sqrt{7-x}+\\ln(x-2)\\) 的定义域是（ ）。', options: ['A. \\((2,7]\\)','B. \\([2,7]\\)','C. \\((2,+\\infty)\\)','D. \\((-\\infty,7]\\)'], answer: 'A', analysis: '根式要求 x≤7，对数要求 x>2，取交集得到 (2,7]。' },
    { stem: '\\(f(x)=\\sqrt{x-3}+\\frac{1}{x-6}\\) 的定义域是（ ）。', options: ['A. \\([3,6)\\cup(6,+\\infty)\\)','B. \\((3,6)\\cup(6,+\\infty)\\)','C. \\([3,+\\infty)\\)','D. \\((3,+\\infty)\\)'], answer: 'A', analysis: '根式要求 x≥3，分母要求 x≠6，因此定义域为 [3,6)∪(6,+∞)。' },
    { stem: '\\(y=\\arcsin(x-4)+\\ln(x-3)\\) 的定义域是（ ）。', options: ['A. \\((3,5]\\)','B. \\([3,5]\\)','C. \\((3,+\\infty)\\)','D. \\([3,5)\\)'], answer: 'A', analysis: '反正弦要求 3≤x≤5，对数要求 x>3，取交集得 (3,5]。' },
    { stem: '\\(y=\\sqrt{9-x^2}+\\ln(x+1)\\) 的定义域是（ ）。', options: ['A. \\((-1,3]\\)','B. \\([-3,3]\\)','C. \\((-1,+\\infty)\\)','D. \\([-1,3]\\)'], answer: 'A', analysis: '根式要求 -3≤x≤3，对数要求 x>-1，取交集得到 (-1,3]。' },
    { stem: '已知 \\(f(x)\\) 的定义域为 \\((1,4]\\)，求 \\(f(2x-1)\\) 的定义域。', options: [], answer: '(1,5/2]', analysis: '令 1<2x-1≤4，解得 1<x≤5/2。' }
  ];
  if (question.subject === '英语') {
    if (/谓语/.test(String(question.type || ''))) return english[4];
    if (/状语/.test(String(question.type || ''))) return english[5];
    return english[index % 4];
  }
  if (question.subject === '高等数学') return math[index % math.length];
  const stem = String(question.stem || '');
  if (/图灵/.test(stem)) return computer[3];
  if (/第一代|电子管/.test(stem)) return computer[0];
  if (/冯.?诺依曼|存储程序/.test(stem)) return computer[1];
  return computer[index % computer.length];
}

async function createGeneratedSimilarQuestion(baseQuestion, index = 0) {
  const template = generatedTemplateFor(baseQuestion, index);
  const generatedCount = state.questions.filter((question) => question.autoGenerated).length;
  const now = Date.now() + index;
  const question = QuestionBankCore.normalizeQuestion({
    id: `GEN-${baseQuestion.subject || 'Q'}-${now}`,
    subject: baseQuestion.subject,
    chapter: `${baseQuestion.chapter || '同类训练'} · 自动变式`,
    type: template.options.length ? '选择题' : (baseQuestion.type || '练习题'),
    stem: template.stem,
    textStem: template.stem,
    options: template.options,
    textOptions: template.options,
    answer: template.answer,
    analysis: '',
    officialAnalysis: template.analysis,
    source: baseQuestion.source || '蓝色森林',
    questionSource: baseQuestion.questionSource || baseQuestion.source || '蓝色森林',
    sourceRecognition: 'generated',
    difficulty: baseQuestion.difficulty || '2',
    tags: ['自动生成类似题','错题训练',baseQuestion.subject || '',baseQuestion.chapter || ''].filter(Boolean),
    images: [],
    analysisImages: [],
    originalNo: `同类${generatedCount + 1}`,
    studyDate: new Date().toISOString().slice(0, 10),
    studyDay: baseQuestion.studyDay || 1,
    dayLabel: '错题同类训练',
    assignmentGroup: baseQuestion.assignmentGroup || '课后作业',
    assignmentOrder: Number(baseQuestion.assignmentOrder || 1),
    importOrder: Math.max(0, ...state.questions.map((q) => Number(q.importOrder || 0))) + 1,
    titleLabel: '自动生成的错题同类练习',
    textStatus: 'generated_verified',
    answerStatus: 'generated_verified',
    answerSource: '本地规则生成',
    analysisSource: '本地规则生成',
    answerAuthority: 'generated',
    auditCategory: 'generated',
    autoGenerated: true,
    generatedFrom: baseQuestion.id
  });
  state.questions.push(question);
  await putOne(QUESTION_STORE, question);
  updateFilters();
  applyFilters();
  return question;
}

async function generateAndOpenSimilarQuestion(baseQuestion) {
  const question = await createGeneratedSimilarQuestion(baseQuestion, state.questions.filter((item) => item.autoGenerated && item.subject === baseQuestion.subject).length);
  selectQuestion(question.id);
  setQuestionView('text');
  showToast('已生成 1 道带答案解析的类似题');
}

async function generateWrongPracticeSet(baseQuestions) {
  const bases = baseQuestions.length ? baseQuestions : state.questions.slice(0, 3);
  const generated = [];
  for (let index = 0; index < Math.min(3, bases.length); index += 1) {
    generated.push(await createGeneratedSimilarQuestion(bases[index], index));
  }
  if (generated[0]) {
    selectQuestion(generated[0].id);
    setQuestionView('text');
    showToast(`已生成 ${generated.length} 道错题同类练习`);
  }
}

function bindEvents() {
  const debouncedFilter = debounce(() => {
    state.page = 1;
    applyFilters();
  });
  els.searchInput.addEventListener("input", debouncedFilter);
  els.subjectFilter.addEventListener("change", () => {
    els.chapterFilter.value = "all";
    updateFilters();
    state.page = 1;
    state.selectedId = "";
    applyFilters();
  });
  [els.assignmentFilter, els.chapterFilter, els.typeFilter, els.sourceFilter, els.dayFilter, els.statusFilter, els.difficultyFilter].filter(Boolean).forEach((select) => {
    select.addEventListener("change", () => {
      state.page = 1;
      state.selectedId = "";
      applyFilters();
    });
  });
  if (els.reviewQueueButton) {
    els.reviewQueueButton.addEventListener("click", () => {
      els.statusFilter.value = "dueReview";
      state.page = 1;
      applyFilters();
    });
  }
  if (els.wrongBookModeButton) {
    els.wrongBookModeButton.addEventListener("click", () => {
      els.statusFilter.value = "wrongBook";
      state.page = 1;
      applyFilters();
    });
  }
  if (els.wrongPlannerButton) {
    els.wrongPlannerButton.addEventListener("click", openWrongPlanner);
  }
  if (els.completeSetsButton) els.completeSetsButton.addEventListener("click", openCompleteSets);
  if (els.mobileCompleteSetsButton) els.mobileCompleteSetsButton.addEventListener("click", openCompleteSets);
  if (els.completeSetsCloseButton) els.completeSetsCloseButton.addEventListener("click", closeCompleteSets);
  if (els.completeSetsSearchInput) els.completeSetsSearchInput.addEventListener("input", debounce(renderCompleteSetsContent));
  if (els.completeSetsModal) els.completeSetsModal.querySelectorAll("[data-complete-close]").forEach((item) => item.addEventListener("click", closeCompleteSets));
  if (els.completeSetQuickButton) els.completeSetQuickButton.addEventListener("click", openQuickBrowse);
  if (els.completeSetExitButton) els.completeSetExitButton.addEventListener("click", clearActiveCompleteSet);
  if (els.completeTextCloseButton) els.completeTextCloseButton.addEventListener("click", closeCompleteTextReader);
  if (els.completeTextSearchInput) els.completeTextSearchInput.addEventListener("input", debounce(renderCompleteTextReader));
  if (els.completeTextPrintButton) els.completeTextPrintButton.addEventListener("click", () => window.print());
  if (els.completeTextModal) els.completeTextModal.querySelectorAll("[data-complete-text-close]").forEach((item) => item.addEventListener("click", closeCompleteTextReader));
  if (els.quickBrowseButton) {
    els.quickBrowseButton.addEventListener("click", openQuickBrowse);
  }
  if (els.mobileQuickBrowseButton) {
    els.mobileQuickBrowseButton.addEventListener("click", openQuickBrowse);
  }
  if (els.quickBrowseCloseButton) {
    els.quickBrowseCloseButton.addEventListener("click", closeQuickBrowse);
  }
  if (els.quickBrowseSearchInput) {
    els.quickBrowseSearchInput.addEventListener("input", debounce(renderQuickBrowseContent));
  }
  if (els.quickBrowseModal) {
    els.quickBrowseModal.querySelectorAll("[data-quick-close]").forEach((item) => item.addEventListener("click", closeQuickBrowse));
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && els.quickBrowseModal && !els.quickBrowseModal.hidden) closeQuickBrowse();
    if (event.key === "Escape" && els.completeSetsModal && !els.completeSetsModal.hidden) closeCompleteSets();
    if (event.key === "Escape" && els.completeTextModal && !els.completeTextModal.hidden) closeCompleteTextReader();
  });
  if (els.auditModeButton) {
    els.auditModeButton.addEventListener("click", () => enterAuditMode());
  }
  if (els.studyModeButton) {
    els.studyModeButton.addEventListener("click", () => {
      state.studyMode = !state.studyMode;
      localStorage.setItem(STUDY_MODE_KEY, state.studyMode ? "single" : "list");
      queueCloudSync();
      render();
    });
  }
  if (els.textModeButton) {
    els.textModeButton.addEventListener("click", toggleQuestionView);
  }
  if (els.autoHideMasteredButton) {
    els.autoHideMasteredButton.addEventListener("click", toggleCorrectOnceCompletionMode);
  }
  if (els.timerButton) {
    els.timerButton.addEventListener("click", toggleTimer);
  }
  if (els.resetAllChoicesButton) {
    els.resetAllChoicesButton.addEventListener("click", resetAllQuestionChoices);
  }

  if (els.mobileFilterToggle) {
    els.mobileFilterToggle.addEventListener("click", () => {
      state.filtersOpen = !state.filtersOpen;
      renderMobileChrome();
    });
  }
  if (els.mobileTimerPill) {
    els.mobileTimerPill.addEventListener("click", toggleTimer);
  }
  els.mobileTabButtons.forEach((button) => {
    button.addEventListener("click", () => setMobileTab(button.dataset.mobileTab));
  });
  if (els.mobileCloudButton) {
    els.mobileCloudButton.addEventListener("click", openCloudPanel);
  }
  if (els.mobileImportBackupButton) {
    els.mobileImportBackupButton.addEventListener("click", openLocalBackupImport);
  }
  if (els.mobileBackupButton) {
    els.mobileBackupButton.addEventListener("click", exportLocalBackup);
  }
  if (els.mobileDailyGoalInput) {
    els.mobileDailyGoalInput.addEventListener("change", () => {
      setDailyGoal(els.mobileDailyGoalInput.value);
      render();
    });
  }
  if (els.mobileMeStudyModeButton) {
    els.mobileMeStudyModeButton.addEventListener("click", () => {
      state.studyMode = !state.studyMode;
      localStorage.setItem(STUDY_MODE_KEY, state.studyMode ? "single" : "list");
      queueCloudSync();
      render();
    });
  }
  if (els.mobileTextModeButton) {
    els.mobileTextModeButton.addEventListener("click", toggleQuestionView);
  }
  if (els.mobileMeAutoHideMasteredButton) {
    els.mobileMeAutoHideMasteredButton.addEventListener("click", toggleCorrectOnceCompletionMode);
  }
  if (els.mobileMeTimerButton) {
    els.mobileMeTimerButton.addEventListener("click", toggleTimer);
  }
  if (els.mobileResetAllChoicesButton) {
    els.mobileResetAllChoicesButton.addEventListener("click", resetAllQuestionChoices);
  }
  if (els.mobileWrongPlannerButton) {
    els.mobileWrongPlannerButton.addEventListener("click", openWrongPlanner);
  }
  els.prevPageButton.addEventListener("click", () => {
    state.page -= 1;
    applyFilters();
  });
  els.nextPageButton.addEventListener("click", () => {
    state.page += 1;
    applyFilters();
  });
  if (els.importBackupButton) {
    els.importBackupButton.addEventListener("click", openLocalBackupImport);
  }
  if (els.backupFileInput) {
    els.backupFileInput.addEventListener("change", () => handleLocalBackupFile(els.backupFileInput.files && els.backupFileInput.files[0]));
  }
  if (els.cloudButton) {
    els.cloudButton.addEventListener("click", openCloudPanel);
  }
}

async function registerServiceWorker() {
  // v19 不再启用旧版 Service Worker，避免手机继续读取旧缓存导致图片显示问号。
  if ("serviceWorker" in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
    } catch (error) {
      console.warn("Service worker unregister failed", error);
    }
  }
  if (window.caches && caches.keys) {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key.includes("question-bank")).map((key) => caches.delete(key)));
    } catch (error) {
      console.warn("Cache cleanup failed", error);
    }
  }
}

if (els.assignmentZoneTabs) {
  els.assignmentZoneTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-assignment-zone]");
    if (!button) return;
    activateAssignmentZone(button.dataset.assignmentZone || "all");
  });
}

async function init() {
  bindEvents();
  state.db = await openDatabase();
  await loadState();
  repairWrongBookOptionsFromProgress();
  if (new URLSearchParams(window.location.search).has("view")) {
    await loadCloudState({ silent: true });
  }
  startStudyTimeCounter();
  await registerServiceWorker();
}

init().catch((error) => {
  console.error(error);
  showToast("题库启动失败，请刷新重试");
});
