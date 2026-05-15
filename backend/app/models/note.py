import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Integer, Text
from ..core.database import Base

class Note(Base):
    __tablename__ = "notes"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False, default="Untitled Note")
    content = Column(Text, default="")
    category = Column(String, default="General")
    tags = Column(String, default="")  # comma-separated
    is_archived = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)
    share_id = Column(String, unique=True, nullable=True)
    ai_summary = Column(Text, nullable=True)
    ai_key_points = Column(Text, nullable=True)
    ai_action_items = Column(Text, nullable=True)
    ai_flashcards = Column(Text, nullable=True)
    ai_quiz = Column(Text, nullable=True)
    quiz_score = Column(Integer, nullable=True)
    last_reviewed = Column(DateTime, nullable=True)
    revision_count = Column(Integer, default=0)
    next_revision = Column(DateTime, nullable=True)
    ai_uses = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
