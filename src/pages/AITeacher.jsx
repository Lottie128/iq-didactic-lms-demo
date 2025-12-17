import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, LogOut, Loader } from 'lucide-react';
import './AITeacher.css';

const AITeacher = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: 'Hello! I am your AI Teacher assistant powered by Google Gemini. I can help you with lesson planning, quiz generation, course outlines, and answering questions. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      text: input
    };

    setMessages([...messages, userMessage]);
    const question = input;
    setInput('');
    setLoading(true);

    try {
      // Call real AI API
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'https://iq-didactic-lms-demo-production.up.railway.app/api';
      
      const response = await fetch(`${apiUrl}/ai/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          question: question,  // Backend expects 'question' field
          context: {
            courseName: 'General',
            studentLevel: user?.level || 1,
            topic: 'General Education'
          }
        })
      });

      if (response.ok) {
        const { data } = await response.json();
        
        // Backend returns data.response
        const aiMessage = {
          id: messages.length + 2,
          role: 'ai',
          text: data.response || 'I received your message but could not generate a response.'
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      
      // Show user-friendly error message
      const errorMessage = {
        id: messages.length + 2,
        role: 'ai',
        text: `I apologize, but I'm having trouble connecting right now. ${error.message.includes('API') ? 'Please make sure the Gemini API key is configured.' : 'Please try again in a moment.'}`
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
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
            <p>Powered by Google Gemini 2.0 Flash</p>
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
                {loading ? 'Thinking...' : 'Online and ready'}
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
                  <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="message-avatar user-avatar">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="message ai">
                <div className="message-avatar">
                  <Sparkles size={16} />
                </div>
                <div className="message-bubble glass">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Loader size={16} className="spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form className="ai-input-form" onSubmit={handleSend}>
            <div className="ai-input-wrapper glass">
              <input
                type="text"
                className="ai-input"
                placeholder="Ask me anything about learning, courses, or teaching..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="send-btn" disabled={!input.trim() || loading}>
                {loading ? <Loader size={18} className="spin" /> : <Send size={18} />}
              </button>
            </div>
          </form>

          <div className="ai-suggestions">
            <p>Try asking:</p>
            <div className="suggestions-grid">
              <button 
                className="suggestion-chip glass" 
                onClick={() => handleSuggestion('Create 5 quiz questions on machine learning basics')}
                disabled={loading}
              >
                Create a quiz
              </button>
              <button 
                className="suggestion-chip glass" 
                onClick={() => handleSuggestion('Explain neural networks in simple terms')}
                disabled={loading}
              >
                Explain a concept
              </button>
              <button 
                className="suggestion-chip glass" 
                onClick={() => handleSuggestion('Generate a course outline for React development')}
                disabled={loading}
              >
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