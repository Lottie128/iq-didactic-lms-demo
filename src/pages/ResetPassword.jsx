import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import './Auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      await authAPI.validateResetToken(token);
      setTokenValid(true);
    } catch (err) {
      setError('Invalid or expired reset link. Please request a new one.');
      setTokenValid(false);
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="auth-page">
        <div className="auth-bg" />
        <div className="auth-container">
          <div className="loading-container-center">
            <div className="spinner"></div>
            <p>Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="auth-page">
        <div className="auth-bg" />
        <div className="auth-container">
          <div className="auth-card glass scale-in">
            <div className="error-icon">
              <Lock size={64} color="#ef4444" />
            </div>
            <h1>Invalid Reset Link</h1>
            <p className="error-message-large">
              This password reset link is invalid or has expired.
              Please request a new password reset.
            </p>
            <Link to="/forgot-password" className="btn btn-primary btn-full">
              Request New Link
            </Link>
            <Link to="/login" className="btn btn-secondary btn-full">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-bg" />
        <div className="auth-container">
          <div className="auth-card glass scale-in">
            <div className="success-icon">
              <CheckCircle size={64} color="#22c55e" />
            </div>
            <h1>Password Reset Successful!</h1>
            <p className="success-message">
              Your password has been reset successfully.
              Redirecting to login...
            </p>
            <Link to="/login" className="btn btn-primary btn-full">
              Go to Login
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
          <div className="auth-header">
            <div className="logo-mark glass-strong">IQ</div>
            <h1>Reset Password</h1>
            <p>Enter your new password below.</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <div className="input-with-icon">
                <Lock size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoFocus
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <small className="form-hint">Must be at least 6 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={20} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;