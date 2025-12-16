import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Video, Sparkles, Eye, LogOut, BarChart3, Edit, FileText, Award, UserCog } from 'lucide-react';
import { courseAPI } from '../services/api';
import NotificationCenter from '../components/NotificationCenter';
import ThemeToggler from '../components/ThemeToggler';
import './Dashboard.css';

const TeacherDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    avgCompletion: 0
  });

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = async () => {
    try {
      setLoading(true);

      // Fetch teacher's courses
      const coursesResponse = await courseAPI.getMyCourses();
      const teacherCourses = coursesResponse.data || [];

      // Calculate stats
      const totalEnrollments = teacherCourses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
      
      setStats({
        totalStudents: totalEnrollments,
        totalCourses: teacherCourses.length,
        totalEnrollments: totalEnrollments,
        avgCompletion: 87 // TODO: Calculate from actual data
      });

      setCourses(teacherCourses);

    } catch (error) {
      console.error('Error loading teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="dashboard-root">
        <div className="dashboard-bg" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="loader">Loading teacher dashboard...</div>
        </div>
      </div>
    );
  }

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
            <h1>{getGreeting()}, {user.name.split(' ')[0]}!</h1>
            <p>Manage your courses and track student progress.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card glass">
              <Users size={20} />
              <div>
                <p className="stat-value">{stats.totalStudents}</p>
                <p className="stat-label">Total Students</p>
              </div>
            </div>
            <div className="stat-card glass">
              <BookOpen size={20} />
              <div>
                <p className="stat-value">{stats.totalCourses}</p>
                <p className="stat-label">Active Courses</p>
              </div>
            </div>
            <div className="stat-card glass">
              <FileText size={20} />
              <div>
                <p className="stat-value">{stats.totalEnrollments}</p>
                <p className="stat-label">Enrollments</p>
              </div>
            </div>
            <div className="stat-card glass">
              <BarChart3 size={20} />
              <div>
                <p className="stat-value">{stats.avgCompletion}%</p>
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
            <button className="action-card glass" onClick={() => navigate('/teacher/students')}>
              <UserCog size={24} />
              <span>Manage Students</span>
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
            <button className="btn btn-primary" onClick={() => navigate('/create-course')}>
              <BookOpen size={16} />
              Create New Course
            </button>
          </div>

          {courses.length === 0 ? (
            <div className="empty-state glass-strong">
              <BookOpen size={48} style={{ opacity: 0.3 }} />
              <h3>No courses yet</h3>
              <p>Create your first course to start teaching!</p>
              <button className="btn btn-primary" onClick={() => navigate('/create-course')}>
                Create Course
              </button>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map(course => (
                <div key={course.id} className="course-card glass scale-in">
                  <div className="course-header">
                    <div className="course-category">{course.category}</div>
                    <div className="course-badge">{course.enrollmentCount || 0} students</div>
                  </div>
                  {course.thumbnail && (
                    <div className="course-thumbnail">
                      <img src={course.thumbnail} alt={course.title} />
                    </div>
                  )}
                  <h3>{course.title}</h3>
                  <p className="course-desc">{course.description?.substring(0, 100)}...</p>
                  <div className="course-meta">
                    <span><Video size={14} /> {course.videos?.length || 0} videos</span>
                    <span><Users size={14} /> {course.enrollmentCount || 0}</span>
                    <span><BarChart3 size={14} /> {course.level}</span>
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
          )}
        </section>

        <section className="admin-grid">
          <div className="admin-card glass-strong scale-in" onClick={() => navigate('/teacher/students')} style={{ cursor: 'pointer' }}>
            <div className="admin-card-header">
              <UserCog size={24} />
              <h3>Student Management</h3>
            </div>
            <p>View and manage students enrolled in your courses. Track progress and performance.</p>
            <div className="admin-stats">
              <div className="admin-stat">
                <span className="stat-num">{stats.totalStudents}</span>
                <span className="stat-lbl">Students</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">{stats.totalCourses}</span>
                <span className="stat-lbl">Courses</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">{stats.totalEnrollments}</span>
                <span className="stat-lbl">Enrollments</span>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ marginTop: '15px' }} onClick={(e) => { e.stopPropagation(); navigate('/teacher/students'); }}>
              Manage Students
            </button>
          </div>

          <div className="admin-card glass-strong scale-in">
            <div className="admin-card-header">
              <BarChart3 size={24} />
              <h3>Course Analytics</h3>
            </div>
            <p>View detailed analytics for your courses, including completion rates and student engagement.</p>
            <div className="admin-stats">
              <div className="admin-stat">
                <span className="stat-num">{stats.avgCompletion}%</span>
                <span className="stat-lbl">Completion</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">4.8</span>
                <span className="stat-lbl">Avg Rating</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">{stats.totalEnrollments}</span>
                <span className="stat-lbl">Total Views</span>
              </div>
            </div>
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