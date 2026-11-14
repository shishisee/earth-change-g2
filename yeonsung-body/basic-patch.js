/* =========================================================================
   연성이의 기초 탐험 · 세포를 살려라!
   원래 사이트(연성이의 몸 탐험, /app)의 화면·그림·스티커를 그대로 쓰고,
   그 위에 '세포호흡 중심' 공부 흐름을 얹는다. (활동지 '동물과 에너지' 내용 기준)
   순서: 0번 방(세포호흡) → 소화계 → 순환계 → 호흡계 → 배설계 → 최종 방
   방마다: 🔁 왜 배우지? · 🧩 스티커 · 📖 핵심 개념 · ❓ 왜 이렇게 생겼을까? · ✏️ 연습 · 🌱 정리
   화면 종류: note(개념 정리 카드) · choice · ox · tap · match · order · blanks(표 채우기 포함) · learn · fire · color
   색 규칙: 산소 많은 피 = 빨강, 산소 적은 피 = 파랑
   용어(중2 교과서): 작은창자·큰창자·숨관·숨관가지·허파꽈리·가로막·콩팥 단위·토리·보먼주머니·세뇨관
   ========================================================================= */
window.__BASIC = function () {
'use strict';
const RED='#FF4D5E', BLUE='#5B7BFF';
const LS={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const mix=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---------- 원래 사이트 손보기 (교과서 용어로) ---------- */
document.title='연성이의 기초 탐험';
const RENAME={'기관':'숨관','기관지':'숨관가지','횡격막':'가로막','소장':'작은창자','대장':'큰창자'};
['digest','resp'].forEach(k=>(SYS[k].organs||[]).forEach(o=>{ if(RENAME[o.name]) o.name=RENAME[o.name];
  if(o.hint) o.hint=k==='digest'?o.hint.replace(/소장/g,'작은창자').replace(/대장/g,'큰창자'):o.hint.replace('기관 끝','숨관 끝'); }));
SYS.cell={name:'0번 방 · 세포호흡이 뭐야?',em:'🔥',color:'#FF9DB8',mouth:true,organs:[],seq:[],sub:''};
SYS.fin={name:'최종 방',em:'🏆',color:'#FFD04D',mouth:true,organs:[],seq:[],sub:''};
document.head.insertAdjacentHTML('beforeend',`<style>
body{word-break:keep-all;overflow-wrap:normal;line-break:strict}
#scrSys.bmode #body{max-height:44vh;width:auto;margin:0 auto}
#scrSys.nostage .stage{display:none}
.tab.lockt{opacity:.45}
.why{background:#eef3ff;border:2px solid ${BLUE};border-radius:14px;padding:10px 12px;margin-top:12px;font-size:1.05rem;line-height:1.5}
.ans{background:#effbef;border:2px solid var(--green);border-radius:14px;padding:10px 12px;margin-top:10px;font-size:1.05rem;line-height:1.55}
.ana{background:#fff7d6;border:2px dashed #e8c55a;border-radius:14px;padding:10px 12px;margin-top:10px;font-size:1rem;line-height:1.5}
.txt{font-size:1.08rem;line-height:1.6;margin:0 0 6px}
.art{margin:4px 0 10px}.art svg{width:100%;height:auto;display:block}
.opts.one .pb{text-align:left;line-height:1.35}
.mcol{display:grid;grid-template-columns:1fr 1fr;gap:8px}.mcol .pb{font-size:.98rem;min-height:56px;line-height:1.3}
.pb.sel{--c:#FFF0A8}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.chips .pb{padding:8px 12px}.chips .pb.used{opacity:.25;pointer-events:none}
.slot{display:inline-block;min-width:66px;border-bottom:3px solid var(--line);text-align:center;color:var(--purple);padding:0 4px}
.slot.cur{background:#FFF0A8;border-radius:6px 6px 0 0}.slot.fill{color:#1f9a4a;min-width:0}
.sent{font-size:1.2rem;line-height:2.1}
.seq{min-height:52px;border:2px solid var(--line);border-radius:14px;padding:10px 12px;background:#faf8ff;line-height:1.7}
.fire{display:grid;grid-template-columns:1fr 1.1fr 1fr;gap:8px;align-items:center;text-align:center}
.fire .pb{padding:8px 4px}.fire .pb .e{font-size:2.2rem;display:block}.fire .pb.used{opacity:.3}
.pit{font-size:4.2rem;filter:grayscale(1);opacity:.4;transition:all .4s}.pit.on{filter:none;opacity:1;font-size:5.4rem}
.outs{display:grid;gap:8px;margin-top:10px}.outs div{border:2px solid var(--line);border-radius:14px;padding:8px 12px;background:#fff}
.legend{display:flex;gap:12px;flex-wrap:wrap;font-size:.95rem;margin:2px 0 8px}
.dotc{display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid var(--line);vertical-align:-2px;margin-right:4px}
.real{margin:0 0 8px}.real img,.real svg{width:100%;height:auto;display:block;border-radius:12px;border:2px solid #eee;background:#fff;margin-top:4px}.real figcaption{font-size:.8rem;color:var(--sub)}
.sysrow.lockr{opacity:.55}.sysrow .prog span.ok{background:var(--green);color:#fff}
.mapbox{overflow:auto;height:58vh;padding:0;width:100%;max-width:100%}#panel,#scr{min-width:0;max-width:100%}.mapbox svg{display:block}
.navg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.navg .pb{font-size:1rem}
.modal{position:fixed;inset:0;background:rgba(43,33,64,.45);display:grid;place-items:center;z-index:90;padding:16px}.modal .card{width:100%;max-width:420px;padding:18px}
table.tt{border-collapse:collapse;width:100%;font-size:.95rem;min-width:520px}.tt th,.tt td{border-bottom:1.5px solid #eee;padding:7px 6px;text-align:center;white-space:nowrap}
.tt th{font-weight:400;background:#FFF7D6}.tt td.l{text-align:left}.scroll{overflow-x:auto}
/* 개념 정리 카드 */
.note{background:#fff;border:2.5px solid var(--line);border-radius:16px;padding:12px 14px;font-size:1.04rem;line-height:1.6}
.note b,.ans b{background:linear-gradient(transparent 58%,#FFE58A 58%);font-weight:400}
.note p{margin:0 0 6px}.note p:last-child{margin:0}
.kv{display:grid;grid-template-columns:auto 1fr;gap:6px 10px;align-items:start}
.kv .k{background:var(--c,#FFF0A8);border:2px solid var(--line);border-radius:10px;padding:1px 8px;text-align:center;white-space:nowrap;font-size:.95rem}
.kv .v{padding-top:1px}
.rx{display:inline-flex;align-items:center;gap:4px;flex-wrap:wrap;margin:2px 0}
.rx span{border:2px solid var(--line);border-radius:999px;padding:0 8px;background:#fff;font-size:.95rem}
.rx i{font-style:normal;color:#C2577E;font-size:.9rem}
.tw{overflow-x:auto;max-width:100%;margin:2px 0}.nt{border-collapse:collapse;width:100%;font-size:.88rem;line-height:1.35}
.nt th{background:#FFF0A8;font-weight:400}.nt th,.nt td{border:2px solid var(--line);padding:4px 4px;text-align:center}
.nt td:first-child{background:#FAF8FF}
.ft{font-size:.92rem}.ft .slot{min-width:40px;font-size:.92rem;line-height:1.5}
.sent .nt{line-height:1.5}
.ox{display:grid;gap:8px}.ox .row{display:grid;grid-template-columns:1fr auto auto;gap:6px;align-items:center;border:2px solid var(--line);border-radius:14px;padding:8px 10px;background:#fff;line-height:1.4}
.ox .row .pb{padding:6px 12px;font-size:1.1rem}.ox .row.ok{background:#effbef}.ox .row .fix{grid-column:1/-1;font-size:.95rem;color:#1f6fbf}
.tip{font-size:.92rem;color:var(--sub);margin-top:8px}
</style>`);
document.querySelector('#scrLogin h2').textContent='연성이의 기초 탐험';
document.querySelector('#scrLogin p').textContent='반, 번호, 이름을 적고 세포를 살리러 출발!';
document.querySelector('.wrap').insertAdjacentHTML('beforeend','<section id="scrX" class="hidden"><div class="top"><button class="iconbtn" id="xBack" aria-label="홈으로">←</button><h1 id="xTitle"></h1></div><div id="xBody"></div></section>');
$('xBack').onclick=()=>goHome();
const showS=id=>{['scrLogin','scrHome','scrSys','scrX'].forEach(s=>$(s).classList.toggle('hidden',s!==id));scrollTo(0,0)};
window.show=showS;

/* ---------- 기록 (기기에 먼저 저장 → 하나씩 전송) ---------- */
let sending=false;
function flush(){ if(sending)return; const q=LS.get('yb-out',[]); if(!q.length)return; sending=true; const it=q[0];
  fetch('/api/basic',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(it),keepalive:true})
   .then(r=>{sending=false; if(r.ok||r.status===400){LS.set('yb-out',LS.get('yb-out',[]).filter(x=>x.id!==it.id)); flush();}}).catch(()=>{sending=false});}
function rec(p){ if(!student)return; const it=Object.assign({},student,p,{id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),at:Date.now()});
  const q=LS.get('yb-out',[]); q.push(it); LS.set('yb-out',q.slice(-300)); flush(); }
