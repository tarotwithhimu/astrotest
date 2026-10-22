// Jyotish Kundli v18 - chart analysis engine (strength, yogas, doshas, life-area readings, transits).
// Sources: Brihat Parashara Hora Shastra (BPHS) chapters 3, 11-24, 26, 32, 34-42, 44, 47, 75, 83;
// rules not found in BPHS are labelled "Classical (non-BPHS)". All wording is paraphrased.
// Global names are prefixed px / PX_ to avoid clashes with the older scripts.
const PX_P7=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'],PX_P9=[...PX_P7,'Rahu','Ketu'];
const PX_ASP={Sun:[7],Moon:[7],Mars:[4,7,8],Mercury:[7],Jupiter:[5,7,9],Venus:[7],Saturn:[3,7,10],Rahu:[7],Ketu:[7]};
const PX_MT={Sun:[4,0,20],Moon:[1,3,30],Mars:[0,0,12],Mercury:[5,15,20],Jupiter:[8,0,10],Venus:[6,0,15],Saturn:[10,0,20]};
const PX_NODE={Rahu:{ex:1,de:7,mt:2,own:[10]},Ketu:{ex:7,de:1,mt:8,own:[7]}}; // BPHS Ch.47 v.34-39
const PX_COMB={Moon:12,Mars:17,Mercury:14,Jupiter:11,Venus:10,Saturn:15};
const PX_DIGH={Sun:10,Mars:10,Moon:4,Venus:4,Saturn:7,Mercury:1,Jupiter:1}; // Ch.3 v.35-38 directional strength
const PX_BHK=['Sun','Jupiter','Mars','Moon','Jupiter','Mars','Venus','Saturn','Jupiter','Mercury','Jupiter','Saturn']; // Ch.32 v.31-34
const PX_HN=['Lagna (self)','Dhana (wealth and family)','Sahaja (effort and siblings)','Bandhu (home and mother)','Putra (learning and children)','Ari (service and obstacles)','Yuvati (partnership and marriage)','Randhra (transformation and the hidden)','Dharma (fortune and father)','Karma (career and status)','Labha (gains and networks)','Vyaya (expenses and distant places)'];
const PX_HS=[1,4,7,10],PX_TRI=[1,5,9],PX_DUS=[6,8,12],PX_UPA=[3,6,10,11];
const pxHfs=(a,b)=>((b-a+12)%12)+1;
const pxEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pxOrd=h=>h+(h==1?'st':h==2?'nd':h==3?'rd':'th');
const pxJoin=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' & '+a[a.length-1];

function pxCtx(sid){
 const L=Math.floor(sid.Lagna/30),c={sid,L,sg:{},h:{},d:{},nav:{}};
 PX_P9.forEach(p=>{c.sg[p]=Math.floor(sid[p]/30);c.d[p]=sid[p]%30;c.h[p]=(c.sg[p]-L+12)%12+1;c.nav[p]=Math.floor(sid[p]*9/30)%12});
 c.hs=h=>(L+h-1)%12;
 c.lord=h=>SL[c.hs(h)];
 c.owned=p=>[1,2,3,4,5,6,7,8,9,10,11,12].filter(h=>SL[c.hs(h)]===p);
 const el=((sid.Moon-sid.Sun)%360+360)%360;c.elong=el;c.waxing=el<180;
 c.conj=(a,b)=>a!==b&&c.sg[a]===c.sg[b];
 c.asp=(a,b)=>a!==b&&PX_ASP[a].includes(pxHfs(c.sg[a],c.sg[b]));
 c.rel=(a,b)=>c.conj(a,b)||c.asp(a,b)||c.asp(b,a);
 c.mutAsp=(a,b)=>c.asp(a,b)&&c.asp(b,a);
 c.exch=(a,b)=>a!==b&&OWN[a]&&OWN[b]&&OWN[a].includes(c.sg[b])&&OWN[b].includes(c.sg[a]);
 c.inH=h=>PX_P9.filter(p=>c.h[p]===h);
 c.inHs=(...hs)=>PX_P9.filter(p=>hs.includes(c.h[p]));
 c.fromMoon=p=>pxHfs(c.sg.Moon,c.sg[p]);
 c.from=(a,b)=>pxHfs(c.sg[a],c.sg[b]);
 c.malBase=p=>['Sun','Mars','Saturn','Rahu','Ketu'].includes(p)||(p=='Moon'&&!c.waxing);
 c.mal=p=>c.malBase(p)||(p=='Mercury'&&['Mars','Saturn','Rahu','Ketu'].some(q=>c.conj('Mercury',q)));
 c.ben=p=>!c.mal(p);
 c.dig=p=>{const s=c.sg[p],d=c.d[p];
  if(PX_NODE[p]){const N=PX_NODE[p];return s==N.ex?'exalted':s==N.de?'debilitated':s==N.mt?'mooltrikona':N.own.includes(s)?'own sign':rel2(p,SL[s])==1?'friend sign':rel2(p,SL[s])==-1?'enemy sign':'neutral sign'}
  if(EX[p]===s)return'exalted';if((EX[p]+6)%12===s)return'debilitated';
  const m=PX_MT[p];if(m&&m[0]===s&&d>=m[1]&&d<m[2]&&p!='Moon')return'mooltrikona';
  if(OWN[p].includes(s))return'own sign';
  const r=rel2(p,SL[s]);return r==1?'friend sign':r==-1?'enemy sign':'neutral sign'};
 c.strongDig=p=>['exalted','mooltrikona','own sign'].includes(c.dig(p));
 c.weakDig=p=>['debilitated','enemy sign'].includes(c.dig(p));
 c.combust=p=>{if(!PX_COMB[p])return false;let x=Math.abs(sid[p]-sid.Sun);if(x>180)x=360-x;return x<PX_COMB[p]};
 c.vargottama=p=>c.nav[p]===c.sg[p];
 c.aspectedBy=p=>PX_P9.filter(q=>q!==p&&c.asp(q,p));
 c.dispositor=p=>SL[c.sg[p]];
 c.strength=p=>pxStrength(c,p);
 c.func=p=>pxFunc(c,p);
 return c}

// Simplified strength index (NOT classical Shadbala): dignity, directional strength, house type, aspects, combustion, vargottama.
function pxStrength(c,p){
 const dg=c.dig(p),h=c.h[p],parts=[];let sc=0;
 const dv={exalted:6,mooltrikona:5.5,'own sign':5,'friend sign':4,'neutral sign':3,'enemy sign':1.5,debilitated:.5}[dg];sc+=dv;parts.push(dg);
 if(PX_DIGH[p]){const b=PX_DIGH[p],dist=Math.min((h-b+12)%12,(b-h+12)%12),db=4*(1-dist/6);sc+=db;if(dist<=1)parts.push('directional strength')}
 sc+=PX_HS.includes(h)?3:[2,5,8,11].includes(h)?1.5:.75;if(PX_HS.includes(h))parts.push('angular house');
 if(PX_DUS.includes(h)&&p!='Saturn'&&p!='Mars'&&p!='Sun'){parts.push('dusthana house')}
 let da=0;c.aspectedBy(p).forEach(q=>{da+=c.ben(q)?1:-1});PX_P9.filter(q=>c.conj(p,q)).forEach(q=>{da+=c.ben(q)?.75:-.75});
 da=Math.max(-2,Math.min(2,da));sc+=da;if(da>0)parts.push('benefic support');if(da<0)parts.push('malefic pressure');
 if(c.combust(p)){sc-=2;parts.push('combust')}
 if(c.vargottama(p)){sc+=1;parts.push('vargottama')}
 const pct=Math.max(0,Math.min(100,Math.round(sc/16*100)));
 return{pct,band:pct>=62?'Strong':pct>=42?'Moderate':'Weak',parts,dg}}

