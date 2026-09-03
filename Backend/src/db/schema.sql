CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  is_registered INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id),
  base_currency TEXT NOT NULL,
  target_currency TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, base_currency, target_currency)
);

CREATE TABLE IF NOT EXISTS conversion_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id),
  base_currency TEXT NOT NULL,
  target_currency TEXT NOT NULL,
  amount REAL NOT NULL,
  converted_amount REAL NOT NULL,
  rate REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rate_cache (
  base_currency TEXT NOT NULL,
  target_currency TEXT NOT NULL,
  rate REAL NOT NULL,
  fetched_at TEXT NOT NULL,
  PRIMARY KEY (base_currency, target_currency)
);
