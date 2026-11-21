// À exécuter dans la console d'un onglet ouvert sur https://dpm.lol (étapes 1-3)
async function etape1_champions(patch){
  const j=await fetch(`/v1/tierlist?tier=emerald_plus&timeframe=${patch}&gameMode=ranked`).then(r=>r.json());
  window.__tl=j;return {lignes:j.champions.length,parties:j.total};
}
async function etape2_objets(patch){
  const j=window.__tl,tot={};for(const c of j.champions)tot[c.championName]=(tot[c.championName]||0)+c.count;
  const jobs=j.champions.filter(c=>c.count>=Math.max(300,tot[c.championName]*0.1));
  const items={},cs={};
  async function run(c){const b=await fetch(`/v1/builds/${c.championName}?lane=${c.lane.toLowerCase()}&tier=emerald_plus&timeframe=${patch}&gameMode=ranked`).then(r=>r.json());
    for(const arr of Object.values(b.items||{}))for(const it of arr)items[it.Id]=(items[it.Id]||0)+it.games;
    for(const bt of (b.boots||[]))items[bt.itemId]=(items[bt.itemId]||0)+bt.pickrate/100*c.count;
    const s=b.championStats;if(s){const o=cs[c.championName]??={n:0,dpm:0,dt:0,kda:0};o.n+=c.count;o.dpm+=s.dmgPerMin*c.count;o.dt+=s.damageTaken*c.count;o.kda+=((s.kills+s.assists)/Math.max(1,s.deaths))*c.count}}
  for(let i=0;i<jobs.length;i+=6)await Promise.all(jobs.slice(i,i+6).map(run));
  window.__items=items;window.__cstats=cs;window.__covered=jobs.reduce((a,c)=>a+c.count,0);return {appels:jobs.length,objets:Object.keys(items).length};
}
async function etape3_export(ddragonVersion){
  const V=ddragonVersion;const [it,ch]=await Promise.all([fetch(`https://ddragon.leagueoflegends.com/cdn/${V}/data/fr_FR/item.json`).then(r=>r.json()),fetch(`https://ddragon.leagueoflegends.com/cdn/${V}/data/fr_FR/champion.json`).then(r=>r.json())]);
  const j=window.__tl,L={TOP:'T',JUNGLE:'J',MIDDLE:'M',BOTTOM:'B',UTILITY:'S'},TG={Fighter:'F',Tank:'T',Mage:'M',Assassin:'A',Marksman:'D',Support:'S'};
  const byKey={};for(const c of Object.values(ch.data))byKey[c.id.toLowerCase()]=c;
  const m={};for(const c of j.champions){const o=m[c.championName]??={n:0,w:0,ban:0,main:null,mn:0};o.n+=c.count;o.w+=c.winrate*c.count/100;o.ban=Math.max(o.ban,c.banrate);if(c.count>o.mn){o.mn=c.count;o.main=c.lane}}
  const C=Object.entries(m).map(([k,o])=>{const d=byKey[k.toLowerCase()],s=window.__cstats[k]||{n:1,dpm:0,dt:0,kda:0},id=d?d.id:k;
    return [id,d&&d.name!==id?d.name:'',d?d.title:'',d?d.tags.map(t=>TG[t]).join(''):'',L[o.main],+(o.n/j.total*100).toFixed(2),+(o.w/o.n*100).toFixed(2),+o.ban.toFixed(1),Math.round(s.dpm/s.n),Math.round(s.dt/s.n/100),+(s.kda/s.n).toFixed(2)].join('|')}).join('\n');
  const I=Object.entries(window.__items).map(([id,g])=>{const d=it.data[id];if(!d)return null;const t=d.tags;const k=t.includes('Boots')?'B':t.includes('SpellDamage')?'M':(t.includes('Damage')||t.includes('CriticalStrike')||t.includes('AttackSpeed'))?'P':(t.includes('Health')||t.includes('Armor')||t.includes('SpellBlock'))?'T':'S';
    return {l:[id,d.name,d.gold.total,+(g/window.__covered*100).toFixed(2),k].join('|'),pr:g/window.__covered*100}}).filter(x=>x&&x.pr>=0.05).sort((a,b)=>b.pr-a.pr).map(x=>x.l).join('\n');
  return {GAMES:j.total,RAW_C:C,RAW_I:I};
}
// Étape 4 : dans un onglet ouvert sur https://ddragon.leagueoflegends.com/api/versions.json
async function etape4_images(V,C,I){
  async function conv(url,w,h){const bm=await createImageBitmap(await (await fetch(url)).blob());const cv=new OffscreenCanvas(w,h),x=cv.getContext('2d');const s=Math.max(w/bm.width,h/bm.height);x.drawImage(bm,(w-bm.width*s)/2,(h-bm.height*s)/2,bm.width*s,bm.height*s);return new Uint8Array(await (await cv.convertToBlob({type:'image/webp',quality:.82})).arrayBuffer())}
  const files=[];for(const id of C)files.push({name:`c/${id}.webp`,data:await conv(`/cdn/img/champion/loading/${id}_0.jpg`,232,422)});
  for(const id of I)files.push({name:`i/${id}.webp`,data:await conv(`/cdn/${V}/img/item/${id}.png`,64,64)});
  const T=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;T[n]=c>>>0}
  const crc=d=>{let c=0xFFFFFFFF;for(let i=0;i<d.length;i++)c=T[(c^d[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
  const enc=new TextEncoder(),P=[],Cn=[];let off=0;
  for(const f of files){const nm=enc.encode(f.name),c=crc(f.data),sz=f.data.length,hd=new DataView(new ArrayBuffer(30));hd.setUint32(0,0x04034b50,true);hd.setUint16(4,20,true);hd.setUint32(14,c,true);hd.setUint32(18,sz,true);hd.setUint32(22,sz,true);hd.setUint16(26,nm.length,true);P.push(new Uint8Array(hd.buffer),nm,f.data);
    const e=new DataView(new ArrayBuffer(46));e.setUint32(0,0x02014b50,true);e.setUint16(4,20,true);e.setUint16(6,20,true);e.setUint32(16,c,true);e.setUint32(20,sz,true);e.setUint32(24,sz,true);e.setUint16(28,nm.length,true);e.setUint32(42,off,true);Cn.push(new Uint8Array(e.buffer),nm);off+=30+nm.length+sz}
  const cs=Cn.reduce((a,b)=>a+b.length,0),end=new DataView(new ArrayBuffer(22));end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,cs,true);end.setUint32(16,off,true);
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([...P,...Cn,new Uint8Array(end.buffer)],{type:'application/zip'}));a.download='riftmasters-images.zip';a.click();
}
// Étape 5 : dans un onglet ouvert sur https://universe.leagueoflegends.com/fr_fr/
async function etape5_regions(ids){
  const j=await fetch('https://universe-meeps.leagueoflegends.com/v1/fr_fr/search/index.json').then(r=>r.json());
  const norm=s=>s.normalize('NFD').replace(/[^a-zA-Z]/g,'').toLowerCase(),map={};
  for(const c of j.champions){map[norm(c.slug)]=c;map[norm(c.name)]=c}
  const alias={monkeyking:'wukong',nunu:'nunuwillump',renata:'renataglasc'};
  return ids.map(id=>{const k=norm(id),c=map[k]||map[alias[k]||''];return id+':'+((c&&c['associated-faction-slug'])||'unaffiliated')}).join(',');
}
