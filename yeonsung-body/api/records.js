/* 선생님 기록 조회 · 상태 확인 · 전체 삭제 (Upstash Redis)
   GET    /api/records?status=1  → 저장소 상태 (PIN 필요 없음, 비밀 값은 안 보여 줌)
   GET    /api/records           → 전체 기록 (코드 없이)
   DELETE /api/records?pin=…     → 전체 삭제 */
const RURL = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const RTOK = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const hasRedis = () => !!(RURL() && RTOK());
const KEY = 'ys:records';

async function redis(cmd) {
  const r = await fetch(RURL(), {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + RTOK(), 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(j.error || 'redis ' + r.status);
  return j.result;
}
const errText = e => String(e && e.message || e).slice(0, 160);

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();   /* 다른 주소의 선생님 사이트에서 오는 요청 허용 */

  if (req.method === 'GET' && req.query.status) {
    const s = { store: hasRedis() ? 'redis' : 'none', ok: false };
    try { if (hasRedis()) { s.count = await redis(['HLEN', KEY]); s.ok = true; } } catch (e) { s.error = errText(e); }
    return res.status(200).json(s);
  }

  if (!hasRedis()) return res.status(503).json({ error: 'nostore' });

  try {
    /* 전체 삭제만 선생님 코드(TEACHER_PIN) 필요. 보기는 코드 없이 (선생님 결정, 2026-11-09) */
    if (req.method === 'DELETE') {
      const pin = (req.query.pin || (req.body && req.body.pin) || '').toString();
      if (!process.env.TEACHER_PIN || pin !== process.env.TEACHER_PIN) return res.status(401).json({ error: 'pin' });
      const deleted = (await redis(['HLEN', KEY])) || 0;
      await redis(['DEL', KEY]);
      return res.status(200).json({ ok: true, deleted });
    }
    const vals = (await redis(['HVALS', KEY])) || [];
    res.status(200).json(vals.map(v => { try { return JSON.parse(v); } catch { return null; } }).filter(Boolean));
  } catch (e) {
    res.status(500).json({ error: 'store', detail: errText(e) });
  }
}
