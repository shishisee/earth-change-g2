/* 연성이의 기초 탐험 (/basic) · 그림 바꾸기
   basic-patch.js 다음에 로드. 화면에 나오는 소화계 · 호흡계 · 배설계 · 심장 그림(그림 사이트)을
   연성이 사이트(/app)의 몸 그림 + 교과서 용어 이름표로 바꿔 끼운다. */
(function(){
var MAP={digest:'digest',resp:'resp',urinary:'excr',heart:'circ'};
var OPT={circ:{vb:'-74 150 448 330',lx:34,rx:266,fs:15,gap:24},def:{vb:'-110 -6 520 540',lx:-14,rx:314,fs:20,gap:30}};
var cache={};
function lab(g,x1,y1,x2,y2,s,end,fs){
  el('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:'#6e6488','stroke-width':fs/10},g);
  el('circle',{cx:x1,cy:y1,r:fs/5,fill:'#6e6488'},g);
  var t=el('text',{x:end?x2-4:x2+4,y:y2+fs/3,'font-size':fs,'font-family':'Jua',fill:INK,'text-anchor':end?'end':'start',stroke:'#fff','stroke-width':3,'paint-order':'stroke','stroke-linejoin':'round'},g);
  t.textContent=s;
}
function fig(k){
  if(cache[k]) return cache[k];
  var S=SYS[k], o=OPT[k]||OPT.def;
  var s=document.createElementNS(NS,'svg'); s.setAttribute('viewBox',o.vb); s.setAttribute('xmlns',NS);
  s.style.cssText='position:absolute;left:-9999px;top:0;width:400px'; document.body.appendChild(s);
  var g=el('g',{},s); drawDoll(el('g',{},g),{mouth:S.mouth});
  if(S.context) S.context(el('g',{},g));
  var og=el('g',{},g), pts=[], seen={};
  S.organs.forEach(function(org){
    var h=drawOrgan(org,og); if(seen[org.name]) return; seen[org.name]=1;
    var x,y;
    if(org.type==='tube'){ var p=h.children[2], L=p.getTotalLength(), q=p.getPointAtLength(L*0.3); x=q.x; y=q.y; }
    else { var b=h.getBBox(); x=b.x+b.width/2; y=b.y+b.height/2; }
    pts.push({n:org.name,x:x,y:y});
  });
  var lg=el('g',{},s);
  [pts.filter(function(p){return p.x<150}),pts.filter(function(p){return p.x>=150})].forEach(function(arr,i){
    var prev=-999; arr.sort(function(a,b){return a.y-b.y}).forEach(function(p){ var ty=Math.max(p.y,prev+o.gap); prev=ty;
      lab(lg,p.x,p.y,i?o.rx:o.lx,ty,p.n,!i,o.fs); }); });
  s.removeAttribute('style'); s.remove();
  return (cache[k]=s.outerHTML);
}
function run(){
  document.querySelectorAll('figure[data-svg]').forEach(function(f){
    var k=MAP[f.dataset.svg]; if(!k) return;
    f.removeAttribute('data-svg');
    try{ f.innerHTML=fig(k); f.classList.add('appfig'); }catch(e){}
  });
}
var orig=window.__BASIC;
window.__BASIC=function(){
  orig.apply(this,arguments);
  run(); new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
};
})();
