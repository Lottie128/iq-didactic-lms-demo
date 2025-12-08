import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, User, Lock, AtSign } from 'lucide-react';
import '../App.css';
import './Auth.css';

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name: role === 'student' ? 'Alex Student' : role === 'teacher' ? 'Jordan Teacher' : 'Admin IQ',
      role,
      email,
    });
  };

  return (
    <div className="auth-root">
      <div className="auth-orbit" />
      <header className="auth-header">
        <div className="auth-logo">
          <div className="logo-mark glass-strong">IQ</div>
          <div className="logo-text">
            <span>IQ Didactic</span>
            <p>Apple-inspired Learning</p>
          </div>
        </div>
        <nav className="auth-nav">
          <Link to="/login" className="nav-link active">Sign in</Link>
          <Link to="/signup" className="nav-link">Create account</Link>
        </nav>
      </header>

      <main className="auth-main fade-in">
        <section className="auth-hero">
          <h1>Sign in to your learning space</h1>
          <p>One clean interface for students, teachers, and admins. No noise, just focus.</p>

          <div className="role-toggle glass">
            {['student', 'teacher', 'admin'].map((r) => (
              <button
                key={r}
                className={`role-pill ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
              >
                <User size={16} />
                <span>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
              </button>
            ))}
          </div>

          <div className="hero-footnote">
            <span className="dot" />
            <p>AI Teacher is available in every role for this demo.</p>
          </div>
        </section>

        <section className="auth-card glass-strong scale-in">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label>Email</label>
              <div className="field-input">
                <AtSign size={16} />
                <input
                  className="input"
                  type="email"
                  placeholder="you@iqdidactic.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="field-input">
                <Lock size={16} />
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="btn btn-primary auth-submit" type="submit">
              Continue as {role}
              <ArrowRight size={16} />
            </button>

            <p className="hint">No real backend in this demo. Any credentials will sign you in.</p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;