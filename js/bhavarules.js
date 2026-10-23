// Jyotish Kundli v18 - bhava-by-bhava combinations from BPHS Ch.12-23 (paraphrased).
// Rules about disease, death, lost children, spouse's life, parents' life span and age-coded events are deliberately omitted.
function pxBhavaRules(c){
 const L=h=>c.lord(h),H=p=>c.h[p],K=[1,4,7,10],T=[1,5,9],DS=[6,8,12];
 const kt=p=>[...K,...T].includes(H(p)),kd=p=>K.includes(H(p)),dus=p=>DS.includes(H(p));
 const ownEx=p=>['own sign','exalted','mooltrikona'].includes(c.dig(p)),ex=p=>c.dig(p)=='exalted',deb=p=>c.dig(p)=='debilitated';
 const strong=p=>c.strength(p).band!='Weak',weak=p=>c.strength(p).band=='Weak';
 const benP=p=>PX_P9.some(q=>q!==p&&c.ben(q)&&(c.conj(p,q)||c.asp(q,p))),malP=p=>PX_P9.some(q=>q!==p&&c.mal(q)&&(c.conj(p,q)||c.asp(q,p)));
 const withBen=p=>PX_P9.some(q=>q!==p&&c.ben(q)&&c.conj(p,q)),withMal=p=>PX_P9.some(q=>q!==p&&c.mal(q)&&c.conj(p,q));
 const aspH=h=>PX_P7.filter(q=>c.h[q]!==h&&PX_ASP[q].includes(pxHfs(c.sg[q],c.hs(h)))),
  benH=h=>[...c.inH(h),...aspH(h)].some(q=>c.ben(q)),benOcc=h=>c.inH(h).filter(q=>c.ben(q)),malOcc=h=>c.inH(h).filter(q=>c.mal(q));
 const ctx=(l,h)=>`${pxOrd(h)} lord ${l} in the ${pxOrd(H(l))}`;
 const R=[];const r=(h,ref,k,f,t)=>R.push({h,ref,k,f,t});
 const T2=(h,x)=>`${ctx(L(h),h)}${x?' ('+x+')':''}`;
 // Ch.12 Lagna
 r(1,'Ch.12 v.4','+',()=>benOcc(1).length?`Benefic ${pxJoin(benOcc(1))} in the Lagna`:benH(1)?'Lagna aspected by a benefic':0,'A benefic on or aspecting the Lagna gives a pleasing appearance and bodily comfort.');
 r(1,'Ch.12 v.4','-',()=>malOcc(1).length&&!benH(1)?`Malefic ${pxJoin(malOcc(1))} in the Lagna without benefic aspect`:0,'A malefic on the Lagna with no benefic support reduces ease and the pleasantness of the appearance.');
 r(1,'Ch.12 v.5-7','+',()=>[L(1),'Mercury','Jupiter','Venus'].filter(kt).length?`${pxJoin([...new Set([L(1),'Mercury','Jupiter','Venus'].filter(kt))])} in a kendra or trikona`:0,'The Lagna lord, Mercury, Jupiter or Venus in an angle or trine gives intelligence, prosperity and the favour of those in authority.');
 r(1,'Ch.12 v.5-7','+',()=>[0,3,6,9].includes(c.sg[L(1)])&&PX_P7.some(q=>c.ben(q)&&c.asp(q,L(1)))?`Lagna lord ${L(1)} in a movable sign aspected by a benefic`:0,'A Lagna lord in a movable sign with a benefic aspect gives fame, wealth and enjoyment.');
 r(1,'Ch.12 v.5-7','+',()=>{const b=['Mercury','Jupiter','Venus'].filter(p=>(H(p)==1&&c.conj('Moon',p))||K.includes(H(p)));return b.length?`${pxJoin(b)} in the Lagna with the Moon or in an angle`:0},'Mercury, Jupiter or Venus with the Moon in the Lagna, or in an angle, is described as giving status and good fortune.');
 // Ch.13 Dhana
 r(2,'Ch.13 v.1-2','+',()=>H(L(2))==2||kt(L(2))?T2(2):0,'The 2nd lord in the 2nd, an angle or a trine promotes wealth and savings.');
 r(2,'Ch.13 v.1-2','-',()=>dus(L(2))?T2(2):0,'The 2nd lord in the 6th, 8th or 12th tends to erode savings; money needs deliberate protection.');
 r(2,'Ch.13 v.1-2','+',()=>benOcc(2).length?`Benefic ${pxJoin(benOcc(2))} in the 2nd`:0,'A benefic in the 2nd house supports wealth.');
 r(2,'Ch.13 v.1-2','-',()=>malOcc(2).length?`Malefic ${pxJoin(malOcc(2))} in the 2nd`:0,'A malefic in the 2nd strains finances and may roughen speech.');
 r(2,'Ch.13 v.3','+',()=>(H('Jupiter')==2&&(L(2)=='Jupiter'||c.conj('Jupiter','Mars')))?'Jupiter in the 2nd as its lord or with Mars':0,'Jupiter in the 2nd (as lord, or with Mars) is a classical sign of wealth.');
 r(2,'Ch.13 v.4','+',()=>(H(L(2))==11&&H(L(11))==2)||(c.conj(L(2),L(11))&&(kt(L(2))))?`${L(2)} and ${L(11)}, lords of the 2nd and 11th, are linked`:0,'The lords of income and savings exchanging houses or meeting in an angle/trine brings steady acquisition.');
 r(2,'Ch.13 v.5','+',()=>kd(L(2))&&(T.includes(c.from(L(2),L(11)))||c.from(L(2),L(11))==9||c.from(L(2),L(11))==5||['Jupiter','Venus'].some(q=>c.rel(L(11),q)))?`2nd lord in an angle with the 11th lord in a trine from it or supported by Jupiter/Venus`:0,'A 2nd lord in an angle with a well-supported 11th lord makes one wealthy.');
 r(2,'Ch.13 v.6-7','-',()=>dus(L(2))&&dus(L(11))&&malOcc(2).length?'2nd and 11th lords in difficult houses and a malefic in the 2nd':0,'Both wealth lords in difficult houses with a malefic in the 2nd show persistent financial shortage.');
 r(2,'Ch.13 v.7','-',()=>[L(2),L(11)].every(p=>c.combust(p)||withMal(p))&&L(2)!==L(11)?'Both the 2nd and 11th lords are combust or with malefics':0,'Wealth lords weakened by combustion or malefic company indicate lean finances until they are strengthened.');
 r(2,'Ch.13 v.10','+',()=>ownEx(L(2))?T2(2,c.dig(L(2))):0,'A 2nd lord in own sign or exalted gives care for dependants, readiness to help others and a good name.');
 r(2,'Ch.13 v.11','+',()=>withBen(L(2))&&ownEx(L(2))?'2nd lord with a benefic in a strong sign':0,'A dignified 2nd lord with a benefic gives family wealth that arrives with little struggle.');
 r(2,'Ch.13 v.8','-',()=>dus(L(2))&&dus(L(11))&&H('Mars')==11&&H('Rahu')==2?'2nd/11th lords in 6/8/12, Mars in the 11th and Rahu in the 2nd':0,'The text warns of financial loss through government or legal action; keep tax and legal affairs strictly in order.');
 r(2,'Ch.13 v.9','+',()=>H('Jupiter')==11&&H('Venus')==2&&benOcc(12).length&&withBen(L(2))?'Jupiter in the 11th, Venus in the 2nd, a benefic in the 12th and the 2nd lord with a benefic':0,'Spending flows to religious or charitable causes.');
 r(2,'Ch.13 v.13','-',()=>malOcc(2).length&&withMal(L(2))?'2nd house and its lord both with malefics':0,'Speech tends to be harsh or careless with the truth; mindful speech is advised.');
 // Ch.14 Sahaja
 r(3,'Ch.14 v.1','+',()=>benH(3)?'3rd house occupied or aspected by a benefic':0,'Courage, good support from siblings and enterprise.');
 r(3,'Ch.14 v.2','+',()=>L(3)!=='Mars'&&c.conj(L(3),'Mars')&&(H('Mars')==3||PX_ASP.Mars.includes(pxHfs(c.sg.Mars,c.hs(3))))?'3rd lord with Mars, in or aspecting the 3rd':0,'The 3rd lord with Mars in or aspecting the 3rd gives good results for courage and siblings.');
 r(3,'Ch.14 v.5-6','+',()=>(kt(L(3))||kt('Mars')||ex('Mars')||ex(L(3)))&&!(H(L(3))==8&&c.conj(L(3),'Mars'))?`3rd lord ${L(3)} or Mars well placed`:0,'A 3rd lord or Mars in an angle, trine or exalted gives happiness regarding siblings and effort.');
 r(3,'Ch.14 v.5','-',()=>H(L(3))==8&&c.conj(L(3),'Mars')?'3rd lord with Mars in the 8th':0,'Strain or separation in sibling matters; patience in joint efforts.');
 // Ch.15 Bandhu
 r(4,'Ch.15 v.2','+',()=>(H(L(4))==4||H(L(1))==4)&&benH(4)?'4th house occupied by its lord or the Lagna lord, with benefic support':0,'Full domestic comfort and a settled home.');
 r(4,'Ch.15 v.3','+',()=>ownEx(L(5))?`5th lord ${L(5)} is ${c.dig(L(5))}`:0,'Comfort from land, vehicles and houses.');
 r(4,'Ch.15 v.4','+',()=>L(4)!==L(10)&&c.conj(L(4),L(10))&&kt(L(4))?'4th and 10th lords together in an angle/trine':0,'Fine residences and property.');
 r(4,'Ch.15 v.5','+',()=>H('Mercury')==1&&c.ben(L(4))&&PX_P7.some(q=>q!==L(4)&&c.ben(q)&&c.asp(q,L(4)))?'Mercury in the Lagna, benefic 4th lord aspected by a benefic':0,'Honour among relatives.');
 r(4,'Ch.15 v.7','+',()=>kd(L(4))&&K.includes(H('Venus'))&&ex('Mercury')?'4th lord and Venus in angles with Mercury exalted':0,'A contented mother and a happy home.');
 r(4,'Ch.15 v.10-14','+',()=>benH(4)||withBen(L(4))||(PX_P7.some(q=>c.ben(q)&&c.asp(q,L(4))))?'4th house or lord linked with a benefic':0,'Happiness with vehicles and freedom from mishaps on the road.');
 r(4,'Ch.15 v.10-14','-',()=>malOcc(4).length&&!benH(4)||withMal(L(4))&&!benP(L(4))?'4th house or lord with malefics and no benefic help':0,'Losses concerning vehicles and the need for caution while travelling.');
 r(4,'Ch.15 v.10-14','+',()=>(H(L(11))==4&&H(L(4))==11)||(c.conj(L(4),L(10))&&c.nav[L(4)]===EX[L(4)]&&EX[L(4)]!==undefined)?'11th/4th lord exchange, or 4th and 10th lords in the 4th lord’s exalted navamsa':0,'Acquisition of a vehicle.');
 // Ch.16 Putra (positive/neutral only)
 r(5,'Ch.16 v.1-3','+',()=>(ownEx(L(1))||kt(L(1)))&&(ownEx(L(5))||kt(L(5)))?'Lagna lord and 5th lord both in own signs, angles or trines':0,'Satisfaction through children, students and creative work.');
 r(5,'Ch.16 v.1-3','+',()=>c.conj(L(1),L(5))&&kt(L(1))?'Lagna lord with the 5th lord in a good house':0,'Early and happy results in the 5th-house matters (learning, creativity, children).');
 r(5,'Ch.16 v.16','+',()=>ex(L(5))||[2,5,9].includes(H(L(5)))||c.conj(L(5),'Jupiter')||c.asp('Jupiter',L(5))?`5th lord in a supportive position`:0,'Favourable for children, learning and merit from past good conduct.');
 r(5,'Ch.16 v.12','+',()=>strong(L(5))&&['Mercury','Jupiter','Venus'].every(q=>c.asp(q,c.hs(5))||H(q)==5)?'Strong 5th lord with Mercury, Jupiter and Venus influencing the 5th':0,'Abundant results from the 5th house.');
 // Ch.17 Ari (non-health)
 r(6,'Ch.17 v.26','-',()=>H(L(11))==6&&H(L(6))==11?'11th and 6th lords exchange':0,'Gains can be lost through rivals or disputes; avoid litigation over money.');
 r(6,'Ch.17 / classical','+',()=>PX_DUS.includes(H(L(6)))&&H(L(6))!==6?'6th lord in the 8th or 12th':0,'Opponents lose strength and debts are cleared more easily (the Viparita principle).');
 // Ch.18 Yuvati
 r(7,'Ch.18 v.1','+',()=>ownEx(L(7))?T2(7,c.dig(L(7))):0,'Full happiness through marriage and partnerships.');
 r(7,'Ch.18 v.2','-',()=>dus(L(7))&&!ownEx(L(7))?T2(7):0,'Partnerships need extra care and the spouse’s wellbeing deserves attention.');
 r(7,'Ch.18 v.4-5','+',()=>strong(L(7))&&benP(L(7))?`7th lord ${L(7)} strong and supported by a benefic`:0,'A prosperous, honourable and fortunate partnership.');
 r(7,'Ch.18 v.4-5','-',()=>deb(L(7))||c.combust(L(7))||c.dig(L(7))=='enemy sign'?`7th lord ${L(7)} is ${c.combust(L(7))?'combust':c.dig(L(7))}`:0,'Relationships are tested and need patience and clear communication.');
 r(7,'Ch.18 v.14-15','+',()=>ex(L(7))&&c.inH(7).includes(L(1))&&benOcc(7).length?'Exalted 7th lord with the Lagna lord and a benefic in the 7th':0,'A worthy, virtuous partner who raises the family’s standing.');
 r(7,'Ch.18 v.16','-',()=>(c.conj(L(7),'Mars')||c.conj(L(7),'Saturn')||c.conj(L(7),'Rahu')||c.conj(L(7),'Ketu')||c.conj(L(7),'Sun'))&&weak(L(7))?'Weak 7th lord with a malefic':0,'Obstacles and friction in partnership until strengthened.');
 r(7,'Ch.18 v.18','-',()=>H('Moon')==7&&H(L(7))==12&&weak('Venus')?'Moon in the 7th, 7th lord in the 12th and weak Venus':0,'Reduced marital contentment and emotional distance.');
 r(7,'Ch.18 v.3','-',()=>H('Venus')==7?'Venus in the 7th':0,'Strong romantic and sensual inclination; commitment needs conscious attention.');
 // Ch.20 Dharma
 r(9,'Ch.20 v.1','+',()=>H(L(9))==9&&strong(L(9))?'9th lord strong in the 9th':0,'A fortunate life with steady luck.');
 r(9,'Ch.20 v.2','+',()=>H('Jupiter')==9&&kd(L(9))&&strong(L(1))?'Jupiter in the 9th, 9th lord in an angle, strong Lagna lord':0,'Exceptional fortune.');
 r(9,'Ch.20 v.3','+',()=>strong(L(9))&&H('Venus')==9&&K.includes(H('Jupiter'))?'Strong 9th lord, Venus in the 9th, Jupiter in an angle':0,'A fortunate father or paternal line.');
 r(9,'Ch.20 v.4','-',()=>deb(L(9))&&[2,4].includes(pxHfs(c.hs(9),c.sg.Mars))?'9th lord debilitated with Mars in the 2nd or 4th from the 9th':0,'Financial difficulty on the father’s side.');
 r(9,'Ch.20 v.6','+',()=>kd(L(9))&&c.asp('Jupiter',L(9))?'9th lord in an angle aspected by Jupiter':0,'A father of high standing.');
 r(9,'Ch.20 v.7','+',()=>H(L(9))==10&&benP(L(10))?'9th lord in the 10th, 10th lord with benefic support':0,'A wealthy and well-known father.');
 r(9,'Ch.20 v.8-9','+',()=>[1,5,9].includes(H('Sun'))&&H(L(9))==7&&(c.conj(L(9),'Jupiter')||c.asp('Jupiter',L(9)))?'Sun in a trine, 9th lord in the 7th with Jupiter':0,'Devotion to the father and respect for elders.');
 r(9,'Ch.20 v.10','+',()=>H(L(9))==2&&H(L(2))==9?'9th and 2nd lords exchange':0,'Fortune, vehicles and fame.');
 r(9,'Ch.20 v.11','-',()=>c.conj(L(1),L(6))&&H(L(1))==9?'Lagna lord with the 6th lord in the 9th':0,'Friction with the father or elders.');
 r(9,'Ch.20 v.12','-',()=>weak(L(10))&&weak(L(3))&&(deb(L(9))||c.combust(L(9)))?'10th and 3rd lords weak, 9th lord debilitated or combust':0,'A struggle to secure a livelihood until strengthened.');
 r(9,'Ch.20 v.29','+',()=>H(L(1))==9&&H(L(9))==1&&H('Jupiter')==7?'Lagna and 9th lords exchange, Jupiter in the 7th':0,'Gains of wealth and conveyances.');
 // Ch.21 Karma
 r(10,'Ch.21 v.2','+',()=>strong(L(10))&&ownEx(L(10))?T2(10,c.dig(L(10))):0,'Fame, good deeds and lasting standing in one’s work.');
 r(10,'Ch.21 v.3','-',()=>weak(L(10))?`10th lord ${L(10)} is weak`:0,'Obstacles in work; strengthen the 10th lord and keep steady effort.');
 r(10,'Ch.21 v.4','+',()=>withBen(L(10))||[1,2,4,5,7,9,10,11].includes(H(L(10)))&&benP(L(10))?'10th lord with a benefic or well placed':0,'Gains through patronage and business.');
 r(10,'Ch.21 v.5','-',()=>malOcc(10).length&&malOcc(11).length?'Malefics in both the 10th and 11th':0,'A tendency toward rough or unethical dealings unless consciously checked.');
 r(10,'Ch.21 v.6','-',()=>H(L(10))==8&&c.conj(L(10),'Rahu')?'10th lord with Rahu in the 8th':0,'Resentment and poor judgement in work; seek counsel.');
 r(10,'Ch.21 v.8-10','+',()=>ex(L(10))&&c.conj(L(10),'Jupiter')&&H(L(9))==10?'Exalted 10th lord with Jupiter, 9th lord in the 10th':0,'Honour, wealth and valour.');
 r(10,'Ch.21 v.8-10','+',()=>(H(L(11))==10&&H(L(10))==1)||(c.conj(L(10),L(11))&&kd(L(10)))?'10th and 11th lords linked favourably':0,'A happy, productive working life.');
 r(10,'Ch.21 v.8-10','+',()=>c.sg[L(10)]===11&&c.conj(L(10),'Jupiter')&&strong(L(10))?'Strong 10th lord with Jupiter in Pisces':0,'Comforts, ornaments and happiness.');
 r(10,'Ch.21 v.12','+',()=>c.sg.Jupiter===11&&c.conj('Jupiter','Venus')&&strong(L(1))&&c.dig('Moon')=='exalted'?'Jupiter with Venus in Pisces, strong Lagna lord, exalted Moon':0,'Learning and wealth.');
 r(10,'Ch.21 v.13','+',()=>H(L(10))==11&&H(L(11))==1&&H('Venus')==10?'10th lord in the 11th, 11th lord in the Lagna, Venus in the 10th':0,'Valuable assets such as gems.');
 r(10,'Ch.21 v.14','+',()=>ex(L(10))&&kt(L(10))&&(c.conj(L(10),'Jupiter')||c.asp('Jupiter',L(10)))?'Exalted 10th lord in an angle/trine with Jupiter':0,'Noble deeds and recognised achievement.');
 r(10,'Ch.21 v.18','-',()=>deb(L(10))&&malOcc(10).length&&malOcc(7).length?'Debilitated 10th lord with malefics in the 10th and 7th':0,'Obstruction to one’s undertakings.');
 r(10,'Ch.21 v.19-21','+',()=>(H('Moon')==10&&[5,9].includes(pxHfs(c.hs(10),c.sg[L(10)]))&&kd(L(1)))||(H(L(11))==10&&strong(L(10))&&c.asp(L(10),'Jupiter'))||(H(L(10))==9&&H(L(1))==10&&H('Moon')==5)?'A fame combination of the 10th house':0,'Fame and public recognition.');
 // Ch.22 Labha
 r(11,'Ch.22 v.2','+',()=>H(L(11))==11||kt(L(11))||ex(L(11))?T2(11):0,'Many gains; income from several sources.');
 r(11,'Ch.22 v.3','+',()=>H(L(11))==2&&kd(L(2))&&c.conj(L(2),'Jupiter')?'11th lord in the 2nd, 2nd lord in an angle with Jupiter':0,'Great gains.');
 r(11,'Ch.22 v.5','+',()=>withBen(L(11))&&kt(L(11))?'11th lord with a benefic in an angle or trine':0,'Reliable gains and good returns on effort.');
 r(11,'Ch.22 v.6','+',()=>H('Jupiter')==11&&H('Moon')==2&&H('Venus')==9?'Jupiter in the 11th, Moon in the 2nd, Venus in the 9th':0,'A wealthy position.');
 r(11,'Ch.22 v.7','+',()=>['Jupiter','Mercury','Moon'].every(p=>H(p)==9)?'Jupiter, Mercury and Moon in the 9th':0,'Wealth, grain and ornaments.');
 r(11,'Ch.22 v.8-10','+',()=>(H(L(11))==1&&H(L(1))==11)||(H(L(11))==2&&H(L(2))==11)||(H(L(11))==3&&H(L(3))==11)?'11th lord exchanging with the Lagna, 2nd or 3rd lord':0,'Wealth through marriage, family or siblings, as the exchange indicates.');
 r(11,'Ch.22 v.11','-',()=>deb(L(11))||c.combust(L(11))&&!ex(L(11))||(dus(L(11))&&withMal(L(11)))?`11th lord ${L(11)} weakened`:0,'Gains are delayed or reduced despite effort.');
 // Ch.23 Vyaya
 r(12,'Ch.23 v.1-4','+',()=>withBen(L(12))||ownEx(L(12))||benOcc(12).length?'12th lord with a benefic/strong, or a benefic in the 12th':0,'Spending goes to worthwhile things; comfortable surroundings.');
 r(12,'Ch.23 v.1-4','+',()=>L(12)=='Moon'&&(ex('Moon')||ownEx('Moon')||[11,9,5].includes(H('Moon')))?'Moon is the 12th lord and strong':0,'Fine houses, beds, fragrances and comforts; a refined style of living.');
 r(12,'Ch.23 v.5-6','-',()=>DS.includes(H(L(12)))?T2(12):0,'Expenses can outrun income and domestic comfort needs care.');
 r(12,'Ch.23 v.11','-',()=>(withMal(L(12))||malOcc(12).length)&&malP(L(12))?'12th lord and the 12th house both with malefics':0,'Frequent travel or residence away from the homeland.');
 r(12,'Ch.23 v.12','+',()=>benOcc(12).length&&benP(L(12))?'Benefics on the 12th house and its lord':0,'A settled life in one’s own country.');
 r(12,'Ch.23 v.10','+',()=>benOcc(12).length&&(ex(L(12))||benP(L(12)))?'Benefic in the 12th and a supported 12th lord':0,'A strong spiritual bent and inclination toward liberation.');
 r(12,'Ch.23 v.13','-',()=>(c.inH(12).includes('Saturn')||c.inH(12).includes('Mars'))&&!PX_P7.some(q=>c.ben(q)&&c.asp(q,c.hs(12)))?'Saturn or Mars in the 12th without benefic aspect':0,'Income may come by questionable means; ethical vigilance is advised.');
 r(12,'Ch.23 v.14','+',()=>H(L(1))==12&&H(L(12))==1&&c.conj(L(12),'Venus')?'Lagna and 12th lords exchange with Venus':0,'Expenses on religious and charitable grounds.');
 const out=[];R.forEach(x=>{let w=0;try{w=x.f()}catch(e){w=0}if(w)out.push({...x,w})});return out}

