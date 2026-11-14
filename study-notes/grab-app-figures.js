// 연성이 사이트(/app)의 몸 그림(연성이 + 얼굴 있는 기관)을 기관계별로 SVG로 꺼냄
const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
(async()=>{
 const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:900,height:1200}});
 await pg.route(/fonts\.(googleapis|gstatic)|yeonsung-img/,r=>r.abort());
 await pg.goto('http://localhost:8765/app'); await pg.waitForFunction(()=>typeof buildSvg==='function');
 const out=await pg.evaluate(()=>{
  const res={}; show('scrSys');
  ['digest','circ','resp','excr'].forEach(k=>{
   curKey=k; cur=SYS[k]; mode='quiz'; placed=new Set(); buildSvg(); renderBody();
   const s=document.getElementById('body');
   // 따라 그리기용 표시: 흰 테두리(th) · 검은 테두리(to) · 색(ti)
   cur.organs.forEach(o=>{ const g=holders[o.id]&&holders[o.id].firstElementChild; if(!g) return; const ch=g.children;
     if(o.type==='tube'){ ch[0]&&ch[0].classList.add('th'); ch[1]&&ch[1].classList.add('to'); ch[2]&&ch[2].classList.add('ti'); } else { ch[0]&&ch[0].classList.add('th'); } });
   // 기관 이름표 위치: 기관 그림의 가운데 (같은 이름은 첫 번째만)
   const labs=[], seen=new Set();
   cur.organs.forEach(o=>{ if(seen.has(o.name)) return; seen.add(o.name); const h=holders[o.id]; if(!h) return; let x,y; if(o.type==='tube'){ const S=samples[o.id].pts, q=S[Math.floor(S.length*0.3)]; x=q[0]; y=q[1]; } else { const bb=h.getBBox(); x=bb.x+bb.width/2; y=bb.y+bb.height/2; } labs.push({id:o.id,name:o.name,x,y}); });
   const c=s.cloneNode(true); ['slots','fx','neph','char'].forEach(id=>{const e=c.querySelector('#'+id); if(e) e.remove();});
   c.removeAttribute('id'); c.removeAttribute('class'); c.removeAttribute('aria-label'); c.setAttribute('xmlns','http://www.w3.org/2000/svg');
   c.querySelectorAll('[id]').forEach(e=>{ if(e.tagName!=='linearGradient'&&e.tagName!=='radialGradient'&&e.tagName!=='marker') e.removeAttribute('id'); });
   res[k]={svg:c.outerHTML,labs};
  });
  return res;
 });
 fs.writeFileSync(path.join(__dirname,'appfig.json'),JSON.stringify(out));
 for(const k of Object.keys(out)){ console.log(k,out[k].svg.length,out[k].labs.map(l=>l.name+'@'+Math.round(l.x)+','+Math.round(l.y)).join(' ')); }
 await b.close();
})();
