
(function(){
  const data = window.ENGLISH_FOLDER_LIBRARY || [];
  const sourceBox = document.querySelector('#folderSourceList');
  const contentBox = document.querySelector('#folderContent');
  if (!sourceBox || !contentBox || !data.length) return;
  let currentFolder = data[0].name;
  let currentSub = data[0].children[0]?.name || '';
  let query = '';
  let opened = false;
  let visibleLimit = 30;
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function folder(){return data.find(x=>x.name===currentFolder)||data[0];}
  function sub(){const f=folder();return f.children.find(x=>x.name===currentSub)||f.children[0];}
  function allWords(){return data.flatMap(f=>f.children.flatMap(s=>s.words.map(w=>({...w,folder:f.name,sub:s.name}))));}
  function renderSources(){sourceBox.innerHTML=data.map(f=>`<button class="folder-source-btn ${f.name===currentFolder?'active':''}" data-folder-source="${esc(f.name)}"><span class="folder-icon">📁</span><span><strong>${esc(f.name)}</strong><span>${f.children.length} 组 · ${f.count} 条</span></span></button>`).join('');}
  function getWords(){
    const f=folder();
    if(!f) return [];
    if(!currentSub || !f.children.some(s=>s.name===currentSub)) currentSub=f.children[0]?.name||'';
    const selected=sub();
    let words=(query?allWords():selected.words.map(w=>({...w,folder:f.name,sub:selected.name})));
    if(query){const q=query.toLowerCase(); words=words.filter(w=>[w.term,w.meaning,w.phrase,w.note,w.tag,w.folder,w.sub].join(' ').toLowerCase().includes(q));}
    return words;
  }
  function renderContent(){
    const f=folder(); if(!f)return;
    if(!currentSub || !f.children.some(s=>s.name===currentSub)) currentSub=f.children[0]?.name||'';
    const words=getWords();
    const visible=opened ? words.slice(0, visibleLimit) : [];
    const selected=sub();
    contentBox.innerHTML=`
      <div class="folder-search-row"><input id="folderSearchInput" value="${esc(query)}" placeholder="搜索后只显示匹配结果"><span>${words.length} 条</span></div>
      <div class="folder-subgrid">${f.children.map((s,i)=>`<button class="folder-sub-btn ${s.name===currentSub?'active':''}" data-folder-sub="${esc(s.name)}"><b>${esc(s.name)}</b><span>第 ${i+1} 组 · ${s.count} 条</span></button>`).join('')}</div>
      <div class="folder-lite-home">
        <strong>${esc(query ? '搜索结果' : selected.name)}</strong>
        <p>${words.length} 条单词。为了手机不卡，默认不一次性展开；点下面按钮只看前 30 个。</p>
        <button class="primary-button" data-folder-action="open-list" type="button">${opened ? '刷新当前列表' : '打开本组单词'}</button>
      </div>
      ${opened && words.length ? `<div class="folder-word-grid folder-word-grid-lite">${visible.map(w=>`<article class="folder-word-card"><div class="folder-word-term">${esc(w.term)}</div><div class="folder-word-meaning">${esc(w.meaning)}</div>${w.phrase?`<div class="folder-word-meta">短语：${esc(w.phrase)}</div>`:''}${w.note?`<div class="folder-word-meta">备注：${esc(w.note)}</div>`:''}<div class="folder-word-meta">${esc(w.folder)} / ${esc(w.sub)} · ${esc(w.tag||'')}</div></article>`).join('')}</div>`:''}
      ${opened && words.length > visible.length ? `<div class="light-load-more"><button class="secondary-button" data-folder-action="more" type="button">再显示 30 个</button><p>已显示 ${visible.length} / ${words.length} 个。找具体单词建议直接搜索。</p></div>`:''}
      ${opened && !words.length ? '<div class="folder-empty">没有匹配内容</div>' : ''}`;
  }
  function render(){renderSources();renderContent();}
  document.addEventListener('click',e=>{
    const f=e.target.closest('[data-folder-source]');
    if(f){currentFolder=f.dataset.folderSource;currentSub='';query='';opened=false;visibleLimit=30;render();return;}
    const s=e.target.closest('[data-folder-sub]');
    if(s){currentSub=s.dataset.folderSub;query='';opened=false;visibleLimit=30;renderContent();return;}
    const a=e.target.closest('[data-folder-action]');
    if(a){
      if(a.dataset.folderAction==='open-list'){opened=true;visibleLimit=30;renderContent();return;}
      if(a.dataset.folderAction==='more'){opened=true;visibleLimit += 30;renderContent();return;}
    }
  });
  document.addEventListener('input',e=>{if(e.target.id==='folderSearchInput'){query=e.target.value;opened=Boolean(query);visibleLimit=30;renderContent();}});
  render();
})();
