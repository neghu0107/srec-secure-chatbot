import json
import os
from datetime import datetime

LOG_FILE = "attack_logs.json"


def log_attack(prompt, similarity, risk_score, blocked):

    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "prompt": prompt,
        "similarity": similarity,
        "risk_score": risk_score,
        "blocked": blocked
    }

    # If file exists, load old logs
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            logs = json.load(f)
    else:
        logs = []

    logs.append(log_entry)

    # Save updated logs
    with open(LOG_FILE, "w") as f:
        json.dump(logs, f, indent=4)