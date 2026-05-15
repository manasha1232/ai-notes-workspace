import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.note import Note

router = APIRouter(prefix="/api/shared", tags=["shared"])

@router.get("/{share_id}")
def get_shared_note(share_id: str, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.share_id == share_id, Note.is_public == True).first()
    if not note:
        raise HTTPException(404, "Note not found or not public")
    return {
        "title": note.title,
        "content": note.content,
        "category": note.category,
        "tags": [t.strip() for t in (note.tags or "").split(",") if t.strip()],
        "ai_summary": note.ai_summary,
        "ai_key_points": json.loads(note.ai_key_points) if note.ai_key_points else [],
        "updated_at": note.updated_at.isoformat() if note.updated_at else None,
    }