// Functional nature for this Lagna (BPHS Ch.34 principles: trikona lords benefic, 3/6/11 lords malefic, kendra rule for natural benefics/malefics).
function pxFunc(c,p){
 if(p=='Rahu'||p=='Ketu'){const d=SL[c.sg[p]];return{label:'Acts like its dispositor '+d,score:0,yk:false}}
 const o=c.owned(p);let sc=0;const kend=o.filter(h=>[4,7,10].includes(h)),tri=o.filter(h=>[5,9].includes(h));
 const yk=!!(kend.length&&tri.length);
 o.forEach(h=>{if(h==1)sc+=2;else if(PX_TRI.includes(h))sc+=2;else if([4,7,10].includes(h))sc+=c.malBase(p)?.5:-.5;else if([3,6,11].includes(h))sc-=1;else if(h==8)sc-=(p=='Sun'||p=='Moon')?0:1;});
 if(yk)sc+=1.5;
 const label=yk?'Yogakaraka':sc>=1.5?'Functional benefic':sc>=.5?'Mildly benefic':sc>-.5?'Neutral / mixed':sc>-1.5?'Mildly malefic':'Functional malefic';
 return{label,score:sc,yk}}

// ---------- Yogas ----------
// Each def: n name, k kind (good|bad|mixed), s source, f test -> falsy | {w:'why',pl:[planets involved]}, r result text (own words), rec/ch link to BPHS source record.
function pxYogaDefs(){
 const kendraLords=c=>[1,4,7,10].map(h=>c.lord(h)),tri=c=>[1,5,9].map(h=>c.lord(h));
 const A=(c,a,b)=>c.conj(a,b)||c.mutAsp(a,b)||c.exch(a,b);
 const benIn=(c,h)=>c.inH(h).filter(p=>c.ben(p)&&p!='Rahu'&&p!='Ketu');
 const malIn=(c,h)=>c.inH(h).filter(p=>c.mal(p));
 const kd=(c,a,b)=>({w:`${a} (lord of ${pxJoin(c.owned(a).map(pxOrd))}) and ${b} (lord of ${pxJoin(c.owned(b).map(pxOrd))}) are ${c.conj(a,b)?'conjunct in '+SG[c.sg[a]]:c.exch(a,b)?'in sign exchange':'in mutual aspect'}`,pl:[a,b]});
 const D=[];
 const add=(n,k,s,f,r,rec,ch)=>D.push({n,k,s,f,r,rec,ch});
 // ---- BPHS Ch.34-36 ----
 add('Yogakaraka planet','good','BPHS Ch.34',c=>{const y=PX_P7.filter(p=>c.func(p).yk);return y.length?{w:y.map(p=>`${p} rules both a kendra and a trikona (${pxJoin(c.owned(p).map(pxOrd))}) and sits in house ${c.h[p]}`).join('; '),pl:y}:0},
  'A planet that owns both an angle and a trine acts as the chart’s most useful planet. Its mahadasha/antardasha and its own significations tend to be supportive, more so when it is dignified and unafflicted.');
 add('Kendra–Kona lords Raja Yoga','good','BPHS Ch.34, 39, 41',c=>{const K=[4,7,10].map(h=>c.lord(h)),T=[5,9].map(h=>c.lord(h)),out=[];
  K.forEach(a=>T.forEach(b=>{if(a!==b&&A(c,a,b)&&!out.some(o=>o.pl.includes(a)&&o.pl.includes(b)))out.push(kd(c,a,b))}));
  return out.length?{w:out.map(o=>o.w).join('; '),pl:[...new Set(out.flatMap(o=>o.pl))]}:0},
  'Association between an angle lord and a trine lord is the classical recipe for status, authority and recognition. The yoga matures chiefly in the periods of the planets involved.','Kendra–Kona Lords Relationship Raj Yog',41);
 add('Dharma-Karmadhipati Yoga','good','Classical (BPHS Ch.34/39 principle)',c=>{const a=c.lord(9),b=c.lord(10);return a!==b&&A(c,a,b)?kd(c,a,b):0},
  'The lords of fortune (9th) and career (10th) are connected: a strong indicator of work that fits one’s purpose, public standing and steady rise in the periods of these planets.');
 add('Putra–Dharma lords Raja Yoga','good','BPHS Ch.39',c=>{const a=c.lord(5),b=c.lord(9);return a!==b&&(c.conj(a,b)||c.mutAsp(a,b)||pxHfs(c.sg[a],c.sg[b])==7)?{w:`${a} (5th lord) and ${b} (9th lord) are ${c.conj(a,b)?'conjunct':c.mutAsp(a,b)?'in mutual aspect':'in mutual 7th'}`,pl:[a,b]}:0},
  'The two trine lords working together are described as a classic Raja yoga: good judgement, merit and recognition, especially in their periods.','Raj Yog — Dharm’s Lord and Putr’s Lord yuti',39);
 add('Lagna lord–Putra lord Maha Raja Yoga','good','BPHS Ch.39',c=>{const a=c.lord(1),b=c.lord(5);return a!==b&&c.exch(a,b)?{w:`${a} and ${b} exchange signs`,pl:[a,b]}:0},
  'Exchange between the Lagna lord and the 5th lord is called a Maha Raja Yoga: a gifted mind, merit from past efforts and a strong personal rise.','Maha Raj Yog',39);
 add('Gaja Kesari Yoga','good','BPHS Ch.36',c=>{const j='Jupiter',inK=[1,4,7,10].includes(c.h[j])||[1,4,7,10].includes(c.fromMoon(j));
  if(!inK)return 0;const sup=PX_P9.some(q=>q!=j&&c.ben(q)&&(c.conj(j,q)||c.asp(q,j)));
  const ok=sup&&c.dig(j)!='debilitated'&&!c.combust(j)&&c.dig(j)!='enemy sign';
  return ok?{w:`Jupiter is in a kendra from ${[1,4,7,10].includes(c.h[j])?'Lagna':'the Moon'}, supported by a benefic, and is not debilitated, combust or in an enemy sign`,pl:['Jupiter','Moon']}:0},
  'Jupiter angular from the Lagna or Moon with benefic support is said to give a respected, articulate and well-wishing nature, good reputation and protection from obstacles.','Gaj Kesari Yog',36);
 add('Amala Yoga','good','BPHS Ch.36',c=>{const f=(base,lab)=>{const hh=c.sg[base]; const occ=PX_P9.filter(p=>((c.sg[p]-(base=='Lagna'?c.L:c.sg.Moon)+12)%12)==9);return occ.length&&occ.every(p=>c.ben(p)&&p!='Rahu'&&p!='Ketu')?{w:`Only benefic(s) ${pxJoin(occ)} in the 10th from ${lab}`,pl:occ}:0};return f('Lagna','Lagna')||f('Moon','the Moon')},
  'A spotless benefic influence on the 10th house is said to give a clean reputation, lasting good name and honourable conduct.','Amal Yog',36);
 add('Lagna Adhi Yoga','good','BPHS Ch.36',c=>{const a=c.inH(7),b=c.inH(8);const ok=(a.length&&b.length)&&[...a,...b].every(p=>c.ben(p)&&p!='Rahu'&&p!='Ketu');return ok?{w:`Benefics ${pxJoin([...a,...b])} in the 7th and 8th, free of malefic company`,pl:[...a,...b]}:0},
  'Benefics in the 7th and 8th houses from Lagna are classically linked with leadership, comfort and the support of others.','Lagn Adhi Yog',36);
 add('Chandra Adhi Yoga','good','BPHS Ch.37 / classical',c=>{const bs=['Mercury','Venus','Jupiter'].filter(p=>[6,7,8].includes(c.fromMoon(p)));return bs.length>=2&&bs.every(p=>c.ben(p))?{w:`${pxJoin(bs)} in the 6th–8th from the Moon`+(bs.length==2?' (partial: two of three benefics)':''),pl:[...bs,'Moon']}:0},
  'Benefics in the 6th, 7th and 8th from the Moon give resilience against rivals, comfort and leadership qualities.','Adhi Yog from Candr',37);
 add('Parvata Yoga','good','BPHS Ch.36',c=>{const hasK=[1,4,7,10].some(h=>benIn(c,h).length),bad=[1,4,7,10].some(h=>malIn(c,h).length),v=[7,8].every(h=>c.inH(h).every(p=>c.ben(p)));return hasK&&!bad&&v?{w:'Benefics in the angles, no malefics in angles, and the 7th/8th are empty or benefic only',pl:[...new Set([1,4,7,10].flatMap(h=>benIn(c,h)))]}:0},
  'Benefics in the angles give a charitable, learned, fortunate and well-regarded nature with lasting comforts.','Parvat Yog',36);
 add('Chamara Yoga','good','BPHS Ch.36',c=>{const l=c.lord(1);if(c.dig(l)=='exalted'&&[1,4,7,10].includes(c.h[l])&&c.asp('Jupiter',l))return{w:`Lagna lord ${l} is exalted in a kendra and aspected by Jupiter`,pl:[l,'Jupiter']};
  const hs=[1,9,10,7].filter(h=>benIn(c,h).length>=2);return hs.length?{w:`Two benefics in the ${hs.map(pxOrd).join('/')} house`,pl:benIn(c,hs[0])}:0},
  'Regal bearing and honour from rulers or leaders, scholarly and eloquent, is the classical outcome.','Chamar Yog',36);
 add('Brahma Yoga','good','BPHS Ch.36',c=>{const l=c.lord(1),s=c.sg[l],pos=[3,9,10].map(k=>(s+k)%12),occ=pos.map(q=>PX_P7.filter(p=>c.sg[p]===q&&c.ben(p)));return occ.every(o=>o.length)?{w:`Benefics occupy the 4th, 10th and 11th signs from the Lagna lord’s sign`,pl:occ.flat()}:0},
  'A rare benefic configuration described as giving learning, wealth and a respected, long and meaningful life.','Brahma Yog',36);
 add('Kahala Yoga','good','BPHS Ch.36',c=>{const a=c.lord(4),b=c.lord(10);if(a!==b&&a!=='Jupiter'&&c.sg[a]===c.sg[b]&&['own sign','exalted','mooltrikona'].includes(c.dig(a)))return{w:`4th lord ${a} in a strong sign with the 10th lord ${b}`,pl:[a,b]};
  const j='Jupiter',x=pxHfs(c.sg[a],c.sg[j]);if(a!==j&&[1,4,7,10].includes(x)&&c.strength(c.lord(1)).band!='Weak')return{w:`4th lord ${a} and Jupiter are in mutual kendras and the Lagna lord is not weak`,pl:[a,j]};return 0},
  'Boldness, initiative and the capacity to lead people or hold land and property.','Kahal Yog',36);
 add('Lakshmi Yoga','good','BPHS Ch.36',c=>{const l=c.lord(9);return[1,4,7,10].includes(c.h[l])&&['own sign','exalted','mooltrikona'].includes(c.dig(l))&&c.strength(c.lord(1)).band!='Weak'?{w:`9th lord ${l} is dignified in house ${c.h[l]} and the Lagna lord is strong enough`,pl:[l]}:0},
  'The fortune lord dignified in an angle is the classical sign of prosperity, good fortune and comforts.','Lakshmi Yog',36);
 add('Shrinatha Yoga','good','BPHS Ch.36',c=>{const a=c.lord(7),b=c.lord(10),n=c.lord(9);return c.h[a]===10&&c.dig(b)=='exalted'&&c.sg[b]===c.sg[n]?{w:`7th lord in the 10th; 10th lord ${b} exalted with the 9th lord ${n}`,pl:[a,b,n]}:0},
  'A powerful combination for rank and authority in the field of work.','Shrinath Yog',36);
 add('Khadga Yoga','good','BPHS Ch.36',c=>{const a=c.lord(2),b=c.lord(9),l=c.lord(1);return a!==b&&c.exch(a,b)&&([1,4,7,10,5,9].includes(c.h[l]))?{w:`${a} (2nd lord) and ${b} (9th lord) exchange signs; Lagna lord in house ${c.h[l]}`,pl:[a,b,l]}:0},
  'Exchange between the 2nd and 9th lords gives learning, wealth, command and fortune.','Khadg Yog',36);
 add('Kalanidhi Yoga','good','BPHS Ch.36',c=>{const j='Jupiter';return[2,5].includes(c.h[j])&&c.asp('Mercury',j)&&c.asp('Venus',j)?{w:`Jupiter in the ${pxOrd(c.h[j])} aspected by Mercury and Venus`,pl:['Jupiter','Mercury','Venus']}:0},
  'Artistic and intellectual gifts, honour from learned circles and comfort.','Kalanidhi Yog',36);
 add('Sharada Yoga','good','BPHS Ch.36',c=>{const t=p=>[1,5,9].includes(c.fromMoon(p));return(t('Jupiter')||t('Mercury'))&&c.h.Mars===11?{w:`${t('Jupiter')?'Jupiter':'Mercury'} in a trine from the Moon and Mars in the 11th`,pl:['Jupiter','Mercury','Mars']}:0},
  'Intelligence, skill in speech and learning, and gains through effort.','Sharad Yog',36);
 add('Hari Yoga','good','BPHS Ch.36',c=>{const l=c.lord(2),s=c.sg[l],o=[1,11,7].map(k=>PX_P7.filter(p=>c.sg[p]===(s+k)%12&&c.ben(p)));return o.every(x=>x.length)?{w:`Benefics occupy the 2nd, 12th and 8th from the 2nd lord’s sign`,pl:o.flat()}:0},
  'A respected, learned and prosperous person who earns a good name.','Hari Yog',36);
 add('Hara Yoga','good','BPHS Ch.36',c=>{const l=c.lord(7),s=c.sg[l],o=[3,8,7].map(k=>PX_P7.filter(p=>c.sg[p]===(s+k)%12&&c.ben(p)));return o.every(x=>x.length)?{w:`Benefics occupy the 4th, 9th and 8th from the 7th lord’s sign`,pl:o.flat()}:0},
  'A scholarly, famous nature with success in undertakings.','Hara Yog',36);
 add('Kusuma Yoga','good','BPHS Ch.36',c=>{const fixed=[1,4,7,10].includes(c.L);return fixed&&[1,4,7,10].includes(c.h.Venus)&&[1,5,9].includes(c.h.Moon)&&PX_P7.some(p=>p!='Moon'&&c.ben(p)&&c.conj('Moon',p))&&c.h.Saturn==10?{w:'Fixed Lagna, Venus in a kendra, Moon with a benefic in a trine, Saturn in the 10th',pl:['Venus','Moon','Saturn']}:0},
  'Leadership, honour and a respected status.','Kusum Yog',36);
 add('Kurma Yoga','good','BPHS Ch.36',c=>{const g=[5,6,7].map(h=>benIn(c,h).filter(p=>['own sign','exalted','mooltrikona','friend sign'].includes(c.dig(p))));const m=[3,11,1].map(h=>malIn(c,h).filter(p=>['own sign','exalted','mooltrikona'].includes(c.dig(p))));return g.every(x=>x.length)&&m.every(x=>x.length)?{w:'Dignified benefics in the 5th–7th and dignified malefics in the 3rd, 11th and 1st',pl:[...g.flat(),...m.flat()]}:0},
  'Fame, helpful friends and a righteous, successful life.','Kurm Yog',36);
 add('Matsya Yoga','good','BPHS Ch.36',c=>{const g=[9,1].every(h=>benIn(c,h).length),mx=c.inH(5).some(p=>c.ben(p))&&c.inH(5).some(p=>c.mal(p)),m=[4,8].every(h=>malIn(c,h).length);return g&&mx&&m?{w:'Benefics in the 1st and 9th, mixed planets in the 5th, malefics in the 4th and 8th',pl:c.inHs(1,9,5,4,8)}:0},
  'Learning, dharma and spiritual or intellectual distinction.','Matsya Yog',36);
 add('Subha Yoga (Subha Kartari)','good','BPHS Ch.36',c=>{const b=benIn(c,1),a=[12,2].every(h=>benIn(c,h).length&&!malIn(c,h).length);return b.length?{w:`Benefic(s) ${pxJoin(b)} in the Lagna`,pl:b}:a?{w:'Benefics flank the Lagna in the 12th and 2nd',pl:c.inHs(12,2)}:0},
  'A benefic on or around the Lagna gives a pleasing personality, good conduct and support throughout life.','Subh Yog',36);
 add('Vasumati Yoga','good','Classical (non-BPHS)',c=>{const bs=['Mercury','Venus','Jupiter'].filter(p=>PX_UPA.includes(c.h[p])||PX_UPA.includes(c.fromMoon(p)));return bs.length==3?{w:`${pxJoin(bs)} all in upachaya houses (3/6/10/11) from Lagna or Moon`,pl:bs}:0},
  'Benefics in growth houses indicate wealth that increases steadily with age and effort.');
 add('Saraswati Yoga','good','Classical (non-BPHS)',c=>{const T=['Jupiter','Venus','Mercury'];return T.every(p=>[1,2,4,5,7,9,10].includes(c.h[p]))&&['own sign','exalted','mooltrikona','friend sign'].includes(c.dig('Jupiter'))?{w:'Jupiter, Venus and Mercury occupy angles/trines/2nd and Jupiter is dignified',pl:T}:0},
  'Learning, eloquence, arts and writing; success through knowledge.');
 add('Budha-Aditya Yoga','mixed','Classical (non-BPHS)',c=>c.conj('Sun','Mercury')?{w:`Sun and Mercury together in ${SG[c.sg.Sun]}`+(c.combust('Mercury')?' (Mercury is within combustion orb, which weakens the yoga)':''),pl:['Sun','Mercury']}:0,
  'Sharp intellect, administrative or analytical skill and reputation. Close combustion of Mercury reduces independence of thought.');
 add('Chandra-Mangala Yoga','mixed','Classical (non-BPHS)',c=>c.conj('Moon','Mars')?{w:`Moon and Mars together in ${SG[c.sg.Moon]}`,pl:['Moon','Mars']}:0,
  'Drive and enterprise with earning ability (often through trade, property or bold ventures); emotional intensity needs balancing.');
 add('Neecha Bhanga Raja Yoga','good','Classical (non-BPHS)',c=>{const out=[];PX_P7.forEach(p=>{if(c.dig(p)!='debilitated')return;const dl=SL[c.sg[p]],ex=SL[EX[p]],ok=[];
   [dl,ex].forEach(q=>{const kh=[1,4,7,10];if(kh.includes(c.h[q])||kh.includes(c.fromMoon(q)))ok.push(q)});
   const exalter=PX_P7.find(q=>EX[q]===c.sg[p]&&q!==p&&c.conj(p,q));if(exalter)ok.push(exalter);
   if(ok.length)out.push({p,ok:[...new Set(ok)]})});
  return out.length?{w:out.map(o=>`${o.p} is debilitated, but cancelled via ${pxJoin(o.ok)}`).join('; '),pl:out.flatMap(o=>[o.p,...o.ok])}:0},
  'A debilitated planet whose weakness is cancelled can turn early struggle in its area into later success.');
 add('Viparita Raja Yoga (Harsha / Sarala / Vimala)','good','Classical (non-BPHS)',c=>{const o=[];[[6,'Harsha'],[8,'Sarala'],[12,'Vimala']].forEach(([h,n])=>{const l=c.lord(h);if(l&&PX_DUS.includes(c.h[l])&&!c.owned(l).some(x=>PX_HS.includes(x)||PX_TRI.includes(x)))o.push({h,n,l})});
  return o.length?{w:o.map(x=>`${pxOrd(x.h)} lord ${x.l} in house ${c.h[x.l]} (${x.n})`).join('; '),pl:o.map(x=>x.l)}:0},
  'Gains arising out of difficulties: rivals fall away, setbacks become turning points. It matures in the lord’s dasha.');
 add('Dhana Yoga (wealth-house lords linked)','good','BPHS Ch.41 / classical',c=>{const g=[1,2,5,9,11].map(h=>c.lord(h)),o=[];for(let i=0;i<g.length;i++)for(let j=i+1;j<g.length;j++)if(g[i]!==g[j]&&A(c,g[i],g[j])&&!o.some(x=>x[0]==g[i]&&x[1]==g[j]))o.push([g[i],g[j]]);
  const must=o.filter(([a,b])=>[a,b].some(x=>c.owned(x).some(h=>h==2||h==11)));
  return must.length?{w:must.map(([a,b])=>`${a} + ${b} (lords of ${pxJoin([...new Set([...c.owned(a),...c.owned(b)].filter(h=>[1,2,5,9,11].includes(h)).map(pxOrd))])}) are associated`).join('; '),pl:[...new Set(must.flat())]}:0},
  'Connection between the lords of the wealth houses (2nd, 11th) and the fortune houses (1st, 5th, 9th) favours earnings and savings, usually showing during the dashas of the planets involved.');
 const WY=[[4,'Sun',['Mars','Jupiter']],[3,'Moon',['Mercury','Jupiter']],[0,'Mars',['Mercury','Venus','Saturn']],[7,'Mars',['Mercury','Venus','Saturn']],[2,'Mercury',['Saturn','Jupiter']],[5,'Mercury',['Saturn','Jupiter']],[8,'Jupiter',['Mercury','Mars']],[11,'Jupiter',['Mercury','Mars']],[1,'Venus',['Saturn','Mercury']],[6,'Venus',['Saturn','Mercury']],[9,'Saturn',['Mars','Jupiter']],[10,'Saturn',['Mars','Jupiter']]];
 add('Wealth Yoga (Lagna-lord in own Lagna, BPHS Ch.41)','good','BPHS Ch.41',c=>{const w=WY.find(([s,p])=>c.L===s&&c.sg[p]===s);return w&&w[2].every(q=>c.rel(w[1],q))?{w:`${w[1]} in its own Lagna sign is joined/aspected by ${pxJoin(w[2])}`,pl:[w[1],...w[2]]}:0},
  'One of the seven Lagna-specific wealth formations named in the text: a self-made accumulation of wealth.','Wealth Yoga 1',41);
 const GA=[[(c)=>[1,6].includes(c.hs(5))&&c.sg.Venus===c.hs(5)&&c.h.Mars===11,'5th is a Venus sign with Venus in it; Mars in the 11th'],
  [(c)=>[2,5].includes(c.hs(5))&&c.sg.Mercury===c.hs(5)&&['Moon','Mars','Jupiter'].every(p=>c.h[p]===11),'5th is a Mercury sign with Mercury in it; Moon, Mars and Jupiter in the 11th'],
  [(c)=>c.hs(5)===4&&c.sg.Sun===4&&['Saturn','Moon','Jupiter'].every(p=>c.h[p]===11),'Leo 5th with the Sun; Saturn, Moon and Jupiter in the 11th'],
  [(c)=>c.h.Sun===11&&c.h.Moon===11&&c.h.Saturn===5&&OWN.Saturn.includes(c.sg.Saturn),'Sun and Moon in the 11th; Saturn in own sign in the 5th'],
  [(c)=>c.h.Jupiter===5&&OWN.Jupiter.includes(c.sg.Jupiter)&&c.h.Mercury===11,'Jupiter in own sign in the 5th; Mercury in the 11th'],
  [(c)=>OWN.Mars.includes(c.hs(5))&&c.sg.Mars===c.hs(5)&&c.h.Venus===11,'5th is a Mars sign with Mars in it; Venus in the 11th'],
  [(c)=>c.hs(5)===3&&c.sg.Moon===3&&c.h.Saturn===11,'Cancer 5th with the Moon; Saturn in the 11th']];
 add('Great Affluence Yoga (BPHS Ch.41)','good','BPHS Ch.41',c=>{const i=GA.findIndex(g=>g[0](c));return i>=0?{w:GA[i][1]+` (variant ${i+1})`,pl:PX_P7}:0},
  'One of seven named combinations between the 5th and the 11th houses indicating great affluence.','Great Affluence Yoga 1',41);
 add('Parivartana Yoga (sign exchange)','mixed','BPHS references / classical',c=>{const o=[];for(let i=0;i<7;i++)for(let j=i+1;j<7;j++){const a=PX_P7[i],b=PX_P7[j];if(c.exch(a,b))o.push([a,b])}
  return o.length?{w:o.map(([a,b])=>{const ha=c.h[a],hb=c.h[b],t=[ha,hb].some(h=>PX_DUS.includes(h))?'Dainya (involves 6/8/12 - mixed, effort needed)':[ha,hb].includes(3)?'Khala (involves 3rd)':'Maha (auspicious houses)';return`${a} in house ${ha} ⇄ ${b} in house ${hb}: ${t}`}).join('; '),pl:o.flat()}:0},
  'Two planets in each other’s signs bind their houses together. Exchanges between good houses are strongly beneficial; those involving 6/8/12 bring results that arrive only after struggle.');
 // Mahapurusha, Nabhasa and Moon/Sun-based yogas live in the existing Analysis tab.
 // ---- BPHS Ch.42 and classical difficulties ----
 add('Asubha Yoga (malefic Kartari)','bad','BPHS Ch.36',c=>{const m=malIn(c,1),a=[12,2].every(h=>malIn(c,h).length);return m.length?{w:`Malefic(s) ${pxJoin(m)} in the Lagna`,pl:m}:a?{w:'Malefics occupy both the 12th and 2nd from Lagna',pl:c.inHs(12,2)}:0},
  'Malefic pressure on the self-house. It reduces ease and confidence in the early part of life; the effect is softened if the Lagna lord is strong or benefics aspect the Lagna.','Asubh Yog',36);
 add('Kendradhipati Dosha','mixed','BPHS Ch.34',c=>{const o=['Moon','Mercury','Jupiter','Venus'].filter(p=>c.ben(p)&&c.owned(p).some(h=>[4,7,10].includes(h))&&!c.owned(p).some(h=>[1,5,9].includes(h))&&!['own sign','exalted','mooltrikona'].includes(c.dig(p)));return o.length?{w:`${pxJoin(o)} own an angle without owning a trine`,pl:o}:0},
  'Natural benefics that rule angles lose some of their kindness (the text ranks the effect Moon, Mercury, Jupiter, Venus in increasing order). Their dashas bring mixed results unless they are strong or yogakaraka.','Ascending Kendra-rulership maleficence',34);
 add('Guru-Chandala Yoga','bad','Classical (non-BPHS)',c=>c.conj('Jupiter','Rahu')?{w:`Jupiter and Rahu together in ${SG[c.sg.Jupiter]}`,pl:['Jupiter','Rahu']}:0,
  'Unconventional or sceptical approach to teachers and tradition; wisdom through questioning. Ethical clarity and guru-seva are the usual remedies.');
 add('Grahana Yoga','bad','Classical (non-BPHS)',c=>{const o=[];['Sun','Moon'].forEach(p=>['Rahu','Ketu'].forEach(q=>{let d=Math.abs(c.sid[p]-c.sid[q]);if(d>180)d=360-d;if(c.conj(p,q)&&d<15)o.push(`${p}+${q} (${d.toFixed(1)}° apart)`)}));return o.length?{w:o.join(', ')+' together',pl:['Sun','Moon','Rahu','Ketu']}:0},
  'The luminary is eclipsed by a node: self-image (Sun) or emotional steadiness (Moon) needs care. Birth near an eclipse also has its own BPHS shanti (Ch.91, see the Remedies tab).');
 add('Angaraka Yoga','bad','Classical (non-BPHS)',c=>c.conj('Mars','Rahu')?{w:`Mars and Rahu together in ${SG[c.sg.Mars]}`,pl:['Mars','Rahu']}:0,
  'Impulsiveness, anger and risk-taking energy; excellent for technical, competitive or high-pressure fields when disciplined.');
 add('Shrapit Yoga','bad','Classical (non-BPHS)',c=>c.conj('Saturn','Rahu')?{w:`Saturn and Rahu together in ${SG[c.sg.Saturn]}`,pl:['Saturn','Rahu']}:0,
  'Delays, fears or burdens connected with past-life patterns; steady discipline, service and Shani/Rahu upayas help.');
 add('Vish Yoga','bad','Classical (non-BPHS)',c=>c.conj('Moon','Saturn')?{w:`Moon and Saturn together in ${SG[c.sg.Moon]}`,pl:['Moon','Saturn']}:0,
  'A serious, reserved temperament with emotional heaviness; develops endurance and responsibility.');
 add('Pitru Dosha indicators','bad','Classical (non-BPHS)',c=>{const o=[];if(c.h.Sun===9&&['Rahu','Ketu','Saturn'].some(q=>c.rel('Sun',q)))o.push('Sun in 9th afflicted');['Rahu','Saturn'].forEach(q=>{if(c.conj('Sun',q))o.push('Sun with '+q)});return o.length?{w:o.join('; '),pl:['Sun','Rahu','Ketu','Saturn']}:0},
  'Indications of ancestral or father-line obligations. Traditional measures are shraddha/tarpana, feeding the needy and honouring elders. The BPHS discusses similar parental-curse patterns in Ch.83.');
 add('Shakata Yoga','bad','Classical (non-BPHS)',c=>{const x=pxHfs(c.sg.Jupiter,c.sg.Moon);return[6,8,12].includes(x)&&![1,4,7,10].includes(c.h.Moon)?{w:`Moon in the ${pxOrd(x)} from Jupiter and not angular from Lagna`,pl:['Moon','Jupiter']}:0},
  'Fluctuating fortunes in the Moon/Jupiter periods; cancelled if the Moon is angular from Lagna.');
 add('Daridra-type yoga (11th lord in 6/8/12)','bad','Classical (non-BPHS)',c=>{const l=c.lord(11);return PX_DUS.includes(c.h[l])?{w:`11th lord ${l} in the ${pxOrd(c.h[l])}`,pl:[l]}:0},
  'Gains come slowly or with obstacles and need persistence. Strengthening the 11th lord and avoiding speculative shortcuts is advised.');
 add('Mars + Saturn in the 2nd (BPHS Ch.42)','mixed','BPHS Ch.42',c=>c.h.Mars===2&&c.h.Saturn===2?(c.asp('Mercury','Mars')||c.asp('Mercury','Saturn')?{w:'Mars and Saturn in the 2nd, aspected by Mercury',pl:['Mars','Saturn','Mercury']}:{w:'Mars and Saturn together in the 2nd',pl:['Mars','Saturn']}):0,
  'The text gives two results for this pair: strain on accumulated wealth, but great wealth when Mercury aspects. Check Mercury’s support.','Wealth destruction: Mars and Saturn together in Dhan Bhava',42);
 add('Sun/Saturn in the 2nd (BPHS Ch.42)','mixed','BPHS Ch.42',c=>{if(c.h.Sun===2)return c.asp('Saturn','Sun')?{w:'Sun in the 2nd aspected by Saturn',pl:['Sun','Saturn']}:{w:'Sun in the 2nd without Saturn’s aspect (text: riches and fame)',pl:['Sun']};if(c.h.Saturn===2&&c.asp('Sun','Saturn'))return{w:'Saturn in the 2nd aspected by the Sun',pl:['Saturn','Sun']};return 0},
  'Sun in the 2nd without Saturn’s aspect is called good for riches and fame; with Saturn’s aspect (or Saturn there with the Sun’s aspect) finances need care.','Penury: Sun in Dhan Bhava aspected by Saturn',42);
 add('Lagna lord in 6/8/12 with malefic (BPHS Ch.42)','bad','BPHS Ch.42',c=>{const l=c.lord(1);return PX_DUS.includes(c.h[l])&&PX_P9.some(q=>q!==l&&c.conj(l,q)&&c.mal(q))?{w:`Lagna lord ${l} in the ${pxOrd(c.h[l])} with a malefic`,pl:[l]}:0},
  'Weakened Lagna lord in a difficult house: material security is built slowly. Strengthening the Lagna lord (see the Remedies tab) is the traditional answer.','Penury: Lagna lord with malefic in Ari, Randhr, or Vyaya which...',42);
 add('5th lord in 6th & 9th lord in 12th (BPHS Ch.42)','bad','BPHS Ch.42',c=>c.h[c.lord(5)]===6||c.h[c.lord(9)]===12?{w:`5th lord in house ${c.h[c.lord(5)]} / 9th lord in house ${c.h[c.lord(9)]}`,pl:[c.lord(5),c.lord(9)]}:0,
  'Fortune and merit come only after effort or away from the birthplace.','Penury: Putra lord in Ari and Dharma lord in Vyaya, aspected',42);
 add('Kala Sarpa pattern (all planets between Rahu and Ketu)','bad','Classical (non-BPHS)',c=>{const r=c.sid.Rahu,inArc=p=>((c.sid[p]-r+360)%360)<180;const a=PX_P7.filter(inArc).length;return a==7||a==0?{w:'All seven planets lie on one side of the Rahu-Ketu axis',pl:PX_P9}:0},
  'A concentrated, karmically driven life pattern with sudden changes; the results depend on the planets’ strength and dashas. Not a BPHS yoga.');
 add('Manglik (Kuja) Dosha','mixed','Classical (non-BPHS)',c=>{const f=(r)=>[1,4,7,8,12].includes(r),a=f(c.h.Mars),m=f(c.fromMoon('Mars'));if(!(a||m))return 0;
  const canc=[];if(OWN.Mars.includes(c.sg.Mars)||c.sg.Mars===EX.Mars)canc.push('Mars in own/exalted sign');if(c.asp('Jupiter','Mars')||c.conj('Jupiter','Mars'))canc.push('Jupiter links to Mars');if(c.conj('Mars','Moon'))canc.push('Mars with the Moon');
  return{w:`Mars is in house ${c.h.Mars} from Lagna (${a?'counts':'does not count'}) and house ${c.fromMoon('Mars')} from the Moon (${m?'counts':'does not count'}); the Lagna reference is the stronger one`+(canc.length?`. Mitigation: ${canc.join(', ')}`:''),pl:['Mars']}},
  'Strong Mars energy in relationship houses: assertiveness and passion that need to be matched in a partnership. Commonly weighed in matching; mitigations are listed where present. This is not a BPHS yoga and should not be used alone to judge a marriage.');
 return D}

