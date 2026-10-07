CREATE TABLE IF NOT EXISTS pro_accounts (
  session_id TEXT PRIMARY KEY,
  customer TEXT,
  subscription TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  key_hash TEXT UNIQUE,
  created INTEGER,
  claimed INTEGER
);
CREATE INDEX IF NOT EXISTS pro_sub ON pro_accounts (subscription);
CREATE TABLE IF NOT EXISTS api_calls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  kind TEXT NOT NULL,
  zip TEXT,
  ok INTEGER,
  tx TEXT
);
CREATE TABLE IF NOT EXISTS hits (
  k TEXT PRIMARY KEY,
  n INTEGER NOT NULL,
  exp INTEGER NOT NULL
);
