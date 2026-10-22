// Ashtakavarga bindu tables follow BPHS ch. 66. The seven graha BAV totals sum to 337;
// Lagna BAV is shown separately and is not added to the conventional seven-graha SAV.
const BV={
Sun:['1,2,4,7,8,9,10,11','3,6,10,11','1,2,4,7,8,9,10,11','3,5,6,9,10,11,12','5,6,9,11','6,7,12','1,2,4,7,8,9,10,11','3,4,6,10,11,12'],
Moon:['3,6,7,8,10,11','1,3,6,7,9,10,11','2,3,5,6,10,11','1,3,4,5,7,8,10,11','1,2,4,7,8,10,11','3,4,5,7,9,10,11','3,5,6,11','3,6,10,11'],
Mars:['3,5,6,10,11','3,6,11','1,2,4,7,8,10,11','3,5,6,11','6,10,11,12','6,8,11,12','1,4,7,8,9,10,11','1,3,6,10,11'],
Mercury:['5,6,9,11,12','2,4,6,8,10,11','1,2,4,7,8,9,10,11','1,3,5,6,9,10,11,12','6,8,11,12','1,2,3,4,5,8,9,11','1,2,4,7,8,9,10,11','1,2,4,6,8,10,11'],
Jupiter:['1,2,3,4,7,8,9,10,11','2,5,7,9,11','1,2,4,7,8,10,11','1,2,4,5,6,9,10,11','1,2,3,4,7,8,10,11','2,5,6,9,10,11','3,5,6,12','1,2,4,5,6,7,9,10,11'],
Venus:['8,11,12','1,2,3,4,5,8,9,11,12','3,4,6,9,11,12','3,5,6,9,11','5,8,9,10,11','1,2,3,4,5,8,9,10,11','3,4,5,8,9,10,11','1,2,3,4,5,8,9,11'],
Saturn:['1,2,4,7,8,10,11','3,6,11','3,5,6,10,11,12','6,8,9,10,11,12','5,6,11,12','6,11,12','3,5,6,11','1,3,4,6,10,11'],
// BPHS ch. 66, vv. 65–68: Rekha (bindu) houses for each contributor in the Lagna Ashtakavarga.
Lagna:['3,4,6,10,11,12','3,6,10,11,12','1,3,6,10,11','1,2,4,6,8,10,11','1,2,4,5,6,7,9,10,11','1,2,3,4,5,8,9','1,3,4,6,10,11','3,6,10,11']
};
const BV_TOTAL={Sun:48,Moon:49,Mars:39,Mercury:54,Jupiter:56,Venus:52,Saturn:39,Lagna:49};
const AV_SOURCE=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Lagna'];
const AV_TRI=[[0,4,8],[1,5,9],[2,6,10],[3,7,11]];
const AV_OWNERS=[[0,7],[1,6],[2,5],[8,11],[9,10]]; // Mars, Venus, Mercury, Jupiter, Saturn
function avRaw(sid,p){
 const sg=k=>Math.floor(sid[k]/30),a=Array(12).fill(0);
 BV[p].forEach((houses,j)=>houses.split(',').forEach(h=>a[(sg(AV_SOURCE[j])+Number(h)-1)%12]++));
 return a
}
function avShodhana(values,sid){
 const trikona=values.slice(),notes=[];
 for(const tri of AV_TRI){const nums=tri.map(i=>trikona[i]);
  if(nums.some(v=>v===0)){notes.push('unchanged: a trine sign has zero Rekhas');continue}
  const min=Math.min(...nums);tri.forEach(i=>trikona[i]-=min);notes.push(min===nums[0]&&min===nums[1]&&min===nums[2]?'equal trine: all reduced to zero':`subtract ${min} from each trine sign`)
 }
 const ekadhipatya=trikona.slice(),occupants=Array.from({length:12},(_,s)=>AV_SOURCE.slice(0,7).concat(['Rahu','Ketu']).some(p=>Math.floor(sid[p]/30)===s));
 for(const [a,b] of AV_OWNERS){if(!ekadhipatya[a]||!ekadhipatya[b])continue;
  if(occupants[a]&&occupants[b])continue;
  if(!occupants[a]&&!occupants[b]){const m=Math.min(ekadhipatya[a],ekadhipatya[b]);ekadhipatya[a]=ekadhipatya[b]=m;continue}
  const occupied=occupants[a]?a:b,empty=occupied===a?b:a;
  if(ekadhipatya[occupied]<ekadhipatya[empty])ekadhipatya[empty]-=ekadhipatya[occupied];else ekadhipatya[empty]=0
 }
 return{trikona,ekadhipatya,notes}
}
function ashtakaShodhanaTable(sid,p){
 const raw=avRaw(sid,p),{trikona,ekadhipatya}=avShodhana(raw,sid),rows=Array.from({length:12},(_,i)=>`<tr><td>${i+1}. ${tx(SG[i])}</td><td>${raw[i]}</td><td>${trikona[i]}</td><td>${ekadhipatya[i]}</td></tr>`).join('');
 const total=a=>a.reduce((x,y)=>x+y,0);
 return`<div class="sc"><table class="av-shodhana-table"><thead><tr><th>Sign</th><th>Raw BAV</th><th>After Trikona</th><th>After Ekadhipatya</th></tr></thead><tbody>${rows}<tr class="av-total"><td>Total</td><td>${total(raw)}</td><td>${total(trikona)}</td><td>${total(ekadhipatya)}</td></tr></tbody></table></div>`
}
function ashtaka(sid){
 const T=Array(12).fill(0),grahaRows=Object.keys(BV).filter(p=>p!=='Lagna').map(p=>{const a=avRaw(sid,p);a.forEach((v,i)=>T[i]+=v);return`<tr><td>${tx(p)}</td>${a.map(v=>`<td>${v}</td>`).join('')}<td><b>${a.reduce((x,y)=>x+y)}</b></td></tr>`}).join(''),lagna=avRaw(sid,'Lagna');
 const selector=`<div class="av-controls"><label for="av-graha">Ashtakavarga to reduce</label><select id="av-graha">${AV_SOURCE.map(p=>`<option value="${p}">${tx(p)}</option>`).join('')}</select></div>`;
 return`<div class="card sc"><h2>Ashtakavarga</h2><small class="table-scroll-hint">${tx('Swipe horizontally to view all columns.')}</small><table><thead><tr><th></th>${SG.map((s,i)=>`<th title="${s}">${i+1}</th>`).join('')}<th>Total</th></tr></thead><tbody>${grahaRows}<tr><td><b>Sarva</b></td>${T.map(v=>`<td><b>${v}</b></td>`).join('')}<td><b>${T.reduce((x,y)=>x+y)}</b></td></tr></tbody></table><div class="av-lagna"><b>Lagna BAV</b><span>${lagna.map((v,i)=>`${i+1}:${v}`).join(' · ')}</span><b>${lagna.reduce((x,y)=>x+y)}</b></div><small>Seven-graha Bhinnashtakavarga with Sarvashtakavarga; the seven-graha grand total remains 337. Lagna BAV is shown separately and is excluded from SAV.</small>
 <details class="av-shodhana"><summary>Trikona and Ekadhipatya Shodhana · BPHS Ch. 67–68</summary><p>Reduce each Bhinnashtakavarga separately. Trikona Shodhana removes the common minimum across each fire/earth/air/water sign trine; if any sign in that trine is zero, leave that trine unchanged. Ekadhipatya is then applied to Mars-, Venus-, Mercury-, Jupiter- and Saturn-owned sign pairs, following occupancy rules. Sun and Moon each own one sign and are not paired.</p>${selector}<div id="av-shodhana-output">${ashtakaShodhanaTable(sid,'Sun')}</div><small>Raw, post-trikona and post-ekadhipatya rekhas are displayed side by side. This is the reduction worksheet only; later Pinda calculations and outcome rules are not inferred here. BPHS Ch. 67–68.</small></details></div>`
}
