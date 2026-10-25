// Jyotish Kundli v18 - UX layer: tab icons, mobile bottom bar and menu, jump chips, expand/collapse, filters,
// click-to-copy mantras, copy summary, toasts, back-to-top, reading progress, keyboard and URL-hash navigation.
// It wraps run(), setTab() and buildTabs() instead of editing them, so every language and tab change is re-enhanced.
const UX_ICON={
 sum:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 dash:'<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="11" width="8" height="10" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/>',
 analysis:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
 predict:'<path d="M12 3l2.2 5.6L20 11l-5.8 2.4L12 19l-2.2-5.6L4 11l5.8-2.4z"/>',
 yoga:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
 remedy:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>',
 timing:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 advanced:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
 bphs:'<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10"/>',
 chart:'<circle cx="12" cy="12" r="9"/><path d="M12 3v9h9"/>',
 dasha:'<path d="M7 3h10M7 21h10M8 3v3c0 3 8 3 8 6s-8 3-8 6v3"/>',
 chakra:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>',
 more:'<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>',
 match:'<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1"/><path d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/>',
 data:'<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.700 3.600 3 8 3s8-1.300 8-3V6M4 12c0 1.700 3.600 3 8 3s8-1.300 8-3"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',print:'<path d="M7 9V3h10v6M7 17H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2"/><path d="M7 14h10v7H7z"/>',
 up:'<path d="M12 19V5M6 11l6-6 6 6"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>'};
const uxIcon=k=>`<svg class="ux-i" viewBox="0 0 24 24" aria-hidden="true">${UX_ICON[k]||''}</svg>`;
const uxQ=(s,r=document)=>[...r.querySelectorAll(s)];

// ---------- toast ----------
function uxToast(msg){let t=document.getElementById('ux-toast');if(!t){t=document.createElement('div');t.id='ux-toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.body.appendChild(t)}
 t.textContent=msg;t.classList.add('on');clearTimeout(uxToast.h);uxToast.h=setTimeout(()=>t.classList.remove('on'),2200)}
function uxCopy(text,msg){const done=()=>uxToast(msg||tx('Copied'));
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done,()=>{uxFallbackCopy(text);done()});else{uxFallbackCopy(text);done()}}
function uxFallbackCopy(t){const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove()}

// ---------- tabs: icons, arrows, keyboard ----------
function uxTabIcons(){const tb=document.getElementById('tb');if(!tb)return;
 uxQ('[data-k]',tb).forEach(b=>{if(!b.querySelector('.ux-i'))b.insertAdjacentHTML('afterbegin',uxIcon(b.dataset.k))});
 const pr=tb.querySelector('.pr-btn');if(pr&&!pr.querySelector('.ux-i')){pr.innerHTML=uxIcon('print')+`<span>${tx('Print / save PDF')}</span>`}
 tb.setAttribute('tabindex','-1');
 if(!tb.dataset.uxKeys){tb.dataset.uxKeys='1';tb.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;
  const ks=TABS.map(t=>t[0]),i=ks.indexOf(TAB),n=e.key==='ArrowRight'?Math.min(ks.length-1,i+1):Math.max(0,i-1);if(n!==i){e.preventDefault();setTab(ks[n]);const nb=tb.querySelector('[aria-selected="true"]');if(nb)nb.focus()}})}
 const sel=tb.querySelector('[aria-selected="true"]');tb.querySelectorAll('[data-k]').forEach(b=>b.tabIndex=b.getAttribute('aria-selected')==='true'?0:-1)}

