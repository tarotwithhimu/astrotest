// Jyotish Kundli v18 - remedies (upaya) module.
// BPHS-sourced items: Ch.3 (graha attributes), Ch.52-60 (remedies per antardasha), Ch.83 (curses), Ch.84 (graha worship),
// Ch.85-96 (inauspicious births). Items from later tradition (gems, beeja mantras, modern charity) are labelled as such.
// All wording is paraphrased. Rituals are to be performed under a qualified priest (BPHS Ch.92 note).

// Ch.84 vv.3-27 plus Ch.3: image metal, recitation count, havan wood, Brahmin food and charity, in the order Sun..Ketu.
const PX_REM={
 Sun:{img:'copper',cnt:7000,wood:'Arka (Aak)',food:'rice cooked with jaggery',gift:'a cow with calf',form:'red like a lotus, two-armed, holding a lotus, on a seven-horse chariot',day:'Sunday',col:'red / copper',gem:'Ruby (Manikya)',beej:'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',deity:'Surya (Agni in the Ch.3 verse)',modern:'wheat, jaggery, copper vessel, red cloth',themes:'self-confidence, authority, father, vitality'},
 Moon:{img:'rock crystal (sphatika)',cnt:11000,wood:'Palasha',food:'rice cooked in milk',gift:'a conch',form:'white, in white robes, two-armed with a mace and a boon-giving hand, on a ten-horse chariot',day:'Monday',col:'white',gem:'Pearl (Moti)',beej:'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः',deity:'Chandra (Varuna / the waters in the Ch.3 verse)',modern:'rice, milk, white cloth, silver',themes:'mind, emotional steadiness, mother, comforts'},
 Mars:{img:'red sandalwood',cnt:11000,wood:'Khadira',food:'havishya (sacrificial rice)',gift:'a bullock',form:'red necklace and robes, four-armed (spear, trident, mace, boon), mounted on a ram',day:'Tuesday',col:'red',gem:'Red Coral (Moonga)',beej:'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',deity:'Kartikeya / Subrahmanya (Hanuman in common practice)',modern:'red lentils (masoor), red cloth, jaggery',themes:'courage, energy, property, siblings'},
 Mercury:{img:'gold',cnt:9000,wood:'Apamarga (Chirchiri)',food:'rice cooked with milk (payasa)',gift:'gold',form:'yellow garland and robes, four-armed (sword, shield, mace, boon), mounted on a lion',day:'Wednesday',col:'green',gem:'Emerald (Panna)',beej:'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',deity:'Vishnu',modern:'green gram (moong), green cloth, books or stationery',themes:'intellect, speech, trade, learning'},
 Jupiter:{img:'gold',cnt:19000,wood:'Pippala (Pipal)',food:'curd rice',gift:'robes (cloth)',form:'yellow-complexioned, four-armed (staff, rosary, water pot, boon)',day:'Thursday',col:'yellow',gem:'Yellow Sapphire (Pukhraj)',beej:'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',deity:'Indra in the Ch.3 verse (Brihaspati / Dakshinamurti in common practice)',modern:'chana dal, turmeric, yellow cloth, books',themes:'wisdom, teachers, wealth, children, dharma'},
 Venus:{img:'silver',cnt:16000,wood:'Udumbara (Goolar)',food:'rice with ghee',gift:'a horse (or its value)',form:'fair-complexioned, four-armed like Jupiter (staff, rosary, water pot, boon)',day:'Friday',col:'white / cream',gem:'Diamond (or white sapphire / zircon)',beej:'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',deity:'Shachi / Lakshmi',modern:'rice, sugar, white cloth, perfume',themes:'marriage, comforts, arts, vehicles'},
 Saturn:{img:'iron',cnt:23000,wood:'Shami',food:'rice cooked with ground sesame',gift:'a black cow',form:'indigo-lustred, four-armed (trident, bow, arrow, boon), mounted on a donkey',day:'Saturday',col:'black / dark blue',gem:'Blue Sapphire (Neelam)',beej:'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',deity:'Brahma in the Ch.3 verse (Shani / Hanuman in common practice)',modern:'black sesame, mustard oil, black cloth, iron articles',themes:'discipline, work, service, patience'},
 Rahu:{img:'glass',cnt:18000,wood:'Durva grass',food:'rice cooked with meat (vegetarian substitutes such as black gram rice are customary)',gift:'iron weapons (or an iron article)',form:'dark blue, hideous face, four-armed (sword, shield, trident, boon), mounted on a lion',day:'Saturday',col:'dark blue / smoky',gem:'Hessonite (Gomed)',beej:'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',deity:'Durga',modern:'black gram (urad), blanket, coconut',themes:'ambition, foreign matters, unconventional paths'},
 Ketu:{img:'bell metal',cnt:17000,wood:'Kusha grass',food:'rice cooked with mixed cereals',gift:'a goat',form:'smoky-coloured, two-armed with a mace and a boon, hideous face, mounted on a donkey',day:'Tuesday',col:'smoky / multi-colour',gem:'Cat’s Eye (Lehsunia)',beej:'ॐ स्रां स्रीं स्रौं सः केतवे नमः',deity:'Ganesha',modern:'multicolour blanket, sesame, food for dogs or birds',themes:'detachment, research, spirituality, liberation'}};

