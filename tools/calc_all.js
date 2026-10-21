// Formula positions (sidereal, 0h UT, one row per day). Used only to choose signs while building the table.
const fs=require('fs'),vm=require('vm'),path=require('path');
global.ephAt=()=>null; // never read the table while building it
let s=fs.readFileSync(path.join(__dirname,'../js/app.js'),'utf8');s=s.slice(0,s.indexOf('const fd='));
vm.runInThisContext(s);
const [y0,m0,d0,N]=JSON.parse(process.argv[2]),out=[];
for(let i=0;i<N;i++){const r=calc(Date.UTC(y0,m0-1,d0+i,0)/864e5+2440587.5,0,0).sid;
 out.push([r.Sun,r.Moon,r.Mars,r.Mercury,r.Jupiter,r.Venus,r.Saturn,r.Rahu,r.Ketu].map(x=>+x.toFixed(4)))}
process.stdout.write(JSON.stringify(out));