// ---------- mobile bottom bar + menu sheet ----------
function uxBottomBar(){let bar=document.getElementById('ux-bottom');
 const main=['sum','dash','predict','remedy'],lab=k=>tx((TABS.find(t=>t[0]==k)||[0,k])[1]);
 if(!bar){bar=document.createElement('nav');bar.id='ux-bottom';bar.setAttribute('aria-label','Main');document.body.appendChild(bar);
  const sheet=document.createElement('div');sheet.id='ux-sheet';sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');sheet.hidden=true;document.body.appendChild(sheet);
  sheet.addEventListener('click',e=>{if(e.target===sheet)uxSheet(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape')uxSheet(false)})}
 bar.innerHTML=main.map(k=>`<button type="button" data-k="${k}" class="${TAB==k?'on':''}">${uxIcon(k)}<span>${lab(k)}</span></button>`).join('')+`<button type="button" data-k="menu" class="${main.includes(TAB)?'':'on'}">${uxIcon('menu')}<span>${tx('Menu')}</span></button>`;
 uxQ('button',bar).forEach(b=>b.onclick=()=>b.dataset.k=='menu'?uxSheet(true):setTab(b.dataset.k));
 const sheet=document.getElementById('ux-sheet');
 sheet.innerHTML=`<div class="ux-panel"><div class="ux-ph"><b>${tx('Menu')}</b><button type="button" class="ux-x" aria-label="${tx('Close')}">${uxIcon('close')}</button></div><div class="ux-grid">${TABS.map(t=>`<button type="button" data-k="${t[0]}" class="${TAB==t[0]?'on':''}">${uxIcon(t[0])}<span>${tx(t[1])}</span></button>`).join('')}<button type="button" data-k="print">${uxIcon('print')}<span>${tx('Print / save PDF')}</span></button></div></div>`;
 uxQ('[data-k]',sheet).forEach(b=>b.onclick=()=>{uxSheet(false);b.dataset.k=='print'?window.print():setTab(b.dataset.k)});sheet.querySelector('.ux-x').onclick=()=>uxSheet(false)}
function uxSheet(on){const s=document.getElementById('ux-sheet');if(!s)return;s.hidden=!on;document.body.classList.toggle('ux-lock',on)}

// ---------- per-section toolbar: jump chips, expand/collapse, filters ----------
function uxSectionBars(){
 uxQ('#out > section[data-t]').forEach(sec=>{const t=sec.dataset.t;if(sec.querySelector(':scope > .ux-bar'))return;
  const cards=uxQ(':scope > .card, :scope > div > .card',sec).filter(c=>c.querySelector('h2'));const det=uxQ('details',sec).filter(d=>!d.classList.contains('adv')&&!d.classList.contains('av-shodhana'));
  if(cards.length<3&&det.length<3)return;
  cards.forEach((c,i)=>{c.id=c.id||`ux-${t}-${i}`;c.classList.add('ux-reveal');c.style.setProperty('--ri',Math.min(i,8))});
  const chips=cards.length>=3?cards.map(c=>{const h=c.querySelector('h2').textContent.trim().replace(/\s*\(.*$/,'').replace(/\s*[·,].*$/,'');return`<button type="button" class="ux-chip" data-go="${c.id}">${h.length>30?h.slice(0,28)+'…':h}</button>`}).join(''):'';
  let tools='';if(det.length>=3)tools=`<span class="ux-tools"><button type="button" class="ux-chip ux-tool" data-act="open">${tx('Expand all')}</button><button type="button" class="ux-chip ux-tool" data-act="close">${tx('Collapse all')}</button></span>`;
  let filt='';if(t=='yoga')filt=`<span class="ux-filter" data-for="yoga">${['all','good','mixed','bad'].map((k,i)=>`<button type="button" class="ux-chip${i?'':' on'}" data-f="${k}">${tx(k=='all'?'All':k=='good'?'Good':k=='mixed'?'Mixed':'Challenging')}</button>`).join('')}</span>`;
  const bar=document.createElement('div');bar.className='ux-bar';bar.innerHTML=`<div class="ux-chips" role="navigation">${chips}</div>${tools}${filt}`;sec.prepend(bar);
  bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
   if(b.dataset.go){const el=document.getElementById(b.dataset.go);if(el){const y=el.getBoundingClientRect().top+scrollY-((document.querySelector('.top')||{offsetHeight:0}).offsetHeight+(document.getElementById('tb')||{offsetHeight:0}).offsetHeight+8);scrollTo({top:y,behavior:'smooth'})}}
   else if(b.dataset.act){uxQ('details',sec).forEach(d=>{if(!d.classList.contains('adv'))d.open=b.dataset.act=='open'})}
   else if(b.dataset.f){const f=b.dataset.f;uxQ('.ux-filter .ux-chip',bar).forEach(x=>x.classList.toggle('on',x===b));
    uxQ('details.px-y',sec).forEach(d=>{const k=d.querySelector('.px-b');const kind=k?(k.classList.contains('px-good')?'good':k.classList.contains('px-bad')?'bad':'mixed'):'mixed';d.style.display=f=='all'||kind==f?'':'none'});
    uxQ('h3',sec).forEach(h=>{let n=h.nextElementSibling,any=false;while(n&&n.tagName!=='H3'&&n.tagName!=='SMALL'){if(n.matches('details')&&n.style.display!=='none')any=true;n=n.nextElementSibling}h.style.display=(f=='all'||any)?'':'none'})}})})}

// rule filter (supportive / caution) inside the house-by-house card
function uxRuleFilter(){uxQ('#out .card').forEach(card=>{const h=card.querySelector('h2');if(!h||card.querySelector('.ux-rfilter')||!card.querySelector('details.px-a p .px-b'))return;
 const p=card.querySelector('p.w');const bar=document.createElement('div');bar.className='ux-rfilter';bar.innerHTML=['all','good','bad'].map((k,i)=>`<button type="button" class="ux-chip${i?'':' on'}" data-f="${k}">${tx(k=='all'?'All':k=='good'?'Supportive':'Caution')}</button>`).join('');
 h.insertAdjacentElement('afterend',bar);bar.onclick=e=>{const b=e.target.closest('button');if(!b)return;const f=b.dataset.f;uxQ('button',bar).forEach(x=>x.classList.toggle('on',x===b));
  uxQ('details.px-a',card).forEach(d=>{let any=false;uxQ('p',d).forEach(pp=>{const bd=pp.querySelector('.px-b');if(!bd)return;const show=f=='all'||bd.classList.contains('px-'+f);pp.style.display=show?'':'none';if(show)any=true});d.style.display=any?'':'none';if(f!=='all'&&any)d.open=true})}})}

// ---------- click to copy mantras, copy summary ----------
function uxCopyables(){uxQ('#out td').forEach(td=>{if(td.dataset.ux)return;const t=td.textContent.trim();if(/^ॐ\s/.test(t)){td.dataset.ux='1';td.classList.add('ux-copy');td.title=tx('Click to copy');td.tabIndex=0;
  const go=()=>uxCopy(t,tx('Mantra copied'));td.addEventListener('click',go);td.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})}});
 const hero=document.querySelector('#out .gx-hero');if(hero&&!hero.querySelector('.ux-share')){const b=document.createElement('button');b.type='button';b.className='ux-share ux-chip';b.textContent=tx('Copy summary');
  b.onclick=()=>{const tiles=uxQ('.gx-tile',hero).map(x=>`${x.querySelector('small').textContent}: ${x.querySelector('b').textContent}${x.querySelector('em')?' ('+x.querySelector('em').textContent+')':''}`);
   const facts=uxQ('.gx-facts li',hero).map(li=>`${li.children[0].textContent}: ${li.children[1].textContent}`);const txt=`Jyotish Kundli\n${tiles.join('\n')}\n${facts.join('\n')}`;
   if(navigator.share){navigator.share({title:'Jyotish Kundli',text:txt}).catch(()=>uxCopy(txt,tx('Summary copied')))}else uxCopy(txt,tx('Summary copied'))};hero.querySelector('h2').insertAdjacentElement('afterend',b)}}

// ---------- back to top + reading progress ----------
function uxFloaters(){if(document.getElementById('ux-top'))return;
 const b=document.createElement('button');b.id='ux-top';b.type='button';b.setAttribute('aria-label',tx('Back to top'));b.innerHTML=uxIcon('up');b.onclick=()=>scrollTo({top:0,behavior:'smooth'});document.body.appendChild(b);
 const p=document.createElement('div');p.id='ux-progress';document.body.appendChild(p);
 let tick=false;const upd=()=>{tick=false;const h=document.documentElement.scrollHeight-innerHeight,y=scrollY;p.style.transform=`scaleX(${h>0?Math.min(1,y/h):0})`;b.classList.toggle('on',y>700)};
 addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd()}

// ---------- orchestration ----------
function uxEnhance(){try{uxTabIcons();uxBottomBar();uxSectionBars();uxRuleFilter();uxCopyables();uxFloaters();uxSyncHash()}catch(e){console.error('ux',e)}}
function uxSyncHash(){try{if(location.hash!=='#tab='+TAB)history.replaceState(null,'','#tab='+TAB)}catch(e){}}
const uxSt={first:true};
(function(){
 const _run=run;run=function(){const r=_run.apply(this,arguments);uxEnhance();return r};
 const _st=setTab;setTab=function(t){const r=_st.apply(this,arguments);uxEnhance();document.body.classList.remove('ux-fade');void document.body.offsetWidth;document.body.classList.add('ux-fade');
  if(innerWidth<=760&&!uxSt.first){const out=document.getElementById('out');if(out){const hdr=(document.querySelector('.top')||{offsetHeight:0}).offsetHeight;scrollTo({top:Math.max(0,out.getBoundingClientRect().top+scrollY-hdr-8),behavior:'smooth'})}}uxSt.first=false;return r};
 const _bt=buildTabs;buildTabs=function(){const r=_bt.apply(this,arguments);uxTabIcons();return r};
 addEventListener('hashchange',()=>{const m=/#tab=(\w+)/.exec(location.hash);if(m&&m[1]!==TAB&&TABS.some(t=>t[0]==m[1]))setTab(m[1])});
 const m=/#tab=(\w+)/.exec(location.hash);if(m&&TABS.some(t=>t[0]==m[1])&&m[1]!==TAB)setTab(m[1]);else uxEnhance();
 uxSt.first=false;
})();
