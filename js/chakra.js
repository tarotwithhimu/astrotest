// Navatara chakra (Tara Bala) and Pataki Rishta Chakra evidence map.
// Navatara: count from the Janma nakshatra; every ninth star repeats the cycle (3 stars per tara).
const TARA=['Janma','Sampat','Vipat','Kshema','Pratyari','Sadhana','Naidhana','Mitra','Parama Mitra'];
const TNAT=[0,1,-1,1,-1,1,-1,1,1]; // 1 benefic, -1 malefic, 0 neutral (Janma)
const TEFF=['Self, body and health; neutral, avoid starting big ventures','Wealth, gains and fulfilment','Danger, obstacles and accidents','Well-being, comfort and stability','Opposition, enemies and delays','Achievement and success of goals','Disease, loss and endings; the most inauspicious','Friends, allies and support','Greatest well-wishers and protection; most auspicious'];
const PNA=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
function navataraCard(sid,mi){
 const at={};PNA.forEach(p=>{const t=taraIdx(mi,nk(sid[p]).i);(at[t]=at[t]||[]).push(tx(p))});
 const cells=TARA.map((t,i)=>{const stars=[0,1,2].map(k=>NK[(mi+i+9*k)%27]).join(', '),cls=TNAT[i]>0?'tg':TNAT[i]<0?'tb':'tn';
  return`<div class="${cls}"><b>${i+1}. ${tx(t)}</b><i>${tx(TNAT[i]>0?'Benefic':TNAT[i]<0?'Malefic':'Neutral')}</i><span>${stars}</span><em>${at[i]?at[i].join(', '):'&nbsp;'}</em><small>${tx(TEFF[i])}</small></div>`}).join('');
 const tm=nk(calc(Date.now()/864e5+2440587.5,0,0).sid.Moon).i,tt=taraIdx(mi,tm);
 return`<div class="card"><h2>${tx('Navatara chakra')}</h2>
  <p>${tx('Janma nakshatra')}: <b>${NK[mi]}</b></p><div class="nv">${cells}</div>
  <p>${tx("Today's Moon is in")} <b>${NK[tm]}</b>: <b>${tx(TARA[tt])}</b> ${tx('tara')} (${tx(TNAT[tt]>0?'Benefic':TNAT[tt]<0?'Malefic':'Neutral')})</p>
  <small>${tx('Counted from your Janma nakshatra. Sampat, Kshema, Sadhana, Mitra and Parama Mitra are favourable; Vipat, Pratyari and Naidhana are unfavourable, and Janma is neutral (avoid new starts). Planets of your chart are shown in the tara of the nakshatra they occupy.')}</small></div>`}

