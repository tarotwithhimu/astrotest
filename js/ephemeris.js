// Daily sidereal ephemeris from the supplied Access table (1930-01-01 .. 2061-01-09, 0h UT), with cubic interpolation.
let EPH=null;
const EPH_JD0=Date.UTC(1930,0,1)/864e5+2440587.5,EPH_BODIES=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'],PNUM=['','Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
function loadEph(){return fetch('data/ephemeris.csv').then(r=>r.ok?r.text():Promise.reject()).then(t=>{
 const L=t.split('\n').filter(l=>l&&l[0]!='#'&&l[0]!='a'),n=L.length,E={n,ay:new Float64Array(n),lon:EPH_BODIES.map(()=>new Float64Array(n)),rise:new Int16Array(n),set:new Int16Array(n),mot:new Int16Array(n),lords:[],other:new Int16Array(n)};
 L.forEach((l,i)=>{const c=l.split(',');E.ay[i]=+c[0];for(let k=0;k<9;k++)E.lon[k][i]=+c[1+k];E.rise[i]=+c[10];E.set[i]=+c[11];E.mot[i]=+c[12];E.lords[i]=c[13];E.other[i]=+c[14]});
 EPH=E;$('ev').onchange=evShow;evShow()}).catch(()=>{})}
const wrapA=u=>((u+648000)%1296000+1296000)%1296000-648000;
function ephAt(jd){
 if(!EPH)return null;const x=jd-EPH_JD0,i=Math.floor(x);if(i<1||i>EPH.n-3)return null;
 const f=x-i,w=[-f*(f-1)*(f-2)/6,0,-(f+1)*f*(f-2)/2,(f+1)*f*(f-1)/6],
 mix=(a,wr)=>{const b=a[i];let s=b;for(const j of[-1,1,2]){const u=a[i+j]-b;s+=w[j+1]*(wr?wrapA(u):u)}return s};
 const sid={};EPH_BODIES.forEach((k,j)=>sid[k]=((mix(EPH.lon[j],1)%1296000+1296000)%1296000)/3600);
 return{sid,ay:mix(EPH.ay,0)/3600}}
const fa=s=>{s=Math.round(s)%1296000;const z=Math.floor(s/108000),r=s%108000;return`${Math.floor(r/3600)}\u00b0${String(Math.floor(r%3600/60)).padStart(2,'0')}\u2032${String(r%60).padStart(2,'0')}\u2033 ${SG[z]}`},
 fh=m=>String(m/60|0).padStart(2,'0')+':'+String(m%60).padStart(2,'0'),
 fdm=s=>{s=Math.round(s);return`${s/3600|0}\u00b0${String(s%3600/60|0).padStart(2,'0')}\u2032${String(s%60).padStart(2,'0')}\u2033`};
function ephRowHtml(i){const E=EPH,d=new Date((EPH_JD0+i-2440587.5)*864e5).toISOString().slice(0,10);
 return`<p>${d} 00:00 UT (table row ${i+1} of ${E.n})</p><table><tr><th>Body</th><th>Sidereal longitude</th><th>Star lord no.</th></tr>${EPH_BODIES.map((k,j)=>`<tr><td>${k}</td><td>${fa(E.lon[j][i])}</td><td>${E.lords[i][j]} (${PNUM[+E.lords[i][j]]})</td></tr>`).join('')}</table>
 <div class="g"><div><b>Ayanamsha (table)</b>${fdm(E.ay[i])}</div><div><b>Moon daily motion</b>${E.mot[i]/60|0}\u00b0${String(E.mot[i]%60).padStart(2,'0')}\u2032</div><div><b>Sunrise / sunset in table (IST)</b>${fh(E.rise[i])} / ${fh(E.set[i])}</div><div><b>Textbox10Other (unidentified)</b>${E.other[i]}</div></div>`}
function ephCard(jd){if(!EPH)return'';const i=Math.floor(jd-EPH_JD0);
 if(i<0||i>=EPH.n)return`<div class="card"><h2>Ephemeris table</h2><p>This date is outside the table (1930-01-01 to 2061-01-09), so formula positions were used.</p></div>`;
 return`<div class="card sc"><h2>Ephemeris table, birth date</h2>${ephRowHtml(i)}<small>Chart positions come from this table, interpolated to the birth time.</small></div>`}
function evShow(){if(!EPH)return;const v=$('ev').value,i=Math.round(Date.parse(v+'T00:00Z')/864e5+2440587.5-EPH_JD0);$('eo').innerHTML=i>=0&&i<EPH.n?L10(ephRowHtml(i)):'Date is outside the table.'}