function pxYogas(c){
 const out=[];pxYogaDefs().forEach(d=>{let r=0;try{r=d.f(c)}catch(e){r=0}if(r){const pl=[...new Set(r.pl||[])],r7=pl.filter(x=>PX_P7.includes(x)),av=r7.length?Math.round(r7.reduce((s,x)=>s+c.strength(x).pct,0)/r7.length):null;out.push({...d,why:r.w,planets:pl,avg:av})}});return out}

// ---------- Life-area readings ----------
const PX_AREAS=[
 {id:'self',t:'Self, nature and vitality',h:1,k:'Sun',th:'personality, temperament and general direction in life'},
 {id:'wealth',t:'Wealth, speech and family resources',h:2,k:'Jupiter',th:'earning, savings, speech and family resources',alt:11},
 {id:'effort',t:'Courage, effort and siblings',h:3,k:'Mars',th:'initiative, skill, communication and relationship with siblings'},
 {id:'home',t:'Home, mother, property and vehicles',h:4,k:'Moon',th:'home, emotional security, mother, land and vehicles'},
 {id:'learn',t:'Education, creativity and children',h:5,k:'Jupiter',th:'education, creative intelligence, mantra practice and children'},
 {id:'service',t:'Service, competition and debts',h:6,k:'Mars',th:'daily work, competition, service and the handling of obstacles'},
 {id:'marriage',t:'Marriage and partnerships',h:7,k:'Venus',th:'marriage, business partnership and public dealings'},
 {id:'hidden',t:'Transformation, research and the hidden',h:8,k:'Saturn',th:'sudden change, research, inheritance and occult interests'},
 {id:'fortune',t:'Fortune, dharma, father and teachers',h:9,k:'Jupiter',th:'luck, higher learning, father, teachers and pilgrimage'},
 {id:'career',t:'Career, status and authority',h:10,k:'Mercury',th:'profession, reputation, authority and visibility'},
 {id:'gains',t:'Gains, friends and aspirations',h:11,k:'Jupiter',th:'income, networks, elder siblings and fulfilment of wishes'},
 {id:'loss',t:'Expenses, foreign lands and moksha',h:12,k:'Saturn',th:'expenditure, foreign residence, retreat, sleep and spiritual release'}];
