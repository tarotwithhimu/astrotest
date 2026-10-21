"""Audit the Panchang data files against the verbatim export. Run: python tools/audit_panchang.py  (needs numpy, pandas)"""
import os,json,numpy as np,pandas as pd
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','data')
raw=pd.read_csv(os.path.join(D,'source','PanchangTABLE_raw.csv.gz'),dtype=str,keep_default_na=False);meta=json.load(open(os.path.join(D,'panchang','meta.json')))
fails=0
def show(name,bad,note=''):
    global fails;fails+=bad;print(('PASS' if bad==0 else 'FAIL'),name.ljust(58),'mismatches:',bad,note)
print('raw export: rows',len(raw),'columns',raw.shape[1])
dated=raw[raw.PDate!=''].reset_index(drop=True);blank=raw[raw.PDate==''];cols=meta['cols'];const=meta['constants']
# 1. every dated cell reconstructs exactly from the year files + constants
files=sorted(f for f in os.listdir(os.path.join(D,'panchang')) if f[0]=='1' or f[0]=='2')
rows=[];[rows.extend(json.load(open(os.path.join(D,'panchang',f)))['rows']) for f in files]
show('dated row count (year files vs raw)',abs(len(rows)-len(dated)))
def s(x): return '' if x is None else str(x)
bad=0
for j,c in enumerate(cols):
    exp=np.array([s(r[j]) for r in rows]);bad+=int((exp!=dated[c].values).sum())
show('all %d varying columns, every dated row, cell for cell'%len(cols),bad)
bad=sum(int((dated[c].values!=s(v)).sum()) for c,v in const.items())
show('%d constant columns match every dated row'%len(const),bad)
nb=int((blank[[c for c in cols if c not in('Set','Recnum','ID','TextBox41')]]!='').sum().sum());show('blank rows (%d) carry no data beyond Set/Recnum/ID/flag'%len(blank),nb)
# 2. decoded meanings
d=pd.to_datetime(dated.PDate.str.split(' ').str[0],format='%d/%m/%Y');show('dates ascending, 1930-01-01 .. '+str(d.max().date()),int(not d.is_monotonic_increasing)+int(d.iloc[0]!=pd.Timestamp(1930,1,1)))
sec=lambda x:sum(int(a)*b for a,b in zip(x.strip().split(':'),(3600,60,1)))
rise=dated.SunRise.map(sec).values;sset=dated.SunSet.map(sec).values;din=dated.TextBox27.map(lambda x:sum(int(a)*b for a,b in zip(x.strip().split(':'),(1440,24,.4)))).values
show('Dinamana = (sunset - sunrise) in ghati, within 1 vipala',int((np.abs(din-(sset-rise))>0.5).sum()))
ym=lambda c:pd.Series(d[dated[c]!=dated[c].shift(1)].iloc[1:].dt.month).value_counts().to_dict()
print('info  Vikram year (TextBox38) changes in months',ym('TextBox38'),'| Kartika-based (TextBox35) changes in months',ym('TextBox35'))
print('info  Vikram - Shaka =',sorted(set((dated.TextBox38.astype(int)-dated.TextBox39.astype(int)).tolist())),sorted(set((dated.TextBox35.astype(int)-dated.TextBox36.astype(int)).tolist())))
print('info  moonrise/moonset shown as "-----" on',int((dated.TextBox45=='-----').sum()),'/',int((dated.TextBox46=='-----').sum()),'days')
print('info  ayanamsha as printed (TextBox22):',sorted(set(dated.TextBox22.str.strip())))
print('info  TextBox41 counts:',dated.TextBox41.value_counts().to_dict())
for c,m in meta['maps'].items():
    tot=sum(v['n'] for v in m.values());agree=sum(v['n']*v['share'] for v in m.values() if v['share'])/tot
    print('info  %s: %d distinct texts, name agreement with computed values %.2f%%'%(c,len(m),100*agree),'| ambiguous texts:',[k for k,v in m.items() if 'alts' in v and max(v['alts'].values())>0.1*v['n']][:3])
# 3. end times (tithi/nakshatra/yoga) reproduce from the ephemeris table
E=np.array([[int(x) for i,x in enumerate(l.rstrip('\n').split(',')) if i!=13] for l in open(os.path.join(D,'ephemeris.csv')) if l[0] not in '#a']);JD0=2425977.5
def pos(col,jd):
    x=jd-JD0;i=int(np.floor(x));f=x-i;w=[-f*(f-1)*(f-2)/6,(f+1)*(f-1)*(f-2)/2,-(f+1)*f*(f-2)/2,(f+1)*f*(f-1)/6];b=E[i,col];t=b
    for j,k in ((-1,0),(1,2),(2,3)): t+=w[k]*(((E[i+j,col]-b)+648000)%1296000-648000)
    return (t%1296000)/3600.0
def q(kind,jd):
    su,mo=pos(1,jd),pos(2,jd)
    return {'tithi':((mo-su)%360)/12,'nak':mo/(360/27),'yoga':((su+mo)%360)/(360/27)}[kind]
def end(kind,jd0):
    wrap=30 if kind=='tithi' else 27;tgt=np.floor(q(kind,jd0))+1;lo,hi=jd0,jd0+1.6
    for _ in range(40):
        m=(lo+hi)/2
        if ((q(kind,m)-tgt+wrap/2)%wrap-wrap/2)<0: lo=m
        else: hi=m
    return (lo+hi)/2
first=dated[~d.duplicated().values];idx=np.random.RandomState(7).choice(len(first),600,replace=False);worst={}
for k,c in (('tithi','TextBox2'),('nak','TextBox5'),('yoga','TextBox8')):
    dev=[]
    for i in idx:
        r=first.iloc[i];dd=pd.to_datetime(r.PDate.split(' ')[0],format='%d/%m/%Y');jd0=(dd-pd.Timestamp(1970,1,1)).days+2440587.5+(sec(r.SunRise)-5.5*3600)/86400
        if jd0-JD0<5 or jd0-JD0>len(E)-8 or r[c]=='': continue
        t=sum(int(a)*b for a,b in zip(r[c].strip().split(':'),(1440,24,.4)))
        if t>=60*1440: continue
        dev.append(abs(t-(end(k,jd0)-jd0)*86400)/60)
    worst[k]=(len(dev),round(float(np.median(dev)),3),round(float(max(dev)),2))
print('info  end-time reproduction (n, median minutes, max minutes):',worst)
show('tithi/nakshatra/yoga end times reproduce within 1 minute',int(sum(v[2]>1.0 for v in worst.values())))
print('RESULT:','ALL CHECKS PASSED' if fails==0 else '%d FAILURES'%fails)