// Tripataki chakra: Gemini, Taurus, Aries on the three top flags (Taurus always the centre), then Cancer-Leo-Virgo down the left, Libra-Scorpio-Sagittarius along the bottom and Capricorn-Aquarius-Pisces up the right (anticlockwise). Signs sit at fixed points of a 45-degree lattice; two signs are in vedha when one straight line joins them.
const PAT_NODE={2:[1,0],1:[2,0],0:[3,0],3:[0,1],4:[0,2],5:[0,3],6:[1,4],7:[2,4],8:[3,4],9:[4,3],10:[4,2],11:[4,1]};
// 3 verticals, 3 horizontals and 12 diagonals joining the line ends (18 lines; every sign has 3 links).
const PAT_LINKS=[[2,6],[1,7],[0,8],[3,11],[4,10],[5,9],[2,3],[2,9],[1,4],[1,10],[0,11],[0,5],[3,8],[4,7],[5,6],[11,6],[10,7],[9,8]];
const PAT_NB=Array.from({length:12},(_,s)=>PAT_LINKS.filter(l=>l.includes(s)).map(l=>l[0]===s?l[1]:l[0]));
const pAff=s=>{s=((s%12)+12)%12;return[s,...PAT_NB[s]]};
const PAT_SHORT={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke',Dhoom:'Dh',Vyatipat:'Vya',Parivesh:'Par',Chap:'Ch',Upaketu:'UpK','Gulika (Mandi)':'Gu'};
const PAT_X0=70,PAT_DX=90,PAT_Y0=88,PAT_DY=82;
const patXY=s=>[PAT_X0+PAT_NODE[s][0]*PAT_DX,PAT_Y0+PAT_NODE[s][1]*PAT_DY];
function patakiLocalDate(ms,tz){return new Date(ms+tz*36e5)}
function patakiDateTuple(d){return[d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate()]}
function patakiShiftDate(d,delta){return new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()+delta))}
function patakiLocalMidnightUTC(d,tz){return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())-tz*36e5}
function patakiSolarTimes(d,tz,lat,lon){
 const [Y,Mo,D]=patakiDateTuple(d),noon=patakiLocalMidnightUTC(d,tz)+12*36e5,r=calc(noon/864e5+2440587.5,lat,lon);
 return sunInfo(Y,Mo,D,12,lat,lon,tz,r.sid.Sun+r.ay)
}
function patakiGulika(sid,birthMs,tz,lat,lon){
 try{
  const bd=patakiLocalDate(birthMs,tz),clock=bd.getUTCHours()+bd.getUTCMinutes()/60,day=patakiSolarTimes(bd,tz,lat,lon);
  if(!Number.isFinite(day.vRise)||!Number.isFinite(day.vSet)||day.vSet<=day.vRise)return null;
  let startDate,endDate,startH,endH,weekDate;
  if(clock>=day.vRise&&clock<day.vSet){startDate=bd;endDate=bd;startH=day.vRise;endH=day.vSet;weekDate=bd}
  else if(clock<day.vRise){startDate=patakiShiftDate(bd,-1);endDate=bd;startH=patakiSolarTimes(startDate,tz,lat,lon).vSet;endH=day.vRise;weekDate=startDate}
  else{startDate=bd;endDate=patakiShiftDate(bd,1);startH=day.vSet;endH=patakiSolarTimes(endDate,tz,lat,lon).vRise;weekDate=bd}
  if(!Number.isFinite(startH)||!Number.isFinite(endH))return null;
  const start=patakiLocalMidnightUTC(startDate,tz)+startH*36e5,end=patakiLocalMidnightUTC(endDate,tz)+endH*36e5,duration=end-start;
  if(duration<=0)return null;
  const weekday=weekDate.getUTCDay(),lordOrder=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
  const dayBirth=clock>=day.vRise&&clock<day.vSet,first=(weekday+(dayBirth?0:4))%7,order=Array.from({length:7},(_,i)=>lordOrder[(first+i)%7]),saturnPart=order.indexOf('Saturn');
  const mandiMs=start+duration/8*saturnPart,jd=mandiMs/864e5+2440587.5;
  return calc(jd,lat,lon).sid.Lagna;
 }catch(e){return null}
}
function patakiBodies(sid,birthMs,tz,lat,lon){
 const dhoom=((sid.Sun+133+20/60)%360+360)%360,vyatipat=(360-dhoom)%360,parivesh=(vyatipat+180)%360,chap=(360-parivesh)%360,upaketu=(chap+16+40/60)%360,gulika=patakiGulika(sid,birthMs,tz,lat,lon);
 return[...PNA.map(name=>({name,longitude:sid[name],sign:Math.floor(sid[name]/30)})),...[["Dhoom",dhoom],["Vyatipat",vyatipat],["Parivesh",parivesh],["Chap",chap],["Upaketu",upaketu],["Gulika (Mandi)",gulika]].map(([name,longitude])=>({name,longitude,sign:Number.isFinite(longitude)?Math.floor(longitude/30):null}))];
}
function patakiDiagram(sid,bodies,focus='both'){
 const asc=Math.floor(sid.Lagna/30),moon=Math.floor(sid.Moon/30);
 const targets=[...(focus==='both'||focus==='lagna'?[{name:'Lagna',sign:asc,cls:'pataki-lagna-mark'}]:[]),...(focus==='both'||focus==='moon'?[{name:'Moon',sign:moon,cls:'pataki-moon-mark'}]:[])];
 const W=PAT_X0*2+PAT_DX*4,H=PAT_Y0+PAT_DY*4+86,xL=PAT_X0,xR=PAT_X0+PAT_DX*4,yT=PAT_Y0,yB=PAT_Y0+PAT_DY*4;
 // skeleton: the three flagged verticals, three horizontals and the diagonals
 const sk=[];
 for(const c of[1,2,3]){const x=PAT_X0+c*PAT_DX;sk.push(`<path class="pataki-grid-line" d="M${x} ${yT-30}V${yB}"/>`,`<path class="pataki-flag" d="M${x} ${yT-30}L${x-26} ${yT-17}L${x} ${yT-4}"/>`)}
 for(const r of[1,2,3]){const y=PAT_Y0+r*PAT_DY;sk.push(`<path class="pataki-grid-line" d="M${xL} ${y}H${xR}"/>`)}
 for(const[a,b]of PAT_LINKS){const[x1,y1]=patXY(a),[x2,y2]=patXY(b);if(x1!==x2&&y1!==y2)sk.push(`<path class="pataki-grid-line" d="M${x1} ${y1}L${x2} ${y2}"/>`)}
 // highlight: lines that join the focus sign to a sign holding bodies
 const lines=[],seen=new Set();
 for(const t of targets)for(const b of bodies){if(b.sign===null||b.sign===t.sign||!PAT_NB[t.sign].includes(b.sign)||(t.name==='Moon'&&b.name==='Moon'))continue;const k=t.name+b.sign;if(seen.has(k))continue;seen.add(k);const[x1,y1]=patXY(b.sign),[x2,y2]=patXY(t.sign);lines.push(`<line class="pataki-vedha-line ${t.cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`)}
 const nodes=Array.from({length:12},(_,s)=>{
  const[x,y]=patXY(s),names=[...(s===asc?[shortPl('As')]:[]),...bodies.filter(b=>b.sign===s).map(b=>shortPl(PAT_SHORT[b.name]||b.name))],rows=[];
  for(let i=0;i<names.length;i+=3)rows.push(names.slice(i,i+3).join(' '));
  const col=PAT_NODE[s][0],row=PAT_NODE[s][1],top=row===0&&col>0&&col<4,bot=row===4,left=col===0,
   anchor=left?'end':top||bot?'middle':'start',
   tx0=left?x-9:top||bot?x:x+9,
   ly=top?y-40:bot?y+19:y-6,
   py=top?y-40+13:bot?y+19+13:y+8,
   pxo=top?x+8:tx0,pAnchor=top?'start':anchor;
  const cls=[...(s===asc?['pataki-lagna-mark']:[]),...(s===moon?['pataki-moon-mark']:[])].join(' ');
  const plan=rows.map((r,i)=>`<text class="pataki-house-planets" x="${pxo}" y="${py+i*12}" text-anchor="${pAnchor}">${r}</text>`).join('');
  return`<g class="pataki-house ${cls}"><title>${tx(SG[s])}${names.length?' · '+names.join(', '):''}</title><text class="pataki-house-sign" x="${tx0}" y="${ly}" text-anchor="${anchor}">${shortSign(s)}</text>${plan}</g>`}).join('');
 return`<svg class="pataki-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${tx('Tripataki chakra')}"><title>${tx('Tripataki chakra')}</title><desc>${tx('Fixed-sign Tripataki chakra. Signs joined by a straight line are in vedha; highlighted lines join the Lagna or Moon sign to signs that hold bodies.')}</desc>${sk.join('')}${lines.join('')}${nodes}</svg>`
}
function patakiEvidenceRows(sid,bodies){
 const asc=Math.floor(sid.Lagna/30),moon=Math.floor(sid.Moon/30),targets=[['Lagna',asc,null],['Moon',moon,'Moon']];
 return targets.map(([name,sign,exclude])=>{const hits=bodies.filter(b=>b.name!==exclude&&b.sign!==null&&pAff(b.sign).includes(sign));return`<tr><td>${tx(name)}</td><td>${tx(SG[sign])}</td><td class="w">${hits.length?hits.map(b=>tx(b.name)).join(', '):'—'}</td></tr>`}).join('')
}
function patakiCard(sid,birthMs,tz,lat,lon,ay){
 const bodies=patakiBodies(sid,birthMs,tz,lat,lon);
 const lords=patakiCalcLords(birthMs,tz,lat,lon);
 const pred=patakiEvaluatePredictions(sid,bodies,lords,birthMs);

 const rows=bodies.map(b=>b.sign===null?`<tr><td>${tx(b.name)}</td><td colspan="3">${tx('Unavailable')}</td></tr>`:
  `<tr><td>${tx(b.name)}</td><td>${tx(SG[b.sign])}</td><td>${(b.sign-Math.floor(sid.Lagna/30)+12)%12+1}</td><td class="w">${pAff(b.sign).map(x=>tx(SG[x])).join(', ')}</td></tr>`).join('');

 const currentFocus='both',focusText=`<label for="pataki-focus">${tx('Highlight vedha to')}</label><select id="pataki-focus"><option value="both">${tx('Lagna and Moon')}</option><option value="lagna">${tx('Lagna only')}</option><option value="moon">${tx('Moon only')}</option></select>`;

 const lordsHtml = lords ? `
  <div class="pataki-lords-banner">
    <div class="pataki-lord-item"><span>${tx('Birth Period')}:</span> <b>${lords.isDayBirth ? tx('Day Birth (Dinmana)') : tx('Night Birth (Ratrimana)')}</b></div>
    <div class="pataki-lord-item"><span>${tx('Yamardha (Ardhayama)')}:</span> <b>#${lords.ardhayamaIndex}</b> (${tx(lords.ardhayamesh)})</div>
    <div class="pataki-lord-item"><span>${tx('Yamadandadhipati (Dandesh)')}:</span> <b class="pataki-dandesh-tag">${tx(lords.dandesh)}</b> (${tf('Danda #{n}',{n:lords.dandaIndex})})</div>
  </div>` : '';

 const remediesList = pred && pred.remedies.length ? `
  <div class="pataki-remedies-section">
    <h4>${tx('Classical Remedies Prescribed in Book')}</h4>
    <ul>${pred.remedies.map(r => `<li>${tx(r)}</li>`).join('')}</ul>
  </div>` : '';

 const predHtml = pred ? `
  <div class="pataki-prediction-box ${pred.categoryClass}">
    <div class="pataki-pred-header">
      <span class="pataki-pred-badge">${tx(pred.category)}</span>
      <span class="pataki-year-badge ${pred.yearAlertClass}">${tx(pred.yearAssessment)}</span>
    </div>
    <p class="pataki-pred-desc">${tx(pred.summary)}</p>
    <div class="pataki-rashi-metrics">
      <span><b>${tx('Lagna')} (${tx(SG[pred.ascSign])}):</b> ${tf('Fixed No: {n}, Lifespan: {y} yrs',{n:PAT_RASHI_METRICS[pred.ascSign].num,y:PAT_RASHI_METRICS[pred.ascSign].years})}</span>
      <span><b>${tx('Moon')} (${tx(SG[pred.moonSign])}):</b> ${tf('Fixed No: {n}, Lifespan: {y} yrs',{n:PAT_RASHI_METRICS[pred.moonSign].num,y:PAT_RASHI_METRICS[pred.moonSign].years})}</span>
      <span><b>${tx('Vulnerable Signs/Years')}:</b> ${pred.vulnerableSignNumbers.join(', ')}</span>
    </div>
    ${remediesList}
  </div>` : '';

 return `<div class="card sc pataki-card">
  <div class="section-heading">
    <span class="step">PRC</span>
    <div>
      <h2>${tx('Pataki Rishta Chakra & Mishap Prediction')}</h2>
      <p class="bphs-intro">${tx('Special diagnostic technique for finding mishaps in the lives of children and youth up to 24 years (Shalini Dhasmana under K.N. Rao).')}</p>
    </div>
  </div>
  ${lordsHtml}
  ${predHtml}
  <div class="pataki-layout">
    <div class="pataki-diagram-wrap">
      <div class="pataki-controls">${focusText}</div>
      <div id="pataki-diagram">${patakiDiagram(sid,bodies,currentFocus)}</div>
      <div class="pataki-legend">
        <span><i class="legend-lagna"></i> ${tx('Birth Lagna')}</span>
        <span><i class="legend-moon"></i> ${tx('Moon')}</span>
        <span><i class="legend-vedha"></i> ${tx('Vedha line')}</span>
      </div>
    </div>
    <div class="pataki-side">
      <h3>${tx('Vedha Ray Matrix')}</h3>
      <div class="sc">
        <table>
          <thead><tr><th>${tx('Focus')}</th><th>${tx('Sign')}</th><th>${tx('Vedha Influences')}</th></tr></thead>
          <tbody>${patakiEvidenceRows(sid,bodies)}</tbody>
        </table>
      </div>
      <h3>${tx('Planetary Placements & Vedha Targets')}</h3>
      <div class="sc">
        <table>
          <thead><tr><th>${tx('Body')}</th><th>${tx('Sign')}</th><th>${tx('House')}</th><th>${tx('Linked Signs')}</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="pataki-notice">
    <b>${tx('Classical Rule Reference:')}</b> ${tx('Based on Ayu Nirnay, Panchaswarah, and research by Shalini Dhasmana / K.N. Rao. Vedha by a malefic Yamadandadhipati (Dandesh) indicates acute distress. Benefic counter-Vedha provides Arishta Bhanga (protection and recovery).')}
  </div>
</div>`;
}
function bindPataki(sid,birthMs,tz,lat,lon){const el=document.getElementById('pataki-focus'),host=document.getElementById('pataki-diagram');if(!el||!host)return;const bodies=patakiBodies(sid,birthMs,tz,lat,lon);el.onchange=()=>{host.innerHTML=patakiDiagram(sid,bodies,el.value)}}


