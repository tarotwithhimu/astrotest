// Jyotish Kundli v18 - Timing tab: dasha timing finder, transit calendar (Sade Sati dates), numerology, downloadable report.
// Timing finder uses this app's dasha grading plus house relevance (BPHS Ch.47 and bhava significations); transit and numerology
// rules are later tradition, not BPHS. Results are indicative windows, not guaranteed events.
const PX_TIMING=[
 ['Career and status',[10,6,11,2],['Sun','Saturn','Mercury']],
 ['Marriage and partnership',[7,2,11],['Venus','Jupiter']],
 ['Wealth and savings',[2,11,5,9],['Jupiter','Venus']],
 ['Education and learning',[4,5,9],['Mercury','Jupiter']],
 ['Home, property and vehicles',[4,11],['Moon','Mars','Venus']],
 ['Foreign travel and residence',[12,9,3],['Rahu','Saturn']],
 ['Spiritual growth and retreat',[9,12,5],['Ketu','Jupiter']]];

function pxTimingWindows(sid,ms,tz,mnk){
 const ctx=dashaCtx(sid),tree=dashaTree(ms,mnk),now=Date.now(),lim=now+15*365.25*864e5,ads=[];
 tree.forEach(d=>d.ads.forEach(a=>{if(a.e>now&&a.s<lim)ads.push({m:LDE[d.L],x:LDE[a.L],s:Math.max(a.s,d.s),e:a.e})}));
 return PX_TIMING.map(([name,H,K])=>{
  const rel=p=>{const P=ctx.P[p];return P.own.filter(h=>H.includes(h)).length+(H.includes(P.h)?1:0)+(K.includes(p)?1:0)};
  const sc=ads.map(a=>{const r=adText(ctx,a.m,a.x);return{...a,g:r.sc,sc:2*rel(a.x)+1.5*rel(a.m)+r.sc,rx:rel(a.x),rm:rel(a.m)}}).filter(a=>a.rx+a.rm>0&&a.sc>=2.5);
  return{name,H,top:sc.sort((a,b)=>b.sc-a.sc).slice(0,4).sort((a,b)=>a.s-b.s)}})}
function pxOpportunityMap(W,tz){
 const now=Date.now(),t1=now+15*365.25*864e5,pos=t=>Math.max(0,Math.min(100,(t-now)/(t1-now)*100)),yr=new Date(now).getUTCFullYear();
 const rows=W.map(w=>`<div class="gx-orow"><span class="gx-l">${tx(w.name)}</span><div class="gx-strip">${w.top.map(a=>{const l=pos(Math.max(a.s,now)),r=pos(a.e);return`<i class="gx-win ${gxGrade(a.g)}" style="left:${l}%;width:${Math.max(.8,r-l)}%" title="${gxT(`${tx(a.m)}–${tx(a.x)} · ${pxDz(Math.max(a.s,now),tz)} → ${pxDz(a.e,tz)} · ${tx(grade(a.g))}`)}"></i>`}).join('')}</div></div>`).join('');
 const ticks=[0,3,6,9,12,15].map(y=>`<span class="gx-tick" style="left:${y/15*100}%;${y==15?'transform:translateX(-100%);white-space:nowrap':y==0?'transform:none':''}">${yr+y}</span>`).join('');
 return`<div class="card"><h2>${tx('Opportunity map (next 15 years)')}</h2><div class="gx-omap">${rows}<div class="gx-orow"><span class="gx-l"></span><div class="gx-ticks gx-ticks2">${ticks}</div></div></div>${gxLegend([{cls:'g',l:tx('Favourable')},{cls:'m',l:tx('Mixed')},{cls:'b',l:tx('Challenging')}])}<small>${tx('Each bar is an antardasha window ranked as most supportive for that area. Hover a bar for its dates.')}</small></div>`}
function pxTimingFinder(sid,ms,tz,mnk){
 const now=Date.now(),W=pxTimingWindows(sid,ms,tz,mnk);
 const out=W.map(w=>`<tr><td><b>${tx(w.name)}</b><br><small>${tx('houses')} ${w.H.join(', ')}</small></td><td class="w">${w.top.length?w.top.map(a=>`${tx(a.m)}–${tx(a.x)}: ${pxDz(Math.max(a.s,now),tz)} → ${pxDz(a.e,tz)} <small>(${tx(grade(a.g))})</small>`).join('<br>'):tx('No strongly matching period in the next 15 years.')}</td></tr>`).join('');
 return pxOpportunityMap(W,tz)+`<div class="card sc"><h2>${tx('Timing finder (next 15 years)')}</h2><table><tr><th>${tx('Area')}</th><th>${tx('Most supportive antardasha windows')}</th></tr>${out}</table>
 <small>${tx('Windows rank antardashas whose lord (and mahadasha lord) rules or occupies the area’s houses or is its natural significator, weighted by this app’s dasha grade. They show when an area is activated, not that an event will occur; transits and the full chart must still be judged.')}</small></div>`}

