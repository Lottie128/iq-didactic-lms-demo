import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Sparkles, TrendingUp, Settings, LogOut, Shield, BarChart3, UserCog, Globe, Award } from 'lucide-react';
import { courseAPI, adminAPI } from '../services/api';
import './Dashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeUsers: 0
  });
  const [courses, setCourses] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all users (admin endpoint)
      const usersResponse = await adminAPI.getAllUsers({ limit: 100 });
      const users = usersResponse.data || [];

      // Calculate user stats
      const students = users.filter(u => u.role === 'student').length;
      const teachers = users.filter(u => u.role === 'teacher').length;
      const admins = users.filter(u => u.role === 'admin').length;

      // Fetch all courses
      const coursesResponse = await courseAPI.getCourses();
      const allCourses = coursesResponse.data || [];

      // Calculate total enrollments
      const totalEnrollments = allCourses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);

      setStats({
        totalUsers: users.length,
        totalStudents: students,
        totalTeachers: teachers,
        totalAdmins: admins,
        totalCourses: allCourses.length,
        totalEnrollments,
        activeUsers: users.filter(u => u.lastLogin).length
      });

      setCourses(allCourses.slice(0, 5)); // Top 5 courses
      setRecentUsers(users.slice(0, 5)); // 5 most recent users

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-root">
        <div className="dashboard-bg" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="loader">Loading admin dashboard...</div>
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
                <p className="stat-value">{stats.totalUsers.toLocaleString()}</p>
                <p className="stat-label">Total Users</p>
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
              <Award size={20} />
              <div>
                <p className="stat-value">{stats.totalEnrollments.toLocaleString()}</p>
                <p className="stat-label">Enrollments</p>
              </div>
            </div>
            <div className="stat-card glass" onClick={() => navigate('/admin/analytics')} style={{ cursor: 'pointer' }}>
              <TrendingUp size={20} />
              <div>
                <p className="stat-value">{stats.activeUsers}</p>
                <p className="stat-label">Active Users</p>
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
            <p>Manage student, teacher, and admin accounts across the platform.</p>
            <div className="admin-stats">
              <div className="admin-stat">
                <span className="stat-num">{stats.totalStudents}</span>
                <span className="stat-lbl">Students</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">{stats.totalTeachers}</span>
                <span className="stat-lbl">Teachers</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">{stats.totalAdmins}</span>
                <span className="stat-lbl">Admins</span>
              </div>
            </div>

            {recentUsers.length > 0 && (
              <div className="recent-users" style={{ marginTop: '15px', fontSize: '13px' }}>
                <p style={{ opacity: 0.7, marginBottom: '8px' }}>Recent Users:</p>
                {recentUsers.map(u => (
                  <div key={u.id} style={{ padding: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{u.name}</span>
                    <span style={{ opacity: 0.6 }}>{u.role}</span>
                  </div>
                ))}
              </div>
            )}

            <button className="btn btn-secondary" style={{ marginTop: '15px' }} onClick={(e) => { e.stopPropagation(); navigate('/admin/users'); }}>Manage Users</button>
          </div>

          <div className="admin-card glass-strong scale-in" onClick={() => navigate('/admin/analytics')} style={{ cursor: 'pointer' }}>
            <div className="admin-card-header">
              <BarChart3 size={24} />
              <h3>Analytics & Insights</h3>
            </div>
            <p>View platform analytics, user engagement, and performance metrics.</p>
            <div className="admin-stats">
              <div className="admin-stat">
                <span className="stat-num">{stats.totalUsers}</span>
                <span className="stat-lbl">Total Users</span>
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
            <button className="btn btn-secondary" style={{ marginTop: '15px' }} onClick={(e) => { e.stopPropagation(); navigate('/admin/analytics'); }}>View Analytics</button>
          </div>

          <div className="admin-card glass-strong scale-in">
            <div className="admin-card-header">
              <BookOpen size={24} />
              <h3>Course Management</h3>
            </div>
            <p>Manage and approve platform courses.</p>
            <div className="course-list" style={{ marginTop: '15px' }}>
              {courses.length > 0 ? (
                courses.map(course => (
                  <div key={course.id} className="course-item">
                    <div>
                      <p className="course-item-title">{course.title}</p>
                      <p className="course-item-meta">{course.enrollmentCount || 0} students</p>
                    </div>
                    <button className="btn-icon" onClick={() => navigate(`/edit-course/${course.id}`)}>→</button>
                  </div>
                ))
              ) : (
                <p style={{ opacity: 0.6, padding: '20px 0' }}>No courses available yet</p>
              )}
            </div>
            <button className="btn btn-secondary" style={{ marginTop: '15px' }} onClick={() => navigate('/create-course')}>Create New Course</button>
          </div>

          <div className="admin-card glass-strong scale-in">
            <div className="admin-card-header">
              <Sparkles size={24} />
              <h3>Teacher Management</h3>
            </div>
            <p>Manage teacher accounts, approvals, and course creation permissions.</p>
            <div className="admin-stats">
              <div className="admin-stat">
                <span className="stat-num">{stats.totalTeachers}</span>
                <span className="stat-lbl">Active</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">{courses.length}</span>
                <span className="stat-lbl">Courses</span>
              </div>
              <div className="admin-stat">
                <span className="stat-num">{stats.totalEnrollments}</span>
                <span className="stat-lbl">Students</span>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ marginTop: '15px' }} onClick={() => navigate('/admin/users?role=teacher')}>Manage Teachers</button>
          </div>

          <div className="admin-card glass-strong scale-in full-width">
            <div className="admin-card-header">
              <Globe size={24} />
              <h3>System Health</h3>
            </div>
            <p>Platform status and real-time metrics.</p>
            <div className="country-preview">
              <div className="country-flag">✅ API Server - Online</div>
              <div className="country-flag">✅ Database - Connected</div>
              <div className="country-flag">✅ User Auth - Active</div>
              <div className="country-flag">✅ Course System - Running</div>
            </div>
            <button className="btn btn-secondary" style={{ marginTop: '15px' }} onClick={() => navigate('/admin/analytics')}>View Full Report</button>
          </div>

          <div className="admin-card glass-strong scale-in">
            <div className="admin-card-header">
              <Settings size={24} />
              <h3>Quick Actions</h3>
            </div>
            <p>Common administrative tasks.</p>
            <div className="settings-list">
              <button className="btn btn-secondary" style={{ width: '100%', marginBottom: '10px' }} onClick={() => navigate('/create-course')}>
                Create Course
              </button>
              <button className="btn btn-secondary" style={{ width: '100%', marginBottom: '10px' }} onClick={() => navigate('/admin/users')}>
                Add User
              </button>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => window.location.reload()}>
                Refresh Data
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;