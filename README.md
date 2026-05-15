# ⚡ Peblo AI Study Workspace

> **Peblo Full Stack Developer Challenge — May 2026**

An AI-powered collaborative notes workspace that transforms raw study notes into summaries, flashcards, quizzes, and smart spaced-repetition revision schedules.

<div align="center">

[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![SQLite](https://img.shields.io/badge/SQLite-dev-003b57?style=flat-square&logo=sqlite)](https://sqlite.org)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-f55036?style=flat-square)](https://console.groq.com)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel)](https://ai-notes-workspace-alpha.vercel.app)
[![Render](https://img.shields.io/badge/Render-deployed-46e3b7?style=flat-square&logo=render)](https://render.com)

**[🚀 Live Demo](https://ai-notes-workspace-alpha.vercel.app) · [📂 Sample Outputs](samples/)**

</div>

---

## 📖 Overview

Peblo Study Workspace is an AI-powered collaborative learning platform designed to help students organise, understand, and revise notes more effectively. It transforms raw study notes into intelligent learning resources — AI-generated summaries, flashcards, quizzes, key concepts, and action items — using the **Groq API** with **Llama 3.3 70B**.

The platform features a complete notes management workspace with create, edit, archive, categorise, and tag support, full-text search and filtering, and public sharing via unique share links viewable by anyone without login.

A standout feature is the **spaced repetition system** inspired by active recall techniques (Anki-style SM-2). After completing quizzes, users receive personalised revision schedules based on their score — lower scores trigger quicker intervals, higher scores extend the review window for long-term retention. The Revision Queue on the dashboard surfaces notes due today.

The blue-and-white design creates a calm, focused learning environment with full dark mode support for long study sessions.

---

## 📸 Screenshots

### 🏠 Dashboard

Greets the user by name with the current date. Displays four stat cards — **Total Notes**, **AI Uses**, **Due for Revision**, and **Notes This Week** — a **Revision Queue** showing notes due today, and a **Recent Notes** panel with a quick "Create one" link when empty.
<img width="2557" height="1313" alt="Screenshot 2026-05-15 164320" src="https://github.com/user-attachments/assets/d26e46a5-97ea-4676-aef6-3c6f9936fa1f" />

<img width="2558" height="1305" alt="Screenshot 2026-05-15 164437" src="https://github.com/user-attachments/assets/ec8d587a-af67-428c-8113-973a914e7149" />


---

### 📝 Notes Workspace

Three-panel layout:
- **Left** — search bar, **+ New Note** button, and category filter tabs (All / General / Study / Work / Personal / Research / Projects) with note list below showing title, category, time ago, and tags.
- **Centre** — full note editor with title, inline tag pills (`#imp`, `#hard`), a live **share URL bar** with copy button, and a **"Saved ✓"** auto-save indicator in the toolbar.
- **Right** — **AI Assistant** panel with three actions: **Summarize**, **Flashcards**, and **Generate Quiz**.

<img width="2559" height="1316" alt="Screenshot 2026-05-15 164506" src="https://github.com/user-attachments/assets/1fc02bc1-1e90-4c9a-8e05-07f9d983654b" />


---

### 📚 Flashcards

Progress bar across the top showing position (e.g. "Card 1 of 5"). A large blue card displays the question ("What is CPU scheduling?") with "Click to reveal answer" subtitle — clicking flips it with a 3D animation to show the answer. Navigation arrows to go back/forward, a **Mark as Hard** button to flag difficult cards, and a **Shuffle** control in the top-right.

On session completion: "All done! 🎉 You reviewed 5 cards · 1 marked as hard" with options to **Review hard cards (1)**, **Restart**, or **Back to Notes**.

| Flashcard Study | Session Complete |

<img width="2559" height="1320" alt="Screenshot 2026-05-15 161311" src="https://github.com/user-attachments/assets/eecd3798-193a-4916-9719-508c4c644303" />
<img width="2559" height="1307" alt="Screenshot 2026-05-15 161354" src="https://github.com/user-attachments/assets/3fc1bceb-b1a9-405e-9bd3-86fa45b3c8f1" />


---

### 🎯 Quiz & Results

After answering 5 AI-generated MCQs, a results screen shows:
- A **score ring** (e.g. **80% — Excellent! 🎉**, "You got 4 out of 5 correct")
- A **spaced repetition banner**: "Next revision in 7 days — Based on your score — spaced repetition scheduling"
- A full **answer breakdown** for each question: correct answers highlighted green, wrong answers in red, plus an explanation below each item

<img width="2557" height="1314" alt="Screenshot 2026-05-15 154954" src="https://github.com/user-attachments/assets/aa49cb62-ea98-467e-82f3-b2101254cf1a" />


---

### 📊 Analytics

"Your Learning Analytics — Track your study progress and AI usage" with:
- Three stat cards: **Total Notes**, **AI Generations**, **Revision Queue**
- **Top Tags** cloud (shows most-used note tags)
- **Recent Activity** feed
- **AI Usage** breakdown tile showing total AI tool calls across Summaries · Flashcards · Quizzes
- **Revision Health** panel — shows "All caught up! No notes pending revision" when the queue is empty

<img width="2559" height="1534" alt="Screenshot 2026-05-15 151129" src="https://github.com/user-attachments/assets/4ddaf83a-e2bc-4934-8c96-afaddc8a2f2e" />


---

### 🌐 Public Share Page

A clean public view of a shared note — the Peblo Study header, full note content rendered as plain text, and a blue CTA banner at the bottom: **"Want AI summaries for your own notes? — Summarize, quiz, and schedule revisions — free forever → Try Peblo Study free"**. No login required for viewers.

<img width="2559" height="1311" alt="Screenshot 2026-05-15 155107" src="https://github.com/user-attachments/assets/4256b648-a237-46a2-8490-db8b7f04a14a" />


---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 **JWT Authentication** | Signup · login · persistent sessions · bcrypt password hashing (cost=12) |
| 📝 **Notes Workspace** | Create · edit · tag · categorise · archive · auto-save with 1.5 s debounce · "Saved ✓" indicator |
| 🤖 **AI Integration** | Summaries · key points · action items · suggested titles via Groq / Llama 3.3 70B |
| 📚 **Flashcards** | AI-generated · progress bar · 3D flip animation · shuffle · hard-card tracking · session summary |
| 🎯 **Quiz Engine** | AI-generated MCQs · colour-coded answer review · per-question explanations · score tracking |
| 🔄 **Spaced Repetition** | Quiz score → next revision in 1 / 3 / 7 days · revision queue on dashboard · SM-2 logic |
| 🔍 **Search & Filter** | Full-text search · category filter tabs · tag filters · sort by last updated |
| 🔗 **Public Sharing** | Unique 8-char share token · live share URL bar in editor · public `/share/:id` · no login required |
| 📊 **Analytics Dashboard** | Total notes · AI generations · revision queue · top tags · recent activity · AI usage · revision health |
| 🌙 **Dark Mode** | Full dark/light toggle in sidebar · persisted via CSS variables |

---

## 🗄️ Database Schema

<div align="center">

![Database Schema](samples/database-diagram.svg)

</div>

### Tables

#### `users`

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK) | UUID v4 |
| `name` | TEXT | Display name |
| `email` | TEXT (UNIQUE, INDEX) | Login identifier |
| `hashed_password` | TEXT | bcrypt, cost=12 |
| `created_at` | DATETIME | Auto-set on insert |

#### `notes`

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK) | UUID v4 |
| `user_id` | TEXT (FK, INDEX) | → users.id |
| `title` | TEXT | Default: "Untitled Note" |
| `content` | TEXT | Full note body |
| `category` | TEXT | General · Study · Work · Personal · Research · Projects |
| `tags` | TEXT | Comma-separated e.g. `"#imp,#hard"` |
| `is_archived` | BOOLEAN | Soft archive — hidden from default list |
| `is_public` | BOOLEAN | Enables public share page |
| `share_id` | TEXT (UNIQUE) | 8-char random token for public URL |
| `ai_summary` | TEXT 🤖 | Stored after Summarize action |
| `ai_key_points` | TEXT 🤖 | JSON array of strings |
| `ai_action_items` | TEXT 🤖 | JSON array of strings |
| `ai_flashcards` | TEXT 🤖 | JSON array of `{front, back}` objects |
| `ai_quiz` | TEXT 🤖 | JSON array of MCQ objects |
| `ai_uses` | INTEGER 🤖 | Analytics counter — incremented on each AI call |
| `quiz_score` | INTEGER 🔄 | Last quiz result as percentage (0–100) |
| `last_reviewed` | DATETIME 🔄 | Timestamp of last quiz attempt |
| `revision_count` | INTEGER 🔄 | Total number of quiz attempts |
| `next_revision` | DATETIME 🔄 | Scheduled next review date |
| `created_at` | DATETIME | Auto-set on insert |
| `updated_at` | DATETIME | Auto-updated on every save |

> 🔄 = Spaced repetition field &nbsp;·&nbsp; 🤖 = AI-generated field

---

## 🔄 Spaced Repetition Logic

After every quiz, `next_revision` is computed from the score and shown immediately as a banner on the results screen:

```
quiz score  < 60%  →  next_revision = now + 1 day   (needs more work)
quiz score 60–79%  →  next_revision = now + 3 days  (good progress)
quiz score  ≥ 80%  →  next_revision = now + 7 days  (strong retention)
```

This mirrors Anki's SM-2 algorithm: material you struggle with appears sooner, material you know well is deferred. The **Revision Queue** on the dashboard surfaces notes that are due for review today.

---

## 🧠 AI Integration

All AI features are powered by **Groq API** with **Llama 3.3 70B Versatile**. The free tier provides 14,400 requests/day — more than enough for individual student use. Results are cached in the database so subsequent opens don't re-call the API.

```python
# backend/app/services/ai_service.py
client = Groq(api_key=settings.GROQ_API_KEY)
MODEL  = "llama-3.3-70b-versatile"
```

| Endpoint | What the AI Returns |
|---|---|
| `POST /api/notes/:id/summarize` | Concise summary · bullet key points · action items · suggested title |
| `POST /api/notes/:id/flashcards` | 5 `{front, back}` flashcard objects |
| `POST /api/notes/:id/quiz` | 5 MCQ objects with options array, correct index, and explanation |

Each call increments `ai_uses` on the note for analytics tracking.

**Sample AI output** → [`samples/ai-outputs.json`](samples/ai-outputs.json)

---

## 🔌 API Reference

Full interactive docs at **`/docs`** (Swagger UI) and **`/redoc`** (ReDoc).

```
# Auth
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me

# Notes CRUD
GET    /api/notes                         ?search=&category=&tag=&archived=
POST   /api/notes
GET    /api/notes/:id
PATCH  /api/notes/:id
DELETE /api/notes/:id

# AI Features
POST   /api/notes/:id/summarize
POST   /api/notes/:id/flashcards
POST   /api/notes/:id/quiz
POST   /api/notes/:id/quiz-result?score=80

# Sharing
POST   /api/notes/:id/share
POST   /api/notes/:id/unshare

# Spaced Repetition & Analytics
GET    /api/notes/revision/queue
GET    /api/notes/analytics/stats

# Public — no auth required
GET    /api/shared/:shareId
```

📄 **Sample API Responses:** [`api-responses.json`](./samples/api-responses.json)

---

## 🏗️ Architecture

```
peblo-study-workspace/
│
├── frontend/                        # React 18 + Vite + Tailwind CSS
│   └── src/
│       ├── api/
│       │   └── client.js            # Axios instance with JWT interceptor
│       ├── store/
│       │   ├── authStore.js         # Zustand — user session state
│       │   └── noteStore.js         # Zustand — notes list & active note
│       ├── components/
│       │   ├── Layout.jsx           # Sidebar + nav shell (Dashboard / My Notes / Analytics)
│       │   └── PrivateRoute.jsx     # Auth guard for protected pages
│       └── pages/
│           ├── Landing.jsx          # Marketing / hero page
│           ├── Login.jsx            # Login form
│           ├── Signup.jsx           # Registration form
│           ├── Dashboard.jsx        # Greeting + stats + revision queue + recent notes
│           ├── NotesWorkspace.jsx   # Three-panel editor with AI Assistant sidebar
│           ├── FlashcardsPage.jsx   # Progress bar + flip card + hard-card session
│           ├── QuizPage.jsx         # MCQ quiz + score ring + spaced repetition banner
│           ├── AnalyticsPage.jsx    # Stats + top tags + AI usage + revision health
│           └── SharedNote.jsx       # Public view — no login required
│
├── backend/                         # FastAPI + SQLAlchemy 2.0
│   └── app/
│       ├── api/
│       │   ├── auth.py              # /api/auth/* endpoints
│       │   ├── notes.py             # /api/notes/* endpoints + AI triggers
│       │   └── shared.py            # /api/shared/:shareId (public)
│       ├── models/
│       │   ├── user.py              # SQLAlchemy User ORM model
│       │   └── note.py              # SQLAlchemy Note ORM model
│       ├── schemas/                 # Pydantic request/response schemas
│       ├── services/
│       │   └── ai_service.py        # Groq client — summarize / flashcards / quiz
│       └── core/
│           ├── config.py            # Settings via Pydantic BaseSettings
│           ├── database.py          # SQLAlchemy engine + session factory
│           └── auth.py              # JWT creation, verification, bcrypt helpers
│
└── samples/                         # 📋 Submission samples
    ├── screenshots/                 # UI screenshots (all pages)
    ├── database-diagram.svg         # Visual entity-relationship diagram
    ├── api-responses.json           # Example responses for all 14 endpoints
    ├── ai-outputs.json              # Real Groq AI-generated summary, flashcards, quiz
    ├── database-schema.sql          # Full SQL schema with sample INSERT data
    └── sample-outputs.html          # Polished visual samples document
```

---

## 🚀 Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- A free [Groq API key](https://console.groq.com) — no credit card needed

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in GROQ_API_KEY and JWT_SECRET in .env
uvicorn app.main:app --reload --port 8000
```

Visit **http://localhost:8000/docs** for the interactive Swagger UI.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# .env already points to http://localhost:8000
npm run dev
```

Visit **http://localhost:5173**

---

## ⚙️ Environment Variables

### `backend/.env`

```env
DATABASE_URL=sqlite:///./peblo.db
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
```

---

## 🆓 Getting a Free Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up — no credit card required
3. Create an API key
4. Paste it into `backend/.env` as `GROQ_API_KEY`
5. Free tier: **14,400 requests/day** on Llama 3.3 70B

---

## ☁️ Deployment

### Backend → Render (Free)

1. Push `backend/` to GitHub
2. Render → **New Web Service** → connect repo
3. Root Directory: `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables from `.env`
7. For production DB: create a free [Supabase](https://supabase.com) project → paste the PostgreSQL connection string as `DATABASE_URL` → add `psycopg2-binary` to `requirements.txt`

### Frontend → Vercel (Free)

1. Push `frontend/` to GitHub
2. Vercel → **New Project** → import repo
3. Root Directory: `frontend` · Framework: **Vite**
4. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com`
5. Add `frontend/vercel.json` for SPA routing (fixes blank screen on page refresh):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

6. Deploy — redeploy after adding env vars for changes to take effect

---

## 📦 Sample Outputs

All submission samples are in the [`samples/`](samples/) folder:

| File | Contents |
|---|---|
| [`database-diagram.svg`](samples/database-diagram.svg) | Visual entity-relationship diagram |
| [`api-responses.json`](samples/api-responses.json) | Example responses for all 14 endpoints |
| [`ai-outputs.json`](samples/ai-outputs.json) | Real Groq AI-generated summary, flashcards, quiz |
| [`database-schema.sql`](samples/database-schema.sql) | Full SQL schema with sample INSERT data |
| [`sample-outputs.html`](samples/sample-outputs.html) | Polished visual samples document |

---

## 🛠️ Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast dev server, HMR, industry standard |
| Styling | Tailwind CSS | Utility-first, consistent design tokens |
| State | Zustand | Lightweight global state, no boilerplate |
| Routing | React Router v6 | Declarative nested routes + protected routes |
| HTTP | Axios | JWT interceptor for auth headers |
| Backend | FastAPI | Auto-docs, async, Pydantic validation |
| ORM | SQLAlchemy 2.0 | Clean model definitions, easy migrations |
| Database | SQLite → Supabase | Zero-config dev, free managed Postgres in prod |
| AI | Groq / Llama 3.3 70B | Free tier, sub-second inference |
| Auth | JWT + bcrypt | Secure, stateless, no third-party dependency |
| Deploy | Vercel + Render | Both on free forever tiers |

---

## ✅ Submission Checklist

- [x] No secrets committed — `.env` in `.gitignore`
- [x] `.env.example` files for both frontend and backend
- [x] All 6 required features: Auth · Notes · AI · Search · Share · Analytics
- [x] Spaced repetition scheduling — quiz score → next revision date shown immediately on results screen
- [x] Auto-save with 1.5 s debounce + **"Saved ✓"** indicator in editor toolbar
- [x] Dark mode toggle in sidebar
- [x] Public share pages — live share URL bar in editor, no login required for viewers
- [x] Interactive API docs at `/docs`
- [x] Deployed: Vercel (frontend) + Render (backend)
- [x] Sample outputs in `samples/` folder
- [x] README explains architecture, features, and setup clearly

---

*Built for the Peblo Full Stack Developer Challenge · May 2026*
