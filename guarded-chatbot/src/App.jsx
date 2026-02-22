import { useState } from "react";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);

    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({message: input})
    });

    const data = await res.json();
    setTyping(false);

    const botMsg = {
      role: "bot",
      text: data.reply,
      risk: data.risk,
      confidence: data.confidence,
      status: data.status
    };

    setMessages(m => [...m, botMsg]);
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>🛡 Guarded LLM</h2>

        <button>New Chat</button>
        <button>System Diagram</button>
        <button>Project Info</button>
      </div>

      {/* CHAT */}
      <div className="chatbox">
        <div className="header">Guarded Chatbot</div>

        <div className="messages">
          {messages.map((m,i)=>(
            <div key={i} className={m.role}>
              <div className="bubble">{m.text}</div>

              {m.role==="bot" && (
                <div className="metrics">
                  <span className={m.status==="blocked"?"attack":"safe"}>
                    {m.status==="blocked"?"⚠ Attack":"✓ Safe"}
                  </span>
                  {" | Risk: "+m.risk+" | Conf: "+m.confidence}
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="bot">
              <div className="bubble">typing...</div>
            </div>
          )}
        </div>

        <div className="inputBox">
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder="Ask about AI security..."
          />
          <button onClick={send}>Send</button>
        </div>
      </div>

    </div>
  );
}