setInterval(flush,45000); addEventListener('online',flush); setTimeout(flush,1500);

/* ---------- 그림 (원래 사이트 그림체에 맞춘 작은 그림) ---------- */
const T=(x,y,s,o={})=>`<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" font-family="Jua" font-size="${o.s||15}" fill="${o.f||INK}">${s}</text>`;
const S=(vb,b)=>`<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${b}</svg>`;
const cellF=(cx,cy,r,sad)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFE3EC" stroke="${INK}" stroke-width="3"/><circle cx="${cx+r*.38}" cy="${cy-r*.36}" r="${r*.26}" fill="#C9B4FF" stroke="${INK}" stroke-width="2.4"/>
 <ellipse cx="${cx-r*.32}" cy="${cy}" rx="${r*.08}" ry="${r*.1}" fill="${INK}"/><ellipse cx="${cx+r*.14}" cy="${cy}" rx="${r*.08}" ry="${r*.1}" fill="${INK}"/>
 <path d="M${cx-r*.24} ${cy+r*(sad?.36:.24)} Q${cx-r*.09} ${cy+r*(sad?.2:.4)} ${cx+r*.06} ${cy+r*(sad?.36:.24)}" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
 <ellipse cx="${cx-r*.55}" cy="${cy+r*.2}" rx="${r*.12}" ry="${r*.07}" fill="#FF8FB1"/><ellipse cx="${cx+r*.36}" cy="${cy+r*.2}" rx="${r*.12}" ry="${r*.07}" fill="#FF8FB1"/>`;
function thumb(k,ids){ /* 원래 사이트 기관 그림을 작은 그림으로 */
  const s=document.createElementNS(NS,'svg'); s.style.cssText='position:absolute;left:-9999px;width:200px;height:200px'; document.body.appendChild(s);
  const g=el('g',{},s); ids.forEach(id=>{const o=SYS[k].organs.find(x=>x.id===id); if(o) drawOrgan(Object.assign({},o,{face:null}),g)});
  const b=g.getBBox(), p=8; s.setAttribute('viewBox',`${b.x-p} ${b.y-p} ${b.width+p*2} ${b.height+p*2}`); s.removeAttribute('style'); s.remove(); return s.outerHTML; }
function dollHTML(w){ const d=dollSvg(w); return d.outerHTML; }
const tube=(x,fill,lab,sub)=>`<path d="M${x-22} 20 L${x-22} 118 Q${x-22} 140 ${x} 140 Q${x+22} 140 ${x+22} 118 L${x+22} 20" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M${x-19} 66 L${x-19} 118 Q${x-19} 137 ${x} 137 Q${x+19} 137 ${x+19} 118 L${x+19} 66 Z" fill="${fill}"/>${T(x,162,lab,{s:15})}${T(x,180,sub,{s:12,f:'#6e6488'})}`;
const ART={
 zoom:()=>`<div style="display:flex;align-items:center;gap:8px">${dollHTML(90)}<div style="font-size:1.6rem">🔍➡</div>${S('0 0 170 150',[0,1,2,3,4,5].map(i=>cellF(32+(i%3)*53,38+Math.floor(i/3)*70,24)).join(''))}</div>`,
 glucose:()=>{const hx=(x,y)=>`<polygon points="${[0,1,2,3,4,5].map(k=>{const a=Math.PI/3*k+Math.PI/6;return (x+13*Math.cos(a)).toFixed(1)+','+(y+13*Math.sin(a)).toFixed(1)}).join(' ')}" fill="#FFD04D" stroke="${INK}" stroke-width="2.4"/>`;
  return S('0 0 340 150',`${T(40,34,'🍚',{s:34})}${T(40,64,'밥(녹말)',{s:14})}${[0,1,2,3,4,5].map(i=>hx(104+i*25,36)).join('')}${T(168,72,'포도당이 줄줄이 이어진 큰 분자',{s:14})}${T(168,98,'소화 → 세포막을 통과하는 작은 분자로',{s:14})}${[0,1,2,3,4,5].map(i=>hx(60+i*44,128)).join('')}`)},
 air:()=>S('0 0 340 120',`${T(56,72,'😮‍💨',{s:52})}${[0,1,2,3,4].map(i=>`<circle cx="${130+i*40}" cy="${44+(i%2)*28}" r="16" fill="#BDEBFF" stroke="${INK}" stroke-width="2.4"/>${T(130+i*40,49+(i%2)*28,'산소',{s:11})}`).join('')}`),
 fourMap:()=>`<div style="display:grid;grid-template-columns:1fr 1.1fr 1fr;gap:6px;align-items:center;text-align:center;font-size:.92rem">
  <div></div><div><div style="height:58px">${thumb('digest',['stomach'])}</div>소화계<br><span class="sub" style="font-size:.8rem">영양소 흡수</span></div><div></div>
  <div><div style="height:58px">${thumb('resp',['lungL','lungR'])}</div>호흡계<br><span class="sub" style="font-size:.8rem">산소 ↔ 이산화 탄소</span></div>
  <div>${S('0 0 120 120',cellF(60,60,46))}</div>
  <div><div style="height:58px">${thumb('circ',['ra','la','rv','lv'])}</div>순환계<br><span class="sub" style="font-size:.8rem">세포까지 운반</span></div>
  <div></div><div><div style="height:58px">${thumb('excr',['kidL','kidR'])}</div>배설계<br><span class="sub" style="font-size:.8rem">요소 내보내기</span></div><div></div></div>`,
 hungry:()=>`<div style="display:flex;align-items:center;justify-content:space-around">${S('0 0 80 80',T(40,52,'🍚',{s:46}))}<div style="font-size:1.4rem">➡ ❓ ➡</div>${S('0 0 110 110',cellF(55,55,42,1))}</div>`,
 waste:()=>`<div style="display:flex;align-items:center;justify-content:space-around">${S('0 0 110 110',cellF(55,55,42))}<div style="font-size:1.6rem">➡</div><div style="line-height:1.7;font-size:1rem">💨 이산화 탄소<br>💧 물<br>⚠️ <b>암모니아</b></div></div>`,
 delivery:()=>`<div style="display:flex;justify-content:space-around;text-align:center;font-size:1rem"><div><div style="height:56px">${thumb('circ',['ra','la','rv','lv'])}</div>심장<br><span class="sub" style="font-size:.85rem">펌프</span></div><div><div style="font-size:2.6rem;height:56px">🛣️</div>혈관<br><span class="sub" style="font-size:.85rem">길</span></div><div><div style="font-size:2.6rem;height:56px">🩸</div>혈액<br><span class="sub" style="font-size:.85rem">싣고 가는 것</span></div></div>`,
 vessels:(hl)=>{const op=k=>hl&&hl!==k?'opacity=".3"':'';
  return S('0 0 330 190',`<g ${op('a')}><circle cx="58" cy="70" r="44" fill="${RED}" stroke="${INK}" stroke-width="3"/><circle cx="58" cy="70" r="17" fill="#FFD3D7" stroke="${INK}" stroke-width="2.4"/>${T(58,136,'동맥',{s:18})}${T(58,156,'벽이 두껍고',{s:12})}${T(58,172,'탄력 있음',{s:12})}</g>
  <g ${op('v')}><circle cx="166" cy="70" r="44" fill="${BLUE}" stroke="${INK}" stroke-width="3"/><circle cx="166" cy="70" r="36" fill="#D6DEFF" stroke="${INK}" stroke-width="2.4"/><path d="M138 52 Q156 70 160 92 M194 52 Q176 70 172 92" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>${T(166,136,'정맥',{s:18})}${T(166,156,'벽이 얇고',{s:12})}${T(166,172,'판막이 있음',{s:12})}</g>
  <g ${op('c')}>${Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2;return `<circle cx="${(274+22*Math.cos(a)).toFixed(1)}" cy="${(70+22*Math.sin(a)).toFixed(1)}" r="7.5" fill="#FFE3EC" stroke="${INK}" stroke-width="2"/>`}).join('')}<ellipse cx="274" cy="70" rx="8" ry="6" fill="${RED}" stroke="${INK}" stroke-width="1.6"/>${T(274,136,'모세혈관',{s:18})}${T(274,156,'벽이 세포 한 겹',{s:12})}${T(274,172,'아주 가늘어',{s:12})}</g>`)},
 /* 침의 소화 작용 실험 (교과서 210쪽) */
 spit:()=>S('0 0 340 190',`${tube(80,'#F4E3B0','A 녹말 + 침','아이오딘 반응 → 색 변화 없음')}${tube(250,'#3B3F8F','B 녹말 + 증류수','아이오딘 반응 → 청람색')}${T(165,60,'35~40 ℃',{s:14,f:'#C2577E'})}${T(165,80,'(체온)',{s:12,f:'#6e6488'})}`),
 /* 혈관에 따른 혈압 · 총 단면적 · 혈류 속도 (활동지 [자료 2]) */
 graph:(q)=>{const P=[['혈압',[.92,.4,.08],RED],['총 단면적',[.12,.95,.3],'#2E9E4B'],['혈류 속도',[.9,.08,.45],BLUE]], ord=q?[1,2,0]:[0,1,2], AB=['A','B','C'];
  return S('0 0 340 170',ord.map((pi,i)=>{const [n,v,c]=P[pi],x0=12+i*111,w=96,y0=20,h=104;
   const pts=v.map((t,j)=>`${(x0+12+j*36).toFixed(0)},${(y0+h-t*h).toFixed(0)}`).join(' ');
   return `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="8" fill="#FAF8FF" stroke="${INK}" stroke-width="2"/><polyline points="${pts}" fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>${v.map((t,j)=>`<circle cx="${x0+12+j*36}" cy="${(y0+h-t*h).toFixed(0)}" r="4.5" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`).join('')}
    ${T(x0+12,y0+h+16,'동맥',{s:11})}${T(x0+48,y0+h+16,'모세',{s:11})}${T(x0+84,y0+h+16,'정맥',{s:11})}${T(x0+w/2,y0+h+36,q?AB[i]:n,{s:15})}`}).join(''))},
 /* 호흡 운동 모형: 페트병·빨대·고무풍선·고무막 */
 model:()=>{const one=(x,pull)=>{const r=pull?20:12, my=pull?150:130;
   return `<path d="M${x-48} 40 L${x-48} 130 M${x+48} 40 L${x+48} 130" stroke="${INK}" stroke-width="3" fill="none"/><path d="M${x-48} 40 Q${x-48} 26 ${x-20} 22 L${x+20} 22 Q${x+48} 26 ${x+48} 40" stroke="${INK}" stroke-width="3" fill="#F2FAFF"/>
    <path d="M${x} 6 L${x} 58 M${x} 58 L${x-18} 76 M${x} 58 L${x+18} 76" stroke="#7CC4F5" stroke-width="6" stroke-linecap="round" fill="none"/>
    <circle cx="${x-20}" cy="${78+r*.6}" r="${r}" fill="#FF9EBB" stroke="${INK}" stroke-width="2.5"/><circle cx="${x+20}" cy="${78+r*.6}" r="${r}" fill="#FF9EBB" stroke="${INK}" stroke-width="2.5"/>
    <path d="M${x-48} 130 Q${x} ${my} ${x+48} 130" stroke="#E5304A" stroke-width="5" fill="none"/>${pull?`<path d="M${x} ${my-2} L${x} ${my+16}" stroke="${INK}" stroke-width="3" marker-end="url(#ma)"/>`:''}
    ${T(x,190,pull?'고무막을 당기면':'처음',{s:14})}${T(x,208,pull?'→ 풍선이 부풀어':'',{s:12,f:'#6e6488'})}`};
  return S('0 0 340 215',`<defs><marker id="ma" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="${INK}"/></marker></defs>${one(80,0)}${one(250,1)}`)}
};
const IMG='https://yeonsung-img.vercel.app/';
/* 교과서식 그림: SVG를 받아서 이름표를 중2 교과서 용어로 바꿔 끼움 (실패하면 PNG 그대로) */
const RELABEL={'소장':'작은창자','대장':'큰창자','소장 안쪽 벽':'작은창자 안쪽 벽','기관':'숨관','기관지':'숨관가지','횡격막':'가로막','네프론':'콩팥 단위','콩팥단위':'콩팥 단위','폐포':'허파꽈리',
 '콩팥단위 = 토리 + 보먼주머니 + 세뇨관':'콩팥 단위 = 토리 + 보먼주머니 + 세뇨관'};
