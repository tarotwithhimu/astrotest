"""Audit data/ephemeris.csv against the verbatim source export (data/source/EphimerisTABLE_raw.csv.gz).
Run: python tools/audit_ephemeris.py   (needs numpy, pandas)"""
import os,numpy as np,pandas as pd
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','data')
raw=pd.read_csv(os.path.join(D,'source','EphimerisTABLE_raw.csv.gz'),dtype=str).apply(lambda s:s.str.strip());N=len(raw)
n=lambda c:pd.to_numeric(raw[c]).values
rows=[l.rstrip('\n').split(',') for l in open(os.path.join(D,'ephemeris.csv')) if l[0] not in '#a']
C=np.array([[int(x) for i,x in enumerate(r) if i!=13] for r in rows]);lords=np.array([[int(c) for c in r[13]] for r in rows])
fails=0
def show(name,bad):
    global fails;fails+=bad;print(('PASS' if bad==0 else 'FAIL'),name.ljust(46),'mismatches:',bad)
print('source rows',N,'| csv rows',len(rows),'| source columns',raw.shape[1]);assert N==len(rows)
d=pd.to_datetime(raw.Date,format='%d/%b/%Y');show('dates contiguous 1930-01-01..2061-01-09',int((d.diff().dropna()!=pd.Timedelta(days=1)).sum()+(d.iloc[0]!=pd.Timestamp(1930,1,1))))
show('Id column sequential',int((pd.to_numeric(raw.Id).values!=np.arange(1,N+1)).sum()))
show('no blank or non-numeric cells',int(sum(pd.to_numeric(raw[c],errors='coerce').isna().sum() for c in raw.columns if c not in('Date','Ayanamsa'))))
tot=lambda a,b,c:np.rint(n(a)*3600+n(b)*60+n(c)).astype(int)
for nm,col,g in [('sun',1,('Textbox6','Textbox7','Textbox8')),('moon',2,('Textbox10','Textbox11','Textbox12')),('mars',3,('Textbox14','Textbox15','Textbox16')),('mercury',4,('Textbox18','Textbox19','Textbox20')),('venus',6,('Textbox26','Textbox27','Textbox28'))]:
    show(nm+' deg:min:sec (in-sign, exact arcsec)',int(((C[:,col]-tot(*g))%108000!=0).sum()))
show('jupiter sign + deg:min:sec',int((C[:,5]!=n('Textbox21')*108000+tot('Textbox22','Textbox23','Textbox24')).sum()))
show('saturn min:sec, sign column',int((((C[:,7]-(n('Textbox31')*60+n('Textbox32')).astype(int))%3600!=0)|(C[:,7]//108000!=n('Textbox29'))).sum()))
show('rahu sign + deg:min:sec',int((C[:,8]!=n('Textbox33')*108000+tot('Textbox34','Textbox35','Textbox36')).sum()))
show('ketu sign + deg:min:sec',int((C[:,9]!=n('Textbox37')*108000+tot('Textbox38','Textbox39','Textbox40')).sum()))
s=lambda x:int(x[:2])*3600+int(x[3:5])*60+int(x[6:]);show('ayanamsa',int((C[:,0]!=raw.Ayanamsa.map(s).values).sum()))
show('sunrise, sunset',int((C[:,10]!=n('Textbox1')*60+n('Textbox2')).sum()+(C[:,11]!=n('Textbox3')*60+n('Textbox4')).sum()))
show('moon daily motion (81:82)',int((C[:,12]!=n('Textbox81')*60+n('Textbox82')).sum()))
show('Textbox10Other',int((C[:,13]!=n('Textbox10Other')).sum()))
show('Textbox41-49 lord digits',int((lords!=np.stack([n('Textbox%d'%k) for k in range(41,50)],1)).sum()))
lon=C[:,1:10]/3600.0;NK=360/27;mp={0:9,1:6,2:1,3:2,4:3,5:8,6:5,7:7,8:4}
ok=np.stack([[mp[int(x)%9] for x in np.floor(lon[:,j]/NK)] for j in range(9)],1)
near=np.minimum(lon%NK,NK-lon%NK)*3600<=1.5
show('lord digits vs table longitudes (excl. <=1.5" at boundary)',int(((ok!=lords)&~near.T.T).sum()))
show('Ketu = Rahu + 180',int((np.abs(((lon[:,8]-lon[:,7])%360)-180)>1e-6).sum()))
w=np.array([-1/6,2/3,2/3,-1/6]);worst={}
for j,b in enumerate(['Sun','Mars','Mercury','Jupiter','Venus','Saturn']):
    k={'Sun':0,'Mars':2,'Mercury':3,'Jupiter':4,'Venus':5,'Saturn':6}[b];x=np.unwrap(np.radians(lon[:,k]))*180/np.pi
    r=np.abs(x[2:-2]-(w[0]*x[:-4]+w[1]*x[1:-3]+w[2]*x[3:-1]+w[3]*x[4:]));worst[b]=round(float(r.max()),4)
print('typo scan, max hold-out residual (deg):',worst);show('no typo-sized jump (> 0.02 deg) in those six',int(sum(v>0.02 for v in worst.values())))
print('rolled minutes (60) in source, kept numerically (<=2 arcsec effect):',int(sum((n(c)==60).sum() for c in ['Textbox7','Textbox11','Textbox15','Textbox19','Textbox23','Textbox27','Textbox31','Textbox35','Textbox39'])))
print('RESULT:','ALL CHECKS PASSED' if fails==0 else '%d FAILURES'%fails)
