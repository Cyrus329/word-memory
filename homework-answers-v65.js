/* v65 用户上传课后答案：为v64三套课后练习补齐整套官方答案解析 */
(function(){
  const db=globalThis.BUNDLED_QUESTION_BANK;
  if(!db||!Array.isArray(db.questions)) return;
  const answerSets={"bf-homework-v64-math-limit-pages-7-15":{"question_prefix":"D17-HOMEWORK-PAGE-MATH-","images":["answer-images/day-17-0801-homework-answers/math-limit/page-01.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-02.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-03.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-04.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-05.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-06.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-07.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-08.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-09.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-10.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-11.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-12.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-13.jpg","answer-images/day-17-0801-homework-answers/math-limit/page-14.jpg"],"pdf":"answer-documents/day-17-0801-homework-answers/math-limit-answers.pdf","source":"数学基础精讲第一章第二节习题讲解（用户上传）","label":"第二节 极限完整课后答案解析","answer_pages":14,"coverage":"选择题1-31、填空题1-22、计算题1-41"},"bf-homework-v64-math-continuity-pages-16-21":{"question_prefix":"D17-HOMEWORK-PAGE-MATH-","images":["answer-images/day-17-0801-homework-answers/math-continuity/page-1.jpg","answer-images/day-17-0801-homework-answers/math-continuity/page-2.jpg","answer-images/day-17-0801-homework-answers/math-continuity/page-3.jpg","answer-images/day-17-0801-homework-answers/math-continuity/page-4.jpg","answer-images/day-17-0801-homework-answers/math-continuity/page-5.jpg","answer-images/day-17-0801-homework-answers/math-continuity/page-6.jpg","answer-images/day-17-0801-homework-answers/math-continuity/page-7.jpg","answer-images/day-17-0801-homework-answers/math-continuity/page-8.jpg","answer-images/day-17-0801-homework-answers/math-continuity/page-9.jpg"],"pdf":"answer-documents/day-17-0801-homework-answers/math-continuity-answers.pdf","source":"基础精讲第一章第三节习题讲解（用户上传）","label":"第三节 连续与间断完整课后答案解析","answer_pages":9,"coverage":"选择题1-14、填空题1-10、计算题1-6、证明题1-9"},"bf-homework-v64-english-adjective-adverb-pages-118-121":{"question_prefix":"D17-HOMEWORK-PAGE-ENG-","images":["answer-images/day-17-0801-homework-answers/english-adjective-adverb/page-1.jpg","answer-images/day-17-0801-homework-answers/english-adjective-adverb/page-2.jpg","answer-images/day-17-0801-homework-answers/english-adjective-adverb/page-3.jpg","answer-images/day-17-0801-homework-answers/english-adjective-adverb/page-4.jpg","answer-images/day-17-0801-homework-answers/english-adjective-adverb/page-5.jpg","answer-images/day-17-0801-homework-answers/english-adjective-adverb/page-6.jpg","answer-images/day-17-0801-homework-answers/english-adjective-adverb/page-7.jpg","answer-images/day-17-0801-homework-answers/english-adjective-adverb/page-8.jpg"],"pdf":"answer-documents/day-17-0801-homework-answers/english-adjective-adverb-answers.pdf","source":"第四节 形容词与副词答案解析（用户上传）","label":"第四节 形容词与副词完整课后答案解析","answer_pages":8,"coverage":"选择题1-20、汉译英21-30、英译汉26-30"}};
  const setMap=new Map(Object.entries(answerSets));
  db.questions=db.questions.map((q)=>{
    const meta=setMap.get(String(q.practiceSetId||""));
    if(!meta) return q;
    const tags=Array.from(new Set([...(Array.isArray(q.tags)?q.tags:[]),"课后答案已补齐","官方答案解析","v65"]));
    return {...q,
      answer:"完整课后答案与逐题解析已补齐，请按原题题号查阅。",
      officialAnalysis:`本套课后答案由用户上传的蓝色森林答案资料提供，覆盖：${meta.coverage}。当前题目按教材原页归档，未把整页内多道题强行拆错；请展开下方“完整课后答案解析”或打开PDF，按原题题号核对。`,
      answerStatus:"official_complete_set",
      answerAuthority:"official",
      answerSource:meta.source,
      analysisSource:meta.source,
      auditCategory:"complete_set_official",
      backupAnalysisImages:meta.images.slice(),
      backupAnalysisImageLabel:`${meta.label}（${meta.answer_pages}页，按题号查阅）`,
      analysisPdf:meta.pdf,
      analysisPdfLabel:`打开${meta.label}PDF`,
      tags
    };
  });
  if(Array.isArray(db.completeSetRegistry)){
    db.completeSetRegistry=db.completeSetRegistry.map((set)=>{
      const meta=setMap.get(String(set.id||""));
      if(!meta) return set;
      return {...set,answerStatus:"official_complete_set",answerPageCount:meta.answer_pages,answerDocument:meta.pdf,answerDocumentLabel:`${meta.label}（${meta.answer_pages}页）`,answerCoverage:meta.coverage,answerSource:meta.source};
    });
  }
  db.version='v65-homework-official-answers';
  db.builtAt='2026-08-01T20:55:00+08:00';
  db.generatedAt='2026-08-01T20:55:00+08:00';
  db.homeworkAnswerAudit={version:'v65',setsUpdated:3,answerPages:31,mathLimitAnswerPages:14,mathContinuityAnswerPages:9,englishAnswerPages:8,officialSources:3,uniqueUnits:db.questions.length};
})();