// ============================================================================
// PATAKI RISHTA CHAKRA PREDICTIVE ENGINE (Shalini Dhasmana & K.N. Rao)
// ============================================================================

const PAT_RASHI_METRICS = {
  0:  { name: 'Aries',       num: 10, altNum: 16, years: 16, mobility: 'movable' },
  1:  { name: 'Taurus',      num: 6,  altNum: 6,  years: 17, mobility: 'fixed' },
  2:  { name: 'Gemini',      num: 20, altNum: 20, years: 39, mobility: 'dual' },
  3:  { name: 'Cancer',      num: 5,  altNum: 5,  years: 19, mobility: 'movable' },
  4:  { name: 'Leo',         num: 8,  altNum: 8,  years: 17, mobility: 'fixed' },
  5:  { name: 'Virgo',       num: 2,  altNum: 2,  years: 36, mobility: 'dual' },
  6:  { name: 'Libra',       num: 20, altNum: 20, years: 26, mobility: 'movable' },
  7:  { name: 'Scorpio',     num: 6,  altNum: 6,  years: 17, mobility: 'fixed' },
  8:  { name: 'Sagittarius', num: 10, altNum: 10, years: 29, mobility: 'dual' },
  9:  { name: 'Capricorn',   num: 14, altNum: 14, years: 26, mobility: 'movable' },
  10: { name: 'Aquarius',    num: 3,  altNum: 3,  years: 17, mobility: 'fixed' },
  11: { name: 'Pisces',      num: 4,  altNum: 4,  years: 29, mobility: 'dual' }
};

