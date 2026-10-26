// Jyotish Kundli v18 - Advanced tab, more BPHS techniques:
// Ch.7 (Vimshopaka bala, uccha strength, solar proximity), Ch.45 (avasthas), Ch.5 (special lagnas), Ch.46 (Ashtottari dasha).
// Wording is paraphrased; sensitive source statements (loss of children or spouse, death) are deliberately left out.
const PX_VW={own:20,gfriend:18,friend:15,neutral:10,enemy:7,genemy:5};
const PX_SCHEMES={
 'Shodasha varga (16 divisions)':{1:3.5,2:1,3:1,4:.5,7:.5,9:3,10:.5,12:.5,16:2,20:.5,24:.5,27:.5,30:1,40:.5,45:.5,60:4},
 'Shad varga (6)':{1:6,2:2,3:4,9:5,12:2,30:1},
 'Sapta varga (7)':{1:5,2:2,3:3,7:2.5,9:4.5,12:2,30:1},
 'Dasha varga (10)':{1:3,2:1.5,3:1.5,7:1.5,9:1.5,10:1.5,12:1.5,16:1.5,30:1.5,60:5}};
const PX_DEEP={Sun:10,Moon:33,Mars:298,Mercury:165,Jupiter:95,Venus:357,Saturn:200};
const pxCap=s=>s.charAt(0).toUpperCase()+s.slice(1);

// compound (panchadha) relation of planet p to a sign: own / gfriend / friend / neutral / enemy / genemy
function pxPanch(c,p,sign){
 const q=SL[sign];if(q===p)return'own';
 const perm=rel2(p,q),tmp=[2,3,4,10,11,12].includes(pxHfs(c.sg[p],c.sg[q]))?1:-1,v=perm+tmp;
 return v>=2?'gfriend':v==1?'friend':v==0?'neutral':v==-1?'enemy':'genemy'}
function pxVimshopaka(c){
 return PX_P7.map(p=>{const vg={};Object.keys(PX_SCHEMES['Shodasha varga (16 divisions)']).forEach(n=>{const s=dv(c.sid[p],+n);vg[n]=(EX[p]===s)?'own':pxPanch(c,p,s)});
  const sc={};Object.entries(PX_SCHEMES).forEach(([k,w])=>{sc[k]=Object.entries(w).reduce((a,[n,wt])=>a+wt*PX_VW[vg[n]]/20,0)});
  let sep=Math.abs(c.sid[p]-c.sid.Sun);if(sep>180)sep=360-sep;
  let u=Math.abs(c.sid[p]-((PX_DEEP[p]+180)%360));if(u>180)u=360-u;
  return{p,vg,sc,sep,ucv:20*u/180,sol:sep/180*100}})}
const pxVBand=v=>v>15?'Wholly favourable':v>10?'Mediocre':v>5?'Some good effects':'Weak (cannot give auspicious results)';