// Ch.52-60: remedy named for each antardasha inside each mahadasha (paraphrased). Missing pairs have no explicit remedy in the text.
const PX_ADR={
 Sun:{Sun:'Mrityunjaya japa or Surya worship with mantras and charity',Moon:'charity of a white cow and a she-buffalo (or their value)',Mars:'Vedic recitation, japa and the Vrishotsarga rite',Rahu:'worship of Goddess Durga, japa, charity of a black cow or she-buffalo',Jupiter:'charity of gold and a tawny cow; worship of the Ishta Devata',Saturn:'charity of a black cow, buffalo or goat; Mrityunjaya japa',Mercury:'Vishnu Sahasranama and charity of grain and a silver idol',Ketu:'Durga Saptashati (Shat Chandi) path and charity of a goat',Venus:'Mrityunjaya and Rudra japa; charity of a tawny cow or she-buffalo'},
 Moon:{Moon:'charity of a tawny cow or she-buffalo',Rahu:'Rahu japa and charity of a goat',Jupiter:'Shiva Sahasranama japa and charity of gold',Saturn:'Mrityunjaya japa; charity of a black cow or she-buffalo',Mercury:'Vishnu Sahasranama and charity of a goat',Ketu:'Mrityunjaya japa',Venus:'Rudra japa; charity of a white cow and silver',Sun:'worship of Lord Shiva'},
 Mars:{Mars:'Rudra japa and charity of a red bull',Rahu:'Naga puja, feeding Brahmins and Mrityunjaya japa',Jupiter:'Shiva Sahasranama',Mercury:'Vishnu Sahasranama and charity of a horse',Venus:'charity of a cow or she-buffalo',Sun:'worship of Surya in the prescribed manner',Moon:'mantras of Goddess Durga and Goddess Lakshmi'},
 Rahu:{Rahu:'worship of Rahu with his mantras and charity of articles ruled by Rahu',Saturn:'charity of a black cow or she-buffalo',Mercury:'Vishnu Sahasranama',Ketu:'charity of a goat',Venus:'worship of Goddess Durga and Goddess Lakshmi',Sun:'worship of Surya',Moon:'charity of a white cow or she-buffalo',Mars:'charity of a cow or bull'},
 Jupiter:{Jupiter:'Rudra japa and Shiva Sahasranama',Saturn:'Vishnu Sahasranama; charity of a black cow or she-buffalo',Mercury:'Vishnu Sahasranama',Ketu:'Mrityunjaya japa',Venus:'charity of a tawny cow or she-buffalo',Sun:'recitation of the Aditya Hridaya',Moon:'Durga Saptashati path',Mars:'charity of a bull',Rahu:'Mrityunjaya japa and charity of a goat'},
 Saturn:{Saturn:'Mrityunjaya japa',Mercury:'Vishnu Sahasranama; charity of grain',Ketu:'charity of a goat',Venus:'Durga Saptashati path; charity of a cow or she-buffalo',Sun:'worship of Surya',Moon:'havan; charity of jaggery, ghee, curd rice and a cow or she-buffalo',Mars:'havan and charity of a bull',Rahu:'Mrityunjaya japa and charity of a goat',Jupiter:'Shiva Sahasranama; charity of gold'},
 Mercury:{Mercury:'Vishnu Sahasranama',Ketu:'charity of a goat',Venus:'mantras of Goddess Durga',Sun:'worship of Surya',Moon:'mantras of Goddess Durga; gift of clothes',Mars:'Mrityunjaya japa; charity of a cow',Rahu:'mantras of Durga and Lakshmi; charity of a tawny cow or she-buffalo',Jupiter:'Shiva Sahasranama; charity of a cow and gold',Saturn:'Mrityunjaya japa; charity of a black cow and a she-buffalo'},
 Ketu:{Ketu:'Durga Saptashati japa and Mrityunjaya japa',Venus:'Durga path; charity of a tawny cow or she-buffalo',Sun:'charity of a cow and gold',Moon:'mantras of the Moon and charity of things ruled by the Moon',Mars:'charity of a bull',Rahu:'Durga Saptashati path',Jupiter:'Mrityunjaya japa and Shiva Sahasranama',Saturn:'havan with sesame; charity of a black cow or she-buffalo',Mercury:'Vishnu Sahasranama'},
 Venus:{Venus:'Durga path and charity of a cow',Sun:'worship of Surya',Rahu:'Mrityunjaya japa',Jupiter:'Mrityunjaya japa',Saturn:'havan with sesame, Mrityunjaya japa and Durga Saptashati path',Mercury:'Vishnu Sahasranama',Ketu:'Mrityunjaya japa and charity of a goat; also appease Venus'}};