const svgCache={};
const imgOf=n=>`<figure class="real" data-svg="${n}"><img src="${IMG}${n}.png" alt="" loading="lazy" onerror="this.dataset.bad=1;this.style.display='none'"></figure>`;
function upgradeImgs(box){ box.querySelectorAll('figure[data-svg]').forEach(f=>{ const n=f.dataset.svg;
  (svgCache[n]||(svgCache[n]=fetch(IMG+n+'.svg').then(r=>r.ok?r.text():Promise.reject()))).then(t=>{
    const d=new DOMParser().parseFromString(t,'image/svg+xml'), s=d.documentElement; if(!s||s.nodeName!=='svg') return;
    s.querySelectorAll('text').forEach(x=>{ const v=x.textContent.trim(); if(RELABEL[v]) x.textContent=RELABEL[v]; });
    s.removeAttribute('width'); s.removeAttribute('height'); if(f.isConnected){ const im=f.querySelector('img'); if(im) im.replaceWith(document.importNode(s,true)); }
  }).catch(()=>{ const im=f.querySelector('img'); if(im&&im.dataset.bad) f.remove(); else if(im) im.addEventListener('error',()=>f.remove()); }); }); }
const REAL={
 heart:{src:IMG+'heart.png',cap:'심장 단면 · 흰 화살표 = 피가 흐르는 방향'},
 vessels:{src:IMG+'vessels.png',cap:'동맥 · 정맥 · 모세혈관의 단면'}
};

