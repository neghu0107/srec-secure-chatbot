import { useState, useRef, useEffect } from "react";
import "./ChatBox.css";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  // auto scroll
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text })
      });

      const data = await res.json();

      const botMsg = {
        sender: "bot",
        text: data.reply,
        risk: data.risk || 0,
        confidence: data.confidence || 0,
        status: data.status
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Server error", status: "error" }
      ]);
    }

    setLoading(false);
  };

  const RiskBar = ({ value }) => (
    <div className="bar">
      <div className="fill risk" style={{ width: `${value * 100}%` }} />
    </div>
  );

  const ConfidenceBar = ({ value }) => (
    <div className="bar">
      <div className="fill conf" style={{ width: `${value * 100}%` }} />
    </div>
  );

  return (
    <div className="chatbox">
      <div className="chat-header">🛡 Guarded Chatbot</div>

      <div className="chat-messages" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.sender}`}>
            <div className="bubble">
              {msg.text}

              {msg.sender === "bot" && (
                <div className="meta">
                  {msg.status === "blocked" ? (
                    <span className="badge red">⚠ Attack</span>
                  ) : (
                    <span className="badge green">✔ Safe</span>
                  )}

                  <div className="metric">
                    Risk: {(msg.risk || 0).toFixed(2)}
                    <RiskBar value={msg.risk || 0} />
                  </div>

                  {msg.status !== "blocked" && (
                    <div className="metric">
                      Confidence: {(msg.confidence || 0).toFixed(2)}
                      <ConfidenceBar value={msg.confidence || 0} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && <div className="msg bot">Typing...</div>}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about LLM security or this project..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