// Ch.83: shapa (curse) patterns and their remedies, reference only (paraphrased).
const PX_CURSE=[
 ['Serpent (Naga) affliction','Making and worshipping a golden Naga idol; charity of a cow, land, sesame and gold.'],
 ['Father’s displeasure','Shraddha at Gaya; feeding Brahmins (ten thousand, a thousand or a hundred as affordable); helping an unmarried girl’s marriage; gift of a cow.'],
 ['Mother’s displeasure','Bathing at the Setu (Rameswaram); 100,000 Gayatri japa; charity of things connected with malefic planets; feeding Brahmins; circumambulating a Pipal 1008 times.'],
 ['Brother’s displeasure','Chandrayana fast while listening to the Harivamsa; planting a Pipal; gift of ten cows; gift of land with mango trees.'],
 ['Maternal uncle’s displeasure','Installing an idol of Vishnu; building a well, dam or reservoir.'],
 ['Displeasure of a Brahmin','Chandrayana fast and penance; gift of a cow and five gems with gold; feeding Brahmins.'],
 ['Wife’s displeasure','Arranging the marriage of an unmarried girl, or gifting a golden Lakshmi-Narayana idol, a cow, a bed, ornaments and garments to a Brahmin couple.'],
 ['Neglected shraddha of parents','Pinda dana; Rudra abhisheka; gift of a golden Brahma idol, a cow, a silver vessel and a blue gem.'],
 ['Planetary affliction (summary)','Shiva worship for Mercury/Venus; Santana Gopala mantra for Jupiter/Moon; Kanyadana for Rahu; Vishnu worship for the Sun; Rudra japa for Mars/Saturn.']];

const PX_PLN=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
const pxDz=(t,tz)=>new Date(t+tz*36e5).toISOString().slice(0,10);

