"""Convert PanchangTABLE from PANCHANGAImportantData.mdb into the project data files.
Usage: python tools/build_panchang.py PANCHANGAImportantData.mdb <project root>
Writes data/source/PanchangTABLE_raw.csv.gz (every cell verbatim, all 47,857 rows), data/panchang/<year>.json (the 45,964
dated rows, all non-constant columns, values unchanged) and data/panchang/meta.json (constant columns + decoded name maps).
Nothing in the data is corrected. The name maps (legacy-font text -> name) are INFERRED by comparing each column with values
computed from data/ephemeris.csv; they are stored beside the raw text, never instead of it."""
import sys,os,json,collections,numpy as np,pandas as pd
from access_parser import AccessParser
mdb,root=sys.argv[1:3]
raw=pd.DataFrame(AccessParser(mdb).parse_table('PanchangTABLE'));N=len(raw)
os.makedirs(root+'/data/source',exist_ok=True);os.makedirs(root+'/data/panchang',exist_ok=True)
raw.to_csv(root+'/data/source/PanchangTABLE_raw.csv.gz',index=False,compression='gzip')
v=raw[raw.PDate.notna()].copy();v['D']=pd.to_datetime(v.PDate.astype(str).str.split(' ').str[0],format='%d/%m/%Y')
assert v.D.is_monotonic_increasing
# constant columns (same value on every dated row) go to meta.json
const={};vary=[]
for c in raw.columns:
    u=v[c].map(lambda x:None if (x is None or (isinstance(x,float) and np.isnan(x))) else x).astype(object).map(repr).unique()
    if len(u)==1: const[c]=None if v[c].iloc[0] is None or (isinstance(v[c].iloc[0],float) and np.isnan(v[c].iloc[0])) else (v[c].iloc[0].item() if hasattr(v[c].iloc[0],'item') else v[c].iloc[0])
    else: vary.append(c)
def cell(x):
    if x is None or (isinstance(x,float) and np.isnan(x)): return None
    return x.item() if hasattr(x,'item') else x
for y,g in v.groupby(v.D.dt.year):
    json.dump({'cols':vary,'rows':[[cell(x) for x in r] for r in g[vary].itertuples(index=False,name=None)]},open(f'{root}/data/panchang/{y}.json','w'),separators=(',',':'))
# ---- inferred name maps from the ephemeris table
E=np.array([[int(x) for i,x in enumerate(l.rstrip('\n').split(',')) if i!=13] for l in open(root+'/data/ephemeris.csv') if l[0] not in '#a']);JD0=2425977.5
def pos(col,jd):
    x=jd-JD0;i=int(np.floor(x));f=x-i;w=[-f*(f-1)*(f-2)/6,(f+1)*(f-1)*(f-2)/2,-(f+1)*f*(f-2)/2,(f+1)*f*(f-1)/6];b=E[i,col];s=b
    for j,k in ((-1,0),(1,2),(2,3)): s+=w[k]*(((E[i+j,col]-b)+648000)%1296000-648000)
    return (s%1296000)/3600.0
NK='Ashwini Bharani Krittika Rohini Mrigashira Ardra Punarvasu Pushyami Ashlesha Magha P.Phalguni U.Phalguni Hasta Chitra Swati Vishakha Anuradha Jyeshtha Moola P.Ashadha U.Ashadha Shravana Dhanishta Shatabhisha P.Bhadra U.Bhadra Revati'.split()
SG='Mesha Vrishabha Mithuna Kataka Simha Kanya Thula Vrischika Dhanu Makara Kumbha Meena'.split()
MA='Chaitra Vaishakha Jyeshtha Ashadha Shravana Bhadrapada Ashwayuja Kartika Margashira Pushya Magha Phalguna'.split()
RT='Vasanta Grishma Varsha Sharad Hemanta Shishira'.split()
def kn(k): return 'Kimstughna' if k==0 else {57:'Shakuni',58:'Chatushpada',59:'Naga'}.get(k) or ['Bava','Balava','Kaulava','Taitila','Gara','Vanija','Vishti'][(k-1)%7]
sec=lambda s:sum(int(a)*b for a,b in zip(str(s).strip().split(':'),(3600,60,1)))
f=v.drop_duplicates('D');f=f[(f.D>='1930-01-03')&(f.D<='2060-12-01')]
F=collections.defaultdict(list)
def el(j): return (pos(2,j)-pos(1,j))%360
for d,r in zip(f.D,f.SunRise):
    jd=(d-pd.Timestamp(1970,1,1)).days+2440587.5+(sec(r)-5.5*3600)/86400;sun,moon=pos(1,jd),pos(2,jd);e0=el(jd)
    ay=np.interp(jd-JD0,np.arange(len(E)),E[:,0])/3600;trop=(sun+ay)%360
    lo,hi=jd-e0/12.19-2.5,jd-e0/12.19+2.5
    for _ in range(40):
        m=(lo+hi)/2
        if ((el(m)+180)%360-180)<0: lo=m
        else: hi=m
    mi=(int(pos(1,(lo+hi)/2)//30)+1)%12
    F['TextBox4'].append(NK[int(moon//(360/27))]);F['TextBox10'].append(kn(int(e0//6)));F['TextBox13'].append(SG[int(moon//30)])
    F['TextBox37'].append(MA[mi]);F['TextBox40'].append(MA[(mi+1)%12] if e0>=180 else MA[mi])
    F['TextBox42'].append('Uttarayana' if (trop<90 or trop>=270) else 'Dakshinayana');F['TextBox43'].append('Uttara gola' if trop<180 else 'Dakshina gola')
    F['TextBox44'].append(RT[int(((trop+30)%360)//60)])
maps={};report={}
for c,feat in F.items():
    s=f[c].reset_index(drop=True);m=s.notna();t=pd.crosstab(s[m],pd.Series(feat)[m.values].reset_index(drop=True).values)
    maps[c]={};bad=0;n=0
    for rawtxt,row in t.iterrows():
        top=row.idxmax();share=float(row.max()/row.sum())
        maps[c][rawtxt]={'name':top,'share':round(share,4),'n':int(row.sum())}
        alts={k:int(x) for k,x in row.items() if x>0 and k!=top}
        if alts: maps[c][rawtxt]['alts']=alts
        bad+=row.sum()-row.max();n+=row.sum()
    allraw=set(v[c].dropna())-set(maps[c]);
    for x in allraw: maps[c][x]={'name':None,'share':None,'n':0}
    report[c]=(len(t),round(1-bad/n,4),len(allraw))
json.dump({'start':'1930-01-01','end':str(v.D.max().date()),'cols':vary,'constants':const,'maps':maps,
 'notes':'maps are inferred (legacy-font text -> name) by comparison with values computed from ephemeris.csv; share = agreement; name null = text never seen on the compared days'},open(root+'/data/panchang/meta.json','w'),ensure_ascii=True,separators=(',',':'))
print('years',v.D.dt.year.nunique(),'dated rows',len(v),'blank rows',N-len(v),'| varying cols',len(vary),'| constants',list(const))
print('map purity (distinct texts, agreement, texts only on unmatched days):',report)
