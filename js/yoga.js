// Pancha Mahapurusha yogas and chara karakas (BPHS scheme with Rahu).
// Rules follow the classical texts and were cross-checked against kunjara/jyotish (GPL-2.0-or-later).
const EX={Sun:0,Moon:1,Mars:9,Mercury:5,Jupiter:3,Venus:11,Saturn:6},
 OWN={Sun:[4],Moon:[3],Mars:[0,7],Mercury:[2,5],Jupiter:[8,11],Venus:[1,6],Saturn:[9,10]},
 MP={Mars:'Ruchaka',Mercury:'Bhadra',Jupiter:'Hamsa',Venus:'Malavya',Saturn:'Shasha'},
 KARAKA_NAMES=['Atmakaraka','Amatyakaraka','Bhratrukaraka','Matrukaraka','Pitrukaraka','Putrakaraka','Gnatikaraka','Darakaraka'];
function yogas(sid){
 const L=Math.floor(sid.Lagna/30),sg=k=>Math.floor(sid[k]/30);
 const mp=Object.keys(MP).map(p=>{const h=(sg(p)-L+12)%12+1,dig=sg(p)==EX[p]?tx('exalted'):OWN[p].includes(sg(p))?tx('own sign'):'',ok=dig&&[1,4,7,10].includes(h);
  return`<tr><td>${tx(MP[p])}</td><td>${tx(p)}</td><td>${SG[sg(p)]}${dig?' ('+dig+')':''}, ${tx('house')} ${h}</td><td>${ok?'<b>Present</b>':'No'}</td><td>${ok?bphsYogaOutcome(MP[p],75):'—'}</td></tr>`}).join('');
  return`<div class="card sc yoga-results-card"><h2>Pancha Mahapurusha yogas</h2><table><tr><th>Yoga</th><th>Planet</th><th>Placement</th><th>Status</th><th>Traditional BPHS result</th></tr>${mp}</table><small>BPHS Ch. 75: formation is a planet in its own or exalted sign and in a kendra from the Lagna. Textual results are shown as written/paraphrased in the source; strength, exceptions and period activation are not fully calculated.</small></div>`}


// BPHS Ch.35, 37 and 38: deterministic sign/house formations only.
// Results are loaded separately from the chapter-indexed source data below.
const P7=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
const NON_SUN_GRAHAS=['Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
const SUN_YOGA_GRAHAS=['Mars','Mercury','Jupiter','Venus','Saturn'];
const signOf=(sid,p)=>Math.floor(sid[p]/30);
const houseFromSign=(from,to)=>((to-from+12)%12)+1;
const housesOf=(sid,from,planets=P7)=>planets.map(p=>houseFromSign(from,signOf(sid,p)));
const uniq=a=>[...new Set(a)];
const subset=(a,b)=>a.every(x=>b.includes(x));
const sameSet=(a,b)=>a.length===b.length&&subset(a,b);
const signGroup=s=>s%3; // 0 movable, 1 fixed, 2 dual
const GROUP_NAMES=['Movable','Fixed','Dual'];
const SIGN_GROUP_SIGNS=[[0,3,6,9],[1,4,7,10],[2,5,8,11]];
const SANKHYA_NAMES=['Gola','Yuga','Soola','Kedara','Paasha','Daama','Veena'];
let BPHS_YOGA_RECORDS=[],BPHS_AS={};
const yogaNorm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(yoga|yog|nabhasa|pattern|basic|mahapurusha|sankhya)\b/g,'').replace(/[^a-z0-9]/g,'');
const yogaEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const BPHS_SENSITIVE_RESULT=/\b(?:death|die|dies|dying|kill(?:er|ers|ing|ed)?|murder|fatal(?:ity)?|longevity|life ?span|long[- ]lived|short life|at age \d+|age of \d+|years? old|heavenly abode|heavenly world|passed away|depart(?:s|ed)? this life|left this world|disease(?:s|d)?|illness|health|healthy|weapon(?:s)?|blind(?:ness)?|deaf|disabled|disability|leprosy|palsy|suicide|cancer|wound(?:s)?|injur(?:y|ies)|pregnan(?:t|cy)|fertil(?:e|ity)|barren|infertil(?:e|ity)|childless|miscarriage|progeny)\b/i;
function bphsSafeSourceText(value){const parts=String(value||'').split(/(?<=[,;.!?])\s+/),safe=[];let redacted=false;parts.forEach((part,i)=>{if(BPHS_SENSITIVE_RESULT.test(part)){redacted=true;const prev=safe[safe.length-1];if(prev&&/^as (?:a |the )?(?:ruler|king|queen|emperor|lord)\b/i.test(prev.trim()))safe.pop();return}safe.push(part)});let text=safe.join(' ').replace(/\s+/g,' ').replace(/^[,;:.!?]+\s*/,'').replace(/[,;:.!?]+\s*$/,'').trim();if(!text)text='Sensitive health, longevity, or mortality claims are omitted from this view.';if(typeof LANG!=='undefined'&&LANG==='as'&&BPHS_AS[text])text=BPHS_AS[text];return{text,redacted}}
function bphsYogaRecordsFor(name,chapter){
 const key=yogaNorm(name),aliases={
  sunapha:['sunaph'],sunaph:['sunapha'],anapha:['anaph'],anaph:['anapha'],duradhara:['duradhar'],duradhar:['duradhara'],
  kemadrumabasicpattern:['kemadruma','kemadrum'],kemadruma:['kemadrumabasicpattern','kemadrum'],kemadrum:['kemadruma','kemadrumabasicpattern'],
  sakata:['sakat'],sakat:['sakata'],vihaga:['vihag'],vihag:['vihaga'],shringataka:['shringatak'],shringatak:['shringataka'],
  kamala:['kamal'],kamal:['kamala'],chakra:['chakr'],chakr:['chakra'],samudra:['samudr'],samudr:['samudra'],
  chap:['chapdhanushi'],chapdhanushi:['chap'],soola:['sool'],sool:['soola'],paasha:['paash'],paash:['paasha'],
  daama:['daam','daamini','daamdaamini'],daam:['daama','daamini','daamdaamini'],daamini:['daam','daama','daamdaamini'],
  ardhchandra:['ardhcandr'],ardhcandr:['ardhchandra'],
  shasha:['sasa'],sasa:['shasha']
 },keys=[key,...(aliases[key]||[]).map(yogaNorm)];
 return BPHS_YOGA_RECORDS.filter(r=>Number(r.chapter)===Number(chapter)&&keys.includes(yogaNorm(r.name)))}
