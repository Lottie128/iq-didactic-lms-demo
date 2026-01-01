import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import './Auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-bg" />
        <div className="auth-container">
          <div className="auth-card glass scale-in">
            <div className="success-icon">
              <CheckCircle size={64} color="#22c55e" />
            </div>
            <h1>Check Your Email</h1>
            <p className="success-message">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions.
            </p>
            <div className="helper-text">
              <p>Didn't receive the email?</p>
              <button 
                className="btn-text" 
                onClick={() => setSuccess(false)}
              >
                Try again
              </button>
            </div>
            <Link to="/login" className="btn btn-primary btn-full">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-container">
        <div className="auth-card glass fade-in">
          <button className="back-btn" onClick={() => navigate('/login')}>
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="auth-header">
            <div className="logo-mark glass-strong">IQ</div>
            <h1>Forgot Password?</h1>
            <p>No worries! Enter your email and we'll send you reset instructions.</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Remember your password?
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;