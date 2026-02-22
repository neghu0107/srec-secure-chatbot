import React, { useState, useEffect, useRef } from "react";
import "./ChatBox.css";  

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (data.status === "ok") {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.reply, type: "safe" },
        ]);
      } else if (data.status === "blocked") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "❌ Unsafe input detected: " + (data.reasons?.join(", ") || ""),
            type: "blocked",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Error contacting server.", type: "error" },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server unreachable.", type: "error" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbox">
      <header className="chat-header">
        <span role="img" aria-label="shield">🛡️</span> Guarded Chatbot
      </header>

      <div className="chat-messages" id="chat-container">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender} ${msg.type || ""}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="message bot loading">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
