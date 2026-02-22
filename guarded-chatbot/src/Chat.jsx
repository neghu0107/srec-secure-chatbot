import { useState } from 'react';
import './Chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      if (data.status === 'blocked') {
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: `⚠️ Blocked: ${data.reasons.join(', ')}`, type: 'warning' },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: data.reply },
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: '❌ Error contacting server.' },
      ]);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`bubble ${msg.sender} ${msg.type || ''}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div>
    </div>
  );
}
