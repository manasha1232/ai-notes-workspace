import json
from groq import Groq
from ..core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "llama-3.3-70b-versatile"

def _chat(prompt: str, system: str = "You are a helpful study assistant. Always respond with valid JSON only, no markdown fences.") -> str:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
        max_tokens=1500,
        temperature=0.7
    )
    return response.choices[0].message.content.strip()

def generate_summary(content: str) -> dict:
    if len(content.strip()) < 30:
        return {"summary": "Note is too short to summarize.", "key_points": [], "action_items": [], "suggested_title": "Short Note"}
    prompt = f"""Analyze this note. Return ONLY valid JSON, no markdown:
{content[:3000]}

{{"summary": "2-3 sentence summary", "key_points": ["point 1", "point 2", "point 3"], "action_items": ["action 1", "action 2"], "suggested_title": "concise title"}}"""
    raw = _chat(prompt)
    try:
        clean = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except:
        return {"summary": raw[:300], "key_points": [], "action_items": [], "suggested_title": "Study Note"}

def generate_flashcards(content: str) -> list:
    prompt = f"""Create 5 flashcards from this note. Return ONLY a JSON array:
{content[:2000]}

[{{"front": "question", "back": "answer"}}, ...]"""
    raw = _chat(prompt)
    try:
        clean = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except:
        return [{"front": "Review this note", "back": content[:200]}]

def generate_quiz(content: str) -> list:
    prompt = f"""Create 5 multiple choice questions from this note. Return ONLY a JSON array:
{content[:2000]}

[{{"question": "Q?", "options": ["A) opt", "B) opt", "C) opt", "D) opt"], "correct": 0, "explanation": "why"}}]"""
    raw = _chat(prompt)
    try:
        clean = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except:
        return []
