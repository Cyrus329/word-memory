(function(){
  const data = window.ENGLISH_FOLDER_LIBRARY || [];
  const sourceBox = document.querySelector('#folderSourceList');
  const contentBox = document.querySelector('#folderContent');
  if (!sourceBox || !contentBox || !data.length) return;
  let currentFolder = data[0].name;
  let currentSub = data[0].children[0]?.name || '';
  let query = '';
  let visibleLimit = 30;
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function folder(){return data.find(x=>x.name===currentFolder)||data[0];}
  function sub(){const f=folder();return f.children.find(x=>x.name===currentSub)||f.children[0];}
  function allWords(){return data.flatMap(f=>f.children.flatMap(s=>s.words.map(w=>({...w,folder:f.name,sub:s.name}))));}
  function cleanNote(note){
    const n = String(note || '').trim();
    if(!n) return '';
    if(/^来源[:：]/.test(n)) return '';
    if(n.includes('按 “构词法/前缀” 背')) return '';
    return n;
  }
  function renderSources(){
    sourceBox.innerHTML=data.map(f=>`<button class="folder-source-btn ${f.name===currentFolder?'active':''}" data-folder-source="${esc(f.name)}"><span class="folder-icon">📁</span><span><strong>${esc(f.name)}</strong><span>${f.children.length} 组 · ${f.count} 条</span></span></button>`).join('');
  }
  function getWords(){
    const f=folder();
    if(!f) return [];
    if(!currentSub || !f.children.some(s=>s.name===currentSub)) currentSub=f.children[0]?.name||'';
    const selected=sub();
    let words=(query?allWords():selected.words.map(w=>({...w,folder:f.name,sub:selected.name})));
    if(query){const q=query.toLowerCase(); words=words.filter(w=>[w.term,w.meaning,w.phrase,w.note,w.tag,w.folder,w.sub].join(' ').toLowerCase().includes(q));}
    return words;
  }
  function splitMeaning(text){
    const raw = String(text || '').trim();
    const posRe = /\b(n|v|adj|adv|prep|pron|conj|num|art|aux|modal)\.\s*/gi;
    const found = [];
    let match;
    while((match = posRe.exec(raw))){
      const value = match[0].trim();
      if(!found.some(x => x.toLowerCase() === value.toLowerCase())) found.push(value);
    }
    let meaning = raw.replace(posRe, '').replace(/\s+/g,' ').trim();
    meaning = meaning.replace(/^[:：;；,.，。\s]+/, '').trim();
    return { pos: found.join(' / '), meaning: meaning || raw };
  }
  function card(w, idx){
    const note = cleanNote(w.note);
    const parsed = splitMeaning(w.meaning);
    const phrase = String(w.phrase || '').trim();
    const hasPhrase = Boolean(phrase || note);
    const tag = w.sub || w.tag || (w.folder === 'Word List' ? 'Word List' : w.folder);
    return `<article class="folder-word-card folder-word-card-compact-v20">
      <div class="folder-word-topline">
        <div class="folder-word-main">
          <div class="folder-word-term">${esc(w.term)}</div>
          <div class="folder-word-chip">${esc(tag)}</div>
        </div>
        <div class="folder-pron-actions">
          <button class="folder-pron-btn" data-pron-term="${esc(w.term)}" data-pron-accent="us" type="button">美</button>
          <button class="folder-pron-btn" data-pron-term="${esc(w.term)}" data-pron-accent="uk" type="button">英</button>
        </div>
      </div>
      <div class="folder-word-one-line">
        ${parsed.pos?`<span class="folder-word-pos">${esc(parsed.pos)}</span>`:''}
        <span class="folder-word-meaning-text">${esc(parsed.meaning)}</span>
      </div>
      ${hasPhrase?`<div class="folder-word-phrase-line">${phrase?esc(phrase):''}${phrase&&note?'；':''}${note?esc(note):''}</div>`:''}
    </article>`;
  }
  function renderContent(){
    const f=folder(); if(!f)return;
    if(!currentSub || !f.children.some(s=>s.name===currentSub)) currentSub=f.children[0]?.name||'';
    const words=getWords();
    const visible=words.slice(0, visibleLimit);
    const selected=sub();
    contentBox.innerHTML=`
      <div class="folder-search-row"><input id="folderSearchInput" value="${esc(query)}" placeholder="搜索单词 / 中文 / 搭配"><span>${words.length} 条</span></div>
      <div class="folder-subgrid">${f.children.map((s,i)=>`<button class="folder-sub-btn ${s.name===currentSub?'active':''}" data-folder-sub="${esc(s.name)}"><b>${esc(s.name)}</b><span>${s.count} 条</span></button>`).join('')}</div>
      <div class="folder-lite-home folder-lite-home-v18">
        <div><strong>${esc(query ? '搜索结果' : selected.name)}</strong><p>紧凑显示前 30 个；往下点“再显示 30 个”。</p></div>
        <span class="folder-count-pill">${visible.length}/${words.length}</span>
      </div>
      ${words.length ? `<div class="folder-word-grid folder-word-grid-lite">${visible.map((w,i)=>card(w,i)).join('')}</div>` : '<div class="folder-empty">没有匹配内容</div>'}
      ${words.length > visible.length ? `<div class="light-load-more"><button class="secondary-button" data-folder-action="more" type="button">再显示 30 个</button><p>已显示 ${visible.length} / ${words.length} 个。找具体单词建议直接搜索。</p></div>`:''}`;
  }
  function render(){renderSources();renderContent();}
  document.addEventListener('click',e=>{
    const p=e.target.closest('[data-pron-term]');
    if(p){
      if (typeof window.speakTerm === 'function') {
        window.speakTerm(p.dataset.pronTerm, { accent: p.dataset.pronAccent || 'us' });
      }
      return;
    }
    const f=e.target.closest('[data-folder-source]');
    if(f){currentFolder=f.dataset.folderSource;currentSub='';query='';visibleLimit=30;render();return;}
    const s=e.target.closest('[data-folder-sub]');
    if(s){currentSub=s.dataset.folderSub;query='';visibleLimit=30;renderContent();return;}
    const a=e.target.closest('[data-folder-action]');
    if(a){
      if(a.dataset.folderAction==='more'){visibleLimit += 30;renderContent();return;}
    }
  });
  document.addEventListener('input',e=>{if(e.target.id==='folderSearchInput'){query=e.target.value;visibleLimit=30;renderContent();}});
  render();
})();
