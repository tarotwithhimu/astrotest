// Jyotish Kundli v18 - graphical views (inline SVG / CSS, theme aware, no libraries).
// Every label goes through tx() so the charts follow the selected language.
const GX_PLC={Sun:'#d9822b',Moon:'#aab7c8',Mars:'#c4503f',Mercury:'#3f9b6b',Jupiter:'#d1a824',Venus:'#e08fb5',Saturn:'#4f64a0',Rahu:'#6b5f78',Ketu:'#8a6f55'};
const gxBand=p=>p>=62?'g':p>=42?'m':'b';
const gxGrade=sc=>sc>=.75?'g':sc>-.75?'m':'b';
const gxT=s=>String(s).replace(/"/g,'&quot;');

function gxBars(rows,o={}){
 const max=o.max||100,marks=o.marks||[];
 return`<div class="gx-bars${o.wide?' gx-wide':''}">${rows.map((r,i)=>`<div class="gx-row" title="${gxT(r.title||'')}"><span class="gx-l">${r.l}</span><div class="gx-track">${marks.map(m=>`<u class="gx-mark" style="left:${m/max*100}%"></u>`).join('')}<i class="gx-fill ${r.cls||'m'}" style="--w:${Math.max(1,Math.min(100,r.v/max*100)).toFixed(1)}%;--d:${i*55}ms"></i></div><b class="gx-v">${r.vt!==undefined?r.vt:r.v}</b></div>`).join('')}</div>`}

function gxRadar(vals,labels,max,tt){
 const n=vals.length,C=180,R=118,pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/n;return[C+r*Math.cos(a),C+r*Math.sin(a)]};
 const rings=[.25,.5,.75,1].map(f=>`<polygon class="gx-ring" points="${vals.map((_,i)=>pt(i,R*f).map(v=>v.toFixed(1)).join(',')).join(' ')}"/>`).join('');
 const axes=vals.map((_,i)=>{const p=pt(i,R);return`<line class="gx-axis" x1="${C}" y1="${C}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}"/>`}).join('');
 const poly=vals.map((v,i)=>pt(i,R*Math.max(.04,v/max)).map(x=>x.toFixed(1)).join(',')).join(' ');
 const dots=vals.map((v,i)=>{const p=pt(i,R*Math.max(.04,v/max));return`<circle class="gx-dot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4"><title>${gxT(tt?tt[i]:labels[i])}</title></circle>`}).join('');
 const lab=labels.map((l,i)=>{const p=pt(i,R+18),a=p[0]<C-8?'end':p[0]>C+8?'start':'middle';return`<text class="gx-t" x="${p[0].toFixed(1)}" y="${(p[1]+4).toFixed(1)}" text-anchor="${a}">${l}</text>`}).join('');
 return`<svg class="gx-radar" viewBox="0 0 360 360" role="img">${rings}${axes}<polygon class="gx-poly" points="${poly}"/>${dots}${lab}</svg>`}

function gxDonut(parts,centre,sub){
 const tot=parts.reduce((a,p)=>a+p.v,0)||1,r=50,L=2*Math.PI*r;let off=0;
 const arcs=parts.filter(p=>p.v>0).map(p=>{const len=p.v/tot*L,s=`<circle class="gx-arc ${p.cls}" cx="70" cy="70" r="${r}" stroke-dasharray="${len.toFixed(2)} ${(L-len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}"><title>${gxT(p.l||'')}${p.l?': ':''}${p.v}</title></circle>`;off+=len;return s}).join('');
 return`<svg class="gx-donut" viewBox="0 0 140 140" role="img"><circle class="gx-arc-bg" cx="70" cy="70" r="${r}"/>${arcs}<text class="gx-big" x="70" y="72" text-anchor="middle">${centre}</text><text class="gx-sub" x="70" y="90" text-anchor="middle">${sub||''}</text></svg>`}

function gxLegend(items){return`<div class="gx-legend">${items.map(i=>`<span><i class="gx-sw ${i.cls}"></i>${i.l}</span>`).join('')}</div>`}

