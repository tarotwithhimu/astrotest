// Vimshottari dasha: mahadasha, antardasha, pratyantar, with rule-based results.
// Periods: BPHS Vimshottari scheme (120 years, nakshatra-lord order, 365.25-day year).
// Results are classical rules of thumb (BPHS ch. 46-47 gist): nature of the lord, house it occupies,
// houses it owns, dignity, friendship between mahadasha and antardasha lords and the lord's Tara from the Moon.
let RUNNING='';
const LDE=['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury']; // Vimshottari order (matches YR)
const YRS=365.25*864e5;
const PTH={Sun:'authority, government, father, vitality, status',Moon:'mind, mother, public, comforts',Mars:'energy, courage, property, siblings',Mercury:'intellect, trade, communication, learning',Jupiter:'wisdom, children, wealth, dharma, teachers',Venus:'marriage, comforts, arts, vehicles',Saturn:'discipline, hard work, service, patience',Rahu:'foreign matters, ambition, unconventional gains, confusion',Ketu:'detachment, spirituality, research, loss'};
const PMD={
 Sun:'Traditional themes may include authority, visibility, responsibility, and dealings with institutions or mentors.',
 Moon:'Traditional themes may include home, routines, public life, emotional attention, and comfort.',
 Mars:'Traditional themes may include initiative, effort, property matters, courage, and assertiveness.',
 Rahu:'Traditional themes may include ambition, unfamiliar settings, unconventional interests, and uncertainty.',
 Jupiter:'Traditional themes may include learning, teaching, ethics, children, resources, and mentors.',
 Saturn:'Traditional themes may include discipline, sustained work, service, obligations, and patience.',
 Mercury:'Traditional themes may include study, communication, commerce, analysis, and practical skills.',
 Ketu:'Traditional themes may include research, simplification, inward focus, and spiritual interests.',
 Venus:'Traditional themes may include relationships, art, comforts, design, and shared enjoyment.'};
const HTH=['identity and self-direction','resources, speech and family','initiative, effort and siblings','home, family and property','learning, creativity and responsibility','obligations, service and problem-solving','partnerships and agreements','shared matters, change and uncertainty','belief, learning and mentors','work, responsibility and public role','goals, networks and gains','expenditure, retreat and distant places'];
const HSC=[1,.5,-.5,.5,1,-1,.5,-1,1,.5,0,-1]; // classical weight of houses owned by a lord (trikona up, dusthana down)
const GOODH=[1,4,5,7,9,10,11],BADH=[6,8,12];
const SKIN={Rahu:'Saturn',Ketu:'Mars'}; // nodes take the friendship of these planets for the relation test
const dignOf=(p,s)=>EX[p]===undefined?'':EX[p]==s?'exalted':(EX[p]+6)%12==s?'debilitated':OWN[p].includes(s)?'own sign':'';
const rel2=(a,b)=>{a=SKIN[a]||a;b=SKIN[b]||b;if(a==b)return 2;const v=rel(a,b)+rel(b,a);return v>0?1:v<0?-1:0};
const taraIdx=(from,to)=>((to-from+27)%27)%9;

// Everything the rules need to know about one planet in this chart
function dashaCtx(sid){
 const lg=Math.floor(sid.Lagna/30),mi=nk(sid.Moon).i,ctx={lg,mi,P:{}};
 for(const p of LDE){const s=Math.floor(sid[p]/30),h=(s-lg+12)%12+1,q=nk(sid[p]).i;
  // nodes act through their dispositor (sign lord) for house ownership
  const act=(p=='Rahu'||p=='Ketu')?SL[s]:p,owned=[];
  for(let k=0;k<12;k++)if(SL[k]==act)owned.push((k-lg+12)%12+1);
  ctx.P[p]={s,h,dig:dignOf(p,s),own:owned,act,star:q,tara:taraIdx(mi,q)}}
 return ctx}

