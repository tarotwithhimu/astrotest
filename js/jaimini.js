// Jaimini sign-based tools and the BPHS Sudarshana Chakra.
// Method choices and limits are documented in BPHS_ANALYSIS.md.
const J_CLASSICAL=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
const J_ALL_GRAHAS=[...J_CLASSICAL,'Rahu','Ketu'];
const J_KARAKA_GRAHAS=[...J_CLASSICAL,'Rahu'];
const J_BHAVA_NAMES=['Lagna','Dhana','Vikrama','Matru','Mantra','Roga','Dara','Marana','Pitru','Karma','Labha','Vyaya'];
const J_SHORT_SIGNS=['Ar','Ta','Ge','Cn','Le','Vi','Li','Sc','Sg','Cp','Aq','Pi'];
const J_SAVYA=new Set([0,1,2,6,7,8]); // Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius
const J_DUAL_LORDS={7:['Mars','Ketu'],10:['Saturn','Rahu']};
const J_DAY=864e5,J_CHARA_YEAR=365.25*J_DAY,J_SUD_YEAR=360*J_DAY;
const J_SIGN=p=>Math.floor((((p%360)+360)%360)/30);
const J_HOUSE=(from,to)=>((to-from+12)%12)+1;
const J_COUNT=(from,to,dir)=>dir>0?((to-from+12)%12)+1:((from-to+12)%12)+1;
const J_HTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const J_PLANET_LABEL=p=>tx(p);
const J_PLANET_ABBR=p=>AB[p]||p.slice(0,2);
const J_PLANETS_IN=(sid,sign,grahas=J_ALL_GRAHAS)=>grahas.filter(p=>J_SIGN(sid[p])===sign);
function J_localDate(ms,tz){return new Date(ms+(Number(tz)||0)*36e5).toISOString().slice(0,10)}

