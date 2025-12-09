import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Globe, Lock, Camera, Save, Loader } from 'lucide-react';
import Layout from '../components/Layout';
import { userAPI, authAPI } from '../services/api';

const UserProfile = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    birthday: '',
    occupation: '',
    educationLevel: '',
    bio: '',
    avatar: '',
    timezone: 'UTC',
    language: 'en'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authAPI.getMe();
      setProfileData(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage('');

    try {
      await userAPI.updateProfile(profileData);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      await authAPI.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Loader className="spin" size={32} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar glass">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt={profileData.name} />
              ) : (
                <User size={48} />
              )}
              <label className="avatar-upload-btn">
                <Camera size={16} />
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              </label>
            </div>
            <h3>{profileData.name}</h3>
            <p style={{ opacity: 0.7, fontSize: '14px' }}>{profileData.email}</p>
          </div>

          <nav className="profile-nav">
            <button
              className={`profile-nav-item ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <User size={18} />
              Personal Info
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Lock size={18} />
              Security
            </button>
          </nav>
        </div>

        <div className="profile-content glass">
          {message && (
            <div style={{
              padding: '12px 16px',
              background: message.includes('success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${message.includes('success') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '8px',
              color: message.includes('success') ? '#22c55e' : '#ef4444',
              marginBottom: '24px'
            }}>
              {message}
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="profile-form">
              <h2>Personal Information</h2>
              
              <div className="form-grid">
                <div className="form-field">
                  <label><User size={16} /> Full Name</label>
                  <input
                    className="input"
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={saving}
                  />
                </div>

                <div className="form-field">
                  <label><Mail size={16} /> Email Address</label>
                  <input
                    className="input"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={saving}
                  />
                </div>

                <div className="form-field">
                  <label><Phone size={16} /> Mobile Number</label>
                  <input
                    className="input"
                    type="tel"
                    value={profileData.phone || ''}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={saving}
                  />
                </div>

                <div className="form-field">
                  <label><Calendar size={16} /> Date of Birth</label>
                  <input
                    className="input"
                    type="date"
                    value={profileData.birthday || ''}
                    onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                    disabled={saving}
                  />
                </div>

                <div className="form-field">
                  <label><Globe size={16} /> Country</label>
                  <input
                    className="input"
                    type="text"
                    value={profileData.country || ''}
                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                    disabled={saving}
                  />
                </div>

                <div className="form-field">
                  <label><MapPin size={16} /> City</label>
                  <input
                    className="input"
                    type="text"
                    value={profileData.city || ''}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    disabled={saving}
                  />
                </div>

                <div className="form-field">
                  <label><Briefcase size={16} /> Occupation</label>
                  <input
                    className="input"
                    type="text"
                    value={profileData.occupation || ''}
                    onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                    disabled={saving}
                  />
                </div>

                <div className="form-field">
                  <label>Education Level</label>
                  <input
                    className="input"
                    type="text"
                    value={profileData.educationLevel || ''}
                    onChange={(e) => setProfileData({ ...profileData, educationLevel: e.target.value })}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Bio</label>
                <textarea
                  className="input"
                  rows={4}
                  value={profileData.bio || ''}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  disabled={saving}
                />
              </div>

              <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <><Loader className="spin" size={16} /> Saving...</>
                ) : (
                  <><Save size={16} /> Save Changes</>
                )}
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-form">
              <h2>Change Password</h2>
              
              <div className="form-field">
                <label><Lock size={16} /> Current Password</label>
                <input
                  className="input"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div className="form-field">
                <label><Lock size={16} /> New Password</label>
                <input
                  className="input"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  disabled={saving}
                />
                <small>Minimum 8 characters</small>
              </div>

              <div className="form-field">
                <label><Lock size={16} /> Confirm New Password</label>
                <input
                  className="input"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  disabled={saving}
                />
              </div>

              <button className="btn btn-primary" onClick={handleUpdatePassword} disabled={saving}>
                {saving ? (
                  <><Loader className="spin" size={16} /> Updating...</>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;