// ---------- Ch.45 avasthas ----------
function pxAvasthas(c){
 const BAL=['Bala (infant)','Kumara (youth)','Yuva (adult)','Vriddha (old)','Mrita (spent)'],BEF=['about one-fourth of its results','about half','full results','negligible results','almost no results'];
 const DEE={exalted:'Deepta (radiant)','own sign':'Swastha (at ease)',mooltrikona:'Swastha (at ease)',gfriend:'Pramudita (delighted)',friend:'Shanta (peaceful)',neutral:'Dina (humble)',enemy:'Dukhita (distressed)',genemy:'Khala (hostile)'};
 const rows=PX_P9.map(p=>{const s=c.sg[p],d=c.d[p],odd=s%2==0,bi=Math.min(4,Math.floor(d/6)),b=odd?bi:4-bi;
  const dg=c.dig(p),jag=['exalted','own sign','mooltrikona'].includes(dg)?['Jagrat (awake)','full results']:['friend sign','neutral sign'].includes(dg)?['Swapna (dreaming)','medium results']:['Sushupti (asleep)','little result'];
  const pn=pxPanch(c,p,s),key=dg=='exalted'?'exalted':dg=='debilitated'?'genemy':(dg=='own sign'||dg=='mooltrikona')?'own sign':pn;
  const flags=[];if(PX_P9.some(q=>q!==p&&c.conj(p,q)&&c.mal(q)))flags.push('Vikala (with a malefic)');if(c.combust(p))flags.push('Kopa (combust)');
  const en=q=>rel2(p,q)==-1,ben=PX_P9.filter(q=>q!==p&&c.ben(q)&&(c.conj(p,q)||c.asp(q,p))),mal=PX_P9.filter(q=>q!==p&&c.mal(q)&&(c.conj(p,q)||c.asp(q,p))),L=[];
  if(c.h[p]==5&&['Rahu','Ketu','Sun','Saturn','Mars'].some(q=>q!==p&&c.conj(p,q)))L.push('Lajjita (ashamed)');
  if(['exalted','mooltrikona'].includes(dg))L.push('Garvita (proud)');
  if(dg=='enemy sign'||PX_P9.some(q=>q!==p&&(c.conj(p,q)||c.asp(q,p))&&en(q))||c.conj(p,'Saturn'))L.push('Kshudhita (starved)');
  if([3,7,11].includes(s)&&mal.length&&!ben.length)L.push('Trushita (thirsty)');
  if(['friend','gfriend'].includes(pn)||ben.length||c.conj(p,'Jupiter'))L.push('Mudita (joyful)');
  if(c.conj(p,'Sun')&&p!='Sun'&&(mal.length||PX_P9.some(q=>q!==p&&c.asp(q,p)&&en(q))))L.push('Kshobhita (agitated)');
  return{p,bal:[BAL[b],BEF[b]],jag,dee:DEE[key]||'—',flags,laj:L}});
 return rows}
const PX_LAJ={'Lajjita (ashamed)':'weakens devotion, judgement and interest in good pursuits; the 5th-house matters need care','Garvita (proud)':'gives gains, skills, comforts and progress in business','Kshudhita (starved)':'brings strain from grief, rivals and loss of strength; the house it occupies is weakened','Trushita (thirsty)':'brings unmet needs, losses through one’s own circle and loss of standing','Mudita (joyful)':'gives comfort, property, learning, good relatives and victory over rivals','Kshobhita (agitated)':'brings financial strain, obstruction to income and a restless mind; the house it occupies is weakened'};
function pxAvasthaCard(c){
 const R=pxAvasthas(c);
 return`<div class="card sc"><h2>${tx('Avasthas of the grahas (BPHS Ch.45)')}</h2><table><tr><th>${tx('Planet')}</th><th>${tx('Baladi (age) state')}</th><th>${tx('Jagradadi state')}</th><th>${tx('Deeptadi state')}</th><th>${tx('Lajjitadi states')}</th></tr>
 ${R.map(r=>`<tr><td><b>${tx(r.p)}</b></td><td class="w">${r.bal[0]}<br><small>${r.bal[1]}</small></td><td class="w">${r.jag[0]}<br><small>${r.jag[1]}</small></td><td class="w">${r.dee}${r.flags.length?'<br><small>'+r.flags.join(', ')+'</small>':''}</td><td class="w">${r.laj.length?r.laj.join(', '):'—'}</td></tr>`).join('')}</table>
 <details class="px-p"><summary><b>${tx('What the Lajjitadi states mean')}</b></summary>${Object.entries(PX_LAJ).map(([k,v])=>`<p class="w"><b>${k}:</b> ${v}.</p>`).join('')}</details>
 <small>${tx('Weak states reduce a planet’s results and strong states enhance them (Ch.45 v.19-23). The twelve Shayanadi avasthas need the native’s name syllable and birth ghatis and are not computed. Nodes use the same rules via their dispositor’s relations.')}</small></div>`}

