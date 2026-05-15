# Peblo AI Study Workspace

An AI-powered collaborative notes workspace that transforms raw notes into summaries, flashcards, quizzes, and smart revision schedules.

## Features

- **JWT Auth** — Signup, login, persistent sessions
- **Notes Workspace** — Create, edit, tag, categorise, archive, auto-save with debounce
- **AI Integration** — Summaries, key points, action items, flashcards, quizzes (via Groq/Llama 3.3)
- **Spaced Repetition** — Quiz scores determine next revision date (1/3/7 days — like Anki)
- **Search & Filter** — Full-text search + category/tag filters
- **Public Sharing** — Unique share links, beautiful public note page
- **Analytics Dashboard** — Total notes, AI uses, revision queue, top tags

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI + SQLAlchemy |
| Database | SQLite (dev) → Supabase Postgres (prod) |
| AI | Groq API — Llama 3.3 70B (free tier) |
| Auth | JWT + bcrypt |
| Deploy | Vercel (frontend) + Render (backend) |

## Setup

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # Fill in GROQ_API_KEY and JWT_SECRET
uvicorn app.main:app --reload --port 8000
```

Visit http://localhost:8000/docs for interactive API docs.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env          # Set VITE_API_URL=http://localhost:8000
npm run dev
```

Visit http://localhost:5173

## Environment Variables

### Backend (`backend/.env`)

```
DATABASE_URL=sqlite:///./peblo.db
JWT_SECRET=your-super-secret-key-change-this
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:8000
```

## Getting a Free Groq API Key

1. Go to https://console.groq.com
2. Sign up (no credit card needed)
3. Create an API key
4. Paste it into `backend/.env` as `GROQ_API_KEY`
5. Free tier: 14,400 requests/day on Llama 3.3 70B

## Deployment

### Backend → Render (Free)

1. Push `backend/` to GitHub
2. Render → New Web Service → connect repo
3. Root Directory: `backend`
4. Build: `pip install -r requirements.txt`
5. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add env vars from `.env`
7. For production DB: create free Supabase project → add Postgres URL as `DATABASE_URL`, add `psycopg2-binary` to requirements.txt

### Frontend → Vercel (Free)

1. Push `frontend/` to GitHub
2. Vercel → New Project → import repo
3. Root Directory: `frontend`, Framework: Vite
4. Add env: `VITE_API_URL=https://your-render-url.onrender.com`
5. Deploy

## Architecture

```
frontend/                    # React SPA
  src/
    api/client.js            # Axios with JWT interceptor
    store/                   # Zustand state (auth, notes)
    pages/                   # Route-level components
    components/              # Shared layout

backend/
  app/
    api/                     # FastAPI route handlers
    models/                  # SQLAlchemy ORM models
    schemas/                 # Pydantic validation
    services/ai_service.py   # Groq AI integration
    core/                    # Auth, DB, config
```

**Spaced repetition logic:** After a quiz, the score determines `next_revision`:
- Score < 60% → review in 1 day
- Score 60–79% → review in 3 days
- Score ≥ 80% → review in 7 days

## Submission Checklist

- [x] `.env` files NOT committed (in `.gitignore`)
- [x] `.env.example` files included
- [x] All 6 features: Auth, Notes, AI, Search, Share, Analytics
- [x] Spaced repetition scheduling
- [x] Auto-save with debounce
- [x] Dark mode
- [x] Public share pages
- [x] Interactive API docs at `/docs`