// ---- planet strength + life areas ----
function gxStrengthBars(c){
 const rows=PX_P7.map(p=>{const s=c.strength(p);return{l:tx(p),v:s.pct,cls:gxBand(s.pct),title:`${tx(p)}: ${s.pct} (${tx(s.band)})`}});
 return`<div class="card"><h2>${tx('Planet strength')}</h2>${gxBars(rows,{max:100,marks:[42,62]})}${gxLegend([{cls:'g',l:tx('Strong')},{cls:'m',l:tx('Moderate')},{cls:'b',l:tx('Weak')}])}</div>`}
function gxAreaRadarCard(c){
 const A=pxLifeAreas(c),short=['1','2','3','4','5','6','7','8','9','10','11','12'];
 const vals=A.map(a=>a.b.idx+.0),labels=A.map(a=>`${a.h}`),tt=A.map(a=>`${tx(a.t)}: ${tx(a.b.band)}`);
 const rows=A.map(a=>({l:`${a.h}. ${tx(a.t.split(',')[0].split(' and ')[0])}`,v:a.b.idx+1,vt:tx(a.b.band),cls:a.b.idx>=3?'g':a.b.idx>=2?'m':'b',title:`${tx(a.t)}: ${tx(a.b.band)}`}));
 return`<div class="card"><h2>${tx('Life-area radar')}</h2><div class="gx-two">${gxRadar(vals,labels,4,tt)}<div>${gxBars(rows,{max:5,wide:true})}</div></div><small>${tx('Numbers on the radar are house numbers; the further a point from the centre, the more supportive the area.')}</small></div>`}

// ---- dasha timeline ----
function gxDashaTimeline(sid,ms,tz,mnk){
 const ctx=dashaCtx(sid),tree=dashaTree(ms,mnk),now=Date.now(),t0=ms,t1=tree[tree.length-1].e,span=t1-t0,pos=t=>Math.max(0,Math.min(100,(t-t0)/span*100));
 const seg=(s,e,pl,cls,ti,w)=>`<div class="gx-seg ${cls}" style="left:${pos(s)}%;width:${(pos(e)-pos(s)).toFixed(2)}%" title="${gxT(ti)}">${(pos(e)-pos(s))>(w||7)?tx(pl):''}</div>`;
 const md=tree.map(d=>{const p=LDE[d.L],g=lordScore(ctx,p).sc;return seg(d.s,d.e,p,gxGrade(g),`${tx(p)} · ${pxDz(d.s,tz)} → ${pxDz(d.e,tz)} · ${tx(grade(g))}`)}).join('');
 const ticks=[];for(let a=0;a<=110;a+=10){const t=ms+a*YRS;if(t<=t1)ticks.push(`<span class="gx-tick" style="left:${pos(t)}%">${a}</span>`)}
 const cur=tree.find(d=>now<d.e)||tree[0],mp=LDE[cur.L],cs=cur.s,ce=cur.e,cpos=t=>(t-cs)/(ce-cs)*100;
 const ad=cur.ads.map(a=>{const x=LDE[a.L],r=adText(ctx,mp,x),w=cpos(Math.min(a.e,ce))-cpos(Math.max(a.s,cs));return`<div class="gx-seg ${gxGrade(r.sc)}" style="left:${cpos(Math.max(a.s,cs))}%;width:${w.toFixed(2)}%" title="${gxT(`${tx(mp)}–${tx(x)} · ${pxDz(a.s,tz)} → ${pxDz(a.e,tz)} · ${tx(grade(r.sc))}`)}">${w>8?tx(x):''}</div>`}).join('');
 const nowMD=pos(now),nowAD=Math.max(0,Math.min(100,cpos(now)));
 return`<div class="card"><h2>${tx('Dasha timeline')}</h2><p class="gx-cap">${tx('Mahadashas from birth (age in years below)')}</p>
 <div class="gx-time"><div class="gx-lane">${md}<i class="gx-now" style="left:${nowMD}%" title="${tx('Now')}"></i></div><div class="gx-ticks">${ticks.join('')}</div></div>
 <p class="gx-cap">${tx('Antardashas of the running mahadasha')}: <b>${tx(mp)}</b> (${pxDz(cs,tz)} → ${pxDz(ce,tz)})</p>
 <div class="gx-time"><div class="gx-lane">${ad}<i class="gx-now" style="left:${nowAD}%" title="${tx('Now')}"></i></div></div>
 ${gxLegend([{cls:'g',l:tx('Favourable')},{cls:'m',l:tx('Mixed')},{cls:'b',l:tx('Challenging')}])}<small>${tx('Colours show this app’s dasha grade; the marker is today.')}</small></div>`}