function pxPlanetPlan(c,runLords){
 return PX_PLN.map(p=>{
  const node=p=='Rahu'||p=='Ketu',f=c.func(p),s=node?null:c.strength(p),dg=c.dig(p),h=c.h[p],issues=[];
  if(dg=='debilitated')issues.push('debilitated');if(dg=='enemy sign')issues.push('in an enemy sign');
  if(!node&&c.combust(p))issues.push('combust');
  if(PX_DUS.includes(h)&&!node)issues.push(`placed in the ${pxOrd(h)} (a difficult house)`);
  if(s&&s.band=='Weak')issues.push('low strength index');
  const aff=PX_P9.filter(q=>q!==p&&c.conj(p,q)&&['Rahu','Ketu','Saturn','Mars'].includes(q)&&!(p=='Mars'&&q=='Mars'));if(aff.length&&!node&&p!='Saturn'&&p!='Mars')issues.push('conjunct '+pxJoin(aff));
  const owned=c.owned(p),mode=node?'appease':(f.yk||f.score>=1)?'strengthen':f.score<=-1?'appease':(s&&s.band=='Weak'?'strengthen':'support');
  const gemOk=!node&&(f.yk||f.score>=1||owned.includes(1)||owned.includes(5)||owned.includes(9))&&!(f.score<=-1);
  const run=runLords.includes(p),pri=issues.length*2+(run?3:0)+(owned.includes(1)?1:0)+(mode=='appease'&&!node?1:0);
  return{p,node,f,s,dg,h,issues,owned,mode,gemOk,run,pri}}).sort((a,b)=>b.pri-a.pri)}

function pxPlanetRem(x){
 const R=PX_REM[x.p],why=x.issues.length?x.issues.join('; '):'no major weakness found';
 const modeTxt=x.mode=='strengthen'?(x.f.score>=1?'Strengthen: this planet is helpful for your Lagna, so building its power is the aim (worship, mantra, its colour and day, charity; gemstone only after expert advice).':'Strengthen: this planet is weak but not harmful for your Lagna, so steady worship, mantra, its colour and day and charity are advised; a gemstone is optional and only after expert advice.'):x.mode=='appease'?'Appease: this planet is a difficult influence here, so the BPHS method is propitiation (worship, japa, havan and charity), not a gemstone.':'Support: no strong need; regular worship on its day is enough.';
 return`<details class="px-p"${x.pri>=4?' open':''}><summary><b>${tx(x.p)}</b> <small>· ${x.f.label} · ${tx(x.mode=='strengthen'?'Strengthen':x.mode=='appease'?'Appease':'Support')} ${x.run?'· '+tx('running dasha lord'):''}</small></summary>
 <p class="w"><b>${tx('Why')}:</b> ${pxEsc(why)}. ${pxEsc(tx('Themes')+': '+R.themes+'.')}</p>
 <p class="w">${pxEsc(modeTxt)}</p>
 <table class="px-t"><tr><th>${tx('Item')}</th><th>${tx('Remedy')}</th><th>${tx('Source')}</th></tr>
 <tr><td>${tx('Japa count')}</td><td>${R.cnt.toLocaleString('en-IN')} ${tx('recitations of the graha mantra (many priests prescribe four times this count today)')}</td><td>BPHS Ch.84 v.17-20</td></tr>
 <tr><td>${tx('Beeja mantra')}</td><td>${R.beej}</td><td>${tx('Traditional (text omits mantras)')}</td></tr>
 <tr><td>${tx('Day, colour')}</td><td>${tx(R.day)}, ${R.col}</td><td>${tx('Traditional')}</td></tr>
 <tr><td>${tx('Havan wood')}</td><td>${R.wood}, ${tx('with honey, ghee, curd or milk; 108 or 28 oblations')}</td><td>BPHS Ch.84 v.21-22</td></tr>
 <tr><td>${tx('Food for Brahmins')}</td><td>${R.food}</td><td>BPHS Ch.84 v.23-24</td></tr>
 <tr><td>${tx('Charity')}</td><td>${R.gift}. ${tx('Popular modern equivalent')}: ${R.modern}.</td><td>BPHS Ch.84 v.25 / ${tx('Traditional')}</td></tr>
 <tr><td>${tx('Image')}</td><td>${R.img}; ${R.form}</td><td>BPHS Ch.84 v.3-14</td></tr>
 <tr><td>${tx('Presiding deity')}</td><td>${R.deity}</td><td>BPHS Ch.3 v.18 / ${tx('Traditional')}</td></tr>
 <tr><td>${tx('Gemstone')}</td><td>${x.gemOk?R.gem+' - '+tx('traditionally considered only for a helpful planet; test and consult a qualified astrologer before wearing'):tx('Not advised for this chart (functional malefic or node); use mantra and charity instead')+' ('+R.gem+')'}</td><td>${tx('Later tradition (not in BPHS)')}</td></tr></table></details>`}