function bphsYogaOutcome(name,chapter){
 const records=bphsYogaRecordsFor(name,chapter);
 if(!records.length)return`<p class="analysis-result"><b>BPHS result:</b> A result entry for this detected formation was not matched in the source index.</p>`;
 return records.map(r=>{
  const verse=r.verse_reference?` · ${yogaEsc(r.verse_reference)}`:'';
  const safeResult=bphsSafeSourceText(r.traditional_result||'The cited passage gives the formation but no distinct result statement.');
  const result=`${yogaEsc(safeResult.text)}${safeResult.redacted?'. <span class="historical-redaction">[Sensitive health, longevity, or mortality claims omitted.]</span>':''}`;
  const qualifierItems=(r.result_conditions||[]).map(bphsSafeSourceText),qualifiers=qualifierItems.length?`<p class="analysis-qualifier"><b>Source qualifications:</b> ${qualifierItems.some(x=>x.redacted)?'Some sensitive qualifications from the cited passage are omitted.':qualifierItems.map(x=>yogaEsc(x.text)).join(' ')}</p>`:'';
  return`<div class="analysis-result-block"><p class="analysis-result"><b>Historical BPHS text (not a prediction)${verse}:</b> ${result}</p>${qualifiers}</div>`
 }).join('')}
function classicalAnalysis(sid){
 const L=signOf(sid,'Lagna'), rows=[];
 const add=(name,condition,detail,source,status='Present')=>rows.push({name,condition,detail,source,status});
 // Ch.37 literally says any Graha other than Sūrya; the modeled nodes are included.
 const moonSecond=NON_SUN_GRAHAS.filter(p=>houseFromSign(signOf(sid,'Moon'),signOf(sid,p))===2);
 const moonTwelfth=NON_SUN_GRAHAS.filter(p=>houseFromSign(signOf(sid,'Moon'),signOf(sid,p))===12);
 if(moonSecond.length&&moonTwelfth.length){
  add('Duradhara Yoga','Eligible planets occur in both the 2nd and 12th signs from the Moon.',`2nd: ${moonSecond.join(', ')} · 12th: ${moonTwelfth.join(', ')}`,'BPHS Ch. 37, vv. 7–10');
 }else if(moonSecond.length){
  add('Sunapha Yoga','One or more eligible planets occur in the 2nd sign from the Moon.',moonSecond.join(', '),'BPHS Ch. 37, vv. 7–10');
 }else if(moonTwelfth.length){
  add('Anapha Yoga','One or more eligible planets occur in the 12th sign from the Moon.',moonTwelfth.join(', '),'BPHS Ch. 37, vv. 7–10');
 }else{
  const moonConjunction=NON_SUN_GRAHAS.filter(p=>signOf(sid,p)===signOf(sid,'Moon'));
  const nonSunKendra=NON_SUN_GRAHAS.filter(p=>[1,4,7,10].includes(houseFromSign(L,signOf(sid,p))));
  if(!moonConjunction.length&&!nonSunKendra.length)
   add('Kema Druma basic pattern','No Graha other than the Sun is with the Moon, in the 2nd or 12th from the Moon, or in a kendra from the Lagna.',`Conjunction check and kendra check use all modeled non-Sun Grahas, including Rahu/Ketu. Other strength or exception rules are not assessed.`,'BPHS Ch. 37, vv. 11–13','Basic pattern');
 }
 // Sun-centered Vesi/Vosi family; Moon is excluded by the source rule.
 // The supplied text says “Graha among Mangala etc.” without listing the full set;
 // use the five visible non-luminary planets conservatively and disclose that limit.
 const sunSecond=SUN_YOGA_GRAHAS.filter(p=>houseFromSign(signOf(sid,'Sun'),signOf(sid,p))===2);
 const sunTwelfth=SUN_YOGA_GRAHAS.filter(p=>houseFromSign(signOf(sid,'Sun'),signOf(sid,p))===12);
 if(sunSecond.length&&sunTwelfth.length)
  add('Ubhayachari Yoga','Eligible planets occur in both the 2nd and 12th signs from the Sun.',`2nd: ${sunSecond.join(', ')} · 12th: ${sunTwelfth.join(', ')}`,'BPHS Ch. 38, vv. 1–4');
 else if(sunSecond.length)
  add('Vesi Yoga','One or more eligible planets occur in the 2nd sign from the Sun.',sunSecond.join(', '),'BPHS Ch. 38, vv. 1–4');
 else if(sunTwelfth.length)
  add('Vosi Yoga','One or more eligible planets occur in the 12th sign from the Sun.',sunTwelfth.join(', '),'BPHS Ch. 38, vv. 1–4');

 // Moon's house group relative to Sun (Ch.37 v.1); shown as a placement class only.
 const moonFromSun=houseFromSign(signOf(sid,'Sun'),signOf(sid,'Moon'));
 const moonGroup=([1,4,7,10].includes(moonFromSun)?'Kendra':([2,5,8,11].includes(moonFromSun)?'Panaphara':'Apoklima'));
 add('Moon from Sun: '+moonGroup,`Moon occupies house ${moonFromSun} by sign-count from the Sun.`,'Placement classification only; no result is inferred here.','BPHS Ch. 37, v. 1','Placement');

 // Nabhasa patterns (Ch.35): conservative P7-only membership; nodes excluded.
 const hs=housesOf(sid,L),occupied=uniq(hs),sgs=P7.map(p=>signOf(sid,p));
 const asraya=GROUP_NAMES.map((g,i)=>({g,i})).find(x=>sgs.every(s=>signGroup(s)===x.i));
 if(asraya){
  const label=['Rajju','Musala','Nala'][asraya.i];
  add(label+' Nabhasa pattern',`All seven classical planets occupy ${asraya.g.toLowerCase()} signs.`,`${occupied.length} distinct Lagna-relative houses represented.`,'BPHS Ch. 35, v. 7');
 }
 const pairPatterns=[
  {name:'Gada',sets:[[1,4],[4,7],[7,10],[10,1]]},
  {name:'Sakata',sets:[[1,7]]},
  {name:'Vihaga',sets:[[4,10]]},
  {name:'Shringataka',sets:[[1,5,9]]},
  {name:'Hal',sets:[[2,6,10],[3,7,11],[4,8,12]]}
 ];
 for(const pat of pairPatterns){
  const hit=pat.sets.find(set=>subset(occupied,set));
  if(hit)add(pat.name+' Nabhasa pattern',`All seven classical planets are confined to houses ${hit.join(', ')} from the Lagna.`,`Occupied houses: ${occupied.join(', ')}.`,'BPHS Ch. 35, vv. 9–10');
 }
 const houseWindow=(start,length)=>Array.from({length},(_,i)=>((start+i-1)%12)+1);
 const fourHousePatterns=[{name:'Yup',start:1},{name:'Shar',start:4},{name:'Shakti',start:7},{name:'Danda',start:10}];
 for(const pat of fourHousePatterns){
  const set=houseWindow(pat.start,4);
  if(subset(occupied,set))add(pat.name+' Nabhasa pattern',`All seven classical planets are confined to the four consecutive houses beginning with ${pat.start}.`,`Occupied houses: ${occupied.join(', ')}.`,'BPHS Ch. 35, v. 13');
 }
 const sevenHousePatterns=[{name:'Nauka',start:1},{name:'Koot',start:4},{name:'Chatr',start:7},{name:'Chap',start:10}];
 for(const pat of sevenHousePatterns){
  const set=houseWindow(pat.start,7);
  if(subset(occupied,set))add(pat.name+' Nabhasa pattern',`All seven classical planets are confined to seven continuous houses beginning with ${pat.start}.`,`Occupied houses: ${occupied.join(', ')}.`,'BPHS Ch. 35, v. 14');
 }
 const ardhaStart=[2,3,5,6,8,9,11,12].find(start=>subset(occupied,houseWindow(start,7)));
 if(ardhaStart)add('Ardh Candr Nabhasa pattern','The seven classical planets occupy seven continuous houses beginning at a non-kendra house.',`Occupied houses: ${occupied.join(', ')}; qualifying window begins at house ${ardhaStart}.`,'BPHS Ch. 35, v. 14 (quoted from Saravali)');
 const apoklima=[3,6,9,12],panaphara=[2,5,8,11];
 if(subset(occupied,apoklima)||subset(occupied,panaphara))add('Vapi Nabhasa pattern','All seven classical planets are confined to the Apoklima or Panaphara houses.',`Occupied houses: ${occupied.join(', ')}.`,'BPHS Ch. 35, v. 12');
 if(subset(occupied,[1,4,7,10]))
  add('Kamala Nabhasa pattern','All seven classical planets are confined to the four kendras (1, 4, 7, 10).',`Occupied houses: ${occupied.join(', ')}.`,'BPHS Ch. 35, v. 12');
 const odd=[1,3,5,7,9,11],even=[2,4,6,8,10,12];
 if(subset(occupied,odd))add('Chakra Nabhasa pattern','All seven classical planets are confined to alternating odd houses.',`Occupied houses: ${occupied.join(', ')}.`,'BPHS Ch. 35, v. 15');
 if(subset(occupied,even))add('Samudra Nabhasa pattern','All seven classical planets are confined to alternating even houses.',`Occupied houses: ${occupied.join(', ')}.`,'BPHS Ch. 35, v. 15');
 // Per BPHS Ch.35 v.17, show Sankhya only when no other Nabhasa pattern was derived.
 const hasNabhasa=rows.some(r=>r.source.startsWith('BPHS Ch. 35')&&r.status==='Present');
 if(!hasNabhasa){
  const count=uniq(sgs).length;
  add(SANKHYA_NAMES[count-1]+' Sankhya pattern',`The seven classical planets occupy ${count} distinct signs.`,`Signs represented: ${uniq(sgs).map(s=>SG[s]).join(', ')}.`,'BPHS Ch. 35, vv. 16–17');
 }
 const moonRows=rows.filter(r=>r.source.startsWith('BPHS Ch. 37')||r.source.startsWith('BPHS Ch. 38'));
 const nabhasaRows=rows.filter(r=>r.source.startsWith('BPHS Ch. 35'));
 const card=(title,subsetRows,empty,caption)=>`<div class="card analysis-card"><h2>${title}</h2>${subsetRows.length?`<div class="analysis-list">${subsetRows.map(r=>{const cm=r.source.match(/Ch\.\s*(\d+)/),ch=cm?+cm[1]:0;return`<article class="analysis-item"><div class="analysis-top"><b>${r.name}</b><span class="analysis-status ${r.status==='Present'?'is-present':(r.status==='Basic pattern'?'is-caution':'is-neutral')}">${r.status}</span></div><p>${r.condition}</p><small>${r.detail}</small>${r.status==='Placement'?'':bphsYogaOutcome(r.name,ch)}<div class="analysis-source">${r.source}</div></article>`}).join('')}</div>`:`<p class="analysis-empty">${empty}</p>`}<p class="analysis-note">${caption}</p></div>`;
 return card('Moon & Sun combinations',moonRows,'No listed Moon/Sun placement pattern was detected. This does not assess aspect-based yogas or other cancellation rules.','BPHS Ch. 37 follows “Graha other than Sūrya” literally, including the app’s Rahu/Ketu positions. Ch. 38 says “Graha among Mangala etc.” without enumerating the full set, so its detector conservatively checks Mars–Saturn only. The cited traditional outcomes are shown with their qualifications.')+
  card('Nabhasa patterns',nabhasaRows,'No strict Nabhasa pattern was detected for the seven classical planets.','BPHS Ch. 35. The detector uses Sun through Saturn for these seven-Graha formations and excludes nodes. Dala, Vajra and Yava rules requiring benefic/malefic classification are not computed. Each detected formation is paired with the chapter’s stated result; strength, cancellations and dasha activation are not assessed. A chart may meet more than one listed pattern.')+
  `<div class="card analysis-disclaimer"><b>How to read these traditional results</b><p>Each result states the BPHS interpretation and keeps its source qualifications separate. The text’s asserted outcome is not rewritten as a vague theme, but a detected placement alone does not establish strength, cancellation or timing, nor guarantee an event. The app does not yet evaluate every aspect-based rule, complete Shadbala, divisional confirmation, special Lagna condition or exception.</p></div>`;
}
