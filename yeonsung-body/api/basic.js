/* 기초 탐험(/basic) 학생 기록 — 같은 무료 Upstash Redis, 키만 따로 (yb:records)
   POST   /api/basic                 학생 기록 1개 저장
   GET    /api/basic?status=1        저장소 상태
   GET    /api/basic?pin=2023        전체 기록 (교사 코드)
   DELETE /api/basic?pin=2023        전체 삭제 */
const RURL = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const RTOK = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = 'yb:records', PIN = '2023';
const clip = (v, n) => String(v ?? '').slice(0, n);

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

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!RURL() || !RTOK()) return res.status(503).json({ error: 'nostore' });
  try {
    if (req.method === 'POST') {
      let b = req.body;
      if (typeof b === 'string') { try { b = JSON.parse(b); } catch { return res.status(400).json({ error: 'json' }); } }
      if (!b || !b.name) return res.status(400).json({ error: 'name' });
      const now = Date.now(), at = Number(b.at);
      const rec = {
        id: clip(b.id || now.toString(36) + Math.random().toString(36).slice(2, 7), 40),
        cls: clip(b.cls, 3), num: clip(b.num, 3), name: clip(b.name, 12),
        type: clip(b.type, 8), room: clip(b.room, 8), step: Number(b.step) || 0, title: clip(b.title, 30),
        right: Number(b.right) || 0, total: Number(b.total) || 0, sec: Number(b.sec) || 0,
        wrong: Array.isArray(b.wrong) ? b.wrong.slice(0, 30).map(w => clip(w, 80)) : [],
        filled: Number(b.filled) || 0, all: Number(b.all) || 0,
        t: at && at <= now + 60000 && at > now - 14 * 864e5 ? at : now
      };
      await redis(['HSET', KEY, rec.id, JSON.stringify(rec)]);
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'GET' && req.query.status) return res.status(200).json({ ok: true, count: await redis(['HLEN', KEY]) });
    if (String(req.query.pin || '') !== PIN) return res.status(401).json({ error: 'pin' });
    if (req.method === 'DELETE') { await redis(['DEL', KEY]); return res.status(200).json({ ok: true }); }
    const vals = (await redis(['HVALS', KEY])) || [];
    return res.status(200).json(vals.map(v => { try { return JSON.parse(v); } catch { return null; } }).filter(Boolean));
  } catch (e) {
    return res.status(500).json({ error: 'store', detail: String(e && e.message || e).slice(0, 120) });
  }
}
