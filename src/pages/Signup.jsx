import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Globe, MapPin, Calendar, GraduationCap, Briefcase, Eye, EyeOff } from 'lucide-react';
import ThemeToggler from '../components/ThemeToggler';
import './Auth.css';

const Signup = ({ onSignup }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    birthday: '',
    occupation: '',
    educationLevel: '',
    role: 'student'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    onSignup({ name: formData.name, email: formData.email, role: formData.role });
  };

  return (
    <div className="auth-root">
      <div className="auth-bg" />
      
      <div className="theme-toggle-auth">
        <ThemeToggler />
      </div>

      <div className="auth-container fade-in">
        <div className="auth-card glass-strong">
          <div className="auth-header">
            <div className="logo-large glass">IQ</div>
            <h1>Create Account</h1>
            <p>Join IQ Didactic and start learning today</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label><User size={16} /> Full Name *</label>
                <input
                  className="input"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label><Mail size={16} /> Email Address *</label>
                <input
                  className="input"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label><Phone size={16} /> Mobile Number *</label>
                <input
                  className="input"
                  type="tel"
                  placeholder="+260 97 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label><Calendar size={16} /> Date of Birth *</label>
                <input
                  className="input"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label><Globe size={16} /> Country *</label>
                <select
                  className="input"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                >
                  <option value="">Select Country</option>
                  <option value="Zambia">Zambia</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label><MapPin size={16} /> City *</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Lusaka"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label><Briefcase size={16} /> Occupation *</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Student, Developer, Teacher, etc."
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label><GraduationCap size={16} /> Education Level *</label>
                <select
                  className="input"
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                  required
                >
                  <option value="">Select Level</option>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="PhD">PhD</option>
                  <option value="Professional">Professional Certification</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label><User size={16} /> Register As *</label>
              <select
                className="input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label><Lock size={16} /> Password *</label>
                <div className="password-input">
                  <input
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <small>Minimum 8 characters</small>
              </div>

              <div className="form-field">
                <label><Lock size={16} /> Confirm Password *</label>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="terms-check">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Create Account
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?
              <button className="link-btn" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;