// BPHS Ch.29, vv.1-5: double count from each house to its lord, then apply this edition's distinct 10th/4th exceptions.
function J_bhavaPadas(sid){
 const L=J_SIGN(sid.Lagna);
 return J_BHAVA_NAMES.map((name,i)=>{
  const houseSign=(L+i)%12,lord=SL[houseSign],lordSign=J_SIGN(sid[lord]);
  const lordDistance=J_COUNT(houseSign,lordSign,1),preliminary=(lordSign+lordDistance-1)%12;
  let pada=preliminary,rule='Ordinary double count';
  if(preliminary===houseSign){pada=(houseSign+9)%12;rule='BPHS Ch. 29: parent-sign collapse → 10th from the house'}
  else if(preliminary===(houseSign+6)%12){pada=(houseSign+3)%12;rule=lordSign===(houseSign+3)%12?'BPHS Ch. 29: seventh collapse; lord is in the 4th, use its occupied sign':'BPHS Ch. 29: seventh-sign collapse → 4th from the house'}
  return{number:i+1,name,lord,houseSign,lordSign,lordDistance,preliminary,pada,rule}
 })
}
// Chara karakas rank each graha by degrees-in-sign using full precision (degrees, minutes and seconds),
// not whole degrees. Rahu/Ketu move backwards, so their degree is 30 minus the degree in sign.
// mode: 7 = Sun..Saturn, 8 = + Rahu (default), 9 = + Rahu and Ketu (ties are kept, listed together).
let J_KARAKA_MODE=8;
const J_arcSec=p=>Math.round((((p%30)+30)%30)*3600);
function J_dms(deg){let t=Math.round(deg*3600),d=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return`${d}°${String(m).padStart(2,'0')}′${String(s).padStart(2,'0')}″`}
function J_karakaDegree(sid,p){const d=((sid[p]%30)+30)%30;return p==='Rahu'||p==='Ketu'?30-d:d}
function J_karakaData(sid,mode=J_KARAKA_MODE){
 const grahas=mode===7?J_CLASSICAL:mode===9?J_ALL_GRAHAS:J_KARAKA_GRAHAS;
 const ranked=grahas.map(p=>({planet:p,degree:J_karakaDegree(sid,p)})).sort((a,b)=>Math.round(b.degree*3600)-Math.round(a.degree*3600)||grahas.indexOf(a.planet)-grahas.indexOf(b.planet));
 const ak=ranked[0],navamsa=typeof dv==='function'?dv(sid[ak.planet],9):Math.floor(sid[ak.planet]*9/30)%12;
 return{ranked,ak,karakamsa:navamsa,mode}
}
function J_grahaDignityIn(sign){
 const exalted=J_ALL_GRAHAS.filter(p=>EX[p]!==undefined&&EX[p]===sign),debilitated=J_ALL_GRAHAS.filter(p=>EX[p]!==undefined&&(EX[p]+6)%12===sign);
 return{exalted,debilitated,adjustment:(exalted.length?1:0)-(debilitated.length?1:0)}
}
function J_modalityRank(sign){return sign%3===0?0:sign%3===1?1:2} // movable < fixed < dual, per BPHS Ch.46
function J_chooseDualTarget(sid,sign,lords){
 const lordSigns=lords.map(planet=>({planet,sign:J_SIGN(sid[planet])}));
 const atHome=lordSigns.filter(x=>x.sign===sign);
 if(atHome.length===lords.length)return{target:sign,lords:lords.join('/'),bothOwn:true,rule:'Both co-lords occupy their shared sign'};
 if(atHome.length===1){const other=lordSigns.find(x=>x.sign!==sign);return{target:other.sign,lords:other.planet,bothOwn:false,rule:`One co-lord is at home; count to the other lord in ${SG[other.sign]}`}}
 const uniq=[...new Set(lordSigns.map(x=>x.sign))];
 if(uniq.length===1)return{target:uniq[0],lords:lords.join('/'),bothOwn:false,rule:`Both co-lords occupy ${SG[uniq[0]]}`};
 const ranked=uniq.map(s=>({sign:s,grahas:J_PLANETS_IN(sid,s),dignity:J_grahaDignityIn(s)})).sort((a,b)=>{
  if(!!a.dignity.exalted.length!==!!b.dignity.exalted.length)return Number(!!b.dignity.exalted.length)-Number(!!a.dignity.exalted.length);
  if(a.grahas.length!==b.grahas.length)return b.grahas.length-a.grahas.length;
  if(J_modalityRank(a.sign)!==J_modalityRank(b.sign))return J_modalityRank(b.sign)-J_modalityRank(a.sign);
  return b.sign-a.sign
 });
 const target=ranked[0].sign,selected=lordSigns.filter(x=>x.sign===target).map(x=>x.planet);
 return{target,lords:selected.join('/')||lords.join('/'),bothOwn:false,rule:`Stronger occupied sign selected by BPHS Ch. 46 factors: exalted occupant, occupancy count, sign modality, then higher sign`}
}
function J_charaDuration(sid,sign){
 const dual=J_DUAL_LORDS[sign],savya=J_SAVYA.has(sign),dir=savya?1:-1;
 let lord,target,own=false,choiceRule='';
 if(dual){const chosen=J_chooseDualTarget(sid,sign,dual);lord=chosen.lords;target=chosen.target;own=chosen.bothOwn;choiceRule=chosen.rule}
 else{lord=SL[sign];target=J_SIGN(sid[lord]);own=target===sign;choiceRule=`Sign lord ${lord} occupies ${SG[target]}`}
 if(own)return{lord,target,count:12,base:12,adjustment:0,years:12,direction:dir,own:true,choiceRule,evidence:'Own-sign exception: 12 years'};
 const count=J_COUNT(sign,target,dir),base=count-1,dig=J_grahaDignityIn(target),raw=base+dig.adjustment,years=Math.max(1,Math.min(12,raw));
 let adjustText=dig.adjustment>0?`+1: exalted graha in ${SG[target]}`:dig.adjustment<0?`−1: debilitated graha in ${SG[target]}`:'no dignity adjustment';
 if(raw!==years)adjustText+=`; conventional duration bound applied (${years} years)`;
 return{lord,target,count,base,adjustment:dig.adjustment,years,direction:dir,own:false,choiceRule,evidence:`${count} signs, inclusive, counted ${dir>0?'forward (Savya)':'reverse (Apasavya)'}; −1 = ${base}; ${adjustText}`}
}
function J_charaPeriods(sid){
 const lagna=J_SIGN(sid.Lagna),ninth=(lagna+8)%12,forward=((ninth+1)%2===1),step=forward?1:-1;
 const order=Array.from({length:12},(_,i)=>(lagna+step*i+12)%12);
 const periods=order.map(sign=>({sign,...J_charaDuration(sid,sign)}));
 return{lagna,ninth,forward,order,periods,totalYears:periods.reduce((a,p)=>a+p.years,0)}
}
function J_jaiminiKarakasCard(sid){
 const d=J_karakaData(sid),rows=d.ranked.map((x,i)=>`<tr><td>${i<KARAKA_NAMES.length?tx(KARAKA_NAMES[i]):'—'}</td><td>${J_PLANET_LABEL(x.planet)}</td><td>${J_dms(x.degree)}</td></tr>`).join('');
 return`<div class="card sc" id="jk-card"><h2>${tx('Chara Karakas & Karakamsa')}</h2><label>Scheme <select id="jk-mode"><option value="7"${d.mode===7?' selected':''}>7 karakas (no nodes)</option><option value="8"${d.mode===8?' selected':''}>8 karakas (with Rahu)</option><option value="9"${d.mode===9?' selected':''}>Rahu + Ketu both</option></select></label><p>${tx('Atmakaraka')}: <b>${J_PLANET_LABEL(d.ak.planet)}</b> · ${tx('Karakamsa')}: <b>${tx(SG[d.karakamsa])}</b> (${tx('D9 sign of the Atmakaraka')}).</p><small class="table-scroll-hint">${tx('Swipe horizontally to view all columns.')}</small><table class="jaimini-table"><thead><tr><th>Karaka</th><th>Graha</th><th>Degree in sign</th></tr></thead><tbody>${rows}</tbody></table><small>Ranked by full degree-minute-second value, not whole degrees. 7-karaka: Sun to Saturn; 8-karaka: adds Rahu; 9-body: adds Ketu too. Rahu and Ketu use reversed degree (30° minus degree in sign), so Ketu ties with Rahu and is shown without a karaka name beyond the eighth. Karakamsa is the Atmakaraka’s Navamsa sign; this is a placement reference, not a full Jaimini interpretation.</small></div>`
}
function J_padaCard(sid,padas){
 const names=padas.map(x=>`A${x.number}${x.number===1?' / AL':x.number===12?' / Upapada (UL)':x.number===2?' / Dhanapada':''}`);
 const rows=padas.map((x,i)=>`<tr><td>${names[i]}</td><td>${x.number} · ${tx(J_BHAVA_NAMES[x.number-1])} (${tx(SG[x.houseSign])})</td><td>${tx(x.lord)}</td><td>${tx(SG[x.lordSign])} · ${x.lordDistance} ${x.lordDistance===1?'sign':'signs'}</td><td><b>${tx(SG[x.pada])}</b></td><td class="j-method">${J_HTML(x.rule)}</td></tr>`).join('');
 return`<div class="card sc"><h2>${tx('Bhava Padas · Arudha')}</h2><p>All twelve padas are calculated from the natal D1 signs. A1 is Arudha Lagna; A12 is Upapada.</p><small class="table-scroll-hint">${tx('Swipe horizontally to view all columns.')}</small><table class="jaimini-table"><thead><tr><th>Pada</th><th>Parent bhava</th><th>Lord</th><th>Lord placement</th><th>Result</th><th>Rule applied</th></tr></thead><tbody>${rows}</tbody></table><small>Convention follows the supplied BPHS English edition, Ch. 29, vv. 1–5. In this edition, a preliminary pada on the parent sign moves to the 10th; one on the 7th moves to the 4th. Other lineages use different corrections. Sign lords use the app’s classical seven-graha lordship table; co-lord strength for Scorpio/Aquarius is not independently ranked for this Pada table.</small></div>`
}
function J_argalaCard(sid){
 const L=J_SIGN(sid.Lagna),groups=[{a:2,o:12},{a:4,o:10},{a:11,o:3},{a:5,o:9}];
 const labels=['2 / 12','4 / 10','11 / 3','5 / 9'];
 const at=(sign,house)=>J_CLASSICAL.filter(p=>J_HOUSE(sign,J_SIGN(sid[p]))===house);
 const cells=list=>list.length?list.map(p=>J_PLANET_ABBR(p)).join(' '):'—';
 const state=(a,o)=>a>o?'More primary Argala by count':a<o?'More obstruction by count':a?'Equal counts':'No placements in listed houses';
 const rows=Array.from({length:12},(_,i)=>{
  const sign=(L+i)%12,sets=groups.map(g=>({a:at(sign,g.a),o:at(sign,g.o)}));
  const primary=sets.slice(0,3).reduce((n,x)=>n+x.a.length,0),obstruct=sets.slice(0,3).reduce((n,x)=>n+x.o.length,0),secondary=sets[3];
  return`<tr><td>${i+1}</td><td>${tx(SG[sign])}</td>${sets.map((x,j)=>`<td><b>${labels[j]}:</b> ${cells(x.a)} <small>vs</small> ${cells(x.o)}</td>`).join('')}<td>${tx(state(primary,obstruct))}<small>Primary ${primary} : ${obstruct}</small><small>5th/9th ${secondary.a.length} : ${secondary.o.length}</small></td></tr>`
 }).join('');
 return`<div class="card sc"><h2>${tx('Argala / Virodhargala')}</h2><p>Each row treats a natal sign as the target. Primary Argala pairs are 2nd/12th, 4th/10th and 11th/3rd; the secondary pair is 5th/9th.</p><small class="table-scroll-hint">${tx('Swipe horizontally to view all columns.')}</small><table class="jaimini-table argala-table"><thead><tr><th>Target house</th><th>Sign</th><th>2 / 12</th><th>4 / 10</th><th>11 / 3</th><th>5 / 9</th><th>Count summary</th></tr></thead><tbody>${rows}</tbody></table><small>BPHS Ch. 31, vv. 2–9. Cells show classical planets in the Argala house versus its obstruction house. The text also requires strength comparison, allows special cases and counts Rahu/Ketu in reverse; those node-specific and strength rules are not calculated here. A count comparison is not a final prediction.</small></div>`
}
function J_charaDashaCard(sid,birthMs,tz,padas){
 const calc=J_charaPeriods(sid),now=Date.now(),cycleMs=calc.totalYears*J_CHARA_YEAR;
 const elapsed=now-birthMs,cycleIndex=elapsed>=0&&cycleMs>0?Math.floor(elapsed/cycleMs):0;
 let cursor=birthMs+cycleIndex*cycleMs;
 const rows=calc.periods.map((p,i)=>{
  const start=cursor,end=start+p.years*J_CHARA_YEAR;cursor=end;
  const active=elapsed>=0&&now>=start&&now<end,house=J_HOUSE(calc.lagna,p.sign),occupants=J_PLANETS_IN(sid,p.sign),related=padas.filter(x=>x.pada===p.sign).map(x=>`A${x.number}`),karaka=J_karakaData(sid).ranked.filter(x=>J_SIGN(sid[x.planet])===p.sign).map(x=>x.planet);
  const evidence=p.own?p.evidence:`${p.evidence}; ${p.choiceRule}`;
  return`<tr${active?' class="now"':''}><td>${i+1}</td><td><b>${tx(SG[p.sign])}</b><small>${tx('House')} ${house} from Lagna</small></td><td>${p.lord==='Mars/Ketu'||p.lord==='Saturn/Rahu'?p.lord:tx(p.lord)}<small>${tx(SG[p.target])}</small></td><td>${p.years}</td><td>${J_localDate(start,tz)}</td><td>${J_localDate(end,tz)}</td><td>${occupants.length?occupants.map(tx).join(', '):'—'}</td><td>${related.length?related.join(', '):'—'}${karaka.length?` · ${karaka.map(tx).join(', ')}`:''}</td><td class="j-method">${J_HTML(evidence)}</td></tr>`
 }).join('');
 const current=calc.periods.find(p=>{let t=birthMs+cycleIndex*cycleMs;for(const q of calc.periods){const e=t+q.years*J_CHARA_YEAR;if(q===p)return now>=t&&now<e;t=e}return false});
 const activeSummary=elapsed<0?`<p class="jaimini-active">${tx('Birth time is in the future; no running Chara Dasha yet.')}</p>`:current?`<p class="jaimini-active">${tx('Current Chara Dasha')}: <b>${tx(SG[current.sign])}</b> · ${current.years} ${tx('years')} · ${J_localDate(now,tz)} · ${tx('cycle')} ${cycleIndex+1}.</p>`:`<p class="jaimini-active">${tx('Current period could not be resolved for this date.')}</p>`;
 const flow=calc.forward?'forward':'reverse',parity=(calc.ninth+1)%2?'odd':'even';
 return`<div class="card sc"><h2>${tx('Jaimini Chara Dasha')}</h2>${activeSummary}<p>BPHS/Neelakantha-style sign periods. Starts from ${tx(SG[calc.lagna])}; the 9th sign is ${tx(SG[calc.ninth])} (${parity}), so the 12-sign major-period order runs ${flow}. This schedule uses a 365.25-day year for dates.</p><small class="table-scroll-hint">${tx('Swipe horizontally to view all columns.')}</small><table class="jaimini-table chara-table"><thead><tr><th>#</th><th>Period sign</th><th>Lord used</th><th>Years</th><th>From</th><th>To</th><th>Grahas in sign</th><th>Arudhas / Karakas</th><th>Duration evidence</th></tr></thead><tbody>${rows}</tbody></table><small>BPHS sign-dasha discussion, Ch. 46, vv. 158–167, supplemented by the named convention's sign-count rules. Each sign’s duration counts to its lord in the Savya/Apasavya direction, then subtracts one; own-sign periods are 12 years, with dignity adjustments bounded to 1–12. Scorpio/Aquarius use the edition’s dual-lord strength factors. The 12-sign sequence repeats in this implementation. Chara antardashas are omitted because source lineages disagree on their sequence and the cited procedure does not specify it consistently. Period activation is not a guaranteed event.</small></div>`
}
function jaiminiTools(sid,birthMs,tz){
 const padas=J_bhavaPadas(sid);
 return`<div class="card jaimini-intro"><h2>${tx('Jaimini tools')}</h2><p>Sign-based reference calculators using the current D1 chart. This section adds Arudha Padas, Argala and Chara Dasha. Chara Karakas and rāśi dṛṣṭi also remain available in the app.</p><small>Calculations name their rule source and surface unresolved strength, exception and lineage choices rather than presenting a single universal Jaimini method.</small></div>${J_jaiminiKarakasCard(sid)}${J_padaCard(sid,padas)}${J_argalaCard(sid)}${J_charaDashaCard(sid,birthMs,tz,padas)}`
}