const PX_LAGNA=['Mesha (Aries): direct, energetic, pioneering; quick to act and to forgive.','Vrishabha (Taurus): steady, sensual, practical; values security and comfort.','Mithuna (Gemini): curious, communicative, versatile; thrives on ideas and variety.','Kataka (Cancer): caring, protective, intuitive; deeply attached to home and family.','Simha (Leo): dignified, generous, leadership-minded; needs recognition.','Kanya (Virgo): analytical, service-minded, detail-oriented and self-critical.','Thula (Libra): diplomatic, aesthetic, fair-minded; seeks balance and partnership.','Vrischika (Scorpio): intense, private, resourceful and determined.','Dhanu (Sagittarius): optimistic, principled, freedom-loving; drawn to philosophy.','Makara (Capricorn): disciplined, ambitious, patient; builds slowly and lastingly.','Kumbha (Aquarius): original, humanitarian, detached; thinks in terms of groups and systems.','Meena (Pisces): imaginative, compassionate, spiritual; absorbs the moods around them.'];
const PX_PROF={Sun:'government, administration, leadership, medicine, authority and public-facing roles',Moon:'public service, care professions, food and liquids, hospitality and dealings with the public',Mars:'engineering, defence and police, surgery, sports, real estate and technical or competitive work',Mercury:'commerce, accounting, writing, teaching, IT, analytics and communication',Jupiter:'teaching, law, finance and banking, counselling, advisory, religion and publishing',Venus:'arts, entertainment, design, fashion, luxury goods, hospitality and beauty fields',Saturn:'labour-intensive or long-cycle fields: industry, mining, agriculture, construction, administration and service',Rahu:'foreign dealings, technology, research, unconventional or fast-changing industries',Ketu:'research, spirituality, healing arts, occult sciences and detached or behind-the-scenes work'};
const PX_BAND=['Challenging','Needs care','Mixed','Supportive','Very supportive'];

