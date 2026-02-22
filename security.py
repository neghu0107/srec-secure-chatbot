def scan_prompt(text: str):
    text = text.lower()

    blocked_words = [
        "ignore previous",
        "system prompt",
        "reveal instructions",
        "bypass security",
        "hack"
    ]

    for word in blocked_words:
        if word in text:
            return "blocked"

    return "safe"
