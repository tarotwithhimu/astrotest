// Sudarshana Chakra (BPHS Ch.74): three-ring dasha-year reference from Lagna, Moon and Sun.
// (Split out of the former jaimini.js; the Jaimini tools were removed because the app is purely Parashari/Vedic.)
const J_DAY=864e5,J_SUD_YEAR=360*J_DAY;
const J_CLASSICAL=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'],J_ALL_GRAHAS=[...J_CLASSICAL,'Rahu','Ketu'];
const J_BHAVA_NAMES=['Lagna','Dhana','Vikrama','Matru','Mantra','Roga','Dara','Marana','Pitru','Karma','Labha','Vyaya'];
const J_SHORT_SIGNS=['Ar','Ta','Ge','Cn','Le','Vi','Li','Sc','Sg','Cp','Aq','Pi']; // used by the Pataki chart labels
const J_SIGN=p=>Math.floor((((p%360)+360)%360)/30);
const J_PLANET_ABBR=p=>AB[p]||p.slice(0,2);
const J_PLANETS_IN=(sid,sign,grahas=J_ALL_GRAHAS)=>grahas.filter(p=>J_SIGN(sid[p])===sign);
function J_localDate(ms,tz){return new Date(ms+(Number(tz)||0)*36e5).toISOString().slice(0,10)}

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