function J_sudarshanaData(sid){
 const anchors=[{name:'Lagna',sign:J_SIGN(sid.Lagna),ring:'inner'},{name:'Moon',sign:J_SIGN(sid.Moon),ring:'middle'},{name:'Sun',sign:J_SIGN(sid.Sun),ring:'outer'}];
 const houses=Array.from({length:12},(_,i)=>({number:i+1,refs:anchors.map(a=>{const sign=(a.sign+i)%12;return{anchor:a.name,sign,planets:J_PLANETS_IN(sid,sign)}})}));
 return{anchors,houses}
}
function J_sudarshanaSvg(data,sid){
 const cx=250,cy=250,radii=[55,110,165,220],textR=[82,137,192],fills=['var(--surface-soft)','var(--surface)','var(--surface-soft)'];
 let out=[`<svg class="sudarshana-svg" viewBox="0 0 500 500" role="img" aria-labelledby="sudarshana-title sudarshana-desc"><title id="sudarshana-title">Sudarshana Chakra</title><desc id="sudarshana-desc">Three concentric twelve-house charts: Lagna in the inner ring, Moon in the middle ring and Sun in the outer ring.</desc>`];
 out.push(`<circle cx="${cx}" cy="${cy}" r="220" fill="${fills[2]}"/>`,`<circle cx="${cx}" cy="${cy}" r="165" fill="${fills[1]}"/>`,`<circle cx="${cx}" cy="${cy}" r="110" fill="${fills[0]}"/>`,`<circle cx="${cx}" cy="${cy}" r="55" fill="var(--surface)"/>`);
 for(let i=0;i<12;i++){
  const angle=(-90+i*30)*Math.PI/180,x1=cx+Math.cos(angle)*55,y1=cy+Math.sin(angle)*55,x2=cx+Math.cos(angle)*220,y2=cy+Math.sin(angle)*220;
  out.push(`<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"/>`)
 }
 radii.forEach(r=>out.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none"/>`));
 data.anchors.forEach((a,ring)=>{
  for(let h=0;h<12;h++){
   const ang=(-90+h*30)*Math.PI/180,x=cx+Math.cos(ang)*textR[ring],y=cy+Math.sin(ang)*textR[ring],sign=(a.sign+h)%12,planets=J_PLANETS_IN(sid,sign);
   out.push(`<text class="sud-house" x="${x.toFixed(2)}" y="${(y-2).toFixed(2)}" text-anchor="middle">${h+1} · ${shortSign(sign)}</text><text class="sud-planets" x="${x.toFixed(2)}" y="${(y+10).toFixed(2)}" text-anchor="middle">${planets.length?planets.map(J_PLANET_ABBR).join(' '):'·'}</text>`)
  }
 });
 out.push(`<text class="sud-center" x="250" y="246" text-anchor="middle">Sudarshana</text><text class="sud-center-sub" x="250" y="263" text-anchor="middle">BPHS · 74</text></svg>`);
 return out.join('')
}
function J_sudarshanaCard(sid,birthMs,tz){
 const data=J_sudarshanaData(sid);
 const svg=J_sudarshanaSvg(data,sid);
 const table=data.houses.map(h=>`<tr><td>${h.number}</td>${h.refs.map(r=>`<td><b>${tx(SG[r.sign])}</b>${r.planets.length?` · ${r.planets.map(tx).join(', ')}`:' · —'}</td>`).join('')}</tr>`).join('');
 const distinct=new Set(data.anchors.map(a=>a.sign)).size;
 let cycle='';
 const now=Date.now(),elapsed=now-birthMs;
 if(elapsed<0)cycle=`<p class="sud-cycle-note">${tx('Birth time is in the future; current Bhava periods are not available.')}</p>`;
 else{
  const yearIndex=Math.floor(elapsed/J_SUD_YEAR),yearStart=birthMs+yearIndex*J_SUD_YEAR,houseYear=yearIndex%12+1,cycleNo=Math.floor(yearIndex/12)+1,monthIndex=Math.min(11,Math.floor((now-yearStart)/(30*J_DAY))),monthStart=yearStart+monthIndex*30*J_DAY,pratyIndex=Math.min(11,Math.floor((now-monthStart)/(2.5*J_DAY))),monthHouse=(houseYear+monthIndex-1)%12+1,pratyHouse=(houseYear+pratyIndex-1)%12+1,lagna=J_SIGN(sid.Lagna);
  const active=(h)=>{const sign=(lagna+h-1)%12,refs=data.anchors.map(a=>{const rs=(a.sign+h-1)%12,ps=J_PLANETS_IN(sid,rs);return`${tx(a.name)}: ${tx(SG[rs])}${ps.length?' · '+ps.map(tx).join(', '):''}`}).join(' | ');return`<div class="sud-period"><b>${tx(J_BHAVA_NAMES[h-1])} · ${tx(SG[sign])}</b><small>${refs}</small></div>`};
  cycle=`<div class="sud-cycle"><h3>${tx('Current Sudarshana Bhava periods')}</h3><p>${tx('Cycle')} ${cycleNo} · ${J_localDate(yearStart,tz)} – ${J_localDate(yearStart+J_SUD_YEAR,tz)}</p><div class="sud-periods">${active(houseYear)}${active(monthHouse)}${active(pratyHouse)}</div><small>Year Dasha: ${tx(J_BHAVA_NAMES[houseYear-1])} · Antardasha: ${tx(J_BHAVA_NAMES[monthHouse-1])} · Pratyantar: ${tx(J_BHAVA_NAMES[pratyHouse-1])}. Uses the BPHS Ch. 74 1-year / 1-month / 2.5-day rhythm on a 360-day year.</small></div>`
 }
 return`<div class="card"><h2>${tx('Sudarshana Chakra')}</h2><p>Three aligned twelve-house rings: inner = Lagna, middle = Moon sign, outer = Sun sign. Compare each house number across the rings; each column marks the same bhava from a different starting sign.</p><div class="sudarshana-wrap">${svg}</div><div class="sudarshana-legend"><span><i class="legend-dot inner-dot"></i>${tx('Inner · Lagna')}</span><span><i class="legend-dot middle-dot"></i>${tx('Middle · Moon')}</span><span><i class="legend-dot outer-dot"></i>${tx('Outer · Sun')}</span></div><details class="sud-table-details"><summary>${tx('Accessible house-by-house table')}</summary><small class="table-scroll-hint">${tx('Swipe horizontally to view all columns.')}</small><div class="sc"><table class="sudarshana-table"><thead><tr><th>House</th><th>Lagna ring</th><th>Moon ring</th><th>Sun ring</th></tr></thead><tbody>${table}</tbody></table></div></details>${distinct<3?`<p class="sud-caution">BPHS Ch. 74, vv. 19–20: at least two anchors share a sign, so the text directs judgment from the Rashi chart rather than relying on separate Sudarshana references.</p>`:''}${cycle}<small>Formation and bhava alignment: supplied BPHS English edition, Ch. 74, vv. 4–28. The app displays placements and period sequence; it does not automatically predict the classical outcomes or assess all aspects and strengths.</small></div>`
}

document.addEventListener('change',e=>{if(e.target&&e.target.id==='jk-mode'&&typeof LAST!=='undefined'&&LAST){J_KARAKA_MODE=+e.target.value;const c=document.getElementById('jk-card');if(c)c.outerHTML=J_jaiminiKarakasCard(LAST)}});
