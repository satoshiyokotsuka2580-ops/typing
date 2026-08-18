DROP INDEX IF EXISTS idx_rankings_mode_level_kps;
DROP INDEX IF EXISTS idx_rankings_mode_level_words;
CREATE INDEX IF NOT EXISTS idx_rankings_group_kps ON rankings(mode, level, duration, kps DESC);
CREATE INDEX IF NOT EXISTS idx_rankings_group_words ON rankings(mode, level, duration, words DESC, kps DESC);