function pxBirthChecks(sid,c){
 const el=c.elong,t0=Math.floor(el/12),tf=(el%12)/12,out=[],M=sid.Moon,Sx=sid.Sun,mi=nk(M).i,gh=.41,ghN=.444;
 const tn=t0==14?'Purnima':t0==29?'Amavasya':(t0<15?'Shukla ':'Krishna ')+TT[t0%15];
 if(t0==29)out.push({n:'Birth on Amavasya (Ch.86)',d:'Born on the new-moon tithi.',r:'Install a kalash with leaves of five sacred trees in the south-west; worship Surya (gold, with copper) and Chandra (silver) images; havan with 108 or 28 oblations; sprinkle the kalash water on the child and parents; charity of gold, silver and a black cow; feed Brahmins.',ch:86});
 if(t0==28){const part=Math.min(6,Math.floor(tf*6)+1),L=['auspicious part (no remedy needed)','part associated with matters of the father','part associated with matters of the mother','part associated with the maternal uncle','part associated with the family line','part associated with wealth and the self'][part-1];
  out.push({n:`Birth on Krishna Chaturdashi (Ch.87), part ${part} of 6`,d:'Chaturdashi is divided in six parts; this birth falls in the '+L+'.',r:part==1?'The first part is called auspicious.':'Golden Shiva image (moon on the forehead, on a bull); kalash in the north-east; abhisheka; worship of the nine grahas; havan with ghee, sesame, urad, mustard and sacred woods, 108 or 28 oblations for each graha; sprinkle kalash water; feed Brahmins.',ch:87})}
 const kk=Math.floor(el/6);if(kk>=1&&kk<=56&&(kk-1)%7==6)out.push({n:'Birth in Bhadra (Vishti) karana (Ch.88)',d:'Vishti karana at birth.',r:'On the day the same inauspicious combination recurs: Vishnu puja at an auspicious lagna, ghee lamp and abhisheka at a Shiva temple, 108 circumambulations of a Pipal, havan with 108 oblations of the Vishnu mantra, feeding Brahmins.',ch:88});
 const yi=Math.floor(((M+Sx)%360)/(360/27)),by={14:'Vajra',16:'Vyatipata',18:'Parigha',26:'Vaidhriti'}[yi];
 if(by)out.push({n:`Birth in ${by} yoga (Ch.88)`,d:'One of the nitya yogas the text names as inauspicious for birth.',r:'Same shanti as for Bhadra (Vishnu puja, Shiva abhisheka, Pipal circumambulation, havan, feeding Brahmins), performed on the day the same yoga recurs.',ch:88});
 else if([0,5,8,9,12].includes(yi))out.push({n:`Birth in ${YG[yi]} yoga (traditional)`,d:'Listed as a difficult nitya yoga in later tradition (not in BPHS).',r:'Same shanti as for Bhadra is customary; keep it light as this is a milder tradition.',ch:0});
 const sk=Math.floor(Sx/30),sd=Sx%30;if(sd<1||sd>29)out.push({n:'Birth near Sankranti (Ch.90)',d:`Sun is within 1° of the ${sd<1?'entry into':'exit from'} ${SG[sk]}.`,r:'Yagya for the nine grahas: three heaps of paddy, rice and (as stated) other grains on a cleansed spot to the east; worship and havan of the nine grahas; charity.',ch:90});
 const nearNode=(x)=>Math.min(Math.abs(((x-sid.Rahu+540)%360)-180),Math.abs(((x-sid.Ketu+540)%360)-180));
 if((t0==14&&nearNode(M)<15)||(t0==29&&nearNode(Sx)<18))out.push({n:`Possible birth near an ${t0==29?'solar':'lunar'} eclipse (Ch.91)`,d:`${tn} with the ${t0==29?'Sun':'Moon'} close to a lunar node. This is only an indicator: verify against actual eclipse records for the date.`,r:`Golden image of the nakshatra deity, ${t0==29?'golden Surya':'silver Chandra'} image and a lead Rahu image; offerings in the luminary’s colour; havan with ${t0==29?'Arka':'Palasha'}, Durva for Rahu and Pipal for the nakshatra deity; sprinkle kalash water; feed Brahmins.`,ch:91});
 const tg=(()=>{const m=t0%15,e=el%12;const pa=[4,9,14].includes(m)&&e>12-gh*(1),na=[0,5,10].includes(m)&&e<gh;return pa?'last 2 ghatis of a Purna tithi':na?'first 2 ghatis of a Nanda tithi':''})();
 if(tg)out.push({n:'Tithi Gandanta (Ch.92)',d:'Birth in the '+tg+' (approximate).',r:'Charity of a bullock; abhisheka of the child (with the father if in the first part, with the mother if in the second); puja of the tithi deity, havan and feeding Brahmins.',ch:92});
 let ng='';[[0,'Ashwini','Revati'],[120,'Magha','Ashlesha'],[240,'Moola','Jyeshtha']].forEach(([b,a,z])=>{const f=(M-b+360)%360,g=(b-M+360)%360;if(f<ghN)ng='first 2 ghatis of '+a;else if(g<ghN)ng='last 2 ghatis of '+z});
 if(ng)out.push({n:'Nakshatra Gandanta (Ch.92)',d:`Moon is in the ${ng} (approximate).`,r:'Charity of a cow with calf; puja of the nakshatra deity on a golden image, havan, abhisheka and feeding Brahmins. The text prescribes three cows for Jyeshtha–Mula and Ashlesha–Magha, two for Revati–Ashwini.',ch:92});
 if(M>=240-1.333&&M<240+1.778)out.push({n:'Abhukta Mula (Ch.93)',d:'Birth within the last 6 ghatis of Jyeshtha or the first 8 ghatis of Mula (approximate).',r:'Rites after the 12th day or on the next Janma Nakshatra day: a canopy, kalash with panchagavya, a golden Rakshasa image worshipped with Indra and Varuna, havan with 1008 or 108 oblations, Mrityunjaya mantra and abhisheka, charity of a cow with calf, feeding Brahmins. Ch.94 adds an Indra-centred rite.',ch:93});
 const lp=sid.Lagna%30,lsg=Math.floor(sid.Lagna/30),lgd=([3,7,11].includes(lsg)&&lp>27)||([0,4,8].includes(lsg)&&lp<3);
 if(lgd)out.push({n:'Lagna Gandanta (Ch.92)',d:'Ascendant is at the junction of a water sign and the following fire sign (approximate: within about 3° of the boundary).',r:'Charity of gold; puja of the Lagna deity on a golden image, havan, abhisheka and feeding Brahmins.',ch:92});
 const pada=nk(M).p;
 if(mi==17||(mi==15&&pada==4)||(mi==8&&pada>=2)||(mi==18&&pada<=3))out.push({n:'Marriage-time shanti (Ch.94)',d:`Moon in ${NK[mi]} pada ${pada}: the text prescribes a precaution at the time of marriage.`,r:'Suitable shanti and charity of a cow at the time of marriage (the text notes no effect if the spouse has no elder brother).',ch:94});
 return{list:out,tn}}