// ---- Ashtakavarga ----
function gxSav(c,sid){
 const P=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'],T=Array(12).fill(0),grid=P.map(p=>{const a=avRaw(sid,p);a.forEach((v,i)=>T[i]+=v);return a});
 const order=[...Array(12).keys()].map(h=>(c.L+h)%12);
 const rows=order.map((s,h)=>({l:`${h+1}. ${SG[s]}`,v:T[s],cls:T[s]>=30?'g':T[s]>=25?'m':'b',title:`${SG[s]}: ${T[s]}`}));
 const heat=`<div class="gx-heat" style="--cols:12"><span></span>${order.map((s,h)=>`<b class="gx-hh">${h+1}</b>`).join('')}${grid.map((a,pi)=>`<b class="gx-rh">${tx(P[pi])}</b>${order.map(s=>`<i class="gx-cell h${Math.min(8,a[s])}" title="${gxT(tx(P[pi])+' · '+SG[s]+': '+a[s])}">${a[s]}</i>`).join('')}`).join('')}</div>`;
 return`<div class="card"><h2>${tx('Sarvashtakavarga by house')}</h2>${gxBars(rows,{max:40,marks:[28]})}<small>${tx('The line marks 28, the average per sign. Bars are in house order from the Lagna; green is 30+, amber 25-29, red below 25.')}</small>
 <h3 class="gx-h3">${tx('Bhinnashtakavarga heat map (houses from Lagna)')}</h3><div class="sc">${heat}</div></div>`}

// ---- varga heat map ----
const GX_VG=[1,2,3,4,7,9,10,12,16,20,24,27,30,40,45,60];
function gxVargaHeat(c){
 const R=pxVimshopaka(c),cls={own:'vo',gfriend:'vg',friend:'vf',neutral:'vn',enemy:'ve',genemy:'vx'};
 const lab={own:'Own sign',gfriend:'Great friend',friend:'Friend',neutral:'Neutral',enemy:'Enemy',genemy:'Great enemy'};
 const head=`<span></span>${GX_VG.map(n=>`<b class="gx-hh">D${n}</b>`).join('')}`;
 const body=R.map(r=>`<b class="gx-rh">${tx(r.p)}</b>${GX_VG.map(n=>`<i class="gx-cell ${cls[r.vg[n]]}" title="${gxT(tx(r.p)+' · D'+n+': '+tx(lab[r.vg[n]]))}"></i>`).join('')}`).join('');
 const sc=Object.keys(PX_SCHEMES)[0];
 const bars=R.map(r=>({l:tx(r.p),v:+r.sc[sc].toFixed(1),cls:r.sc[sc]>15?'g':r.sc[sc]>10?'m':'b',title:`${tx(r.p)}: ${r.sc[sc].toFixed(1)}/20`}));
 return`<div class="card"><h2>${tx('Divisional strength visuals')}</h2><h3 class="gx-h3">${tx('Vimshopaka bala (out of 20)')}</h3>${gxBars(bars,{max:20,marks:[5,10,15]})}
 <h3 class="gx-h3">${tx('Dignity in each divisional chart')}</h3><div class="sc"><div class="gx-heat" style="--cols:16">${head}${body}</div></div>
 ${gxLegend(Object.keys(lab).map(k=>({cls:cls[k],l:tx(lab[k])})))}</div>`}

// ---- weekly remedy planner ----
function gxWeekly(c,lords){
 const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],pl=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
 const plan=pxPlanetPlan(c,lords||[]),by={};plan.forEach(x=>by[x.p]=x);const today=new Date().getDay();
 const cards=days.map((d,i)=>{const p=pl[i],R=PX_REM[p],x=by[p],focus=x&&x.pri>=3,node=i==6?'Rahu':i==2?'Ketu':'';
  return`<div class="gx-day${i==today?' is-today':''}${focus?' is-focus':''}" style="--pc:${GX_PLC[p]}"><b>${tx(d)}</b>${i==today?`<em>${tx('Today')}</em>`:''}<span class="gx-pdot"></span><strong>${tx(p)}</strong><small>${R.col}</small><small class="gx-mt">${R.beej}</small>${focus?`<span class="gx-focus">${tx('Your focus')}: ${tx(x.mode=='strengthen'?'Strengthen':x.mode=='appease'?'Appease':'Support')}</span>`:''}${node?`<small>+ ${tx(node)}</small>`:''}</div>`}).join('');
 return`<div class="card"><h2>${tx('Weekly remedy planner')}</h2><div class="gx-week">${cards}</div><small>${tx('Each day belongs to a graha (Rahu with Saturday, Ketu with Tuesday in common practice). Highlighted days belong to planets that need attention in this chart.')}</small></div>`}

