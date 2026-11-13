/* 학생 활동 기록 저장 — Upstash Redis (무료 플랜, 기록 하나 = 명령 1번)
   예전 Vercel Blob 저장소는 2026-11-09 에 버림 (무료 한도 초과로 정지됨) */
const clip = (v, n) => String(v ?? '').slice(0, n);
const RURL = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const RTOK = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

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
  if (req.method === 'OPTIONS') return res.status(204).end();   /* 다른 주소의 선생님 사이트에서 오는 요청 허용 */
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { return res.status(400).json({ error: 'json' }); } }
  if (!b || !b.name) return res.status(400).json({ error: 'name' });
  const now = Date.now();
  const at = Number(b.at);
  const rec = {
    id: clip(b.id || now + '-' + Math.random().toString(36).slice(2, 8), 40),
    cls: clip(b.cls, 3), num: clip(b.num, 3), name: clip(b.name, 12),
    system: clip(b.system, 12), mode: clip(b.mode, 12),
    score: Number(b.score) || 0, right: Number(b.right) || 0, total: Number(b.total) || 0,
    hp: b.hp == null ? null : Number(b.hp), sec: Number(b.sec) || 0,
    wrong: Array.isArray(b.wrong) ? b.wrong.slice(0, 20).map(w => clip(w, 80)) : [],
    /* 인터넷이 끊겨서 나중에 보낸 기록도 원래 시간으로 (최대 14일 전까지) */
    t: at && at <= now + 60000 && at > now - 14 * 864e5 ? at : now
  };
  try {
    if (RURL() && RTOK()) {
      /* 같은 id 로 두 번 와도 하나만 남음 */
      await redis(['HSET', 'ys:records', rec.id, JSON.stringify(rec)]);
    } else {
      return res.status(503).json({ error: 'nostore' });
    }
    res.status(200).json({ ok: true, id: rec.id });
  } catch (e) {
    res.status(500).json({ error: 'store', detail: String(e && e.message || e).slice(0, 120) });
  }
}