/* ---------- 글쓰기 도우미 ---------- */
const KV=rows=>`<div class="kv">${rows.map(r=>`<div class="k" ${r[2]?`style="--c:${r[2]}"`:''}>${r[0]}</div><div class="v">${r[1]}</div>`).join('')}</div>`;
const RX=(a,e,b)=>`<span class="rx"><span>${a}</span><i>${e?e+' ':''}→</i><span>${b}</span></span>`;
const TB=(head,rows)=>`<div class="tw"><table class="nt"><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
/* 빈칸 표: 칸에 {g:'이름'} 을 넣으면 빈칸이 됨 → blanks 의 parts 로 씀 */
const FT=(head,rows)=>{ const p=['<div class="tw"><table class="nt ft"><tr>'+head.map(h=>`<th>${h}</th>`).join('')+'</tr>']; rows.forEach(r=>{ p.push('<tr>'); r.forEach(c=>{ p.push('<td>',...[].concat(c),'</td>'); }); p.push('</tr>'); }); p.push('</table></div>'); return p; };
const EQ='<b>포도당(영양소) + 산소 → 에너지 + 이산화 탄소 + 물</b>';

/* ---------- 방과 내용: basic-rooms.js ---------- */
const ROOMS=window.__BASIC_ROOMS({RED,BLUE,KV,RX,TB,FT,EQ});
const ORDERB=['cell','digest','circ','resp','excr','fin'];
const em=k=>SYS[k].em, colr=k=>SYS[k].color;

/* ---------- 진도 ---------- */
let prog=LS.get('yb-prog2',{});
const isT=()=>LS.get('yb-teacher',false)===true;
const tabDone=(k,t)=>!!(prog[k]&&prog[k][t]);
const roomDone=k=>!!ROOMS[k].tabs&&ROOMS[k].tabs.every(t=>tabDone(k,t.id));
/* 예전에 방을 끝낸 학생(마지막 단계 완료)은 새 단계가 생겨도 다음 방이 열려 있게 */
const roomPassed=k=>roomDone(k)||tabDone(k,ROOMS[k].tabs[ROOMS[k].tabs.length-1].id);
const roomOpen=k=>{ if(isT()) return true; const i=ORDERB.indexOf(k); return i===0||roomPassed(ORDERB[i-1]); };
const tabOpen=(k,i)=>isT()||i===0||tabDone(k,ROOMS[k].tabs[i-1].id)||tabDone(k,ROOMS[k].tabs[i].id);
function markTab(k,t){ prog[k]=prog[k]||{}; prog[k][t]=true; LS.set('yb-prog2',prog); }

/* ---------- 첫 화면 ---------- */
window.goHome=function(){
  if(!student) return goLogin();
  const who=`${student.cls}|${student.num}|${student.name}`, was=LS.get('yb-who','');
  if(was&&was!==who){ prog={}; mapDone={}; LS.set('yb-prog2',prog); LS.set('yb-map',mapDone); }
  LS.set('yb-who',who);
  $('who').innerHTML=`${esc(student.cls)}반 ${esc(student.num)}번 ${esc(student.name)}<button id="chg">바꾸기</button><button id="tchB" aria-label="교사">${isT()?'🔓':'🔒'}</button>`;
  $('chg').onclick=goLogin; $('tchB').onclick=teacherPrompt;
  document.querySelector('#scrHome .top h1').textContent='연성이의 기초 탐험';
  $('homeDoll').innerHTML=''; $('homeDoll').appendChild(dollSvg(84));
  const r0=roomDone('cell'), rf=roomDone('fin');
  document.querySelector('#scrHome .bubble').innerHTML=rf?'🏆 <b>기초 탐험 박사</b>!<br>세포를 모두 살렸어!':r0?'내 몸의 <b>세포</b>를 살려 줘!<br>소화계부터 차례로 탐험해 봐 👇':'내 몸의 <b>세포</b>를 살려 줘!<br><b>0번 방</b>부터 시작해 봐 👇';
  $('sysList').innerHTML=ORDERB.map(k=>{const R=ROOMS[k],open=roomOpen(k),done=roomDone(k);
    const n=R.tabs?R.tabs.filter(t=>tabDone(k,t.id)).length:0;
    const chip=done?'<span class="ok">✓ 완료</span>':open?`<span>${n} / ${R.tabs.length}</span>`:'<span>🔒</span>';
    const name=k==='cell'?'0번 방':SYS[k].name;
    return `<button class="card sysrow ${open?'':'lockr'}" style="--c:${colr(k)}" data-k="${k}"><span class="em">${em(k)}</span><span class="txt"><b>${name}</b><small>${R.sub}</small></span><span class="prog">${chip}</span><span class="arrow">›</span></button>`}).join('')+
   (isT()?`<button class="card sysrow" style="--c:#E6DCFF" id="goT"><span class="em">🧑‍🏫</span><span class="txt"><b>교사 페이지</b><small>학생 진도 · 많이 틀린 문제</small></span><span class="arrow">›</span></button>`:'');
  document.querySelectorAll('.sysrow[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;
    if(!roomOpen(k)){shakeEl(b);toast(`${ROOMS[ORDERB[ORDERB.indexOf(k)-1]].short}부터 끝내야 열려! 🔒`);return}
    openSys(k)});
  if($('goT')) $('goT').onclick=vTeacher;
  showS('scrHome');
};

/* ---------- 방 열기 · 탭 ---------- */
window.openSys=function(k){
  curKey=k; cur=SYS[k]; placed=new Set(); $('stamp').classList.remove('on');
  $('sysTitle').textContent=k==='cell'?'🔥 0번 방 · 세포호흡이 뭐야?':k==='fin'?'🏆 최종 방 · 세포를 살려라!':`${cur.em} ${cur.name}`;
  paintTabs(); buildSvg(); showS('scrSys');
  $('scrSys').classList.toggle('nostage',k==='cell'||k==='fin');
  const R=ROOMS[k], first=R.tabs.findIndex(t=>!tabDone(k,t.id));
  setMode(R.tabs[first<0?0:first].id);
};
function paintTabs(){
  const R=ROOMS[curKey];
  $('tabs').innerHTML=R.tabs.map((t,i)=>`<button class="tab ${tabOpen(curKey,i)?'':'lockt'}" role="tab" data-mode="${t.id}">${tabDone(curKey,t.id)?'✓ ':''}${t.name}</button>`).join('');
  $('tabs').classList.remove('hidden');
  document.querySelectorAll('#tabs .tab').forEach((b,i)=>{ b.setAttribute('aria-selected',b.dataset.mode===mode); b.onclick=()=>{ if(!tabOpen(curKey,i)){shakeEl(b);toast('앞 단계부터 해 봐!');return} setMode(b.dataset.mode)}});
}
window.setMode=function(m){
  stopAll(); mode=m; $('stamp').classList.remove('on');
  document.querySelectorAll('#tabs .tab').forEach(t=>t.setAttribute('aria-selected',t.dataset.mode===m));
  $('rail').classList.toggle('hidden',m!=='stick'); $('stageIn').classList.toggle('rail-on',m==='stick');
  $('scrSys').classList.toggle('bmode',m!=='stick');
  setLayers(false); renderBody(); svg.classList.remove('spotting');
  if(m==='stick') stickMode(); else runTab(m);
};
const nextTab=()=>{ const R=ROOMS[curKey], i=R.tabs.findIndex(t=>t.id===mode); return R.tabs[i+1]; };
function tabFinished(right,total,wrong,sec){
  const R=ROOMS[curKey], t=R.tabs.find(x=>x.id===mode);
  markTab(curKey,mode); paintTabs();
  rec({type:'step',room:curKey,step:R.tabs.indexOf(t),title:t.name,right,total,wrong,sec});
  const nx=nextTab(), last=!nx;
  if(last){ stampOn(curKey==='fin'?'기초 탐험<br>박사':`${R.short}<br>박사`); confetti(); }
  const after=ORDERB[ORDERB.indexOf(curKey)+1];
  $('panel').innerHTML=`<div class="center"><div class="big">${last?'🏅':'⭐'}</div><p class="q">${last?`${R.short} 완료!`:'단계 완료!'}</p>
   <p class="sub">${total?`문제 ${total}개 중 ${right}개를 한 번에 맞혔어!`:'잘했어!'}</p>
   ${last?(after?`<button class="pb main full" id="goNextR">${em(after)} ${ROOMS[after].short}${after==='fin'?'':' 방'}으로 →</button>`:`<p class="q">🏆 세포를 모두 살렸어!</p><button class="pb main full" id="goHomeB">🏠 처음 화면으로</button>`)
     :`<button class="pb main full" id="goNextT">다음: ${nx.name} →</button>`}</div>`;
  if($('goNextT')) $('goNextT').onclick=()=>setMode(nx.id);
  if($('goHomeB')) $('goHomeB').onclick=goHome;
  if($('goNextR')) $('goNextR').onclick=()=>openSys(after);
}

/* 원래 스티커 활동 그대로 · 끝나면 다음 단계로 */
const origStickPanel=window.stickPanel;
window.stickPanel=function(msg){ origStickPanel(msg); const b=$('next1'); if(b){ const nx=nextTab(); b.textContent=nx?`다음: ${nx.name} →`:'다음 →'; b.onclick=()=>nx?setMode(nx.id):goHome(); } };
window.record=function(p){ if(p&&p.mode==='스티커'&&ROOMS[curKey]){ const R=ROOMS[curKey], i=R.tabs.findIndex(t=>t.id==='stick'); markTab(curKey,'stick'); paintTabs();
  rec({type:'step',room:curKey,step:i,title:'🧩 스티커',right:Math.max(0,(p.total||0)-(p.score||0)),total:p.total||0,wrong:p.score?[`스티커 붙이기 실수 ${p.score}번`]:[],sec:p.sec||0}); } };
window.saveProg=function(){};

/* ---------- 단계 진행 ---------- */
let P=null;
function runTab(id){ const t=ROOMS[curKey].tabs.find(x=>x.id===id); P={t,idx:0,qs:0,ok:0,wrong:[],t0:Date.now(),run:runId}; drawScr(); }
function drawScr(){
  const sc=P.t.screens[P.idx], n=P.t.screens.length; P.miss=false; P.done=false; P.tap=null;
  svg.classList.remove('spotting'); document.querySelectorAll('#placed > g').forEach(g=>g.classList.remove('spot'));
  if(sc.color) {}
  renderBody();
  if(sc.spot){ svg.classList.add('spotting'); spot(sc.spot,true); }
  $('panel').innerHTML=`<div class="row"><span class="chip on">${P.t.name}</span><span class="chip">${P.idx+1} / ${n}</span></div><div class="bar"><i style="width:${Math.round(P.idx/n*100)}%"></i></div><div id="scr"></div><button class="pb main full" id="bnext" style="margin-top:14px" disabled>다음 →</button>`;
  $('bnext').onclick=()=>{ if(P.idx<P.t.screens.length-1){P.idx++;drawScr();} else tabFinished(P.ok,P.qs,P.wrong,Math.round((Date.now()-P.t0)/1000)); };
  (SC[sc.s]||SC.info)($('scr'),sc); upgradeImgs($('scr'));
  if(innerWidth<860 && curKey!=='cell' && curKey!=='fin'){ const st=document.querySelector('#scrSys .stage'); if(st) scrollTo({top:st.offsetTop-60,behavior:'smooth'}); }
}
const canNext=()=>{const b=$('bnext'); if(b){b.disabled=false; b.classList.add('boing');}};
const artOf=sc=>(sc.art?`<div class="art">${ART[sc.art](sc.artOpt)}</div>`:'')+(sc.img?imgOf(sc.img):'')+(sc.html?`<div class="art">${sc.html}</div>`:'');
function solved(box,sc){ if(P.done)return; P.done=true; P.qs++; if(!P.miss)P.ok++; else P.wrong.push((sc.q||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,70));
  const msg=[P.miss&&sc.why?sc.why:'',sc.end||''].filter(Boolean).join('<br><br>');
  if(msg) box.insertAdjacentHTML('beforeend',`<div class="why boing"><b>${P.miss?'👍 이제 알겠지?':'🎉 정답!'}</b><br>${msg}</div>`); else fb(P.miss?'👍 이제 알겠지?':'🎉 정답!',true);
  canNext(); }
const SC={};
SC.info=(box,sc)=>{ box.innerHTML=`${sc.tag?`<span class="chip">${sc.tag}</span>`:''}<p class="q">${sc.title||''}</p>${artOf(sc)}<p class="txt">${sc.text||''}</p>`; canNext(); };
SC.note=(box,sc)=>{ box.innerHTML=`<span class="chip">${sc.tag||'📖 개념'}</span><p class="q">${sc.title||''}</p>${artOf(sc)}<div class="note">${sc.body||''}</div>`; canNext(); };
SC.ox=(box,sc)=>{ let left=sc.items.length;
  box.innerHTML=`<span class="chip">${sc.tag||'⭕ O / X'}</span><p class="q">${sc.q}</p><div class="ox">${sc.items.map((it,j)=>`<div class="row" data-j="${j}"><span>${it[0]}</span><button class="pb" data-v="1">O</button><button class="pb" data-v="0">X</button></div>`).join('')}</div><p class="fb" id="fb"></p>`;
  box.querySelectorAll('.ox .row').forEach(row=>{ const it=sc.items[+row.dataset.j];
    row.querySelectorAll('.pb').forEach(b=>b.onclick=()=>{ if(row.classList.contains('ok'))return;
      if(+b.dataset.v===(it[1]?1:0)){ row.classList.add('ok'); b.classList.add('right'); row.querySelectorAll('.pb').forEach(x=>x.disabled=true);
        if(row.dataset.miss&&it[2]) row.insertAdjacentHTML('beforeend',`<div class="fix">👉 ${it[2]}</div>`); if(--left===0) solved(box,sc); }
      else { P.miss=true; row.dataset.miss=1; b.classList.add('wrong'); b.disabled=true; shakeEl(row); fb('다시 생각해 봐!',false); } }); }); };
SC.learn=(box,sc)=>{ box.innerHTML=`<span class="chip">❓ 왜일까?</span><p class="q">${sc.q}</p>${artOf(sc)}<button class="pb full" id="rv" style="--c:#FFF0A8">🤔 생각해 봤어! 설명 보기</button><div id="rvb" hidden>${sc.ana?`<div class="ana">${sc.ana}</div>`:''}<div class="ans"><b>✅ 그래서!</b><br>${sc.ans}</div>${sc.real?`<button class="pb" style="margin-top:10px" id="realB">📷 진짜 모습 보기</button><figure class="real" id="realF" hidden style="margin:0"><img alt=""><figcaption></figcaption></figure>`:''}</div>`;
  $('rv').onclick=()=>{ $('rv').remove(); $('rvb').hidden=false; canNext();
    const rb=$('realB'); if(rb) rb.onclick=()=>{ const r=REAL[sc.real],f=$('realF'),im=f.querySelector('img'); im.onerror=()=>{f.hidden=true;rb.hidden=true;toast('그림을 불러오지 못했어')}; im.src=r.src; f.querySelector('figcaption').textContent=r.cap; f.hidden=false; rb.hidden=true; }; }; };
SC.choice=(box,sc)=>{ const o=mix(sc.opts.map((t,j)=>({t,ok:j===0})));
  box.innerHTML=`<span class="chip">${sc.tag||'✏️ 바로 확인'}</span><p class="q">${sc.q}</p>${artOf(sc)}<div class="opts one">${o.map((x,j)=>`<button class="pb" data-j="${j}">${x.t}</button>`).join('')}</div><p class="fb" id="fb"></p>`;
  box.querySelectorAll('.opts .pb').forEach(b=>b.onclick=()=>{ if(P.done)return; const x=o[+b.dataset.j];
    if(x.ok){ b.classList.add('right'); solved(box,sc); } else { P.miss=true; b.classList.add('wrong'); b.disabled=true; shakeEl(b); fb('다시 골라 봐!',false); } }); };
SC.tap=(box,sc)=>{ box.innerHTML=`<span class="chip">${sc.tag||'👆 콕 찾기'}</span><p class="q">${sc.q}</p><p class="sub">위의 연성이 몸 그림에서 눌러 봐!</p><p class="fb" id="fb"></p>`;
  P.tap=pt=>{ if(P.done)return; const id=hitAt(pt,cur.organs,10); if(!id)return;
    if([].concat(sc.ans).includes(id)){ spot([].concat(sc.ans),true); svg.classList.add('spotting'); solved(box,sc); } else { P.miss=true; fb(`그건 ${nameOf(id)}이야! 다시 찾아봐.`,false); } }; };
SC.match=(box,sc)=>{ const L=mix(sc.pairs.map((p,j)=>({t:p[0],j}))), R=mix(sc.pairs.map((p,j)=>({t:p[1],j}))); let sel=null,left=sc.pairs.length;
  box.innerHTML=`<span class="chip">${sc.tag||'🔗 짝 맞추기'}</span><p class="q">${sc.q}</p>${artOf(sc)}<div class="mcol"><div class="opts one" style="gap:8px">${L.map(o=>`<button class="pb" data-s="L" data-j="${o.j}">${o.t}</button>`).join('')}</div><div class="opts one" style="gap:8px">${R.map(o=>`<button class="pb" data-s="R" data-j="${o.j}">${o.t}</button>`).join('')}</div></div><p class="fb" id="fb"></p>`;
  box.querySelectorAll('.mcol .pb').forEach(b=>b.onclick=()=>{ if(b.classList.contains('right'))return;
    if(b.dataset.s==='L'){ box.querySelectorAll('[data-s=L]').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); sel=b; return; }
    if(!sel){ toast('왼쪽부터 골라!'); return; }
    if(sel.dataset.j===b.dataset.j){ sel.classList.remove('sel'); sel.classList.add('right'); b.classList.add('right'); sel=null; if(--left===0) solved(box,sc); }
    else { P.miss=true; shakeEl(b); shakeEl(sel); fb('짝이 아니야. 다시!',false); } }); };
SC.order=(box,sc)=>{ const it=mix(sc.items); let n=0;
  box.innerHTML=`<span class="chip">${sc.tag||'➡️ 순서대로'}</span><p class="q">${sc.q}</p>${artOf(sc)}<div class="seq" id="seq"><span class="sub">여기에 차례로 쌓여</span></div><div class="chips">${it.map(t=>`<button class="pb">${t}</button>`).join('')}</div><p class="fb" id="fb"></p>`;
  box.querySelectorAll('.chips .pb').forEach(b=>b.onclick=()=>{ if(b.textContent===sc.items[n]){ if(n===0)$('seq').innerHTML=''; $('seq').innerHTML+=(n?' → ':'')+`<b>${b.textContent}</b>`; b.classList.add('used'); if(++n===sc.items.length) solved(box,sc); }
    else { P.miss=true; shakeEl(b); fb(n===0?'어디서 출발할까?':`${sc.items[n-1]} 다음은?`,false); } }); };
SC.blanks=(box,sc)=>{ const slots=[], used={};
  box.innerHTML=`<span class="chip">${sc.tag||'🧩 빈칸 채우기'}</span><p class="q">${sc.q}</p>${artOf(sc)}<div class="sent">${sc.parts.map(p=>typeof p==='string'?p:(slots.push({g:p.g,v:null}),`<span class="slot" data-s="${slots.length-1}">?</span>`)).join('')}</div><div class="chips">${mix(sc.pool).map(t=>`<button class="pb">${t}</button>`).join('')}</div><p class="fb" id="fb"></p>`;
  const cur_=()=>slots.findIndex(s=>!s.v), mark=()=>box.querySelectorAll('.slot').forEach((e,j)=>e.classList.toggle('cur',j===cur_())); mark();
  box.querySelectorAll('.chips .pb').forEach(b=>b.onclick=()=>{ const c=cur_(); if(c<0)return; const t=b.textContent, s=slots[c];
    if(sc.groups[s.g].includes(t)&&!(sc.groups[s.g].length>1&&used[s.g+t])){ used[s.g+t]=1; s.v=t; const e=box.querySelector(`[data-s="${c}"]`); e.textContent=t; e.classList.add('fill'); b.classList.add('used'); mark(); if(cur_()<0) solved(box,sc); }
    else { P.miss=true; shakeEl(b); } }); };
SC.fire=box=>{ const inn={};
  box.innerHTML=`<span class="chip">🔥 모닥불 실험</span><p class="q">모닥불을 피워 보자!<br>재료 두 개를 눌러 넣어 봐.</p><div class="fire"><button class="pb" data-k="g"><span class="e">🪵</span>장작<br><small>= 포도당</small></button><div class="pit" id="pit">🔥</div><button class="pb" data-k="o"><span class="e">🌬️</span>공기<br><small>= 산소</small></button></div><div id="fo"></div>`;
  box.querySelectorAll('.fire .pb').forEach(b=>b.onclick=()=>{ if(inn[b.dataset.k])return; inn[b.dataset.k]=1; b.classList.add('used');
    if(inn.g&&inn.o){ $('pit').classList.add('on'); $('fo').innerHTML=`<div class="outs"><div>⚡ <b>열과 빛</b> → 세포에서는 <b>에너지</b></div><div>💨 <b>연기</b> → 세포에서는 <b>이산화 탄소</b></div><div>💧 <b>수증기</b> → 세포에서는 <b>물</b></div></div><div class="ans"><b>이게 바로 세포호흡!</b><br>세포도 포도당을 산소로 '태워서'<br>에너지를 꺼내.<br>다만 불꽃 없이 아주 천천히 일어나서<br>우리 몸이 타지는 않아.</div>`; canNext(); }
    else toast('하나 더 넣어 봐!'); }); };
SC.color=(box,sc)=>{ const st={}, parts=Object.keys(sc.ans), gray='#E2DDEB';
  const paint=()=>parts.forEach(id=>{ const o=cur.organs.find(x=>x.id===id), h=holders[id], c=st[id]==='r'?RED:st[id]==='b'?BLUE:gray; if(!o||!h)return; h.innerHTML=''; drawOrgan(Object.assign({},o,{face:null,color:c}),h);
    const cb=box.querySelector(`[data-p="${id}"]`); if(cb){ cb.style.setProperty('--c',st[id]?c:'#fff'); cb.style.color=st[id]?'#fff':''; } });
  const tog=id=>{ if(P.done)return; st[id]=st[id]==='r'?'b':'r'; paint(); };
  box.innerHTML=`<span class="chip">🎨 피 색칠</span><p class="q">${sc.q}</p><div class="legend"><span><i class="dotc" style="background:${RED}"></i>산소 많은 피</span><span><i class="dotc" style="background:${BLUE}"></i>산소 적은 피</span></div><p class="sub">몸 그림이나 아래 이름을 눌러 봐.<br>한 번 누르면 빨강, 또 누르면 파랑이야.</p><div class="chips" style="margin-bottom:12px">${parts.map(id=>`<button class="pb" data-p="${id}">${nameOf(id)}</button>`).join('')}</div><button class="pb full" id="chk" style="--c:#FFF0A8">다 칠했어! 확인</button><p class="fb" id="fb"></p>`;
  paint(); box.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>tog(b.dataset.p));
  P.tap=pt=>{ const id=hitAt(pt,cur.organs.filter(o=>parts.includes(o.id)),12); if(id) tog(id); };
  $('chk').onclick=()=>{ if(P.done)return; const bad=parts.filter(p=>st[p]!==sc.ans[p]);
    if(!bad.length){ $('chk').remove(); solved(box,Object.assign({},sc,{why:'완벽해! 폐에 다녀와서 산소를 가득 실은 피는<br><b>폐정맥 → 좌심방 → 좌심실 → 대동맥</b>(빨강),<br>온몸에 산소를 주고 온 피는<br><b>대정맥 → 우심방 → 우심실 → 폐동맥</b>(파랑)이야.'})); }
    else { P.miss=true; fb(`아직 ${bad.length}곳이 달라. 힌트: 폐에서 산소를 받아 온 피는 폐정맥으로 들어와!`,false); } }; };
svg.addEventListener('click',e=>{ if(P&&P.tap&&mode!=='stick') P.tap(toSvg(e.clientX,e.clientY)); });

/* ---------- 마인드맵 (최종 방에서만 완성) ---------- */
const MAP=[
 {id:'root',label:'세포호흡'},
 {id:'mat',p:'root',label:'재료',room:'cell',fixed:1},
 {id:'glu',p:'mat',label:'포도당',room:'cell',hint:'재료 ① — 음식 속 영양소가 소화되어 생겨',opts:['포도당','요소','소금']},
 {id:'oxy',p:'mat',label:'산소',room:'cell',hint:'재료 ② — 숨 쉴 때 들어와',opts:['산소','이산화 탄소','질소']},
 {id:'get',p:'root',label:'얻는 것',room:'cell',fixed:1},
 {id:'ene',p:'get',label:'에너지',room:'cell',hint:'세포호흡으로 얻는 것 — 움직이고 생각하는 힘',opts:['에너지','포도당','소금']},
 {id:'left',p:'root',label:'남는 것',room:'cell',fixed:1},
 {id:'co2',p:'left',label:'이산화 탄소',room:'cell',hint:'남는 것 ① — 기체 (모닥불의 연기)',opts:['이산화 탄소','산소','요소']},
 {id:'h2o',p:'left',label:'물',room:'cell',hint:'남는 것 ② — 액체 (모닥불의 수증기)',opts:['물','침','피']},
 {id:'circ',p:'root',link:'실어 나르기',label:'순환계',room:'circ',hint:'영양소와 산소를 세포까지 실어 나르는 기관계',opts:['순환계','소화계','배설계']},
 {id:'heart',p:'circ',label:'심장',room:'circ',hint:'피를 밀어내는 펌프',opts:['심장','폐','위']},
 {id:'room4',p:'heart',label:'4개의 방',room:'circ',hint:'산소 많은 피·적은 피가 섞이지 않게 나뉜 것',opts:['4개의 방','융털','허파꽈리']},
 {id:'valve',p:'heart',label:'판막',room:'circ',hint:'피가 거꾸로 흐르지 않게 막는 문',opts:['판막','가로막','토리']},
 {id:'vessel',p:'circ',label:'혈관',room:'circ',hint:'피가 지나가는 길',opts:['혈관','숨관','식도']},
 {id:'artery',p:'vessel',label:'동맥',room:'circ',hint:'심장에서 나가는 피 · 벽이 두꺼움',opts:['동맥','정맥','모세혈관']},
 {id:'vein',p:'vessel',label:'정맥',room:'circ',hint:'심장으로 들어오는 피 · 판막이 있음',opts:['정맥','동맥','모세혈관']},
 {id:'cap',p:'vessel',label:'모세혈관',room:'circ',hint:'벽이 세포 한 겹 · 세포와 물질 교환',opts:['모세혈관','동맥','정맥']},
 {id:'blood',p:'circ',label:'혈액',room:'circ',hint:'물질을 싣고 다니는 것',opts:['혈액','침','오줌']},
 {id:'rbc',p:'blood',label:'적혈구',room:'circ',hint:'산소를 싣고 다니는 성분',opts:['적혈구','백혈구','혈소판']},
 {id:'excr',p:'root',link:'노폐물 내보내기',label:'배설계',room:'excr',hint:'요소 같은 노폐물을 걸러 오줌으로 내보내는 기관계',opts:['배설계','호흡계','소화계']},
 {id:'kid',p:'excr',label:'콩팥',room:'excr',hint:'피를 걸러 오줌을 만드는 강낭콩 모양 기관',opts:['콩팥','방광','간']},
 {id:'unit',p:'kid',label:'콩팥 단위',room:'excr',hint:'콩팥에서 오줌을 만드는 작은 단위',opts:['콩팥 단위','허파꽈리','융털']},
 {id:'glom',p:'unit',label:'토리',room:'excr',hint:'모세혈관이 실뭉치처럼 뭉친 곳 · 여과',opts:['토리','세뇨관','판막']},
 {id:'bow',p:'unit',label:'보먼주머니',room:'excr',hint:'토리를 감싸고 걸러진 물질을 받는 주머니',opts:['보먼주머니','방광','쓸개']},
 {id:'tub',p:'unit',label:'세뇨관',room:'excr',hint:'필요한 물질을 다시 흡수하는 구불구불한 관',opts:['세뇨관','오줌관','숨관']},
 {id:'blad',p:'excr',label:'방광',room:'excr',hint:'오줌을 모아 두는 주머니',opts:['방광','쓸개','위']},
 {id:'urea',p:'excr',label:'요소',room:'excr',hint:'간이 암모니아를 바꿔 만든 노폐물',opts:['요소','포도당','산소']},
 {id:'resp',p:'root',link:'산소 들이기',label:'호흡계',room:'resp',hint:'산소를 들이고 이산화 탄소를 내보내는 기관계',opts:['호흡계','순환계','배설계']},
 {id:'nose',p:'resp',label:'코',room:'resp',hint:'털과 점액으로 먼지를 거르는 곳',opts:['코','입','위']},
 {id:'trach',p:'resp',label:'숨관',room:'resp',hint:'연골 고리가 있어 찌그러지지 않는 관',opts:['숨관','식도','오줌관']},
 {id:'alv',p:'resp',label:'허파꽈리',room:'resp',hint:'폐 속 수많은 공기주머니 · 기체 교환',opts:['허파꽈리','융털','토리']},
 {id:'diaph',p:'resp',label:'가로막',room:'resp',hint:'갈비뼈와 함께 움직여 숨 쉬게 하는 막',opts:['가로막','판막','보먼주머니']},
 {id:'dig',p:'root',link:'영양소 흡수',label:'소화계',room:'digest',hint:'음식물을 분해해서 영양소를 흡수하는 기관계',opts:['소화계','순환계','배설계']},
 {id:'mouth',p:'dig',label:'입',room:'digest',hint:'침 속 아밀레이스로 녹말 소화가 처음 시작되는 곳',opts:['입','위','큰창자']},
 {id:'stom',p:'dig',label:'위',room:'digest',hint:'위액 속 펩신으로 단백질 소화가 시작되는 곳',opts:['위','작은창자','식도']},
 {id:'smal',p:'dig',label:'작은창자',room:'digest',hint:'소화가 끝나고 영양소를 흡수하는 곳',opts:['작은창자','큰창자','간']},
 {id:'vill',p:'smal',label:'융털',room:'digest',hint:'작은창자의 표면적을 넓히는 작은 돌기',opts:['융털','판막','허파꽈리']},
 {id:'panc',p:'dig',label:'이자',room:'digest',hint:'아밀레이스·트립신·라이페이스가 든 이자액을 만드는 곳',opts:['이자','쓸개','입']}
];
const MAPC=MAP.filter(n=>n.id!=='root'&&!n.fixed);
let mapDone=LS.get('yb-map',{}), mapZoom=1;
const mapFull=()=>MAPC.every(n=>mapDone[n.id]);
const nodeOK=n=>n.id==='root'||(n.fixed?true:!!mapDone[n.id]);
const nodeAvail=n=>!n.fixed&&!mapDone[n.id]&&nodeOK(MAP.find(m=>m.id===n.p));
/* 방사형 배치: 잎(끝 가지)의 글자 폭만큼 각도를 나눠 줌 */
const MPOS=(()=>{ const kids=id=>MAP.filter(n=>n.p===id), RAD=[0,190,375,530,660], dep=n=>n.p==='root'?1:dep(MAP.find(m=>m.id===n.p))+1;
  const need=n=>{const own=(Math.max(n.label.length*20,(n.link||'').length*14)+56)/RAD[dep(n)], k=kids(n.id); return Math.max(own,k.reduce((a,c)=>a+need(c),0));};
  const top=kids('root'), tot=top.reduce((a,c)=>a+need(c),0), sc=Math.PI*2/tot, first=top.slice(0,3).reduce((a,c)=>a+need(c),0)*sc, pos={root:{x:0,y:0,d:0}};
  const lay=(n,a0,span,d)=>{ const k=kids(n.id), sum=k.reduce((a,c)=>a+need(c),0); let a=a0+(span-sum*sc)/2;
    k.forEach(c=>{ const w=need(c)*sc, m=a+w/2; pos[c.id]={x:RAD[d]*Math.cos(m),y:RAD[d]*Math.sin(m),d}; lay(c,a,w,d+1); a+=w; }); };
  lay(MAP[0],-Math.PI/2-first/2,Math.PI*2,1); return pos; })();
function mapSVG(all,head){
  const pos=MPOS, xs=Object.values(pos), P=110, minx=Math.min(...xs.map(p=>p.x))-P, maxx=Math.max(...xs.map(p=>p.x))+P, miny=Math.min(...xs.map(p=>p.y))-60-(head?120:0), maxy=Math.max(...xs.map(p=>p.y))+60;
  const ok=n=>all||nodeOK(n), av=n=>!all&&nodeAvail(n), bw=(s,f)=>Math.max(70,s.length*f+30);
  const node=n=>{ const p=pos[n.id],x=p.x,y=p.y;
    if(n.id==='root') return `<rect x="${x-88}" y="${y-32}" width="176" height="64" rx="32" fill="#FF5C93" stroke="${INK}" stroke-width="3"/>${T(x,y+9,'세포호흡',{s:27,f:'#fff'})}`;
    if(ok(n)&&n.link){ const w=Math.max(bw(n.label,22),n.link.length*14+34); return `<rect x="${x-w/2}" y="${y-31}" width="${w}" height="62" rx="24" fill="${colr(n.room)}" stroke="${INK}" stroke-width="2.5"/>${T(x,y+2,n.label,{s:22})}${T(x,y+22,n.link,{s:14,f:'#5b5072'})}`; }
    if(ok(n)){ const f=p.d===1?22:20,w=bw(n.label,f), c=n.fixed?'#FFF0A8':p.d===1?colr(n.room==='cell'?'fin':n.room):'#fff'; return `<rect x="${x-w/2}" y="${y-23}" width="${w}" height="46" rx="23" fill="${c}" stroke="${INK}" stroke-width="2.5"/>${T(x,y+8,n.label,{s:f})}`; }
    if(av(n)) return `<g class="mapnode" data-n="${n.id}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="26" fill="#DFF6FF" stroke="${INK}" stroke-width="2.5" stroke-dasharray="6 4"/>${T(x,y+10,'?',{s:28,f:'#2f8fd0'})}</g>`;
    return ''; };
  const edge=n=>{ if(n.id==='root')return ''; const par=MAP.find(m=>m.id===n.p); if(!ok(par)||!(ok(n)||av(n)))return '';
    const a=pos[n.p],b=pos[n.id];
    return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${INK}" stroke-width="${b.d===1?4:3}" ${ok(n)?'':'stroke-dasharray="7 6"'}/>`; };
  const W=maxx-minx, H=maxy-miny;
  return {W,H,svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minx} ${miny} ${W} ${H}" width="${W}" height="${H}">${head?`<rect x="${minx}" y="${miny}" width="${W}" height="${H}" fill="#FFFDF6"/>${T(0,miny+62,head,{s:40})}${T(0,miny+100,'연성이의 기초 탐험 · 구조가 기능을 결정한다',{s:20,f:'#6e6488'})}`:''}${MAP.map(edge).join('')}${MAP.map(node).join('')}</svg>`};
}
SC.map=box=>{
  const draw=()=>{ const filled=MAPC.filter(n=>mapDone[n.id]).length, m=mapSVG(false);
    box.innerHTML=`<p class="q">세포호흡에서<br>가지를 뻗어 봐!</p><p class="sub"><b style="color:#2f8fd0">?</b>를 눌러 알맞은 말을 골라. (${filled}/${MAPC.length})</p>
     <div class="card mapbox" id="mb">${m.svg.replace(/width="[\d.]+" height="[\d.]+"/,`width="${Math.round(m.W*mapZoom*.6)}" height="${Math.round(m.H*mapZoom*.6)}"`)}</div>
     <div class="navg"><button class="pb" id="zo">➖ 작게</button><button class="pb" id="zi">➕ 크게</button></div><p class="fb" id="fb"></p>`;
    const mb=$('mb'); mb.scrollLeft=(mb.scrollWidth-mb.clientWidth)/2; mb.scrollTop=(mb.scrollHeight-mb.clientHeight)/2;
    box.querySelectorAll('.mapnode').forEach(g=>g.onclick=()=>pickNode(MAP.find(n=>n.id===g.dataset.n),draw));
    $('zi').onclick=()=>{mapZoom=Math.min(2,mapZoom+.25);draw()}; $('zo').onclick=()=>{mapZoom=Math.max(.5,mapZoom-.25);draw()};
    if(mapFull()){ fb('🎉 마인드맵 완성! 다음 단계에서 사진으로 저장해.',true); canNext(); } else if(isT()) canNext(); };
  draw(); };
