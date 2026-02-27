from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models.database import get_db, MoodLog
from datetime import datetime, timedelta
import uuid

router = APIRouter()

class MoodBody(BaseModel):
    user_id: str
    score: int        # 1-10
    emoji: str
    note: str | None = None

@router.post("/log")
async def log_mood(body: MoodBody, db: Session = Depends(get_db)):
    log = MoodLog(
        id=str(uuid.uuid4()),
        user_id=body.user_id,
        score=body.score,
        emoji=body.emoji,
        note=body.note,
        distress_score=max(0, (5 - body.score) / 5)
    )
    db.add(log); db.commit()
    return {"logged": True, "distress_score": log.distress_score}

@router.get("/history/{user_id}")
async def mood_history(user_id: str, db: Session = Depends(get_db)):
    since = datetime.utcnow() - timedelta(days=7)
    logs = db.query(MoodLog).filter(
        MoodLog.user_id == user_id,
        MoodLog.logged_at >= since
    ).order_by(MoodLog.logged_at.asc()).all()
    return {"logs": [{"score": l.score, "emoji": l.emoji, "note": l.note, "logged_at": l.logged_at.isoformat()} for l in logs]}

@router.get("/trend/{user_id}")
async def mood_trend(user_id: str, db: Session = Depends(get_db)):
    since = datetime.utcnow() - timedelta(days=7)
    logs = db.query(MoodLog).filter(MoodLog.user_id == user_id, MoodLog.logged_at >= since).all()
    if not logs:
        return {"trend": "neutral", "avg_score": 5, "distress_alert": False}
    avg = sum(l.score for l in logs) / len(logs)
    avg_distress = sum(l.distress_score for l in logs) / len(logs)
    trend = "improving" if logs[-1].score > logs[0].score else "declining" if logs[-1].score < logs[0].score else "stable"
    return {
        "trend": trend,
        "avg_score": round(avg, 1),
        "avg_distress": round(avg_distress, 2),
        "distress_alert": avg_distress > 0.65,
        "count": len(logs)
    }
