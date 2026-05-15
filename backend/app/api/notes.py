import uuid, json
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.auth import get_current_user
from ..models.note import Note
from ..models.user import User
from ..schemas.note import NoteCreate, NoteUpdate
from ..services.ai_service import generate_summary, generate_flashcards, generate_quiz

router = APIRouter(prefix="/api/notes", tags=["notes"])

def note_to_out(note: Note) -> dict:
    d = {c.name: getattr(note, c.name) for c in note.__table__.columns}
    d["tags"] = [t.strip() for t in (note.tags or "").split(",") if t.strip()]
    return d

@router.get("")
def get_notes(
    search: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    archived: bool = False,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    q = db.query(Note).filter(Note.user_id == user.id, Note.is_archived == archived)
    if search:
        q = q.filter(Note.title.contains(search) | Note.content.contains(search))
    if tag:
        q = q.filter(Note.tags.contains(tag))
    if category:
        q = q.filter(Note.category == category)
    return [note_to_out(n) for n in q.order_by(Note.updated_at.desc()).all()]

@router.post("")
def create_note(data: NoteCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = Note(user_id=user.id, title=data.title, content=data.content, category=data.category, tags=",".join(data.tags))
    db.add(note)
    db.commit()
    db.refresh(note)
    return note_to_out(note)

@router.get("/revision/queue")
def revision_queue(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    now = datetime.utcnow()
    notes = db.query(Note).filter(Note.user_id == user.id, Note.is_archived == False, Note.next_revision <= now).order_by(Note.next_revision).all()
    return [note_to_out(n) for n in notes]

@router.get("/analytics/stats")
def analytics(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    all_notes = db.query(Note).filter(Note.user_id == user.id, Note.is_archived == False).all()
    tag_counts = {}
    for note in all_notes:
        for tag in (note.tags or "").split(","):
            t = tag.strip()
            if t:
                tag_counts[t] = tag_counts.get(t, 0) + 1
    total_ai = sum(n.ai_uses for n in all_notes)
    recent = sorted(all_notes, key=lambda n: n.updated_at, reverse=True)[:5]
    # Weekly notes (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    weekly = [n for n in all_notes if n.created_at and n.created_at >= week_ago]
    return {
        "total_notes": len(all_notes),
        "total_ai_uses": total_ai,
        "top_tags": sorted(tag_counts.items(), key=lambda x: -x[1])[:5],
        "recent_notes": [note_to_out(n) for n in recent],
        "weekly_count": len(weekly),
        "revision_queue_count": db.query(Note).filter(
            Note.user_id == user.id, Note.next_revision <= datetime.utcnow()
        ).count()
    }

@router.get("/{id}")
def get_note(id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    return note_to_out(note)

@router.patch("/{id}")
def update_note(id: str, data: NoteUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    if data.title is not None: note.title = data.title
    if data.content is not None: note.content = data.content
    if data.category is not None: note.category = data.category
    if data.tags is not None: note.tags = ",".join(data.tags)
    if data.is_archived is not None: note.is_archived = data.is_archived
    note.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(note)
    return note_to_out(note)

@router.delete("/{id}")
def delete_note(id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    db.delete(note)
    db.commit()
    return {"message": "Deleted"}

@router.post("/{id}/summarize")
def summarize(id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    result = generate_summary(note.content)
    note.ai_summary = result.get("summary")
    note.ai_key_points = json.dumps(result.get("key_points", []))
    note.ai_action_items = json.dumps(result.get("action_items", []))
    note.ai_uses += 1
    db.commit()
    return result

@router.post("/{id}/flashcards")
def flashcards(id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    cards = generate_flashcards(note.content)
    note.ai_flashcards = json.dumps(cards)
    note.ai_uses += 1
    db.commit()
    return cards

@router.post("/{id}/quiz")
def quiz(id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    questions = generate_quiz(note.content)
    note.ai_quiz = json.dumps(questions)
    note.ai_uses += 1
    db.commit()
    return questions

@router.post("/{id}/quiz-result")
def quiz_result(id: str, score: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    note.quiz_score = score
    note.last_reviewed = datetime.utcnow()
    note.revision_count += 1
    # Spaced repetition: low score = sooner review
    days = 1 if score < 60 else (3 if score < 80 else 7)
    note.next_revision = datetime.utcnow() + timedelta(days=days)
    db.commit()
    return {"next_revision": note.next_revision.isoformat(), "days_until": days, "score": score}

@router.post("/{id}/share")
def share_note(id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    if not note.share_id:
        note.share_id = str(uuid.uuid4())[:8]
    note.is_public = True
    db.commit()
    return {"share_id": note.share_id, "url": f"/share/{note.share_id}"}

@router.post("/{id}/unshare")
def unshare_note(id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(404, "Note not found")
    note.is_public = False
    db.commit()
    return {"message": "Unshared"}