function pxBhavaRulesCard(c){
 const o=pxBhavaRules(c),by=h=>o.filter(x=>x.h===h);
 const p=o.filter(x=>x.k=='+').length,n=o.filter(x=>x.k=='-').length;
 return`<div class="card"><h2>${tx('House-by-house combinations (BPHS Ch.12-23)')}</h2><p class="w"><small>${o.length} ${tx('rules matched')} · ${p} ${tx('supportive')} · ${n} ${tx('cautionary')}. ${tx('Rules concerning illness, death, lost children, spouse or parent life span, and age-coded events are intentionally left out. The book itself says to weigh each result by the strength of the planets involved.')}</small></p>
 ${[1,2,3,4,5,6,7,8,9,10,11,12].map(h=>{const a=by(h);if(!a.length)return'';return`<details class="px-a"><summary><b>${pxOrd(h)} ${tx('house')}</b> <small>· ${PX_HN[h-1]} · ${a.length} ${tx('rules')}</small></summary>${a.map(x=>`<p class="w"><span class="px-b px-${x.k=='+'?'good':'bad'}">${x.k=='+'?tx('Supportive'):tx('Caution')}</span> ${pxEsc(x.t)}<br><small>${tx('Because')}: ${pxEsc(x.w)} · BPHS ${x.ref}</small></p>`).join('')}</details>`}).join('')||`<p>${tx('No rule matched.')}</p>`}</div>`}
