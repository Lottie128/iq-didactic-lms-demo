import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, LogOut } from 'lucide-react';
import './AITeacher.css';

const AITeacher = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: 'Hello! I am your AI Teacher assistant. I can help you with lesson planning, quiz generation, course outlines, and answering questions. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      text: input
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        role: 'ai',
        text: `Great question! Since this is a demo, I am showing a simulated response. In production, I would use advanced AI to help you with "${input}". This could include generating lesson plans, creating quiz questions, suggesting learning paths, or explaining complex topics in simple terms.`
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="ai-teacher-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>AI Teacher</h2>
            <p>Your intelligent learning assistant</p>
          </div>
        </div>
        <nav className="header-nav">
          <div className="user-menu glass">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <span>{user.name}</span>
          </div>
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      <main className="ai-teacher-main fade-in">
        <div className="ai-container glass-strong">
          <div className="ai-header">
            <div className="ai-avatar">
              <Sparkles size={32} />
              <div className="ai-pulse" />
            </div>
            <div>
              <h3>IQ Didactic AI</h3>
              <p className="ai-status">
                <span className="status-dot" />
                Online and ready
              </p>
            </div>
          </div>

          <div className="messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.role}`}>
                {msg.role === 'ai' && (
                  <div className="message-avatar">
                    <Sparkles size={16} />
                  </div>
                )}
                <div className="message-bubble glass">
                  <p>{msg.text}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="message-avatar user-avatar">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form className="ai-input-form" onSubmit={handleSend}>
            <div className="ai-input-wrapper glass">
              <input
                type="text"
                className="ai-input"
                placeholder="Ask me anything about learning, courses, or teaching..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="send-btn" disabled={!input.trim()}>
                <Send size={18} />
              </button>
            </div>
          </form>

          <div className="ai-suggestions">
            <p>Try asking:</p>
            <div className="suggestions-grid">
              <button className="suggestion-chip glass" onClick={() => setInput('Create a quiz on machine learning basics')}>
                Create a quiz
              </button>
              <button className="suggestion-chip glass" onClick={() => setInput('Explain neural networks in simple terms')}>
                Explain a concept
              </button>
              <button className="suggestion-chip glass" onClick={() => setInput('Generate a course outline for React development')}>
                Course outline
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AITeacher;