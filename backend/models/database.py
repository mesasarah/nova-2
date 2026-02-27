from sqlalchemy import Column, String, Integer, Float, DateTime, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid, os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nova.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    tone_pref = Column(String, default="soft")   # soft | direct | minimal
    ocean_variant = Column(String, default="bioluminescence")
    groq_key = Column(String, nullable=True)     # encrypted in prod
    created_at = Column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    role = Column(String)   # user | assistant
    content = Column(Text)
    sentiment_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class MoodLog(Base):
    __tablename__ = "mood_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    score = Column(Integer)         # 1-10
    emoji = Column(String)
    note = Column(Text, nullable=True)
    distress_score = Column(Float, default=0.0)
    logged_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)