function pickNode(n,after){
  const o=mix(n.opts), m=document.createElement('div'); m.className='modal';
  m.innerHTML=`<div class="card"><span class="chip">🌱 가지 뻗기</span><p class="q">${esc(n.hint)}</p><div class="opts one">${o.map(x=>`<button class="pb">${x}</button>`).join('')}</div><button class="pb" style="margin-top:12px" id="mx">닫기</button></div>`;
  document.body.appendChild(m); m.querySelector('#mx').onclick=()=>m.remove(); m.onclick=e=>{if(e.target===m)m.remove()};
  m.querySelectorAll('.opts .pb').forEach(b=>b.onclick=()=>{ if(b.textContent===n.label){ b.classList.add('right'); mapDone[n.id]=true; LS.set('yb-map',mapDone);
      const f=MAPC.filter(x=>mapDone[x.id]).length; if(f===MAPC.length||f%5===0) rec({type:'map',filled:f,all:MAPC.length}); setTimeout(()=>{m.remove();after();toast('🌱 가지가 쑥!')},350); }
    else { b.classList.add('wrong'); b.disabled=true; shakeEl(b); } });
}
/* 사진 저장: 글꼴(Jua)을 그림 안에 넣어서 PNG로 */
async function fontCss(){ try{ const chars=[...new Set((MAP.map(n=>n.label+(n.link||'')).join('')+'세포호흡연성이의기초탐험구조가기능을결정한다반번0123456789·?').replace(/\s/g,''))].join('');
  const css=await (await fetch('https://fonts.googleapis.com/css2?family=Jua&text='+encodeURIComponent(chars))).text(); const u=(css.match(/url\((https:[^)]+)\)/)||[])[1]; if(!u) return '';
  const b=await (await fetch(u)).blob(); const d=await new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)});
  return `<style>@font-face{font-family:'Jua';src:url(${d})}</style>`; }catch(e){ return ''; } }