function pxBhava(c,h){
 const lord=c.lord(h),lh=c.h[lord],st=c.strength(lord),dg=c.dig(lord),A=PX_AREAS[h-1],karaka=PX_BHK[h-1],ks=c.strength(karaka);
 const occ=c.inH(h),sign=c.hs(h),asp=PX_P7.filter(q=>PX_ASP[q].includes(pxHfs(c.sg[q],sign))&&c.h[q]!==h);
 let sc=0;const notes=[];
 if(PX_DUS.includes(h)){if(PX_DUS.includes(lh)&&lh!==h){sc+=1;notes.push(`its lord ${lord} sits in another difficult house (${pxOrd(lh)}), which weakens troubles of the ${pxOrd(h)} (Viparita principle)`)}else if(lh===h){sc+=.3}else if([1,4,5,7,9,10].includes(lh)){sc-=.5;}}
 else{if([1,4,7,10,5,9].includes(lh)){sc+=1.5;notes.push(`its lord ${lord} is well placed in the ${pxOrd(lh)}`)}else if(PX_DUS.includes(lh)){sc-=1.5;notes.push(`its lord ${lord} falls in the ${pxOrd(lh)} (a difficult house)`)}else sc+=.3}
 if(!PX_DUS.includes(h)){if(['exalted','own sign','mooltrikona'].includes(dg)){sc+=1.5;notes.push(`${lord} is ${dg}`)}else if(dg=='debilitated'){sc-=1.5;notes.push(`${lord} is debilitated`)}else if(dg=='friend sign')sc+=.5;else if(dg=='enemy sign'){sc-=.5;notes.push(`${lord} is in an enemy sign`)}
  if(c.combust(lord)){sc-=1;notes.push(`${lord} is combust`)}}
 const bo=occ.filter(p=>c.ben(p)),mo=occ.filter(p=>c.mal(p)),ba=asp.filter(p=>c.ben(p)),ma=asp.filter(p=>c.mal(p));
 const mgood=PX_UPA.includes(h);
 sc+=Math.min(2,bo.length*.8+ba.length*.6);sc-=Math.min(2,(mgood?0:mo.length*.8)+(mgood?0:ma.length*.6));if(mgood)sc+=Math.min(1,mo.length*.4);
 if(bo.length)notes.push(`benefic ${pxJoin(bo)} occupies it`);if(mo.length)notes.push(`${pxJoin(mo)} occupy${mo.length==1?'s':''} it${mgood?' (malefics do well in this growth house)':''}`);
 if(ba.length)notes.push(`aspected by ${pxJoin(ba)}`);if(ma.length&&!mgood)notes.push(`pressured by ${pxJoin(ma)}`);
 if(ks.band=='Strong')sc+=.5;else if(ks.band=='Weak'&&PX_P7.includes(karaka))sc-=.5;
 const idx=sc>=3?4:sc>=1.3?3:sc>=-.3?2:sc>=-1.5?1:0;
 return{h,lord,lh,dg,st,occ,asp,notes,sc,band:PX_BAND[idx],idx,karaka,ks}}

