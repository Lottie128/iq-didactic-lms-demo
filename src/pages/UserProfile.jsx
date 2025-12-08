import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Clock, LogOut, Camera } from 'lucide-react';
import './UserProfile.css';

const UserProfile = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Student',
    email: user?.email || 'alex.student@iqdidactic.app',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate learner exploring the world of technology and innovation.',
    joinedDate: 'January 2024'
  });

  const handleSave = () => {
    console.log('Profile updated:', profileData);
    alert('Profile updated successfully! (Demo only)');
    setIsEditing(false);
  };

  const stats = [
    { icon: BookOpen, label: 'Courses', value: user?.role === 'student' ? '12' : '8' },
    { icon: Award, label: 'Certificates', value: user?.role === 'student' ? '8' : '24' },
    { icon: Clock, label: 'Hours Learned', value: user?.role === 'student' ? '156' : '520' },
    { icon: User, label: user?.role === 'teacher' ? 'Students' : 'Streak', value: user?.role === 'teacher' ? '2,130' : '45 days' }
  ];

  return (
    <div className="profile-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>Profile</h2>
            <p>Manage your account settings</p>
          </div>
        </div>
        <nav className="header-nav">
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      <main className="profile-main fade-in">
        <div className="profile-container">
          <section className="profile-header glass-strong">
            <div className="avatar-section">
              <div className="avatar-large">
                {profileData.name.charAt(0)}
                <button className="avatar-edit">
                  <Camera size={16} />
                </button>
              </div>
              <div className="header-info">
                <h1>{profileData.name}</h1>
                <p className="role-badge">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
              </div>
            </div>
            <button 
              className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </section>

          <section className="stats-section">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card glass">
                <stat.icon size={24} />
                <div>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="profile-details glass-strong">
            <h3>Personal Information</h3>
            <div className="details-grid">
              <div className="detail-field">
                <label>
                  <User size={16} />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    className="input"
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                ) : (
                  <p>{profileData.name}</p>
                )}
              </div>

              <div className="detail-field">
                <label>
                  <Mail size={16} />
                  Email
                </label>
                {isEditing ? (
                  <input
                    className="input"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                ) : (
                  <p>{profileData.email}</p>
                )}
              </div>

              <div className="detail-field">
                <label>
                  <Phone size={16} />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    className="input"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                ) : (
                  <p>{profileData.phone}</p>
                )}
              </div>

              <div className="detail-field">
                <label>
                  <MapPin size={16} />
                  Location
                </label>
                {isEditing ? (
                  <input
                    className="input"
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  />
                ) : (
                  <p>{profileData.location}</p>
                )}
              </div>

              <div className="detail-field full-width">
                <label>
                  <User size={16} />
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    className="input textarea"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <p>{profileData.bio}</p>
                )}
              </div>

              <div className="detail-field">
                <label>
                  <Calendar size={16} />
                  Member Since
                </label>
                <p>{profileData.joinedDate}</p>
              </div>
            </div>
          </section>

          <section className="profile-details glass-strong">
            <h3>Preferences</h3>
            <div className="preferences-list">
              <div className="preference-item">
                <div>
                  <p className="pref-label">Email Notifications</p>
                  <p className="pref-desc">Receive updates about your courses</p>
                </div>
                <div className="toggle active" />
              </div>
              <div className="preference-item">
                <div>
                  <p className="pref-label">AI Recommendations</p>
                  <p className="pref-desc">Get personalized course suggestions</p>
                </div>
                <div className="toggle active" />
              </div>
              <div className="preference-item">
                <div>
                  <p className="pref-label">Weekly Progress Reports</p>
                  <p className="pref-desc">Summary of your learning activity</p>
                </div>
                <div className="toggle" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;