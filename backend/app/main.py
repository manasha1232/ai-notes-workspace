from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import Base, engine
from .core.config import settings
from .api import auth, notes, shared
from . import models  # register models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Peblo Study Workspace API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(notes.router)
app.include_router(shared.router)

@app.get("/")
def root():
    return {"status": "Peblo API running", "docs": "/docs"}
