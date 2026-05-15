from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class NoteCreate(BaseModel):
    title: str = "Untitled Note"
    content: str = ""
    category: str = "General"
    tags: List[str] = []

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_archived: Optional[bool] = None

class NoteOut(BaseModel):
    id: str
    title: str
    content: str
    category: str
    tags: List[str]
    is_archived: bool
    is_public: bool
    share_id: Optional[str]
    ai_summary: Optional[str]
    ai_key_points: Optional[str]
    ai_action_items: Optional[str]
    ai_flashcards: Optional[str]
    ai_quiz: Optional[str]
    quiz_score: Optional[int]
    revision_count: int
    next_revision: Optional[datetime]
    ai_uses: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
