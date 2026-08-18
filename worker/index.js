const MODES = new Set(["english", "japanese"]);
const LEVELS = new Set([
  "beginner",
  "intermediate",
  "advanced",
]);
const DURATIONS = new Set([30, 60, 120]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function getRankings(request, env) {
  const url = new URL(request.url);

  const mode = url.searchParams.get("mode");
  const level = url.searchParams.get("level");
  const duration = Number(
    url.searchParams.get("duration")
  );

  if (
    !MODES.has(mode) ||
    !LEVELS.has(level) ||
    !DURATIONS.has(duration)
  ) {
    return json(
      {
        error: "Invalid mode, level, or duration",
      },
      400
    );
  }

  const result = await env.DB.prepare(`
    SELECT
      id,
      username,
      mode,
      level,
      duration,
      kps,
      words,
      accuracy,
      created_at
    FROM rankings
    WHERE mode = ?
      AND level = ?
      AND duration = ?
    ORDER BY created_at DESC
    LIMIT 200
  `)
    .bind(mode, level, duration)
    .all();

  return json({
    results: result.results || [],
  });
}

async function saveRanking(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json(
      {
        error: "Invalid JSON",
      },
      400
    );
  }

  const username = String(
    body.username || ""
  )
    .trim()
    .slice(0, 20);

  const mode = String(body.mode || "");
  const level = String(body.level || "");
  const duration = Number(body.duration);
  const kps = Number(body.kps);
  const words = Number(body.words);
  const accuracy = Number(body.accuracy);

  if (
    !username ||
    !MODES.has(mode) ||
    !LEVELS.has(level) ||
    !DURATIONS.has(duration)
  ) {
    return json(
      {
        error: "Invalid input",
      },
      400
    );
  }

  if (
    !Number.isFinite(kps) ||
    !Number.isFinite(words) ||
    !Number.isFinite(accuracy) ||
    kps < 0 ||
    kps > 30 ||
    words < 0 ||
    words > 1000 ||
    accuracy < 0 ||
    accuracy > 100
  ) {
    return json(
      {
        error: "Score out of range",
      },
      400
    );
  }

  await env.DB.prepare(`
    INSERT INTO rankings (
      username,
      mode,
      level,
      duration,
      kps,
      words,
      accuracy
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      username,
      mode,
      level,
      duration,
      Math.round(kps * 1000) / 1000,
      Math.floor(words),
      Math.round(accuracy)
    )
    .run();

  return json(
    {
      ok: true,
    },
    201
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/rankings") {
      if (!env.DB) {
        return json(
          {
            error: "D1 binding DB is not configured",
          },
          503
        );
      }

      if (request.method === "GET") {
        return getRankings(request, env);
      }

      if (request.method === "POST") {
        return saveRanking(request, env);
      }

      return json(
        {
          error: "Method not allowed",
        },
        405
      );
    }

    return env.ASSETS.fetch(request);
  },
};
