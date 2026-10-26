// Daily Panchang table for Gauhati (PanchangTABLE), 1930-01-01 .. 2041-02-01, loaded one year at a time.
// Values are shown as stored. Names for the legacy-font text columns are inferred (see data/panchang/meta.json).
const PAN={meta:null,years:{}};
const p2=x=>String(x).padStart(2,'0'),pSec=s=>String(s).trim().split(':').reduce((a,b,i)=>a+ +b*[3600,60,1][i],0),
 gSec=s=>String(s).trim().split(':').reduce((a,b,i)=>a+ +b*[1440,24,.4][i],0),   // ghati:pala:vipala -> seconds (1 ghati = 24 min)
 hms=t=>{const d=Math.floor(Math.round(t)/86400),u=((Math.round(t)%86400)+86400)%86400;return p2(u/3600|0)+':'+p2(u%3600/60|0)+':'+p2(u%60)+(d?' (+'+d+'d)':'')},
 esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function loadPan(y){
 if(PAN.years[y]!==undefined)return Promise.resolve(!!PAN.years[y]);
 const m=PAN.meta?Promise.resolve():fetch('data/panchang/meta.json').then(r=>r.json()).then(j=>{PAN.meta=j});
 return m.then(()=>{const a=+String(PAN.meta.start).slice(0,4),z=+String(PAN.meta.end).slice(0,4);if(y<a||y>z)return Promise.reject();return fetch('data/panchang/'+y+'.json')}).then(r=>r.ok?r.json():Promise.reject()).then(j=>{PAN.years[y]=j;return true}).catch(()=>{PAN.years[y]=null;return false})}
function panRows(Y,Mo,D){const f=PAN.years[Y];if(!f||!PAN.meta)return null;const k=p2(D)+'/'+p2(Mo)+'/'+Y+' ',pi=f.cols.indexOf('PDate');
 const rs=f.rows.filter(r=>String(r[pi]).startsWith(k)).map(r=>{const o={};f.cols.forEach((c,i)=>o[c]=r[i]);return o});return rs.length?rs:null}
function pName(c,raw){if(raw==null)return'';const e=(PAN.meta.maps[c]||{})[raw];if(!e||!e.name)return'';
 const alt=e.alts&&Object.entries(e.alts).filter(x=>x[1]>.1*e.n).map(x=>x[0]);const mo=c=='TextBox37'||c=='TextBox40',q=x=>tx((mo?'M:':'')+x);return alt&&alt.length?q(e.name)+' / '+alt.map(q).join(' / '):q(e.name)}
const pShow=(c,raw)=>{if(raw==null)return'-';const n=pName(c,raw);return`<span title="table text: ${esc(raw)}">${n||esc(raw)}</span>`};
function panBlock(Y,Mo,D){
 const rs=panRows(Y,Mo,D);if(!rs)return`<p>No table row for this date (the table covers ${PAN.meta?PAN.meta.start+' to '+PAN.meta.end:'1930-01-01 to 2041-02-01'}).</p>`;
 const r=rs[0],rise=pSec(r.SunRise),C=PAN.meta.constants,ge=s=>s==null?'-':`${String(s).trim()} &rarr; ${hms(rise+gSec(s))}`;
 const g=[['Sunrise',r.SunRise],['Sunset',r.SunSet],['Dinamana (ghati)',String(r.TextBox27).trim()],['Moonrise',r.TextBox45],['Moonset',r.TextBox46],
  ['Vikram / Shaka year (changes at Chaitra Shukla 1)',r.TextBox38+' / '+r.TextBox39],['Vikram / Shaka, Kartika-based (changes in Kartika)',r.TextBox35+' / '+r.TextBox36],
  ['Maasa Amanta',pShow('TextBox37',r.TextBox37)],['Maasa Purnimanta',pShow('TextBox40',r.TextBox40)],['Adhika flag (TextBox41)',r.TextBox41],
  ['Ayana',pShow('TextBox42',r.TextBox42)],['Gola',pShow('TextBox43',r.TextBox43)],['Ritu',pShow('TextBox44',r.TextBox44)],
  ['Ayanamsha as printed (TextBox22)',String(r.TextBox22).trim()],['Location',`${C.TextBox128}, ${C.TextBox19} ${C.TextBox18} (meridian ${C.TextBox20}), ${C.TextBox26}`],['Table rows (Recnum)',rs.map(x=>x.Recnum).join(', ')]];
 const ev=rs.map((q,i)=>`<tr><td>${i+1}</td><td>${ge(q.TextBox2)}</td><td>${pShow('TextBox4',q.TextBox4)}</td><td>${ge(q.TextBox5)}</td><td>${ge(q.TextBox8)}</td><td>${pShow('TextBox10',q.TextBox10)}</td><td>${pShow('TextBox13',q.TextBox13)}</td></tr>`).join('');
 const dp=['TextBox29','TextBox30','TextBox31','TextBox32','TextBox33','TextBox34'].map(c=>c+' '+String(r[c]).trim()).join(' &middot; ');
 return`<div class="g">${g.map(x=>`<div><b>${x[0]}</b>${x[1]}</div>`).join('')}</div>
 <h2 style="margin-top:12px">Events (ghati:pala:vipala after sunrise &rarr; IST clock)</h2><table><tr><th>Row</th><th>Tithi ends</th><th>Nakshatra</th><th>Nakshatra ends</th><th>Yoga ends</th><th>Karana</th><th>Moon rashi</th></tr>${ev}</table>
 <small>Day-part times in ghati from sunrise (meaning of these six columns not identified): ${dp}</small>`}
function panCard(Y,Mo,D){if(PAN.years[Y]===undefined)return'';return`<div class="card sc"><h2>Panchang table (Gauhati), birth date</h2>${panBlock(Y,Mo,D)}</div>`}
function panInfo(Y,Mo,D,sn,el){const rs=panRows(Y,Mo,D);if(!rs)return panch(Y,Mo,sn,el);const r=rs[0],sh=+r.TextBox39;
 return[['Shaka year',sh+' '+SM[(sh-1942+33+600)%60]+' (table)'],['Vikram year',(+r.TextBox38)+' (table)'],
  ['Chandra Maasa',(pName('TextBox37',r.TextBox37)||'?')+' ('+tx('Amanta')+'), '+(pName('TextBox40',r.TextBox40)||'?')+' ('+tx('Purnimanta')+')'+(r.TextBox41?' [adhika flag '+r.TextBox41+']':'')+' (table)'],
  ['Ayana / Ritu',pName('TextBox42',r.TextBox42)+' / '+pName('TextBox44',r.TextBox44)]]}
function pvShow(){const[Y,Mo,D]=document.getElementById('pv').value.split('-').map(Number);if(!Y)return;loadPan(Y).then(()=>{document.getElementById('po').innerHTML=L10(panBlock(Y,Mo,D))})}
document.getElementById('pv').onchange=pvShow;pvShow();