function pxLifeAreas(c){
 return PX_AREAS.map(A=>{const b=pxBhava(c,A.h);let extra=[];
  if(A.id=='wealth'){const b11=pxBhava(c,11);extra.push(`The 11th house (income) is rated ${b11.band.toLowerCase()}, with its lord ${b11.lord} in the ${pxOrd(b11.lh)}.`)}
  if(A.id=='career'){const l=b.lord,pl=new Set([l,...b.occ.filter(p=>PX_PROF[p])]);const best=PX_P7.filter(p=>c.strength(p).band=='Strong').slice(0,2);
   extra.push(`Fields linked to the 10th lord ${l}`+(b.occ.length?` and occupant(s) ${pxJoin(b.occ)}`:'')+`: ${[...pl].slice(0,3).map(p=>PX_PROF[p]).join('; also ')}.`);
   if(best.length)extra.push(`Strongest planets in the chart (${pxJoin(best)}) show natural talents that can be drawn on: ${best.map(p=>PX_PROF[p].split(',')[0]).join(', ')}.`)}
  if(A.id=='marriage'){const v=c.strength('Venus'),j=c.strength('Jupiter'),l=b.lord;extra.push(`Venus (marriage significator) is ${v.band.toLowerCase()} and Jupiter ${j.band.toLowerCase()}; the 7th lord ${l} is in the ${pxOrd(b.lh)}.`);
   const mg=pxYogas(c).find(y=>y.n.startsWith('Manglik'));if(mg)extra.push('Mars is placed in a house traditionally weighed for marriage matching (see Yogas & Doshas); the stated mitigations apply where listed.');
   const dk=J_karakaData(c.sid).ranked[7];if(dk)extra.push(`Darakaraka (Jaimini significator of the spouse) is ${dk.planet}, in the ${pxOrd(c.h[dk.planet])} house.`)}
  if(A.id=='self'){extra.push(PX_LAGNA[c.L]);const m=c.sg.Moon;extra.push(`The Moon in ${SG[m]} (${NK[nk(c.sid.Moon).i]}) colours the mind and emotional style.`)}
  if(A.id=='fortune'){extra.push(`Father is read from the 9th and from the stronger of Sun and Venus (Ch.32): ${c.strength('Sun').pct>=c.strength('Venus').pct?'Sun':'Venus'} is stronger here.`)}
  if(A.id=='home'){extra.push(`Mother is read from the 4th and from the stronger of Moon and Mars (Ch.32): ${c.strength('Moon').pct>=c.strength('Mars').pct?'Moon':'Mars'} is stronger here.`)}
  return{...A,b,extra}})}

