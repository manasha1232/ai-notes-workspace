# ⚡ Peblo AI Study Workspace

> **Peblo Full Stack Developer Challenge — May 2026**

An AI-powered collaborative notes workspace that transforms raw study notes into summaries, flashcards, quizzes, and smart spaced-repetition revision schedules.

<div align="center">

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)
![SQLite](https://img.shields.io/badge/SQLite-dev-003b57?style=flat-square&logo=sqlite)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-f55036?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Render-deployed-46e3b7?style=flat-square&logo=render)

</div>

---

## 📸 Screenshots

| Landing Page | Notes Workspace |
|---|---|
| ![Landing](samples/screenshots/landing.png) | ![Notes](samples/screenshots/notes-workspace.png) |

| Dashboard | Quiz |
|---|---|
| ![Dashboard](samples/screenshots/dashboard.png) | ![Quiz](samples/screenshots/quiz.png) |

| Flashcards | Analytics |
|---|---|
| ![Flashcards](samples/screenshots/flashcards.png) | ![Analytics](samples/screenshots/analytics.png) |

> 📂 All screenshots in [`samples/screenshots/`](samples/screenshots/)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 **JWT Auth** | Signup · login · persistent sessions · bcrypt password hashing |
| 📝 **Notes Workspace** | Create · edit · tag · categorise · archive · auto-save with 1.5s debounce |
| 🤖 **AI Integration** | Summaries · key points · action items · suggested titles via Groq / Llama 3.3 |
| 📚 **Flashcards** | AI-generated · 3D flip animation · shuffle · hard-card tracking |
| 🎯 **Quiz Engine** | AI-generated MCQs · answer explanations · score tracking |
| 🔄 **Spaced Repetition** | Quiz score → next revision in 1 / 3 / 7 days (Anki-style SM-2 logic) |
| 🔍 **Search & Filter** | Full-text search · category filters · tag filters · sort by updated |
| 🔗 **Public Sharing** | Unique 8-char share token · public `/share/:id` page · no login required |
| 📊 **Analytics Dashboard** | Total notes · AI uses · revision queue · top tags · weekly activity |
| 🌙 **Dark Mode** | Full dark/light toggle via CSS variables |

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
| `created_at` | DATETIME | Auto |

#### `notes`
| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK) | UUID v4 |
| `user_id` | TEXT (FK, INDEX) | → users.id |
| `title` | TEXT | Default: "Untitled Note" |
| `content` | TEXT | Full note body |
| `category` | TEXT | General \| Study \| Work \| Personal \| Research \| Projects |
| `tags` | TEXT | Comma-separated: `"biology,ncert"` |
| `is_archived` | BOOLEAN | Soft archive |
| `is_public` | BOOLEAN | Enables share page |
| `share_id` | TEXT (UNIQUE) | 8-char public token |
| `ai_summary` | TEXT 🤖 | Stored after Summarize |
| `ai_key_points` | TEXT 🤖 | JSON array |
| `ai_action_items` | TEXT 🤖 | JSON array |
| `ai_flashcards` | TEXT 🤖 | JSON array of `{front, back}` |
| `ai_quiz` | TEXT 🤖 | JSON array of MCQ objects |
| `ai_uses` | INTEGER 🤖 | Analytics counter |
| `quiz_score` | INTEGER 🔄 | Last quiz % (0–100) |
| `last_reviewed` | DATETIME 🔄 | Last quiz timestamp |
| `revision_count` | INTEGER 🔄 | Total quiz attempts |
| `next_revision` | DATETIME 🔄 | Scheduled review date |
| `created_at` | DATETIME | Auto |
| `updated_at` | DATETIME | Auto-updated on save |

> 🔄 = Spaced repetition field · 🤖 = AI-generated field

### Spaced Repetition Logic

```
quiz score < 60%  →  next_revision = now + 1 day   (needs more work)
quiz score 60–79% →  next_revision = now + 3 days  (good progress)
quiz score ≥ 80%  →  next_revision = now + 7 days  (strong retention)
```

