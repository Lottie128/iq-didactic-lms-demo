import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, AtSign, Lock } from 'lucide-react';
import '../App.css';
import './Auth.css';

const Signup = ({ onSignup }) => {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup({ name, role, email });
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
          <Link to="/login" className="nav-link">Sign in</Link>
          <Link to="/signup" className="nav-link active">Create account</Link>
        </nav>
      </header>

      <main className="auth-main fade-in">
        <section className="auth-hero">
          <h1>Create your IQ Didactic profile</h1>
          <p>Choose a role now, switch later. This is a front-end only demo.</p>

          <div className="role-toggle glass">
            {['student', 'teacher', 'admin'].map((r) => (
              <button
                key={r}
                className={`role-pill ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
              >
                <UserPlus size={16} />
                <span>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="auth-card glass-strong scale-in">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label>Full name</label>
              <div className="field-input">
                <UserPlus size={16} />
                <input
                  className="input"
                  type="text"
                  placeholder="Alex Student"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="btn btn-primary auth-submit" type="submit">
              Create {role} account
              <ArrowRight size={16} />
            </button>

            <p className="hint">Accounts are stored in memory only. Perfect for live demos.</p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Signup;