CREATE TABLE IF NOT EXISTS rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL CHECK(length(username) BETWEEN 1 AND 20),
  mode TEXT NOT NULL CHECK(mode IN ('english','japanese')),
  level TEXT NOT NULL CHECK(level IN ('beginner','intermediate','advanced')),
  duration INTEGER NOT NULL CHECK(duration IN (30,60,120)),
  kps REAL NOT NULL CHECK(kps BETWEEN 0 AND 30),
  words INTEGER NOT NULL CHECK(words BETWEEN 0 AND 1000),
  accuracy INTEGER NOT NULL CHECK(accuracy BETWEEN 0 AND 100),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_rankings_mode_level_kps ON rankings(mode, level, kps DESC);
CREATE INDEX IF NOT EXISTS idx_rankings_mode_level_words ON rankings(mode, level, words DESC);