function pxDashaRem(c,sid,ms,tz,mnk){
 const ctx=dashaCtx(sid),tree=dashaTree(ms,mnk),now=Date.now();
 const cur=tree.find(x=>now<x.e)||tree[0],ca=cur.ads.find(x=>now<x.e)||cur.ads[0];
 let pr=[],ps=ca.s;const ad=ca.e-ca.s;for(let j=0;j<9;j++){const P=(ca.L+j)%9,pe=ps+ad*YR[P]/120;pr.push({L:P,s:ps,e:pe});ps=pe}
 const cp=pr.find(x=>now<x.e)||pr[0],md=LDE[cur.L],an=LDE[ca.L],pd=LDE[cp.L];
 const adRule=(m,a)=>PX_ADR[m]&&PX_ADR[m][a]||'';
 const rec=(m,a)=>{const r=adText(ctx,m,a),o=ctx.P[a].own;return o.includes(2)||o.includes(7)||r.sc<.75};
 const line=(lab,p,from,to,extra)=>`<tr><td data-l="${tx('Level')}">${lab}</td><td data-l="${tx('Lord')}"><b>${tx(p)}</b></td><td data-l="${tx('Period')}">${pxDz(from,tz)} → ${pxDz(to,tz)}</td><td class="w" data-l="${tx('Result and remedy')}">${extra}</td></tr>`;
 const mdSc=lordScore(ctx,md),adS=adText(ctx,md,an);
 const cmain=`<div class="card"><h2>${tx('Remedies for the running dasha')}</h2>
  <div class="sc"><table class="px-st"><tr><th>${tx('Level')}</th><th>${tx('Lord')}</th><th>${tx('Period')}</th><th>${tx('Result and remedy')}</th></tr>
  ${line(tx('mahadasha'),md,cur.s,cur.e,`${tx(grade(mdSc.sc))}. ${pxEsc(tx('Themes')+': '+PX_REM[md].themes)}. ${tx('Worship')} ${tx(md)} ${tx('on')} ${tx(PX_REM[md].day)}; ${tx('japa')} ${PX_REM[md].cnt.toLocaleString('en-IN')}.`)}
  ${line(tx('antardasha'),an,ca.s,ca.e,`${tx(grade(adS.sc))}. ${md==an?'':adRule(md,an)?pxEsc(tx('BPHS Ch.52-60')+': '+adRule(md,an)+'.')+' ('+(rec(md,an)?tx('recommended for this combination'):tx('optional, the period grades well'))+')':tx('No specific remedy is named in BPHS for this combination; use the planet remedy.')} ${md==an?pxEsc(tx('BPHS Ch.52-60')+': '+adRule(md,an)+'.'):''}`)}
  ${line(tx('pratyantar'),pd,cp.s,cp.e,`${pxEsc(tx('Themes')+': '+PX_REM[pd].themes)}. ${tx('Planet remedy')}: ${tx(PX_REM[pd].day)}, ${PX_REM[pd].col}.`)}</table></div>
  <p class="w"><small>${tx('BPHS names these remedies for antardashas that give adverse results, in particular when the sub-lord rules the 2nd or 7th house or sits 6/8/12 from the dasha lord. Where the period grades well, the same practices are simply supportive.')}</small></p></div>`;
 const up=[];tree.forEach(d=>d.ads.forEach(a=>{if(a.e>now&&a.s<now+10*YRS*1&&up.length<14){const m=LDE[d.L],x=LDE[a.L],r=adText(ctx,m,x);up.push({m,x,s:Math.max(a.s,d.s),e:a.e,sc:r.sc,rule:adRule(m,x),own:ctx.P[x].own,h:ctx.P[x].h,rec:rec(m,x)})}}));
 const rows=up.map(u=>`<tr><td data-l="${tx('Period')}">${tx(u.m)}–${tx(u.x)}</td><td data-l="${tx('Dates')}">${pxDz(u.s,tz)} → ${pxDz(u.e,tz)}</td><td data-l="${tx('Result')}">${tx(grade(u.sc))}</td><td class="w" data-l="${tx('Houses activated')}">${tx('Rules')} ${u.own.length?u.own.map(pxOrd).join(', '):'—'}; ${tx('sits in')} ${pxOrd(u.h)}</td><td class="w" data-l="${tx('BPHS remedy')}">${u.rule?pxEsc(u.rule):tx('Planet remedy of')+' '+tx(u.x)}${u.rec?' ⚑':''}</td></tr>`).join('');
 const next=`<div class="card sc"><h2>${tx('Upcoming periods (next ten years) and their remedies')}</h2><table class="px-st"><tr><th>${tx('Period')}</th><th>${tx('Dates')}</th><th>${tx('Result')}</th><th>${tx('Houses activated')}</th><th>${tx('BPHS remedy')}</th></tr>${rows}</table><small>⚑ = ${tx('remedy especially advised by the text for this combination')}. ${tx('Grades are this app’s heuristic.')}</small></div>`;
 return{html:cmain+next,lords:[md,an,pd]}}

