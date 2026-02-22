from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from knowledge_engine import get_answer   # your local AI
from security import scan_prompt          # prompt injection detector

app = FastAPI()

# ---------------- CORS FIX ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------- Request Model -------------
class ChatRequest(BaseModel):
    message: str

# -------------- Health Check --------------
@app.get("/")
def home():
    return {"status": "Backend running 🚀"}

# -------------- Chat Endpoint -------------
@app.post("/chat")
def chat(req: ChatRequest):
    user_input = req.message

    # 🔐 Step 1: Security Scan
    risk = scan_prompt(user_input)

    if risk == "blocked":
        return {
            "reply": "⚠️ Prompt blocked due to security risk.",
            "risk": "HIGH"
        }

    # 🤖 Step 2: Get answer from local model
    answer = get_answer(user_input)

    return {
        "reply": answer,
        "risk": risk
    }