async function mapPNG(){
  const head=`${student.cls}반 ${student.num}번 ${student.name}의 세포호흡 마인드맵`, m=mapSVG(true,head), st=await fontCss();
  const src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(m.svg.replace('>',`>${st}`));
  const im=new Image(); await new Promise((ok,no)=>{im.onload=ok;im.onerror=no;im.src=src}); await new Promise(r=>setTimeout(r,250));
  const c=document.createElement('canvas'), k=1.5; c.width=Math.round(m.W*k); c.height=Math.round(m.H*k); const g=c.getContext('2d'); g.fillStyle='#FFFDF6'; g.fillRect(0,0,c.width,c.height); g.drawImage(im,0,0,c.width,c.height);
  return await new Promise(r=>c.toBlob(r,'image/png'));
}
SC.save=box=>{
  const fn=`세포호흡_마인드맵_${student.cls}반${student.num}번_${student.name}.png`;
  box.innerHTML=`<p class="q">완성한 마인드맵을<br>사진으로 저장하자!</p><p class="sub" id="svst">사진 만드는 중…</p><figure class="real" style="margin:0"><img id="mapImg" alt="내 마인드맵"></figure>
   <div class="navg"><button class="pb main" id="dl" disabled>📥 사진 저장</button><button class="pb" id="sh" disabled>📤 보내기</button></div><p class="hint" style="margin-top:10px">저장이 안 되면 사진을 <b>꾹 눌러서</b> '이미지 저장'을 골라.</p>`;
  let blob=null;
  mapPNG().then(b=>{ blob=b; $('mapImg').src=URL.createObjectURL(b); $('svst').textContent='다 됐어! 아래 버튼을 눌러.'; $('dl').disabled=false; $('sh').disabled=!(navigator.canShare&&navigator.canShare({files:[new File([b],fn,{type:'image/png'})]})); canNext(); })
   .catch(()=>{ $('svst').textContent='사진을 만들지 못했어. 화면을 캡처해 줘!'; canNext(); });
  $('dl').onclick=()=>{ if(!blob)return; const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=fn; document.body.appendChild(a); a.click(); a.remove(); toast('📥 저장했어!'); rec({type:'map',filled:MAPC.filter(n=>mapDone[n.id]).length,all:MAPC.length,saved:1}); };
  $('sh').onclick=()=>{ if(blob) navigator.share({files:[new File([blob],fn,{type:'image/png'})],title:'내 마인드맵'}).catch(()=>{}); };
};