function pxCheckCard(bc){
 return`<div class="card"><h2>${tx('Birth-time shanti (BPHS Ch.85-96)')}</h2><p class="w"><small>${tx('Tithi at birth')}: ${bc.tn}. ${tx('Ghati-level checks (gandanta, abhukta mula) use average rates and are approximate; confirm with exact birth time. Ch.89 (births in the nakshatra of a parent or sibling) needs those persons’ nakshatras and is not checked.')}</small></p>
 ${bc.list.length?bc.list.map(x=>`<details class="px-p" open><summary><b>${tx(x.n)}</b> ${x.ch?'<small>· BPHS Ch.'+x.ch+'</small>':''}</summary><p class="w">${pxEsc(x.d)}</p><p class="w"><b>${tx('Remedy')}:</b> ${pxEsc(x.r)}</p></details>`).join(''):`<p class="w">${tx('None of the birth-time conditions covered by BPHS Ch.85-96 (Amavasya, Krishna Chaturdashi, Bhadra, the named yogas, Sankranti, eclipse, the three gandantas, abhukta mula) was detected.')}</p>`}</div>`}
function pxRefCard(){
 const rows=PX_PLN.map(p=>{const R=PX_REM[p];return`<tr><td><b>${tx(p)}</b></td><td>${R.img}</td><td>${R.cnt.toLocaleString('en-IN')}</td><td>${R.wood}</td><td class="w">${R.food}</td><td class="w">${R.gift}</td><td>${tx(R.day)}</td></tr>`}).join('');
 return`<div class="card sc"><h2>${tx('Navagraha worship table (BPHS Ch.84)')}</h2><table><tr><th>${tx('Graha')}</th><th>${tx('Image')}</th><th>${tx('Japa')}</th><th>${tx('Havan wood')}</th><th>${tx('Food')}</th><th>${tx('Charity')}</th><th>${tx('Day')}</th></tr>${rows}</table>
 <small>${tx('The text states that the grahas respond to those who worship them. It lists counts but not the mantras themselves; the day is traditional. Perform rites with a qualified priest; no remedy replaces medical, legal or financial advice.')}</small></div>
 <div class="card"><h2>${tx('Shapa (curse) remedies, BPHS Ch.83')}</h2>${PX_CURSE.map(r=>`<p class="w"><b>${tx(r[0])}:</b> ${pxEsc(r[1])}</p>`).join('')}<small>${tx('Reference only: Ch.83 links these to patterns concerning progeny; this app does not diagnose them.')}</small></div>`}
