/* v69 乱码安全修复：撤回 v68 未经可靠校对的 OCR 正文，保留逐题顺序与原题来源。 */
(function(){
  const db=globalThis.BUNDLED_QUESTION_BANK;
  if(!db||!Array.isArray(db.questions)) return;
  const affectedSetIds=new Set();
  let rejected=0;
  db.questions=db.questions.map((q)=>{
    if(!/^V68-/.test(String(q.id||''))) return q;
    rejected+=1;
    if(q.practiceSetId) affectedSetIds.add(String(q.practiceSetId));
    const pageImage=String(q.sourcePageImage||'').trim();
    const cropImage=String(q.sourceCropImage||'').trim();
    const safeImages=pageImage?[pageImage]:(cropImage?[cropImage]:(Array.isArray(q.images)?q.images.filter(Boolean):[]));
    return {
      ...q,
      stem:'当前仅保留原题图，尚未可靠转写为纯文字。',
      textStem:'当前仅保留原题图，尚未可靠转写为纯文字。',
      options:[],
      textOptions:[],
      images:safeImages,
      backupQuestionCrop:cropImage||'',
      forceImageTextFallback:true,
      textStatus:'pending_manual_transcription',
      transcriptionConfidence:'rejected_unreliable_ocr',
      sourceRecognition:'source_image_verified_text_pending',
      answerStatus:q.answerStatus||'pending_match',
      invalidOcrRemoved:true,
      invalidOcrVersion:'v68',
      tags:Array.from(new Set([...(Array.isArray(q.tags)?q.tags:[]),'v69乱码撤回','待人工逐题转写']))
    };
  });
  if(Array.isArray(db.completeSetRegistry)){
    db.completeSetRegistry=db.completeSetRegistry.map((set)=>{
      if(!affectedSetIds.has(String(set.id||''))) return set;
      return {
        ...set,
        pureTextReady:false,
        textAuditStatus:'pending_manual_transcription',
        textAuditLabel:'OCR乱码已撤回·待人工逐题转写',
        archiveNote:'v68 的低质量 OCR 已全部撤回。当前按逐题顺序保留原题页，不再把乱码当作纯文字正文。',
        v69SafetyFixed:true
      };
    });
  }
  db.version='v69-garbled-text-safety-fix';
  db.builtAt='2026-08-03T09:18:00+08:00';
  db.generatedAt=db.builtAt;
  db.v69GarbledTextSafetyAudit={
    baseVersion:'v68-complete-question-text-rebuild',
    rejectedUnreliableOcrRecords:rejected,
    affectedCompleteSets:affectedSetIds.size,
    replacementMode:'source-page-image-with-explicit-pending-transcription',
    noOcrDraftShownAsQuestionText:true
  };
})();
