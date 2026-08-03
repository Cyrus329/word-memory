(function () {
  const data = window.QB_KNOWLEDGE_LINKS;
  if (!data) return;
  const STORE = 'manualKnowledgeLinks';
  const esc = value => String(value || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  const manual = () => JSON.parse(localStorage.getItem(STORE) || '{}');
  const selectedIds = questionId => manual()[questionId] || (data.links[questionId] ? [data.links[questionId].knowledgeId] : []);
  function saveSelection(questionId, ids) { const all = manual(); all[questionId] = ids; localStorage.setItem(STORE, JSON.stringify(all)); }
  function render() {
    const detail = document.querySelector('.question-detail[data-question-id]');
    if (!detail || detail.querySelector('.knowledge-link-panel')) return;
    const questionId = detail.dataset.questionId;
    const link = data.links[questionId];
    if (!link) return;
    const ids = selectedIds(questionId);
    const cards = ids.map(id => data.cards[id]).filter(Boolean);
    const candidates = (link.candidates || []).map(x => data.cards[x.knowledgeId]).filter(Boolean);
    const panel = document.createElement('section');
    panel.className = 'knowledge-link-panel';
    panel.innerHTML = `<div class="knowledge-link-head"><div><small>对应课堂知识点 · ${esc(link.confidenceLabel)}</small><h3>${cards.map(x=>esc(x.title)).join(' + ')}</h3></div><button type="button" class="knowledge-toggle">展开笔记</button></div><div class="knowledge-body" hidden>${cards.map(card=>`<article><p>${esc(card.oneLine)}</p><h4>课堂重点</h4><ul>${card.core.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>`).join('')}<h4>候选知识点</h4><div class="knowledge-candidates">${candidates.map(card=>`<label><input type="checkbox" value="${esc(card.id)}" ${ids.includes(card.id)?'checked':''}>${esc(card.title)}</label>`).join('')}</div><button type="button" class="knowledge-save">保存关联校正</button><p class="knowledge-save-note"></p></div>`;
    panel.querySelector('.knowledge-toggle').onclick = e => { const body=panel.querySelector('.knowledge-body'); body.hidden=!body.hidden; e.currentTarget.textContent=body.hidden?'展开笔记':'收起笔记'; };
    panel.querySelector('.knowledge-save').onclick = () => { const chosen=[...panel.querySelectorAll('.knowledge-candidates input:checked')].map(x=>x.value); saveSelection(questionId, chosen); panel.querySelector('.knowledge-save-note').textContent='关联校正已保存，下次仍然有效。'; };
    const actionDock = detail.querySelector('.detail-action-dock');
    if (actionDock) actionDock.insertAdjacentElement('afterend', panel);
    else (detail.querySelector('.stem-box') || detail.querySelector('.detail-header')).insertAdjacentElement('afterend', panel);
  }
  function addHealthButton() {
    if (document.querySelector('#knowledgeHealthButton')) return;
    const host = document.querySelector('.top-actions') || document.querySelector('.topbar');
    if (!host) return;
    const button=document.createElement('button'); button.id='knowledgeHealthButton'; button.className='icon-button'; button.textContent='数据体检';
    button.onclick=()=>{const a=data.anomalies;const report={generatedAt:new Date().toISOString(),missingAnswer:a.missingAnswer.length,missingStem:a.missingStem.length,missingOptions:a.missingOptions.length,duplicates:a.duplicates.length,manualKnowledgeLinks:manual()};const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='题库数据体检报告.json';link.click();URL.revokeObjectURL(link.href);button.textContent='导出体检报告';};host.appendChild(button);
  }
  new MutationObserver(()=>{render();addHealthButton();}).observe(document.body,{childList:true,subtree:true});
  render(); addHealthButton();
})();
