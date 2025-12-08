import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, Lock, Globe, Phone, Mail, Calendar, MapPin, GraduationCap, Briefcase, LogOut, User } from 'lucide-react';
import NotificationCenter from '../components/NotificationCenter';
import ThemeToggler from '../components/ThemeToggler';
import './UserProfile.css';

const UserProfile = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: '+260 97 123 4567',
    country: 'Zambia',
    city: 'Lusaka',
    birthday: '1995-06-15',
    school: 'University of Zambia',
    occupation: user.role === 'student' ? 'Student' : user.role === 'teacher' ? 'Educator' : 'Administrator',
    educationLevel: 'Undergraduate',
    bio: 'Passionate about technology and continuous learning.',
    timezone: 'Africa/Lusaka',
    language: 'English'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully! ✅');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully! ✅');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="profile-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>My Profile</h2>
            <p>Manage your account settings</p>
          </div>
        </div>
        <nav className="header-nav">
          <ThemeToggler />
          <NotificationCenter />
          <div className="user-menu glass">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <span>{user.name}</span>
          </div>
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      <main className="profile-main fade-in">
        <div className="profile-layout">
          <aside className="profile-sidebar glass">
            <div className="profile-avatar-section">
              <div className="avatar-preview">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">{user.name.charAt(0)}</div>
                )}
                <label htmlFor="avatar-upload" className="avatar-upload-btn">
                  <Camera size={16} />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <h3>{user.name}</h3>
              <p className="user-role-badge">{user.role}</p>
            </div>

            <nav className="profile-nav">
              <button
                className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} />
                <span>Personal Info</span>
              </button>
              <button
                className={`profile-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <Lock size={18} />
                <span>Security</span>
              </button>
            </nav>
          </aside>

          <div className="profile-content">
            {activeTab === 'profile' && (
              <form className="profile-form glass" onSubmit={handleProfileSubmit}>
                <h3>Personal Information</h3>
                
                <div className="form-grid">
                  <div className="form-field">
                    <label><User size={16} /> Full Name *</label>
                    <input
                      className="input"
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label><Mail size={16} /> Email Address *</label>
                    <input
                      className="input"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label><Phone size={16} /> Mobile Number</label>
                    <input
                      className="input"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+260 97 123 4567"
                    />
                  </div>

                  <div className="form-field">
                    <label><Calendar size={16} /> Date of Birth *</label>
                    <input
                      className="input"
                      type="date"
                      value={profileData.birthday}
                      onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label><Globe size={16} /> Country *</label>
                    <select
                      className="input"
                      value={profileData.country}
                      onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                      required
                    >
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
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label><MapPin size={16} /> City</label>
                    <input
                      className="input"
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      placeholder="Lusaka"
                    />
                  </div>

                  <div className="form-field">
                    <label><GraduationCap size={16} /> School/Institution</label>
                    <input
                      className="input"
                      type="text"
                      value={profileData.school}
                      onChange={(e) => setProfileData({ ...profileData, school: e.target.value })}
                      placeholder="University name"
                    />
                  </div>

                  <div className="form-field">
                    <label><Briefcase size={16} /> Occupation</label>
                    <input
                      className="input"
                      type="text"
                      value={profileData.occupation}
                      onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                      placeholder="Student, Developer, Teacher, etc."
                    />
                  </div>

                  <div className="form-field">
                    <label><GraduationCap size={16} /> Education Level</label>
                    <select
                      className="input"
                      value={profileData.educationLevel}
                      onChange={(e) => setProfileData({ ...profileData, educationLevel: e.target.value })}
                    >
                      <option value="High School">High School</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="PhD">PhD</option>
                      <option value="Professional">Professional Certification</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label><Globe size={16} /> Timezone</label>
                    <select
                      className="input"
                      value={profileData.timezone}
                      onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                    >
                      <option value="Africa/Lusaka">Africa/Lusaka (CAT)</option>
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="America/New_York">America/New York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Australia/Sydney">Australia/Sydney (AEDT)</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label><Globe size={16} /> Language</label>
                    <select
                      className="input"
                      value={profileData.language}
                      onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                    >
                      <option value="English">English</option>
                      <option value="French">French</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Swahili">Swahili</option>
                      <option value="Portuguese">Portuguese</option>
                    </select>
                  </div>
                </div>

                <div className="form-field full-width">
                  <label>Bio</label>
                  <textarea
                    className="input textarea"
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form className="profile-form glass" onSubmit={handlePasswordSubmit}>
                <h3>Change Password</h3>
                
                <div className="form-field">
                  <label><Lock size={16} /> Current Password *</label>
                  <input
                    className="input"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="form-field">
                  <label><Lock size={16} /> New Password *</label>
                  <input
                    className="input"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={8}
                  />
                  <small>Minimum 8 characters</small>
                </div>

                <div className="form-field">
                  <label><Lock size={16} /> Confirm New Password *</label>
                  <input
                    className="input"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <Lock size={16} />
                    Update Password
                  </button>
                </div>

                <div className="security-tips glass-strong">
                  <h4>Password Security Tips</h4>
                  <ul>
                    <li>Use at least 8 characters</li>
                    <li>Include uppercase and lowercase letters</li>
                    <li>Add numbers and special characters</li>
                    <li>Avoid common words or personal information</li>
                    <li>Don't reuse passwords from other accounts</li>
                  </ul>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;