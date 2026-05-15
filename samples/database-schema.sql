-- ============================================================
-- Peblo Study Workspace — Database Schema
-- Engine: SQLite (dev) / PostgreSQL (prod via Supabase)
-- ORM: SQLAlchemy 2.0
-- ============================================================

-- ------------------------------------------------------------
-- Table: users
-- Stores authenticated user accounts
-- ------------------------------------------------------------
CREATE TABLE users (
    id              TEXT PRIMARY KEY,          -- UUID v4
    name            TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,             -- bcrypt hash
    created_at      DATETIME DEFAULT (datetime('now'))
);

CREATE INDEX idx_users_email ON users(email);

-- ------------------------------------------------------------
-- Table: notes
-- Core notes with AI outputs and spaced repetition fields
-- ------------------------------------------------------------
CREATE TABLE notes (
    id              TEXT PRIMARY KEY,          -- UUID v4
    user_id         TEXT NOT NULL,             -- FK → users.id
    title           TEXT NOT NULL DEFAULT 'Untitled Note',
    content         TEXT DEFAULT '',
    category        TEXT DEFAULT 'General',    -- General | Study | Work | Personal | Research | Projects
    tags            TEXT DEFAULT '',           -- Comma-separated: "biology,class12,ncert"

    -- Visibility
    is_archived     BOOLEAN DEFAULT FALSE,
    is_public       BOOLEAN DEFAULT FALSE,
    share_id        TEXT UNIQUE,               -- 8-char public share token (e.g. "a3f8b2c1")

    -- AI-generated content (stored as JSON strings)
    ai_summary      TEXT,                      -- Plain text summary
    ai_key_points   TEXT,                      -- JSON array: ["point 1", "point 2"]
    ai_action_items TEXT,                      -- JSON array: ["action 1", "action 2"]
    ai_flashcards   TEXT,                      -- JSON array: [{"front": "Q", "back": "A"}]
    ai_quiz         TEXT,                      -- JSON array: [{"question": "...", "options": [...], "correct": 0}]
    ai_uses         INTEGER DEFAULT 0,         -- Total AI tool invocations on this note

    -- Spaced repetition (inspired by Anki/SM-2)
    quiz_score      INTEGER,                   -- Last quiz score as percentage (0–100)
    last_reviewed   DATETIME,                  -- Timestamp of last quiz attempt
    revision_count  INTEGER DEFAULT 0,         -- Total quiz attempts
    next_revision   DATETIME,                  -- Scheduled next review date
                                               -- Logic: <60% → +1 day | 60–79% → +3 days | ≥80% → +7 days

    created_at      DATETIME DEFAULT (datetime('now')),
    updated_at      DATETIME DEFAULT (datetime('now'))
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_share_id ON notes(share_id);

-- ============================================================
-- SAMPLE DATA (representative rows)
-- ============================================================

INSERT INTO users (id, name, email, hashed_password, created_at) VALUES
(
    '8f3da21b-456e-48cc-b3f1-ac16e9123456',
    'Arjun Sharma',
    'arjun@example.com',
    '$2b$12$KIXHk5dBn7mUjOCRWBpGPuP/9v.sample.hash.here',
    '2026-05-10 08:00:00'
),
(
    'c2e1f09a-789b-4d12-a5f3-bd27e8901234',
    'Priya Nair',
    'priya@example.com',
    '$2b$12$AnotherSampleHashedPasswordHere',
    '2026-05-12 10:30:00'
);

INSERT INTO notes (
    id, user_id, title, content, category, tags,
    is_archived, is_public, share_id,
    ai_summary, ai_key_points, ai_action_items, ai_uses,
    quiz_score, last_reviewed, revision_count, next_revision,
    created_at, updated_at
) VALUES
(
    'NOTE_001',
    '8f3da21b-456e-48cc-b3f1-ac16e9123456',
    'Photosynthesis — Light & Dark Reactions',
    'Photosynthesis is the process by which green plants synthesise nutrients from CO2 and water using sunlight...',
    'Study',
    'biology,class12,ncert',
    FALSE, TRUE, 'a3f8b2c1',
    'Photosynthesis converts light energy into glucose through light-dependent and light-independent reactions.',
    '["Light reactions occur in thylakoids","Calvin cycle occurs in stroma","Net output: glucose + oxygen"]',
    '["Draw Z-scheme diagram","Memorise Calvin cycle steps"]',
    3,
    80, '2026-05-15 14:00:00', 2, '2026-05-22 14:00:00',
    '2026-05-10 09:30:00', '2026-05-15 14:22:00'
),
(
    'NOTE_002',
    '8f3da21b-456e-48cc-b3f1-ac16e9123456',
    'DNA Replication',
    'DNA replication is the biological process of producing two identical replicas of DNA from one original...',
    'Study',
    'biology,genetics,class12',
    FALSE, FALSE, NULL,
    NULL, NULL, NULL, 0,
    55, '2026-05-14 10:00:00', 1, '2026-05-15 10:00:00',
    '2026-05-12 11:00:00', '2026-05-14 16:45:00'
),
(
    'NOTE_003',
    '8f3da21b-456e-48cc-b3f1-ac16e9123456',
    'Sprint Planning — Q3 2026',
    'Discussed product goals for Q3. Key initiatives: onboarding redesign, AI feature expansion...',
    'Work',
    'sprint,planning,q3',
    FALSE, FALSE, NULL,
    'Q3 sprint focused on onboarding redesign and expanding AI features with two key deliverables assigned.',
    '["Redesign onboarding flow","Expand AI integrations","Improve load times"]',
    '["Prepare UI mockups by Friday","Review API structure with backend team"]',
    1,
    NULL, NULL, 0, NULL,
    '2026-05-13 09:00:00', '2026-05-15 15:00:00'
);

-- ============================================================
-- SPACED REPETITION LOGIC (application layer — not SQL)
-- After POST /api/notes/{id}/quiz-result?score=X:
--
--   if score < 60:  next_revision = now + 1 day
--   elif score < 80: next_revision = now + 3 days
--   else:           next_revision = now + 7 days
--
-- Revision queue query:
--   SELECT * FROM notes
--   WHERE user_id = ? AND is_archived = 0
--   AND next_revision <= datetime('now')
--   ORDER BY next_revision ASC;
-- ============================================================