// Score a planet's results (used for MD and AD lords)
function lordScore(ctx,p){
 const c=ctx.P[p],why=[];let sc=0;
 const hs=c.own.reduce((a,h)=>a+HSC[h-1],0)/(c.own.length||1);
 if(c.own.length){sc+=hs;why.push(`rules house${c.own.length>1?'s':''} ${c.own.join(' & ')}${c.act!=p?' (as '+c.act+')':''}`)}
 else why.push('rules no house');
 if(GOODH.includes(c.h)){sc+=.5;why.push(`placed in house ${c.h} (${HTH[c.h-1]})`)}
 else if(BADH.includes(c.h)){sc-=1;why.push(`placed in house ${c.h} (${HTH[c.h-1]}), a dusthana`)}
 else why.push(`placed in house ${c.h} (${HTH[c.h-1]})`);
 if(c.dig=='exalted'||c.dig=='own sign'){sc+=1;why.push(c.dig)}else if(c.dig=='debilitated'){sc-=1;why.push('debilitated')}
 if([1,3,5,7].includes(c.tara)){sc+=.5;why.push(`${TARA[c.tara]} tara from Moon`)}
 else if([2,4,6].includes(c.tara)){sc-=.5;why.push(`${TARA[c.tara]} tara from Moon`)}
 return{sc,why,c}}
const grade=s=>s>=2?'Very favourable':s>=.75?'Favourable':s>-.75?'Mixed':s>-2?'Challenging':'Difficult';

function dashaTree(ms,mnk){
 const li=mnk.i%9,out=[];let start=ms;
 for(let k=0;k<9;k++){
  const L=(li+k)%9,yrs=k?YR[L]:(1-mnk.f)*YR[L],e=start+yrs*YRS,full=YR[L]*YRS,s0=e-full,ads=[];
  let a=s0;
  for(let j=0;j<9;j++){const A=(L+j)%9,ae=a+YR[L]*YR[A]/120*YRS;ads.push({L:A,s:a,e:ae});a=ae}
  out.push({L,s:start,e,yrs,ads:ads.filter(x=>x.e>start)});start=e}
 return out}

function adText(ctx,mdP,adP){
 const m=ctx.P[mdP],a=lordScore(ctx,adP),r=rel2(mdP,adP);let sc=a.sc;
 const rt=mdP==adP?'same planet as the mahadasha lord (own sub-period, results intensify)':r==1?'friendly to the mahadasha lord (smooth cooperation)':r==-1?'unfriendly to the mahadasha lord (friction and mixed results)':'neutral to the mahadasha lord';
 sc+=mdP==adP?0:r;
 const hFrom=(a.c.s-m.s+12)%12+1;
 if(hFrom==6||hFrom==8||hFrom==12){sc-=.5}else if([1,4,5,7,9,10].includes(hFrom)){sc+=.5}
 return{sc,txt:`${tx(adP)} governs ${PTH[adP]}. It is ${rt}${mdP==adP?'':`, and sits ${hFrom} from the mahadasha lord${[6,8,12].includes(hFrom)?' (a strained 6/8/12 relation)':''}`}. ${a.why.join('; ')}.`}}