// ---------- Ch.7 Vimshopaka ----------
function pxVimCard(c){
 const R=pxVimshopaka(c),K=Object.keys(PX_SCHEMES);
 return`<div class="card sc"><h2>${tx('Vimshopaka bala and divisional strength (BPHS Ch.7)')}</h2><table><tr><th>${tx('Planet')}</th>${K.map(k=>`<th>${tx(k)}</th>`).join('')}<th>${tx('Reading (16 divisions)')}</th><th>${tx('Uccha strength (0-20)')}</th><th>${tx('Solar proximity factor')}</th></tr>
 ${R.map(r=>`<tr><td><b>${tx(r.p)}</b></td>${K.map(k=>`<td>${r.sc[k].toFixed(1)}</td>`).join('')}<td class="w">${tx(pxVBand(r.sc[K[0]]))}</td><td>${r.ucv.toFixed(1)}</td><td>${r.p=='Sun'?'—':Math.round(r.sol)+'%'}</td></tr>`).join('')}</table>
 <p class="w"><small>${tx('Each division awards the planet 20 (own sign), 18 (great friend), 15 (friend), 10 (neutral), 7 (enemy) or 5 (great enemy) points, scaled by the division’s weight so that the maximum is 20. Above 15 the planet gives wholly favourable results, 10-15 mediocre, 5-10 some good results, below 5 it cannot give auspicious results (Ch.7 v.21-27). Uccha strength is 20 at the deep exaltation point and 0 at deep debilitation. Solar proximity: a planet opposite the Sun is fully effective and one at the Sun’s longitude loses its good effects, with a rule-of-three in between (v.28-29).')}</small></p></div>`}

// ---------- Ch.5 special lagnas ----------
function pxSpecialLagnas(c,sid,ms,tz,la,lo){
 const d=new Date(ms+tz*36e5),Y=d.getUTCFullYear(),Mo=d.getUTCMonth()+1,D=d.getUTCDate(),lh=d.getUTCHours()+d.getUTCMinutes()/60;
 const r=calc(ms/864e5+2440587.5,la,lo),si=sunInfo(Y,Mo,D,lh,la,lo,tz,sid.Sun+r.ay);
 let t=lh-si.vRise;if(t<0)t+=24;
 const rise=calc((ms-t*36e5)/864e5+2440587.5,la,lo).sid.Sun,fl=x=>((x%360)+360)%360;
 const L=[['Bhava Lagna',fl(rise+15*t),'one sign every 5 ghatis (2 hours) after sunrise'],['Hora Lagna',fl(rise+30*t),'one sign every 2½ ghatis (1 hour)'],['Ghati Lagna',fl(rise+75*t),'one sign every ghati (24 minutes)']];
 const hh=h=>pxHfs(c.L,Math.floor(h/30));
 return`<div class="card sc"><h2>${tx('Special lagnas (BPHS Ch.5)')}</h2><p class="w"><small>${tx('Hours after Vedic sunrise')}: ${t.toFixed(2)} · ${tx('Sun at sunrise')}: ${SG[Math.floor(rise/30)]} ${(rise%30).toFixed(1)}°</small></p>
 <table><tr><th>${tx('Lagna')}</th><th>${tx('Position')}</th><th>${tx('House from natal Lagna')}</th><th>${tx('Lord')}</th><th>${tx('Planets in that sign')}</th><th>${tx('Rule')}</th></tr>
 ${L.map(([n,v,rule])=>{const s=Math.floor(v/30);return`<tr><td><b>${tx(n)}</b></td><td>${SG[s]} ${(v%30).toFixed(1)}°</td><td>${hh(v)}</td><td>${tx(SL[s])}</td><td class="w">${PX_P9.filter(p=>c.sg[p]===s).map(tx).join(', ')||'—'}</td><td class="w"><small>${rule}</small></td></tr>`}).join('')}</table>
 <small>${tx('BPHS (Ch.5 v.9) says to build bhava charts from each special lagna with the natal planets unchanged and read them like the natal Lagna. Later tradition links Hora Lagna with wealth and Ghati Lagna with power and status. Sunrise uses the app’s approximate Vedic sunrise; a few minutes of error shift the result by a few degrees. Varnada dasha is not shown because it is a longevity technique.')}</small></div>`}

// ---------- Ch.46 Ashtottari dasha ----------
const PX_ASH=[['Sun',6,[5,6,7,8]],['Moon',15,[9,10,11]],['Mars',8,[12,13,14,15]],['Mercury',17,[16,17,18]],['Saturn',10,[19,20,'A',21]],['Jupiter',19,[22,23,24]],['Rahu',12,[25,26,0,1]],['Venus',21,[2,3,4]]];
function pxAshSegs(){const w=360/27,AB0=276+40/60,AB1=280+53/60+20/3600,o={};
 for(let i=0;i<27;i++)o[i]=[i*w,(i+1)*w];o[20]=[20*w,AB0];o.A=[AB0,AB1];o[21]=[AB1,22*w];return o}
