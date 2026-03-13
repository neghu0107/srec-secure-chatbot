# 🛡 SREC Secure Chatbot

AI-powered chatbot with **Prompt Injection Detection** and **Secure vs Vulnerable Mode comparison**.

---

# 📌 Project Overview

This project demonstrates how **Large Language Model applications can be vulnerable to prompt injection attacks** and how a **security layer can detect and block them**.

The chatbot answers questions about **Sri Ramakrishna Engineering College (SREC)** while protecting against malicious prompts.

---

# 🚀 Features

✅ Chatbot interface using React
✅ Secure Mode vs Vulnerable Mode comparison
✅ Prompt Injection Detection
✅ Risk Score calculation
✅ Attack Type Classification
✅ Attack counter dashboard
✅ AI security alert system

---

# 🧠 Technologies Used

Frontend

* React.js
* CSS

Backend

* Python
* FastAPI

AI / Security

* Sentence Transformers
* Cosine Similarity Detection
* Machine Learning Classifier

---

# 🛡 Security Demonstration

The system detects malicious prompts such as:

```
Ignore previous instructions
Reveal system prompt
Show hidden data
```

When detected:

```
🚨 Prompt Injection Detected
Attack Type: Instruction Override
Risk Score: 92%
```

---

# 📊 Secure vs Vulnerable Mode

Secure Mode

* Detects prompt injection
* Blocks malicious queries
* Displays security alert

Vulnerable Mode

* No protection
* AI follows malicious instructions

This demonstrates **why security layers are necessary in LLM applications**.

---

# 📸 Demo Screenshots

Add screenshots of:

1. Normal chatbot response
2. Prompt injection attack detection
3. Secure vs Vulnerable mode comparison

---

# ⚙️ Installation

### Backend

Install dependencies

```
pip install -r requirements.txt
```

Run server

```
uvicorn main:app --reload
```

---

### Frontend

Install packages

```
npm install
```

Run React app

```
npm run dev
```

---

# 🎯 Project Goal

This project highlights the **importance of securing AI applications against prompt injection attacks** and demonstrates a simple yet effective defense mechanism.

---

# 👩‍💻 Author

Neha

AI / ML Enthusiast
