const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});
const MODES = new Set(["english", "japanese"]);
const LEVELS = new Set(["beginner", "intermediate", "advanced"]);

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is not configured" }, 503);
  const url = new URL(request.url), mode = url.searchParams.get("mode"), level = url.searchParams.get("level"), duration = Number(url.searchParams.get("duration"));
  if (!MODES.has(mode) || !LEVELS.has(level) || ![30,60,120].includes(duration)) return json({ error: "Invalid mode or level" }, 400);
  const { results = [] } = await env.DB.prepare(`
    SELECT id, username, mode, level, duration, kps, words, accuracy, created_at
    FROM rankings WHERE mode = ? AND level = ? AND duration = ?
    ORDER BY created_at DESC LIMIT 200
  `).bind(mode, level, duration).all();
  return json({ results });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "D1 binding DB is not configured" }, 503);
  let body; try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const username = String(body.username || "").trim().slice(0, 20);
  const mode = String(body.mode || ""), level = String(body.level || "");
  const duration = Number(body.duration), kps = Number(body.kps), words = Number(body.words), accuracy = Number(body.accuracy);
  if (!username || !MODES.has(mode) || !LEVELS.has(level) || ![30,60,120].includes(duration)) return json({ error: "Invalid input" }, 400);
  if (![kps, words, accuracy].every(Number.isFinite) || kps < 0 || kps > 30 || words < 0 || words > 1000 || accuracy < 0 || accuracy > 100) return json({ error: "Score out of range" }, 400);
  await env.DB.prepare(`INSERT INTO rankings (username, mode, level, duration, kps, words, accuracy) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .bind(username, mode, level, duration, Math.round(kps * 1000) / 1000, Math.floor(words), Math.round(accuracy)).run();
  return json({ ok: true }, 201);
}
