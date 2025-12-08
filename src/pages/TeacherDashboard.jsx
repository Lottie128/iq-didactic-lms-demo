import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Video, Sparkles, Eye, LogOut, BarChart3, Edit, FileText, Award } from 'lucide-react';
import { demoCourses } from '../data/demoCourses';
import NotificationCenter from '../components/NotificationCenter';
import ThemeToggler from '../components/ThemeToggler';
import './Dashboard.css';

const TeacherDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <div className="logo-mark glass-strong">IQ</div>
          <div className="header-title">
            <h2>IQ Didactic</h2>
            <p>Teacher Portal</p>
          </div>
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={() => navigate('/ai-teacher')}>
            <Sparkles size={16} />
            <span>AI Assistant</span>
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
            <h1>Good evening, {user.name.split(' ')[0]}!</h1>
            <p>Manage your courses and track student progress.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card glass">
              <Users size={20} />
              <div>
                <p className="stat-value">2,130</p>
                <p className="stat-label">Total Students</p>
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
              <FileText size={20} />
              <div>
                <p className="stat-value">8</p>
                <p className="stat-label">Quizzes</p>
              </div>
            </div>
            <div className="stat-card glass">
              <BarChart3 size={20} />
              <div>
                <p className="stat-value">87%</p>
                <p className="stat-label">Avg Completion</p>
              </div>
            </div>
          </div>
        </section>

        <section className="quick-actions glass-strong">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-card glass" onClick={() => navigate('/create-course')}>
              <BookOpen size={24} />
              <span>Create Course</span>
            </button>
            <button className="action-card glass" onClick={() => navigate('/create-quiz')}>
              <Award size={24} />
              <span>Create Quiz</span>
            </button>
            <button className="action-card glass" onClick={() => navigate('/ai-teacher')}>
              <Sparkles size={24} />
              <span>AI Assistant</span>
            </button>
          </div>
        </section>

        <section className="courses-section">
          <div className="section-header">
            <h2>Your Courses</h2>
          </div>
          <div className="courses-grid">
            {demoCourses.map(course => (
              <div key={course.id} className="course-card glass scale-in">
                <div className="course-header">
                  <div className="course-category">{course.category}</div>
                  <div className="course-badge">{course.students} students</div>
                </div>
                <h3>{course.title}</h3>
                <p className="course-desc">{course.description}</p>
                <div className="course-meta">
                  <span><Video size={14} /> {course.videos.length} videos</span>
                  <span><Users size={14} /> {course.students}</span>
                  <span><FileText size={14} /> 2 quizzes</span>
                </div>
                <div className="course-footer">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <button className="btn btn-secondary" onClick={() => navigate(`/edit-course/${course.id}`)}>
                    <Edit size={14} />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ai-section glass-strong">
          <div className="ai-content">
            <Sparkles size={32} />
            <h3>Need help creating lesson plans or quizzes?</h3>
            <p>Use our AI Teacher assistant to generate course outlines, quiz questions, and learning materials.</p>
            <button className="btn btn-primary" onClick={() => navigate('/ai-teacher')}>
              Launch AI Assistant
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TeacherDashboard;