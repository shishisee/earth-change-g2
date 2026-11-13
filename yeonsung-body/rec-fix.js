/* 기록 전송 수정판 — patch.js 가 끝난 뒤 record() 를 바꿔 끼운다.
   기록을 먼저 이 기기에 줄 세워 두고 하나씩 보냄. 인터넷이나 서버가 잠깐 안 되면 나중에 다시 보냄.
   heart-fix.js 다음, patch.js 앞에 로드해야 함. */
(function () {
  'use strict';
  var d = Object.getOwnPropertyDescriptor(window, '__PATCH');
  var mine = null;
  Object.defineProperty(window, '__PATCH', {
    configurable: true,
    get: function () { return mine; },
    set: function (f) {
      var inner = f;
      if (d && d.set) { d.set.call(window, f); inner = d.get.call(window); }
      mine = function () { inner.apply(this, arguments); install(); };
    }
  });

  var OUT = 'ys-outbox', sending = false;
  function load() { try { return JSON.parse(localStorage.getItem(OUT)) || []; } catch (e) { return []; } }
  function save(q) { try { localStorage.setItem(OUT, JSON.stringify(q.slice(-300))); } catch (e) { } }
  function flush() {
    if (sending) return;
    var q = load(); if (!q.length) return;
    sending = true;
    var item = q[0];
    fetch('/api/record', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item), keepalive: true })
      .then(function (r) {
        sending = false;
        if (r.ok || r.status === 400) {   /* 400 = 고장 난 기록 → 버림 */
          save(load().filter(function (x) { return x.id !== item.id; }));
          if (r.ok) try { toast('📮 선생님께 기록 전송 완료'); } catch (e) { }
          flush();
        }
      })
      .catch(function () { sending = false; });
  }

  function install() {
    window.record = function record(p) {
      if (typeof student === 'undefined' || !student || !p) return;
      var item = {};
      [student, p].forEach(function (o) { for (var k in o) item[k] = o[k]; });
      item.mode = String(item.mode || '').replace(/퀄즈/g, '퀴즈');
      item.system = String(item.system || '').replace(/퀄즈/g, '퀴즈');
      item.id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
      item.at = Date.now();
      var q = load(); q.push(item); save(q);
      flush();
    };
    /* 교사 모드일 때 '📋 기록 보기' 링크 */
    var gh = window.goHome;
    window.goHome = function goHome() {
      gh.apply(this, arguments);
      try {
        var w = document.getElementById('who');
        if (w && sessionStorage.getItem('ys-teacher') === '1' && !document.getElementById('tchLink')) {
          var a = document.createElement('a');
          a.id = 'tchLink'; a.href = '/teacher'; a.textContent = '📋 기록 보기';
          a.style.cssText = 'margin-left:6px;font-size:13px;color:inherit';
          w.appendChild(a);
        }
      } catch (e) { }
    };
    try { if (!document.getElementById('scrHome').classList.contains('hidden')) window.goHome(); } catch (e) { }
    setInterval(flush, 45000);
    window.addEventListener('online', flush);
    setTimeout(flush, 1500);
  }
})();