/* ---------- 교사 ---------- */
function teacherPrompt(){
  if(isT()){ if(confirm('교사 모드를 끌까요?')){ LS.set('yb-teacher',false); toast('교사 모드를 껐어요'); goHome(); } return; }
  const m=document.createElement('div'); m.className='modal';
  m.innerHTML=`<div class="card"><p class="q">🧑‍🏫 교사 코드</p><input id="tp" type="password" inputmode="numeric" maxlength="6"><div class="navg"><button class="pb" id="tx">닫기</button><button class="pb main" id="tg">열기</button></div></div>`;
  document.body.appendChild(m); const inp=m.querySelector('#tp'); inp.focus();
  const go=()=>{ if(inp.value.trim()==='2023'){ LS.set('yb-teacher',true); m.remove(); toast('🔓 교사 모드 — 모든 방이 열렸어요'); goHome(); } else { shakeEl(inp); inp.value=''; } };
  m.querySelector('#tg').onclick=go; inp.onkeydown=e=>{if(e.key==='Enter')go()}; m.querySelector('#tx').onclick=()=>m.remove();
}
let TD=[];
async function vTeacher(){
  if(!isT()) return goHome();
  $('xTitle').textContent='🧑‍🏫 교사 페이지';
  $('xBody').innerHTML=`<div class="card panel"><div class="navg" style="margin:0"><button class="pb" id="rl">🔄 새로고침</button><button class="pb" id="csvB">⬇️ 엑셀(CSV)</button></div><p class="sub" id="tinfo" style="margin:10px 0 0">불러오는 중…</p></div><div id="tbody"></div>`;
  showS('scrX'); $('rl').onclick=vTeacher; $('csvB').onclick=csv;
  let r; try{ r=await fetch('/api/basic?pin=2023',{cache:'no-store'}); }catch(e){ $('tinfo').textContent='서버에 연결하지 못했어요.'; return; }
  if(!r.ok){ $('tinfo').textContent='기록을 불러오지 못했어요.'; return; }
  TD=(await r.json()).sort((a,b)=>a.t-b.t);
  const mp=new Map(); TD.forEach(d=>{const k=`${d.cls}|${d.num}|${d.name}`; if(!mp.has(k)) mp.set(k,{cls:d.cls,num:d.num,name:d.name,rec:[]}); mp.get(k).rec.push(d)});
  const st=[...mp.values()].sort((a,b)=>(a.cls-b.cls)||(a.num-b.num)||a.name.localeCompare(b.name));
  const rooms=ORDERB;
  const prg=(s,k)=>new Set(s.rec.filter(d=>d.type==='step'&&d.room===k).map(d=>d.step)).size;
  const mapf=s=>{const ms=s.rec.filter(d=>d.type==='map');return ms.length?Math.max(...ms.map(d=>d.filled)):0};
  const rate=s=>{const q=s.rec.filter(d=>d.type==='step');const t=q.reduce((a,d)=>a+d.total,0),ok=q.reduce((a,d)=>a+d.right,0);return t?Math.round(ok/t*100)+'%':'-'};
  $('tinfo').textContent=`학생 ${st.length}명 · 기록 ${TD.length}개 · ${new Date().toLocaleTimeString('ko-KR')}`;
  const wc={}; TD.filter(d=>d.type==='step').forEach(d=>(d.wrong||[]).forEach(w=>wc[w]=(wc[w]||0)+1));
  const top8=Object.entries(wc).sort((a,b)=>b[1]-a[1]).slice(0,8);
  $('tbody').innerHTML=`<div class="card panel" style="margin-top:12px"><div class="scroll"><table class="tt"><thead><tr><th>반</th><th>번호</th><th>이름</th>${rooms.map(k=>`<th>${ROOMS[k].short}</th>`).join('')}<th>마인드맵</th><th>한 번에 맞힘</th><th>마지막</th></tr></thead><tbody>
   ${st.length?st.map((s,i)=>`<tr data-i="${i}" style="cursor:pointer"><td>${esc(s.cls)}</td><td>${esc(s.num)}</td><td class="l">${esc(s.name)}</td>${rooms.map(k=>{const n=prg(s,k),N=ROOMS[k].tabs.length;return `<td>${n>=N?'✅':`${n}/${N}`}</td>`}).join('')}<td>${mapf(s)}/${MAPC.length}</td><td>${rate(s)}</td><td class="sub">${new Date(s.rec[s.rec.length-1].t).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</td></tr>`).join(''):`<tr><td colspan="9" class="sub">아직 기록이 없어요</td></tr>`}
   </tbody></table></div></div>
   <div class="card panel" style="margin-top:12px"><p class="q" style="margin-top:0">📉 많이 틀린 문제 (처음 시도 기준)</p>${top8.length?`<ol style="margin:0;padding-left:1.3em">${top8.map(([q,n])=>`<li style="margin:5px 0">${esc(q)} <span class="chip">${n}명</span></li>`).join('')}</ol>`:'<p class="sub">아직 없어요</p>'}</div>
   <div class="card panel" id="det" style="margin-top:12px" hidden></div>`;
  document.querySelectorAll('#tbody tr[data-i]').forEach(tr=>tr.onclick=()=>{ const s=st[+tr.dataset.i], d=$('det'); d.hidden=false;
    const list=s.rec.filter((r,j,a)=>r.type!=='map'||j===a.map(x=>x.type).lastIndexOf('map')).reverse();
    d.innerHTML=`<p class="q" style="margin-top:0">${esc(s.cls)}반 ${esc(s.num)}번 ${esc(s.name)}</p><div class="scroll"><table class="tt"><thead><tr><th>시간</th><th>방</th><th>단계</th><th>결과</th><th>틀린 문제</th></tr></thead><tbody>${list.map(r=>`<tr><td>${new Date(r.t).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</td><td>${r.type==='map'?'🌳 마인드맵':esc((ROOMS[r.room]||{}).short||r.room)}</td><td class="l">${esc(r.type==='map'?'가지 뻗기':r.title)}</td><td>${r.type==='map'?`${r.filled}/${r.all}`:`${r.right}/${r.total}`}</td><td class="l" style="white-space:normal;min-width:160px">${esc((r.wrong||[]).join(' / '))}</td></tr>`).join('')}</tbody></table></div>`;
    d.scrollIntoView({behavior:'smooth'}); });
}
function csv(){
  const rows=[['반','번호','이름','종류','방','단계','한번에맞힘','문항수','틀린문제','마인드맵','시간']];
  TD.forEach(d=>rows.push([d.cls,d.num,d.name,d.type==='map'?'마인드맵':'단계',(ROOMS[d.room]||{}).short||'',d.title||'',d.right,d.total,(d.wrong||[]).join(' / '),d.type==='map'?`${d.filled}/${d.all}`:'',new Date(d.t).toLocaleString('ko-KR')]));
  const s='﻿'+rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([s],{type:'text/csv;charset=utf-8'})); a.download=`기초탐험_기록_${new Date().toISOString().slice(0,10)}.csv`; a.click();
}

/* ---------- 시작 ---------- */
window.__BR={ROOMS,MAP,MAPC};
const h=location.hash.replace('#','');
if(!student) goLogin();
else if(h==='map'&&roomOpen('fin')) openSys('fin');
else if(h==='teacher') vTeacher();
else if(ROOMS[h]&&roomOpen(h)) openSys(h);
else goHome();
};
