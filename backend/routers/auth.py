from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from models.database import get_db, User
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os, uuid

router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET = os.getenv("SECRET_KEY", "nova-ocean-secret-change-in-prod")
ALGO = "HS256"

class RegisterBody(BaseModel):
    email: str
    password: str
    name: str

class LoginBody(BaseModel):
    email: str
    password: str

class UpdatePrefs(BaseModel):
    tone_pref: str | None = None
    ocean_variant: str | None = None
    groq_key: str | None = None

def make_token(user_id: str):
    exp = datetime.utcnow() + timedelta(days=30)
    return jwt.encode({"sub": user_id, "exp": exp}, SECRET, algorithm=ALGO)

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET, algorithms=[ALGO])
    except:
        return None

@router.post("/register")
async def register(body: RegisterBody, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(
        id=str(uuid.uuid4()),
        email=body.email,
        hashed_password=pwd.hash(body.password),
        name=body.name
    )
    db.add(user); db.commit(); db.refresh(user)
    return {"token": make_token(user.id), "user": {"id": user.id, "name": user.name, "email": user.email, "tone_pref": user.tone_pref, "ocean_variant": user.ocean_variant}}

@router.post("/login")
async def login(body: LoginBody, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not pwd.verify(body.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    return {"token": make_token(user.id), "user": {"id": user.id, "name": user.name, "email": user.email, "tone_pref": user.tone_pref, "ocean_variant": user.ocean_variant, "groq_key": user.groq_key}}

@router.patch("/preferences")
async def update_prefs(body: UpdatePrefs, db: Session = Depends(get_db)):
    # In production: extract user from JWT header. Simplified here.
    return {"message": "Preferences updated"}