---

## 🧠 AI Integration

All AI features use **Groq API** with **Llama 3.3 70B** (free tier — 14,400 req/day).

```python
# services/ai_service.py
client = Groq(api_key=settings.GROQ_API_KEY)
MODEL  = "llama-3.3-70b-versatile"
```

| Endpoint | AI Output |
|---|---|
| `POST /api/notes/:id/summarize` | Summary · key points · action items · suggested title |
| `POST /api/notes/:id/flashcards` | 5 `{front, back}` flashcard objects |
| `POST /api/notes/:id/quiz` | 5 MCQ objects with options, correct index, explanation |

**Sample AI output** — [`samples/ai-outputs.json`](samples/ai-outputs.json)

---

## 🔌 API Reference

Full interactive docs auto-generated at **`http://localhost:8000/docs`** (Swagger UI).

```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me

GET    /api/notes                        ?search=&category=&tag=&archived=
POST   /api/notes
GET    /api/notes/:id
PATCH  /api/notes/:id
DELETE /api/notes/:id

POST   /api/notes/:id/summarize
POST   /api/notes/:id/flashcards
POST   /api/notes/:id/quiz
POST   /api/notes/:id/quiz-result?score=80
POST   /api/notes/:id/share
POST   /api/notes/:id/unshare

GET    /api/notes/revision/queue
GET    /api/notes/analytics/stats

GET    /api/shared/:shareId              (no auth)
```

**Sample API responses** — [`samples/api-responses.json`](samples/api-responses.json)

---

## 🏗️ Architecture

```
peblo-study-workspace/
├── frontend/                    # React 18 + Vite + Tailwind CSS
│   └── src/
│       ├── api/client.js        # Axios + JWT interceptor
│       ├── store/               # Zustand (authStore, noteStore)
│       ├── components/          # Layout, PrivateRoute
│       └── pages/               # Landing, Login, Signup, Dashboard,
│                                #   NotesWorkspace, FlashcardsPage,
│                                #   QuizPage, AnalyticsPage, SharedNote
│
├── backend/                     # FastAPI + SQLAlchemy
│   └── app/
│       ├── api/                 # auth.py · notes.py · shared.py
│       ├── models/              # user.py · note.py (SQLAlchemy ORM)
│       ├── schemas/             # Pydantic request/response schemas
│       ├── services/            # ai_service.py (Groq integration)
│       └── core/                # config · database · auth (JWT)
│
└── samples/                     # 📋 Submission samples
    ├── database-diagram.svg     # Visual schema diagram
    ├── api-responses.json       # Example API responses
    ├── ai-outputs.json          # Real AI-generated content
    ├── database-schema.sql      # Full SQL schema + sample data
    └── sample-outputs.html      # Complete visual samples doc
```

---

## 🚀 Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# → Fill in GROQ_API_KEY and JWT_SECRET in .env
uvicorn app.main:app --reload --port 8000
```

Visit **http://localhost:8000/docs** for interactive Swagger UI.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# → .env already set to http://localhost:8000
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
4. Add env variable: `VITE_API_URL=https://your-render-url.onrender.com`
5. Deploy

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
| Frontend | React 18 + Vite | Fast dev, industry standard |
| Styling | Tailwind CSS | Utility-first, consistent |
| State | Zustand | Lightweight, no boilerplate |
| Routing | React Router v6 | Declarative, nested routes |
| Backend | FastAPI | Auto-docs, async, Pydantic |
| ORM | SQLAlchemy 2.0 | Clean models, easy migration |
| Database | SQLite → Supabase | Zero config dev, free prod |
| AI | Groq / Llama 3.3 | Free tier, blazing fast |
| Auth | JWT + bcrypt | Secure, no third-party dependency |
| Deploy | Vercel + Render | Both free forever tiers |

---

*Built for the Peblo Full Stack Developer Challenge · May 2026*
