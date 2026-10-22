// Three Kundli chart styles, drawn as SVG: East Indian (default), North Indian, South Indian.
// East Indian: sign-fixed 3x3 frame with divided corner cells, Aries in the top-centre cell, signs run anti-clockwise.
const PN10=['Lagna','Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
const EA=400/3,EB=800/3;
const E_POLY=[[EA,0,EB,0,EB,EA,EA,EA],[0,0,EA,0,EA,EA],[0,0,EA,EA,0,EA],[0,EA,EA,EA,EA,EB,0,EB],[0,EB,EA,EB,0,400],[EA,EB,EA,400,0,400],[EA,EB,EB,EB,EB,400,EA,400],[EB,EB,EB,400,400,400],[EB,EB,400,EB,400,400],[EB,EA,400,EA,400,EB,EB,EB],[400,0,400,EA,EB,EA],[EB,0,400,0,EB,EA]];
const E_POS=[[200,67],[89,44],[44,89],[67,200],[44,311],[89,355],[200,333],[311,355],[355,311],[333,200],[355,89],[311,44]];
const N_POS=[[200,100],[100,40],[40,100],[100,200],[40,300],[100,360],[200,300],[300,360],[360,300],[300,200],[360,100],[300,40]];
const N_POLY=[[200,4,100,100,200,200,300,100]];
const S_GRID=[11,0,1,2,10,null,null,3,9,null,null,4,8,7,6,5];
const pts=p=>{const o=[];for(let i=0;i<p.length;i+=2)o.push(p[i].toFixed(1)+','+p[i+1].toFixed(1));return o.join(' ')};
function blk(x,y,label,pl,per){const rows=[];for(let i=0;i<pl.length;i+=per)rows.push(pl.slice(i,i+per).join(' '));
 const h=15,n=rows.length+1,y0=y-(n-1)*h/2;
 return`<text x="${x}" y="${y0}" text-anchor="middle" dominant-baseline="central" fill="var(--mu)" font-size="11">${label}</text>`+rows.map((r,i)=>`<text x="${x}" y="${y0+(i+1)*h}" text-anchor="middle" dominant-baseline="central" fill="var(--tx)" font-size="13">${r}</text>`).join('')}
// st: 'e' | 'n' | 's';  f(planetKey) -> sign index 0..11;  title: text for the centre
function drawChart(st,f,title){
 const lg=f('Lagna'),P=s=>(s==lg?[AB.Lagna]:[]).concat(PN10.filter(k=>k!='Lagna'&&f(k)==s).map(k=>AB[k])),hl=p=>`<polygon points="${pts(p)}" fill="var(--ac)" fill-opacity=".16"/>`;
 let g='',t='';
 if(st=='e'){
  g=hl(E_POLY[lg])+`<g fill="none" stroke="var(--chart-line)" stroke-width="2"><rect x="1" y="1" width="398" height="398"/><path d="M${EA} 0V400M${EB} 0V400M0 ${EA}H400M0 ${EB}H400M0 0L${EA} ${EA}M400 0L${EB} ${EA}M0 400L${EA} ${EB}M400 400L${EB} ${EB}"/></g>`;
  E_POS.forEach((p,s)=>t+=blk(p[0],p[1],s+1,P(s),3));
  t+=`<text x="200" y="192" text-anchor="middle" fill="var(--ac)" font-size="15">${title}</text><text x="200" y="214" text-anchor="middle" fill="var(--mu)" font-size="12">${tx('Lagna')}: ${SG[lg]}</text>`}
 else if(st=='n'){
  g=hl(N_POLY[0])+`<g fill="none" stroke="var(--chart-line)" stroke-width="2"><rect x="1" y="1" width="398" height="398"/><path d="M0 0L400 400M400 0L0 400M200 0L400 200L200 400L0 200Z"/></g>`;
  N_POS.forEach((p,i)=>{const s=(lg+i)%12;t+=blk(p[0],p[1],s+1,P(s),3)})}
 else{
  S_GRID.forEach((s,i)=>{if(s===null||s!=lg)return;const x=(i%4)*100,y=(i>>2)*100;g+=hl([x,y,x+100,y,x+100,y+100,x,y+100])});
  g+=`<g fill="none" stroke="var(--chart-line)" stroke-width="2"><rect x="1" y="1" width="398" height="398"/><path d="M100 0V400M300 0V400M0 100H400M0 300H400M200 0V100M200 300V400M0 200H100M300 200H400"/></g>`;
  S_GRID.forEach((s,i)=>{if(s===null)return;const x=(i%4)*100,y=(i>>2)*100,pl=P(s),rows=[];for(let k=0;k<pl.length;k+=3)rows.push(pl.slice(k,k+3).join(' '));
   t+=`<text x="${x+5}" y="${y+14}" fill="var(--mu)" font-size="11">${SG[s]}</text>`+rows.map((r,k)=>`<text x="${x+50}" y="${y+46+k*16}" text-anchor="middle" fill="var(--tx)" font-size="13">${r}</text>`).join('')});
  t+=`<text x="200" y="192" text-anchor="middle" fill="var(--ac)" font-size="15">${title}</text><text x="200" y="214" text-anchor="middle" fill="var(--mu)" font-size="12">${tx('Lagna')}: ${SG[lg]}</text>`}
 return`<svg viewBox="0 0 400 400" role="img" style="max-width:440px;width:100%;display:block;margin:auto">${g}${t}</svg>`}
