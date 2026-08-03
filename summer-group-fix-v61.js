/* v61 暑假英语题组归并修正：基础句子汉译英并入名词与代词，合计50题 */
(function () {
  const db = globalThis.BUNDLED_QUESTION_BANK;
  if (!db || !Array.isArray(db.completeSetRegistry)) return;

  const translationId = 'bf-summer-20260721-english-translation';
  const nounId = 'bf-summer-20260721-english-noun-pronoun';
  const sentenceId = 'bf-summer-20260721-english-sentence-structure';
  const mathId = 'bf-summer-20260721-math-function';

  const registry = db.completeSetRegistry;
  const translation = registry.find((set) => String(set.id) === translationId);
  const nounSet = registry.find((set) => String(set.id) === nounId);

  if (translation && nounSet) {
    const nounItems = Array.isArray(nounSet.items) ? nounSet.items : [];
    const existingIds = new Set(nounItems.map((item) => String(item.questionId)));
    const translationItems = (Array.isArray(translation.items) ? translation.items : [])
      .filter((item) => !existingIds.has(String(item.questionId)))
      .map((item, index) => ({
        ...item,
        displayNo: String(index + 1),
        section: '四、基础句子汉译英',
        order: nounItems.length + index + 1,
        page: 5
      }));

    nounSet.items = nounItems.concat(translationItems);
    nounSet.title = '暑假集训｜名词与代词综合练习（完整5页·50题）';
    nounSet.pageCount = 5;
    nounSet.sourceCountLabel = '完整5页';
    nounSet.questionCount = nounSet.items.length;
    nounSet.sections = ['一、选择题（第一组）', '二、选择题（第二组）', '三、英译汉', '四、基础句子汉译英'];
    nounSet.catalogOrder = 13;
    nounSet.archiveNote = '名词与代词原45题后继续接基础句子汉译英5题，共50题；按原资料页序完整归档，与原题共用作答记录。';
  }

  db.completeSetRegistry = registry.filter((set) => String(set.id) !== translationId);
  const sentenceSet = db.completeSetRegistry.find((set) => String(set.id) === sentenceId);
  const mathSet = db.completeSetRegistry.find((set) => String(set.id) === mathId);
  if (sentenceSet) sentenceSet.catalogOrder = 14;
  if (mathSet) mathSet.catalogOrder = 15;

  db.completeSetRegistry.sort((a, b) => Number(a.catalogOrder || 9999) - Number(b.catalogOrder || 9999));

  try {
    if (localStorage.getItem('zsb-question-bank-v57:active-complete-set') === translationId) {
      localStorage.setItem('zsb-question-bank-v57:active-complete-set', nounId);
    }
  } catch (_) {}

  db.version = 'v61-summer-english-50-group';
  db.builtAt = '2026-08-01T09:40:00+08:00';
  db.generatedAt = '2026-08-01T09:40:00+08:00';
  db.summerGroupingAudit = {
    version: 'v61',
    correction: '基础句子汉译英并入名词与代词',
    removedStandaloneSetId: translationId,
    mergedSetId: nounId,
    mergedQuestionCount: nounSet ? Number(nounSet.questionCount || 0) : 0,
    mergedPageCount: nounSet ? Number(nounSet.pageCount || 0) : 0,
    completeSetCount: db.completeSetRegistry.length,
    summerCompleteSetCount: db.completeSetRegistry.filter((set) => String(set.assignmentGroup) === '暑假集训的作业').length
  };
})();
