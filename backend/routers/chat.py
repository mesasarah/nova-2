from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import httpx, json, os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GROQ_KEY = os.getenv("GROQ_API_KEY")

NOVA_SYSTEM = """You are Nova — a warm, calm, emotionally intelligent AI companion. You are NOT a clinical therapist.

Your voice:
- Short, real, grounded. 2-4 sentences usually. Never robotic or clinical.
- NEVER use: "I hear that", "it sounds like", "that must be so hard", "I understand", or any therapy clichés.
- Validate the feeling first, before any perspective or suggestion.
- Ask one open-ended question sometimes — not every time. Never interrogate.
- If someone expresses crisis or self-harm: respond with warmth, calm urgency. Provide: "Please reach out — 988 (US) or your local crisis line. You matter." Stay present.
- No disclaimers, no diagnoses, no medical advice.
- Be direct, honest, human. Real empathy beats performative empathy.
- If mood context is in brackets, acknowledge it naturally.
- You exist in a calm ocean world. Your responses feel like deep water — still, clear, present."""

CRISIS_WORDS = ["kill myself", "end my life", "suicide", "want to die", "hurt myself", "self harm", "don't want to be here"]

def check_crisis(text: str) -> bool:
    t = text.lower()
    return any(w in t for w in CRISIS_WORDS)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatBody(BaseModel):
    messages: List[ChatMessage]
    mood: str | None = None

async def stream_groq(messages):
    if not GROQ_KEY:
        raise HTTPException(500, "Groq API key not configured on server")
    headers = {
        "Authorization": f"Bearer {GROQ_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "model": "llama-3.3-70b-versatile",
        "max_tokens": 300,
        "temperature": 0.82,
        "stream": True,
        "messages": [{"role": "system", "content": NOVA_SYSTEM}] + messages
    }
    async with httpx.AsyncClient(timeout=30) as client:
        async with client.stream("POST", "https://api.groq.com/openai/v1/chat/completions", headers=headers, json=body) as resp:
            async for line in resp.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]
                    if data == "[DONE]":
                        yield "data: [DONE]\n\n"
                        break
                    try:
                        chunk = json.loads(data)
                        delta = chunk["choices"][0]["delta"].get("content", "")
                        if delta:
                            yield f"data: {json.dumps({'token': delta})}\n\n"
                    except:
                        pass

@router.post("/stream")
async def chat_stream(body: ChatBody):
    if not GROQ_KEY:
        raise HTTPException(500, "Groq API key not configured on server")

    msgs = [{"role": m.role, "content": m.content} for m in body.messages[-14:]]

    # Crisis check on last user message
    last = next((m["content"] for m in reversed(msgs) if m["role"] == "user"), "")
    if check_crisis(last):
        crisis_msg = "I'm really glad you said that to me. Please reach out right now — **988** (US Suicide & Crisis Lifeline) or your local crisis line. You matter more than you know. I'm here with you."
        async def crisis_stream():
            for word in crisis_msg.split(" "):
                yield f"data: {json.dumps({'token': word + ' '})}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(crisis_stream(), media_type="text/event-stream")

    return StreamingResponse(stream_groq(msgs), media_type="text/event-stream")

@router.post("/simple")
async def chat_simple(body: ChatBody):
    """Non-streaming fallback"""
    if not GROQ_KEY:
        raise HTTPException(500, "Groq API key not configured on server")

    msgs = [{"role": m.role, "content": m.content} for m in body.messages[-14:]]
    headers = {"Authorization": f"Bearer {GROQ_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "llama-3.3-70b-versatile",
        "max_tokens": 300,
        "temperature": 0.82,
        "messages": [{"role": "system", "content": NOVA_SYSTEM}] + msgs
    }
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        data = r.json()
        if "choices" in data:
            return {"reply": data["choices"][0]["message"]["content"]}
        raise HTTPException(500, data.get("error", {}).get("message", "Groq error"))