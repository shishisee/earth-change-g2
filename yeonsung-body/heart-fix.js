/* 심장 펌프 수정판 — 몸 그림 속 원래 심장이 두근두근 뛰고, 혈구 하나가 혈관을 따라 돈다.
   patch.js 의 __PATCH 가 끝난 뒤에 heartMode 만 바꿔 끼운다. */
(function () {
  'use strict';
  var INK = '#2b2140';
  /* patch.js 가 window.__PATCH 를 만드는 순간 가로채서, 패치가 끝난 뒤 심장 펌프만 바꿔 끼운다 */
  var basePatch = null;
  Object.defineProperty(window, '__PATCH', {
    configurable: true,
    get: function () { return basePatch; },
    set: function (f) {
      basePatch = function () { f.apply(this, arguments); installHeart(); };
    }
  });

  function svgTag(vb, body, extra) {
    return '<svg viewBox="' + vb + '" style="width:100%;height:auto;display:block' + (extra || '') + '">' + body + '</svg>';
  }
  function quizCard(i, title, opts, dataName, picked, graded, why, okIdx) {
    var ok = graded && picked === (okIdx || 0);
    var h = '<div style="border:2.5px solid ' + (graded ? (ok ? '#5CC96B' : '#FF5C93') : '#EDE9F5') +
      ';border-radius:16px;padding:9px 11px;margin:8px 0;background:' + (graded ? (ok ? '#EEFBEF' : '#FFF1F6') : '#fff') + '">';
    h += '<div style="font-size:14px;margin-bottom:7px">' + (i + 1) + '. ' + title + (graded ? (ok ? ' ✅' : ' ❌') : '') + '</div>';
    h += '<div style="display:flex;gap:6px;flex-wrap:wrap">';
    opts.forEach(function (o, k) {
      var sel = picked === k, isA = graded && k === (okIdx || 0);
      h += '<button class="pb" data-' + dataName + 'i="' + i + '" data-' + dataName + 'k="' + k + '" ' +
        'style="flex:1;min-width:124px;font-size:13px;padding:9px 6px;margin:0;' +
        (sel ? 'outline:3px solid #4CC9F0;outline-offset:1px;' : '') + (isA ? 'border-color:#5CC96B;' : '') + '">' + o + '</button>';
    });
    h += '</div>' + (graded ? '<p class="sub" style="margin:8px 0 0">' + why + '</p>' : '') + '</div>';
    return h;
  }

  /* 혈구 길: 몸 그림에 그려진 혈관 위의 점(circ.route.points)을 그대로 따라간다 */
  var LOOP_D = '', STOPS = [], PTICK = [];
  var STOP_INFO = [
    /* [route 점 번호, 이름, 설명, 산소 많음?, 혈압] */
    [0, '우심방', '온몸을 돈 피가 들어오는 방이야', 0, 5],
    [2, '우심실', '폐로 보내려고 힘껏 짜내!', 0, 25],
    [5, '폐동맥', '동맥인데 산소가 적은 피가 흘러 🤔', 0, 20],
    [9, '폐의 모세혈관', '여기서 산소를 싣고 이산화 탄소를 버려!', 1, 12],
    [11, '폐정맥', '정맥인데 산소가 많은 피가 흘러 🤔', 1, 8],
    [14, '좌심방', '폐에서 온 피를 받는 방', 1, 8],
    [16, '좌심실', '온몸으로 보내야 해서 근육이 가장 두꺼워!', 1, 120],
    [20, '대동맥', '가장 센 힘으로 뿜어져 나가', 1, 110],
    [29, '온몸의 모세혈관', '세포에 산소를 주고 이산화 탄소를 받아', 0, 30],
    [32, '대정맥', '산소가 적은 피가 심장으로 돌아와', 0, 5]
  ];
  function buildRoute() {
    var pts = (typeof SYS !== 'undefined' && SYS.circ && SYS.circ.route && SYS.circ.route.points) || [];
    if (pts.length < 3) return false;
    var cum = [0];
    for (var i = 1; i < pts.length; i++) {
      var dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
      cum.push(cum[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }
    var total = cum[cum.length - 1] || 1;
    LOOP_D = 'M' + pts.map(function (q) { return q[0] + ' ' + q[1]; }).join(' L');
    STOPS = STOP_INFO.map(function (s) { return [cum[Math.min(s[0], pts.length - 1)] / total, s[1], s[2], s[3], s[4]]; });
    var at = function (name) { for (var j = 0; j < STOPS.length; j++) if (STOPS[j][1] === name) return STOPS[j][0]; return 0; };
    PTICK = [['우심실', at('우심실'), 'middle'], ['폐', at('폐의 모세혈관'), 'middle'],
      ['좌심실', at('좌심실'), 'middle'], ['온몸', at('온몸의 모세혈관'), 'middle']];
    return true;
  }
  function pWord(p) { return p >= 90 ? '아주 높음 💥' : p >= 20 ? '보통 🙂' : '낮음 😌'; }
  function GX(t) { return 30 + t * 240; }
  function GY(p) { return 98 - (p / 120) * 78; }
  function pressAt(t) {
    t = t - Math.floor(t);
    for (var i = 0; i < STOPS.length; i++) {
      var a = STOPS[i], b = STOPS[(i + 1) % STOPS.length];
      var t0 = a[0], t1 = (i + 1 === STOPS.length) ? 1 + STOPS[0][0] : b[0];
      if (t >= t0 && t <= t1) {
        var f = (t - t0) / (t1 - t0 || 1);
        f = f < 0.88 ? 0 : Math.min((f - 0.88) / 0.12, 1);
        return a[4] + (b[4] - a[4]) * f;
      }
    }
    return STOPS[0][4];
  }
  function stopAt(t) {
    var s = STOPS[0];
    for (var i = 0; i < STOPS.length; i++) if (t >= STOPS[i][0]) s = STOPS[i];
    return s;
  }

  var HQS = [
    ['폐동맥에 흐르는 피는?', ['산소가 적은 피', '산소가 많은 피'],
      '동맥·정맥은 산소의 양이 아니라 <b>심장에서 나가느냐 들어오느냐</b>로 정한 이름이야. 폐동맥은 심장에서 폐로 나가니까 동맥인데, 아직 산소를 못 실었지!'],
    ['심장에서 근육이 가장 두꺼운 곳은?', ['좌심실', '우심실'],
      '우심실은 <b>폐까지만</b> 보내면 되지만 좌심실은 <b>발끝까지</b> 보내야 해. 멀리 보내려면 세게 밀어야 하고, 세게 밀려면 근육이 두꺼워야 해.'],
    ['판막이 하는 일은?', ['피가 거꾸로 흐르지 못하게 막는다', '피를 더 빠르게 흐르게 한다'],
      '판막은 한쪽으로만 열리는 문이야. 피가 되돌아가면 아무리 펌프질해도 배달이 안 되거든.'],
    ['혈압이 가장 높은 혈관은?', ['대동맥', '폐동맥'],
      '혈압은 <b>피가 혈관 벽을 미는 힘</b>이야. 가장 두꺼운 좌심실이 가장 센 힘으로 밀어내고, 그 피가 바로 들어가는 <b>대동맥</b>의 혈압이 제일 높아.']
  ];

  function installHeart() {
    window.heartMode = function heartMode() {
      var my = runId, pick = {}, graded = false, playing = false, hp = null, t = 0;
      buildRoute();
      var SVGNS = 'http://www.w3.org/2000/svg';

      /* 몸 그림 속 원래 심장(우심방·좌심방·우심실·좌심실)이 두근두근 */
      if (!document.getElementById('hb-css')) {
        var hbst = document.createElement('style');
        hbst.id = 'hb-css';
        hbst.textContent =
          '@keyframes hbAtr{0%,100%{transform:scale(1)}18%{transform:scale(.93)}}' +
          '@keyframes hbVen{0%,55%,100%{transform:scale(1)}72%{transform:scale(.9)}}' +
          '.hb-atr{animation:hbAtr 1.1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}' +
          '.hb-ven{animation:hbVen 1.1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}';
        document.head.appendChild(hbst);
      }
      ['ra', 'la'].forEach(function (id) { if (holders[id]) holders[id].classList.add('hb-atr'); });
      ['rv', 'lv'].forEach(function (id) { if (holders[id]) holders[id].classList.add('hb-ven'); });

      /* 혈구 하나가 혈관(LOOP_D)을 따라 돈다 — 몸 그림과 같은 좌표 */
      var pump = document.createElementNS(SVGNS, 'g');
      pump.setAttribute('id', 'hpump');
      pump.innerHTML =
        '<path id="hloop" d="' + LOOP_D + '" fill="none" stroke="none"/>' +
        '<g id="hcell" style="display:none">' +
        '<circle id="hpring" r="0" fill="none" stroke="#FF2D4E" stroke-width="3" opacity="0"/>' +
        '<circle id="hcir" r="8" fill="#5B7FC4" stroke="' + INK + '" stroke-width="2"/>' +
        '<circle r="3.4" fill="#FFE3EA" opacity=".9"/>' +
        '</g>';
      $('fx').appendChild(pump);
      var loopEl = pump.querySelector('#hloop'), cell = pump.querySelector('#hcell');
      var cir = pump.querySelector('#hcir'), ring = pump.querySelector('#hpring');
      var LEN = 0; try { LEN = loopEl.getTotalLength(); } catch (e) { }

      /* 위쪽: 혈압 표시 · 퀴즈 · 아래: 혈압 그래프 */
      $('panel').innerHTML =
        '<div class="row"><span class="chip on">❤️ 심장 펌프</span><span class="chip" id="hwhere">출발 전</span><span class="chip" id="hpnum">🩸 혈압 —</span></div>' +
        '<div id="hq"></div>';

      /* 혈압 그래프: 왼쪽 몸(심장) 그림 바로 밑 */
      var old = document.getElementById('hgbox'); if (old) old.remove();
      var gbox = document.createElement('div');
      gbox.id = 'hgbox';
      gbox.innerHTML = '<p class="sub" style="margin:0 0 2px;text-align:center">🩸 혈압 그래프 — 피가 혈관 벽을 미는 힘</p><div id="hgraph"></div>';
      var stage = $('stageIn'), bodySvg = $('body');
      if (bodySvg && bodySvg.parentNode === stage) stage.insertBefore(gbox, bodySvg.nextSibling); else stage.appendChild(gbox);

      var pcurve = '';
      for (var k = 0; k <= 200; k++) { var tt = k / 200; pcurve += (k ? ' L ' : 'M ') + GX(tt).toFixed(1) + ' ' + GY(pressAt(tt)).toFixed(1); }
      $('hgraph').innerHTML = svgTag('0 0 300 116',
        '<rect x="6" y="2" width="288" height="96" rx="14" fill="#FBF7FF" stroke="#E6DEF5" stroke-width="2.5"/>' +
        '<path d="' + pcurve + '" fill="none" stroke="#C58FD8" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<line id="pline" x1="30" x2="30" y1="10" y2="98" stroke="' + INK + '" stroke-width="1.2" stroke-dasharray="3 3" opacity=".4"/>' +
        '<circle id="pdot" cx="30" cy="98" r="5.5" fill="#FF4D5E" stroke="' + INK + '" stroke-width="1.6"/>' +
        '<text id="plab" font-family="Jua" font-size="11" fill="#D43B52" text-anchor="middle"></text>' +
        PTICK.map(function (p) {
          return '<text x="' + GX(p[1]).toFixed(0) + '" y="114" text-anchor="' + p[2] + '" font-family="Jua" font-size="9" fill="#9a90b0">' + p[0] + '</text>';
        }).join(''));

      function placeCell() {
        if (!LEN) return;
        var p = loopEl.getPointAtLength(t * LEN);
        cell.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')');
        cell.style.display = '';
        cir.setAttribute('fill', stopAt(t)[3] ? '#FF4D5E' : '#5B7FC4');
      }
      placeCell();

      function tick() {
        if (runId !== my) { if (gbox.parentNode) gbox.remove(); return; }
        if (playing) {
          t += 0.0016; if (t >= 1) t -= 1;
          placeCell();
          var s = stopAt(t);
          var w = $('hwhere'); if (w) { w.textContent = s[1]; w.className = 'chip' + (s[3] ? ' ok' : ''); }
          var P = pressAt(t), px = GX(t), py = GY(P);
          var pl = $('pline'); if (pl) { pl.setAttribute('x1', px); pl.setAttribute('x2', px); }
          var pd = $('pdot'); if (pd) { pd.setAttribute('cx', px); pd.setAttribute('cy', py); }
          var lb = $('plab'); if (lb) { lb.setAttribute('x', Math.min(Math.max(px, 44), 256)); lb.setAttribute('y', py - 10); lb.textContent = Math.round(P); }
          if (ring) { ring.setAttribute('r', (10 + P / 120 * 12).toFixed(1)); ring.setAttribute('opacity', (0.25 + P / 120 * 0.65).toFixed(2)); }
          var nm = $('hpnum'); if (nm) nm.textContent = '🩸 혈압 ' + Math.round(P) + ' · ' + pWord(P);
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      function drawQ() {
        var h = '<p class="sub" style="margin-top:8px">심장은 <b>펌프 두 개</b>가 붙어 있는 거야. 오른쪽은 폐로, 왼쪽은 온몸으로 보내!</p>';
        h += '<p class="q">먼저 네 가지를 예상해 보자. 다 고르면 몸 속 심장이 뛰면서 혈구가 출발해!</p>';
        HQS.forEach(function (q, i) { h += quizCard(i, q[0], q[1], 'h', pick[i], graded, q[2], 0); });
        var filled = Object.keys(pick).length === HQS.length;
        h += '<button class="pb" id="hgo"' + ((graded || !filled) ? ' disabled' : '') + '>' +
          (graded ? '혈구가 도는 중… ❤️' : (filled ? '❤️ 피 흘려보내기' : '네 칸을 다 골라 줘')) + '</button>';
        if (graded) {
          h += '<div class="steps" style="margin-top:10px">';
          STOPS.forEach(function (s) {
            h += '<div class="lane"><b style="color:' + (s[3] ? '#D45C5C' : '#5B7FC4') + '">' + s[1] + '</b><span>' + s[2] + '</span></div>';
          });
          h += '</div>';
          h += '<p class="sub center">🔵 산소가 적은 피 &nbsp; 🔴 산소가 많은 피<br>색이 바뀌는 곳은 <b>폐</b>와 <b>온몸</b> 두 군데뿐이야!</p>';
          h += '<p class="sub center">혈압 그래프에서 <b>좌심실</b>을 지날 때 봉우리가 가장 높이 솟는 걸 확인해 봐!</p>';
          h += '<p class="q" style="margin-top:10px">심장에서 멀어질수록 혈압이 낮아지는 가장 큰 까닭은?</p>' +
            '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
            '<button class="pb" data-hp="0" style="flex:1;min-width:130px;font-size:13px;margin:0' + (hp === 0 ? ';outline:3px solid #4CC9F0' : '') + (hp !== null ? ';border-color:#5CC96B' : '') + '">혈관이 수없이 갈라져 넓어지고, 벽과 부딪히며 힘을 잃어서</button>' +
            '<button class="pb" data-hp="1" style="flex:1;min-width:130px;font-size:13px;margin:0' + (hp === 1 ? ';outline:3px solid #FF5C93' : '') + '">지나가는 동안 피의 양이 줄어들어서</button></div>';
          if (hp !== null) h += '<p class="fb" style="color:' + (hp === 0 ? '#2f7a3f' : '#c23b6a') + '">' +
            (hp === 0 ? '정답! 🎉 모세혈관은 수가 어마어마하게 많아서 전부 합치면 가장 넓어. 넓게 퍼지고 벽에 부딪히는 만큼 미는 힘이 약해져.' : '땡! 피는 한 바퀴를 계속 도는 거라 양이 줄지 않아. 혈관이 넓어지고 마찰로 힘을 잃는 거야.') + '</p>';
          if (hp === 0) h += '<p class="sub center">그래서 정맥에는 <b>판막</b>이 있어. 미는 힘이 약하니까 거꾸로 흐르지 않게 막아 주는 거야!</p>';
          h += '<div class="nextbox" style="margin-top:12px"><p class="sub center">다음 단계 <b>③ 퀴즈</b>이(가) 열렸어!</p>' +
            '<button class="pb main full" id="goNext" data-next="quiz">퀴즈 단계로 가기 →</button></div>';
        }
        $('hq').innerHTML = h;
      }
      $('hq').onclick = function (e) {
        var pb = e.target.closest('[data-hp]');
        if (pb) { hp = +pb.dataset.hp; drawQ(); if (hp === 0) { try { confetti(); } catch (err) { } } return; }
        var b = e.target.closest('[data-hk]');
        if (b && !graded) { pick[+b.dataset.hi] = +b.dataset.hk; drawQ(); return; }
        if (e.target.id === 'hgo' && !graded) {
          graded = true; playing = true; cell.style.display = ''; drawQ();
          var miss = 0; HQS.forEach(function (q, i) { if (pick[i] !== 0) miss++; });
          try {
            confetti(); stampOn('심장<br>박사'); saveProg(curKey, { heart: true });
            record({ system: cur.name, mode: '심장 펌프', score: miss, total: HQS.length });
          } catch (err) { }
        }
      };
      drawQ();
    };
  }
})();
