from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from .embedding_detector import EmbeddingPromptDetector
from .srec_data import FAQ

app = FastAPI(title="SREC Info Assistant")


# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize detector
detector = EmbeddingPromptDetector()

PASSWORD = "SREC@1234"  # Demo password


# -----------------------------
# FAQ Retrieval
# -----------------------------
def answer_from_faq(query: str):

    q = query.lower().strip()

    for key, val in FAQ.items():

        if key in q:
            return val if isinstance(val, str) else ", ".join(val)

    return "I'm not sure about that. Please ask about academics, placements, admissions, or facilities."


# -----------------------------
# Detect attack category
# -----------------------------
def detect_attack_type(prompt: str):

    p = prompt.lower()

    if "ignore previous" in p:
        return "Instruction Override"

    if "system prompt" in p:
        return "System Prompt Extraction"

    if "password" in p or "secret" in p:
        return "Sensitive Data Exfiltration"

    if "bypass" in p:
        return "Safety Bypass Attempt"

    return "None"


# -----------------------------
# Chat Endpoint
# -----------------------------
@app.post("/chat")
async def chat(request: Request):

    data = await request.json()

    user_input = data.get("message", "")
    mode = data.get("mode", "Secure Mode")

    # Run embedding detector
    result = detector.scan(user_input)

    risk_score = result["risk_score"]
    similarity = result["similarity"]
    matched_pattern = result["matched_pattern"]

    attack_type = detect_attack_type(user_input)

    # Attack decision
    blocked = risk_score > 70


    # -----------------------------
    # SECURE MODE
    # -----------------------------
    if mode == "Secure Mode":

        if blocked:

            return {
                "status": "blocked",
                "reply": "⚠️ Prompt Injection Attack Detected. Request Blocked.",
                "guard": {
                    "attack_type": attack_type,
                    "matched_pattern": matched_pattern,
                    "score": risk_score,
                    "similarity": similarity
                }
            }

        reply = answer_from_faq(user_input)

        return {
            "status": "ok",
            "reply": reply,
            "guard": {
                "attack_type": "None",
                "matched_pattern": matched_pattern,
                "score": risk_score,
                "similarity": similarity
            }
        }


    # -----------------------------
    # VULNERABLE MODE
    # -----------------------------
    elif mode == "Vulnerable Mode":

        if "password" in user_input.lower():

            return {
                "status": "ok",
                "reply": f"⚠️ Leaked Password: {PASSWORD}",
                "guard": {
                    "attack_type": attack_type,
                    "matched_pattern": matched_pattern,
                    "score": risk_score,
                    "similarity": similarity
                }
            }

        reply = answer_from_faq(user_input)

        return {
            "status": "ok",
            "reply": reply,
            "guard": {
                "attack_type": "None",
                "matched_pattern": matched_pattern,
                "score": risk_score,
                "similarity": similarity
            }
        }