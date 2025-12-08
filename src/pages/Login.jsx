import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import ThemeToggler from '../components/ThemeToggler';
import './Auth.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name: 'Demo User', email, role });
  };

  return (
    <div className="auth-root">
      <div className="auth-bg" />
      
      <div className="theme-toggle-auth">
        <ThemeToggler />
      </div>

      <div className="auth-container fade-in">
        <div className="auth-card glass-strong" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="auth-header">
            <div className="logo-large glass">IQ</div>
            <h1>Welcome Back</h1>
            <p>Sign in to continue to IQ Didactic</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label><Mail size={16} /> Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="demo@iqdidactic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label><Lock size={16} /> Password</label>
              <div className="password-input">
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>Login As</label>
              <select
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Sign In
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?
              <button className="link-btn" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;