// ---- dashboard ----
function gxGlance(c,sid,ms,tz,mnk,ys,la,lo){
 const st=PX_P7.map(p=>({p,v:c.strength(p).pct})),avg=Math.round(st.reduce((a,x)=>a+x.v,0)/7),best=[...st].sort((a,b)=>b.v-a.v)[0],low=[...st].sort((a,b)=>a.v-b.v)[0];
 const A=pxLifeAreas(c),ba=[...A].sort((a,b)=>b.b.sc-a.b.sc)[0],wa=[...A].sort((a,b)=>a.b.sc-b.b.sc)[0];
 const ctx=dashaCtx(sid),tree=dashaTree(ms,mnk),now=Date.now(),cur=tree.find(d=>now<d.e)||tree[0],ca=cur.ads.find(a=>now<a.e)||cur.ads[0],md=LDE[cur.L],an=LDE[ca.L];
 const g=ys.filter(y=>y.k=='good').length,m=ys.filter(y=>y.k=='mixed').length,b=ys.filter(y=>y.k=='bad').length;
 const M=nk(sid.Moon),T=pxTransit(c,la,lo);
 const tile=(l,v,s)=>`<div class="gx-tile"><small>${l}</small><b>${v}</b>${s?`<em>${s}</em>`:''}</div>`;
 return`<div class="card gx-hero"><h2>${tx('Chart at a glance')}</h2><div class="gx-tiles">
  ${tile(tx('Lagna'),SG[c.L],tx(c.lord(1))+' · '+tx('house')+' '+c.h[c.lord(1)])}
  ${tile(tx('Moon sign'),SG[c.sg.Moon],NK[M.i]+' · '+tx('pada')+' '+M.p)}
  ${tile(tx('Running dasha'),tx(md)+' – '+tx(an),tx(grade(adText(ctx,md,an).sc)))}
  ${tile(tx('Saturn from Moon'),T.rows[0].hm,T.ss?tx('Sade Sati'):tx('Not in Sade Sati'))}
  </div>
  <div class="gx-three"><div class="gx-box"><h3 class="gx-h3">${tx('Overall strength')}</h3>${gxDonut([{v:avg,cls:gxBand(avg)},{v:100-avg,cls:'z'}],avg,tx(avg>=62?'Strong':avg>=42?'Moderate':'Weak'))}</div>
  <div class="gx-box"><h3 class="gx-h3">${tx('Yoga balance')}</h3>${gxDonut([{v:g,cls:'g',l:tx('Good')},{v:m,cls:'m',l:tx('Mixed')},{v:b,cls:'b',l:tx('Challenging')}],ys.length,tx('formations'))}${gxLegend([{cls:'g',l:tx('Good')+' '+g},{cls:'m',l:tx('Mixed')+' '+m},{cls:'b',l:tx('Challenging')+' '+b}])}</div>
  <div class="gx-box"><h3 class="gx-h3">${tx('Key facts')}</h3><ul class="gx-facts"><li><span>${tx('Strongest planet')}</span><b>${tx(best.p)} ${best.v}</b></li><li><span>${tx('Weakest planet')}</span><b>${tx(low.p)} ${low.v}</b></li><li><span>${tx('Best life area')}</span><b>${tx(ba.t.split(',')[0].split(' and ')[0])}</b></li><li><span>${tx('Area needing care')}</span><b>${tx(wa.t.split(',')[0].split(' and ')[0])}</b></li></ul></div></div></div>`}
function dashTab(sid,ms,tz,mnk,la,lo){
 const c=pxCtx(sid),ys=pxYogas(c);
 return gxGlance(c,sid,ms,tz,mnk,ys,la,lo)+gxAreaRadarCard(c)+gxStrengthBars(c)+gxDashaTimeline(sid,ms,tz,mnk)+gxSav(c,sid)}
