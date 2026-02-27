from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, mood, auth
import uvicorn

app = FastAPI(title="Nova API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(mood.router, prefix="/api/mood", tags=["mood"])

@app.get("/api/health")
async def health():
    return {"status": "Nova is present", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
