import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Sparkles, TrendingUp, Settings, LogOut, Shield, BarChart3, UserCog, Globe } from 'lucide-react';
import { demoCourses } from '../data/demoCourses';
import './Dashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const totalStudents = demoCourses.reduce((sum, c) => sum + c.students, 0);

  return (
    <div className="dashboard-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <div className="logo-mark glass-strong">IQ</div>
          <div className="header-title">
            <h2>IQ Didactic</h2>
            <p>Admin Portal</p>
          </div>
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={() => navigate('/ai-teacher')}>
            <Sparkles size={16} />
            <span>AI Tools</span>
          </button>
          <div className="user-menu glass" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            <Shield size={16} />
            <span>{user.name}</span>
          </div>
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      <main className="dashboard-main fade-in">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Platform Overview</h1>
            <p>Monitor system health and manage platform resources.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card glass" onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer' }}>
              <Users size={20} />
              <div>
                <p className="stat-value">{totalStudents.toLocaleString()}</p>
                <p className="stat-label">Total Users</p>
              </div>
            </div>
            <div className="stat-card glass">
              <BookOpen size={20} />
              <div>
                <p className="stat-value">{demoCourses.length}</p>
                <p className="stat-label">Active Courses</p>
              </div>
            </div>
            <div className="stat-card glass">
              <Sparkles size={20} />
              <div>
                <p className="stat-value">1,240</p>
                <p className="stat-label">AI Sessions</p>
              </div>
            </div>
            <div className="stat-card glass" onClick={() => navigate('/admin/analytics')} style={{ cursor: 'pointer' }}>
              <TrendingUp size={20} />
              <div>
                <p className="stat-value">+23%</p>
                <p className="stat-label">Growth MTD</p>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-grid">
          <div className="admin-card glass-strong scale-in" onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer' }}>
            <div className="admin-card-header">
              <UserCog size={24} />
              <h3>User Management</h3>
            </div>
            <p>Manage student, teacher, and admin accounts across all countries.</p>
            <div className="admin-stats">
              <div className="admin-stat">
                <span className="stat-num">1,847</span>
                <span className="stat-lbl">Students</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">42</span>
                <span className="stat-lbl">Teachers</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">3</span>
                <span className="stat-lbl">Admins</span>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); navigate('/admin/users'); }}>Manage Users</button>
          </div>

          <div className="admin-card glass-strong scale-in" onClick={() => navigate('/admin/analytics')} style={{ cursor: 'pointer' }}>
            <div className="admin-card-header">
              <BarChart3 size={24} />
              <h3>Analytics & Insights</h3>
            </div>
            <p>View platform analytics, country data, gender insights, and AI impact metrics.</p>
            <div className="admin-stats">
              <div className="admin-stat">
                <span className="stat-num">15K+</span>
                <span className="stat-lbl">Users</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">7</span>
                <span className="stat-lbl">Countries</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">8.9K</span>
                <span className="stat-lbl">AI Sessions</span>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); navigate('/admin/analytics'); }}>View Analytics</button>
          </div>

          <div className="admin-card glass-strong scale-in">
            <div className="admin-card-header">
              <BookOpen size={24} />
              <h3>Course Management</h3>
            </div>
            <p>Approve, edit, or archive platform courses.</p>
            <div className="course-list">
              {demoCourses.map(course => (
                <div key={course.id} className="course-item">
                  <div>
                    <p className="course-item-title">{course.title}</p>
                    <p className="course-item-meta">{course.students} students</p>
                  </div>
                  <button className="btn-icon" onClick={() => navigate(`/edit-course/${course.id}`)}>→</button>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card glass-strong scale-in">
            <div className="admin-card-header">
              <Sparkles size={24} />
              <h3>AI Analytics</h3>
            </div>
            <p>Monitor AI teacher usage, proctoring data, and performance metrics by gender.</p>
            <div className="admin-stats">
              <div className="admin-stat">
                <span className="stat-num">1,240</span>
                <span className="stat-lbl">Sessions</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">4.8</span>
                <span className="stat-lbl">Avg Rating</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">+23%</span>
                <span className="stat-lbl">Female Use</span>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/ai-teacher')}>View AI Console</button>
          </div>

          <div className="admin-card glass-strong scale-in full-width">
            <div className="admin-card-header">
              <Globe size={24} />
              <h3>Global Reach</h3>
            </div>
            <p>Platform usage across 7 countries with detailed analytics on demographics and engagement.</p>
            <div className="country-preview">
              <div className="country-flag">🇺🇸 USA - 4,521 users</div>
              <div className="country-flag">🇮🇳 India - 3,240 users (+28%)</div>
              <div className="country-flag">🇬🇧 UK - 2,180 users</div>
              <div className="country-flag">🇨🇦 Canada - 1,890 users</div>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/analytics')}>View Full Report</button>
          </div>

          <div className="admin-card glass-strong scale-in">
            <div className="admin-card-header">
              <Settings size={24} />
              <h3>System Settings</h3>
            </div>
            <p>Configure platform preferences and integrations.</p>
            <div className="settings-list">
              <div className="setting-item">
                <span>Email Notifications</span>
                <div className="toggle active" />
              </div>
              <div className="setting-item">
                <span>Auto-Enrollment</span>
                <div className="toggle" />
              </div>
              <div className="setting-item">
                <span>AI Suggestions</span>
                <div className="toggle active" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;