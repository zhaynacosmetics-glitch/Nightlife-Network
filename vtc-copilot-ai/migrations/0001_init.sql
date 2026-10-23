-- Waitlist VTC Copilot AI : schéma initial.

CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,              -- normalisé (minuscules, sans espaces)
  first_name TEXT NOT NULL,
  zone TEXT,                               -- département ou zone d'activité, facultatif
  consent_marketing INTEGER NOT NULL CHECK (consent_marketing = 1),
  consent_research INTEGER NOT NULL DEFAULT 0,
  consent_text_version TEXT NOT NULL,      -- version du texte de consentement affiché
  delete_token_hash TEXT NOT NULL,         -- SHA-256 du jeton de suppression (le jeton n'est jamais stocké en clair)
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist (created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_token ON waitlist (delete_token_hash);

CREATE TABLE IF NOT EXISTS contact_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  organisation TEXT,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Limitation de débit : empreinte d'IP hachée avec un secret, purgée après 24 h.
CREATE TABLE IF NOT EXISTS rate_events (
  ip_hash TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at INTEGER NOT NULL              -- epoch ms
);

CREATE INDEX IF NOT EXISTS idx_rate_lookup ON rate_events (ip_hash, action, created_at);
