/* v63 课后练习 / 暑假作业分区与题库计数修正 */
(function () {
  const db = globalThis.BUNDLED_QUESTION_BANK;
  if (!db || !Array.isArray(db.questions)) return;
  const byId = new Map(db.questions.map((question) => [String(question.id), question]));
  const registry = Array.isArray(db.completeSetRegistry) ? db.completeSetRegistry : [];

  function addAlias(question, assignment) {
    if (!question || !assignment) return;
    const aliases = new Set(Array.isArray(question.assignmentAliases) ? question.assignmentAliases.map(String) : []);
    if (String(question.assignmentGroup || '') !== String(assignment)) aliases.add(String(assignment));
    question.assignmentAliases = [...aliases];
  }

  registry.forEach((set) => {
    const assignment = String(set.assignmentGroup || '');
    if (!assignment || !Array.isArray(set.items)) return;
    set.items.forEach((item) => addAlias(byId.get(String(item.questionId)), assignment));
  });

  db.assignmentZoneMeta = {
    version: 'v63',
    uniqueUnits: db.questions.length,
    labels: {
      '课后作业': '课后练习',
      '暑假集训的作业': '暑假作业',
      '额外题库': '额外题库'
    }
  };
  db.builtAt = '2026-08-01T10:45:00+08:00';
})();
