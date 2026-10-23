const R=Math.PI/180,n=x=>((x%360)+360)%360,S=x=>Math.sin(x*R),C=x=>Math.cos(x*R);
const SG=['Mesha','Vrishabha','Mithuna','Kataka','Simha','Kanya','Thula','Vrischika','Dhanu','Makara','Kumbha','Meena'];
const NK=['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushyami','Ashlesha','Magha','P.Phalguni','U.Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Moola','P.Ashadha','U.Ashadha','Shravana','Dhanishta','Shatabhisha','P.Bhadra','U.Bhadra','Revati'];
const YG=['Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma','Dhriti','Shula','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyan','Parigha','Shiva','Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti'];
const TT=['Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi'];
const KR=['Bava','Balava','Kaulava','Taitila','Gara','Vanija','Vishti','Kimstughna','Shakuni','Chatushpada','Naga'];
const VR=['Ravi','Soma','Mangala','Budha','Guru','Shukra','Shani'];
const LD=['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'],YR=[7,20,6,10,7,18,16,19,17];
const AB={Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke'};
const CITIES={Guwahati:[26.1445,91.7362,5.5],Kolkata:[22.5726,88.3639,5.5],Bengaluru:[12.97,77.59,5.5],Delhi:[28.61,77.21,5.5],Mumbai:[19.08,72.88,5.5],Chennai:[13.08,80.27,5.5],Hyderabad:[17.39,78.49,5.5],Varanasi:[25.32,83.01,5.5],London:[51.51,-0.13,0],'New York':[40.71,-74.01,-5],Custom:[0,0,0]};
// Orbital elements: N0,N1,i,w0,w1,a,e0,e1,M0,M1
const PL={Mercury:[48.3313,3.24587e-5,7.0047,29.1241,1.01444e-5,.387098,.205635,5.59e-10,168.6562,4.0923344368],Venus:[76.6799,2.4659e-5,3.3946,54.891,1.38374e-5,.72333,.006773,-1.302e-9,48.0052,1.6021302244],Mars:[49.5574,2.11081e-5,1.8497,286.5016,2.92961e-5,1.523688,.093405,2.516e-9,18.6021,.5240207766],Jupiter:[100.4542,2.76854e-5,1.303,273.8777,1.64505e-5,5.20256,.048498,4.469e-9,19.895,.0830853001],Saturn:[113.6634,2.3898e-5,2.4886,339.3939,2.97661e-5,9.55475,.055546,-9.499e-9,316.967,.0334442282]};
function kep(N,i,w,a,e,M){let E=M+e/R*S(M)*(1+e*C(M));for(let k=0;k<8;k++)E-=(E-e/R*S(E)-M)/(1-e*C(E));const x=a*(C(E)-e),y=a*Math.sqrt(1-e*e)*S(E),v=Math.atan2(y,x)/R,r=Math.hypot(x,y),u=v+w;return[r*(C(N)*C(u)-S(N)*S(u)*C(i)),r*(S(N)*C(u)+C(N)*S(u)*C(i)),r,n(v+w)]}
function calc(jd,lat,lon){
 const d=jd-2451543.5,res={};
 const sw=282.9404+4.70935e-5*d,sM=356.047+.9856002585*d;
 const sun=kep(0,0,sw,1,.016709-1.151e-9*d,sM),sl=Math.atan2(sun[1],sun[0])/R;
 let ay=23.857+(jd-2451545)/365.25*.013972;
 res.Sun=n(sl);
 // Moon
 const N=125.1228-.0529538083*d,Mm=115.3654+13.0649929509*d,w=318.0634+.1643573223*d;
 const mo=kep(N,5.1454,w,60.2666,.0549,Mm);let ml=Math.atan2(mo[1],mo[0])/R;
 const Ls=sw+sM,Lm=N+w+Mm,D=Lm-Ls,F=Mm+w;
 ml+=-1.274*S(Mm-2*D)+.658*S(2*D)-.186*S(sM)-.059*S(2*Mm-2*D)-.057*S(Mm-2*D+sM)+.053*S(Mm+2*D)+.046*S(2*D-sM)+.041*S(Mm-sM)-.035*S(D)-.031*S(Mm+sM)-.015*S(2*F-2*D)+.011*S(Mm-4*D);
 res.Moon=n(ml);res.Rahu=n(N);res.Ketu=n(N+180);
 const el=k=>{const p=PL[k];return[p[0]+p[1]*d,p[2],p[3]+p[4]*d,p[5],p[6]+p[7]*d,p[8]+p[9]*d]};
 const Mj=el('Jupiter')[5],Mt=el('Saturn')[5];
 for(const k in PL){const q=el(k);let h=kep(...q),lh=Math.atan2(h[1],h[0])/R;
  if(k=='Jupiter')lh+=-.332*S(2*Mj-5*Mt-67.6)-.056*S(2*Mj-2*Mt+21)+.042*S(3*Mj-5*Mt+21)-.036*S(Mj-2*Mt)+.022*C(Mj-Mt)+.023*S(2*Mj-3*Mt+52)-.016*S(Mj-5*Mt-69);
  if(k=='Saturn')lh+=.812*S(2*Mj-5*Mt-67.6)-.229*C(2*Mj-4*Mt-2)+.119*S(Mj-2*Mt-3)+.046*S(2*Mj-6*Mt-69)+.014*S(Mj-3*Mt+32);
  const x=h[2]*C(lh)+sun[2]*C(sl),y=h[2]*S(lh)+sun[2]*S(sl);res[k]=n(Math.atan2(y,x)/R)}
 const tr={...res},sid={};
 for(const k in tr)sid[k]=n(tr[k]-ay);
 const E=ephAt(jd);if(E){Object.assign(sid,E.sid);ay=E.ay}
 const th=n(280.46061837+360.98564736629*(jd-2451545)+lon),eps=23.4393-3.563e-7*(jd-2451545);
 const asc=n(Math.atan2(C(th),-(S(th)*C(eps)+Math.tan(lat*R)*S(eps)))/R);
 sid.Lagna=n(asc-ay);return{sid,ay}}
const fd=x=>{const s=Math.floor(x/30),r=x%30,dd=Math.floor(r),m=Math.floor((r-dd)*60);return`${dd}°${String(m).padStart(2,'0')}′ ${SG[s]}`};
const nk=x=>{const i=Math.floor(x/(360/27));return{i,p:Math.floor(x%(360/27)/(360/108))+1,f:x%(360/27)/(360/27)}};
const NS='Chu Che Cho La|Li Lu Le Lo|A I U E|O Va Vi Vu|Ve Vo Ka Ki|Ku Gha Nga Chha|Ke Ko Ha Hi|Hu He Ho Da|Di Du De Do|Ma Mi Mu Me|Mo Ta Ti Tu|Te To Pa Pi|Pu Sha Na Tha|Pe Po Ra Ri|Ru Re Ro Ta|Ti Tu Te To|Na Ni Nu Ne|No Ya Yi Yu|Ye Yo Bha Bhi|Bhu Dha Pha Dha|Bhe Bho Ja Ji|Ju Je Jo Khi|Ga Gi Gu Ge|Go Sa Si Su|Se So Da Di|Du Tha Jha Na|De Do Cha Chi'.split('|');
const YN=['Horse','Elephant','Sheep','Serpent','Serpent','Dog','Cat','Sheep','Cat','Rat','Rat','Cow','Buffalo','Tiger','Buffalo','Tiger','Deer','Deer','Dog','Monkey','Mongoose','Monkey','Lion','Horse','Lion','Cow','Elephant'];
const DV=[0,4,6,7,12,14,16,21,26],MN=[1,3,5,10,11,19,20,24,25];
const gana=i=>DV.includes(i)?'Deva':MN.includes(i)?'Manushya':'Rakshasa',nadi=i=>['Aadi','Madhya','Antya'][[0,1,2,2,1,0][i%6]];
const VN=['Kshatriya','Vaishya','Shudra','Brahmin'],VS=['Chatushpada','Chatushpada','Manava','Jalachara','Vanachara','Manava','Manava','Keeta','Manava','Chatushpada','Manava','Jalachara'];
const SL=['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
const FR={Sun:'Moon Mars Jupiter',Moon:'Sun Mercury',Mars:'Sun Moon Jupiter',Mercury:'Sun Venus',Jupiter:'Sun Moon Mars',Venus:'Mercury Saturn',Saturn:'Mercury Venus'},EN={Sun:'Venus Saturn',Moon:'',Mars:'Mercury',Mercury:'Moon',Jupiter:'Mercury Venus',Venus:'Sun Moon',Saturn:'Sun Moon Mars'};
const rel=(a,b)=>a==b||FR[a].includes(b)?1:EN[a].includes(b)?-1:0;
const HS=['Sun','Venus','Mercury','Moon','Saturn','Jupiter','Mars'],DL=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
const fm=h=>{const m=Math.round(((h%24)+24)%24*60)%1440;return String(m/60|0).padStart(2,'0')+':'+String(m%60).padStart(2,'0')};
function sunInfo(Y,Mo,D,lh,lat,lon,tz,lam){
 const N=(Date.UTC(Y,Mo-1,D)-Date.UTC(Y,0,0))/864e5,B=360/365*(N-81),eot=9.87*S(2*B)-7.53*C(B)-1.5*S(B),dec=Math.asin(S(23.44)*S(lam))/R,
 cH=Math.max(-1,Math.min(1,(S(-.833)-S(lat)*S(dec))/(C(lat)*C(dec)))),H=Math.acos(cH)/R/15,nn=12-lon/15+tz-eot/60,rs=nn-H,st=nn+H,Hv=Math.acos(Math.max(-1,Math.min(1,-S(lat)*S(dec)/(C(lat)*C(dec)))))/R/15,vRise=nn-Hv,vSet=nn+Hv;
 let w=new Date(Date.UTC(Y,Mo-1,D)).getUTCDay(),t=lh-vRise;if(t<0){w=(w+6)%7;t+=24}
 const cw=new Date(Date.UTC(Y,Mo-1,D)).getUTCDay(),dl=vSet-vRise,dr=(st-rs)/8,ix=t<dl?Math.floor(t/(dl/12)):12+Math.floor((t-dl)/((24-dl)/12)),hl=HS[(HS.indexOf(DL[w])+ix)%7];
 return{v:VR[w],vRise,vSet,rows:[['Sunrise',fm(rs)],['Sunset',fm(st)],['Vedic sunrise',fm(vRise)],['Vedic sunset',fm(vSet)],['Hora lord',tx(hl)],['Rahu Kala',fm(rs+([8,2,7,5,6,4,3][cw]-1)*dr)+' - '+fm(rs+[8,2,7,5,6,4,3][cw]*dr)]]}}
function moonOf(v,tz){const[a,b]=v.split('T'),[Y,M,D]=a.split('-').map(Number),[H,I]=b.split(':').map(Number),jd=(Date.UTC(Y,M-1,D,H,I)-tz*36e5)/864e5+2440587.5,m=calc(jd,0,0).sid.Moon;return{i:Math.floor(m/(360/27)),s:Math.floor(m/30)}}
function ashta(g,b){const rk=s=>[3,2,1,4][s%4],bad=(x,y)=>[3,5,7].includes(((y-x+27)%27+1)%9),yn=[YN[g.i],YN[b.i]],
 x=SL[g.s],y=SL[b.s],s=rel(x,y)+rel(y,x),a=gana(g.i),c=gana(b.i),d=(b.s-g.s+12)%12+1;
 return[['Varna',rk(b.s)>=rk(g.s)?1:0,1],['Vashya',VS[g.s]==VS[b.s]?2:1,2],['Tara',(bad(g.i,b.i)?0:1.5)+(bad(b.i,g.i)?0:1.5),3],
 ['Yoni',+YM[AN.indexOf(yn[0])][AN.indexOf(yn[1])],4],
 ['Graha Maitri',x==y||s==2?5:s==1?4:s==0?(rel(x,y)==0?3:1):s==-1?.5:0,5],['Gana',a==c?6:a!='Rakshasa'&&c!='Rakshasa'?5:a=='Deva'||c=='Deva'?1:0,6],
 ['Bhakoot',[2,12,5,9,6,8].includes(d)?0:7,7],['Nadi',nadi(g.i)==nadi(b.i)?0:8,8]]}
document.getElementById('mt').onclick=()=>{const g=moonOf(document.getElementById('dt2').value,+document.getElementById('tz2').value),b=moonOf(document.getElementById('dt').value,+document.getElementById('tz').value),r=ashta(g,b),t=r.reduce((a,x)=>a+x[1],0);
 document.getElementById('mr').innerHTML=L10(`<p>${tx('Bride')}: ${NK[g.i]} · ${SG[g.s]} &nbsp; ${tx('Groom')}: ${NK[b.i]} · ${SG[b.s]}</p><table><tr><th>Koota</th><th>Score</th><th>Max</th></tr>${r.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td></tr>`).join('')}<tr><td><b>Total</b></td><td><b>${t}</b></td><td><b>36</b></td></tr></table><small>Vashya and Gana use simplified scoring. 18+ is generally considered acceptable.</small>`)};
const $=id=>document.getElementById(id);let LAST;const STN={e:'East Indian',n:'North Indian',s:'South Indian'};
const AN='Horse Elephant Sheep Serpent Dog Cat Rat Cow Buffalo Tiger Deer Monkey Mongoose Lion'.split(' '),YM=['42232221013321','24332222312320','23421213312031','33242111122202','22124212210211','22212402213321','22111042222212','12312224303221','03312223412221','11121120141121','32220323214221','33022322212432','22301212222342','10121121111224'];
const SM='Prabhava Vibhava Shukla Pramoda Prajapati Angirasa Srimukha Bhava Yuva Dhatri Ishvara Bahudhanya Pramathi Vikrama Vrisha Chitrabhanu Subhanu Tarana Parthiva Vyaya Sarvajit Sarvadhari Virodhi Vikriti Khara Nandana Vijaya Jaya Manmatha Durmukhi Hevilambi Vilambi Vikari Sharvari Plava Shubhakrit Shobhakrit Krodhi Vishvavasu Parabhava Plavanga Kilaka Saumya Sadharana Virodhikrit Paridhavi Pramadicha Ananda Rakshasa Nala Pingala Kalayukta Siddharthi Raudra Durmati Dundubhi Rudhirodgari Raktakshi Krodhana Akshaya'.split(' '),MA='Chaitra Vaishakha Jyeshtha Ashadha Shravana Bhadrapada Ashwayuja Kartika Margashira Pushya Magha Phalguna'.split(' ');
function panch(Y,Mo,sn,el){const sp=n(sn-el/12.19*.9856),mi=(Math.floor(sp/30)+1)%12,sh=(mi>=9&&Mo<=4)?Y-79:Y-78,pm=el>=180?(mi+1)%12:mi;
 return[['Shaka year',sh+' '+SM[(sh-1942+33+600)%60]],['Vikram year',sh+135],['Chandra Maasa',MA[mi]+' ('+tx('Amanta')+'), '+MA[pm]+' ('+tx('Purnimanta')+')']]}
function kpOf(x){const w=360/27,i=Math.floor(x/w);let o=x%w,a=0;for(let k=0;k<9;k++){const L=(i%9+k)%9,s=YR[L]/120*w;if(o<a+s)return[i%9,L];a+=s}return[i%9,i%9]}
const VGS=[[1,'D1 Rashi'],[2,'D2 Hora'],[3,'D3 Drekkana'],[4,'D4 Chaturthamsa'],[7,'D7 Saptamsa'],[9,'D9 Navamsa'],[10,'D10 Dasamsa'],[12,'D12 Dwadashamsa'],[16,'D16 Shodashamsa'],[20,'D20 Vimshamsa'],[24,'D24 Siddhamsa'],[27,'D27 Bhamsa'],[30,'D30 Trimsamsa'],[40,'D40 Khavedamsa'],[45,'D45 Akshavedamsa'],[60,'D60 Shashtiamsa']];
function dv(L,n){const s=Math.floor(L/30),d=L%30,o=s%2==0,m=s%3,k=Math.floor(d/(30/n));
 return n==1?s:n==30?(o?(d<5?0:d<10?10:d<18?8:d<25?2:6):(d<5?1:d<12?5:d<20?11:d<25?9:7)):n==2?(o==d<15?4:3):n==3?(s+4*k)%12:n==4?(s+3*k)%12:n==7?((o?s:s+6)+k)%12:n==9?Math.floor(L*9/30)%12:n==10?((o?s:s+8)+k)%12:n==12||n==60?(s+k)%12:n==16||n==45?([0,4,8][m]+k)%12:n==20?([0,8,4][m]+k)%12:n==24?((o?4:3)+k)%12:n==27?([0,3,6,9][s%4]+k)%12:((o?0:6)+k)%12}
function vr(){if(!LAST)return;const n=+$('vg').value,sid=LAST;$('vc').innerHTML=drawChart(CSTYLE,k=>dv(sid[k],n),tx(VGS.find(v=>v[0]==n)[1]))}
function ianaOff(z,ms){const p=new Intl.DateTimeFormat('en-US',{timeZone:z,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}).formatToParts(new Date(ms)).reduce((o,x)=>(o[x.type]=+x.value,o),{});return(Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second)-Math.floor(ms/1000)*1000)/36e5}
function run(){
 const v=document.getElementById('dt').value,la=+document.getElementById('la').value,lo=+document.getElementById('lo').value,tz=+document.getElementById('tz').value;
 if(!v)return;const[dd,tt]=v.split('T'),[Y,Mo,D]=dd.split('-').map(Number),[H,Mi]=tt.split(':').map(Number);
 const ms=Date.UTC(Y,Mo-1,D,H,Mi)-tz*36e5,jd=ms/864e5+2440587.5;
 if(PAN.years[Y]===undefined)loadPan(Y).then(ok=>{if(ok)run()});
 const{sid,ay}=calc(jd,la,lo),mn=sid.Moon,sn=sid.Sun,mnk=nk(mn),el=n(mn-sn);
 const t=Math.floor(el/12),tn=t==14?tx('Purnima'):t==29?tx('Amavasya'):tx(t<15?'Shukla':'Krishna')+'-'+TT[t%15];
 const kk=Math.floor(el/6),kn=kk==0?KR[7]:kk==57?KR[8]:kk==58?KR[9]:kk==59?KR[10]:KR[(kk-1)%7];
 const yg=YG[Math.floor(n(mn+sn)/(360/27))];
 
 const lg=Math.floor(sid.Lagna/30),si=sunInfo(Y,Mo,D,H+Mi/60,la,lo,tz,sid.Sun+ay);
 const info=[['Lagna',SG[lg]],['Janma Rashi',SG[Math.floor(mn/30)]],['Janma Nakshatra',`${NK[mnk.i]} (${tx('pada')} ${mnk.p})`],['Nakshatra lord',LD[mnk.i%9]],['Vaara',si.v],['Tithi',tn],['Yoga',yg],['Karana',kn],['Ayanamsha (Lahiri)',ay.toFixed(4)+'°'],['Sun sign',SG[Math.floor(sn/30)]],...si.rows,['Rashi lord',tx(SL[Math.floor(mn/30)])],['Lagna lord',tx(SL[lg])],['Varna',tx(VN[Math.floor(mn/30)%4])],['Vashya',tx(VS[Math.floor(mn/30)])],['Yoni',tx(YN[mnk.i])],['Gana',tx(gana(mnk.i))],['Nadi',tx(nadi(mnk.i))],['Name letter',tl(NS[mnk.i].split(' ')[mnk.p-1],mnk.i,mnk.p)],...panInfo(Y,Mo,D,sn,el)];
 const names=['Lagna','Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
 const rows=names.map(k=>{const x=sid[k],q=nk(x);return`<tr><td>${k}</td><td>${fd(x)}</td><td>${NK[q.i]} ${q.p}</td><td>${(n(x-sid.Lagna)/30|0)+1}</td></tr>`}).join('');
 const DH=dashaCard(sid,ms,tz,mnk);
 document.getElementById('out').innerHTML=L10(`
<section data-t="sum"><div class="hero"><div><small>${tx('Lagna')}</small><b>${SG[lg]}</b></div><div><small>${tx('Janma Rashi')}</small><b>${SG[Math.floor(mn/30)]}</b></div><div><small>${tx('Janma Nakshatra')}</small><b>${NK[mnk.i]} ${mnk.p}</b></div><div><small>${tx('Tithi')}</small><b>${tn}</b></div><div><small>${tx('Running dasha')}</small><b>${RUNNING}</b></div></div> <div class="card"><h2>Basic details</h2><div class="g">${info.map(a=>`<div><b>${a[0]}</b>${a[1]}</div>`).join('')}</div></div></section>
<section data-t="analysis">${classicalAnalysis(sid)}${bphsTools(sid)}</section>
<section data-t="predict">${pxTrHtml(predictTab(sid,la,lo))}</section>
<section data-t="yoga">${pxTrHtml(yogaTab(sid))}</section>
<section data-t="remedy">${pxTrHtml(remedyTab(sid,ms,tz,mnk,la,lo))}</section>
<section data-t="timing">${pxTrHtml(timingTab(sid,ms,tz,mnk,la,lo))}</section>
<section data-t="advanced">${pxTrHtml(advancedTab(sid,ms,tz,la,lo))}</section>
<section data-t="jaimini">${jaiminiTools(sid,ms,tz)}</section>
<section data-t="bphs">${bphsGuide()}</section>
<section data-t="chart"> <div class="card"><h2>${tx('Rashi chart')} D1 · ${tx(STN[CSTYLE])}</h2>${drawChart(CSTYLE,k=>Math.floor(sid[k]/30),tx('Rashi')+' D1')}</div>
 <div class="card"><h2>${tx('Navamsa chart')} D9 · ${tx(STN[CSTYLE])}</h2>${drawChart(CSTYLE,k=>Math.floor(sid[k]*9/30)%12,tx('Navamsa')+' D9')}</div>
 <div class="card sc"><h2>Planetary positions</h2><table><tr><th>Body</th><th>Longitude</th><th>Nakshatra · pada</th><th>House</th></tr>${rows}</table></div>
<div class="card"><h2>Divisional charts</h2><div class="f"><div><label>Varga</label><select id="vg">${VGS.map(v=>`<option value="${v[0]}"${v[0]==9?' selected':''}>${tx(v[1])}</option>`).join('')}</select></div></div><div id="vc" style="margin-top:10px"></div></div></section>
<section data-t="dasha">${DH}</section>
<section data-t="chakra">${navataraCard(sid,mnk.i)}${patakiCard(sid,ms,tz,la,lo,ay)}${J_sudarshanaCard(sid,ms,tz)}</section>
<section data-t="more"> <div class="card sc"><h2>KP significators</h2><table><tr><th>Body</th><th>Sign lord</th><th>Star lord</th><th>Sub lord</th></tr>${names.map(k=>{const x=sid[k],q=kpOf(x);return`<tr><td>${k}</td><td>${SL[Math.floor(x/30)]}</td><td>${LD[q[0]]}</td><td>${LD[q[1]]}</td></tr>`}).join('')}</table></div>
 ${ashtaka(sid)}${yogas(sid)}${ephCard(jd)}${panCard(Y,Mo,D)}</section>`);LAST=sid;vr();fsum();buildTabs();$('vg').onchange=vr;bindPataki(sid,ms,tz,la,lo);const av=$('av-graha');if(av)av.onchange=()=>{$('av-shodhana-output').innerHTML=ashtakaShodhanaTable(sid,av.value)}}
let PLC=Object.entries(CITIES).filter(x=>x[0]!='Custom').map(([n,c])=>({n,la:c[0],lo:c[1],tz:c[2]}));
function pick(p){$('la').value=p.la;$('lo').value=p.lo;$('tz').value=isNaN(+p.tz)?ianaOff(p.tz,Date.parse($('dt').value+'Z')||Date.now()):+p.tz;$('ps').value=p.n;$('pr').innerHTML=''}
const ps=$('ps'),pr=$('pr');function closePlaces(){pr.innerHTML='';ps.setAttribute('aria-expanded','false')}ps.oninput=()=>{const q=ps.value.trim().toLowerCase();closePlaces();if(q.length<2)return;PLC.filter(p=>p.n.toLowerCase().includes(q)).slice(0,15).forEach(p=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','option');b.textContent=p.n+' ('+p.la+', '+p.lo+')';b.onclick=()=>{pick(p);ps.setAttribute('aria-expanded','false');ps.focus()};pr.appendChild(b)});ps.setAttribute('aria-expanded',String(pr.children.length>0))};ps.onkeydown=e=>{if(e.key==='ArrowDown'&&pr.firstElementChild){e.preventDefault();pr.firstElementChild.focus()}else if(e.key==='Escape'){closePlaces()}};pr.onkeydown=e=>{const opts=[...pr.querySelectorAll('button')],i=opts.indexOf(document.activeElement);if(e.key==='ArrowDown'&&i<opts.length-1){e.preventDefault();opts[i+1].focus()}else if(e.key==='ArrowUp'){e.preventDefault();if(i>0)opts[i-1].focus();else ps.focus()}else if(e.key==='Escape'){e.preventDefault();closePlaces();ps.focus()}};
$('pf').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{let rows=[];try{if(f.name.endsWith('.json')){const j=JSON.parse(t);rows=Array.isArray(j)?j:Object.values(j)}else{const L=t.split(/\r?\n/).filter(Boolean),sp=L[0].includes('\t')?'\t':',',h=L[0].split(sp).map(x=>x.trim().toLowerCase());rows=L.slice(1).map(l=>{const c=l.split(sp),o={};h.forEach((k,i)=>o[k]=(c[i]||'').trim());return o})}}catch(x){$('pc').textContent='Could not read that file';return}
 const g=(o,ks)=>{for(const k of ks)if(o[k]!==undefined&&o[k]!=='')return o[k]};
 const out=rows.map(o=>{o=Object.fromEntries(Object.entries(o).map(([k,v])=>[k.toLowerCase(),v]));const la=+g(o,['lat','latitude']),lo=+g(o,['lon','lng','long','longitude']);let tz=g(o,['tz','timezone','time_zone','utc','utc_offset','gmt']);if(tz===undefined)tz=la>6&&la<37&&lo>68&&lo<98?5.5:Math.round(lo/15);return{n:String(g(o,['name','city','place','town','n'])||''),la,lo,tz}}).filter(p=>p.n&&isFinite(p.la)&&isFinite(p.lo));
 PLC=out.concat(PLC);$('pc').textContent=' '+out.length+' '+tx('places loaded in your browser (nothing is uploaded). Start typing a name above.')})};
initUI();pick(PLC[0]);restoreIn();$('go').onclick=()=>{run();closeForm()};run();loadEph().then(run);
fetch('data/bphs-guide.json').then(r=>r.ok?r.json():Promise.reject()).then(d=>{BPHS_CHAPTERS=Array.isArray(d)?d:[];if(LAST)run()}).catch(()=>{BPHS_CHAPTERS=[]});
fetch('data/bphs-yoga-rules.json').then(r=>r.ok?r.json():Promise.reject()).then(d=>{BPHS_YOGA_RECORDS=Array.isArray(d)?d:[];if(LAST)run()}).catch(()=>{BPHS_YOGA_RECORDS=[]});
fetch('data/bphs-as.json').then(r=>r.ok?r.json():Promise.reject()).then(d=>{BPHS_AS=d||{};if(LAST&&LANG==='as')run()}).catch(()=>{BPHS_AS={}});
fetch('data/places.csv').then(r=>r.ok?r.text():Promise.reject()).then(t=>$('pf').onchange({target:{files:[new File([t],'places.csv')]}})).catch(()=>{});