function pxTransitRem(c,la,lo){
 const T=pxTransit(c,la,lo);if(!T.ss)return'';const R=PX_REM.Saturn;
 return`<div class="card"><h2>${tx('Saturn transit remedies')}</h2><p class="w"><b>${tx(T.ss)}.</b> ${tx('Traditional support')}: ${tx('Saturday worship')}, ${R.cnt.toLocaleString('en-IN')} ${tx('japa')}, ${tx('charity')}: ${R.modern}; ${tx('service to the elderly and workers')}.</p><small>${tx('Gochara is from later tradition (not BPHS).')}</small></div>`}
function pxPlanetCard(c,lords){
 const plan=pxPlanetPlan(c,lords),top=plan.filter(x=>x.pri>=3).slice(0,4);
 const sum=`<div class="card"><h2>${tx('Remedy priorities for this chart')}</h2><p class="w">${top.length?top.map(x=>`<b>${tx(x.p)}</b> (${x.mode=='strengthen'?tx('strengthen'):tx('appease')}${x.run?', '+tx('running dasha'):''})`).join(' · '):tx('No planet shows a pressing need; routine worship of the dasha lord is enough.')}</p>
  <small>${tx('Priority combines weakness (debilitation, combustion, enemy sign, difficult house, low strength index), functional nature for this Lagna and whether the planet rules the running dasha.')}</small></div>`;
 return sum+`<div class="card"><h2>${tx('Planet-wise remedies')}</h2>${plan.map(pxPlanetRem).join('')}</div>`}
function remedyTab(sid,ms,tz,mnk,la,lo){
 const c=pxCtx(sid),d=pxDashaRem(c,sid,ms,tz,mnk),bc=pxBirthChecks(sid,c);
 return (typeof gxWeekly=='function'?gxWeekly(c,d.lords):'')+d.html+pxTransitRem(c,la,lo)+pxPlanetCard(c,d.lords)+pxCheckCard(bc)+pxRefCard()}