// ---------- Transits (classical gochara, non-BPHS) ----------
const PX_GOCH={Saturn:[3,6,11],Jupiter:[2,5,7,9,11],Rahu:[3,6,10,11],Ketu:[3,6,10,11],Mars:[3,6,11],Sun:[3,6,10,11]};
function pxTransit(c,la,lo){
 const now=Date.now(),jd=now/864e5+2440587.5,t=calc(jd,la,lo).sid,mo=c.sg.Moon,rows=[];
 ['Saturn','Jupiter','Rahu','Ketu'].forEach(p=>{const s=Math.floor(t[p]/30),hm=pxHfs(mo,s),hl=pxHfs(c.L,s);rows.push({p,s,hm,hl,good:PX_GOCH[p].includes(hm)})});
 const sat=rows[0],sd=sat.hm,ss=sd==12?'Sade Sati - first phase (Saturn in the 12th from the Moon)':sd==1?'Sade Sati - peak phase (Saturn over the natal Moon sign)':sd==2?'Sade Sati - last phase (Saturn in the 2nd from the Moon)':sd==4?'Kantaka Shani (Saturn in the 4th from the Moon)':sd==8?'Ashtama Shani (Saturn in the 8th from the Moon)':'';
 return{rows,ss,at:new Date(now).toISOString().slice(0,10)}}

// ---------- Rendering ----------
function pxBadge(k){return`<span class="px-b px-${k}">${tx(k=='good'?'Good':k=='bad'?'Challenging':'Mixed')}</span>`}
function pxStrengthCard(c){
 const rows=PX_P9.map(p=>{if(p=='Rahu'||p=='Ketu'){const f=c.func(p);return`<tr><td>${tx(p)}</td><td>${SG[c.sg[p]]} · ${tx('house')} ${c.h[p]}</td><td>${tx(c.dig(p))}</td><td>—</td><td class="w">${f.label}</td></tr>`}
  const s=c.strength(p),f=c.func(p);return`<tr><td>${tx(p)}</td><td>${SG[c.sg[p]]} · ${tx('house')} ${c.h[p]}</td><td>${tx(c.dig(p))}</td><td><b>${s.pct}</b> ${tx(s.band)}</td><td class="w">${f.label} (${pxJoin(c.owned(p).map(pxOrd))||'—'}); ${s.parts.filter(x=>x!=c.dig(p)).join(', ')||'—'}</td></tr>`}).join('');
 return`<div class="card sc"><h2>${tx('Planet strength and functional nature')}</h2><table><tr><th>${tx('Planet')}</th><th>${tx('Placement')}</th><th>${tx('Dignity')}</th><th>${tx('Strength index')}</th><th>${tx('Functional nature and factors')}</th></tr>${rows}</table>
 <small>${tx('The strength index (0-100) is a simplified scheme: dignity, directional strength, house type, aspects/conjunctions, combustion and vargottama. It is not classical Shadbala (rupas). Functional nature follows BPHS Ch.34 principles.')}</small></div>`}