const PAT_HALVING_DAY = { 1: 8, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3, 8: 4 };
const PAT_NUM_TO_PLANET = { 1: 'Sun', 2: 'Moon', 3: 'Mars', 4: 'Mercury', 5: 'Jupiter', 6: 'Venus', 7: 'Saturn', 8: 'Rahu' };

function patakiCalcLords(birthMs, tz, lat, lon) {
  const bd = patakiLocalDate(birthMs, tz);
  const clock = bd.getUTCHours() + bd.getUTCMinutes() / 60 + bd.getUTCSeconds() / 3600;
  const day = patakiSolarTimes(bd, tz, lat, lon);
  if (!Number.isFinite(day.vRise) || !Number.isFinite(day.vSet)) return null;

  const isDayBirth = (clock >= day.vRise && clock < day.vSet);
  let spanHours, elapsedHours, weekDate;

  if (isDayBirth) {
    spanHours = day.vSet - day.vRise;
    elapsedHours = clock - day.vRise;
    weekDate = bd;
  } else {
    let riseNext = day.vRise, setPrev = day.vSet;
    if (clock < day.vRise) {
      weekDate = patakiShiftDate(bd, -1);
      const prevTimes = patakiSolarTimes(weekDate, tz, lat, lon);
      setPrev = prevTimes.vSet;
      riseNext = day.vRise;
      elapsedHours = (24 - setPrev) + clock;
      spanHours = (24 - setPrev) + riseNext;
    } else {
      weekDate = bd;
      const nextTimes = patakiSolarTimes(patakiShiftDate(bd, 1), tz, lat, lon);
      riseNext = nextTimes.vRise;
      setPrev = day.vSet;
      elapsedHours = clock - setPrev;
      spanHours = (24 - setPrev) + riseNext;
    }
  }

  const ardhayamDur = spanHours / 8;
  const dandamanDur = ardhayamDur / 4;
  const ardhayamIdx = Math.min(7, Math.max(0, Math.floor(elapsedHours / ardhayamDur)));
  const dandaIdx = Math.min(3, Math.max(0, Math.floor((elapsedHours % ardhayamDur) / dandamanDur)));

  const weekday = weekDate.getUTCDay();
  const dayLordNum = weekday === 0 ? 1 : weekday + 1; // 1: Sun to 7: Sat

  let ardhayameshNum = dayLordNum;
  for (let i = 0; i < ardhayamIdx; i++) {
    ardhayameshNum = isDayBirth ? (((ardhayameshNum + 4) % 7) + 1) : (((ardhayameshNum + 3) % 7) + 1);
  }

  let dandeshNum = ardhayameshNum;
  if (isDayBirth) {
    for (let d = 0; d < dandaIdx; d++) {
      dandeshNum = PAT_HALVING_DAY[dandeshNum] || 1;
    }
  } else {
    for (let d = 0; d < dandaIdx; d++) {
      dandeshNum = ((dandeshNum + 4) % 7) + 1;
    }
  }

  return {
    isDayBirth,
    ardhayamaIndex: ardhayamIdx + 1,
    dandaIndex: dandaIdx + 1,
    ardhayamesh: PAT_NUM_TO_PLANET[ardhayameshNum],
    dandesh: PAT_NUM_TO_PLANET[dandeshNum]
  };
}

