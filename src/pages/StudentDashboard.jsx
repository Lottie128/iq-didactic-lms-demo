import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Play, Sparkles, LogOut, Trophy, FileText, Flame, Bookmark, Calendar } from 'lucide-react';
import { demoCourses } from '../data/demoCourses';
import NotificationCenter from '../components/NotificationCenter';
import ThemeToggler from '../components/ThemeToggler';
import './Dashboard.css';

const StudentDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <div className="logo-mark glass-strong">IQ</div>
          <div className="header-title">
            <h2>IQ Didactic</h2>
            <p>Student Portal</p>
          </div>
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={() => navigate('/ai-teacher')}>
            <Sparkles size={16} />
            <span>AI Teacher</span>
          </button>
          <ThemeToggler />
          <NotificationCenter />
          <div className="user-menu glass" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            <div className="user-avatar">{user.name.charAt(0)}</div>
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
            <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
            <p>Continue your learning journey where you left off.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card glass" onClick={() => navigate('/progress')} style={{ cursor: 'pointer' }}>
              <BookOpen size={20} />
              <div>
                <p className="stat-value">2</p>
                <p className="stat-label">Active Courses</p>
              </div>
            </div>
            <div className="stat-card glass" onClick={() => navigate('/certificates')} style={{ cursor: 'pointer' }}>
              <Award size={20} />
              <div>
                <p className="stat-value">3</p>
                <p className="stat-label">Certificates</p>
              </div>
            </div>
            <div className="stat-card glass" onClick={() => navigate('/achievements')} style={{ cursor: 'pointer' }}>
              <Trophy size={20} />
              <div>
                <p className="stat-value">6/12</p>
                <p className="stat-label">Badges</p>
              </div>
            </div>
            <div className="stat-card glass highlight">
              <Flame size={20} />
              <div>
                <p className="stat-value">7 Days</p>
                <p className="stat-label">Streak 🔥</p>
              </div>
            </div>
          </div>
        </section>

        <section className="quick-actions glass-strong">
          <h3>Quick Links</h3>
          <div className="actions-grid">
            <button className="action-card glass" onClick={() => navigate('/progress')}>
              <TrendingUp size={24} />
              <span>My Progress</span>
            </button>
            <button className="action-card glass" onClick={() => navigate('/certificates')}>
              <Award size={24} />
              <span>Certificates</span>
            </button>
            <button className="action-card glass" onClick={() => navigate('/achievements')}>
              <Trophy size={24} />
              <span>Achievements</span>
            </button>
            <button className="action-card glass" onClick={() => navigate('/wishlist')}>
              <Bookmark size={24} />
              <span>Wishlist</span>
            </button>
            <button className="action-card glass" onClick={() => navigate('/schedule')}>
              <Calendar size={24} />
              <span>Schedule</span>
            </button>
            <button className="action-card glass" onClick={() => navigate('/ai-teacher')}>
              <Sparkles size={24} />
              <span>AI Teacher</span>
            </button>
          </div>
        </section>

        <section className="continue-section">
          <h2>Continue Learning</h2>
          {demoCourses.filter(c => c.progress > 0).map(course => (
            <div key={course.id} className="continue-card glass-strong slide-in">
              <div className="continue-info">
                <h3>{course.title}</h3>
                <p>{course.instructor} • {course.level}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                </div>
                <p className="progress-text">{course.progress}% complete</p>
              </div>
              <button className="btn btn-primary" onClick={() => navigate(`/course/${course.id}`)}>
                <Play size={16} />
                Continue
              </button>
            </div>
          ))}
        </section>

        <section className="courses-section">
          <h2>All Courses</h2>
          <div className="courses-grid">
            {demoCourses.map(course => (
              <div key={course.id} className="course-card glass scale-in">
                <div className="course-header">
                  <div className="course-category">{course.category}</div>
                  <div className="course-level">{course.level}</div>
                </div>
                <h3>{course.title}</h3>
                <p className="course-desc">{course.description}</p>
                <div className="course-meta">
                  <span><BookOpen size={14} /> {course.videos.length} lessons</span>
                  <span><Clock size={14} /> {course.duration}</span>
                  <span><FileText size={14} /> 2 quizzes</span>
                </div>
                <div className="course-footer">
                  <p className="course-instructor">{course.instructor}</p>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    {course.progress > 0 ? 'Continue' : 'Start'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;