function pxAshtottari(c,sid,ms,tz){
 const M=sid.Moon,S=pxAshSegs();let seg=null;for(const k in S){if(M>=S[k][0]&&M<S[k][1])seg=k}
 const key=seg==='A'?'A':+seg;let g=0,k=0;PX_ASH.forEach((a,i)=>{const j=a[2].indexOf(key);if(j>=0){g=i;k=j}});
 const frac=(M-S[seg][0])/(S[seg][1]-S[seg][0]),n=PX_ASH[g][2].length,Y=PX_ASH[g][1],bal=Y*(1-(k+frac)/n);
 const lord=c.lord(1),h=pxHfs(c.sg[lord],c.sg.Rahu),kt=[4,7,10,5,9].includes(h),cur=Date.now(),out=[];
 let ts=ms,idx=g;for(let q=0;q<9;q++){const a=PX_ASH[idx%8],len=q==0?bal:a[1];out.push({l:a[0],s:ts,e:ts+len*YRS,y:len,full:a[1],first:q==0});ts+=len*YRS;idx++}
 const md=out.find(x=>cur<x.e)||out[out.length-1],mi=PX_ASH.findIndex(a=>a[0]==md.l),adr=[];
 let st=md.first?md.e-md.full*YRS:md.s;for(let j=0;j<8;j++){const a=PX_ASH[(mi+j)%8],len=md.full*a[1]/108*YRS,s2=st,e2=st+len;st=e2;if(e2>md.s&&s2<md.e)adr.push({l:a[0],s:Math.max(s2,md.s),e:Math.min(e2,md.e)})}
 const ad=adr.find(x=>cur<x.e);
 return`<div class="card sc"><h2>${tx('Ashtottari dasha (BPHS Ch.46)')}</h2>
 <p class="w">${tx('Moon nakshatra')}: ${key==='A'?'Abhijit':NK[key]}. ${tx('Rahu is in the')} ${pxOrd(h)} ${tx('house from the Lagna lord')} (${tx(lord)}). ${kt?tx('This is a kendra/trikona position from the Lagna lord, so Ashtottari is considered applicable under the usual reading of the rule.'):tx('Rahu is not in a kendra or trikona (other than with the Lagna lord) from the Lagna lord, so Ashtottari is normally not the recommended system; it is shown for comparison. The printed English translation of the rule is ambiguous.')}</p>
 <table><tr><th>${tx('Mahadasha')}</th><th>${tx('From')}</th><th>${tx('To')}</th></tr>${out.map(x=>`<tr${x===md?' style="font-weight:700"':''}><td>${tx(x.l)} ${x.first?'('+tx('balance')+' '+x.y.toFixed(1)+'y)':''}</td><td>${pxDz(x.s,tz)}</td><td>${pxDz(x.e,tz)}</td></tr>`).join('')}</table>
 <p class="w"><b>${tx('Running')}:</b> ${tx(md.l)} ${tx('mahadasha')}${ad?', '+tx(ad.l)+' '+tx('antardasha')+' ('+pxDz(ad.s,tz)+' → '+pxDz(ad.e,tz)+')':''}.</p>
 <small>${tx('Eight grahas (no Ketu) share 108 years: Sun 6, Moon 15, Mars 8, Mercury 17, Saturn 10, Jupiter 19, Rahu 12, Venus 21, starting from Ardra. Abhijit is counted as a separate nakshatra between Uttara Ashadha and Shravana. Antardasha length = mahadasha × sub-lord years / 108.')}</small></div>`}

function advancedTab(sid,ms,tz,la,lo){
 const c=pxCtx(sid);
 return (typeof gxVargaHeat=='function'?gxVargaHeat(c):'')+pxVimCard(c)+pxAvasthaCard(c)+pxSpecialLagnas(c,sid,ms,tz,la,lo)+pxAshtottari(c,sid,ms,tz)}