function dashaCard(sid,ms,tz,mnk){
 const ctx=dashaCtx(sid),tree=dashaTree(ms,mnk),now=Date.now(),dz=t=>new Date(t+tz*36e5).toISOString().slice(0,10);
 const cur=tree.find(x=>now<x.e)||tree[0],ca=cur.ads.find(x=>now<x.e)||cur.ads[0];
 // pratyantar of the running antardasha
 let pr=[],ps=ca.s;const ad=ca.e-ca.s;
 for(let j=0;j<9;j++){const P=(ca.L+j)%9,pe=ps+ad*YR[P]/120;pr.push({L:P,s:ps,e:pe});ps=pe}
 const cp=pr.find(x=>now<x.e)||pr[0],N=L=>tx(LDE[L]);
 RUNNING=N(cur.L)+' › '+N(ca.L);
 const mdSc=cur?lordScore(ctx,LDE[cur.L]):null;
 const mdRows=tree.map(d=>{const sc=lordScore(ctx,LDE[d.L]),run=d===cur;
  return`<tr${run?' class="now"':''}><td>${N(d.L)}</td><td>${dz(d.s)}</td><td>${dz(d.e)}</td><td>${d.yrs.toFixed(2)}</td><td>${tx(grade(sc.sc))}</td></tr>`}).join('');
 const mdDet=tree.map(d=>{const sc=lordScore(ctx,LDE[d.L]);
  const rows=d.ads.map(a=>{const r=adText(ctx,LDE[d.L],LDE[a.L]),run=d===cur&&a===ca,from=Math.max(a.s,d.s);
   return`<tr${run?' class="now"':''}><td>${N(d.L)}&ndash;${N(a.L)}</td><td>${dz(from)}</td><td>${dz(a.e)}</td><td>${tx(grade(r.sc))}</td><td class="w">${r.txt}</td></tr>`}).join('');
  return`<details${d===cur?' open':''}><summary><b>${N(d.L)}</b> ${tx('mahadasha')} · ${dz(d.s)} → ${dz(d.e)} · ${tx(grade(sc.sc))}</summary>
  <p class="w">${PMD[LDE[d.L]]}</p><p class="w"><small>${sc.why.join('; ')}.</small></p>
  <div class="sc"><table><tr><th>${tx('Period')}</th><th>${tx('From')}</th><th>${tx('To')}</th><th>${tx('Result')}</th><th>${tx('Notes')}</th></tr>${rows}</table></div></details>`}).join('');
 const prRows=pr.map(x=>`<tr${x===cp?' class="now"':''}><td>${N(cur.L)}&ndash;${N(ca.L)}&ndash;${N(x.L)}</td><td>${dz(x.s)}</td><td>${dz(x.e)}</td></tr>`).join('');
 const cr=adText(ctx,LDE[cur.L],LDE[ca.L]);
 return`<div class="card"><h2>${tx('Running dasha')}</h2>
  <p><b>${N(cur.L)}</b> ${tx('mahadasha')} › <b>${N(ca.L)}</b> ${tx('antardasha')} › <b>${N(cp.L)}</b> ${tx('pratyantar')}</p>
  <p class="w"><small>${dz(cur.s)} → ${dz(cur.e)} &nbsp;|&nbsp; ${dz(ca.s)} → ${dz(ca.e)} &nbsp;|&nbsp; ${dz(cp.s)} → ${dz(cp.e)}</small></p>
  <p class="w"><b>${tx('Mahadasha result')} (${tx(grade(mdSc.sc))}):</b> ${PMD[LDE[cur.L]]} ${mdSc.why.join('; ')}.</p>
  <p class="w"><b>${tx('Antardasha result')} (${tx(grade(cr.sc))}):</b> ${cr.txt}</p></div>
 <div class="card sc"><h2>${tx('Vimshottari mahadasha')}</h2><table><tr><th>${tx('Lord')}</th><th>${tx('From')}</th><th>${tx('To')}</th><th>${tx('Years')}</th><th>${tx('Result')}</th></tr>${mdRows}</table></div>
 <div class="card"><h2>${tx('Antardasha results, all mahadashas')}</h2>${mdDet}
  <small>${tx('Traditional themes are indications, not predictions. The displayed period grade is this app’s heuristic—not a canonical BPHS score. This version does not fully assess aspects, planetary strength, cancellations or divisional-chart support.')}</small></div>
 <div class="card sc"><h2>${tx('Pratyantar dasha, running antardasha')} (${N(cur.L)}–${N(ca.L)})</h2><table><tr><th>${tx('Period')}</th><th>${tx('From')}</th><th>${tx('To')}</th></tr>${prRows}</table></div>`}
