"""Convert EphimerisTABLE from the Access .mdb into data/ephemeris.csv.
Usage: python tools/build_ephemeris.py EPHEMERISImportantData.mdb data/ephemeris.csv
Needs: pip install access-parser pandas numpy, and node.
The table stores degree/minute/second inside the sign. Missing pieces (signs of Sun, Moon, Mars, Mercury, Venus
and Saturn's whole degree) are restored from formula positions, which agree with the table to within 0.25 degrees."""
import sys,os,json,subprocess,numpy as np,pandas as pd
from access_parser import AccessParser
mdb,out=sys.argv[1:3]
df=pd.DataFrame(AccessParser(mdb).parse_table('EphimerisTABLE'))
N=len(df);n=lambda c:pd.to_numeric(df[c].astype(str).str.strip(),errors='coerce').values.astype(float)
d=pd.to_datetime(df.Date,format='%d/%b/%Y');assert d.iloc[0]==pd.Timestamp(1930,1,1) and (d.diff().dropna()==pd.Timedelta(days=1)).all()
here=os.path.dirname(os.path.abspath(__file__))
P=np.array(json.loads(subprocess.check_output(['node',os.path.join(here,'calc_all.js'),json.dumps([d.iloc[0].year,d.iloc[0].month,d.iloc[0].day,N])])))
dms=lambda a,b,c:n(a)+n(b)/60+n(c)/3600
def place(deg,approx,step=30): return (np.round((approx-deg)/step)*step+deg)%360
L={}
L['sun']=place(dms('Textbox6','Textbox7','Textbox8'),P[:,0]);L['moon']=place(dms('Textbox10','Textbox11','Textbox12'),P[:,1])
L['mars']=place(dms('Textbox14','Textbox15','Textbox16'),P[:,2]);L['mercury']=place(dms('Textbox18','Textbox19','Textbox20'),P[:,3])
L['venus']=place(dms('Textbox26','Textbox27','Textbox28'),P[:,5])
L['jupiter']=n('Textbox21')*30+dms('Textbox22','Textbox23','Textbox24')
L['saturn']=place(n('Textbox31')/60+n('Textbox32')/3600,P[:,6],1)  # whole degree restored
L['rahu']=n('Textbox33')*30+dms('Textbox34','Textbox35','Textbox36');L['ketu']=n('Textbox37')*30+dms('Textbox38','Textbox39','Textbox40')
# validation against the sign columns the table does contain, and against the formulas
chk={'jupiter':'Textbox21','saturn':'Textbox29','rahu':'Textbox33','ketu':'Textbox37'}
for k,c in chk.items(): print(k,'sign column agrees on',int((np.floor(L[k]/30)==n(c)).sum()),'of',N)
for k,i in zip(['sun','moon','mars','mercury','jupiter','venus','saturn'],[0,1,2,3,4,5,6]):
    e=np.abs((L[k]-P[:,i]+180)%360-180);print(k,'max |table - formula| deg',round(float(e.max()),3))
print('ketu - rahu max deviation from 180:',round(float(np.abs(((L['ketu']-L['rahu'])%360)-180).max()),3))
def sec(s):
    h,m,x=s.split(':');return int(h)*3600+int(m)*60+int(x)
ay=df.Ayanamsa.astype(str).str.strip().map(sec).values
lords=''.join(map(str,[0]*0))
cols=[ay]+[np.rint(L[k]*3600).astype(int)%1296000 for k in ['sun','moon','mars','mercury','jupiter','venus','saturn','rahu','ketu']]
cols+=[(n('Textbox1')*60+n('Textbox2')).astype(int),(n('Textbox3')*60+n('Textbox4')).astype(int),(n('Textbox81')*60+n('Textbox82')).astype(int)]
lor=np.char.add.reduce([df['Textbox%d'%k].astype(str).str.strip().values.astype(str) for k in range(41,50)])
cols+= [lor,n('Textbox10Other').astype(int)]
with open(out,'w') as f:
    f.write('#EPH v1 start=1930-01-01 step=1d time=00:00UT lon=arcsec sidereal ay=arcsec rise_set=minutes(IST) moonmot=arcmin lords=planet numbers Su..Ke other=Textbox10Other\n')
    f.write('ay,sun,moon,mars,mercury,jupiter,venus,saturn,rahu,ketu,rise,set,moonmot,lords,other\n')
    for i in range(N): f.write(','.join(str(c[i]) for c in cols)+'\n')
print('wrote',out,N,'rows',round(os.path.getsize(out)/1e6,2),'MB')
