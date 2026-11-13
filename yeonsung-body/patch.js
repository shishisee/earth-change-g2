/* 연성이의 몸 탐험 — 개선판
   ① 단계 잠금 (소화 → 순환 → 호흡 → 배설 → 통합), 탭도 순서대로
   ② 순환계 ②단계 = 심장 펌프 (혈압 포함), 혈액 길 찾기 삭제
   ③ 호흡계 ②숨쉬기 ③기체 교환, 산소 여행 삭제
   ④ 배설계 ②콩팥 실험실 새로 그림 (요소 재흡수 포함)
   ⑤ 용어: 숨관 · 숨관가지 · 허파꽈리 · 가로막 · 토리
   ⑥ 퀄즈 → 퀴즈, 문항 은행 20 × 5
   ⑦ 교사용 코드 2023 → 전부 열림 */
window.__PATCH = function () {
  'use strict';
  var INK = '#2b2140';

  /* ============ 0. 용어 · 오타 ============ */
  TABNAME.quiz = '⚡ 퀴즈';
  TABNAME.heart = '❤️ 심장 펌프';
  TABNAME.gas = '🫧 기체 교환';
  TABNAME.nephron = '🔬 콩팥 실험실';
  SYS.all.name = '통합 퀴즈';
  SYS.circ.tabs = ['stick', 'heart', 'quiz'];
  SYS.resp.tabs = ['stick', 'breath', 'gas', 'quiz'];

  var RENAME = { '기관': '숨관', '기관지': '숨관가지', '횡격막': '가로막' };
  (SYS.resp.organs || []).forEach(function (o) { if (RENAME[o.name]) o.name = RENAME[o.name]; });
  ['digest', 'circ', 'resp', 'excr', 'all'].forEach(function (k) {
    ['sub', 'seqHead'].forEach(function (f) {
      if (typeof SYS[k][f] === 'string') SYS[k][f] = SYS[k][f]
        .replace(/기관지/g, '숨관가지').replace(/폐포/g, '허파꽈리').replace(/횡격막/g, '가로막');
    });
  });

  function fixText(root) {
    try {
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) {
        if (n.nodeValue.indexOf('퀄즈') >= 0) n.nodeValue = n.nodeValue.replace(/퀄즈/g, '퀴즈');
      }
    } catch (e) { }
  }
  new MutationObserver(function (ms) {
    ms.forEach(function (m) {
      [].forEach.call(m.addedNodes, function (nd) {
        if (nd.nodeType === 1) fixText(nd);
        else if (nd.nodeType === 3 && nd.nodeValue.indexOf('퀄즈') >= 0) nd.nodeValue = nd.nodeValue.replace(/퀄즈/g, '퀴즈');
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
  fixText(document.body);

  var origRecord = window.record;
  window.record = function record(p) {
    try { if (p && p.mode) p.mode = String(p.mode).replace(/퀄즈/g, '퀴즈'); } catch (e) { }
    return origRecord(p);
  };

  /* ============ 1. 단계 잠금 ============ */
  var STEPS = {
    digest: ['stick', 'trip', 'quiz'],
    circ: ['stick', 'heart', 'quiz'],
    resp: ['stick', 'breath', 'gas', 'quiz'],
    excr: ['stick', 'nephron', 'quiz'],
    all: ['quiz']
  };
  var PKEY = { stick: 'sticker', trip: 'trip', heart: 'heart', breath: 'breath', gas: 'gas', nephron: 'nephron', quiz: 'quiz' };
  var SHORT = { stick: '스티커', trip: '여행', heart: '심장', breath: '숨쉬기', gas: '기체 교환', nephron: '콩팥', quiz: '퀴즈' };
  var NUM = ['①', '②', '③', '④', '⑤'];

  function teacher() { try { return sessionStorage.getItem('ys-teacher') === '1'; } catch (e) { return false; } }
  function tdone(k, tab) {
    var p = progress[k] || {};
    return tab === 'quiz' ? (p.quiz != null) : !!p[PKEY[tab]];
  }
  function sysDone(k) { return (STEPS[k] || []).every(function (t) { return tdone(k, t); }); }
  function tabOpen(k, tab) {
    if (teacher()) return true;
    var st = STEPS[k] || [], i = st.indexOf(tab);
    if (i < 0) return true;
    for (var j = 0; j < i; j++) if (!tdone(k, st[j])) return false;
    return true;
  }
  function sysOpen(k) {
    if (teacher()) return true;
    var i = ORDER.indexOf(k);
    for (var j = 0; j < i; j++) if (!sysDone(ORDER[j])) return false;
    return true;
  }
  function firstLocked(k) {
    var st = STEPS[k] || [];
    for (var j = 0; j < st.length; j++) if (!tdone(k, st[j])) return NUM[j] + ' ' + SHORT[st[j]];
    return '';
  }
  function prevUndone(k) {
    var i = ORDER.indexOf(k);
    for (var j = 0; j < i; j++) if (!sysDone(ORDER[j])) return SYS[ORDER[j]].name;
    return '';
  }

  function paintTabs() {
    document.querySelectorAll('.tab').forEach(function (t) {
      var m = t.dataset.mode;
      if (!t.dataset.base) t.dataset.base = t.textContent;
      var st = STEPS[curKey] || [], i = st.indexOf(m);
      var open = tabOpen(curKey, m), done = tdone(curKey, m);
      t.style.opacity = open ? '' : '.42';
      t.textContent = (i >= 0 && st.length > 1 ? NUM[i] + ' ' : '') + (open ? (done ? '✅ ' : '') : '🔒 ') + t.dataset.base;
    });
  }

  function paintHome() {
    document.querySelectorAll('.sysrow').forEach(function (b) {
      var k = b.dataset.k, open = sysOpen(k), done = sysDone(k);
      b.style.opacity = open ? '' : '.52';
      var ar = b.querySelector('.arrow');
      if (ar) ar.textContent = !open ? '🔒' : (done ? '✅' : '›');
      var pr = b.querySelector('.prog');
      if (pr) pr.innerHTML = (STEPS[k] || []).map(function (t, i) {
        var mark = tdone(k, t) ? '✅' : (open && tabOpen(k, t) ? '▶' : '🔒');
        return '<span>' + NUM[i] + ' ' + SHORT[t] + ' ' + mark + '</span>';
      }).join('');
      b.onclick = open
        ? function () { openSys(k); }
        : function () { toast(prevUndone(k) + '부터 끝내야 열려! 🔒'); shakeEl(b); };
    });
    teacherBtn();
  }

  function teacherBtn() {
    var w = $('who'); if (!w || w.querySelector('#tchBtn')) return;
    var b = document.createElement('button');
    b.id = 'tchBtn'; b.textContent = teacher() ? '🔓 교사' : '🔒';
    w.appendChild(b);
    b.onclick = function () {
      if (teacher()) {
        try { sessionStorage.removeItem('ys-teacher'); } catch (e) { }
        toast('교사 모드를 껐어요'); goHome(); return;
      }
      if ($('tchIn')) { $('tchIn').focus(); return; }
      var sp = document.createElement('span');
      sp.innerHTML = '<input id="tchIn" type="password" inputmode="numeric" maxlength="4" ' +
        'style="width:58px;margin-left:6px;border:2px solid #EDE9F5;border-radius:10px;padding:3px 6px;font-family:inherit;font-size:13px">' +
        '<button id="tchOk" style="margin-left:4px">확인</button>';
      w.appendChild(sp);
      var inp = $('tchIn');
      var go = function () {
        if (inp.value.trim() === '2023') {
          try { sessionStorage.setItem('ys-teacher', '1'); } catch (e) { }
          toast('교사 모드 — 모든 단계가 열렸어요 🔓'); goHome();
        } else { toast('코드가 달라요'); inp.value = ''; inp.focus(); }
      };
      $('tchOk').onclick = go;
      inp.onkeydown = function (e) { if (e.key === 'Enter') go(); };
      inp.focus();
    };
  }

  var origSave = window.saveProg;
  window.saveProg = function saveProg(sys, patch) { origSave(sys, patch); try { paintTabs(); } catch (e) { } };

  var origOpenSys = window.openSys;
  window.openSys = function openSys(k) {
    if (!sysOpen(k)) { toast(prevUndone(k) + '부터 끝내야 열려! 🔒'); return; }
    origOpenSys(k); paintTabs();
  };

  var origGoHome = window.goHome;
  window.goHome = function goHome() { origGoHome(); paintHome(); };

  window.setMode = function setMode(m) {
    if (!tabOpen(curKey, m)) {
      toast(firstLocked(curKey) + ' 단계를 먼저 끝내자! 🔒');
      shakeEl($('tabs')); paintTabs(); return;
    }
    stopAll(); mode = m;
    document.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-selected', t.dataset.mode === m); });
    $('rail').classList.toggle('hidden', m !== 'stick');
    $('stageIn').classList.toggle('rail-on', m === 'stick');
    setLayers(m === 'nephron'); renderBody();
    ({ stick: stickMode, quiz: quizMode, trip: tripMode, breath: breathMode, nephron: nephMode, heart: heartMode, gas: gasMode })[m]();
    paintTabs();
  };

  function nextHint() {
    var st = STEPS[curKey] || [], i = st.indexOf(mode);
    if (i >= 0 && i + 1 < st.length) {
      var nt = st[i + 1];
      return '<div class="nextbox" style="margin-top:12px">' +
        '<p class="sub center">다음 단계 <b>' + NUM[i + 1] + ' ' + SHORT[nt] + '</b>이(가) 열렸어!</p>' +
        '<button class="pb main full" id="goNext" data-next="' + nt + '">' + SHORT[nt] + ' 단계로 가기 →</button></div>';
    }
    var k = ORDER.indexOf(curKey);
    if (k >= 0 && k + 1 < ORDER.length && sysDone(curKey)) {
      var ns = ORDER[k + 1];
      return '<div class="nextbox" style="margin-top:12px">' +
        '<p class="sub center"><b>' + SYS[ns].name + '</b>이(가) 열렸어!</p>' +
        '<button class="pb main full" id="goNext" data-sys="' + ns + '">' + SYS[ns].name + '으로 가기 →</button></div>';
    }
    return '';
  }

  /* 다음 단계 · 다음 기관계 버튼 (위임) */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#goNext');
    if (!b) return;
    if (b.dataset.sys) openSys(b.dataset.sys); else setMode(b.dataset.next);
  });

  /* 줄바꿈: 의미 단위(요소 등)가 중간에서 쪼개지지 않게 */
  try {
    var kst = document.createElement('style');
    kst.textContent = '#panel, #panel *{word-break:keep-all;overflow-wrap:break-word}';
    document.head.appendChild(kst);
  } catch (e) { }

  /* 순환계: 스티커 아래(오른쪽 네모 박스)에 심장 피 순환 단계 버튼 */
  var origStickPanel = window.stickPanel;
  window.stickPanel = function stickPanel(msg) {
    origStickPanel(msg);
    if (curKey !== 'circ') return;
    var p = $('panel'); if (!p) return;
    var box = document.createElement('div');
    box.className = 'nextbox'; box.style.marginTop = '10px';
    box.innerHTML = '<button class="pb full" id="goNext" data-next="heart">❤️ 심장 피 순환 과정 보기 →</button>';
    p.appendChild(box);
  };

  /* 퀴즈가 끝나면 다음 단계(또는 다음 기관계) 버튼 */
  var origEndQuiz = window.endQuiz;
  window.endQuiz = function endQuiz() {
    origEndQuiz();
    try { $('panel').insertAdjacentHTML('beforeend', nextHint()); } catch (e) { }
  };

  /* ============ 2. 문제 은행 (20 × 5, 전부 출제) ============ */
  window.buildRound = function buildRound() {
    var B = (window.__BANK || {})[curKey] || { tap: [], choice: [], ox: [] };
    var mkT = function (a) { return { t: 'tap', q: a[0], ans: a[1] }; };
    var mkC = function (a) { return { t: 'choice', q: a[0], ans: a[1][0], opts: shuffle(a[1]) }; };
    var mkO = function (a) { return { t: 'ox', q: a[0], ans: a[1], opts: ['O', 'X'] }; };
    return shuffle([].concat((B.tap || []).map(mkT), (B.choice || []).map(mkC), (B.ox || []).map(mkO)));
  };

  /* ============ 3. 공용 그리기 도우미 ============ */
  function svgTag(vb, body, extra) {
    return '<svg viewBox="' + vb + '" style="width:100%;height:auto;display:block' + (extra || '') + '">' + body + '</svg>';
  }
  function label(x, y, t, color, size, anchor) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" font-family="Jua" font-size="' +
      (size || 11) + '" fill="' + (color || INK) + '" paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round">' + t + '</text>';
  }
  function tube(d, w, fill) {
    return '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + (w + 4) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
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

  /* ============ 4. 호흡계 ② 숨쉬기 ============ */
  window.breathMode = function breathMode() {
    var fx = $('fx'), my = runId;
    var ribs = el('g', { id: 'ribs', opacity: .55 }, fx);
    [186, 210, 234, 258, 282].forEach(function (y) {
      var d = 'M146 ' + y + ' Q92 ' + (y - 14) + ' 60 ' + (y + 16);
      [d, mirror(d)].forEach(function (dd) {
        el('path', { d: dd, fill: 'none', stroke: '#B89B85', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, ribs);
      });
    });
    var air = el('text', { x: 196, y: 112, 'font-size': 13, 'font-family': 'Jua', fill: '#2a8fc0' }, fx);
    var v = 0, holding = false, count = 0, peak = false;

    var ROWS = [
      ['갈비뼈', ['위로 올라간다 ⬆', '아래로 내려간다 ⬇'], '갈비뼈가 들리면 가슴이 앞뒤로 넓어져.'],
      ['가로막', ['아래로 내려간다 ⬇', '위로 올라간다 ⬆'], '모든 변화가 가로막에서 시작돼.'],
      ['흉강 부피', ['커진다', '작아진다'], '갈비뼈가 올라가고 가로막이 내려가면 가슴 속이 넓어져.'],
      ['흉강 압력', ['낮아진다', '높아진다'], '같은 공기가 넓은 곳에 퍼지면 압력은 낮아져. 부피와 압력은 반대!'],
      ['폐 부피', ['커진다', '작아진다'], '폐에는 근육이 없어. 스스로 커지는 게 아니라 흉강을 따라 끌려가는 거야.'],
      ['폐 속 압력', ['대기압보다 낮아진다', '대기압보다 높아진다'], '폐가 커지면 폐 속이 넓어져서 압력이 바깥보다 낮아져.'],
      ['공기 이동', ['바깥 → 폐', '폐 → 바깥'], '공기는 압력이 높은 곳에서 낮은 곳으로! 폐 속 압력만 알면 바로 나와.']
    ];
    var bm = 'in', pick = { in: {}, out: {} }, done = { in: false, out: false };
    function A() { return bm === 'in' ? 0 : 1; }

    $('panel').innerHTML =
      '<div class="row"><span class="chip on">🫁 숨쉬기 실험</span><span class="chip" id="bcnt">숨쉬기 0 / 3</span></div>' +
      '<p class="sub">버튼을 꾹 누르면 들이쉬고, 떼면 내쉬어. 몸 그림에서 무엇이 바뀌는지 잘 봐!</p>' +
      '<button class="pb hold" id="hold">꾹 누르면 들이쉬기 😤</button>' +
      '<div id="states"></div><div id="bq"></div>';

    var hb = $('hold');
    var on = function (e) { e.preventDefault(); holding = true; hb.classList.add('on'); hb.textContent = '들이쉬는 중… 떼면 내쉬기 😮‍💨'; };
    var off = function () { if (!holding) return; holding = false; hb.classList.remove('on'); hb.textContent = '꾹 누르면 들이쉬기 😤'; };
    hb.addEventListener('pointerdown', on); hb.addEventListener('pointerup', off);
    hb.addEventListener('pointercancel', off); hb.addEventListener('pointerleave', off);
    hb.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') on(e); });
    hb.addEventListener('keyup', off);

    var box = $('states');
    function draw() {
      var g = done[bm], ans = A(), h = '';
      h += '<div class="row" style="margin-top:10px">' +
        '<span class="chip' + (bm === 'in' ? ' on' : '') + '" data-m="in" style="cursor:pointer">🌬️ 들숨' + (done.in ? ' ✅' : '') + '</span>' +
        '<span class="chip' + (bm === 'out' ? ' on' : '') + '" data-m="out" style="cursor:pointer">💨 날숨' + (done.out ? ' ✅' : '') + '</span></div>';
      h += '<p class="sub" style="margin:6px 0 2px">' + (g ? '정답과 맞춰 보자!' : '<b>네 생각</b>대로 일곱 칸을 골라 봐. 다 고르면 확인 버튼이 켜져!') + '</p>';
      ROWS.forEach(function (r, i) {
        h += quizCard(i, r[0], r[1], 'b', pick[bm][i], g, r[2], ans);
      });
      var filled = Object.keys(pick[bm]).length === ROWS.length;
      h += '<button class="pb" id="bchk"' + ((g || !filled) ? ' disabled' : '') + '>' +
        (g ? '확인 끝 ✅' : (filled ? '🫁 확인하기' : '일곱 칸을 다 골라 줘')) + '</button>';
      if (g) {
        var n = 0; ROWS.forEach(function (r, i) { if (pick[bm][i] === ans) n++; });
        h += '<p class="q center" style="margin-top:8px">7개 중 ' + n + '개 정답!</p>';
        h += '<p class="sub center">' + (bm === 'in'
          ? '가로막 ⬇ → 흉강 커짐 → 압력 낮아짐 → 폐가 끌려 커짐 → 공기가 들어옴'
          : '날숨은 들숨을 전부 뒤집으면 돼!') + '</p>';
        if (!done[bm === 'in' ? 'out' : 'in'])
          h += '<p class="sub center">위에서 ' + (bm === 'in' ? '💨 날숨' : '🌬️ 들숨') + '도 해 보자!</p>';
      }
      box.innerHTML = h;
    }
    box.onclick = function (e) {
      var m = e.target.closest('[data-m]');
      if (m) { bm = m.dataset.m; draw(); return; }
      var b = e.target.closest('button[data-bk]');
      if (b && !done[bm]) { pick[bm][+b.dataset.bi] = +b.dataset.bk; draw(); return; }
      if (e.target.id === 'bchk' && !done[bm]) {
        done[bm] = true; draw();
        if (done.in && done.out) {
          var miss = 0;
          ['in', 'out'].forEach(function (mm) {
            ROWS.forEach(function (r, i) { if (pick[mm][i] !== (mm === 'in' ? 0 : 1)) miss++; });
          });
          try {
            confetti(); stampOn('숨쉬기<br>박사'); saveProg(curKey, { breath: true });
            record({ system: cur.name, mode: '숨쉬기 실험', score: miss, total: 14 });
          } catch (err) { }
          $('bq').innerHTML = '<p class="q center" style="margin-top:12px">들숨·날숨을 모두 끝냈어! 🎉</p>' + nextHint();
          try { $('bq').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (err) { }
        }
      }
    };
    draw();

    var loop = function () {
      if (runId !== my) return;
      v += ((holding ? 1 : 0) - v) * (REDUCE ? 1 : .07);
      var st = holding ? 'in' : (v > .03 ? 'out' : 'idle'), moving = holding ? v < .97 : v > .03;
      [['lungL', 100], ['lungR', 200]].forEach(function (p) {
        var id = p[0], cx = p[1];
        if (holders[id]) holders[id].setAttribute('transform',
          'translate(' + cx + ' 176) scale(' + (1 + .07 * v) + ' ' + (1 + .12 * v) + ') translate(' + (-cx) + ' -176)');
      });
      if (holders.diaphragm) holders.diaphragm.querySelectorAll('path').forEach(function (p) {
        p.setAttribute('d', 'M58 ' + (338 + 8 * v) + ' Q150 ' + (294 + 32 * v) + ' 242 ' + (338 + 8 * v));
      });
      ribs.setAttribute('transform', 'translate(0 ' + (-8 * v) + ')');
      air.textContent = !moving ? '' : st === 'in' ? '⬇ 공기 들어옴' : '⬆ 공기 나감';
      air.setAttribute('fill', st === 'in' ? '#2a8fc0' : '#e0334f');
      if (v > .85) peak = true;
      if (peak && !holding && v < .12) { peak = false; count++; $('bcnt').textContent = '숨쉬기 ' + Math.min(count, 3) + ' / 3'; }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  };

  /* ============ 5. 호흡계 ③ 기체 교환 ============ */
  var GAS_SVG = svgTag('0 0 300 190',
    '<defs><style>' +
    '@keyframes o2m{0%{transform:translateX(0);opacity:0}18%{opacity:1}100%{transform:translateX(76px);opacity:0}}' +
    '@keyframes c2m{0%{transform:translateX(0);opacity:0}18%{opacity:1}100%{transform:translateX(-76px);opacity:0}}' +
    '.o2m{animation:o2m 2.6s linear infinite}.c2m{animation:c2m 2.6s linear infinite}' +
    '</style></defs>' +
    '<circle cx="46" cy="58" r="24" fill="#FFD6E6" stroke="' + INK + '" stroke-width="3"/>' +
    '<circle cx="42" cy="106" r="22" fill="#FFD6E6" stroke="' + INK + '" stroke-width="3"/>' +
    '<circle cx="84" cy="84" r="31" fill="#FFE5F0" stroke="' + INK + '" stroke-width="3"/>' +
    '<circle cx="75" cy="78" r="3.4" fill="' + INK + '"/><circle cx="93" cy="78" r="3.4" fill="' + INK + '"/>' +
    '<path d="M74 92 Q84 100 94 92" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
    '<circle cx="66" cy="88" r="4.5" fill="#FFB3CE" opacity=".85"/><circle cx="102" cy="88" r="4.5" fill="#FFB3CE" opacity=".85"/>' +
    label(62, 20, '허파꽈리', '#D4487A', 13) +
    tube('M214 20 L214 150', 32, '#FFC4C4') +
    label(214, 178, '모세 혈관', '#D45C5C', 12) +
    '<g class="o2m"><circle cx="122" cy="54" r="8" fill="#4CC9F0" stroke="' + INK + '" stroke-width="1.6"/></g>' +
    '<g class="o2m" style="animation-delay:.9s"><circle cx="122" cy="82" r="8" fill="#4CC9F0" stroke="' + INK + '" stroke-width="1.6"/></g>' +
    '<g class="o2m" style="animation-delay:1.8s"><circle cx="122" cy="110" r="8" fill="#4CC9F0" stroke="' + INK + '" stroke-width="1.6"/></g>' +
    '<g class="c2m"><circle cx="198" cy="68" r="8" fill="#9B7BFF" stroke="' + INK + '" stroke-width="1.6"/></g>' +
    '<g class="c2m" style="animation-delay:1.3s"><circle cx="198" cy="124" r="8" fill="#9B7BFF" stroke="' + INK + '" stroke-width="1.6"/></g>' +
    label(160, 26, '산소 →', '#2a8fc0', 12) +
    label(160, 150, '← 이산화 탄소', '#7B5BD6', 12));

  var GQ = [
    ['허파꽈리 속 산소는 어느 쪽으로 움직일까?', ['허파꽈리 → 모세 혈관', '모세 혈관 → 허파꽈리'],
      '산소는 허파꽈리에 많고 혈액에는 적어. 기체는 <b>많은 쪽에서 적은 쪽으로</b> 저절로 퍼져 — 이게 <b>확산</b>이야.'],
    ['이산화 탄소는 어느 쪽으로 움직일까?', ['모세 혈관 → 허파꽈리', '허파꽈리 → 모세 혈관'],
      '이산화 탄소는 반대야. 온몸을 돌고 온 혈액에 많고 허파꽈리에는 적으니까, 혈액에서 빠져나와 날숨으로 나가.'],
    ['날숨에 산소가 0이 아니라 16 %나 남아 있는 까닭은?', ['들이마신 산소 중 일부만 혈액으로 가서', '폐가 산소를 다시 만들어서'],
      '농도 차이가 줄어들면 이동도 멈춰. 그래서 들이마신 산소를 다 가져오지는 못해. 남의 날숨에도 산소가 있으니까 <b>인공호흡</b>이 되는 거야! 🫁']
  ];

  window.gasMode = function gasMode() {
    var gp = {}, graded = false, bd = '2px solid #EDE9F5';
    $('panel').innerHTML = '<div id="gwrap"></div>';
    var wrap = $('gwrap');
    function draw() {
      var h = '<div class="row"><span class="chip on">🫧 기체 교환 — 확산</span></div>';
      h += '<p class="sub">숨을 들이쉬어 허파꽈리까지 온 공기는 어떻게 혈액으로 들어갈까? 기체는 <b>많은 쪽에서 적은 쪽으로</b> 저절로 퍼져 나가.</p>';
      h += GAS_SVG;
      h += '<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:10px">' +
        '<tr><th style="border:' + bd + ';padding:6px"></th><th style="border:' + bd + ';padding:6px">들숨</th><th style="border:' + bd + ';padding:6px">날숨</th></tr>' +
        '<tr><td style="border:' + bd + ';padding:6px">산소</td><td style="border:' + bd + ';padding:6px;color:#2a8fc0">21 %</td><td style="border:' + bd + ';padding:6px;color:#2a8fc0">16 %</td></tr>' +
        '<tr><td style="border:' + bd + ';padding:6px">이산화 탄소</td><td style="border:' + bd + ';padding:6px;color:#7B5BD6">0.04 %</td><td style="border:' + bd + ';padding:6px;color:#7B5BD6">4 %</td></tr></table>';
      h += '<p class="q" style="margin-top:12px">그림과 표를 보고 세 가지를 골라 보자!</p>';
      GQ.forEach(function (q, i) { h += quizCard(i, q[0], q[1], 'g', gp[i], graded, q[2], 0); });
      var filled = Object.keys(gp).length === GQ.length;
      h += '<button class="pb" id="gchk"' + ((graded || !filled) ? ' disabled' : '') + '>' +
        (graded ? '확인 끝 ✅' : (filled ? '🫧 확인하기' : '세 칸을 다 골라 줘')) + '</button>';
      if (graded) {
        var n = 0; GQ.forEach(function (q, i) { if (gp[i] === 0) n++; });
        h += '<p class="q center" style="margin-top:8px">3개 중 ' + n + '개 정답!</p>';
        h += '<p class="sub center">허파꽈리에서 받은 산소는 혈액을 타고 온몸으로, 온몸에서 생긴 이산화 탄소는 혈액을 타고 폐로. 호흡계와 순환계가 이어져 있어!</p>';
        h += nextHint();
      }
      wrap.innerHTML = h;
    }
    wrap.onclick = function (e) {
      var b = e.target.closest('[data-gk]');
      if (b && !graded) { gp[+b.dataset.gi] = +b.dataset.gk; draw(); return; }
      if (e.target.id === 'gchk' && !graded) {
        graded = true;
        var miss = 0; GQ.forEach(function (q, i) { if (gp[i] !== 0) miss++; });
        draw();
        try {
          confetti(); stampOn('확산<br>박사'); saveProg(curKey, { gas: true });
          record({ system: cur.name, mode: '기체 교환', score: miss, total: GQ.length });
        } catch (err) { }
      }
    };
    draw();
  };

  /* ============ 6. 순환계 ② 심장 펌프 (몸 그림 위에서 두근두근 · 혈구 하나가 순환) ============ */
  var LOOP_D = 'M150 308 L60 308 L60 118 L123 118 L123 200 ' +
    'C86 196 68 110 112 58 L150 50 L188 58 C222 74 214 100 177 118 ' +
    'L177 200 C220 196 240 170 240 140 L240 308 Z';
  var HEART_MAP = 'translate(57 202) scale(0.62)'; /* 펌프 그림을 몸 속 심장 자리에 맞춤 */
  var STOPS = [
    [0.000, '온몸의 모세혈관', '산소를 다 내주고 이산화 탄소를 받았어', 0, 30],
    [0.051, '대정맥', '산소가 적은 피가 심장으로 돌아와', 0, 5],
    [0.278, '우심방', '들어온 피를 받는 방이야', 0, 5],
    [0.320, '우심실', '폐로 보내려고 힘껏 짜내!', 0, 25],
    [0.365, '폐동맥', '동맥인데 산소가 적은 피가 흘러 🤔', 0, 20],
    [0.505, '폐의 모세혈관', '여기서 산소를 싣고 이산화 탄소를 버려!', 1, 12],
    [0.555, '폐정맥', '정맥인데 산소가 많은 피가 흘러 🤔', 1, 8],
    [0.625, '좌심방', '폐에서 온 피를 받는 방', 1, 8],
    [0.663, '좌심실', '온몸으로 보내야 해서 근육이 가장 두꺼워!', 1, 120],
    [0.710, '대동맥', '가장 센 힘으로 뿜어져 나가', 1, 110],
    [0.945, '온몸의 모세혈관', '산소를 다 내주고 이산화 탄소를 받았어', 0, 30]
  ];
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
  var PTICK = [['온몸', 0, 'start'], ['우심실', 0.335, 'middle'], ['폐', 0.528, 'middle'], ['좌심실', 0.68, 'middle'], ['온몸', 1, 'end']];

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

  window.heartMode = function heartMode() {
    var my = runId, pick = {}, graded = false, playing = false, raf = 0, hp = null, t = 0;
    var SVGNS = 'http://www.w3.org/2000/svg';

    /* 왼쪽 몸 그림 위, 심장 자리에 두근두근 펌프 + 혈구 하나 */
    var pump = document.createElementNS(SVGNS, 'g');
    pump.setAttribute('id', 'hpump');
    pump.setAttribute('transform', HEART_MAP);
    pump.innerHTML =
      '<defs><style>' +
      '@keyframes atria{0%,100%{transform:scale(1)}18%{transform:scale(.93)}}' +
      '@keyframes vent{0%,55%,100%{transform:scale(1)}72%{transform:scale(.9)}}' +
      '.atr{animation:atria 1.1s ease-in-out infinite;transform-origin:center;transform-box:fill-box}' +
      '.ven{animation:vent 1.1s ease-in-out infinite;transform-origin:center;transform-box:fill-box}' +
      '</style></defs>' +
      '<rect class="atr" x="98" y="96" width="50" height="44" rx="17" fill="#CFE0FA" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<rect class="ven" x="98" y="150" width="50" height="68" rx="20" fill="#AFC9F2" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<rect class="atr" x="152" y="96" width="50" height="44" rx="17" fill="#FFD2D2" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<rect id="lv" class="ven" x="152" y="150" width="50" height="68" rx="20" fill="#FFB3B3" stroke="' + INK + '" stroke-width="5"/>' +
      '<path id="hloop" d="' + LOOP_D + '" fill="none" stroke="none"/>' +
      '<g id="hcell" style="display:none">' +
      '<circle id="hpring" r="0" fill="none" stroke="#FF2D4E" stroke-width="3" opacity="0"/>' +
      '<circle id="hcir" r="8" fill="#5B7FC4" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle r="3.4" fill="#FFE3EA" opacity=".9"/>' +
      '</g>';
    $('fx').appendChild(pump);
    var loopEl = pump.querySelector('#hloop'), cell = pump.querySelector('#hcell');
    var cir = pump.querySelector('#hcir'), ring = pump.querySelector('#hpring'), lv = pump.querySelector('#lv');
    var LEN = 0; try { LEN = loopEl.getTotalLength(); } catch (e) { }

    /* 위쪽: 혈압 표시 · 퀴즈 · 아래: 혈압 그래프 */
    $('panel').innerHTML =
      '<div class="row"><span class="chip on">❤️ 심장 펌프</span><span class="chip" id="hwhere">출발 전</span><span class="chip" id="hpnum">🩸 혈압 —</span></div>' +
      '<div id="hq"></div>' +
      '<p class="sub" style="margin:10px 0 2px">🩸 혈압 그래프 — 피가 혈관 벽을 미는 힘</p>' +
      '<div id="hgraph"></div>';

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
      if (runId !== my) return;
      if (playing) {
        t += 0.0019; if (t >= 1) t -= 1;
        placeCell();
        var s = stopAt(t);
        var w = $('hwhere'); if (w) { w.textContent = s[1]; w.className = 'chip' + (s[3] ? ' ok' : ''); }
        var P = pressAt(t), px = GX(t), py = GY(P);
        var pl = $('pline'); if (pl) { pl.setAttribute('x1', px); pl.setAttribute('x2', px); }
        var pd = $('pdot'); if (pd) { pd.setAttribute('cx', px); pd.setAttribute('cy', py); }
        var lb = $('plab'); if (lb) { lb.setAttribute('x', Math.min(Math.max(px, 44), 256)); lb.setAttribute('y', py - 10); lb.textContent = Math.round(P); }
        if (ring) { ring.setAttribute('r', (10 + P / 120 * 12).toFixed(1)); ring.setAttribute('opacity', (0.25 + P / 120 * 0.65).toFixed(2)); }
        if (lv) { var hot = P >= 90; lv.setAttribute('stroke', hot ? '#FF2D4E' : INK); lv.setAttribute('stroke-width', hot ? 7 : 5); }
        var nm = $('hpnum'); if (nm) nm.textContent = '🩸 혈압 ' + Math.round(P) + ' · ' + pWord(P);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    function drawQ() {
      var h = '<p class="sub" style="margin-top:8px">심장은 <b>펌프 두 개</b>가 붙어 있는 거야. 오른쪽은 폐로, 왼쪽은 온몸으로 보내!</p>';
      h += '<p class="q">먼저 네 가지를 예상해 보자. 다 고르면 왼쪽 몸 속 심장이 뛰면서 혈구가 출발해!</p>';
      HQS.forEach(function (q, i) { h += quizCard(i, q[0], q[1], 'h', pick[i], graded, q[2], 0); });
      var filled = Object.keys(pick).length === HQS.length;
      h += '<button class="pb" id="hgo"' + ((graded || !filled) ? ' disabled' : '') + '>' +
        (graded ? '혈구가 도는 중… ❤️' : (filled ? '❤️ 피 흘려보내기' : '네 칸을 다 골라 줘')) + '</button>';
      if (graded) {
        h += '<div class="steps" style="margin-top:10px">';
        STOPS.slice(0, 10).forEach(function (s) {
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
        h += nextHint();
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

  /* ============ 7. 배설계 ② 콩팥 실험실 ============ */
  var SUBS = [
    { k: 'water', e: '💧', n: '물' }, { k: 'water2', e: '💧', n: '물', dup: 1 },
    { k: 'glu', e: '🍬', n: '포도당' }, { k: 'amino', e: '🧩', n: '아미노산' },
    { k: 'salt', e: '🧂', n: '무기염류' },
    { k: 'urea', e: '🧪', n: '요소' }, { k: 'urea2', e: '🧪', n: '요소', dup: 1 },
    { k: 'prot', e: '🥚', n: '단백질' }, { k: 'rbc', e: '🔴', n: '혈구' }
  ];
  var TUBULE = 'M150 168 Q188 180 184 212 Q180 244 146 254 Q112 264 116 296 Q120 328 156 336 L156 380';
  var CAPIL = 'M214 150 Q244 190 232 224 Q220 258 186 270 Q152 282 158 312 Q164 344 200 352 L200 392 Q200 414 236 418';
  var NPOS = {
    glom: [[88, 146], [108, 134], [118, 158], [96, 170], [126, 140], [82, 160], [112, 176], [100, 150], [128, 166]],
    tub: [[172, 196], [176, 214], [168, 232], [150, 246], [132, 262], [122, 282], [126, 304], [142, 322], [156, 340]],
    cap: [[224, 178], [230, 204], [220, 232], [196, 252], [172, 268], [160, 292], [168, 318], [192, 338], [206, 360]],
    out: [[156, 356], [156, 372], [156, 388], [156, 404], [156, 420], [156, 436], [156, 452], [156, 468], [156, 484]]
  };
  var NB = null;

  function drawKidney() {
    var g = $('neph'); g.innerHTML = '';
    g.innerHTML =
      '<text x="150" y="30" text-anchor="middle" font-family="Jua" font-size="16" fill="' + INK + '">🔬 콩팥 속을 크게 보면</text>' +
      '<text x="150" y="50" text-anchor="middle" font-family="Jua" font-size="11.5" fill="#6e6488">오줌을 만드는 작은 공장, 네프론이야</text>' +
      /* 혈관 */
      tube('M14 112 L60 112 Q96 112 104 136', 13, '#FF9E9E') +
      tube('M126 134 Q150 112 190 116 L214 150', 12, '#FF9E9E') +
      tube(CAPIL, 13, '#FFBDBD') +
      /* 보먼주머니 */
      '<path d="M150 104 A52 52 0 1 0 150 212 Z" fill="#FFF6DC" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
      /* 토리 */
      '<circle cx="106" cy="155" r="30" fill="#FFB9CB" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<circle cx="97" cy="147" r="11" fill="none" stroke="#E0416B" stroke-width="3.2"/>' +
      '<circle cx="115" cy="155" r="11" fill="none" stroke="#E0416B" stroke-width="3.2"/>' +
      '<circle cx="100" cy="167" r="9" fill="none" stroke="#E0416B" stroke-width="3.2"/>' +
      /* 흐름 방향: 세뇨관 · 모세 혈관 위로 물질이 흘러가는 모습 */
      '<style>@keyframes nflow{to{stroke-dashoffset:-24}}.nflow{animation:nflow 1.1s linear infinite}</style>' +
      '<path class="nflow" d="' + CAPIL + '" fill="none" stroke="#E0416B" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="2 10" opacity=".55"/>' +
      /* 세뇨관 */
      tube(TUBULE, 17, '#FFF6DC') +
      '<path class="nflow" d="' + TUBULE + '" fill="none" stroke="#E0416B" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="2 10" opacity=".55"/>' +
      /* 모음관 */
      tube('M156 380 L156 492', 19, '#FFF1C9') +
      '<text x="150" y="516" text-anchor="middle" font-size="19">💧</text>' +
      label(196, 512, '오줌', '#B08A2A', 12, 'start') +
      /* 이름표 */
      label(10, 104, '혈액 들어옴 →', '#C85A5A', 11, 'start') +
      label(222, 130, '→ 혈액 나감', '#C85A5A', 11, 'start') +
      label(106, 196, '토리', '#C2365C', 12.5) +
      label(60, 214, '보먼주머니', '#8a7a4a', 11.5) +
      label(214, 300, '모세 혈관', '#C85A5A', 11, 'start') +
      label(84, 346, '세뇨관', '#8a7a4a', 11.5, 'start') +
      label(186, 440, '모음관', '#8a7a4a', 11.5, 'start') +
      '<g id="nbadge"></g><g id="nparts"></g>';

    var bg = $('nbadge');
    NB = { badges: {}, parts: {} };
    [['f', '① 여과', 58, 80], ['r', '② 재흡수', 150, 80], ['s', '③ 분비', 244, 80]].forEach(function (a) {
      var w = a[1].length * 8 + 16;
      var gg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gg.setAttribute('opacity', '.25');
      gg.innerHTML = '<rect x="' + (a[2] - w / 2) + '" y="' + (a[3] - 13) + '" width="' + w + '" height="24" rx="12" fill="#fff" stroke="' + INK + '" stroke-width="2.2"/>' +
        '<text x="' + a[2] + '" y="' + (a[3] + 4) + '" text-anchor="middle" font-size="12" font-family="Jua" fill="' + INK + '">' + a[1] + '</text>';
      bg.appendChild(gg); NB.badges[a[0]] = gg;
    });

    var pg = $('nparts');
    SUBS.forEach(function (s, i) {
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      p.innerHTML = '<circle r="11" fill="#fff" stroke="' + INK + '" stroke-width="1.8"/><text y="4.5" text-anchor="middle" font-size="12">' + s.e + '</text>';
      var xy = NPOS.glom[i];
      p.setAttribute('transform', 'translate(' + xy[0] + ' ' + xy[1] + ')');
      pg.appendChild(p);
      NB.parts[s.k] = { g: p, x: xy[0], y: xy[1] };
    });
  }
  function nbadge(k) {
    Object.keys(NB.badges).forEach(function (kk) { NB.badges[kk].setAttribute('opacity', kk === k ? '1' : '.25'); });
  }
  function moveTo(k, x, y, dur) {
    var P = NB.parts[k]; if (!P) return Promise.resolve();
    var x0 = P.x, y0 = P.y; P.x = x; P.y = y;
    if (REDUCE) dur = 0;
    return new Promise(function (res) {
      var t0 = performance.now();
      var step = function (now) {
        var q = dur ? Math.min(1, (now - t0) / dur) : 1;
        var e = q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2;
        P.g.setAttribute('transform', 'translate(' + (x0 + (x - x0) * e).toFixed(1) + ' ' + (y0 + (y - y0) * e).toFixed(1) + ')');
        if (q < 1) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
    });
  }
  function spread(keys, where, dur) {
    return Promise.all(keys.map(function (k, i) {
      var xy = NPOS[where][i % NPOS[where].length];
      return moveTo(k, xy[0], xy[1], dur || 950);
    }));
  }

  window.nephMode = function nephMode() {
    var my = runId, miss = 0;
    drawKidney(); nbadge('');
    $('panel').innerHTML = '<div class="center"><div class="big">🔬</div><p class="q">콩팥 실험실</p>' +
      '<p class="sub">콩팥 속에는 오줌을 만드는 작은 공장 <b>네프론</b>이 백만 개쯤 들어 있어.<br>' +
      '혈액 속 물질을 <b>① 여과 → ② 재흡수 → ③ 분비</b> 시켜서 오줌을 만들지.<br>직접 해 보자!</p>' +
      '<button class="pb main full" id="ngo">실험 시작!</button></div>';
    $('ngo').onclick = function () { step1(); };

    function pickUI(tag, title, sub, items, correct, onOk) {
      var chosen = {};
      function draw(fbMsg, good) {
        var h = '<div class="row"><span class="chip on">' + tag + '</span><span class="chip">틀린 횟수 ' + miss + '</span></div>' +
          '<p class="q">' + title + '</p><p class="sub">' + sub + '</p>' +
          '<div style="display:flex;gap:7px;flex-wrap:wrap;margin:10px 0">';
        items.forEach(function (s) {
          h += '<button class="pb" data-s="' + s.k + '" style="font-size:14px;padding:9px 13px;margin:0;' +
            (chosen[s.k] ? 'background:#dff6ff;border-color:#4CC9F0;' : '') + '">' + s.e + ' ' + s.n + '</button>';
        });
        h += '</div><button class="pb main full" id="nchk">확인!</button>';
        if (fbMsg) h += '<p class="fb ' + (good ? 'good' : 'bad') + '">' + fbMsg + '</p>';
        $('panel').innerHTML = h;
        $('panel').onclick = function (e) {
          var b = e.target.closest('[data-s]');
          if (b) { var k = b.dataset.s; if (chosen[k]) delete chosen[k]; else chosen[k] = 1; draw(fbMsg, good); return; }
          if (e.target.id === 'nchk') {
            var wrongIn = Object.keys(chosen).filter(function (k) { return correct.indexOf(k) < 0; });
            var missed = correct.filter(function (k) { return !chosen[k]; });
            if (!wrongIn.length && !missed.length) { $('panel').onclick = null; onOk(); return; }
            miss++; shakeEl($('panel'));
            var nameOf = function (k) { var f = items.filter(function (s) { return s.k === k; })[0]; return f ? f.n : ''; };
            draw(wrongIn.length ? '<b>' + nameOf(wrongIn[0]) + '</b>은(는) 아니야! 다시 골라 봐'
              : '하나 더 있어! (' + missed.length + '개 빠졌어)', false);
          }
        };
      }
      draw('', true);
    }

    function step1() {
      nbadge('f');
      var items = SUBS.filter(function (s) { return !s.dup; });
      pickUI('① 여과', '토리에서 보먼주머니로 <b>걸러져 나가는</b> 물질을 모두 골라!',
        '토리는 모세 혈관이 실뭉치처럼 뭉친 곳이야. 압력이 높아서 <b>작은 물질</b>은 주머니로 밀려 나가고, <b>큰 것</b>은 혈액에 그대로 남아.',
        items, ['water', 'glu', 'amino', 'salt', 'urea'],
        async function () {
          $('panel').innerHTML = '<p class="fb good">정답! 작은 물질들이 걸러져 세뇨관으로 들어가 🎉</p>';
          await Promise.all([
            spread(['water', 'water2', 'glu', 'amino', 'salt', 'urea', 'urea2'], 'tub', 1100),
            moveTo('prot', 150, 118, 1100), moveTo('rbc', 174, 128, 1100)
          ]);
          if (runId !== my) return;
          await sleep(450); step2();
        });
    }

    function step2() {
      nbadge('r');
      var items = SUBS.filter(function (s) { return !s.dup && s.k !== 'prot' && s.k !== 'rbc'; });
      pickUI('② 재흡수', '세뇨관에서 <b>모세 혈관으로 다시 돌아가는</b> 물질을 모두 골라!',
        '몸에 필요한 물질을 그냥 버리면 아깝잖아. 다시 흡수해서 혈액으로 돌려보내!',
        items, ['water', 'glu', 'amino', 'salt'],
        async function () {
          $('panel').innerHTML = '<p class="fb good">정답! 포도당·아미노산은 전부, 물과 무기염류는 대부분 다시 흡수돼 🎉</p>';
          await spread(['water', 'glu', 'amino', 'salt'], 'cap', 950);
          if (runId !== my) return;
          await sleep(600);
          $('panel').innerHTML =
            '<div class="row"><span class="chip on">② 재흡수</span></div>' +
            '<p class="q">그런데 요소는? 🧪</p>' +
            '<p class="sub">사실 <b>요소도 절반쯤은 다시 흡수돼.</b> 노폐물인데 왜 도로 가져갈까?<br><br>' +
            '콩팥 속 깊은 곳을 <b>진하게</b> 만들어 두어야 물을 끌어올 수 있거든. 그 진하게 만드는 재료로 요소를 쓰는 거야. ' +
            '버리러 가는 길에 물 퍼 올리는 도구로 한 번 써먹는 셈이지!</p>' +
            '<button class="pb main full" id="nurea">요소 따라가 보기 🧪</button>';
          $('nurea').onclick = async function () {
            $('nurea').disabled = true;
            await moveTo('urea', NPOS.cap[4][0], NPOS.cap[4][1], 1000);
            if (runId !== my) return;
            $('panel').innerHTML += '<p class="fb good">한 알은 혈액으로 돌아가고, 한 알은 오줌으로! 그래서 혈액에는 요소가 늘 조금 남아 있어.</p>';
            await sleep(900); step3();
          };
        });
    }

    function step3() {
      nbadge('s');
      var opts = ['여과되지 못하고 혈액에 남은 노폐물', '포도당', '단백질'];
      var done = false;
      $('panel').innerHTML =
        '<div class="row"><span class="chip on">③ 분비</span><span class="chip">틀린 횟수 ' + miss + '</span></div>' +
        '<p class="q">③ 분비: 모세 혈관에서 세뇨관으로 <b>한 번 더</b> 나오는 것은?</p>' +
        '<p class="sub">토리에서 미처 걸러지지 못하고 혈액에 남은 것들을 세뇨관으로 밀어 넣어. 여과를 <b>거드는</b> 과정이야.</p>' +
        '<div class="opts one" id="sopts"></div><p class="fb" id="fb"></p>';
      shuffle(opts).forEach(function (x) {
        var b = document.createElement('button');
        b.className = 'pb'; b.textContent = x;
        b.onclick = async function () {
          if (done) return;
          if (x !== opts[0]) { miss++; b.classList.add('wrong'); b.disabled = true; fb('땡! 몸에 필요한 물질은 버리지 않아', false); return; }
          done = true; b.classList.add('right'); fb('정답! 약물처럼 잘 걸러지지 않는 것들이 여기서 나와 🎉', true);
          await sleep(700); if (runId !== my) return; finish();
        };
        $('sopts').appendChild(b);
      });
    }

    async function finish() {
      nbadge('');
      await spread(['water2', 'urea2', 'salt'], 'out', 1200);
      if (runId !== my) return;
      try {
        confetti(); stampOn('콩팥<br>박사'); saveProg(curKey, { nephron: true });
        record({ system: cur.name, mode: '콩팥 실험실', score: miss, total: 3 });
      } catch (e) { }
      $('panel').innerHTML =
        '<div class="center"><div class="big">💧</div><p class="q">오줌 완성!</p>' +
        '<p class="sub">오줌에는 <b>물·요소·무기염류</b>가 들어 있어.<br>' +
        '포도당과 아미노산은 전부 다시 흡수돼서 <b>건강한 사람의 오줌에는 없어.</b><br>' +
        '그래서 오줌에 포도당이 나오면 몸 어딘가에 문제가 있다는 신호야!</p>' +
        '<p class="sub">틀린 횟수 ' + miss + '번</p></div>' + nextHint();
    }
  };


  /* ============ 8. 첫 화면 반영 ============ */
  try {
    if ($('scrHome') && !$('scrHome').classList.contains('hidden') && typeof student !== 'undefined' && student) goHome();
  } catch (e) { }
};

/* ============ 부팅: 원본 app.html 을 받아 띄우고 패치를 얹는다 ============ */
(function boot() {
  function fail(msg) {
    var b = document.getElementById('boot');
    if (b) b.innerHTML = '<div class="em">😵</div><p>' + msg + '<br><a href="/app">여기를 눌러 바로 들어가기</a></p>';
  }
  var p = window.__APP || fetch('/app', { cache: 'no-store' }).then(function (r) { return r.text(); });
  p.then(function (html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var scripts = [].slice.call(doc.querySelectorAll('script'));
    scripts.forEach(function (s) { s.parentNode.removeChild(s); });
    document.replaceChild(document.adoptNode(doc.documentElement), document.documentElement);
    scripts.forEach(function (s) {
      var n = document.createElement('script');
      if (s.src) n.src = s.getAttribute('src'); else n.textContent = s.textContent;
      document.body.appendChild(n);
    });
    window.__PATCH();
  }).catch(function () { fail('잠깐 불러오지 못했어요.'); });
})();