function pxTransitCalendar(c,la,lo,tz){
 const now=Date.now(),D=864e5,t0=now-10*365.25*D,t1=now+12*365.25*D,step=20*D,P=['Saturn','Jupiter','Rahu'];
 const sgAt=(t,p)=>Math.floor(calc(t/D+2440587.5,la,lo).sid[p]/30);
 const ev=[];let prev=null;
 for(let t=t0;t<=t1;t+=step){const s=calc(t/D+2440587.5,la,lo).sid,cur={};P.forEach(p=>cur[p]=Math.floor(s[p]/30));
  if(prev)P.forEach(p=>{if(cur[p]!==prev[p]){let a=t-step,b=t;for(let i=0;i<7;i++){const m=(a+b)/2;if(sgAt(m,p)===prev[p])a=m;else b=m}ev.push({p,t:b,to:cur[p]})}});prev=cur}
 const mo=c.sg.Moon,hm=s=>pxHfs(mo,s);
 const sat=ev.filter(e=>e.p=='Saturn').sort((a,b)=>a.t-b.t);
 const ss=[];sat.forEach(e=>{const h=hm(e.to);if(h==12)ss.push({s:e.t,e:null});const l=ss[ss.length-1];if(h==3&&l&&!l.e)l.e=e.t});
 const ssTxt=ss.length?ss.map(x=>`${pxDz(x.s,tz)} → ${x.e?pxDz(x.e,tz):tx('beyond the window')}`).join('; '):tx('No Sade Sati begins in this 22-year window (one may already be running; see Predictions).');
const band=(p,cls)=>{const L=ev.filter(x=>x.p==p).sort((a,b)=>a.t-b.t);let s0=sgAt(t0,p),ts=t0,segs=[];L.forEach(x=>{segs.push([ts,x.t,s0]);ts=x.t;s0=x.to});segs.push([ts,t1,s0]);
  const pos=t=>(t-t0)/(t1-t0)*100;return`<div class="gx-orow"><span class="gx-l">${tx(p)}</span><div class="gx-strip gx-strip2">${segs.map(([a,b,s])=>{const h=hm(s);return`<i class="gx-win ${cls(h)}" style="left:${pos(a)}%;width:${(pos(b)-pos(a)).toFixed(2)}%" title="${gxT(`${tx(p)} · ${SG[s]} · ${tx('From Moon')} ${h} · ${pxDz(a,tz)} → ${pxDz(b,tz)}`)}">${h}</i>`}).join('')}<i class="gx-now" style="left:${pos(now)}%"></i></div></div>`};
 const tr=`<div class="gx-omap">${band('Saturn',h=>[12,1,2].includes(h)?'b':[4,8].includes(h)?'m':'n')}${band('Jupiter',h=>PX_GOCH.Jupiter.includes(h)?'g':'n')}</div>${gxLegend([{cls:'g',l:tx('Favourable house from the Moon')},{cls:'m',l:tx('Kantaka / Ashtama')},{cls:'b',l:tx('Sade Sati')},{cls:'n',l:tx('Neutral')}])}`;
  const fut=ev.filter(e=>e.t>now).sort((a,b)=>a.t-b.t).slice(0,22);
 const rows=fut.map(e=>{const h=hm(e.to),good=PX_GOCH[e.p].includes(h);return`<tr><td>${pxDz(e.t,tz)}</td><td>${tx(e.p)}</td><td>${SG[e.to]}</td><td>${h}</td><td>${pxHfs(c.L,e.to)}</td><td>${good?tx('Favourable house from the Moon'):tx('Neutral or testing house from the Moon')}</td></tr>`}).join('');
 return`<div class="card sc"><h2>${tx('Transit calendar: Saturn, Jupiter, Rahu (next sign changes)')}</h2><h3 class="gx-h3">${tx('Saturn and Jupiter from the natal Moon (past 10 and next 12 years)')}</h3>${tr}
 <p class="w"><b>${tx('Sade Sati cycles (Saturn 12th to 2nd from natal Moon)')}:</b> ${ssTxt}</p>
 <table><tr><th>${tx('Date')}</th><th>${tx('Planet')}</th><th>${tx('Enters')}</th><th>${tx('From Moon')}</th><th>${tx('From Lagna')}</th><th>${tx('Traditional view')}</th></tr>${rows}</table>
 <small>${tx('Dates are found by scanning the ephemeris (about a day accurate); retrograde re-entries appear as separate rows. Gochara rules are later tradition, not BPHS.')}</small></div>`}