function pxYogaCard(c,ys){
 const g=ys.filter(y=>y.k=='good'),m=ys.filter(y=>y.k=='mixed'),b=ys.filter(y=>y.k=='bad');
 const one=y=>{let bp='';if(y.rec){try{const r=bphsYogaRecordsFor(y.rec,y.ch);if(r.length){const t=bphsSafeSourceText(r[0].traditional_result||'');if(t.text)bp=`<p class="w"><small><b>${tx('BPHS text')}${r[0].verse_reference?' ('+pxEsc(r[0].verse_reference)+')':''}:</b> ${pxEsc(t.text)}${t.redacted?' <i>['+tx('sensitive clauses omitted')+']</i>':''}</small></p>`}}catch(e){}}
  return`<details class="px-y"><summary>${pxBadge(y.k)} <b>${tx(y.n)}</b> <small>· ${pxEsc(y.s)}</small></summary><p class="w"><b>${tx('Formed by')}:</b> ${pxEsc(y.why)}</p>${y.avg!==null?`<p class="w"><small>${tx('Average strength of the planets involved')}: ${y.avg} (${tx(y.avg>=62?'Strong':y.avg>=42?'Moderate':'Weak')}). ${tx(y.avg>=62?'Well supported, so the result is likely to show clearly.':y.avg>=42?'Moderately supported; results appear in the related dashas.':'Weakly supported; the result may be muted or delayed.')}</small></p>`:''}<p class="w">${pxEsc(y.r)}</p>${bp}</details>`};
 const sec=(t,a)=>a.length?`<h3>${tx(t)} (${a.length})</h3>${a.map(one).join('')}`:'';
 return`<div class="card"><h2>${tx('Yogas and doshas found in this chart')}</h2><p class="w"><small>${ys.length} ${tx('formations detected')} · ${g.length} ${tx('Good')} · ${m.length} ${tx('Mixed')} · ${b.length} ${tx('Challenging')}. ${tx('Pancha Mahapurusha, Nabhasa, Sunapha/Anapha/Duradhara/Kemadruma, Vesi/Vosi/Ubhayachari yogas are in the Analysis tab.')}</small></p>
 ${sec('Good yogas',g)}${sec('Mixed yogas',m)}${sec('Challenging yogas and doshas',b)}
 ${ys.length?'':`<p>${tx('No formation from this list was detected.')}</p>`}
 <small>${tx('A yoga shows a potential; its strength, cancellation and timing (dasha) must be judged. Items marked Classical (non-BPHS) come from later traditional texts, not from BPHS.')}</small></div>`}
function pxAreasCard(c){
 const A=pxLifeAreas(c),cls=['px-r0','px-r1','px-r2','px-r3','px-r4'];
 return`<div class="card"><h2>${tx('Life-area readings')}</h2><p class="w"><small>${tx('Each area is rated from its house lord’s placement and dignity, occupants, aspects and the natural significator (BPHS Ch.11, 24, 32). Ratings are tendencies, not events; health, longevity and mortality are intentionally not predicted.')}</small></p>
 ${A.map(a=>{const b=a.b;return`<details class="px-a"><summary><span class="px-rate ${cls[b.idx]}">${tx(b.band)}</span> <b>${tx(a.t)}</b> <small>· ${pxOrd(a.h)} ${tx('house')}</small></summary>
  <p class="w">${pxOrd(a.h)} ${tx('house')} (${PX_HN[a.h-1]}) ${tx('governs')} ${a.th}. ${tx('Lord')} <b>${tx(b.lord)}</b> ${tx('is in house')} ${b.lh} (${HTH[b.lh-1]}), ${tx(b.dg)}, ${tx('strength')} ${b.st.pct} (${tx(b.st.band)}).${b.notes.length?' '+tx('Factors')+': '+b.notes.join('; ')+'.':''}</p>
  ${a.extra.map(x=>`<p class="w">${pxEsc(x)}</p>`).join('')}
  <p class="w"><small>${tx('Natural significator')} ${tx(b.karaka)}: ${tx(b.ks.band)} (${b.ks.pct}). ${b.idx>=3?tx('This area tends to run more smoothly, especially in the periods of')+' '+tx(b.lord)+'.':b.idx<=1?tx('This area asks for conscious effort; strengthening')+' '+tx(b.lord)+' '+tx('(see Remedies) is the traditional approach.'):tx('Results are mixed and depend on the running dasha.')}</small></p></details>`}).join('')}</div>`}
function pxTransitCard(c,la,lo){
 const T=pxTransit(c,la,lo);
 return`<div class="card sc"><h2>${tx('Current transits (gochara)')} · ${T.at}</h2><table><tr><th>${tx('Planet')}</th><th>${tx('Sign')}</th><th>${tx('From Moon')}</th><th>${tx('From Lagna')}</th><th>${tx('Traditional view')}</th></tr>
 ${T.rows.map(r=>`<tr><td>${tx(r.p)}</td><td>${SG[r.s]}</td><td>${r.hm}</td><td>${r.hl}</td><td>${r.good?tx('Favourable house from the Moon'):tx('Neutral or testing house from the Moon')}</td></tr>`).join('')}</table>
 ${T.ss?`<p class="w"><b>${tx(T.ss)}.</b> ${tx('A seven-and-a-half-year Saturn cycle of lessons in responsibility; Saturn upayas and steady routine are the usual advice (see Remedies).')}</p>`:`<p class="w">${tx('Saturn is not in a Sade Sati/Kantaka/Ashtama position from the natal Moon right now.')}</p>`}
 <small>${tx('Gochara rules are from later classical texts (not BPHS). Positions use the same ephemeris and today’s date.')}</small></div>`}
function pxLagnaCard(c){
 const M=nk(c.sid.Moon);
 return`<div class="card"><h2>${tx('Core character')}</h2><p class="w"><b>${tx('Lagna')}:</b> ${PX_LAGNA[c.L]}</p><p class="w"><b>${tx('Lagna lord')}</b> ${tx(c.lord(1))} ${tx('in house')} ${c.h[c.lord(1)]} (${HTH[c.h[c.lord(1)]-1]}), ${tx(c.dig(c.lord(1)))}, ${tx('strength')} ${c.strength(c.lord(1)).pct}.</p>
 <p class="w"><b>${tx('Moon')}:</b> ${SG[c.sg.Moon]} · ${NK[M.i]} ${tx('pada')} ${M.p}, ${tx('house')} ${c.h.Moon}. ${c.waxing?tx('Waxing Moon (benefic).'):tx('Waning Moon (treated as malefic unless supported by benefics).')}</p></div>`}
function predictTab(sid,la,lo){
 const c=pxCtx(sid),ys=pxYogas(c);
 return pxLagnaCard(c)+pxAreasCard(c)+(typeof pxBhavaRulesCard=='function'?pxBhavaRulesCard(c):'')+pxStrengthCard(c)+pxTransitCard(c,la,lo)}
function yogaTab(sid){const c=pxCtx(sid);return pxYogaCard(c,pxYogas(c))}