function patakiEvaluatePredictions(sid, bodies, lords, birthMs) {
  if (!lords) return null;
  const ascSign = Math.floor(sid.Lagna / 30);
  const moonSign = Math.floor(sid.Moon / 30);
  const sunSign = Math.floor(sid.Sun / 30);

  const lagnaVedhaBodies = bodies.filter(b => b.sign !== null && pAff(b.sign).includes(ascSign));
  const moonVedhaBodies = bodies.filter(b => b.sign !== null && b.name !== 'Moon' && pAff(b.sign).includes(moonSign));
  const sunVedhaBodies = bodies.filter(b => b.sign !== null && b.name !== 'Sun' && pAff(b.sign).includes(sunSign));

  const naturalMalefics = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu', 'Gulika (Mandi)', 'Dhoom', 'Parivesh'];
  const naturalBenefics = ['Jupiter', 'Venus'];

  const lagnaMalefics = lagnaVedhaBodies.filter(b => naturalMalefics.includes(b.name));
  const lagnaBenefics = lagnaVedhaBodies.filter(b => naturalBenefics.includes(b.name));
  const moonMalefics = moonVedhaBodies.filter(b => naturalMalefics.includes(b.name));
  const moonBenefics = moonVedhaBodies.filter(b => naturalBenefics.includes(b.name));

  const dandeshStrikesLagna = lagnaVedhaBodies.some(b => b.name === lords.dandesh);
  const dandeshStrikesMoon = moonVedhaBodies.some(b => b.name === lords.dandesh);
  const isDandeshMalefic = naturalMalefics.includes(lords.dandesh);

  const nowMs = Date.now();
  const ageYears = (nowMs - birthMs) / (365.25 * 864e5);
  const currentRunningYear = Math.floor(ageYears) + 1;
  const isWithinPatakiAge = ageYears >= 0 && ageYears <= 24;

  const vulnerableSignNumbers = [
    PAT_RASHI_METRICS[ascSign].num,
    PAT_RASHI_METRICS[ascSign].altNum,
    PAT_RASHI_METRICS[moonSign].num,
    PAT_RASHI_METRICS[moonSign].altNum
  ];

  const isYearActiveByNumber = vulnerableSignNumbers.includes(currentRunningYear) || vulnerableSignNumbers.includes(Math.floor(ageYears));
  const isYearActiveByFixedLifespan = (currentRunningYear === PAT_RASHI_METRICS[ascSign].years || currentRunningYear === PAT_RASHI_METRICS[moonSign].years);

  let yearAssessment = '';
  let yearAlertClass = 'pataki-year-safe';

  if (!isWithinPatakiAge) {
    yearAssessment = tf('Native is currently {age} years old (past the 24-year Yogarishta threshold of Pataki Rishta Chakra).',{age:Math.floor(ageYears)});
  } else if ((dandeshStrikesLagna || dandeshStrikesMoon) && (isYearActiveByNumber || isYearActiveByFixedLifespan)) {
    yearAssessment = tf('ACTIVE RISK IN CURRENT YEAR (year {yr}): Critical Pataki Rishta alignment matches the Fixed Number / Lifespan Years of afflicted sign(s) ({nums}). Health cautions and classical remedies advised.',{yr:currentRunningYear,nums:[...new Set(vulnerableSignNumbers)].join(', ')});
    yearAlertClass = 'pataki-year-danger';
  } else if (dandeshStrikesLagna || dandeshStrikesMoon) {
    yearAssessment = tf('POTENTIAL RISK IN CURRENT YEAR (year {yr}): Dandesh ({d}) afflicts Lagna/Moon. Vulnerability peaks during years/months {a} and {b}.',{yr:currentRunningYear,d:tx(lords.dandesh),a:PAT_RASHI_METRICS[ascSign].num,b:PAT_RASHI_METRICS[moonSign].num});
    yearAlertClass = 'pataki-year-warning';
  } else {
    yearAssessment = tf('PROTECTED IN CURRENT YEAR (year {yr}): Neither Lagna nor Moon receives direct Vedha from the Yamadandadhipati ({d}). Standard health indicated.',{yr:currentRunningYear,d:tx(lords.dandesh)});
  }

  let category = 'PROTECTED';
  let categoryClass = 'pataki-status-saved';
  let summary = '';
  const remedies = [];

  const panchaswarahFatal = (dandeshStrikesLagna || dandeshStrikesMoon) && 
                            (lagnaMalefics.length >= 3 || moonMalefics.length >= 3) && 
                            isDandeshMalefic;

  if (panchaswarahFatal) {
    category = 'NOT SAVED / HIGH ARISHTA RISK';
    categoryClass = 'pataki-status-fatal';
    summary = tf('Severe Panchaswarah Malefic Vedha: The Yamadandadhipati ({d}) strikes together with multiple natural malefics. Even benefic placements in Kendras cannot prevent mishap; danger peaks in days/months matching sign numbers ({nums}). Immediate classical propitiation is vital.',{d:tx(lords.dandesh),nums:[...new Set(vulnerableSignNumbers)].join(', ')});
    
    remedies.push('Maha Mrityunjaya Japa: Continuous chanting (125,000 recitations with Homa) by competent Vedic pandits to avert Akala Mrityu.');
    remedies.push('Kamakhya Ambuvachi Prasad Cloth: Procure sanctified red cloth from Maa Kamakhya Peetha (Guwahati, Assam) and tie as a protective amulet.');
    remedies.push(tf('Graha Shanti for Dandesh ({d}): Ritual propitiation, Telabhisheka (if Saturn), or Durga Saptashati patha (if Rahu).',{d:tx(lords.dandesh)}));
    remedies.push('Gandanta Moola Shanti: If born in Gandamoola nakshatra, perform complete Moola Shanti on the 27th day after birth when Moon returns to the birth star.');
  } else if ((dandeshStrikesLagna || dandeshStrikesMoon) && (lagnaBenefics.length > 0 || moonBenefics.length > 0)) {
    category = 'SAVED / ARISHTA BHANGA';
    categoryClass = 'pataki-status-saved';
    summary = tf('Arishta Bhanga Operative: While Dandesh ({d}) or malefics induce an acute health emergency, strong counter-Vedha from natural benefics (Jupiter/Venus) or Lagna Lord neutralizes fatality. Full recovery is assured.',{d:tx(lords.dandesh)});
    
    remedies.push('Maha Mrityunjaya Japa: Chanting 11 malas daily during critical illness or surgical recovery.');
    remedies.push('Kamakhya Ambuvachi Amulet: Keep sanctified cloth near native to accelerate recovery.');
    remedies.push(tf('Dandesh Pacification: Recitation of Dasharatha Shani Stotra or Navagraha Stotram for {d}.',{d:tx(lords.dandesh)}));
  } else if ((lagnaMalefics.length >= 2 || moonMalefics.length >= 2) && (lagnaBenefics.length > 0)) {
    category = 'LEFT HANDICAPPED / PHYSICAL VULNERABILITY';
    categoryClass = 'pataki-status-handicap';
    summary = tf('Conflicting Benefic & Malefic Rays: Malefic Vedha from Dandesh ({d}) damages bodily or mental significations, but benefic rays preserve life, potentially leaving a physical, auditory, or speech impairment.',{d:tx(lords.dandesh)});
    
    remedies.push('Lord Dakshinamurti Stotram: Recitation for intellectual, speech, and neurological protection.');
    remedies.push('Maha Mrityunjaya Mantra & Shiva Abhishekam on Mondays.');
    remedies.push(tf('Propitiation of {d} and afflicted Karaka planets.',{d:tx(lords.dandesh)}));
  } else if (!dandeshStrikesLagna && !dandeshStrikesMoon && sunVedhaBodies.length >= 3) {
    category = 'COLLATERAL MISHAP (PARENTS / FAMILY)';
    categoryClass = 'pataki-status-family';
    summary = "Child Protected, Parental Significations Afflicted: Malefic Vedha bypasses the child's Lagna and concentrates on Sun/9th house (father) or Moon/4th house (mother), transferring the crisis to parents.";
    
    remedies.push('Aditya Hridaya Stotram recitation for father\'s longevity and health.');
    remedies.push('Gauri Puja and Moon propitiation for mother\'s well-being.');
  } else {
    category = 'UNDER OBSERVATION / BASICALLY PROTECTED';
    categoryClass = 'pataki-status-obs';
    summary = tf('Favourable Alignment: The Yamadandadhipati ({d}) does not form lethal Vedha with Lagna or Moon. Normal vitality and protection apply.',{d:tx(lords.dandesh)});
    remedies.push('Regular recitation of Navagraha Stotram and general health maintenance.');
  }

  return {
    category,
    categoryClass,
    summary,
    remedies,
    yearAssessment,
    yearAlertClass,
    currentRunningYear,
    isWithinPatakiAge,
    vulnerableSignNumbers: [...new Set(vulnerableSignNumbers)],
    ascSign,
    moonSign
  };
}