function pxNumerology(ms,tz,c){
 const d=new Date(ms+tz*36e5),day=d.getUTCDate(),dig=n=>{while(n>9)n=String(n).split('').reduce((s,x)=>s+ +x,0);return n};
 const full=String(day)+String(d.getUTCMonth()+1)+String(d.getUTCFullYear());
 const mul=dig(day),bha=dig(full.split('').reduce((s,x)=>s+ +x,0));
 const R={1:'Sun',2:'Moon',3:'Jupiter',4:'Rahu',5:'Mercury',6:'Venus',7:'Ketu',8:'Saturn',9:'Mars'};
 const N={1:'leadership, independence and ambition',2:'sensitivity, cooperation and imagination',3:'learning, expression and optimism',4:'practicality, systems and unconventional thinking',5:'curiosity, communication and adaptability',6:'care, aesthetics and responsibility to others',7:'analysis, introspection and spiritual search',8:'discipline, endurance and worldly responsibility',9:'courage, drive and a protective spirit'};
 const row=(l,n)=>{const p=R[n],r=PX_REM[p];return`<tr><td><b>${tx(l)}</b></td><td>${n} · ${tx(p)}</td><td class="w">${N[n]}</td><td>${tx(r.day)}, ${r.col}</td></tr>`};
 const lp=c.lord(1),mp=SL[c.sg.Moon];
 return`<div class="card sc"><h2>${tx('Numerology and lucky elements')}</h2><table><tr><th>${tx('Number')}</th><th>${tx('Value · ruler')}</th><th>${tx('Themes')}</th><th>${tx('Lucky day, colour')}</th></tr>
 ${row('Mulank (birth day)',mul)}${row('Bhagyank (full birth date)',bha)}
 <tr><td><b>${tx('Lagna lord')}</b></td><td>${tx(lp)}</td><td class="w">${PX_REM[lp].themes}</td><td>${tx(PX_REM[lp].day)}, ${PX_REM[lp].col}</td></tr>
 <tr><td><b>${tx('Moon-sign lord')}</b></td><td>${tx(mp)}</td><td class="w">${PX_REM[mp].themes}</td><td>${tx(PX_REM[mp].day)}, ${PX_REM[mp].col}</td></tr></table>
 <small>${tx('Numerology uses the Indian (Chaldean-style) planet-number scheme; lucky days and colours follow the planet tables. These are traditional aids, not BPHS.')}</small></div>`}

function pxReportCard(){
 return`<div class="card"><h2>${tx('Consultation report')}</h2><p class="w">${tx('Save the Predictions, Yogas, Remedies and Timing tabs as one printable HTML file (open it and use Print / Save as PDF).')}</p><button type="button" class="px-btn" onclick="pxDownloadReport()">${tx('Download report')}</button></div>`}
function pxDownloadReport(){
 const keep=['dash','predict','yoga','remedy','timing','advanced'],parts=keep.map(k=>{const s=document.querySelector(`#out section[data-t="${k}"]`);return s?s.innerHTML.replace(/<details/g,'<details open').replace(/<button[^>]*px-btn[^>]*>.*?<\/button>/g,''):''}).join('<hr>');
 let gx='';try{[...document.styleSheets].forEach(s=>[...s.cssRules].forEach(r=>{if(r.cssText&&r.cssText.includes('gx-')&&!r.cssText.includes('@media'))gx+=r.cssText}))}catch(x){}
 const css=':root{--gx-good:#2f8f55;--gx-mid:#d09a2a;--gx-bad:#c4503f;--gx-none:#c9c3b8;--text:#222;--muted:#555;--border:#ccc;--accent:#a94d27;--accent-strong:#873817;--surface:#fff;--surface-soft:#f6f0e6}'+gx+'body{font:15px/1.55 Georgia,serif;max-width:900px;margin:24px auto;padding:0 16px;color:#222}table{border-collapse:collapse;width:100%;margin:8px 0}td,th{border:1px solid #ccc;padding:5px 8px;vertical-align:top;text-align:left;font-size:13px}h2{border-bottom:1px solid #aaa;padding-bottom:4px;margin-top:26px}summary{font-weight:700;cursor:pointer}.px-b,.px-rate{border:1px solid #999;border-radius:10px;padding:0 6px;font-size:12px}small{color:#555}@media print{details{break-inside:avoid}}';
 const html=`<!doctype html><html><head><meta charset="utf-8"><title>Jyotish Kundli report</title><style>${css}</style></head><body><h1>Jyotish Kundli report</h1><p><small>Generated ${new Date().toISOString().slice(0,10)} from BPHS-based rules. Traditional guidance only; not a substitute for medical, legal or financial advice.</small></p>${parts}</body></html>`;
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download='jyotish-kundli-report.html';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function timingTab(sid,ms,tz,mnk,la,lo){
 const c=pxCtx(sid);
 return pxTimingFinder(sid,ms,tz,mnk)+pxTransitCalendar(c,la,lo,tz)+pxNumerology(ms,tz,c)+pxReportCard()}
